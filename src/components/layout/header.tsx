import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { authOptions } from "@/lib/auth";

export async function Header() {
  const session = await getServerSession(authOptions);

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
        {session ? (
          <div className="flex items-center gap-3">
            <Link href="/account" className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] py-1.5 pl-1.5 pr-4 transition hover:border-rose-200/50 hover:bg-white/[0.1] sm:flex">
              {session.user?.image ? (
                <Image
                  alt={session.user.name ?? "User avatar"}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-rose-200/40"
                  height={32}
                  src={session.user.image}
                  unoptimized
                  width={32}
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-violet-400 text-xs font-bold text-[#130B1F] ring-1 ring-rose-200/40">
                  {(session.user?.name ?? session.user?.email ?? "U").charAt(0).toUpperCase()}
                </span>
              )}
              <span className="max-w-28 truncate text-sm font-semibold text-white">
                {session.user?.name ?? session.user?.email ?? "My Profile"}
              </span>
            </Link>
            <SignOutButton />
          </div>
        ) : (
          <Link href="/login" className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white transition hover:border-rose-200/60 hover:bg-white/10">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
