import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { registerSchema } from '@/lib/validations/auth';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = registerSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: parsedData.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, role } = parsedData.data;

    const hashedPassword = await bcrypt.hash(password, 10);
    const status = role === 'STUDENT' ? 'PENDING_CONSENT' : 'ACTIVE';

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        role,
        status,
      },
    });

    return NextResponse.json(
      { message: 'User registered successfully', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { message: 'A user with this email already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
