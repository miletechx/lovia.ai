import type { AIProviderName } from "./types";

export type AIErrorCode =
  | "AUTH_FAILED"
  | "FORBIDDEN"
  | "RATE_LIMITED"
  | "PROVIDER_UNAVAILABLE"
  | "TIMEOUT"
  | "INVALID_RESPONSE"
  | "BAD_REQUEST"
  | "UNKNOWN";

export class AIError extends Error {
  code: AIErrorCode;
  provider?: AIProviderName;
  status?: number;

  constructor(message: string, code: AIErrorCode, options?: { provider?: AIProviderName; status?: number; cause?: unknown }) {
    super(message);
    this.name = "AIError";
    this.code = code;
    this.provider = options?.provider;
    this.status = options?.status;
    this.cause = options?.cause;
  }
}

export function errorFromStatus(status: number, provider: AIProviderName, message?: string) {
  if (status === 401) return new AIError(message ?? "AI provider authentication failed.", "AUTH_FAILED", { provider, status });
  if (status === 403) return new AIError(message ?? "The selected AI model is not available.", "FORBIDDEN", { provider, status });
  if (status === 429) return new AIError(message ?? "The AI service is rate limited.", "RATE_LIMITED", { provider, status });
  if (status >= 500) return new AIError(message ?? "The AI provider is temporarily unavailable.", "PROVIDER_UNAVAILABLE", { provider, status });
  if (status >= 400) return new AIError(message ?? "The AI request is invalid.", "BAD_REQUEST", { provider, status });
  return new AIError(message ?? "Unknown AI provider error.", "UNKNOWN", { provider, status });
}

export function toPublicAIError(error: unknown) {
  if (error instanceof AIError) {
    const messageByCode: Record<AIErrorCode, string> = {
      AUTH_FAILED: "The AI companion is temporarily unavailable.",
      FORBIDDEN: "This AI model is not available right now.",
      RATE_LIMITED: "The AI service is busy. Please try again in a moment.",
      PROVIDER_UNAVAILABLE: "The AI provider is temporarily unavailable.",
      TIMEOUT: "The AI response took too long. Please try again.",
      INVALID_RESPONSE: "The AI provider returned an unexpected response.",
      BAD_REQUEST: "The chat request could not be processed.",
      UNKNOWN: "The AI companion is temporarily unavailable.",
    };

    return {
      code: error.code,
      message: messageByCode[error.code],
      provider: error.provider,
    };
  }

  return {
    code: "UNKNOWN" as const,
    message: "The AI companion is temporarily unavailable.",
  };
}
