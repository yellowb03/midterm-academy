import React from 'react';

interface ExamDiagramProps {
  type: 'q1-feedback' | 'q4-cart' | 'q5-multiloop' | 'q6-integrators';
}

const DIAGRAM_LABELS: Record<ExamDiagramProps['type'], string> = {
  'q1-feedback': 'Feedback control diagram with disturbance and measurement noise',
  'q4-cart': 'Mass, spring, and damper model with applied force and positive displacement',
  'q5-multiloop': 'Two-block feedback diagram with load disturbance and sensor',
  'q6-integrators': 'State variable diagram with two integrators and feedback gains',
};

export const ExamDiagram: React.FC<ExamDiagramProps> = ({ type }) => {
  if (type === 'q1-feedback') {
    return (
      <div role="img" aria-label={DIAGRAM_LABELS[type]} className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto">
        <svg viewBox="0 0 680 185" className="w-full max-w-2xl mx-auto h-auto text-[var(--ink)]">
          <defs>
            <marker id="arr-q1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--plot-1)" />
            </marker>
          </defs>
          {/* Reference */}
          <text x="16" y="74" fill="var(--plot-1)" fontSize="13" fontWeight="600">R(s)</text>
          <line x1="48" y1="70" x2="92" y2="70" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#arr-q1)" />
          {/* Sum 1 */}
          <circle cx="106" cy="70" r="13" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.6" />
          <text x="84" y="62" fill="var(--plot-2)" fontSize="12" fontWeight="700">+</text>
          <text x="112" y="96" fill="var(--error-ink)" fontSize="13" fontWeight="700">âˆ’</text>
          {/* E(s) */}
          <line x1="119" y1="70" x2="175" y2="70" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#arr-q1)" />
          <text x="134" y="61" fill="var(--ink-secondary)" fontSize="12">E(s)</text>
          {/* Gc */}
          <rect x="178" y="50" width="76" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="1.5" />
          <text x="216" y="75" textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="600">Gc(s)</text>
          <line x1="254" y1="70" x2="306" y2="70" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#arr-q1)" />
          {/* Sum 2 (Disturbance) */}
          <circle cx="320" cy="70" r="13" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.6" />
          <text x="298" y="62" fill="var(--plot-2)" fontSize="12">+</text>
          <text x="328" y="50" fill="var(--plot-2)" fontSize="12">+</text>
          <text x="320" y="18" textAnchor="middle" fill="var(--error-ink)" fontSize="12" fontWeight="600">D(s) Disturbance</text>
          <line x1="320" y1="24" x2="320" y2="54" stroke="var(--error-ink)" strokeWidth="1.6" markerEnd="url(#arr-q1)" />
          {/* U(s) -> G(s) */}
          <line x1="333" y1="70" x2="390" y2="70" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#arr-q1)" />
          <text x="348" y="61" fill="var(--ink-secondary)" fontSize="12">U(s)</text>
          <rect x="393" y="50" width="90" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.5" />
          <text x="438" y="75" textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="600">G(s) Plant</text>
          {/* Output */}
          <line x1="483" y1="70" x2="615" y2="70" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#arr-q1)" />
          <text x="625" y="74" fill="var(--plot-3)" fontSize="13" fontWeight="600">Y(s)</text>
          {/* Pickoff */}
          <circle cx="545" cy="70" r="3.5" fill="var(--plot-3)" />
          <polyline points="545,70 545,140 468,140" fill="none" stroke="var(--ink-secondary)" strokeWidth="1.6" markerEnd="url(#arr-q1)" />
          {/* Sensor H */}
          <rect x="380" y="120" width="85" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
          <text x="422" y="145" textAnchor="middle" fill="var(--ink)" fontSize="13">H(s)</text>
          <line x1="380" y1="140" x2="294" y2="140" stroke="var(--ink-secondary)" strokeWidth="1.6" markerEnd="url(#arr-q1)" />
          {/* Noise sum */}
          <circle cx="280" cy="140" r="12" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
          <text x="255" y="177" fill="var(--error-ink)" fontSize="12" fontWeight="600">N(s) Noise</text>
          <line x1="280" y1="168" x2="280" y2="154" stroke="var(--error-ink)" strokeWidth="1.5" markerEnd="url(#arr-q1)" />
          <polyline points="268,140 106,140 106,85" fill="none" stroke="var(--ink-secondary)" strokeWidth="1.6" markerEnd="url(#arr-q1)" />
        </svg>
      </div>
    );
  }

  if (type === 'q4-cart') {
    return (
      <div role="img" aria-label={DIAGRAM_LABELS[type]} className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto">
        <svg viewBox="0 0 560 185" className="w-full max-w-xl mx-auto h-auto">
          <defs>
            <marker id="arr-q4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--plot-1)" />
            </marker>
            <marker id="arr-q4-amb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--plot-3)" />
            </marker>
          </defs>
          {/* Fixed wall with diagonal hatching */}
          <rect x="40" y="34" width="14" height="114" fill="var(--rule)" stroke="var(--ink-muted)" strokeWidth="1.5" />
          {[42, 58, 74, 90, 106, 122, 138].map((hy) => (
            <line key={hy} x1="40" y1={hy} x2="54" y2={hy - 10} stroke="var(--rule-strong)" strokeWidth="1.3" />
          ))}
          {/* Frictionless ground */}
          <line x1="40" y1="148" x2="500" y2="148" stroke="var(--rule-strong)" strokeWidth="2" />
          <text x="275" y="169" textAnchor="middle" fill="var(--ink-muted)" fontSize="11">
            Frictionless guide surface (Î¼ = 0)
          </text>
          {/* Linear Spring k */}
          <polyline
            points="54,68 92,68 100,54 112,82 124,54 136,82 148,54 160,82 168,68 212,68"
            fill="none"
            stroke="var(--plot-1)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <text x="133" y="45" textAnchor="middle" fill="var(--plot-1)" fontSize="13" fontWeight="700">
            Spring k
          </text>
          {/* Viscous Damper b */}
          <line x1="54" y1="115" x2="112" y2="115" stroke="var(--plot-2)" strokeWidth="2" />
          <polyline points="112,102 146,102 146,128 112,128" fill="none" stroke="var(--plot-2)" strokeWidth="2" />
          <line x1="129" y1="107" x2="129" y2="123" stroke="var(--plot-2)" strokeWidth="2.8" />
          <line x1="129" y1="115" x2="212" y2="115" stroke="var(--plot-2)" strokeWidth="2" />
          <text x="133" y="96" textAnchor="middle" fill="var(--plot-2)" fontSize="13" fontWeight="700">
            Damper b
          </text>
          {/* Mass M on frictionless rollers */}
          <rect x="212" y="44" width="120" height="90" rx="8" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="2" />
          <text x="272" y="94" textAnchor="middle" fill="var(--ink)" fontSize="18" fontWeight="700">
            M
          </text>
          <circle cx="236" cy="141" r="6" fill="var(--rule)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
          <circle cx="308" cy="141" r="6" fill="var(--rule)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
          {/* Displacement y(t) reference */}
          <line x1="272" y1="38" x2="272" y2="19" stroke="var(--plot-3)" strokeWidth="1.5" />
          <line x1="272" y1="21" x2="346" y2="21" stroke="var(--plot-3)" strokeWidth="2" markerEnd="url(#arr-q4-amb)" />
          <text x="356" y="25" fill="var(--plot-3)" fontSize="13" fontWeight="700">
            y(t) (+ right)
          </text>
          {/* External force u(t) acting on M */}
          <line x1="332" y1="89" x2="430" y2="89" stroke="var(--plot-1)" strokeWidth="2.4" markerEnd="url(#arr-q4)" />
          <text x="440" y="94" fill="var(--plot-1)" fontSize="14" fontWeight="700">
            u(t) (Force)
          </text>
        </svg>
      </div>
    );
  }

  if (type === 'q5-multiloop') {
    return (
      <div role="img" aria-label={DIAGRAM_LABELS[type]} className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto">
        <svg viewBox="0 0 680 195" className="w-full max-w-2xl mx-auto h-auto">
          <defs>
            <marker id="arr-q5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--plot-1)" />
            </marker>
            <marker id="arr-q5-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--error-ink)" />
            </marker>
          </defs>
          {/* R(s) -> Comparator */}
          <text x="16" y="88" fill="var(--plot-1)" fontSize="13" fontWeight="600">R(s)</text>
          <line x1="48" y1="84" x2="90" y2="84" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#arr-q5)" />
          <circle cx="104" cy="84" r="13" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.6" />
          <text x="82" y="76" fill="var(--plot-2)" fontSize="12" fontWeight="700">+</text>
          <text x="110" y="110" fill="var(--error-ink)" fontSize="13" fontWeight="700">âˆ’</text>
          {/* E(s) -> G1(s) */}
          <line x1="117" y1="84" x2="178" y2="84" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#arr-q5)" />
          <text x="147" y="74" textAnchor="middle" fill="var(--ink-secondary)" fontSize="12">E(s)</text>
          <rect x="181" y="62" width="106" height="44" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="1.6" />
          <text x="234" y="82" textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="700">Gâ‚(s)</text>
          <text x="234" y="98" textAnchor="middle" fill="var(--ink-secondary)" fontSize="10">Controller</text>
          {/* -> Disturbance Summer */}
          <line x1="287" y1="84" x2="338" y2="84" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#arr-q5)" />
          <circle cx="352" cy="84" r="13" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.6" />
          <text x="330" y="76" fill="var(--plot-2)" fontSize="12" fontWeight="700">+</text>
          <text x="360" y="64" fill="var(--plot-2)" fontSize="12" fontWeight="700">+</text>
          <text x="352" y="20" textAnchor="middle" fill="var(--error-ink)" fontSize="12" fontWeight="600">
            D(s) Load Disturbance
          </text>
          <line x1="352" y1="26" x2="352" y2="68" stroke="var(--error-ink)" strokeWidth="1.7" markerEnd="url(#arr-q5-rose)" />
          {/* V(s) -> G2(s) */}
          <line x1="365" y1="84" x2="426" y2="84" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#arr-q5)" />
          <text x="395" y="74" textAnchor="middle" fill="var(--ink-secondary)" fontSize="12">V(s)</text>
          <rect x="429" y="62" width="102" height="44" rx="6" fill="var(--surface-muted)" stroke="var(--plot-3)" strokeWidth="1.6" />
          <text x="480" y="82" textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="700">Gâ‚‚(s)</text>
          <text x="480" y="98" textAnchor="middle" fill="var(--ink-secondary)" fontSize="10">Plant</text>
          {/* Output Y(s) */}
          <line x1="531" y1="84" x2="624" y2="84" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#arr-q5)" />
          <text x="634" y="88" fill="var(--plot-3)" fontSize="13" fontWeight="700">Y(s)</text>
          {/* Feedback sensor H(s) */}
          <circle cx="578" cy="84" r="3.5" fill="var(--plot-3)" />
          <polyline points="578,84 578,154 396,154" fill="none" stroke="var(--ink-secondary)" strokeWidth="1.6" markerEnd="url(#arr-q5)" />
          <rect x="300" y="134" width="94" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--ink-secondary)" strokeWidth="1.5" />
          <text x="347" y="153" textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="600">H(s)</text>
          <text x="347" y="167" textAnchor="middle" fill="var(--ink-secondary)" fontSize="10">Sensor</text>
          <polyline points="300,154 104,154 104,99" fill="none" stroke="var(--ink-secondary)" strokeWidth="1.6" markerEnd="url(#arr-q5)" />
        </svg>
      </div>
    );
  }

  // q6-integrators (Exact state-variable diagram for A=[[0,1],[-6,-5]], B=[0,1]^T, C=[1,0])
  return (
    <div role="img" aria-label={DIAGRAM_LABELS[type]} className="rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 overflow-x-auto">
      <svg viewBox="0 0 680 185" className="w-full max-w-2xl mx-auto h-auto">
        <defs>
          <marker id="arr-q6" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--plot-1)" />
          </marker>
        </defs>
        <text x="20" y="64" fill="var(--plot-1)" fontSize="13" fontWeight="600">u(t)</text>
        <line x1="50" y1="60" x2="108" y2="60" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#arr-q6)" />
        <circle cx="122" cy="60" r="13" fill="var(--surface)" stroke="var(--ink-secondary)" strokeWidth="1.6" />
        <text x="100" y="52" fill="var(--plot-2)" fontSize="12" fontWeight="700">+</text>
        <text x="106" y="86" fill="var(--error-ink)" fontSize="13" fontWeight="700">âˆ’</text>
        <text x="128" y="86" fill="var(--error-ink)" fontSize="13" fontWeight="700">âˆ’</text>
        {/* x2_dot -> 1/s -> x2 */}
        <line x1="135" y1="60" x2="220" y2="60" stroke="var(--plot-1)" strokeWidth="1.8" markerEnd="url(#arr-q6)" />
        <text x="177" y="50" textAnchor="middle" fill="var(--ink-secondary)" fontSize="12">áº‹â‚‚(t)</text>
        <rect x="223" y="40" width="66" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-1)" strokeWidth="1.6" />
        <text x="256" y="65" textAnchor="middle" fill="var(--ink)" fontSize="14" fontWeight="600">âˆ« dt</text>
        {/* x2 -> 1/s -> x1 */}
        <line x1="289" y1="60" x2="395" y2="60" stroke="var(--plot-2)" strokeWidth="1.8" markerEnd="url(#arr-q6)" />
        <text x="342" y="50" textAnchor="middle" fill="var(--plot-2)" fontSize="12" fontWeight="600">xâ‚‚(t) = áº‹â‚</text>
        <rect x="398" y="40" width="66" height="40" rx="6" fill="var(--surface-muted)" stroke="var(--plot-2)" strokeWidth="1.6" />
        <text x="431" y="65" textAnchor="middle" fill="var(--ink)" fontSize="14" fontWeight="600">âˆ« dt</text>
        {/* x1 = y(t) */}
        <line x1="464" y1="60" x2="600" y2="60" stroke="var(--plot-3)" strokeWidth="1.8" markerEnd="url(#arr-q6)" />
        <text x="530" y="50" textAnchor="middle" fill="var(--plot-3)" fontSize="12" fontWeight="600">xâ‚(t)</text>
        <text x="610" y="64" fill="var(--plot-3)" fontSize="13" fontWeight="700">y(t) = xâ‚</text>
        {/* Feedback -5*x2 */}
        <circle cx="342" cy="60" r="3.5" fill="var(--plot-2)" />
        <polyline points="342,60 342,118 265,118" fill="none" stroke="var(--error-ink)" strokeWidth="1.5" markerEnd="url(#arr-q6)" />
        <rect x="205" y="102" width="58" height="30" rx="5" fill="var(--surface-muted)" stroke="var(--error-ink)" strokeWidth="1.4" />
        <text x="234" y="121" textAnchor="middle" fill="var(--error-ink)" fontSize="12" fontWeight="600">Ã— 5</text>
        <polyline points="205,118 128,118 128,75" fill="none" stroke="var(--error-ink)" strokeWidth="1.5" markerEnd="url(#arr-q6)" />
        {/* Feedback -6*x1 */}
        <circle cx="530" cy="60" r="3.5" fill="var(--plot-3)" />
        <polyline points="530,60 530,158 345,158" fill="none" stroke="var(--error-ink)" strokeWidth="1.5" markerEnd="url(#arr-q6)" />
        <rect x="285" y="142" width="58" height="30" rx="5" fill="var(--surface-muted)" stroke="var(--error-ink)" strokeWidth="1.4" />
        <text x="314" y="161" textAnchor="middle" fill="var(--error-ink)" fontSize="12" fontWeight="600">Ã— 6</text>
        <polyline points="285,158 115,158 115,74" fill="none" stroke="var(--error-ink)" strokeWidth="1.5" markerEnd="url(#arr-q6)" />
      </svg>
    </div>
  );
};



