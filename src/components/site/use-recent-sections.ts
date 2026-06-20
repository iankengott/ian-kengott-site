"use client";

import * as React from "react";
import { CURRENT_SECTION_EVENT_NAME } from "./reading-progress";

/**
 * useRecentSections — tracks the sections a visitor actually reads and
 * persists them to localStorage. A section is "counted" after it has been
 * the current section for at least `DWELL_MS` (1.5s), so quick scrolls
 * don't pollute the list.
 *
 * Returns the most-recent-first list (capped at 5). Each entry is a
 * { id, label, ts } record. Components that want to surface this (the
 * command palette) should call this hook and show a "Recently viewed"
 * group when the list is non-empty.
 */

export type RecentSection = { id: string; label: string; ts: number };

const KEY = "ik-recent-sections";
const DWELL_MS = 1500;
const MAX = 5;

export function useRecentSections(): RecentSection[] {
  const [recent, setRecent] = React.useState<RecentSection[]>([]);

  // Load on mount
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as RecentSection[];
        if (Array.isArray(parsed)) setRecent(parsed.slice(0, MAX));
      }
    } catch {}
  }, []);

  // Track dwell time on the current section
  React.useEffect(() => {
    let currentId: string | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const commit = (id: string, label: string) => {
      setRecent((prev) => {
        const filtered = prev.filter((r) => r.id !== id);
        const next = [{ id, label, ts: Date.now() }, ...filtered].slice(0, MAX);
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    };

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string; label: string } | undefined;
      if (!detail) return;
      if (detail.id === currentId) return;
      currentId = detail.id;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => commit(detail.id, detail.label), DWELL_MS);
    };
    window.addEventListener(CURRENT_SECTION_EVENT_NAME, handler);
    return () => {
      window.removeEventListener(CURRENT_SECTION_EVENT_NAME, handler);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return recent;
}
