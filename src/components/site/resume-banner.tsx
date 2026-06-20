"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, History } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";

const STORAGE_KEY = "ik-site-progress";
const RESUME_THRESHOLD_MS = 60 * 60 * 1000; // 1 hour

interface ProgressRecord {
  sectionId: string;
  sectionLabel: string;
  scrollY: number;
  ts: number;
}

/**
 * Returning-visitor banner: shows a "Continue where you left off" pill
 * at the bottom of the viewport when the visitor returns after ≥1h.
 * Persists the last-read section to localStorage on scroll.
 */
export function ResumeBanner() {
  const [record, setRecord] = React.useState<ProgressRecord | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  // On mount: read prior record; if older than threshold, surface banner.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const prior = JSON.parse(raw) as ProgressRecord;
      if (!prior?.sectionId || !prior?.ts) return;
      const elapsed = Date.now() - prior.ts;
      if (elapsed >= RESUME_THRESHOLD_MS && elapsed < 30 * 24 * 60 * 60 * 1000) {
        setRecord(prior);
        // Slight delay so it slides in after first paint
        const t = window.setTimeout(() => setVisible(true), 900);
        return () => window.clearTimeout(t);
      }
    } catch {}
  }, []);

  // Persist current section + scroll position (throttled via rAF).
  const lastSavedRef = React.useRef(0);
  React.useEffect(() => {
    const save = () => {
      const now = Date.now();
      if (now - lastSavedRef.current < 4000) return; // throttle to every 4s
      lastSavedRef.current = now;
      // Find the section closest to viewport center
      const viewH = window.innerHeight;
      const mid = viewH * 0.4;
      let best: { id: string; label: string; dist: number } | null = null;
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.href.slice(1));
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewH) continue;
        const dist = Math.abs(rect.top - mid);
        if (!best || dist < best.dist) {
          best = { id: link.href, label: link.label, dist };
        }
      }
      if (best && (best as { id: string; label: string; dist: number }).id) {
        const b = best as { id: string; label: string; dist: number };
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              sectionId: b.id,
              sectionLabel: b.label,
              scrollY: window.scrollY,
              ts: now,
            } satisfies ProgressRecord)
          );
        } catch {}
      }
    };
    const onScroll = () => {
      // Only update if banner has been dismissed or never shown — avoids
      // fighting with the resume click scroll target.
      save();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("beforeunload", save);
    // Initial save after a short delay (let sections mount)
    const t = window.setTimeout(save, 2000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", save);
      window.clearTimeout(t);
    };
  }, []);

  const handleResume = () => {
    if (!record) return;
    const el = document.getElementById(record.sectionId.slice(1));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setVisible(false);
    setDismissed(true);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && record && !dismissed && (
        <motion.div
          initial={{ y: 80, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 80, opacity: 0, x: "-50%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="resume-banner"
          role="region"
          aria-label="Continue where you left off"
        >
          <span className="resume-banner-pulse relative" aria-hidden>
            <History className="h-3.5 w-3.5" />
          </span>
          <span className="hidden text-muted-foreground sm:inline">
            Welcome back — pick up at
          </span>
          <span className="font-display text-sm font-medium tracking-tight text-foreground">
            {record.sectionLabel}
          </span>
          <button
            type="button"
            onClick={handleResume}
            className="resume-banner-cta"
            aria-label={`Resume reading at ${record.sectionLabel}`}
          >
            Resume
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="resume-banner-close"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
