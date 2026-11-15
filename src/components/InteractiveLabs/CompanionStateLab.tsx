import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Crosshair,
  Lightbulb,
  Sliders,
  Warning,
  CheckCircle,
} from '@phosphor-icons/react';
import { MathBlock, MathText } from '../MathText';

type SystemOrder = 2 | 3;

interface ProbeInfo {
  id: string;
  kind: 'before' | 'after';
  label: string;
  headline: string;
  detail: string;
  tex: string;
}

interface CompanionPreset {
  id: string;
  label: string;
  order: SystemOrder;
  leadCoeff: number;
  c2: number;
  c1: number;
  c0: number;
  b0: number;
}

const PRESETS: CompanionPreset[] = [
  {
    id: 'monic-2',
    label: 'Monic 2nd-Order (Default)',
    order: 2,
    leadCoeff: 1,
    c2: 4,
    c1: 5,
    c0: 4,
    b0: 8,
  },
  {
    id: 'non-monic-trap',
    label: 'Non-Monic Trap! (aâ‚‚ = 2)',
    order: 2,
    leadCoeff: 2,
    c2: 4,
    c1: 6,
    c0: 8,
    b0: 10,
  },
  {
    id: 'hw-e34',
    label: 'HW E3.4 (3rd-Order)',
    order: 3,
    leadCoeff: 1,
    c2: 4,
    c1: 6,
    c0: 8,
    b0: 20,
  },
];

function fmt(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(2).replace(/\.?0+$/, '');
}

function signedTerm(coeff: number, symbol: string, isFirst = false): string {
  if (Math.abs(coeff) < 1e-9) return '';
  const absStr = fmt(Math.abs(coeff));
  const coeffPart = Math.abs(coeff - 1) < 1e-9 ? '' : Math.abs(coeff + 1) < 1e-9 ? '' : absStr;
  if (isFirst) {
    return `${coeff < 0 ? '-' : ''}${coeffPart}${symbol}`;
  }
  return coeff < 0 ? ` - ${coeffPart}${symbol}` : ` + ${coeffPart}${symbol}`;
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

export const CompanionStateLab: React.FC = () => {
  const [order, setOrder] = useState<SystemOrder>(2);
  const [leadCoeff, setLeadCoeff] = useState<number>(1);
  const [c2, setC2] = useState<number>(4);
  const [c1, setC1] = useState<number>(5);
  const [c0, setC0] = useState<number>(4);
  const [b0, setB0] = useState<number>(8);
  const [activePreset, setActivePreset] = useState<string>('monic-2');
  const [selectedProbeId, setSelectedProbeId] = useState<string>('after-x2');

  const plotContainerRef = useRef<HTMLDivElement | null>(null);
  const plotCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [plotWidth, setPlotWidth] = useState<number>(560);

  // Normalized monic coefficients: a_{n-1}, ..., a_0, beta_0
  const a2 = c2 / leadCoeff;
  const a1 = c1 / leadCoeff;
  const a0 = c0 / leadCoeff;
  const beta0 = b0 / leadCoeff;
  const isNonMonic = Math.abs(leadCoeff - 1) > 1e-6;

  // Stability check (Routh-Hurwitz for 2nd & 3rd order monic)
  const isStable =
    order === 2
      ? a1 > 0.02 && a0 > 0.02
      : a2 > 0.02 && a1 > 0.02 && a0 > 0.02 && a2 * a1 > a0 + 0.02;

  const applyPreset = (p: CompanionPreset) => {
    setOrder(p.order);
    setLeadCoeff(p.leadCoeff);
    setC2(p.c2);
    setC1(p.c1);
    setC0(p.c0);
    setB0(p.b0);
    setActivePreset(p.id);
    setSelectedProbeId(p.order === 3 ? 'before-dx3' : 'after-x2');
  };

  // Build KaTeX strings
  const rawOdeTex = useMemo(() => {
    const leadStr = isNonMonic ? String.raw`\color{#fb7185}{${fmt(leadCoeff)}}` : '';
    if (order === 2) {
      return String.raw`${leadStr}\ddot{y}${signedTerm(c1, String.raw`\dot{y}`)}${signedTerm(c0, 'y')} = ${fmt(b0)}\,u(t)`;
    }
    return String.raw`${leadStr}\dddot{y}${signedTerm(c2, String.raw`\ddot{y}`)}${signedTerm(c1, String.raw`\dot{y}`)}${signedTerm(c0, 'y')} = ${fmt(b0)}\,u(t)`;
  }, [b0, c0, c1, c2, isNonMonic, leadCoeff, order]);

  const monicOdeTex = useMemo(() => {
    if (order === 2) {
      return String.raw`\ddot{y}${signedTerm(a1, String.raw`\dot{y}`)}${signedTerm(a0, 'y')} = ${fmt(beta0)}\,u(t)`;
    }
    return String.raw`\dddot{y}${signedTerm(a2, String.raw`\ddot{y}`)}${signedTerm(a1, String.raw`\dot{y}`)}${signedTerm(a0, 'y')} = ${fmt(beta0)}\,u(t)`;
  }, [a0, a1, a2, beta0, order]);

  const matricesTex = useMemo(() => {
    if (order === 2) {
      return String.raw`\mathbf{A} = \begin{bmatrix} 0 & \color{#38bdf8}{1} \\ \color{#fb7185}{${fmt(-a0)}} & \color{#fb7185}{${fmt(-a1)}} \end{bmatrix},\quad \mathbf{B} = \begin{bmatrix} 0 \\ \color{#34d399}{${fmt(beta0)}} \end{bmatrix},\quad \mathbf{C} = \begin{bmatrix} \color{#f59e0b}{1} & 0 \end{bmatrix}`;
    }
    return String.raw`\mathbf{A} = \begin{bmatrix} 0 & \color{#38bdf8}{1} & 0 \\ 0 & 0 & \color{#38bdf8}{1} \\ \color{#fb7185}{${fmt(-a0)}} & \color{#fb7185}{${fmt(-a1)}} & \color{#fb7185}{${fmt(-a2)}} \end{bmatrix},\quad \mathbf{B} = \begin{bmatrix} 0 \\ 0 \\ \color{#34d399}{${fmt(beta0)}} \end{bmatrix},\quad \mathbf{C} = \begin{bmatrix} \color{#f59e0b}{1} & 0 & 0 \end{bmatrix}`;
  }, [a0, a1, a2, beta0, order]);

  // Probe definitions
  const probes: ProbeInfo[] = useMemo(() => {
    if (order === 2) {
      return [
        {
          id: 'before-dx2',
          kind: 'before',
          label: 'Before 1/s (xÌ‡â‚‚)',
          headline: 'Before Integrator #1 = Highest Derivative xÌ‡â‚‚ = yÌˆ',
          detail:
            'The wire entering the first integrator ALWAYS carries the highest derivative, fed by the summing junction.',
          tex: String.raw`\dot{x}_2 = \ddot{y} = ${fmt(-a0)}x_1 ${-a1 >= 0 ? '+' : ''}${fmt(-a1)}x_2 + ${fmt(beta0)}u(t)`,
        },
        {
          id: 'after-x2',
          kind: 'after',
          label: 'After 1/s (xâ‚‚)',
          headline: 'After Integrator #1 = State Variable xâ‚‚ = yÌ‡',
          detail:
            'Golden rule: the output of every [1/s] block is a state variable! Here xâ‚‚ is also the input (xÌ‡â‚) to the next integrator.',
          tex: String.raw`x_2 = \int \dot{x}_2\,dt = \dot{y} = \dot{x}_1`,
        },
        {
          id: 'before-dx1',
          kind: 'before',
          label: 'Before 1/s (xÌ‡â‚)',
          headline: 'Before Integrator #2 = Derivative xÌ‡â‚ = xâ‚‚',
          detail:
            'Because xÌ‡â‚ = xâ‚‚, row 1 of A is simply [0  1] â€” no feedback gains appear in the shift rows!',
          tex: String.raw`\dot{x}_1 = x_2`,
        },
        {
          id: 'after-x1',
          kind: 'after',
          label: 'After 1/s (xâ‚)',
          headline: 'After Integrator #2 = State Variable xâ‚ = y (Output)',
          detail:
            'The final integrator output is the physical position y(t), so C = [1  0].',
          tex: String.raw`x_1 = \int x_2\,dt = y(t) \implies \mathbf{C} = [1\;\; 0]`,
        },
      ];
    }

    return [
      {
        id: 'before-dx3',
        kind: 'before',
        label: 'Before 1/s (xÌ‡â‚ƒ)',
        headline: 'Before Integrator #1 = Highest Derivative xÌ‡â‚ƒ = yâƒ›',
        detail:
          'Only the leftmost summing junction implements the ODE coefficients (-aâ‚€, -aâ‚, -aâ‚‚) and input gain Î²â‚€.',
        tex: String.raw`\dot{x}_3 = \dddot{y} = ${fmt(-a0)}x_1 ${-a1 >= 0 ? '+' : ''}${fmt(-a1)}x_2 ${-a2 >= 0 ? '+' : ''}${fmt(-a2)}x_3 + ${fmt(beta0)}u(t)`,
      },
      {
        id: 'after-x3',
        kind: 'after',
        label: 'After 1/s (xâ‚ƒ)',
        headline: 'After Integrator #1 = State Variable xâ‚ƒ = yÌˆ',
        detail: 'Output of [1/s] #1 defines state xâ‚ƒ = yÌˆ, which feeds directly into [1/s] #2 as xÌ‡â‚‚.',
        tex: String.raw`x_3 = \ddot{y} = \dot{x}_2`,
      },
      {
        id: 'after-x2',
        kind: 'after',
        label: 'After 1/s (xâ‚‚)',
        headline: 'After Integrator #2 = State Variable xâ‚‚ = yÌ‡',
        detail: 'Output of [1/s] #2 defines state xâ‚‚ = yÌ‡, feeding [1/s] #3 as xÌ‡â‚.',
        tex: String.raw`x_2 = \dot{y} = \dot{x}_1`,
      },
      {
        id: 'after-x1',
        kind: 'after',
        label: 'After 1/s (xâ‚)',
        headline: 'After Integrator #3 = State Variable xâ‚ = y (Output)',
        detail: 'Output of the rightmost integrator is y(t), giving C = [1  0  0].',
        tex: String.raw`x_1 = y(t) \implies \mathbf{C} = [1\;\; 0\;\; 0]`,
      },
    ];
  }, [a0, a1, a2, beta0, order]);

  const activeProbe = probes.find((p) => p.id === selectedProbeId) ?? probes[0];

  // Observe canvas container width
  useEffect(() => {
    const el = plotContainerRef.current;
    if (!el) return;
    const update = () => setPlotWidth(Math.max(280, Math.floor(el.clientWidth)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // RK4 simulation & Canvas plot
  useEffect(() => {
    const canvas = plotCanvasRef.current;
    if (!canvas) return;
    const w = plotWidth;
    const h = 240;
    const ctx = setupHiDpiCanvas(canvas, w, h);
    if (!ctx) return;

    const dt = 0.015;
    const tMax = 6.0;
    const steps = Math.round(tMax / dt);

    const ts: number[] = [];
    const x1s: number[] = [];
    const x2s: number[] = [];
    const x3s: number[] = [];

    let state = order === 2 ? [0, 0] : [0, 0, 0];
    const deriv = (s: number[]): number[] => {
      if (order === 2) {
        return [s[1], -a0 * s[0] - a1 * s[1] + beta0];
      }
      return [s[1], s[2], -a0 * s[0] - a1 * s[1] - a2 * s[2] + beta0];
    };

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      ts.push(t);
      x1s.push(state[0]);
      x2s.push(state[1]);
      if (order === 3) x3s.push(state[2]);

      // RK4 step
      const k1 = deriv(state);
      const k2 = deriv(state.map((v, idx) => v + 0.5 * dt * k1[idx]));
      const k3 = deriv(state.map((v, idx) => v + 0.5 * dt * k2[idx]));
      const k4 = deriv(state.map((v, idx) => v + dt * k3[idx]));
      state = state.map((v, idx) => {
        const next = v + (dt / 6) * (k1[idx] + 2 * k2[idx] + 2 * k3[idx] + k4[idx]);
        return Math.max(-50, Math.min(50, next));
      });
    }

    const allVals = [...x1s, ...x2s, ...(order === 3 ? x3s : [])];
    const rawMin = Math.min(0, ...allVals);
    const rawMax = Math.max(1, ...allVals);
    const span = Math.max(1, rawMax - rawMin);
    const yMin = rawMin - span * 0.12;
    const yMax = Math.min(25, rawMax + span * 0.16);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const pad = { left: 46, right: 20, top: 30, bottom: 34 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const toX = (t: number) => pad.left + (t / tMax) * plotW;
    const toY = (v: number) => pad.top + ((yMax - v) / (yMax - yMin)) * plotH;

    // Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let t = 0; t <= 6; t += 1) {
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

    // Axis ticks
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    for (let t = 0; t <= 6; t += 1) {
      ctx.fillText(`${t}s`, toX(t), pad.top + plotH + 15);
    }
    ctx.fillText('Unit Step Time Response (u(t) = 1, x(0) = 0)', pad.left + plotW / 2, pad.top + plotH + 28);

    ctx.textAlign = 'right';
    ctx.fillText(fmt(yMax), pad.left - 6, pad.top + 8);
    if (Math.abs(zeroY - pad.top) > 14 && Math.abs(zeroY - (pad.top + plotH)) > 14) {
      ctx.fillText('0', pad.left - 6, zeroY + 3);
    }
    if (yMin < -0.2) {
      ctx.fillText(fmt(yMin), pad.left - 6, pad.top + plotH);
    }

    // Steady-state line if stable
    if (isStable && Math.abs(a0) > 1e-4) {
      const yss = beta0 / a0;
      if (yss <= yMax) {
        const yssPx = toY(yss);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(pad.left, yssPx);
        ctx.lineTo(pad.left + plotW, yssPx);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'left';
        ctx.font = '600 10px ui-sans-serif, system-ui, sans-serif';
        const above = yssPx > pad.top + 20;
        ctx.fillText(`y_ss = bâ‚€/câ‚€ = ${fmt(yss)}`, pad.left + 8, above ? yssPx - 5 : yssPx + 13);
      }
    }

    const drawSeries = (vals: number[], color: string) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(pad.left, pad.top, plotW, plotH);
      ctx.clip();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i < ts.length; i++) {
        const px = toX(ts[i]);
        const py = toY(vals[i]);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    };

    drawSeries(x1s, '#f59e0b');
    drawSeries(x2s, '#38bdf8');
    if (order === 3) {
      drawSeries(x3s, '#34d399');
    }

    // Non-overlapping top legend bar
    ctx.font = '700 11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('â— xâ‚(t) = y', pad.left + 4, 17);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('â— xâ‚‚(t) = yÌ‡', pad.left + 92, 17);
    if (order === 3) {
      ctx.fillStyle = '#34d399';
      ctx.fillText('â— xâ‚ƒ(t) = yÌˆ', pad.left + 180, 17);
    }
  }, [a0, a1, a2, beta0, isStable, order, plotWidth]);

  return (
    <section className="space-y-5 text-[var(--ink)]">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[var(--rule)] pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="hidden">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--plot-2)]">
            <Sliders size={14} weight="bold" />
            CH 3.4 Â· COMPANION FORM &amp; INTEGRATOR CASCADE LAB
          </div>
          <h3 className="mt-2 text-xl font-bold text-[var(--ink)]">
            ODE â†’ Phase Variables â†’ Companion Matrix
          </h3>
        </div>

        {/* Order Selector */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setOrder(2);
              setActivePreset('');
              setSelectedProbeId('after-x2');
            }}
            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              order === 2
                ? 'border-sky-400/60 bg-sky-400/15 text-[var(--plot-3)]'
                : 'border-[var(--rule-strong)] bg-[var(--paper-muted)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
            }`}
          >
            2nd-Order ODE
          </button>
          <button
            type="button"
            onClick={() => {
              setOrder(3);
              setActivePreset('');
              setSelectedProbeId('before-dx3');
            }}
            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              order === 3
                ? 'border-amber-400/60 bg-amber-400/15 text-[var(--plot-2)]'
                : 'border-[var(--rule-strong)] bg-[var(--paper-muted)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
            }`}
          >
            3rd-Order ODE (HW E3.4)
          </button>
        </div>
      </div>

      {/* What to Notice & Presets */}
      <div className="mt-4 rounded-xl border border-amber-400/25 bg-[var(--paper-muted)] p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--plot-2)]">
            <Lightbulb size={15} weight="fill" />
            What to notice Â· Try the Non-Monic Trap
          </div>
          <span className="text-xs text-[var(--ink-faint)]">
            Every <MathText text="$[1/s]$" /> block creates one state variable; the bottom row of <MathText text="$\mathbf{A}$" /> holds the negated <em>monic</em> coefficients.
          </span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                activePreset === p.id
                  ? p.id === 'non-monic-trap'
                    ? 'border-rose-400/60 bg-rose-400/15 text-rose-200'
                    : 'border-sky-400/60 bg-sky-400/15 text-[var(--plot-3)]'
                  : 'border-[var(--rule-strong)] bg-[var(--paper-muted)] text-[var(--ink-soft)] hover:border-[var(--rule-strong)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Non-Monic Trap Warning Banner */}
      {isNonMonic ? (
        <div className="mt-4 rounded-xl border border-rose-400/50 bg-rose-500/10 p-4">
          <div className="flex items-start gap-3">
            <Warning size={20} weight="fill" className="mt-0.5 shrink-0 text-rose-400" />
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="font-bold text-rose-200">
                Non-Monic Trap Triggered! Leading coefficient is {fmt(leadCoeff)} â‰  1
              </div>
              <p className="text-[var(--ink-soft)]">
                You <span className="font-bold text-rose-300 underline">MUST divide the entire ODE by {fmt(leadCoeff)} first</span> before reading off the bottom row of{' '}
                <MathText text="$\mathbf{A}$" /> and <MathText text="$\mathbf{B}$" />!
                Writing <span className="line-through text-rose-300/90">[{-c0}, {-c1}]</span> instead of{' '}
                <span className="font-semibold text-[var(--forest)]">[{fmt(-a0)}, {fmt(-a1)}]</span> is a classic exam deduction.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-2 text-xs text-[var(--forest)]">
          <CheckCircle size={16} weight="fill" className="shrink-0 text-[var(--forest)]" />
          <span>
            ODE is already monic (leading coefficient = 1). Try setting <span className="font-mono font-bold">a_{order} = 2</span> or <span className="font-mono font-bold">3</span> below to see the Non-Monic Trap!
          </span>
        </div>
      )}

      {/* Controls + Live KaTeX Display */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Controls */}
        <div className="xl:col-span-5 space-y-3 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-[var(--ink-soft)]">
              <span>Leading Coefficient <MathText text={order === 2 ? '$a_2$' : '$a_3$'} /></span>
              <span className={`font-mono font-bold ${isNonMonic ? 'text-rose-300' : 'text-[var(--forest)]'}`}>
                {fmt(leadCoeff)}
              </span>
            </div>
            <div className="mt-1.5 flex gap-2">
              {[1, 2, 3, 4].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setActivePreset('');
                    setLeadCoeff(val);
                  }}
                  className={`flex-1 rounded-lg border py-1.5 font-mono text-xs font-bold transition-all ${
                    leadCoeff === val
                      ? val === 1
                        ? 'border-emerald-400/60 bg-emerald-400/15 text-[var(--forest)]'
                        : 'border-rose-400/60 bg-rose-400/15 text-rose-200'
                      : 'border-[var(--rule-strong)] bg-[var(--paper-muted)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {order === 3 && (
            <div>
              <div className="flex justify-between text-xs font-medium text-[var(--ink-soft)]">
                <span>Coefficient <MathText text="$c_2$" /> (<MathText text="$\ddot{y}$" />)</span>
                <span className="font-mono text-[var(--plot-3)]">{fmt(c2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={c2}
                onChange={(e) => {
                  setActivePreset('');
                  setC2(parseFloat(e.target.value));
                }}
                className="mt-1 w-full"
              />
            </div>
          )}

          <div>
            <div className="flex justify-between text-xs font-medium text-[var(--ink-soft)]">
              <span>Coefficient <MathText text="$c_1$" /> (<MathText text="$\dot{y}$" />)</span>
              <span className="font-mono text-[var(--plot-3)]">{fmt(c1)}</span>
            </div>
            <input
              type="range"
              min={-1}
              max={10}
              step={0.5}
              value={c1}
              onChange={(e) => {
                setActivePreset('');
                setC1(parseFloat(e.target.value));
              }}
              className="mt-1 w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-[var(--ink-soft)]">
              <span>Coefficient <MathText text="$c_0$" /> (<MathText text="$y$" />)</span>
              <span className="font-mono text-[var(--plot-3)]">{fmt(c0)}</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={12}
              step={0.5}
              value={c0}
              onChange={(e) => {
                setActivePreset('');
                setC0(parseFloat(e.target.value));
              }}
              className="mt-1 w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-[var(--ink-soft)]">
              <span>Input Gain <MathText text="$b_0$" /> (<MathText text="$u(t)$" />)</span>
              <span className="font-mono text-[var(--forest)]">{fmt(b0)}</span>
            </div>
            <input
              type="range"
              min={1}
              max={24}
              step={1}
              value={b0}
              onChange={(e) => {
                setActivePreset('');
                setB0(parseFloat(e.target.value));
              }}
              className="mt-1 w-full"
            />
          </div>
        </div>

        {/* Live KaTeX Readout */}
        <div className="xl:col-span-7 space-y-3 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper-raised)] p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
                1. Given ODE
              </div>
              <MathBlock tex={rawOdeTex} className="text-sm" />
            </div>
            <div className="rounded-lg border border-emerald-400/30 bg-[var(--paper-raised)] p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--forest)]">
                2. Monic Form (Ã· {fmt(leadCoeff)})
              </div>
              <MathBlock tex={monicOdeTex} className="text-sm" />
            </div>
          </div>

          <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper-raised)] px-3 py-2 text-xs text-[var(--ink-soft)]">
            <span className="font-semibold text-[var(--plot-2)]">Phase Variables: </span>
            <MathText
              text={
                order === 2
                  ? '$x_1 = y, \\quad x_2 = \\dot{y} \\quad \\Longrightarrow \\quad \\dot{x}_1 = x_2$'
                  : '$x_1 = y, \\quad x_2 = \\dot{y}, \\quad x_3 = \\ddot{y} \\quad \\Longrightarrow \\quad \\dot{x}_1 = x_2,\\; \\dot{x}_2 = x_3$'
              }
            />
          </div>

          <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper-raised)] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
              <span>3. Companion Matrices</span>
              <span className="text-rose-300">Bottom row = negated monic coeffs</span>
            </div>
            <MathBlock tex={matricesTex} className="text-sm sm:text-base" />
          </div>
        </div>
      </div>

      {/* Interactive SVG Integrator Cascade Diagram */}
      <div className="mt-4 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--plot-3)]">
            <Crosshair size={15} weight="bold" />
            Interactive Integrator Cascade Â· Click any probe point
          </div>
          <span className="text-xs text-[var(--ink-faint)]">
            Before <MathText text="$[1/s]$" /> = derivative <MathText text="$\dot{x}_i$" /> Â· After <MathText text="$[1/s]$" /> = state <MathText text="$x_i$" />
          </span>
        </div>

        <svg viewBox="0 0 780 225" className="w-full h-auto select-none">
          <defs>
            <marker id="comp-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 Z" fill="#94a3b8" />
            </marker>
            <marker id="comp-rose" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 Z" fill="#fb7185" />
            </marker>
            <marker id="comp-amber" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 Z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Input u(t) -> Gain beta0 -> Summer */}
          <line x1="20" y1="66" x2="72" y2="66" stroke="#34d399" strokeWidth="2.2" markerEnd="url(#comp-arrow)" />
          <text x="22" y="54" fill="#34d399" fontSize="12.5" fontWeight="700">u(t)</text>
          <rect x="76" y="47" width="54" height="38" rx="8" fill="#161f33" stroke="#34d399" strokeWidth="1.8" />
          <text x="103" y="70" fill="#34d399" fontSize="12" fontWeight="700" textAnchor="middle">{fmt(beta0)}</text>
          <line x1="130" y1="66" x2="174" y2="66" stroke="#34d399" strokeWidth="2.2" markerEnd="url(#comp-arrow)" />

          {/* Summing Junction */}
          <circle cx="194" cy="66" r="16" fill="#0f1522" stroke="#94a3b8" strokeWidth="2" />
          <text x="194" y="71" fill="#f8fafc" fontSize="16" fontWeight="700" textAnchor="middle">Î£</text>

          {order === 2 ? (
            <>
              {/* Wire: Summer -> Integrator 1 (x_dot_2) */}
              <line x1="210" y1="66" x2="320" y2="66" stroke="#94a3b8" strokeWidth="2.3" markerEnd="url(#comp-arrow)" />
              <g onClick={() => setSelectedProbeId('before-dx2')} className="cursor-pointer">
                <circle
                  cx="264"
                  cy="66"
                  r="8"
                  fill={selectedProbeId === 'before-dx2' ? '#fb7185' : '#1e293b'}
                  stroke="#fb7185"
                  strokeWidth="2"
                />
                <text x="264" y="46" fill="#fb7185" fontSize="12" fontWeight="700" textAnchor="middle">xÌ‡â‚‚ = yÌˆ</text>
              </g>

              {/* Integrator 1 */}
              <rect x="326" y="40" width="84" height="52" rx="10" fill="#161f33" stroke="#38bdf8" strokeWidth="2.2" />
              <text x="368" y="71" fill="#38bdf8" fontSize="16" fontWeight="800" textAnchor="middle">1 / s</text>

              {/* Wire: Int 1 -> Int 2 (x2 = x_dot_1) */}
              <line x1="410" y1="66" x2="528" y2="66" stroke="#38bdf8" strokeWidth="2.3" markerEnd="url(#comp-arrow)" />
              <g onClick={() => setSelectedProbeId('after-x2')} className="cursor-pointer">
                <circle
                  cx="450"
                  cy="66"
                  r="8"
                  fill={selectedProbeId === 'after-x2' ? '#38bdf8' : '#1e293b'}
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <text x="450" y="46" fill="#38bdf8" fontSize="12" fontWeight="700" textAnchor="middle">xâ‚‚ = yÌ‡</text>
              </g>
              <g onClick={() => setSelectedProbeId('before-dx1')} className="cursor-pointer">
                <circle
                  cx="502"
                  cy="66"
                  r="7"
                  fill={selectedProbeId === 'before-dx1' ? '#94a3b8' : '#1e293b'}
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <text x="502" y="92" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">xÌ‡â‚</text>
              </g>

              {/* Integrator 2 */}
              <rect x="534" y="40" width="84" height="52" rx="10" fill="#161f33" stroke="#f59e0b" strokeWidth="2.2" />
              <text x="576" y="71" fill="#f59e0b" fontSize="16" fontWeight="800" textAnchor="middle">1 / s</text>

              {/* Wire: Int 2 -> Output (x1 = y) */}
              <line x1="618" y1="66" x2="725" y2="66" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#comp-amber)" />
              <g onClick={() => setSelectedProbeId('after-x1')} className="cursor-pointer">
                <circle
                  cx="672"
                  cy="66"
                  r="8"
                  fill={selectedProbeId === 'after-x1' ? '#f59e0b' : '#1e293b'}
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <text x="672" y="46" fill="#f59e0b" fontSize="12" fontWeight="700" textAnchor="middle">xâ‚ = y</text>
              </g>
              <text x="735" y="70" fill="#f59e0b" fontSize="13" fontWeight="700">y(t)</text>

              {/* Feedback loop x2 -> -a1 -> Summer */}
              <path d="M 450 74 L 450 132 L 352 132" fill="none" stroke="#fb7185" strokeWidth="1.8" />
              <rect x="292" y="116" width="60" height="32" rx="7" fill="#161f33" stroke="#fb7185" strokeWidth="1.8" />
              <text x="322" y="136" fill="#fb7185" fontSize="12" fontWeight="700" textAnchor="middle">{fmt(-a1)}</text>
              <path d="M 292 132 L 194 132 L 194 86" fill="none" stroke="#fb7185" strokeWidth="1.8" markerEnd="url(#comp-rose)" />

              {/* Feedback loop x1 -> -a0 -> Summer */}
              <path d="M 672 74 L 672 184 L 352 184" fill="none" stroke="#fb7185" strokeWidth="1.8" />
              <rect x="292" y="168" width="60" height="32" rx="7" fill="#161f33" stroke="#fb7185" strokeWidth="1.8" />
              <text x="322" y="188" fill="#fb7185" fontSize="12" fontWeight="700" textAnchor="middle">{fmt(-a0)}</text>
              <path d="M 292 184 L 194 184 L 194 132" fill="none" stroke="#fb7185" strokeWidth="1.8" />
            </>
          ) : (
            <>
              {/* 3rd-order cascade */}
              <line x1="210" y1="66" x2="274" y2="66" stroke="#94a3b8" strokeWidth="2.2" markerEnd="url(#comp-arrow)" />
              <g onClick={() => setSelectedProbeId('before-dx3')} className="cursor-pointer">
                <circle
                  cx="242"
                  cy="66"
                  r="8"
                  fill={selectedProbeId === 'before-dx3' ? '#fb7185' : '#1e293b'}
                  stroke="#fb7185"
                  strokeWidth="2"
                />
                <text x="242" y="45" fill="#fb7185" fontSize="11.5" fontWeight="700" textAnchor="middle">xÌ‡â‚ƒ = yâƒ›</text>
              </g>

              {/* Int 1 */}
              <rect x="280" y="42" width="68" height="48" rx="9" fill="#161f33" stroke="#34d399" strokeWidth="2" />
              <text x="314" y="71" fill="#34d399" fontSize="15" fontWeight="800" textAnchor="middle">1 / s</text>

              <line x1="348" y1="66" x2="414" y2="66" stroke="#34d399" strokeWidth="2.2" markerEnd="url(#comp-arrow)" />
              <g onClick={() => setSelectedProbeId('after-x3')} className="cursor-pointer">
                <circle
                  cx="381"
                  cy="66"
                  r="8"
                  fill={selectedProbeId === 'after-x3' ? '#34d399' : '#1e293b'}
                  stroke="#34d399"
                  strokeWidth="2"
                />
                <text x="381" y="45" fill="#34d399" fontSize="11.5" fontWeight="700" textAnchor="middle">xâ‚ƒ = yÌˆ</text>
              </g>

              {/* Int 2 */}
              <rect x="420" y="42" width="68" height="48" rx="9" fill="#161f33" stroke="#38bdf8" strokeWidth="2" />
              <text x="454" y="71" fill="#38bdf8" fontSize="15" fontWeight="800" textAnchor="middle">1 / s</text>

              <line x1="488" y1="66" x2="554" y2="66" stroke="#38bdf8" strokeWidth="2.2" markerEnd="url(#comp-arrow)" />
              <g onClick={() => setSelectedProbeId('after-x2')} className="cursor-pointer">
                <circle
                  cx="521"
                  cy="66"
                  r="8"
                  fill={selectedProbeId === 'after-x2' ? '#38bdf8' : '#1e293b'}
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <text x="521" y="45" fill="#38bdf8" fontSize="11.5" fontWeight="700" textAnchor="middle">xâ‚‚ = yÌ‡</text>
              </g>

              {/* Int 3 */}
              <rect x="560" y="42" width="68" height="48" rx="9" fill="#161f33" stroke="#f59e0b" strokeWidth="2" />
              <text x="594" y="71" fill="#f59e0b" fontSize="15" fontWeight="800" textAnchor="middle">1 / s</text>

              <line x1="628" y1="66" x2="725" y2="66" stroke="#f59e0b" strokeWidth="2.4" markerEnd="url(#comp-amber)" />
              <g onClick={() => setSelectedProbeId('after-x1')} className="cursor-pointer">
                <circle
                  cx="676"
                  cy="66"
                  r="8"
                  fill={selectedProbeId === 'after-x1' ? '#f59e0b' : '#1e293b'}
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <text x="676" y="45" fill="#f59e0b" fontSize="11.5" fontWeight="700" textAnchor="middle">xâ‚ = y</text>
              </g>
              <text x="734" y="70" fill="#f59e0b" fontSize="13" fontWeight="700">y</text>

              {/* 3 Feedback loops */}
              <path d="M 381 74 L 381 122 L 320 122" fill="none" stroke="#fb7185" strokeWidth="1.6" />
              <rect x="268" y="109" width="52" height="26" rx="6" fill="#161f33" stroke="#fb7185" strokeWidth="1.6" />
              <text x="294" y="126" fill="#fb7185" fontSize="11" fontWeight="700" textAnchor="middle">{fmt(-a2)}</text>
              <path d="M 268 122 L 194 122 L 194 86" fill="none" stroke="#fb7185" strokeWidth="1.6" markerEnd="url(#comp-rose)" />

              <path d="M 521 74 L 521 158 L 320 158" fill="none" stroke="#fb7185" strokeWidth="1.6" />
              <rect x="268" y="145" width="52" height="26" rx="6" fill="#161f33" stroke="#fb7185" strokeWidth="1.6" />
              <text x="294" y="162" fill="#fb7185" fontSize="11" fontWeight="700" textAnchor="middle">{fmt(-a1)}</text>
              <path d="M 268 158 L 194 158 L 194 122" fill="none" stroke="#fb7185" strokeWidth="1.6" />

              <path d="M 676 74 L 676 194 L 320 194" fill="none" stroke="#fb7185" strokeWidth="1.6" />
              <rect x="268" y="181" width="52" height="26" rx="6" fill="#161f33" stroke="#fb7185" strokeWidth="1.6" />
              <text x="294" y="198" fill="#fb7185" fontSize="11" fontWeight="700" textAnchor="middle">{fmt(-a0)}</text>
              <path d="M 268 194 L 194 194 L 194 158" fill="none" stroke="#fb7185" strokeWidth="1.6" />
            </>
          )}
        </svg>

        {/* Probe buttons + Inspector */}
        <div className="mt-2 flex flex-wrap gap-2">
          {probes.map((probe) => (
            <button
              key={probe.id}
              type="button"
              onClick={() => setSelectedProbeId(probe.id)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
                selectedProbeId === probe.id
                  ? probe.kind === 'before'
                    ? 'border-rose-400/60 bg-rose-400/15 text-rose-200'
                    : 'border-sky-400/60 bg-sky-400/15 text-[var(--plot-3)]'
                  : 'border-[var(--rule)] bg-[var(--paper-raised)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
              }`}
            >
              {probe.label}
            </button>
          ))}
        </div>

        <div className="mt-3 rounded-xl border border-[var(--rule)] bg-[var(--paper-raised)] p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                activeProbe.kind === 'before' ? 'text-rose-300' : 'text-[var(--plot-3)]'
              }`}
            >
              {activeProbe.headline}
            </span>
          </div>
          <div className="mt-2">
            <MathBlock tex={activeProbe.tex} className="text-sm" />
          </div>
          <p className="mt-1 text-xs text-[var(--ink-soft)]">{activeProbe.detail}</p>
        </div>
      </div>

      {/* Live Time Response Canvas */}
      <div ref={plotContainerRef} className="mt-4 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3.5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
          <span className="text-xs font-semibold text-[var(--ink-soft)]">
            Live State Evolution <MathText text="$x_1(t), x_2(t)$" /> {order === 3 && <MathText text="$, x_3(t)$" />}
          </span>
          <span className={`text-xs font-mono ${isStable ? 'text-[var(--forest)]' : 'text-rose-300'}`}>
            {isStable ? `Stable Â· y_ss = ${fmt(beta0 / a0)}` : 'Unstable / Oscillatory!'}
          </span>
        </div>
        <canvas ref={plotCanvasRef} className="block w-full h-[240px] rounded-lg" />
      </div>
    </section>
  );
};
