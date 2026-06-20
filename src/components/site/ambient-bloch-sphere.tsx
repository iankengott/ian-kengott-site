"use client";

import { useEffect, useRef } from "react";

export function AmbientBlochSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let t = 0;
    const particles = Array.from({ length: 56 }, (_, i) => {
      const seed = Math.sin((i + 1) * 12.9898) * 43758.5453;
      const n = seed - Math.floor(seed);
      const seed2 = Math.sin((i + 5) * 78.233) * 24982.19;
      const m = seed2 - Math.floor(seed2);
      return {
        x: n,
        y: m,
        r: 0.75 + ((i * 7) % 13) / 10,
        speed: 0.035 + ((i * 11) % 17) / 260,
        phase: i * 0.61,
      };
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const scroll = window.scrollY || 0;
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--copper").trim() || "#ad6a2d";
      const muted = getComputedStyle(document.documentElement).getPropertyValue("--jade").trim() || "#6f8d7e";
      const cx = width * 0.78;
      const cy = height * (0.34 + 0.035 * Math.sin(scroll * 0.00035));
      const r = Math.min(width, height) * 0.18;
      const angle = t * 0.0007 + scroll * 0.0002;

      ctx.clearRect(0, 0, width, height);
      drawParticleField(ctx, particles, width, height, t, scroll, accent, muted);
      ctx.globalAlpha = 0.26;

      drawSphere(ctx, cx, cy, r, angle, accent, muted);

      ctx.globalAlpha = 0.14;
      drawSphere(ctx, width * 0.14, height * 0.72, r * 0.72, -angle * 0.7, muted, accent);
      ctx.globalAlpha = 1;

      t += reduce ? 0 : 0.18;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", draw, { passive: true });
    if (!reduce) raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", draw);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    />
  );
}

type Particle = {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
};

function drawParticleField(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  width: number,
  height: number,
  t: number,
  scroll: number,
  accent: string,
  muted: string,
) {
  const points = particles.map((p, i) => {
    const drift = t * p.speed + scroll * 0.006;
    const x = (p.x * width + Math.sin(drift * 0.01 + p.phase) * 18 + width) % width;
    const rawY = p.y * height + Math.cos(drift * 0.008 + p.phase) * 14 - scroll * (0.002 + (i % 5) * 0.0004);
    const y = ((rawY % height) + height) % height;
    return { x, y, r: p.r };
  });

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const b = points[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.hypot(dx, dy);
      if (d > 112) continue;
      const alpha = (1 - d / 112) * 0.09;
      ctx.strokeStyle = color(i % 2 === 0 ? accent : muted, alpha);
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const pulse = 0.55 + 0.45 * Math.sin(t * 0.006 + i);
    ctx.fillStyle = color(i % 3 === 0 ? accent : muted, 0.16 + pulse * 0.12);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + pulse * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawSphere(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  angle: number,
  accent: string,
  muted: string,
) {
  ctx.save();
  ctx.translate(cx, cy);

  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.45);
  glow.addColorStop(0, color(accent, 0.22));
  glow.addColorStop(1, color(accent, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.45, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = color(accent, 0.38);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();

  for (const tilt of [-0.55, 0, 0.55]) {
    ctx.save();
    ctx.rotate(angle + tilt);
    ctx.scale(1, 0.34);
    ctx.strokeStyle = color(muted, tilt === 0 ? 0.3 : 0.18);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.strokeStyle = color(accent, 0.55);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(angle) * r * 0.72, Math.sin(angle) * r * 0.72);
  ctx.stroke();

  ctx.fillStyle = color(accent, 0.75);
  ctx.beginPath();
  ctx.arc(Math.cos(angle) * r * 0.72, Math.sin(angle) * r * 0.72, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function color(value: string, alpha: number) {
  const v = value.trim();
  if (v.startsWith("#")) {
    const hex = v.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `color-mix(in oklch, ${v} ${Math.round(alpha * 100)}%, transparent)`;
}
