export function WhyLovia() {
  const items = [
    ["Private by design", "A personal companion space that feels intimate without becoming loud or cheap."],
    ["She remembers", "Mocked memory cues show how each character can feel closer over time."],
    ["Role-first experience", "The product starts with chemistry, not dashboards or configuration."],
  ];

  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-[#130B1F]/80 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.35)] md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-200/60">Why Lovia.ai</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white">A midnight room for romantic AI companionship.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map(([title, body]) => (
            <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-rose-100/65">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
