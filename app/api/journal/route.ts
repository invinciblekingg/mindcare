import { createAuditLog } from '@/lib/audit/log';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireActiveStudent, AuthError, ForbiddenError, ConsentRequiredError } from '@/lib/rbac';
import { journalSchema } from '@/lib/validations/student';
import { z } from 'zod';
import { AuditEventType } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await requireActiveStudent();

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json({ entries });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof ForbiddenError || error instanceof ConsentRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('[JOURNAL_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireActiveStudent();
    const body = await req.json();

    const validatedData = journalSchema.parse(body);

    const newEntry = await prisma.journalEntry.create({
      data: {
        userId: session.user.id,
        ...validatedData,
    }
    });

    await createAuditLog({
        actorId: session.user.id,
        eventType: AuditEventType.DATA_ACCESS,
        targetId: newEntry.id,
        targetType: 'JournalEntry',
        details: { action: '' }
    });

    return NextResponse.json({ entry: newEntry });
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
    console.error('[JOURNAL_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

