import { z } from 'zod';
import prisma from '../prisma';
import { AuditEventType, Prisma } from '@prisma/client';
import { generateAuditHash } from './hash';

export const auditLogCreateSchema = z.object({
  actorId: z.string(),
  eventType: z.nativeEnum(AuditEventType),
  targetId: z.string(),
  targetType: z.string(),
  details: z.record(z.string(), z.unknown()).default({}),
});

export type AuditLogCreateInput = z.infer<typeof auditLogCreateSchema>;

export async function createAuditLog(input: AuditLogCreateInput) {
  const validatedData = auditLogCreateSchema.parse(input);

  return await prisma.$transaction(async (tx) => {
    const latestLog = await tx.auditLog.findFirst({
      orderBy: [
        { timestamp: 'desc' },
        { id: 'desc' },
      ],
    });

    let newPreviousHash: string | null = null;
    if (latestLog) {
      const latestPayload = {
        actorId: latestLog.actorId,
        eventType: latestLog.eventType,
        targetId: latestLog.targetId,
        targetType: latestLog.targetType,
        details: latestLog.details as Record<string, unknown>,
      };
      newPreviousHash = generateAuditHash(latestPayload, latestLog.previousHash);
    }

    const auditLog = await tx.auditLog.create({
      data: {
        actorId: validatedData.actorId,
        eventType: validatedData.eventType,
        targetId: validatedData.targetId,
        targetType: validatedData.targetType,
        details: validatedData.details as Prisma.InputJsonValue,
        previousHash: newPreviousHash,
      },
    });

    return auditLog;
  });
}
