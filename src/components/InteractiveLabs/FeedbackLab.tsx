import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowsCounterClockwise,
  CheckCircle,
  Lightning,
  Sliders,
  Sparkle,
  Warning,
  WaveSine,
  Wind,
} from '@phosphor-icons/react';
import { MathBlock, MathText } from '../MathText';

interface Preset {
  id: string;
  label: string;
  gainK: number;
  deltaGPercent: number;
  disturbanceEnabled: boolean;
  disturbanceMag: number;
  noiseEnabled: boolean;
  insight: string;
}

const PRESETS: Preset[] = [
  {
    id: 'nominal',
    label: 'Nominal Tracking',
    gainK: 8,
    deltaGPercent: 0,
    disturbanceEnabled: false,
    disturbanceMag: 0.4,
    noiseEnabled: false,
    insight:
      'With an exact plant (Î”G = 0%), calibrated Open-Loop hits 1.000 perfectlyâ€”while Closed-Loop has a small steady-state offset 1/(1+K) because proportional control needs a tiny error to keep driving the plant.',
  },
  {
    id: 'wear',
    label: 'Plant Wears Out (-40% Gain)',
    gainK: 10,
    deltaGPercent: -40,
    disturbanceEnabled: false,
    disturbanceMag: 0.4,
    noiseEnabled: false,
    insight:
      'Open-Loop collapses straight down by 40% to 0.600 because it never looks at the output. Closed-Loop shrinks the sensitivity by |S(0)| = 1/(1+K) and holds near 0.857!',
  },
  {
    id: 'gust',
    label: 'Sudden Wind Gust (Disturbance)',
    gainK: 12,
    deltaGPercent: 0,
    disturbanceEnabled: true,
    disturbanceMag: 0.5,
    noiseEnabled: false,
    insight:
      'At t = 3.0 s a wind gust D = +0.50 hits the output. Open-Loop is helpless and drifts permanently to 1.500, whereas Closed-Loop detects the error immediately and crushes the disturbance by 1/(1+K)!',
  },
  {
    id: 'noise',
    label: 'Noisy Sensor Trap',
    gainK: 18,
    deltaGPercent: 0,
    disturbanceEnabled: false,
    disturbanceMag: 0.4,
    noiseEnabled: true,
    insight:
      'Look at the trap! High loop gain K = 18 widens closed-loop bandwidth and passes sensor noise straight into y(t) (since T(s) â‰ˆ 1/H). Meanwhile Open-Loop ignores the faulty sensor completely!',
  },
];

interface SimData {
  times: number[];
  yOpen: number[];
  yClosed: number[];
  steadyOpen: number;
  steadyClosed: number;
  essOpen: number;
  essClosed: number;
  sensitivityNominal: number;
  sensitivityActual: number;
  noiseRmsClosed: number;
}

const KP = 1.0;
const H_FEEDBACK = 1.0;
const T_END = 8.0;
const DISTURBANCE_TIME = 3.0;

function noiseSignal(t: number): number {
  return (
    0.11 * Math.sin(17.5 * t) +
    0.075 * Math.sin(29.3 * t + 1.1) +
    0.055 * Math.sin(43.7 * t + 2.4)
  );
}

function simulateSystems(
  gainK: number,
  deltaGPercent: number,
  disturbanceEnabled: boolean,
  disturbanceMag: number,
  noiseEnabled: boolean
): SimData {
  const dt = 0.005;
  const steps = Math.round(T_END / dt);
  const kPlant = KP * (1 + deltaGPercent / 100);
  const dVal = disturbanceEnabled ? disturbanceMag : 0;

  const times: number[] = [];
  const yOpen: number[] = [];
  const yClosed: number[] = [];

  let yo = 0;
  let yc = 0;
  let noiseSqSum = 0;
  let noiseSamples = 0;

  // Compute noise-free baseline when noise is enabled to measure RMS jitter
  let ycClean = 0;

  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    const r = 1.0;

    if (i % 2 === 0) {
      times.push(t);
      yOpen.push(yo);
      yClosed.push(yc);
      if (t >= 4.0) {
        noiseSqSum += (yc - ycClean) * (yc - ycClean);
        noiseSamples += 1;
      }
    }

    // RK4 step for Open-Loop: dy/dt = -y + kPlant * r + d
    const fOpen = (y: number, tEval: number) => {
      const dEval = tEval >= DISTURBANCE_TIME ? dVal : 0.0;
      return -y + kPlant * r + dEval;
    };

    const ko1 = fOpen(yo, t);
    const ko2 = fOpen(yo + 0.5 * dt * ko1, t + 0.5 * dt);
    const ko3 = fOpen(yo + 0.5 * dt * ko2, t + 0.5 * dt);
    const ko4 = fOpen(yo + dt * ko3, t + dt);
    yo += (dt / 6) * (ko1 + 2 * ko2 + 2 * ko3 + ko4);

    // RK4 step for Closed-Loop: dy/dt = -y + kPlant * K * (r - H*(y + n)) + d
    const fClosed = (y: number, tEval: number, useNoise: boolean) => {
      const dEval = tEval >= DISTURBANCE_TIME ? dVal : 0.0;
      const nEval = useNoise && noiseEnabled ? noiseSignal(tEval) : 0.0;
      const u = gainK * (r - H_FEEDBACK * (y + nEval));
      return -y + kPlant * u + dEval;
    };

    const kc1 = fClosed(yc, t, true);
    const kc2 = fClosed(yc + 0.5 * dt * kc1, t + 0.5 * dt, true);
    const kc3 = fClosed(yc + 0.5 * dt * kc2, t + 0.5 * dt, true);
    const kc4 = fClosed(yc + dt * kc3, t + dt, true);
    yc += (dt / 6) * (kc1 + 2 * kc2 + 2 * kc3 + kc4);

    const kcc1 = fClosed(ycClean, t, false);
    const kcc2 = fClosed(ycClean + 0.5 * dt * kcc1, t + 0.5 * dt, false);
    const kcc3 = fClosed(ycClean + 0.5 * dt * kcc2, t + 0.5 * dt, false);
    const kcc4 = fClosed(ycClean + dt * kcc3, t + dt, false);
    ycClean += (dt / 6) * (kcc1 + 2 * kcc2 + 2 * kcc3 + kcc4);
  }

  const steadyOpen = kPlant * 1.0 + dVal;
  const steadyClosed = (kPlant * gainK * 1.0 + dVal) / (1 + kPlant * gainK * H_FEEDBACK);

  return {
    times,
    yOpen,
    yClosed,
    steadyOpen,
    steadyClosed,
    essOpen: Math.abs(1 - steadyOpen),
    essClosed: Math.abs(1 - steadyClosed),
    sensitivityNominal: 1 / (1 + KP * gainK * H_FEEDBACK),
    sensitivityActual: 1 / (1 + kPlant * gainK * H_FEEDBACK),
    noiseRmsClosed: noiseSamples > 0 ? Math.sqrt(noiseSqSum / noiseSamples) : 0,
  };
}

export const FeedbackLab: React.FC = () => {
  const [gainK, setGainK] = useState<number>(10);
  const [deltaGPercent, setDeltaGPercent] = useState<number>(-40);
  const [disturbanceEnabled, setDisturbanceEnabled] = useState<boolean>(false);
  const [disturbanceMag, setDisturbanceMag] = useState<number>(0.5);
  const [noiseEnabled, setNoiseEnabled] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string>('wear');
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 720,
    height: 360,
  });

  const sim = useMemo(
    () => simulateSystems(gainK, deltaGPercent, disturbanceEnabled, disturbanceMag, noiseEnabled),
    [gainK, deltaGPercent, disturbanceEnabled, disturbanceMag, noiseEnabled]
  );

  const applyPreset = (preset: Preset) => {
    setGainK(preset.gainK);
    setDeltaGPercent(preset.deltaGPercent);
    setDisturbanceEnabled(preset.disturbanceEnabled);
    setDisturbanceMag(preset.disturbanceMag);
    setNoiseEnabled(preset.noiseEnabled);
    setActivePresetId(preset.id);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(300, Math.floor(entry.contentRect.width));
        const h = w < 520 ? 290 : 360;
        setCanvasSize({ width: w, height: h });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvasSize;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Chalkboard background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    const pad = { top: 28, right: 24, bottom: 42, left: 54 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    // Dynamic y-bounds so large disturbances never clip
    let yMin = -0.2;
    let yMax = 1.65;
    for (let i = 0; i < sim.times.length; i++) {
      yMin = Math.min(yMin, sim.yOpen[i] - 0.15, sim.yClosed[i] - 0.15);
      yMax = Math.max(yMax, sim.yOpen[i] + 0.15, sim.yClosed[i] + 0.15);
    }
    yMin = Math.floor(yMin * 5) / 5;
    yMax = Math.ceil(yMax * 5) / 5;

    const toX = (t: number) => pad.left + (t / T_END) * plotW;
    const toY = (y: number) => pad.top + ((yMax - y) / (yMax - yMin)) * plotH;

    // Subtle grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let t = 0; t <= 8; t += 1) {
      const x = toX(t);
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + plotH);
      ctx.stroke();
    }
    const yStep = yMax - yMin > 2.2 ? 0.5 : 0.25;
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax + 1e-6; y += yStep) {
      const py = toY(y);
      ctx.beginPath();
      ctx.moveTo(pad.left, py);
      ctx.lineTo(pad.left + plotW, py);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(y.toFixed(2), pad.left - 8, py);
    }

    // X-axis ticks & label
    ctx.fillStyle = '#64748b';
    ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let t = 0; t <= 8; t += 1) {
      ctx.fillText(`${t}s`, toX(t), pad.top + plotH + 8);
    }
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px ui-sans-serif, system-ui, sans-serif';
    ctx.fillText('Time t [seconds]', pad.left + plotW / 2, height - 16);

    // Y-axis label
    ctx.save();
    ctx.translate(14, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px ui-sans-serif, system-ui, sans-serif';
    ctx.fillText('Output y(t)', 0, 0);
    ctx.restore();

    // Zero line
    if (yMin <= 0 && yMax >= 0) {
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(pad.left, toY(0));
      ctx.lineTo(pad.left + plotW, toY(0));
      ctx.stroke();
    }

    // Disturbance onset marker at t = 3.0s
    if (disturbanceEnabled && Math.abs(disturbanceMag) > 0.001) {
      const dx = toX(DISTURBANCE_TIME);
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(251, 113, 133, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(dx, pad.top);
      ctx.lineTo(dx, pad.top + plotH);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#fb7185';
      ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        `Wind Gust D = ${disturbanceMag > 0 ? '+' : ''}${disturbanceMag.toFixed(2)}`,
        dx + 6,
        pad.top + 12
      );
    }

    // Nominal Target r(t) = 1
    const targetY = toY(1.0);
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.7)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(pad.left, targetY);
    ctx.lineTo(pad.left + plotW, targetY);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#34d399';
    ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Target r(t) = 1.00', pad.left + 8, targetY - 11);

    // Open-Loop Response (dashed cyan)
    ctx.save();
    ctx.setLineDash([7, 5]);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i < sim.times.length; i++) {
      const px = toX(sim.times[i]);
      const py = toY(sim.yOpen[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // Closed-Loop Response (luminous amber with glow)
    ctx.save();
    ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let i = 0; i < sim.times.length; i++) {
      const px = toX(sim.times[i]);
      const py = toY(sim.yClosed[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // Direct curve end-labels on right side (clamped safely inside plot bounds)
    const lastIdx = sim.times.length - 1;
    const clampLabelY = (py: number) =>
      Math.min(pad.top + plotH - 8, Math.max(pad.top + 12, py));
    const endOpenY = clampLabelY(toY(sim.yOpen[lastIdx]));
    const endClosedY = clampLabelY(toY(sim.yClosed[lastIdx]));
    const labelX = pad.left + plotW - 6;

    const avoidOverlap = Math.abs(endOpenY - endClosedY) < 18;
    ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(
      `Open-Loop (${sim.yOpen[lastIdx].toFixed(2)})`,
      labelX,
      avoidOverlap ? clampLabelY(Math.min(endOpenY, endClosedY) - 10) : clampLabelY(endOpenY - 9)
    );

    ctx.fillStyle = '#f59e0b';
    ctx.fillText(
      `Closed-Loop (${sim.yClosed[lastIdx].toFixed(2)})`,
      labelX,
      avoidOverlap ? clampLabelY(Math.max(endOpenY, endClosedY) + 12) : clampLabelY(endClosedY - 9)
    );

    // Interactive Hover Cursor
    if (hoverTime !== null && hoverTime >= 0 && hoverTime <= T_END) {
      const idx = Math.min(
        sim.times.length - 1,
        Math.max(0, Math.round((hoverTime / T_END) * (sim.times.length - 1)))
      );
      const tVal = sim.times[idx];
      const hx = toX(tVal);
      const hyO = toY(sim.yOpen[idx]);
      const hyC = toY(sim.yClosed[idx]);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hx, pad.top);
      ctx.lineTo(hx, pad.top + plotH);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(hx, hyO, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(hx, hyC, 4.5, 0, Math.PI * 2);
      ctx.fill();

      const boxW = 152;
      const boxH = 54;
      const boxX = hx + 12 + boxW > width - 10 ? hx - boxW - 12 : hx + 12;
      const boxY = pad.top + 8;

      ctx.fillStyle = 'rgba(15, 21, 34, 0.92)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = '600 11px ui-monospace, SFMono-Regular, monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`t = ${tVal.toFixed(2)} s`, boxX + 8, boxY + 14);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Open:   ${sim.yOpen[idx].toFixed(3)}`, boxX + 8, boxY + 30);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`Closed: ${sim.yClosed[idx].toFixed(3)}`, boxX + 8, boxY + 45);
    }

    // Plot border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad.left, pad.top, plotW, plotH);
  }, [canvasSize, sim, disturbanceEnabled, disturbanceMag, hoverTime]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padLeft = 54;
    const padRight = 24;
    const plotW = rect.width - padLeft - padRight;
    if (x < padLeft || x > padLeft + plotW) {
      setHoverTime(null);
      return;
    }
    setHoverTime(((x - padLeft) / plotW) * T_END);
  };

  const activePreset = PRESETS.find((p) => p.id === activePresetId);
  const dynamicInsight = activePreset
    ? activePreset.insight
    : noiseEnabled && gainK >= 12
      ? 'High loop gain K forces the closed-loop system to track sensor noise N faithfullyâ€”remember S + T = 1!'
      : deltaGPercent !== 0
        ? `Plant drifted by ${deltaGPercent > 0 ? '+' : ''}${deltaGPercent}%. Closed-loop sensitivity |S(0)| = ${(sim.sensitivityNominal * 100).toFixed(1)}% attenuates that drift dramatically.`
        : 'Adjust K, Î”G, Disturbance D, or Noise N to feel the fundamental feedback trade-off.';

  return (
    <div className="space-y-5 text-[var(--ink)]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-[var(--rule)] pb-4">
        <div className="hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--plot-3)]">
            <Sliders size={16} weight="duotone" />
            <span>Interactive Lab 1 Â· Open-Loop vs Closed-Loop Feedback</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--ink)] mt-1">
            Sensitivity, Disturbance Rejection &amp; the Sensor Noise Trade-off
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="rounded-lg bg-[var(--paper-muted)] border border-[var(--rule)] px-3 py-1.5 text-[var(--ink-soft)]">
            <MathText text={`$G(s) = \\frac{K_p(1+\\Delta G)}{s+1},\\; K_p=1,\\; H=1$`} />
          </div>
        </div>
      </div>

      {/* Presets Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)] mr-1 flex items-center gap-1">
          <Sparkle size={14} weight="fill" className="text-[var(--plot-2)]" />
          Presets:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
              activePresetId === p.id
                ? 'bg-sky-500/20 border-sky-400 text-[var(--plot-3)] shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                : 'bg-[var(--paper-muted)] border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Canvas + Controls */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: Canvas + Live Metrics */}
        <div className="xl:col-span-8 space-y-4">
          <div
            ref={containerRef}
            className="relative rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverTime(null)}
              style={{ width: canvasSize.width, height: canvasSize.height }}
              className="block cursor-crosshair"
            />
          </div>

          {/* Live Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
              <div className="text-[11px] uppercase tracking-wider text-[var(--ink-faint)]">
                Sensitivity <MathText text="$|S_G^T(0)|$" />
              </div>
              <div className="text-xl font-mono font-bold text-[var(--forest)] mt-1">
                {(sim.sensitivityNominal * 100).toFixed(1)}%
              </div>
              <div className="text-[11px] text-[var(--ink-faint)] mt-0.5">
                <MathText text={`$\\frac{1}{1+K_p K H} = \\frac{1}{${(1 + gainK).toFixed(1)}}$`} />
              </div>
            </div>

            <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
              <div className="text-[11px] uppercase tracking-wider text-[var(--ink-faint)]">
                Open-Loop <MathText text="$e_{ss}$" />
              </div>
              <div
                className={`text-xl font-mono font-bold mt-1 ${
                  sim.essOpen > 0.15 ? 'text-rose-400' : 'text-[var(--plot-3)]'
                }`}
              >
                {(sim.essOpen * 100).toFixed(1)}%
              </div>
              <div className="text-[11px] text-[var(--ink-faint)] mt-0.5">
                Final: {sim.steadyOpen.toFixed(3)}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
              <div className="text-[11px] uppercase tracking-wider text-[var(--ink-faint)]">
                Closed-Loop <MathText text="$e_{ss}$" />
              </div>
              <div className="text-xl font-mono font-bold text-[var(--plot-2)] mt-1">
                {(sim.essClosed * 100).toFixed(1)}%
              </div>
              <div className="text-[11px] text-[var(--ink-faint)] mt-0.5">
                Final: {sim.steadyClosed.toFixed(3)}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
              <div className="text-[11px] uppercase tracking-wider text-[var(--ink-faint)]">
                Sensor Noise RMS
              </div>
              <div
                className={`text-xl font-mono font-bold mt-1 ${
                  noiseEnabled && sim.noiseRmsClosed > 0.06
                    ? 'text-rose-400'
                    : noiseEnabled
                      ? 'text-[var(--plot-2)]'
                      : 'text-[var(--ink-faint)]'
                }`}
              >
                {noiseEnabled ? sim.noiseRmsClosed.toFixed(3) : '0.000'}
              </div>
              <div className="text-[11px] text-[var(--ink-faint)] mt-0.5">
                {noiseEnabled ? 'Passed via T(s)' : 'Noise Off'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls & Guided Intuition */}
        <div className="xl:col-span-4 space-y-4">
          <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4 space-y-4">
            {/* Gain K */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-[var(--ink-soft)]">
                  Loop Gain <MathText text="$K$" />
                </span>
                <span className="font-mono text-[var(--plot-3)] font-semibold">{gainK.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={20}
                step={0.5}
                value={gainK}
                onChange={(e) => {
                  setGainK(parseFloat(e.target.value));
                  setActivePresetId('');
                }}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--ink-faint)] mt-0.5">
                <span>0.5 (Sluggish)</span>
                <span>20 (Aggressive)</span>
              </div>
            </div>

            {/* Plant Drift */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-[var(--ink-soft)]">
                  Plant Drift <MathText text={"$\\Delta G$"} />
                </span>
                <span
                  className={`font-mono font-semibold ${
                    deltaGPercent === 0 ? 'text-[var(--forest)]' : 'text-[var(--plot-2)]'
                  }`}
                >
                  {deltaGPercent > 0 ? '+' : ''}
                  {deltaGPercent}%
                </span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                step={5}
                value={deltaGPercent}
                onChange={(e) => {
                  setDeltaGPercent(parseInt(e.target.value, 10));
                  setActivePresetId('');
                }}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--ink-faint)] mt-0.5">
                <span>-50% Wear</span>
                <span>0%</span>
                <span>+50% Surge</span>
              </div>
            </div>

            {/* Disturbance D Toggle + Slider */}
            <div className="pt-2 border-t border-[var(--rule)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--ink-soft)] flex items-center gap-1.5">
                  <Wind size={15} className="text-rose-400" />
                  Step Disturbance <MathText text="$D$" /> (at <MathText text="$t=3$" /> s)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setDisturbanceEnabled((v) => !v);
                    setActivePresetId('');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                    disturbanceEnabled
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                      : 'bg-[var(--paper-muted)] border-[var(--rule-strong)] text-[var(--ink-faint)]'
                  }`}
                >
                  {disturbanceEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
              {disturbanceEnabled && (
                <div>
                  <div className="flex justify-between text-[11px] text-[var(--ink-faint)] mb-1">
                    <span>Gust Magnitude</span>
                    <span className="font-mono text-rose-400">
                      {disturbanceMag > 0 ? '+' : ''}
                      {disturbanceMag.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-0.6}
                    max={0.6}
                    step={0.1}
                    value={disturbanceMag}
                    onChange={(e) => {
                      setDisturbanceMag(parseFloat(e.target.value));
                      setActivePresetId('');
                    }}
                    className="w-full cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Sensor Noise Toggle */}
            <div className="pt-2 border-t border-[var(--rule)] flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--ink-soft)] flex items-center gap-1.5">
                <WaveSine size={15} className="text-[var(--plot-2)]" />
                Sensor Noise <MathText text="$N(t)$" />
              </span>
              <button
                type="button"
                onClick={() => {
                  setNoiseEnabled((v) => !v);
                  setActivePresetId('');
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                  noiseEnabled
                    ? 'bg-amber-500/20 border-amber-400 text-[var(--plot-2)]'
                    : 'bg-[var(--paper-muted)] border-[var(--rule-strong)] text-[var(--ink-faint)]'
                }`}
              >
                {noiseEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => applyPreset(PRESETS[0])}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[var(--rule)] bg-[var(--paper-muted)] hover:bg-slate-800 text-xs font-medium text-[var(--ink-soft)] transition-colors cursor-pointer"
            >
              <ArrowsCounterClockwise size={14} />
              Reset to Nominal
            </button>
          </div>

          {/* Transfer Function Algebra Box */}
          <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3.5 text-xs space-y-2">
            <div className="font-semibold text-[var(--ink-soft)] flex items-center gap-1.5">
              <Lightning size={14} className="text-[var(--plot-3)]" />
              Closed-Loop Formula
            </div>
            <MathBlock
              tex={`\\begin{aligned} Y(s) &= \\underbrace{\\frac{KG}{1+KGH}}_{T(s)} R \\\\ &\\quad + \\underbrace{\\frac{1/(s+1)}{1+KGH}}_{S(s)\\text{ rejects }D} D - T(s) N \\end{aligned}`}
              className="text-[var(--ink)] text-xs"
            />
          </div>

          {/* What to Notice */}
          <div
            className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
              noiseEnabled && gainK >= 12
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                : 'border-emerald-500/30 bg-emerald-500/5 text-[var(--ink)]'
            }`}
          >
            <div className="font-semibold flex items-center gap-1.5 mb-1">
              {noiseEnabled && gainK >= 12 ? (
                <>
                  <Warning size={15} className="text-rose-400" />
                  <span className="text-rose-300">What to Notice (Noise Trap!)</span>
                </>
              ) : (
                <>
                  <CheckCircle size={15} className="text-[var(--forest)]" />
                  <span className="text-[var(--forest)]">What to Notice</span>
                </>
              )}
            </div>
            <p>{dynamicInsight}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
