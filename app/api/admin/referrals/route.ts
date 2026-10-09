import { createAuditLog } from '@/lib/audit/log';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, AuthError, ForbiddenError } from '@/lib/rbac';
import { assignReferralSchema } from '@/lib/validations/counsellor';
import { z } from 'zod';

export async function GET() {
  try {
    await requireRole(['ADMIN']);
    const referrals = await prisma.referral.findMany({
      where: {
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
          }
        },
        assignedCounsellor: {
          select: {
            id: true,
            name: true,
      }
    }
    }
    });
    return NextResponse.json(referrals);
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof AuthError ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireRole(['ADMIN']);
    const body = await req.json();
    const data = assignReferralSchema.parse(body);

    const referral = await prisma.referral.update({
      where: { id: data.referralId },
      data: {
        status: 'ACCEPTED',
        assignedCounsellorId: data.assignedCounsellorId,
    }
    });

    const counsellorCase = await prisma.counsellorCase.create({
      data: {
        referralId: referral.id,
        status: 'ACTIVE',
        accessScope: {
          canViewReferral: true,
          canViewMoodCheckIns: true,
          canViewGrantedJournals: true,
          canViewSafetyEvents: true,
      }
    }
    });

    await createAuditLog({
        actorId: session.user.id,
        eventType: 'DATA_ACCESS',
        targetId: referral.id,
        targetType: 'Referral',
        details: { 
          action: 'ASSIGN_REFERRAL',
          assignedCounsellorId: data.assignedCounsellorId,
          caseId: counsellorCase.id
          }
    });

    return NextResponse.json({ referral, counsellorCase });
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
