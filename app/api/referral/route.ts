import { createAuditLog } from '@/lib/audit/log';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { requireActiveStudent } from '@/lib/rbac';
import { helpNowSchema } from '@/lib/validations/chat';

export async function POST(req: Request) {
  try {
    const session = await requireActiveStudent();
    const userId = session.user.id;
    
    const body = await req.json();
    const parsed = helpNowSchema.parse(body);
    
    const referral = await prisma.referral.create({
      data: {
        studentId: userId,
        reason: parsed.reason,
        source: 'DIRECT_REQUEST',
        evidence: parsed.context ? { context: parsed.context } : {},
        status: 'PENDING',
    }
    });
    
    await createAuditLog({
        actorId: userId,
        eventType: 'DATA_ACCESS',
        targetId: referral.id,
        targetType: 'Referral',
        details: { action: '' }
    });
    
    return NextResponse.json({ referralId: referral.id });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    }
    if (error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error.name === 'ForbiddenError' || error.name === 'ConsentRequiredError') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
