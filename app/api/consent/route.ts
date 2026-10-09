import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionOrThrow, AuthError, ForbiddenError, ConsentRequiredError } from '@/lib/rbac';
import { consentSchema } from '@/lib/validations/student';
import { z } from 'zod';
import { ConsentType } from '@prisma/client';
import { createAuditLog } from '@/lib/audit/log';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionOrThrow();

    const consents = await prisma.consentRecord.findMany({
      where: {
        userId: session.user.id,
        status: 'GRANTED',
    }
    });

    return NextResponse.json({ consents });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('[CONSENT_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionOrThrow();
    const body = await req.json();

    const validatedData = consentSchema.parse(body);

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const newConsent = await prisma.consentRecord.create({
      data: {
        userId: session.user.id,
        type: validatedData.type,
        version: validatedData.version,
        status: 'GRANTED',
        ipAddress,
        userAgent,
    }
    });

    await createAuditLog({
      actorId: session.user.id,
      eventType: 'CONSENT_CHANGE',
      targetId: newConsent.id,
      targetType: 'ConsentRecord',
      details: { action: 'GRANT', type: validatedData.type   }
    });

    if (session.user.role === 'STUDENT') {
      const activeConsents = await prisma.consentRecord.findMany({
        where: {
          userId: session.user.id,
          status: 'GRANTED',
        },
        select: { type: true   }
    });

      const grantedTypes = new Set(activeConsents.map((c) => c.type));

      const requiredConsents = [
        ConsentType.CHILD_ASSENT,
        ConsentType.AI_DISCLOSURE,
        ConsentType.PRIVACY_POLICY,
        ConsentType.PARENTAL_CONSENT,
      ];

      const hasAllRequired = requiredConsents.every((type) => grantedTypes.has(type));

      if (hasAllRequired && session.user.status !== 'ACTIVE') {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { status: 'ACTIVE'   }
    });
      }
    }

    return NextResponse.json({ consent: newConsent });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', issues: error.issues }, { status: 400 });
    }
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('[CONSENT_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
