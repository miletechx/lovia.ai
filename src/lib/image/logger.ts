import type { ImageProviderName, ImageUsage } from "./types";

export function logImageStart(input: { provider: ImageProviderName; model: string; characterId?: string; promptLength: number }) {
  console.info(`[IMAGE] start provider=${input.provider} model=${input.model} character=${input.characterId ?? "unknown"} promptLength=${input.promptLength}`);
}

export function logImageSuccess(input: { provider: ImageProviderName; model: string; durationMs: number; status: number; usage?: ImageUsage }) {
  console.info(`[IMAGE] success provider=${input.provider} model=${input.model} durationMs=${input.durationMs} status=${input.status} generatedImages=${input.usage?.generatedImages ?? "unknown"}`);
}

export function logImageError(input: { provider: ImageProviderName; model: string; durationMs: number; status?: number | "timeout"; code: string; message: string }) {
  console.error(`[IMAGE] error provider=${input.provider} model=${input.model} durationMs=${input.durationMs} status=${input.status ?? "unknown"} code=${input.code} message="${input.message}"`);
}
