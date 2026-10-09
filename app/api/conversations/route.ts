import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireActiveStudent, AuthError, ForbiddenError, ConsentRequiredError } from '@/lib/rbac';

export async function GET() {
  try {
    const session = await requireActiveStudent();
    
    const conversations = await prisma.chatConversation.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { messages: true },
        },
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          select: { timestamp: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedConversations = conversations.map((conv) => ({
      id: conv.id,
      createdAt: conv.createdAt,
      retentionStatus: conv.retentionStatus,
      messageCount: conv._count.messages,
      lastMessageAt: conv.messages[0]?.timestamp || null,
    }));

    return NextResponse.json({ conversations: formattedConversations });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: 401 });
    if (error instanceof ConsentRequiredError || error instanceof ForbiddenError) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await requireActiveStudent();
    
    const conversation = await prisma.chatConversation.create({
      data: {
        userId: session.user.id,
        retentionStatus: 'ACTIVE',
      },
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: 401 });
    if (error instanceof ConsentRequiredError || error instanceof ForbiddenError) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
