import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowsCounterClockwise,
  CheckCircle,
  Cpu,
  GearSix,
  Lightning,
  Sparkle,
  Wind,
} from '@phosphor-icons/react';
import { MathBlock, MathText } from '../MathText';

type BlockKey = 'electrical' | 'torque' | 'disturbance' | 'mechanical' | 'integrator' | 'backemf';

interface BlockLawInfo {
  key: BlockKey;
  title: string;
  lawName: string;
  timeEq: string;
  laplaceEq: string;
  explanation: string;
}

const BLOCK_LAWS: Record<BlockKey, BlockLawInfo> = {
  electrical: {
    key: 'electrical',
    title: 'Field Winding Circuit',
    lawName: "Kirchhoff's Voltage Law (KVL)",
    timeEq: 'v_f(t) = L_f \\frac{di_f}{dt} + R_f i_f(t)',
    laplaceEq: '\\frac{I_f(s)}{V_f(s)} = \\frac{1}{L_f s + R_f}',
    explanation:
      'Electrical inductance L_f opposes sudden changes in current, creating an exponential lag with electrical time constant Ï„_e = L_f / R_f.',
  },
  torque: {
    key: 'torque',
    title: 'Electromechanical Coupling',
    lawName: 'Lorentz Force / Motor Torque Law',
    timeEq: 'T_m(t) = K_m \\, i_f(t)',
    laplaceEq: '\\frac{T_m(s)}{I_f(s)} = K_m',
    explanation:
      'In a field-controlled DC motor (constant armature current), developed electromagnetic torque is directly proportional to field current i_f(t).',
  },
  disturbance: {
    key: 'disturbance',
    title: 'Shaft Load Junction',
    lawName: 'Torque Balance',
    timeEq: 'T_{\\text{net}}(t) = T_m(t) - T_d(t)',
    laplaceEq: 'T_{\\text{net}}(s) = T_m(s) - T_d(s)',
    explanation:
      'External mechanical load torque T_d opposes the motor torque. Without feedback from shaft speed, field control cannot compensate for T_d!',
  },
  mechanical: {
    key: 'mechanical',
    title: 'Rotor Mechanics',
    lawName: "Newton-Euler Rotational Law",
    timeEq: 'J \\frac{d\\omega}{dt} + b\\,\\omega(t) = T_m(t) - T_d(t)',
    laplaceEq: '\\frac{\\Omega(s)}{T_{\\text{net}}(s)} = \\frac{1}{J s + b}',
    explanation:
      'Rotor inertia J resists acceleration while viscous bearing friction b dissipates energy, giving mechanical time constant Ï„_m = J / b.',
  },
  integrator: {
    key: 'integrator',
    title: 'Angular Kinematics',
    lawName: 'Free Integrator (Velocity â†’ Angle)',
    timeEq: '\\theta(t) = \\int_0^t \\omega(\\tau)\\,d\\tau',
    laplaceEq: '\\frac{\\Theta(s)}{\\Omega(s)} = \\frac{1}{s}',
    explanation:
      'Because Î¸ is the integral of Ï‰, a constant steady speed Ï‰_ss causes angular position Î¸(t) to RAMP linearly forever (a Type-1 pole at s = 0!).',
  },
  backemf: {
    key: 'backemf',
    title: 'Back-EMF Internal Feedback',
    lawName: "Faraday's Law (Armature Control)",
    timeEq: 'e_b(t) = K_b\\,\\omega(t), \\quad L_a \\frac{di_a}{dt} + R_a i_a = v_a - e_b',
    laplaceEq: '\\frac{\\Omega(s)}{V_a(s)} = \\frac{K_m}{(L_a s + R_a)(Js + b) + K_m K_b}',
    explanation:
      'Unlike field control, armature control creates an automatic internal negative-feedback loop via back-EMF K_bÂ·Ï‰â€”speeding up response and rejecting load disturbances!',
  },
};

interface Preset {
  id: string;
  label: string;
  rf: number;
  lf: number;
  km: number;
  j: number;
  b: number;
  tdEnabled: boolean;
  compareArmature: boolean;
  insight: string;
}

const PRESETS: Preset[] = [
  {
    id: 'ex25',
    label: 'Nominal Ex 2.5 Cascade',
    rf: 4.0,
    lf: 0.5,
    km: 2.0,
    j: 0.2,
    b: 0.25,
    tdEnabled: false,
    compareArmature: false,
    insight:
      'Pure cascade! Field current i_f(t) settles quickly to V_f/R_f = 0.25 A, driving Ï‰(t) to steady speed K_m/(R_fÂ·b) = 2.0 rad/s, which makes Î¸(t) ramp upward linearly because of the 1/s integrator.',
  },
  {
    id: 'load',
    label: 'Heavy Load Gust (T_d at t=3s)',
    rf: 4.0,
    lf: 0.5,
    km: 2.0,
    j: 0.2,
    b: 0.25,
    tdEnabled: true,
    compareArmature: false,
    insight:
      'At t = 3.0 s a load torque T_d = 0.25 NÂ·m hits the shaft. Notice i_f(t) doesnâ€™t flinch at allâ€”there is NO feedback from Ï‰ back to the field circuit, so Ï‰(t) sags by T_d/b = 1.0 rad/s!',
  },
  {
    id: 'armature',
    label: 'Armature Back-EMF Rescue',
    rf: 2.5,
    lf: 0.4,
    km: 2.2,
    j: 0.25,
    b: 0.1,
    tdEnabled: true,
    compareArmature: true,
    insight:
      'With low friction (b = 0.10), pure field control coasts to a huge speed and suffers a massive 2.5 rad/s droop under T_d. Armature Back-EMF acts as an invisible feedback loopâ€”faster settling and far smaller droop!',
  },
];

const T_END = 8.0;
const VF_STEP = 1.0;
const TD_TIME = 3.0;
const TD_MAG = 0.25;

interface SimResult {
  times: number[];
  ifField: number[];
  omegaField: number[];
  thetaField: number[];
  omegaArm: number[];
  thetaArm: number[];
  tauElec: number;
  tauMech: number;
  omegaSsField: number;
  omegaSsArm: number;
}

function simulateMotor(
  rf: number,
  lf: number,
  km: number,
  j: number,
  b: number,
  tdEnabled: boolean
): SimResult {
  const dt = 0.005;
  const steps = Math.round(T_END / dt);

  const times: number[] = [];
  const ifField: number[] = [];
  const omegaField: number[] = [];
  const thetaField: number[] = [];
  const omegaArm: number[] = [];
  const thetaArm: number[] = [];

  // Field-control states: [i_f, omega, theta]
  let iF = 0;
  let wF = 0;
  let thF = 0;

  // Armature-control states (Kb = Km in SI): [i_a, omega, theta]
  let iA = 0;
  let wA = 0;
  let thA = 0;

  const kb = km;

  for (let idx = 0; idx <= steps; idx++) {
    const t = idx * dt;
    if (idx % 2 === 0) {
      times.push(t);
      ifField.push(iF);
      omegaField.push(wF);
      thetaField.push(thF);
      omegaArm.push(wA);
      thetaArm.push(thA);
    }

    const tdAt = (timeEval: number) => (tdEnabled && timeEval >= TD_TIME ? TD_MAG : 0);

    // RK4 Field Control
    const fField = (s: [number, number, number], timeEval: number): [number, number, number] => {
      const [ci, cw] = s;
      const td = tdAt(timeEval);
      const di = (VF_STEP - rf * ci) / lf;
      const dw = (km * ci - b * cw - td) / j;
      const dth = cw;
      return [di, dw, dth];
    };

    const k1 = fField([iF, wF, thF], t);
    const k2 = fField(
      [iF + 0.5 * dt * k1[0], wF + 0.5 * dt * k1[1], thF + 0.5 * dt * k1[2]],
      t + 0.5 * dt
    );
    const k3 = fField(
      [iF + 0.5 * dt * k2[0], wF + 0.5 * dt * k2[1], thF + 0.5 * dt * k2[2]],
      t + 0.5 * dt
    );
    const k4 = fField([iF + dt * k3[0], wF + dt * k3[1], thF + dt * k3[2]], t + dt);

    iF += (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    wF += (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    thF += (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);

    // RK4 Armature Control
    const fArm = (s: [number, number, number], timeEval: number): [number, number, number] => {
      const [ci, cw] = s;
      const td = tdAt(timeEval);
      const di = (VF_STEP - rf * ci - kb * cw) / lf;
      const dw = (km * ci - b * cw - td) / j;
      const dth = cw;
      return [di, dw, dth];
    };

    const a1 = fArm([iA, wA, thA], t);
    const a2 = fArm(
      [iA + 0.5 * dt * a1[0], wA + 0.5 * dt * a1[1], thA + 0.5 * dt * a1[2]],
      t + 0.5 * dt
    );
    const a3 = fArm(
      [iA + 0.5 * dt * a2[0], wA + 0.5 * dt * a2[1], thA + 0.5 * dt * a2[2]],
      t + 0.5 * dt
    );
    const a4 = fArm([iA + dt * a3[0], wA + dt * a3[1], thA + dt * a3[2]], t + dt);

    iA += (dt / 6) * (a1[0] + 2 * a2[0] + 2 * a3[0] + a4[0]);
    wA += (dt / 6) * (a1[1] + 2 * a2[1] + 2 * a3[1] + a4[1]);
    thA += (dt / 6) * (a1[2] + 2 * a2[2] + 2 * a3[2] + a4[2]);
  }

  const tdSteady = tdEnabled ? TD_MAG : 0;
  const omegaSsField = (km * (VF_STEP / rf) - tdSteady) / b;
  const omegaSsArm = (km * VF_STEP - rf * tdSteady) / (rf * b + km * kb);

  return {
    times,
    ifField,
    omegaField,
    thetaField,
    omegaArm,
    thetaArm,
    tauElec: lf / rf,
    tauMech: j / b,
    omegaSsField,
    omegaSsArm,
  };
}

export const MotorPhysicsLab: React.FC = () => {
  const [rf, setRf] = useState<number>(4.0);
  const [lf, setLf] = useState<number>(0.5);
  const [km, setKm] = useState<number>(2.0);
  const [j, setJ] = useState<number>(0.2);
  const [b, setB] = useState<number>(0.25);
  const [tdEnabled, setTdEnabled] = useState<boolean>(false);
  const [compareArmature, setCompareArmature] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<BlockKey>('electrical');
  const [activePresetId, setActivePresetId] = useState<string>('ex25');
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number }>({ w: 720, h: 330 });

  const sim = useMemo(() => simulateMotor(rf, lf, km, j, b, tdEnabled), [rf, lf, km, j, b, tdEnabled]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = Math.max(300, Math.floor(e.contentRect.width));
        setCanvasSize({ w, h: w < 520 ? 290 : 340 });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { w, h } = canvasSize;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const pad = { top: 34, right: 60, bottom: 42, left: 56 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    // Left axis bounds: i_f(t) and omega(t)
    let leftMin = 0;
    let leftMax = 1.2;
    for (let i = 0; i < sim.times.length; i++) {
      leftMin = Math.min(leftMin, sim.ifField[i], sim.omegaField[i]);
      leftMax = Math.max(leftMax, sim.ifField[i], sim.omegaField[i]);
      if (compareArmature) {
        leftMin = Math.min(leftMin, sim.omegaArm[i]);
        leftMax = Math.max(leftMax, sim.omegaArm[i]);
      }
    }
    const leftSpan = Math.max(0.5, leftMax - leftMin);
    leftMin = leftMin < 0 ? leftMin - leftSpan * 0.12 : 0;
    leftMax = leftMax + leftSpan * 0.14;

    // Right axis bounds: theta(t)
    let rightMin = 0;
    let rightMax = 1.0;
    for (let i = 0; i < sim.times.length; i++) {
      rightMin = Math.min(rightMin, sim.thetaField[i]);
      rightMax = Math.max(rightMax, sim.thetaField[i]);
    }
    const rightSpan = Math.max(0.5, rightMax - rightMin);
    rightMin = rightMin < 0 ? rightMin - rightSpan * 0.1 : 0;
    rightMax = rightMax + rightSpan * 0.12;

    const toX = (t: number) => pad.left + (t / T_END) * plotW;
    const toYLeft = (val: number) => pad.top + ((leftMax - val) / (leftMax - leftMin)) * plotH;
    const toYRight = (val: number) => pad.top + ((rightMax - val) / (rightMax - rightMin)) * plotH;

    // Grid & ticks
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let t = 0; t <= 8; t += 1) {
      const px = toX(t);
      ctx.beginPath();
      ctx.moveTo(px, pad.top);
      ctx.lineTo(px, pad.top + plotH);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${t}s`, px, pad.top + plotH + 7);
    }

    const yTickCount = 4;
    for (let k = 0; k <= yTickCount; k++) {
      const ratio = k / yTickCount;
      const py = pad.top + plotH - ratio * plotH;
      ctx.beginPath();
      ctx.moveTo(pad.left, py);
      ctx.lineTo(pad.left + plotW, py);
      ctx.stroke();

      const lVal = leftMin + ratio * (leftMax - leftMin);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(lVal.toFixed(1), pad.left - 8, py);

      const rVal = rightMin + ratio * (rightMax - rightMin);
      ctx.fillStyle = '#34d399';
      ctx.textAlign = 'left';
      ctx.fillText(rVal.toFixed(1), pad.left + plotW + 8, py);
    }

    // Axis titles
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time t [seconds]', pad.left + plotW / 2, h - 13);

    ctx.save();
    ctx.translate(15, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('i_f [A] & Ï‰ [rad/s]', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(w - 14, pad.top + plotH / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#34d399';
    ctx.fillText('Angle Î¸ [rad]', 0, 0);
    ctx.restore();

    // Load disturbance marker at t = 3.0s
    if (tdEnabled) {
      const dx = toX(TD_TIME);
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(251, 113, 133, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(dx, pad.top);
      ctx.lineTo(dx, pad.top + plotH);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#fb7185';
      ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Load T_d = ${TD_MAG} NÂ·m`, dx + 6, pad.top + 13);
    }

    // Clip curves cleanly inside plot box
    ctx.save();
    ctx.beginPath();
    ctx.rect(pad.left, pad.top, plotW, plotH);
    ctx.clip();

    // 1. Angle theta(t) on RIGHT axis (Emerald)
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    for (let i = 0; i < sim.times.length; i++) {
      const px = toX(sim.times[i]);
      const py = toYRight(sim.thetaField[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 2. Field current i_f(t) on LEFT axis (Sky Cyan)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.1;
    ctx.beginPath();
    for (let i = 0; i < sim.times.length; i++) {
      const px = toX(sim.times[i]);
      const py = toYLeft(sim.ifField[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 3. Optional Armature Back-EMF omega(t) comparison (dashed Rose/Pink)
    if (compareArmature) {
      ctx.save();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i < sim.times.length; i++) {
        const px = toX(sim.times[i]);
        const py = toYLeft(sim.omegaArm[i]);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 4. Field-control angular velocity omega(t) on LEFT axis (Luminous Amber)
    ctx.save();
    ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
    ctx.shadowBlur = 9;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let i = 0; i < sim.times.length; i++) {
      const px = toX(sim.times[i]);
      const py = toYLeft(sim.omegaField[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // unclip

    // Top Legend inside header area (wraps cleanly on narrow canvases)
    ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'left';
    let lx = pad.left;
    let ly = 15;

    const legendItems: { label: string; color: string }[] = [
      { label: 'â€” i_f(t) [A]', color: '#38bdf8' },
      { label: 'â€” Ï‰(t) [rad/s]', color: '#f59e0b' },
      { label: 'â€” Î¸(t) [rad, right]', color: '#34d399' },
    ];
    if (compareArmature) {
      legendItems.push({ label: '-- Ï‰_arm(t)', color: '#fb7185' });
    }
    for (const item of legendItems) {
      const itemW = ctx.measureText(item.label).width;
      if (lx + itemW > w - pad.right && lx > pad.left) {
        lx = pad.left;
        ly += 14;
      }
      ctx.fillStyle = item.color;
      ctx.fillText(item.label, lx, ly);
      lx += itemW + 12;
    }

    // Hover crosshair
    if (hoverTime !== null && hoverTime >= 0 && hoverTime <= T_END) {
      const idx = Math.min(
        sim.times.length - 1,
        Math.max(0, Math.round((hoverTime / T_END) * (sim.times.length - 1)))
      );
      const tVal = sim.times[idx];
      const hx = toX(tVal);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hx, pad.top);
      ctx.lineTo(hx, pad.top + plotH);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(hx, toYLeft(sim.ifField[idx]), 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(hx, toYLeft(sim.omegaField[idx]), 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(hx, toYRight(sim.thetaField[idx]), 4, 0, Math.PI * 2);
      ctx.fill();

      const boxW = 166;
      const boxH = compareArmature ? 84 : 68;
      const boxX = hx + 12 + boxW > w - pad.right ? hx - boxW - 12 : hx + 12;
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
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`i_f(t): ${sim.ifField[idx].toFixed(3)} A`, boxX + 8, boxY + 30);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`Ï‰(t):   ${sim.omegaField[idx].toFixed(3)} rad/s`, boxX + 8, boxY + 45);
      ctx.fillStyle = '#34d399';
      ctx.fillText(`Î¸(t):   ${sim.thetaField[idx].toFixed(2)} rad`, boxX + 8, boxY + 60);
      if (compareArmature) {
        ctx.fillStyle = '#fb7185';
        ctx.fillText(`Ï‰_arm:  ${sim.omegaArm[idx].toFixed(3)} rad/s`, boxX + 8, boxY + 75);
      }
    }

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad.left, pad.top, plotW, plotH);
  }, [canvasSize, sim, tdEnabled, compareArmature, hoverTime]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padLeft = 56;
    const padRight = 60;
    const plotW = rect.width - padLeft - padRight;
    if (x < padLeft || x > padLeft + plotW) {
      setHoverTime(null);
      return;
    }
    setHoverTime(((x - padLeft) / plotW) * T_END);
  };

  const applyPreset = (p: Preset) => {
    setRf(p.rf);
    setLf(p.lf);
    setKm(p.km);
    setJ(p.j);
    setB(p.b);
    setTdEnabled(p.tdEnabled);
    setCompareArmature(p.compareArmature);
    setActivePresetId(p.id);
    if (p.compareArmature) setSelectedBlock('backemf');
  };

  const activeLaw = BLOCK_LAWS[selectedBlock];
  const activePreset = PRESETS.find((p) => p.id === activePresetId);
  const dynamicInsight = activePreset
    ? activePreset.insight
    : compareArmature
      ? `Back-EMF feedback drops steady-state speed from ${sim.omegaSsField.toFixed(2)} to ${sim.omegaSsArm.toFixed(2)} rad/s while dramatically stiffening the motor against load torque T_d!`
      : `Electrical lag Ï„_e = ${sim.tauElec.toFixed(2)} s, Mechanical lag Ï„_m = ${sim.tauMech.toFixed(2)} s. Click any block in the cascade above to inspect its physical differential equation!`;

  const blockClass = (key: BlockKey) =>
    selectedBlock === key
      ? 'stroke-sky-400 fill-[#162238]'
      : 'stroke-slate-700 fill-[#090d16] hover:stroke-slate-500';

  return (
    <div className="space-y-5 text-[var(--ink)]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-[var(--rule)] pb-4">
        <div className="hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--plot-3)]">
            <GearSix size={16} weight="duotone" />
            <span>Interactive Lab 4 Â· Ch 2.5 / Ex 2.5 DC Motor Cascade</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--ink)] mt-1">
            Field-Controlled DC Motor Physics &amp; Back-EMF Comparison
          </h3>
        </div>
        <div className="rounded-lg bg-[var(--paper-muted)] border border-[var(--rule)] px-3 py-1.5 text-xs text-[var(--ink-soft)] self-start">
          <MathText text={`$\\frac{\\Theta(s)}{V_f(s)} = \\frac{K_m}{s(L_f s + R_f)(J s + b)}$`} />
        </div>
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

      {/* Interactive SVG Cascade Diagram */}
      <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
        <div className="flex items-center justify-between text-[11px] text-[var(--ink-faint)] mb-2 px-1">
          <span className="flex items-center gap-1.5">
            <Cpu size={14} className="text-[var(--plot-3)]" />
            Click any block below to reveal its exact physical law
          </span>
          <span className="text-[var(--ink-faint)]">Step Input V_f(t) = 1.0 V</span>
        </div>

        <svg
          viewBox="0 0 920 205"
          className="w-full h-auto select-none"
          role="img"
          aria-label="DC Motor Interactive Cascade Block Diagram"
        >
          <defs>
            <marker
              id="motor-arrow-cyan"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
            <marker
              id="motor-arrow-slate"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
            </marker>
            <marker
              id="motor-arrow-rose"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#fb7185" />
            </marker>
          </defs>

          {/* Input Label */}
          <text
            x="24"
            y="80"
            fill="#38bdf8"
            fontSize="13"
            fontWeight="700"
            textAnchor="middle"
          >
            V_f(s)
          </text>

          {/* Line from V_f to Summing Junction 1 or Block 1 */}
          {compareArmature ? (
            <>
              <line
                x1="46"
                y1="76"
                x2="60"
                y2="76"
                stroke="#38bdf8"
                strokeWidth="2"
                markerEnd="url(#motor-arrow-cyan)"
              />
              <circle
                cx="76"
                cy="76"
                r="14"
                fill="#0f1522"
                stroke="#fb7185"
                strokeWidth="2"
              />
              <text x="67" y="79" fill="#38bdf8" fontSize="11" fontWeight="700" textAnchor="middle">
                +
              </text>
              <text x="76" y="86" fill="#fb7185" fontSize="12" fontWeight="700" textAnchor="middle">
                âˆ’
              </text>
              <line
                x1="90"
                y1="76"
                x2="108"
                y2="76"
                stroke="#94a3b8"
                strokeWidth="2"
                markerEnd="url(#motor-arrow-slate)"
              />
            </>
          ) : (
            <line
              x1="46"
              y1="76"
              x2="108"
              y2="76"
              stroke="#38bdf8"
              strokeWidth="2"
              markerEnd="url(#motor-arrow-cyan)"
            />
          )}

          {/* Block 1: Electrical */}
          <g
            onClick={() => setSelectedBlock('electrical')}
            className="cursor-pointer transition-all"
          >
            <rect
              x="112"
              y="46"
              width="136"
              height="60"
              rx="10"
              strokeWidth="2"
              className={blockClass('electrical')}
            />
            <text
              x="180"
              y="72"
              fill="#f8fafc"
              fontSize="13"
              fontWeight="700"
              textAnchor="middle"
            >
              1 / ({lf.toFixed(1)}s + {rf.toFixed(1)})
            </text>
            <text x="180" y="92" fill="#38bdf8" fontSize="10.5" textAnchor="middle">
              Field Winding (KVL)
            </text>
          </g>

          {/* Arrow 1->2 */}
          <line
            x1="248"
            y1="76"
            x2="300"
            y2="76"
            stroke="#94a3b8"
            strokeWidth="2"
            markerEnd="url(#motor-arrow-slate)"
          />
          <text x="275" y="65" fill="#38bdf8" fontSize="11.5" fontWeight="600" textAnchor="middle">
            I_f(s)
          </text>

          {/* Block 2: Torque constant K_m */}
          <g onClick={() => setSelectedBlock('torque')} className="cursor-pointer">
            <rect
              x="304"
              y="46"
              width="102"
              height="60"
              rx="10"
              strokeWidth="2"
              className={blockClass('torque')}
            />
            <text
              x="355"
              y="72"
              fill="#f8fafc"
              fontSize="14"
              fontWeight="700"
              textAnchor="middle"
            >
              K_m = {km.toFixed(1)}
            </text>
            <text x="355" y="92" fill="#94a3b8" fontSize="10.5" textAnchor="middle">
              Lorentz Torque
            </text>
          </g>

          {/* Arrow 2 -> Disturbance Junction */}
          <line
            x1="406"
            y1="76"
            x2="458"
            y2="76"
            stroke="#94a3b8"
            strokeWidth="2"
            markerEnd="url(#motor-arrow-slate)"
          />
          <text x="433" y="65" fill="#cbd5e1" fontSize="11.5" fontWeight="600" textAnchor="middle">
            T_m
          </text>

          {/* Disturbance Summing Junction */}
          <g onClick={() => setSelectedBlock('disturbance')} className="cursor-pointer">
            <circle
              cx="478"
              cy="76"
              r="16"
              strokeWidth="2"
              className={
                selectedBlock === 'disturbance'
                  ? 'stroke-sky-400 fill-[#162238]'
                  : tdEnabled
                    ? 'stroke-rose-400 fill-[#1f121d]'
                    : 'stroke-slate-700 fill-[#090d16]'
              }
            />
            <text x="468" y="80" fill="#cbd5e1" fontSize="12" fontWeight="700">
              +
            </text>
            <text x="475" y="69" fill="#fb7185" fontSize="12" fontWeight="700">
              âˆ’
            </text>
            <line
              x1="478"
              y1="26"
              x2="478"
              y2="56"
              stroke={tdEnabled ? '#fb7185' : '#475569'}
              strokeWidth="2"
              strokeDasharray={tdEnabled ? undefined : '3 3'}
              markerEnd="url(#motor-arrow-rose)"
            />
            <text
              x="478"
              y="18"
              fill={tdEnabled ? '#fb7185' : '#64748b'}
              fontSize="11"
              fontWeight="700"
              textAnchor="middle"
            >
              T_d(s) {tdEnabled ? '(ON)' : '(OFF)'}
            </text>
          </g>

          {/* Arrow Junction -> Block 3 */}
          <line
            x1="494"
            y1="76"
            x2="544"
            y2="76"
            stroke="#94a3b8"
            strokeWidth="2"
            markerEnd="url(#motor-arrow-slate)"
          />
          <text x="519" y="65" fill="#cbd5e1" fontSize="11" textAnchor="middle">
            T_net
          </text>

          {/* Block 3: Mechanical */}
          <g onClick={() => setSelectedBlock('mechanical')} className="cursor-pointer">
            <rect
              x="548"
              y="46"
              width="136"
              height="60"
              rx="10"
              strokeWidth="2"
              className={blockClass('mechanical')}
            />
            <text
              x="616"
              y="72"
              fill="#f8fafc"
              fontSize="13"
              fontWeight="700"
              textAnchor="middle"
            >
              1 / ({j.toFixed(2)}s + {b.toFixed(2)})
            </text>
            <text x="616" y="92" fill="#f59e0b" fontSize="10.5" textAnchor="middle">
              Inertia &amp; Friction
            </text>
          </g>

          {/* Arrow 3 -> Integrator */}
          <line
            x1="684"
            y1="76"
            x2="740"
            y2="76"
            stroke="#94a3b8"
            strokeWidth="2"
            markerEnd="url(#motor-arrow-slate)"
          />
          <text x="713" y="65" fill="#f59e0b" fontSize="11.5" fontWeight="700" textAnchor="middle">
            Î©(s)
          </text>

          {/* Block 4: Free Integrator */}
          <g onClick={() => setSelectedBlock('integrator')} className="cursor-pointer">
            <rect
              x="744"
              y="46"
              width="94"
              height="60"
              rx="10"
              strokeWidth="2"
              className={blockClass('integrator')}
            />
            <text
              x="791"
              y="72"
              fill="#f8fafc"
              fontSize="15"
              fontWeight="700"
              textAnchor="middle"
            >
              1 / s
            </text>
            <text x="791" y="92" fill="#34d399" fontSize="10.5" textAnchor="middle">
              Integrator
            </text>
          </g>

          {/* Output Arrow */}
          <line
            x1="838"
            y1="76"
            x2="880"
            y2="76"
            stroke="#94a3b8"
            strokeWidth="2"
            markerEnd="url(#motor-arrow-slate)"
          />
          <text x="899" y="80" fill="#34d399" fontSize="13" fontWeight="700" textAnchor="middle">
            Î˜(s)
          </text>

          {/* Back-EMF Feedback Path */}
          <g
            onClick={() => setSelectedBlock('backemf')}
            className="cursor-pointer"
            opacity={compareArmature ? 1 : 0.35}
          >
            <circle cx="713" cy="76" r="3.5" fill={compareArmature ? '#fb7185' : '#64748b'} />
            <polyline
              points="713,76 713,162 470,162"
              fill="none"
              stroke={compareArmature ? '#fb7185' : '#475569'}
              strokeWidth="2"
              strokeDasharray={compareArmature ? undefined : '5 4'}
              markerEnd="url(#motor-arrow-rose)"
            />
            <rect
              x="336"
              y="136"
              width="130"
              height="52"
              rx="10"
              strokeWidth="2"
              strokeDasharray={compareArmature ? undefined : '4 3'}
              className={
                selectedBlock === 'backemf'
                  ? 'stroke-rose-400 fill-[#241320]'
                  : 'stroke-rose-500/60 fill-[#090d16]'
              }
            />
            <text
              x="401"
              y="158"
              fill="#fda4af"
              fontSize="12.5"
              fontWeight="700"
              textAnchor="middle"
            >
              Back-EMF K_b = {km.toFixed(1)}
            </text>
            <text x="401" y="176" fill="#94a3b8" fontSize="10" textAnchor="middle">
              {compareArmature ? 'Armature Feedback ON' : 'Armature Mode Only'}
            </text>
            <polyline
              points="336,162 76,162 76,94"
              fill="none"
              stroke={compareArmature ? '#fb7185' : '#475569'}
              strokeWidth="2"
              strokeDasharray={compareArmature ? undefined : '5 4'}
              markerEnd={compareArmature ? 'url(#motor-arrow-rose)' : undefined}
            />
          </g>
        </svg>

        {/* Physical Law Inspector */}
        <div className="mt-3 rounded-lg border border-[var(--rule)] bg-[var(--paper-raised)] p-3.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-[var(--plot-3)] font-semibold">
              {activeLaw.lawName}
            </div>
            <div className="text-sm font-bold text-[var(--ink)]">{activeLaw.title}</div>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">{activeLaw.explanation}</p>
          </div>
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded-lg bg-[var(--paper-muted)] border border-[var(--rule)] px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-[var(--ink-faint)]">Time Domain</div>
              <MathBlock tex={activeLaw.timeEq} className="text-xs text-[var(--plot-2)]" />
            </div>
            <div className="rounded-lg bg-[var(--paper-muted)] border border-[var(--rule)] px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-[var(--ink-faint)]">Laplace Domain</div>
              <MathBlock tex={activeLaw.laplaceEq} className="text-xs text-[var(--plot-3)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Plot + Parameter Sliders */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 space-y-4">
          <div
            ref={containerRef}
            className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverTime(null)}
              style={{ width: canvasSize.w, height: canvasSize.h }}
              className="block cursor-crosshair"
            />
          </div>

          {/* Live Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
              <div className="text-[11px] uppercase tracking-wider text-[var(--ink-faint)]">
                Elec. Lag <MathText text={"$\\tau_e = L_f/R_f$"} />
              </div>
              <div className="text-lg font-mono font-bold text-[var(--plot-3)] mt-1">
                {sim.tauElec.toFixed(3)} s
              </div>
            </div>
            <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
              <div className="text-[11px] uppercase tracking-wider text-[var(--ink-faint)]">
                Mech. Lag <MathText text={"$\\tau_m = J/b$"} />
              </div>
              <div className="text-lg font-mono font-bold text-[var(--plot-2)] mt-1">
                {sim.tauMech.toFixed(3)} s
              </div>
            </div>
            <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
              <div className="text-[11px] uppercase tracking-wider text-[var(--ink-faint)]">
                Steady Speed <MathText text={"$\\omega_{ss}$"} />
              </div>
              <div className="text-lg font-mono font-bold text-[var(--plot-2)] mt-1">
                {sim.omegaSsField.toFixed(2)} rad/s
              </div>
            </div>
            <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-3">
              <div className="text-[11px] uppercase tracking-wider text-[var(--ink-faint)]">
                {compareArmature ? 'Armature Ï‰_ss' : 'Final Angle Î¸(8s)'}
              </div>
              <div
                className={`text-lg font-mono font-bold mt-1 ${
                  compareArmature ? 'text-rose-400' : 'text-[var(--forest)]'
                }`}
              >
                {compareArmature
                  ? `${sim.omegaSsArm.toFixed(2)} rad/s`
                  : `${sim.thetaField[sim.thetaField.length - 1].toFixed(1)} rad`}
              </div>
            </div>
          </div>
        </div>

        {/* Sliders & Toggles */}
        <div className="xl:col-span-4 space-y-4">
          <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4 space-y-3">
            {/* Rf */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-[var(--ink-soft)]">
                  Field Resistance <MathText text="$R_f$" />
                </span>
                <span className="font-mono text-[var(--plot-3)]">{rf.toFixed(1)} Î©</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={rf}
                onChange={(e) => {
                  setRf(parseFloat(e.target.value));
                  setActivePresetId('');
                }}
                className="w-full cursor-pointer"
              />
            </div>

            {/* Lf */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-[var(--ink-soft)]">
                  Field Inductance <MathText text="$L_f$" />
                </span>
                <span className="font-mono text-[var(--plot-3)]">{lf.toFixed(2)} H</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={2.0}
                step={0.05}
                value={lf}
                onChange={(e) => {
                  setLf(parseFloat(e.target.value));
                  setActivePresetId('');
                }}
                className="w-full cursor-pointer"
              />
            </div>

            {/* Km */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-[var(--ink-soft)]">
                  Torque Constant <MathText text="$K_m$" />
                </span>
                <span className="font-mono text-[var(--plot-2)]">{km.toFixed(1)} NÂ·m/A</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={5.0}
                step={0.1}
                value={km}
                onChange={(e) => {
                  setKm(parseFloat(e.target.value));
                  setActivePresetId('');
                }}
                className="w-full cursor-pointer"
              />
            </div>

            {/* J */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-[var(--ink-soft)]">
                  Rotor Inertia <MathText text="$J$" />
                </span>
                <span className="font-mono text-[var(--plot-2)]">{j.toFixed(2)} kgÂ·mÂ²</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={1.0}
                step={0.05}
                value={j}
                onChange={(e) => {
                  setJ(parseFloat(e.target.value));
                  setActivePresetId('');
                }}
                className="w-full cursor-pointer"
              />
            </div>

            {/* b */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-[var(--ink-soft)]">
                  Viscous Friction <MathText text="$b$" />
                </span>
                <span className="font-mono text-[var(--forest)]">{b.toFixed(2)} NÂ·mÂ·s</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={1.0}
                step={0.05}
                value={b}
                onChange={(e) => {
                  setB(parseFloat(e.target.value));
                  setActivePresetId('');
                }}
                className="w-full cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-[var(--rule)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--ink-soft)] flex items-center gap-1.5">
                  <Wind size={15} className="text-rose-400" />
                  Load Disturbance <MathText text="$T_d$" /> (<MathText text="$t=3$" />s)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTdEnabled((v) => !v);
                    setActivePresetId('');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                    tdEnabled
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                      : 'bg-[var(--paper-muted)] border-[var(--rule-strong)] text-[var(--ink-faint)]'
                  }`}
                >
                  {tdEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--ink-soft)] flex items-center gap-1.5">
                  <Lightning size={15} className="text-rose-400" />
                  Compare vs Armature Control
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCompareArmature((v) => {
                      const next = !v;
                      if (next) setSelectedBlock('backemf');
                      return next;
                    });
                    setActivePresetId('');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                    compareArmature
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                      : 'bg-[var(--paper-muted)] border-[var(--rule-strong)] text-[var(--ink-faint)]'
                  }`}
                >
                  {compareArmature ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => applyPreset(PRESETS[0])}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[var(--rule)] bg-[var(--paper-muted)] hover:bg-slate-800 text-xs font-medium text-[var(--ink-soft)] transition-colors cursor-pointer"
            >
              <ArrowsCounterClockwise size={14} />
              Reset to Ex 2.5 Defaults
            </button>
          </div>

          {/* What to Notice */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 text-xs leading-relaxed text-[var(--ink)]">
            <div className="font-semibold flex items-center gap-1.5 mb-1 text-[var(--forest)]">
              <CheckCircle size={15} className="text-[var(--forest)]" />
              What to Notice
            </div>
            <p>{dynamicInsight}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
