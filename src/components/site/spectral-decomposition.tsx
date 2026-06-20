"use client";

import * as React from "react";

/**
 * SpectralDecomposition — a canvas-based mini-visualization of the MANTiS
 * PCA/SVD workflow. Animates three panels in lockstep:
 *
 *  1. Hyperspectral image stack (left)   — a grid of "spectral pixels" whose
 *     hue is driven by a low-rank reconstruction that gains rank over time.
 *  2. Eigenvalue scree plot (top-right)  — bars descend in sorted order,
 *     the first few highlighted in copper (the "signal" components).
 *  3. Component spectra (bottom-right)   — three principal-component curves
 *     draw in left-to-right, each a different harmonic of an X-ray absorption
 *     edge shape.
 *
 * The whole loop runs on a single rAF, pauses when off-screen, and freezes
 * to a static frame when the user prefers reduced motion. Everything is
 * rendered procedurally — no images, no network — so it stays cheap.
 */
export function SpectralDecomposition() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [reduced] = usePrefersReducedMotion();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let visible = false;
    let t0 = 0;
    const ro = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible && !reduced) {
          t0 = performance.now();
          raf = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(raf);
          // render one static frame so the canvas isn't blank
          if (reduced) drawFrame(ctx, W, H, 0.62, 1, reduced);
        }
      },
      { threshold: 0.15 },
    );
    ro.observe(wrap);

    // size
    let W = 0;
    let H = 0;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(280, Math.floor(rect.width));
      H = Math.max(180, Math.floor(rect.height));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) drawFrame(ctx, W, H, 0.62, 1, true);
    };
    resize();
    const mo = new MutationObserver(resize);
    mo.observe(wrap, { attributes: true, attributeFilter: ["style", "class"] });
    window.addEventListener("resize", resize);

    function loop(now: number) {
      if (!visible || reduced) return;
      const elapsed = (now - t0) / 1000;
      // 7-second cycle: load (0–1.4s) → decompose (1.4–5.6s) → hold (5.6–7s)
      const cycle = elapsed % 7;
      const loadP = clamp(cycle / 1.4, 0, 1);
      const decompP = clamp((cycle - 1.4) / 4.2, 0, 1);
      drawFrame(ctx, W, H, loadP, decompP, false);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      className="spectral-viz relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border/60 bg-background/60"
      aria-label="Animated visualization of MANTiS PCA spectral decomposition"
      role="img"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div className="spectral-viz-overlay pointer-events-none absolute inset-0 flex flex-col justify-between p-3">
        <div className="flex items-center justify-between">
          <span className="sv-label">MANTiS · PCA decomposition</span>
          <span className="sv-status">
            <span className="sv-status-dot" /> live render
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="sv-label">hyperspectral stack → components</span>
          <span className="sv-label sv-label-mono">rank = 3</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* rendering                                                          */
/* ------------------------------------------------------------------ */

const GRID_W = 28;
const GRID_H = 16;

// Pre-generate a stable "ground truth" low-rank image so the animation
// converges to the same shape every cycle. Each pixel's hue is a sum of
// 3 spatial harmonics weighted by the component spectra.
const TRUTH = (() => {
  const out: number[] = [];
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const u = x / GRID_W;
      const v = y / GRID_H;
      // three component loadings (spatial patterns)
      const c1 = 0.5 + 0.5 * Math.sin(u * Math.PI * 2.1) * Math.cos(v * Math.PI * 1.3);
      const c2 = 0.5 + 0.5 * Math.sin(u * Math.PI * 3.7 + v * 2.0);
      const c3 = 0.5 + 0.5 * Math.cos((u + v) * Math.PI * 4.0);
      out.push(c1, c2, c3);
    }
  }
  return out;
})();

// 10 eigenvalues, descending — the first 3 are "signal", rest are "noise".
const EIGEN = [1.0, 0.62, 0.38, 0.14, 0.09, 0.06, 0.045, 0.03, 0.022, 0.016];

function drawFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  loadP: number,
  decompP: number,
  reduced: boolean,
) {
  ctx.clearRect(0, 0, W, H);
  const pad = 10;
  const gap = 8;
  // Layout: left = hyperspectral image, right = stacked (scree + spectra)
  const leftW = Math.min(W * 0.42, 260);
  const rightX = leftW + gap + pad;
  const rightW = W - rightX - pad;
  const imgBox = { x: pad, y: pad + 16, w: leftW - pad, h: H - pad * 2 - 16 };
  const screeBox = { x: rightX, y: pad + 16, w: rightW, h: (H - pad * 2 - 16 - gap) * 0.42 };
  const specBox = {
    x: rightX,
    y: screeBox.y + screeBox.h + gap,
    w: rightW,
    h: H - (screeBox.y + screeBox.h + gap) - pad,
  };

  drawHyperspectral(ctx, imgBox, loadP, decompP, reduced);
  drawScree(ctx, screeBox, decompP, reduced);
  drawSpectra(ctx, specBox, decompP, reduced);
}

/** Left panel — the "image" being decomposed. */
function drawHyperspectral(
  ctx: CanvasRenderingContext2D,
  b: Box,
  loadP: number,
  decompP: number,
  reduced: boolean,
) {
  ctx.save();
  roundedClip(ctx, b.x, b.y, b.w, b.h, 6);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(b.x, b.y, b.w, b.h);

  const cw = b.w / GRID_W;
  const ch = b.h / GRID_H;
  // rank ramps 0 → 3 as decomposition progresses
  const rank = reduced ? 3 : Math.min(3, Math.floor(decompP * 3.001));
  // During load, show noisy raw data; during decompose, show the rank-k reconstruction.
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const i = (y * GRID_W + x) * 3;
      let r = 0;
      let g = 0;
      let bl = 0;
      if (reduced || decompP > 0.02) {
        const lim = reduced ? 3 : rank;
        const w1 = lim >= 1 ? TRUTH[i] : 0.5;
        const w2 = lim >= 2 ? TRUTH[i + 1] : 0.5;
        const w3 = lim >= 3 ? TRUTH[i + 2] : 0.5;
        // map three loadings to a copper/magenta/teal palette
        r = w1 * 0.78 + w2 * 0.18 + w3 * 0.04;
        g = w1 * 0.42 + w2 * 0.08 + w3 * 0.55;
        bl = w1 * 0.12 + w2 * 0.62 + w3 * 0.48;
      } else {
        // raw noise that resolves as loadP → 1
        const n = hashNoise(x, y) * (1 - loadP) + 0.5 * loadP;
        r = n * 0.6;
        g = n * 0.5;
        bl = n * 0.45;
      }
      ctx.fillStyle = `rgb(${(r * 255) | 0},${(g * 255) | 0},${(bl * 255) | 0})`;
      ctx.fillRect(b.x + x * cw, b.y + y * ch, cw + 0.6, ch + 0.6);
    }
  }

  // scanline sweep during load
  if (!reduced && loadP < 1) {
    const sy = b.y + loadP * b.h;
    const grad = ctx.createLinearGradient(0, sy - 14, 0, sy + 2);
    grad.addColorStop(0, "rgba(184,115,51,0)");
    grad.addColorStop(1, "rgba(184,115,51,0.55)");
    ctx.fillStyle = grad;
    ctx.fillRect(b.x, sy - 14, b.w, 16);
  }

  // rank badge
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(b.x + 4, b.y + 4, 56, 16);
  ctx.fillStyle = "rgba(184,115,51,0.95)";
  ctx.font = "600 9px ui-monospace, monospace";
  ctx.textBaseline = "middle";
  ctx.fillText(`rank ${rank}`, b.x + 9, b.y + 12);

  ctx.restore();
}

/** Top-right — eigenvalue scree plot. */
function drawScree(
  ctx: CanvasRenderingContext2D,
  b: Box,
  decompP: number,
  reduced: boolean,
) {
  ctx.save();
  // baseline
  ctx.strokeStyle = "rgba(120,120,120,0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(b.x, b.y + b.h - 0.5);
  ctx.lineTo(b.x + b.w, b.y + b.h - 0.5);
  ctx.stroke();

  const n = EIGEN.length;
  const bw = (b.w - (n - 1) * 3) / n;
  const maxH = b.h - 12;
  for (let i = 0; i < n; i++) {
    // bars appear one-by-one as decomposition progresses
    const appearAt = (i / n) * 0.7;
    const local = reduced ? 1 : clamp((decompP - appearAt) / 0.18, 0, 1);
    const h = EIGEN[i] * maxH * easeOut(local);
    const x = b.x + i * (bw + 3);
    const y = b.y + b.h - h;
    const isSignal = i < 3;
    ctx.fillStyle = isSignal
      ? "rgba(184,115,51,0.9)"
      : "rgba(120,120,120,0.35)";
    roundedRect(ctx, x, y, bw, Math.max(1.5, h), 1.5);
    ctx.fill();
  }

  // "signal / noise" divider after the 3rd bar
  if (reduced || decompP > 0.5) {
    const dx = b.x + 3 * (bw + 3) - 1.5;
    ctx.strokeStyle = "rgba(184,115,51,0.4)";
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(dx, b.y);
    ctx.lineTo(dx, b.y + b.h);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

/** Bottom-right — principal component spectra drawing in. */
function drawSpectra(
  ctx: CanvasRenderingContext2D,
  b: Box,
  decompP: number,
  reduced: boolean,
) {
  ctx.save();
  // axes
  ctx.strokeStyle = "rgba(120,120,120,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(b.x, b.y + b.h - 0.5);
  ctx.lineTo(b.x + b.w, b.y + b.h - 0.5);
  ctx.moveTo(b.x + 0.5, b.y);
  ctx.lineTo(b.x + 0.5, b.y + b.h);
  ctx.stroke();

  // 3 component curves, each appears as decompP crosses its threshold
  const comps = [
    { color: "rgba(184,115,51,0.95)", thresh: 0.12, shape: (u: number) => 0.5 + 0.4 * Math.sin(u * Math.PI * 1.4) },
    { color: "rgba(212,140,90,0.9)", thresh: 0.32, shape: (u: number) => 0.45 + 0.35 * Math.sin(u * Math.PI * 3.2) * Math.exp(-u * 1.5) },
    { color: "rgba(150,90,60,0.85)", thresh: 0.55, shape: (u: number) => 0.4 + 0.3 * Math.cos(u * Math.PI * 2.4) },
  ];
  for (const c of comps) {
    const local = reduced ? 1 : clamp((decompP - c.thresh) / 0.25, 0, 1);
    if (local <= 0) continue;
    const drawTo = b.w * easeOut(local);
    ctx.strokeStyle = c.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const steps = 48;
    for (let s = 0; s <= steps; s++) {
      const u = (s / steps) * (drawTo / b.w);
      if (u > 1) break;
      const px = b.x + u * b.w;
      const py = b.y + b.h - c.shape(u) * (b.h - 6) - 3;
      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // x-axis label
  ctx.fillStyle = "rgba(120,120,120,0.6)";
  ctx.font = "8px ui-monospace, monospace";
  ctx.textBaseline = "top";
  ctx.fillText("energy (eV) →", b.x + b.w - 70, b.y + b.h - 11);
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

type Box = { x: number; y: number; w: number; h: number };

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// cheap deterministic noise for the "raw data" phase
function hashNoise(x: number, y: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
function roundedClip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  roundedRect(ctx, x, y, w, h, r);
  ctx.clip();
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return [reduced] as const;
}
