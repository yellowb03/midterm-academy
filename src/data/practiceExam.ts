import type { PracticeQuestion } from '../types';

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'q1',
    number: 1,
    title: 'Conceptual Foundations of Feedback Control',
    points: 12,
    topicTags: ['Ch. 1', 'Feedback Anatomy', 'Sensitivity'],
    diagramType: 'q1-feedback',
    stem: 'Demonstrate your mastery of feedback loop architecture, open-loop vs. closed-loop behavior, and the mathematical role of loop gain in reducing parameter sensitivity.',
    parts: [
      {
        label: '(a)',
        points: 4,
        prompt:
          'In control engineering, define each of the four primary subsystem elements and provide a concrete physical example for each in a temperature chamber or DC motor drive:\n(i) Plant  (ii) Actuator  (iii) Sensor (Transducer)  (iv) Controller',
        solutionSteps: [
          {
            title: '1. Plant (Controlled Process)',
            math: '$$G(s): \\text{input effort } U(s) \\longrightarrow \\text{physical output } Y(s)$$',
            reasoning:
              'Definition: The physical system or process whose output variable is to be regulated. Think of the plant as the "body" that actually experiences physics (heat capacity, inertia, friction).\n• Temperature Chamber Example: The insulated thermal enclosure and internal air volume.\n• DC Motor Drive Example: The rotor inertia, shaft friction, and connected mechanical load.',
          },
          {
            title: '2. Actuator (Power Interface)',
            math: '$$\\text{Low-power logic command} \\xrightarrow{\\text{Actuator}} \\text{High-power physical effort}$$',
            reasoning:
              'Definition: The power-amplifying device that converts low-energy controller commands into high-energy physical effort capable of driving the plant.\n• Temperature Chamber Example: Solid-state relay (SSR) / SCR heater driver supplying AC power to heating coils.\n• DC Motor Drive Example: H-bridge PWM inverter or power amplifier supplying motor current.',
          },
          {
            title: '3. Sensor / Transducer (Measurement Element)',
            math: '$$H(s): \\text{physical output } Y(s) \\longrightarrow \\text{calibrated feedback } B(s)$$',
            reasoning:
              'Definition: The measurement device that converts the physical output state into a calibrated electrical signal suitable for feedback comparison.\n• Temperature Chamber Example: Thermocouple, RTD (PT100), or thermistor.\n• DC Motor Drive Example: Optical incremental encoder or tachometer.',
          },
          {
            title: '4. Controller (Decision Law)',
            math: '$$U(s) = G_c(s) E(s)$$',
            reasoning:
              'Definition: The computing or analog unit executing the control law, calculating the corrective control command $U(s)$ from the actuating error $E(s)$.\n• Temperature Chamber Example: Microcontroller running a PID thermal regulation law.\n• DC Motor Drive Example: DSP computing lead-lag or state-feedback control effort.',
          },
        ],
        finalAnswer:
          'Plant (physical process), Actuator (power interface), Sensor/Transducer (output measurement), and Controller (error-driven decision law), each paired with a concrete chamber or DC motor component.',
        rubricItems: [
          { criterion: 'Plant definition + concrete physical example', points: 1 },
          { criterion: 'Actuator definition + concrete physical example', points: 1 },
          { criterion: 'Sensor / Transducer definition + concrete physical example', points: 1 },
          { criterion: 'Controller definition + concrete physical example', points: 1 },
        ],
        deductionWarning:
          '-1 pt if concrete physical examples are omitted; -1 pt if actuator (power muscle) and controller (decision brain) roles are confused.',
      },
      {
        label: '(b)',
        points: 4,
        prompt:
          'Contrast the fundamental mechanisms of an open-loop vs. closed-loop (feedback) control system. Sketch a SISO negative feedback block diagram labeling: Reference $R(s)$, Error $E(s)$, Controller $G_c(s)$, Actuator/Plant $G(s)$, Output $Y(s)$, Sensor $H(s)$, Disturbance $D(s)$, Noise $N(s)$.',
        solutionSteps: [
          {
            title: 'Compare Open-Loop vs. Closed-Loop Mechanisms',
            math: '$$\\text{Open-Loop: } u(t) = f(r(t)) \\qquad \\text{Closed-Loop: } e(t) = r(t) - b(t),\\; u(t) = f(e(t))$$',
            reasoning:
              '• Open-Loop Control: Actuation depends strictly on the input command without measuring the output. It is simple, inexpensive, and cannot destabilize an already stable plant—but it is completely blind to external disturbances, load changes, or component drift.\n• Closed-Loop (Negative Feedback) Control: The actual output $y(t)$ is continuously measured by $H(s)$, compared against $r(t)$ to produce error $e(t)$, and fed to $G_c(s)$. This rejects disturbances, lowers parameter sensitivity, and can stabilize unstable plants, at the cost of extra hardware, sensor noise injection, and potential loop instability.',
          },
          {
            title: 'Construct the Complete SISO Feedback Block Diagram',
            math: '$$E(s) = R(s) - [H(s)Y(s) + N(s)], \\qquad Y(s) = G(s)\\left[G_c(s)E(s) + D(s)\\right]$$',
            reasoning:
              'Trace the signals around the loop carefully (see the interactive diagram above): $R(s)$ enters $(+)$ at the first summing junction while the feedback branch enters $(-)$ to form $E(s)$. Controller $G_c(s)$ feeds a second summing junction where load disturbance $D(s)$ enters $(+)$ before plant $G(s)$. Output $Y(s)$ is tapped through sensor $H(s)$, where measurement noise $N(s)$ adds $(+)$ before returning to the comparator.',
            tip: 'Never forget the + and - signs on every summing junction—graders always check the negative sign on the feedback branch.',
          },
        ],
        finalAnswer:
          'Open-loop acts blindly on $R(s)$ alone (no disturbance rejection); closed-loop forms $E(s) = R(s) - (H(s)Y(s) + N(s))$ to actively correct output deviations, with $D(s)$ entering between $G_c(s)$ and $G(s)$ and $N(s)$ entering the feedback measurement path.',
        rubricItems: [
          { criterion: 'Open-loop mechanism & key limitation (blind to disturbances/drift)', points: 1 },
          { criterion: 'Closed-loop mechanism & trade-offs (rejection vs. noise/stability)', points: 1 },
          {
            criterion: 'Complete block diagram with all 8 labeled signals and summing junction signs',
            points: 2,
          },
        ],
        deductionWarning:
          '-1 pt if summing junction signs (+/-) are missing; -1 pt if disturbance D(s) or sensor noise N(s) injection points are placed in the wrong branch.',
      },
      {
        label: '(c)',
        points: 4,
        prompt:
          'Explain mathematically why negative feedback reduces sensitivity to plant parameter variations. For $T(s) = \\frac{G(s)}{1 + G(s)H(s)}$, derive the sensitivity function $S_G^T(s) = \\frac{\\partial T / T}{\\partial G / G}$ and explain system behavior when $|G(s)H(s)| \\gg 1$.',
        solutionSteps: [
          {
            title: 'Apply the Quotient Rule to T(s)',
            math: '$$\\frac{\\partial T}{\\partial G} = \\frac{1 \\cdot [1 + G(s)H(s)] - G(s) \\cdot H(s)}{[1 + G(s)H(s)]^2} = \\frac{1}{[1 + G(s)H(s)]^2}$$',
            reasoning:
              'Why does this work? Sensitivity measures the percentage change in closed-loop gain $T(s)$ per percentage change in plant gain $G(s)$: $S_G^T(s) \\equiv \\frac{\\partial T / T}{\\partial G / G} = \\frac{\\partial T}{\\partial G} \\cdot \\frac{G}{T}$. First differentiate $T(s)$ with respect to $G(s)$.',
          },
          {
            title: 'Multiply by G / T to Obtain S_G^T(s)',
            math: '$$S_G^T(s) = \\frac{1}{[1 + G(s)H(s)]^2} \\cdot [1 + G(s)H(s)] = \\frac{1}{1 + G(s)H(s)}$$',
            reasoning:
              'Since $T(s) = \\frac{G(s)}{1 + G(s)H(s)}$, inverting gives $\\frac{G}{T} = 1 + G(s)H(s)$. Multiplying cancels one factor of $1 + G(s)H(s)$ in the denominator.',
          },
          {
            title: 'Analyze High Loop Gain Behavior |G(s)H(s)| >> 1',
            math: '$$|S_G^T(j\\omega)| \\approx \\frac{1}{|G(j\\omega)H(j\\omega)|} \\ll 1, \\qquad T(s) = \\frac{G(s)}{1 + G(s)H(s)} = \\frac{1}{\\frac{1}{G(s)} + H(s)} \\approx \\frac{1}{H(s)}$$',
            reasoning:
              'Think of it like this: the loop gain $1 + G(s)H(s)$ acts as a shock absorber for plant uncertainty, so $\\frac{\\Delta T}{T} \\approx S_G^T \\frac{\\Delta G}{G} \\to 0$. At the same time, $T(s)$ becomes independent of the messy, aging plant $G(s)$ and depends solely on the precision feedback sensor $H(s)$!',
            tip: 'This explains why engineers spend money on an accurate sensor H(s) rather than trying to make a motor or heater G(s) perfectly invariant.',
          },
        ],
        finalAnswer:
          '$S_G^T(s) = \\frac{1}{1 + G(s)H(s)}$. When $|G(s)H(s)| \\gg 1$, $S_G^T(s) \\to 0$ (plant variations are attenuated) and $T(s) \\approx \\frac{1}{H(s)}$ (output tracking is governed purely by the sensor).',
        rubricItems: [
          { criterion: 'Quotient rule derivation of S_G^T(s) = 1 / (1 + G(s)H(s))', points: 2 },
          { criterion: 'Showing parameter sensitivity approaches zero when |G(s)H(s)| >> 1', points: 1 },
          { criterion: 'Showing closed-loop transfer function approaches T(s) ≈ 1 / H(s)', points: 1 },
        ],
        deductionWarning:
          '-1 pt if the normalization factor G/T is omitted in the sensitivity definition (writing S = ∂T/∂G instead of (∂T/T)/(∂G/G)).',
      },
    ],
  },
  {
    id: 'q2',
    number: 2,
    title: 'Nonlinearity & Taylor Series Linearization',
    points: 12,
    topicTags: ['Ch. 2', 'Linearization', 'Taylor Series'],
    stem: 'A nonlinear sensor/actuator element exhibits a static input-output characteristic described by:\n$$y = g(x) = 2x^2 + 3x$$\nwhere $x$ is the input variable and $y$ is the resulting output measurement. The device is operating near a nominal equilibrium operating point $x_0 = 2$.',
    parts: [
      {
        label: '(a)',
        points: 3,
        prompt: 'Determine the nominal operating output value $y_0 = g(x_0)$.',
        solutionSteps: [
          {
            title: 'Evaluate the Nonlinear Characteristic at x_0 = 2',
            math: '$$y_0 = g(2) = 2(2)^2 + 3(2) = 2(4) + 6 = 8 + 6 = 14$$',
            reasoning:
              'Before drawing a tangent line, we need the anchor point $(x_0, y_0)$ on the curve where the system rests in equilibrium.',
          },
        ],
        finalAnswer: '$y_0 = 14$',
        rubricItems: [{ criterion: 'Correct evaluation of y_0 = g(2) = 14', points: 3 }],
        deductionWarning:
          '-2 pts for plugging x_0 = 2 into the derivative g\'(x) instead of the original function g(x).',
      },
      {
        label: '(b)',
        points: 4,
        prompt:
          'Using a first-order Taylor series expansion about $x_0 = 2$, evaluate the local tangent slope $m = \\left.\\frac{dg}{dx}\\right|_{x_0}$ and state the incremental linear deviation model relating $\\Delta y = y - y_0$ to $\\Delta x = x - x_0$.',
        solutionSteps: [
          {
            title: 'Differentiate g(x) and Evaluate at x_0 = 2',
            math: '$$\\frac{dg}{dx} = \\frac{d}{dx}(2x^2 + 3x) = 4x + 3 \\implies m = \\left.\\frac{dg}{dx}\\right|_{x_0 = 2} = 4(2) + 3 = 11$$',
            reasoning:
              'Always differentiate the symbolic function $g(x)$ FIRST, and only substitute $x_0 = 2$ AFTER differentiating. Visually, $m = 11$ is the slope of the tangent line kissing the parabola at $(2, 14)$.',
          },
          {
            title: 'Write the Incremental Deviation Model',
            math: '$$\\Delta y \\approx m\\,\\Delta x = 11\\,\\Delta x$$',
            reasoning:
              'In control systems, transfer functions relate small deviations $(\\Delta x, \\Delta y)$ around equilibrium rather than total values $(x, y)$, because $\\Delta y = 11\\Delta x$ passes cleanly through $(0,0)$ and obeys linearity.',
          },
        ],
        finalAnswer: '$m = 11$, and the incremental linear deviation model is $\\Delta y \\approx 11\\,\\Delta x$.',
        rubricItems: [
          { criterion: 'Correct symbolic derivative dg/dx = 4x + 3', points: 2 },
          { criterion: 'Correct slope evaluation m = 11 at x_0 = 2', points: 1 },
          { criterion: 'Correct incremental deviation equation Δy ≈ 11 Δx', points: 1 },
        ],
        deductionWarning:
          '-2 pts for differentiating the constant y_0 = 14 (getting 0) instead of differentiating g(x) first; -1 pt for writing Δy = 11x instead of 11Δx.',
      },
      {
        label: '(c)',
        points: 3,
        prompt:
          'Write the corresponding absolute linear tangent line equation $y(x)$ in standard slope-intercept form $y = mx + c$.',
        solutionSteps: [
          {
            title: 'Shift Back to Absolute Coordinates',
            math: '$$y(x) \\approx y_0 + m(x - x_0) = 14 + 11(x - 2) = 14 + 11x - 22 = 11x - 8$$',
            reasoning:
              'Expanding $\\Delta y = y - y_0$ and $\\Delta x = x - x_0$ restores the operating baseline $(2, 14)$. Quick sanity check: at $x = 2$, $11(2) - 8 = 14 = y_0$!',
          },
        ],
        finalAnswer: '$y = 11x - 8$',
        rubricItems: [
          { criterion: 'Point-slope tangent setup y - 14 = 11(x - 2)', points: 2 },
          { criterion: 'Simplification to slope-intercept form y = 11x - 8', points: 1 },
        ],
        deductionWarning:
          '-2 pts for confusing the deviation model Δy = 11Δx with the absolute tangent line y = 11x - 8 (dropping the baseline offset y_0).',
      },
      {
        label: '(d)',
        points: 2,
        prompt:
          'State the exact mathematical term in the Taylor series expansion that was discarded to produce this linear model. For what physical operational range of $\\Delta x$ is this linear model considered valid?',
        solutionSteps: [
          {
            title: 'Compute the Exact Discarded Taylor Remainder',
            math: '$$g(x_0 + \\Delta x) = g(x_0) + g\'(x_0)\\Delta x + \\frac{1}{2!}g\'\'(x_0)(\\Delta x)^2 + \\cdots \\implies R_1(\\Delta x) = \\frac{1}{2}(4)(\\Delta x)^2 = 2(\\Delta x)^2$$',
            reasoning:
              'Because $g(x) = 2x^2 + 3x$ is quadratic, $g\'\'(x) = 4$ and every derivative of order $n \\ge 3$ is identically zero! So the entire discarded tail is just one exact quadratic term: $2(\\Delta x)^2$.',
          },
          {
            title: 'Determine the Small-Perturbation Validity Range',
            math: '$$\\frac{|2(\\Delta x)^2|}{|11\\,\\Delta x|} \\le 0.05 \\implies |\\Delta x| \\le \\frac{0.05 \\times 11}{2} = 0.275 \\quad (\\text{generally } |\\Delta x| \\ll x_0 = 2)$$',
            reasoning:
              'A linear model is trustworthy as long as the discarded quadratic curvature $2(\\Delta x)^2$ stays tiny compared to the linear term $11\\Delta x$. For a standard $5\\%$ relative error budget, $|\\Delta x| \\le 0.275$ (so $x \\in [1.725, 2.275]$).',
          },
        ],
        finalAnswer:
          'Exact discarded term: $2(\\Delta x)^2$. Valid for small deviations $|\\Delta x| \\ll 2$ (specifically $|\\Delta x| \\le 0.275$ for $\\le 5\\%$ relative error).',
        rubricItems: [
          { criterion: 'Identifying exact discarded term R_1(Δx) = 2(Δx)²', points: 1 },
          { criterion: 'Stating small-deviation validity condition |Δx| << 2 (or ≤ 0.275 for 5% error)', points: 1 },
        ],
        deductionWarning:
          '-1 pt for vaguely writing "higher-order terms" without computing the exact quadratic term 2(Δx)².',
      },
    ],
  },
  {
    id: 'q3',
    number: 3,
    title: 'Laplace Transform, Partial Fractions & Final Value Theorem',
    points: 16,
    topicTags: ['Ch. 2', 'Laplace', 'Partial Fractions', 'FVT'],
    stem: 'A stable linear time-invariant system with zero initial conditions is subjected to a unit step input $R(s) = \\frac{1}{s}$. The resulting output transform is given by:\n$$Y(s) = \\frac{12(s + 1)}{s(s + 2)(s + 4)}$$',
    parts: [
      {
        label: '(a)',
        points: 8,
        prompt:
          'Perform a partial fraction expansion of $Y(s)$:\n$$Y(s) = \\frac{A}{s} + \\frac{B}{s + 2} + \\frac{C}{s + 4}$$\nEvaluate the residue coefficients $A$, $B$, and $C$ using the Heaviside cover-up method. Show all intermediate substitution steps clearly.',
        solutionSteps: [
          {
            title: 'Evaluate Residue A at Pole s = 0',
            math: '$$A = \\left.s\\,Y(s)\\right|_{s = 0} = \\left.\\frac{12(s + 1)}{(s + 2)(s + 4)}\\right|_{s = 0} = \\frac{12(1)}{(2)(4)} = \\frac{12}{8} = \\frac{3}{2} = 1.5$$',
            reasoning:
              'Why does cover-up work? Multiplying $Y(s)$ by $s$ cancels the $1/s$ singularity and forces the $B$ and $C$ terms to vanish when we evaluate at $s = 0$.',
          },
          {
            title: 'Evaluate Residue B at Pole s = -2',
            math: '$$B = \\left.(s + 2)\\,Y(s)\\right|_{s = -2} = \\left.\\frac{12(s + 1)}{s(s + 4)}\\right|_{s = -2} = \\frac{12(-2 + 1)}{(-2)(-2 + 4)} = \\frac{-12}{-4} = 3$$',
            reasoning:
              'Cover up $(s+2)$ in the denominator and evaluate the remaining rational expression at $s = -2$. Track the double negative carefully!',
          },
          {
            title: 'Evaluate Residue C at Pole s = -4',
            math: '$$C = \\left.(s + 4)\\,Y(s)\\right|_{s = -4} = \\left.\\frac{12(s + 1)}{s(s + 2)}\\right|_{s = -4} = \\frac{12(-4 + 1)}{(-4)(-4 + 2)} = \\frac{-36}{8} = -\\frac{9}{2} = -4.5$$',
            reasoning:
              'Cover up $(s+4)$ and evaluate at $s = -4$. Notice the two negatives in the denominator give $+8$, so $C$ is negative.',
            tip: 'Instant residue sanity check: Since the degree of the denominator (3) exceeds the numerator (1) by 2, the high-frequency limit requires A + B + C = 0. Check: 1.5 + 3 - 4.5 = 0!',
          },
        ],
        finalAnswer: '$$Y(s) = \\frac{1.5}{s} + \\frac{3}{s + 2} - \\frac{4.5}{s + 4}$$',
        rubricItems: [
          { criterion: 'Partial fraction template setup for 3 distinct real poles', points: 1 },
          { criterion: 'Residue A = 1.5 with explicit substitution at s = 0', points: 2.5 },
          { criterion: 'Residue B = 3 with explicit substitution at s = -2', points: 2.5 },
          { criterion: 'Residue C = -4.5 with explicit substitution at s = -4', points: 2 },
        ],
        deductionWarning:
          '-2 pts for arithmetic sign errors in residue evaluation; -1 pt if intermediate cover-up substitution steps are omitted.',
      },
      {
        label: '(b)',
        points: 4,
        prompt:
          'Find the analytical time-domain response $y(t)$ for $t \\ge 0$ by taking the inverse Laplace transform. Verify the initial value $y(0^+)$ to confirm physical consistency with the Initial Value Theorem.',
        solutionSteps: [
          {
            title: 'Invert Each Partial Fraction Term-by-Term',
            math: '$$y(t) = \\mathcal{L}^{-1}\\!\\left\\{\\frac{1.5}{s} + \\frac{3}{s + 2} - \\frac{4.5}{s + 4}\\right\\} = \\left(1.5 + 3e^{-2t} - 4.5e^{-4t}\\right)u(t), \\qquad t \\ge 0$$',
            reasoning:
              'Recall the fundamental pairs $\\mathcal{L}^{-1}\\{1/s\\} = u(t)$ and $\\mathcal{L}^{-1}\\{1/(s+a)\\} = e^{-at}u(t)$. The $1.5$ is the forced steady-state plateau, while $3e^{-2t}$ and $-4.5e^{-4t}$ are decaying transient modes.',
          },
          {
            title: 'Verify Initial Value y(0^+) via Initial Value Theorem',
            math: '$$y(0^+) = 1.5 + 3e^0 - 4.5e^0 = 0, \\qquad \\lim_{s \\to \\infty} s\\,Y(s) = \\lim_{s \\to \\infty} \\frac{12s^2 + 12s}{s^3 + 6s^2 + 8s} = 0 \\;\\checkmark$$',
            reasoning:
              'Physical systems with strictly proper transfer functions ($\\deg \\text{den} - \\deg \\text{num} \\ge 2$ for step response) cannot jump instantaneously at $t = 0^+$, so $y(0^+) = 0$ confirms both our zero-IC assumption and our residue arithmetic.',
          },
        ],
        finalAnswer: '$y(t) = \\left(1.5 + 3e^{-2t} - 4.5e^{-4t}\\right)u(t)$ for $t \\ge 0$, with $y(0^+) = 0$ matching $\\lim_{s\\to\\infty} sY(s) = 0$.',
        rubricItems: [
          { criterion: 'Correct inverse Laplace time-domain expression (1.5, 3e^{-2t}, -4.5e^{-4t}) for t ≥ 0', points: 3 },
          { criterion: 'Initial value check y(0^+) = 0 matching Initial Value Theorem', points: 1 },
        ],
        deductionWarning:
          '-1 pt for omitting u(t) or t ≥ 0 domain specification; -1 pt for skipping the Initial Value Theorem check.',
      },
      {
        label: '(c)',
        points: 4,
        prompt:
          'Compute the steady-state output $y_{ss} = \\lim_{t \\to \\infty} y(t)$ using the Final Value Theorem (FVT). State the necessary and sufficient pole condition that licenses the valid use of the FVT, and verify whether $Y(s)$ satisfies it. Explain why the FVT cannot be applied if a system\'s transform has a pole at $s = +1$.',
        solutionSteps: [
          {
            title: 'Check the Mandatory Pole Condition for s Y(s)',
            math: '$$s\\,Y(s) = \\frac{12(s + 1)}{(s + 2)(s + 4)} \\implies \\text{poles of } s\\,Y(s) \\text{ are at } s = -2,\\; s = -4$$',
            reasoning:
              'License Condition: The Final Value Theorem is valid IF AND ONLY IF all poles of $sY(s)$ lie strictly in the Open Left-Half Plane (OLHP), i.e., $\\text{Re}(p_i) < 0$. Notice the pole at $s=0$ cancels out when multiplying by $s$, leaving only $s = -2$ and $s = -4$, both strictly in the OLHP. Thus FVT is licensed!',
          },
          {
            title: 'Compute Steady-State Value via FVT',
            math: '$$y_{ss} = \\lim_{t \\to \\infty} y(t) = \\lim_{s \\to 0} s\\,Y(s) = \\lim_{s \\to 0} \\frac{12(s + 1)}{(s + 2)(s + 4)} = \\frac{12(1)}{(2)(4)} = 1.5$$',
            reasoning:
              'This matches the $t \\to \\infty$ limit of our analytical solution $1.5 + 3e^{-2t} - 4.5e^{-4t} \\to 1.5$.',
          },
          {
            title: 'Explain Why a Pole at s = +1 Invalidates FVT',
            math: '$$\\text{Pole at } s = +1 \\implies y(t) \\text{ contains } K e^{+t} \\xrightarrow{t \\to \\infty} \\infty$$',
            reasoning:
              'If $Y(s)$ has a Right-Half Plane pole at $s = +1$, the time response blows up exponentially and no finite steady-state limit exists. Blindly computing $\\lim_{s\\to 0} sY(s)$ would return a completely bogus finite number—a classic fatal exam error.',
          },
        ],
        finalAnswer:
          '$y_{ss} = 1.5$. Valid because all poles of $sY(s)$ ($s = -2, -4$) lie strictly in the OLHP. A pole at $s = +1$ introduces an unstable $Ke^{+t}$ mode that diverges to $\\infty$, invalidating FVT.',
        rubricItems: [
          { criterion: 'Correct FVT limit computation y_ss = 1.5', points: 2 },
          { criterion: 'Explicit statement & verification that poles of sY(s) (-2, -4) lie in OLHP', points: 1 },
          { criterion: 'Explanation that s = +1 causes e^{+t} divergence so limit does not exist', points: 1 },
        ],
        deductionWarning:
          '-3 pts for applying FVT without explicitly stating and verifying the OLHP pole condition on sY(s).',
      },
    ],
  },
  {
    id: 'q4',
    number: 4,
    title: 'Mechanical System Modeling & State-Space Realization',
    points: 16,
    topicTags: ['Ch. 2 & 3', 'Mechanical Modeling', 'State-Space', 'DC Gain'],
    diagramType: 'q4-cart',
    stem: 'Consider a translational mechanical system where a mass $M$ moves horizontally on a frictionless guide surface, restrained by a linear spring ($k$) and a viscous damper ($b$) connected to a rigid wall. An external force $u(t)$ acts on the mass, and its horizontal displacement from unstretched equilibrium is $y(t)$ (positive displacement and force point to the right).',
    parts: [
      {
        label: '(a)',
        points: 5,
        prompt:
          'Draw the free-body diagram of the mass $M$. Clearly identify all forces acting on the body with their algebraic signs. Applying Newton\'s Second Law of motion, derive the governing second-order differential equation relating displacement $y(t)$ to input force $u(t)$.',
        solutionSteps: [
          {
            title: 'Identify All Horizontal Forces on Mass M',
            math: '$$F_{\\text{ext}} = +u(t), \\qquad F_s = -k\\,y(t), \\qquad F_d = -b\\,\\dot{y}(t)$$',
            reasoning:
              'Taking rightward motion ($y > 0, \\dot{y} > 0$) as positive: the applied driving force $+u(t)$ pulls right, while both the stretched spring ($-ky$) and viscous damper ($-b\\dot{y}$) resist motion and pull left.',
          },
          {
            title: 'Apply Newton\'s Second Law',
            math: '$$\\sum F_x = M\\ddot{y}(t) \\implies M\\ddot{y}(t) = u(t) - b\\dot{y}(t) - k\\,y(t) \\implies M\\ddot{y}(t) + b\\dot{y}(t) + k\\,y(t) = u(t)$$',
            reasoning:
              'Moving the restoring forces to the left-hand side puts the ODE in standard canonical form where all physical parameters ($M, b, k$) appear with positive signs.',
          },
        ],
        finalAnswer: '$M\\ddot{y}(t) + b\\dot{y}(t) + k\\,y(t) = u(t)$',
        rubricItems: [
          { criterion: 'Free-body diagram & forces (+u, -ky, -bẏ) identified with correct signs', points: 2 },
          { criterion: 'Newton\'s Second Law derivation yielding Mÿ + bẏ + ky = u', points: 3 },
        ],
        deductionWarning:
          '-2 pts for sign errors in Newton\'s law (e.g., forgetting the minus signs on restoring spring/damper forces).',
      },
      {
        label: '(b)',
        points: 6,
        prompt:
          'Choose the physical state variables as $x_1(t) = y(t)$ (position) and $x_2(t) = \\dot{y}(t)$ (velocity). Derive the pair of first-order state differential equations $\\dot{x}_1(t)$ and $\\dot{x}_2(t)$. Express the complete system in standard vector-matrix state-space form $\\dot{\\mathbf{x}}(t) = \\mathbf{A}\\mathbf{x}(t) + \\mathbf{B}u(t)$, $y(t) = \\mathbf{C}\\mathbf{x}(t) + \\mathbf{D}u(t)$ with explicit entries in terms of $M, b, k$.',
        solutionSteps: [
          {
            title: 'Write First-Order State Differential Equations',
            math: '$$\\dot{x}_1(t) = \\dot{y}(t) = x_2(t), \\qquad \\dot{x}_2(t) = \\ddot{y}(t) = -\\frac{k}{M}x_1(t) - \\frac{b}{M}x_2(t) + \\frac{1}{M}u(t)$$',
            reasoning:
              'Why 2 states? Because a mass-spring system has 2 independent energy storage elements (kinetic energy $\\frac{1}{2}M\\dot{y}^2$ and potential energy $\\frac{1}{2}ky^2$). Solve the governing ODE for the highest derivative $\\ddot{y}$ and substitute $y = x_1, \\dot{y} = x_2$.',
          },
          {
            title: 'Assemble Explicit State-Space Matrices A, B, C, D',
            math: '$$\\begin{bmatrix} \\dot{x}_1 \\\\ \\dot{x}_2 \\end{bmatrix} = \\begin{bmatrix} 0 & 1 \\\\ -\\frac{k}{M} & -\\frac{b}{M} \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} + \\begin{bmatrix} 0 \\\\ \\frac{1}{M} \\end{bmatrix} u(t), \\qquad y(t) = \\begin{bmatrix} 1 & 0 \\end{bmatrix}\\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} + [0]u(t)$$',
            reasoning:
              'Notice the companion structure: the first row of $\\mathbf{A}$ is $[0 \\;\\; 1]$ because $\\dot{x}_1 = x_2$, and the bottom row holds the negated monic coefficients $[-k/M \\;\\; -b/M]$ in ascending order of derivative ($x_1$ then $x_2$).',
            tip: 'Always double-check that you divided by mass M before placing -k/M and -b/M into the bottom row!',
          },
        ],
        finalAnswer:
          '$\\mathbf{A} = \\begin{bmatrix} 0 & 1 \\\\ -\\frac{k}{M} & -\\frac{b}{M} \\end{bmatrix},\\; \\mathbf{B} = \\begin{bmatrix} 0 \\\\ \\frac{1}{M} \\end{bmatrix},\\; \\mathbf{C} = \\begin{bmatrix} 1 & 0 \\end{bmatrix},\\; \\mathbf{D} = 0$',
        rubricItems: [
          { criterion: 'State variable definitions x_1 = y, x_2 = ẏ', points: 1 },
          { criterion: 'First-order state equations for ẋ_1 and ẋ_2', points: 2 },
          { criterion: 'Explicit matrices A, B, C, and D in terms of M, b, k', points: 3 },
        ],
        deductionWarning:
          '-2 pts for positive signs (+k/M or +b/M) in A; -2 pts for swapping (2,1) and (2,2) entries in A; -1 pt for omitting D = 0.',
      },
      {
        label: '(c)',
        points: 5,
        prompt:
          'Assuming zero initial conditions, take the Laplace transform of the governing differential equation to derive the transfer function $G(s) = \\frac{Y(s)}{U(s)}$. Identify the system order, the characteristic polynomial $\\Delta(s)$, and explain the physical meaning of the static DC gain $G(0)$ in terms of spring equilibrium.',
        solutionSteps: [
          {
            title: 'Take Laplace Transform with Zero Initial Conditions',
            math: '$$(Ms^2 + bs + k)Y(s) = U(s) \\implies G(s) = \\frac{Y(s)}{U(s)} = \\frac{1}{Ms^2 + bs + k}$$',
            reasoning:
              'Under zero initial conditions ($y(0)=0, \\dot{y}(0)=0$), each time derivative simply multiplies by $s$.',
          },
          {
            title: 'Identify System Order & Characteristic Polynomial',
            math: '$$\\text{Order} = 2, \\qquad \\Delta(s) = Ms^2 + bs + k$$',
            reasoning:
              'The highest power of $s$ in the denominator is $s^2$, matching the two energy storage modes (mass inertia + spring potential).',
          },
          {
            title: 'Compute Static DC Gain G(0) & Explain Spring Equilibrium',
            math: '$$G(0) = \\lim_{s \\to 0} G(s) = \\frac{1}{k} \\implies y_{ss} = G(0)F_0 = \\frac{F_0}{k}$$',
            reasoning:
              'Think of what happens physically if you apply a constant steady force $u(t) = F_0$ and wait until the mass stops moving: at steady state, $\\dot{y} = 0$ and $\\ddot{y} = 0$, so both damping force $b\\dot{y}$ and inertial force $M\\ddot{y}$ vanish! Only the spring holds back the force: $ky_{ss} = F_0$. Thus $G(0) = 1/k$ is literally the static mechanical compliance of the spring.',
          },
        ],
        finalAnswer:
          '$G(s) = \\frac{1}{Ms^2 + bs + k}$, Order = 2, $\\Delta(s) = Ms^2 + bs + k$. Static DC gain $G(0) = \\frac{1}{k}$ represents spring compliance ($y_{ss} = F_0/k$ via Hooke\'s Law).',
        rubricItems: [
          { criterion: 'Laplace transform and transfer function G(s) = 1 / (Ms² + bs + k)', points: 2 },
          { criterion: 'System order (2) and characteristic polynomial Δ(s)', points: 1 },
          { criterion: 'Static DC gain G(0) = 1/k and Hooke\'s Law physical equilibrium explanation', points: 2 },
        ],
        deductionWarning:
          '-1 pt for stating G(0) = 1/k without explaining why inertia M and damping b vanish at steady state.',
      },
    ],
  },
  {
    id: 'q5',
    number: 5,
    title: 'Block Diagram Algebra & Multi-Input Disturbance Rejection',
    points: 14,
    topicTags: ['Ch. 2', 'Block Diagrams', 'Superposition', 'Disturbance Rejection'],
    diagramType: 'q5-multiloop',
    stem: 'Consider the multi-input feedback control system depicted above, where $R(s)$ represents the reference command, $D(s)$ represents an external load disturbance, $G_1(s)$ is the controller, $G_2(s)$ is the plant, and $H(s)$ is the feedback sensor.',
    parts: [
      {
        label: '(a)',
        points: 3,
        prompt:
          'Label the intermediate signals on the diagram: error $E(s) = R(s) - H(s)Y(s)$ and plant input $V(s) = G_1(s)E(s) + D(s)$. Write the algebraic equations at each summing junction and block output.',
        solutionSteps: [
          {
            title: 'Write Algebraic Equations Node-by-Node',
            math: '$$E(s) = R(s) - H(s)Y(s), \\qquad V(s) = G_1(s)E(s) + D(s), \\qquad Y(s) = G_2(s)V(s)$$',
            reasoning:
              'Using the Signal-Equation Method prevents sign and block-shift mistakes. Start at the leftmost summing junction for $E(s)$, pass through $G_1(s)$ into the disturbance junction for $V(s)$, and finally multiply by $G_2(s)$ to get $Y(s)$.',
          },
        ],
        finalAnswer: '$E(s) = R(s) - H(s)Y(s)$, $V(s) = G_1(s)E(s) + D(s)$, and $Y(s) = G_2(s)V(s)$.',
        rubricItems: [
          { criterion: 'Error comparator equation E(s) = R(s) - H(s)Y(s)', points: 1 },
          { criterion: 'Disturbance summing junction equation V(s) = G_1(s)E(s) + D(s)', points: 1 },
          { criterion: 'Plant output equation Y(s) = G_2(s)V(s)', points: 1 },
        ],
        deductionWarning:
          '-1 pt for dropping the negative sign on the feedback path H(s)Y(s) at the comparator.',
      },
      {
        label: '(b)',
        points: 5,
        prompt:
          'Setting the load disturbance to zero ($D(s) = 0$), derive the closed-loop tracking transfer function:\n$$T_R(s) = \\left.\\frac{Y(s)}{R(s)}\\right|_{D(s)=0}$$\nShow every algebraic substitution and factorization step clearly.',
        solutionSteps: [
          {
            title: 'Substitute Signals with D(s) = 0',
            math: '$$Y(s) = G_2(s)\\left[G_1(s)E(s) + 0\\right] = G_1(s)G_2(s)\\left[R(s) - H(s)Y(s)\\right]$$',
            reasoning:
              'By linearity, setting $D(s) = 0$ isolates the reference response cleanly.',
          },
          {
            title: 'Collect Y(s) Terms and Factor',
            math: '$$Y(s) + G_1(s)G_2(s)H(s)Y(s) = G_1(s)G_2(s)R(s) \\implies \\left[1 + G_1(s)G_2(s)H(s)\\right]Y(s) = G_1(s)G_2(s)R(s)$$',
            reasoning:
              'Move the $-G_1 G_2 H Y$ term to the left-hand side—this is why negative feedback creates $+G_1 G_2 H$ in the denominator!',
          },
          {
            title: 'Divide to Obtain T_R(s)',
            math: '$$T_R(s) = \\left.\\frac{Y(s)}{R(s)}\\right|_{D(s)=0} = \\frac{G_1(s)G_2(s)}{1 + G_1(s)G_2(s)H(s)}$$',
            reasoning:
              'Matches the canonical negative feedback formula $\\frac{\\text{forward path}}{1 + \\text{loop gain}}$.',
          },
        ],
        finalAnswer: '$$T_R(s) = \\frac{G_1(s)G_2(s)}{1 + G_1(s)G_2(s)H(s)}$$',
        rubricItems: [
          { criterion: 'Correct substitution of node equations with D(s) = 0', points: 2 },
          { criterion: 'Collecting and factoring [1 + G_1 G_2 H] Y(s)', points: 2 },
          { criterion: 'Final closed-loop tracking transfer function T_R(s)', points: 1 },
        ],
        deductionWarning:
          '-1 pt for writing the negative feedback denominator as 1 - G_1 G_2 H instead of 1 + G_1 G_2 H.',
      },
      {
        label: '(c)',
        points: 4,
        prompt:
          'Setting the reference input to zero ($R(s) = 0$), derive the disturbance-to-output transfer function:\n$$T_D(s) = \\left.\\frac{Y(s)}{D(s)}\\right|_{R(s)=0}$$\nBy the principle of superposition, write the total combined output transform $Y(s)$ in terms of $R(s)$ and $D(s)$.',
        solutionSteps: [
          {
            title: 'Substitute Signals with R(s) = 0',
            math: '$$E(s) = 0 - H(s)Y(s) = -H(s)Y(s) \\implies V(s) = -G_1(s)H(s)Y(s) + D(s)$$',
            reasoning:
              'Watch the forward path from $D(s)$ to $Y(s)$: the disturbance enters AFTER $G_1(s)$, so $D(s)$ only passes through $G_2(s)$ on its way to the output, while $G_1(s)$ sits in the feedback return path seen by $D(s)$!',
          },
          {
            title: 'Solve for T_D(s)',
            math: '$$Y(s) = G_2(s)\\left[-G_1(s)H(s)Y(s) + D(s)\\right] \\implies \\left[1 + G_1(s)G_2(s)H(s)\\right]Y(s) = G_2(s)D(s)$$\n$$T_D(s) = \\left.\\frac{Y(s)}{D(s)}\\right|_{R(s)=0} = \\frac{G_2(s)}{1 + G_1(s)G_2(s)H(s)}$$',
            reasoning:
              'Notice that the characteristic denominator $1 + G_1 G_2 H$ is identical for BOTH $T_R(s)$ and $T_D(s)$ because they share the same physical loop!',
          },
          {
            title: 'Combine via Linear Superposition',
            math: '$$Y(s) = T_R(s)R(s) + T_D(s)D(s) = \\frac{G_1(s)G_2(s)}{1 + G_1(s)G_2(s)H(s)}R(s) + \\frac{G_2(s)}{1 + G_1(s)G_2(s)H(s)}D(s)$$',
            reasoning:
              'Because the system is linear, the total output is simply the sum of the reference response and the disturbance response.',
          },
        ],
        finalAnswer:
          '$T_D(s) = \\frac{G_2(s)}{1 + G_1(s)G_2(s)H(s)}$, and $Y(s) = \\frac{G_1(s)G_2(s)}{1 + G_1(s)G_2(s)H(s)}R(s) + \\frac{G_2(s)}{1 + G_1(s)G_2(s)H(s)}D(s)$.',
        rubricItems: [
          { criterion: 'Substitution with R(s) = 0 giving E = -HY and V = D - G_1 HY', points: 2 },
          { criterion: 'Correct disturbance transfer function T_D(s) = G_2 / (1 + G_1 G_2 H)', points: 1 },
          { criterion: 'Total combined output Y(s) = T_R(s)R(s) + T_D(s)D(s)', points: 1 },
        ],
        deductionWarning:
          '-2 pts for erroneously putting G_1(s) in the numerator of T_D(s)—D(s) enters AFTER the controller G_1(s)!',
      },
      {
        label: '(d)',
        points: 2,
        prompt:
          'Explain how the choice of controller gain $|G_1(s)| \\gg 1$ in the operational frequency band affects reference tracking versus disturbance rejection.',
        solutionSteps: [
          {
            title: 'Compare Asymptotic Limits as |G_1(s)| >> 1',
            math: '$$T_D(s) \\approx \\frac{G_2(s)}{G_1(s)G_2(s)H(s)} = \\frac{1}{G_1(s)H(s)} \\to 0, \\qquad T_R(s) \\approx \\frac{G_1(s)G_2(s)}{G_1(s)G_2(s)H(s)} = \\frac{1}{H(s)}$$',
            reasoning:
              'Because $G_1(s)$ appears in BOTH numerator and denominator of $T_R(s)$ but ONLY in the denominator of $T_D(s)$, making controller gain $|G_1(s)|$ large crushes the disturbance response $T_D(s) \\to 0$ while keeping setpoint tracking $T_R(s) \\approx 1/H(s)$ intact!',
          },
        ],
        finalAnswer:
          'High controller gain $|G_1(s)| \\gg 1$ drives $T_D(s) \\approx \\frac{1}{G_1(s)H(s)} \\to 0$ (actively rejecting disturbances) while preserving $T_R(s) \\approx \\frac{1}{H(s)}$ (faithful reference tracking).',
        rubricItems: [
          { criterion: 'Showing T_D(s) ≈ 1/(G_1 H) → 0 for disturbance rejection', points: 1 },
          { criterion: 'Showing T_R(s) ≈ 1/H preserves reference tracking', points: 1 },
        ],
        deductionWarning:
          '-1 pt for claiming high G_1(s) attenuates reference tracking too, or omitting the 1/H tracking limit.',
      },
    ],
  },
  {
    id: 'q6',
    number: 6,
    title: 'State Transition Matrix & State-Space to Transfer Function',
    points: 16,
    topicTags: ['Ch. 3', 'State-Space', 'Transition Matrix', 'Resolvent'],
    diagramType: 'q6-integrators',
    stem: 'A continuous-time linear time-invariant system is described by the state-space model:\n$$\\dot{\\mathbf{x}}(t) = \\begin{bmatrix} 0 & 1 \\\\ -6 & -5 \\end{bmatrix}\\mathbf{x}(t) + \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}u(t), \\qquad y(t) = \\begin{bmatrix} 1 & 0 \\end{bmatrix}\\mathbf{x}(t)$$',
    parts: [
      {
        label: '(a)',
        points: 3,
        prompt:
          'State the dimensions of matrices $\\mathbf{A}$, $\\mathbf{B}$, $\\mathbf{C}$, and $\\mathbf{D}$. Compute the characteristic equation $\\det(\\lambda\\mathbf{I} - \\mathbf{A}) = 0$ and find the eigenvalues $\\lambda_1, \\lambda_2$ of matrix $\\mathbf{A}$. Classify the asymptotic stability of the system.',
        solutionSteps: [
          {
            title: 'Identify Matrix Dimensions',
            math: '$$\\mathbf{A} \\in \\mathbb{R}^{2 \\times 2}, \\quad \\mathbf{B} \\in \\mathbb{R}^{2 \\times 1}, \\quad \\mathbf{C} \\in \\mathbb{R}^{1 \\times 2}, \\quad \\mathbf{D} = 0 \\in \\mathbb{R}^{1 \\times 1}$$',
            reasoning:
              'Here $n = 2$ states, $m = 1$ input, and $p = 1$ output. Even though $\\mathbf{D}$ is not written explicitly in $y(t) = \\mathbf{C}\\mathbf{x}(t)$, it is implicitly the $1 \\times 1$ zero matrix.',
          },
          {
            title: 'Solve Characteristic Equation for Eigenvalues',
            math: '$$\\det(\\lambda\\mathbf{I} - \\mathbf{A}) = \\det\\begin{bmatrix} \\lambda & -1 \\\\ 6 & \\lambda + 5 \\end{bmatrix} = \\lambda(\\lambda + 5) - (-1)(6) = \\lambda^2 + 5\\lambda + 6 = (\\lambda + 2)(\\lambda + 3) = 0$$',
            reasoning:
              'Setting the determinant to zero gives $\\lambda_1 = -2$ and $\\lambda_2 = -3$.',
          },
          {
            title: 'Classify Asymptotic Stability',
            math: '$$\\text{Re}(\\lambda_1) = -2 < 0, \\quad \\text{Re}(\\lambda_2) = -3 < 0 \\implies \\text{Asymptotically Stable}$$',
            reasoning:
              'Because both eigenvalues have strictly negative real parts, the natural unforced modes $e^{-2t}$ and $e^{-3t}$ decay exponentially to zero as $t \\to \\infty$.',
          },
        ],
        finalAnswer:
          'Dimensions: $\\mathbf{A}(2\\times 2), \\mathbf{B}(2\\times 1), \\mathbf{C}(1\\times 2), \\mathbf{D}(1\\times 1)$. Eigenvalues: $\\lambda_1 = -2, \\lambda_2 = -3$. The system is strictly asymptotically stable.',
        rubricItems: [
          { criterion: 'Dimensions of A, B, C, and D', points: 1 },
          { criterion: 'Characteristic equation & eigenvalues λ_1 = -2, λ_2 = -3', points: 1 },
          { criterion: 'Asymptotic stability classification (Re(λ_i) < 0)', points: 1 },
        ],
        deductionWarning:
          '-1 pt for forgetting D = 0 dimension or getting signs flipped on characteristic roots (+2, +3).',
      },
      {
        label: '(b)',
        points: 4,
        prompt:
          'Construct the matrix $(s\\mathbf{I} - \\mathbf{A})$ and compute the resolvent matrix $(s\\mathbf{I} - \\mathbf{A})^{-1}$ as a $2 \\times 2$ matrix of rational functions in $s$.',
        solutionSteps: [
          {
            title: 'Form (sI - A) and Its Determinant',
            math: '$$s\\mathbf{I} - \\mathbf{A} = \\begin{bmatrix} s & -1 \\\\ 6 & s + 5 \\end{bmatrix}, \\qquad \\det(s\\mathbf{I} - \\mathbf{A}) = s^2 + 5s + 6 = (s + 2)(s + 3)$$',
            reasoning:
              'Be super careful with signs when subtracting $\\mathbf{A}$: subtracting $-6$ gives $+6$ in entry $(2,1)$, and subtracting $+1$ gives $-1$ in entry $(1,2)$.',
          },
          {
            title: 'Apply the 2x2 Matrix Inverse Formula',
            math: '$$(s\\mathbf{I} - \\mathbf{A})^{-1} = \\frac{1}{s^2 + 5s + 6}\\begin{bmatrix} s + 5 & 1 \\\\ -6 & s \\end{bmatrix} = \\begin{bmatrix} \\frac{s + 5}{(s + 2)(s + 3)} & \\frac{1}{(s + 2)(s + 3)} \\\\ \\frac{-6}{(s + 2)(s + 3)} & \\frac{s}{(s + 2)(s + 3)} \\end{bmatrix}$$',
            reasoning:
              'Recall $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}^{-1} = \\frac{1}{ad - bc}\\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$: swap the main diagonal ($s \\leftrightarrow s+5$) and negate the off-diagonals ($-1 \\to +1$, $+6 \\to -6$).',
            tip: 'Quick check: multiply row 1 of (sI - A) by col 2 of adj(sI - A): s(1) + (-1)(s) = 0! Off-diagonal dot products must vanish.',
          },
        ],
        finalAnswer:
          '$$(s\\mathbf{I} - \\mathbf{A})^{-1} = \\begin{bmatrix} \\frac{s + 5}{(s + 2)(s + 3)} & \\frac{1}{(s + 2)(s + 3)} \\\\ \\frac{-6}{(s + 2)(s + 3)} & \\frac{s}{(s + 2)(s + 3)} \\end{bmatrix}$$',
        rubricItems: [
          { criterion: 'Correct matrix sI - A and determinant (s+2)(s+3)', points: 1 },
          { criterion: 'Correct 2×2 adjugate inverse rational matrix', points: 3 },
        ],
        deductionWarning:
          '-2 pts for forgetting to negate off-diagonal entries (+1 and -6) when forming the adjugate matrix.',
      },
      {
        label: '(c)',
        points: 4,
        prompt:
          'Compute the state transition matrix $\\mathbf{\\Phi}(t) = e^{\\mathbf{A}t}$ for $t \\ge 0$ by taking the element-by-element inverse Laplace transform:\n$$\\mathbf{\\Phi}(t) = \\mathcal{L}^{-1}\\!\\left\\{(s\\mathbf{I} - \\mathbf{A})^{-1}\\right\\}$$',
        solutionSteps: [
          {
            title: 'Partial Fraction Expansion of Row 1 Entries',
            math: '$$\\Phi_{11}(s) = \\frac{s + 5}{(s + 2)(s + 3)} = \\frac{3}{s + 2} - \\frac{2}{s + 3} \\implies \\phi_{11}(t) = 3e^{-2t} - 2e^{-3t}$$\n$$\\Phi_{12}(s) = \\frac{1}{(s + 2)(s + 3)} = \\frac{1}{s + 2} - \\frac{1}{s + 3} \\implies \\phi_{12}(t) = e^{-2t} - e^{-3t}$$',
            reasoning:
              'Use Heaviside cover-up on each rational entry independently.',
          },
          {
            title: 'Partial Fraction Expansion of Row 2 Entries',
            math: '$$\\Phi_{21}(s) = \\frac{-6}{(s + 2)(s + 3)} = \\frac{-6}{s + 2} + \\frac{6}{s + 3} \\implies \\phi_{21}(t) = -6e^{-2t} + 6e^{-3t}$$\n$$\\Phi_{22}(s) = \\frac{s}{(s + 2)(s + 3)} = \\frac{-2}{s + 2} + \\frac{3}{s + 3} \\implies \\phi_{22}(t) = -2e^{-2t} + 3e^{-3t}$$',
            reasoning:
              'Notice an awesome structural shortcut: since $x_2 = \\dot{x}_1$ in companion form, row 2 of $\\mathbf{\\Phi}(t)$ MUST equal the time derivative of row 1! Check: $\\frac{d}{dt}(3e^{-2t} - 2e^{-3t}) = -6e^{-2t} + 6e^{-3t}$!',
          },
        ],
        finalAnswer:
          '$$\\mathbf{\\Phi}(t) = \\begin{bmatrix} 3e^{-2t} - 2e^{-3t} & e^{-2t} - e^{-3t} \\\\ -6e^{-2t} + 6e^{-3t} & -2e^{-2t} + 3e^{-3t} \\end{bmatrix}, \\qquad t \\ge 0$$',
        rubricItems: [
          { criterion: 'Entry (1,1) PFE & inverse Laplace: 3e^{-2t} - 2e^{-3t}', points: 1 },
          { criterion: 'Entry (1,2) PFE & inverse Laplace: e^{-2t} - e^{-3t}', points: 1 },
          { criterion: 'Entry (2,1) PFE & inverse Laplace: -6e^{-2t} + 6e^{-3t}', points: 1 },
          { criterion: 'Entry (2,2) PFE & inverse Laplace: -2e^{-2t} + 3e^{-3t}', points: 1 },
        ],
        deductionWarning:
          '-1 pt per incorrect entry. Note: Cayley-Hamilton Φ(t) = α_0(t)I + α_1(t)A receives full credit if fully derived.',
      },
      {
        label: '(d)',
        points: 2,
        prompt:
          'Analytically verify that your state transition matrix satisfies the fundamental initial conditions:\n$$\\mathbf{\\Phi}(0) = \\mathbf{I} \\qquad \\text{and} \\qquad \\left.\\frac{d\\mathbf{\\Phi}}{dt}\\right|_{t = 0} = \\mathbf{A}$$',
        solutionSteps: [
          {
            title: 'Verify Φ(0) = I',
            math: '$$\\mathbf{\\Phi}(0) = \\begin{bmatrix} 3(1) - 2(1) & 1 - 1 \\\\ -6(1) + 6(1) & -2(1) + 3(1) \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = \\mathbf{I} \\;\\checkmark$$',
            reasoning:
              'At $t = 0$, the state has not transitioned yet, so $\\mathbf{x}(0) = \\mathbf{\\Phi}(0)\\mathbf{x}(0)$ requires $\\mathbf{\\Phi}(0) = \\mathbf{I}$.',
          },
          {
            title: 'Differentiate Φ(t) and Verify dΦ/dt|_{t=0} = A',
            math: '$$\\dot{\\mathbf{\\Phi}}(t) = \\begin{bmatrix} -6e^{-2t} + 6e^{-3t} & -2e^{-2t} + 3e^{-3t} \\\\ 12e^{-2t} - 18e^{-3t} & 4e^{-2t} - 9e^{-3t} \\end{bmatrix} \\implies \\dot{\\mathbf{\\Phi}}(0) = \\begin{bmatrix} 0 & 1 \\\\ -6 & -5 \\end{bmatrix} = \\mathbf{A} \\;\\checkmark$$',
            reasoning:
              'Because $\\mathbf{\\Phi}(t)$ satisfies the matrix differential equation $\\dot{\\mathbf{\\Phi}}(t) = \\mathbf{A}\\mathbf{\\Phi}(t)$ with $\\mathbf{\\Phi}(0) = \\mathbf{I}$, its slope at $t = 0$ must recover $\\mathbf{A}$ exactly.',
          },
        ],
        finalAnswer:
          '$\\mathbf{\\Phi}(0) = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = \\mathbf{I}$ and $\\dot{\\mathbf{\\Phi}}(0) = \\begin{bmatrix} 0 & 1 \\\\ -6 & -5 \\end{bmatrix} = \\mathbf{A}$ verified.',
        rubricItems: [
          { criterion: 'Explicit evaluation Φ(0) = I', points: 1 },
          { criterion: 'Explicit differentiation and evaluation dΦ/dt|_{t=0} = A', points: 1 },
        ],
        deductionWarning:
          '-1 pt for simply stating Φ(0) = I without substituting t = 0 into every entry.',
      },
      {
        label: '(e)',
        points: 3,
        prompt:
          'Using the matrix formula $G(s) = \\mathbf{C}(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B} + \\mathbf{D}$, compute the transfer function $G(s) = \\frac{Y(s)}{U(s)}$. Verify that the poles of $G(s)$ match the system eigenvalues found in part (a).',
        solutionSteps: [
          {
            title: 'Compute (sI - A)^{-1} B',
            math: '$$(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B} = \\frac{1}{s^2 + 5s + 6}\\begin{bmatrix} s + 5 & 1 \\\\ -6 & s \\end{bmatrix}\\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} = \\frac{1}{s^2 + 5s + 6}\\begin{bmatrix} 1 \\\\ s \\end{bmatrix}$$',
            reasoning:
              'Multiplying by $\\mathbf{B} = [0 \\;\\; 1]^T$ simply picks out the second column of the resolvent matrix!',
          },
          {
            title: 'Pre-Multiply by C and Add D, Then Check Poles',
            math: '$$G(s) = \\begin{bmatrix} 1 & 0 \\end{bmatrix}\\frac{1}{s^2 + 5s + 6}\\begin{bmatrix} 1 \\\\ s \\end{bmatrix} + 0 = \\frac{1}{s^2 + 5s + 6} = \\frac{1}{(s + 2)(s + 3)}$$',
            reasoning:
              'Pre-multiplying by $\\mathbf{C} = [1 \\;\\; 0]$ picks out the first entry ($1$). The poles of $G(s)$ are $s = -2$ and $s = -3$, matching the eigenvalues $\\lambda_1, \\lambda_2$ identically.',
          },
        ],
        finalAnswer:
          '$G(s) = \\frac{1}{s^2 + 5s + 6} = \\frac{1}{(s + 2)(s + 3)}$; poles $s = -2, -3$ match eigenvalues $\\lambda_1, \\lambda_2$.',
        rubricItems: [
          { criterion: 'Matrix multiplication C(sI - A)^{-1}B + D = 1 / (s² + 5s + 6)', points: 2 },
          { criterion: 'Explicit verification that poles (-2, -3) match eigenvalues', points: 1 },
        ],
        deductionWarning:
          '-1 pt for omitting the explicit pole-to-eigenvalue comparison requested in the prompt.',
      },
    ],
  },
  {
    id: 'q7',
    number: 7,
    title: 'Field-Controlled DC Motor Modeling & Electromechanical Dynamics',
    points: 14,
    topicTags: ['Ch. 2', 'DC Motor', 'Electromechanical', 'Ex 2.5'],
    stem: 'In Chapter 2, Prof. Woei-Leong Chan presented an in-depth derivation of the field-controlled DC motor. In this configuration, the armature current is held strictly constant ($i_a(t) = I_a = \\text{const}$), while the control voltage $v_f(t)$ is applied to the stationary field circuit to regulate rotor speed $\\omega(t)$ and angular position $\\theta(t)$.',
    parts: [
      {
        label: '(a)',
        points: 3,
        prompt:
          'State all physical assumptions regarding magnetic saturation, armature current, and bearing friction. Explain how the torque $T_m(t)$ is generated from the field current $i_f(t)$.',
        solutionSteps: [
          {
            title: 'State the Three Physical Modeling Assumptions',
            math: '$$i_a(t) = I_a = \\text{const}, \\qquad \\phi(t) = K_f\'\\,i_f(t), \\qquad T_{\\text{friction}} = b\\,\\omega(t)$$',
            reasoning:
              '1. Constant Armature Current: An external current source holds $i_a(t) = I_a$ strictly constant.\n2. Linear Magnetic Circuit (No Saturation): Air-gap magnetic flux $\\phi(t)$ is directly proportional to field current $i_f(t)$.\n3. Rigid Rotor & Viscous Friction: The shaft is rigid with inertia $J$ and experiences linear viscous damping torque $b\\omega(t)$ proportional to angular velocity.',
          },
          {
            title: 'Derive the Torque Generation Relationship',
            math: '$$T_m(t) = K_1\\,\\phi(t)\\,i_a(t) = K_1\\,(K_f\'\\,i_f(t))\\,I_a = (K_1 K_f\' I_a)\\,i_f(t) = K_m\\,i_f(t)$$',
            reasoning:
              'Lorentz force on the armature conductors is proportional to the product of air-gap flux $\\phi(t)$ and armature current $i_a(t)$. Because $I_a$ is constant, all constants collapse into one motor torque constant $K_m \\equiv K_1 K_f\' I_a$ [$\\text{N}\\cdot\\text{m}/\\text{A}$].',
          },
        ],
        finalAnswer:
          'Assumptions: constant $I_a$, linear unsaturated flux $\\phi(t) = K_f\' i_f(t)$, and viscous friction $b\\omega(t)$. Torque is $T_m(t) = K_m i_f(t)$ where $K_m = K_1 K_f\' I_a$.',
        rubricItems: [
          { criterion: 'Stating constant I_a, unsaturated flux φ = K_f\' i_f, and viscous friction bω', points: 1.5 },
          { criterion: 'Deriving T_m(t) = K_m i_f(t) from flux × armature current', points: 1.5 },
        ],
        deductionWarning:
          '-1 pt for omitting the linear magnetic circuit (no saturation) assumption.',
      },
      {
        label: '(b)',
        points: 4,
        prompt:
          'Write the three fundamental differential equations governing:\n(i) The electrical field circuit dynamics using Kirchhoff\'s Voltage Law (KVL).\n(ii) The electromechanical torque generation equation relating $T_m(t)$ to $i_f(t)$ via motor constant $K_m$.\n(iii) The mechanical rotor rotational dynamics relating $T_m(t)$ to rotor inertia $J$, viscous damping $b$, and angular position $\\theta(t)$.',
        solutionSteps: [
          {
            title: 'Write All Three Governing Equations',
            math: '$$\\text{(i) } v_f(t) = R_f\\,i_f(t) + L_f\\frac{di_f(t)}{dt}, \\qquad \\text{(ii) } T_m(t) = K_m\\,i_f(t), \\qquad \\text{(iii) } J\\frac{d^2\\theta(t)}{dt^2} + b\\frac{d\\theta(t)}{dt} = T_m(t)$$',
            reasoning:
              'Notice the clean one-way cascade: field voltage $v_f$ drives field current $i_f$ through an $R_f$-$L_f$ loop; $i_f$ generates motor torque $T_m$; and $T_m$ accelerates the rotor inertia $J$ against viscous damping $b$ (with $\\omega = \\dot{\\theta}$).',
            tip: 'Do NOT put a back-EMF term K_b ω(t) inside the field KVL equation! Only armature-controlled motors have back-EMF in the control loop.',
          },
        ],
        finalAnswer:
          '(i) $v_f(t) = R_f i_f(t) + L_f \\frac{di_f}{dt}$, (ii) $T_m(t) = K_m i_f(t)$, (iii) $J\\ddot{\\theta}(t) + b\\dot{\\theta}(t) = T_m(t)$.',
        rubricItems: [
          { criterion: 'Field circuit KVL: v_f = R_f i_f + L_f (di_f/dt)', points: 1.5 },
          { criterion: 'Electromechanical torque equation: T_m = K_m i_f', points: 1 },
          { criterion: 'Mechanical rotor dynamics: J θ̈ + b θ̇ = T_m', points: 1.5 },
        ],
        deductionWarning:
          '-2 pts for mistakenly adding a back-EMF term K_b θ̇ into the field circuit equation (confusing field control with armature control).',
      },
      {
        label: '(c)',
        points: 4,
        prompt:
          'Taking Laplace transforms with zero initial conditions, derive the transfer function relating field voltage to angular velocity, $\\frac{\\Omega(s)}{V_f(s)}$, and the transfer function relating field voltage to angular position, $\\frac{\\Theta(s)}{V_f(s)}$.',
        solutionSteps: [
          {
            title: 'Take Laplace Transforms of Each Subsystem',
            math: '$$I_f(s) = \\frac{1}{L_f s + R_f}V_f(s), \\qquad T_m(s) = K_m I_f(s), \\qquad \\Omega(s) = \\frac{1}{Js + b}T_m(s)$$',
            reasoning:
              'With zero initial conditions, each differential equation becomes a simple first-order algebraic transfer block in series.',
          },
          {
            title: 'Cascade for Velocity TF and Integrate for Position TF',
            math: '$$\\frac{\\Omega(s)}{V_f(s)} = \\frac{K_m}{(L_f s + R_f)(Js + b)}, \\qquad \\Theta(s) = \\frac{1}{s}\\Omega(s) \\implies \\frac{\\Theta(s)}{V_f(s)} = \\frac{K_m}{s(L_f s + R_f)(Js + b)}$$',
            reasoning:
              'Multiplying the three series blocks yields the 2nd-order velocity transfer function. Since angular position is the integral of angular velocity ($\\theta(t) = \\int_0^t \\omega(\\tau)\\,d\\tau$), dividing by $s$ gives the 3rd-order position transfer function.',
          },
        ],
        finalAnswer:
          '$$\\frac{\\Omega(s)}{V_f(s)} = \\frac{K_m}{(L_f s + R_f)(Js + b)}, \\qquad \\frac{\\Theta(s)}{V_f(s)} = \\frac{K_m}{s(L_f s + R_f)(Js + b)}$$',
        rubricItems: [
          { criterion: 'Laplace transforms and velocity transfer function Ω(s)/V_f(s)', points: 2 },
          { criterion: 'Kinematic integration Θ(s) = Ω(s)/s and position transfer function Θ(s)/V_f(s)', points: 2 },
        ],
        deductionWarning:
          '-1 pt for omitting the 1/s integration factor when converting from velocity Ω(s) to position Θ(s).',
      },
      {
        label: '(d)',
        points: 3,
        prompt:
          'Address the following two critical physical questions:\n(i) Why is there NO back-EMF voltage feedback in a field-controlled DC motor, in stark contrast to an armature-controlled DC motor?\n(ii) Why does the position transfer function $\\frac{\\Theta(s)}{V_f(s)}$ possess an open-loop pole strictly at $s = 0$? What does this pole represent physically?',
        solutionSteps: [
          {
            title: '(i) Why There Is No Back-EMF in Field Control',
            math: '$$\\text{Field coils are stationary on stator} \\implies v_{\\text{back-EMF, field}} = 0$$',
            reasoning:
              'In an armature-controlled motor, the armature coils physically spin through the magnetic field, inducing a motional counter-EMF $v_b(t) = K_b\\omega(t)$ inside the armature circuit that opposes the applied voltage. In a field-controlled motor, the control voltage $v_f(t)$ feeds the stationary stator field coils. Because the field windings do not move, no motional back-EMF is induced in the field circuit—making it a pure passive $R_f$-$L_f$ load decoupled from rotor speed.',
          },
          {
            title: '(ii) Origin & Physical Meaning of the Pole at s = 0',
            math: '$$\\Theta(s) = \\frac{1}{s}\\Omega(s); \\quad v_f(t) = V_0 u(t) \\implies \\omega_{ss} = \\frac{K_m V_0}{R_f b} > 0 \\implies \\theta(t) \\approx \\omega_{ss}\\,t \\to \\infty$$',
            reasoning:
              'Mathematically, the $1/s$ factor comes from integrating speed to get angle. Physically, a free motor shaft has NO torsional restoring spring ($k = 0$) to pull it back to zero! Applying a constant voltage step produces a constant steady-state cruising speed $\\omega_{ss}$, causing the shaft angle $\\theta(t)$ to ramp linearly to infinity. That unbounded ramp response to a finite step input is the physical hallmark of an open-loop integrator pole at $s = 0$ (Type 1 system).',
          },
        ],
        finalAnswer:
          '(i) Field coils are physically stationary on the stator, so rotor motion induces no back-EMF in the field circuit. (ii) The $s=0$ pole comes from kinematic integration $\\Theta(s) = \\Omega(s)/s$ with no torsional restoring spring ($k=0$): a constant step voltage produces steady rotation $\\omega_{ss}$, causing angle $\\theta(t)$ to ramp unboundedly.',
        rubricItems: [
          { criterion: 'Explaining stationary stator field coils experience no motional back-EMF', points: 1.5 },
          {
            criterion: 'Explaining origin & physical meaning of s = 0 pole (no spring, integration / unbounded ramp)',
            points: 1.5,
          },
        ],
        deductionWarning:
          '-1.5 pts for confusing magnetic field flux with motional back-EMF or failing to connect s = 0 to pure integration without a restoring spring.',
      },
    ],
  },
];
