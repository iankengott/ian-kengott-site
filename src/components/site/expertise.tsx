"use client";

import { useRef } from "react";
import { useInView, motion } from "framer-motion";
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
import { GitHubHeatmap } from "./github-heatmap";

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
              Where the hours went.
            </SectionHeading>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              Honest self-assessment across the domains this site draws on. High
              where the reps are real, modest where the work is still maturing.
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

          {/* Right: proficiency bars */}
          <Reveal delay={0.08}>
            <div className="flex flex-col gap-5">
              {EXPERTISE.map((skill, i) => (
                <SkillBar
                  key={skill.label}
                  label={skill.label}
                  level={skill.level}
                  note={skill.note}
                  icon={skill.icon}
                  index={i}
                />
              ))}
            </div>
          </Reveal>
        </div>

        {/* Live GitHub contribution heatmap — spans full width below */}
        <Reveal delay={0.12} className="mt-14">
          <GitHubHeatmap />
        </Reveal>
      </div>
    </section>
  );
}

function SkillBar({
  label,
  level,
  note,
  icon,
  index,
}: {
  label: string;
  level: number;
  note: string;
  icon: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = ICONS[icon] ?? Gauge;

  return (
    <div ref={ref} className="group">
      <div className="mb-1.5 flex items-center gap-3">
        <span className="expertise-icon" aria-hidden>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="flex flex-1 items-baseline justify-between gap-3">
          <span className="font-display text-base font-medium tracking-tight">
            {label}
          </span>
          <span className="mono-accent text-sm font-semibold tabular-nums">
            {inView ? level : 0}
            <span className="text-muted-foreground/60">%</span>
          </span>
        </div>
      </div>
      <div className="pl-[2.5rem]">
        <div className="skill-bar-track">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${level}%` } : { width: 0 }}
            transition={{
              duration: 1.1,
              delay: 0.15 + index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="skill-bar-fill"
          />
        </div>
        <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}
