"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Character, Message } from "@/lib/types";

export function ChatClient({ character }: { character: Character }) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi, I'm ${character.name.split(" ")[0]}. I was waiting for you. What should I call you tonight?`,
      type: "text",
      createdAt: new Date().toISOString(),
    },
  ]);

  const userMessageCount = useMemo(() => messages.filter((message) => message.role === "user").length, [messages]);
  const trialEnded = userMessageCount >= 5;
  const isBusy = isSending || isGeneratingImage;

  async function sendMessage() {
    if (!input.trim() || trialEnded || isBusy) return;

    const userText = input.trim();
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userText,
      type: "text",
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);

    if (isImageRequest(userText)) {
      await generateImage(userText);
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: character.id,
          nsfwEnabled: false,
          messages: nextMessages
            .filter((message) => message.role === "user" || message.role === "assistant")
            .filter((message) => message.type === "text")
            .map((message) => ({
              role: message.role,
              content: message.content,
            })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message ?? "The AI companion is temporarily unavailable.");
      }

      const assistantContent = data?.message?.content;

      if (typeof assistantContent !== "string" || !assistantContent.trim()) {
        throw new Error("The AI companion returned an empty message.");
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: assistantContent,
        type: "text",
        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "The AI companion is temporarily unavailable.");
    } finally {
      setIsSending(false);
    }
  }

  async function generateImage(requestText?: string) {
    if (trialEnded || isBusy) return;

    setError(null);
    setIsGeneratingImage(true);

    try {
      const lastUserMessage = requestText
        ? { content: requestText }
        : [...messages].reverse().find((message) => message.role === "user" && message.type === "text");
      const prompt = lastUserMessage
        ? `${character.name} creates a tasteful romantic image requested by the user: ${lastUserMessage.content}`
        : `${character.name} in a private romantic midnight room, soft rose lighting, elegant companion portrait`;

      const response = await fetch("/api/images/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: character.id,
          prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message ?? "Image generation is temporarily unavailable.");
      }

      const imageUrl = data?.image?.url;

      if (typeof imageUrl !== "string" || !imageUrl.trim()) {
        throw new Error("Image provider returned an empty image URL.");
      }

      const imageMessage: Message = {
        id: `image-${Date.now()}`,
        role: "assistant",
        content: imageUrl,
        type: "image",
        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, imageMessage]);
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : "Image generation is temporarily unavailable.");
    } finally {
      setIsGeneratingImage(false);
    }
  }

  function isImageRequest(text: string) {
    const normalized = text.toLowerCase();
    return [
      "图片",
      "照片",
      "自拍",
      "照",
      "photo",
      "picture",
      "selfie",
      "image",
      "generate image",
      "send me a photo",
    ].some((keyword) => normalized.includes(keyword));
  }

  return (
    <section className="px-4 py-8 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[22rem_1fr]">
        <aside className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
          <img src={character.avatarUrl} alt={character.name} className="aspect-[4/5] rounded-[1.5rem] object-cover" />
          <h1 className="mt-5 text-3xl font-semibold text-white">{character.name}</h1>
          <p className="mt-2 text-sm leading-6 text-rose-100/65">{character.shortIntro}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-rose-100/70">
            <div className="rounded-2xl bg-white/[0.06] p-3">Trial: {Math.min(userMessageCount, 5)}/5</div>
            <div className="rounded-2xl bg-white/[0.06] p-3">NSFW: Off</div>
            <div className="rounded-2xl bg-white/[0.06] p-3">Images: Volcengine</div>
            <div className="rounded-2xl bg-white/[0.06] p-3">Watermark: Off</div>
          </div>
        </aside>
        <div className="flex min-h-[42rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#130B1F]/80 shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
          <div className="border-b border-white/10 px-6 py-4">
            <p className="text-sm font-semibold text-white">Private chat with {character.name.split(" ")[0]}</p>
            <p className="text-xs text-rose-100/55">Live AI conversation · FreedomStore chat · Volcengine images</p>
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            {messages.map((message) => (
              <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                {message.type === "image" ? (
                  <div className="max-w-[78%] overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-2">
                    <img src={message.content} alt={`${character.name} generated companion image`} className="max-h-[32rem] w-full rounded-[1.25rem] object-cover" />
                  </div>
                ) : (
                  <div className={message.role === "user" ? "max-w-[78%] rounded-[1.5rem] bg-rose-200 px-5 py-3 text-sm leading-6 text-[#130B1F]" : "max-w-[78%] rounded-[1.5rem] border border-white/10 bg-white/[0.07] px-5 py-3 text-sm leading-6 text-rose-50"}>
                    {message.content}
                  </div>
                )}
              </div>
            ))}
            {isSending ? (
              <div className="flex justify-start">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] px-5 py-3 text-sm text-rose-100/60">
                  {character.name.split(" ")[0]} is typing...
                </div>
              </div>
            ) : null}
            {isGeneratingImage ? (
              <div className="flex justify-start">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] px-5 py-3 text-sm text-rose-100/60">
                  Creating a private image...
                </div>
              </div>
            ) : null}
            {error ? (
              <div className="rounded-[1.5rem] border border-red-300/25 bg-red-400/10 p-4 text-sm text-red-100">
                {error}
              </div>
            ) : null}
            {trialEnded ? (
              <div className="rounded-[1.5rem] border border-rose-200/25 bg-rose-300/10 p-5 text-center">
                <p className="font-semibold text-white">Your guest trial is complete.</p>
                <p className="mt-2 text-sm text-rose-100/70">Create an account to keep chatting, save memory, and unlock premium companions.</p>
                <Link href="/login" className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#130B1F]">Continue</Link>
              </div>
            ) : null}
          </div>
          <div className="border-t border-white/10 p-4">
            <div className="flex gap-3">
              <button onClick={() => void generateImage()} disabled={trialEnded || isBusy} className="hidden rounded-full border border-white/10 px-4 text-sm text-rose-100/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:block">
                {isGeneratingImage ? "Creating" : "Generate image"}
              </button>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void sendMessage();
                }}
                disabled={trialEnded || isBusy}
                placeholder={trialEnded ? "Sign in to continue..." : "Write a private message..."}
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white outline-none placeholder:text-rose-100/35 focus:border-rose-200/50 disabled:opacity-60"
              />
              <button onClick={() => void sendMessage()} disabled={trialEnded || isBusy} className="rounded-full bg-gradient-to-r from-rose-300 to-violet-500 px-6 py-3 text-sm font-bold text-[#130B1F] disabled:cursor-not-allowed disabled:opacity-50">
                {isSending ? "Sending" : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
