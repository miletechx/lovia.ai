export default function PrivacyPage() {
  return <PolicyPage title="Privacy Policy" />;
}

function PolicyPage({ title }: { title: string }) {
  return (
    <section className="px-6 py-16 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 text-rose-100/75">
        <h1 className="text-5xl font-semibold text-white">{title}</h1>
        <p className="mt-6 leading-8">Lovia.ai is an 18+ AI-generated companion experience. The first MVP stores only mock data in the browser and does not connect to a production database yet.</p>
        <p className="mt-4 leading-8">Future versions should allow users to delete chats, long-term memory, generated content, and account data.</p>
      </article>
    </section>
  );
}
