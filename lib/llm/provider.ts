import { llmEnv } from './env';

export type LLMRole = 'system' | 'user' | 'assistant';

export interface LLMMessage {
  role: LLMRole;
  content: string;
}

export interface LLMCompletionInput {
  messages: LLMMessage[];
  systemPrompt: string;
  userId: string;
  conversationId: string;
}

export interface LLMCompletionResult {
  fullText: string;
  modelVersion: string;
  provider: 'mock' | 'openai-compatible' | 'gemini-openai-compatible';
}

export class LLMProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LLMProviderError';
  }
}

export async function generateBufferedCompletion(input: LLMCompletionInput): Promise<LLMCompletionResult> {
  const isMock = llmEnv.LLM_PROVIDER === 'mock';

  if (isMock) {
    // Simulate latency
    if (llmEnv.MOCK_LLM_LATENCY_MS > 0) {
      await new Promise((resolve) => setTimeout(resolve, llmEnv.MOCK_LLM_LATENCY_MS));
    }
    
    // Check for mock diagnostic/unsafe triggers (Optional, usually we just return a supportive message)
    const fullText = "I hear you, and I appreciate you sharing this with me. I'm here to support you in whatever way you need. Let's take it one step at a time.";
    
    return {
      fullText,
      modelVersion: 'mock-wellness-v1',
      provider: 'mock',
    };
  }

  // openai-compatible
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), llmEnv.LLM_TIMEOUT_MS);

  try {
    const payload = {
      model: llmEnv.OPENAI_MODEL,
      messages: [
        { role: 'system', content: input.systemPrompt },
        ...input.messages,
      ],
      stream: false,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (llmEnv.OPENAI_API_KEY) {
      headers['Authorization'] = `Bearer ${llmEnv.OPENAI_API_KEY}`;
    }

    const response = await fetch(`${llmEnv.OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
      throw new LLMProviderError('Invalid response format from LLM provider: missing choices or message.');
    }

    const fullText = data.choices[0].message.content;

    if (typeof fullText !== 'string') {
      throw new LLMProviderError('Invalid response format from LLM provider: content is not a string.');
    }

    const isGemini = llmEnv.OPENAI_API_BASE.includes('generativelanguage.googleapis.com');

    return {
      fullText,
      modelVersion: llmEnv.OPENAI_MODEL,
      provider: isGemini ? 'gemini-openai-compatible' : 'openai-compatible',
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new LLMProviderError(error.message);
    }
    throw new LLMProviderError('Unknown error during LLM generation');
  } finally {
    clearTimeout(timeoutId);
  }
}
