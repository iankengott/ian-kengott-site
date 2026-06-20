import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

/**
 * Custom 404 page — on-theme with the Scientific Atelier aesthetic.
 * Uses a faint magnetic-field motif (CSS-only) and a clear path home.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24">
      {/* Faint dipole-field motif via radial gradients */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.07] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(40% 60% at 22% 50%, color-mix(in oklch, var(--copper) 60%, transparent), transparent 70%), radial-gradient(40% 60% at 78% 50%, color-mix(in oklch, var(--jade) 50%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)",
          color: "var(--foreground)",
        }}
      />

      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/60 text-[var(--copper)]">
          <Compass className="h-5 w-5" />
        </div>

        <p className="eyebrow mb-4">Field out of range</p>

        <h1 className="font-display text-7xl font-semibold leading-none tracking-tight text-balance sm:text-8xl">
          <span className="name-gradient">404</span>
        </h1>

        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
          The page you tried to reach isn&apos;t part of the workspace. The
          field lines don&apos;t go there — but the home page does.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--copper)] px-5 py-2.5 text-sm font-medium text-[var(--copper-foreground)] shadow-[0_10px_40px_-12px_var(--copper)] transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to the lab
          </Link>
          <Link
            href="/#research"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-[var(--copper)]/50 hover:text-[var(--copper)]"
          >
            Jump to research
          </Link>
        </div>

        <div className="rule-copper mt-12 w-full" />

        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Ian Kengott · USF Physics · Research Software
        </p>
      </div>
    </main>
  );
}
