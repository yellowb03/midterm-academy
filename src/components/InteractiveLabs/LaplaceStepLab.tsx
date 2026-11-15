import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle,
  Eye,
  Function as FunctionIcon,
  ShieldCheck,
  ShieldWarning,
  Sparkle,
  Warning,
} from '@phosphor-icons/react';
import { MathBlock, MathText } from '../MathText';

type PresetId = 'ex22' | 'e24' | 'underdamped' | 'fvt-imag' | 'fvt-rhp';

interface PolePoint {
  re: number;
  im: number;
  label: string;
}

interface ZeroPoint {
  re: number;
  im: number;
}

interface ComponentCurve {
  name: string;
  color: string;
  evalAt: (t: number) => number;
}

interface ScenarioModel {
  id: PresetId;
  title: string;
  yOfSLatex: string;
  partialFractionLatex: string;
  yOfTLatex: string;
  poles: PolePoint[];
  zeros: ZeroPoint[];
  components: ComponentCurve[];
  tMax: number;
  sBounds: { reMin: number; reMax: number; imMax: number };
  fvtValid: boolean;
  fvtReason: string;
  naiveFvtValue: number;
  insight: string;
}

const OMEGA_N = 2.0;

function buildScenario(presetId: PresetId, zeta: number): ScenarioModel {
  if (presetId === 'ex22') {
    return {
      id: 'ex22',
      title: 'Ex 2.2 (Non-zero IC)',
      yOfSLatex: 'Y(s) = \\frac{s^2 + 4s + 2}{s(s+1)(s+3)}',
      partialFractionLatex:
        'Y(s) = \\frac{2/3}{s} + \\frac{1/2}{s+1} - \\frac{1/6}{s+3}',
      yOfTLatex: 'y(t) = \\frac{2}{3} + \\frac{1}{2}e^{-t} - \\frac{1}{6}e^{-3t}',
      poles: [
        { re: 0, im: 0, label: '0' },
        { re: -1, im: 0, label: '-1' },
        { re: -3, im: 0, label: '-3' },
      ],
      zeros: [
        { re: -2 + Math.SQRT2, im: 0 },
        { re: -2 - Math.SQRT2, im: 0 },
      ],
      components: [
        { name: '2/3 (s=0)', color: '#38bdf8', evalAt: () => 2 / 3 },
        { name: '+0.5 e^(-t)', color: '#34d399', evalAt: (t) => 0.5 * Math.exp(-t) },
        { name: '-1/6 e^(-3t)', color: '#a78bfa', evalAt: (t) => -(1 / 6) * Math.exp(-3 * t) },
      ],
      tMax: 5.0,
      sBounds: { reMin: -4.2, reMax: 1.5, imMax: 2.5 },
      fvtValid: true,
      fvtReason: 'All poles of sY(s) = (sÂ²+4s+2)/((s+1)(s+3)) lie strictly in open LHP (s = -1, -3).',
      naiveFvtValue: 2 / 3,
      insight:
        'Notice y(0) = 2/3 + 1/2 - 1/6 = 1 (a non-zero initial condition!), and watch how the fast mode -1/6Â·e^(-3t) vanishes first while +1/2Â·e^(-t) decays slower toward y(âˆž) = 2/3.',
    };
  }

  if (presetId === 'e24') {
    return {
      id: 'e24',
      title: 'HW E2.4 (Laser Printer)',
      yOfSLatex: 'Y(s) = \\frac{6s + 300}{s(s+10)(s+30)}',
      partialFractionLatex:
        'Y(s) = \\frac{1}{s} - \\frac{1.2}{s+10} + \\frac{0.2}{s+30}',
      yOfTLatex: 'y(t) = 1 - 1.2e^{-10t} + 0.2e^{-30t}',
      poles: [
        { re: 0, im: 0, label: '0' },
        { re: -10, im: 0, label: '-10' },
        { re: -30, im: 0, label: '-30' },
      ],
      zeros: [{ re: -50, im: 0 }],
      components: [
        { name: '1 (s=0)', color: '#38bdf8', evalAt: () => 1.0 },
        { name: '-1.2 e^(-10t)', color: '#34d399', evalAt: (t) => -1.2 * Math.exp(-10 * t) },
        { name: '+0.2 e^(-30t)', color: '#a78bfa', evalAt: (t) => 0.2 * Math.exp(-30 * t) },
      ],
      tMax: 0.55,
      sBounds: { reMin: -36, reMax: 6, imMax: 12 },
      fvtValid: true,
      fvtReason: 'All poles of sY(s) are strictly in open LHP (s = -10, -30).',
      naiveFvtValue: 1.0,
      insight:
        'Because the poles are 10Ã—â€“30Ã— deeper in the LHP (-10 and -30), the response settles in ~0.4 s! Notice how +0.2Â·e^(-30t) cancels -1.2Â·e^(-10t) with +1 at t = 0 so y(0) = 0 with zero initial slope.',
    };
  }

  if (presetId === 'fvt-imag') {
    return {
      id: 'fvt-imag',
      title: 'FVT Trap: Imaginary Poles',
      yOfSLatex: 'Y(s) = \\frac{1}{s^2 + 1}',
      partialFractionLatex:
        'Y(s) = \\frac{1}{2j}\\frac{1}{s-j} - \\frac{1}{2j}\\frac{1}{s+j}',
      yOfTLatex: 'y(t) = \\sin(t) \\quad (\\text{no limit as } t\\to\\infty!)',
      poles: [
        { re: 0, im: 1, label: '+j' },
        { re: 0, im: -1, label: '-j' },
      ],
      zeros: [],
      components: [
        { name: 'sin(t) [jÏ‰ mode]', color: '#38bdf8', evalAt: (t) => Math.sin(t) },
      ],
      tMax: 14.0,
      sBounds: { reMin: -2.2, reMax: 1.8, imMax: 2.2 },
      fvtValid: false,
      fvtReason: 'TRAP! sY(s) = s/(sÂ²+1) has poles ON the jÏ‰-axis (Â±j). FVT requires Re(s) < 0 strictly!',
      naiveFvtValue: 0,
      insight:
        'Classic Exam Trap! Naive FVT plugs s = 0 into s/(sÂ²+1) and claims y(âˆž) = 0. In reality, poles on the jÏ‰-axis produce sin(t), which oscillates forever and NEVER converges!',
    };
  }

  if (presetId === 'fvt-rhp') {
    return {
      id: 'fvt-rhp',
      title: 'FVT Trap: RHP Unstable Pole',
      yOfSLatex: 'Y(s) = \\frac{2s - 0.5}{s(s - 0.5)}',
      partialFractionLatex:
        'Y(s) = \\frac{1}{s} + \\frac{1}{s - 0.5}',
      yOfTLatex: 'y(t) = 1 + e^{+0.5t} \\to +\\infty',
      poles: [
        { re: 0, im: 0, label: '0' },
        { re: 0.5, im: 0, label: '+0.5' },
      ],
      zeros: [{ re: 0.25, im: 0 }],
      components: [
        { name: '1 (s=0)', color: '#38bdf8', evalAt: () => 1.0 },
        { name: '+e^(+0.5t) [RHP!]', color: '#fb7185', evalAt: (t) => Math.exp(0.5 * t) },
      ],
      tMax: 5.5,
      sBounds: { reMin: -2.0, reMax: 2.0, imMax: 2.0 },
      fvtValid: false,
      fvtReason: 'DANGER! sY(s) = (2s-0.5)/(s-0.5) has an unstable RHP pole at s = +0.5!',
      naiveFvtValue: 1.0,
      insight:
        'Deadly FVT Trap! Naive algebra gives lim(sâ†’0) sY(s) = (-0.5)/(-0.5) = +1â€”complete nonsense! Because one pole sits in the RHP at s = +0.5, the e^(+0.5t) term blows up to +âˆž.',
    };
  }

  // Underdamped / 2nd-order adjustable zeta
  const z = zeta;
  const wn = OMEGA_N;

  if (z === 0) {
    return {
      id: 'underdamped',
      title: '2nd-Order Step (Î¶ = 0, Undamped)',
      yOfSLatex: `Y(s) = \\frac{${(wn * wn).toFixed(0)}}{s(s^2 + ${(wn * wn).toFixed(0)})}`,
      partialFractionLatex: `Y(s) = \\frac{1}{s} - \\frac{s}{s^2 + ${(wn * wn).toFixed(0)}}`,
      yOfTLatex: `y(t) = 1 - \\cos(${wn.toFixed(1)}t)`,
      poles: [
        { re: 0, im: 0, label: '0' },
        { re: 0, im: wn, label: `+j${wn.toFixed(1)}` },
        { re: 0, im: -wn, label: `-j${wn.toFixed(1)}` },
      ],
      zeros: [],
      components: [
        { name: '1 (DC step)', color: '#38bdf8', evalAt: () => 1 },
        { name: `-cos(${wn.toFixed(1)}t)`, color: '#fb7185', evalAt: (t) => -Math.cos(wn * t) },
      ],
      tMax: 10.0,
      sBounds: { reMin: -4.2, reMax: 1.4, imMax: 3.0 },
      fvtValid: false,
      fvtReason: 'At Î¶ = 0, poles sit on the jÏ‰-axis (Â±j2). Output oscillates forever between 0 and 2!',
      naiveFvtValue: 1.0,
      insight:
        'At Î¶ = 0 there is zero damping: poles lie right on the jÏ‰-axis! The response oscillates endlessly around 1, so the Final Value Theorem does NOT apply.',
    };
  }

  if (z < 1) {
    const wd = wn * Math.sqrt(1 - z * z);
    const sigma = -z * wn;
    const sinCoeff = z / Math.sqrt(1 - z * z);
    return {
      id: 'underdamped',
      title: `2nd-Order Underdamped (Î¶ = ${z.toFixed(2)})`,
      yOfSLatex: `Y(s) = \\frac{${(wn * wn).toFixed(0)}}{s(s^2 + ${(2 * z * wn).toFixed(2)}s + ${(wn * wn).toFixed(0)})}`,
      partialFractionLatex: `Y(s) = \\frac{1}{s} - \\frac{s + ${(2 * z * wn).toFixed(2)}}{(s+${(-sigma).toFixed(2)})^2 + ${wd.toFixed(2)}^2}`,
      yOfTLatex: `y(t) = 1 - e^{${sigma.toFixed(2)}t}\\!\\left(\\cos(${wd.toFixed(2)}t) + ${sinCoeff.toFixed(2)}\\sin(${wd.toFixed(2)}t)\\right)`,
      poles: [
        { re: 0, im: 0, label: '0' },
        { re: sigma, im: wd, label: `${sigma.toFixed(2)}+j${wd.toFixed(2)}` },
        { re: sigma, im: -wd, label: `${sigma.toFixed(2)}-j${wd.toFixed(2)}` },
      ],
      zeros: [],
      components: [
        { name: '1 (Steady-state)', color: '#38bdf8', evalAt: () => 1 },
        {
          name: 'Damped cos mode',
          color: '#34d399',
          evalAt: (t) => -Math.exp(sigma * t) * Math.cos(wd * t),
        },
        {
          name: 'Damped sin mode',
          color: '#a78bfa',
          evalAt: (t) => -sinCoeff * Math.exp(sigma * t) * Math.sin(wd * t),
        },
      ],
      tMax: 8.0,
      sBounds: { reMin: -4.2, reMax: 1.4, imMax: 3.0 },
      fvtValid: true,
      fvtReason: `Complex poles at ${sigma.toFixed(2)} Â± j${wd.toFixed(2)} lie strictly in the LHP.`,
      naiveFvtValue: 1.0,
      insight:
        'As you increase Î¶ from 0 toward 1, the poles slide LEFT away from the jÏ‰-axis (faster decay e^(-Î¶Ï‰â‚™t)) and closer to the real axis (less oscillation Ï‰_d)!',
    };
  }

  if (Math.abs(z - 1) < 1e-6) {
    return {
      id: 'underdamped',
      title: '2nd-Order Critically Damped (Î¶ = 1.00)',
      yOfSLatex: `Y(s) = \\frac{${(wn * wn).toFixed(0)}}{s(s + ${wn.toFixed(0)})^2}`,
      partialFractionLatex: `Y(s) = \\frac{1}{s} - \\frac{1}{s+${wn.toFixed(0)}} - \\frac{${wn.toFixed(0)}}{(s+${wn.toFixed(0)})^2}`,
      yOfTLatex: `y(t) = 1 - e^{-${wn.toFixed(0)}t} - ${wn.toFixed(0)}t\\,e^{-${wn.toFixed(0)}t}`,
      poles: [
        { re: 0, im: 0, label: '0' },
        { re: -wn, im: 0, label: `-${wn.toFixed(0)} (Ã—2)` },
      ],
      zeros: [],
      components: [
        { name: '1 (Steady-state)', color: '#38bdf8', evalAt: () => 1 },
        { name: `-e^(-${wn.toFixed(0)}t)`, color: '#34d399', evalAt: (t) => -Math.exp(-wn * t) },
        {
          name: `-${wn.toFixed(0)}t e^(-${wn.toFixed(0)}t)`,
          color: '#a78bfa',
          evalAt: (t) => -wn * t * Math.exp(-wn * t),
        },
      ],
      tMax: 6.0,
      sBounds: { reMin: -4.2, reMax: 1.4, imMax: 3.0 },
      fvtValid: true,
      fvtReason: `Double pole at s = -${wn.toFixed(0)} lies strictly in the LHP.`,
      naiveFvtValue: 1.0,
      insight:
        'At Î¶ = 1, the two complex poles collide on the real axis to form a repeated pole at s = -2, producing the famous tÂ·e^(-2t) termâ€”fastest non-overshooting response!',
    };
  }

  // Overdamped z > 1
  const sq = Math.sqrt(z * z - 1);
  const p1 = -wn * (z - sq);
  const p2 = -wn * (z + sq);
  const a1 = p2 / (p1 - p2);
  const a2 = -p1 / (p1 - p2);

  return {
    id: 'underdamped',
    title: `2nd-Order Overdamped (Î¶ = ${z.toFixed(2)})`,
    yOfSLatex: `Y(s) = \\frac{${(wn * wn).toFixed(0)}}{s(s - (${p1.toFixed(2)}))(s - (${p2.toFixed(2)}))}`,
    partialFractionLatex: `Y(s) = \\frac{1}{s} + \\frac{${a1.toFixed(2)}}{s+${(-p1).toFixed(2)}} + \\frac{${a2.toFixed(2)}}{s+${(-p2).toFixed(2)}}`,
    yOfTLatex: `y(t) = 1 ${a1 >= 0 ? '+' : ''}${a1.toFixed(2)}e^{${p1.toFixed(2)}t} ${a2 >= 0 ? '+' : ''}${a2.toFixed(2)}e^{${p2.toFixed(2)}t}`,
    poles: [
      { re: 0, im: 0, label: '0' },
      { re: p1, im: 0, label: p1.toFixed(2) },
      { re: p2, im: 0, label: p2.toFixed(2) },
    ],
    zeros: [],
    components: [
      { name: '1 (Steady-state)', color: '#38bdf8', evalAt: () => 1 },
      { name: `${a1.toFixed(2)} e^(${p1.toFixed(2)}t)`, color: '#34d399', evalAt: (t) => a1 * Math.exp(p1 * t) },
      { name: `${a2.toFixed(2)} e^(${p2.toFixed(2)}t)`, color: '#a78bfa', evalAt: (t) => a2 * Math.exp(p2 * t) },
    ],
    tMax: 8.0,
    sBounds: { reMin: Math.min(-4.2, p2 - 0.8), reMax: 1.4, imMax: 3.0 },
    fvtValid: true,
    fvtReason: `Real poles at ${p1.toFixed(2)} and ${p2.toFixed(2)} lie strictly in the LHP.`,
    naiveFvtValue: 1.0,
    insight:
      'For Î¶ > 1, one pole creeps closer to the jÏ‰-axis (dominant slow pole!) while the other shoots far left. That slow pole dominates the settling time!',
  };
}

export const LaplaceStepLab: React.FC = () => {
  const [presetId, setPresetId] = useState<PresetId>('ex22');
  const [zeta, setZeta] = useState<number>(0.35);
  const [showComponents, setShowComponents] = useState<boolean>(true);
  const [hoverT, setHoverT] = useState<number | null>(null);

  const sCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sBoxRef = useRef<HTMLDivElement | null>(null);
  const tBoxRef = useRef<HTMLDivElement | null>(null);

  const [sSize, setSSize] = useState<{ w: number; h: number }>({ w: 340, h: 330 });
  const [tSize, setTSize] = useState<{ w: number; h: number }>({ w: 500, h: 330 });

  const scenario = useMemo(() => buildScenario(presetId, zeta), [presetId, zeta]);

  useEffect(() => {
    const obsS = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = Math.max(260, Math.floor(e.contentRect.width));
        setSSize({ w, h: w < 340 ? 290 : 330 });
      }
    });
    const obsT = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = Math.max(280, Math.floor(e.contentRect.width));
        setTSize({ w, h: w < 360 ? 290 : 330 });
      }
    });
    if (sBoxRef.current) obsS.observe(sBoxRef.current);
    if (tBoxRef.current) obsT.observe(tBoxRef.current);
    return () => {
      obsS.disconnect();
      obsT.disconnect();
    };
  }, []);

  // Draw Left Canvas: s-plane
  useEffect(() => {
    const canvas = sCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { w, h } = sSize;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const pad = { top: 28, right: 16, bottom: 36, left: 42 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const { reMin, reMax, imMax } = scenario.sBounds;
    const imMin = -imMax;

    const toX = (re: number) => pad.left + ((re - reMin) / (reMax - reMin)) * plotW;
    const toY = (im: number) => pad.top + ((imMax - im) / (imMax - imMin)) * plotH;

    const xZero = toX(0);
    const yZero = toY(0);

    // LHP shaded emerald
    ctx.fillStyle = 'rgba(52, 211, 153, 0.08)';
    ctx.fillRect(pad.left, pad.top, Math.max(0, xZero - pad.left), plotH);

    // RHP shaded rose
    ctx.fillStyle = 'rgba(251, 113, 133, 0.12)';
    ctx.fillRect(xZero, pad.top, Math.max(0, pad.left + plotW - xZero), plotH);

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const reSpan = reMax - reMin;
    const reStep = reSpan > 15 ? 10 : reSpan > 6 ? 2 : 1;
    for (let r = Math.ceil(reMin / reStep) * reStep; r <= reMax; r += reStep) {
      const px = toX(r);
      ctx.beginPath();
      ctx.moveTo(px, pad.top);
      ctx.lineTo(px, pad.top + plotH);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${r}`, px, pad.top + plotH + 6);
    }

    const imStep = imMax > 6 ? 5 : 1;
    for (let im = Math.ceil(imMin / imStep) * imStep; im <= imMax; im += imStep) {
      const py = toY(im);
      ctx.beginPath();
      ctx.moveTo(pad.left, py);
      ctx.lineTo(pad.left + plotW, py);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${im}j`, pad.left - 6, py);
    }

    // Real & Imaginary axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(pad.left, yZero);
    ctx.lineTo(pad.left + plotW, yZero);
    ctx.stroke();

    ctx.strokeStyle = scenario.poles.some((p) => Math.abs(p.re) < 1e-6 && Math.abs(p.im) > 1e-6)
      ? '#fb7185'
      : '#64748b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(xZero, pad.top);
    ctx.lineTo(xZero, pad.top + plotH);
    ctx.stroke();

    // Region tags
    ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(52, 211, 153, 0.85)';
    ctx.textAlign = 'left';
    ctx.fillText('LHP (Stable)', pad.left + 8, pad.top + 14);

    ctx.fillStyle = 'rgba(251, 113, 133, 0.9)';
    ctx.textAlign = 'right';
    ctx.fillText('RHP (Unstable)', pad.left + plotW - 6, pad.top + 14);

    // Draw Zeros (hollow circle) if inside visible bounds
    for (const z of scenario.zeros) {
      if (z.re < reMin || z.re > reMax) continue;
      const zx = toX(z.re);
      const zy = toY(z.im);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(zx, zy, 5.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw Poles (bold X)
    for (const p of scenario.poles) {
      const px = toX(p.re);
      const py = toY(p.im);
      const isRhp = p.re > 1e-6;
      const isImag = Math.abs(p.re) < 1e-6 && Math.abs(p.im) > 1e-6;
      const color = isRhp || isImag ? '#fb7185' : p.re === 0 ? '#38bdf8' : '#34d399';

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.6;
      ctx.shadowColor = color;
      ctx.shadowBlur = isRhp || isImag ? 8 : 4;
      const r = 6;
      ctx.beginPath();
      ctx.moveTo(px - r, py - r);
      ctx.lineTo(px + r, py + r);
      ctx.moveTo(px + r, py - r);
      ctx.lineTo(px - r, py + r);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = color;
      ctx.font = '600 10px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = p.re >= 0 ? 'left' : 'center';
      const labelY = p.im > 0 ? py - 12 : p.im < 0 ? py + 15 : py - 12;
      const labelX = p.re >= 0 ? px + 8 : px;
      ctx.fillText(p.label, labelX, labelY);
    }

    // Title & axis label
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 12px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('s-Plane Poles (Ã—) & Zeros (â—‹)', pad.left, 16);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Real Ïƒ = Re(s)', pad.left + plotW / 2, h - 10);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad.left, pad.top, plotW, plotH);
  }, [sSize, scenario]);

  // Draw Right Canvas: Time Response + Partial Fractions
  useEffect(() => {
    const canvas = tCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { w, h } = tSize;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const pad = { top: 28, right: 20, bottom: 38, left: 50 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const samples = 240;
    const tMax = scenario.tMax;
    const ts: number[] = [];
    const totals: number[] = [];
    const compSeries: number[][] = scenario.components.map(() => []);

    let yMin = -0.35;
    let yMax = 1.4;

    for (let i = 0; i <= samples; i++) {
      const t = (tMax * i) / samples;
      ts.push(t);
      let sum = 0;
      scenario.components.forEach((c, idx) => {
        const val = c.evalAt(t);
        compSeries[idx].push(val);
        sum += val;
        if (showComponents) {
          yMin = Math.min(yMin, val);
          yMax = Math.max(yMax, val);
        }
      });
      totals.push(sum);
      yMin = Math.min(yMin, sum);
      yMax = Math.max(yMax, sum);
    }

    const span = yMax - yMin;
    yMin -= span * 0.08;
    yMax += span * 0.1;

    const toX = (t: number) => pad.left + (t / tMax) * plotW;
    const toY = (y: number) => pad.top + ((yMax - y) / (yMax - yMin)) * plotH;

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const tSteps = 5;
    for (let i = 0; i <= tSteps; i++) {
      const t = (tMax * i) / tSteps;
      const px = toX(t);
      ctx.beginPath();
      ctx.moveTo(px, pad.top);
      ctx.lineTo(px, pad.top + plotH);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(tMax < 1 ? `${t.toFixed(2)}s` : `${t.toFixed(1)}s`, px, pad.top + plotH + 6);
    }

    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const yVal = yMin + ((yMax - yMin) * i) / yTicks;
      const py = toY(yVal);
      ctx.beginPath();
      ctx.moveTo(pad.left, py);
      ctx.lineTo(pad.left + plotW, py);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(yVal.toFixed(1), pad.left - 6, py);
    }

    // Zero horizontal line
    if (yMin <= 0 && yMax >= 0) {
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(pad.left, toY(0));
      ctx.lineTo(pad.left + plotW, toY(0));
      ctx.stroke();
    }

    // FVT prediction line
    const fvtY = toY(scenario.naiveFvtValue);
    if (fvtY >= pad.top && fvtY <= pad.top + plotH) {
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = scenario.fvtValid
        ? 'rgba(52, 211, 153, 0.75)'
        : 'rgba(251, 113, 133, 0.9)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(pad.left, fvtY);
      ctx.lineTo(pad.left + plotW, fvtY);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = scenario.fvtValid ? '#34d399' : '#fb7185';
      ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(
        scenario.fvtValid
          ? `FVT = ${scenario.naiveFvtValue.toFixed(2)}`
          : `Naive FVT = ${scenario.naiveFvtValue.toFixed(2)} (WRONG!)`,
        pad.left + plotW - 6,
        Math.max(pad.top + 14, fvtY - 10)
      );
    }

    // Individual partial fraction components (dashed)
    if (showComponents) {
      scenario.components.forEach((comp, idx) => {
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = comp.color;
        ctx.globalAlpha = 0.72;
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        for (let i = 0; i <= samples; i++) {
          const px = toX(ts[i]);
          const py = toY(compSeries[idx][i]);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
      });
    }

    // Total y(t) (solid luminous amber)
    ctx.save();
    ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let i = 0; i <= samples; i++) {
      const px = toX(ts[i]);
      const py = toY(totals[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // Hover breakdown tooltip showing partial fractions literally adding up!
    if (hoverT !== null && hoverT >= 0 && hoverT <= tMax) {
      const idx = Math.min(samples, Math.max(0, Math.round((hoverT / tMax) * samples)));
      const tVal = ts[idx];
      const hx = toX(tVal);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hx, pad.top);
      ctx.lineTo(hx, pad.top + plotH);
      ctx.stroke();

      if (showComponents) {
        scenario.components.forEach((c, cIdx) => {
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.arc(hx, toY(compSeries[cIdx][idx]), 3.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(hx, toY(totals[idx]), 4.5, 0, Math.PI * 2);
      ctx.fill();

      const lines = scenario.components.length + 2;
      const boxW = 190;
      const boxH = 14 + lines * 15;
      const boxX = hx + 12 + boxW > w - 10 ? hx - boxW - 12 : hx + 12;
      const boxY = pad.top + 8;

      ctx.fillStyle = 'rgba(15, 21, 34, 0.94)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = '600 10px ui-monospace, SFMono-Regular, monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`t = ${tVal.toFixed(2)} s`, boxX + 8, boxY + 14);
      scenario.components.forEach((c, cIdx) => {
        ctx.fillStyle = c.color;
        const val = compSeries[cIdx][idx];
        ctx.fillText(
          `${c.name.slice(0, 14)}: ${val >= 0 ? '+' : ''}${val.toFixed(3)}`,
          boxX + 8,
          boxY + 29 + cIdx * 15
        );
      });
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(
        `Sum y(t):   ${totals[idx].toFixed(3)}`,
        boxX + 8,
        boxY + 29 + scenario.components.length * 15
      );
    }

    // Header + axis title
    ctx.fillStyle = '#f59e0b';
    ctx.font = '600 12px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Total y(t) = Î£ Partial-Fraction Modes', pad.left, 16);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time t [seconds]', pad.left + plotW / 2, h - 10);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad.left, pad.top, plotW, plotH);
  }, [tSize, scenario, showComponents, hoverT]);

  const handleTMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padLeft = 50;
    const padRight = 20;
    const plotW = rect.width - padLeft - padRight;
    if (x < padLeft || x > padLeft + plotW) {
      setHoverT(null);
      return;
    }
    setHoverT(((x - padLeft) / plotW) * scenario.tMax);
  };

  const presetButtons: { id: PresetId; label: string; isTrap?: boolean }[] = [
    { id: 'ex22', label: 'Ex 2.2 (Non-zero IC)' },
    { id: 'e24', label: 'HW E2.4 (Laser Printer)' },
    { id: 'underdamped', label: 'Underdamped (E2.31 style)' },
    { id: 'fvt-imag', label: 'FVT Trap: Imaginary Poles', isTrap: true },
    { id: 'fvt-rhp', label: 'FVT Trap: RHP Unstable Pole', isTrap: true },
  ];

  return (
    <div className="space-y-5 text-[var(--ink)]">
      {/* Header + Live FVT Gate */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-[var(--rule)] pb-4">
        <div className="hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--plot-3)]">
            <FunctionIcon size={16} weight="duotone" />
            <span>Interactive Lab 3 Â· Ch 2.4 / Ex 2.2 Laplace &amp; FVT Gate</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--ink)] mt-1">
            Pole-Zero Map, Partial-Fraction Mode Addition &amp; FVT Traps
          </h3>
        </div>

        <div
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold self-start ${
            scenario.fvtValid
              ? 'bg-emerald-500/15 border-emerald-400/60 text-[var(--forest)]'
              : 'bg-rose-500/15 border-rose-400/70 text-rose-300 shadow-[0_0_15px_rgba(251,113,133,0.2)]'
          }`}
        >
          {scenario.fvtValid ? (
            <ShieldCheck size={18} weight="fill" className="text-[var(--forest)]" />
          ) : (
            <ShieldWarning size={18} weight="fill" className="text-rose-400" />
          )}
          <span>
            {scenario.fvtValid ? 'FVT GATE: VALID (All poles in open LHP)' : 'FVT GATE: INVALID â€” TRAP!'}
          </span>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)] mr-1 flex items-center gap-1">
          <Sparkle size={14} weight="fill" className="text-[var(--plot-2)]" />
          Presets:
        </span>
        {presetButtons.map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setPresetId(btn.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
              presetId === btn.id
                ? btn.isTrap
                  ? 'bg-rose-500/20 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(251,113,133,0.25)]'
                  : 'bg-sky-500/20 border-sky-400 text-[var(--plot-3)] shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                : 'bg-[var(--paper-muted)] border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Conditional Zeta slider + Component toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] px-4 py-3">
        {presetId === 'underdamped' ? (
          <div className="flex-1 max-w-md space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[var(--ink-soft)]">
                Damping Ratio <MathText text={"$\\zeta$"} /> (<MathText text={"$\\omega_n = 2$"} />)
              </span>
              <span className="font-mono text-[var(--plot-3)] font-semibold">
                Î¶ = {zeta.toFixed(2)}{' '}
                {zeta === 0
                  ? '(Undamped)'
                  : zeta < 1
                    ? '(Underdamped)'
                    : zeta === 1
                      ? '(Critically Damped)'
                      : '(Overdamped)'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1.5}
              step={0.05}
              value={zeta}
              onChange={(e) => setZeta(parseFloat(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        ) : (
          <div className="text-xs text-[var(--ink-soft)]">
            <span className="font-semibold text-[var(--ink)]">{scenario.title}:</span> Hover over the
            time plot to inspect how every partial-fraction mode sums to <MathText text="$y(t)$" />.
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowComponents((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer self-start sm:self-auto ${
            showComponents
              ? 'bg-sky-500/15 border-sky-400/60 text-[var(--plot-3)]'
              : 'bg-[var(--paper-muted)] border-[var(--rule-strong)] text-[var(--ink-faint)]'
          }`}
        >
          <Eye size={14} />
          {showComponents ? 'Showing Partial-Fraction Modes' : 'Show Partial-Fraction Modes'}
        </button>
      </div>

      {/* Dual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div
          ref={sBoxRef}
          className="lg:col-span-5 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] overflow-hidden"
        >
          <canvas
            ref={sCanvasRef}
            style={{ width: sSize.w, height: sSize.h }}
            className="block"
          />
        </div>

        <div
          ref={tBoxRef}
          className="lg:col-span-7 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] overflow-hidden"
        >
          <canvas
            ref={tCanvasRef}
            onMouseMove={handleTMove}
            onMouseLeave={() => setHoverT(null)}
            style={{ width: tSize.w, height: tSize.h }}
            className="block cursor-crosshair"
          />
        </div>
      </div>

      {/* Partial-Fraction Legend & Math Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4 space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-[var(--ink-faint)]">
            Laplace Domain â†’ Partial Fractions â†’ Time Modes
          </div>
          <MathBlock tex={scenario.yOfSLatex} className="text-[var(--plot-3)] text-xs sm:text-sm" />
          <MathBlock tex={scenario.partialFractionLatex} className="text-[var(--ink)] text-xs sm:text-sm" />
          <MathBlock tex={scenario.yOfTLatex} className="text-[var(--plot-2)] text-xs sm:text-sm" />
          <div className="flex flex-wrap gap-3 pt-1">
            {scenario.components.map((c) => (
              <span key={c.name} className="inline-flex items-center gap-1.5 text-xs text-[var(--ink-soft)]">
                <span
                  className="w-3 h-0.5 inline-block rounded"
                  style={{ backgroundColor: c.color }}
                />
                {c.name}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--plot-2)]">
              <span className="w-3 h-1 inline-block rounded bg-amber-400" />
              Total y(t)
            </span>
          </div>
        </div>

        <div
          className={`lg:col-span-5 rounded-xl border p-4 text-xs leading-relaxed space-y-2 ${
            scenario.fvtValid
              ? 'border-emerald-500/30 bg-emerald-500/5 text-[var(--ink)]'
              : 'border-rose-500/45 bg-rose-500/10 text-rose-100'
          }`}
        >
          <div className="font-semibold flex items-center gap-1.5">
            {scenario.fvtValid ? (
              <>
                <CheckCircle size={15} className="text-[var(--forest)]" />
                <span className="text-[var(--forest)]">FVT Check &amp; What to Notice</span>
              </>
            ) : (
              <>
                <Warning size={15} className="text-rose-400" />
                <span className="text-rose-300">FVT Trap Alert!</span>
              </>
            )}
          </div>
          <p className="text-[var(--ink-soft)]">{scenario.fvtReason}</p>
          <p>{scenario.insight}</p>
        </div>
      </div>
    </div>
  );
};
