import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionOrThrow, requireActiveStudent, AuthError, ForbiddenError, ConsentRequiredError } from '@/lib/rbac';
import { journalSchema } from '@/lib/validations/student';
import { z } from 'zod';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionOrThrow();
    const { id } = params;

    const entry = await prisma.journalEntry.findUnique({
      where: { id },
      include: {
        shares: {
          where: {
            grantedToId: session.user.id,
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          }
        }
      }
    });

    if (!entry || entry.deletedAt) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const isOwner = entry.userId === session.user.id;
    const isCounsellorOrAdmin = session.user.role === 'COUNSELLOR' || session.user.role === 'ADMIN';
    const hasActiveGrant = entry.shares.length > 0;

    if (!isOwner && !(isCounsellorOrAdmin && hasActiveGrant)) {
      throw new ForbiddenError('You do not have access to this journal entry');
    }

    return NextResponse.json({ entry });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('[JOURNAL_ID_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireActiveStudent();
    const { id } = params;
    const body = await req.json();

    const validatedData = journalSchema.partial().parse(body);

    const entry = await prisma.journalEntry.findUnique({
      where: { id },
    });

    if (!entry || entry.deletedAt) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    if (entry.userId !== session.user.id) {
      throw new ForbiddenError('You can only update your own journal entries');
    }

    const updatedEntry = await prisma.journalEntry.update({
      where: { id },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        moodTag: validatedData.moodTag,
      },
    });

    return NextResponse.json({ entry: updatedEntry });
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
    console.error('[JOURNAL_ID_PATCH]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireActiveStudent();
    const { id } = params;

    const entry = await prisma.journalEntry.findUnique({
      where: { id },
    });

    if (!entry || entry.deletedAt) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    if (entry.userId !== session.user.id) {
      throw new ForbiddenError('You can only delete your own journal entries');
    }

    await prisma.journalEntry.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof ForbiddenError || error instanceof ConsentRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('[JOURNAL_ID_DELETE]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
