import { toPublicImageError } from "@/lib/image/errors";
import { generateCompanionImage } from "@/lib/image/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const characterId = typeof body.characterId === "string" ? body.characterId : undefined;
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return Response.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "prompt is required.",
          },
        },
        { status: 400 },
      );
    }

    const result = await generateCompanionImage({
      characterId,
      prompt,
    });

    return Response.json({
      image: {
        url: result.imageUrl,
        size: result.size,
      },
      model: result.model,
      usage: result.usage,
    });
  } catch (error) {
    const publicError = toPublicImageError(error);
    const status = publicError.code === "BAD_REQUEST" ? 400 : publicError.code === "RATE_LIMITED" ? 429 : 502;

    return Response.json({ error: publicError }, { status });
  }
}
