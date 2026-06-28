import type { AIProviderName, AIUsage } from "./types";

export function logAIStart(input: { provider: AIProviderName; model: string; characterId?: string; messageCount: number }) {
  console.info(`[AI] start provider=${input.provider} model=${input.model} character=${input.characterId ?? "unknown"} messageCount=${input.messageCount}`);
}

export function logAISuccess(input: { provider: AIProviderName; model: string; durationMs: number; status: number; usage?: AIUsage }) {
  console.info(`[AI] success provider=${input.provider} model=${input.model} durationMs=${input.durationMs} status=${input.status} totalTokens=${input.usage?.totalTokens ?? "unknown"}`);
}

export function logAIError(input: { provider: AIProviderName; model: string; durationMs: number; status?: number | "timeout"; code: string; message: string }) {
  console.error(`[AI] error provider=${input.provider} model=${input.model} durationMs=${input.durationMs} status=${input.status ?? "unknown"} code=${input.code} message="${input.message}"`);
}
