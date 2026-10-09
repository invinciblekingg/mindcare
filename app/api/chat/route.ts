import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { evaluateInputSafety, evaluateOutputSafety } from '@/lib/safety/pipeline';
import { buildSystemPrompt } from '@/lib/llm/service';
import { generateBufferedCompletion } from '@/lib/llm/provider';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    const body = await req.json();
    const userContent = body.content;
    
    if (!userContent || typeof userContent !== 'string') {
      return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
    }

    let conversation = await prisma.chatConversation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: { userId, retentionStatus: 'RETAINED' }
      });
    }
    const conversationId = conversation.id;

    const dbMessages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'desc' },
      take: 5
    });
    dbMessages.reverse();

    const recentContext = dbMessages.map(m => ({
      role: m.role === 'USER' ? 'user' : m.role === 'AI' ? 'assistant' : 'system',
      content: m.content
    }));

    const inputSafety = evaluateInputSafety(userContent, recentContext);

    const userMessage = await prisma.chatMessage.create({
      data: { conversationId, role: 'USER', content: userContent }
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        function sendEvent(event: string, data: any) {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        }

        sendEvent('status', { message: 'Thinking...' });

        if (inputSafety.action === 'CRISIS_INTERCEPTED' || inputSafety.action === 'REFERRED') {
          const prevLog = await prisma.auditLog.findFirst({ orderBy: { timestamp: 'desc' } });
          const prevHash = prevLog?.previousHash ? crypto.createHash('sha256').update(JSON.stringify(prevLog)).digest('hex') : "initial-hash";

          await prisma.auditLog.create({
            data: { actorId: userId, eventType: 'SAFETY_OVERRIDE', targetId: userMessage.id, targetType: 'ChatMessage', details: inputSafety, previousHash: prevHash }
          });
          
          const safetyEvent = await prisma.safetyEvent.create({
            data: {
              messageId: userMessage.id, userId, conversationId,
              category: inputSafety.category, confidence: inputSafety.confidence,
              signals: inputSafety.signals, rationale: inputSafety.rationale, action: inputSafety.action,
              policyVersion: 'safety-policy-v1.0.0', modelVersion: 'safety-classifier-v1',
              rawInputHash: crypto.createHash('sha256').update(userContent).digest('hex'), previousEventHash: prevHash
            }
          });

          sendEvent('safety', { action: inputSafety.action, rationale: inputSafety.rationale });
          sendEvent('done', { conversationId, userMessageId: userMessage.id, aiMessageId: null, safetyEventId: safetyEvent.id });
          controller.close();
          return;
        }

        const { systemPrompt, policyVersion, modelVersion } = await buildSystemPrompt(userId);
        
        const llmMessages = recentContext.map(m => ({
          role: m.role as any,
          content: m.content
        }));
        llmMessages.push({ role: 'user', content: userContent });

        const llmResult = await generateBufferedCompletion({
          messages: llmMessages, systemPrompt, userId, conversationId
        });

        const outputSafety = evaluateOutputSafety(llmResult.fullText);
        
        let finalOutput = llmResult.fullText;
        if (!outputSafety.safe) {
           finalOutput = "I'm sorry, I cannot provide that response. Let me know how else I can support you.";
        }

        const aiMessage = await prisma.chatMessage.create({
          data: { conversationId, role: 'AI', content: finalOutput }
        });

        const prevLog2 = await prisma.auditLog.findFirst({ orderBy: { timestamp: 'desc' } });
        const prevHash2 = prevLog2 ? crypto.createHash('sha256').update(JSON.stringify(prevLog2)).digest('hex') : "initial-hash";
        
        await prisma.auditLog.create({
           data: { actorId: userId, eventType: 'DATA_ACCESS', targetId: aiMessage.id, targetType: 'ChatMessage', details: { safe: outputSafety.safe }, previousHash: prevHash2 }
        });

        const safetyEvent = await prisma.safetyEvent.create({
            data: {
              messageId: aiMessage.id, userId, conversationId,
              category: inputSafety.category, confidence: inputSafety.confidence,
              signals: inputSafety.signals, rationale: inputSafety.rationale, action: inputSafety.action,
              policyVersion: policyVersion, modelVersion: llmResult.modelVersion,
              rawInputHash: crypto.createHash('sha256').update(userContent).digest('hex'),
              outputHash: crypto.createHash('sha256').update(finalOutput).digest('hex'),
              previousEventHash: prevHash2
            }
          });

        sendEvent('delta', { content: finalOutput });
        sendEvent('done', {
          conversationId, userMessageId: userMessage.id, aiMessageId: aiMessage.id, safetyEventId: safetyEvent.id
        });
        controller.close();
      }
    });

    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' } });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
