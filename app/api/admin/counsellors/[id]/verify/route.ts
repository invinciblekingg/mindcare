import { createAuditLog } from '@/lib/audit/log';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, AuthError, ForbiddenError } from '@/lib/rbac';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole(['ADMIN']);
    const { id } = await params;

    const user = await prisma.user.update({
      where: { id },
      data: { emailVerified: new Date()   }
    });

    await createAuditLog({
        actorId: session.user.id,
        eventType: 'AUTH',
        targetId: id,
        targetType: 'User',
        details: { action: '' }
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof AuthError ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
