import Link from "next/link";
import type { Character } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CharacterCard({ character, compact = false }: { character: Character; compact?: boolean }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-rose-200/35 hover:bg-white/[0.09]">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 to-transparent" />
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={character.avatarUrl}
          alt={`${character.name} AI girlfriend portrait`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08060D] via-[#08060D]/10 to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className={cn("rounded-full px-3 py-1 text-xs font-semibold text-[#130B1F]", character.isPremium ? "bg-amber-200" : "bg-emerald-200")}>
            {character.isPremium ? "Premium" : "Free"}
          </span>
          <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">{character.age}+</span>
        </div>
      </div>
      <div className="relative p-5">
        <div className={cn("absolute -top-12 right-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-60 blur-2xl", character.accent)} />
        <h3 className="text-xl font-semibold text-white">{character.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-rose-100/70">{character.shortIntro}</p>
        {!compact ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {[...character.personalityTags.slice(0, 2), character.visualTags[0]].map((tag, index) => (
              <span key={`${tag}-${index}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-rose-100/70">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-5 flex gap-3">
          <Link href={`/chat/${character.id}`} className="flex-1 rounded-full bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#130B1F] transition hover:bg-rose-100">
            Start chat
          </Link>
          <Link href={`/characters/${character.id}`} className="rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
