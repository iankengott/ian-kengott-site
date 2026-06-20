"use client";

import { motion } from "framer-motion";
import { Route, Circle, Activity, RefreshCw, History } from "lucide-react";
import { TIMELINE } from "@/lib/data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const STATUS_ICON: Record<string, typeof Circle> = {
  now: Activity,
  active: Circle,
  ongoing: RefreshCw,
  earlier: History,
};

const STATUS_LABEL: Record<string, string> = {
  now: "Live",
  active: "Active",
  ongoing: "Ongoing",
  earlier: "Archive",
};

export function Timeline() {
  return (
    <section
      id="journey"
      className="border-y border-border/60 bg-card/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-2 flex items-center gap-2">
            <span className="sec-num">05</span>
            <Route className="h-3.5 w-3.5" />
            Journey
          </p>
          <SectionHeading id="journey" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            A research path, kept honest.
          </SectionHeading>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Threads that are running now, and the groundwork underneath them.
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
            {TIMELINE.length} threads · most recent first
          </p>
        </Reveal>

        <div className="relative mt-12 pl-6 sm:pl-8">
          {/* vertical line — copper-gradient spine with animated signal trace */}
          <div
            aria-hidden
            className="tl-spine absolute left-0 top-2 h-full w-px"
          />
          {/* start cap — small copper tick at the top of the spine */}
          <div
            aria-hidden
            className="absolute -left-0.5 top-0 h-2 w-2 rotate-45 rounded-[2px] border border-[var(--copper)] bg-[var(--copper)]/20"
          />
          <ol className="flex flex-col gap-10">
            {TIMELINE.map((item, i) => {
              const StatusIcon = STATUS_ICON[item.status] ?? Circle;
              return (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                  className="group relative"
                >
                  {/* ordinal — appears on hover (desktop only via .tl-ord) */}
                  <span className="tl-ord">
                    {String(i + 1).padStart(2, "0")} / {String(TIMELINE.length).padStart(2, "0")}
                  </span>
                  {/* node — 3D copper sphere with hover ring burst */}
                  <span className="absolute -left-[1.55rem] top-1.5 flex h-3 w-3 items-center justify-center sm:-left-[2.05rem]">
                    <span className="tl-node-burst" aria-hidden />
                    <span className="absolute inset-0 rounded-full bg-[var(--copper)]/30 transition-opacity duration-300 group-hover:opacity-60" />
                    <span className="tl-node relative h-2 w-2 rounded-full" />
                  </span>
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="tl-year w-24 shrink-0 font-mono text-xs uppercase tracking-[0.18em] text-[var(--copper)] transition-colors group-hover:text-[var(--copper)]">
                      {item.year}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-[var(--copper)]">
                          {item.title}
                        </h3>
                        {/* status badge — color-coded by status type */}
                        <span
                          className={`tl-status tl-status-${item.status} inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]`}
                        >
                          <StatusIcon className={`h-2.5 w-2.5 ${item.status === "ongoing" ? "animate-spin-slow" : ""}`} />
                          {STATUS_LABEL[item.status]}
                        </span>
                        <span className="tl-tag rounded-full border border-border/60 bg-background/50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground group-hover:text-[var(--copper)]">
                          {item.tag}
                        </span>
                      </div>
                      <p className="mt-1 max-w-2xl leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
