import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, AuthError, ForbiddenError } from '@/lib/rbac';
import { generateAuditHash } from '@/lib/audit/hash';

export async function GET(req: Request) {
  try {
    await requireRole(['ADMIN']);
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const logs = await prisma.auditLog.findMany({
      take: limit,
      skip: offset,
      orderBy: [
        { timestamp: 'desc' },
        { id: 'desc' },
      ],
    });

    let hashChainValid = true;

    // Verify hash chain backwards. logs are in desc order.
    // So logs[0] is the newest, logs[1] is the older.
    // logs[0].previousHash should be hash(logs[1])
    for (let i = 0; i < logs.length - 1; i++) {
      const currentLog = logs[i];
      const olderLog = logs[i + 1];

      const olderLogPayload = {
        actorId: olderLog.actorId,
        eventType: olderLog.eventType,
        targetId: olderLog.targetId,
        targetType: olderLog.targetType,
        details: olderLog.details as Record<string, unknown>,
      };

      const expectedPreviousHash = generateAuditHash(olderLogPayload, olderLog.previousHash);

      if (currentLog.previousHash !== expectedPreviousHash) {
        hashChainValid = false;
        break;
      }
    }

    // Sanitize logs
    const sanitizedLogs = logs.map(log => {
      const { details, ...rest } = log;
      const safeDetails = details as Record<string, unknown>;
      // Redact sensitive content if present
      if (safeDetails?.content) {
        safeDetails.content = '[REDACTED]';
      }
      return { ...rest, details: safeDetails };
    });

    return NextResponse.json({
      logs: sanitizedLogs,
      hashChainValid,
      count: logs.length,
    });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
