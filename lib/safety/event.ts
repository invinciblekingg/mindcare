import prisma from '@/lib/prisma';
import { SafetyAction } from '@prisma/client';
import crypto from 'crypto';

interface CreateSafetyEventInput {
  userId?: string;
  conversationId?: string;
  messageId: string;
  category: string;
  confidence: number;
  signals: string[];
  rationale: string;
  action: SafetyAction;
  policyVersion: string;
  modelVersion: string;
  rawInputHash: string;
  outputHash?: string;
}

import { generateSafetyHash } from './crypto';

export async function createSafetyEvent(input: CreateSafetyEventInput) {
  return await prisma.$transaction(async (tx) => {
    let previousHash: string | null = null;
    
    if (input.userId) {
      const latestEvent = await tx.safetyEvent.findFirst({
        where: { userId: input.userId },
        orderBy: [
          { timestamp: 'desc' },
          { id: 'desc' },
        ],
      });

      if (latestEvent) {
        const latestPayload = {
          messageId: latestEvent.messageId,
          userId: latestEvent.userId,
          conversationId: latestEvent.conversationId,
          category: latestEvent.category,
          confidence: latestEvent.confidence,
          signals: latestEvent.signals as string[],
          rationale: latestEvent.rationale,
          action: latestEvent.action,
          policyVersion: latestEvent.policyVersion,
          modelVersion: latestEvent.modelVersion,
          rawInputHash: latestEvent.rawInputHash,
          outputHash: latestEvent.outputHash,
        };
        previousHash = generateSafetyHash(latestPayload, latestEvent.previousEventHash);
      }
    }

    const safetyEvent = await tx.safetyEvent.create({
      data: {
        messageId: input.messageId,
        userId: input.userId,
        conversationId: input.conversationId,
        category: input.category,
        confidence: input.confidence,
        signals: input.signals,
        rationale: input.rationale,
        action: input.action,
        policyVersion: input.policyVersion,
        modelVersion: input.modelVersion,
        rawInputHash: input.rawInputHash,
        outputHash: input.outputHash,
        previousEventHash: previousHash,
      },
    });

    return safetyEvent;
  });
}
