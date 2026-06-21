"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronDown } from "lucide-react";
import { LENSES, PROFILE } from "@/lib/data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Research() {
  return (
    <section id="research" className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <SectionHead />
      <Summary />
      <LensSelector />
      <FeatureGrid />
    </section>
  );
}

function SectionHead() {
  return (
    <Reveal className="flex flex-col gap-4 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow mb-2 flex items-center gap-2">
          <span className="sec-num">01</span>
          Research Work
        </p>
        <SectionHeading id="research" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Dr. Arena lab work comes first.
        </SectionHeading>
      </div>
      <a
        href={PROFILE.usfLab}
        target="_blank"
        rel="noreferrer"
        className="link-copper inline-flex items-center gap-1 text-sm text-muted-foreground"
      >
        USF lab page
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </Reveal>
  );
}

function Summary() {
  return (
    <Reveal delay={0.05} className="py-10">
      <ul className="grid gap-3 md:grid-cols-3">
        {[
          "Magnonics and magnetic-materials research support",
          "Muon telescope context connected to the lab memory",
          "MANTiS packaging and x-ray spectromicroscopy workflows",
        ].map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/40 px-4 py-3 text-sm text-foreground/80"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--copper)]" />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function LensSelector() {
  const [active, setActive] = React.useState<string>(LENSES[0].id);
  const current = LENSES.find((l) => l.id === active)!;

  // Deep-link: read #research=<id> on mount and whenever the hash changes.
  React.useEffect(() => {
    const applyHash = () => {
      const m = window.location.hash.match(/(?:^|#)research=([a-z0-9-]+)/i);
      const id = m?.[1];
      if (id && LENSES.some((l) => l.id === id)) {
        setActive(id);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // Keep the URL hash in sync when the lens changes (so the link is shareable).
  const select = React.useCallback((id: string) => {
    setActive(id);
    if (typeof window === "undefined") return;
    const next = `#research=${id}`;
    if (window.location.hash !== next) {
      history.replaceState(null, "", next);
    }
  }, []);

  return (
    <Reveal delay={0.1} className="py-8">
      <div className="rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div
            role="tablist"
            aria-label="Research focus selector"
            className="flex flex-wrap gap-2"
          >
            {LENSES.map((lens) => {
              const isActive = lens.id === active;
              return (
                <button
                  key={lens.id}
                  role="tab"
                  aria-selected={isActive}
                  data-active={isActive}
                  onClick={() => select(lens.id)}
                  className="lens-tab relative"
                >
                  {isActive && (
                    <motion.span
                      layoutId="lens-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-[var(--copper)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {lens.label}
                </button>
              );
            })}
          </div>
          {/* deep-link hint */}
          <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 lg:inline-flex">
            <span className="h-1 w-1 rounded-full bg-[var(--copper)]/70" />
            shareable · #research={current.id}
          </span>
        </div>

        <div className="mt-6 min-h-[120px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <p className="eyebrow mb-2">Selected Focus</p>
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                {current.title}
              </h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                {current.body}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {current.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background/50 px-3 py-1 font-mono text-[11px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Reveal>
  );
}

function FeatureGrid() {
  return (
    <div className="mt-10 grid gap-8">
      <ArenaFeature />
    </div>
  );
}

function ArenaFeature() {
  return (
    <Reveal as="article" className="card-lift group corner-ornament relative grid overflow-hidden rounded-2xl border border-border/70 bg-card/40 lg:grid-cols-2">
      <div className="corner-ornament-pair pointer-events-none absolute inset-0 z-20" aria-hidden>
        <span />
        <span />
      </div>
      <div className="relative z-10 min-h-[260px] overflow-hidden">
        <img
          src="/ian-kengott-site/img/usf-arena-hero.jpg"
          alt="Darío Arena beside a Magneto-Optic Kerr effect spectroscopy setup at USF"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/90 backdrop-blur">
          USF · Magnetic Materials
        </span>
      </div>
      <div className="relative z-10 flex flex-col gap-4 p-7 sm:p-9">
        <p className="eyebrow">Magnetism / Spin Dynamics</p>
        <h3 className="font-display text-2xl font-semibold tracking-tight">
          Work connected to Dr. Arena's lab
        </h3>
        <p className="leading-relaxed text-muted-foreground">
          My notes reference work with Dr. Arena's lab, including a magnonics
          direction and a muon telescope project. Public USF pages identify Dr.
          Arena as PI of the Magnetic Materials and Spin Dynamics Lab, with
          research in nanomagnetism, x-ray/neutron probes, electronic structure,
          and spin dynamics.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a
            href="https://www.usf.edu/arts-sciences/departments/physics/research/labs/magnetic-materials-dynamics/team/"
            target="_blank"
            rel="noreferrer"
            className="link-copper inline-flex items-center gap-1 text-sm"
          >
            Lab PI source <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://www.usf.edu/arts-sciences/chronicles/2025/innovative-research-on-ferrimagnetic-materials-earns-millions-in-funding-to-advance-communication-technologies.aspx"
            target="_blank"
            rel="noreferrer"
            className="link-copper inline-flex items-center gap-1 text-sm"
          >
            USF research story <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <ResearchDetail
          summary="Research context"
          items={[
            "Magnetic materials and spin dynamics are the verified public lab context.",
            "My notes connect the lab context to magnonics and a muon telescope project.",
            "I keep claims conservative unless they are in my notes or public sources.",
          ]}
        />
      </div>
    </Reveal>
  );
}

function ResearchDetail({
  summary,
  items,
}: {
  summary: string;
  items: string[];
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="mt-2 rounded-lg border border-border/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground/80 transition-colors hover:text-[var(--copper)]"
      >
        {summary}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/60 px-4 py-3"
          >
            {items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 py-1.5 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--copper)]" />
                {item}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
