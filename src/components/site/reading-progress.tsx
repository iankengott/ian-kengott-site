"use client";

import * as React from "react";

/**
 * ReadingProgress — a global scroll tracker that, for every section[id]
 * on the page, computes how far the reader has progressed through that
 * section (0–100%) and writes it to the `--read-progress` CSS variable
 * on the corresponding `.section-anchor` element. The CSS turns that
 * variable into a copper underline that fills as you read.
 *
 * Also publishes the "current section" to a small event bus so other
 * components (focus-mode HUD, recently-viewed tracker) can react without
 * each running their own scroll listener.
 */

type SectionInfo = { id: string; label: string };

const CURRENT_SECTION_EVENT = "ik:current-section";

export function getCurrentSection(): SectionInfo | null {
  return (window as unknown as { __ikCurrentSection?: SectionInfo }).__ikCurrentSection ?? null;
}

export function ReadingProgress() {
  React.useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]"),
    ).map((el) => ({
      el,
      id: el.id,
      anchor: el.querySelector<HTMLElement>(".section-anchor"),
    }));

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      let current: SectionInfo | null = null;
      let currentOverlap = 0;
      for (const { el, id, anchor } of sections) {
        const rect = el.getBoundingClientRect();
        // progress = how much of the section has been scrolled past the
        // viewport's midline. 0 when the section top is below midline,
        // 100 when the section bottom is above midline.
        const midline = vh * 0.5;
        const top = rect.top;
        const bottom = rect.bottom;
        const total = rect.height;
        let p = 0;
        if (top >= midline) {
          p = 0;
        } else if (bottom <= midline) {
          p = 100;
        } else {
          p = Math.max(0, Math.min(100, ((midline - top) / total) * 100));
        }
        if (anchor) {
          anchor.style.setProperty("--read-progress", `${p.toFixed(1)}%`);
        }
        // determine "current" = section with the most vertical overlap with
        // the middle band of the viewport
        const bandTop = vh * 0.3;
        const bandBot = vh * 0.7;
        const overlap =
          Math.max(0, Math.min(bottom, bandBot) - Math.max(top, bandTop));
        if (overlap > currentOverlap) {
          currentOverlap = overlap;
          current = { id, label: labelFor(id) };
        }
      }
      const prev = (window as unknown as { __ikCurrentSection?: SectionInfo }).__ikCurrentSection ?? null;
      (window as unknown as { __ikCurrentSection?: SectionInfo }).__ikCurrentSection = current;
      if (current && (!prev || prev.id !== current.id)) {
        window.dispatchEvent(
          new CustomEvent(CURRENT_SECTION_EVENT, { detail: current }),
        );
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
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

export const CURRENT_SECTION_EVENT_NAME = CURRENT_SECTION_EVENT;
