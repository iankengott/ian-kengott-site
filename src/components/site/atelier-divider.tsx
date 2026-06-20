"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Atelier section divider — a centered copper lozenge flanked by two
 * hairlines that draw outward when scrolled into view. Adds rhythm and
 * an "atelier" engraved feel between major sections.
 */
export function AtelierDivider({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The reduced-motion CSS forces the divider visible regardless of the
    // in-view class, so we only need the observer to toggle it for the
    // animated draw-in path.
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`atelier-divider ${inView ? "in-view" : ""} ${className}`}
      aria-hidden
    >
      <span className="lozenge" />
    </div>
  );
}
