import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, AuthError, ForbiddenError } from '@/lib/rbac';
import { approvePlanSchema } from '@/lib/validations/counsellor';
import { z } from 'zod';

export async function POST(req: Request, { params }: { params: { planId: string } }) {
  try {
    const session = await requireRole(['ADMIN']);
    const { planId } = params;

    const body = await req.json();
    const data = approvePlanSchema.parse(body);

    if (data.planId !== planId) {
      return NextResponse.json({ error: 'Plan ID mismatch' }, { status: 400 });
    }

    const plan = await prisma.interventionPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    if (plan.status !== 'PENDING_APPROVAL') {
       return NextResponse.json({ error: 'Plan is not pending approval' }, { status: 400 });
    }

    if (data.action === 'APPROVE') {
      await prisma.$transaction(async (tx) => {
        // Supersede previous active plans for this case
        await tx.interventionPlan.updateMany({
          where: {
            caseId: plan.caseId,
            status: 'ACTIVE'
          },
          data: { status: 'SUPERSEDED' }
        });

        // Activate the new plan
        await tx.interventionPlan.update({
          where: { id: planId },
          data: {
            status: 'ACTIVE',
            approvedById: session.user.id
          }
        });

        await tx.auditLog.create({
          data: {
            actorId: session.user.id,
            eventType: 'SAFETY_OVERRIDE',
            targetId: planId,
            targetType: 'InterventionPlan',
            details: { 
              action: 'PLAN_APPROVED',
              planId: plan.id,
              version: plan.version
            },
    }
    });
      });

      return NextResponse.json({ message: 'Plan approved' });

    } else if (data.action === 'REJECT') {
      await prisma.$transaction(async (tx) => {
        await tx.interventionPlan.update({
          where: { id: planId },
          data: { status: 'DRAFT' }
        });

        await tx.auditLog.create({
          data: {
            actorId: session.user.id,
            eventType: 'SAFETY_OVERRIDE',
            targetId: planId,
            targetType: 'InterventionPlan',
            details: { 
              action: 'PLAN_REJECTED',
              planId: plan.id,
              version: plan.version
            },
    }
    });
      });

      return NextResponse.json({ message: 'Plan rejected' });
    }

    // Fallback — should never be reached given Zod enum validation above
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

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
