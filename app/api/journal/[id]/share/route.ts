import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireActiveStudent, AuthError, ForbiddenError, ConsentRequiredError } from '@/lib/rbac';
import { shareJournalSchema } from '@/lib/validations/student';
import { z } from 'zod';
import { ConsentType } from '@prisma/client';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireActiveStudent();
    const { id } = await params;
    const body = await req.json();

    const validatedData = shareJournalSchema.parse(body);

    const entry = await prisma.journalEntry.findUnique({
      where: { id },
    });

    if (!entry || entry.deletedAt) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    if (entry.userId !== session.user.id) {
      throw new ForbiddenError('You can only share your own journal entries');
    }

    // Run within a transaction to ensure both records are created
    const [shareGrant, consentRecord] = await prisma.$transaction([
      prisma.journalShareGrant.create({
        data: {
          journalEntryId: id,
          grantedById: session.user.id,
          grantedToId: validatedData.grantedToId,
          expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        },
      }),
      prisma.consentRecord.create({
        data: {
          userId: session.user.id,
          type: ConsentType.JOURNAL_SHARING,
          status: 'GRANTED',
          version: '1.0', // Standardized default for implicit consent versioning, or can be adjusted
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
        }
      })
    ]);

    return NextResponse.json({ shareGrant, consentRecord });
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
    console.error('[JOURNAL_SHARE_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
