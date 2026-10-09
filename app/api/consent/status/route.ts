import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionOrThrow, AuthError } from '@/lib/rbac';
import { ConsentType } from '@prisma/client';

export async function GET() {
  try {
    const session = await getSessionOrThrow();
    const userId = session.user.id;
    const role = session.user.role;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { status: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let requiredConsents: ConsentType[] = [];
    if (role === 'STUDENT') {
      requiredConsents = [
        ConsentType.PARENTAL_CONSENT,
        ConsentType.CHILD_ASSENT,
        ConsentType.AI_DISCLOSURE,
        ConsentType.PRIVACY_POLICY,
      ];
    }

    const consentRecords = await prisma.consentRecord.findMany({
      where: { userId, status: 'GRANTED' },
    });

    const grantedConsents = consentRecords.map(c => c.type);
    const missingConsents = requiredConsents.filter(c => !grantedConsents.includes(c));
    const isActive = user.status === 'ACTIVE';

    return NextResponse.json({
      userId,
      role,
      accountStatus: user.status,
      requiredConsents,
      grantedConsents,
      missingConsents,
      isActive,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
