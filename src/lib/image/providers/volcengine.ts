import { ImageError, imageErrorFromStatus } from "../errors";
import { logImageError, logImageStart, logImageSuccess } from "../logger";
import type { ImageGenerationRequest, ImageGenerationResponse, ImageProvider, ImageUsage } from "../types";

const provider = "volcengine" as const;

type VolcengineImageResponse = {
  model?: string;
  created?: number;
  data?: Array<{
    url?: string;
    size?: string;
  }>;
  usage?: {
    generated_images?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
};

function getConfig() {
  const apiKey = process.env.VOLCENGINE_IMAGE_API_KEY;
  const baseUrl = process.env.VOLCENGINE_IMAGE_BASE_URL ?? "https://ark.cn-beijing.volces.com/api/v3";
  const model = process.env.VOLCENGINE_IMAGE_MODEL ?? "doubao-seedream-5-0-260128";
  const size = process.env.VOLCENGINE_IMAGE_SIZE ?? "2K";
  const watermark = process.env.VOLCENGINE_IMAGE_WATERMARK === "true";
  const timeoutMs = Number(process.env.IMAGE_REQUEST_TIMEOUT_MS ?? "60000");

  if (!apiKey) {
    throw new ImageError("Missing VOLCENGINE_IMAGE_API_KEY.", "AUTH_FAILED", { provider });
  }

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ""),
    model,
    size,
    watermark,
    timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 60000,
  };
}

function mapUsage(usage?: VolcengineImageResponse["usage"]): ImageUsage | undefined {
  if (!usage) return undefined;

  return {
    generatedImages: usage.generated_images,
    outputTokens: usage.output_tokens,
    totalTokens: usage.total_tokens,
  };
}

async function parseErrorMessage(response: Response) {
  try {
    const data = await response.json();
    if (typeof data?.error?.message === "string") return data.error.message;
    if (typeof data?.message === "string") return data.message;
  } catch {
    return response.statusText;
  }

  return response.statusText;
}

export const volcengineImageProvider: ImageProvider = {
  name: provider,
  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const config = getConfig();
    const model = config.model;
    const startedAt = Date.now();
    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort(), config.timeoutMs);

    logImageStart({ provider, model, characterId: request.characterId, promptLength: request.prompt.length });

    try {
      const response = await fetch(`${config.baseUrl}/images/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          prompt: request.prompt,
          sequential_image_generation: "disabled",
          response_format: "url",
          size: request.size ?? config.size,
          stream: false,
          watermark: request.watermark ?? config.watermark,
        }),
        signal: controller.signal,
      });

      const durationMs = Date.now() - startedAt;

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        const error = imageErrorFromStatus(response.status, provider, message);
        logImageError({ provider, model, durationMs, status: response.status, code: error.code, message: error.message });
        throw error;
      }

      const data = (await response.json()) as VolcengineImageResponse;
      const image = data.data?.[0];

      if (!image?.url) {
        const error = new ImageError("Missing data[0].url.", "INVALID_RESPONSE", { provider, status: response.status });
        logImageError({ provider, model, durationMs, status: response.status, code: error.code, message: error.message });
        throw error;
      }

      const usage = mapUsage(data.usage);
      logImageSuccess({ provider, model: data.model ?? model, durationMs, status: response.status, usage });

      return {
        imageUrl: image.url.trim(),
        size: image.size,
        model: data.model ?? model,
        usage,
      };
    } catch (error) {
      const durationMs = Date.now() - startedAt;

      if (error instanceof DOMException && error.name === "AbortError") {
        const timeoutError = new ImageError("Image request timed out.", "TIMEOUT", { provider, cause: error });
        logImageError({ provider, model, durationMs, status: "timeout", code: timeoutError.code, message: timeoutError.message });
        throw timeoutError;
      }

      if (error instanceof ImageError) throw error;

      const unknownError = new ImageError("Unknown image provider error.", "UNKNOWN", { provider, cause: error });
      logImageError({ provider, model, durationMs, code: unknownError.code, message: unknownError.message });
      throw unknownError;
    } finally {
      clearTimeout(timeout);
    }
  },
};
