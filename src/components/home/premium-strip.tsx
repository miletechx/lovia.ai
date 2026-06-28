export function PremiumStrip() {
  const free = ["5 guest messages", "30 daily free messages", "Basic memory", "Free characters only"];
  const premium = ["Premium girlfriends", "Unlimited private chats", "20 images per day", "Deeper memory"];

  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <PlanCard title="Free" price="$0" items={free} muted />
        <PlanCard title="Premium" price="$14.99/mo" items={premium} />
      </div>
    </section>
  );
}

function PlanCard({ title, price, items, muted = false }: { title: string; price: string; items: string[]; muted?: boolean }) {
  return (
    <div className={muted ? "rounded-[2rem] border border-white/10 bg-white/[0.04] p-8" : "relative overflow-hidden rounded-[2rem] border border-rose-200/25 bg-gradient-to-br from-white/[0.14] to-rose-300/[0.06] p-8 shadow-[0_30px_100px_rgba(184,92,142,0.25)]"}>
      {!muted ? <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-400/25 blur-3xl" /> : null}
      <div className="relative">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-200/70">{title}</p>
        <h3 className="mt-4 text-4xl font-semibold text-white">{price}</h3>
        <ul className="mt-6 space-y-3 text-rose-100/75">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-rose-300" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
