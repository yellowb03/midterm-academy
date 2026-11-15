import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowCounterClockwise,
  CheckCircle,
  Compass,
  Lightbulb,
  Pause,
  Play,
  Warning,
} from '@phosphor-icons/react';
import { MathBlock, MathText } from '../MathText';

type Mat2 = [[number, number], [number, number]];

interface MatrixPreset {
  id: string;
  label: string;
  subtitle: string;
  matrix: Mat2;
  defaultX0: [number, number];
  classification: 'stable' | 'marginal' | 'unstable';
  note: string;
}

const MATRIX_PRESETS: MatrixPreset[] = [
  {
    id: 'hw-e310',
    label: 'HW E3.10 (Poles -2, -3)',
    subtitle: 'A = [[0, 6], [-1, -5]]',
    matrix: [
      [0, 6],
      [-1, -5],
    ],
    defaultX0: [2, -1],
    classification: 'stable',
    note: 'Exact HW 4 E3.10 matrix! Both eigenvalues (-2, -3) are negative, so every trajectory decays into (0, 0).',
  },
  {
    id: 'real-12',
    label: 'Real Poles (-1, -2)',
    subtitle: 'A = [[0, 1], [-2, -3]]',
    matrix: [
      [0, 1],
      [-2, -3],
    ],
    defaultX0: [2.5, -1.5],
    classification: 'stable',
    note: 'Companion form for sÂ² + 3s + 2 = 0. Trajectories bend toward the slower eigenvector vâ‚ = [1, -1]áµ€.',
  },
  {
    id: 'spiral',
    label: 'Underdamped Spiral (-0.6 Â± 2j)',
    subtitle: 'A = [[-0.6, 2], [-2, -0.6]]',
    matrix: [
      [-0.6, 2],
      [-2, -0.6],
    ],
    defaultX0: [2.5, 0],
    classification: 'stable',
    note: 'Complex conjugate poles Ïƒ Â± jÏ‰ produce e^{Ïƒt}[cos Ï‰t, sin Ï‰t] rotation decaying inward.',
  },
  {
    id: 'oscillator',
    label: 'Pure Oscillator (Â±2j)',
    subtitle: 'A = [[0, 2], [-2, 0]]',
    matrix: [
      [0, 2],
      [-2, 0],
    ],
    defaultX0: [2.25, 0],
    classification: 'marginal',
    note: 'Zero real part (Re(Î») = 0) gives sustained circular orbits with zero decay and zero growth.',
  },
  {
    id: 'saddle',
    label: 'Saddle (Unstable +1, -2)',
    subtitle: 'A = [[0, 1], [2, -1]]',
    matrix: [
      [0, 1],
      [2, -1],
    ],
    defaultX0: [1.5, -1.5],
    classification: 'unstable',
    note: 'One positive eigenvalue (+1) creates an unstable manifold [1, 1]áµ€ that flings states away from the origin!',
  },
];

interface EigenAnalysis {
  kind: 'real-distinct' | 'real-repeated' | 'complex';
  lambda1: { re: number; im: number };
  lambda2: { re: number; im: number };
  eigenvectors: [number, number][] | null;
}

function fmt(n: number, digits = 3): string {
  const clean = Math.abs(n) < 1e-9 ? 0 : n;
  const rounded = Number(clean.toFixed(digits));
  return `${rounded}`;
}

function fmtShort(n: number): string {
  const clean = Math.abs(n) < 1e-6 ? 0 : n;
  return Number(clean.toFixed(2)).toString();
}

function analyze2x2(A: Mat2): EigenAnalysis {
  const tr = A[0][0] + A[1][1];
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  const disc = tr * tr - 4 * det;

  if (disc > 1e-8) {
    const s = Math.sqrt(disc);
    const l1 = (tr + s) / 2;
    const l2 = (tr - s) / 2;
    const findVec = (lam: number): [number, number] => {
      const r0x = A[0][0] - lam;
      const r0y = A[0][1];
      let vx: number;
      let vy: number;
      if (Math.hypot(r0x, r0y) > 1e-7) {
        vx = -r0y;
        vy = r0x;
      } else {
        const r1x = A[1][0];
        const r1y = A[1][1] - lam;
        vx = -r1y;
        vy = r1x;
      }
      const norm = Math.hypot(vx, vy) || 1;
      return [vx / norm, vy / norm];
    };
    return {
      kind: 'real-distinct',
      lambda1: { re: l1, im: 0 },
      lambda2: { re: l2, im: 0 },
      eigenvectors: [findVec(l1), findVec(l2)],
    };
  }
  if (Math.abs(disc) <= 1e-8) {
    const lam = tr / 2;
    return {
      kind: 'real-repeated',
      lambda1: { re: lam, im: 0 },
      lambda2: { re: lam, im: 0 },
      eigenvectors: null,
    };
  }
  const sigma = tr / 2;
  const omega = Math.sqrt(-disc) / 2;
  return {
    kind: 'complex',
    lambda1: { re: sigma, im: omega },
    lambda2: { re: sigma, im: -omega },
    eigenvectors: null,
  };
}

/** Exact closed-form 2x2 matrix exponential Phi(t) = exp(A*t) */
function computePhi2x2(A: Mat2, t: number): Mat2 {
  const tr = A[0][0] + A[1][1];
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  const disc = tr * tr - 4 * det;

  if (disc > 1e-8) {
    const s = Math.sqrt(disc);
    const l1 = (tr + s) / 2;
    const l2 = (tr - s) / 2;
    const e1 = Math.exp(l1 * t);
    const e2 = Math.exp(l2 * t);
    const cA = (e1 - e2) / (l1 - l2);
    const cI = (l1 * e2 - l2 * e1) / (l1 - l2);
    return [
      [cA * A[0][0] + cI, cA * A[0][1]],
      [cA * A[1][0], cA * A[1][1] + cI],
    ];
  }
  if (Math.abs(disc) <= 1e-8) {
    const lam = tr / 2;
    const e = Math.exp(lam * t);
    return [
      [e * (1 + t * (A[0][0] - lam)), e * t * A[0][1]],
      [e * t * A[1][0], e * (1 + t * (A[1][1] - lam))],
    ];
  }
  const sigma = tr / 2;
  const omega = Math.sqrt(-disc) / 2;
  const e = Math.exp(sigma * t);
  const cosW = Math.cos(omega * t);
  const sinW = Math.sin(omega * t) / omega;
  return [
    [e * (cosW + sinW * (A[0][0] - sigma)), e * sinW * A[0][1]],
    [e * sinW * A[1][0], e * (cosW + sinW * (A[1][1] - sigma))],
  ];
}

function mulMatVec(M: Mat2, v: [number, number]): [number, number] {
  return [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
}

function setupHiDpiCanvas(
  canvas: HTMLCanvasElement,
  widthCss: number,
  heightCss: number
): CanvasRenderingContext2D | null {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const targetW = Math.max(1, Math.floor(widthCss * dpr));
  const targetH = Math.max(1, Math.floor(heightCss * dpr));
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function formatLinS(coeffS: number, constTerm: number): string {
  const sPart = coeffS === 1 ? 's' : `${fmtShort(coeffS)}s`;
  if (Math.abs(constTerm) < 1e-9) return sPart;
  return constTerm > 0 ? `${sPart} + ${fmtShort(constTerm)}` : `${sPart} - ${fmtShort(Math.abs(constTerm))}`;
}

export const TransitionMatrixLab: React.FC = () => {
  const [presetId, setPresetId] = useState<string>('hw-e310');
  const [x0, setX0] = useState<[number, number]>([2, -1]);
  const [tVal, setTVal] = useState<number>(0.8);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const phaseContainerRef = useRef<HTMLDivElement | null>(null);
  const phaseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeContainerRef = useRef<HTMLDivElement | null>(null);
  const timeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const [widths, setWidths] = useState<{ phase: number; time: number }>({
    phase: 380,
    time: 380,
  });

  const preset = MATRIX_PRESETS.find((p) => p.id === presetId) ?? MATRIX_PRESETS[0];
  const A = preset.matrix;
  const eigen = useMemo(() => analyze2x2(A), [A]);
  const phiT = useMemo(() => computePhi2x2(A, tVal), [A, tVal]);
  const currentX = useMemo(() => mulMatVec(phiT, x0), [phiT, x0]);

  // Sanity check at t = 0
  const sanityCheck = useMemo(() => {
    const phi0 = computePhi2x2(A, 0);
    const eps = 1e-5;
    const phiEps = computePhi2x2(A, eps);
    const dPhi0: Mat2 = [
      [(phiEps[0][0] - phi0[0][0]) / eps, (phiEps[0][1] - phi0[0][1]) / eps],
      [(phiEps[1][0] - phi0[1][0]) / eps, (phiEps[1][1] - phi0[1][1]) / eps],
    ];
    const errI = Math.max(
      Math.abs(phi0[0][0] - 1),
      Math.abs(phi0[0][1]),
      Math.abs(phi0[1][0]),
      Math.abs(phi0[1][1] - 1)
    );
    const errA = Math.max(
      Math.abs(dPhi0[0][0] - A[0][0]),
      Math.abs(dPhi0[0][1] - A[0][1]),
      Math.abs(dPhi0[1][0] - A[1][0]),
      Math.abs(dPhi0[1][1] - A[1][1])
    );
    return {
      phi0,
      idOk: errI < 1e-9,
      derivOk: errA < 1e-3,
    };
  }, [A]);

  // Play / Pause rAF animation
  useEffect(() => {
    if (!isPlaying) return;
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      setTVal((prev) => {
        const next = prev + dt * 0.85;
        if (next >= 5.0) {
          setIsPlaying(false);
          return 5.0;
        }
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying]);

  // ResizeObserver for HiDPI canvases
  useEffect(() => {
    const pEl = phaseContainerRef.current;
    const tEl = timeContainerRef.current;
    if (!pEl && !tEl) return;
    const update = () => {
      setWidths({
        phase: pEl ? Math.max(260, Math.floor(pEl.clientWidth)) : 380,
        time: tEl ? Math.max(260, Math.floor(tEl.clientWidth)) : 380,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    if (pEl) ro.observe(pEl);
    if (tEl) ro.observe(tEl);
    return () => ro.disconnect();
  }, []);

  // Draw Left Canvas: 2D Phase Portrait
  useEffect(() => {
    const canvas = phaseCanvasRef.current;
    if (!canvas) return;
    const w = widths.phase;
    const h = 320;
    const ctx = setupHiDpiCanvas(canvas, w, h);
    if (!ctx) return;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const pad = { left: 40, right: 24, top: 24, bottom: 32 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    // Preserve 1:1 aspect scale centered at (0,0)
    const maxRange = 4.0;
    const scale = Math.min(plotW, plotH) / (2 * maxRange);
    const cx = pad.left + plotW / 2;
    const cy = pad.top + plotH / 2;

    const toPx = (x1: number): number => cx + x1 * scale;
    const toPy = (x2: number): number => cy - x2 * scale;

    // Clip plot box
    ctx.save();
    ctx.beginPath();
    ctx.rect(pad.left, pad.top, plotW, plotH);
    ctx.clip();

    // Subtle grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let g = -6; g <= 6; g += 1) {
      const gx = toPx(g);
      const gy = toPy(g);
      ctx.beginPath();
      ctx.moveTo(gx, pad.top);
      ctx.lineTo(gx, pad.top + plotH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pad.left, gy);
      ctx.lineTo(pad.left + plotW, gy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(pad.left, cy);
    ctx.lineTo(pad.left + plotW, cy);
    ctx.moveTo(cx, pad.top);
    ctx.lineTo(cx, pad.top + plotH);
    ctx.stroke();

    // Vector field arrows
    const xRangeHalf = plotW / (2 * scale);
    const yRangeHalf = plotH / (2 * scale);
    const step = 1.0;
    for (let gx = -Math.floor(xRangeHalf); gx <= Math.floor(xRangeHalf); gx += step) {
      for (let gy = -Math.floor(yRangeHalf); gy <= Math.floor(yRangeHalf); gy += step) {
        if (Math.abs(gx) < 0.1 && Math.abs(gy) < 0.1) continue;
        const [dx, dy] = mulMatVec(A, [gx, gy]);
        const mag = Math.hypot(dx, dy);
        if (mag < 1e-6) continue;
        const len = Math.min(0.45, 0.24 + 0.05 * mag) * scale;
        const ux = dx / mag;
        const uy = -dy / mag; // canvas y flips
        const sx = toPx(gx);
        const sy = toPy(gy);
        const ex = sx + ux * len;
        const ey = sy + uy * len;

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Arrowhead
        const head = 4.2;
        const ang = Math.atan2(ey - sy, ex - sx);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.36)';
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - head * Math.cos(ang - 0.55), ey - head * Math.sin(ang - 0.55));
        ctx.lineTo(ex - head * Math.cos(ang + 0.55), ey - head * Math.sin(ang + 0.55));
        ctx.closePath();
        ctx.fill();
      }
    }

    // Eigenvector lines if real (place v1 and v2 on opposite rays so labels never collide)
    if (eigen.kind === 'real-distinct' && eigen.eigenvectors) {
      const lambdas = [eigen.lambda1.re, eigen.lambda2.re];
      eigen.eigenvectors.forEach((vec, idx) => {
        const lam = lambdas[idx];
        const col = lam > 0 ? 'rgba(251, 113, 133, 0.7)' : 'rgba(52, 211, 153, 0.65)';
        const ext = 10;
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(toPx(-ext * vec[0]), toPy(-ext * vec[1]));
        ctx.lineTo(toPx(ext * vec[0]), toPy(ext * vec[1]));
        ctx.stroke();
        ctx.setLineDash([]);

        // Alternate opposite rays (+x vs -x) for v1 vs v2
        const r = 2.6;
        const baseSign = vec[0] >= 0 ? 1 : -1;
        const sign = idx === 0 ? baseSign : -baseSign;
        const lx = Math.max(pad.left + 48, Math.min(pad.left + plotW - 48, toPx(sign * r * vec[0])));
        const ly = Math.max(pad.top + 16, Math.min(pad.top + plotH - 12, toPy(sign * r * vec[1])));
        ctx.fillStyle = col;
        ctx.font = '600 10.5px ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`v${idx + 1} (Î»=${fmtShort(lam)})`, lx, ly - 5);
      });
    }

    // Full future trajectory (dashed)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    const totalSamples = 180;
    for (let i = 0; i <= totalSamples; i++) {
      const tau = (i / totalSamples) * 5.0;
      const p = mulMatVec(computePhi2x2(A, tau), x0);
      const px = toPx(p[0]);
      const py = toPy(p[1]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Active traveled trail [0, tVal]
    ctx.save();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    const trailSamples = Math.max(2, Math.ceil((tVal / 5.0) * 180));
    for (let i = 0; i <= trailSamples; i++) {
      const tau = (i / trailSamples) * tVal;
      const p = mulMatVec(computePhi2x2(A, tau), x0);
      const px = toPx(p[0]);
      const py = toPy(p[1]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // State vector from origin to x(t)
    const xtPx = toPx(currentX[0]);
    const xtPy = toPy(currentX[1]);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(xtPx, xtPy);
    ctx.stroke();

    // Initial state x(0) marker
    const x0Px = toPx(x0[0]);
    const x0Py = toPy(x0[1]);
    ctx.fillStyle = '#090d16';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(x0Px, x0Py, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Current state x(t) glowing dot
    const dotColor = preset.classification === 'unstable' ? '#fb7185' : '#f59e0b';
    ctx.save();
    ctx.shadowColor = dotColor;
    ctx.shadowBlur = 12;
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(xtPx, xtPy, 6.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Clamped labels for x(0) and x(t) with proximity guard
    ctx.font = '700 11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(
      `x(0)`,
      Math.max(pad.left + 4, Math.min(pad.left + plotW - 32, x0Px + 8)),
      Math.max(pad.top + 14, Math.min(pad.top + plotH - 6, x0Py - 6))
    );

    const distToX0 = Math.hypot(xtPx - x0Px, xtPy - x0Py);
    if (tVal > 0.04 && distToX0 > 24) {
      ctx.fillStyle = dotColor;
      ctx.fillText(
        `x(t)`,
        Math.max(pad.left + 4, Math.min(pad.left + plotW - 32, xtPx + 9)),
        Math.max(pad.top + 14, Math.min(pad.top + plotH - 6, xtPy + 14))
      );
    }

    ctx.restore();

    // Outer Axis Labels (outside clip so never clipped!)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('xâ‚', pad.left + plotW - 2, cy - 6);
    ctx.textAlign = 'left';
    ctx.fillText('xâ‚‚', cx + 6, pad.top + 12);

    ctx.fillStyle = '#64748b';
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Click or drag anywhere on phase plane to move x(0)', pad.left + plotW / 2, h - 10);
  }, [A, currentX, eigen, preset.classification, tVal, widths.phase, x0]);

  // Draw Right Canvas: Time Evolution x1(t), x2(t)
  useEffect(() => {
    const canvas = timeCanvasRef.current;
    if (!canvas) return;
    const w = widths.time;
    const h = 320;
    const ctx = setupHiDpiCanvas(canvas, w, h);
    if (!ctx) return;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const pad = { left: 46, right: 20, top: 34, bottom: 36 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const samples = 200;
    const tMax = 5.0;
    const ts: number[] = [];
    const x1s: number[] = [];
    const x2s: number[] = [];

    for (let i = 0; i <= samples; i++) {
      const tau = (i / samples) * tMax;
      const p = mulMatVec(computePhi2x2(A, tau), x0);
      ts.push(tau);
      x1s.push(p[0]);
      x2s.push(p[1]);
    }

    const rawMin = Math.min(-1, ...x1s, ...x2s);
    const rawMax = Math.max(1, ...x1s, ...x2s);
    const yMin = Math.max(-15, rawMin - 0.12 * (rawMax - rawMin));
    const yMax = Math.min(15, rawMax + 0.16 * (rawMax - rawMin));

    const toX = (t: number) => pad.left + (t / tMax) * plotW;
    const toY = (v: number) => pad.top + ((yMax - v) / (yMax - yMin)) * plotH;

    // Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let t = 0; t <= 5; t += 1) {
      const gx = toX(t);
      ctx.beginPath();
      ctx.moveTo(gx, pad.top);
      ctx.lineTo(gx, pad.top + plotH);
      ctx.stroke();
    }

    const zeroY = toY(0);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(pad.left, zeroY);
    ctx.lineTo(pad.left + plotW, zeroY);
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + plotH);
    ctx.stroke();

    // Ticks
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    for (let t = 0; t <= 5; t += 1) {
      ctx.fillText(`${t}s`, toX(t), pad.top + plotH + 15);
    }
    ctx.fillText('Time t (s)', pad.left + plotW / 2, h - 8);

    ctx.textAlign = 'right';
    ctx.fillText(fmtShort(yMax), pad.left - 6, pad.top + 8);
    if (Math.abs(zeroY - pad.top) > 14 && Math.abs(zeroY - (pad.top + plotH)) > 14) {
      ctx.fillText('0', pad.left - 6, zeroY + 3);
    }
    ctx.fillText(fmtShort(yMin), pad.left - 6, pad.top + plotH);

    // Curves
    ctx.save();
    ctx.beginPath();
    ctx.rect(pad.left, pad.top, plotW, plotH);
    ctx.clip();

    const drawCurve = (vals: number[], color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i < ts.length; i++) {
        const px = toX(ts[i]);
        const py = toY(Math.max(yMin - 1, Math.min(yMax + 1, vals[i])));
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    };

    drawCurve(x1s, '#38bdf8');
    drawCurve(x2s, '#f59e0b');

    // Vertical scrubber bar
    const scrubX = toX(tVal);
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(scrubX, pad.top);
    ctx.lineTo(scrubX, pad.top + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Active dots on curves
    const y1Px = toY(Math.max(yMin, Math.min(yMax, currentX[0])));
    const y2Px = toY(Math.max(yMin, Math.min(yMax, currentX[1])));
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(scrubX, y1Px, 4.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(scrubX, y2Px, 4.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Clean Top Legend Bar (zero overlap)
    ctx.font = '700 11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`â— xâ‚(${fmtShort(tVal)}) = ${fmtShort(currentX[0])}`, pad.left + 4, 18);
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'right';
    ctx.fillText(`â— xâ‚‚(${fmtShort(tVal)}) = ${fmtShort(currentX[1])}`, pad.left + plotW, 18);
  }, [A, currentX, tVal, widths.time, x0]);

  // Interactive pointer drag on Phase Portrait to move x(0)
  const updateX0FromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = phaseCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;

      const pad = { left: 40, right: 24, top: 24, bottom: 32 };
      const plotW = rect.width - pad.left - pad.right;
      const plotH = rect.height - pad.top - pad.bottom;
      const maxRange = 4.0;
      const scale = Math.min(plotW, plotH) / (2 * maxRange);
      const cx = pad.left + plotW / 2;
      const cy = pad.top + plotH / 2;

      const rawX1 = (px - cx) / scale;
      const rawX2 = (cy - py) / scale;
      const snap = (v: number) => Math.max(-3, Math.min(3, Math.round(v * 4) / 4));
      setX0([snap(rawX1), snap(rawX2)]);
    },
    []
  );

  // KaTeX strings for Resolvent, Phi(t), and Eigenvalues
  const resolventTex = useMemo(() => {
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    const tr = A[0][0] + A[1][1];
    let denomTex: string;
    if (eigen.kind === 'real-distinct') {
      const r1 = -eigen.lambda1.re;
      const r2 = -eigen.lambda2.re;
      const f1 = r1 === 0 ? 's' : r1 > 0 ? `(s + ${fmtShort(r1)})` : `(s - ${fmtShort(Math.abs(r1))})`;
      const f2 = r2 === 0 ? 's' : r2 > 0 ? `(s + ${fmtShort(r2)})` : `(s - ${fmtShort(Math.abs(r2))})`;
      denomTex = `${f1}${f2}`;
    } else {
      const bTerm = -tr === 0 ? '' : -tr > 0 ? ` + ${fmtShort(-tr)}s` : ` - ${fmtShort(Math.abs(tr))}s`;
      const cTerm = det === 0 ? '' : det > 0 ? ` + ${fmtShort(det)}` : ` - ${fmtShort(Math.abs(det))}`;
      denomTex = `s^2${bTerm}${cTerm}`;
    }
    const e11 = formatLinS(1, -A[1][1]);
    const e12 = fmtShort(A[0][1]);
    const e21 = fmtShort(A[1][0]);
    const e22 = formatLinS(1, -A[0][0]);
    return String.raw`(s\mathbf{I} - \mathbf{A})^{-1} = \frac{1}{${denomTex}} \begin{bmatrix} ${e11} & ${e12} \\ ${e21} & ${e22} \end{bmatrix}`;
  }, [A, eigen]);

  const phiNumericalTex = useMemo(() => {
    return String.raw`\mathbf{\Phi}(${fmtShort(tVal)}) = \begin{bmatrix} ${fmt(phiT[0][0])} & ${fmt(phiT[0][1])} \\ ${fmt(phiT[1][0])} & ${fmt(phiT[1][1])} \end{bmatrix}, \quad \mathbf{x}(${fmtShort(tVal)}) = \begin{bmatrix} ${fmt(currentX[0])} \\ ${fmt(currentX[1])} \end{bmatrix}`;
  }, [currentX, phiT, tVal]);

  const eigenTex = useMemo(() => {
    if (eigen.kind === 'complex') {
      const sStr = fmtShort(eigen.lambda1.re);
      const wStr = fmtShort(Math.abs(eigen.lambda1.im));
      return String.raw`\lambda_{1,2} = ${sStr} \pm ${wStr}j`;
    }
    return String.raw`\lambda_1 = ${fmtShort(eigen.lambda1.re)},\quad \lambda_2 = ${fmtShort(eigen.lambda2.re)}`;
  }, [eigen]);

  return (
    <section className="space-y-5 text-[var(--ink)]">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[var(--rule)] pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="hidden">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--forest)]">
            <Compass size={14} weight="bold" />
            CH 3.6â€“3.7 Â· STATE TRANSITION MATRIX &amp; PHASE PORTRAIT LAB
          </div>
          <h3 className="mt-2 text-xl font-bold text-[var(--ink)]">
            <MathText text="State Transition $\mathbf{\Phi}(t) = e^{\mathbf{A}t}$ &amp; Phase Portrait" />
          </h3>
        </div>

        {/* Live Sanity Check Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold ${
              sanityCheck.idOk && sanityCheck.derivOk
                ? 'border-emerald-400/50 bg-emerald-400/15 text-[var(--forest)]'
                : 'border-rose-400/50 bg-rose-400/15 text-rose-200'
            }`}
          >
            {sanityCheck.idOk ? (
              <CheckCircle size={16} weight="fill" className="text-[var(--forest)]" />
            ) : (
              <Warning size={16} weight="fill" className="text-rose-400" />
            )}
            <span>
              Sanity Check: <MathText text="$\mathbf{\Phi}(0) = \mathbf{I}$" /> &amp;{' '}
              <MathText text="$\dot{\mathbf{\Phi}}(0) = \mathbf{A}$" /> Verified
            </span>
          </div>
        </div>
      </div>

      {/* Presets + What to Notice */}
      <div className="mt-4 rounded-xl border border-amber-400/25 bg-[var(--paper-muted)] p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--plot-2)]">
            <Lightbulb size={15} weight="fill" />
            What to notice Â· Pick a system regime
          </div>
          <span className="text-xs text-[var(--ink-faint)]">{preset.note}</span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-2">
          {MATRIX_PRESETS.map((p) => {
            const active = presetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPresetId(p.id);
                  setX0(p.defaultX0);
                  setTVal(0.8);
                  setIsPlaying(false);
                }}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? p.classification === 'unstable'
                      ? 'border-rose-400/60 bg-rose-400/15 text-rose-200'
                      : p.classification === 'marginal'
                        ? 'border-amber-400/60 bg-amber-400/15 text-[var(--plot-2)]'
                        : 'border-emerald-400/60 bg-emerald-400/15 text-[var(--forest)]'
                    : 'border-[var(--rule-strong)] bg-[var(--paper-muted)] text-[var(--ink-soft)] hover:border-[var(--rule-strong)]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Initial Condition & Time Scrubber Controls */}
      <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="flex justify-between text-xs font-medium text-[var(--ink-soft)]">
            <span>Initial <MathText text="$x_1(0)$" /></span>
            <span className="font-mono text-[var(--plot-3)]">{fmtShort(x0[0])}</span>
          </div>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.25}
            value={x0[0]}
            onChange={(e) => setX0([parseFloat(e.target.value), x0[1]])}
            className="mt-1.5 w-full"
          />
        </div>

        <div className="lg:col-span-3">
          <div className="flex justify-between text-xs font-medium text-[var(--ink-soft)]">
            <span>Initial <MathText text="$x_2(0)$" /></span>
            <span className="font-mono text-[var(--plot-2)]">{fmtShort(x0[1])}</span>
          </div>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.25}
            value={x0[1]}
            onChange={(e) => setX0([x0[0], parseFloat(e.target.value)])}
            className="mt-1.5 w-full"
          />
        </div>

        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[var(--ink-soft)]">
            <span>
              Time Scrubber <MathText text="$t \in [0, 5]\text{ s}$" />
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[var(--plot-2)] font-bold">t = {tVal.toFixed(2)} s</span>
              <button
                type="button"
                onClick={() => {
                  if (tVal >= 4.98) setTVal(0);
                  setIsPlaying((prev) => !prev);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-sky-400/50 bg-sky-400/15 px-2.5 py-1 text-xs font-semibold text-[var(--plot-3)] hover:bg-sky-400/25"
              >
                {isPlaying ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setTVal(0);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--rule-strong)] bg-[var(--paper-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--ink-soft)] hover:border-[var(--rule-strong)]"
                title="Jump to t = 0 to see Î¦(0) = I"
              >
                <ArrowCounterClockwise size={13} /> t = 0 (Î¦ = I)
              </button>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.02}
            value={tVal}
            onChange={(e) => {
              setIsPlaying(false);
              setTVal(parseFloat(e.target.value));
            }}
            className="mt-1.5 w-full"
          />
        </div>
      </div>

      {/* Dual Canvases */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div ref={phaseContainerRef} className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
          <div className="mb-1.5 flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-[var(--ink-soft)]">2D Phase Portrait (xâ‚, xâ‚‚)</span>
            <span className="font-mono text-xs text-[var(--ink-faint)]">{preset.subtitle}</span>
          </div>
          <canvas
            ref={phaseCanvasRef}
            onPointerDown={(e) => {
              isDraggingRef.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              updateX0FromPointer(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (!isDraggingRef.current) return;
              updateX0FromPointer(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              isDraggingRef.current = false;
            }}
            onPointerCancel={() => {
              isDraggingRef.current = false;
            }}
            className="block w-full h-[320px] rounded-lg cursor-crosshair touch-none"
          />
        </div>

        <div ref={timeContainerRef} className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
          <div className="mb-1.5 flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-[var(--ink-soft)]">State Trajectories xâ‚(t), xâ‚‚(t)</span>
            <span className="font-mono text-xs text-[var(--ink-faint)]">x(t) = Î¦(t)x(0)</span>
          </div>
          <canvas ref={timeCanvasRef} className="block w-full h-[320px] rounded-lg" />
        </div>
      </div>

      {/* Live Matrix Readout */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
              Eigenvalues &amp; Matrix A
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                preset.classification === 'stable'
                  ? 'bg-emerald-400/15 text-[var(--forest)]'
                  : preset.classification === 'marginal'
                    ? 'bg-amber-400/15 text-[var(--plot-2)]'
                    : 'bg-rose-400/15 text-rose-300'
              }`}
            >
              {preset.classification === 'stable'
                ? 'Asymptotically Stable'
                : preset.classification === 'marginal'
                  ? 'Marginally Stable (Center)'
                  : 'Unstable (RHP Eigenvalue)'}
            </span>
          </div>
          <MathBlock
            tex={String.raw`\mathbf{A} = \begin{bmatrix} ${fmtShort(A[0][0])} & ${fmtShort(A[0][1])} \\ ${fmtShort(A[1][0])} & ${fmtShort(A[1][1])} \end{bmatrix}, \quad ${eigenTex}`}
            className="text-sm"
          />
        </div>

        <div className="xl:col-span-7 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
            Resolvent <MathText text="$(s\mathbf{I} - \mathbf{A})^{-1}$" /> &amp; Live <MathText text="$\mathbf{\Phi}(t)$" />
          </div>
          <MathBlock tex={resolventTex} className="text-sm" />
          <div className="border-t border-[var(--rule)] pt-2">
            <MathBlock tex={phiNumericalTex} className="text-sm text-amber-100" />
          </div>
        </div>
      </div>
    </section>
  );
};
