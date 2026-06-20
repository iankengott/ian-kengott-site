"use client";

import { motion } from "framer-motion";
import {
  Wrench,
  Sparkles,
  Anchor,
  ShieldCheck,
  Workflow,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { PRINCIPLES } from "@/lib/data";
import { Reveal, RevealGroup, RevealItem } from "./reveal";
import { SectionHeading } from "./section-heading";

const ICONS: Record<string, LucideIcon> = {
  Wrench,
  Sparkles,
  Anchor,
  ShieldCheck,
  Workflow,
};

export function Principles() {
  return (
    <section id="principles" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow mb-2 flex items-center gap-2">
            <span className="sec-num">07</span>
            Principles
          </p>
          <SectionHeading id="principles" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Build, verify, simplify.
          </SectionHeading>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            The operating rules I try to keep — taste, restraint, and respect for
            the work.
          </p>

          {/* Domain legend chips */}
          <div className="mt-8 hidden flex-wrap gap-1.5 lg:flex">
            {["Engineering", "Process", "Ethics", "Operations"].map((d) => (
              <span
                key={d}
                className="rounded-full border border-border/60 bg-card/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Oversized pull-quote mark as a decorative anchor */}
          <div aria-hidden className="mt-10 hidden lg:block">
            <span className="quote-mark">“</span>
          </div>
        </Reveal>

        <RevealGroup className="flex flex-col gap-3">
          {PRINCIPLES.map((p, i) => {
            const Icon = ICONS[p.icon] ?? Wrench;
            return (
              <RevealItem key={p.title}>
                <motion.article
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="principle-card group relative overflow-hidden rounded-xl border border-border/60 bg-card/40 p-5 sm:p-6"
                >
                  {/* left copper rail that grows on hover */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-gradient-to-b from-[var(--copper)] to-transparent transition-transform duration-500 group-hover:scale-y-100"
                  />
                  {/* hover copper glow */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(120% 80% at 0% 50%, color-mix(in oklch, var(--copper) 7%, transparent), transparent 60%)",
                    }}
                  />

                  <div className="relative z-10 flex items-start gap-4 sm:gap-5">
                    {/* icon disc */}
                    <span className="principle-icon" aria-hidden>
                      <Icon className="h-4 w-4" />
                    </span>

                    {/* body */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="principle-ord font-display text-xl font-semibold tabular-nums sm:text-2xl">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-lg font-medium tracking-tight transition-colors group-hover:text-[var(--copper)]">
                          {p.title}
                        </h3>
                        <span className="principle-domain ml-auto rounded-full border border-border/60 bg-background/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/80 transition-colors group-hover:border-[var(--copper)]/40 group-hover:text-[var(--copper)]">
                          {p.domain}
                        </span>
                      </div>
                      <p className="mt-1.5 leading-relaxed text-muted-foreground">
                        {p.body}
                      </p>
                      <p className="mt-1.5 border-l border-border/60 pl-3 font-mono text-[11px] italic leading-relaxed text-muted-foreground/70">
                        {p.detail}
                      </p>
                    </div>

                    {/* chevron */}
                    <ChevronRight
                      className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--copper)]"
                      aria-hidden
                    />
                  </div>
                </motion.article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
