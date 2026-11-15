import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Compass,
  Pause,
  Play,
  Sparkle,
  Warning,
  CheckCircle,
} from '@phosphor-icons/react';
import { MathBlock, MathText } from '../MathText';

interface Preset {
  id: string;
  label: string;
  theta0Deg: number;
  deltaThetaDeg: number;
  insight: string;
}

const PRESETS: Preset[] = [
  {
    id: 'small-angle',
    label: 'Î¸â‚€ = 0Â° (Small-Angle Law)',
    theta0Deg: 0,
    deltaThetaDeg: 18,
    insight:
      'Around the bottom equilibrium Î¸â‚€ = 0Â°, Tâ‚€ = 0 and slope m = cos(0Â°) = +1. That gives the classic small-angle law T â‰ˆ MgLÂ·Î¸ (with Î¸ in radians!). For |Î”Î¸| â‰¤ 20Â°, error is tiny.',
  },
  {
    id: 'ex21b',
    label: 'Î¸â‚€ = 30Â° (Ex 2.1b)',
    theta0Deg: 30,
    deltaThetaDeg: 22,
    insight:
      'At Î¸â‚€ = 30Â°, the operating torque is Tâ‚€ = 0.500 MgL and the tangent slope flattens to m = cos(30Â°) = 0.866 MgL/rad. The incremental torque is Î”T â‰ˆ 0.866 MgL Â· Î”Î¸_rad.',
  },
  {
    id: 'trap90',
    label: 'Î¸â‚€ = 90Â° (Zero-Slope Trap!)',
    theta0Deg: 90,
    deltaThetaDeg: 30,
    insight:
      'Zero-Slope Trap! At Î¸â‚€ = 90Â°, sin(Î¸) reaches its peak so dT/dÎ¸ = cos(90Â°) = 0! First-order linearization says Î”T = 0â€”completely blind to the downward curvature as you move away from 90Â°.',
  },
  {
    id: 'inverted',
    label: 'Î¸â‚€ = 180Â° (Inverted Pendulum)',
    theta0Deg: 180,
    deltaThetaDeg: 18,
    insight:
      'Inverted unstable equilibrium! Slope m = cos(180Â°) = -1 < 0: a positive perturbation Î”Î¸ produces a NEGATIVE restoring torque, pushing the pendulum farther away from 180Â°!',
  },
];

const DEG_TO_RAD = Math.PI / 180;

export const LinearizationLab: React.FC = () => {
  const [theta0Deg, setTheta0Deg] = useState<number>(30);
  const [deltaThetaDeg, setDeltaThetaDeg] = useState<number>(22);
  const [activePresetId, setActivePresetId] = useState<string>('ex21b');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const pendulumCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const plotCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pendulumBoxRef = useRef<HTMLDivElement | null>(null);
  const plotBoxRef = useRef<HTMLDivElement | null>(null);

  const [pendulumSize, setPendulumSize] = useState<{ w: number; h: number }>({ w: 360, h: 330 });
  const [plotSize, setPlotSize] = useState<{ w: number; h: number }>({ w: 480, h: 330 });

  const animRef = useRef<number | null>(null);
  const baseAmpRef = useRef<number>(22);

  useEffect(() => {
    if (!isAnimating) {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
      animRef.current = null;
      return;
    }

    baseAmpRef.current = Math.max(12, Math.min(42, Math.abs(deltaThetaDeg) || 25));
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const nextDelta = Math.round(baseAmpRef.current * Math.sin(elapsed * 2.1));
      setDeltaThetaDeg(nextDelta);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
      animRef.current = null;
    };
  }, [isAnimating]);

  useEffect(() => {
    const obsP = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = Math.max(260, Math.floor(e.contentRect.width));
        setPendulumSize({ w, h: w < 340 ? 290 : 330 });
      }
    });
    const obsG = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = Math.max(280, Math.floor(e.contentRect.width));
        setPlotSize({ w, h: w < 360 ? 290 : 330 });
      }
    });
    if (pendulumBoxRef.current) obsP.observe(pendulumBoxRef.current);
    if (plotBoxRef.current) obsG.observe(plotBoxRef.current);
    return () => {
      obsP.disconnect();
      obsG.disconnect();
    };
  }, []);

  const physics = useMemo(() => {
    const theta0Rad = theta0Deg * DEG_TO_RAD;
    const deltaRad = deltaThetaDeg * DEG_TO_RAD;
    const thetaDeg = theta0Deg + deltaThetaDeg;
    const thetaRad = thetaDeg * DEG_TO_RAD;

    const t0 = Math.sin(theta0Rad);
    const slope = Math.cos(theta0Rad); // dT/dtheta in MgL / rad
    const tExact = Math.sin(thetaRad);
    const tLin = t0 + slope * deltaRad;
    const absError = Math.abs(tExact - tLin);
    const relErrorPct =
      Math.abs(tExact) > 0.02 ? (absError / Math.abs(tExact)) * 100 : absError * 100;

    return {
      theta0Rad,
      deltaRad,
      thetaDeg,
      thetaRad,
      t0,
      slope,
      tExact,
      tLin,
      absError,
      relErrorPct,
    };
  }, [theta0Deg, deltaThetaDeg]);

  // Draw Left Canvas: Physical Pendulum
  useEffect(() => {
    const canvas = pendulumCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { w, h } = pendulumSize;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.48;
    const cy = h * 0.49;
    const L = Math.min(w, h) * 0.30;

    // Angle mapping: theta = 0 is straight down, increasing CCW (right at 90, up at 180)
    const angleToXY = (deg: number, radius: number) => {
      const rad = deg * DEG_TO_RAD;
      return {
        x: cx + radius * Math.sin(rad),
        y: cy + radius * Math.cos(rad),
      };
    };

    // Subtle circular reference ring
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, L, 0, Math.PI * 2);
    ctx.stroke();

    // Vertical reference axis (theta = 0 down, theta = 180 up)
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(cx, cy - L - 14);
    ctx.lineTo(cx, cy + L + 16);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#64748b';
    ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('0Â° (Eq.)', cx, cy + L + 18);
    ctx.fillText('180Â° (Inverted)', cx, cy - L - 16);

    // Angle arc for theta0 (from 0 down to theta0)
    // Canvas angle: straight down is +pi/2, CCW in standard physics means decreasing canvas angle
    const canvasAngle = (deg: number) => Math.PI / 2 - deg * DEG_TO_RAD;

    if (theta0Deg > 0) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, L * 0.32, Math.PI / 2, canvasAngle(theta0Deg), true);
      ctx.stroke();

      const mid0 = angleToXY(Math.min(theta0Deg * 0.45, theta0Deg - 8), L * 0.3);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Î¸â‚€=${theta0Deg}Â°`, mid0.x + 2, mid0.y - 4);
    }

    // Perturbation arc deltaTheta (from theta0 to theta)
    if (deltaThetaDeg !== 0) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(
        cx,
        cy,
        L * 0.48,
        canvasAngle(theta0Deg),
        canvasAngle(physics.thetaDeg),
        deltaThetaDeg > 0
      );
      ctx.stroke();
    }

    // Ghost rod at operating point theta0
    const bob0 = angleToXY(theta0Deg, L);
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(bob0.x, bob0.y);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bob0.x, bob0.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Active rod at theta = theta0 + deltaTheta
    const bob = angleToXY(physics.thetaDeg, L);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(bob.x, bob.y);
    ctx.stroke();

    // Restoring torque tangential arcs around the pivot!
    // Positive restoring torque acts back toward theta = 0 (decreasing theta, i.e., clockwise in screen space)
    const drawTorqueArc = (
      torqueVal: number,
      radius: number,
      color: string,
      label: string,
      labelOffset: number
    ) => {
      if (Math.abs(torqueVal) < 0.03) return;
      const arcSpan = Math.min(1.05, Math.abs(torqueVal) * 0.85);
      const startA = canvasAngle(physics.thetaDeg);
      // Restoring direction (back toward 0Â°): increasing canvasAngle if sin(theta) > 0
      const dir = torqueVal > 0 ? 1 : -1;
      const endA = startA + dir * arcSpan;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startA, endA, dir < 0);
      ctx.stroke();

      // Arrowhead at endA
      const ax = cx + radius * Math.cos(endA);
      const ay = cy + radius * Math.sin(endA);
      const tangentAngle = endA + dir * (Math.PI / 2);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(
        ax - 8 * Math.cos(tangentAngle - 0.4),
        ay - 8 * Math.sin(tangentAngle - 0.4)
      );
      ctx.lineTo(
        ax - 8 * Math.cos(tangentAngle + 0.4),
        ay - 8 * Math.sin(tangentAngle + 0.4)
      );
      ctx.closePath();
      ctx.fill();

      const lx = cx + (radius + labelOffset) * Math.cos(endA);
      const ly = cy + (radius + labelOffset) * Math.sin(endA);
      ctx.font = '600 10px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, lx, ly);
    };

    drawTorqueArc(physics.tExact, L * 0.72, '#38bdf8', 'T_exact', -16);
    drawTorqueArc(physics.tLin, L * 0.88, '#f59e0b', 'T_lin', 15);

    // Active pendulum bob
    ctx.save();
    ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(bob.x, bob.y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Pivot pin
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();

    // Top HUD
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 12px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Physical Pendulum (Î¸ = ${physics.thetaDeg}Â°)`, 12, 20);

    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Arc: Exact Torque', 12, h - 26);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('Arc: Linearized Torque', 12, h - 11);
  }, [pendulumSize, theta0Deg, deltaThetaDeg, physics]);

  // Draw Right Canvas: T(theta) vs Tangent Line + Error Shading
  useEffect(() => {
    const canvas = plotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { w, h } = plotSize;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const pad = { top: 28, right: 20, bottom: 40, left: 48 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const degMin = -45;
    const degMax = 225;
    const yMin = -1.35;
    const yMax = 1.45;

    const toX = (deg: number) => pad.left + ((deg - degMin) / (degMax - degMin)) * plotW;
    const toY = (val: number) => pad.top + ((yMax - val) / (yMax - yMin)) * plotH;

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let d = -45; d <= 225; d += 45) {
      const px = toX(d);
      ctx.beginPath();
      ctx.moveTo(px, pad.top);
      ctx.lineTo(px, pad.top + plotH);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${d}Â°`, px, pad.top + plotH + 6);
    }

    for (const yTick of [-1.0, -0.5, 0, 0.5, 1.0]) {
      const py = toY(yTick);
      ctx.strokeStyle = yTick === 0 ? '#334155' : '#1e293b';
      ctx.lineWidth = yTick === 0 ? 1.3 : 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, py);
      ctx.lineTo(pad.left + plotW, py);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(yTick.toFixed(1), pad.left - 7, py);
    }

    // Axis titles
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Angle Î¸ [degrees]', pad.left + plotW / 2, h - 12);

    ctx.save();
    ctx.translate(13, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Torque T / (MgL)', 0, 0);
    ctx.restore();

    // Clip to plot region
    ctx.save();
    ctx.beginPath();
    ctx.rect(pad.left, pad.top, plotW, plotH);
    ctx.clip();

    // Shaded Taylor approximation error region between theta0 and theta
    if (deltaThetaDeg !== 0) {
      const dStart = Math.min(theta0Deg, physics.thetaDeg);
      const dEnd = Math.max(theta0Deg, physics.thetaDeg);
      const steps = 60;

      ctx.fillStyle = 'rgba(251, 113, 133, 0.24)';
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const d = dStart + ((dEnd - dStart) * i) / steps;
        const val = Math.sin(d * DEG_TO_RAD);
        const px = toX(d);
        const py = toY(val);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      for (let i = steps; i >= 0; i--) {
        const d = dStart + ((dEnd - dStart) * i) / steps;
        const val = physics.t0 + physics.slope * (d - theta0Deg) * DEG_TO_RAD;
        ctx.lineTo(toX(d), toY(val));
      }
      ctx.closePath();
      ctx.fill();
    }

    // Exact nonlinear curve T(theta) = MgL sin(theta)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let d = degMin; d <= degMax; d += 1) {
      const px = toX(d);
      const py = toY(Math.sin(d * DEG_TO_RAD));
      if (d === degMin) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Tangent line T_lin(theta) = T0 + m * (theta - theta0)
    const tangStart = Math.max(degMin, theta0Deg - 70);
    const tangEnd = Math.min(degMax, theta0Deg + 70);
    ctx.save();
    ctx.shadowColor = 'rgba(245, 158, 11, 0.35)';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    ctx.moveTo(
      toX(tangStart),
      toY(physics.t0 + physics.slope * (tangStart - theta0Deg) * DEG_TO_RAD)
    );
    ctx.lineTo(
      toX(tangEnd),
      toY(physics.t0 + physics.slope * (tangEnd - theta0Deg) * DEG_TO_RAD)
    );
    ctx.stroke();
    ctx.restore();

    // Vertical error bar at theta = theta0 + deltaTheta
    const pxCurr = toX(physics.thetaDeg);
    const pyExact = toY(physics.tExact);
    const pyLin = toY(physics.tLin);

    if (deltaThetaDeg !== 0) {
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(pxCurr, pyExact);
      ctx.lineTo(pxCurr, pyLin);
      ctx.stroke();

      // Dots on exact vs linearized
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(pxCurr, pyExact, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(pxCurr, pyLin, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Operating point (theta0, T0)
    const px0 = toX(theta0Deg);
    const py0 = toY(physics.t0);
    ctx.fillStyle = '#090d16';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(px0, py0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = theta0Deg > 130 ? 'right' : 'left';
    ctx.fillText(
      `(${theta0Deg}Â°, ${physics.t0.toFixed(2)})`,
      theta0Deg > 130 ? px0 - 10 : px0 + 10,
      py0 - 10
    );

    ctx.restore();

    // Curve labels in header (measured dynamically to prevent overflow)
    ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left';
    let legX = pad.left + 4;
    const legItems = [
      { label: 'â€” MgL sin(Î¸)', color: '#38bdf8' },
      { label: 'â€” Tangent', color: '#f59e0b' },
      { label: 'â–  Error', color: '#fb7185' },
    ];
    for (const item of legItems) {
      ctx.fillStyle = item.color;
      ctx.fillText(item.label, legX, 17);
      legX += ctx.measureText(item.label).width + 12;
    }

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad.left, pad.top, plotW, plotH);
  }, [plotSize, theta0Deg, deltaThetaDeg, physics]);

  const activePreset = PRESETS.find((p) => p.id === activePresetId);
  const dynamicInsight = activePreset
    ? activePreset.insight
    : Math.abs(physics.slope) < 0.15
      ? 'Near 90Â°, the tangent slope cos(Î¸â‚€) is almost zeroâ€”first-order linearization misses the nonlinear curvature!'
      : physics.slope < 0
        ? 'Negative slope cos(Î¸â‚€) < 0 means the linearized spring constant is negative (unstable equilibrium)!'
        : `Error grows roughly as O(Î”Î¸Â²). Shrinking |Î”Î¸| by half cuts Taylor error by ~4Ã— (or ~8Ã— near Î¸â‚€ = 0Â°)!`;

  return (
    <div className="space-y-5 text-[var(--ink)]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-[var(--rule)] pb-4">
        <div className="hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--plot-3)]">
            <Compass size={16} weight="duotone" />
            <span>Interactive Lab 2 Â· Ch 2.3 / Ex 2.1 Linearization</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--ink)] mt-1">
            Nonlinear Pendulum &amp; Tangent-Line Taylor Explorer
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsAnimating((v) => !v)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer self-start ${
            isAnimating
              ? 'bg-amber-500/20 border-amber-400 text-[var(--plot-2)]'
              : 'bg-[var(--paper-muted)] border-[var(--rule-strong)] text-[var(--ink)] hover:border-sky-400'
          }`}
        >
          {isAnimating ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" />}
          {isAnimating ? 'Pause Oscillation' : 'Animate Perturbation'}
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)] mr-1 flex items-center gap-1">
          <Sparkle size={14} weight="fill" className="text-[var(--plot-2)]" />
          Presets:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setIsAnimating(false);
              setTheta0Deg(p.theta0Deg);
              setDeltaThetaDeg(p.deltaThetaDeg);
              setActivePresetId(p.id);
            }}
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

      {/* Dual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div
          ref={pendulumBoxRef}
          className="lg:col-span-5 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] overflow-hidden"
        >
          <canvas
            ref={pendulumCanvasRef}
            style={{ width: pendulumSize.w, height: pendulumSize.h }}
            className="block"
          />
        </div>

        <div
          ref={plotBoxRef}
          className="lg:col-span-7 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] overflow-hidden"
        >
          <canvas
            ref={plotCanvasRef}
            style={{ width: plotSize.w, height: plotSize.h }}
            className="block"
          />
        </div>
      </div>

      {/* Sliders & Live Math */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-[var(--ink-soft)]">
                Operating Point <MathText text={"$\\theta_0$"} />
              </span>
              <span className="font-mono text-[var(--forest)] font-semibold">
                {theta0Deg}Â° ({physics.theta0Rad.toFixed(3)} rad)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={180}
              step={1}
              value={theta0Deg}
              onChange={(e) => {
                setTheta0Deg(parseInt(e.target.value, 10));
                setActivePresetId('');
              }}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--ink-faint)] mt-0.5">
              <span>0Â° (Down)</span>
              <span>90Â° (Horizontal)</span>
              <span>180Â° (Up)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-[var(--ink-soft)]">
                Perturbation <MathText text={"$\\Delta\\theta$"} />
              </span>
              <span className="font-mono text-[var(--plot-2)] font-semibold">
                {deltaThetaDeg > 0 ? '+' : ''}
                {deltaThetaDeg}Â° ({physics.deltaRad > 0 ? '+' : ''}
                {physics.deltaRad.toFixed(3)} rad)
              </span>
            </div>
            <input
              type="range"
              min={-45}
              max={45}
              step={1}
              value={deltaThetaDeg}
              onChange={(e) => {
                setIsAnimating(false);
                setDeltaThetaDeg(parseInt(e.target.value, 10));
                setActivePresetId('');
              }}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--ink-faint)] mt-0.5">
              <span>-45Â°</span>
              <span>0Â°</span>
              <span>+45Â°</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3.5 space-y-1.5">
            <div className="text-[11px] uppercase tracking-wider text-[var(--ink-faint)]">
              Tangent Line Approximation (Radians!)
            </div>
            <MathBlock
              tex={`T_{\\text{lin}} = MgL\\big(${physics.t0.toFixed(3)} + (${physics.slope.toFixed(3)})\\,\\Delta\\theta_{\\text{rad}}\\big)`}
              className="text-[var(--plot-2)] text-xs"
            />
            <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-mono">
              <div>
                <div className="text-[10px] text-[var(--ink-faint)]">Exact</div>
                <div className="text-[var(--plot-3)] font-bold">{physics.tExact.toFixed(4)}</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--ink-faint)]">Linear</div>
                <div className="text-[var(--plot-2)] font-bold">{physics.tLin.toFixed(4)}</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--ink-faint)]">|Error|</div>
                <div className="text-rose-400 font-bold">{physics.absError.toFixed(4)}</div>
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
              theta0Deg === 90 || theta0Deg === 180
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                : 'border-emerald-500/30 bg-emerald-500/5 text-[var(--ink)]'
            }`}
          >
            <div className="font-semibold flex items-center gap-1.5 mb-1">
              {theta0Deg === 90 || theta0Deg === 180 ? (
                <>
                  <Warning size={15} className="text-rose-400" />
                  <span className="text-rose-300">What to Notice</span>
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
