import Link from "next/link";

const benefits = [
  "Unlock premium AI girlfriends",
  "Unlimited private chats",
  "Generate up to 20 images per day",
  "Deeper memory and more personal conversations",
  "More intimate companion experience",
];

export default function PricingPage() {
  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-200/60">Premium</p>
        <h1 className="mt-4 text-6xl font-semibold tracking-[-0.05em] text-white">Go deeper with Lovia Premium.</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-rose-100/70">
          One simple monthly plan for premium companions, unlimited private chats, stronger memory, and daily image generation.
        </p>
        <div className="mx-auto mt-12 max-w-xl rounded-[2.5rem] border border-rose-200/25 bg-white/[0.08] p-8 text-left shadow-[0_30px_120px_rgba(184,92,142,0.28)]">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-200/70">Monthly plan</p>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-6xl font-semibold text-white">$14.99</span>
            <span className="pb-3 text-rose-100/60">/ month</span>
          </div>
          <ul className="mt-8 space-y-4 text-rose-100/75">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-rose-300" />{benefit}</li>
            ))}
          </ul>
          <Link href="/login" className="mt-8 block rounded-full bg-gradient-to-r from-rose-300 via-pink-400 to-violet-500 px-7 py-4 text-center text-sm font-bold text-[#130B1F]">
            Upgrade to Premium
          </Link>
        </div>
      </div>
    </section>
  );
}
