import { ImageError } from "../errors";
import type { ImageProvider, ImageProviderName } from "../types";
import { volcengineImageProvider } from "./volcengine";

const providers: Record<ImageProviderName, ImageProvider> = {
  volcengine: volcengineImageProvider,
};

export function getImageProvider() {
  const providerName = (process.env.IMAGE_PROVIDER ?? "volcengine") as ImageProviderName;
  const provider = providers[providerName];

  if (!provider) {
    throw new ImageError(`Unsupported image provider: ${providerName}`, "BAD_REQUEST");
  }

  return provider;
}
