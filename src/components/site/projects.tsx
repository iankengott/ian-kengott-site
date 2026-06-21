"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Star, GitFork, FileCode2, GitBranch, ChevronLeft, ChevronRight, PlayCircle, ExternalLink } from "lucide-react";
import { MANTIS_SHOTS, PROJECTS, PROJECT_FILTERS } from "@/lib/data";
import { Reveal } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { SectionHeading } from "./section-heading";
import { GitHubActivity } from "./github-activity";

const ARBOR_DEMO =
  "https://raw.githubusercontent.com/RUC-NLPIR/Arbor/main/assets/demo.mp4";
const ARBOR_POSTER =
  "https://raw.githubusercontent.com/RUC-NLPIR/Arbor/main/assets/demo-poster.png";

export function Projects() {
  const [filter, setFilter] = React.useState<string>("all");
  const carouselRef = React.useRef<HTMLDivElement | null>(null);

  const visible = PROJECTS.filter((p) =>
    filter === "all" ? true : p.categories.includes(filter)
  );
  const arbor = PROJECTS.find((p) => p.name === "Arbor")!;

  const scrollProjects = (direction: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * Math.min(window.innerWidth * 0.82, 560),
      behavior: "smooth",
    });
  };

  return (
    <section id="projects" className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <Reveal className="flex flex-col gap-4 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2 flex items-center gap-2">
            <span className="sec-num">02</span>
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

      <FeatureCarousel arbor={arbor} />

      <Reveal delay={0.05} className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
        <div className="flex items-center gap-2" aria-label="Project carousel controls">
          <button
            type="button"
            onClick={() => scrollProjects(-1)}
            className="carousel-button"
            aria-label="Scroll projects left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollProjects(1)}
            className="carousel-button"
            aria-label="Scroll projects right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </Reveal>

      <motion.div
        ref={carouselRef}
        layout
        className="project-carousel mt-8 flex snap-x gap-4 overflow-x-auto pb-4"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <motion.div
              key={p.name}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="project-slide min-w-[min(88vw,30rem)] snap-start sm:min-w-[27rem] lg:min-w-[31rem]"
            >
              <SpotlightCard className="h-full rounded-2xl">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="project-card card-lift group relative flex h-full min-h-[18rem] flex-col gap-3 overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-6"
                >
                  <span className="project-corner" aria-hidden />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
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

      {/*
        The card carousel above replaces the old vertical repo grid.
        GitHubActivity remains a live-data panel because it is more useful full-width.
      */}

      <Reveal delay={0.08}>
        <GitHubActivity />
      </Reveal>
    </section>
  );
}

function FeatureCarousel({ arbor }: { arbor: (typeof PROJECTS)[number] }) {
  const [active, setActive] = React.useState<"mantis" | "arbor">("mantis");

  const slides = [
    { id: "mantis" as const, label: "MANTiS", eyebrow: "X-ray spectromicroscopy" },
    { id: "arbor" as const, label: "Arbor", eyebrow: "Research loop media" },
  ];

  return (
    <Reveal delay={0.1} className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">Research Feature Carousel</p>
          <h3 className="font-display text-2xl font-semibold tracking-tight">
            MANTiS and Arbor evidence.
          </h3>
        </div>
        <div className="flex items-center gap-2" role="tablist" aria-label="Research feature carousel">
          {slides.map((slide) => {
            const isActive = active === slide.id;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(slide.id)}
                className={`feature-tab relative rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-[var(--copper)] text-[var(--copper)]"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="feature-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-[var(--copper)]/10"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                )}
                <span className="block">{slide.label}</span>
                <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] opacity-70 sm:block">
                  {slide.eyebrow}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {active === "mantis" ? (
          <MantisFeature key="mantis" />
        ) : (
          <ArborFeature key="arbor" arbor={arbor} />
        )}
      </AnimatePresence>
    </Reveal>
  );
}

function MantisFeature() {
  const [active, setActive] = React.useState<string>(MANTIS_SHOTS[0].id);
  const current = MANTIS_SHOTS.find((s) => s.id === active)!;

  return (
    <motion.article
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="card-lift group corner-ornament relative grid overflow-hidden rounded-2xl border border-border/70 bg-card/40 lg:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="corner-ornament-pair pointer-events-none absolute inset-0 z-20" aria-hidden>
        <span />
        <span />
      </div>
      <div className="relative z-10 flex flex-col gap-4 p-7 sm:p-9">
        <p className="eyebrow">MANTiS / Public UI Evidence</p>
        <h3 className="font-display text-2xl font-semibold tracking-tight text-balance">
          My MANTiS work centers on real x-ray spectromicroscopy workflows.
        </h3>
        <p className="leading-relaxed text-muted-foreground">
          My MANTiS work is packaging and workflow documentation around the
          multivariate x-ray spectromicroscopy toolchain: loading hyperspectral
          data, preprocessing, PCA/SVD, clustering, spectral maps, NNMA, peak
          fitting, and tomography context.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a
            href="https://spectromicroscopy.com/"
            target="_blank"
            rel="noreferrer"
            className="link-copper inline-flex items-center gap-1 text-sm"
          >
            MANTiS docs <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://docs.spectromicroscopy.com/"
            target="_blank"
            rel="noreferrer"
            className="link-copper inline-flex items-center gap-1 text-sm"
          >
            Screenshot source <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {["Preprocess", "PCA / SVD", "NNMA / fitting"].map((label) => (
            <div
              key={label}
              className="rounded-lg border border-border/60 bg-card/40 px-3 py-2.5"
            >
              <p className="font-display text-sm font-medium">{label}</p>
              <p className="font-mono text-[10px] text-muted-foreground">
                workflow step
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 border-t border-border/60 bg-background/40 p-5 sm:p-7 lg:border-l lg:border-t-0">
        <div className="shot-frame relative bg-black/5">
          <AnimatePresence mode="wait">
            <motion.img
              key={current.id}
              src={current.src}
              alt={current.alt}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="block w-full"
              loading="lazy"
            />
          </AnimatePresence>
          <p className="border-t border-border/60 bg-card/70 px-3 py-2 text-center text-xs text-muted-foreground backdrop-blur">
            {current.caption}
          </p>
        </div>
        <div
          role="tablist"
          aria-label="MANTiS screenshot selector"
          className="mt-4 flex justify-center gap-2"
        >
          {MANTIS_SHOTS.map((shot) => {
            const isActive = shot.id === active;
            return (
              <button
                key={shot.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(shot.id)}
                className={`relative rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-[var(--copper)] text-[var(--copper)]"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="shot-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-[var(--copper)]/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {shot.label}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
          Public MANTiS documentation screenshots; no synthetic simulation.
        </p>
      </div>
    </motion.article>
  );
}

function ArborFeature({ arbor }: { arbor: (typeof PROJECTS)[number] }) {
  return (
      <motion.article
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -18 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="card-lift group corner-ornament relative grid overflow-hidden rounded-2xl border border-border/70 bg-card/40 lg:grid-cols-[0.85fr_1.15fr]"
      >
        <div className="corner-ornament-pair pointer-events-none absolute inset-0 z-20" aria-hidden>
          <span />
          <span />
        </div>
        <div className="relative z-10 flex flex-col gap-4 p-7 sm:p-9">
          <p className="eyebrow">Arbor / Public Repo Evidence</p>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-balance">
            My Arbor fork stays tied to the public upstream research workflow.
          </h3>
          <p className="leading-relaxed text-muted-foreground">
            Public GitHub metadata describes my fork as a cleaner Python package
            layout with local setup and a Nix-based simulation scaffold for
            reproducible experiment workflows. The video here is the upstream
            Arbor demo asset, not a synthetic stand-in.
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
          <div className="grid grid-cols-2 gap-3">
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
        <div className="relative z-10 border-t border-border/60 bg-background/40 p-5 sm:p-7 lg:border-l lg:border-t-0">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40 shadow-[0_30px_90px_-60px_var(--copper)]">
            <video
              className="block aspect-video w-full bg-black object-cover"
              controls
              muted
              loop
              playsInline
              preload="metadata"
              poster={ARBOR_POSTER}
            >
              <source src={ARBOR_DEMO} type="video/mp4" />
            </video>
          </div>
          <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <PlayCircle className="h-3.5 w-3.5 text-[var(--copper)]" />
            Upstream Arbor demo media from RUC-NLPIR/Arbor
          </p>
          <div className="mt-5 overflow-hidden rounded-xl border border-border/60 bg-card/40">
            <img
              src="/ian-kengott-site/img/arbor-framework.png"
              alt="Arbor framework diagram from the public Arbor repository"
              className="block w-full"
              loading="lazy"
            />
          </div>
        </div>
      </motion.article>
  );
}
