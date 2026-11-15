import type {
  BlockRule,
  ExamTrap,
  FlowchartSymptom,
  LaplacePair,
  ScopeItem,
  StudyPlan,
} from '../types';

export const scopeItems: ScopeItem[] = [
  {
    parameter: 'Course Code & Name',
    evidence: 'F030100 · Automatic Control',
    status: 'CONFIRMED',
  },
  {
    parameter: 'Instructor',
    evidence: 'Prof. Woei-Leong Chan (NCKU)',
    status: 'CONFIRMED',
  },
  {
    parameter: 'Textbook',
    evidence: 'Dorf & Bishop, Modern Control Systems, 13th Ed.',
    status: 'CONFIRMED',
  },
  {
    parameter: 'Slide Archive',
    evidence: 'Intro (14 p.), Ch. 1 (26 p.), Ch. 2 (55 p.), Ch. 3 (33 p.) = 128 p.',
    status: 'CONFIRMED',
  },
  {
    parameter: 'Assigned Homework',
    evidence: 'HW 1 to HW 4 (exactly 20 assigned textbook problems)',
    status: 'CONFIRMED',
  },
  {
    parameter: 'Professor Study Advice',
    evidence: 'Textbook Examples 2.1, 2.2, 2.5, and 2.6 explicitly highlighted',
    status: 'CONFIRMED',
  },
  {
    parameter: 'Grading Weight',
    evidence: 'Midterm Exam: 30%, Final Exam: 30%, HW: 30%, Attendance: 10% (Intro p. 11)',
    status: 'CONFIRMED',
  },
  {
    parameter: 'Language Policy',
    evidence: 'Questions in English; answers permitted in English or Traditional Chinese (Intro p. 12)',
    status: 'CONFIRMED',
  },
  {
    parameter: 'Planned Schedule',
    evidence: 'Midterm originally planned for Week 9 covering Weeks 1–8 (Intro p. 9)',
    status: 'CONFIRMED',
  },
  {
    parameter: 'Core Midterm Scope',
    evidence: 'Ch. 1 (Intro), Ch. 2 (Models & TFs), Ch. 3 (State Variables)',
    status: 'STRONG INFERENCE',
  },
  {
    parameter: 'HW 4 Scope Extension',
    evidence: 'Includes state realizations (P3.4, P3.7) & transition matrix (E3.10)',
    status: 'STRONG INFERENCE',
  },
  {
    parameter: 'Ch. 4–6 Syllabus Status',
    evidence: 'Schedule slip risk; materials unreleased; exam boundary unconfirmed',
    status: 'SPECULATION',
  },
];

export const flowchartSymptoms: FlowchartSymptom[] = [
  {
    id: 'physical-diagram',
    prompt: 'Physical Diagram Given',
    cue: 'Springs, masses, dampers, base excitation, or RLC electrical circuits appear in the prompt.',
    branches: [
      {
        condition: 'Asked for Transfer Function $G(s) = Y(s)/U(s)$ under zero initial conditions',
        problemType: 'D',
        typeName: 'Physical Modeling to TF',
        firstMove: 'Draw FBD (or KVL/KCL loop), write Newton/circuit ODEs, take Laplace with zero ICs, and eliminate intermediate variables.',
        keyFormula: '$$M\\ddot{x} + b(\\dot{x} - \\dot{x}_0) + k(x - x_0) = u(t) \\implies G(s) = \\frac{Y(s)}{U(s)}$$',
        lessonId: 'laplace',
        exampleProblemIds: ['E2.21', 'P2.26'],
      },
      {
        condition: 'Asked for first-order state equations $\\dot{\\mathbf{x}} = \\mathbf{A}\\mathbf{x} + \\mathbf{B}u$',
        problemType: 'F',
        typeName: 'Physical State Modeling',
        firstMove: 'Assign state variables to independent energy-storage elements (position/velocity or $v_C / i_L$), then isolate each first derivative.',
        keyFormula: '$$\\dot{\\mathbf{x}}(t) = \\mathbf{A}\\mathbf{x}(t) + \\mathbf{B}u(t), \\qquad y(t) = \\mathbf{C}\\mathbf{x}(t) + \\mathbf{D}u(t)$$',
        lessonId: 'companion',
        exampleProblemIds: ['P3.1', 'E3.2', 'P3.8'],
      },
    ],
  },
  {
    id: 'nonlinear-law',
    prompt: 'Nonlinear Constitutive Law or Graphical Curve Given',
    cue: 'Power laws, exponentials, trigonometric torques, or empirical force-deflection plots around an equilibrium.',
    branches: [
      {
        condition: 'Analytical equation $y = g(x)$ given with operating point $x_0$',
        problemType: 'A',
        typeName: 'Analytical Taylor Linearization',
        firstMove: 'Evaluate $y_0 = g(x_0)$, differentiate $g(x)$ symbolically FIRST, then plug in $x_0$ to get tangent slope $m$.',
        keyFormula: '$$\\Delta y \\approx \\left.\\frac{dg}{dx}\\right|_{x_0} \\Delta x, \\qquad y(x) \\approx g(x_0) + m(x - x_0)$$',
        lessonId: 'linearization',
        exampleProblemIds: ['E2.2', 'P2.4', 'Ex 2.1'],
      },
      {
        condition: 'Empirical curve or force-deflection plot without an analytical formula',
        problemType: 'B',
        typeName: 'Graphical Slope Estimation',
        firstMove: 'Locate the operating point on the curve, draw a clean tangent line, and compute rise-over-run $\\Delta y / \\Delta x$ over a wide triangle.',
        keyFormula: '$$k_{\\text{local}} = m = \\frac{y_2 - y_1}{x_2 - x_1} \\implies \\Delta F \\approx m\\,\\Delta x$$',
        lessonId: 'linearization',
        exampleProblemIds: ['E2.3'],
      },
    ],
  },
  {
    id: 'ode-or-tf',
    prompt: 'Differential Equation or Laplace Transfer Function Given',
    cue: 'Scalar $n$-th order ODE or rational polynomial $T(s)$ / $Y(s)$ is provided directly.',
    branches: [
      {
        condition: 'Asked for time response $y(t)$ or steady-state value $y(\\infty)$ with step input or ICs',
        problemType: 'C',
        typeName: 'Laplace Response & FVT',
        firstMove: 'Transform ODE keeping initial conditions ($sY - y(0^-)$), multiply $T(s)$ by $1/s$ for a step input, do PFE, and check OLHP poles of $sY(s)$ before FVT.',
        keyFormula: '$$\\mathcal{L}\\{\\ddot{y}\\} = s^2 Y(s) - sy(0^-) - \\dot{y}(0^-), \\qquad y_{ss} = \\lim_{s \\to 0} s\\,Y(s)$$',
        lessonId: 'laplace',
        exampleProblemIds: ['E2.4', 'E2.19', 'E2.31', 'P2.12', 'Ex 2.2'],
      },
      {
        condition: 'Asked to convert $n$-th order ODE (or TF) into matrix state equations',
        problemType: 'F',
        typeName: 'Companion Form Realization',
        firstMove: 'Divide the entire ODE by the leading coefficient $a_n$ so it is MONIC, assign phase variables $x_1 = y, \\dots, x_n = y^{(n-1)}$, and negate bottom-row coefficients.',
        keyFormula: '$$y^{(n)} + a_{n-1}y^{(n-1)} + \\dots + a_0 y = b_0 u \\implies A_{n,\\bullet} = [-a_0, -a_1, \\dots, -a_{n-1}]$$',
        lessonId: 'companion',
        exampleProblemIds: ['E3.4', 'P3.4', 'E3.14'],
      },
    ],
  },
  {
    id: 'block-diagram',
    prompt: 'Interconnected Block Diagram Given',
    cue: 'Multiple blocks, summing junctions ($\\pm$), pickoff points, and inner/outer feedback loops.',
    branches: [
      {
        condition: 'Asked for closed-loop transfer function $T(s) = Y(s)/R(s)$ (or disturbance $Y/D$)',
        problemType: 'E',
        typeName: 'Block Diagram Reduction',
        firstMove: 'Label every intermediate node ($E, V_1, V_2$), write summing junction equations (watch $+$ vs. $-$ feedback!), and eliminate internal variables algebraically.',
        keyFormula: '$$T_{\\text{neg}}(s) = \\frac{G(s)}{1 + G(s)H(s)}, \\qquad T_{\\text{pos}}(s) = \\frac{G(s)}{1 - G(s)H(s)}$$',
        lessonId: 'block-diagram',
        exampleProblemIds: ['E2.25', 'P3.7', 'Ex 2.6'],
      },
      {
        condition: 'Asked to extract state-space equations from integrator ($1/s$) blocks',
        problemType: 'F',
        typeName: 'Block Diagram to State-Space',
        firstMove: 'Assign state variables $x_i(t)$ strictly at the OUTPUT of each $1/s$ integrator block; their INPUTS are automatically $\\dot{x}_i(t)$!',
        keyFormula: '$$\\dot{x}_i \\xrightarrow{\\;1/s\\;} x_i \\implies \\dot{x}_i(t) = \\text{sum of signals entering integrator } i$$',
        lessonId: 'companion',
        exampleProblemIds: ['E3.5', 'P3.4'],
      },
    ],
  },
  {
    id: 'state-matrices',
    prompt: 'State Matrix A (or Full A, B, C, D) Given',
    cue: 'Explicit numerical matrices $\\mathbf{A}, \\mathbf{B}, \\mathbf{C}, \\mathbf{D}$ are provided in vector-matrix form.',
    branches: [
      {
        condition: 'Asked for eigenvalues, resolvent $(s\\mathbf{I}-\\mathbf{A})^{-1}$, or state transition matrix $\\mathbf{\\Phi}(t) = e^{\\mathbf{A}t}$',
        problemType: 'G',
        typeName: 'State Transition Matrix',
        firstMove: 'Form $(s\\mathbf{I}-\\mathbf{A})$, invert via adjugate / determinant, run PFE on each entry, invert Laplace, and verify $\\mathbf{\\Phi}(0) = \\mathbf{I}$.',
        keyFormula: '$$\\mathbf{\\Phi}(t) = e^{\\mathbf{A}t} = \\mathcal{L}^{-1}\\!\\left\\{(s\\mathbf{I} - \\mathbf{A})^{-1}\\right\\}, \\qquad \\mathbf{\\Phi}(0) = \\mathbf{I}$$',
        lessonId: 'transition-matrix',
        exampleProblemIds: ['E3.10'],
      },
      {
        condition: 'Asked to compute Transfer Function $G(s)$ from state matrices',
        problemType: 'G',
        typeName: 'State-to-TF Conversion',
        firstMove: 'Compute $(s\\mathbf{I}-\\mathbf{A})^{-1}$ (or solve $(s\\mathbf{I}-\\mathbf{A})\\mathbf{Z}(s) = \\mathbf{B}$ via elimination) and pre-multiply by $\\mathbf{C}$.',
        keyFormula: '$$G(s) = \\mathbf{C}(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B} + \\mathbf{D}$$',
        lessonId: 'transition-matrix',
        exampleProblemIds: ['E3.19'],
      },
    ],
  },
  {
    id: 'dc-motor',
    prompt: 'DC Motor Specifications Given',
    cue: 'Field resistance/inductance ($R_f, L_f$), rotor inertia/damping ($J, b$), constant $I_a$ or $I_f$.',
    branches: [
      {
        condition: 'Field-controlled (constant $I_a$) or armature-controlled (constant $I_f$) motor derivation',
        problemType: 'D',
        typeName: 'DC Motor Electromechanical TF',
        firstMove: 'Verify which current is constant: in field control ($I_a = \\text{const}$), there is NO back-EMF in the field KVL, giving a pure cascade with $1/s$ to angle $\\Theta(s)$.',
        keyFormula: '$$\\frac{\\Omega(s)}{V_f(s)} = \\frac{K_m}{(L_f s + R_f)(Js + b)}, \\qquad \\frac{\\Theta(s)}{V_f(s)} = \\frac{K_m}{s(L_f s + R_f)(Js + b)}$$',
        lessonId: 'motor',
        exampleProblemIds: ['Ex 2.5'],
      },
    ],
  },
];

export const studyPlans: StudyPlan[] = [
  {
    id: '1h',
    name: '1-Hour Emergency Triage',
    duration: '60 Minutes (1.0 Hour)',
    subtitle:
      'Targeted at maximum exam ROI. Bypasses lengthy multi-mass derivations to master the four guaranteed calculation archetypes.',
    blocks: [
      {
        time: '00:00 – 00:10',
        focus: 'Review Last-Minute Cheat Sheet: Laplace pairs, FVT stability gate, 2x2 matrix inverse',
        duration: '10 min',
        targetIds: [],
      },
      {
        time: '00:10 – 00:22',
        focus: 'Active Redo: Distinct real poles partial fractions & step response $Y(s) = T(s)/s$',
        duration: '12 min',
        targetIds: ['E2.19'],
      },
      {
        time: '00:22 – 00:32',
        focus: 'Active Redo: Multiloop feedback reduction via signal equations ($V_1, V_2$ elimination)',
        duration: '10 min',
        targetIds: ['E2.25'],
      },
      {
        time: '00:32 – 00:44',
        focus: 'Active Redo: Monic 3rd-order ODE to companion state-space and state TF $G(s)$',
        duration: '12 min',
        targetIds: ['E3.4', 'E3.19'],
      },
      {
        time: '00:44 – 00:50',
        focus: 'Active Redo: Exponential thermistor Taylor linearization at $T_0 = 20^\\circ\\text{C}$',
        duration: '6 min',
        targetIds: ['E2.2'],
      },
      {
        time: '00:50 – 00:56',
        focus: 'Rapid Derivation: Field-controlled DC motor chain & FVT failure trap ($1/(s^2+1)$)',
        duration: '6 min',
        targetIds: ['Ex 2.5'],
      },
      {
        time: '00:56 – 01:00',
        focus: 'Final Mental Walkthrough: Review 10 High-Frequency Exam Traps & sign checks',
        duration: '4 min',
        targetIds: [],
      },
    ],
  },
  {
    id: '3h',
    name: '3-Hour Rapid Mastery',
    duration: '180 Minutes (3.0 Hours)',
    subtitle:
      'Balanced coverage across all 7 core problem families in Chapters 1–3, leaving no exam category unpracticed.',
    blocks: [
      {
        time: '00:00 – 00:10',
        focus: 'Exam Scope Check (3 min) + High-Yield Formula Flashcard Recall (7 min)',
        duration: '10 min',
        targetIds: [],
      },
      {
        time: '00:10 – 00:25',
        focus: 'Family 1: Taylor Linearization (thermistor $R_0 e^{-0.1T}$ and quadratic amplifier $y = x^2$)',
        duration: '15 min',
        targetIds: ['E2.2', 'P2.4'],
      },
      {
        time: '00:25 – 00:50',
        focus: 'Family 2: Laplace Response, Underdamped Quadratic & FVT Stability Gate',
        duration: '25 min',
        targetIds: ['E2.19', 'E2.31', 'P2.12'],
      },
      {
        time: '00:50 – 01:15',
        focus: 'Family 3: Physical Systems (Base-driven carriage $M\\ddot{x}_p$ & Series RLC states)',
        duration: '25 min',
        targetIds: ['E2.21', 'P3.1'],
      },
      {
        time: '01:15 – 01:35',
        focus: 'Family 4: Block Diagrams (Multiloop feedback & integrator state extraction)',
        duration: '20 min',
        targetIds: ['E2.25', 'E3.5'],
      },
      {
        time: '01:35 – 02:00',
        focus: 'Family 5: State-Space Modeling (3rd-order companion form & TF realization)',
        duration: '25 min',
        targetIds: ['E3.4', 'P3.4', 'E3.19'],
      },
      {
        time: '02:00 – 02:20',
        focus: 'Family 6: State Transition Matrix $\\mathbf{\\Phi}(t) = \\mathcal{L}^{-1}\\{(s\\mathbf{I}-\\mathbf{A})^{-1}\\}$ & $\\mathbf{\\Phi}(0)=\\mathbf{I}$ check',
        duration: '20 min',
        targetIds: ['E3.10'],
      },
      {
        time: '02:20 – 02:30',
        focus: 'Family 7: Field-Controlled DC Motor Derivation (electrical + mechanical chain)',
        duration: '10 min',
        targetIds: ['Ex 2.5'],
      },
      {
        time: '02:30 – 03:00',
        focus: 'Targeted Error Repair: Re-solve your single weakest problem + review 10 Traps',
        duration: '30 min',
        targetIds: [],
      },
    ],
  },
  {
    id: '6h',
    name: '6-Hour Deep Prep',
    duration: '360 Minutes (340 Min Study + 20 Min Breaks)',
    subtitle:
      'Multi-mass derivations, state realizations, two structured breaks, a timed 90-min simulation, and error audit.',
    blocks: [
      {
        time: '00:00 – 00:15',
        focus: 'Session Setup: Scope verification (5 min) + 10-problem diagnostic self-test (10 min)',
        duration: '15 min',
        targetIds: [],
      },
      {
        time: '00:15 – 01:10',
        focus: 'Block 1: Physical Systems Modeling (2-mass Newton elimination & RLC state setup)',
        duration: '55 min',
        targetIds: ['E2.21', 'P2.26', 'P3.1'],
      },
      {
        time: '01:10 – 01:40',
        focus: 'Block 2: Laplace Time Response (Initial conditions, repeated poles & FVT checks)',
        duration: '30 min',
        targetIds: ['E2.4', 'E2.19', 'E2.31', 'P2.12'],
      },
      {
        time: '01:40 – 01:50',
        focus: 'Break 1: Rest, hydration & physical movement',
        duration: '10 min',
        targetIds: [],
      },
      {
        time: '01:50 – 02:15',
        focus: 'Block 3: Block Diagram Algebra (Signal equations vs. node shifts, multiloop loops)',
        duration: '25 min',
        targetIds: ['E2.25', 'E3.5'],
      },
      {
        time: '02:15 – 02:35',
        focus: 'Block 4: Linearization & Operating Points (Taylor tangent, absolute line, pendulum)',
        duration: '20 min',
        targetIds: ['E2.2', 'E2.3', 'P2.4'],
      },
      {
        time: '02:35 – 03:25',
        focus: 'Block 5: State-Space Deep Dive (Companion form, $G(s)$, realization & $\\mathbf{\\Phi}(t)$)',
        duration: '50 min',
        targetIds: ['E3.4', 'E3.19', 'P3.4', 'E3.10'],
      },
      {
        time: '03:25 – 03:35',
        focus: 'Block 6: Field-Controlled DC Motor (Complete derivation of $\\Theta(s)/V_f(s)$)',
        duration: '10 min',
        targetIds: ['Ex 2.5'],
      },
      {
        time: '03:35 – 03:45',
        focus: 'Break 2: Snack, brain recharge & eye rest',
        duration: '10 min',
        targetIds: [],
      },
      {
        time: '03:45 – 05:15',
        focus: 'Block 7: Full Practice Midterm Simulation (Closed-book, strictly timed 90 min)',
        duration: '90 min',
        targetIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'],
      },
      {
        time: '05:15 – 05:50',
        focus: 'Block 8: Post-Simulation Grading, Error Log & Immediate Step Repair',
        duration: '35 min',
        targetIds: [],
      },
      {
        time: '05:50 – 06:00',
        focus: 'Block 9: Final Formula & High-Frequency Trap Consolidation',
        duration: '10 min',
        targetIds: [],
      },
    ],
  },
  {
    id: '9h',
    name: '9-Hour Full-Day Mastery',
    duration: '540 Minutes (480 Min Study + 60 Min Breaks)',
    subtitle:
      'Four 2-hour study blocks, 1 hour rest/lunch, complete 20 HW problem mastery, timed simulation, and edge-case hardening.',
    blocks: [
      {
        time: '08:30 – 10:30',
        focus: 'Session 1: Foundations & Transform Response (Scope, Diagnostic, Linearize, Laplace, Physics)',
        duration: '120 min',
        targetIds: ['E2.2', 'E2.3', 'P2.4', 'E2.19', 'E2.21', 'P2.26', 'P3.1'],
      },
      {
        time: '10:30 – 10:45',
        focus: 'Break 1: Refreshment & walk',
        duration: '15 min',
        targetIds: [],
      },
      {
        time: '10:45 – 12:45',
        focus: 'Session 2: Block Diagrams, State Space & Electromechanics (Blocks, States, $\\mathbf{\\Phi}$, Motor, Exotics)',
        duration: '120 min',
        targetIds: ['E2.25', 'E3.4', 'E3.5', 'E3.10', 'E3.19', 'P3.4', 'Ex 2.5'],
      },
      {
        time: '12:45 – 13:15',
        focus: 'Lunch Break: Wholesome meal & mental detachment',
        duration: '30 min',
        targetIds: [],
      },
      {
        time: '13:15 – 15:15',
        focus: 'Session 3: Timed Practice Midterm & Rigorous Error Audit (90 min simulation + 30 min grading)',
        duration: '120 min',
        targetIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'],
      },
      {
        time: '15:15 – 15:30',
        focus: 'Break 2: Fresh air, stretching & hydration',
        duration: '15 min',
        targetIds: [],
      },
      {
        time: '15:30 – 17:30',
        focus: 'Session 4: Spot-Checks, Weakness Repair & Final Polish (E3.2, P3.7, Ch 4–6 Pivot, Sanity Gates)',
        duration: '120 min',
        targetIds: ['E3.2', 'P3.7'],
      },
    ],
  },
];

export const laplacePairs: LaplacePair[] = [
  {
    name: 'Unit Impulse',
    timeDomain: '$\\delta(t)$',
    laplaceDomain: '$1$',
  },
  {
    name: 'Unit Step',
    timeDomain: '$u(t)$',
    laplaceDomain: '$\\frac{1}{s}$',
  },
  {
    name: 'Unit Ramp',
    timeDomain: '$t\\,u(t)$',
    laplaceDomain: '$\\frac{1}{s^2}$',
  },
  {
    name: 'Exponential',
    timeDomain: '$e^{-at}$',
    laplaceDomain: '$\\frac{1}{s + a}$',
  },
  {
    name: 'Ramp Exponential',
    timeDomain: '$t\\,e^{-at}$',
    laplaceDomain: '$\\frac{1}{(s + a)^2}$',
  },
  {
    name: 'Sine',
    timeDomain: '$\\sin(\\omega t)$',
    laplaceDomain: '$\\frac{\\omega}{s^2 + \\omega^2}$',
  },
  {
    name: 'Cosine',
    timeDomain: '$\\cos(\\omega t)$',
    laplaceDomain: '$\\frac{s}{s^2 + \\omega^2}$',
  },
  {
    name: 'Damped Sine',
    timeDomain: '$e^{-at}\\sin(\\omega t)$',
    laplaceDomain: '$\\frac{\\omega}{(s + a)^2 + \\omega^2}$',
  },
  {
    name: 'Damped Cosine',
    timeDomain: '$e^{-at}\\cos(\\omega t)$',
    laplaceDomain: '$\\frac{s + a}{(s + a)^2 + \\omega^2}$',
  },
  {
    name: 'First Derivative (Non-Zero IC)',
    timeDomain: '$\\dot{y}(t)$',
    laplaceDomain: '$sY(s) - y(0^-)$',
    note: 'Crucial when initial condition $y(0^-) \\neq 0$ (e.g., Textbook Ex 2.2).',
  },
  {
    name: 'Second Derivative (Non-Zero ICs)',
    timeDomain: '$\\ddot{y}(t)$',
    laplaceDomain: '$s^2 Y(s) - s\\,y(0^-) - \\dot{y}(0^-)$',
    note: 'Remember the $s$ multiplying $y(0^-)$, while $\\dot{y}(0^-)$ has no $s$!',
  },
];

export const blockRules: BlockRule[] = [
  {
    name: 'Cascade (Series)',
    diagramDesc: '$X \\to [G_1] \\to [G_2] \\to Y$',
    formula: '$T(s) = G_1(s)G_2(s)$',
    pitfall: 'Assumes ideal buffering with zero loading effects between blocks.',
  },
  {
    name: 'Parallel',
    diagramDesc: '$X \\to [G_1] \\pm [G_2] \\to Y$',
    formula: '$T(s) = G_1(s) \\pm G_2(s)$',
    pitfall: 'Carefully track the $+$ or $-$ sign of each branch entering the summing junction.',
  },
  {
    name: 'Negative Feedback Loop',
    diagramDesc: 'Forward $G(s)$, Feedback $-H(s)$',
    formula: '$T(s) = \\frac{G(s)}{1 + G(s)H(s)}$',
    pitfall: 'A MINUS sign on the feedback arrow produces a PLUS sign in the denominator ($1 + GH$).',
  },
  {
    name: 'Positive Feedback Loop',
    diagramDesc: 'Forward $G(s)$, Feedback $+H(s)$',
    formula: '$T(s) = \\frac{G(s)}{1 - G(s)H(s)}$',
    pitfall: 'Destabilizing! Positive feedback gives $1 - GH$, which can vanish (Ex 2.6).',
  },
  {
    name: 'Move Pickoff After Block G',
    diagramDesc: 'Tap before $G$ moved to after $G$',
    formula: 'Multiply branched path by $\\frac{1}{G(s)}$',
    pitfall: 'Signal tapped after $G$ has already been multiplied by $G$, so divide by $G$ to undo it.',
  },
  {
    name: 'Move Pickoff Before Block G',
    diagramDesc: 'Tap after $G$ moved to before $G$',
    formula: 'Multiply branched path by $G(s)$',
    pitfall: 'Branched signal lost its pass through $G$, so restore $G(s)$ in the branch.',
  },
  {
    name: 'Move Summing After Block G',
    diagramDesc: 'Sum before $G$ moved to after $G$',
    formula: 'Multiply secondary input to summing junction by $G(s)$',
    pitfall: 'Secondary input now enters after $G$, so pre-multiply it by $G(s)$ to keep $Y$ unchanged.',
  },
  {
    name: 'Move Summing Before Block G',
    diagramDesc: 'Sum after $G$ moved to before $G$',
    formula: 'Multiply secondary input to summing junction by $\\frac{1}{G(s)}$',
    pitfall: 'Secondary input will now pass through $G$, so pre-divide by $G(s)$ to compensate.',
  },
];

export const examTraps: ExamTrap[] = [
  {
    number: 1,
    title: 'Feedback Sign Confusion',
    wrongWay: 'Writing $T(s) = \\frac{G}{1 - GH}$ for a standard negative feedback loop.',
    rightWay: 'Negative feedback: denominator is $1 + GH$. Positive feedback: denominator is $1 - GH$.',
    whyStudentsLoseMarks:
      'Flipping the loop sign corrupts every pole location, DC gain, and stability conclusion downstream.',
  },
  {
    number: 2,
    title: 'Missing 1/s in Step Response',
    wrongWay: 'Applying FVT directly to $T(s)$ or inverting $T(s)$ instead of $Y(s) = T(s)U(s)$.',
    rightWay: 'Multiply by unit step $U(s) = \\frac{1}{s}$ so $Y(s) = \\frac{T(s)}{s}$, then $\\lim_{s\\to 0} sY(s) = T(0)$.',
    whyStudentsLoseMarks:
      'Inverting $T(s)$ gives the impulse response $h(t)$ rather than the step response $y(t)$!',
  },
  {
    number: 3,
    title: 'Non-Monic Companion Form',
    wrongWay: 'Putting $-a_0, -a_1, \\dots$ into the bottom row of $\\mathbf{A}$ without dividing by $a_n$.',
    rightWay: 'For $a_n y^{(n)} + \\dots + a_0 y = u$, ALWAYS divide the entire ODE by $a_n$ first!',
    whyStudentsLoseMarks:
      'Leaving $a_n \\neq 1$ scales every eigenvalue and DC gain incorrectly (e.g., forgetting $1/M$ in mass-spring-damper).',
  },
  {
    number: 4,
    title: 'Pre-Integrator Pickoff Error',
    wrongWay: 'Assigning state variable $x_i$ to the signal entering an integrator $1/s$.',
    rightWay: 'Tapping BEFORE $1/s$ gives derivative $\\dot{x}_i$; tapping AFTER $1/s$ gives state $x_i$.',
    whyStudentsLoseMarks:
      'Every row of $\\mathbf{A}$ and $\\mathbf{C}$ shifts or gets scrambled if $\\dot{x}_i$ and $x_i$ are swapped.',
  },
  {
    number: 5,
    title: 'Blind FVT on Oscillators or RHP Poles',
    wrongWay: 'Claiming $\\lim_{t\\to\\infty} y(t) = \\lim_{s\\to 0} s\\frac{1}{s^2+1} = 0$ for $y(t) = \\sin(t)$.',
    rightWay: 'Check poles of $sY(s)$ FIRST! If any pole lies on the $j\\omega$-axis or RHP, FVT is invalid and the limit does not exist.',
    whyStudentsLoseMarks:
      'Writing $0$ for an undamped oscillator or $\\frac{1}{s-1}$ receives zero credit—graders explicitly look for the OLHP pole check.',
  },
  {
    number: 6,
    title: 'Resolvent 2x2 Adjugate Sign Error',
    wrongWay: 'Forgetting to negate off-diagonal entries of $(s\\mathbf{I}-\\mathbf{A})$ when taking the $2\\times 2$ inverse.',
    rightWay: '$\\operatorname{adj}\\begin{bmatrix} s-a & -b \\\\ -c & s-d \\end{bmatrix} = \\begin{bmatrix} s-d & +b \\\\ +c & s-a \\end{bmatrix}$. Diagonal swaps; off-diagonals negate!',
    whyStudentsLoseMarks:
      'Sign errors in off-diagonal resolvent entries ruin $\\mathbf{\\Phi}(t)$ and break the $\\dot{\\mathbf{\\Phi}}(0) = \\mathbf{A}$ check.',
  },
  {
    number: 7,
    title: 'Perturbation vs. Absolute Value',
    wrongWay: 'Reporting $\\Delta y = m\\,\\Delta x$ when the absolute tangent line $y(x)$ is asked (or vice versa).',
    rightWay: 'Deviation model is $\\Delta y = m\\,\\Delta x$; absolute tangent line is $y(x) \\approx y_0 + m(x - x_0)$. Keep baseline $y_0$!',
    whyStudentsLoseMarks:
      'Dropping $y_0$ shifts the entire linearized prediction by a constant bias.',
  },
  {
    number: 8,
    title: 'DC Motor Model Confusion',
    wrongWay: 'Adding a back-EMF term $K_b\\omega(t)$ inside the field circuit KVL of a field-controlled motor.',
    rightWay: 'Field control ($I_a = \\text{const}$) has NO back-EMF feedback because field coils are stationary; only armature control has $E_b$.',
    whyStudentsLoseMarks:
      'Adding a fictitious back-EMF loop turns a pure cascade into a coupled feedback system with wrong poles.',
  },
  {
    number: 9,
    title: 'Dropping Non-Zero Initial Conditions',
    wrongWay: 'Assuming $Y(s) = G(s)U(s)$ when $y(0^-) \\neq 0$ or $\\dot{y}(0^-) \\neq 0$.',
    rightWay: 'Use $\\mathcal{L}\\{\\dot{y}\\} = sY - y(0^-)$ and $\\mathcal{L}\\{\\ddot{y}\\} = s^2Y - sy(0^-) - \\dot{y}(0^-)$ so zero-input response is included.',
    whyStudentsLoseMarks:
      'Zero-input terms often dominate early transient behavior (Textbook Ex 2.2).',
  },
  {
    number: 10,
    title: 'Repeated Poles Missing First-Order Term in PFE',
    wrongWay: 'Expanding $\\frac{N(s)}{(s+p)^2}$ using only $\\frac{B}{(s+p)^2}$ and skipping $\\frac{A}{s+p}$.',
    rightWay: 'For $(s+p)^2$, expansion MUST include $\\frac{A}{s+p} + \\frac{B}{(s+p)^2}$, giving $Ae^{-pt} + Bte^{-pt}$.',
    whyStudentsLoseMarks:
      'Omitting $\\frac{A}{s+p}$ leaves an unsolvable algebraic contradiction when matching numerator coefficients.',
  },
];

export const sanityGates: { title: string; check: string; why: string }[] = [
  {
    title: 'DC Gain Check ($s \\to 0$)',
    check: 'Evaluate $G(0) = \\lim_{s\\to 0} G(s)$ and match it to static equilibrium physics.',
    why: 'At steady state, derivatives vanish ($\\dot{y} = \\ddot{y} = 0$): a mechanical cart must reduce to Hooke\'s Law $G(0) = 1/k$, instantly catching missing $M$ or sign errors.',
  },
  {
    title: 'Initial Conditions Audit',
    check: 'Re-read the prompt: are initial conditions zero, or is $y(0^-) \\neq 0$ / $\\dot{y}(0^-) \\neq 0$?',
    why: 'If any IC is non-zero, $\\mathcal{L}\\{\\ddot{y}\\}$ injects $-sy(0^-) - \\dot{y}(0^-)$ into the numerator; missing this drops the entire zero-input response.',
  },
  {
    title: 'State Transition Identity Check',
    check: 'Plug $t = 0$ into your $\\mathbf{\\Phi}(t)$ matrix and verify $\\mathbf{\\Phi}(0) = \\mathbf{I}$ ($1$s on diagonal, $0$s off-diagonal).',
    why: 'Also check $\\dot{\\mathbf{\\Phi}}(0) = \\mathbf{A}$; any PFE sign or residue slip breaks $\\mathbf{\\Phi}(0) = \\mathbf{I}$ immediately.',
  },
  {
    title: 'Feedback Sign Audit',
    check: 'Verify every negative feedback loop has $+GH$ in the denominator ($1 + G(s)H(s)$) and every positive loop has $-GH$.',
    why: 'A single flipped sign in a minor inner loop propagates through the entire closed-loop transfer function.',
  },
  {
    title: 'Monic ODE Check',
    check: 'Confirm you divided the $n$-th order differential equation by leading coefficient $a_n$ before writing companion $\\mathbf{A}$ and $\\mathbf{B}$.',
    why: 'Companion form requires $y^{(n)} + \\dots = b_0 u$; forgetting to divide by $M$ or $a_n$ ruins both $\\mathbf{A}$ and $\\mathbf{B}$.',
  },
];

export const ch46Pivot: {
  warning: string;
  topics: { title: string; formulas: string[]; note: string }[];
  taEmailTemplate: string;
} = {
  warning:
    'Course Intro Slide 9 originally scheduled the midterm in Week 9 covering Weeks 1–8 (which listed Ch. 4–6 topics), yet only Ch. 1–3 slides and HW 1–4 were released due to a syllabus catch-up delay. Assume Ch. 1–3 are 80–100% of marks—and if your TA or Moodle confirms Ch. 4–6 are included, pivot immediately to these three essentials:',
  topics: [
    {
      title: 'Priority 1: Routh-Hurwitz Stability Criterion (Ch. 6)',
      formulas: [
        '$$q(s) = a_n s^n + a_{n-1}s^{n-1} + \\dots + a_1 s + a_0 = 0$$',
        '$$b_1 = \\frac{a_{n-1}a_{n-2} - a_n a_{n-3}}{a_{n-1}}, \\qquad b_2 = \\frac{a_{n-1}a_{n-4} - a_n a_{n-5}}{a_{n-1}}$$',
      ],
      note: 'Number of unstable RHP roots equals the number of sign changes in the first column. Replace a first-column $0$ with $\\epsilon > 0$; for an all-zero row, differentiate the auxiliary polynomial $A(s)$ from the row above.',
    },
    {
      title: 'Priority 2: Standard 2nd-Order Transient Specs (Ch. 5)',
      formulas: [
        '$$T(s) = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}, \\qquad T_p = \\frac{\\pi}{\\omega_n\\sqrt{1 - \\zeta^2}}$$',
        '$$\\%\\text{OS} = 100\\,e^{-\\frac{\\zeta\\pi}{\\sqrt{1 - \\zeta^2}}}, \\qquad T_s\\,(2\\%) = \\frac{4}{\\zeta\\omega_n}, \\qquad T_r \\approx \\frac{2.16\\zeta + 0.60}{\\omega_n}\\;(0.3 \\le \\zeta \\le 0.8)$$',
      ],
      note: 'Applies to prototypical underdamped ($0 < \\zeta < 1$) 2nd-order systems with no finite zeros. Remember $\\omega_d = \\omega_n\\sqrt{1 - \\zeta^2}$ and $\\sigma = \\zeta\\omega_n$.',
    },
    {
      title: 'Priority 3: Steady-State Tracking Errors & System Types (Ch. 5)',
      formulas: [
        '$$K_p = \\lim_{s\\to 0} G(s) \\implies e_{ss,\\text{step}} = \\frac{1}{1 + K_p}$$',
        '$$K_v = \\lim_{s\\to 0} s\\,G(s) \\implies e_{ss,\\text{ramp}} = \\frac{1}{K_v}, \\qquad K_a = \\lim_{s\\to 0} s^2 G(s) \\implies e_{ss,\\text{parabola}} = \\frac{1}{K_a}$$',
      ],
      note: 'For unity feedback with open-loop $G(s)$: Type 0 (0 integrators) has finite step error; Type 1 (1 integrator) has 0 step error and finite ramp error; Type 2 (2 integrators) has 0 step & ramp error.',
    },
  ],
  taEmailTemplate:
    'Dear TA, could you please clarify the exact midterm coverage? Does the exam cover strictly Chapters 1–3 and HW1–4, or are Chapters 4, 5, and 6 (time-domain specs, steady-state error, and Routh stability) also included? Thank you!',
};

export const notationGlossary: {
  symbol: string;
  lecture: string;
  textbook: string;
  trap: string;
}[] = [
  {
    symbol: 'Phase Variables',
    lecture: '$y_1 = y,\\; y_2 = \\dot{y} = v$',
    textbook: '$x_1,\\; x_2$',
    trap: 'Prof. Chan frequently uses $y$ (position) and $v$ (velocity) in Ch. 3 pp. 5–8 before formalizing $\\mathbf{x} = [x_1, x_2]^T$.',
  },
  {
    symbol: 'System Input',
    lecture: '$r(t)$ or $u(t)$',
    textbook: '$r(t)$ (ref) / $u(t)$ (input)',
    trap: '$r(t)$ denotes external reference/setpoint in Ch. 2; $u(t)$ is standard control input in Ch. 3 state space. Do not confuse!',
  },
  {
    symbol: 'Motor Constant',
    lecture: '$K_m = K_1 K_f I_a$',
    textbook: '$K_m$ (torque) / $K_b$ (EMF)',
    trap: 'In field control, $K_m$ is the overall torque constant [$\\text{N}\\cdot\\text{m}/\\text{A}$]. In armature control, $K_m$ is torque constant and $K_b$ is back-EMF constant.',
  },
  {
    symbol: 'Transition Matrix',
    lecture: '$\\mathbf{\\Phi}(t) = e^{\\mathbf{A}t}$',
    textbook: '$\\mathbf{\\Phi}(t)$ or $\\exp(\\mathbf{A}t)$',
    trap: 'State transition matrix $\\mathbf{\\Phi}(t)$ is strictly in the TIME domain. The resolvent $(s\\mathbf{I} - \\mathbf{A})^{-1}$ is in the LAPLACE $s$-domain.',
  },
  {
    symbol: 'Stiffness vs. Gain',
    lecture: '$k$ vs. $K$',
    textbook: '$k$ vs. $K$',
    trap: 'Mechanical spring stiffness is lowercase $k$ [$\\text{N}/\\text{m}$]. Controller/amplifier gains are uppercase $K$. Do not cancel them!',
  },
  {
    symbol: 'Feedback Signal',
    lecture: '$B(s)$ in Ch. 2',
    textbook: '$\\mathbf{B}$ matrix in Ch. 3',
    trap: '$B(s) = H(s)Y(s)$ is the feedback signal in Ch. 2 block diagrams; $\\mathbf{B}$ is the $n \\times m$ input matrix in Ch. 3. Totally unrelated!',
  },
  {
    symbol: 'Tracking Error',
    lecture: '$E(s) = R(s) - Y_m(s)$',
    textbook: '$E(s) = R(s) - B(s)$',
    trap: 'True tracking error is $e = r - y$. If the sensor is non-unity ($H(s) \\neq 1$), the actuating error $e_a = r - Hy$ is NOT equal to physical error $r - y$.',
  },
];
