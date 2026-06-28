import Link from "next/link";
import { featuredCharacters } from "@/lib/characters";
import { CharacterCard } from "@/components/characters/character-card";

export function FeaturedCharacters() {
  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-200/60">Featured girlfriends</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">Choose the energy you want tonight.</h2>
          </div>
          <Link href="/characters" className="text-sm font-semibold text-rose-200 hover:text-white">View all characters →</Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCharacters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </div>
    </section>
  );
}
