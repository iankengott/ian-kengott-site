"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowUp } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";

export function BackToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = React.useState(false);
  const [activeLabel, setActiveLabel] = React.useState<string>("");

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 700);
  });

  // Track the current section label to show alongside the back-to-top button.
  React.useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.slice(1))
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibleEntries[0]) {
          const id = `#${visibleEntries[0].target.id}`;
          const link = NAV_LINKS.find((l) => l.href === id);
          if (link) setActiveLabel(link.label);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed bottom-6 right-6 z-40 flex items-center gap-2"
        >
          {/* Active-section chip — appears to the left of the button */}
          <AnimatePresence>
            {activeLabel && (
              <motion.span
                key={activeLabel}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="bttop-chip hidden rounded-full border border-border/70 bg-card/80 px-3 py-1.5 backdrop-blur-xl sm:inline-block"
              >
                {activeLabel}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/80 text-foreground shadow-lg backdrop-blur-xl transition-colors hover:border-[var(--copper)]/60 hover:text-[var(--copper)]"
          >
            <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            <span className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_30px_-6px_var(--copper)]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
