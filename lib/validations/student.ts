import { z } from 'zod';
import { ConsentType } from '@prisma/client';

export const checkInSchema = z.object({
  mood: z.number().int().min(1).max(5),
  stress: z.number().int().min(1).max(5).optional(),
  energy: z.number().int().min(1).max(5).optional(),
  sleep: z.number().int().min(1).max(5).optional(),
  freeText: z.string().max(1000).optional(),
});

export const journalSchema = z.object({
  title: z.string().max(200),
  content: z.string().max(10000),
  moodTag: z.string().optional(),
});

export const consentSchema = z.object({
  type: z.nativeEnum(ConsentType),
  version: z.string().min(1),
});

export const shareJournalSchema = z.object({
  grantedToId: z.string().cuid(),
  expiresAt: z.string().datetime().optional(), // ISO Date string
});
