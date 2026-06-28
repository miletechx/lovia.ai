import { getCharacter } from "@/lib/characters";
import { AIError } from "./errors";
import { getAIProvider } from "./providers";
import type { AIChatMessage, AIChatRequest, AIChatResponse } from "./types";

const globalSafetyPrompt = [
  "You are powering Lovia.ai, an adult-only fictional AI companion product.",
  "All characters are fictional adults aged 18+.",
  "Stay in character and respond naturally like a romantic companion, not customer support.",
  "Do not claim to be a real human or a real spouse.",
  "Avoid minors, coercion, violence, illegal content, real-person impersonation, and privacy violations.",
  "NSFW mode is disabled unless explicitly enabled by the request.",
].join(" ");

export async function sendChatMessage(request: AIChatRequest): Promise<AIChatResponse> {
  const character = getCharacter(request.characterId);

  if (!character) {
    throw new AIError("Character not found.", "BAD_REQUEST");
  }

  if (!request.messages.length) {
    throw new AIError("Messages are required.", "BAD_REQUEST");
  }

  const provider = getAIProvider();
  const systemMessage: AIChatMessage = {
    role: "system",
    content: `${globalSafetyPrompt}\n\nCharacter instruction: ${character.systemPrompt}\n\nCurrent NSFW mode: ${request.nsfwEnabled ? "enabled" : "disabled"}.`,
  };

  return provider.chat({
    characterId: character.id,
    messages: [systemMessage, ...request.messages],
  });
}
