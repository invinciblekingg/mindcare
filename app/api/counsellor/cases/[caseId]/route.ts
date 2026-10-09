import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireCaseAccess, AuthError, ForbiddenError } from '@/lib/rbac';

export async function GET(req: Request, { params }: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await params;
    const session = await requireCaseAccess(caseId);
    
    const counsellorCase = await prisma.counsellorCase.findUnique({
      where: { id: caseId },
      include: {
        referral: {
          select: {
            reason: true,
            source: true,
            evidence: true,
            uncertainty: true,
            studentId: true
          }
        },
        interventionPlans: {
          where: { status: 'ACTIVE' },
          take: 1
        },
        followUps: true
      }
    });

    if (!counsellorCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const studentId = counsellorCase.referral.studentId;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moodCheckIns = await prisma.moodCheckIn.findMany({
      where: {
        userId: studentId,
        createdAt: { gte: thirtyDaysAgo }
      },
      orderBy: { createdAt: 'desc' }
    });

    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        userId: studentId,
        shares: {
          some: {
            grantedToId: session.user.id,
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          }
        }
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // Truncate journal entries to excerpts
    const journalExcerpts = journalEntries.map(entry => ({
      ...entry,
      content: entry.content.substring(0, 200) + (entry.content.length > 200 ? '...' : '')
    }));

    const safetyEvents = await prisma.safetyEvent.findMany({
      where: {
        message: {
          conversation: {
            userId: studentId
          }
        }
      },
      select: {
        id: true,
        category: true,
        action: true,
        timestamp: true,
        confidence: true
      },
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json({
      case: {
        id: counsellorCase.id,
        status: counsellorCase.status,
        reviewDate: counsellorCase.reviewDate,
      },
      referral: counsellorCase.referral,
      interventionPlan: counsellorCase.interventionPlans[0] || null,
      followUps: counsellorCase.followUps,
      moodCheckIns,
      journalEntries: journalExcerpts,
      safetyEvents
    });

  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof AuthError ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
