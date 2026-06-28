import { AIError } from "../errors";
import type { AIProvider, AIProviderName } from "../types";
import { freedomStoreProvider } from "./freedomstore";

const providers: Record<AIProviderName, AIProvider> = {
  freedomstore: freedomStoreProvider,
};

export function getAIProvider() {
  const providerName = (process.env.AI_PROVIDER ?? "freedomstore") as AIProviderName;
  const provider = providers[providerName];

  if (!provider) {
    throw new AIError(`Unsupported AI provider: ${providerName}`, "BAD_REQUEST");
  }

  return provider;
}
