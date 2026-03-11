import { CivicLayout } from "@/components/layout/civic-layout";

export default function Home() {
  return (
    <CivicLayout>
      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
          <h2 className="text-2xl font-semibold">Welcome to Civichelp Desk</h2>
          <p className="mt-3 text-zinc-300">
            Manage citizen issues from WhatsApp intake to closure with a unified
            desk for triage, assignment, and follow-up.
          </p>
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            Active queue: 24 open cases · 7 pending SLA review · 3 escalations
          </div>
        </article>

        <aside className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-medium">Quick Actions</h3>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>• Create new case</li>
            <li>• Assign field officer</li>
            <li>• Send citizen update</li>
            <li>• Export daily report</li>
          </ul>
        </aside>
      </section>
    </CivicLayout>
  );
}
