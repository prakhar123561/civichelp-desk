import type { ReactNode } from "react";

interface CivicLayoutProps {
  children: ReactNode;
}

export function CivicLayout({ children }: CivicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white">
      <header className="border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
              Civichelp Desk
            </p>
            <h1 className="text-xl font-semibold">Citizen Support Workspace</h1>
          </div>
          <nav className="hidden gap-6 text-sm text-zinc-300 md:flex">
            <span>Dashboard</span>
            <span>Cases</span>
            <span>Escalations</span>
            <span>Reports</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-white/10 py-4 text-center text-xs text-zinc-500">
        Civichelp Desk · Case tracking for welfare and grievance resolution
      </footer>
    </div>
  );
}
