import { getCharacter } from "@/lib/characters";
import { ImageError } from "./errors";
import { getImageProvider } from "./providers";
import type { ImageGenerationRequest, ImageGenerationResponse } from "./types";

const safetyImagePrompt = [
  "Tasteful adult fictional AI girlfriend image.",
  "Character must be 18+.",
  "No minors.",
  "No real-person impersonation.",
  "No explicit nudity.",
  "Premium romantic companion website style.",
  "Cinematic soft light, refined composition, elegant atmosphere.",
].join(" ");

export async function generateCompanionImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  if (!request.prompt.trim()) {
    throw new ImageError("Prompt is required.", "BAD_REQUEST");
  }

  const character = request.characterId ? getCharacter(request.characterId) : undefined;
  const provider = getImageProvider();
  const characterPrompt = character
    ? `A tasteful adult fictional AI girlfriend image of ${character.name}. Character style: ${[
        ...character.personalityTags,
        ...character.visualTags,
      ].join(", ")}. Character description: ${character.shortIntro}.`
    : "A tasteful adult fictional AI girlfriend image.";

  const finalPrompt = `${characterPrompt} Scene request: ${request.prompt}. ${safetyImagePrompt}`;

  return provider.generate({
    ...request,
    prompt: finalPrompt,
  });
}
