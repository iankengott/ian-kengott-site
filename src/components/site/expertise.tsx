"use client";

import { motion } from "framer-motion";
import {
  Gauge,
  Wrench,
  ScanLine,
  Waves,
  Package,
  Bot,
  Server,
  Braces,
  type LucideIcon,
} from "lucide-react";
import { EXPERTISE, TOOLING } from "@/lib/data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const ICONS: Record<string, LucideIcon> = {
  ScanLine,
  Waves,
  Package,
  Bot,
  Server,
  Braces,
};

export function Expertise() {
  return (
    <section
      id="expertise"
      className="border-y border-border/60 bg-card/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left: heading + tooling chips */}
          <Reveal>
            <p className="eyebrow mb-2 flex items-center gap-2">
              <span className="sec-num">03</span>
              <Gauge className="h-3.5 w-3.5" />
              Expertise
            </p>
            <SectionHeading id="expertise" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Working strengths.
            </SectionHeading>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              A qualitative map of the domains I keep returning to: lab support,
              research tooling, reproducible environments, and the systems work
              underneath them.
            </p>

            <div className="mt-8">
              <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <Wrench className="h-3.5 w-3.5 text-[var(--copper)]" />
                Tooling
              </p>
              <div className="flex flex-wrap gap-2">
                {TOOLING.map((tool, i) => (
                  <motion.span
                    key={tool}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="chip-lift chip-glass cursor-default rounded-full px-3 py-1.5 font-mono text-xs text-foreground/80"
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: qualitative strengths */}
          <Reveal delay={0.08}>
            <div className="flex flex-col gap-5">
              {EXPERTISE.map((skill, i) => (
                <SkillBar
                  key={skill.label}
                  label={skill.label}
                  depth={skill.depth}
                  note={skill.note}
                  icon={skill.icon}
                  index={i}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SkillBar({
  label,
  depth,
  note,
  icon,
  index,
}: {
  label: string;
  depth: string;
  note: string;
  icon: string;
  index: number;
}) {
  const Icon = ICONS[icon] ?? Gauge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="mb-1.5 flex items-center gap-3">
        <span className="expertise-icon" aria-hidden>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="flex flex-1 items-baseline justify-between gap-3">
          <span className="font-display text-base font-medium tracking-tight">
            {label}
          </span>
          <span className="mono-accent rounded-full border border-[var(--copper)]/25 bg-[var(--copper)]/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
            {depth}
          </span>
        </div>
      </div>
      <div className="pl-[2.5rem]">
        <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">{note}</p>
      </div>
    </motion.div>
  );
}
