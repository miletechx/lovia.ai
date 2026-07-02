"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const callbackUrl = "/";
  const [mode, setMode] = useState<"sign-in" | "register">("sign-in");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password, turnstileToken }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error ?? "Registration failed.");
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 space-y-3">
      <button
        className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#130B1F] transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading || !googleEnabled}
        onClick={() => signIn("google", { callbackUrl })}
        type="button"
      >
        {googleEnabled ? "Continue with Google" : "Google login not configured"}
      </button>
      {!googleEnabled ? <p className="text-center text-xs text-rose-100/55">Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local first.</p> : null}

      <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-1 text-sm">
        <button
          className={`flex-1 rounded-full px-4 py-2 font-semibold transition ${mode === "sign-in" ? "bg-white text-[#130B1F]" : "text-rose-100/70"}`}
          onClick={() => setMode("sign-in")}
          type="button"
        >
          Sign in
        </button>
        <button
          className={`flex-1 rounded-full px-4 py-2 font-semibold transition ${mode === "register" ? "bg-white text-[#130B1F]" : "text-rose-100/70"}`}
          onClick={() => setMode("register")}
          type="button"
        >
          Register
        </button>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <input
            className="w-full rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white outline-none placeholder:text-rose-100/35"
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            value={username}
          />
        ) : null}
        <input
          className="w-full rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white outline-none placeholder:text-rose-100/35"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          required
          type="email"
          value={email}
        />
        <input
          className="w-full rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white outline-none placeholder:text-rose-100/35"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
          type="password"
          value={password}
        />
        {mode === "register" ? (
          <div className="flex justify-center">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => {
                setTurnstileToken(token);
              }}
            />
          </div>
        ) : null}
        {error ? <p className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
        <button
          className="w-full rounded-full bg-gradient-to-r from-rose-300 to-violet-500 px-5 py-3 text-sm font-bold text-[#130B1F] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Please wait..." : mode === "register" ? "Create account" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
