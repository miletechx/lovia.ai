"use client";

import { useEffect, useState } from "react";

export function AgeGate() {
  const [visible, setVisible] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const confirmed = window.localStorage.getItem("lovia-age-confirmed");
      setVisible(confirmed !== "true");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08060D]/90 px-6 backdrop-blur-xl">
      <div className="relative max-w-lg overflow-hidden rounded-[2rem] border border-white/15 bg-[#130B1F] p-8 text-center shadow-[0_30px_120px_rgba(184,92,142,0.35)]">
        <div className="absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-rose-400/25 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-200/70">Age Verification</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white">Adults only</h2>
          <p className="mt-4 text-base leading-7 text-rose-100/75">
            Lovia.ai is intended for adults only. By entering, you confirm that you are 18 years or older and agree to view AI-generated companion content.
          </p>
          {blocked ? (
            <p className="mt-6 rounded-2xl border border-rose-300/20 bg-white/5 p-4 text-sm text-rose-100">
              Access is unavailable unless you confirm you are 18 or older.
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className="flex-1 rounded-full bg-gradient-to-r from-rose-300 via-pink-400 to-violet-500 px-6 py-3 text-sm font-semibold text-[#130B1F] shadow-[0_12px_50px_rgba(184,92,142,0.45)] transition hover:scale-[1.02]"
              onClick={() => {
                window.localStorage.setItem("lovia-age-confirmed", "true");
                setVisible(false);
              }}
            >
              Enter Lovia.ai
            </button>
            <button
              className="flex-1 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              onClick={() => setBlocked(true)}
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
