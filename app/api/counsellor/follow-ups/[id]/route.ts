import { createAuditLog } from '@/lib/audit/log';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, requireCaseAccess, AuthError, ForbiddenError } from '@/lib/rbac';
import { completeFollowUpSchema } from '@/lib/validations/counsellor';
import { z } from 'zod';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(['COUNSELLOR']);
    const { id } = params;

    const followUp = await prisma.followUp.findUnique({
      where: { id }
    });

    if (!followUp) return NextResponse.json({ error: 'FollowUp not found' }, { status: 404 });

    await requireCaseAccess(followUp.caseId);

    const body = await req.json();
    const data = completeFollowUpSchema.parse(body);

    const updatedFollowUp = await prisma.followUp.update({
      where: { id },
      data: {
        completionStatus: data.completionStatus,
        notes: data.notes
      }
    });

    await createAuditLog({
        actorId: session.user.id,
        eventType: 'DATA_ACCESS',
        targetId: id,
        targetType: 'FollowUp',
        details: { action: 'UPDATE_FOLLOW_UP', caseId: followUp.caseId, status: data.completionStatus   }
    });

    return NextResponse.json(updatedFollowUp);
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
