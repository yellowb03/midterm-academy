import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowCounterClockwise,
  ArrowRight,
  GitBranch,
  Lightbulb,
  Minus,
  Plus,
  Pulse,
  Sparkle,
  Warning,
} from '@phosphor-icons/react';
import { MathBlock, MathText } from '../MathText';

type LabMode = 'sign-flip' | 'e225-tracer';

interface SignFlipPreset {
  id: string;
  label: string;
  feedbackSign: 'negative' | 'positive';
  k: number;
  a: number;
  h: number;
  note: string;
}

const SIGN_FLIP_PRESETS: SignFlipPreset[] = [
  {
    id: 'neg-stable',
    label: 'Negative Feedback (K = 2)',
    feedbackSign: 'negative',
    k: 2.0,
    a: 1.0,
    h: 1.0,
    note: 'Negative feedback pushes the pole LEFT from -1 to -3: faster & bounded.',
  },
  {
    id: 'pos-tipping',
    label: 'Positive Tipping Point (K = 1)',
    feedbackSign: 'positive',
    k: 1.0,
    a: 1.0,
    h: 1.0,
    note: 'At KH = a, the closed-loop pole lands right on s = 0 (integrator ramp)!',
  },
  {
    id: 'pos-blowup',
    label: 'Positive Blow-Up (K = 2.5)',
    feedbackSign: 'positive',
    k: 2.5,
    a: 1.0,
    h: 1.0,
    note: 'With +H and KH > a, the pole crosses into the RHP (+1.5) and explodes!',
  },
];

interface TracerStep {
  step: 1 | 2 | 3 | 4;
  shortTitle: string;
  nodeTag: string;
  title: string;
  tex: string;
  intuition: string;
}

const E225_STEPS: TracerStep[] = [
  {
    step: 1,
    shortTitle: 'Output â†’ V(s)',
    nodeTag: 'Y(s), V(s)',
    title: 'Step 1: Walk backward across the integrator Gâ‚‚ = 1/s',
    tex: String.raw`Y(s) = \frac{1}{s} V(s) \implies \color{#f59e0b}{V(s) = s Y(s)}`,
    intuition:
      'Start at the output Y(s) and invert the integrator 1/s. Immediately you eliminate V(s) in favor of sY(s).',
  },
  {
    step: 2,
    shortTitle: 'Feedback B(s)',
    nodeTag: 'B(s)',
    title: 'Step 2: Sum both (+ / +) branches at the lower feedback junction',
    tex: String.raw`\color{#34d399}{B(s)} = Y(s) + 2V(s) = Y(s) + 2(sY(s)) = \color{#34d399}{(2s + 1)Y(s)}`,
    intuition:
      'Watch the signs! Both Y(s) and 2V(s) enter the lower summer with (+) signs. The inner velocity tap adds 2sY to Y.',
  },
  {
    step: 3,
    shortTitle: 'Error E(s) â†’ V(s)',
    nodeTag: 'E(s)',
    title: 'Step 3: Apply outer negative feedback and forward block Gâ‚',
    tex: String.raw`\color{#38bdf8}{E(s)} = R(s) - B(s) = R(s) - (2s + 1)Y(s), \qquad V(s) = \frac{10}{s + 1} E(s)`,
    intuition:
      'Only at the main input summer does B(s) get subtracted from R(s). Then Gâ‚ = 10/(s+1) maps E(s) to V(s).',
  },
  {
    step: 4,
    shortTitle: 'Solve T(s)',
    nodeTag: 'T(s)',
    title: 'Step 4: Substitute V(s) = sY(s) and collect Y(s) terms',
    tex: String.raw`sY(s) = \frac{10}{s+1}\big[R(s) - (2s+1)Y(s)\big] \implies (s^2 + s + 20s + 10)Y(s) = 10R(s) \implies \color{#f59e0b}{T(s) = \frac{10}{s^2 + 21s + 10}}`,
    intuition:
      'Multiply through by (s + 1) and move -10(2s + 1)Y(s) to the left. The inner gain-2 tap creates the +20s damping term!',
  },
];

function formatNum(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(2).replace(/0$/, '');
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

export const BlockDiagramLab: React.FC = () => {
  const [mode, setMode] = useState<LabMode>('sign-flip');

  // Mode 1 state
  const [feedbackSign, setFeedbackSign] = useState<'negative' | 'positive'>('negative');
  const [gainK, setGainK] = useState<number>(2.0);
  const [poleA, setPoleA] = useState<number>(1.0);
  const [feedbackH, setFeedbackH] = useState<number>(1.0);
  const [activePresetId, setActivePresetId] = useState<string>('neg-stable');

  // Mode 2 state
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Canvas refs for Mode 1
  const sPlaneContainerRef = useRef<HTMLDivElement | null>(null);
  const sPlaneCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stepContainerRef = useRef<HTMLDivElement | null>(null);
  const stepCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasWidths, setCanvasWidths] = useState<{ sPlane: number; step: number }>({
    sPlane: 400,
    step: 400,
  });

  // Derived Mode 1 quantities
  const denomConst = feedbackSign === 'negative' ? poleA + gainK * feedbackH : poleA - gainK * feedbackH;
  const closedLoopPole = -denomConst;
  const stabilityState: 'stable' | 'marginal' | 'unstable' =
    closedLoopPole < -0.04 ? 'stable' : closedLoopPole > 0.04 ? 'unstable' : 'marginal';

  const tfTex = useMemo(() => {
    const kStr = formatNum(gainK);
    const aStr = formatNum(poleA);
    const khStr = formatNum(gainK * feedbackH);
    const dStr = formatNum(Math.abs(denomConst));
    const signSymbol = feedbackSign === 'negative' ? '+' : '-';
    const signColor = feedbackSign === 'negative' ? '#34d399' : '#fb7185';
    const finalDen =
      Math.abs(denomConst) < 0.01
        ? 's'
        : denomConst > 0
          ? `s + ${dStr}`
          : `s - ${dStr}`;
    return String.raw`T(s) = \frac{G}{1 \color{${signColor}}{${signSymbol}} GH} = \frac{\frac{${kStr}}{s+${aStr}}}{1 \color{${signColor}}{${signSymbol}} \frac{${khStr}}{s+${aStr}}} = \frac{${kStr}}{${finalDen}}`;
  }, [denomConst, feedbackH, feedbackSign, gainK, poleA]);

  // ResizeObserver for Mode 1 canvases
  useEffect(() => {
    if (mode !== 'sign-flip') return;
    const sEl = sPlaneContainerRef.current;
    const tEl = stepContainerRef.current;
    if (!sEl && !tEl) return;

    const updateSizes = () => {
      setCanvasWidths((prev) => ({
        sPlane: sEl ? Math.max(260, Math.floor(sEl.clientWidth)) : prev.sPlane,
        step: tEl ? Math.max(260, Math.floor(tEl.clientWidth)) : prev.step,
      }));
    };
    updateSizes();

    const ro = new ResizeObserver(updateSizes);
    if (sEl) ro.observe(sEl);
    if (tEl) ro.observe(tEl);
    return () => ro.disconnect();
  }, [mode]);

  // Draw s-Plane Canvas
  useEffect(() => {
    if (mode !== 'sign-flip') return;
    const canvas = sPlaneCanvasRef.current;
    if (!canvas) return;
    const w = canvasWidths.sPlane;
    const h = 250;
    const ctx = setupHiDpiCanvas(canvas, w, h);
    if (!ctx) return;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const pad = { left: 38, right: 20, top: 32, bottom: 34 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const reMin = -8.5;
    const reMax = 5.5;
    const imMin = -2.5;
    const imMax = 2.5;

    const toX = (re: number) => pad.left + ((re - reMin) / (reMax - reMin)) * plotW;
    const toY = (im: number) => pad.top + ((imMax - im) / (imMax - imMin)) * plotH;
    const originX = toX(0);
    const originY = toY(0);

    // LHP & RHP shading
    ctx.fillStyle = 'rgba(52, 211, 153, 0.055)';
    ctx.fillRect(pad.left, pad.top, Math.max(0, originX - pad.left), plotH);
    ctx.fillStyle = 'rgba(251, 113, 133, 0.08)';
    ctx.fillRect(originX, pad.top, Math.max(0, pad.left + plotW - originX), plotH);

    // Subtle grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.09)';
    ctx.lineWidth = 1;
    for (let r = -8; r <= 5; r += 1) {
      const gx = toX(r);
      ctx.beginPath();
      ctx.moveTo(gx, pad.top);
      ctx.lineTo(gx, pad.top + plotH);
      ctx.stroke();
    }
    for (let im = -2; im <= 2; im += 1) {
      const gy = toY(im);
      ctx.beginPath();
      ctx.moveTo(pad.left, gy);
      ctx.lineTo(pad.left + plotW, gy);
      ctx.stroke();
    }

    // Region labels
    ctx.font = '600 10px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(52, 211, 153, 0.72)';
    ctx.textAlign = 'left';
    ctx.fillText('STABLE LHP (Re < 0)', pad.left + 8, pad.top + 14);
    ctx.fillStyle = 'rgba(251, 113, 133, 0.78)';
    ctx.textAlign = 'right';
    ctx.fillText('DANGER RHP (Re > 0)', pad.left + plotW - 8, pad.top + 14);

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(pad.left, originY);
    ctx.lineTo(pad.left + plotW, originY);
    ctx.stroke();

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(originX, pad.top);
    ctx.lineTo(originX, pad.top + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tick labels on real axis
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    for (const tick of [-8, -6, -4, -2, 0, 2, 4]) {
      ctx.fillText(`${tick}`, toX(tick), originY + 14);
    }
    ctx.textAlign = 'right';
    ctx.fillText('Re(s)', pad.left + plotW, originY - 6);
    ctx.textAlign = 'left';
    ctx.fillText('Im(s)', originX + 6, pad.top + 30);

    // Open-loop pole at -a
    const olX = toX(-poleA);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    const sz = 5;
    ctx.beginPath();
    ctx.moveTo(olX - sz, originY - sz);
    ctx.lineTo(olX + sz, originY + sz);
    ctx.moveTo(olX - sz, originY + sz);
    ctx.lineTo(olX + sz, originY - sz);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`OL: -${formatNum(poleA)}`, olX, originY + 30);

    // Shift arrow from OL pole to CL pole
    const clampedCl = Math.max(reMin + 0.3, Math.min(reMax - 0.3, closedLoopPole));
    const clX = toX(clampedCl);
    const poleColor =
      stabilityState === 'stable'
        ? '#34d399'
        : stabilityState === 'marginal'
          ? '#f59e0b'
          : '#fb7185';

    if (Math.abs(clX - olX) > 12) {
      const arcY = originY - 22;
      ctx.strokeStyle = poleColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(olX, originY - 10);
      ctx.quadraticCurveTo((olX + clX) / 2, arcY - 12, clX, originY - 10);
      ctx.stroke();

      // Arrowhead near clX
      const dir = clX > olX ? 1 : -1;
      ctx.fillStyle = poleColor;
      ctx.beginPath();
      ctx.moveTo(clX, originY - 10);
      ctx.lineTo(clX - dir * 7, originY - 17);
      ctx.lineTo(clX - dir * 2, originY - 20);
      ctx.closePath();
      ctx.fill();

      ctx.font = '600 10.5px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      const shiftText =
        Math.abs(clX - olX) > 76
          ? feedbackSign === 'negative'
            ? 'â† shifts left (-KH)'
            : 'shifts right (+KH) â†’'
          : feedbackSign === 'negative'
            ? '-KH'
            : '+KH';
      ctx.fillText(shiftText, (olX + clX) / 2, arcY - 12);
    }

    // Closed-loop pole X with glow
    ctx.save();
    ctx.shadowColor = poleColor;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = poleColor;
    ctx.lineWidth = 3;
    const csz = 7;
    ctx.beginPath();
    ctx.moveTo(clX - csz, originY - csz);
    ctx.lineTo(clX + csz, originY + csz);
    ctx.moveTo(clX - csz, originY + csz);
    ctx.lineTo(clX + csz, originY - csz);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = poleColor;
    ctx.font = '700 12px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'center';
    const labelText = `CL Pole: ${formatNum(closedLoopPole)}`;
    const clampedLabelX = Math.max(pad.left + 52, Math.min(pad.left + plotW - 52, clX));
    ctx.fillText(labelText, clampedLabelX, originY - 56);
  }, [canvasWidths.sPlane, closedLoopPole, feedbackSign, mode, poleA, stabilityState]);

  // Draw Step Response Canvas
  useEffect(() => {
    if (mode !== 'sign-flip') return;
    const canvas = stepCanvasRef.current;
    if (!canvas) return;
    const w = canvasWidths.step;
    const h = 250;
    const ctx = setupHiDpiCanvas(canvas, w, h);
    if (!ctx) return;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const pad = { left: 46, right: 20, top: 32, bottom: 34 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const tMax = 5.0;
    const evalY = (t: number): number => {
      if (Math.abs(denomConst) < 1e-3) {
        return gainK * t;
      }
      return (gainK / denomConst) * (1 - Math.exp(-denomConst * t));
    };

    const ySS = stabilityState === 'stable' ? gainK / denomConst : Infinity;
    const yMax =
      stabilityState === 'stable'
        ? Math.max(1.5, Math.ceil((Math.max(1, ySS) * 1.35) * 2) / 2)
        : 10;
    const yMin = -0.2;

    const toX = (t: number) => pad.left + (t / tMax) * plotW;
    const toY = (y: number) => pad.top + ((yMax - y) / (yMax - yMin)) * plotH;

    // Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.09)';
    ctx.lineWidth = 1;
    for (let t = 0; t <= 5; t += 1) {
      const gx = toX(t);
      ctx.beginPath();
      ctx.moveTo(gx, pad.top);
      ctx.lineTo(gx, pad.top + plotH);
      ctx.stroke();
    }
    const yStep = yMax <= 2.5 ? 0.5 : yMax <= 6 ? 1 : 2;
    for (let y = 0; y <= yMax + 0.01; y += yStep) {
      const gy = toY(y);
      ctx.beginPath();
      ctx.moveTo(pad.left, gy);
      ctx.lineTo(pad.left + plotW, gy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(pad.left, toY(0));
    ctx.lineTo(pad.left + plotW, toY(0));
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + plotH);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    for (let t = 0; t <= 5; t += 1) {
      ctx.fillText(`${t}`, toX(t), pad.top + plotH + 14);
    }
    ctx.fillText('Time t (s)', pad.left + plotW / 2, pad.top + plotH + 28);

    ctx.textAlign = 'right';
    for (let y = 0; y <= yMax + 0.01; y += yStep) {
      ctx.fillText(formatNum(y), pad.left - 6, toY(y) + 3);
    }

    // Reference r(t) = 1
    const refY = toY(1);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, refY);
    ctx.lineTo(pad.left + plotW, refY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 10px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('r(t) = 1', pad.left + plotW - 4, refY - 5);

    // Steady-state asymptote if stable
    if (stabilityState === 'stable') {
      const ssY = toY(ySS);
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.55)';
      ctx.beginPath();
      ctx.moveTo(pad.left, ssY);
      ctx.lineTo(pad.left + plotW, ssY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#34d399';
      ctx.textAlign = 'left';
      const labelAbove = ssY > pad.top + 22;
      ctx.fillText(`y_ss = ${formatNum(ySS)}`, pad.left + 8, labelAbove ? ssY - 6 : ssY + 14);
    }

    // Clip to plot area before drawing curve
    ctx.save();
    ctx.beginPath();
    ctx.rect(pad.left, pad.top, plotW, plotH);
    ctx.clip();

    const curveColor =
      stabilityState === 'stable'
        ? '#34d399'
        : stabilityState === 'marginal'
          ? '#f59e0b'
          : '#fb7185';

    ctx.shadowColor = curveColor;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = curveColor;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    const samples = 220;
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * tMax;
      const y = Math.min(yMax + 2, evalY(t));
      const px = toX(t);
      const py = toY(y);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // Direct curve status tag in top header band (outside plot area)
    ctx.fillStyle = curveColor;
    ctx.font = '700 11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left';
    const statusLabel =
      stabilityState === 'stable'
        ? 'â— y(t) bounded & convergent'
        : stabilityState === 'marginal'
          ? 'â— y(t) = Kt (linear ramp blow-up!)'
          : 'â— y(t) â†’ âˆž (exponential blow-up!)';
    ctx.fillText(statusLabel, pad.left + 4, 18);
  }, [canvasWidths.step, denomConst, gainK, mode, stabilityState]);

  const applyPreset = (p: SignFlipPreset) => {
    setFeedbackSign(p.feedbackSign);
    setGainK(p.k);
    setPoleA(p.a);
    setFeedbackH(p.h);
    setActivePresetId(p.id);
  };

  const currentE225Step = E225_STEPS.find((s) => s.step === activeStep) ?? E225_STEPS[0];

  return (
    <section className="space-y-5 text-[var(--ink)]">
      {/* Header + Mode Tabs */}
      <div className="flex flex-col gap-4 border-b border-[var(--rule)] pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="hidden">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--plot-3)]">
            <GitBranch size={14} weight="bold" />
            CH 2.6 Â· BLOCK DIAGRAMS &amp; FEEDBACK SIGN LAB
          </div>
          <h3 className="mt-2 text-xl font-bold text-[var(--ink)]">
            Feedback Sign-Flip &amp; Multiloop Signal Tracer
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode('sign-flip')}
            className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all border ${
              mode === 'sign-flip'
                ? 'border-sky-400/60 bg-sky-400/15 text-[var(--plot-3)] shadow-lg shadow-sky-950/40'
                : 'border-[var(--rule-strong)] bg-[var(--paper-muted)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
            }`}
          >
            Mode 1: Negative vs Positive Feedback (Ex 2.6)
          </button>
          <button
            type="button"
            onClick={() => setMode('e225-tracer')}
            className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all border ${
              mode === 'e225-tracer'
                ? 'border-amber-400/60 bg-amber-400/15 text-[var(--plot-2)] shadow-lg shadow-amber-950/40'
                : 'border-[var(--rule-strong)] bg-[var(--paper-muted)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
            }`}
          >
            Mode 2: HW E2.25 Signal-Equation Tracer
          </button>
        </div>
      </div>

      {mode === 'sign-flip' ? (
        <div className="mt-5 space-y-5">
          {/* Guided "What to notice" + Presets */}
          <div className="rounded-xl border border-amber-400/25 bg-[var(--paper-muted)] p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--plot-2)]">
                <Lightbulb size={15} weight="fill" />
                What to notice Â· Click a scenario
              </div>
              <span className="text-xs text-[var(--ink-faint)]">
                Watch the closed-loop pole cross the imaginary axis when <MathText text="$+H$" /> exceeds <MathText text="$a$" />.
              </span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {SIGN_FLIP_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    activePresetId === preset.id
                      ? preset.feedbackSign === 'negative'
                        ? 'border-emerald-400/60 bg-emerald-400/15 text-[var(--forest)]'
                        : 'border-rose-400/60 bg-rose-400/15 text-rose-200'
                      : 'border-[var(--rule-strong)] bg-[var(--paper-muted)] text-[var(--ink-soft)] hover:border-[var(--rule-strong)]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG Block Diagram + Controls */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            {/* SVG Block Diagram */}
            <div className="xl:col-span-7 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
                  Interactive Closed-Loop Block Diagram (Click Sign!)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActivePresetId('');
                    setFeedbackSign((prev) => (prev === 'negative' ? 'positive' : 'negative'));
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-bold transition-all ${
                    feedbackSign === 'negative'
                      ? 'border-emerald-400/60 bg-emerald-400/15 text-[var(--forest)] hover:bg-emerald-400/25'
                      : 'border-rose-400/60 bg-rose-400/15 text-rose-300 hover:bg-rose-400/25'
                  }`}
                >
                  {feedbackSign === 'negative' ? <Minus size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
                  {feedbackSign === 'negative' ? 'Negative Feedback (-H)' : 'Positive Feedback (+H)'}
                </button>
              </div>

              <svg viewBox="0 0 600 185" className="w-full h-auto select-none">
                <defs>
                  <marker id="arrow-cyan" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,1 L7,4 L0,7 Z" fill="#38bdf8" />
                  </marker>
                  <marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,1 L7,4 L0,7 Z" fill="#f59e0b" />
                  </marker>
                  <marker
                    id="arrow-fb"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path
                      d="M0,1 L7,4 L0,7 Z"
                      fill={feedbackSign === 'negative' ? '#34d399' : '#fb7185'}
                    />
                  </marker>
                </defs>

                {/* R(s) -> Summer */}
                <line x1="25" y1="62" x2="112" y2="62" stroke="#38bdf8" strokeWidth="2.4" markerEnd="url(#arrow-cyan)" />
                <text x="28" y="50" fill="#38bdf8" fontSize="13" fontWeight="700">R(s)</text>
                <text x="98" y="52" fill="#38bdf8" fontSize="13" fontWeight="700">+</text>

                {/* Summing Junction */}
                <g
                  onClick={() => {
                    setActivePresetId('');
                    setFeedbackSign((prev) => (prev === 'negative' ? 'positive' : 'negative'));
                  }}
                  className="cursor-pointer"
                >
                  <circle
                    cx="132"
                    cy="62"
                    r="18"
                    fill="#0f1522"
                    stroke={feedbackSign === 'negative' ? '#34d399' : '#fb7185'}
                    strokeWidth="2.4"
                  />
                  <line x1="120" y1="50" x2="144" y2="74" stroke="#475569" strokeWidth="1.2" />
                  <line x1="144" y1="50" x2="120" y2="74" stroke="#475569" strokeWidth="1.2" />
                  <text
                    x="144"
                    y="97"
                    fill={feedbackSign === 'negative' ? '#34d399' : '#fb7185'}
                    fontSize="16"
                    fontWeight="800"
                  >
                    {feedbackSign === 'negative' ? 'âˆ’' : '+'}
                  </text>
                </g>

                {/* Summer -> G(s) */}
                <line x1="150" y1="62" x2="236" y2="62" stroke="#94a3b8" strokeWidth="2.2" markerEnd="url(#arrow-amber)" />
                <text x="193" y="50" fill="#cbd5e1" fontSize="12" textAnchor="middle">E(s)</text>

                {/* Plant Block G(s) */}
                <rect x="242" y="34" width="152" height="56" rx="10" fill="#161f33" stroke="#38bdf8" strokeWidth="2" />
                <text x="318" y="57" fill="#f8fafc" fontSize="13" fontWeight="700" textAnchor="middle">
                  G(s) = {formatNum(gainK)} / (s + {formatNum(poleA)})
                </text>
                <text x="318" y="76" fill="#94a3b8" fontSize="10.5" textAnchor="middle">
                  Open-loop pole: -{formatNum(poleA)}
                </text>

                {/* G(s) -> Y(s) */}
                <line x1="394" y1="62" x2="555" y2="62" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrow-amber)" />
                <text x="530" y="48" fill="#f59e0b" fontSize="13" fontWeight="700">Y(s)</text>

                {/* Pickoff dot */}
                <circle cx="468" cy="62" r="4.5" fill="#f59e0b" />

                {/* Feedback branch */}
                <path
                  d="M 468 62 L 468 142 L 368 142"
                  fill="none"
                  stroke={feedbackSign === 'negative' ? '#34d399' : '#fb7185'}
                  strokeWidth="2.2"
                  markerEnd="url(#arrow-fb)"
                />
                <rect
                  x="270"
                  y="118"
                  width="92"
                  height="46"
                  rx="10"
                  fill="#161f33"
                  stroke={feedbackSign === 'negative' ? '#34d399' : '#fb7185'}
                  strokeWidth="2"
                />
                <text x="316" y="146" fill="#f8fafc" fontSize="13" fontWeight="700" textAnchor="middle">
                  H = {formatNum(feedbackH)}
                </text>
                <path
                  d="M 270 142 L 132 142 L 132 84"
                  fill="none"
                  stroke={feedbackSign === 'negative' ? '#34d399' : '#fb7185'}
                  strokeWidth="2.2"
                  markerEnd="url(#arrow-fb)"
                />
              </svg>

              {/* Live Transfer Function KaTeX */}
              <div className="mt-2 rounded-lg border border-[var(--rule)] bg-[var(--paper-raised)] px-3 py-2">
                <MathBlock tex={tfTex} className="text-sm sm:text-base" />
              </div>
            </div>

            {/* Sliders & Live Diagnosis */}
            <div className="xl:col-span-5 flex flex-col justify-between gap-4 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4">
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs font-medium text-[var(--ink-soft)]">
                    <span>Forward Gain <MathText text="$K$" /></span>
                    <span className="font-mono text-[var(--plot-3)]">{formatNum(gainK)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={5.0}
                    step={0.1}
                    value={gainK}
                    onChange={(e) => {
                      setActivePresetId('');
                      setGainK(parseFloat(e.target.value));
                    }}
                    className="mt-1.5 w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-[var(--ink-soft)]">
                    <span>Open-Loop Pole <MathText text="$a$" /> (in <MathText text="$s+a$" />)</span>
                    <span className="font-mono text-[var(--ink)]">{formatNum(poleA)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={3.0}
                    step={0.1}
                    value={poleA}
                    onChange={(e) => {
                      setActivePresetId('');
                      setPoleA(parseFloat(e.target.value));
                    }}
                    className="mt-1.5 w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-[var(--ink-soft)]">
                    <span>Feedback Gain <MathText text="$H$" /></span>
                    <span className="font-mono text-[var(--plot-2)]">{formatNum(feedbackH)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={feedbackH}
                    onChange={(e) => {
                      setActivePresetId('');
                      setFeedbackH(parseFloat(e.target.value));
                    }}
                    className="mt-1.5 w-full"
                  />
                </div>
              </div>

              {/* Stability Verdict Box */}
              <div
                className={`rounded-xl border p-3.5 ${
                  stabilityState === 'stable'
                    ? 'border-emerald-400/40 bg-emerald-400/10'
                    : stabilityState === 'marginal'
                      ? 'border-amber-400/40 bg-amber-400/10'
                      : 'border-rose-400/50 bg-rose-400/10'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider">
                  {stabilityState === 'unstable' ? (
                    <Warning size={16} weight="fill" className="text-rose-400" />
                  ) : (
                    <Pulse size={16} weight="bold" className={stabilityState === 'stable' ? 'text-[var(--forest)]' : 'text-[var(--plot-2)]'} />
                  )}
                  <span
                    className={
                      stabilityState === 'stable'
                        ? 'text-[var(--forest)]'
                        : stabilityState === 'marginal'
                          ? 'text-[var(--plot-2)]'
                          : 'text-rose-300'
                    }
                  >
                    {stabilityState === 'stable'
                      ? `Stable Closed-Loop Pole: s = ${formatNum(closedLoopPole)}`
                      : stabilityState === 'marginal'
                        ? 'Marginal Pole at s = 0 (Integrator Ramp!)'
                        : `Unstable RHP Pole: s = +${formatNum(closedLoopPole)}`}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-soft)]">
                  {feedbackSign === 'negative'
                    ? `Negative feedback adds +KH (${formatNum(gainK * feedbackH)}) to the denominator, shifting the pole LEFT to -${formatNum(denomConst)}.`
                    : stabilityState === 'unstable'
                      ? `Positive feedback subtracts KH (${formatNum(gainK * feedbackH)}) from a (${formatNum(poleA)}), pushing the pole into the RHP so y(t) blows up!`
                      : stabilityState === 'marginal'
                        ? `KH equals a (${formatNum(poleA)}), canceling the denominator constant completely: T(s) = K/s.`
                        : `Positive feedback shifts the pole RIGHT toward 0. Keep increasing K past ${formatNum(poleA / feedbackH)} to cross the stability boundary!`}
                </p>
              </div>
            </div>
          </div>

          {/* Dual Canvases: s-Plane + Step Response */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div ref={sPlaneContainerRef} className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
              <div className="mb-1.5 flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-[var(--ink-soft)]">s-Plane Closed-Loop Pole Migration</span>
                <span className="font-mono text-xs text-[var(--ink-faint)]">s = -({formatNum(poleA)} {feedbackSign === 'negative' ? '+' : 'âˆ’'} KH)</span>
              </div>
              <canvas ref={sPlaneCanvasRef} className="block w-full h-[250px] rounded-lg" />
            </div>

            <div ref={stepContainerRef} className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
              <div className="mb-1.5 flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-[var(--ink-soft)]">Unit Step Response y(t)</span>
                <span className="font-mono text-xs text-[var(--ink-faint)]">
                  {stabilityState === 'stable'
                    ? `y_ss = ${formatNum(gainK / denomConst)}`
                    : 'Unbounded Output'}
                </span>
              </div>
              <canvas ref={stepCanvasRef} className="block w-full h-[250px] rounded-lg" />
            </div>
          </div>
        </div>
      ) : (
        /* MODE 2: E2.25 SIGNAL-EQUATION TRACER */
        <div className="mt-5 space-y-5">
          {/* Guided Intro */}
          <div className="rounded-xl border border-amber-400/25 bg-[var(--paper-muted)] p-3.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5">
              <Sparkle size={18} weight="fill" className="mt-0.5 shrink-0 text-[var(--plot-2)]" />
              <div className="text-xs leading-relaxed text-[var(--ink-soft)]">
                <span className="font-semibold text-[var(--plot-2)]">Why Signal Tracing Beats Block-Moving:</span>{' '}
                Click <span className="font-semibold text-[var(--ink)]">Step 1 â†’ 4</span> (or click nodes{' '}
                <span className="font-mono text-[var(--plot-3)]">E</span>, <span className="font-mono text-[var(--plot-2)]">V</span>,{' '}
                <span className="font-mono text-[var(--forest)]">B</span>, <span className="font-mono text-[var(--plot-2)]">Y</span>{' '}
                directly on the diagram) to trace HW E2.25 backwards from output to input without sign errors.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep((prev) => (prev === 4 ? 1 : ((prev + 1) as 1 | 2 | 3 | 4)))}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-amber-400/50 bg-amber-400/15 px-3 py-1.5 text-xs font-semibold text-[var(--plot-2)] hover:bg-amber-400/25"
            >
              Next Step <ArrowRight size={14} weight="bold" />
            </button>
          </div>

          {/* Step Selector Pills */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {E225_STEPS.map((item) => {
              const isActive = activeStep === item.step;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActiveStep(item.step)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                    isActive
                      ? 'border-amber-400/70 bg-amber-400/15 shadow-lg shadow-amber-950/30'
                      : 'border-[var(--rule)] bg-[var(--paper-muted)] hover:border-[var(--rule-strong)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-[var(--plot-2)]' : 'text-[var(--ink-faint)]'}`}>
                      Step {item.step}
                    </span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-[var(--ink-soft)]">
                      {item.nodeTag}
                    </span>
                  </div>
                  <div className={`mt-1 text-xs font-semibold ${isActive ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]'}`}>
                    {item.shortTitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive SVG Block Diagram for HW E2.25 */}
          <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4">
            <svg viewBox="0 0 740 275" className="w-full h-auto select-none">
              <defs>
                <marker id="e225-slate" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,1 L7,4 L0,7 Z" fill="#64748b" />
                </marker>
                <marker id="e225-cyan" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,1 L7,4 L0,7 Z" fill="#38bdf8" />
                </marker>
                <marker id="e225-amber" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,1 L7,4 L0,7 Z" fill="#f59e0b" />
                </marker>
                <marker id="e225-emerald" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,1 L7,4 L0,7 Z" fill="#34d399" />
                </marker>
              </defs>

              {/* R(s) -> Main Summer */}
              <line
                x1="28"
                y1="68"
                x2="112"
                y2="68"
                stroke={activeStep >= 3 ? '#38bdf8' : '#64748b'}
                strokeWidth={activeStep >= 3 ? 3 : 2}
                markerEnd={activeStep >= 3 ? 'url(#e225-cyan)' : 'url(#e225-slate)'}
              />
              <text x="30" y="54" fill="#38bdf8" fontSize="14" fontWeight="700">R(s)</text>
              <text x="102" y="58" fill="#38bdf8" fontSize="14" fontWeight="700">+</text>

              {/* Main Summer */}
              <g onClick={() => setActiveStep(3)} className="cursor-pointer">
                <circle
                  cx="132"
                  cy="68"
                  r="18"
                  fill="#0f1522"
                  stroke={activeStep === 3 || activeStep === 4 ? '#38bdf8' : '#64748b'}
                  strokeWidth={activeStep === 3 || activeStep === 4 ? 3 : 2}
                />
                <line x1="120" y1="56" x2="144" y2="80" stroke="#475569" strokeWidth="1.2" />
                <line x1="144" y1="56" x2="120" y2="80" stroke="#475569" strokeWidth="1.2" />
                <text x="144" y="103" fill="#fb7185" fontSize="16" fontWeight="800">âˆ’</text>
              </g>

              {/* E(s) -> G1 */}
              <line
                x1="150"
                y1="68"
                x2="234"
                y2="68"
                stroke={activeStep === 3 || activeStep === 4 ? '#38bdf8' : '#64748b'}
                strokeWidth={activeStep === 3 || activeStep === 4 ? 3.2 : 2}
                markerEnd={activeStep === 3 || activeStep === 4 ? 'url(#e225-cyan)' : 'url(#e225-slate)'}
              />
              <g onClick={() => setActiveStep(3)} className="cursor-pointer">
                <rect
                  x="170"
                  y="36"
                  width="46"
                  height="22"
                  rx="6"
                  fill={activeStep === 3 ? 'rgba(56,189,248,0.22)' : '#161f33'}
                  stroke={activeStep === 3 ? '#38bdf8' : '#334155'}
                />
                <text x="193" y="51" fill="#38bdf8" fontSize="12" fontWeight="700" textAnchor="middle">E(s)</text>
              </g>

              {/* Block G1 = 10/(s+1) */}
              <g onClick={() => setActiveStep(3)} className="cursor-pointer">
                <rect
                  x="240"
                  y="40"
                  width="136"
                  height="56"
                  rx="10"
                  fill="#161f33"
                  stroke={activeStep === 3 || activeStep === 4 ? '#38bdf8' : '#475569'}
                  strokeWidth={activeStep === 3 || activeStep === 4 ? 2.6 : 1.8}
                />
                <text x="308" y="64" fill="#f8fafc" fontSize="13.5" fontWeight="700" textAnchor="middle">
                  Gâ‚ = 10 / (s + 1)
                </text>
                <text x="308" y="82" fill="#94a3b8" fontSize="10.5" textAnchor="middle">Forward Plant</text>
              </g>

              {/* V(s) -> G2 */}
              <line
                x1="376"
                y1="68"
                x2="486"
                y2="68"
                stroke={activeStep === 1 || activeStep === 3 || activeStep === 4 ? '#f59e0b' : '#64748b'}
                strokeWidth={activeStep === 1 || activeStep === 3 || activeStep === 4 ? 3.2 : 2}
                markerEnd={activeStep === 1 || activeStep === 3 || activeStep === 4 ? 'url(#e225-amber)' : 'url(#e225-slate)'}
              />
              <circle cx="430" cy="68" r="5" fill={activeStep <= 2 || activeStep === 4 ? '#f59e0b' : '#94a3b8'} />
              <g onClick={() => setActiveStep(1)} className="cursor-pointer">
                <rect
                  x="407"
                  y="32"
                  width="46"
                  height="22"
                  rx="6"
                  fill={activeStep === 1 ? 'rgba(245,158,11,0.22)' : '#161f33'}
                  stroke={activeStep === 1 ? '#f59e0b' : '#334155'}
                />
                <text x="430" y="47" fill="#f59e0b" fontSize="12" fontWeight="700" textAnchor="middle">V(s)</text>
              </g>

              {/* Block G2 = 1/s */}
              <g onClick={() => setActiveStep(1)} className="cursor-pointer">
                <rect
                  x="492"
                  y="40"
                  width="102"
                  height="56"
                  rx="10"
                  fill="#161f33"
                  stroke={activeStep === 1 || activeStep === 4 ? '#f59e0b' : '#475569'}
                  strokeWidth={activeStep === 1 || activeStep === 4 ? 2.6 : 1.8}
                />
                <text x="543" y="64" fill="#f8fafc" fontSize="14" fontWeight="700" textAnchor="middle">
                  Gâ‚‚ = 1 / s
                </text>
                <text x="543" y="82" fill="#94a3b8" fontSize="10.5" textAnchor="middle">Integrator</text>
              </g>

              {/* G2 -> Y(s) */}
              <line
                x1="594"
                y1="68"
                x2="705"
                y2="68"
                stroke={activeStep === 1 || activeStep === 2 || activeStep === 4 ? '#f59e0b' : '#64748b'}
                strokeWidth={activeStep === 1 || activeStep === 2 || activeStep === 4 ? 3.2 : 2}
                markerEnd={activeStep === 1 || activeStep === 2 || activeStep === 4 ? 'url(#e225-amber)' : 'url(#e225-slate)'}
              />
              <circle cx="648" cy="68" r="5" fill="#f59e0b" />
              <g onClick={() => setActiveStep(1)} className="cursor-pointer">
                <rect
                  x="662"
                  y="34"
                  width="46"
                  height="22"
                  rx="6"
                  fill={activeStep === 1 ? 'rgba(245,158,11,0.22)' : '#161f33'}
                  stroke={activeStep === 1 ? '#f59e0b' : '#334155'}
                />
                <text x="685" y="49" fill="#f59e0b" fontSize="12" fontWeight="700" textAnchor="middle">Y(s)</text>
              </g>

              {/* Inner branch V(s) -> Gain 2 -> Lower Summer */}
              <line
                x1="430"
                y1="68"
                x2="430"
                y2="132"
                stroke={activeStep === 2 || activeStep === 4 ? '#34d399' : '#64748b'}
                strokeWidth={activeStep === 2 || activeStep === 4 ? 2.8 : 2}
                markerEnd={activeStep === 2 || activeStep === 4 ? 'url(#e225-emerald)' : 'url(#e225-slate)'}
              />
              <g onClick={() => setActiveStep(2)} className="cursor-pointer">
                <rect
                  x="394"
                  y="138"
                  width="72"
                  height="42"
                  rx="10"
                  fill="#161f33"
                  stroke={activeStep === 2 || activeStep === 4 ? '#34d399' : '#475569'}
                  strokeWidth={activeStep === 2 || activeStep === 4 ? 2.5 : 1.8}
                />
                <text x="430" y="164" fill="#f8fafc" fontSize="14" fontWeight="700" textAnchor="middle">2</text>
              </g>
              <line
                x1="430"
                y1="180"
                x2="430"
                y2="207"
                stroke={activeStep === 2 || activeStep === 4 ? '#34d399' : '#64748b'}
                strokeWidth={activeStep === 2 || activeStep === 4 ? 2.8 : 2}
                markerEnd={activeStep === 2 || activeStep === 4 ? 'url(#e225-emerald)' : 'url(#e225-slate)'}
              />
              <text x="441" y="203" fill="#34d399" fontSize="14" fontWeight="800">+</text>

              {/* Outer unity branch Y(s) -> Lower Summer */}
              <path
                d="M 648 68 L 648 232 L 454 232"
                fill="none"
                stroke={activeStep === 2 || activeStep === 4 ? '#34d399' : '#64748b'}
                strokeWidth={activeStep === 2 || activeStep === 4 ? 2.8 : 2}
                markerEnd={activeStep === 2 || activeStep === 4 ? 'url(#e225-emerald)' : 'url(#e225-slate)'}
              />
              <text x="462" y="224" fill="#34d399" fontSize="14" fontWeight="800">+</text>

              {/* Lower Feedback Summer */}
              <g onClick={() => setActiveStep(2)} className="cursor-pointer">
                <circle
                  cx="430"
                  cy="232"
                  r="18"
                  fill="#0f1522"
                  stroke={activeStep === 2 || activeStep === 4 ? '#34d399' : '#64748b'}
                  strokeWidth={activeStep === 2 || activeStep === 4 ? 3 : 2}
                />
                <line x1="418" y1="220" x2="442" y2="244" stroke="#475569" strokeWidth="1.2" />
                <line x1="442" y1="220" x2="418" y2="244" stroke="#475569" strokeWidth="1.2" />
              </g>

              {/* B(s) -> Main Summer (-) */}
              <path
                d="M 412 232 L 132 232 L 132 92"
                fill="none"
                stroke={activeStep === 2 || activeStep === 3 || activeStep === 4 ? '#34d399' : '#64748b'}
                strokeWidth={activeStep === 2 || activeStep === 3 || activeStep === 4 ? 3 : 2}
                markerEnd={activeStep === 2 || activeStep === 3 || activeStep === 4 ? 'url(#e225-emerald)' : 'url(#e225-slate)'}
              />
              <g onClick={() => setActiveStep(2)} className="cursor-pointer">
                <rect
                  x="248"
                  y="219"
                  width="54"
                  height="24"
                  rx="6"
                  fill={activeStep === 2 ? '#11332b' : '#161f33'}
                  stroke={activeStep === 2 ? '#34d399' : '#334155'}
                />
                <text x="275" y="235" fill="#34d399" fontSize="12" fontWeight="700" textAnchor="middle">B(s)</text>
              </g>
            </svg>
          </div>

          {/* Active Step Algebraic Explanation */}
          <div className="rounded-xl border border-amber-400/35 bg-[var(--paper-muted)] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm sm:text-base font-bold text-[var(--plot-2)]">
                {currentE225Step.title}
              </h4>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--rule-strong)] bg-[var(--paper-muted)] px-2.5 py-1 text-xs text-[var(--ink-soft)] hover:border-[var(--rule-strong)]"
              >
                <ArrowCounterClockwise size={13} /> Restart Trace
              </button>
            </div>

            <div className="mt-3 rounded-xl border border-[var(--rule)] bg-[var(--paper-raised)] px-4 py-3">
              <MathBlock tex={currentE225Step.tex} />
            </div>

            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[var(--ink-soft)]">
              {currentE225Step.intuition}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
