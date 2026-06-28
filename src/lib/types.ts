export type UserPlan = "guest" | "free" | "premium";

export type Character = {
  id: string;
  name: string;
  age: number;
  avatarUrl: string;
  description: string;
  shortIntro: string;
  personalityTags: string[];
  relationshipTags: string[];
  visualTags: string[];
  isPremium: boolean;
  nsfwSupported: boolean;
  systemPrompt: string;
  accent: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  type: "text" | "image";
  createdAt: string;
};
