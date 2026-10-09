import prisma from '@/lib/prisma';
import { llmEnv } from './env';

export async function buildSystemPrompt(userId: string) {
  const activePlan = await prisma.interventionPlan.findFirst({
    where: {
      case: {
        referral: {
          studentId: userId,
        },
      },
      status: 'ACTIVE',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const coreDirective = "You are MindCareAI, a wellness companion. You are not a doctor, therapist, or crisis service. Never diagnose. Never provide medical instructions. Never validate self-harm, suicide, eating-disorder behaviors, or hopelessness. If the user may be in danger, encourage immediate human support.";
  const formattingDirective = "You must respond in plain text only. Do not use markdown formatting, headers, bullet points, or numbered lists unless the user explicitly asks. Keep responses concise, warm, and conversational, typically two to four sentences. Never diagnose. Never prescribe. Never claim to be a doctor or therapist.";
  
  const fullDirective = `${coreDirective}\n\n${formattingDirective}`;
  
  let systemPrompt = `You are a helpful wellness companion.\n\n${fullDirective}`;
  
  if (activePlan) {
    systemPrompt = `
Goals: ${JSON.stringify(activePlan.goals)}
Response Style: ${activePlan.responseStyle}
Coping Strategies: ${JSON.stringify(activePlan.copingStrategies)}
Topics Requiring Care: ${activePlan.topicsRequiringCare}
Referral Instructions: ${activePlan.referralInstructions}
Review Schedule: ${activePlan.reviewSchedule}

${fullDirective}
`.trim();
  }

  return {
    systemPrompt,
    policyVersion: llmEnv.SAFETY_POLICY_VERSION,
    modelVersion: llmEnv.LLM_PROVIDER === 'mock' ? 'mock-wellness-v1' : llmEnv.OPENAI_MODEL,
  };
}
