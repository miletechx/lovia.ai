import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-200/60">Sign in</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Keep your private chats.</h1>
        <p className="mt-3 text-sm leading-6 text-rose-100/65">Create an account to save chat history, memory, and premium access.</p>
        <Suspense fallback={null}>
          <LoginForm googleEnabled={googleEnabled} />
        </Suspense>
      </div>
    </section>
  );
}
