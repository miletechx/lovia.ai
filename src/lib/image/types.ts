export type ImageProviderName = "volcengine";

export type ImageGenerationRequest = {
  characterId?: string;
  prompt: string;
  size?: string;
  watermark?: boolean;
};

export type ImageUsage = {
  generatedImages?: number;
  outputTokens?: number;
  totalTokens?: number;
};

export type ImageGenerationResponse = {
  imageUrl: string;
  size?: string;
  model: string;
  usage?: ImageUsage;
};

export type ImageProvider = {
  name: ImageProviderName;
  generate(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;
};
