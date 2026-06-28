export type AIProviderName = "freedomstore";

export type AIChatRole = "system" | "user" | "assistant";

export type AIChatMessage = {
  role: AIChatRole;
  content: string;
};

export type AIReasoningEffort = "low" | "medium" | "high";

export type AIReasoning = {
  enabled: boolean;
  effort?: AIReasoningEffort;
};

export type AIChatRequest = {
  characterId: string;
  messages: AIChatMessage[];
  nsfwEnabled?: boolean;
};

export type AIProviderChatRequest = {
  messages: AIChatMessage[];
  model?: string;
  reasoning?: AIReasoning;
  characterId?: string;
};

export type AIUsage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  reasoningTokens?: number;
};

export type AIChatResponse = {
  content: string;
  model: string;
  usage?: AIUsage;
};

export type AIProvider = {
  name: AIProviderName;
  chat(request: AIProviderChatRequest): Promise<AIChatResponse>;
};
