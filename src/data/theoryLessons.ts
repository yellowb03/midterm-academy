import type { TheoryLesson } from '../types';

export const theoryLessons: TheoryLesson[] = [
  // =========================================================================
  // LESSON 1: FEEDBACK CONTROL & WHY SENSITIVITY DROPS
  // =========================================================================
  {
    id: 'ch1-feedback',
    number: 1,
    chapterTag: 'Chapter 1 · Feedback Principles',
    title: 'Feedback Control & Why Sensitivity Drops',
    subtitle: 'Open vs. Closed Loop, Sensitivity $S_G^T$, Disturbance vs. Noise, and the Stability Paradox',
    examWeight: '10–15% of Midterm (Conceptual & Short-Answer)',
    labId: 'feedback',
    labTitle: 'Interactive Feedback Loop & Sensitivity Explorer',
    labPrompt:
      'Vary the forward gain $G$, sensor gain $H$, and plant drift $\\Delta G$ to watch closed-loop sensitivity collapse—and see what happens when loop gain meets phase lag.',
    intuitionHook:
      'Imagine steering a car down a windy highway. Open-loop control is closing your eyes and turning the wheel according to a memorized script—the slightest crosswind pushes you off the road. Closed-loop feedback is keeping your eyes open: you measure where the car actually is, compare it to the lane center, and continuously steer out the error.',
    mentalModel: [
      'Every closed-loop control system has 4 physical roles: Controller $G_c(s)$, Actuator $G_a(s)$, Plant $G_p(s)$, and Sensor $H(s)$.',
      'Feedback divides plant parameter drift and external disturbances by the return difference $1 + G(s)H(s)$—the bigger the loop gain, the smaller the sensitivity $S_G^T = \\frac{1}{1 + GH}$.',
      'The fundamental trade-off: high loop gain crushes disturbances $D(s)$, but sensor noise $N(s)$ passes straight into the output when $H(s) = 1$.',
      'Negative feedback does NOT guarantee stability: high gain plus $-180^\\circ$ phase lag flips negative feedback into positive feedback!',
    ],
    sections: [
      {
        heading: '1. Open-Loop vs. Closed-Loop & The 4 Core Components',
        explanation:
          'An open-loop system feeds the reference $R(s)$ straight through a plant $G(s)$ with no measurement: $Y(s) = G(s)R(s)$. If the plant ages, heats up, or gets hit by wind, the output drifts blindly. A closed-loop system adds a measurement channel $H(s)$ and a summing junction to form the actuating error $E_a(s) = R(s) - H(s)Y(s)$. Notice Prof. Chan’s notation distinction: the true physical tracking error is $e(t) = r(t) - y(t)$, which equals the actuating error only for unity feedback ($H(s) = 1$).\n\nIn Prof. Chan’s Chapter 1 case studies—the UAV Auto-Steering system (rate gyro/magnetometer sensor, heading computer controller, rudder servo actuator, aircraft aerodynamic plant) and the Rotating Disk Turntable Speed Control (tachometer $v_t = k_t \\omega$ sensing shaft speed to reject load friction $T_d$)—those four roles always appear.',
        math: '$$Y_{\\text{open}}(s) = G(s)R(s) \\qquad \\text{vs.} \\qquad T(s) = \\frac{Y(s)}{R(s)} = \\frac{G(s)}{1 + G(s)H(s)}$$',
        whyItWorks:
          'If $|G(s)H(s)| \\gg 1$, then $T(s) \\approx \\frac{G(s)}{G(s)H(s)} = \\frac{1}{H(s)}$. Remarkably, the closed-loop input-to-output behavior stops depending on the messy, drifting plant $G(s)$ and instead depends almost entirely on your clean, calibrated sensor $H(s)$!',
        visualNote:
          'Loop anatomy: $R(s) \\to [+] \\Sigma [-] \\to G_c(s) \\to G_a(s) \\to [+\\text{ }D(s)] \\to G_p(s) \\to Y(s)$, with $Y(s)$ tapped back through Sensor $H(s)$ (plus Noise $N(s)$) to the input summer.',
      },
      {
        heading: '2. Why Sensitivity Drops: $S_G^T = \\frac{1}{1 + GH}$',
        explanation:
          'System sensitivity $S_G^T$ measures the percentage change in the overall transfer function $T$ caused by a percentage change in the plant $G$: $S_G^T = \\frac{\\partial T / T}{\\partial G / G}$. In open loop ($T = G$), a $20\\%$ drop in $G$ causes a full $20\\%$ drop in $Y$, so $S_G^T = 1$. In closed loop ($T = \\frac{G}{1+GH}$), differentiating $T$ with respect to $G$ reveals that the return difference $(1 + GH)$ attenuates the sensitivity.',
        math: '$$S_G^T = \\frac{G}{T} \\frac{\\partial T}{\\partial G} = \\frac{1}{1 + G(s)H(s)}$$',
        whyItWorks:
          'Think of it like a self-correcting thermostat. If the heater weakens by $20\\%$, the room stays slightly cooler for a moment, which keeps the error $e = r - y$ larger, which automatically tells the controller to drive the heater harder until the shortfall is mostly erased.',
      },
      {
        heading: '3. Disturbance Rejection vs. Sensor Noise: The Fundamental Trade-Off',
        explanation:
          'Two unwanted signals invade real control loops at different points. A load disturbance $D(s)$ (wind gust, friction torque $T_d$) enters *inside* the forward path before the plant $G_p(s)$. Measurement noise $N(s)$ enters *inside* the feedback path right after the sensor $H(s)$. Setting $R(s) = 0$ and solving separately gives two very different transfer functions, with loop gain $L(s) = G_c(s)G_p(s)H(s)$ (assuming $G_a$ is absorbed into $G_c$ or $G_p$):',
        math: '$$\\frac{Y_D(s)}{D(s)} = \\frac{G_p(s)}{1 + G_c(s)G_p(s)H(s)}, \\qquad \\frac{Y_N(s)}{N(s)} = \\frac{-G_c(s)G_p(s)}{1 + G_c(s)G_p(s)H(s)}$$',
        whyItWorks:
          'Because $D(s)$ sits downstream of the controller $G_c(s)$, cranking up controller gain $G_c$ makes the denominator $1 + L$ huge while the numerator $G_p$ stays fixed—crushing disturbances! By contrast, $N(s)$ sits right beside $Y_m(s)$: the controller cannot tell whether a sudden wiggle in $y_m$ came from a real disturbance or from a noisy sensor, so for $|L| \\gg 1$ and $H=1$, $\\frac{Y_N}{N} \\approx -1$. You cannot simultaneously reject high-frequency sensor noise and low-frequency disturbances with high gain at all frequencies!',
      },
      {
        heading: '4. The Feedback Stability Paradox & 7-Step Design Sequence',
        explanation:
          'A classic exam misconception is claiming "negative feedback always stabilizes a system." That is FALSE! While negative feedback can stabilize an unstable plant (like balancing an inverted pendulum), it can also *destabilize* a perfectly stable plant. If the forward path has higher-order dynamics or time delays, its phase lag can reach $-180^\\circ$ at a frequency $\\omega$ where $|G(j\\omega)H(j\\omega)| \\ge 1$.\n\nProf. Chan’s slides also highlight the 7-Step Engineering Design Sequence (Ch. 1 pp. 12–14): (1) Establish control goals, (2) Identify variables to control, (3) Write quantitative specs ($e_{ss}$, overshoot $M_p$, settling time $T_s$), (4) Establish system configuration (sensors/actuators), (5) Obtain mathematical models, (6) Design controller & tune parameters, (7) Analyze performance & iterate.',
        math: '$$G(j\\omega)H(j\\omega) = -|GH| \\implies 1 + G(j\\omega)H(j\\omega) = 1 - |GH| \\le 0 \\quad (-180^\\circ \\text{ flips } - \\text{ to } +!)$$',
        whyItWorks:
          'A $-180^\\circ$ phase shift literally multiplies a sinusoid by $-1$. Subtracting a signal that has already been inverted by $-1$ turns into *adding* it—so the "corrective" nudge arrives one half-cycle late and pushes the swing higher and higher until the system blows up.',
      },
    ],
    workedWalkthrough: {
      title: 'Turntable Speed Control: Quantifying Sensitivity & Disturbance Rejection',
      context:
        'A DC-motor turntable (Ch. 1 pp. 21–24, Dorf Ex 1.13) has steady-state forward gain $G_c G_p = 50$ and tachometer feedback gain $H = 0.2$ (with $G_p = 5$, $G_c = 10$). Compare open-loop vs. closed-loop when (a) motor/plant gain drops by $20\\%$ due to heating, and (b) a load friction torque disturbance $D(s) = 1/s$ hits the plant.',
      steps: [
        {
          title: 'Compute the Loop Gain and Closed-Loop Sensitivity',
          math: '$$L(0) = G_c G_p H = (50)(0.2) = 10 \\implies S_G^T = \\frac{1}{1 + L(0)} = \\frac{1}{1 + 10} = \\frac{1}{11} \\approx 0.0909$$',
          reasoning:
            'The return difference $1 + GH = 11$ acts as a protective shield around the plant.',
          tip: 'Always check whether the problem gives $G_c$ and $G_p$ separately or as a combined $G = G_c G_p$.',
        },
        {
          title: 'Compare Output Drift Under a 20% Plant Gain Drop',
          math: '$$\\text{Open-loop: } \\frac{\\Delta Y}{Y} = (1)(-20\\%) = -20\\% \\qquad \\text{Closed-loop: } \\frac{\\Delta T}{T} \\approx S_G^T \\cdot \\frac{\\Delta G}{G} = \\frac{1}{11}(-20\\%) \\approx -1.82\\%$$',
          reasoning:
            'In open loop, every percent of motor wear goes straight to the turntable speed. Closed-loop feedback shrinks that $20\\%$ error down to under $2\\%$.',
        },
        {
          title: 'Compare Steady-State Speed Sag from Load Torque Disturbance $D$',
          math: '$$Y_{D,\\text{open}} = G_p D = 5D, \\qquad Y_{D,\\text{closed}} = \\frac{G_p}{1 + G_c G_p H} D = \\frac{5}{11} D \\approx 0.455 D$$',
          reasoning:
            'Feedback cuts the disturbance-induced speed sag by the exact same factor of $1 + GH = 11$.',
        },
        {
          title: 'Check the Cost: Sensor Noise Impact',
          math: '$$Y_N = \\frac{-G_c G_p}{1 + G_c G_p H} N = \\frac{-50}{11} N \\approx -4.55 N$$',
          reasoning:
            'Because $H = 0.2$, the closed-loop gain from $R$ to $Y$ is $\\frac{50}{11} \\approx \\frac{1}{H} = 5$. Any tachometer noise $N$ gets scaled by the same $-4.55$ factor, proving why clean sensors matter.',
        },
      ],
      takeaway:
        'Feedback trades sensor cost and noise sensitivity for dramatic reductions in plant sensitivity ($\\div (1+GH)$) and load disturbance error ($\\div (1+GH)$), provided loop phase lag does not push $1 + GH$ unstable.',
    },
    conceptChecks: [
      {
        id: 'ch1-q1',
        question:
          'A closed-loop system has $G(0) = 18$ and $H(0) = 0.5$. If the plant gain $G(0)$ drifts downward by $20\\%$, approximately how much does the closed-loop DC gain $T(0)$ drop?',
        choices: [
          {
            text: '$2\\%$',
            correct: true,
            feedback:
              'Spot on! Loop gain is $GH = 18(0.5) = 9$, so $S_G^T = \\frac{1}{1 + 9} = 0.1$. A $20\\%$ drop in $G$ causes only a $0.1 \\times 20\\% = 2\\%$ drop in $T$.',
          },
          {
            text: '$20\\%$',
            correct: false,
            feedback:
              'That would be true for an open-loop system ($S_G^T = 1$). Negative feedback divides the sensitivity by $1 + GH = 10$.',
          },
          {
            text: '$18\\%$',
            correct: false,
            feedback:
              'Careful—you subtracted $2\\%$ instead of dividing by $1 + GH$! Use $S_G^T = \\frac{1}{1+GH} = 0.1$, then multiply $0.1 \\times 20\\%$.',
          },
          {
            text: '$1.1\\%$',
            correct: false,
            feedback:
              'Almost, but check $GH$: $18 \\times 0.5 = 9$, so $1 + GH = 10$, not $1 + 18 = 19$. Always multiply $G$ by $H$!',
          },
        ],
      },
      {
        id: 'ch1-q2',
        question:
          'Why can applying negative feedback around a stable open-loop plant make the closed-loop system unstable?',
        choices: [
          {
            text: 'Higher-order lag or delay can shift the feedback phase by $-180^\\circ$ where $|GH| \\ge 1$, turning negative feedback into positive feedback.',
            correct: true,
            feedback:
              'Exactly! A $-180^\\circ$ phase shift inverts the returning signal, so subtracting an inverted signal adds to the input and drives growing oscillations.',
          },
          {
            text: 'Negative feedback always moves poles toward the right-half plane when $H(s) \\neq 1$.',
            correct: false,
            feedback:
              'Not true—non-unity $H(s)$ does not automatically destabilize a loop, and moderate negative feedback often improves damping and stability.',
          },
          {
            text: 'Measurement noise $N(s)$ forces the characteristic polynomial $1 + GH$ to change its degree.',
            correct: false,
            feedback:
              'Noise $N(s)$ is an external signal, not a pole-moving parameter inside $1 + G(s)H(s)$. Stability depends on the roots of $1 + G(s)H(s) = 0$.',
          },
          {
            text: 'Open-loop stability means $S_G^T = 1$, which cannot coexist with $1 + GH$.',
            correct: false,
            feedback:
              'Sensitivity $S_G^T = 1$ simply describes open-loop parameter sensitivity, not instability.',
          },
        ],
      },
      {
        id: 'ch1-q3',
        question:
          'In a unity-feedback loop ($H(s) = 1$) with very large forward gain $|G_c(s)G_p(s)| \\gg 1$, how do load disturbance $D(s)$ and sensor noise $N(s)$ affect the output $Y(s)$?',
        choices: [
          {
            text: '$D(s)$ is strongly attenuated, while $N(s)$ passes to the output with gain $\\approx -1$.',
            correct: true,
            feedback:
              'Correct! $Y_D/D = \\frac{G_p}{1+G_c G_p} \\to 0$ as $G_c \\to \\infty$, whereas $Y_N/N = \\frac{-G_c G_p}{1+G_c G_p} \\to -1$. That is the classic disturbance-vs-noise trade-off.',
          },
          {
            text: 'Both $D(s)$ and $N(s)$ are reduced to near zero by high controller gain $G_c$.',
            correct: false,
            feedback:
              'Watch the numerator of $Y_N/N$: $G_c G_p$ sits in BOTH numerator and denominator, so high $G_c$ cannot attenuate sensor noise!',
          },
          {
            text: '$N(s)$ is attenuated, while $D(s)$ passes straight through with gain $1$.',
            correct: false,
            feedback:
              'You swapped them! $G_c$ sits in front of $D(s)$ (helping reject it), whereas $N(s)$ enters at the sensor right where the controller mistakes it for output error.',
          },
          {
            text: 'Neither $D(s)$ nor $N(s)$ affects $Y(s)$ because $E(s) = R(s) - Y(s)$ cancels them.',
            correct: false,
            feedback:
              'The summing junction only measures $Y + N$, so it cannot distinguish $N$ from $Y$, and $D$ still leaks through $\\frac{G_p}{1+G_c G_p}$.',
          },
        ],
      },
    ],
    tipsAndTraps: {
      shortcuts: [
        'For any unity-feedback loop ($H = 1$) with high DC loop gain $L(0) \\gg 1$, closed-loop DC gain approaches $1$ and sensitivity approaches $1/L(0)$.',
        'To remember where $D(s)$ vs. $N(s)$ sit in the numerator: trace from the disturbance/noise injection point *forward* to $Y(s)$ for the numerator, and put $1 + \\text{loop gain}$ in the denominator!',
      ],
      traps: [
        'Claiming "negative feedback guarantees stability"—Prof. Chan specifically tests the Feedback Stability Paradox.',
        'Confusing physical error $e = r - y$ with actuating error $e_a = r - Hy$ when $H(s) \\neq 1$.',
        'Forgetting that sensor noise $N(s)$ is NOT rejected by increasing controller gain $G_c$.',
      ],
      memorize: [
        '$T(s) = \\frac{G(s)}{1 + G(s)H(s)}$ (negative feedback), $\\quad S_G^T = \\frac{1}{1 + G(s)H(s)}$',
        '$Y_D(s) = \\frac{G_p}{1 + G_c G_p H} D(s), \\qquad Y_N(s) = \\frac{-G_c G_p}{1 + G_c G_p H} N(s)$',
      ],
    },
    relatedProblemIds: ['E2.4', 'P2.12', 'E2.25'],
  },

  // =========================================================================
  // LESSON 2: LINEARIZATION: ZOOMING IN UNTIL CURVES LOOK STRAIGHT
  // =========================================================================
  {
    id: 'ch2-linearization',
    number: 2,
    chapterTag: 'Chapter 2 · Section 2.3 (Types A & B)',
    title: 'Linearization: Zooming In Until Curves Look Straight',
    subtitle: 'Taylor Expansion, Pendulum Ex 2.1, Perturbation $\\Delta y = m\\Delta x$ vs. Tangent Line, and Graphical Slope',
    examWeight: '10–15% of Midterm (Likely Computational)',
    labId: 'linearization',
    labTitle: 'Operating-Point Tangent & Perturbation Lab',
    labPrompt:
      'Drag the operating point $x_0$ along nonlinear curves ($\\sin\\theta$, $e^{-0.1T}$, hardening spring) to watch the tangent slope $m = g\'(x_0)$ tilt—and see how large $\\Delta x$ breaks the approximation.',
    intuitionHook:
      'From space, the Earth is unmistakably round. Yet when you lay tile on your kitchen floor, you treat the ground as completely flat—because over a small neighborhood, every smooth curve looks indistinguishable from its tangent line. Control linearization does the exact same thing around an operating point.',
    mentalModel: [
      'Laplace transforms require linearity (superposition), which nonlinear functions like $\\sin\\theta$, $e^{-0.1T}$, or $y^3$ violate.',
      'Taylor linearization replaces a curve $y = g(x)$ near $x_0$ with its straight tangent line: slope $m = g\'(x_0)$ depends completely on where $x_0$ sits.',
      'Always separate deviation variables ($\\Delta x = x - x_0$, $\\Delta y = y - y_0 \\implies \\Delta y = m\\Delta x$) from absolute tangent coordinates ($y \\approx y_0 + m(x - x_0)$).',
      'On an empirical plot (Type B, HW E2.3), stiffness is the local tangent slope $\\frac{dF}{dy}$, NEVER the secant $F(y_0)/y_0$ from the origin!',
    ],
    sections: [
      {
        heading: '1. Why Nonlinear Systems Break Laplace (and How Taylor Saves Us)',
        explanation:
          'The Laplace transform is built on linearity: doubling the input must double the output, and the response to $u_1 + u_2$ must equal the sum of individual responses. A thermistor $R(T) = 10\\,000 e^{-0.1 T}$ or a pendulum torque $T(\\theta) = M g L \\sin\\theta$ breaks superposition—doubling $\\theta$ does NOT double $\\sin\\theta$.\n\nTo unlock transfer functions, we pick an equilibrium or steady-state operating point $x_0$, compute the baseline $y_0 = g(x_0)$, and expand $g(x)$ in a Taylor series around $x_0$, keeping only the constant and first-derivative terms while discarding $(x - x_0)^2$ and higher powers.',
        math: '$$y = g(x) = g(x_0) + \\left.\\frac{dg}{dx}\\right|_{x_0}(x - x_0) + \\frac{1}{2!}\\left.\\frac{d^2g}{dx^2}\\right|_{x_0}(x - x_0)^2 + \\cdots \\approx y_0 + m(x - x_0)$$',
        whyItWorks:
          'If perturbations $\\Delta x = x - x_0$ are small (say $|\\Delta x| \\ll 1$), then $(\\Delta x)^2$ is tiny and $(\\Delta x)^3$ is microscopic. Dropping those higher-order terms leaves a purely proportional relation between deviations.',
      },
      {
        heading: '2. Deviation Model ($\\Delta y = m\\Delta x$) vs. Absolute Tangent Line',
        explanation:
          'Exam problems frequently ask for "the linear model for small variations around $x_0$"—and students lose easy points by mixing up deviation variables with total variables. Define $\\Delta x = x - x_0$ and $\\Delta y = y - y_0$. Subtracting $y_0 = g(x_0)$ from both sides of the Taylor formula gives the pure linear perturbation law:',
        math: '$$\\Delta y \\approx m \\Delta x, \\quad \\text{where } m = \\left.\\frac{dg}{dx}\\right|_{x_0} \\qquad \\text{vs.} \\qquad y \\approx y_0 + m(x - x_0)$$',
        whyItWorks:
          'In control engineering, $\\Delta y = m\\Delta x$ passes directly through the origin $(0,0)$ in perturbation space, which is required for a transfer function $\\frac{\\Delta Y(s)}{\\Delta X(s)} = m$. The absolute form $y \\approx y_0 + m(x - x_0)$ includes the constant bias $y_0 - m x_0$ needed when plotting on the original $(x, y)$ axes.',
        visualNote:
          'Notice HW E2.2: $R(T) = 10\\,000 e^{-0.1T}$ at $T_0 = 20^\\circ\\text{C}$ gives $R\'(20) = -1000 e^{-2} \\approx -135.3\\,\\Omega/^\\circ\\text{C}$. Deviation model: $\\Delta R = -135\\,\\Delta T$. Absolute line: $R(T) \\approx 1353.4 - 135.3(T - 20)$. Never write $R = -135 T$!',
      },
      {
        heading: '3. The Zero-Slope Pitfall & Changing Operating Points',
        explanation:
          'Because $m = g\'(x_0)$ is evaluated *at* $x_0$, changing the operating point changes the linear model! For a pendulum $T(\\theta) = M g L \\sin\\theta$, the stiffness at the bottom equilibrium ($\\theta_0 = 0$) is $M g L \\cos(0) = M g L$, whereas at $\\theta_0 = \\pi/6$ it drops to $0.866 M g L$.\n\nWhat if $g\'(x_0) = 0$ (for example, at the horizontal peak $\\theta_0 = \\pi/2$ where $\\cos(\\pi/2) = 0$)? Then $\\Delta y \\approx 0 \\cdot \\Delta x$. That does NOT mean the system is broken or identically constant—it means the *first-order* slope happens to be flat at that extremum, so curvature (second-order terms) governs larger excursions.',
        math: '$$\\left.\\frac{d}{d\\theta}(M g L \\sin\\theta)\\right|_{\\theta_0 = \\pi/2} = M g L \\cos\\left(\\frac{\\pi}{2}\\right) = 0 \\implies \\Delta T \\approx 0 \\cdot \\Delta\\theta$$',
        whyItWorks:
          'At a smooth peak or valley, the tangent line is horizontal. A horizontal tangent accurately reflects that tiny nudges produce almost zero first-order change, even though moving further away bends downward.',
      },
      {
        heading: '4. Type B: Graphical Slope Estimation (HW E2.3)',
        explanation:
          'When no equation is given—only an experimental plot like Force $F$ vs. Deflection $y$ in Fig. E2.3—you still use $k_s = \\left.\\frac{dF}{dy}\\right|_{y_0}$, but you measure the derivative geometrically from a straight **tangent line** drawn at $y_0$:',
        math: '$$k_{\\text{eff}} = \\left.\\frac{dF}{dy}\\right|_{y_0} \\approx \\left.\\frac{\\Delta F}{\\Delta y}\\right|_{\\text{tangent at } y_0} = \\frac{F_2 - F_1}{y_2 - y_1}$$',
        whyItWorks:
          'Pick two widely spaced points $(y_1, F_1)$ and $(y_2, F_2)$ along the drawn tangent line (or symmetric points like $y_0 \\pm 0.25\\text{ cm}$ around $y_0 = 0.5\\text{ cm}$ in E2.3) to minimize visual reading error. Preserve the graph’s exact axis units (e.g., force-scale divisions/cm when Newtons aren’t specified), and always remember that a tangent only holds locally—over a wide $\\pm 1.5\\text{ cm}$ range in E2.3, the spring stiffens in compression and softens near breaking.',
      },
    ],
    workedWalkthrough: {
      title: 'Pendulum Restoring Torque Linearization (Prof. Chan’s Recommended Ex 2.1)',
      context:
        'A simple pendulum of mass $M$ and length $L$ experiences gravitational restoring torque $T(\\theta) = M g L \\sin\\theta$. Derive the linear model for small variations $\\Delta\\theta$ around (a) $\\theta_0 = 0\\text{ rad}$ and (b) $\\theta_0 = \\pi/6\\text{ rad}$ ($30^\\circ$), stating both the deviation model and the absolute tangent equation.',
      steps: [
        {
          title: 'Differentiate the Nonlinear Torque Law Symbolically',
          math: '$$\\frac{dT}{d\\theta} = \\frac{d}{d\\theta}(M g L \\sin\\theta) = M g L \\cos\\theta$$',
          reasoning:
            'Always differentiate *before* plugging in the operating point $\\theta_0$. If you plug in $\\theta_0$ first, you get a constant whose derivative is zero!',
          tip: 'Exam reflex: compute $g\'(x)$ symbolically on line 1 of every Type A problem.',
        },
        {
          title: 'Part (a): Evaluate at $\\theta_0 = 0\\text{ rad}$',
          math: '$$T_0 = M g L \\sin(0) = 0, \\qquad m_1 = M g L \\cos(0) = M g L$$',
          reasoning:
            'At the bottom hang-down equilibrium, the baseline torque is zero and $\\cos(0) = 1$ gives maximum restoring slope.',
        },
        {
          title: 'State the Linear Model for Part (a)',
          math: '$$\\Delta T \\approx (M g L)\\,\\Delta\\theta \\qquad \\text{or} \\qquad T(\\theta) \\approx (M g L)\\theta$$',
          reasoning:
            'Because $\\theta_0 = 0$ and $T_0 = 0$, the deviation model and absolute tangent line happen to look identical—which is why $\\sin\\theta \\approx \\theta$ works near zero.',
        },
        {
          title: 'Part (b): Evaluate at $\\theta_0 = \\pi/6\\text{ rad}$ ($30^\\circ$)',
          math: '$$T_0 = M g L \\sin\\left(\\frac{\\pi}{6}\\right) = 0.5 M g L, \\qquad m_2 = M g L \\cos\\left(\\frac{\\pi}{6}\\right) = \\frac{\\sqrt{3}}{2} M g L \\approx 0.866 M g L$$',
          reasoning:
            'Held at $30^\\circ$, gravity already exerts a steady baseline torque of $0.5 M g L$, and the local incremental slope is gentler ($0.866 M g L$).',
        },
        {
          title: 'State Deviation vs. Absolute Model for Part (b)',
          math: '$$\\Delta T \\approx 0.866 M g L\\,\\Delta\\theta \\qquad \\text{and} \\qquad T(\\theta) \\approx 0.5 M g L + 0.866 M g L\\left(\\theta - \\frac{\\pi}{6}\\right)$$',
          reasoning:
            'Here $\\Delta T = T - 0.5 M g L$ and $\\Delta\\theta = \\theta - \\pi/6$. Writing $T \\approx 0.866 M g L\\,\\theta$ without the $T_0$ offset would be wrong!',
        },
      ],
      takeaway:
        'Small-angle approximation $\\sin\\theta \\approx \\theta$ is strictly a special case at $\\theta_0 = 0$. At any non-zero angle $\\theta_0$, the slope becomes $M g L \\cos\\theta_0$ and you must keep $T_0$ if writing total torque $T(\\theta)$.',
    },
    conceptChecks: [
      {
        id: 'ch2-lin-q1',
        question:
          'For the thermistor $R(T) = 10\\,000 e^{-0.1T}\\,\\Omega$ operating at $T_0 = 20^\\circ\\text{C}$ (HW E2.2), which equation is the correct linear deviation model?',
        choices: [
          {
            text: '$\\Delta R \\approx -135\\,\\Delta T\\,\\Omega$',
            correct: true,
            feedback:
              'Yes! $\\frac{dR}{dT} = -0.1(10\\,000)e^{-0.1T}$. At $T_0 = 20$, $m = -1000 e^{-2} \\approx -135.3\\,\\Omega/^\\circ\\text{C}$, so $\\Delta R \\approx -135\\,\\Delta T$.',
          },
          {
            text: '$\\Delta R \\approx +135\\,\\Delta T\\,\\Omega$',
            correct: false,
            feedback:
              'Watch the chain-rule minus sign! $\\frac{d}{dT}e^{-0.1T} = -0.1 e^{-0.1T}$. This is an NTC thermistor: hotter temperature means *lower* resistance.',
          },
          {
            text: '$R(T) \\approx -135 T\\,\\Omega$',
            correct: false,
            feedback:
              'Trap! You replaced deviation variables $\\Delta R, \\Delta T$ with absolute variables $R, T$, dropping the baseline $R(20) \\approx 1353\\,\\Omega$.',
          },
          {
            text: '$\\Delta R \\approx -1353\\,\\Delta T\\,\\Omega$',
            correct: false,
            feedback:
              'You evaluated $R(20) = 1353\\,\\Omega$ instead of multiplying by $-0.1$ from the chain rule.',
          },
        ],
      },
      {
        id: 'ch2-lin-q2',
        question:
          'On an empirical force-deflection plot (like HW E2.3), at $y_0 = 0.5\\text{ cm}$ the curve passes through $F_0 = 1.0\\text{ div}$, while a ruler tangent to the curve at $y_0 = 0.5\\text{ cm}$ rises by $0.55\\text{ div}$ over $\\Delta y = 0.5\\text{ cm}$. What is the effective spring constant $k_s$?',
        choices: [
          {
            text: '$k_s \\approx 1.1\\text{ div/cm}$ (local tangent slope)',
            correct: true,
            feedback:
              'Correct! Incremental stiffness is $k_s = \\frac{dF}{dy}|_{y_0} \\approx \\frac{\\Delta F}{\\Delta y} = \\frac{0.55}{0.5} = 1.1\\text{ div/cm}$.',
          },
          {
            text: '$k_s = \\frac{F_0}{y_0} = 2.0\\text{ div/cm}$',
            correct: false,
            feedback:
              'Classic Type B trap! $F_0 / y_0$ is the *secant* slope from $(0,0)$ to $(y_0, F_0)$, NOT the local tangent derivative $dF/dy$.',
          },
          {
            text: '$k_s = 0.55\\text{ N/cm}$',
            correct: false,
            feedback:
              'Two issues: you forgot to divide by $\\Delta y = 0.5\\text{ cm}$, and you invented Newtons when the graph axis only gives divisions!',
          },
          {
            text: '$k_s = 1.0\\text{ div/cm}$',
            correct: false,
            feedback:
              'That is the baseline force value $F_0$, not the slope of the curve at $y_0$.',
          },
        ],
      },
      {
        id: 'ch2-lin-q3',
        question:
          'If a smooth nonlinear function $y = g(x)$ has derivative $g\'(x_0) = 0$ at operating point $x_0$, what does the first-order linear model $\\Delta y \\approx 0 \\cdot \\Delta x$ tell you?',
        choices: [
          {
            text: 'First-order sensitivity vanishes at that extremum; any variation for larger $\\Delta x$ comes from higher-order (quadratic+) terms.',
            correct: true,
            feedback:
              'Exactly! At a peak or trough the tangent is horizontal, so linear response is zero to first order—though $y(x)$ itself can still curve away for non-tiny $\\Delta x$.',
          },
          {
            text: 'The function $g(x)$ must be broken or discontinuous at $x_0$.',
            correct: false,
            feedback:
              'A zero derivative actually requires $g(x)$ to be smooth and flat at $x_0$, like $\\sin\\theta$ at $\\theta_0 = \\pi/2$.',
          },
          {
            text: 'The output $y(x)$ equals zero for all $x$.',
            correct: false,
            feedback:
              '$\\Delta y = y - y_0 \\approx 0$ only says $y$ stays near its baseline $y_0 = g(x_0)$ for tiny $\\Delta x$, not that $y_0 = 0$!',
          },
          {
            text: 'You must use the secant slope $g(x_0)/x_0$ instead.',
            correct: false,
            feedback:
              'Never replace the derivative with a secant from the origin—the secant measures average ratio from zero, not local perturbation slope.',
          },
        ],
      },
    ],
    tipsAndTraps: {
      shortcuts: [
        'For perturbation models $\\Delta y = m\\Delta x$, you only need $m = g\'(x_0)$. Compute $y_0 = g(x_0)$ only if asked for the absolute tangent line or validity check.',
        'In graphical problems (E2.3), extend your tangent line across the grid to read clean grid intersections (or pick symmetric $\\pm 0.25$ bounds around $y_0$).',
      ],
      traps: [
        'Forgetting negative signs in chain-rule derivatives like $\\frac{d}{dT}(e^{-0.1T}) = -0.1 e^{-0.1T}$.',
        'Writing $y = m x$ instead of $\\Delta y = m \\Delta x$ or $y = y_0 + m(x - x_0)$.',
        'Dividing $F(y_0)/y_0$ (secant from origin) instead of measuring local tangent slope $\\Delta F/\\Delta y$ on a graph.',
        'Assuming a local tangent remains accurate across huge excursions (like $\\pm 1.5\\text{ cm}$ in E2.3).',
      ],
      memorize: [
        '$\\Delta y \\approx \\left.\\frac{dg}{dx}\\right|_{x_0} \\Delta x, \\qquad y \\approx g(x_0) + \\left.\\frac{dg}{dx}\\right|_{x_0}(x - x_0)$',
        'Pendulum Ex 2.1: $T(\\theta) = M g L \\sin\\theta \\implies m = M g L \\cos\\theta_0$',
      ],
    },
    relatedProblemIds: ['Ex 2.1', 'E2.2', 'E2.3', 'P2.4'],
  },

  // =========================================================================
  // LESSON 3: THE LAPLACE LENS, PARTIAL FRACTIONS & FVT
  // =========================================================================
  {
    id: 'ch2-laplace',
    number: 3,
    chapterTag: 'Chapter 2 · Section 2.4 (Type C)',
    title: 'The Laplace Lens, Partial Fractions & FVT',
    subtitle: 'Non-Zero ICs (Ex 2.2), Zero-Input vs. Zero-State, Complex Poles (E2.31), and the FVT Stability Gate',
    examWeight: '20–25% of Midterm (Very High Probability)',
    labId: 'laplace',
    labTitle: 'Pole-Zero & Time-Response Inspector',
    labPrompt:
      'Move real and complex poles around the $s$-plane to watch exponential decay, damped sinusoids, and the instant where imaginary-axis poles break the Final Value Theorem.',
    intuitionHook:
      'Differential equations force you to wrestle with derivatives and integrals in time. Putting on the "Laplace lens" turns differentiation into simple multiplication by $s$—converting an entire calculus problem into high-school polynomial algebra, while neatly packing initial energy $y(0), \\dot{y}(0)$ right into the numerator.',
    mentalModel: [
      'Derivatives in $s$-domain carry initial-condition kicks: $\\mathcal{L}\\{\\ddot{y}\\} = s^2 Y(s) - s y(0) - \\dot{y}(0)$.',
      'Total response splits cleanly into Forced (zero-state) + Natural (zero-input) response.',
      'For complex poles ($\\Delta < 0$), complete the square $(s+\\alpha)^2 + \\omega_d^2$ immediately instead of forcing complex arithmetic.',
      'NEVER apply Final Value Theorem without passing the 3-Step Stability Gate: every pole of $s Y(s)$ must lie strictly in the open Left-Half Plane ($\\operatorname{Re}(p) < 0$)!',
    ],
    sections: [
      {
        heading: '1. Calculus to Algebra: Non-Zero Initial Conditions & Response Splitting',
        explanation:
          'Integrating by parts from $0$ to $\\infty$ gives the exact derivative transform rules. When solving a second-order ODE $a\\ddot{y} + b\\dot{y} + cy = r(t)$ with non-zero initial conditions $y(0)$ and $\\dot{y}(0)$ (as in Prof. Chan’s recommended **Example 2.2**), carry those initial values into the algebra—then watch $Y(s)$ split naturally into two meaningful halves:',
        math: '$$\\mathcal{L}\\{\\dot{y}\\} = s Y(s) - y(0), \\qquad \\mathcal{L}\\{\\ddot{y}\\} = s^2 Y(s) - s y(0) - \\dot{y}(0)$$\n$$Y(s) = \\underbrace{\\frac{R(s)}{a s^2 + b s + c}}_{Y_{\\text{forced}}(s)\\text{ (zero-state)}} + \\underbrace{\\frac{a s y(0) + a\\dot{y}(0) + b y(0)}{a s^2 + b s + c}}_{Y_{\\text{natural}}(s)\\text{ (zero-input)}}$$',
        whyItWorks:
          'Because the system is linear, the total motion is the sum of (1) how the external input $R(s)$ pushes a resting system (zero-state / forced response) and (2) how the stored initial energy $y(0), \\dot{y}(0)$ rings down on its own (zero-input / natural response). Also remember: when asked for a **unit step response** of $G(s)$, $R(s) = \\frac{1}{s}$, so $Y(s) = \\frac{G(s)}{s}$—inverting $G(s)$ alone gives the *impulse* response!',
      },
      {
        heading: '2. Partial Fractions: Cover-Up, Complex Conjugates & Repeated Poles',
        explanation:
          'Once you have $Y(s) = \\frac{N(s)}{D(s)}$ (strictly proper: degree of $N <$ degree of $D$), factor $D(s)$ by pole type:\n• **Distinct real poles** $\\frac{A}{s} + \\frac{B}{s+p_1} + \\frac{C}{s+p_2}$: use Heaviside cover-up $B = \\left.(s+p_1)Y(s)\\right|_{s=-p_1}$. Shortcut for a unit step $Y(s) = G(s)/s$: the constant residue $A$ at $s=0$ is always $G(0)$!\n• **Complex conjugate poles** (like HW **E2.31**: $V(s) = \\frac{500}{s^2 + 8s + 500}$): complete the square $s^2 + 2\\zeta\\omega_n s + \\omega_n^2 = (s + \\alpha)^2 + \\omega_d^2$, where $\\alpha = \\zeta\\omega_n$ and $\\omega_d = \\sqrt{c - \\alpha^2}$ (in E2.31: $(s+4)^2 + 484 = (s+4)^2 + 22^2$, NOT $\\sqrt{500}$!).\n• **Repeated real poles** $\\frac{K_1}{s+p} + \\frac{K_2}{(s+p)^2}$: invert $\\frac{1}{(s+p)^2}$ to $t e^{-pt}$.',
        math: '$$\\mathcal{L}^{-1}\\left\\{\\frac{\\omega_d}{(s+\\alpha)^2 + \\omega_d^2}\\right\\} = e^{-\\alpha t}\\sin(\\omega_d t), \\qquad \\mathcal{L}^{-1}\\left\\{\\frac{s+\\alpha}{(s+\\alpha)^2 + \\omega_d^2}\\right\\} = e^{-\\alpha t}\\cos(\\omega_d t)$$',
        whyItWorks:
          'In the $s$-plane, the real part $-\\alpha$ of the pole $s = -\\alpha \\pm j\\omega_d$ sets the exponential decay envelope $e^{-\\alpha t}$, while the imaginary part $\\omega_d$ sets the oscillation frequency. Completing the square exposes $(\\alpha, \\omega_d)$ in one algebraic move.',
      },
      {
        heading: '3. The 3-Step Final Value Theorem (FVT) Stability Gate & Fatal Trap',
        explanation:
          'The Final Value Theorem gives a 5-second shortcut to steady state: $\\lim_{t\\to\\infty} y(t) = \\lim_{s\\to 0} s Y(s)$. **However, FVT is conditional!** Before plugging in $s = 0$, run the mandatory 3-Step Stability Gate:\n1. Form $s Y(s)$ and cancel any $s$ in numerator/denominator.\n2. Inspect ALL poles of $s Y(s)$.\n3. Verify that **every** pole of $s Y(s)$ satisfies $\\operatorname{Re}(p) < 0$ (strictly inside the open Left-Half Plane).\n\nIf ANY pole of $s Y(s)$ lies on the imaginary axis ($\\pm j\\omega$, or a leftover $1/s$) or in the Right-Half Plane ($\\operatorname{Re}(p) > 0$), FVT is **INVALID**!',
        math: '$$\\text{TRAP: } Y(s) = \\frac{1}{s(s^2 + 1)} \\implies s Y(s) = \\frac{1}{s^2 + 1} \\xrightarrow{\\text{blind } s\\to 0} 1 \\quad (\\text{FALSE! Poles at } \\pm j!)$$',
        whyItWorks:
          'For $Y(s) = \\frac{1}{s(s^2+1)}$, the actual time response is $y(t) = 1 - \\cos(t)$, which oscillates eternally between $0$ and $2$ and has NO limit as $t \\to \\infty$. Setting $s = 0$ blindly averages out the oscillation and invents a fake limit of $1$—a classic zero-credit exam blunder!',
      },
      {
        heading: '4. Three-Point Verification Protocol',
        explanation:
          'After inverting $Y(s)$ to $y(t)$, catch arithmetic mistakes in 15 seconds with three checks: (1) plug $t = 0$ into $y(t)$ and confirm it equals the given $y(0)$ (and $\\lim_{s\\to\\infty} s Y(s)$ via Initial Value Theorem); (2) differentiate $y(t)$ at $t=0$ and confirm $\\dot{y}(0)$ matches; (3) if all poles of $s Y(s)$ are in the open LHP, confirm $\\lim_{t\\to\\infty} y(t)$ equals FVT.',
        math: '$$y(0^+) = \\lim_{s\\to\\infty} s Y(s), \\qquad y(\\infty) = \\lim_{s\\to 0} s Y(s) \\;\\text{(only if all poles of } sY(s) \\text{ have } \\operatorname{Re}(p) < 0\\text{)}$$',
        whyItWorks:
          'Partial fraction residues are tightly coupled: a single sign slip in one residue almost always breaks $y(0)$ or $\\dot{y}(0)$. Testing $t=0$ and $t\\to\\infty$ catches errors before you turn in your paper.',
      },
    ],
    workedWalkthrough: {
      title: '2nd-Order ODE with Non-Zero Initial Conditions (Prof. Chan’s Recommended Ex 2.2)',
      context:
        'Solve $\\ddot{y} + 4\\dot{y} + 3y = 2 r(t)$ where $r(t) = 1$ (unit step for $t \\ge 0$) with initial conditions $y(0) = 1$ and $\\dot{y}(0) = 0$. Find $y(t)$ and verify steady state via FVT.',
      steps: [
        {
          title: 'Take the Laplace Transform Term-by-Term Including ICs',
          math: '$$[s^2 Y(s) - s(1) - 0] + 4[s Y(s) - 1] + 3 Y(s) = \\frac{2}{s}$$',
          reasoning:
            'Every derivative brings in initial conditions: $\\ddot{y} \\to s^2 Y - s y(0) - \\dot{y}(0)$ and $4\\dot{y} \\to 4[s Y - y(0)]$. Do not drop the $-4(1)$ term!',
        },
        {
          title: 'Group $Y(s)$ and Combine Numerator Over Common Denominator',
          math: '$$(s^2 + 4s + 3) Y(s) - (s + 4) = \\frac{2}{s} \\implies Y(s) = \\underbrace{\\frac{2}{s(s+1)(s+3)}}_{Y_{\\text{forced}}} + \\underbrace{\\frac{s+4}{(s+1)(s+3)}}_{Y_{\\text{natural}}} = \\frac{s^2 + 4s + 2}{s(s+1)(s+3)}$$',
          reasoning:
            'Factor $s^2 + 4s + 3 = (s+1)(s+3)$. Combining forced and natural parts into one fraction lets us do one clean partial-fraction expansion.',
          tip: 'Notice you can also check $Y_{\\text{forced}}$ and $Y_{\\text{natural}}$ separately if a problem asks you to label each response!',
        },
        {
          title: 'Find Residues by Heaviside Cover-Up',
          math: '$$Y(s) = \\frac{A}{s} + \\frac{B}{s+1} + \\frac{C}{s+3}$$\n$$A = \\left.\\frac{s^2 + 4s + 2}{(s+1)(s+3)}\\right|_{s=0} = \\frac{2}{3}, \\quad B = \\left.\\frac{1 - 4 + 2}{(-1)(2)}\\right|_{s=-1} = \\frac{1}{2}, \\quad C = \\left.\\frac{9 - 12 + 2}{(-3)(-2)}\\right|_{s=-3} = -\\frac{1}{6}$$',
          reasoning:
            'Cover up the factor corresponding to each pole and evaluate the remaining ratio at that pole value.',
        },
        {
          title: 'Invert to Time Domain & Run the 3-Point Sanity Check + FVT Gate',
          math: '$$y(t) = \\frac{2}{3} + \\frac{1}{2}e^{-t} - \\frac{1}{6}e^{-3t}, \\quad t \\ge 0$$',
          reasoning:
            'Check 1: $y(0) = \\frac{2}{3} + \\frac{1}{2} - \\frac{1}{6} = 1$ (matches $y(0)=1$!). Check 2: $\\dot{y}(0) = -\\frac{1}{2} + \\frac{3}{6} = 0$ (matches $\\dot{y}(0)=0$!). Check 3 (FVT Gate): $s Y(s) = \\frac{s^2+4s+2}{(s+1)(s+3)}$ has poles only at $s=-1, -3$ (strictly open LHP), so FVT is valid and gives $y(\\infty) = \\frac{2}{3}$.',
        },
      ],
      takeaway:
        'Non-zero ICs enter the numerator polynomial alongside $R(s)$. Carrying them cleanly and verifying $y(0)$, $\\dot{y}(0)$, and the FVT pole gate guarantees full marks.',
    },
    conceptChecks: [
      {
        id: 'ch2-lap-q1',
        question:
          'Given $Y(s) = \\frac{5}{s(s^2 + 9)}$, a student applies FVT and writes $\\lim_{t\\to\\infty} y(t) = \\lim_{s\\to 0} \\frac{5}{s^2 + 9} = \\frac{5}{9}$. Why is this wrong?',
        choices: [
          {
            text: 'FVT is invalid because $s Y(s) = \\frac{5}{s^2 + 9}$ has imaginary-axis poles at $s = \\pm j3$, so $y(t)$ oscillates forever.',
            correct: true,
            feedback:
              'Spot on! FVT requires all poles of $s Y(s)$ to have $\\operatorname{Re}(p) < 0$. Here $y(t) = \\frac{5}{9}(1 - \\cos 3t)$ never settles to a limit.',
          },
          {
            text: 'They forgot to multiply by another factor of $s$, so it should be $0$.',
            correct: false,
            feedback:
              'They correctly formed $s Y(s) = \\frac{5}{s^2 + 9}$. The error is not the algebra—it is that the FVT condition fails on $j\\omega$-axis poles!',
          },
          {
            text: 'They should evaluate at $s \\to \\infty$ instead of $s \\to 0$.',
            correct: false,
            feedback:
              '$s \\to \\infty$ is the *Initial* Value Theorem ($y(0^+)$), not the Final Value Theorem.',
          },
          {
            text: 'The denominator $s^2 + 9$ is missing a damping term, so $y(t)$ blows up to $+\\infty$.',
            correct: false,
            feedback:
              'Simple poles at $\\pm j3$ produce bounded, sustained oscillation ($\\cos 3t$), not exponential blow-up—still, no final limit exists.',
          },
        ],
      },
      {
        id: 'ch2-lap-q2',
        question:
          'For $V(s) = \\frac{500}{s^2 + 8s + 500}$ (HW E2.31), what is the correct completed-square denominator and damped frequency $\\omega_d$?',
        choices: [
          {
            text: '$(s + 4)^2 + 22^2$, so $\\alpha = 4$ and $\\omega_d = 22\\text{ rad/s}$.',
            correct: true,
            feedback:
              'Exactly! $s^2 + 8s + 16 + (500 - 16) = (s+4)^2 + 484 = (s+4)^2 + 22^2$, yielding $v(t) = \\frac{250}{11} e^{-4t}\\sin(22t)$.',
          },
          {
            text: '$(s + 4)^2 + 500$, so $\\omega_d = \\sqrt{500} \\approx 22.36\\text{ rad/s}$.',
            correct: false,
            feedback:
              'Careful! When you group $(s+4)^2 = s^2 + 8s + 16$, you must subtract $4^2 = 16$ from $500$ to get $484 = 22^2$.',
          },
          {
            text: '$(s + 8)^2 + 436$, so $\\alpha = 8$.',
            correct: false,
            feedback:
              'You forgot to halve the middle coefficient $8$: $(s + b/2)^2 = (s + 4)^2$.',
          },
          {
            text: '$(s + 4)^2 - 22^2$, giving hyperbolic functions $\\sinh(22t)$.',
            correct: false,
            feedback:
              '$500 - 16 = +484 > 0$, so the sign is $+22^2$ (complex conjugate poles $\\to$ damped sine), not $-22^2$.',
          },
        ],
      },
      {
        id: 'ch2-lap-q3',
        question:
          'A system has transfer function $G(s) = \\frac{6(s+50)}{s^2 + 40s + 300}$ (HW E2.4). Asked for the unit step response $y(t)$, a student immediately computes $\\mathcal{L}^{-1}\\{G(s)\\}$. What did they compute?',
        choices: [
          {
            text: 'The impulse response, because they forgot to multiply $G(s)$ by the step input $R(s) = 1/s$.',
            correct: true,
            feedback:
              'Yes! By definition, $Y(s) = G(s)R(s) = \\frac{G(s)}{s}$ for a unit step. Inverting $G(s)$ alone corresponds to $R(s) = 1$ (unit impulse).',
          },
          {
            text: 'The natural (zero-input) response.',
            correct: false,
            feedback:
              'Transfer functions assume zero initial conditions, so there is no zero-input response here—they inverted the impulse response.',
          },
          {
            text: 'The steady-state response only.',
            correct: false,
            feedback:
              'Inverting $G(s)$ produces the full transient *impulse* response, which actually decays to $0$ rather than the step steady-state value $G(0) = 1$.',
          },
          {
            text: 'The exact unit step response, since $1/s$ is already implied by $G(s)$.',
            correct: false,
            feedback:
              'Never assume $1/s$ is built into $G(s)$! $G(s) = Y(s)/R(s)$ is input-independent; you must multiply by $R(s) = 1/s$.',
          },
        ],
      },
    ],
    tipsAndTraps: {
      shortcuts: [
        'For any stable unit-step response $Y(s) = G(s)/s$, the constant term in partial fractions is immediately $A = G(0)$ by inspection.',
        'For complex denominator $s^2 + b s + c$ with constant numerator $K$: $\\mathcal{L}^{-1}\\{\\frac{K}{(s+\\alpha)^2 + \\omega_d^2}\\} = \\frac{K}{\\omega_d} e^{-\\alpha t}\\sin(\\omega_d t)$ where $\\alpha = b/2$ and $\\omega_d = \\sqrt{c - \\alpha^2}$.',
      ],
      traps: [
        'Blindly applying FVT to $1/(s(s^2 + \\omega^2))$ or RHP poles—always run the 3-Step Stability Gate on $s Y(s)$ first.',
        'Inverting $G(s)$ instead of $G(s)/s$ when asked for the step response.',
        'Dropping $-s y(0)$ or $-\\dot{y}(0)$ (or the $-b y(0)$ term from $b\\dot{y}$) when transforming a 2nd-order ODE with non-zero ICs.',
        'Computing $\\omega_d = \\sqrt{c}$ instead of $\\sqrt{c - (b/2)^2}$ when completing the square.',
      ],
      memorize: [
        '$\\mathcal{L}\\{\\ddot{y}\\} = s^2 Y(s) - s y(0) - \\dot{y}(0)$',
        'FVT: $\\lim_{t\\to\\infty} y(t) = \\lim_{s\\to 0} s Y(s)$ ONLY if all poles of $s Y(s)$ satisfy $\\operatorname{Re}(p) < 0$.',
      ],
    },
    relatedProblemIds: ['Ex 2.2', 'E2.4', 'E2.19', 'E2.31', 'P2.12'],
  },

  // =========================================================================
  // LESSON 4: PHYSICAL MODELING & THE FIELD-CONTROLLED DC MOTOR
  // =========================================================================
  {
    id: 'ch2-physical-motor',
    number: 4,
    chapterTag: 'Chapter 2 · Sections 2.2 & 2.5 (Type D + DC Motor)',
    title: 'Physical Modeling & The Field-Controlled DC Motor',
    subtitle: 'Through/Across Variables, Relative FBD Motion (E2.21/P2.26), KVL/KCL, and Prof. Chan’s 8-Slide Motor Derivation',
    examWeight: '25–35% of Midterm (Highest Combined Weight)',
    labId: 'motor',
    labTitle: 'Field-Controlled DC Motor & Mechanical FBD Lab',
    labPrompt:
      'Adjust field resistance $R_f$, inductance $L_f$, inertia $J$, and damping $b$ to inspect the cascaded time constants $\\tau_f, \\tau_m$ and see why $1/s$ turns speed into unbounded ramp position.',
    intuitionHook:
      'Springs, dampers, inductors, capacitors, and DC motors look like totally different worlds—until you realize they all obey the exact same "effort vs. flow" accounting. And in Prof. Chan’s 8-slide DC motor derivation, one clever trick (keeping armature current $I_a$ constant) snaps the feedback wire completely off, leaving a crystal-clear forward cascade.',
    mentalModel: [
      'Through variables (Force $F$, Torque $T$, Current $i$) pass through an element; Across variables (velocity diff $\\Delta v$, voltage drop $\\Delta V$) are measured across its two ends.',
      'In multi-mass FBDs (E2.21, P2.26), dampers and springs feel *relative* motion $(x_2 - x_1)$ and obey Newton’s 3rd Law action-reaction pairs.',
      'Field-controlled DC motor ($I_a = \\text{const}$) has ZERO back-EMF feedback: it is a pure cascade of Field Lag $\\frac{1}{L_f s + R_f}$ $\\to$ Torque $K_m$ $\\to$ Rotor Lag $\\frac{1}{Js + b}$ $\\to$ Integrator $\\frac{1}{s}$.',
      'Always sanity-check physical TFs at DC ($s \\to 0$) and high frequency ($s \\to \\infty$)!',
    ],
    sections: [
      {
        heading: '1. Through vs. Across Variables & Mechanical FBDs (Relative Motion)',
        explanation:
          'Chapter 1–2 classifies every physical variable as either a **Through variable** (flows through an element: Force $F$, Torque $T$, Current $i$, Fluid flow $Q$) or an **Across variable** (measured across two terminals: Velocity difference $v_2 - v_1$, Angular velocity difference $\\omega_2 - \\omega_1$, Voltage drop $v_1 - v_2$, Pressure drop $\\Delta P$).\n\nWhen two bodies (or a mass $M$ and a moving base $x_{\\text{in}}$) share a spring $k$ and damper $b$, those elements stretch and compress according to the **relative** displacement and velocity:',
        math: '$$F_d = b(\\dot{x}_1 - \\dot{x}_2) \\longleftrightarrow b s [X_1(s) - X_2(s)], \\qquad F_s = k(x_1 - x_2) \\longleftrightarrow k[X_1(s) - X_2(s)]$$',
        whyItWorks:
          'By Newton’s Third Law, if the coupling pulls Mass 1 forward with $+f_{\\text{int}}$, it MUST pull Mass 2 backward with $-f_{\\text{int}}$ (as in the two-mass flexible robot arm **P2.26**). And in a **base-excited carriage** (**E2.21**), moving the base $x_{\\text{in}}$ pushes through *both* the spring $k_d$ and damper $b_d$, which is why $(b_d s + k_d)$ appears directly in the numerator of $\\frac{X_p(s)}{X_{\\text{in}}(s)}$!',
      },
      {
        heading: '2. Electrical Circuits (KVL/KCL) & Prof. Chan’s RLC Topology Alert',
        explanation:
          'Under zero initial conditions, passive electrical elements behave like algebraic $s$-domain impedances: Resistor $V_R = R I$, Inductor $v_L = L\\frac{di}{dt} \\leftrightarrow V_L = L s I(s)$, Capacitor $i_C = C\\frac{dv_C}{dt} \\leftrightarrow I_C = C s V_C(s)$ (so $V_C = \\frac{1}{Cs} I_C$).\n\n**Crucial Topology Alert:** Prof. Chan’s Chapter 2 p. 12 presents a *parallel RLC* circuit driven by a current source; Chapter 3 pp. 13–17 presents a *current-fed C in parallel with series LR*; and HW **P3.1** tests a *series RLC* loop driven by a voltage source! Never paste a memorized RLC transfer function—always write KVL or KCL directly from the given schematic.',
        math: '$$Z_R(s) = R, \\qquad Z_L(s) = L s, \\qquad Z_C(s) = \\frac{1}{C s}$$',
        whyItWorks:
          'Writing KVL around loops or KCL at nodes in terms of impedances $R, Ls, 1/(Cs)$ turns any circuit ODE into linear algebra in one step.',
      },
      {
        heading: '3. Prof. Chan’s 8-Slide Focus: Field-Controlled DC Motor (Ex 2.5)',
        explanation:
          'In Chapter 2 (pp. 37–44), Prof. Chan dedicated eight consecutive slides to the **Field-Controlled DC Motor**, pairing it with recommended **Example 2.5**. Here the **armature current $I_a$ is held strictly constant** by an external regulated current source, and the control input is the **field voltage $v_f(t)$**. Follow the four physical stages in order:\n1. **Field KVL:** $v_f(t) = R_f i_f(t) + L_f \\frac{di_f}{dt} \\implies I_f(s) = \\frac{1}{L_f s + R_f} V_f(s)$.\n2. **Magnetic Torque Law:** $T_m(t) = K_1 \\phi(t) I_a$. In the linear magnetic region, flux $\\phi(t) = K_f i_f(t)$. Since $I_a = \\text{const}$, lump the constants into $K_m = K_1 K_f I_a$ so $T_m(s) = K_m I_f(s)$.\n3. **Rotor Equilibrium (Newton-Euler):** $J\\frac{d\\omega}{dt} + b\\omega = T_m(t) - T_d(t) \\implies \\Omega(s) = \\frac{1}{J s + b}[T_m(s) - T_d(s)]$.\n4. **Angular Position Kinematics:** $\\frac{d\\theta}{dt} = \\omega \\implies \\Theta(s) = \\frac{1}{s}\\Omega(s)$.',
        math: '$$\\frac{\\Omega(s)}{V_f(s)} = \\frac{K_m}{(L_f s + R_f)(J s + b)} = \\frac{K_m / (R_f b)}{(\\tau_f s + 1)(\\tau_m s + 1)}, \\qquad \\frac{\\Theta(s)}{V_f(s)} = \\frac{K_m}{s(L_f s + R_f)(J s + b)}$$',
        whyItWorks:
          'At $T_d(s) = 0$, the motor is simply two first-order lags in series—electrical time constant $\\tau_f = L_f/R_f$ and mechanical time constant $\\tau_m = J/b$—followed by a **free integrator pole at $s = 0$** when we measure angle $\\theta$ instead of speed $\\omega$ (integrating a steady speed makes angle climb linearly forever!). With $V_f = 0$, the load disturbance TF is $\\frac{\\Omega(s)}{T_d(s)} = \\frac{-1}{J s + b}$ and $\\frac{\\Theta(s)}{T_d(s)} = \\frac{-1}{s(J s + b)}$.',
      },
      {
        heading: '4. Why $I_a = \\text{const}$ Means ZERO Back-EMF Feedback!',
        explanation:
          'Students frequently ask: *"Where did the back-EMF $K_b \\omega$ go?"* In *every* DC motor, spinning the rotor through the magnetic field induces a back-EMF voltage $v_b(t) = K_b \\omega(t)$ inside the **armature** winding.\n• In an **armature-controlled** motor ($I_f = \\text{const}$, input $v_a$), back-EMF directly opposes $v_a$, creating an inherent internal velocity feedback loop: $\\frac{\\Theta(s)}{V_a(s)} = \\frac{K_m}{s[(R_a + L_a s)(J s + b) + K_m K_b]}$.\n• In a **field-controlled** motor, a stiff current regulator forces $I_a = \\text{const}$ no matter what $v_b$ does—and no back-EMF is induced in the stationary field coil! Thus the back-EMF feedback path completely vanishes.',
        math: '$$\\text{Field-Controlled: } \\frac{\\Theta(s)}{V_f(s)} = \\frac{K_m}{s(L_f s + R_f)(J s + b)} \\quad \\text{(NO } K_m K_b \\text{ loop!)}$$',
        whyItWorks:
          'Because there is zero internal feedback coupling electrical and mechanical poles, the field-controlled poles sit cleanly at $s = 0$, $s = -R_f/L_f$, and $s = -b/J$.',
      },
    ],
    workedWalkthrough: {
      title: 'Base-Excited Positioning Carriage (HW E2.21)',
      context:
        'A positioning slide carriage of mass $M$ slides on a surface with viscous friction $b_s$. A moving base $x_{\\text{in}}(t)$ drives the carriage through a parallel spring $k_d$ and damper $b_d$. Derive $\\frac{X_p(s)}{X_{\\text{in}}(s)}$ under zero ICs, plug in $M=1, b_s=0.9, b_d=0.65, k_d=1.8$, and verify physical asymptotes.',
      steps: [
        {
          title: 'Draw the Free-Body Diagram for Mass $M$ ($x_p$ positive right)',
          math: '$$F_{\\text{ground}} = -b_s \\dot{x}_p, \\qquad F_{\\text{coupling}} = b_d(\\dot{x}_{\\text{in}} - \\dot{x}_p) + k_d(x_{\\text{in}} - x_p)$$',
          reasoning:
            'If the base $x_{\\text{in}}$ moves further right than the carriage $x_p$, the spring and damper pull $M$ to the right (positive). Ground friction $b_s$ always opposes $\\dot{x}_p$.',
        },
        {
          title: 'Apply Newton’s Second Law and Group $x_p$ vs. $x_{\\text{in}}$',
          math: '$$M\\ddot{x}_p = -b_s\\dot{x}_p - b_d(\\dot{x}_p - \\dot{x}_{\\text{in}}) - k_d(x_p - x_{\\text{in}})$$\n$$M\\ddot{x}_p + (b_s + b_d)\\dot{x}_p + k_d x_p = b_d\\dot{x}_{\\text{in}} + k_d x_{\\text{in}}$$',
          reasoning:
            'Put all carriage output terms on the left and all base input terms on the right.',
        },
        {
          title: 'Take Laplace Transform (Zero ICs) and Form Transfer Function',
          math: '$$[M s^2 + (b_s + b_d)s + k_d] X_p(s) = (b_d s + k_d) X_{\\text{in}}(s)$$\n$$\\frac{X_p(s)}{X_{\\text{in}}(s)} = \\frac{b_d s + k_d}{M s^2 + (b_s + b_d)s + k_d} = \\frac{0.65 s + 1.8}{s^2 + 1.55 s + 1.8}$$',
          reasoning:
            'Notice that $b_d$ appears in BOTH the numerator (driving force from $\\dot{x}_{\\text{in}}$) and the denominator (damping on $M$), whereas $b_s$ only opposes the carriage so it appears ONLY in the denominator!',
          tip: 'Never write $G(s) = \\frac{1}{Ms^2 + bs + k}$ for base excitation—that misses the $(b_d s + k_d)$ numerator!',
        },
        {
          title: 'Run Physical DC and High-Frequency Sanity Checks',
          math: '$$G(0) = \\frac{1.8}{1.8} = 1, \\qquad \\lim_{s\\to\\infty} G(s) = 0$$',
          reasoning:
            'At DC ($s=0$), moving the base slowly by $1\\text{ cm}$ eventually drags the carriage by the exact same $1\\text{ cm}$ ($G(0)=1$). At infinite frequency, inertia $M$ prevents instantaneous jumps ($G(\\infty)=0$). Both checks pass!',
        },
      ],
      takeaway:
        'Whether deriving mechanical FBDs or the field-controlled DC motor, clear free-body/circuit equations plus asymptotic $G(0)$ and $G(\\infty)$ checks prevent sign and numerator blunders.',
    },
    conceptChecks: [
      {
        id: 'ch2-phys-q1',
        question:
          'Why does Prof. Chan emphasize that a field-controlled DC motor has NO back-EMF feedback loop?',
        choices: [
          {
            text: 'Because the armature current $I_a$ is forced constant by an external current source, so armature back-EMF cannot change $I_a$, and no back-EMF forms in the field coil.',
            correct: true,
            feedback:
              'Exact match to Ch. 2 pp. 37–44! Back-EMF is induced in the armature, not the field—and holding $I_a = \\text{const}$ breaks the velocity-to-torque feedback loop.',
          },
          {
            text: 'Because field-controlled motors spin too slowly to generate any magnetic flux.',
            correct: false,
            feedback:
              'They certainly generate flux ($\\phi = K_f i_f$) and can drive large industrial loads! Back-EMF is simply decoupled from $i_f$ and cannot alter constant $I_a$.',
          },
          {
            text: 'Because the integrator $1/s$ cancels out the back-EMF constant $K_b$.',
            correct: false,
            feedback:
              'Integration $1/s$ converts angular velocity $\\Omega(s)$ into position $\\Theta(s)$; it does not cancel back-EMF.',
          },
          {
            text: 'Because viscous friction $b$ is assumed zero in Example 2.5.',
            correct: false,
            feedback:
              'Viscous friction $b$ is explicitly included in the rotor equation $(Js + b)\\Omega(s) = T_m(s) - T_d(s)$.',
          },
        ],
      },
      {
        id: 'ch2-phys-q2',
        question:
          'In the field-controlled DC motor position transfer function $\\frac{\\Theta(s)}{V_f(s)} = \\frac{K_m}{s(L_f s + R_f)(J s + b)}$, where does the free pole at $s = 0$ come from?',
        choices: [
          {
            text: 'Angular position $\\theta(t)$ is the time integral of angular velocity $\\omega(t)$, giving $\\Theta(s) = \\frac{1}{s}\\Omega(s)$.',
            correct: true,
            feedback:
              'Correct! Constant field voltage produces a steady speed $\\omega_{\\text{ss}}$, which makes shaft angle $\\theta(t)$ grow continuously—the hallmark of an integrator pole at $s = 0$.',
          },
          {
            text: 'It comes from setting field resistance $R_f = 0$.',
            correct: false,
            feedback:
              'Field resistance $R_f > 0$ creates the stable electrical pole $s = -R_f/L_f$, not the pole at $s = 0$.',
          },
          {
            text: 'It comes from setting load disturbance torque $T_d = 0$.',
            correct: false,
            feedback:
              'Setting $T_d = 0$ simply isolates the input $V_f(s)$; it does not introduce a pole.',
          },
          {
            text: 'It comes from the constant armature current $I_a$.',
            correct: false,
            feedback:
              'Constant $I_a$ is absorbed into the torque gain $K_m = K_1 K_f I_a$, not into the $1/s$ block.',
          },
        ],
      },
      {
        id: 'ch2-phys-q3',
        question:
          'In the base-excited carriage (HW E2.21), a student gets $G(s) = \\frac{X_p(s)}{X_{\\text{in}}(s)} = \\frac{1}{s^2 + 1.55 s + 1.8}$ instead of $\\frac{0.65 s + 1.8}{s^2 + 1.55 s + 1.8}$. What error did they make?',
        choices: [
          {
            text: 'They treated base displacement $x_{\\text{in}}$ as a direct force input instead of transmitting through spring $k_d$ and damper $b_d$.',
            correct: true,
            feedback:
              'Spot on! You can also catch this instantly with the DC sanity check: $G(0) = 1/1.8 \\neq 1$ violates rigid-body tracking!',
          },
          {
            text: 'They forgot to include ground friction $b_s$ in the numerator.',
            correct: false,
            feedback:
              'Ground friction $b_s$ connects the carriage to the fixed ground, NOT to the moving base, so $b_s$ never belongs in the numerator.',
          },
          {
            text: 'They forgot the $1/s$ factor for a unit step input.',
            correct: false,
            feedback:
              'A transfer function $X_p(s)/X_{\\text{in}}(s)$ never includes $1/s$ for a step input—it is an input-independent ratio.',
          },
          {
            text: 'They should have multiplied the denominator by $s^2$.',
            correct: false,
            feedback:
              'An extra $s^2$ only appears in ungrounded two-mass systems (like P2.26), not when ground damping $b_s$ or a spring to base is present.',
          },
        ],
      },
    ],
    tipsAndTraps: {
      shortcuts: [
        'Base-excited carriage shortcut: the coupling impedance $Z(s) = b_d s + k_d$ goes straight into the numerator.',
        'Two-mass ungrounded robot arm (P2.26): dynamic matrix $\\begin{bmatrix} M s^2 + Z & -Z \\\\ -Z & m s^2 + Z \\end{bmatrix}$ gives denominator $s^2[M m s^2 + (M+m)(bs+k)]$ and numerator $Z = bs + k$—notice the $s^2$ rigid-body translation mode!',
        'Field-controlled DC motor: remember the 3 factors in $\\frac{K_m}{s(L_f s + R_f)(J s + b)}$: Gain $K_m$, Electrical lag $(L_f s + R_f)$, Mechanical lag $(J s + b)$, Position integrator $s$.',
      ],
      traps: [
        'Omitting $(b_d s + k_d)$ from the numerator of base-excited systems (E2.21).',
        'Including a fake $K_m K_b$ back-EMF term in a *field-controlled* DC motor (it only belongs in *armature-controlled* motors!).',
        'Breaking action-reaction symmetry between two coupled masses (P2.26) or copying a parallel RLC formula onto a series RLC problem (P3.1).',
      ],
      memorize: [
        'Field-controlled DC motor: $\\frac{\\Omega(s)}{V_f(s)} = \\frac{K_m}{(L_f s + R_f)(J s + b)}$, $\\quad \\frac{\\Theta(s)}{V_f(s)} = \\frac{K_m}{s(L_f s + R_f)(J s + b)}$',
        'Always check $G(0)$ (DC steady-state physics) and $G(\\infty) \\to 0$ (inertia) on every physical TF!',
      ],
    },
    relatedProblemIds: ['Ex 2.5', 'E2.21', 'P2.26', 'P3.1'],
  },

  // =========================================================================
  // LESSON 5: BLOCK DIAGRAM ALGEBRA & POSITIVE FEEDBACK SIGN FLIPS
  // =========================================================================
  {
    id: 'ch2-block-diagrams',
    number: 5,
    chapterTag: 'Chapter 2 · Sections 2.6–2.7 (Type E)',
    title: 'Block Diagram Algebra & Positive Feedback Sign Flips',
    subtitle: 'Canonical $G/(1 \\pm GH)$, Pickoff/Summer Move Rules, Ex 2.6 Positive Loop Trap & Signal-Equation Method',
    examWeight: '15–20% of Midterm (Very High Probability)',
    labId: 'block-diagram',
    labTitle: 'Multiloop Block Diagram & Signal-Algebra Lab',
    labPrompt:
      'Toggle inner feedback signs between $-$ and $+$ and step through intermediate node labels $V_1, V_2$ to see how signal algebra prevents multiloop sign blunders.',
    intuitionHook:
      'Sliding pickoff points and summing junctions across blocks can feel like juggling chainsaws on a timed exam—one missing $1/G$ ruins the whole page. Good news: you never have to redraw a complex diagram if you label the summing-junction outputs ($V_1, V_2$) and solve two lines of algebra!',
    mentalModel: [
      'Cascade multiplies ($G_1 G_2$), parallel adds/subtracts ($G_1 \\pm G_2$), and feedback gives $\\frac{G}{1 + GH}$ (negative) or $\\frac{G}{1 - GH}$ (positive).',
      'Always inspect the sign at the feedback arrowhead: Prof. Chan’s recommended Example 2.6 hides a POSITIVE inner loop yielding $1 - G_3 G_4 H_1$!',
      'Moving a pickoff point forward past $G$ inserts $1/G$; moving backward inserts $G$ (reverse for summing junctions).',
      'The Universal Signal-Equation Method ($V_1, V_2$) solves ANY multiloop diagram in under 60 seconds with zero redrawing.',
    ],
    sections: [
      {
        heading: '1. Cascade, Parallel & The Canonical $1 \\pm GH$ Rule',
        explanation:
          'Every block diagram reduction relies on three canonical moves. Two blocks in series multiply ($G_1 G_2$). Two parallel paths sharing the same input and summing at the same output add algebraically ($G_1 \\pm G_2$). For a single feedback loop with forward path $G(s)$ and feedback path $H(s)$:',
        math: '$$\\text{Negative Feedback } (-): \\; T(s) = \\frac{G(s)}{1 + G(s)H(s)} \\qquad \\text{Positive Feedback } (+): \\; T(s) = \\frac{G(s)}{1 - G(s)H(s)}$$',
        whyItWorks:
          'Write the summer equation directly: $E = R \\mp H Y$ and $Y = G E$. Substituting gives $Y = G(R \\mp H Y) \\implies (1 \\pm GH)Y = G R$. Negative feedback adds $+GH$ to the denominator; positive feedback subtracts $-GH$!',
      },
      {
        heading: '2. Pickoff & Summing-Junction Move Rules (Use With Caution)',
        explanation:
          'When loops overlap, textbook tables teach graphical relocation:\n• **Moving a pickoff point forward** (from before $G$ to after $G$): insert $\\frac{1}{G}$ on the tapped branch (to undo $G$). Moving it **backward** (before $G$): insert $G$.\n• **Moving a summing junction forward** (after $G$): multiply the side input by $G$. Moving it **backward** (before $G$): multiply the side input by $\\frac{1}{G}$.',
        math: '$$\\text{Pickoff: } \\xrightarrow{\\text{forward past } G} \\text{insert } \\frac{1}{G}, \\qquad \\text{Summer: } \\xrightarrow{\\text{forward past } G} \\text{insert } G$$',
        whyItWorks:
          'Every move is engineered so the signal arriving at every downstream node stays algebraically identical. Still, redrawing diagrams twice under exam pressure is slow and invites careless errors—use the Signal-Equation Method below instead!',
      },
      {
        heading: '3. Prof. Chan’s Recommended Ex 2.6: The Positive Inner Feedback Trap',
        explanation:
          'Why did Prof. Chan single out **Example 2.6** in `Suggested self study tip.md`? Because right inside a standard multi-loop block diagram, the inner feedback loop $H_1$ enters its summing junction with a **PLUS ($+$)** sign!\n\nStudents who automate "feedback means $\\frac{G}{1+GH}$" write $1 + G_3 G_4 H_1$ and lose points throughout the remaining reduction. Always circle the $+ / -$ sign at every summing junction before writing a single fraction.',
        math: '$$T_{\\text{inner}}(s) = \\frac{G_3(s)G_4(s)}{1 - G_3(s)G_4(s)H_1(s)} \\quad (\\text{because } H_1 \\text{ enters with } +!)$$',
        whyItWorks:
          'Once you circle the $+$ sign on $H_1$, you consciously switch the denominator to $1 - G_3 G_4 H_1$, then proceed calmly to combine the outer loops.',
      },
      {
        heading: '4. The Universal Signal-Equation Method ($V_1, V_2$ — Never Fails!)',
        explanation:
          'Instead of pushing blocks around, treat the diagram as a linear circuit of signals:\n1. **Label** the output of each summing junction (or key branch point) with $E, V_1, V_2$.\n2. **Write** one algebraic equation for every summing junction directly from the $+ / -$ signs.\n3. **Relate** intermediate nodes through the blocks ($Y = G_2 V_1$, etc.).\n4. **Eliminate** $E, V_1, V_2$ to solve for $Y(s)/R(s)$.\nThis works on ANY crossed-loop, derivative-feedback (like **P3.7**), or multi-summer diagram in under a minute.',
        math: '$$\\text{Assign } V_1, V_2 \\text{ at summers} \\implies \\text{Linear equations} \\implies \\text{Solve } \\frac{Y(s)}{R(s)}$$',
        whyItWorks:
          'Block diagrams are literally just pictures of linear algebraic equations in $s$. Translating the picture straight back into equations eliminates graphical geometry tricks completely.',
      },
    ],
    workedWalkthrough: {
      title: 'Multiloop Reduction via Signal Equations (HW E2.25)',
      context:
        'In Figure E2.25, the forward path has $G_1(s) = \\frac{10}{s+1}$ followed by $G_2(s) = \\frac{1}{s}$ producing $Y(s)$. An inner branch taps the signal *between* $G_1$ and $G_2$, passes through gain $2$, and *adds* ($+$) to $Y(s)$ at a feedback summer. That combined feedback signal $B(s)$ *subtracts* ($-$) from $R(s)$ at the input summer.',
      steps: [
        {
          title: 'Label the Intermediate Signal Between $G_1$ and $G_2$',
          math: '$$V(s) = G_1(s) E(s), \\qquad Y(s) = G_2(s) V(s) = \\frac{1}{s} V(s) \\implies V(s) = s Y(s)$$',
          reasoning:
            'Expressing the internal tap $V(s)$ immediately in terms of $Y(s)$ eliminates $V(s)$ in one line!',
          tip: 'Whenever a pickoff sits right before $G_2 = 1/s$, writing $V = Y/G_2 = s Y$ is the fastest trick in the book.',
        },
        {
          title: 'Write the Feedback Summer and Input Summer Equations',
          math: '$$B(s) = 2 V(s) + Y(s) = 2(s Y(s)) + Y(s) = (2s + 1) Y(s)$$\n$$E(s) = R(s) - B(s) = R(s) - (2s + 1) Y(s)$$',
          reasoning:
            'Trace each arrow sign carefully: $2V$ and $Y$ add ($+$) to form $B$, and $B$ subtracts ($-$) from $R$ to form $E$.',
        },
        {
          title: 'Substitute Into the Forward Block $V(s) = G_1(s)E(s)$',
          math: '$$s Y(s) = \\frac{10}{s+1}\\big[R(s) - (2s + 1) Y(s)\\big]$$',
          reasoning:
            'Every intermediate variable ($V, B, E$) is now gone—only $Y(s)$ and $R(s)$ remain.',
        },
        {
          title: 'Clear the Denominator and Solve for $T(s) = Y(s)/R(s)$',
          math: '$$s(s+1)Y(s) = 10 R(s) - 10(2s + 1) Y(s)$$\n$$(s^2 + s + 20s + 10) Y(s) = 10 R(s) \\implies T(s) = \\frac{Y(s)}{R(s)} = \\frac{10}{s^2 + 21s + 10}$$',
          reasoning:
            'Check DC gain: at $s=0$, $T(0) = 10/10 = 1$, which makes physical sense because the outer unity feedback dominates when the inner derivative-like tap $2s Y$ vanishes at DC!',
        },
      ],
      takeaway:
        'By naming one intermediate signal $V(s)$ and solving two algebraic lines, we avoided moving pickoff points entirely and preserved every sign.',
    },
    conceptChecks: [
      {
        id: 'ch2-blk-q1',
        question:
          'An inner loop has forward blocks $G_3 G_4$ and feedback block $H_1$ entering the summing junction with a $+$ sign. What is the reduced inner-loop transfer function?',
        choices: [
          {
            text: '$\\frac{G_3 G_4}{1 - G_3 G_4 H_1}$',
            correct: true,
            feedback:
              'Yes! Positive feedback puts $1 - GH$ in the denominator (just like Prof. Chan’s recommended Example 2.6).',
          },
          {
            text: '$\\frac{G_3 G_4}{1 + G_3 G_4 H_1}$',
            correct: false,
            feedback:
              'Classic Example 2.6 trap! $1 + GH$ is for *negative* feedback. Because $H_1$ enters with a $+$ sign, the denominator is $1 - G_3 G_4 H_1$.',
          },
          {
            text: '$\\frac{G_3 G_4 H_1}{1 - G_3 G_4}$',
            correct: false,
            feedback:
              'The forward path $G_3 G_4$ belongs in the numerator, while the loop product $G_3 G_4 H_1$ goes in the denominator.',
          },
          {
            text: '$G_3 G_4 + H_1$',
            correct: false,
            feedback:
              'That is parallel feedforward, not a feedback loop.',
          },
        ],
      },
      {
        id: 'ch2-blk-q2',
        question:
          'To simplify a diagram graphically, you move a pickoff point from *before* block $G(s)$ to *after* block $G(s)$. What must you place in the tapped branch?',
        choices: [
          {
            text: '$1/G(s)$',
            correct: true,
            feedback:
              'Correct! After $G(s)$, the main signal has already been multiplied by $G(s)$, so the tapped branch needs $1/G(s)$ to restore the original signal.',
          },
          {
            text: '$G(s)$',
            correct: false,
            feedback:
              'Inserting $G(s)$ would square the gain! You insert $G(s)$ when moving a pickoff *backward* (before $G$).',
          },
          {
            text: '$-G(s)$',
            correct: false,
            feedback:
              'Moving a pickoff point never flips the sign of the signal.',
          },
          {
            text: 'Nothing—tapped signals are unchanged across blocks.',
            correct: false,
            feedback:
              'The signal after $G(s)$ is $G(s)$ times larger than before $G(s)$, so leaving the branch unchanged alters the loop!',
          },
        ],
      },
      {
        id: 'ch2-blk-q3',
        question:
          'In the Universal Signal-Equation Method, why is it helpful to express an intermediate signal $V(s)$ between $G_1$ and $G_2$ as $V(s) = Y(s)/G_2(s)$?',
        choices: [
          {
            text: 'It immediately writes the internal node in terms of the final output $Y(s)$, leaving only $Y(s)$ and $R(s)$ to solve.',
            correct: true,
            feedback:
              'Exactly! Working backward from $Y(s)$ removes $V(s)$ in a single step, turning multiloop diagrams into fast, sign-safe algebra.',
          },
          {
            text: 'It converts positive feedback loops into negative feedback loops automatically.',
            correct: false,
            feedback:
              'It doesn’t convert signs—you still read the $+ / -$ signs directly from each summer, which is why you won’t miss a $+$ sign!',
          },
          {
            text: 'It allows you to drop any inner feedback loops from the characteristic polynomial.',
            correct: false,
            feedback:
              'Inner loops remain in the equations and properly shape the denominator polynomial (like $+20s$ in E2.25).',
          },
          {
            text: 'It eliminates the need to know $G_1(s)$.',
            correct: false,
            feedback:
              'You still substitute $V(s) = G_1(s)E(s)$—you need every block in the loop!',
          },
        ],
      },
    ],
    tipsAndTraps: {
      shortcuts: [
        'Skip block-pushing gymnastics on messy multiloop exams: label summer outputs $V_1, V_2$, write one equation per summer, and solve.',
        'If a pickoff sits before a single block $G_2$ feeding $Y$, substitute $V = Y / G_2$ immediately.',
      ],
      traps: [
        'Writing $1 + GH$ automatically when an inner feedback arrow has a $+$ sign (Prof. Chan’s Ex 2.6 trap!).',
        'Forgetting to update parallel/inner branches when moving a summing junction or pickoff point.',
        'Confusing feedback signal $B(s) = H(s)Y(s)$ in Ch. 2 block diagrams with the input matrix $\\mathbf{B}$ in Ch. 3 state space.',
      ],
      memorize: [
        'Negative feedback: $\\frac{G}{1 + GH}$, $\\quad$ Positive feedback: $\\frac{G}{1 - GH}$',
        'Pickoff moved forward past $G$ $\\implies$ insert $1/G$; moved backward $\\implies$ insert $G$.',
      ],
    },
    relatedProblemIds: ['Ex 2.6', 'E2.25', 'P3.7'],
  },

  // =========================================================================
  // LESSON 6: INSIDE THE BLACK BOX: STATE VARIABLES & COMPANION FORM
  // =========================================================================
  {
    id: 'ch3-state-space',
    number: 6,
    chapterTag: 'Chapter 3 · Sections 3.1–3.6 (Type F)',
    title: 'Inside the Black Box: State Variables & Companion Form',
    subtitle: 'Energy Storage States, Chan’s $y_1, y_2$ Notation, Monic Division Trap, Companion Matrices & Integrator Diagrams',
    examWeight: '15–25% of Midterm (Very High Probability)',
    labId: 'companion',
    labTitle: 'Companion Matrix & Integrator Diagram Builder',
    labPrompt:
      'Enter any ODE or transfer function coefficients to watch monic normalization, negated ascending bottom-row assembly $[-a_0, -a_1, \\dots]$, and $1/s$ integrator wiring update live.',
    intuitionHook:
      'A transfer function $G(s)$ treats your machine like a sealed black box with dead batteries at $t=0$—it only predicts what comes out of one port when you poke another. State-space pops the lid open: it tracks every spring, mass, capacitor, and inductor inside the box simultaneously, even when the machine starts mid-motion!',
    mentalModel: [
      'State variables are the minimum set of internal memory/energy variables ($x, v, i_L, v_C$) needed to predict the future given $u(t)$.',
      'State representations are NON-UNIQUE ($\\mathbf{z} = \\mathbf{P}\\mathbf{x}$ gives another valid model), while $G(s)$ is unique.',
      'Monic Trap: divide the ODE/denominator by its leading coefficient so $y^{(n)}$ or $s^n$ has coefficient $1$ before building $\\mathbf{A}, \\mathbf{B}, \\mathbf{C}$.',
      'Golden Integrator Rule: state variables $x_i$ ALWAYS sit at the OUTPUT of $1/s$ blocks; the signal BEFORE $1/s$ is ALWAYS $\\dot{x}_i$!',
    ],
    sections: [
      {
        heading: '1. Why State Space Beats Transfer Functions (& Prof. Chan’s Notation)',
        explanation:
          'Transfer functions have three blind spots: they assume zero initial conditions, handle one input-output pair at a time, and can hide unstable internal modes through pole-zero cancellation. State-space solves all three with two matrix equations:\n$$\\dot{\\mathbf{x}}(t) = \\mathbf{A}\\mathbf{x}(t) + \\mathbf{B}u(t), \\qquad y(t) = \\mathbf{C}\\mathbf{x}(t) + \\mathbf{D}u(t)$$\nFor physical systems, choose **energy-storage variables**: translational position $x$ ($\\frac{1}{2}kx^2$) and velocity $v$ ($\\frac{1}{2}mv^2$), capacitor voltage $v_C$ ($\\frac{1}{2}Cv_C^2$) and inductor current $i_L$ ($\\frac{1}{2}Li_L^2$)—NEVER resistor voltage (resistors dissipate energy!).\n\n**Prof. Chan’s Slide Notes (Ch. 3 pp. 5–8):** In early examples, Prof. Chan writes $y_1 = y, \\; y_2 = \\dot{y} = v$ before switching to textbook $\\mathbf{x} = [x_1, x_2]^T$, and switches input symbol from Ch. 2 reference $r(t)$ to Ch. 3 control $u(t)$. Also remember: $y(0) = 0$ does NOT mean $\\mathbf{x}(0) = \\mathbf{0}$—a mass can cross $y(0) = 0$ while moving at high velocity $\\dot{y}(0) \\neq 0$!',
        math: '$$\\dot{\\mathbf{x}} = \\mathbf{A}\\mathbf{x} + \\mathbf{B}u, \\qquad y = \\mathbf{C}\\mathbf{x} + \\mathbf{D}u \\qquad (\\text{non-unique under } \\mathbf{z} = \\mathbf{P}\\mathbf{x})$$',
        whyItWorks:
          'Any invertible linear change of coordinates $\\mathbf{z} = \\mathbf{P}\\mathbf{x}$ produces an equally valid state model $(\\mathbf{P}\\mathbf{A}\\mathbf{P}^{-1}, \\mathbf{P}\\mathbf{B}, \\mathbf{C}\\mathbf{P}^{-1}, \\mathbf{D})$ that preserves the exact same $G(s)$.',
      },
      {
        heading: '2. Monic ODE Trap & Phase-Variable Companion Matrix',
        explanation:
          'To turn an $n$-th order ODE or strictly proper transfer function into phase-variable companion form, **STEP 0 is making it MONIC**: if the highest derivative $y^{(n)}$ or $s^n$ has coefficient $a_n \\neq 1$, divide every term by $a_n$ first!\nOnce monic ($s^n + a_{n-1}s^{n-1} + \\dots + a_1 s + a_0$ with numerator $b_{n-1}s^{n-1} + \\dots + b_0$), set $x_1 = y, \\; x_2 = \\dot{y}, \\; \\dots, \\; x_n = y^{(n-1)}$ (when there are no input derivatives). Each state simply shifts into the next ($\\dot{x}_i = x_{i+1}$), giving a **superdiagonal of $1$s**, while the bottom row holds the **negated denominator coefficients in ascending order**:',
        math: '$$\\mathbf{A} = \\begin{bmatrix} 0 & 1 & 0 & \\dots & 0 \\\\ 0 & 0 & 1 & \\dots & 0 \\\\ \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & 0 & \\dots & 1 \\\\ -a_0 & -a_1 & -a_2 & \\dots & -a_{n-1} \\end{bmatrix}, \\quad \\mathbf{B} = \\begin{bmatrix} 0 \\\\ 0 \\\\ \\vdots \\\\ 1 \\end{bmatrix}, \\quad \\mathbf{C} = \\begin{bmatrix} b_0 & b_1 & \\dots & b_{n-1} \\end{bmatrix}, \\quad \\mathbf{D} = [0]$$',
        whyItWorks:
          'Moving $a_0 y + a_1\\dot{y} + \\dots + a_{n-1}y^{(n-1)}$ to the right-hand side to isolate $y^{(n)} = \\dot{x}_n$ flips every $+a_i$ to $-a_i$! Ascending order $[-a_0, -a_1, \\dots]$ happens because $x_1$ is the lowest derivative ($y$) and $x_n$ is the highest ($y^{(n-1)}$). Note: for an ODE with no numerator zeros like $y^{(3)} + 4\\ddot{y} + 6\\dot{y} + 8y = 20u$ (HW **E3.4**), you can either put $20$ in $\\mathbf{B} = [0, 0, 20]^T$ with $\\mathbf{C} = [1, 0, 0]$, OR put $1$ in $\\mathbf{B}$ and $20$ in $\\mathbf{C} = [20, 0, 0]$.',
      },
      {
        heading: '3. All-Integrator Simulation Diagrams: Before vs. After $1/s$!',
        explanation:
          'We build simulation diagrams out of **integrators ($1/s$)**, never differentiators ($s$), because differentiators violently amplify high-frequency electrical noise. Follow the **Golden Integrator Rule**:\n• **AFTER each $1/s$ block** sits the state variable $x_i$.\n• **BEFORE each $1/s$ block** sits its derivative $\\dot{x}_i$.\n\nWatch out for **HW E3.5**’s classic exam trap: a feedforward gain $f$ taps a signal **before** Integrator 1 and feeds it into Summer 2. Because it taps *before* Integrator 1, it carries $\\dot{x}_1 = u - k x_2$ (NOT $x_1$!), injecting $f u$ into $\\dot{x}_2$ and turning $\\mathbf{B}$ from $[1, 0]^T$ into $[1, f]^T$!',
        math: '$$\\dot{x}_i \\longrightarrow \\boxed{\\frac{1}{s}} \\longrightarrow x_i \\qquad (\\text{States live at integrator OUTPUTS!})$$',
        whyItWorks:
          'Remembering "input = $\\dot{x}_i$, output = $x_i$" lets you read off $\\dot{\\mathbf{x}} = \\mathbf{A}\\mathbf{x} + \\mathbf{B}u$ straight from any integrator diagram by simply writing what enters each $1/s$ block.',
      },
      {
        heading: '4. Handling Transfer Function Zeros via Dummy Variable $W(s)$',
        explanation:
          'When $G(s)$ has $s$-terms in the numerator (zeros), like $T(s) = \\frac{s^2 + 2s + 10}{s^3 + 4s^2 + 6s + 10}$ (HW **P3.4**), setting $x_1 = y$ directly would create derivatives of the input $\\dot{r}, \\ddot{r}$. Instead, split $T(s)$ into two cascaded halves using an intermediate dummy variable $W(s)$:',
        math: '$$W(s) = \\frac{1}{s^3 + 4s^2 + 6s + 10} R(s), \\qquad Y(s) = (s^2 + 2s + 10) W(s)$$',
        whyItWorks:
          'Define the states from $w$ instead of $y$: $x_1 = w, \\; x_2 = \\dot{w}, \\; x_3 = \\ddot{w}$. Then the denominator builds $\\mathbf{A}$ and $\\mathbf{B} = [0,0,1]^T$ without any $\\dot{r}$ terms, and the numerator simply reads off weighted taps $y = 10 x_1 + 2 x_2 + 1 x_3$, giving $\\mathbf{C} = [10, 2, 1]$!',
      },
    ],
    workedWalkthrough: {
      title: '3rd-Order Transfer Function to Companion Form & Integrator Diagram (HW P3.4)',
      context:
        'Given $T(s) = \\frac{Y(s)}{R(s)} = \\frac{s^2 + 2s + 10}{s^3 + 4s^2 + 6s + 10}$, obtain the controllable companion state-space matrices $(\\mathbf{A}, \\mathbf{B}, \\mathbf{C}, \\mathbf{D})$ and describe the all-integrator diagram wiring.',
      steps: [
        {
          title: 'Verify Monic Denominator & Split via Dummy Variable $W(s)$',
          math: '$$(s^3 + 4s^2 + 6s + 10) W(s) = R(s) \\implies \\dddot{w} = r(t) - 10 w - 6\\dot{w} - 4\\ddot{w}$$',
          reasoning:
            'The coefficient of $s^3$ is already $1$ (monic!). Isolating $\\dddot{w}$ negates all denominator coefficients: $a_0 = 10, a_1 = 6, a_2 = 4$.',
        },
        {
          title: 'Assign Phase Variables at the Outputs of Three Cascaded Integrators',
          math: '$$x_1 = w, \\quad x_2 = \\dot{w} = \\dot{x}_1, \\quad x_3 = \\ddot{w} = \\dot{x}_2 \\implies \\dot{x}_3 = \\dddot{w} = -10 x_1 - 6 x_2 - 4 x_3 + r(t)$$',
          reasoning:
            'Cascade three $1/s$ blocks left-to-right: $\\dot{x}_3 \\to [1/s] \\to x_3 (=\\dot{x}_2) \\to [1/s] \\to x_2 (=\\dot{x}_1) \\to [1/s] \\to x_1$. Feedback gains $-4, -6, -10$ loop from $x_3, x_2, x_1$ back to the input summer.',
          tip: 'Notice $x_1$ is at the rightmost integrator output and $x_3$ is at the leftmost!',
        },
        {
          title: 'Form the Output Equation From the Numerator $s^2 + 2s + 10$',
          math: '$$Y(s) = (s^2 + 2s + 10) W(s) \\implies y(t) = 10 w + 2\\dot{w} + \\ddot{w} = 10 x_1 + 2 x_2 + 1 x_3$$',
          reasoning:
            'Feedforward branches tap $x_1$ (gain $10$), $x_2$ (gain $2$), and $x_3$ (gain $1$) into an output summing junction to produce $y(t)$ without any differentiators.',
        },
        {
          title: 'Assemble Companion Matrices $\\mathbf{A}, \\mathbf{B}, \\mathbf{C}, \\mathbf{D}$',
          math: '$$\\mathbf{A} = \\begin{bmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ -10 & -6 & -4 \\end{bmatrix}, \\quad \\mathbf{B} = \\begin{bmatrix} 0 \\\\ 0 \\\\ 1 \\end{bmatrix}, \\quad \\mathbf{C} = \\begin{bmatrix} 10 & 2 & 1 \\end{bmatrix}, \\quad \\mathbf{D} = [0]$$',
          reasoning:
            'Double-check ascending order: bottom row of $\\mathbf{A}$ is $[-a_0, -a_1, -a_2] = [-10, -6, -4]$, and $\\mathbf{C}$ is $[b_0, b_1, b_2] = [10, 2, 1]$.',
        },
      ],
      takeaway:
        'Denominator coefficients feed backward into the bottom row of $\\mathbf{A}$ (negated, ascending); numerator coefficients feed forward into $\\mathbf{C}$ (un-negated, ascending).',
    },
    conceptChecks: [
      {
        id: 'ch3-ss-q1',
        question:
          'A system is governed by $2\\ddot{y} + 6\\dot{y} + 8y = 10u$. Using companion form $x_1 = y, \\; x_2 = \\dot{y}$, what is the bottom row of $\\mathbf{A}$?',
        choices: [
          {
            text: '$[-4, \\; -3]$',
            correct: true,
            feedback:
              'Spot on! First normalize to monic form by dividing by $2$: $\\ddot{y} + 3\\dot{y} + 4y = 5u$. Then $\\dot{x}_2 = -4 x_1 - 3 x_2 + 5u$, giving bottom row $[-4, -3]$!',
          },
          {
            text: '$[-8, \\; -6]$',
            correct: false,
            feedback:
              'Monic trap! You forgot to divide the whole ODE by the leading coefficient $2$.',
          },
          {
            text: '$[-3, \\; -4]$',
            correct: false,
            feedback:
              'Reversed order! Since $x_1 = y$ and $x_2 = \\dot{y}$, the $y$-coefficient ($-4$) goes in column 1 and the $\\dot{y}$-coefficient ($-3$) goes in column 2.',
          },
          {
            text: '$[+4, \\; +3]$',
            correct: false,
            feedback:
              'Sign trap! Moving $+4y + 3\\dot{y}$ to the right-hand side negates both coefficients.',
          },
        ],
      },
      {
        id: 'ch3-ss-q2',
        question:
          'In an all-integrator block diagram (like HW E3.5), a feedforward gain $f$ taps the wire *entering* (before) Integrator 1 and adds into Summer 2. What signal does branch $f$ carry?',
        choices: [
          {
            text: '$\\dot{x}_1$ (which equals $u - k x_2$, injecting $f u$ into $\\dot{x}_2$)',
            correct: true,
            feedback:
              'Yes! The wire *before* Integrator 1 is always $\\dot{x}_1$, NOT $x_1$. Substituting $\\dot{x}_1$ puts $f$ into $\\mathbf{B} = [1, f]^T$ and $-fk$ into $\\mathbf{A}_{22}$.',
          },
          {
            text: '$x_1$, because $x_1$ is the name of Integrator 1',
            correct: false,
            feedback:
              'State variables ALWAYS live at the *output* of integrators, never at the input.',
          },
          {
            text: '$\\int x_1\\,dt$, because it has not entered the integrator yet',
            correct: false,
            feedback:
              'Backwards! Passing *through* $1/s$ integrates $\\dot{x}_1$ into $x_1$, so the pre-integrator wire is the derivative $\\dot{x}_1$.',
          },
          {
            text: 'It creates a non-zero $\\mathbf{D}$ feedthrough directly at the output $y$.',
            correct: false,
            feedback:
              'Here $f$ enters Summer 2 (before Integrator 2), so it modifies $\\dot{x}_2$ ($\\mathbf{A}$ and $\\mathbf{B}$), while $y = b x_2$ keeps $\\mathbf{D} = 0$.',
          },
        ],
      },
      {
        id: 'ch3-ss-q3',
        question:
          'For a mechanical mass-spring-damper, if $y(0) = 0$, does that guarantee the initial state vector is $\\mathbf{x}(0) = \\mathbf{0}$?',
        choices: [
          {
            text: 'No—the mass could pass through $y(0) = 0$ with non-zero initial velocity $\\dot{y}(0) \\neq 0$.',
            correct: true,
            feedback:
              'Exactly! Both position $y$ (potential energy) and velocity $\\dot{y}$ (kinetic energy) are independent state variables.',
          },
          {
            text: 'Yes—if initial position is zero, the system is at rest and transfer functions apply.',
            correct: false,
            feedback:
              'False! Initial kinetic energy $\\frac{1}{2}m\\dot{y}(0)^2$ still generates a non-zero natural response even when $y(0) = 0$.',
          },
          {
            text: 'Only if the damping coefficient $b = 0$.',
            correct: false,
            feedback:
              'Damping $b$ does not determine whether initial velocity $\\dot{y}(0)$ is zero.',
          },
          {
            text: 'Yes, because $x_2 = \\dot{x}_1$ makes $x_2(0) = 0$ whenever $x_1(0) = 0$.',
            correct: false,
            feedback:
              'Be careful: $f(0) = 0$ does NOT imply $f\'(0) = 0$! Think of $\\sin(t)$ at $t=0$: $\\sin(0)=0$, yet $\\cos(0)=1$.',
          },
        ],
      },
    ],
    tipsAndTraps: {
      shortcuts: [
        'For monic $G(s) = \\frac{b_{n-1}s^{n-1} + \\dots + b_0}{s^n + a_{n-1}s^{n-1} + \\dots + a_0}$, bottom row of $\\mathbf{A}$ is $[-a_0, -a_1, \\dots, -a_{n-1}]$ and $\\mathbf{C} = [b_0, b_1, \\dots, b_{n-1}]$.',
        'For an RLC circuit (P3.1), immediately write $\\dot{v}_C = \\frac{1}{C} i_C$ and $\\dot{i}_L = \\frac{1}{L} v_L$, then eliminate $i_C, v_L$ using KCL/KVL.',
      ],
      traps: [
        'Forgetting to divide by $a_n$ when the ODE is non-monic (e.g., $2\\ddot{y} + \\dots$).',
        'Reversing the bottom row to $[-a_{n-1}, \\dots, -a_0]$ or forgetting the minus signs.',
        'Assigning state variables at the *input* of $1/s$ blocks instead of the *output* (missing pre-integrator taps like $f$ in E3.5).',
        'Choosing resistor voltage $v_R$ as a state variable instead of energy-storage variables $v_C$ and $i_L$.',
      ],
      memorize: [
        'Bottom row of companion $\\mathbf{A}$: $[-a_0, -a_1, \\dots, -a_{n-1}]$ (ascending, negated).',
        'Integrator rule: $\\dot{x}_i \\to \\boxed{1/s} \\to x_i$.',
      ],
    },
    relatedProblemIds: ['E3.2', 'E3.4', 'E3.5', 'E3.14', 'P3.1', 'P3.4', 'P3.7', 'P3.8'],
  },

  // =========================================================================
  // LESSON 7: STATE EVOLUTION: EIGENVALUES, RESOLVENT, PHI(t) & G(s)
  // =========================================================================
  {
    id: 'ch3-transition',
    number: 7,
    chapterTag: 'Chapter 3 · Sections 3.6–3.7 (Type G)',
    title: 'State Evolution: Eigenvalues, Resolvent $(sI-A)^{-1}$, $\\Phi(t)=e^{At}$ & $G(s)$',
    subtitle: 'Geometric $e^{\\mathbf{A}t}$, Characteristic Roots, $2\\times 2$ Adjugate Sign Trap, $\\mathbf{\\Phi}(0)=\\mathbf{I}$ Gate & Cramer Shortcut',
    examWeight: '10–15% of Midterm (Likely Computational)',
    labId: 'transition-matrix',
    labTitle: 'Eigenvalue, Resolvent & State-Transition Lab',
    labPrompt:
      'Edit any $2\\times 2$ matrix $\\mathbf{A}$ to trace its eigenvalues $\\lambda_1, \\lambda_2$, watch the state trajectory $\\mathbf{x}(t) = \\mathbf{\\Phi}(t)\\mathbf{x}(0)$ spiral or decay in phase space, and verify $\\mathbf{\\Phi}(0) = \\mathbf{I}$.',
    intuitionHook:
      'For a 1D system $\\dot{x} = a x$, the state moves via $x(t) = e^{at}x(0)$. In $n$ dimensions, $\\dot{\\mathbf{x}} = \\mathbf{A}\\mathbf{x}$ evolves via $\\mathbf{x}(t) = \\mathbf{\\Phi}(t)\\mathbf{x}(0) = e^{\\mathbf{A}t}\\mathbf{x}(0)$—a "state-space time machine" that rotates, stretches, and decays the entire state vector at once. Best of all, there is a 3-second sanity check that catches almost any algebra mistake!',
    mentalModel: [
      'Resolvent $(s\\mathbf{I} - \\mathbf{A})^{-1}$ lives in the Laplace $s$-domain; State Transition Matrix $\\mathbf{\\Phi}(t) = e^{\\mathbf{A}t} = \\mathcal{L}^{-1}\\{(s\\mathbf{I} - \\mathbf{A})^{-1}\\}$ lives in the time domain.',
      'FATAL TRAP: $e^{\\mathbf{A}t}$ is NEVER element-wise $e^{a_{ij}t}$ when $\\mathbf{A}$ has off-diagonal couplings!',
      'Watch the double sign flip in $2\\times 2$ inverses: $(s\\mathbf{I}-\\mathbf{A})$ negates off-diagonals, then $\\operatorname{adj}(s\\mathbf{I}-\\mathbf{A})$ swaps diagonals and negates off-diagonals again.',
      'MANDATORY SANITY GATE: always check $\\mathbf{\\Phi}(0) = \\mathbf{I}$ and $\\dot{\\mathbf{\\Phi}}(0) = \\mathbf{A}$ before moving on!',
    ],
    sections: [
      {
        heading: '1. Geometric Meaning of $e^{\\mathbf{A}t}$ & The Fatal Element-Wise Trap',
        explanation:
          'Solving $\\dot{\\mathbf{x}}(t) = \\mathbf{A}\\mathbf{x}(t) + \\mathbf{B}u(t)$ via Laplace transforms gives $s\\mathbf{X}(s) - \\mathbf{x}(0) = \\mathbf{A}\\mathbf{X}(s) + \\mathbf{B}U(s)$, so $(s\\mathbf{I} - \\mathbf{A})\\mathbf{X}(s) = \\mathbf{x}(0) + \\mathbf{B}U(s)$. Multiplying by the inverse $(s\\mathbf{I} - \\mathbf{A})^{-1}$ (the **resolvent matrix**) and inverting back to time gives the complete state solution:',
        math: '$$\\mathbf{x}(t) = \\mathbf{\\Phi}(t)\\mathbf{x}(0) + \\int_0^t \\mathbf{\\Phi}(t - \\tau)\\mathbf{B}u(\\tau)\\,d\\tau, \\qquad \\mathbf{\\Phi}(t) = e^{\\mathbf{A}t} = \\mathcal{L}^{-1}\\big\\{(s\\mathbf{I} - \\mathbf{A})^{-1}\\big\\}$$',
        whyItWorks:
          'Because $\\mathbf{A}$ couples states together ($\\dot{x}_1$ depends on $x_2$, and $\\dot{x}_2$ depends on $x_1$), the matrix exponential is defined by the infinite series $\\mathbf{I} + \\mathbf{A}t + \\frac{1}{2!}\\mathbf{A}^2 t^2 + \\cdots$, NEVER by taking $e^{a_{ij}t}$ entry-by-entry! Also keep Prof. Chan’s domain boundary sharp: $(s\\mathbf{I}-\\mathbf{A})^{-1}$ is strictly $s$-domain, while $\\mathbf{\\Phi}(t)$ is strictly $t$-domain.',
      },
      {
        heading: '2. Characteristic Equation, Eigenvalues & The $2\\times 2$ Adjugate Sign Trap',
        explanation:
          'First construct $(s\\mathbf{I} - \\mathbf{A})$ carefully: put $(s - a_{ii})$ on the diagonal and **negate** every off-diagonal entry ($-a_{ij}$). Setting its determinant to zero gives the **characteristic equation**, whose roots $\\lambda_i$ are the system eigenvalues (and closed-loop poles!). Then invert $(s\\mathbf{I} - \\mathbf{A})$ using the $2\\times 2$ adjugate rule:',
        math: '$$\\det(s\\mathbf{I} - \\mathbf{A}) = 0 \\implies \\text{eigenvalues } \\lambda_i; \\qquad \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}^{-1} = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$$',
        whyItWorks:
          'Watch the two sign flips! Step 1 ($s\\mathbf{I} - \\mathbf{A}$) puts $-a_{12}$ and $-a_{21}$ off the diagonal. Step 2 ($\\operatorname{adj}$) swaps the diagonal terms and negates the off-diagonals *again*, turning $-a_{12}$ back into $+a_{12}$! Dropping either sign flip is the #1 arithmetic error on Type G problems.',
      },
      {
        heading: '3. The 4-Step $\\mathbf{\\Phi}(t)$ Recipe & Mandatory $\\mathbf{\\Phi}(0) = \\mathbf{I}$ Sanity Gate',
        explanation:
          'Execute these 4 steps cleanly on any $2\\times 2$ problem (like HW **E3.10**):\n1. Form $(s\\mathbf{I} - \\mathbf{A})$.\n2. Factor $\\det(s\\mathbf{I} - \\mathbf{A})$ to find eigenvalues $\\lambda_1, \\lambda_2$.\n3. Write $(s\\mathbf{I} - \\mathbf{A})^{-1} = \\frac{\\operatorname{adj}(s\\mathbf{I}-\\mathbf{A})}{\\det(s\\mathbf{I}-\\mathbf{A})}$.\n4. Partial-fraction and invert each of the 4 entries.\n\n**Mandatory 5-Second Sanity Gate:** Plug $t = 0$ into your finished $\\mathbf{\\Phi}(t)$ AND differentiate at $t = 0$:',
        math: '$$\\mathbf{\\Phi}(0) = \\mathbf{I} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}, \\qquad \\dot{\\mathbf{\\Phi}}(0) = \\mathbf{A}$$',
        whyItWorks:
          'At $t = 0$, no time has elapsed so $\\mathbf{x}(0) = \\mathbf{\\Phi}(0)\\mathbf{x}(0)$ forces $\\mathbf{\\Phi}(0) = \\mathbf{I}$. And $\\dot{\\mathbf{x}}(0) = \\dot{\\mathbf{\\Phi}}(0)\\mathbf{x}(0) = \\mathbf{A}\\mathbf{x}(0)$ forces $\\dot{\\mathbf{\\Phi}}(0) = \\mathbf{A}$. If either check fails, you immediately know which entry has a partial-fraction error!',
      },
      {
        heading: '4. State-Space to Transfer Function $G(s)$ & The SISO Cramer Shortcut',
        explanation:
          'Setting $\\mathbf{x}(0) = \\mathbf{0}$ and plugging $\\mathbf{X}(s) = (s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B}U(s)$ into $Y(s) = \\mathbf{C}\\mathbf{X}(s) + \\mathbf{D}U(s)$ gives the universal state-to-TF formula:',
        math: '$$G(s) = \\frac{Y(s)}{U(s)} = \\mathbf{C}(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B} + \\mathbf{D}$$',
        whyItWorks:
          'Notice $\\det(s\\mathbf{I}-\\mathbf{A})$ forms the denominator of $G(s)$ (barring pole-zero cancellation). **Exam Shortcut (HW E3.19):** For SISO systems, you do NOT need all 4 entries of $(s\\mathbf{I}-\\mathbf{A})^{-1}$! Either compute $(s\\mathbf{I}-\\mathbf{A})^{-1}\\mathbf{B}$ first (when $\\mathbf{B}=[0,1]^T$, that’s just column 2 of the adjugate divided by the determinant!), solve $(s\\mathbf{I}-\\mathbf{A})\\mathbf{z} = \\mathbf{B}$ via Cramer’s rule, or eliminate $X_1, X_2$ directly from the scalar $s$-equations. For E3.19 ($\\mathbf{A}=\\begin{bmatrix}0&1\\\\-3&-5\\end{bmatrix}, \\mathbf{B}=[0,1]^T, \\mathbf{C}=[3,0]$), column 2 is $\\frac{1}{s^2+5s+3}\\begin{bmatrix}1\\\\s\\end{bmatrix}$, dotting with $[3,0]$ gives $G(s) = \\frac{3}{s^2+5s+3}$ in 15 seconds!',
      },
    ],
    workedWalkthrough: {
      title: 'Eigenvalues, Resolvent & State Transition Matrix (HW E3.10)',
      context:
        'A hovering vehicle is modeled by $\\dot{\\mathbf{x}}(t) = \\begin{bmatrix} 0 & 6 \\\\ -1 & -5 \\end{bmatrix} \\mathbf{x}(t) + \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} u(t)$. Find (a) the characteristic roots (eigenvalues) and (b) the state transition matrix $\\mathbf{\\Phi}(t) = e^{\\mathbf{A}t}$, then verify both sanity gates.',
      steps: [
        {
          title: 'Form $(s\\mathbf{I} - \\mathbf{A})$ and Find Eigenvalues',
          math: '$$s\\mathbf{I} - \\mathbf{A} = \\begin{bmatrix} s & 0 \\\\ 0 & s \\end{bmatrix} - \\begin{bmatrix} 0 & 6 \\\\ -1 & -5 \\end{bmatrix} = \\begin{bmatrix} s & -6 \\\\ 1 & s+5 \\end{bmatrix}$$\n$$\\det(s\\mathbf{I} - \\mathbf{A}) = s(s+5) - (-6)(1) = s^2 + 5s + 6 = (s+2)(s+3) = 0 \\implies \\lambda_1 = -2, \\; \\lambda_2 = -3$$',
          reasoning:
            'Both eigenvalues lie in the open Left-Half Plane, so the unforced system decays exponentially to zero.',
        },
        {
          title: 'Compute the Resolvent Matrix $(s\\mathbf{I} - \\mathbf{A})^{-1}$',
          math: '$$(s\\mathbf{I} - \\mathbf{A})^{-1} = \\frac{1}{(s+2)(s+3)} \\begin{bmatrix} s+5 & 6 \\\\ -1 & s \\end{bmatrix} = \\begin{bmatrix} \\frac{s+5}{(s+2)(s+3)} & \\frac{6}{(s+2)(s+3)} \\\\ \\frac{-1}{(s+2)(s+3)} & \\frac{s}{(s+2)(s+3)} \\end{bmatrix}$$',
          reasoning:
            'Swap $s$ and $s+5$ on the main diagonal; negate $-6 \\to +6$ and $+1 \\to -1$ on the off-diagonal.',
          tip: 'Check $(s\\mathbf{I}-\\mathbf{A}) \\cdot \\operatorname{adj}$ mentally: top-right entry $s(6) + (-6)(s) = 0$ confirms the off-diagonal signs!',
        },
        {
          title: 'Expand Each of the 4 Entries Into Partial Fractions',
          math: '$$\\Phi_{11}(s) = \\frac{3}{s+2} - \\frac{2}{s+3}, \\qquad \\Phi_{12}(s) = \\frac{6}{s+2} - \\frac{6}{s+3}$$\n$$\\Phi_{21}(s) = \\frac{-1}{s+2} + \\frac{1}{s+3}, \\qquad \\Phi_{22}(s) = \\frac{-2}{s+2} + \\frac{3}{s+3}$$',
          reasoning:
            'Use quick Heaviside cover-up at $s = -2$ and $s = -3$ for each entry.',
        },
        {
          title: 'Invert to Assemble $\\mathbf{\\Phi}(t)$ & Pass Both Mandatory Sanity Gates',
          math: '$$\\mathbf{\\Phi}(t) = \\begin{bmatrix} 3e^{-2t} - 2e^{-3t} & 6e^{-2t} - 6e^{-3t} \\\\ -e^{-2t} + e^{-3t} & -2e^{-2t} + 3e^{-3t} \\end{bmatrix}, \\quad t \\ge 0$$',
          reasoning:
            'Gate 1: $\\mathbf{\\Phi}(0) = \\begin{bmatrix} 3-2 & 6-6 \\\\ -1+1 & -2+3 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = \\mathbf{I}$ (Passed!). Gate 2: $\\dot{\\mathbf{\\Phi}}(0) = \\begin{bmatrix} -6+6 & -12+18 \\\\ 2-3 & 4-9 \\end{bmatrix} = \\begin{bmatrix} 0 & 6 \\\\ -1 & -5 \\end{bmatrix} = \\mathbf{A}$ (Passed!).',
        },
      ],
      takeaway:
        'Every entry of $\\mathbf{\\Phi}(t)$ is a blend of the eigenmodes $e^{-2t}$ and $e^{-3t}$, and the two-second check $\\mathbf{\\Phi}(0)=\\mathbf{I}, \\; \\dot{\\mathbf{\\Phi}}(0)=\\mathbf{A}$ proves the algebra is spotless.',
    },
    conceptChecks: [
      {
        id: 'ch3-trans-q1',
        question:
          'For $\\mathbf{A} = \\begin{bmatrix} 0 & 6 \\\\ -1 & -5 \\end{bmatrix}$, a student writes $e^{\\mathbf{A}t} = \\begin{bmatrix} e^0 & e^{6t} \\\\ e^{-t} & e^{-5t} \\end{bmatrix}$. Why is this fatally wrong?',
        choices: [
          {
            text: 'The matrix exponential is NOT element-wise—and at $t=0$ this gives $\\begin{bmatrix} 1 & 1 \\\\ 1 & 1 \\end{bmatrix} \\neq \\mathbf{I}$!',
            correct: true,
            feedback:
              'Spot on! Off-diagonal entries couple the states, so $e^{\\mathbf{A}t} = \\mathcal{L}^{-1}\\{(s\\mathbf{I}-\\mathbf{A})^{-1}\\}$. Checking $\\mathbf{\\Phi}(0) = \\mathbf{I}$ catches this blunder instantly.',
          },
          {
            text: 'Only the diagonal entries should be exponentiated; off-diagonals stay constant.',
            correct: false,
            feedback:
              'Still wrong! Off-diagonal entries in $e^{\\mathbf{A}t}$ vary with time (here $6e^{-2t} - 6e^{-3t}$) whenever $\\mathbf{A}$ is coupled.',
          },
          {
            text: 'It is actually right, just written before factoring out $t$.',
            correct: false,
            feedback:
              'Never! Element-wise $e^{a_{ij}t}$ only works when $\\mathbf{A}$ is purely diagonal (and even then, off-diagonal zeros become $e^0 = 1 \\neq 0$!).',
          },
          {
            text: 'You must take $\\ln(\\mathbf{A}t)$ instead of $e^{\\mathbf{A}t}$.',
            correct: false,
            feedback:
              'State transition is indeed $e^{\\mathbf{A}t}$, computed via the matrix series or inverse Laplace of $(s\\mathbf{I}-\\mathbf{A})^{-1}$, never logarithm.',
          },
        ],
      },
      {
        id: 'ch3-trans-q2',
        question:
          'Given $s\\mathbf{I} - \\mathbf{A} = \\begin{bmatrix} s & -1 \\\\ 3 & s+5 \\end{bmatrix}$ (HW E3.19), what is $\\operatorname{adj}(s\\mathbf{I} - \\mathbf{A})$?',
        choices: [
          {
            text: '$\\begin{bmatrix} s+5 & 1 \\\\ -3 & s \\end{bmatrix}$',
            correct: true,
            feedback:
              'Correct! Swap the diagonal entries ($s \\leftrightarrow s+5$) and negate both off-diagonal entries ($-1 \\to +1$, $3 \\to -3$).',
          },
          {
            text: '$\\begin{bmatrix} s+5 & -1 \\\\ 3 & s \\end{bmatrix}$',
            correct: false,
            feedback:
              'Adjugate sign trap! You swapped the diagonal entries but forgot to negate the off-diagonal entries.',
          },
          {
            text: '$\\begin{bmatrix} s & 1 \\\\ -3 & s+5 \\end{bmatrix}$',
            correct: false,
            feedback:
              'You negated the off-diagonals correctly, but forgot to swap the two diagonal entries!',
          },
          {
            text: '$\\begin{bmatrix} s+5 & -3 \\\\ 1 & s \\end{bmatrix}$',
            correct: false,
            feedback:
              'You transposed the matrix instead of negating the off-diagonals—the adjugate of a $2\\times 2$ does NOT transpose without negating!',
          },
        ],
      },
      {
        id: 'ch3-trans-q3',
        question:
          'To compute $G(s) = \\mathbf{C}(s\\mathbf{I}-\\mathbf{A})^{-1}\\mathbf{B} + \\mathbf{D}$ for a SISO system, what is the fastest, cleanest way to avoid wasted matrix algebra?',
        choices: [
          {
            text: 'Compute $(s\\mathbf{I}-\\mathbf{A})^{-1}\\mathbf{B}$ first (or solve $(s\\mathbf{I}-\\mathbf{A})\\mathbf{z} = \\mathbf{B}$), then multiply by $\\mathbf{C}$ and add $\\mathbf{D}$.',
            correct: true,
            feedback:
              'Yes! Especially when $\\mathbf{B} = [0, 1]^T$, you only ever use one column of $(s\\mathbf{I}-\\mathbf{A})^{-1}$—saving half the algebra!',
          },
          {
            text: 'Compute $\\mathbf{B}\\mathbf{C}$ first, then divide by $\\det(s\\mathbf{I}-\\mathbf{A})$.',
            correct: false,
            feedback:
              'Careful! Matrix multiplication is not commutative: $\\mathbf{B}\\mathbf{C}$ gives an $n\\times n$ matrix, whereas $G(s) = \\mathbf{C}(\\dots)\\mathbf{B}$ is a $1\\times 1$ scalar!',
          },
          {
            text: 'Compute $\\mathbf{\\Phi}(t)$ in the time domain first, then take its Laplace transform.',
            correct: false,
            feedback:
              'Going $s \\to t \\to s$ is massive extra work—$G(s)$ stays entirely in the $s$-domain.',
          },
          {
            text: 'Ignore $\\mathbf{D}$ because transfer functions never have a feedthrough term.',
            correct: false,
            feedback:
              'Proper transfer functions with equal numerator/denominator degree DO have non-zero $\\mathbf{D}$!',
          },
        ],
      },
    ],
    tipsAndTraps: {
      shortcuts: [
        'Sylvester’s $2\\times 2$ spectral shortcut (distinct $\\lambda_1 \\neq \\lambda_2$): $\\mathbf{\\Phi}(t) = \\frac{\\mathbf{A}-\\lambda_2\\mathbf{I}}{\\lambda_1-\\lambda_2} e^{\\lambda_1 t} + \\frac{\\mathbf{A}-\\lambda_1\\mathbf{I}}{\\lambda_2-\\lambda_1} e^{\\lambda_2 t}$—skips partial fractions completely!',
        'For SISO state-to-TF (E3.19) with companion $\\mathbf{B} = [0, 1]^T$, $(s\\mathbf{I}-\\mathbf{A})^{-1}\\mathbf{B}$ is just the second column of $\\operatorname{adj}(s\\mathbf{I}-\\mathbf{A})$ divided by $\\det(s\\mathbf{I}-\\mathbf{A})$.',
      ],
      traps: [
        'Computing $e^{\\mathbf{A}t}$ entry-by-entry ($e^{a_{ij}t}$)—instant zero credit on Type G.',
        'Forgetting to negate off-diagonals either when forming $(s\\mathbf{I}-\\mathbf{A})$ or when taking the $2\\times 2$ adjugate.',
        'Confusing $\\mathbf{C}(\\dots)\\mathbf{B}$ with $\\mathbf{B}(\\dots)\\mathbf{C}$ or dropping $\\mathbf{D}$.',
        'Submitting $\\mathbf{\\Phi}(t)$ without checking $\\mathbf{\\Phi}(0) = \\mathbf{I}$.',
      ],
      memorize: [
        '$\\mathbf{\\Phi}(t) = e^{\\mathbf{A}t} = \\mathcal{L}^{-1}\\{(s\\mathbf{I} - \\mathbf{A})^{-1}\\}, \\qquad \\mathbf{\\Phi}(0) = \\mathbf{I}, \\; \\dot{\\mathbf{\\Phi}}(0) = \\mathbf{A}$',
        '$G(s) = \\mathbf{C}(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B} + \\mathbf{D}$',
      ],
    },
    relatedProblemIds: ['E3.10', 'E3.19'],
  },
];
