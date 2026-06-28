import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08060D] px-6 py-10 text-sm text-rose-100/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold tracking-[0.22em] text-white">LOVIA.AI</p>
          <p className="mt-2 max-w-md">Adult AI companion experience. Fictional AI-generated characters only. 18+.</p>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/pricing" className="hover:text-white">Premium</Link>
        </div>
      </div>
    </footer>
  );
}
