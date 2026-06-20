"use client";

import * as React from "react";

/**
 * SpotlightCard
 * Wraps children with a cursor-following radial "spotlight" glow that
 * tracks the pointer on hover. The glow is rendered as a top overlay
 * (pointer-events-none, screen blend) so it reads as a warm wash over
 * the card rather than being hidden behind the card background.
 * Falls back gracefully on touch devices.
 */
export function SpotlightCard({
  children,
  className = "",
  radius = 260,
}: {
  children: React.ReactNode;
  className?: string;
  radius?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: -1000, y: -1000 });
  const [active, setActive] = React.useState(false);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onPointerMove={onMove}
      className={`group/spot relative ${className}`}
    >
      {children}
      {/* Spotlight overlay — sits above the card, blends as a warm wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, color-mix(in oklch, var(--copper) 22%, transparent), transparent 65%)`,
          mixBlendMode: "screen",
        }}
      />
      {/* crisp copper hairline that follows the pointer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(${Math.round(radius / 2)}px circle at ${pos.x}px ${pos.y}px, color-mix(in oklch, var(--copper) 14%, transparent), transparent 70%)`,
        }}
      />
    </div>
  );
}
