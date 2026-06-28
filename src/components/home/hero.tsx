import Link from "next/link";
import { featuredCharacters } from "@/lib/characters";
import { CharacterCard } from "@/components/characters/character-card";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-16 lg:px-8 lg:py-24">
      <div className="absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-rose-200/70">Adult AI companion · 18+</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-7xl">
            Your Private AI Companion, Always Here for You
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-rose-100/72">
            Meet stunning AI girlfriends who listen, remember, and grow closer with every conversation.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/characters" className="rounded-full bg-gradient-to-r from-rose-300 via-pink-400 to-violet-500 px-7 py-3.5 text-center text-sm font-bold text-[#130B1F] shadow-[0_16px_60px_rgba(184,92,142,0.45)] transition hover:scale-[1.02]">
              Start Chatting
            </Link>
            <Link href="/pricing" className="rounded-full border border-white/15 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10">
              Unlock Premium
            </Link>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-center">
            {[
              ["5", "free trial messages"],
              ["12", "AI girlfriends"],
              ["20", "premium images/day"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
                <p className="text-2xl font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs text-rose-100/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3">
          {featuredCharacters.slice(0, 6).map((character, index) => (
            <div key={character.id} className={index % 2 === 1 ? "translate-y-8" : ""}>
              <CharacterCard character={character} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
