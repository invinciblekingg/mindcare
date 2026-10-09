import { createAuditLog } from '@/lib/audit/log';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireCaseAccess, AuthError, ForbiddenError } from '@/lib/rbac';
import { createPlanSchema } from '@/lib/validations/counsellor';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createPlanSchema.parse(body);
    const session = await requireCaseAccess(data.caseId);

    const plan = await prisma.interventionPlan.create({
      data: {
        caseId: data.caseId,
        goals: data.goals,
        responseStyle: data.responseStyle,
        copingStrategies: data.copingStrategies,
        topicsRequiringCare: data.topicsRequiringCare,
        referralInstructions: data.referralInstructions,
        reviewSchedule: data.reviewSchedule,
        version: 1,
        status: 'DRAFT',
    }
    });

    await createAuditLog({
        actorId: session.user.id,
        eventType: 'DATA_ACCESS', // Or SAFETY_OVERRIDE depending on context
        targetId: plan.id,
        targetType: 'InterventionPlan',
        details: { action: 'CREATE_PLAN', caseId: data.caseId   }
    });

    return NextResponse.json(plan);
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
