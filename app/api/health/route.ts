import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { llmEnv } from '@/lib/llm/env';

export async function GET() {
  let dbStatus = 'ok';
  
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    dbStatus = 'error';
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    llmProvider: llmEnv.LLM_PROVIDER,
    safetyPolicyVersion: llmEnv.SAFETY_POLICY_VERSION,
    });
}
