import type { ImageProviderName } from "./types";

export type ImageErrorCode =
  | "AUTH_FAILED"
  | "FORBIDDEN"
  | "RATE_LIMITED"
  | "PROVIDER_UNAVAILABLE"
  | "TIMEOUT"
  | "INVALID_RESPONSE"
  | "BAD_REQUEST"
  | "UNKNOWN";

export class ImageError extends Error {
  code: ImageErrorCode;
  provider?: ImageProviderName;
  status?: number;

  constructor(message: string, code: ImageErrorCode, options?: { provider?: ImageProviderName; status?: number; cause?: unknown }) {
    super(message);
    this.name = "ImageError";
    this.code = code;
    this.provider = options?.provider;
    this.status = options?.status;
    this.cause = options?.cause;
  }
}

export function imageErrorFromStatus(status: number, provider: ImageProviderName, message?: string) {
  if (status === 401) return new ImageError(message ?? "Image provider authentication failed.", "AUTH_FAILED", { provider, status });
  if (status === 403) return new ImageError(message ?? "This image model is not available.", "FORBIDDEN", { provider, status });
  if (status === 429) return new ImageError(message ?? "Image generation is rate limited.", "RATE_LIMITED", { provider, status });
  if (status >= 500) return new ImageError(message ?? "Image provider is temporarily unavailable.", "PROVIDER_UNAVAILABLE", { provider, status });
  if (status >= 400) return new ImageError(message ?? "The image request is invalid.", "BAD_REQUEST", { provider, status });
  return new ImageError(message ?? "Unknown image provider error.", "UNKNOWN", { provider, status });
}

export function toPublicImageError(error: unknown) {
  if (error instanceof ImageError) {
    const messageByCode: Record<ImageErrorCode, string> = {
      AUTH_FAILED: "Image generation is temporarily unavailable.",
      FORBIDDEN: "This image model is not available right now.",
      RATE_LIMITED: "Image generation is busy. Please try again in a moment.",
      PROVIDER_UNAVAILABLE: "Image provider is temporarily unavailable.",
      TIMEOUT: "Image generation took too long. Please try again.",
      INVALID_RESPONSE: "Image provider returned an unexpected response.",
      BAD_REQUEST: "The image request could not be processed.",
      UNKNOWN: "Image generation is temporarily unavailable.",
    };

    return {
      code: error.code,
      message: messageByCode[error.code],
      provider: error.provider,
    };
  }

  return {
    code: "UNKNOWN" as const,
    message: "Image generation is temporarily unavailable.",
  };
}
