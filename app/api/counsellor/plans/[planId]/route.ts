import { createAuditLog } from '@/lib/audit/log';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireCaseAccess, requireRole, AuthError, ForbiddenError } from '@/lib/rbac';
import { updatePlanSchema } from '@/lib/validations/counsellor';
import { z } from 'zod';

export async function GET(req: Request, { params }: { params: { planId: string } }) {
  try {
    const { planId } = params;

    // Fetch the plan first to get caseId, then verify access.
    // We do a lightweight findUnique (no sensitive data selected yet) to get caseId for the auth check.
    const planMeta = await prisma.interventionPlan.findUnique({
      where: { id: planId },
      select: { id: true, caseId: true   }
    });

    if (!planMeta) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    // Auth check — throws ForbiddenError if the counsellor is not assigned to this case
    await requireCaseAccess(planMeta.caseId);

    // Now safe to fetch full plan
    const plan = await prisma.interventionPlan.findUnique({
      where: { id: planId   }
    });

    return NextResponse.json(plan);
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof AuthError ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { planId: string } }) {
  try {
    const session = await requireRole(['COUNSELLOR']);
    const { planId } = params;

    const plan = await prisma.interventionPlan.findUnique({
      where: { id: planId }
    });
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    await requireCaseAccess(plan.caseId);

    if (plan.status !== 'DRAFT') {
      return NextResponse.json({ error: 'Can only update DRAFT plans' }, { status: 400 });
    }

    const body = await req.json();
    const data = updatePlanSchema.parse(body);

    const updatedPlan = await prisma.interventionPlan.update({
      where: { id: planId },
      data: {
        goals: data.goals !== undefined ? data.goals : undefined,
        responseStyle: data.responseStyle,
        copingStrategies: data.copingStrategies !== undefined ? data.copingStrategies : undefined,
        topicsRequiringCare: data.topicsRequiringCare,
        referralInstructions: data.referralInstructions,
        reviewSchedule: data.reviewSchedule,
    }
    });

    await createAuditLog({
        actorId: session.user.id,
        eventType: 'DATA_ACCESS',
        targetId: planId,
        targetType: 'InterventionPlan',
        details: { action: 'UPDATE_PLAN', caseId: plan.caseId   }
    });

    return NextResponse.json(updatedPlan);
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

export async function POST(req: Request, { params }: { params: { planId: string } }) {
  try {
    const session = await requireRole(['COUNSELLOR']);
    const { planId } = params;

    const plan = await prisma.interventionPlan.findUnique({
      where: { id: planId }
    });
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    await requireCaseAccess(plan.caseId);

    if (plan.status !== 'DRAFT') {
      return NextResponse.json({ error: 'Can only submit DRAFT plans' }, { status: 400 });
    }

    const updatedPlan = await prisma.interventionPlan.update({
      where: { id: planId },
      data: { status: 'PENDING_APPROVAL' }
    });

    await createAuditLog({
        actorId: session.user.id,
        eventType: 'DATA_ACCESS',
        targetId: planId,
        targetType: 'InterventionPlan',
        details: { action: 'SUBMIT_PLAN_FOR_APPROVAL', caseId: plan.caseId   }
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof AuthError ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

