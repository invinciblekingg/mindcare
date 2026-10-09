import { createAuditLog } from '@/lib/audit/log';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, AuthError, ForbiddenError } from '@/lib/rbac';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const createCounsellorSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
    });

export async function GET() {
  try {
    await requireRole(['ADMIN']);
    const counsellors = await prisma.user.findMany({
      where: { role: 'COUNSELLOR' },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        status: true,
        createdAt: true,
      }
    });
    return NextResponse.json(counsellors);
  } catch (error) {
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof AuthError ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireRole(['ADMIN']);
    const body = await req.json();
    const data = createCounsellorSchema.parse(body);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newCounsellor = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: 'COUNSELLOR',
        status: 'ACTIVE',
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      }
    });

    await createAuditLog({
        actorId: session.user.id,
        eventType: 'AUTH',
        targetId: newCounsellor.id,
        targetType: 'User',
        details: { action: '' }
    });

    return NextResponse.json(newCounsellor, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof AuthError || error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof AuthError ? 401 : 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
