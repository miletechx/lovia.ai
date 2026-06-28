import { CharacterCard } from "@/components/characters/character-card";
import { characters } from "@/lib/characters";

export default function CharactersPage() {
  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-200/60">AI girlfriends</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-white">Meet your private companion.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-rose-100/70">
          Browse twelve adult AI companions designed for different romantic moods, from sweet first messages to premium fantasy chemistry.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {['All', 'Free', 'Premium', 'Sweet', 'Fantasy', 'Elegant'].map((filter) => (
            <span key={filter} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-rose-100/75">
              {filter}
            </span>
          ))}
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </div>
    </section>
  );
}
