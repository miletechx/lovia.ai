import { AIError, errorFromStatus } from "../errors";
import { logAIError, logAIStart, logAISuccess } from "../logger";
import type { AIChatResponse, AIProvider, AIProviderChatRequest, AIReasoningEffort, AIUsage } from "../types";

const provider = "freedomstore" as const;

type FreedomStoreResponse = {
  model?: string;
  choices?: Array<{
    message?: {
      role?: string;
      content?: string;
    };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    completion_tokens_details?: {
      reasoning_tokens?: number;
    };
  };
};

function getConfig() {
  const apiKey = process.env.FREEDOMSTORE_API_KEY;
  const baseUrl = process.env.FREEDOMSTORE_BASE_URL ?? "https://freedomstore.asia/v1";
  const model = process.env.FREEDOMSTORE_MODEL ?? "gpt-5.5";
  const timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS ?? "30000");
  const reasoningEnabled = process.env.FREEDOMSTORE_REASONING_ENABLED !== "false";
  const reasoningEffort = process.env.FREEDOMSTORE_REASONING_EFFORT as AIReasoningEffort | undefined;

  if (!apiKey) {
    throw new AIError("Missing FREEDOMSTORE_API_KEY.", "AUTH_FAILED", { provider });
  }

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ""),
    model,
    timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 30000,
    reasoningEnabled,
    reasoningEffort,
  };
}

function mapUsage(usage?: FreedomStoreResponse["usage"]): AIUsage | undefined {
  if (!usage) return undefined;

  return {
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
    reasoningTokens: usage.completion_tokens_details?.reasoning_tokens,
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

export const freedomStoreProvider: AIProvider = {
  name: provider,
  async chat(request: AIProviderChatRequest): Promise<AIChatResponse> {
    const config = getConfig();
    const model = request.model ?? config.model;
    const startedAt = Date.now();
    const controller = new AbortController();
    const timeout = windowlessSetTimeout(() => controller.abort(), config.timeoutMs);

    logAIStart({ provider, model, characterId: request.characterId, messageCount: request.messages.length });

    try {
      const reasoning = request.reasoning ?? {
        enabled: config.reasoningEnabled,
        effort: config.reasoningEffort,
      };

      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: request.messages,
          reasoning,
        }),
        signal: controller.signal,
      });

      const durationMs = Date.now() - startedAt;

      if (!response.ok) {
        const message = await parseErrorMessage(response);
        const error = errorFromStatus(response.status, provider, message);
        logAIError({ provider, model, durationMs, status: response.status, code: error.code, message: error.message });
        throw error;
      }

      const data = (await response.json()) as FreedomStoreResponse;
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        const error = new AIError("Missing choices[0].message.content.", "INVALID_RESPONSE", { provider, status: response.status });
        logAIError({ provider, model, durationMs, status: response.status, code: error.code, message: error.message });
        throw error;
      }

      const usage = mapUsage(data.usage);
      logAISuccess({ provider, model: data.model ?? model, durationMs, status: response.status, usage });

      return {
        content,
        model: data.model ?? model,
        usage,
      };
    } catch (error) {
      const durationMs = Date.now() - startedAt;

      if (error instanceof DOMException && error.name === "AbortError") {
        const timeoutError = new AIError("AI request timed out.", "TIMEOUT", { provider, cause: error });
        logAIError({ provider, model, durationMs, status: "timeout", code: timeoutError.code, message: timeoutError.message });
        throw timeoutError;
      }

      if (error instanceof AIError) throw error;

      const unknownError = new AIError("Unknown AI provider error.", "UNKNOWN", { provider, cause: error });
      logAIError({ provider, model, durationMs, code: unknownError.code, message: unknownError.message });
      throw unknownError;
    } finally {
      clearTimeout(timeout);
    }
  },
};

function windowlessSetTimeout(callback: () => void, ms: number) {
  return globalThis.setTimeout(callback, ms);
}
