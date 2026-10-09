import { createAuditLog } from '@/lib/audit/log';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireActiveStudent, AuthError, ForbiddenError, ConsentRequiredError } from '@/lib/rbac';
import { checkInSchema } from '@/lib/validations/student';
import { z } from 'zod';
import { AuditEventType } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await requireActiveStudent();

    const checkIns = await prisma.moodCheckIn.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json({ checkIns });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof ForbiddenError || error instanceof ConsentRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('[CHECKIN_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireActiveStudent();
    const body = await req.json();

    const validatedData = checkInSchema.parse(body);

    const newCheckIn = await prisma.moodCheckIn.create({
      data: {
        userId: session.user.id,
        ...validatedData,
    }
    });

    await createAuditLog({
        actorId: session.user.id,
        eventType: AuditEventType.DATA_ACCESS,
        targetId: newCheckIn.id,
        targetType: 'MoodCheckIn',
        details: { action: '' }
    });

    return NextResponse.json({ checkIn: newCheckIn });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', issues: error.issues }, { status: 400 });
    }
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof ForbiddenError || error instanceof ConsentRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('[CHECKIN_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
