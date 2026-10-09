import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.nativeEnum(UserRole, {
    error: () => ({ message: 'Invalid role' }),
  }).refine(role => ['STUDENT', 'COUNSELLOR', 'ADMIN'].includes(role), {
    message: 'Role must be STUDENT, COUNSELLOR, or ADMIN',
  }),
});

