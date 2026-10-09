import { z } from 'zod';

const llmEnvSchema = z.object({
  LLM_PROVIDER: z.enum(['mock', 'openai-compatible']).default('mock'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_API_BASE: z.string().url().default('https://api.openai.com/v1'),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  LLM_TIMEOUT_MS: z.coerce.number().int().positive().default(20000),
  MOCK_LLM_LATENCY_MS: z.coerce.number().int().min(0).default(250),
  SAFETY_POLICY_VERSION: z.string().default('safety-policy-v1.0.0'),
});

const parsedEnv = llmEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid LLM environment variables:', parsedEnv.error.format());
  throw new Error('Invalid LLM environment variables');
}

export const llmEnv = parsedEnv.data;

if (llmEnv.LLM_PROVIDER === 'openai-compatible' && !llmEnv.OPENAI_API_KEY) {
  console.warn('WARN: OPENAI_API_KEY is missing. Falling back to mock provider.');
  llmEnv.LLM_PROVIDER = 'mock';
}
