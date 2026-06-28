import Link from "next/link";
import { notFound } from "next/navigation";
import { getCharacter } from "@/lib/characters";

export default async function CharacterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = getCharacter(id);

  if (!character) notFound();

  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.06]">
          <img src={character.avatarUrl} alt={character.name} className="aspect-[4/5] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08060D] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 flex gap-2">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#130B1F]">{character.isPremium ? "Premium" : "Free"}</span>
            <span className="rounded-full bg-black/50 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">{character.age}+</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-200/60">Private profile</p>
          <h1 className="mt-4 text-6xl font-semibold tracking-[-0.05em] text-white">{character.name}</h1>
          <p className="mt-6 text-xl leading-9 text-rose-100/75">{character.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[...character.personalityTags, ...character.relationshipTags, ...character.visualTags].map((tag, index) => (
              <span key={`${tag}-${index}`} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-rose-100/75">{tag}</span>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href={`/chat/${character.id}`} className="rounded-full bg-gradient-to-r from-rose-300 via-pink-400 to-violet-500 px-8 py-3.5 text-center text-sm font-bold text-[#130B1F]">
              Start chat with {character.name.split(" ")[0]}
            </Link>
            <Link href="/pricing" className="rounded-full border border-white/15 px-8 py-3.5 text-center text-sm font-semibold text-white hover:bg-white/10">
              View premium
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
