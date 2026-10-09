import { createAuditLog } from '@/lib/audit/log';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, requireCaseAccess, AuthError, ForbiddenError } from '@/lib/rbac';
import { createFollowUpSchema } from '@/lib/validations/counsellor';
import { z } from 'zod';

export async function GET() {
  try {
    const session = await requireRole(['COUNSELLOR']);

    const followUps = await prisma.followUp.findMany({
      where: {
        counsellorId: session.user.id
      }
    });

    return NextResponse.json(followUps);
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof AuthError ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireRole(['COUNSELLOR']);
    const body = await req.json();
    const data = createFollowUpSchema.parse(body);

    await requireCaseAccess(data.caseId);

    const followUp = await prisma.followUp.create({
      data: {
        caseId: data.caseId,
        counsellorId: session.user.id,
        dueDate: new Date(data.dueDate),
        completionStatus: 'PENDING',
        notes: data.notes
      }
    });

    await createAuditLog({
        actorId: session.user.id,
        eventType: 'DATA_ACCESS',
        targetId: followUp.id,
        targetType: 'FollowUp',
        details: { action: 'CREATE_FOLLOW_UP', caseId: data.caseId   }
    });

    return NextResponse.json(followUp);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof AuthError ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
