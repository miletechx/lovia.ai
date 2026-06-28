import { notFound } from "next/navigation";
import { ChatClient } from "@/components/chat/chat-client";
import { getCharacter } from "@/lib/characters";

export default async function ChatPage({ params }: { params: Promise<{ characterId: string }> }) {
  const { characterId } = await params;
  const character = getCharacter(characterId);

  if (!character) notFound();

  return <ChatClient character={character} />;
}
