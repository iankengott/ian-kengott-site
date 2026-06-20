"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Focus, X, ArrowLeft, ArrowRight } from "lucide-react";

/**
 * FocusMode — press `f` to enter a keyboard-driven section focus mode.
 *
 * When active:
 *   - the current section is highlighted with a copper outline + glow
 *   - all other sections dim to 32% opacity / desaturated
 *   - a floating HUD shows "FOCUS · Section N of 8 · LABEL"
 *   - Arrow ←/→ (or `j`/`k`) cycles between sections
 *   - `f` or `Escape` exits
 *
 * Listens on a single window keydown; ignores when focus is in an input,
 * textarea, contenteditable, or when a dialog/overlay is open. Respects
 * prefers-reduced-motion (no dim transition).
 */
export function FocusMode() {
  const [active, setActive] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [total, setTotal] = React.useState(8);
  const [label, setLabel] = React.useState("");
  const sectionsRef = React.useRef<HTMLElement[]>([]);

  // Refresh the section list (sections are static after mount, but be safe)
  const refreshSections = React.useCallback(() => {
    const list = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
    sectionsRef.current = list;
    setTotal(list.length || 8);
  }, []);

  React.useEffect(() => {
    refreshSections();
  }, [refreshSections]);

  // Apply / clear the focused-section class + update label
  React.useEffect(() => {
    if (!active) {
      document.querySelectorAll("section.is-focused").forEach((el) => el.classList.remove("is-focused"));
      return;
    }
    const sections = sectionsRef.current;
    if (!sections.length) return;
    sections.forEach((el) => el.classList.remove("is-focused"));
    const target = sections[index];
    if (target) {
      target.classList.add("is-focused");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setLabel(labelFor(target.id));
    }
  }, [active, index]);

  // Toggle body class
  React.useEffect(() => {
    document.body.classList.toggle("focus-mode-active", active);
    return () => document.body.classList.remove("focus-mode-active");
  }, [active]);

  // Key handler
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't interfere with typing
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        return;
      }
      // Don't interfere when a dialog/overlay is open
      if (document.querySelector("[role='dialog'][data-state='open'], [data-cmdk-root]")) {
        return;
      }

      if (!active) {
        if (e.key === "f" && !e.metaKey && !e.ctrlKey && !e.altKey) {
          refreshSections();
          // start at the section closest to viewport center
          const sections = sectionsRef.current;
          let best = 0;
          let bestDist = Infinity;
          const center = window.innerHeight / 2;
          sections.forEach((el, i) => {
            const r = el.getBoundingClientRect();
            const d = Math.abs((r.top + r.bottom) / 2 - center);
            if (d < bestDist) {
              bestDist = d;
              best = i;
            }
          });
          setIndex(best);
          setActive(true);
          e.preventDefault();
        }
        return;
      }

      // active
      if (e.key === "Escape" || e.key === "f") {
        setActive(false);
        e.preventDefault();
        return;
      }
      const n = sectionsRef.current.length || 8;
      if (e.key === "ArrowRight" || e.key === "j" || e.key === "ArrowDown") {
        setIndex((i) => (i + 1) % n);
        e.preventDefault();
      } else if (e.key === "ArrowLeft" || e.key === "k" || e.key === "ArrowUp") {
        setIndex((i) => (i - 1 + n) % n);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, refreshSections]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="focus-hud"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-live="polite"
        >
          <span className="flex items-center gap-2">
            <Focus className="h-3.5 w-3.5 text-[var(--copper)]" />
            <span className="fh-label">Focus</span>
          </span>
          <span className="fh-sep" />
          <span>
            <span className="fh-frac">{index + 1}</span>
            <span className="text-muted-foreground"> / {total || 8}</span>
          </span>
          <span className="fh-sep" />
          <span className="fh-label">{label}</span>
          <span className="fh-sep" />
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <kbd><ArrowLeft className="inline h-2.5 w-2.5" /></kbd>
            <kbd><ArrowRight className="inline h-2.5 w-2.5" /></kbd>
            navigate
          </span>
          <span className="fh-sep" />
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <kbd>esc</kbd>
            exit
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function labelFor(id: string): string {
  const map: Record<string, string> = {
    research: "Research",
    systems: "AI & Systems",
    projects: "Projects",
    notes: "Field Notes",
    principles: "Principles",
    connect: "Connect",
  };
  return map[id] ?? id;
}
