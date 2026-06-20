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
      const cy = height * (0.34 + 0.08 * Math.sin(scroll * 0.0012));
      const r = Math.min(width, height) * 0.18;
      const angle = t * 0.006 + scroll * 0.0015;

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 0.26;

      drawSphere(ctx, cx, cy, r, angle, accent, muted);

      ctx.globalAlpha = 0.14;
      drawSphere(ctx, width * 0.14, height * 0.72, r * 0.72, -angle * 0.7, muted, accent);
      ctx.globalAlpha = 1;

      t += reduce ? 0 : 1;
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
