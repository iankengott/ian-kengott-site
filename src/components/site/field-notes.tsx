"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowUpRight, ScanLine, Waves, Package, Crosshair, type LucideIcon } from "lucide-react";
import { FIELD_NOTES } from "@/lib/data";
import { Reveal, RevealGroup, RevealItem } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { SectionHeading } from "./section-heading";

const NOTE_ICONS: Record<string, LucideIcon> = {
  ScanLine,
  Waves,
  Package,
  Crosshair,
};

export function FieldNotes() {
  const published = FIELD_NOTES.filter((n) => n.status === "published").length;
  const drafts = FIELD_NOTES.length - published;

  return (
    <section id="notes" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="rule-draw mb-10" aria-hidden />
      <Reveal className="flex flex-col gap-4 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow mb-2 flex items-center gap-2">
            <span className="sec-num">06</span>
            <BookOpen className="h-3.5 w-3.5" />
            Field Notes
          </p>
          <SectionHeading id="notes" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Short notes from the workbench.
          </SectionHeading>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Working observations — kept short, kept honest. A running shelf of
            things worth remembering.
          </p>
          {/* legend / status row */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--copper)]" aria-hidden />
              {published} published
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full border border-dashed border-[var(--copper)]/60" aria-hidden />
              {drafts} in development
            </span>
            <span className="hidden text-muted-foreground/60 sm:inline">
              · click any card to expand
            </span>
          </div>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {FIELD_NOTES.length} entries
        </span>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2">
        {FIELD_NOTES.map((note, i) => {
          const Icon = NOTE_ICONS[note.icon] ?? BookOpen;
          const isDraft = note.status === "draft";
          return (
            <RevealItem key={note.title}>
              <SpotlightCard className="h-full rounded-2xl">
                <motion.article
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={`group relative h-full overflow-hidden rounded-2xl border bg-card/40 p-6 ${
                    isDraft
                      ? "border-dashed border-[var(--copper)]/30"
                      : "border-border/70"
                  }`}
                >
                  {/* copper edge that grows on hover */}
                  <span className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-gradient-to-b from-[var(--copper)] to-transparent transition-transform duration-500 group-hover:scale-y-100" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {/* note icon disc */}
                      <span className="fn-icon" aria-hidden>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="fn-tag rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em]">
                        {note.tag}
                      </span>
                    </div>
                    <span className="font-display text-2xl font-semibold text-muted-foreground/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug tracking-tight">
                    {note.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {note.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                      {isDraft && (
                        <span className="fn-draft-badge inline-flex items-center gap-1 rounded border border-dashed border-[var(--copper)]/40 bg-[var(--copper)]/5 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-[var(--copper)]/80">
                          <span className="h-1 w-1 rounded-full bg-[var(--copper)]/70" aria-hidden />
                          draft
                        </span>
                      )}
                      {note.meta}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground/60 transition-colors group-hover:text-[var(--copper)]">
                      read
                      <ArrowUpRight className="h-3.5 w-3.5 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </motion.article>
              </SpotlightCard>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
