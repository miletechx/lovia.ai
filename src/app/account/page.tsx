import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/account");
  }

  const cards = [
    ["Plan", "Free account · 30 messages/day"],
    ["NSFW mode", "Off by default · enable from settings"],
    ["Memory", "Basic memory active"],
    ["Image generation", "Premium only · 20/day"],
  ];

  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-200/60">Account</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-white">Your private settings.</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cards.map(([title, body]) => (
            <div key={title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm text-rose-100/65">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[1.75rem] border border-rose-300/20 bg-rose-300/10 p-6">
          <h2 className="text-2xl font-semibold text-white">Privacy controls</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {['Delete chats', 'Delete memory', 'Delete account'].map((action) => (
              <button key={action} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">{action}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
