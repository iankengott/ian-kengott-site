"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Sparkles, MapPin } from "lucide-react";
import { MagneticFieldCanvas } from "./magnetic-field";
import { PROFILE } from "@/lib/data";

export function Hero() {
  const heroRef = React.useRef<HTMLElement | null>(null);
  const [ringPaused, setRingPaused] = React.useState(false);

  // Pause the rotating profile ring when the hero is off-screen (perf).
  React.useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setRingPaused(!e.isIntersecting);
        }
      },
      { rootMargin: "0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={heroRef}
      id="top"
      className="relative isolate overflow-hidden pb-20 pt-28 sm:pt-36"
    >
      {/* Field canvas backdrop */}
      <div className="absolute inset-0 -z-10">
        <MagneticFieldCanvas />
        {/* layered copper aurora for depth (radial blooms top-left + bottom-right) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(42% 38% at 18% 22%, color-mix(in oklch, var(--copper) 14%, transparent), transparent 70%), radial-gradient(36% 32% at 84% 78%, color-mix(in oklch, var(--copper) 10%, transparent), transparent 72%)",
          }}
        />
        {/* top + bottom fades for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
        {/* edge vignette to focus the eye center */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 40%, transparent 55%, color-mix(in oklch, var(--background) 60%, transparent))",
          }}
        />
      </div>

      {/* faint grid */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 35%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 35%, black, transparent)",
          color: "var(--foreground)",
        }}
      />

      {/* Scientific-instrument corner reticle */}
      <div className="hero-frame" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        {/* Copy */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-5 flex flex-wrap items-center gap-x-2.5 gap-y-1"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{PROFILE.eyebrow}</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground/70">
              <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--copper)]/70" />
              <MapPin className="h-3 w-3" />
              Tampa, FL
            </span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl font-semibold leading-[0.98] tracking-[-0.02em] text-balance sm:text-6xl lg:text-7xl"
          >
            <span className="hero-name-wrap">
              <span className="name-gradient">{PROFILE.name}</span>
            </span>
          </motion.h1>

          {/* Copper accent underline — draws out on mount */}
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: "3rem" }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="hero-name-underline"
            aria-hidden
          />

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance"
          >
            {PROFILE.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href={PROFILE.sessions}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--copper)] px-5 py-2.5 text-sm font-medium text-[var(--copper-foreground)] shadow-[0_10px_40px_-12px_var(--copper)] transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              Open research sessions
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              href="#research"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-[var(--copper)]/50 hover:text-[var(--copper)]"
            >
              Research work
            </Link>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </div>

        {/* Profile panel */}
        <motion.aside
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`profile-ring glass relative mx-auto w-full max-w-sm rounded-2xl border border-border/80 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] ${
            ringPaused ? "ring-paused" : ""
          }`}
          aria-label="Profile summary"
        >
          <div className="relative z-10">
            <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full border border-border bg-card" />
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={PROFILE.avatar}
                  alt={`${PROFILE.name} avatar`}
                  className="h-16 w-16 rounded-xl border border-border object-cover"
                />
                <span className="absolute -bottom-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-[var(--jade)]">
                  <span className="status-pulse absolute inset-0 rounded-full" />
                </span>
              </div>
              <div>
                <p className="font-display text-lg font-medium tracking-tight">
                  {PROFILE.name}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  USF Physics · Research Software
                </p>
              </div>
            </div>

            <div className="my-4 rule-copper" />

            <p className="text-xs uppercase tracking-[0.2em] text-[var(--copper)]">
              Research focus
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              {PROFILE.focus}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["Magnonics", "spin"],
                ["Muon", "detector"],
                ["MANTiS", "x-ray"],
              ].map(([a, b]) => (
                <div
                  key={a}
                  className="rounded-lg border border-border/70 bg-card/40 px-2 py-2"
                >
                  <p className="font-display text-sm font-medium">{a}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="mt-16 flex justify-center"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-border p-1">
            <motion.span
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1 rounded-full bg-[var(--copper)]"
            />
          </div>
        </div>
      </motion.div>
    </header>
  );
}
