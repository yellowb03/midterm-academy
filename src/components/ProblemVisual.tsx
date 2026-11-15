import React from 'react';

interface ProblemVisualProps {
  problemId: string;
  problemTitle?: string;
}

interface PlotSeries {
  points: [number, number][];
  color: string;
  dashed?: boolean;
  label?: string;
  width?: number;
}

interface PlotMarker {
  x: number;
  y: number;
  color: string;
  label: string;
  labelDx?: number;
  labelDy?: number;
}

interface CurvePlotProps {
  title: string;
  subtitle?: string;
  xLabel: string;
  yLabel: string;
  xDomain: [number, number];
  yDomain: [number, number];
  xTicks: number[];
  yTicks: number[];
  series: PlotSeries[];
  markers?: PlotMarker[];
  hLine?: { y: number; color: string; label: string };
}

const CurvePlot: React.FC<CurvePlotProps> = ({
  title,
  subtitle,
  xLabel,
  yLabel,
  xDomain,
  yDomain,
  xTicks,
  yTicks,
  series,
  markers = [],
  hLine,
}) => {
  const W = 620;
  const H = 260;
  const padL = 62;
  const padR = 24;
  const padT = 26;
  const padB = 42;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const toX = (x: number) =>
    padL + ((x - xDomain[0]) / (xDomain[1] - xDomain[0])) * plotW;
  const toY = (y: number) =>
    padT + (1 - (y - yDomain[0]) / (yDomain[1] - yDomain[0])) * plotH;

  const clipPathId = `clip-${title.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--forest)]">
          {title}
        </div>
        {subtitle && <div className="text-xs text-[var(--ink-secondary)]">{subtitle}</div>}
      </div>

      <svg role="img" aria-label={`${title}${subtitle ? `. ${subtitle}` : ''}`} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
        <defs>
          <clipPath id={clipPathId}>
            <rect x={padL} y={padT} width={plotW} height={plotH} />
          </clipPath>
        </defs>

        {/* Grid lines */}
        {xTicks.map((tx) => {
          const px = toX(tx);
          return (
            <g key={`x-${tx}`}>
              <line
                x1={px}
                y1={padT}
                x2={px}
                y2={padT + plotH}
                stroke={tx === 0 ? 'var(--rule-strong)' : 'var(--rule)'}
                strokeWidth={tx === 0 ? 1.4 : 1}
              />
              <text
                x={px}
                y={padT + plotH + 16}
                textAnchor="middle"
                fill="var(--ink-secondary)"
                fontSize="11"
              >
                {Number.isInteger(tx) ? tx : tx.toFixed(1)}
              </text>
            </g>
          );
        })}

        {yTicks.map((ty) => {
          const py = toY(ty);
          return (
            <g key={`y-${ty}`}>
              <line
                x1={padL}
                y1={py}
                x2={padL + plotW}
                y2={py}
                stroke={ty === 0 ? 'var(--rule-strong)' : 'var(--rule)'}
                strokeWidth={ty === 0 ? 1.4 : 1}
              />
              <text
                x={padL - 8}
                y={py + 4}
                textAnchor="end"
                fill="var(--ink-secondary)"
                fontSize="11"
              >
                {Math.abs(ty) >= 1000
                  ? `${(ty / 1000).toFixed(1)}k`
                  : Number.isInteger(ty)
                    ? ty
                    : ty.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Plot border */}
        <rect
          x={padL}
          y={padT}
          width={plotW}
          height={plotH}
          fill="none"
          stroke="var(--rule)"
          strokeWidth="1.2"
        />

        {/* Horizontal reference line */}
        {hLine && (
          <g clipPath={`url(#${clipPathId})`}>
            <line
              x1={padL}
              y1={toY(hLine.y)}
              x2={padL + plotW}
              y2={toY(hLine.y)}
              stroke={hLine.color}
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          </g>
        )}
        {hLine && (
          <text
            x={padL + plotW - 6}
            y={Math.max(padT + 14, toY(hLine.y) - 6)}
            textAnchor="end"
            fill={hLine.color}
            fontSize="11"
            fontWeight="600"
          >
            {hLine.label}
          </text>
        )}

        {/* Curves */}
        <g clipPath={`url(#${clipPathId})`}>
          {series.map((s, idx) => {
            const pts = s.points
              .map(([x, y]) => `${toX(x).toFixed(1)},${toY(y).toFixed(1)}`)
              .join(' ');
            return (
              <polyline
                key={idx}
                points={pts}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width ?? 2.4}
                strokeDasharray={s.dashed ? '7 5' : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </g>

        {/* Operating point / key markers */}
        {markers.map((m, idx) => {
          const cx = toX(m.x);
          const cy = toY(m.y);
          return (
            <g key={idx}>
              <circle cx={cx} cy={cy} r="5.5" fill={m.color} stroke="var(--surface)" strokeWidth="2" />
              <text
                x={cx + (m.labelDx ?? 10)}
                y={cy + (m.labelDy ?? -10)}
                fill={m.color}
                fontSize="11.5"
                fontWeight="700"
              >
                {m.label}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text
          x={padL + plotW / 2}
          y={H - 6}
          textAnchor="middle"
          fill="var(--ink-secondary)"
          fontSize="11.5"
          fontWeight="600"
        >
          {xLabel}
        </text>
        <text
          x={16}
          y={padT + plotH / 2}
          textAnchor="middle"
          fill="var(--ink-secondary)"
          fontSize="11.5"
          fontWeight="600"
          transform={`rotate(-90 16 ${padT + plotH / 2})`}
        >
          {yLabel}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--ink-secondary)] pt-1">
        {series
          .filter((s) => s.label)
          .map((s, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block w-4 h-0.5"
                style={{
                  backgroundColor: s.dashed ? 'transparent' : s.color,
                  borderTop: s.dashed ? `2px dashed ${s.color}` : undefined,
                }}
              />
              {s.label}
            </span>
          ))}
      </div>
    </div>
  );
};

function sample(
  fn: (x: number) => number,
  x0: number,
  x1: number,
  n = 120
): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    out.push([x, fn(x)]);
  }
  return out;
}

const ArrowDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <marker
      id={`${id}-cyan`}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--plot-1)" />
    </marker>
    <marker
      id={`${id}-amber`}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--plot-3)" />
    </marker>
    <marker
      id={`${id}-emerald`}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--plot-2)" />
    </marker>
    <marker
      id={`${id}-rose`}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--error-ink)" />
    </marker>
  </defs>
);

export const ProblemVisual: React.FC<ProblemVisualProps> = ({ problemId, problemTitle }) => {
  switch (problemId) {
    // ================= LINEARIZATION PLOTS =================
    case 'E2.2': {
      const rExact = (t: number) => 10000 * Math.exp(-0.1 * t);
      const r0 = rExact(20); // 1353.35
      const m = -0.1 * r0; // -135.335
      const rLin = (t: number) => r0 + m * (t - 20);
      return (
        <CurvePlot
          title="Visual Intuition Â· Thermistor Curve & Tangent at 20 Â°C"
          subtitle="Zooming in near Tâ‚€ = 20 Â°C replaces the exponential with a straight line"
          xLabel="Temperature T (Â°C)"
          yLabel="Resistance R (Î©)"
          xDomain={[0, 40]}
          yDomain={[0, 10000]}
          xTicks={[0, 10, 20, 30, 40]}
          yTicks={[0, 2000, 4000, 6000, 8000, 10000]}
          series={[
            {
              points: sample(rExact, 0, 40),
              color: 'var(--plot-1)',
              label: 'Nonlinear R(T) = 10,000 e^(-0.1T)',
            },
            {
              points: sample(rLin, 5, 32),
              color: 'var(--plot-3)',
              dashed: true,
              label: 'Tangent Approximation Î”R â‰ˆ âˆ’135.3 Î”T',
            },
          ]}
          markers={[
            {
              x: 20,
              y: r0,
              color: 'var(--plot-3)',
              label: '(20 Â°C, 1353 Î©)',
              labelDx: 10,
              labelDy: -12,
            },
          ]}
        />
      );
    }

    case 'E2.3': {
      // Smooth spring curve matching Dorf Fig E2.3: steep in compression (y < 0), flattening near y = 2 cm
      const fCurve = (y: number) => {
        if (y < 0.5) return 0.72 + 1.12 * (y - 0.5) - 0.55 * (y - 0.5) ** 2;
        return 0.72 + 1.12 * (y - 0.5) - 0.36 * (y - 0.5) ** 2;
      };
      const f0 = fCurve(0.5);
      const fTan = (y: number) => f0 + 1.12 * (y - 0.5);
      return (
        <CurvePlot
          title="Visual Intuition Â· Nonlinear Spring Curve & Local Tangent at yâ‚€ = 0.5 cm"
          subtitle="Stiffens in compression (y < 0), softens toward break point (y > 1.5 cm)"
          xLabel="Displacement y (cm)"
          yLabel="Spring Force F (divisions)"
          xDomain={[-1.2, 2.2]}
          yDomain={[-2.5, 2.5]}
          xTicks={[-1.0, -0.5, 0, 0.5, 1.0, 1.5, 2.0]}
          yTicks={[-2, -1, 0, 1, 2]}
          series={[
            {
              points: sample(fCurve, -1.1, 2.1),
              color: 'var(--plot-1)',
              label: 'Measured Spring F(y)',
            },
            {
              points: sample(fTan, -0.6, 1.8),
              color: 'var(--plot-3)',
              dashed: true,
              label: 'Local Tangent k_s â‰ˆ 1.12 div/cm',
            },
          ]}
          markers={[
            {
              x: 0.5,
              y: f0,
              color: 'var(--plot-2)',
              label: 'Operating point yâ‚€ = 0.5 cm',
              labelDx: -145,
              labelDy: -14,
            },
          ]}
        />
      );
    }

    case 'P2.4': {
      const fAmp = (v: number) => (v >= 0 ? v * v : -v * v);
      const fTanB = (v: number) => 2 * v - 1;
      return (
        <CurvePlot
          title="Visual Intuition Â· Piecewise Nonlinear Amplifier v_o = v_in |v_in|"
          subtitle="Case (a) at vâ‚€ = 0 has zero slope; Case (b) at vâ‚€ = 1 V has slope 2 V/V"
          xLabel="Input Voltage v_in (V)"
          yLabel="Output Voltage v_o (V)"
          xDomain={[-1.5, 1.8]}
          yDomain={[-2.5, 3.2]}
          xTicks={[-1.5, -1, -0.5, 0, 0.5, 1, 1.5]}
          yTicks={[-2, -1, 0, 1, 2, 3]}
          series={[
            {
              points: sample(fAmp, -1.5, 1.75),
              color: 'var(--plot-1)',
              label: 'Exact Amplifier v_o = Â±v_inÂ²',
            },
            {
              points: [
                [-0.5, 0],
                [0.5, 0],
              ],
              color: 'var(--error-ink)',
              dashed: true,
              label: '(a) Tangent at 0 V: v_o â‰ˆ 0',
            },
            {
              points: sample(fTanB, 0.4, 1.6, 20),
              color: 'var(--plot-3)',
              dashed: true,
              label: '(b) Tangent at 1 V: v_o â‰ˆ 2v_in âˆ’ 1',
            },
          ]}
          markers={[
            { x: 0, y: 0, color: 'var(--error-ink)', label: '(0, 0) m=0', labelDx: 8, labelDy: 16 },
            { x: 1, y: 1, color: 'var(--plot-3)', label: '(1, 1) m=2', labelDx: -68, labelDy: -12 },
          ]}
        />
      );
    }

    case 'Ex2.1': {
      const sinCurve = (deg: number) => Math.sin((deg * Math.PI) / 180);
      const tan0 = (deg: number) => (deg * Math.PI) / 180;
      const tan30 = (deg: number) =>
        0.5 + Math.cos(Math.PI / 6) * (((deg - 30) * Math.PI) / 180);
      return (
        <CurvePlot
          title="Visual Intuition Â· Pendulum Torque T(Î¸)/(MgL) = sin(Î¸)"
          subtitle="Small-angle Î¸â‚€ = 0Â° gives slope 1; shifted Î¸â‚€ = 30Â° gives Tâ‚€ = 0.5 MgL and slope 0.866"
          xLabel="Angle Î¸ (degrees)"
          yLabel="Normalized Torque T / (MgL)"
          xDomain={[0, 120]}
          yDomain={[0, 1.4]}
          xTicks={[0, 30, 60, 90, 120]}
          yTicks={[0, 0.5, 1.0]}
          series={[
            {
              points: sample(sinCurve, 0, 120),
              color: 'var(--plot-1)',
              label: 'Exact sin(Î¸)',
            },
            {
              points: sample(tan0, 0, 75, 20),
              color: 'var(--plot-2)',
              dashed: true,
              label: 'Tangent at 0Â°: T â‰ˆ MgLÂ·Î¸',
            },
            {
              points: sample(tan30, 5, 75, 20),
              color: 'var(--plot-3)',
              dashed: true,
              label: 'Tangent at 30Â°: 0.5 + 0.866 Î”Î¸',
            },
          ]}
          markers={[
            { x: 0, y: 0, color: 'var(--plot-2)', label: 'Î¸â‚€ = 0Â°', labelDx: 8, labelDy: -8 },
            { x: 30, y: 0.5, color: 'var(--plot-3)', label: 'Î¸â‚€ = 30Â° (0.5)', labelDx: 10, labelDy: 14 },
          ]}
        />
      );
    }

    // ================= LAPLACE & STEP RESPONSE PLOTS =================
    case 'E2.4': {
      const y = (t: number) => 1 - 1.2 * Math.exp(-10 * t) + 0.2 * Math.exp(-30 * t);
      return (
        <CurvePlot
          title="Step Response Plot Â· Laser Printer Position y(t)"
          subtitle="Poles at s = âˆ’10, âˆ’30 decay quickly; steady-state settles at DC gain G(0) = 1"
          xLabel="Time t (seconds)"
          yLabel="Position y(t)"
          xDomain={[0, 0.5]}
          yDomain={[0, 1.2]}
          xTicks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]}
          yTicks={[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2]}
          hLine={{ y: 1, color: 'var(--plot-2)', label: 'y_ss = G(0) = 1' }}
          series={[
            {
              points: sample(y, 0, 0.5),
              color: 'var(--plot-3)',
              label: 'y(t) = 1 âˆ’ 1.2e^(âˆ’10t) + 0.2e^(âˆ’30t)',
            },
          ]}
          markers={[{ x: 0, y: 0, color: 'var(--plot-1)', label: 'y(0) = 0', labelDx: 10, labelDy: -8 }]}
        />
      );
    }

    case 'E2.31': {
      const v = (t: number) => (250 / 11) * Math.exp(-4 * t) * Math.sin(22 * t);
      const envPos = (t: number) => (250 / 11) * Math.exp(-4 * t);
      const envNeg = (t: number) => -(250 / 11) * Math.exp(-4 * t);
      return (
        <CurvePlot
          title="Underdamped Mode Â· Poles s = âˆ’4 Â± j22"
          subtitle="Real part âˆ’4 sets the exponential decay envelope; imaginary part 22 sets oscillation frequency"
          xLabel="Time t (seconds)"
          yLabel="v(t)"
          xDomain={[0, 1.2]}
          yDomain={[-25, 25]}
          xTicks={[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2]}
          yTicks={[-20, -10, 0, 10, 20]}
          series={[
            {
              points: sample(envPos, 0, 1.2),
              color: 'var(--plot-1)',
              dashed: true,
              width: 1.5,
              label: 'Envelope Â±22.73 e^(âˆ’4t)',
            },
            {
              points: sample(envNeg, 0, 1.2),
              color: 'var(--plot-1)',
              dashed: true,
              width: 1.5,
            },
            {
              points: sample(v, 0, 1.2, 260),
              color: 'var(--plot-3)',
              label: 'v(t) = (250/11) e^(âˆ’4t) sin(22t)',
            },
          ]}
        />
      );
    }

    case 'E2.19': {
      const y = (t: number) => 2 + 2.8 * Math.exp(-2 * t) - 4.8 * Math.exp(-7 * t);
      return (
        <CurvePlot
          title="Overdamped Step Response Â· Poles s = âˆ’2, âˆ’7"
          subtitle="Fast mode (âˆ’7) vanishes quickly; slow mode (âˆ’2) governs approach to y_ss = 2"
          xLabel="Time t (seconds)"
          yLabel="y(t)"
          xDomain={[0, 2.5]}
          yDomain={[0, 2.5]}
          xTicks={[0, 0.5, 1.0, 1.5, 2.0, 2.5]}
          yTicks={[0, 0.5, 1.0, 1.5, 2.0, 2.5]}
          hLine={{ y: 2, color: 'var(--plot-2)', label: 'y_ss = G(0) = 2.0' }}
          series={[
            {
              points: sample(y, 0, 2.5),
              color: 'var(--plot-3)',
              label: 'y(t) = 2.0 + 2.8e^(âˆ’2t) âˆ’ 4.8e^(âˆ’7t)',
            },
          ]}
          markers={[{ x: 0, y: 0, color: 'var(--plot-1)', label: 'y(0) = 0', labelDx: 10, labelDy: -8 }]}
        />
      );
    }

    case 'Ex2.2': {
      const y = (t: number) =>
        2 / 3 + 0.5 * Math.exp(-t) - (1 / 6) * Math.exp(-3 * t);
      return (
        <CurvePlot
          title="Non-Zero Initial Condition Response Â· y(0) = 1, yâ€²(0) = 0"
          subtitle="Starts at y(0) = 1 with flat slope, then settles to forced steady-state 2/3"
          xLabel="Time t (seconds)"
          yLabel="y(t)"
          xDomain={[0, 5]}
          yDomain={[0, 1.2]}
          xTicks={[0, 1, 2, 3, 4, 5]}
          yTicks={[0, 0.33, 0.67, 1.0]}
          hLine={{ y: 2 / 3, color: 'var(--plot-2)', label: 'Steady-State = 2/3' }}
          series={[
            {
              points: sample(y, 0, 5),
              color: 'var(--plot-3)',
              label: 'y(t) = 2/3 + 0.5e^(âˆ’t) âˆ’ (1/6)e^(âˆ’3t)',
            },
          ]}
          markers={[
            { x: 0, y: 1, color: 'var(--plot-1)', label: 'y(0) = 1, yâ€²(0) = 0', labelDx: 10, labelDy: -8 },
          ]}
        />
      );
    }

    case 'P2.12': {
      const y50 = (t: number) => 1 - Math.exp(-50 * t);
      const y25 = (t: number) => 0.5 * (1 - Math.exp(-50 * t));
      return (
        <div className="space-y-3">
          <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto">
            <svg role="img" aria-label={`${problemTitle ? `${problemTitle}. ` : ``}Figure for problem ${problemId}`} viewBox="0 0 560 90" className="w-full max-w-xl mx-auto h-auto">
              <ArrowDefs id="p212" />
              <text x="18" y="49" fill="var(--plot-1)" fontSize="13" fontWeight="600">R(s) = 1/s</text>
              <line x1="88" y1="45" x2="152" y2="45" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#p212-cyan)" />
              <rect x="156" y="24" width="84" height="42" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="1.6" />
              <text x="198" y="50" textAnchor="middle" fill="var(--ink)" fontSize="14" fontWeight="700">K</text>
              <line x1="240" y1="45" x2="296" y2="45" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#p212-cyan)" />
              <rect x="300" y="24" width="120" height="42" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.6" />
              <text x="360" y="50" textAnchor="middle" fill="var(--ink)" fontSize="14" fontWeight="600">1 / (s + 50)</text>
              <line x1="420" y1="45" x2="495" y2="45" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#p212-amber)" />
              <text x="505" y="49" fill="var(--plot-3)" fontSize="13" fontWeight="600">Y(s)</text>
            </svg>
          </div>
          <CurvePlot
            title="DC Gain Calibration Â· Effect of Controller Gain K"
            subtitle="Only K = 50 cancels the plant attenuation 1/50 so y_ss = 1"
            xLabel="Time t (seconds)"
            yLabel="y(t)"
            xDomain={[0, 0.12]}
            yDomain={[0, 1.2]}
            xTicks={[0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12]}
            yTicks={[0, 0.5, 1.0]}
            hLine={{ y: 1, color: 'var(--plot-2)', label: 'Target y_ss = 1' }}
            series={[
              { points: sample(y50, 0, 0.12), color: 'var(--plot-3)', label: 'K = 50 (Correct: y_ss = 1)' },
              { points: sample(y25, 0, 0.12), color: 'var(--ink-muted)', dashed: true, label: 'K = 25 (Too low: y_ss = 0.5)' },
            ]}
          />
        </div>
      );
    }

    // ================= PHYSICAL & BLOCK DIAGRAMS =================
    case 'E2.21': {
      return (
        <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--forest)]">
            Physical Diagram & Free-Body Force Map Â· Precision Slide
          </div>
          <svg role="img" aria-label={`${problemTitle ? `${problemTitle}. ` : ``}Figure for problem ${problemId}`} viewBox="0 0 680 215" className="w-full h-auto">
            <ArrowDefs id="e221" />
            {/* Left Schematic */}
            <line x1="40" y1="168" x2="420" y2="168" stroke="var(--rule-strong)" strokeWidth="2.5" />
            <rect x="40" y="168" width="380" height="12" fill="var(--rule)" />
            {/* Moving base x_in */}
            <line x1="60" y1="30" x2="60" y2="130" stroke="var(--plot-1)" strokeWidth="1.8" strokeDasharray="5 4" />
            <line x1="60" y1="42" x2="112" y2="42" stroke="var(--plot-1)" strokeWidth="2" markerEnd="url(#e221-cyan)" />
            <text x="120" y="46" fill="var(--plot-1)" fontSize="13" fontWeight="700">x_in(t)</text>
            <line x1="60" y1="108" x2="105" y2="108" stroke="var(--ink-secondary)" strokeWidth="2" />
            <line x1="105" y1="80" x2="105" y2="136" stroke="var(--ink-secondary)" strokeWidth="2" />
            {/* Damper b_d */}
            <line x1="105" y1="80" x2="152" y2="80" stroke="var(--plot-2)" strokeWidth="2" />
            <rect x="152" y="68" width="28" height="24" fill="none" stroke="var(--plot-2)" strokeWidth="2" />
            <line x1="166" y1="73" x2="166" y2="87" stroke="var(--plot-2)" strokeWidth="2.8" />
            <line x1="180" y1="80" x2="225" y2="80" stroke="var(--plot-2)" strokeWidth="2" />
            <text x="166" y="61" textAnchor="middle" fill="var(--plot-2)" fontSize="12" fontWeight="600">b_d = 0.65</text>
            {/* Spring k_d */}
            <polyline points="105,136 130,136 137,124 147,148 157,124 167,148 177,124 187,148 195,136 225,136" fill="none" stroke="var(--plot-1)" strokeWidth="2" />
            <text x="166" y="162" textAnchor="middle" fill="var(--plot-1)" fontSize="12" fontWeight="600">k_d = 1.8</text>
            <line x1="225" y1="80" x2="225" y2="136" stroke="var(--ink-secondary)" strokeWidth="2" />
            <line x1="225" y1="108" x2="255" y2="108" stroke="var(--ink-secondary)" strokeWidth="2" />
            {/* Carriage m_c */}
            <rect x="255" y="64" width="115" height="92" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="2" />
            <text x="312" y="106" textAnchor="middle" fill="var(--ink)" fontSize="14" fontWeight="700">Carriage</text>
            <text x="312" y="126" textAnchor="middle" fill="var(--caution-ink)" fontSize="13" fontWeight="600">m_c = 1</text>
            {/* Probe & x_p */}
            <rect x="330" y="52" width="40" height="12" rx="2" fill="var(--rule)" stroke="var(--ink-secondary)" />
            <text x="315" y="45" textAnchor="end" fill="var(--ink-secondary)" fontSize="11">Probe</text>
            <line x1="370" y1="30" x2="370" y2="62" stroke="var(--plot-3)" strokeWidth="1.6" strokeDasharray="4 4" />
            <line x1="370" y1="42" x2="416" y2="42" stroke="var(--plot-3)" strokeWidth="2" markerEnd="url(#e221-amber)" />
            <text x="424" y="46" fill="var(--plot-3)" fontSize="13" fontWeight="700">x_p(t)</text>
            {/* Sliding friction b_s */}
            <text x="340" y="196" textAnchor="middle" fill="var(--error-ink)" fontSize="12" fontWeight="600">Sliding friction b_s = 0.9</text>

            {/* Right Free-Body Diagram */}
            <rect x="465" y="20" width="200" height="175" rx="10" fill="var(--surface)" stroke="var(--rule)" />
            <text x="565" y="40" textAnchor="middle" fill="var(--ink-secondary)" fontSize="11.5" fontWeight="700">FREE-BODY DIAGRAM (m_c)</text>
            <rect x="535" y="88" width="60" height="44" rx="5" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.8" />
            <text x="565" y="114" textAnchor="middle" fill="var(--ink)" fontSize="12" fontWeight="700">m_c</text>
            {/* Relative forces pulling right */}
            <line x1="478" y1="98" x2="530" y2="98" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#e221-cyan)" />
            <text x="504" y="74" textAnchor="middle" fill="var(--plot-1)" fontSize="10.5">k_d(x_inâˆ’x_p)</text>
            <text x="504" y="88" textAnchor="middle" fill="var(--plot-2)" fontSize="10.5">+ b_d(áº‹_inâˆ’áº‹_p)</text>
            {/* Ground friction opposing */}
            <line x1="652" y1="122" x2="600" y2="122" stroke="var(--error-ink)" strokeWidth="1.8" markerEnd="url(#e221-rose)" />
            <text x="625" y="148" textAnchor="middle" fill="var(--error-ink)" fontSize="10.5">b_s áº‹_p</text>
          </svg>
        </div>
      );
    }

    case 'P2.26': {
      return (
        <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--forest)]">
            Two-Mass Flexible Robot Arm Â· Actionâ€“Reaction Force Map
          </div>
          <svg role="img" aria-label={`${problemTitle ? `${problemTitle}. ` : ``}Figure for problem ${problemId}`} viewBox="0 0 660 185" className="w-full h-auto">
            <ArrowDefs id="p226" />
            <line x1="40" y1="145" x2="620" y2="145" stroke="var(--rule-strong)" strokeWidth="2.5" />
            {/* Input F(t) */}
            <line x1="50" y1="92" x2="120" y2="92" stroke="var(--plot-1)" strokeWidth="2.2" markerEnd="url(#p226-cyan)" />
            <text x="72" y="80" fill="var(--plot-1)" fontSize="13" fontWeight="700">F(t)</text>
            {/* Mass M */}
            <rect x="125" y="50" width="105" height="84" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="2" />
            <text x="177" y="96" textAnchor="middle" fill="var(--ink)" fontSize="16" fontWeight="700">M</text>
            <circle cx="148" cy="139" r="6" fill="var(--rule)" stroke="var(--ink-secondary)" />
            <circle cx="206" cy="139" r="6" fill="var(--rule)" stroke="var(--ink-secondary)" />
            <line x1="177" y1="26" x2="225" y2="26" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#p226-cyan)" />
            <line x1="177" y1="26" x2="177" y2="46" stroke="var(--plot-1)" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="233" y="30" fill="var(--plot-1)" fontSize="12" fontWeight="700">x(t)</text>
            {/* Coupling spring k and damper b */}
            <line x1="230" y1="92" x2="265" y2="92" stroke="var(--ink-secondary)" strokeWidth="2" />
            <line x1="265" y1="68" x2="265" y2="116" stroke="var(--ink-secondary)" strokeWidth="2" />
            <polyline points="265,68 292,68 299,56 309,80 319,56 329,80 339,56 347,68 380,68" fill="none" stroke="var(--plot-2)" strokeWidth="2" />
            <text x="322" y="48" textAnchor="middle" fill="var(--plot-2)" fontSize="12" fontWeight="700">k</text>
            <line x1="265" y1="116" x2="305" y2="116" stroke="var(--plot-2)" strokeWidth="2" />
            <rect x="305" y="105" width="28" height="22" fill="none" stroke="var(--plot-2)" strokeWidth="2" />
            <line x1="319" y1="109" x2="319" y2="123" stroke="var(--plot-2)" strokeWidth="2.5" />
            <line x1="333" y1="116" x2="380" y2="116" stroke="var(--plot-2)" strokeWidth="2" />
            <text x="322" y="139" textAnchor="middle" fill="var(--plot-2)" fontSize="12" fontWeight="700">b</text>
            <line x1="380" y1="68" x2="380" y2="116" stroke="var(--ink-secondary)" strokeWidth="2" />
            <line x1="380" y1="92" x2="420" y2="92" stroke="var(--ink-secondary)" strokeWidth="2" />
            {/* Mass m */}
            <rect x="420" y="56" width="95" height="78" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="2" />
            <text x="467" y="99" textAnchor="middle" fill="var(--ink)" fontSize="16" fontWeight="700">m</text>
            <circle cx="442" cy="139" r="6" fill="var(--rule)" stroke="var(--ink-secondary)" />
            <circle cx="494" cy="139" r="6" fill="var(--rule)" stroke="var(--ink-secondary)" />
            <line x1="467" y1="26" x2="515" y2="26" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#p226-amber)" />
            <line x1="467" y1="26" x2="467" y2="52" stroke="var(--plot-3)" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="523" y="30" fill="var(--plot-3)" fontSize="12" fontWeight="700">y(t)</text>
            {/* Internal action-reaction note */}
            <text x="325" y="172" textAnchor="middle" fill="var(--ink-secondary)" fontSize="11.5">
              Internal force f_int = b(áº‹ âˆ’ áº) + k(x âˆ’ y) pulls M left (âˆ’) and pushes m right (+)
            </text>
          </svg>
        </div>
      );
    }

    case 'E2.25': {
      return (
        <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--forest)]">
            Multiloop Signal-Equation Diagram Â· Named Nodes E, V, B, Y
          </div>
          <svg role="img" aria-label={`${problemTitle ? `${problemTitle}. ` : ``}Figure for problem ${problemId}`} viewBox="0 0 640 190" className="w-full h-auto">
            <ArrowDefs id="e225" />
            <text x="16" y="59" fill="var(--plot-1)" fontSize="13" fontWeight="700">R(s)</text>
            <line x1="50" y1="55" x2="96" y2="55" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#e225-cyan)" />
            <circle cx="110" cy="55" r="13" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.6" />
            <text x="88" y="47" fill="var(--plot-2)" fontSize="12" fontWeight="700">+</text>
            <text x="118" y="82" fill="var(--error-ink)" fontSize="13" fontWeight="700">âˆ’</text>
            <line x1="123" y1="55" x2="184" y2="55" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#e225-cyan)" />
            <text x="152" y="45" textAnchor="middle" fill="var(--ink-secondary)" fontSize="12" fontWeight="600">E(s)</text>
            <rect x="188" y="34" width="102" height="42" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="1.6" />
            <text x="239" y="60" textAnchor="middle" fill="var(--ink)" fontSize="13.5" fontWeight="600">10 / (s + 1)</text>
            <line x1="290" y1="55" x2="386" y2="55" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#e225-cyan)" />
            <text x="338" y="45" textAnchor="middle" fill="var(--plot-2)" fontSize="12" fontWeight="700">V(s) = sY</text>
            <circle cx="338" cy="55" r="4" fill="var(--plot-2)" />
            <rect x="390" y="34" width="76" height="42" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.6" />
            <text x="428" y="60" textAnchor="middle" fill="var(--ink)" fontSize="13.5" fontWeight="600">1 / s</text>
            <line x1="466" y1="55" x2="564" y2="55" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#e225-amber)" />
            <text x="574" y="59" fill="var(--plot-3)" fontSize="13" fontWeight="700">Y(s)</text>
            <circle cx="515" cy="55" r="4" fill="var(--plot-3)" />
            {/* Inner feedback gain 2 */}
            <line x1="338" y1="55" x2="338" y2="94" stroke="var(--plot-2)" strokeWidth="1.6" markerEnd="url(#e225-emerald)" />
            <rect x="314" y="96" width="48" height="32" rx="6" fill="var(--surface-muted)" stroke="var(--plot-2)" strokeWidth="1.5" />
            <text x="338" y="117" textAnchor="middle" fill="var(--success-ink)" fontSize="13" fontWeight="700">2</text>
            <line x1="338" y1="128" x2="338" y2="147" stroke="var(--plot-2)" strokeWidth="1.6" markerEnd="url(#e225-emerald)" />
            {/* Lower summer */}
            <circle cx="338" cy="162" r="13" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.6" />
            <text x="348" y="146" fill="var(--plot-2)" fontSize="12" fontWeight="700">+</text>
            <text x="358" y="156" fill="var(--plot-2)" fontSize="12" fontWeight="700">+</text>
            {/* Outer Y tap into lower summer */}
            <polyline points="515,55 515,162 353,162" fill="none" stroke="var(--plot-3)" strokeWidth="1.6" markerEnd="url(#e225-amber)" />
            {/* B(s) back to main summer */}
            <polyline points="325,162 110,162 110,70" fill="none" stroke="var(--error-ink)" strokeWidth="1.8" markerEnd="url(#e225-rose)" />
            <text x="215" y="153" textAnchor="middle" fill="var(--error-ink)" fontSize="12" fontWeight="600">B(s) = 2V + Y = (2s+1)Y</text>
          </svg>
        </div>
      );
    }

    case 'Ex2.5': {
      return (
        <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--forest)]">
            Field-Controlled DC Motor Cascade Â· Pure Forward Chain (Zero Back-EMF Loop)
          </div>
          <svg role="img" aria-label={`${problemTitle ? `${problemTitle}. ` : ``}Figure for problem ${problemId}`} viewBox="0 0 680 155" className="w-full h-auto">
            <ArrowDefs id="ex25" />
            <text x="12" y="70" fill="var(--plot-1)" fontSize="12.5" fontWeight="700">V_f(s)</text>
            <line x1="54" y1="66" x2="88" y2="66" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#ex25-cyan)" />
            <rect x="92" y="44" width="106" height="44" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="1.5" />
            <text x="145" y="70" textAnchor="middle" fill="var(--ink)" fontSize="12.5" fontWeight="600">1 / (L_f s + R_f)</text>
            <line x1="198" y1="66" x2="242" y2="66" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#ex25-cyan)" />
            <text x="220" y="56" textAnchor="middle" fill="var(--ink-secondary)" fontSize="11.5">I_f</text>
            <rect x="246" y="44" width="60" height="44" rx="6" fill="var(--surface-muted)" stroke="var(--plot-2)" strokeWidth="1.5" />
            <text x="276" y="70" textAnchor="middle" fill="var(--success-ink)" fontSize="13" fontWeight="700">K_m</text>
            <line x1="306" y1="66" x2="352" y2="66" stroke="var(--plot-2)" strokeWidth="1.8" markerEnd="url(#ex25-emerald)" />
            <text x="329" y="56" textAnchor="middle" fill="var(--ink-secondary)" fontSize="11.5">T_m</text>
            {/* Disturbance summer */}
            <circle cx="366" cy="66" r="12" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
            <text x="345" y="58" fill="var(--plot-2)" fontSize="11">+</text>
            <text x="373" y="46" fill="var(--error-ink)" fontSize="12" fontWeight="700">âˆ’</text>
            <text x="366" y="18" textAnchor="middle" fill="var(--error-ink)" fontSize="11.5" fontWeight="600">T_d(s)</text>
            <line x1="366" y1="24" x2="366" y2="52" stroke="var(--error-ink)" strokeWidth="1.5" markerEnd="url(#ex25-rose)" />
            <line x1="378" y1="66" x2="412" y2="66" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#ex25-cyan)" />
            <rect x="416" y="44" width="90" height="44" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.5" />
            <text x="461" y="70" textAnchor="middle" fill="var(--ink)" fontSize="12.5" fontWeight="600">1 / (J s + b)</text>
            <line x1="506" y1="66" x2="554" y2="66" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#ex25-amber)" />
            <text x="530" y="56" textAnchor="middle" fill="var(--caution-ink)" fontSize="11.5">Î©(s)</text>
            <rect x="558" y="44" width="54" height="44" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.5" />
            <text x="585" y="70" textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="600">1 / s</text>
            <line x1="612" y1="66" x2="646" y2="66" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#ex25-amber)" />
            <text x="652" y="70" fill="var(--plot-3)" fontSize="12.5" fontWeight="700">Î˜(s)</text>
            <text x="340" y="130" textAnchor="middle" fill="var(--ink-secondary)" fontSize="11.5">
              I_a = constant â‡’ No back-EMF feedback loop â‡’ Three cascaded poles at 0, âˆ’R_f/L_f, âˆ’b/J
            </text>
          </svg>
        </div>
      );
    }

    case 'Ex2.6': {
      return (
        <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--caution-ink)]">
            Positive Inner Feedback Trap Â· Watch the + Sign at the Gâ‚ƒ Summer!
          </div>
          <svg role="img" aria-label={`${problemTitle ? `${problemTitle}. ` : ``}Figure for problem ${problemId}`} viewBox="0 0 720 230" className="w-full h-auto">
            <ArrowDefs id="ex26" />
            {/* R(s) -> Sum 1 (- H3) */}
            <text x="12" y="54" fill="var(--plot-1)" fontSize="12.5" fontWeight="700">R(s)</text>
            <line x1="42" y1="50" x2="72" y2="50" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#ex26-cyan)" />
            <circle cx="84" cy="50" r="11" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
            <text x="65" y="42" fill="var(--plot-2)" fontSize="11">+</text>
            <text x="90" y="73" fill="var(--error-ink)" fontSize="12.5" fontWeight="700">âˆ’</text>
            {/* -> G1 */}
            <line x1="95" y1="50" x2="128" y2="50" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#ex26-cyan)" />
            <rect x="131" y="32" width="60" height="36" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="1.5" />
            <text x="161" y="54" textAnchor="middle" fill="var(--ink)" fontSize="12.5" fontWeight="600">Gâ‚(s)</text>
            {/* -> Sum 2 (- H2) */}
            <line x1="191" y1="50" x2="222" y2="50" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#ex26-cyan)" />
            <circle cx="234" cy="50" r="11" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
            <text x="215" y="42" fill="var(--plot-2)" fontSize="11">+</text>
            <text x="240" y="73" fill="var(--error-ink)" fontSize="12.5" fontWeight="700">âˆ’</text>
            {/* -> G2 */}
            <line x1="245" y1="50" x2="276" y2="50" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#ex26-cyan)" />
            <rect x="279" y="32" width="60" height="36" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="1.5" />
            <text x="309" y="54" textAnchor="middle" fill="var(--ink)" fontSize="12.5" fontWeight="600">Gâ‚‚(s)</text>
            {/* -> Sum 3 (+ H1 POSITIVE!) */}
            <line x1="339" y1="50" x2="370" y2="50" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#ex26-cyan)" />
            <circle cx="382" cy="50" r="11" fill="var(--surface)" stroke="var(--plot-3)" strokeWidth="1.8" />
            <text x="363" y="42" fill="var(--plot-2)" fontSize="11">+</text>
            <text x="389" y="73" fill="var(--plot-3)" fontSize="13.5" fontWeight="700">+</text>
            {/* -> G3 */}
            <line x1="393" y1="50" x2="424" y2="50" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#ex26-cyan)" />
            <rect x="427" y="32" width="60" height="36" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.5" />
            <text x="457" y="54" textAnchor="middle" fill="var(--ink)" fontSize="12.5" fontWeight="600">Gâ‚ƒ(s)</text>
            {/* -> G4 (tap between G3 and G4 at x=512) */}
            <line x1="487" y1="50" x2="534" y2="50" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#ex26-cyan)" />
            <circle cx="511" cy="50" r="3.5" fill="var(--plot-2)" />
            <rect x="537" y="32" width="60" height="36" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.5" />
            <text x="567" y="54" textAnchor="middle" fill="var(--ink)" fontSize="12.5" fontWeight="600">Gâ‚„(s)</text>
            {/* -> Y(s) */}
            <line x1="597" y1="50" x2="672" y2="50" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#ex26-amber)" />
            <text x="680" y="54" fill="var(--plot-3)" fontSize="12.5" fontWeight="700">Y(s)</text>

            {/* Inner POSITIVE loop H1: from Y(s) pickoff x=626 -> y=108 -> Sum 3 (+) */}
            <circle cx="626" cy="50" r="3.5" fill="var(--plot-3)" />
            <polyline points="626,50 626,108 552,108" fill="none" stroke="var(--plot-3)" strokeWidth="1.6" markerEnd="url(#ex26-amber)" />
            <rect x="492" y="92" width="56" height="30" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.5" />
            <text x="520" y="111" textAnchor="middle" fill="var(--caution-ink)" fontSize="12" fontWeight="600">Hâ‚(s)</text>
            <polyline points="492,108 382,108 382,63" fill="none" stroke="var(--plot-3)" strokeWidth="1.6" markerEnd="url(#ex26-amber)" />
            <text x="434" y="86" textAnchor="middle" fill="var(--caution-ink)" fontSize="10">+ loop: Gâ‚ƒGâ‚„/(1âˆ’Gâ‚ƒGâ‚„Hâ‚)</text>

            {/* Middle NEGATIVE loop H2: tap between G3 and G4 (x=511) -> y=155 -> Sum 2 (-) */}
            <polyline points="511,50 511,155 412,155" fill="none" stroke="var(--plot-2)" strokeWidth="1.6" markerEnd="url(#ex26-emerald)" />
            <rect x="352" y="139" width="56" height="30" rx="6" fill="var(--surface-muted)" stroke="var(--plot-2)" strokeWidth="1.5" />
            <text x="380" y="158" textAnchor="middle" fill="var(--success-ink)" fontSize="12" fontWeight="600">Hâ‚‚(s)</text>
            <polyline points="352,155 234,155 234,63" fill="none" stroke="var(--plot-2)" strokeWidth="1.6" markerEnd="url(#ex26-emerald)" />

            {/* Outer NEGATIVE loop H3: from Y(s) pickoff x=650 -> y=200 -> Sum 1 (-) */}
            <circle cx="650" cy="50" r="3.5" fill="var(--error-ink)" />
            <polyline points="650,50 650,200 398,200" fill="none" stroke="var(--error-ink)" strokeWidth="1.6" markerEnd="url(#ex26-rose)" />
            <rect x="338" y="184" width="56" height="30" rx="6" fill="var(--surface-muted)" stroke="var(--error-ink)" strokeWidth="1.5" />
            <text x="366" y="203" textAnchor="middle" fill="var(--error-ink)" fontSize="12" fontWeight="600">Hâ‚ƒ(s)</text>
            <polyline points="338,200 84,200 84,63" fill="none" stroke="var(--error-ink)" strokeWidth="1.6" markerEnd="url(#ex26-rose)" />
          </svg>
        </div>
      );
    }

    // ================= STATE SPACE & CIRCUITS =================
    case 'P3.1': {
      return (
        <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--forest)]">
            Series RLC Circuit Â· Energy Storage Elements Define the States (v_c, i)
          </div>
          <svg role="img" aria-label={`${problemTitle ? `${problemTitle}. ` : ``}Figure for problem ${problemId}`} viewBox="0 0 600 180" className="w-full max-w-xl mx-auto h-auto">
            <ArrowDefs id="p31" />
            {/* Loop wires */}
            <line x1="110" y1="40" x2="170" y2="40" stroke="var(--ink-secondary)" strokeWidth="2" />
            <line x1="110" y1="40" x2="110" y2="70" stroke="var(--ink-secondary)" strokeWidth="2" />
            <line x1="110" y1="114" x2="110" y2="145" stroke="var(--ink-secondary)" strokeWidth="2" />
            <line x1="110" y1="145" x2="480" y2="145" stroke="var(--ink-secondary)" strokeWidth="2" />
            {/* Voltage source v(t) */}
            <circle cx="110" cy="92" r="22" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="2" />
            <text x="110" y="97" textAnchor="middle" fill="var(--plot-1)" fontSize="16" fontWeight="700">~</text>
            <text x="138" y="72" fill="var(--plot-2)" fontSize="13" fontWeight="700">+</text>
            <text x="138" y="120" fill="var(--error-ink)" fontSize="13" fontWeight="700">âˆ’</text>
            <text x="78" y="96" textAnchor="end" fill="var(--plot-1)" fontSize="13" fontWeight="700">v(t)</text>
            {/* Resistor R */}
            <polyline points="170,40 182,40 188,28 198,52 208,28 218,52 228,28 238,52 244,40 280,40" fill="none" stroke="var(--ink-secondary)" strokeWidth="2" />
            <text x="213" y="20" textAnchor="middle" fill="var(--ink-secondary)" fontSize="13" fontWeight="600">R</text>
            {/* Current arrow i(t) = x2 */}
            <line x1="255" y1="40" x2="292" y2="40" stroke="var(--plot-2)" strokeWidth="2.2" markerEnd="url(#p31-emerald)" />
            <text x="275" y="62" textAnchor="middle" fill="var(--plot-2)" fontSize="12.5" fontWeight="700">i(t) = xâ‚‚</text>
            {/* Inductor L */}
            <path d="M 300 40 Q 312 18 324 40 Q 336 18 348 40 Q 360 18 372 40 Q 384 18 396 40" fill="none" stroke="var(--plot-2)" strokeWidth="2.4" />
            <text x="348" y="18" textAnchor="middle" fill="var(--plot-2)" fontSize="13" fontWeight="700">L (Â½LiÂ²)</text>
            <line x1="396" y1="40" x2="480" y2="40" stroke="var(--ink-secondary)" strokeWidth="2" />
            {/* Capacitor C */}
            <line x1="480" y1="40" x2="480" y2="83" stroke="var(--ink-secondary)" strokeWidth="2" />
            <line x1="454" y1="83" x2="506" y2="83" stroke="var(--plot-3)" strokeWidth="3" />
            <line x1="454" y1="99" x2="506" y2="99" stroke="var(--plot-3)" strokeWidth="3" />
            <line x1="480" y1="99" x2="480" y2="145" stroke="var(--ink-secondary)" strokeWidth="2" />
            <text x="444" y="78" fill="var(--plot-2)" fontSize="13" fontWeight="700">+</text>
            <text x="444" y="116" fill="var(--error-ink)" fontSize="13" fontWeight="700">âˆ’</text>
            <text x="518" y="96" fill="var(--plot-3)" fontSize="13" fontWeight="700">C (Â½Cv_cÂ²)</text>
            <text x="425" y="96" textAnchor="end" fill="var(--plot-3)" fontSize="12.5" fontWeight="700">v_c(t) = xâ‚</text>
          </svg>
        </div>
      );
    }

    case 'P3.8': {
      return (
        <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--forest)]">
            Lunar Module Soft Landing Â· Variable Mass m(t) = xâ‚ƒ Causes Nonlinearity
          </div>
          <svg role="img" aria-label={`${problemTitle ? `${problemTitle}. ` : ``}Figure for problem ${problemId}`} viewBox="0 0 540 200" className="w-full max-w-lg mx-auto h-auto">
            <ArrowDefs id="p38" />
            {/* Lunar surface */}
            <rect x="40" y="168" width="460" height="16" rx="3" fill="var(--rule)" stroke="var(--ink-muted)" />
            <text x="270" y="180" textAnchor="middle" fill="var(--ink-secondary)" fontSize="11" fontWeight="600">LUNAR SURFACE (y = 0)</text>
            {/* Module body */}
            <polygon points="225,28 315,28 335,54 205,54" fill="var(--rule)" stroke="var(--ink-secondary)" strokeWidth="1.8" />
            <rect x="195" y="54" width="150" height="44" rx="5" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="2" />
            <text x="270" y="74" textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="700">Module m(t) = xâ‚ƒ</text>
            <polygon points="248,98 292,98 304,118 236,118" fill="var(--rule)" stroke="var(--ink-secondary)" strokeWidth="1.6" />
            {/* Gravity force down */}
            <line x1="270" y1="80" x2="270" y2="112" stroke="var(--error-ink)" strokeWidth="2.2" markerEnd="url(#p38-rose)" />
            <text x="184" y="80" textAnchor="end" fill="var(--error-ink)" fontSize="12.5" fontWeight="700">Gravity âˆ’m(t)g</text>
            {/* Thrust up */}
            <line x1="270" y1="158" x2="270" y2="124" stroke="var(--plot-2)" strokeWidth="2.4" markerEnd="url(#p38-emerald)" />
            <text x="285" y="148" fill="var(--plot-2)" fontSize="12.5" fontWeight="700">Thrust = kÂ·á¹(t) = k u</text>
            {/* Altitude y(t) */}
            <line x1="120" y1="168" x2="120" y2="102" stroke="var(--plot-3)" strokeWidth="2" markerEnd="url(#p38-amber)" />
            <line x1="120" y1="98" x2="190" y2="98" stroke="var(--plot-3)" strokeWidth="1.2" strokeDasharray="4 4" />
            <text x="108" y="138" textAnchor="end" fill="var(--plot-3)" fontSize="13" fontWeight="700">y(t) = xâ‚</text>
          </svg>
        </div>
      );
    }

    case 'E3.5': {
      return (
        <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--caution-ink)]">
            Pre-Integrator Feedforward Trap Â· Branch f Taps áº‹â‚ (BEFORE 1/s!)
          </div>
          <svg role="img" aria-label={`${problemTitle ? `${problemTitle}. ` : ``}Figure for problem ${problemId}`} viewBox="0 0 680 200" className="w-full h-auto">
            <ArrowDefs id="e35" />
            <text x="16" y="104" fill="var(--plot-1)" fontSize="13" fontWeight="700">U(s)</text>
            <line x1="48" y1="100" x2="88" y2="100" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#e35-cyan)" />
            {/* Summer 1 */}
            <circle cx="102" cy="100" r="13" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.6" />
            <text x="80" y="92" fill="var(--plot-2)" fontSize="12">+</text>
            <text x="108" y="126" fill="var(--error-ink)" fontSize="13" fontWeight="700">âˆ’</text>
            {/* áº‹â‚ node */}
            <line x1="115" y1="100" x2="188" y2="100" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#e35-cyan)" />
            <circle cx="146" cy="100" r="4" fill="var(--plot-3)" />
            <text x="146" y="88" textAnchor="middle" fill="var(--plot-3)" fontSize="11.5" fontWeight="700">áº‹â‚</text>
            {/* Integrator 1 */}
            <rect x="192" y="80" width="54" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="1.6" />
            <text x="219" y="105" textAnchor="middle" fill="var(--ink)" fontSize="14" fontWeight="600">1 / s</text>
            <line x1="246" y1="100" x2="292" y2="100" stroke="var(--plot-2)" strokeWidth="1.8" markerEnd="url(#e35-emerald)" />
            <text x="269" y="90" textAnchor="middle" fill="var(--plot-2)" fontSize="12" fontWeight="700">xâ‚</text>
            {/* Gain a */}
            <rect x="296" y="80" width="46" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
            <text x="319" y="105" textAnchor="middle" fill="var(--ink)" fontSize="14" fontWeight="600">a</text>
            <line x1="342" y1="100" x2="378" y2="100" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#e35-cyan)" />
            {/* Summer 2 */}
            <circle cx="392" cy="100" r="13" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.6" />
            <text x="372" y="92" fill="var(--plot-2)" fontSize="11">+</text>
            <text x="380" y="76" fill="var(--plot-2)" fontSize="11">+</text>
            <text x="404" y="76" fill="var(--error-ink)" fontSize="12" fontWeight="700">âˆ’</text>
            {/* áº‹â‚‚ -> Integrator 2 */}
            <line x1="405" y1="100" x2="450" y2="100" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#e35-cyan)" />
            <text x="427" y="90" textAnchor="middle" fill="var(--ink-secondary)" fontSize="11.5">áº‹â‚‚</text>
            <rect x="454" y="80" width="54" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.6" />
            <text x="481" y="105" textAnchor="middle" fill="var(--ink)" fontSize="14" fontWeight="600">1 / s</text>
            {/* xâ‚‚ -> Gain b -> Y */}
            <line x1="508" y1="100" x2="554" y2="100" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#e35-amber)" />
            <text x="530" y="90" textAnchor="middle" fill="var(--plot-3)" fontSize="12" fontWeight="700">xâ‚‚</text>
            <circle cx="530" cy="100" r="3.5" fill="var(--plot-3)" />
            <rect x="558" y="80" width="46" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.5" />
            <text x="581" y="105" textAnchor="middle" fill="var(--ink)" fontSize="14" fontWeight="600">b</text>
            <line x1="604" y1="100" x2="634" y2="100" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#e35-amber)" />
            <text x="640" y="104" fill="var(--plot-3)" fontSize="13" fontWeight="700">Y(s)</text>
            {/* Top feedforward f from áº‹â‚ */}
            <polyline points="146,100 146,34 240,34" fill="none" stroke="var(--plot-3)" strokeWidth="1.6" markerEnd="url(#e35-amber)" />
            <rect x="244" y="18" width="44" height="32" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.5" />
            <text x="266" y="39" textAnchor="middle" fill="var(--caution-ink)" fontSize="13" fontWeight="700">f</text>
            <polyline points="288,34 385,34 385,88" fill="none" stroke="var(--plot-3)" strokeWidth="1.6" markerEnd="url(#e35-amber)" />
            {/* Top local feedback d from xâ‚‚ */}
            <polyline points="530,100 530,34 484,34" fill="none" stroke="var(--error-ink)" strokeWidth="1.6" markerEnd="url(#e35-rose)" />
            <rect x="436" y="18" width="44" height="32" rx="6" fill="var(--surface-muted)" stroke="var(--error-ink)" strokeWidth="1.5" />
            <text x="458" y="39" textAnchor="middle" fill="var(--error-ink)" fontSize="13" fontWeight="700">d</text>
            <polyline points="436,34 399,34 399,88" fill="none" stroke="var(--error-ink)" strokeWidth="1.6" markerEnd="url(#e35-rose)" />
            {/* Bottom feedback k from xâ‚‚ */}
            <polyline points="530,100 530,165 342,165" fill="none" stroke="var(--error-ink)" strokeWidth="1.6" markerEnd="url(#e35-rose)" />
            <rect x="294" y="149" width="44" height="32" rx="6" fill="var(--surface-muted)" stroke="var(--error-ink)" strokeWidth="1.5" />
            <text x="316" y="170" textAnchor="middle" fill="var(--error-ink)" fontSize="13" fontWeight="700">k</text>
            <polyline points="294,165 102,165 102,115" fill="none" stroke="var(--error-ink)" strokeWidth="1.6" markerEnd="url(#e35-rose)" />
          </svg>
        </div>
      );
    }

    case 'P3.7': {
      return (
        <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--forest)]">
            Submarine Depth Control Â· Full Closed-Loop Architecture
          </div>
          <svg role="img" aria-label={`${problemTitle ? `${problemTitle}. ` : ``}Figure for problem ${problemId}`} viewBox="0 0 680 165" className="w-full h-auto">
            <ArrowDefs id="p37" />
            <text x="14" y="54" fill="var(--plot-1)" fontSize="12.5" fontWeight="700">R(s)</text>
            <line x1="46" y1="50" x2="86" y2="50" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#p37-cyan)" />
            <circle cx="100" cy="50" r="13" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
            <text x="78" y="42" fill="var(--plot-2)" fontSize="12">+</text>
            <text x="108" y="76" fill="var(--error-ink)" fontSize="13" fontWeight="700">âˆ’</text>
            <line x1="113" y1="50" x2="152" y2="50" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#p37-cyan)" />
            <rect x="156" y="30" width="70" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="1.5" />
            <text x="191" y="55" textAnchor="middle" fill="var(--ink)" fontSize="12.5" fontWeight="600">K = 1</text>
            <line x1="226" y1="50" x2="262" y2="50" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#p37-cyan)" />
            <rect x="266" y="26" width="136" height="48" rx="6" fill="var(--surface-muted)" stroke="var(--plot-2)" strokeWidth="1.5" />
            <text x="334" y="47" textAnchor="middle" fill="var(--success-ink)" fontSize="12" fontWeight="700">Submarine G(s)</text>
            <text x="334" y="64" textAnchor="middle" fill="var(--ink)" fontSize="12">(s+1)Â² / (sÂ²+1)</text>
            <line x1="402" y1="50" x2="442" y2="50" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#p37-cyan)" />
            <rect x="446" y="30" width="60" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.5" />
            <text x="476" y="55" textAnchor="middle" fill="var(--ink)" fontSize="13.5" fontWeight="600">1 / s</text>
            <line x1="506" y1="50" x2="606" y2="50" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#p37-amber)" />
            <text x="614" y="54" fill="var(--plot-3)" fontSize="12.5" fontWeight="700">Y(s) Depth</text>
            {/* Feedback H(s) = 2s + 1 */}
            <circle cx="556" cy="50" r="4" fill="var(--plot-3)" />
            <polyline points="556,50 556,125 408,125" fill="none" stroke="var(--error-ink)" strokeWidth="1.6" markerEnd="url(#p37-rose)" />
            <rect x="268" y="105" width="136" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--error-ink)" strokeWidth="1.5" />
            <text x="336" y="129" textAnchor="middle" fill="var(--error-ink)" fontSize="12.5" fontWeight="600">Sensor H(s) = 2s + 1</text>
            <polyline points="268,125 100,125 100,65" fill="none" stroke="var(--error-ink)" strokeWidth="1.6" markerEnd="url(#p37-rose)" />
          </svg>
        </div>
      );
    }

    case 'P3.4': {
      return (
        <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--forest)]">
            Controllable Canonical Realization Â· Denominator Loops Down, Numerator Feeds Up
          </div>
          <svg role="img" aria-label={`${problemTitle ? `${problemTitle}. ` : ``}Figure for problem ${problemId}`} viewBox="0 0 680 230" className="w-full h-auto">
            <ArrowDefs id="p34" />
            <text x="12" y="114" fill="var(--plot-1)" fontSize="13" fontWeight="700">R(s)</text>
            <line x1="46" y1="110" x2="82" y2="110" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#p34-cyan)" />
            <circle cx="96" cy="110" r="13" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
            <text x="74" y="102" fill="var(--plot-2)" fontSize="11">+</text>
            {/* Integrator 3 -> 2 -> 1 */}
            <line x1="109" y1="110" x2="150" y2="110" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#p34-cyan)" />
            <text x="130" y="100" textAnchor="middle" fill="var(--ink-secondary)" fontSize="11.5">áº‹â‚ƒ</text>
            <rect x="154" y="90" width="52" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="1.5" />
            <text x="180" y="115" textAnchor="middle" fill="var(--ink)" fontSize="13.5">1 / s</text>
            <line x1="206" y1="110" x2="290" y2="110" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#p34-cyan)" />
            <circle cx="248" cy="110" r="3.5" fill="var(--plot-1)" />
            <text x="248" y="100" textAnchor="middle" fill="var(--plot-1)" fontSize="11.5" fontWeight="700">xâ‚ƒ</text>
            <rect x="294" y="90" width="52" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-2)" strokeWidth="1.5" />
            <text x="320" y="115" textAnchor="middle" fill="var(--ink)" fontSize="13.5">1 / s</text>
            <line x1="346" y1="110" x2="430" y2="110" stroke="var(--plot-2)" strokeWidth="1.8" markerEnd="url(#p34-emerald)" />
            <circle cx="388" cy="110" r="3.5" fill="var(--plot-2)" />
            <text x="388" y="100" textAnchor="middle" fill="var(--plot-2)" fontSize="11.5" fontWeight="700">xâ‚‚</text>
            <rect x="434" y="90" width="52" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.5" />
            <text x="460" y="115" textAnchor="middle" fill="var(--ink)" fontSize="13.5">1 / s</text>
            <line x1="486" y1="110" x2="545" y2="110" stroke="var(--plot-3)" strokeWidth="1.8" />
            <circle cx="528" cy="110" r="3.5" fill="var(--plot-3)" />
            <text x="528" y="100" textAnchor="middle" fill="var(--plot-3)" fontSize="11.5" fontWeight="700">xâ‚</text>
            {/* Output summer at top-right (zero wire crossing) */}
            <circle cx="556" cy="34" r="13" fill="var(--surface)" stroke="var(--plot-3)" strokeWidth="1.6" />
            <text x="536" y="28" fill="var(--plot-2)" fontSize="11">+</text>
            <polyline points="248,110 248,34 541,34" fill="none" stroke="var(--plot-1)" strokeWidth="1.5" markerEnd="url(#p34-cyan)" />
            <text x="318" y="26" textAnchor="middle" fill="var(--plot-1)" fontSize="11.5" fontWeight="600">Ã— 1</text>
            <polyline points="388,110 388,58 545,42" fill="none" stroke="var(--plot-2)" strokeWidth="1.5" markerEnd="url(#p34-emerald)" />
            <text x="415" y="72" fill="var(--plot-2)" fontSize="11.5" fontWeight="600">Ã— 2</text>
            <polyline points="528,110 556,110 556,49" fill="none" stroke="var(--plot-3)" strokeWidth="1.5" markerEnd="url(#p34-amber)" />
            <text x="572" y="84" fill="var(--plot-3)" fontSize="11.5" fontWeight="600">Ã— 10</text>
            <line x1="569" y1="34" x2="622" y2="34" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#p34-amber)" />
            <text x="630" y="38" fill="var(--plot-3)" fontSize="13" fontWeight="700">Y(s)</text>
            {/* Feedback gains -4, -6, -10 with arrows into input summer */}
            <polyline points="248,110 248,155 96,155 96,125" fill="none" stroke="var(--error-ink)" strokeWidth="1.4" markerEnd="url(#p34-rose)" />
            <text x="172" y="150" textAnchor="middle" fill="var(--error-ink)" fontSize="11">âˆ’4</text>
            <polyline points="388,110 388,185 96,185 96,125" fill="none" stroke="var(--error-ink)" strokeWidth="1.4" markerEnd="url(#p34-rose)" />
            <text x="242" y="180" textAnchor="middle" fill="var(--error-ink)" fontSize="11">âˆ’6</text>
            <polyline points="528,110 528,215 96,215 96,125" fill="none" stroke="var(--error-ink)" strokeWidth="1.4" markerEnd="url(#p34-rose)" />
            <text x="312" y="210" textAnchor="middle" fill="var(--error-ink)" fontSize="11">âˆ’10</text>
          </svg>
        </div>
      );
    }

    case 'E3.4':
    case 'E3.2': {
      return (
        <div className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--forest)]">
            Phase-Variable Structure Â· Integrators Shift Derivative Order Down
          </div>
          <svg role="img" aria-label={`${problemTitle ? `${problemTitle}. ` : ``}Figure for problem ${problemId}`} viewBox="0 0 640 120" className="w-full max-w-2xl mx-auto h-auto">
            <ArrowDefs id="e34" />
            <text x="20" y="64" fill="var(--plot-1)" fontSize="12.5" fontWeight="700">
              {problemId === 'E3.4' ? '20u âˆ’ 8xâ‚ âˆ’ 6xâ‚‚ âˆ’ 4xâ‚ƒ' : 'kâ‚ƒi âˆ’ xâ‚ âˆ’ xâ‚‚'}
            </text>
            <line x1="172" y1="60" x2="215" y2="60" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#e34-cyan)" />
            <rect x="219" y="40" width="54" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="1.5" />
            <text x="246" y="65" textAnchor="middle" fill="var(--ink)" fontSize="13.5">1 / s</text>
            <line x1="273" y1="60" x2="345" y2="60" stroke="var(--plot-2)" strokeWidth="1.8" markerEnd="url(#e34-emerald)" />
            <text x="309" y="50" textAnchor="middle" fill="var(--plot-2)" fontSize="12" fontWeight="700">
              {problemId === 'E3.4' ? 'xâ‚ƒ = Ã¿' : 'xâ‚‚ = v'}
            </text>
            <rect x="349" y="40" width="54" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-2)" strokeWidth="1.5" />
            <text x="376" y="65" textAnchor="middle" fill="var(--ink)" fontSize="13.5">1 / s</text>
            <line x1="403" y1="60" x2="480" y2="60" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#e34-amber)" />
            <text x="441" y="50" textAnchor="middle" fill="var(--plot-3)" fontSize="12" fontWeight="700">
              {problemId === 'E3.4' ? 'xâ‚‚ = áº' : 'xâ‚ = y'}
            </text>
            {problemId === 'E3.4' && (
              <>
                <rect x="484" y="40" width="54" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.5" />
                <text x="511" y="65" textAnchor="middle" fill="var(--ink)" fontSize="13.5">1 / s</text>
                <line x1="538" y1="60" x2="590" y2="60" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#e34-amber)" />
                <text x="600" y="64" fill="var(--plot-3)" fontSize="12.5" fontWeight="700">xâ‚ = y</text>
              </>
            )}
          </svg>
        </div>
      );
    }

    case 'E3.14': {
      const mStep = (t: number) => 1 - Math.exp(-t);
      return (
        <CurvePlot
          title="First-Order Mass Balance Â· Radioactive Inflow vs. Self-Decay (Î» = 1, Ku = 1)"
          subtitle="Mass accumulates until decay rate Î»M balances inflow rate Ku"
          xLabel="Dimensionless Time Î»t"
          yLabel="Normalized Mass M / (Ku/Î»)"
          xDomain={[0, 5]}
          yDomain={[0, 1.2]}
          xTicks={[0, 1, 2, 3, 4, 5]}
          yTicks={[0, 0.5, 1.0]}
          hLine={{ y: 1, color: 'var(--plot-2)', label: 'Equilibrium M_ss = Ku / Î»' }}
          series={[
            { points: sample(mStep, 0, 5), color: 'var(--plot-3)', label: 'M(t) = (Ku/Î»)(1 âˆ’ e^(âˆ’Î»t))' },
          ]}
        />
      );
    }

    case 'E3.10': {
      // Plot state evolution from x(0) = [1, 0]^T using Phi(t) column 1
      const x1 = (t: number) => 3 * Math.exp(-2 * t) - 2 * Math.exp(-3 * t);
      const x2 = (t: number) => -Math.exp(-2 * t) + Math.exp(-3 * t);
      return (
        <CurvePlot
          title="State Transition Matrix Î¦(t) Column 1 Â· Free Response from x(0) = [1, 0]áµ€"
          subtitle="Eigenvalues Î» = âˆ’2, âˆ’3 lie in LHP; Î¦(0) = I is verified at t = 0"
          xLabel="Time t (seconds)"
          yLabel="State Value"
          xDomain={[0, 3]}
          yDomain={[-0.3, 1.1]}
          xTicks={[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0]}
          yTicks={[-0.2, 0, 0.5, 1.0]}
          series={[
            { points: sample(x1, 0, 3), color: 'var(--plot-3)', label: 'Î¦â‚â‚(t) = 3e^(âˆ’2t) âˆ’ 2e^(âˆ’3t)' },
            { points: sample(x2, 0, 3), color: 'var(--plot-1)', label: 'Î¦â‚‚â‚(t) = âˆ’e^(âˆ’2t) + e^(âˆ’3t)' },
          ]}
          markers={[
            { x: 0, y: 1, color: 'var(--plot-3)', label: 'Î¦â‚â‚(0) = 1', labelDx: 10, labelDy: 4 },
            { x: 0, y: 0, color: 'var(--plot-1)', label: 'Î¦â‚‚â‚(0) = 0', labelDx: 10, labelDy: 14 },
          ]}
        />
      );
    }

    case 'E3.19': {
      // Poles of s^2 + 5s + 3 = 0 -> (-5 Â± sqrt(13))/2 â‰ˆ -0.697, -4.303
      const p1 = (-5 + Math.sqrt(13)) / 2;
      const p2 = (-5 - Math.sqrt(13)) / 2;
      const y = (t: number) =>
        1 + (p2 / (p1 - p2)) * Math.exp(p1 * t) - (p1 / (p1 - p2)) * Math.exp(p2 * t);
      return (
        <CurvePlot
          title="Resulting Transfer Function G(s) = 3 / (sÂ² + 5s + 3) Â· Unit Step Response"
          subtitle="Eigenvalues of A (âˆ’0.70, âˆ’4.30) become the poles of G(s); DC gain G(0) = 1"
          xLabel="Time t (seconds)"
          yLabel="Output y(t)"
          xDomain={[0, 6]}
          yDomain={[0, 1.2]}
          xTicks={[0, 1, 2, 3, 4, 5, 6]}
          yTicks={[0, 0.5, 1.0]}
          hLine={{ y: 1, color: 'var(--plot-2)', label: 'DC Gain G(0) = 3/3 = 1' }}
          series={[
            { points: sample(y, 0, 6), color: 'var(--plot-3)', label: 'Step response y(t)' },
          ]}
        />
      );
    }

    default:
      return null;
  }
};





