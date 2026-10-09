import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { requireRole, requireCaseAccess, AuthError, ForbiddenError } from '@/lib/rbac';
import { generateSafetyHash } from '@/lib/safety/crypto';

export async function GET(req: Request) {
  try {
    const session = await requireRole(['COUNSELLOR', 'ADMIN']);
    const { searchParams } = new URL(req.url);
    
    const caseId = searchParams.get('caseId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let whereClause: Prisma.SafetyEventWhereInput = {};

    if (caseId) {
      await requireCaseAccess(caseId);
      const counsellorCase = await prisma.counsellorCase.findUnique({
        where: { id: caseId },
        include: { referral: true }
      });
      if (counsellorCase) {
        whereClause = {
          message: {
            conversation: {
              userId: counsellorCase.referral.studentId
            }
          }
        };
      }
    } else {
      if (session.user.role === 'COUNSELLOR') {
        const cases = await prisma.counsellorCase.findMany({
          where: { referral: { assignedCounsellorId: session.user.id } },
          include: { referral: true }
        });
        const studentIds = cases.map(c => c.referral.studentId);
        whereClause = {
          message: {
            conversation: {
              userId: { in: studentIds }
            }
          }
        };
      }
      // ADMIN sees all, whereClause remains {}
    }

    const events = await prisma.safetyEvent.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy: { timestamp: 'desc' },
      include: {
        message: {
          select: {
            conversation: {
              select: {
                userId: true
              }
            }
          }
        }
      }
    });

    let hashChainValid = true;

    // Group by userId to verify the chain correctly since it's per-user
    const userEvents: Record<string, typeof events> = {};
    for (const e of events) {
      const uId = e.message.conversation.userId;
      if (!userEvents[uId]) userEvents[uId] = [];
      userEvents[uId].push(e);
    }

    for (const uId of Object.keys(userEvents)) {
      const uEvents = userEvents[uId];
      for (let i = 0; i < uEvents.length - 1; i++) {
        const newerEvent = uEvents[i];
        const olderEvent = uEvents[i + 1];
        
        const expectedHash = generateSafetyHash({
          messageId: olderEvent.messageId,
          userId: olderEvent.userId,
          conversationId: olderEvent.conversationId,
          category: olderEvent.category,
          confidence: olderEvent.confidence,
          signals: olderEvent.signals,
          rationale: olderEvent.rationale,
          action: olderEvent.action,
          policyVersion: olderEvent.policyVersion,
          modelVersion: olderEvent.modelVersion,
          rawInputHash: olderEvent.rawInputHash,
          outputHash: olderEvent.outputHash,
        }, olderEvent.previousEventHash);

        if (newerEvent.previousEventHash !== expectedHash) {
          hashChainValid = false;
          break;
        }
      }
      if (!hashChainValid) break;
    }

    const sanitizedEvents = events.map(e => ({
      id: e.id,
      userId: e.userId,
      conversationId: e.conversationId,
      category: e.category,
      confidence: e.confidence,
      signals: e.signals,
      rationale: e.rationale,
      action: e.action,
      policyVersion: e.policyVersion,
      modelVersion: e.modelVersion,
      timestamp: e.timestamp,
      previousEventHash: e.previousEventHash,
    }));

    return NextResponse.json({
      events: sanitizedEvents,
      hashChainValid
    });

  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof AuthError ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
