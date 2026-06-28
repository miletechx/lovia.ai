export default function LoginPage() {
  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-200/60">Sign in</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Keep your private chats.</h1>
        <p className="mt-3 text-sm leading-6 text-rose-100/65">Create an account to save chat history, memory, and premium access.</p>
        <div className="mt-8 space-y-3">
          <button className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#130B1F]">Continue with Google</button>
          <input className="w-full rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white outline-none placeholder:text-rose-100/35" placeholder="Email address" />
          <input className="w-full rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white outline-none placeholder:text-rose-100/35" placeholder="Password" type="password" />
          <button className="w-full rounded-full bg-gradient-to-r from-rose-300 to-violet-500 px-5 py-3 text-sm font-bold text-[#130B1F]">Sign in</button>
        </div>
      </div>
    </section>
  );
}
