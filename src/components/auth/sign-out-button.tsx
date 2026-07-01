"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white transition hover:border-rose-200/60 hover:bg-white/10"
      onClick={() => signOut({ callbackUrl: "/" })}
      type="button"
    >
      Sign out
    </button>
  );
}
