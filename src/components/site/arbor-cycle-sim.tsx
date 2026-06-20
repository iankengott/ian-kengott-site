"use client";

import * as React from "react";
import { motion } from "framer-motion";

const STEPS = [
  {
    label: "Observe",
    detail: "Re-ground in the idea tree, constraints, evidence, and current best artifact.",
  },
  {
    label: "Ideate",
    detail: "Propose child hypotheses that refine, correct, or extend prior branches.",
  },
  {
    label: "Select",
    detail: "Choose promising pending leaves while keeping alternatives alive.",
  },
  {
    label: "Dispatch",
    detail: "Send hypotheses to executors working in isolated git worktrees.",
  },
  {
    label: "Backpropagate",
    detail: "Record scores, branches, and lessons so future ideas inherit evidence.",
  },
  {
    label: "Decide",
    detail: "Merge, prune, continue, leave pending, or stop using validation discipline.",
  },
] as const;

export function ArborCycleSim() {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % STEPS.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="arbor-sim rounded-xl border border-border/60 bg-card/40 p-4">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--copper)]">
            Arbor cycle visualization
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Accurate to the public README cycle; not live benchmark output.
          </p>
        </div>
        <span className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          step {active + 1} / {STEPS.length}
        </span>
      </div>

      <div className="relative grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative aspect-square min-h-64 overflow-hidden rounded-lg border border-border/60 bg-background/35">
          <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-label="Animated Arbor hypothesis tree">
            <defs>
              <radialGradient id="arborGlow" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="var(--copper)" stopOpacity="0.24" />
                <stop offset="100%" stopColor="var(--copper)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="160" cy="160" r="126" fill="url(#arborGlow)" />
            <path d="M160 255V156M160 156l-58-46M160 156l62-48M160 156l-52 58M160 156l54 60" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" fill="none" />
            {[
              [160, 255, "root"],
              [160, 156, "best"],
              [102, 110, "branch"],
              [222, 108, "branch"],
              [108, 214, "pruned"],
              [214, 216, "pending"],
            ].map(([x, y, kind], i) => {
              const isHot = i === (active % 6);
              return (
                <motion.g key={`${x}-${y}`} animate={{ scale: isHot ? 1.08 : 1 }} style={{ transformOrigin: `${x}px ${y}px` }}>
                  <circle
                    cx={Number(x)}
                    cy={Number(y)}
                    r={kind === "root" ? 13 : 10}
                    fill={isHot ? "var(--copper)" : "var(--background)"}
                    stroke="var(--copper)"
                    strokeOpacity={kind === "pruned" ? 0.45 : 0.9}
                    strokeWidth="2"
                  />
                  {kind === "pruned" && (
                    <path d={`M${Number(x) - 5} ${Number(y) - 5}l10 10M${Number(x) + 5} ${Number(y) - 5}l-10 10`} stroke="var(--copper)" strokeWidth="1.5" />
                  )}
                </motion.g>
              );
            })}
          </svg>
        </div>

        <div className="grid gap-2">
          {STEPS.map((step, i) => {
            const isActive = i === active;
            return (
              <button
                key={step.label}
                type="button"
                onClick={() => setActive(i)}
                className="group relative overflow-hidden rounded-lg border border-border/60 bg-background/35 p-3 text-left transition-colors hover:border-[var(--copper)]/45"
                aria-pressed={isActive}
              >
                {isActive && (
                  <motion.span
                    layoutId="arbor-active-step"
                    className="absolute inset-0 bg-[var(--copper)]/10"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--copper)]/45 font-mono text-[10px] text-[var(--copper)]">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-display text-base font-semibold">{step.label}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                      {step.detail}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
