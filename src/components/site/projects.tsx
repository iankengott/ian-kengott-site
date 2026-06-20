"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Star, GitFork, FileCode2, GitBranch } from "lucide-react";
import { PROJECTS, PROJECT_FILTERS } from "@/lib/data";
import { Reveal } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { SectionHeading } from "./section-heading";

export function Projects() {
  const [filter, setFilter] = React.useState<string>("all");

  const visible = PROJECTS.filter((p) =>
    filter === "all" ? true : p.categories.includes(filter)
  );
  const arbor = PROJECTS.find((p) => p.name === "Arbor")!;

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="flex flex-col gap-4 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2 flex items-center gap-2">
            <span className="sec-num">04</span>
            Selected Public Work
          </p>
          <SectionHeading id="projects" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Public repos and experiments.
          </SectionHeading>
        </div>
        <a
          href="https://github.com/iankengott?tab=repositories"
          target="_blank"
          rel="noreferrer"
          className="link-copper inline-flex items-center gap-1 text-sm text-muted-foreground"
        >
          All repositories
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </Reveal>

      <Reveal delay={0.05} className="mt-8 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Filter
        </span>
        {PROJECT_FILTERS.map((f) => {
          const isActive = f.id === filter;
          const count =
            f.id === "all"
              ? PROJECTS.length
              : PROJECTS.filter((p) => p.categories.includes(f.id)).length;
          return (
            <button
              key={f.id}
              data-active={isActive}
              aria-pressed={isActive}
              onClick={() => setFilter(f.id)}
              className="filter-chip relative"
            >
              {isActive && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--copper)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {f.label}
              <span className="filter-chip-count" aria-hidden>
                {String(count).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </Reveal>

      <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <motion.div
              key={p.name}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpotlightCard className="h-full rounded-2xl">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="project-card card-lift group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-6"
                >
                  {/* accent corner mark — top-right copper L-bracket */}
                  <span className="project-corner" aria-hidden />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {/* repo icon disc */}
                      <span className="project-repo-icon" aria-hidden>
                        <GitBranch className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-display text-xl font-semibold tracking-tight">
                        {p.name}
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--copper)]" />
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {p.blurb}
                  </p>

                  {/* tech stack chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.map((tech) => (
                      <span
                        key={tech}
                        className="project-stack-chip rounded-md border border-border/50 bg-background/40 px-2 py-0.5 font-mono text-[10px] tracking-[0.04em] text-muted-foreground transition-colors group-hover:border-[var(--copper)]/30 group-hover:text-foreground/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* category + language + meta footer */}
                  <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border/50 pt-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-black/10"
                        style={{ backgroundColor: p.languageColor }}
                        aria-hidden
                      />
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {p.language}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground/80">
                      <Star className="h-3 w-3" />
                      {p.stars}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground/80">
                      <GitFork className="h-3 w-3" />
                      {p.forks}
                    </span>
                    <span className="ml-auto flex flex-wrap gap-1.5">
                      {p.categories.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground"
                        >
                          {c}
                        </span>
                      ))}
                    </span>
                  </div>
                </a>
              </SpotlightCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Arbor feature panel */}
      <Reveal as="article" delay={0.1} className="card-lift group corner-ornament relative mt-8 grid overflow-hidden rounded-2xl border border-border/70 bg-card/40 lg:grid-cols-[1fr_1.1fr]">
        <div className="corner-ornament-pair pointer-events-none absolute inset-0 z-20" aria-hidden>
          <span />
          <span />
        </div>
        <div className="relative z-10 flex flex-col gap-4 p-7 sm:p-9">
          <p className="eyebrow">Arbor / Public Repo Evidence</p>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-balance">
            My Arbor fork is grounded in reproducible research runs.
          </h3>
          <p className="leading-relaxed text-muted-foreground">
            Public GitHub metadata describes my fork as a cleaner Python package
            layout with local setup and a Nix-based simulation scaffold for
            reproducible experiment workflows.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href={arbor.href}
              target="_blank"
              rel="noreferrer"
              className="link-copper inline-flex items-center gap-1 text-sm"
            >
              My Arbor fork <ArrowUpRight className="h-3 w-3" />
            </a>
            <a
              href="https://github.com/RUC-NLPIR/Arbor"
              target="_blank"
              rel="noreferrer"
              className="link-copper inline-flex items-center gap-1 text-sm"
            >
              Upstream project <ArrowUpRight className="h-3 w-3" />
            </a>
            <a
              href="https://RUC-NLPIR.github.io/Arbor/"
              target="_blank"
              rel="noreferrer"
              className="link-copper inline-flex items-center gap-1 text-sm"
            >
              Project page <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
        <div className="relative z-10 border-t border-border/60 bg-background/40 p-7 lg:border-l lg:border-t-0">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40">
            <img
              src="/img/arbor-framework.png"
              alt="Arbor framework diagram from the public Arbor repository"
              className="block w-full"
              loading="lazy"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2">
            {[
              { icon: FileCode2, label: "Python", note: "primary language" },
              { icon: Star, label: "Apache-2.0", note: "license" },
              { icon: GitFork, label: "Forked", note: "from RUC-NLPIR/Arbor" },
              { icon: FileCode2, label: "Nix", note: "scaffold included" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card/40 px-3 py-2.5"
              >
                <f.icon className="h-4 w-4 text-[var(--copper)]" />
                <div>
                  <p className="text-sm font-medium">{f.label}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {f.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
