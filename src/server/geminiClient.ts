import { GoogleGenAI } from '@google/genai';
import { TokenUsage } from '../types/headquarters.js';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('API_KEY_NOT_CONFIGURED');
  }

  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }

  return aiInstance;
}

export function isGeminiConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY');
}

export interface GeminiCallParams {
  model?: string;
  prompt: string;
  systemInstruction?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface GeminiCallResult {
  text: string;
  tokens: TokenUsage;
  latencyMs: number;
}

export async function executeGeminiCall(params: GeminiCallParams): Promise<GeminiCallResult> {
  const ai = getGeminiClient();
  const initialModel = params.model || 'gemini-3.8-flash';
  let currentModel = initialModel;
  const timeoutMs = params.timeoutMs || 60000;

  const maxAttempts = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (params.signal?.aborted) {
      throw new Error('USER_CANCELLED');
    }

    const startTime = Date.now();
    let timer: NodeJS.Timeout | null = null;

    try {
      const config: any = {};
      if (params.systemInstruction) {
        config.systemInstruction = params.systemInstruction;
      }

      const attemptTimeout = attempt === 1 && currentModel === 'gemini-3.8-flash' ? 12000 : timeoutMs;

      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error('TIMEOUT_EXCEEDED'));
        }, attemptTimeout);
      });

      const abortPromise = new Promise<never>((_, reject) => {
        if (params.signal) {
          params.signal.addEventListener(
            'abort',
            () => reject(new Error('USER_CANCELLED')),
            { once: true }
          );
        }
      });

      const callPromise = ai.models.generateContent({
        model: currentModel,
        contents: params.prompt,
        config
      });

      const response = await Promise.race([callPromise, timeoutPromise, abortPromise]);

      if (timer) clearTimeout(timer);

      const latencyMs = Date.now() - startTime;
      const text = response.text || '';

      // 실제 메타데이터에서 토큰 사용량 추출 (누락 시 'N/A'로 표기)
      const usage = response.usageMetadata;
      const tokens: TokenUsage = {
        promptTokens: typeof usage?.promptTokenCount === 'number' ? usage.promptTokenCount : 'N/A',
        candidatesTokens: typeof usage?.candidatesTokenCount === 'number' ? usage.candidatesTokenCount : 'N/A',
        totalTokens: typeof usage?.totalTokenCount === 'number' ? usage.totalTokenCount : 'N/A'
      };

      return {
        text,
        tokens,
        latencyMs
      };
    } catch (error: any) {
      if (timer) clearTimeout(timer);

      if (params.signal?.aborted || error?.message === 'USER_CANCELLED') {
        throw new Error('USER_CANCELLED');
      }

      lastError = error;
      const errMsg = error?.message || String(error);

      const isTimeout = error?.message === 'TIMEOUT_EXCEEDED' || error?.name === 'AbortError';

      // 503 high demand, 429 rate limit, or backend hang timeout on 3.8-flash
      const isTransient =
        isTimeout ||
        errMsg.includes('503') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('high demand') ||
        errMsg.includes('429') ||
        errMsg.includes('RESOURCE_EXHAUSTED');

      if (isTransient && attempt < maxAttempts) {
        // If 3.8 flash has a capacity spike (503 or hang), gracefully use 3.1-flash-lite on subsequent attempts
        if (currentModel === 'gemini-3.8-flash') {
          currentModel = 'gemini-3.1-flash-lite';
          console.warn(`[GeminiClient] High demand/latency on gemini-3.8-flash, seamlessly falling back to gemini-3.1-flash-lite (attempt ${attempt}/${maxAttempts})...`);
        } else {
          const delay = attempt * 1200;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        continue;
      }

      if (isTimeout) {
        throw new Error('CALL_TIMEOUT');
      }

      throw error;
    }
  }

  throw lastError || new Error('GEMINI_CALL_FAILED');
}
