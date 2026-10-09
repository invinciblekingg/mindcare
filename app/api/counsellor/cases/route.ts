import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, AuthError, ForbiddenError } from '@/lib/rbac';

export async function GET() {
  try {
    const session = await requireRole(['COUNSELLOR']);
    
    const cases = await prisma.counsellorCase.findMany({
      where: {
        referral: {
          assignedCounsellorId: session.user.id
        }
      },
      select: {
        id: true,
        status: true,
        reviewDate: true,
        referral: {
          select: {
            id: true,
            status: true,
            student: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(cases);
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof AuthError ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
