import { auth } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/prisma';

export class AuthError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class ConsentRequiredError extends Error {
  constructor(message = 'Consent required') {
    super(message);
    this.name = 'ConsentRequiredError';
  }
}

export async function getSessionOrThrow() {
  const session = await auth();
  if (!session || !session.user) {
    throw new AuthError();
  }
  return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await getSessionOrThrow();
  if (!allowedRoles.includes(session.user.role)) {
    throw new ForbiddenError();
  }
  return session;
}

export async function requireActiveStudent() {
  const session = await requireRole(['STUDENT']);
  
  if (session.user.status === 'PENDING_CONSENT') {
    throw new ConsentRequiredError();
  }
  
  if (session.user.status !== 'ACTIVE') {
    throw new ForbiddenError('Account is not active');
  }
  
  return session;
}

export async function requireCaseAccess(caseId: string) {
  const session = await requireRole(['COUNSELLOR', 'ADMIN']);
  
  if (session.user.role === 'ADMIN') {
    return session;
  }
  
  const counsellorCase = await prisma.counsellorCase.findUnique({
    where: { id: caseId },
    include: {
      referral: true,
    },
  });
  
  if (!counsellorCase || counsellorCase.referral.assignedCounsellorId !== session.user.id) {
    throw new ForbiddenError('You do not have access to this case');
  }
  
  return session;
}
