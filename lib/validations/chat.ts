import { z } from 'zod';

export const chatMessageSchema = z.object({
  conversationId: z.string().cuid().optional(),
  content: z.string().max(2000),
});

export const helpNowSchema = z.object({
  reason: z.string().max(500),
  context: z.string().optional(),
});
