import { toPublicAIError } from "@/lib/ai/errors";
import { sendChatMessage } from "@/lib/ai/service";
import type { AIChatMessage } from "@/lib/ai/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const characterId = typeof body.characterId === "string" ? body.characterId : "";
    const nsfwEnabled = Boolean(body.nsfwEnabled);
    const messages = Array.isArray(body.messages) ? normalizeMessages(body.messages) : [];

    if (!characterId || messages.length === 0) {
      return Response.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "characterId and messages are required.",
          },
        },
        { status: 400 },
      );
    }

    const result = await sendChatMessage({
      characterId,
      messages,
      nsfwEnabled,
    });

    return Response.json({
      message: {
        role: "assistant",
        content: result.content,
      },
      model: result.model,
      usage: result.usage,
    });
  } catch (error) {
    const publicError = toPublicAIError(error);
    const status = publicError.code === "BAD_REQUEST" ? 400 : publicError.code === "RATE_LIMITED" ? 429 : 502;

    return Response.json({ error: publicError }, { status });
  }
}

function normalizeMessages(messages: unknown[]): AIChatMessage[] {
  return messages
    .map((message) => {
      if (!message || typeof message !== "object") return null;
      const candidate = message as { role?: unknown; content?: unknown };
      if (candidate.role !== "user" && candidate.role !== "assistant" && candidate.role !== "system") return null;
      if (typeof candidate.content !== "string" || !candidate.content.trim()) return null;

      return {
        role: candidate.role,
        content: candidate.content.trim(),
      };
    })
    .filter((message): message is AIChatMessage => Boolean(message));
}
