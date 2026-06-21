"use client";

import { motion } from "framer-motion";
import { Bot, Database, Boxes, LayoutDashboard, Radio, Cpu } from "lucide-react";
import { SYSTEMS, NOW_ITEMS } from "@/lib/data";
import { Reveal, RevealGroup, RevealItem } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { SectionHeading } from "./section-heading";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot,
  Database,
  Boxes,
  LayoutDashboard,
};

export function Systems() {
  return (
    <section id="systems" className="border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-2 flex items-center gap-2">
            <span className="sec-num">03</span>
            <Cpu className="h-3.5 w-3.5" />
            AI &amp; Technical Systems
          </p>
          <SectionHeading id="systems" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            AI is support infrastructure here.
          </SectionHeading>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Not a headline — a utility. The work below keeps research legible,
            repeatable, and organized across long-running sessions.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SYSTEMS.map((s, idx) => {
            const Icon = ICONS[s.icon] ?? Bot;
            return (
              <RevealItem key={s.title}>
                <SpotlightCard className="h-full rounded-2xl">
                  <article className="card-lift group relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card/50 p-6">
                    <div
                      aria-hidden
                      className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--copper)]/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0"
                    />
                    <div className="relative">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background/60 text-[var(--copper)] transition-transform duration-300 group-hover:-translate-y-0.5">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {s.body}
                      </p>
                    </div>
                    <span className="absolute bottom-4 right-4 font-mono text-[10px] text-muted-foreground/60">
                      0{idx + 1}
                    </span>
                  </article>
                </SpotlightCard>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <NowSection />
      </div>
    </section>
  );
}

function NowSection() {
  return (
    <Reveal className="mt-16">
      <div className="rounded-2xl border border-border/70 bg-background/50 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="status-pulse absolute inset-0 rounded-full" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--jade)]" />
          </span>
          <p className="eyebrow">Now</p>
          <span className="font-mono text-[11px] text-muted-foreground">
            what I'm actively working on
          </span>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {NOW_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-xl border border-border/60 bg-card/40 p-5"
            >
              <div className="flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-[var(--copper)]" />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </span>
              </div>
              <h4 className="mt-3 font-display text-base font-medium">
                {item.title}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
