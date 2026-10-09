import { z } from 'zod';

export const assignReferralSchema = z.object({
  referralId: z.string().cuid(),
  assignedCounsellorId: z.string().cuid(),
});

export const createPlanSchema = z.object({
  caseId: z.string().cuid(),
  goals: z.array(z.string().max(500)).min(1).max(20),
  responseStyle: z.string().max(200),
  copingStrategies: z.array(
    z.object({
      name: z.string().max(200),
      description: z.string().max(500).optional(),
    })
  ).min(1).max(20),
  topicsRequiringCare: z.string().max(1000),
  referralInstructions: z.string().max(1000),
  reviewSchedule: z.string().max(500),
});

export const updatePlanSchema = createPlanSchema.partial();

export const approvePlanSchema = z.object({
  planId: z.string().cuid(),
  action: z.enum(['APPROVE', 'REJECT']),
});

export const createFollowUpSchema = z.object({
  caseId: z.string().cuid(),
  dueDate: z.string().datetime(),
  notes: z.string().max(2000),
});

export const completeFollowUpSchema = z.object({
  completionStatus: z.string(),
  notes: z.string().max(2000),
});

