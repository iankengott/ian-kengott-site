"use client";

import { useEffect, useRef } from "react";

/**
 * MagneticFieldCanvas
 * A lightweight canvas animation of dipole magnetic field lines drifting
 * with subtle parallax toward the pointer. Tinted copper + a faint jade
 * counter-tone. Respects prefers-reduced-motion (renders a static frame).
 */
export function MagneticFieldCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.4, tx: 0.5, ty: 0.4 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Field-line seeds around two "poles"
    const seeds: { x: number; y: number; phase: number; speed: number; tone: number }[] = [];
    const SEED_COUNT = 26;
    for (let i = 0; i < SEED_COUNT; i++) {
      seeds.push({
        x: Math.random(),
        y: Math.random(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.0006 + Math.random() * 0.0012,
        tone: Math.random(),
      });
    }

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.tx = (e.clientX - rect.left) / rect.width;
      pointer.current.ty = (e.clientY - rect.top) / rect.height;
    };

    let t = 0;
    const draw = () => {
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.06;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.06;

      ctx.clearRect(0, 0, w, h);

      // Two magnetic poles, one offset by pointer parallax
      const px = pointer.current.x;
      const py = pointer.current.y;
      const poleA = { x: w * (0.3 + (px - 0.5) * 0.08), y: h * (0.42 + (py - 0.5) * 0.08) };
      const poleB = { x: w * (0.72 - (px - 0.5) * 0.08), y: h * (0.58 - (py - 0.5) * 0.08) };

      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue("--copper")
        .trim() || "#b5651d";
      const jade = getComputedStyle(document.documentElement)
        .getPropertyValue("--jade")
        .trim() || "#5f7a6b";

      // Draw dipole-like field lines as quadratic curves between poles
      const LINES = 16;
      for (let i = 0; i < LINES; i++) {
        const k = (i / (LINES - 1)) - 0.5; // -0.5..0.5
        const spread = 0.5 + Math.abs(k) * 1.7;
        const ctrlOffset = k * Math.min(w, h) * spread;
        const nx = -(poleB.y - poleA.y);
        const ny = poleB.x - poleA.x;
        const nlen = Math.hypot(nx, ny) || 1;
        const cx = (poleA.x + poleB.x) / 2 + (nx / nlen) * ctrlOffset;
        const cy = (poleA.y + poleB.y) / 2 + (ny / nlen) * ctrlOffset;

        const grad = ctx.createLinearGradient(poleA.x, poleA.y, poleB.x, poleB.y);
        const isCopper = i % 2 === 0;
        const col = isCopper ? accent : jade;
        const peak = 0.72 - Math.abs(k) * 0.32;
        grad.addColorStop(0, hexA(col, 0));
        grad.addColorStop(0.5, hexA(col, peak));
        grad.addColorStop(1, hexA(col, 0));

        ctx.beginPath();
        ctx.moveTo(poleA.x, poleA.y);
        ctx.quadraticCurveTo(cx, cy, poleB.x, poleB.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2 + (1 - Math.abs(k)) * 1.4;
        ctx.stroke();
      }

      // Drifting particles following field hints
      for (const s of seeds) {
        s.phase += s.speed * 1000 * 0.016;
        const u = (s.x + Math.sin(s.phase) * 0.04) % 1;
        const v = (s.y + Math.cos(s.phase * 0.8) * 0.04) % 1;
        const x = u * w;
        const y = v * h;
        const col = s.tone > 0.5 ? accent : jade;
        ctx.beginPath();
        ctx.arc(x, y, 1.3 + Math.sin(t * 0.002 + s.phase) * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = hexA(col, 0.45);
        ctx.fill();
      }

      // Pole glows
      glow(ctx, poleA.x, poleA.y, accent, 0.62);
      glow(ctx, poleB.x, poleB.y, jade, 0.4);

      t += 16;
      raf = requestAnimationFrame(draw);
    };

    const glow = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      col: string,
      a: number
    ) => {
      const r = 120;
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, hexA(col, a));
      g.addColorStop(1, hexA(col, 0));
      c.fillStyle = g;
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    };

    const hexA = (col: string, a: number) => {
      // Accept oklch(...) / #hex / rgb()
      const s = col.trim();
      if (s.startsWith("#")) {
        const hex = s.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r},${g},${b},${a})`;
      }
      // fall back: wrap in color-mix for oklch
      return `color-mix(in oklch, ${s} ${Math.round(a * 100)}%, transparent)`;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Pause animation when hero is off-screen to save CPU/battery.
    let visible = true;
    const visObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting;
          if (visible && !reduce && !raf) {
            raf = requestAnimationFrame(draw);
          } else if (!visible && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        }
      },
      { threshold: 0.01 }
    );
    visObserver.observe(canvas);

    if (reduce) {
      // draw a single static frame
      draw();
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      raf = requestAnimationFrame(draw);
    }

    // Also pause when the tab is hidden
    const onVisibility = () => {
      if (document.hidden) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      } else if (visible && !reduce && !raf) {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      visObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
