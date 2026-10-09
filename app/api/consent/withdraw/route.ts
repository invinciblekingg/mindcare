import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionOrThrow, AuthError } from '@/lib/rbac';
import { z } from 'zod';
import { ConsentType } from '@prisma/client';
import { createAuditLog } from '@/lib/audit/log';

const withdrawConsentSchema = z.object({
  type: z.nativeEnum(ConsentType),
    });

export async function POST(req: Request) {
  try {
    const session = await getSessionOrThrow();
    const body = await req.json();
    const { type } = withdrawConsentSchema.parse(body);

    const latestConsent = await prisma.consentRecord.findFirst({
      where: {
        userId: session.user.id,
        type,
        status: 'GRANTED',
      },
      orderBy: { timestamp: 'desc'   }
    });

    if (!latestConsent) {
      return NextResponse.json({ error: 'Consent not found or already revoked' }, { status: 404 });
    }

    const revokedConsent = await prisma.consentRecord.update({
      where: { id: latestConsent.id },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
    }
    });

    await createAuditLog({
      actorId: session.user.id,
      eventType: 'CONSENT_CHANGE',
      targetId: revokedConsent.id,
      targetType: 'ConsentRecord',
      details: { action: 'WITHDRAW', type   }
    });

    if (session.user.role === 'STUDENT') {
      const requiredConsents = [
        ConsentType.PARENTAL_CONSENT,
        ConsentType.CHILD_ASSENT,
        ConsentType.AI_DISCLOSURE,
        ConsentType.PRIVACY_POLICY,
      ];

      if ((requiredConsents as ConsentType[]).includes(type)) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { status: 'PENDING_CONSENT'   }
    });
      }
    }

    return NextResponse.json({ consent: revokedConsent });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
