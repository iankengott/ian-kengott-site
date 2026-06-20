"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Radio } from "lucide-react";
import { PROFILE, CURRENTLY } from "@/lib/data";

export function SessionStrip() {
  return (
    <section
      className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12"
      aria-label="Research sessions"
    >
      <div className="glass relative overflow-hidden rounded-2xl border border-border/70 p-6 sm:p-8">
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--copper)]/10 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow mb-2">Live Research Workspace</p>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Research sessions, notes, and running work
            </h2>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative inline-flex h-2 w-2">
                <span className="status-pulse absolute inset-0 rounded-full" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--jade)]" />
              </span>
              Open my active session index for the research workspace and related
              technical runs.
            </p>
            <CurrentlyTicker />
          </div>
          <a
            href={PROFILE.sessions}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
          >
            Open sessions
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Rotating "currently on the bench" ticker. Cycles through CURRENTLY items
 * with a fade/slide every 3.4s. Pauses on hover and respects reduced motion.
 */
function CurrentlyTicker() {
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reduce = React.useRef(false);

  React.useEffect(() => {
    reduce.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce.current) return;
    const id = setInterval(() => {
      if (!paused) setIdx((i) => (i + 1) % CURRENTLY.length);
    }, 3400);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="mt-4 flex items-center gap-2 font-mono text-[12px] text-muted-foreground"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Radio className="h-3.5 w-3.5 text-[var(--copper)]" />
      <span className="uppercase tracking-[0.18em] text-muted-foreground/70">
        Currently
      </span>
      <span className="text-muted-foreground/40">/</span>
      <span className="relative inline-flex h-4 min-w-[12rem] overflow-hidden sm:min-w-[16rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center text-foreground/80"
          >
            {CURRENTLY[idx]}
          </motion.span>
        </AnimatePresence>
      </span>
      {/* position dots */}
      <span className="ml-1 hidden items-center gap-1 sm:inline-flex">
        {CURRENTLY.map((_, i) => (
          <span
            key={i}
            className={`h-1 w-1 rounded-full transition-colors ${
              i === idx
                ? "bg-[var(--copper)]"
                : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </span>
    </div>
  );
}
