"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import { STATS } from "@/lib/data";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 0 : 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

const MARQUEE_ITEMS = [
  "Magnonics",
  "Spin Dynamics",
  "MANTiS",
  "X-ray Spectromicroscopy",
  "Muon Telescope",
  "Nix Packaging",
  "Reproducible Research",
  "Self-hosted Memory",
  "Research Automation",
  "Hyperspectral",
];

export function Stats() {
  return (
    <section className="relative border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 divide-x divide-y divide-border/60 sm:grid-cols-4 sm:divide-y-0">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="px-5 py-7 sm:py-9"
            >
              <p className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-foreground/80">
                {s.label}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                {s.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden border-t border-border/60 py-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="mx-6 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              <span className="stats-divider" aria-hidden />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
