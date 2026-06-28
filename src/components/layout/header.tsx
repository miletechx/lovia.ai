import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08060D]/75 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200/30 bg-white/10 text-sm font-semibold text-rose-100 shadow-[0_0_30px_rgba(184,92,142,0.45)]">
            L
          </span>
          <div>
            <p className="text-base font-semibold tracking-[0.22em] text-white">LOVIA</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-rose-200/70">private ai companion</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-rose-100/75 md:flex">
          <Link href="/characters" className="transition hover:text-white">Girlfriends</Link>
          <Link href="/pricing" className="transition hover:text-white">Premium</Link>
          <Link href="/account" className="transition hover:text-white">Account</Link>
        </nav>
        <Link href="/login" className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white transition hover:border-rose-200/60 hover:bg-white/10">
          Sign in
        </Link>
      </div>
    </header>
  );
}
