"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/**
 * A guided walking tour of the site's sections.
 *
 * Launched from the command palette ("Take a tour") or via the `TourContext`.
 * Each step scrolls to a section and shows a callout with a one-line summary
 * + what to try there. Copper wayfinding throughout.
 */

interface TourCtx {
  start: () => void;
  open: boolean;
}
const Ctx = React.createContext<TourCtx>({ start: () => {}, open: false });

export function useTour() {
  return React.useContext(Ctx);
}

const STEP_NOTES: Record<string, { tip: string; tryHint?: string }> = {
  research: {
    tip: "Dr. Arena lab work, magnonics, muon telescope, and MANTiS x-ray spectromicroscopy.",
    tryHint: "Try the lens tabs — the URL updates so you can share a focus.",
  },
  systems: {
    tip: "AI as support infrastructure, not a headline. Plus what's on the bench right now.",
  },
  projects: {
    tip: "Public repos and experiments, filterable by category.",
    tryHint: "Try the filter chips — each shows a live count.",
  },
  journey: {
    tip: "A research path kept honest — running threads and the groundwork underneath.",
  },
  notes: {
    tip: "Reading and research notes — PCA/SVD, ferrimagnets, Nix flakes, muon geometry.",
  },
  principles: {
    tip: "The operating rules: build, verify, simplify.",
  },
  connect: {
    tip: "Reach out — messages stay on this server and I read every one.",
  },
};

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);

  const start = React.useCallback(() => {
    setStep(0);
    setOpen(true);
  }, []);

  const go = React.useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(NAV_LINKS.length - 1, idx));
    setStep(clamped);
    const target = NAV_LINKS[clamped].href;
    const el = document.querySelector(target);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const next = React.useCallback(() => {
    if (step >= NAV_LINKS.length - 1) {
      setOpen(false);
      return;
    }
    go(step + 1);
  }, [step, go]);

  const prev = React.useCallback(() => {
    go(step - 1);
  }, [step, go]);

  // Esc handled by Dialog. Arrow keys for nav.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  // When the tour opens, scroll to the first section.
  React.useEffect(() => {
    if (open) go(0);
  }, [open, go]);

  const current = NAV_LINKS[step];
  const note = STEP_NOTES[current.href.slice(1)] ?? { tip: "" };
  const isLast = step === NAV_LINKS.length - 1;

  return (
    <Ctx.Provider value={{ start, open }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md gap-0 border-border/80 bg-card/95 p-0 backdrop-blur-xl sm:max-w-md">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="hud-icon" aria-hidden>
                <Compass className="h-3.5 w-3.5" />
              </span>
              <DialogTitle className="font-display text-base font-semibold tracking-tight">
                Guided tour
              </DialogTitle>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close tour"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <DialogDescription className="sr-only">
            A walking tour of the site's sections. Use arrow keys to navigate.
          </DialogDescription>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 px-5 pt-4">
            {NAV_LINKS.map((l, i) => (
              <button
                key={l.href}
                type="button"
                aria-label={`Go to ${l.label}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? "w-6 bg-[var(--copper)]"
                    : i < step
                    ? "w-1.5 bg-[var(--copper)]/50"
                    : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>

          <div className="px-5 py-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.href}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--copper)]">
                  {String(step + 1).padStart(2, "0")} / {String(NAV_LINKS.length).padStart(2, "0")} · Section
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">
                  {current.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {note.tip}
                </p>
                {note.tryHint && (
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[var(--copper)]/30 bg-[var(--copper)]/8 px-2.5 py-1.5 font-mono text-[11px] text-[var(--copper)]">
                    <ChevronRight className="h-3 w-3" />
                    {note.tryHint}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between border-t border-border/60 px-5 py-3">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
              ← → keys
            </span>
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--copper)] px-3 py-1.5 text-sm font-medium text-[var(--copper-foreground)] transition-transform hover:scale-[1.02]"
            >
              {isLast ? (
                <>
                  <Check className="h-4 w-4" />
                  Done
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Ctx.Provider>
  );
}
