import type { HomeworkProblem } from '../types';

export const homeworkProblems: HomeworkProblem[] = [
  // =========================================================================
  // HOMEWORK 1 · CHAPTER 2 (E2.2, E2.3, E2.4, E2.31, P2.4)
  // =========================================================================
  {
    id: 'e2-2',
    code: 'E2.2',
    title: 'Thermistor Linearization',
    hw: 'HW 1',
    source: 'Textbook p. 130 (PDF p. 80)',
    problemType: 'A',
    typeLabel: 'Type A · Analytical Linearization',
    difficulty: 2,
    priority: 'HIGH',
    role: 'Core',
    originalStatement:
      'A thermistor has a response to temperature represented by $R = R_0 e^{-0.1 T}$, where $R_0 = 10{,}000\\,\\Omega$, $R$ = resistance, and $T$ = temperature in degrees Celsius. Find the linear model for the thermistor operating at $T = 20^\\circ\\text{C}$ and for a small range of variation of temperature.',
    bookAnswer: '$\\Delta R = -135 \\Delta T$',
    given: [
      'Nonlinear thermistor law: $R(T) = 10{,}000\\,e^{-0.1 T}\\,\\Omega$',
      'Operating temperature: $T_0 = 20^\\circ\\text{C}$',
      'Small temperature variation: $\\Delta T = T - T_0$',
    ],
    find: [
      'Linear perturbation model $\\Delta R = m\\,\\Delta T$ around $T_0 = 20^\\circ\\text{C}$',
      'Absolute tangent-line approximation $R(T)$ near $20^\\circ\\text{C}$',
    ],
    coreIntuition:
      'Think of zooming way in on a smooth curve with a magnifying glass: any curved graph looks practically like a straight line if you stay close enough to one point. Linearization simply replaces the curved exponential $R(T)$ near $20^\\circ\\text{C}$ with its tangent line at $20^\\circ\\text{C}$, keeping the baseline value and slope while discarding tiny higher-order curves.',
    quickCheck: {
      question:
        'Suppose we change the operating point from $20^\\circ\\text{C}$ to $40^\\circ\\text{C}$. What happens to our linear model $\\Delta R = m\\,\\Delta T$?',
      options: [
        'It stays $\\Delta R = -135\\,\\Delta T$ because it is a linear approximation.',
        'The slope $m$ changes (becomes flatter in magnitude) because the tangent slope depends on $T_0$.',
        'The slope becomes positive because $T_0$ increased.',
        'You must evaluate $R(40)$ first and then differentiate the constant $R(40)$.',
      ],
      correctIndex: 1,
      explanation:
        'Because $R(T)$ is exponential, its slope $dR/dT = -1000\\,e^{-0.1T}$ changes at every temperature. A linear model is strictly tied to its chosen operating point $T_0$.',
    },
    steps: [
      {
        title: 'Write the first-order Taylor tangent formula',
        math: '$$y \\approx g(x_0) + \\left.\\frac{dg}{dx}\\right|_{x_0}(x - x_0) \\quad\\Rightarrow\\quad \\Delta y \\approx m\\,\\Delta x, \\quad m = \\left.\\frac{dg}{dx}\\right|_{x_0}$$',
        reasoning:
          'Taylor expansion around $x_0$ splits the output into two pieces: where you start ($g(x_0)$) and how fast it changes ($m\\,\\Delta x$). Defining deviation variables $\\Delta y = y - g(x_0)$ and $\\Delta x = x - x_0$ shifts the origin right onto the operating point.',
      },
      {
        title: 'Differentiate the resistance law with respect to $T$',
        math: '$$\\frac{dR}{dT} = (-0.1) \\cdot 10{,}000\\,e^{-0.1 T} = -1000\\,e^{-0.1 T}$$',
        reasoning:
          'We need the local sensitivity (slope) of resistance to temperature. Applying the chain rule to $e^{-0.1 T}$ pulls down a factor of $-0.1$, giving a negative slope—meaning resistance drops as temperature rises (an NTC thermistor).',
        tip: 'Always differentiate symbolically BEFORE plugging in $T_0 = 20$!',
      },
      {
        title: 'Evaluate the slope and baseline at $T_0 = 20^\\circ\\text{C}$',
        math: '$$m = \\left.\\frac{dR}{dT}\\right|_{T=20} = -1000\\,e^{-0.1(20)} = -1000\\,e^{-2} \\approx -135.335\\,\\Omega/^\\circ\\text{C}$$',
        reasoning:
          'Plugging $T_0 = 20$ into the derivative locks in the tangent slope at our operating point. For completeness, the baseline resistance is $R(20) = 10{,}000\\,e^{-2} \\approx 1353.35\\,\\Omega$.',
      },
    ],
    finalAnswer:
      'Deviation model: $\\Delta R \\approx -135\\,\\Delta T\\,\\Omega$ (matching book rounding). Absolute tangent line: $R(T) \\approx 1353.4 - 135.3(T - 20)\\,\\Omega$ for $|\\Delta T| \\ll 20^\\circ\\text{C}$.',
    recognizeCue:
      'Nonlinear algebraic formula ($e^{-aT}$, $x^2$, $\\sin\\theta$) paired with a specific operating point and "small range of variation."',
    shortcut:
      'If asked only for the perturbation model $\\Delta y = m\\,\\Delta x$, compute $g\'(x_0)$ directly—you only need $g(x_0)$ if asked for the absolute line.',
    commonMistakes: [
      'Dropping the negative sign when differentiating $e^{-0.1T}$.',
      'Plugging in $T = 20$ first and then differentiating the constant (giving $0$).',
      'Writing $R = -135 T$ instead of $\\Delta R = -135\\,\\Delta T$.',
    ],
    memorize:
      '$\\Delta y \\approx g\'(x_0)\\,\\Delta x$. Changing the operating point $x_0$ changes the slope $g\'(x_0)$ and therefore changes the linear model.',
  },

  {
    id: 'e2-3',
    code: 'E2.3',
    title: 'Graphical Spring Stiffness',
    hw: 'HW 1',
    source: 'Textbook p. 130, Fig. E2.3 (PDF p. 80)',
    problemType: 'B',
    typeLabel: 'Type B · Graphical Linearization',
    difficulty: 2,
    priority: 'MEDIUM',
    role: 'Core',
    originalStatement:
      'The force versus displacement for a spring is shown in Figure E2.3 for the spring-mass-damper system of Figure 2.1. Graphically find the spring constant for the equilibrium point of $y_0 = 0.5\\text{ cm}$ and a range of operation of $\\pm 1.5\\text{ cm}$.',
    figureUrl: '/assets/fig_e23.svg',
    figureCaption: 'Figure E2.3: Nonlinear spring force vs. displacement curve with tangent at y₀ = 0.5 cm.',
    given: [
      'Nonlinear force-displacement curve in Figure E2.3 (force in scale divisions, displacement in cm)',
      'Equilibrium operating point: $y_0 = 0.5\\text{ cm}$',
      'Operating excursion: $y \\in [0.5 - 1.5,\\; 0.5 + 1.5] = [-1.0,\\; 2.0]\\text{ cm}$',
    ],
    find: [
      'Local effective spring constant $k_s$ at $y_0 = 0.5\\text{ cm}$',
      'Assessment of linear model validity across $\\pm 1.5\\text{ cm}$',
    ],
    coreIntuition:
      'Spring stiffness is not "force divided by position"—it is how much EXTRA force you get for a tiny EXTRA stretch. Graphically, that is the slope of the tangent line touching the curve right at $y_0 = 0.5\\text{ cm}$, NOT a line drawn back to the origin $(0, 0)$.',
    steps: [
      {
        title: 'Locate the operating point and draw the tangent line',
        math: '$$y_0 = 0.5\\text{ cm} \\quad\\longrightarrow\\quad k_s = \\left.\\frac{dF}{dy}\\right|_{y_0 = 0.5}$$',
        reasoning:
          'Find $y = 0.5\\text{ cm}$ on the horizontal axis, move up to the curve, and lay a straightedge so it grazes the curve at that single point without cutting across it nearby.',
      },
      {
        title: 'Compute rise over run along the tangent line',
        math: '$$\\Delta y = 0.75 - 0.25 = 0.5\\text{ cm}, \\quad \\Delta F \\approx 0.55\\text{ to }0.60\\text{ div} \\quad\\Rightarrow\\quad k_s = \\frac{\\Delta F}{\\Delta y} \\approx 1.1\\text{ to }1.2\\text{ div/cm}$$',
        reasoning:
          'Picking a small symmetric window ($0.25$ to $0.75\\text{ cm}$) centered at $y_0 = 0.5\\text{ cm}$ (or extending the straight tangent line to grid intersections) lets us measure $\\Delta F / \\Delta y$ accurately.',
        tip: 'Extend your drawn tangent line across several grid squares so small reading errors shrink!',
      },
      {
        title: 'Assess validity over the $\\pm 1.5\\text{ cm}$ range',
        math: '$$y \\in [-1.0,\\; 2.0]\\text{ cm}: \\quad \\text{slope at } -1.0\\text{ cm} > 1.8,\\quad \\text{slope at } 2.0\\text{ cm} < 0.5$$',
        reasoning:
          'Checking the endpoints shows huge curvature: in compression ($y = -1.0\\text{ cm}$) the spring stiffens dramatically, while in extension ($y = 2.0\\text{ cm}$) it softens toward failure. Thus the tangent at $0.5\\text{ cm}$ is only accurate for small excursions ($|\\Delta y| < 0.3\\text{ cm}$).',
      },
    ],
    finalAnswer:
      '$k_s \\approx 1.1\\text{ force-scale divisions/cm}$ (acceptable range $1.0\\text{–}1.2$). Valid only for small deviations ($|\\Delta y| < 0.3\\text{ cm}$); across $[-1.0, 2.0]\\text{ cm}$ the spring strongly stiffens in compression and softens in extension.',
    recognizeCue:
      'Given an experimental plot without an algebraic formula and asked to find stiffness, damping, or resistance "graphically."',
    shortcut:
      'Draw the tangent line at $y_0$, extend it across the grid to clean intersections (or axis intercepts), and divide $\\Delta F$ by $\\Delta y$.',
    commonMistakes: [
      'Computing the secant $F(y_0)/y_0$ from the origin instead of the local tangent slope $dF/dy$.',
      'Inventing Newtons when the vertical axis does not specify physical force units.',
      'Claiming the tangent line stays accurate all the way to the spring-breaking region.',
    ],
    memorize:
      'Incremental stiffness is ALWAYS the local tangent slope $dF/dy$, never $F/y$.',
  },

  {
    id: 'e2-4',
    code: 'E2.4',
    title: 'Laser Printer Step Response & FVT',
    hw: 'HW 1',
    source: 'Textbook p. 130 (PDF p. 80)',
    problemType: 'C',
    typeLabel: 'Type C · Laplace Response & FVT',
    difficulty: 3,
    priority: 'HIGH',
    role: 'Core',
    originalStatement:
      'A laser printer uses a laser beam to print copy rapidly for a computer. The laser is positioned by a control input $r(t)$, so that we have\n$$Y(s) = \\left[\\frac{6(s + 50)}{s^2 + 40s + 300}\\right] R(s)$$\nThe input $r(t)$ represents the desired position of the laser beam. (a) If $r(t)$ is a unit step input, find the output $y(t)$. (b) What is the final value of $y(t)$?',
    bookAnswer: '(a) $y(t) = 1 + 0.2e^{-30t} - 1.2e^{-10t}$, (b) $y_{\\text{ss}} = 1$',
    given: [
      'Transfer function: $G(s) = \\frac{6(s + 50)}{s^2 + 40s + 300}$ (zero initial conditions)',
      'Unit step input: $r(t) = u(t) \\Rightarrow R(s) = \\frac{1}{s}$',
    ],
    find: [
      '(a) Time-domain step response $y(t)$ for $t \\ge 0$',
      '(b) Steady-state final value $y_{\\text{ss}} = \\lim_{t \\to \\infty} y(t)$',
    ],
    coreIntuition:
      'A step input $1/s$ acts like flipping a light switch from $0$ to $1$. Multiplying $G(s)$ by $1/s$ injects a steady-state mode ($1/s$) alongside the system\'s natural exponential modes ($1/(s+10)$ and $1/(s+30)$). Partial fractions simply tells us the exact "recipe weight" of each mode so they add up cleanly.',
    quickCheck: {
      question:
        'Before applying the Final Value Theorem $\\lim_{s\\to 0} s Y(s)$, which condition MUST be satisfied?',
      options: [
        'All poles of $s Y(s)$ must lie strictly in the open left-half $s$-plane ($\\text{Re}(p) < 0$).',
        'All zeros of $Y(s)$ must be negative.',
        'The input must be an impulse $\\delta(t)$.',
        'The transfer function must have at least one pole at $s = +1$.',
      ],
      correctIndex: 0,
      explanation:
        'If $s Y(s)$ has poles on the imaginary axis (like $\\pm j\\omega$) or in the right-half plane, $y(t)$ oscillates forever or blows up—so $\\lim_{t\\to\\infty} y(t)$ does not exist even if $\\lim_{s\\to 0} s Y(s)$ gives a finite number!',
    },
    steps: [
      {
        title: 'Factor the denominator and include the step input $1/s$',
        math: '$$Y(s) = \\frac{6(s + 50)}{s(s^2 + 40s + 300)} = \\frac{6(s + 50)}{s(s + 10)(s + 30)} = \\frac{A}{s} + \\frac{B}{s + 10} + \\frac{C}{s + 30}$$',
        reasoning:
          'Factoring $s^2 + 40s + 300 = (s + 10)(s + 30)$ reveals two stable real poles at $s = -10$ and $s = -30$. Multiplying by $R(s) = 1/s$ gives three distinct simple poles, so partial fractions splits $Y(s)$ into a constant plus two decaying exponentials.',
      },
      {
        title: 'Find residues $A, B, C$ via Heaviside cover-up',
        math: '$$A = \\left.s Y(s)\\right|_{s=0} = \\frac{6(50)}{(10)(30)} = 1, \\quad B = \\left.(s+10)Y(s)\\right|_{s=-10} = \\frac{6(40)}{(-10)(20)} = -1.2, \\quad C = \\left.(s+30)Y(s)\\right|_{s=-30} = \\frac{6(20)}{(-30)(-20)} = 0.2$$',
        reasoning:
          'Heaviside cover-up isolates each residue by multiplying by its pole factor and evaluating at that root—zeroing out the other terms instantly.',
        tip: 'Notice $A = G(0) = 300/300 = 1$, and $A + B + C = 1 - 1.2 + 0.2 = 0 = y(0)$! That quick sum check catches sign errors immediately.',
      },
      {
        title: 'Invert term-by-term to the time domain',
        math: '$$y(t) = 1 - 1.2\\,e^{-10t} + 0.2\\,e^{-30t}, \\quad t \\ge 0$$',
        reasoning:
          'Using $\\mathcal{L}^{-1}\\{1/(s+a)\\} = e^{-at}u(t)$, each simple fraction transforms directly into a decaying exponential.',
      },
      {
        title: 'Validate and apply the Final Value Theorem (FVT)',
        math: '$$\\text{Poles of } sY(s) = G(s): \\; s = -10, -30 \\; (\\text{open LHP}) \\;\\Rightarrow\\; y_{\\text{ss}} = \\lim_{s\\to 0} s Y(s) = \\frac{6(50)}{300} = 1$$',
        reasoning:
          'Both poles of $s Y(s)$ have strictly negative real parts, so the exponentials vanish as $t \\to \\infty$ and FVT is 100% valid. Indeed, $1 - 1.2(0) + 0.2(0) = 1$.',
      },
    ],
    finalAnswer:
      '(a) $y(t) = 1 - 1.2\\,e^{-10t} + 0.2\\,e^{-30t}\\; (t \\ge 0)$  |  (b) $y_{\\text{ss}} = 1$.',
    recognizeCue:
      'Given $G(s) = Y(s)/R(s)$ with a unit step input; asks for $y(t)$ and final steady-state value.',
    shortcut:
      'For any stable system with a unit step input, the $1/s$ residue and the final value are both simply the DC gain $G(0)$.',
    commonMistakes: [
      'Forgetting to multiply $G(s)$ by $1/s$ for the step input (inverting $G(s)$ gives the impulse response!).',
      'Applying FVT blindly without verifying that all poles of $s Y(s)$ lie strictly in the open LHP.',
      'Sign slips in the negative denominators $(-10)(20)$ or $(-30)(-20)$ during cover-up.',
    ],
    memorize:
      'Unit step response: $Y(s) = G(s)/s$. FVT $y(\\infty) = \\lim_{s\\to 0} sY(s)$ is ONLY valid if all poles of $sY(s)$ have $\\text{Re}(p) < 0$.',
  },

  {
    id: 'e2-31',
    code: 'E2.31',
    title: 'Complex Poles & Inverse Laplace',
    hw: 'HW 1',
    source: 'Textbook p. 136 (PDF p. 86)',
    problemType: 'C',
    typeLabel: 'Type C · Laplace Response & FVT',
    difficulty: 3,
    priority: 'MEDIUM',
    role: 'Core',
    originalStatement:
      'Determine the partial fraction expansion for $V(s)$ and compute the inverse Laplace transform. The transfer function $V(s)$ is given by\n$$V(s) = \\frac{500}{s^2 + 8s + 500}$$',
    given: [
      '$V(s) = \\frac{500}{s^2 + 8s + 500}$ (already the Laplace transform of $v(t)$—no step $1/s$ factor)',
    ],
    find: [
      '(a) Partial fraction expansion over complex-conjugate poles',
      '(b) Inverse Laplace transform $v(t) = \\mathcal{L}^{-1}\\{V(s)\\}$',
    ],
    coreIntuition:
      'Because $8^2 - 4(1)(500) < 0$, the denominator never crosses zero on the real axis—its roots are complex conjugates $-\\alpha \\pm j\\omega_d$. Physically, complex poles mean the response rings like a struck bell inside a shrinking exponential envelope: $\\alpha = 4$ sets how fast it fades, and $\\omega_d = 22$ sets the oscillation frequency.',
    steps: [
      {
        title: 'Complete the square to reveal the complex poles',
        math: '$$s^2 + 8s + 500 = (s + 4)^2 + (500 - 16) = (s + 4)^2 + 484 = (s + 4)^2 + 22^2$$',
        reasoning:
          'Half of $8$ is $4$, so $(s + 4)^2 = s^2 + 8s + 16$. Subtracting $16$ from $500$ leaves $484 = 22^2$. Thus the poles are $s_{1,2} = -4 \\pm j22$.',
        tip: 'Notice $\\omega_d = \\sqrt{500 - 4^2} = 22$, NOT $\\sqrt{500}$!',
      },
      {
        title: 'Compute the complex partial fraction expansion',
        math: '$$V(s) = \\frac{K_1}{s + 4 - j22} + \\frac{K_1^*}{s + 4 + j22}, \\qquad K_1 = \\left.(s + 4 - j22)V(s)\\right|_{s = -4 + j22} = \\frac{500}{j44} = -j\\frac{125}{11}$$',
        reasoning:
          'Even with complex roots, Heaviside cover-up works identically. Since the original polynomial has real coefficients, the second residue is automatically the complex conjugate $K_2 = K_1^* = +j\\frac{125}{11}$.',
      },
      {
        title: 'Invert to a damped sinusoid',
        math: '$$V(s) = \\frac{500}{22} \\cdot \\frac{22}{(s + 4)^2 + 22^2} \\quad\\Rightarrow\\quad v(t) = \\frac{250}{11}\\,e^{-4t}\\sin(22t), \\quad t \\ge 0$$',
        reasoning:
          'Matching the standard damped-sine pair $\\mathcal{L}^{-1}\\{\\frac{\\omega_d}{(s+\\alpha)^2 + \\omega_d^2}\\} = e^{-\\alpha t}\\sin(\\omega_d t)$ avoids complex trigonometry. Equivalently, $2|K_1|e^{-4t}\\cos(22t - 90^\\circ)$ gives the exact same $\\frac{250}{11}e^{-4t}\\sin(22t)$.',
      },
    ],
    finalAnswer:
      'Partial fraction expansion: $V(s) = \\frac{-j\\,125/11}{s + 4 - j22} + \\frac{j\\,125/11}{s + 4 + j22}$. Time response: $v(t) = \\frac{250}{11}\\,e^{-4t}\\sin(22t) \\approx 22.73\\,e^{-4t}\\sin(22t)$ for $t \\ge 0$.',
    recognizeCue:
      'Quadratic denominator with negative discriminant ($b^2 - 4ac < 0$).',
    shortcut:
      'Complete the square immediately: $\\frac{C}{(s+\\alpha)^2 + \\omega_d^2} \\xrightarrow{\\mathcal{L}^{-1}} \\frac{C}{\\omega_d}\\,e^{-\\alpha t}\\sin(\\omega_d t)$.',
    commonMistakes: [
      'Erroneously multiplying by $1/s$ when the problem asks for the inverse transform of $V(s)$ directly.',
      'Taking $\\omega_d = \\sqrt{500}$ instead of $\\sqrt{500 - 16} = 22$.',
      'Dropping the $j$ or getting the sign of $1/j = -j$ backwards in $K_1$.',
    ],
    memorize:
      '$s^2 + 2\\zeta\\omega_n s + \\omega_n^2 = (s + \\alpha)^2 + \\omega_d^2$, where $\\alpha = \\zeta\\omega_n$ and $\\omega_d = \\sqrt{\\omega_n^2 - \\alpha^2}$.',
  },

  {
    id: 'p2-4',
    code: 'P2.4',
    title: 'Piecewise Nonlinear Amplifier',
    hw: 'HW 1',
    source: 'Textbook p. 137, Fig. P2.4 (PDF p. 87)',
    problemType: 'A',
    typeLabel: 'Type A · Analytical Linearization',
    difficulty: 3,
    priority: 'HIGH',
    role: 'Core',
    originalStatement:
      'A nonlinear amplifier can be described by the following characteristic:\n$$v_o(t) = \\begin{cases} v_{\\text{in}}^2 & \\text{for } v_{\\text{in}} \\ge 0 \\\\ -v_{\\text{in}}^2 & \\text{for } v_{\\text{in}} < 0 \\end{cases}$$\nThe amplifier will be operated over a range of $\\pm 0.5\\text{ V}$ around the operating point for $v_{\\text{in}}$. Describe the amplifier by a linear approximation (a) when the operating point is $v_{\\text{in}} = 0$ and (b) when the operating point is $v_{\\text{in}} = 1\\text{ V}$. Obtain a sketch of the nonlinear function and the approximation for each case.',
    figureUrl: '/assets/fig_p24a.svg',
    figureCaption: 'Figure P2.4(a): Piecewise quadratic amplifier curve and zero-slope tangent at v_in,0 = 0 V (Case b at 1 V has slope 2 V/V).',
    given: [
      'Piecewise law: $v_o = f(v_{\\text{in}}) = v_{\\text{in}}|v_{\\text{in}}|$',
      'Excursion around each operating point: $\\Delta v_{\\text{in}} \\in [-0.5,\\; +0.5]\\text{ V}$',
    ],
    find: [
      'Linear approximation and sketch comparison for (a) $v_{\\text{in},0} = 0\\text{ V}$ and (b) $v_{\\text{in},0} = 1\\text{ V}$',
    ],
    coreIntuition:
      'This odd-symmetric "squaring" curve flattens out completely at the origin (like an $x^3$ inflection point) and gets steeper as you move away from zero. At $0\\text{ V}$ the tangent line is completely horizontal (zero local gain!), whereas at $1\\text{ V}$ the curve has slope $2$, giving a tangent line that misses the origin and must be shifted by $v_o(1) = 1\\text{ V}$.',
    quickCheck: {
      question:
        'At $v_{\\text{in},0} = 1\\text{ V}$, students often write $v_o \\approx 2 v_{\\text{in}}$ instead of $v_o \\approx 2 v_{\\text{in}} - 1$. Why is $v_o \\approx 2 v_{\\text{in}}$ wrong?',
      options: [
        'At $v_{\\text{in}} = 1\\text{ V}$, $2 v_{\\text{in}}$ predicts $2\\text{ V}$, missing the true operating value $v_o(1) = 1\\text{ V}$!',
        'The slope at $1\\text{ V}$ is actually $1$, not $2$.',
        'Because $v_{\\text{in}} = 1\\text{ V}$ is on the negative branch.',
        'Linear models are not allowed to have negative intercepts.',
      ],
      correctIndex: 0,
      explanation:
        'A tangent line at $(x_0, y_0) = (1, 1)$ MUST pass through $(1, 1)$! Using $y = y_0 + m(x - x_0)$ gives $v_o = 1 + 2(v_{\\text{in}} - 1) = 2v_{\\text{in}} - 1$.',
    },
    steps: [
      {
        title: 'Case (a): Check one-sided derivatives at $v_{\\text{in},0} = 0\\text{ V}$',
        math: '$$\\lim_{v_{\\text{in}}\\to 0^+} \\frac{d}{dv_{\\text{in}}}(v_{\\text{in}}^2) = 0, \\qquad \\lim_{v_{\\text{in}}\\to 0^-} \\frac{d}{dv_{\\text{in}}}(-v_{\\text{in}}^2) = 0 \\quad\\Rightarrow\\quad m = 0$$',
        reasoning:
          'Even though the formula switches rules at $0$, both sides flatten to slope $0$ as they meet at $(0,0)$. So the curve is differentiable at $0$ with tangent slope $0$, giving $\\Delta v_o \\approx 0$ and $v_o \\approx 0\\text{ V}$ on $[-0.5, 0.5]\\text{ V}$.',
      },
      {
        title: 'Case (b): Differentiate the positive branch at $v_{\\text{in},0} = 1\\text{ V}$',
        math: '$$v_o(1) = 1^2 = 1\\text{ V}, \\qquad m = \\left.\\frac{d(v_{\\text{in}}^2)}{dv_{\\text{in}}}\\right|_{v_{\\text{in}}=1} = 2(1) = 2\\text{ V/V}$$',
        reasoning:
          'Around $1\\text{ V}$ with $\\pm 0.5\\text{ V}$ variation, $v_{\\text{in}} \\in [0.5, 1.5]\\text{ V}$ stays strictly positive, so only the $v_{\\text{in}}^2$ branch matters.',
      },
      {
        title: 'Form both the perturbation and absolute linear models',
        math: '$$\\Delta v_o \\approx 2\\,\\Delta v_{\\text{in}}, \\qquad v_o \\approx v_o(1) + m(v_{\\text{in}} - 1) = 1 + 2(v_{\\text{in}} - 1) = 2 v_{\\text{in}} - 1\\text{ V}$$',
        reasoning:
          'Checking the endpoints $[0.5, 1.5]$: at $0.5\\text{ V}$, exact is $0.25$ vs. linear $0$; at $1.5\\text{ V}$, exact is $2.25$ vs. linear $2.0$ (both errors $-0.25\\text{ V}$, since a tangent to a convex parabola always sits underneath it).',
      },
    ],
    finalAnswer:
      '(a) At $v_{\\text{in},0} = 0\\text{ V}$: $\\Delta v_o \\approx 0$, $v_o \\approx 0\\text{ V}$.  (b) At $v_{\\text{in},0} = 1\\text{ V}$: $\\Delta v_o \\approx 2\\,\\Delta v_{\\text{in}}$, $v_o \\approx 2v_{\\text{in}} - 1\\text{ V}$.',
    recognizeCue:
      'Piecewise nonlinear characteristic evaluated at multiple operating points with a specified $\\pm$ excursion and sketch.',
    shortcut:
      'At $x_0 = 1$, $y_0 = 1$ and $m = 2$, so point-slope form immediately gives $y = 1 + 2(x - 1) = 2x - 1$.',
    commonMistakes: [
      'Claiming the derivative does not exist at $0$ without checking that both one-sided limits equal $0$.',
      'Forgetting the $-1$ offset in $v_o = 2v_{\\text{in}} - 1$ (writing $v_o = 2v_{\\text{in}}$ instead).',
      'Assuming $m = 0$ at $v_{\\text{in}} = 0$ means the amplifier is broken everywhere rather than just having zero local linear gain at the origin.',
    ],
    memorize:
      'Absolute tangent line: $y = y_0 + m(x - x_0)$. Perturbation model: $\\Delta y = m\\,\\Delta x$.',
  },

  // =========================================================================
  // HOMEWORK 2 · CHAPTER 2 (E2.19, E2.21, E2.25, P2.12, P2.26)
  // =========================================================================
  {
    id: 'e2-19',
    code: 'E2.19',
    title: 'Second-Order Step Response',
    hw: 'HW 2',
    source: 'Textbook p. 134 (PDF p. 84)',
    problemType: 'C',
    typeLabel: 'Type C · Laplace Response & FVT',
    difficulty: 3,
    priority: 'VERY HIGH',
    role: 'Core',
    originalStatement:
      'The transfer function of a system is\n$$\\frac{Y(s)}{R(s)} = \\frac{28(s + 1)}{s^2 + 9s + 14}$$\nDetermine $y(t)$ when $r(t)$ is a unit step input.',
    bookAnswer: '$y(t) = 2.0 + 2.8e^{-2t} - 4.8e^{-7t},\\quad t \\ge 0$',
    given: [
      'Transfer function: $G(s) = \\frac{28(s + 1)}{s^2 + 9s + 14}$ (zero initial conditions)',
      'Input: unit step $r(t) = u(t) \\Rightarrow R(s) = \\frac{1}{s}$',
    ],
    find: ['Output time response $y(t)$ for $t \\ge 0$'],
    coreIntuition:
      'Once we multiply $G(s)$ by the step input $1/s$, the output is a mix of three simple pieces: a constant steady-state destination ($A/s$), a slower decay mode ($e^{-2t}$), and a faster decay mode ($e^{-7t}$). Notice that $y(t)$ must start at $0$ (because the system is strictly proper with degree $2 > 1$) and settle at $G(0) = 28/14 = 2$—giving us two effortless sanity checks!',
    quickCheck: {
      question:
        'Without doing ANY partial fractions yet, what MUST the constant steady-state term $A$ (residue of $1/s$) equal for $Y(s) = \\frac{28(s+1)}{s(s+2)(s+7)}$?',
      options: ['$1$', '$2$', '$4$', '$28$'],
      correctIndex: 1,
      explanation:
        'By Heaviside cover-up at $s = 0$, $A = G(0) = \\frac{28(0+1)}{0^2 + 9(0) + 14} = \\frac{28}{14} = 2$. Because both system poles ($-2, -7$) are in the LHP, $y(\\infty) = G(0) = 2$!',
    },
    steps: [
      {
        title: 'Factor the quadratic denominator',
        math: '$$s^2 + 9s + 14 = (s + 2)(s + 7)$$',
        reasoning:
          'We need two numbers that multiply to $14$ and add to $9$: $2$ and $7$. Both poles ($s = -2, -7$) are negative real numbers, so the system is overdamped and stable.',
      },
      {
        title: 'Multiply by $R(s) = 1/s$ and set up partial fractions',
        math: '$$Y(s) = \\frac{28(s + 1)}{s(s + 2)(s + 7)} = \\frac{A}{s} + \\frac{B}{s + 2} + \\frac{C}{s + 7}$$',
        reasoning:
          'A unit step input contributes the $1/s$ factor, turning the two-pole transfer function into a three-pole output transform.',
      },
      {
        title: 'Compute residues via Heaviside cover-up',
        math: '$$A = \\frac{28(1)}{(2)(7)} = 2, \\qquad B = \\frac{28(-2 + 1)}{(-2)(-2 + 7)} = \\frac{-28}{-10} = 2.8, \\qquad C = \\frac{28(-7 + 1)}{(-7)(-7 + 2)} = \\frac{-168}{35} = -4.8$$',
        reasoning:
          'Covering each denominator factor in turn and plugging in its root yields all three coefficients in three quick arithmetic evaluations.',
      },
      {
        title: 'Invert and run the initial/final value sanity checks',
        math: '$$y(t) = 2.0 + 2.8\\,e^{-2t} - 4.8\\,e^{-7t} \\quad (t \\ge 0)$$',
        reasoning:
          'Sanity check 1: $y(0) = 2.0 + 2.8 - 4.8 = 0$, matching IVT $\\lim_{s\\to\\infty} sY(s) = 0$. Sanity check 2: $y(\\infty) = 2.0$, matching FVT $G(0) = 28/14 = 2$. Both match!',
      },
    ],
    finalAnswer: '$y(t) = 2.0 + 2.8\\,e^{-2t} - 4.8\\,e^{-7t} \\quad (t \\ge 0)$.',
    recognizeCue:
      'Transfer function with real factorable quadratic denominator driven by a unit step.',
    shortcut:
      'Residue of $1/s$ is always $G(0)$, and the sum of all residues must equal $y(0) = 0$ (for strictly proper systems with degree diff $\\ge 1$).',
    commonMistakes: [
      'Factoring $s^2 + 9s + 14$ carelessly as $(s + 1)(s + 14)$.',
      'Forgetting to multiply by $1/s$ for the step input.',
      'Assuming steady-state output is $1$ instead of DC gain $G(0) = 2$.',
    ],
    memorize:
      'For any strictly proper stable $G(s)$ under a unit step: $y(0) = 0$ and $y(\\infty) = G(0)$.',
  },

  {
    id: 'e2-21',
    code: 'E2.21',
    title: 'Positioning Slide with Base Excitation',
    hw: 'HW 2',
    source: 'Textbook p. 134, Fig. E2.21 (PDF p. 84)',
    problemType: 'D',
    typeLabel: 'Type D · Physical Modeling to TF',
    difficulty: 4,
    priority: 'VERY HIGH',
    role: 'Core',
    originalStatement:
      'A high-precision positioning slide is shown in Figure E2.21. Determine the transfer function $X_p(s)/X_{\\text{in}}(s)$ when the drive shaft friction is $b_d = 0.65$, the drive shaft spring constant is $k_d = 1.8$, carriage mass $m_c = 1$, and the sliding friction is $b_s = 0.9$.',
    figureUrl: '/assets/fig_E221.png',
    figureCaption: 'Figure E2.21: High-precision positioning slide driven by base displacement x_in(t).',
    given: [
      'Carriage mass $m_c = 1$, drive shaft spring $k_d = 1.8$, drive shaft damper $b_d = 0.65$, ground sliding friction $b_s = 0.9$',
      'Input: base displacement $x_{\\text{in}}(t)$; Output: carriage displacement $x_p(t)$',
    ],
    find: ['Transfer function $X_p(s) / X_{\\text{in}}(s)$ under zero initial conditions'],
    coreIntuition:
      'Think of pushing a heavy sled ($m_c$) on rough ice ($b_s$) using a flexible bungee-and-shock-absorber rod ($k_d, b_d$) whose handle moves by $x_{\\text{in}}(t)$. The drive rod only feels how much it is stretched or compressed—so $k_d$ and $b_d$ depend on RELATIVE motion $(x_{\\text{in}} - x_p)$. Meanwhile, the ice friction $b_s$ rubs against the stationary ground, so it depends ONLY on ABSOLUTE carriage velocity $\\dot{x}_p$.',
    quickCheck: {
      question:
        'Why does ground sliding friction $b_s$ appear in the denominator of $X_p(s)/X_{\\text{in}}(s)$ but NOT in the numerator?',
      options: [
        'Because $b_s$ connects the carriage to stationary ground (acting only on $\\dot{x}_p$), whereas $b_d$ and $k_d$ couple the moving input $x_{\\text{in}}$ to the carriage.',
        'Because $b_s$ is zero at steady state.',
        'Because ground friction cancels out with $m_c$.',
        'Because dampers never appear in numerators of mechanical transfer functions.',
      ],
      correctIndex: 0,
      explanation:
        'Only elements bridging the input $x_{\\text{in}}$ and the mass $m_c$ push the mass using the input—creating the numerator $(b_d s + k_d)$. Ground friction $b_s$ only resists carriage motion, adding damping to the denominator.',
    },
    steps: [
      {
        title: 'Draw the free-body diagram and write Newton\'s second law on $m_c$',
        math: '$$m_c \\ddot{x}_p = k_d(x_{\\text{in}} - x_p) + b_d(\\dot{x}_{\\text{in}} - \\dot{x}_p) - b_s \\dot{x}_p$$',
        reasoning:
          'When $x_{\\text{in}} > x_p$, the drive spring and drive damper pull the carriage forward in $+x_p$. Sliding friction against the fixed guideway always opposes carriage velocity $\\dot{x}_p$.',
      },
      {
        title: 'Separate output terms ($x_p$) from input terms ($x_{\\text{in}}$)',
        math: '$$m_c \\ddot{x}_p + (b_d + b_s)\\dot{x}_p + k_d x_p = b_d \\dot{x}_{\\text{in}} + k_d x_{\\text{in}}$$',
        reasoning:
          'Grouping all $x_p$ terms on the left and all $x_{\\text{in}}$ terms on the right sets up the standard ODE format before taking the Laplace transform.',
      },
      {
        title: 'Take the Laplace transform with zero initial conditions',
        math: '$$\\left[m_c s^2 + (b_d + b_s)s + k_d\\right] X_p(s) = (b_d s + k_d) X_{\\text{in}}(s) \\quad\\Rightarrow\\quad \\frac{X_p(s)}{X_{\\text{in}}(s)} = \\frac{b_d s + k_d}{m_c s^2 + (b_d + b_s)s + k_d}$$',
        reasoning:
          'Under zero ICs, each derivative becomes a factor of $s$. Notice the coupling damper $b_d$ creates a finite zero at $s = -k_d/b_d$.',
      },
      {
        title: 'Substitute numbers and run DC / high-frequency checks',
        math: '$$\\frac{X_p(s)}{X_{\\text{in}}(s)} = \\frac{0.65 s + 1.8}{s^2 + (0.65 + 0.9)s + 1.8} = \\frac{0.65 s + 1.8}{s^2 + 1.55 s + 1.8}$$',
        reasoning:
          'Physical sanity check: at DC ($s = 0$), the ratio is $1.8 / 1.8 = 1$—if you slowly move the base $1\\text{ mm}$ and wait, the spring pushes the carriage $1\\text{ mm}$ with zero static friction error. As $s \\to \\infty$, inertia keeps the carriage still ($G(s) \\to 0$).',
      },
    ],
    finalAnswer: '$\\frac{X_p(s)}{X_{\\text{in}}(s)} = \\frac{0.65 s + 1.8}{s^2 + 1.55 s + 1.8}$.',
    recognizeCue:
      'A mass driven through a spring and damper by a moving base displacement $x_{\\text{in}}(t)$, while rubbing against fixed ground.',
    shortcut:
      'Numerator = coupling impedance $(b_d s + k_d)$. Denominator = $m_c s^2 + (\\text{total damping } b_d + b_s)s + k_d$.',
    commonMistakes: [
      'Putting ground friction $b_s$ in the numerator.',
      'Using absolute velocity $\\dot{x}_p$ instead of relative velocity $(\\dot{x}_{\\text{in}} - \\dot{x}_p)$ across the drive damper $b_d$.',
      'Forgetting to check that $G(0) = 1$ at steady state.',
    ],
    memorize:
      'Base-excited carriage with ground damping: $\\frac{b_d s + k_d}{m_c s^2 + (b_d + b_s)s + k_d}$, and DC gain is always $k_d/k_d = 1$.',
  },

  {
    id: 'e2-25',
    code: 'E2.25',
    title: 'Multiloop Block Diagram Reduction',
    hw: 'HW 2',
    source: 'Textbook p. 135, Fig. E2.25 (PDF p. 85)',
    problemType: 'E',
    typeLabel: 'Type E · Block Diagram Reduction',
    difficulty: 3,
    priority: 'VERY HIGH',
    role: 'Core',
    originalStatement:
      'The block diagram of a system is shown in Figure E2.25: forward path has $10/(s+1)$ followed by integrator $1/s$. An inner feedback taps after $10/(s+1)$ through gain $2$, adds ($+$) to the outer feedback $Y(s)$ at a lower summing junction, and the combined signal enters the input summer with a minus ($-$) sign. Determine $T(s) = Y(s)/R(s)$.',
    given: [
      'Forward path: $G_1(s) = \\frac{10}{s+1}$ in cascade with $G_2(s) = \\frac{1}{s}$',
      'Inner tap after $G_1$ goes through gain $2$ ($+$ into lower summer); outer output $Y$ also enters lower summer ($+$)',
      'Lower summer output enters input summer with minus ($-$) sign',
    ],
    find: ['Closed-loop transfer function $T(s) = Y(s)/R(s)$'],
    coreIntuition:
      'Redrawing block diagrams under exam time pressure is where most sign mistakes happen. Instead, give a clean name like $V(s)$ to the signal right after the first block! Because $Y(s) = V(s)/s$, we immediately know $V(s) = s Y(s)$, turning the entire diagram into two lines of high-school algebra with zero ambiguity.',
    quickCheck: {
      question:
        'At the lower summing junction, BOTH the gain-$2$ branch and $Y(s)$ have $+$ signs, and the combined signal enters the input summer with a $-$ sign. What type of feedback is the inner gain-$2$ loop around $10/(s+1)$?',
      options: [
        'Positive feedback, because the lower summer has $+$ signs.',
        'Negative feedback, because the combined signal is subtracted at the input summer!',
        'Feedforward only, not a feedback loop.',
        'Unity feedback with gain $1$.',
      ],
      correctIndex: 1,
      explanation:
        'Follow the full loop around $10/(s+1)$: $+1$ at the lower summer times $-1$ at the input summer equals $-1$ overall! So the inner loop has negative feedback ($1 + G_1 H = 1 + 20/(s+1)$).',
    },
    steps: [
      {
        title: 'Label internal signals and express them in terms of $Y(s)$',
        math: '$$V(s) = s Y(s), \\qquad B(s) = 2 V(s) + Y(s) = (2s + 1) Y(s)$$',
        reasoning:
          'Calling the output of $\\frac{10}{s+1}$ by the name $V(s)$ lets us invert the integrator ($Y = V/s \\Rightarrow V = sY$) and write the lower summer\'s output $B(s)$ purely in terms of $Y(s)$.',
      },
      {
        title: 'Write the input summer and forward block equation',
        math: '$$E(s) = R(s) - B(s) = R(s) - (2s + 1) Y(s), \\qquad V(s) = \\frac{10}{s + 1} E(s)$$',
        reasoning:
          'The input summer subtracts $B(s)$ from $R(s)$, and the first block multiplies that error $E(s)$ by $\\frac{10}{s+1}$ to create $V(s)$.',
      },
      {
        title: 'Substitute $V(s) = sY(s)$ and solve for $Y(s)/R(s)$',
        math: '$$s Y(s) = \\frac{10}{s+1}\\left[R(s) - (2s + 1)Y(s)\\right] \\;\\Rightarrow\\; \\left(s^2 + s + 20s + 10\\right)Y(s) = 10 R(s)$$',
        reasoning:
          'Multiplying both sides by $(s+1)$ clears the fraction cleanly, collecting $(s^2 + 21s + 10)Y(s) = 10 R(s)$.',
        tip: 'Check with inside-out block reduction: inner loop $\\frac{10/(s+1)}{1 + 20/(s+1)} = \\frac{10}{s+21}$, then outer unity loop with $1/s$ gives $\\frac{10}{s(s+21)+10} = \\frac{10}{s^2+21s+10}$!',
      },
    ],
    finalAnswer: '$T(s) = \\frac{Y(s)}{R(s)} = \\frac{10}{s^2 + 21s + 10}$.',
    recognizeCue:
      'Nested multi-loop block diagram with multiple summing junctions and gain taps.',
    shortcut:
      'Intermediate node signal algebra: name the signal between blocks ($V$), write one equation per summer, and solve in 60 seconds without redrawing.',
    commonMistakes: [
      'Seeing $+$ signs at the lower summer and mistakenly thinking the inner loop is positive feedback (forgetting the $-$ at the input summer!).',
      'Dropping the $s$ factor when converting $V(s) = s Y(s)$.',
    ],
    memorize:
      'Negative feedback gives $G/(1 + GH)$; positive feedback gives $G/(1 - GH)$. Always trace the net sign around the full closed loop!',
  },

  {
    id: 'p2-12',
    code: 'P2.12',
    title: 'Open-Loop Step Calibration',
    hw: 'HW 2',
    source: 'Textbook p. 138, Fig. P2.12 (PDF p. 88)',
    problemType: 'C',
    typeLabel: 'Type C · Laplace Response & FVT',
    difficulty: 2,
    priority: 'MEDIUM',
    role: 'Core',
    originalStatement:
      'For the open-loop control system described by the block diagram shown in Figure P2.12 (gain $K$ in series with $1/(s+50)$), determine the value of $K$ such that $y(t) \\to 1$ as $t \\to \\infty$ when $r(t)$ is a unit step input. Assume zero initial conditions.',
    figureUrl: '/assets/fig_p212.svg',
    figureCaption: 'Figure P2.12: Open-loop system with gain K in cascade with plant 1/(s + 50).',
    given: [
      'Open-loop cascade: gain $K$ followed by plant $G_p(s) = \\frac{1}{s + 50}$',
      'Unit step input $r(t) = u(t) \\Rightarrow R(s) = \\frac{1}{s}$, zero ICs',
      'Target steady-state output: $y(\\infty) = 1$',
    ],
    find: ['Controller gain $K$'],
    coreIntuition:
      'An open-loop plant $1/(s+50)$ naturally shrinks a steady input by $1/50$ at DC ($s = 0$). To make the steady output reach $1$ instead of $1/50$, our pre-gain $K$ simply needs to boost the signal by $50$—like turning a volume knob up to offset an attenuator!',
    steps: [
      {
        title: 'Write the output transform $Y(s)$',
        math: '$$G(s) = \\frac{K}{s + 50}, \\qquad Y(s) = G(s)R(s) = \\frac{K}{s(s + 50)}$$',
        reasoning:
          'Cascaded blocks multiply, and a unit step multiplies by $1/s$.',
      },
      {
        title: 'Verify the Final Value Theorem stability condition',
        math: '$$s Y(s) = \\frac{K}{s + 50} \\quad\\longrightarrow\\quad \\text{pole at } s = -50 < 0 \\text{ (strictly in open LHP)}$$',
        reasoning:
          'Because $-50$ is strictly negative, the transient $e^{-50t}$ decays to zero, guaranteeing that $y(t)$ approaches a finite limit and FVT is valid.',
      },
      {
        title: 'Apply FVT and solve for $K$',
        math: '$$y(\\infty) = \\lim_{s\\to 0} s Y(s) = \\lim_{s\\to 0} \\frac{K}{s + 50} = \\frac{K}{50} = 1 \\quad\\Rightarrow\\quad K = 50$$',
        reasoning:
          'Setting the DC gain $K/50$ equal to the desired steady-state value $1$ immediately yields $K = 50$.',
      },
    ],
    finalAnswer: '$K = 50$.',
    recognizeCue:
      'Open-loop gain calibration asking for $K$ to hit a target steady-state step response $y(\\infty)$.',
    shortcut:
      'For a stable open-loop plant under a unit step, $y_{\\text{ss}} = K \\cdot G_p(0)$, so $K = y_{\\text{target}} / G_p(0) = 1/(1/50) = 50$.',
    commonMistakes: [
      'Evaluating $G(s)$ at $s \\to \\infty$ (which checks initial value, not final value!).',
      'Forgetting to state why FVT is valid ($s = -50$ is in the open LHP).',
    ],
    memorize:
      'DC gain of any stable transfer function is $G(0)$, and its steady-state unit-step value is $G(0)$.',
  },

  {
    id: 'p2-26',
    code: 'P2.26',
    title: 'Two-Mass Flexible Robot Arm',
    hw: 'HW 2',
    source: 'Textbook p. 141, Fig. P2.26 (PDF p. 91)',
    problemType: 'D',
    typeLabel: 'Type D · Physical Modeling to TF',
    difficulty: 5,
    priority: 'HIGH',
    role: 'Core',
    originalStatement:
      'A robot includes significant flexibility in the arm members with a heavy load in the gripper. A two-mass model of the robot is shown in Figure P2.26. Find the transfer function $Y(s)/F(s)$.',
    figureUrl: '/assets/fig_p226.svg',
    figureCaption: 'Figure P2.26: Two-mass flexible robot arm model on a frictionless plane.',
    given: [
      'Two masses $M$ (displacement $x$) and $m$ (displacement $y$) on a frictionless surface',
      'External force $F(t)$ pushes mass $M$; $M$ and $m$ are coupled by parallel spring $k$ and damper $b$',
    ],
    find: ['Transfer function $Y(s) / F(s)$ under zero initial conditions'],
    coreIntuition:
      'Picture two frictionless air-hockey pucks ($M$ and $m$) connected by a spring and shock absorber, and you push puck $M$. Notice NOTHING anchors either puck to the wall! That means the two pucks can drift together freely forever as one rigid body—which guarantees a double pole $s^2$ at the origin in the denominator (free rigid-body acceleration $1/s^2$).',
    quickCheck: {
      question:
        'Why MUST the denominator of $Y(s)/F(s)$ contain a factor of $s^2$ (poles at $s = 0$)?',
      options: [
        'Because there is no spring or damper anchored to a fixed ground—the system can freely accelerate as a single rigid mass $(M + m)$!',
        'Because the spring constant $k$ is zero.',
        'Because Newton\'s third law cancels out the internal damper.',
        'Because the force $F(t)$ is applied directly to $m$.',
      ],
      correctIndex: 0,
      explanation:
        'With zero external ground forces, total momentum satisfies $(M + m)\\ddot{y}_{\\text{cm}} = F(t)$, which integrates twice ($1/s^2$) to give position!',
    },
    steps: [
      {
        title: 'Write Newton\'s 2nd law for each mass using action-reaction',
        math: '$$M\\ddot{x} = F(t) - b(\\dot{x} - \\dot{y}) - k(x - y), \\qquad m\\ddot{y} = b(\\dot{x} - \\dot{y}) + k(x - y)$$',
        reasoning:
          'The coupling force $f_{\\text{int}} = b(\\dot{x} - \\dot{y}) + k(x - y)$ pulls mass $m$ forward and, by Newton\'s third law, pulls mass $M$ backward by the exact same amount.',
      },
      {
        title: 'Transform to the $s$-domain with $Z(s) = bs + k$',
        math: '$$(Ms^2 + bs + k)X(s) - (bs + k)Y(s) = F(s), \\qquad -(bs + k)X(s) + (ms^2 + bs + k)Y(s) = 0$$',
        reasoning:
          'Writing the two coupled equations as a clean $2\\times 2$ system in $X(s)$ and $Y(s)$ makes elimination foolproof.',
      },
      {
        title: 'Eliminate $X(s)$ and simplify the denominator',
        math: '$$X(s) = \\frac{ms^2 + bs + k}{bs + k}Y(s) \\;\\Rightarrow\\; \\frac{\\left[(Ms^2 + Z)(ms^2 + Z) - Z^2\\right]}{Z}Y(s) = F(s)$$',
        reasoning:
          'Watch the magic cancellation: expanding $(Ms^2 + Z)(ms^2 + Z) - Z^2$ cancels $Z^2 = (bs+k)^2$ completely, leaving $s^2[Mms^2 + (M+m)(bs+k)]$.',
        tip: 'Check the $s \\to 0$ low-frequency limit: $\\frac{Y}{F} \\approx \\frac{k}{s^2(M+m)k} = \\frac{1}{(M+m)s^2}$—just a single rigid mass $(M+m)$!',
      },
    ],
    finalAnswer:
      '$\\frac{Y(s)}{F(s)} = \\frac{bs + k}{Mm s^4 + (M + m)b s^3 + (M + m)k s^2} = \\frac{bs + k}{s^2\\left[Mm s^2 + (M + m)(bs + k)\\right]}$.',
    recognizeCue:
      'Two ungrounded masses coupled by a spring and damper on a frictionless surface.',
    shortcut:
      'Use the $2\\times 2$ impedance matrix $\\begin{bmatrix} Ms^2 + Z & -Z \\\\ -Z & ms^2 + Z \\end{bmatrix}$ where $Z = bs+k$: numerator is $Z$, denominator is determinant $Mm s^4 + (M+m)Z s^2$.',
    commonMistakes: [
      'Adding a non-existent ground damper or ground spring.',
      'Getting the sign of the action-reaction coupling wrong between $M$ and $m$.',
      'Forgetting to cancel $(bs+k)^2$ in the determinant, missing the $s^2$ rigid-body factor.',
    ],
    memorize:
      'Two ungrounded coupled masses ALWAYS have an $s^2$ factor in the position transfer function denominator.',
  },

  // =========================================================================
  // HOMEWORK 3 · CHAPTER 3 (E3.2, E3.4, E3.14, P3.1, P3.8)
  // =========================================================================
  {
    id: 'e3-2',
    code: 'E3.2',
    title: 'Robot-Arm Joint State-Variable Model',
    hw: 'HW 3',
    source: 'Textbook p. 211 (PDF p. 56)',
    problemType: 'F',
    typeLabel: 'Type F · State-Space Modeling',
    difficulty: 2,
    priority: 'MEDIUM',
    role: 'Core',
    originalStatement:
      'A robot-arm drive system for one joint can be represented by the differential equation:\n$$\\frac{dv(t)}{dt} = -k_1 v(t) - k_2 y(t) + k_3 i(t)$$\nwhere $v(t) = \\dot{y}(t) = \\text{velocity}$, $y(t) = \\text{position}$, and $i(t)$ is the control-motor current. Put the equations in state variable form and set up the matrix form for $k_1 = k_2 = 1$.',
    given: [
      'Kinematics: $\\dot{y}(t) = v(t)$',
      'Dynamics: $\\dot{v}(t) = -k_1 v(t) - k_2 y(t) + k_3 i(t)$ with $k_1 = k_2 = 1$ ($k_3$ stays symbolic)',
      'Input $u(t) = i(t)$',
    ],
    find: [
      'State vector $\\mathbf{x}$, state matrix equation $\\dot{\\mathbf{x}} = \\mathbf{A}\\mathbf{x} + \\mathbf{B}u$, and output equation for $y(t)$',
    ],
    coreIntuition:
      'State-space trades one second-order equation for two first-order equations—one for "where am I?" ($x_1 = y$) and one for "how fast am I moving?" ($x_2 = v$). Row 1 of the matrix is pure geometry ($\\dot{x}_1 = x_2$), and Row 2 is Newton\'s law telling us how acceleration depends on position, velocity, and motor current.',
    steps: [
      {
        title: 'Define the phase-variable state vector',
        math: '$$x_1(t) = y(t), \\qquad x_2(t) = v(t) = \\dot{y}(t)$$',
        reasoning:
          'Position and velocity are the natural state variables of a second-order mechanical joint.',
      },
      {
        title: 'Write both first-order equations with $k_1 = k_2 = 1$',
        math: '$$\\dot{x}_1 = x_2, \\qquad \\dot{x}_2 = -k_2 x_1 - k_1 x_2 + k_3 i(t) = -x_1 - x_2 + k_3 i(t)$$',
        reasoning:
          'Be careful with order! The problem writes $-k_1 v - k_2 y$, which puts $v = x_2$ first and $y = x_1$ second, so we reorder to match $[x_1, x_2]^T$.',
        tip: 'Leave $k_3$ symbolic! Only $k_1$ and $k_2$ were set to $1$.',
      },
      {
        title: 'Assemble matrices $\\mathbf{A}, \\mathbf{B}, \\mathbf{C}, \\mathbf{D}$',
        math: '$$\\begin{bmatrix} \\dot{x}_1 \\\\ \\dot{x}_2 \\end{bmatrix} = \\begin{bmatrix} 0 & 1 \\\\ -1 & -1 \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} + \\begin{bmatrix} 0 \\\\ k_3 \\end{bmatrix} i(t), \\qquad y(t) = \\begin{bmatrix} 1 & 0 \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix}$$',
        reasoning:
          'Reading coefficients column-by-column ($x_1$, then $x_2$) builds $\\mathbf{A}$, and reading the $i(t)$ coefficients builds $\\mathbf{B}$.',
      },
    ],
    finalAnswer:
      '$\\mathbf{x} = \\begin{bmatrix} y \\\\ v \\end{bmatrix}$, $\\mathbf{A} = \\begin{bmatrix} 0 & 1 \\\\ -1 & -1 \\end{bmatrix}$, $\\mathbf{B} = \\begin{bmatrix} 0 \\\\ k_3 \\end{bmatrix}$, $\\mathbf{C} = \\begin{bmatrix} 1 & 0 \\end{bmatrix}$, $\\mathbf{D} = 0$.',
    recognizeCue:
      'Given an equation for $\\dot{v}$ where $v = \\dot{y}$, asked for state-space matrix form.',
    shortcut:
      'With $\\mathbf{x} = [y, v]^T$, row 1 is always $[0\\;\\; 1]$ and row 2 holds the negative coefficients of $y$ and $v$.',
    commonMistakes: [
      'Setting $k_3 = 1$ when the prompt only sets $k_1 = k_2 = 1$.',
      'Mixing up the column order of $v$ and $y$ because $v$ appeared first in the given equation.',
    ],
    memorize:
      'Phase-variable order $\\mathbf{x} = [y, \\dot{y}]^T$: Row 1 is kinematics ($[0\\;\\;1]$), Row 2 is dynamics.',
  },

  {
    id: 'e3-4',
    code: 'E3.4',
    title: 'Third-Order ODE to Companion State-Space',
    hw: 'HW 3',
    source: 'Textbook p. 212 (PDF p. 57)',
    problemType: 'F',
    typeLabel: 'Type F · Companion State Realization',
    difficulty: 3,
    priority: 'VERY HIGH',
    role: 'Core',
    originalStatement:
      'Obtain a state variable matrix model for a system with a differential equation:\n$$\\frac{d^3 y(t)}{dt^3} + 4\\frac{d^2 y(t)}{dt^2} + 6\\frac{dy(t)}{dt} + 8 y(t) = 20 u(t)$$',
    given: [
      '3rd-order ODE: $\\dddot{y} + 4\\ddot{y} + 6\\dot{y} + 8y = 20u(t)$',
      'Input $u(t)$, output $y(t)$',
    ],
    find: ['State-space matrices $\\mathbf{A}, \\mathbf{B}, \\mathbf{C}, \\mathbf{D}$'],
    coreIntuition:
      'Think of a chain of three dominoes ($x_1 = y$, $x_2 = \\dot{y}$, $x_3 = \\ddot{y}$): each state\'s derivative simply shifts up to the next state ($\\dot{x}_1 = x_2$, $\\dot{x}_2 = x_3$), forming a clean diagonal of $1$s above the main diagonal. Only the very last state ($\\dot{x}_3 = \\dddot{y}$) actually looks at the ODE—and moving terms to the right-hand side flips all their signs to minus!',
    quickCheck: {
      question:
        'For $\\dddot{y} + 4\\ddot{y} + 6\\dot{y} + 8y = 20u(t)$ with $\\mathbf{x} = [y, \\dot{y}, \\ddot{y}]^T$, what is the bottom row of $\\mathbf{A}$?',
      options: [
        '$\\begin{bmatrix} 8 & 6 & 4 \\end{bmatrix}$',
        '$\\begin{bmatrix} -4 & -6 & -8 \\end{bmatrix}$',
        '$\\begin{bmatrix} -8 & -6 & -4 \\end{bmatrix}$',
        '$\\begin{bmatrix} 20 & 0 & 0 \\end{bmatrix}$',
      ],
      correctIndex: 2,
      explanation:
        'Isolating $\\dddot{y}$ moves $+8y + 6\\dot{y} + 4\\ddot{y}$ to the right side with MINUS signs, in ascending derivative order: $-8 x_1 - 6 x_2 - 4 x_3$, giving $[-8\\;\\;-6\\;\\;-4]$.',
    },
    steps: [
      {
        title: 'Define the three phase variables',
        math: '$$x_1 = y, \\qquad x_2 = \\dot{y}, \\qquad x_3 = \\ddot{y}$$',
        reasoning:
          'A 3rd-order ODE needs $3$ state variables: output, velocity, and acceleration.',
      },
      {
        title: 'Isolate $\\dddot{y}$ to write the three first-order state equations',
        math: '$$\\dot{x}_1 = x_2, \\qquad \\dot{x}_2 = x_3, \\qquad \\dot{x}_3 = \\dddot{y} = -8x_1 - 6x_2 - 4x_3 + 20u$$',
        reasoning:
          'Moving $8y + 6\\dot{y} + 4\\ddot{y}$ to the other side introduces negative signs. Notice the ascending order: $x_1$ (coefficient $-8$), $x_2$ ($-6$), $x_3$ ($-4$).',
      },
      {
        title: 'Pack into controllable companion matrices',
        math: '$$\\mathbf{A} = \\begin{bmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ -8 & -6 & -4 \\end{bmatrix}, \\quad \\mathbf{B} = \\begin{bmatrix} 0 \\\\ 0 \\\\ 20 \\end{bmatrix}, \\quad \\mathbf{C} = \\begin{bmatrix} 1 & 0 & 0 \\end{bmatrix}, \\quad \\mathbf{D} = [0]$$',
        reasoning:
          'The $20u(t)$ input only enters the highest derivative $\\dot{x}_3$, so $20$ sits in the bottom slot of $\\mathbf{B}$, while $y = x_1$ puts $1$ in the first slot of $\\mathbf{C}$.',
      },
    ],
    finalAnswer:
      '$\\mathbf{A} = \\begin{bmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ -8 & -6 & -4 \\end{bmatrix}$, $\\mathbf{B} = \\begin{bmatrix} 0 \\\\ 0 \\\\ 20 \\end{bmatrix}$, $\\mathbf{C} = \\begin{bmatrix} 1 & 0 & 0 \\end{bmatrix}$, $\\mathbf{D} = 0$.',
    recognizeCue:
      'Higher-order scalar ODE with constant coefficients and no derivatives of $u(t)$ on the right-hand side.',
    shortcut:
      'Companion form by inspection: superdiagonal of $1$s, bottom row $[-a_0, -a_1, -a_2]$, and $\\mathbf{B} = [0, 0, b_0]^T$.',
    commonMistakes: [
      'Forgetting the minus signs on $[-8, -6, -4]$.',
      'Reversing the bottom row to $[-4, -6, -8]$ instead of ascending derivative order $[-a_0, -a_1, -a_2]$.',
      'Putting $20$ in the top entry of $\\mathbf{B}$ instead of the bottom entry.',
    ],
    memorize:
      'For $y^{(n)} + a_{n-1}y^{(n-1)} + \\dots + a_0 y = b_0 u$, bottom row of $\\mathbf{A}$ is $[-a_0, -a_1, \\dots, -a_{n-1}]$ and $\\mathbf{B} = [0, \\dots, 0, b_0]^T$.',
  },

  {
    id: 'e3-14',
    code: 'E3.14',
    title: 'Radioactive Material Mass Balance',
    hw: 'HW 3',
    source: 'Textbook p. 213 (PDF p. 58)',
    problemType: 'F',
    typeLabel: 'Type F · State-Space Modeling',
    difficulty: 2,
    priority: 'LOW',
    role: 'Core',
    originalStatement:
      'Develop the state-space representation of a radioactive material of mass $M$ to which additional radioactive material is added at the rate $r(t) = K u(t)$, where $K$ is a constant. Identify the state variables. Assume that the mass decay is proportional to the mass present.',
    given: [
      'Present mass of radioactive material: $M(t)$',
      'Addition rate: $r(t) = K u(t)$',
      'Decay rate proportional to mass: $\\lambda M(t)$ with decay constant $\\lambda > 0$',
    ],
    find: [
      'State variable identification and $1\\times 1$ state-space model $(\\mathbf{A}, \\mathbf{B}, \\mathbf{C}, \\mathbf{D})$',
    ],
    coreIntuition:
      'Picture a leaky bucket where water pours in at rate $K u(t)$ and leaks out faster when the bucket is fuller ($\\lambda M(t)$). Only one quantity is being stored—the mass $M(t)$ itself—so it is a clean 1st-order state-space system with a negative eigenvalue $-\\lambda$ representing natural decay.',
    steps: [
      {
        title: 'Write conservation of mass',
        math: '$$\\frac{dM}{dt} = \\text{Inflow rate} - \\text{Decay rate} = K u(t) - \\lambda M(t)$$',
        reasoning:
          'Mass accumulates at the net difference between what is added ($K u$) and what decays ($\\lambda M$), where $\\lambda > 0$ has units of $1/\\text{time}$.',
      },
      {
        title: 'Assign state $x(t) = M(t)$ and output $y(t) = M(t)$',
        math: '$$\\dot{x}(t) = -\\lambda x(t) + K u(t), \\qquad y(t) = 1\\cdot x(t) + 0\\cdot u(t)$$',
        reasoning:
          'A single energy/mass storage variable gives a scalar $1\\times 1$ state-space system.',
      },
      {
        title: 'Read the $1\\times 1$ matrices',
        math: '$$\\mathbf{A} = [-\\lambda], \\quad \\mathbf{B} = [K], \\quad \\mathbf{C} = [1], \\quad \\mathbf{D} = [0]$$',
        reasoning:
          'Negative $\\mathbf{A} = [-\\lambda]$ confirms the natural response $e^{-\\lambda t}$ decays stably.',
      },
    ],
    finalAnswer:
      'State variable: $x(t) = M(t)$. State-space model: $\\dot{x} = -\\lambda x + Ku,\\; y = x$, so $\\mathbf{A} = [-\\lambda],\\; \\mathbf{B} = [K],\\; \\mathbf{C} = [1],\\; \\mathbf{D} = [0]$ ($\\lambda > 0$).',
    recognizeCue:
      'First-order mass, thermal, or population balance where loss rate is proportional to current amount.',
    shortcut:
      'Rate of change = inflow $-$ proportional loss $\\implies \\dot{x} = -\\lambda x + K u$.',
    commonMistakes: [
      'Writing $+\\lambda x$ instead of $-\\lambda x$ (decay must be stabilizing, not growing!).',
      'Dropping the constant $K$ by setting $r(t) = u(t)$.',
    ],
    memorize:
      'Proportional self-decay $\\dot{x} = -\\lambda x + Ku$ has LHP eigenvalue $-\\lambda$ and transfer function $K/(s + \\lambda)$.',
  },

  {
    id: 'p3-1',
    code: 'P3.1',
    title: 'Series RLC Circuit State-Space Model',
    hw: 'HW 3',
    source: 'Textbook p. 214, Fig. P3.1 (PDF p. 59)',
    problemType: 'D',
    typeLabel: 'Type D · Electrical State Modeling',
    difficulty: 3,
    priority: 'HIGH',
    role: 'Core',
    originalStatement:
      'An RLC circuit is shown in Figure P3.1. (a) Identify a suitable set of state variables. (b) Obtain the set of first-order differential equations in terms of the state variables. (c) Write the state differential equation.',
    figureUrl: '/assets/fig_P31.png',
    figureCaption: 'Figure P3.1: Series RLC circuit driven by voltage source v(t).',
    given: [
      'Series loop with voltage source $v(t)$, resistor $R$, inductor $L$, and capacitor $C$',
      'Capacitor voltage $v_c(t)$ and loop current $i(t)$',
    ],
    find: [
      '(a) Suitable state variables',
      '(b) Set of first-order ODEs',
      '(c) Matrix state differential equation $\\dot{\\mathbf{x}} = \\mathbf{A}\\mathbf{x} + \\mathbf{B}v$',
    ],
    coreIntuition:
      'Why do electrical engineers ALWAYS pick capacitor voltages and inductor currents as state variables? Because those are the ONLY two elements that store energy ($\\frac{1}{2}Cv_c^2$ and $\\frac{1}{2}Li^2$)—and their constitutive laws already have the derivatives we need: $\\dot{v}_c = i/C$ and $\\dot{i} = v_L/L$!',
    quickCheck: {
      question:
        'In an RLC circuit, why is resistor voltage $v_R(t)$ NEVER chosen as an independent state variable?',
      options: [
        'Resistors only dissipate energy algebraically ($v_R = Ri$); they store zero energy and introduce no time derivative.',
        'Resistor voltage is always zero.',
        'Resistors have infinite inductance.',
        'KVL ignores resistors.',
      ],
      correctIndex: 0,
      explanation:
        'The number of state variables equals the number of independent energy-storage elements (capacitors and inductors). Since $v_R = R i$, $v_R$ is just a multiple of state $i$.',
    },
    steps: [
      {
        title: 'Choose energy-storage state variables',
        math: '$$x_1(t) = v_c(t) \\;(\\text{capacitor voltage}), \\qquad x_2(t) = i(t) \\;(\\text{inductor current})$$',
        reasoning:
          'One capacitor and one inductor give two independent energy reservoirs, so the state vector has dimension $2$.',
      },
      {
        title: 'Write $\\dot{x}_1$ from the capacitor law and $\\dot{x}_2$ from KVL',
        math: '$$i = C\\frac{dv_c}{dt} \\;\\Rightarrow\\; \\dot{x}_1 = \\frac{1}{C}x_2, \\qquad v(t) = R i + L\\frac{di}{dt} + v_c \\;\\Rightarrow\\; \\dot{x}_2 = -\\frac{1}{L}x_1 - \\frac{R}{L}x_2 + \\frac{1}{L}v(t)$$',
        reasoning:
          'Because all elements are in series, the capacitor current IS the loop current $x_2$. Applying KVL around the loop isolates $L\\dot{x}_2$ in terms of $v_c = x_1$, $i = x_2$, and source $v(t)$.',
      },
      {
        title: 'Assemble the matrix state equation',
        math: '$$\\begin{bmatrix} \\dot{x}_1 \\\\ \\dot{x}_2 \\end{bmatrix} = \\begin{bmatrix} 0 & \\frac{1}{C} \\\\ -\\frac{1}{L} & -\\frac{R}{L} \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix} + \\begin{bmatrix} 0 \\\\ \\frac{1}{L} \\end{bmatrix} v(t)$$',
        reasoning:
          'Checking the characteristic polynomial: $\\det(s\\mathbf{I} - \\mathbf{A}) = s^2 + \\frac{R}{L}s + \\frac{1}{LC}$, the classic series RLC denominator!',
      },
    ],
    finalAnswer:
      '(a) $x_1 = v_c(t)$, $x_2 = i(t)$. (b) $\\dot{x}_1 = \\frac{1}{C}x_2$, $\\dot{x}_2 = -\\frac{1}{L}x_1 - \\frac{R}{L}x_2 + \\frac{1}{L}v(t)$. (c) $\\dot{\\mathbf{x}} = \\begin{bmatrix} 0 & 1/C \\\\ -1/L & -R/L \\end{bmatrix}\\mathbf{x} + \\begin{bmatrix} 0 \\\\ 1/L \\end{bmatrix}v(t)$.',
    recognizeCue:
      'RLC circuit schematic asking for state variables and $\\dot{\\mathbf{x}} = \\mathbf{A}\\mathbf{x} + \\mathbf{B}u$.',
    shortcut:
      'Capacitor equation gives $\\dot{v}_c = i_C/C$; inductor + KVL/KCL gives $\\dot{i}_L = v_L/L$.',
    commonMistakes: [
      'Picking resistor voltage $v_R$ as a state variable.',
      'Confusing this series RLC loop with the parallel RLC circuit in lecture slides.',
    ],
    memorize:
      'Electrical state variables are ALWAYS capacitor voltages $v_C$ and inductor currents $i_L$.',
  },

  {
    id: 'p3-8',
    code: 'P3.8',
    title: 'Lunar Module Soft Landing Model',
    hw: 'HW 3',
    source: 'Textbook p. 215, Fig. P3.8 (PDF p. 60)',
    problemType: 'F',
    typeLabel: 'Type F · State-Space Modeling',
    difficulty: 4,
    priority: 'MEDIUM',
    role: 'Extension',
    originalStatement:
      'The soft landing of a lunar module descending on the moon can be modeled as shown in Figure P3.8. Define the state variables as $x_1(t) = y(t)$, $x_2(t) = \\dot{y}(t)$, $x_3(t) = m(t)$ and the control as $u = \\dot{m}(t)$. Assume that $g$ is the gravity constant on the moon. Find a state variable model for this system. Is this a linear model?',
    figureUrl: '/assets/fig_P38.png',
    figureCaption: 'Figure P3.8: Lunar module vertical descent with Thrust = k ṁ(t).',
    given: [
      'States: altitude $x_1 = y$, velocity $x_2 = \\dot{y}$, instantaneous mass $x_3 = m > 0$',
      'Control input: mass rate $u = \\dot{m}(t)$; Lunar gravity $g$',
      'Figure P3.8 specifies $\\text{Thrust} = k\\dot{m}(t) = k u$',
    ],
    find: [
      'State differential equations $\\dot{x}_1, \\dot{x}_2, \\dot{x}_3$',
      'Whether the model is linear or nonlinear (with justification)',
    ],
    coreIntuition:
      'As a rocket burns fuel, it gets lighter ($x_3 = m(t)$ shrinks). That means the exact same engine thrust produces MORE acceleration later in the descent than at the start! Because acceleration equals Force divided by $m(t)$, you end up dividing control $u$ by state $x_3$—and dividing by a state variable makes a system strictly nonlinear.',
    steps: [
      {
        title: 'Write the altitude and mass-depletion state equations',
        math: '$$\\dot{x}_1 = \\dot{y} = x_2, \\qquad \\dot{x}_3 = \\dot{m} = u$$',
        reasoning:
          'Both kinematics and fuel-burn rate are directly defined by the problem\'s state assignments.',
      },
      {
        title: 'Apply Newton\'s 2nd law for vertical motion and divide by $x_3$',
        math: '$$m(t)\\ddot{y}(t) = \\text{Thrust} - m(t)g \\;\\Rightarrow\\; x_3 \\dot{x}_2 = ku - x_3 g \\;\\Rightarrow\\; \\dot{x}_2 = \\frac{k u}{x_3} - g$$',
        reasoning:
          'Upward thrust $k u$ opposes downward lunar weight $x_3 g$. Dividing by $x_3 > 0$ isolates $\\dot{x}_2$. (Note: in flight $\\dot{m} < 0$, so $k < 0$ produces positive upward thrust $ku > 0$.)',
      },
      {
        title: 'Classify linearity',
        math: '$$\\dot{x}_2 = \\frac{k u}{x_3} - g \\neq a_{21}x_1 + a_{22}x_2 + a_{23}x_3 + b_2 u$$',
        reasoning:
          'The term $k(u/x_3)$ multiplies input $u$ by $x_3^{-1}$, violating superposition and preventing constant-matrix form $\\dot{\\mathbf{x}} = \\mathbf{A}\\mathbf{x} + \\mathbf{B}u$. Therefore, the model is NONLINEAR.',
      },
    ],
    finalAnswer:
      '$\\dot{x}_1 = x_2,\\; \\dot{x}_2 = \\frac{ku}{x_3} - g,\\; \\dot{x}_3 = u$. The model is NONLINEAR because control $u$ is divided by state $x_3$ in $\\frac{ku}{x_3}$.',
    recognizeCue:
      'Variable-mass rocket or vehicle where mass $m(t)$ is explicitly one of the state variables.',
    shortcut:
      'Any product or quotient involving states/inputs ($u/x_3$, $x_1 x_2$, $\\sin x_1$) immediately makes the state model nonlinear.',
    commonMistakes: [
      'Calling the system linear just because $\\dot{x}_1 = x_2$ and $\\dot{x}_3 = u$ look linear.',
      'Re-deriving $d(mv)/dt$ naively instead of using the textbook\'s given rocket thrust $k\\dot{m}$.',
    ],
    memorize:
      'A model is linear ONLY if every $\\dot{x}_i$ is a linear combination $\\sum a_{ij}x_j + b_i u$.',
  },

  // =========================================================================
  // HOMEWORK 4 · CHAPTER 3 (E3.5, E3.10, E3.19, P3.4, P3.7)
  // =========================================================================
  {
    id: 'e3-5',
    code: 'E3.5',
    title: 'Block Diagram to State Equations',
    hw: 'HW 4',
    source: 'Textbook p. 212, Fig. E3.5 (PDF p. 57)',
    problemType: 'F',
    typeLabel: 'Type F · Block Diagram to State-Space',
    difficulty: 4,
    priority: 'VERY HIGH',
    role: 'Core',
    originalStatement:
      'A system is represented by a block diagram as shown in Figure E3.5. Write the state equations in the form $\\dot{\\mathbf{x}} = \\mathbf{A}\\mathbf{x} + \\mathbf{B}u$, $y = \\mathbf{C}\\mathbf{x} + \\mathbf{D}u$. The states are the outputs $x_1$ and $x_2$ of the two integrators.',
    figureUrl: '/assets/fig_E35.png',
    figureCaption: 'Figure E3.5: Two-integrator block diagram with pre-integrator feedforward branch f.',
    given: [
      'Two integrators $1/s$ with outputs $x_1$ and $x_2$',
      'Summer 1 computes $u - k x_2$, feeding Integrator 1',
      'Feedforward gain $f$ taps BEFORE Integrator 1 and adds ($+$) into Summer 2 alongside $+a x_1$ and $-d x_2$',
      'Output $y = b x_2$',
    ],
    find: ['State-space matrices $\\mathbf{A}, \\mathbf{B}, \\mathbf{C}, \\mathbf{D}$'],
    coreIntuition:
      'Here is the golden rule of integrator diagrams: if an integrator\'s output is $x_i$, then the wire going INTO that integrator is ALWAYS $\\dot{x}_i$! The tricky trap in Figure E3.5 is that branch $f$ taps BEFORE Integrator 1—so it carries $\\dot{x}_1$ (not $x_1$!) into Summer 2, sneaking both $u$ and $-k x_2$ directly into $\\dot{x}_2$.',
    quickCheck: {
      question:
        'Why does the $B$ matrix in Problem E3.5 have $f$ in its second row ($\\mathbf{B} = [1,\\; f]^T$) instead of $0$?',
      options: [
        'Because the feedforward branch $f$ taps BEFORE Integrator 1, carrying $\\dot{x}_1 = u - k x_2$ directly into Summer 2.',
        'Because $b$ multiplies the input $u$ at the output.',
        'Because Integrator 2 has gain $f$ instead of $1/s$.',
        'Because $y = b x_2$ feeds back to the input.',
      ],
      correctIndex: 0,
      explanation:
        'Tracing the tap before Integrator 1 gives $\\dot{x}_1 = u - kx_2$. Multiplying by $f$ sends $fu - fkx_2$ straight into $\\dot{x}_2$!',
    },
    steps: [
      {
        title: 'Label the input of Integrator 1 as $\\dot{x}_1$',
        math: '$$\\dot{x}_1 = u(t) - k x_2(t)$$',
        reasoning:
          'Summer 1 adds $+u$ and subtracts $k x_2$, sending that signal straight into the first $1/s$ block whose output is $x_1$.',
      },
      {
        title: 'Trace Summer 2 into Integrator 2 ($\\dot{x}_2$)',
        math: '$$\\dot{x}_2 = a x_1 + f(\\dot{x}_1) - d x_2$$',
        reasoning:
          'Look closely at where the $f$ arrow starts: to the LEFT of Integrator 1, so it carries $\\dot{x}_1$. Summer 2 adds $+a x_1$, $+f\\dot{x}_1$, and $-d x_2$.',
        tip: 'Always draw a dot at each integrator input and label it $\\dot{x}_i$ before writing any equations!',
      },
      {
        title: 'Substitute $\\dot{x}_1$ into $\\dot{x}_2$ and assemble matrices',
        math: '$$\\dot{x}_2 = a x_1 + f(u - k x_2) - d x_2 = a x_1 - (d + fk)x_2 + f u$$',
        reasoning:
          'A valid state equation may only contain states ($x_1, x_2$) and inputs ($u$) on the right-hand side—never derivatives like $\\dot{x}_1$. Substituting $\\dot{x}_1$ reveals the extra $-fk x_2$ and $+fu$ terms.',
      },
      {
        title: 'Write matrices $\\mathbf{A}, \\mathbf{B}, \\mathbf{C}, \\mathbf{D}$',
        math: '$$\\mathbf{A} = \\begin{bmatrix} 0 & -k \\\\ a & -(d + fk) \\end{bmatrix}, \\quad \\mathbf{B} = \\begin{bmatrix} 1 \\\\ f \\end{bmatrix}, \\quad \\mathbf{C} = \\begin{bmatrix} 0 & b \\end{bmatrix}, \\quad \\mathbf{D} = [0]$$',
        reasoning:
          'Since $y = b x_2$, $\\mathbf{C} = [0\\;\\;b]$ and there is no direct feedthrough from $u$ to $y$ ($\\mathbf{D} = 0$).',
      },
    ],
    finalAnswer:
      '$\\mathbf{A} = \\begin{bmatrix} 0 & -k \\\\ a & -(d + fk) \\end{bmatrix}$, $\\mathbf{B} = \\begin{bmatrix} 1 \\\\ f \\end{bmatrix}$, $\\mathbf{C} = \\begin{bmatrix} 0 & b \\end{bmatrix}$, $\\mathbf{D} = 0$.',
    recognizeCue:
      'Simulation block diagram with $1/s$ integrators whose outputs are labeled $x_1, x_2, \\dots$',
    shortcut:
      'Label every wire entering a $1/s$ block as $\\dot{x}_i$, read each summer, and eliminate any $\\dot{x}_j$ on the right-hand side.',
    commonMistakes: [
      'Thinking branch $f$ taps $x_1$ instead of $\\dot{x}_1$ (missing both $-fk$ in $\\mathbf{A}$ and $f$ in $\\mathbf{B}$).',
      'Dropping the minus signs on feedback gains $k$ and $d$.',
    ],
    memorize:
      'Integrator input = $\\dot{x}_i$; integrator output = $x_i$. Never leave $\\dot{x}$ on the RHS of a state equation.',
  },

  {
    id: 'e3-10',
    code: 'E3.10',
    title: 'Eigenvalues & State Transition Matrix',
    hw: 'HW 4',
    source: 'Textbook p. 212 (PDF p. 57)',
    problemType: 'G',
    typeLabel: 'Type G · Eigenvalues & State Transition Matrix',
    difficulty: 4,
    priority: 'VERY HIGH',
    role: 'Extension',
    originalStatement:
      'A hovering vehicle control system is represented by two state variables, and\n$$\\dot{\\mathbf{x}}(t) = \\begin{bmatrix} 0 & 6 \\\\ -1 & -5 \\end{bmatrix}\\mathbf{x}(t) + \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} u(t)$$\n(a) Find the roots of the characteristic equation. (b) Find the state transition matrix $\\mathbf{\\Phi}(t)$.',
    bookAnswer: '(a) $s = -3, -2$; (b) $\\mathbf{\\Phi}(t)$ shown on p. 212',
    given: [
      '$\\mathbf{A} = \\begin{bmatrix} 0 & 6 \\\\ -1 & -5 \\end{bmatrix}$, $\\mathbf{B} = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$',
    ],
    find: [
      '(a) Characteristic roots (eigenvalues of $\\mathbf{A}$)',
      '(b) State transition matrix $\\mathbf{\\Phi}(t) = e^{\\mathbf{A}t}$',
    ],
    coreIntuition:
      'The state transition matrix $\\mathbf{\\Phi}(t)$ is the "time machine" of a linear system: multiply $\\mathbf{\\Phi}(t)$ by your starting state $\\mathbf{x}(0)$, and it predicts $\\mathbf{x}(t)$ at any future time! Crucial warning: $e^{\\mathbf{A}t}$ is NOT $e^{a_{ij}t}$ entry-by-entry—the states couple together, so we use the Laplace resolvent $\\mathcal{L}^{-1}\\{(s\\mathbf{I} - \\mathbf{A})^{-1}\\}$.',
    quickCheck: {
      question:
        'You finish computing a $2\\times 2$ state transition matrix $\\mathbf{\\Phi}(t)$. Which two instant checks guarantee your matrix is error-free?',
      options: [
        'Check $\\mathbf{\\Phi}(0) = \\mathbf{I}$ and $\\dot{\\mathbf{\\Phi}}(0) = \\mathbf{A}$.',
        'Check $\\mathbf{\\Phi}(0) = \\mathbf{0}$ and $\\mathbf{\\Phi}(\\infty) = \\mathbf{A}$.',
        'Check $\\det(\\mathbf{\\Phi}(0)) = 0$ and $\\text{trace}(\\mathbf{\\Phi}(0)) = 0$.',
        'Check that $\\mathbf{\\Phi}(t)$ equals $e^{a_{ij}t}$ on the diagonal.',
      ],
      correctIndex: 0,
      explanation:
        'At $t = 0$, $e^{\\mathbf{A}\\cdot 0} = \\mathbf{I}$ (the identity matrix), and its derivative $\\frac{d}{dt}e^{\\mathbf{A}t}|_{t=0} = \\mathbf{A}\\mathbf{I} = \\mathbf{A}$. Any sign slip in the adjugate or partial fractions fails one of these two checks!',
    },
    steps: [
      {
        title: 'Form $s\\mathbf{I} - \\mathbf{A}$ and find the eigenvalues',
        math: '$$s\\mathbf{I} - \\mathbf{A} = \\begin{bmatrix} s & -6 \\\\ 1 & s + 5 \\end{bmatrix}, \\qquad \\det(s\\mathbf{I} - \\mathbf{A}) = s(s + 5) + 6 = (s + 2)(s + 3) = 0$$',
        reasoning:
          'Subtracting $\\mathbf{A}$ from $s\\mathbf{I}$ flips every off-diagonal sign. Setting the determinant to zero gives characteristic roots $s_1 = -2$ and $s_2 = -3$.',
      },
      {
        title: 'Invert $(s\\mathbf{I} - \\mathbf{A})$ to get the resolvent matrix',
        math: '$$(s\\mathbf{I} - \\mathbf{A})^{-1} = \\frac{1}{(s+2)(s+3)}\\begin{bmatrix} s+5 & 6 \\\\ -1 & s \\end{bmatrix}$$',
        reasoning:
          'For a $2\\times 2$ matrix $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, swap the diagonal entries ($s$ and $s+5$) and negate the off-diagonal entries ($-6 \\to +6$, $1 \\to -1$).',
      },
      {
        title: 'Partial-fraction each of the four entries',
        math: '$$\\Phi_{11}(s) = \\frac{3}{s+2} - \\frac{2}{s+3}, \\; \\Phi_{12}(s) = \\frac{6}{s+2} - \\frac{6}{s+3}, \\; \\Phi_{21}(s) = \\frac{-1}{s+2} + \\frac{1}{s+3}, \\; \\Phi_{22}(s) = \\frac{-2}{s+2} + \\frac{3}{s+3}$$',
        reasoning:
          'Apply cover-up at $s = -2$ and $s = -3$ to each entry separately.',
      },
      {
        title: 'Invert to $\\mathbf{\\Phi}(t)$ and run the two mandatory checks',
        math: '$$\\mathbf{\\Phi}(t) = \\begin{bmatrix} 3e^{-2t} - 2e^{-3t} & 6e^{-2t} - 6e^{-3t} \\\\ -e^{-2t} + e^{-3t} & -2e^{-2t} + 3e^{-3t} \\end{bmatrix}$$',
        reasoning:
          'Check 1: $\\mathbf{\\Phi}(0) = \\begin{bmatrix} 3-2 & 6-6 \\\\ -1+1 & -2+3 \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix} = \\mathbf{I}$ (passed!). Check 2: $\\dot{\\mathbf{\\Phi}}(0) = \\begin{bmatrix} -6+6 & -12+18 \\\\ 2-3 & 4-9 \\end{bmatrix} = \\begin{bmatrix} 0 & 6 \\\\ -1 & -5 \\end{bmatrix} = \\mathbf{A}$ (passed!).',
      },
    ],
    finalAnswer:
      '(a) $s_1 = -2,\\; s_2 = -3$.  (b) $\\mathbf{\\Phi}(t) = \\begin{bmatrix} 3e^{-2t} - 2e^{-3t} & 6e^{-2t} - 6e^{-3t} \\\\ -e^{-2t} + e^{-3t} & -2e^{-2t} + 3e^{-3t} \\end{bmatrix}$ for $t \\ge 0$.',
    recognizeCue:
      'Given matrix $\\mathbf{A}$; asks for characteristic roots/eigenvalues and state transition matrix $\\mathbf{\\Phi}(t)$.',
    shortcut:
      'For distinct eigenvalues $\\lambda_1, \\lambda_2$ of a $2\\times 2$ matrix: $\\mathbf{\\Phi}(t) = \\frac{\\mathbf{A} - \\lambda_2\\mathbf{I}}{\\lambda_1 - \\lambda_2}e^{\\lambda_1 t} + \\frac{\\mathbf{A} - \\lambda_1\\mathbf{I}}{\\lambda_2 - \\lambda_1}e^{\\lambda_2 t}$.',
    commonMistakes: [
      'FATAL ERROR: Writing $\\Phi_{ij}(t) = e^{a_{ij}t}$ entry-by-entry.',
      'Forgetting to negate off-diagonals in the $2\\times 2$ adjugate.',
      'Skipping the $30$-second $\\mathbf{\\Phi}(0) = \\mathbf{I}$ and $\\dot{\\mathbf{\\Phi}}(0) = \\mathbf{A}$ verification.',
    ],
    memorize:
      '$\\mathbf{\\Phi}(t) = \\mathcal{L}^{-1}\\{(s\\mathbf{I} - \\mathbf{A})^{-1}\\}$, and ALWAYS verify $\\mathbf{\\Phi}(0) = \\mathbf{I}$ and $\\dot{\\mathbf{\\Phi}}(0) = \\mathbf{A}$.',
  },

  {
    id: 'e3-19',
    code: 'E3.19',
    title: 'State-Space to Transfer Function',
    hw: 'HW 4',
    source: 'Textbook p. 213 (PDF p. 58)',
    problemType: 'G',
    typeLabel: 'Type G · State-Space to Transfer Function',
    difficulty: 3,
    priority: 'VERY HIGH',
    role: 'Extension',
    originalStatement:
      'A single-input, single-output system has the matrix equations\n$$\\dot{\\mathbf{x}}(t) = \\begin{bmatrix} 0 & 1 \\\\ -3 & -5 \\end{bmatrix}\\mathbf{x}(t) + \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} u(t) \\quad\\text{and}\\quad y(t) = \\begin{bmatrix} 3 & 0 \\end{bmatrix}\\mathbf{x}(t)$$\nDetermine the transfer function $G(s) = Y(s)/U(s)$.',
    bookAnswer: '$G(s) = \\frac{3}{s^2 + 5s + 3}$',
    given: [
      '$\\mathbf{A} = \\begin{bmatrix} 0 & 1 \\\\ -3 & -5 \\end{bmatrix}$, $\\mathbf{B} = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}$, $\\mathbf{C} = \\begin{bmatrix} 3 & 0 \\end{bmatrix}$, $\\mathbf{D} = [0]$',
    ],
    find: ['Transfer function $G(s) = Y(s)/U(s)$ under zero initial conditions'],
    coreIntuition:
      'Converting state-space back to a transfer function is the exact reverse of companion realization! Because $\\mathbf{A}$ is already in companion form ($[0\\;\\;1]$ on top, $[-3\\;\\;-5]$ on bottom) and $\\mathbf{B} = [0\\;\\;1]^T$, you can practically read the denominator $s^2 + 5s + 3$ and numerator $3$ straight off the matrices—and verify with $G(s) = \\mathbf{C}(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B}$.',
    quickCheck: {
      question:
        'In the formula $G(s) = \\mathbf{C}(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B} + \\mathbf{D}$, what happens if you accidentally swap $\\mathbf{C}$ and $\\mathbf{B}$?',
      options: [
        'Matrix dimensions clash ($\\mathbf{B}$ is $2\\times 1$ and $\\mathbf{C}$ is $1\\times 2$), so you cannot multiply $\\mathbf{B}(s\\mathbf{I}-\\mathbf{A})^{-1}\\mathbf{C}$ to get a scalar!',
        'You get the inverse transfer function $1/G(s)$.',
        'It changes the sign of the denominator.',
        'Nothing changes because matrix multiplication is commutative.',
      ],
      correctIndex: 0,
      explanation:
        'Check dimensions: $(1\\times n)(n\\times n)(n\\times 1) = 1\\times 1$ scalar! Row vector $\\mathbf{C}$ MUST be on the left and column vector $\\mathbf{B}$ on the right.',
    },
    steps: [
      {
        title: 'Compute $(s\\mathbf{I} - \\mathbf{A})$ and its determinant',
        math: '$$s\\mathbf{I} - \\mathbf{A} = \\begin{bmatrix} s & -1 \\\\ 3 & s+5 \\end{bmatrix}, \\qquad \\det(s\\mathbf{I} - \\mathbf{A}) = s(s + 5) - (-1)(3) = s^2 + 5s + 3$$',
        reasoning:
          'The determinant of $(s\\mathbf{I} - \\mathbf{A})$ is always the characteristic polynomial in the denominator of $G(s)$.',
      },
      {
        title: 'Invert $(s\\mathbf{I} - \\mathbf{A})$ and multiply by $\\mathbf{B}$',
        math: '$$(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B} = \\frac{1}{s^2 + 5s + 3}\\begin{bmatrix} s+5 & 1 \\\\ -3 & s \\end{bmatrix}\\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix} = \\frac{1}{s^2 + 5s + 3}\\begin{bmatrix} 1 \\\\ s \\end{bmatrix}$$',
        reasoning:
          'Multiplying by $\\mathbf{B} = [0, 1]^T$ simply selects the second column of the adjugate matrix.',
        tip: 'Quick scalar check: $sX_1 = X_2$ and $sX_2 = -3X_1 - 5X_2 + U \\implies (s^2 + 5s + 3)X_1 = U$. Since $Y = 3X_1$, $Y/U = 3/(s^2 + 5s + 3)$!',
      },
      {
        title: 'Multiply on the left by $\\mathbf{C}$',
        math: '$$G(s) = \\mathbf{C}(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B} = \\begin{bmatrix} 3 & 0 \\end{bmatrix}\\frac{1}{s^2 + 5s + 3}\\begin{bmatrix} 1 \\\\ s \\end{bmatrix} = \\frac{3}{s^2 + 5s + 3}$$',
        reasoning:
          'Taking the dot product with $\\mathbf{C} = [3, 0]$ pulls out $3 \\cdot 1 + 0 \\cdot s = 3$.',
      },
    ],
    finalAnswer: '$G(s) = \\frac{Y(s)}{U(s)} = \\frac{3}{s^2 + 5s + 3}$.',
    recognizeCue:
      'Given $(\\mathbf{A}, \\mathbf{B}, \\mathbf{C}, \\mathbf{D})$; asked for $G(s) = Y(s)/U(s)$.',
    shortcut:
      'Compute $(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B}$ first (or write out the scalar Laplace equations and eliminate $X_2$), then dot with $\\mathbf{C}$.',
    commonMistakes: [
      'Writing $\\mathbf{B}(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{C}$ instead of $\\mathbf{C}(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B}$.',
      'Forgetting to negate off-diagonals in $(s\\mathbf{I} - \\mathbf{A})$ or in its adjugate.',
    ],
    memorize:
      '$G(s) = \\mathbf{C}(s\\mathbf{I} - \\mathbf{A})^{-1}\\mathbf{B} + \\mathbf{D}$.',
  },

  {
    id: 'p3-4',
    code: 'P3.4',
    title: 'Transfer Function & Integrator Realization',
    hw: 'HW 4',
    source: 'Textbook p. 214 (PDF p. 59)',
    problemType: 'F',
    typeLabel: 'Type F · Companion Realization',
    difficulty: 4,
    priority: 'VERY HIGH',
    role: 'Extension',
    originalStatement:
      'The transfer function of a system is\n$$T(s) = \\frac{Y(s)}{R(s)} = \\frac{s^2 + 2s + 10}{s^3 + 4s^2 + 6s + 10}$$\nSketch the block diagram and obtain a state variable model.',
    given: [
      'Strictly proper 3rd-order transfer function $T(s) = \\frac{s^2 + 2s + 10}{s^3 + 4s^2 + 6s + 10}$ (already monic denominator)',
    ],
    find: [
      'All-integrator simulation block diagram',
      'State-space matrices $\\mathbf{A}, \\mathbf{B}, \\mathbf{C}, \\mathbf{D}$',
    ],
    coreIntuition:
      'How do you build a numerator like $s^2 + 2s + 10$ using ONLY integrators ($1/s$) and NO noisy differentiators ($s$)? Split the system in two! First, use three cascaded integrators with feedback $(-10, -6, -4)$ to build an internal signal $W(s)$ containing the denominator poles. Since the taps along that integrator chain ALREADY equal $w, \\dot{w}, \\ddot{w}$, simply adding $10w + 2\\dot{w} + \\ddot{w}$ creates the numerator zeros for free!',
    quickCheck: {
      question:
        'In the controllable canonical realization of $T(s) = \\frac{s^2 + 2s + 10}{s^3 + 4s^2 + 6s + 10}$, where do the numerator coefficients $(1, 2, 10)$ go?',
      options: [
        'Into the output row vector $\\mathbf{C} = \\begin{bmatrix} 10 & 2 & 1 \\end{bmatrix}$ (feeding forward to the output summer).',
        'Into the bottom row of $\\mathbf{A}$.',
        'Into the input vector $\\mathbf{B}$.',
        'Into the direct feedthrough $\\mathbf{D}$.',
      ],
      correctIndex: 0,
      explanation:
        'Denominator coefficients $(-10, -6, -4)$ govern feedback into $\\mathbf{A}$; numerator coefficients $(10, 2, 1)$ govern feedforward summation into $y = \\mathbf{C}\\mathbf{x}$!',
    },
    steps: [
      {
        title: 'Split $T(s)$ using an intermediate signal $W(s)$',
        math: '$$W(s) = \\frac{1}{s^3 + 4s^2 + 6s + 10} R(s), \\qquad Y(s) = (s^2 + 2s + 10)W(s)$$',
        reasoning:
          'Splitting $T(s)$ into "denominator only" followed by "numerator only" eliminates input derivatives from the differential equation.',
      },
      {
        title: 'Define states at the outputs of three cascaded integrators',
        math: '$$x_1 = w, \\quad x_2 = \\dot{w}, \\quad x_3 = \\ddot{w} \\quad\\Rightarrow\\quad \\dot{x}_1 = x_2, \\quad \\dot{x}_2 = x_3, \\quad \\dot{x}_3 = -10x_1 - 6x_2 - 4x_3 + r(t)$$',
        reasoning:
          'In the integrator chain $r(t) \\to \\Sigma_1 \\xrightarrow{\\dot{x}_3} [1/s] \\xrightarrow{x_3} [1/s] \\xrightarrow{x_2} [1/s] \\xrightarrow{x_1}$, feedback gains $-4, -6, -10$ loop back from $x_3, x_2, x_1$ to the input summer $\\Sigma_1$.',
      },
      {
        title: 'Form the output equation and state-space matrices',
        math: '$$y = 10 x_1 + 2 x_2 + 1 x_3 \\quad\\Rightarrow\\quad \\mathbf{A} = \\begin{bmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ -10 & -6 & -4 \\end{bmatrix},\\; \\mathbf{B} = \\begin{bmatrix} 0 \\\\ 0 \\\\ 1 \\end{bmatrix},\\; \\mathbf{C} = \\begin{bmatrix} 10 & 2 & 1 \\end{bmatrix},\\; \\mathbf{D} = [0]$$',
        reasoning:
          'In the block diagram, feedforward branches from $x_1, x_2, x_3$ with gains $10, 2, 1$ add at an output summer $\\Sigma_{\\text{out}}$ to produce $y(t)$.',
      },
    ],
    finalAnswer:
      '$\\mathbf{A} = \\begin{bmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ -10 & -6 & -4 \\end{bmatrix}$, $\\mathbf{B} = \\begin{bmatrix} 0 \\\\ 0 \\\\ 1 \\end{bmatrix}$, $\\mathbf{C} = \\begin{bmatrix} 10 & 2 & 1 \\end{bmatrix}$, $\\mathbf{D} = 0$, realized with 3 cascaded integrators $1/s$, feedback gains $(-4, -6, -10)$ to input summer, and feedforward gains $(1, 2, 10)$ to output summer.',
    recognizeCue:
      'Rational transfer function with numerator zeros asking for a block diagram and state-variable model.',
    shortcut:
      'Once denominator is monic, bottom row of $\\mathbf{A}$ is $[-a_0, -a_1, -a_2]$ and $\\mathbf{C}$ is $[b_0, b_1, b_2]$.',
    commonMistakes: [
      'Trying to use derivative blocks $s$ instead of integrators $1/s$.',
      'Assigning states to integrator inputs instead of integrator outputs.',
      'Reversing the order of $[10, 2, 1]$ in $\\mathbf{C}$ to $[1, 2, 10]$.',
    ],
    memorize:
      'Denominator $\\to$ feedback into $\\dot{x}_n$ (bottom row of $\\mathbf{A}$). Numerator $\\to$ feedforward into $y$ (row vector $\\mathbf{C}$).',
  },

  {
    id: 'p3-7',
    code: 'P3.7',
    title: 'Submarine Depth Control with Derivative Feedback',
    hw: 'HW 4',
    source: 'Textbook p. 214–215, Fig. P3.7 (PDF p. 59–60)',
    problemType: 'F',
    typeLabel: 'Type F · Multiloop to Companion State',
    difficulty: 5,
    priority: 'HIGH',
    role: 'Extension',
    originalStatement:
      'An automatic depth-control system for a robot submarine is shown in Figure P3.7. The depth is measured by a pressure transducer. The gain of the stern plane actuator is $K = 1$ when the vertical velocity is $25\\text{ m/s}$. The submarine has the transfer function\n$$G(s) = \\frac{(s + 1)^2}{s^2 + 1}$$\nand the feedback transducer is $H(s) = 2s + 1$. Determine a state variable representation for the system.',
    figureUrl: '/assets/fig_P37.png',
    figureCaption: 'Figure P3.7: Submarine depth-control loop with actuator K = 1, plant G(s), forward 1/s, and sensor H(s) = 2s + 1.',
    given: [
      'Actuator gain $K = 1$, submarine dynamics $G(s) = \\frac{(s+1)^2}{s^2+1}$, forward integrator $\\frac{1}{s}$',
      'Negative feedback sensor $H(s) = 2s + 1$',
    ],
    find: [
      'Closed-loop transfer function $T(s) = Y(s)/R(s)$',
      'State-space matrices $\\mathbf{A}, \\mathbf{B}, \\mathbf{C}, \\mathbf{D}$',
    ],
    coreIntuition:
      'This is a classic two-stage capstone problem! First you reduce a feedback loop containing a forward integrator $1/s$ and a derivative sensor $2s+1$. Second—here is the #1 exam trap—the closed-loop denominator turns out to be $3s^3 + 5s^2 + 5s + 1$, which is NOT monic! You MUST divide numerator and denominator by $3$ before reading off companion matrices $\\mathbf{A}$ and $\\mathbf{C}$.',
    quickCheck: {
      question:
        'After reducing Figure P3.7, you get $T(s) = \\frac{s^2 + 2s + 1}{3s^3 + 5s^2 + 5s + 1}$. What MUST you do before writing the companion matrix $\\mathbf{A}$?',
      options: [
        'Divide both numerator and denominator by $3$ so the denominator is monic ($s^3 + \\frac{5}{3}s^2 + \\frac{5}{3}s + \\frac{1}{3}$).',
        'Read $[-1, -5, -5]$ directly into the bottom row of $\\mathbf{A}$ and set $B = [0, 0, 3]^T$.',
        'Drop the leading $3$ from the denominator only.',
        'Multiply the numerator by $3$.',
      ],
      correctIndex: 0,
      explanation:
        'Companion form requires $s^n$ to have coefficient $1$ (corresponding to $1\\cdot\\dddot{w}$)! Dividing both top and bottom by $3$ preserves $T(s)$ and gives exact entries $-1/3, -5/3, -5/3$ in $\\mathbf{A}$ and $1/3, 2/3, 1/3$ in $\\mathbf{C}$.',
    },
    steps: [
      {
        title: 'Combine the forward path blocks',
        math: '$$G_f(s) = K \\cdot G(s) \\cdot \\frac{1}{s} = \\frac{(s + 1)^2}{s(s^2 + 1)} = \\frac{s^2 + 2s + 1}{s^3 + s}$$',
        reasoning:
          'Do not overlook the $1/s$ block in the forward path—it integrates vertical velocity into depth $Y(s)$.',
      },
      {
        title: 'Compute closed-loop $T(s)$ and expand carefully',
        math: '$$T(s) = \\frac{G_f(s)}{1 + G_f(s)H(s)} = \\frac{(s+1)^2}{s(s^2+1) + (2s+1)(s+1)^2} = \\frac{s^2 + 2s + 1}{3s^3 + 5s^2 + 5s + 1}$$',
        reasoning:
          'Expanding $(2s+1)(s^2+2s+1) = 2s^3 + 5s^2 + 4s + 1$ and adding $s^3 + s$ yields $3s^3 + 5s^2 + 5s + 1$.',
      },
      {
        title: 'Normalize to monic form by dividing by $3$',
        math: '$$T(s) = \\frac{\\frac{1}{3}s^2 + \\frac{2}{3}s + \\frac{1}{3}}{s^3 + \\frac{5}{3}s^2 + \\frac{5}{3}s + \\frac{1}{3}}$$',
        reasoning:
          'Companion form requires $s^3$ to have coefficient $1$. Dividing top and bottom by $3$ keeps the transfer function unchanged while exposing the true ODE coefficients.',
      },
      {
        title: 'Write the controllable companion matrices',
        math: '$$\\mathbf{A} = \\begin{bmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ -\\frac{1}{3} & -\\frac{5}{3} & -\\frac{5}{3} \\end{bmatrix}, \\quad \\mathbf{B} = \\begin{bmatrix} 0 \\\\ 0 \\\\ 1 \\end{bmatrix}, \\quad \\mathbf{C} = \\begin{bmatrix} \\frac{1}{3} & \\frac{2}{3} & \\frac{1}{3} \\end{bmatrix}, \\quad \\mathbf{D} = [0]$$',
        reasoning:
          'Negated monic denominator coefficients go in ascending order along the bottom row of $\\mathbf{A}$, and scaled numerator coefficients go into $\\mathbf{C}$.',
      },
    ],
    finalAnswer:
      '$T(s) = \\frac{s^2 + 2s + 1}{3s^3 + 5s^2 + 5s + 1}$; $\\mathbf{A} = \\begin{bmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ -1/3 & -5/3 & -5/3 \\end{bmatrix}$, $\\mathbf{B} = \\begin{bmatrix} 0 \\\\ 0 \\\\ 1 \\end{bmatrix}$, $\\mathbf{C} = \\begin{bmatrix} 1/3 & 2/3 & 1/3 \\end{bmatrix}$, $\\mathbf{D} = 0$.',
    recognizeCue:
      'Closed-loop block diagram with non-unity feedback $H(s)$ asking for a state-variable representation.',
    shortcut:
      'Reduce to $T(s)$, divide top and bottom by the leading denominator coefficient $a_n$, then read $\\mathbf{A}$ and $\\mathbf{C}$ directly.',
    commonMistakes: [
      'Missing the $1/s$ forward block in Figure P3.7.',
      'Forgetting to divide by $3$ before writing the companion matrix $\\mathbf{A}$ and output vector $\\mathbf{C}$.',
    ],
    memorize:
      'Companion form ALWAYS requires a monic denominator ($s^n + a_{n-1}s^{n-1} + \\dots$). If $a_n \\neq 1$, divide every term by $a_n$ first!',
  },

  // =========================================================================
  // PROFESSOR-RECOMMENDED EXAMPLES (Ex2.1, Ex2.2, Ex2.5, Ex2.6)
  // =========================================================================
  {
    id: 'ex2-1',
    code: 'Ex2.1',
    title: 'Pendulum Oscillator Model Linearization',
    hw: 'Recommended',
    source: 'Dorf & Bishop Ex 2.1, pp. 57–60 (Prof. Self-Study Tip)',
    problemType: 'A',
    typeLabel: 'Type A · Analytical Linearization',
    difficulty: 2,
    priority: 'HIGH',
    role: 'Prof Tip',
    originalStatement:
      'A simple pendulum oscillator of mass $M$ and length $L$ experiences a nonlinear gravitational restoring torque $T(t) = M g L \\sin\\theta(t)$, where $g$ is the gravitational constant. Obtain the linear model about the equilibrium operating point $\\theta_0 = 0^\\circ$ (and compare with a non-zero operating angle $\\theta_0 = \\pi/6 = 30^\\circ$).',
    bookAnswer: '$T(t) = M g L \\theta(t)$ (accurate within 5% for $|\\theta| \\le 30^\\circ$)',
    given: [
      'Nonlinear torque relation: $T(\\theta) = M g L \\sin\\theta$',
      'Operating point (a): $\\theta_0 = 0\\text{ rad}$ ($0^\\circ$); comparison (b): $\\theta_0 = \\pi/6\\text{ rad}$ ($30^\\circ$)',
    ],
    find: [
      'Linearized torque equation about $\\theta_0 = 0$ and about $\\theta_0 = \\pi/6$',
    ],
    coreIntuition:
      'If you swing a pendulum only a little bit around straight-down ($\\theta_0 = 0$), $\\sin\\theta$ tracks $\\theta$ almost 1-to-1—so gravity acts just like a linear torsional spring of stiffness $M g L$! But if a steady wind holds the pendulum tilted at $30^\\circ$, the sine curve is slightly flatter there, so the local "spring stiffness" shrinks by $\\cos(30^\\circ) \\approx 0.866$.',
    quickCheck: {
      question:
        'If a pendulum is linearized around a tilted operating point $\\theta_0 = 30^\\circ$ instead of $\\theta_0 = 0^\\circ$, what is the slope of $\\Delta T = m\\,\\Delta\\theta$?',
      options: [
        '$M g L \\sin(30^\\circ) = 0.5\\,M g L$',
        '$M g L \\cos(30^\\circ) \\approx 0.866\\,M g L$',
        '$M g L$',
        '$0$',
      ],
      correctIndex: 1,
      explanation:
        'The baseline torque is $T_0 = M g L \\sin(30^\\circ) = 0.5\\,MgL$, while the local slope is the DERIVATIVE $\\frac{dT}{d\\theta}\\big|_{\\theta_0} = M g L \\cos(30^\\circ) \\approx 0.866\\,MgL$.',
    },
    steps: [
      {
        title: 'Differentiate the nonlinear torque law',
        math: '$$\\frac{dT}{d\\theta} = M g L \\cos\\theta$$',
        reasoning:
          'The local tangent slope of $T(\\theta)$ at any operating angle $\\theta_0$ is its first derivative with respect to $\\theta$ (in radians!).',
        tip: 'Angle $\\theta$ MUST be in radians so that $\\frac{d}{d\\theta}(\\sin\\theta) = \\cos\\theta$ without extra $\\pi/180$ factors!',
      },
      {
        title: 'Evaluate at equilibrium $\\theta_0 = 0\\text{ rad}$',
        math: '$$T_0 = M g L \\sin(0) = 0, \\quad m_1 = M g L \\cos(0) = M g L \\quad\\Rightarrow\\quad T(t) \\approx M g L\\,\\theta(t)$$',
        reasoning:
          'At the bottom equilibrium, $T_0 = 0$, so deviation $\\Delta T = T$ and $\\Delta\\theta = \\theta$. For $-\\pi/4 \\le \\theta \\le \\pi/4$, this linear model stays within about $5\\%$ of the exact nonlinear response for $\\pm 30^\\circ$ swings.',
      },
      {
        title: 'Compare at non-zero operating point $\\theta_0 = \\pi/6\\text{ rad}$',
        math: '$$T_0 = 0.5\\,M g L, \\quad m_2 = M g L \\cos\\!\\left(\\frac{\\pi}{6}\\right) = \\frac{\\sqrt{3}}{2}M g L \\approx 0.866\\,M g L \\quad\\Rightarrow\\quad \\Delta T \\approx 0.866\\,M g L\\,\\Delta\\theta$$',
        reasoning:
          'At $\\theta_0 = \\pi/6$, the pendulum has a non-zero baseline torque $0.5\\,MgL$ and a shallower local slope $0.866\\,MgL$, illustrating why linearization always depends on $\\theta_0$.',
      },
    ],
    finalAnswer:
      'At $\\theta_0 = 0$: $T(t) \\approx M g L\\,\\theta(t)$ (within $5\\%$ over $\\pm 30^\\circ$). At $\\theta_0 = \\pi/6$: $\\Delta T \\approx 0.866\\,M g L\\,\\Delta\\theta$, or $T \\approx 0.5\\,MgL + 0.866\\,MgL(\\theta - \\pi/6)$.',
    recognizeCue:
      'Prof. Chan\'s Recommended Example 2.1: trigonometric nonlinearity ($\\sin\\theta$ or $\\cos\\theta$) linearized around an equilibrium angle.',
    shortcut:
      'Near $\\theta_0 = 0$, $\\sin\\theta \\approx \\theta$ and $\\cos\\theta \\approx 1$. Near any non-zero $\\theta_0$, slope uses $\\cos(\\theta_0)$.',
    commonMistakes: [
      'Plugging degrees into $T \\approx M g L \\theta$ instead of radians.',
      'Writing $\\sin(\\theta_0)$ for the slope instead of $\\cos(\\theta_0)$ when $\\theta_0 \\neq 0$.',
    ],
    memorize:
      '$T(\\theta) \\approx T(\\theta_0) + T\'(\\theta_0)(\\theta - \\theta_0)$, with $\\theta$ strictly in radians.',
  },

  {
    id: 'ex2-2',
    code: 'Ex2.2',
    title: 'Second-Order ODE with Non-Zero Initial Conditions',
    hw: 'Recommended',
    source: 'Dorf & Bishop Ex 2.2, p. 69 (Prof. Self-Study Tip)',
    problemType: 'C',
    typeLabel: 'Type C · Laplace ODE with Non-Zero ICs',
    difficulty: 3,
    priority: 'VERY HIGH',
    role: 'Prof Tip',
    originalStatement:
      'Consider a system represented by the differential equation\n$$\\frac{d^2 y(t)}{dt^2} + 4\\frac{dy(t)}{dt} + 3 y(t) = 2 r(t)$$\nwhere the initial conditions are $y(0) = 1$, $\\frac{dy}{dt}(0) = 0$, and $r(t) = 1$ for $t \\ge 0$. Find the complete time-domain response $y(t)$ and steady-state value.',
    bookAnswer: '$y(t) = \\frac{1}{2}e^{-t} - \\frac{1}{6}e^{-3t} + \\frac{2}{3}$',
    given: [
      'ODE: $\\ddot{y} + 4\\dot{y} + 3y = 2r(t)$',
      'Non-zero initial conditions: $y(0) = 1,\\; \\dot{y}(0) = 0$',
      'Unit step input: $r(t) = 1\\;(t \\ge 0) \\Rightarrow R(s) = \\frac{1}{s}$',
    ],
    find: [
      'Natural (zero-input) and forced (zero-state) transforms',
      'Complete time response $y(t)$ and steady-state value $\\lim_{t\\to\\infty} y(t)$',
    ],
    coreIntuition:
      'Think of this like pushing a ball that is ALREADY sitting at height $y(0) = 1$! Laplace transforms handle BOTH effects in one unified step: the initial energy $y(0) = 1$ launches a "natural response" ($Y_1$) that fades away, while the step input $2/s$ launches a "forced response" ($Y_2 + Y_3$) that carries the system to its final resting height $2/3$.',
    quickCheck: {
      question:
        'When transforming $\\ddot{y} + 4\\dot{y} + 3y = 2r(t)$ with $y(0) = 1$ and $\\dot{y}(0) = 0$, what numerator polynomial do the initial conditions contribute to $Y(s)$?',
      options: ['$s + 1$', '$s + 4$', '$s^2 + 4s$', '$4$'],
      correctIndex: 1,
      explanation:
        '$\\mathcal{L}\\{\\ddot{y}\\} = s^2 Y(s) - s(1) - 0$ contributes $+s$, and $\\mathcal{L}\\{4\\dot{y}\\} = 4sY(s) - 4(1)$ contributes $+4$. Moving both to the RHS gives $(s + 4)$!',
    },
    steps: [
      {
        title: 'Transform the ODE carrying all initial-condition terms',
        math: '$$\\left[s^2 Y(s) - s y(0) - \\dot{y}(0)\\right] + 4\\left[s Y(s) - y(0)\\right] + 3 Y(s) = \\frac{2}{s}$$',
        reasoning:
          'Never drop initial conditions when solving an ODE! Substituting $y(0) = 1$ and $\\dot{y}(0) = 0$ leaves $-s - 4$ on the left-hand side.',
      },
      {
        title: 'Separate natural response from forced response',
        math: '$$Y(s) = \\underbrace{\\frac{s + 4}{s^2 + 4s + 3}}_{Y_{\\text{natural}}(s)} + \\underbrace{\\frac{2}{s(s^2 + 4s + 3)}}_{Y_{\\text{forced}}(s)} = \\frac{s^2 + 4s + 2}{s(s + 1)(s + 3)}$$',
        reasoning:
          'Combining over the common denominator $s(s+1)(s+3)$ lets us do one clean partial fraction expansion instead of two separate ones (though keeping them split shows transient vs. steady-state clearly!).',
      },
      {
        title: 'Compute residues via cover-up and invert',
        math: '$$A = \\frac{2}{(1)(3)} = \\frac{2}{3}, \\quad B = \\frac{1 - 4 + 2}{(-1)(2)} = \\frac{1}{2}, \\quad C = \\frac{9 - 12 + 2}{(-3)(-2)} = -\\frac{1}{6} \\quad\\Rightarrow\\quad y(t) = \\frac{2}{3} + \\frac{1}{2}e^{-t} - \\frac{1}{6}e^{-3t}$$',
        reasoning:
          'In Dorf & Bishop\'s split notation: $Y_1(s) = \\frac{3/2}{s+1} - \\frac{1/2}{s+3}$ (natural) and $Y_2(s) + Y_3(s) = \\frac{-1}{s+1} + \\frac{1/3}{s+3} + \\frac{2/3}{s}$ (forced), which sum to the exact same $y(t)$.',
        tip: 'Run the 3-point check! $y(0) = \\frac{2}{3} + \\frac{1}{2} - \\frac{1}{6} = 1$ (matches!), $\\dot{y}(0) = -\\frac{1}{2} + \\frac{3}{6} = 0$ (matches!), $y(\\infty) = \\frac{2}{3}$ (matches FVT!).',
      },
    ],
    finalAnswer:
      '$y(t) = \\frac{2}{3} + \\frac{1}{2}e^{-t} - \\frac{1}{6}e^{-3t} \\; (t \\ge 0)$, and $\\lim_{t\\to\\infty} y(t) = \\frac{2}{3}$.',
    recognizeCue:
      'Prof. Chan\'s Recommended Example 2.2: 2nd-order ODE with explicit non-zero $y(0)$ or $\\dot{y}(0)$ and a step input.',
    shortcut:
      'Always combine $Y_{\\text{natural}} + Y_{\\text{forced}}$ over one denominator if you just need total $y(t)$, then verify $y(0)$ and $\\dot{y}(0)$ against the given ICs.',
    commonMistakes: [
      'Forgetting the $-4 y(0)$ term from $4\\mathcal{L}\\{\\dot{y}\\}$ (writing $s$ instead of $s+4$ in the IC numerator).',
      'Assuming $y(0) = 0$ out of habit when solving an ODE.',
    ],
    memorize:
      '$\\mathcal{L}\\{\\dot{y}\\} = sY(s) - y(0)$; $\\mathcal{L}\\{\\ddot{y}\\} = s^2 Y(s) - s y(0) - \\dot{y}(0)$.',
  },

  {
    id: 'ex2-5',
    code: 'Ex2.5',
    title: 'Field-Controlled DC Motor Transfer Function',
    hw: 'Recommended',
    source: 'Dorf & Bishop Ex 2.5, pp. 72–74 & Slides Ch. 2 pp. 37–44 (Prof. Self-Study Tip)',
    problemType: 'D',
    typeLabel: 'Type D · Electromechanical Derivation',
    difficulty: 4,
    priority: 'VERY HIGH',
    role: 'Prof Tip',
    originalStatement:
      'Derive the transfer functions $\\Omega(s)/V_f(s)$ (angular velocity) and $\\Theta(s)/V_f(s)$ (angular position) for a field-controlled DC motor with constant armature current $I_a$, field resistance $R_f$, field inductance $L_f$, motor torque constant $K_m$, rotor inertia $J$, viscous damping $b$, and disturbance torque $T_d(t)$. Explain why there is no back-EMF feedback loop.',
    bookAnswer: '$\\frac{\\Theta(s)}{V_f(s)} = \\frac{K_m}{s(L_f s + R_f)(J s + b)}$',
    given: [
      'Control input: field voltage $v_f(t)$ driving field circuit $(R_f, L_f)$',
      'Armature current $i_a(t) = I_a$ held strictly constant by an external current source',
      'Magnetic flux $\\phi(t) = K_f i_f(t)$, motor torque $T_m(t) = K_1 \\phi(t) I_a = K_m i_f(t)$',
      'Mechanical rotor inertia $J$, viscous friction $b$, load disturbance torque $T_d(t)$',
    ],
    find: [
      'Speed transfer function $\\Omega(s)/V_f(s)$ and position transfer function $\\Theta(s)/V_f(s)$ (with $T_d = 0$)',
      'Disturbance transfer functions for $T_d(s)$ and physical explanation of zero back-EMF feedback',
    ],
    coreIntuition:
      'Prof. Chan spent 8 consecutive slides on this motor for a reason! Unlike an armature-controlled motor—where spinning creates a back-EMF voltage that fights your input—here a stiff current regulator locks $I_a$ constant, and NO back-EMF is induced in the field winding. That turns the field-controlled DC motor into a pure open forward cascade: electrical lag $\\to$ torque gain $K_m$ $\\to$ mechanical lag $\\to$ free integrator $1/s$ to get angle $\\theta$!',
    quickCheck: {
      question:
        'Why is there NO back-EMF feedback loop in the field-controlled DC motor block diagram?',
      options: [
        'Back-EMF is induced in the armature, where $I_a$ is held constant by a current regulator, and no back-EMF is induced in the field winding.',
        'Because the motor does not rotate.',
        'Because field resistance $R_f$ is infinite.',
        'Because back-EMF cancels with the free integrator $1/s$.',
      ],
      correctIndex: 0,
      explanation:
        'With $I_a = \\text{const}$ forced by an external current source, armature back-EMF $K_b\\omega$ cannot change $I_a$, and the stator field winding sees zero back-EMF—leaving a pure forward cascade.',
    },
    steps: [
      {
        title: 'Write KVL for the electrical field circuit',
        math: '$$v_f(t) = R_f i_f(t) + L_f\\frac{di_f}{dt} \\quad\\Rightarrow\\quad I_f(s) = \\frac{1}{L_f s + R_f} V_f(s)$$',
        reasoning:
          'Field voltage drives field current through a simple $R_f$–$L_f$ first-order lag with electrical time constant $\\tau_f = L_f/R_f$.',
      },
      {
        title: 'Convert field current to electromagnetic torque',
        math: '$$T_m(t) = K_1 \\phi(t) I_a = (K_1 K_f I_a)\\,i_f(t) = K_m\\,i_f(t) \\quad\\Rightarrow\\quad T_m(s) = K_m I_f(s)$$',
        reasoning:
          'Because $I_a$ is constant and the iron core is unsaturated ($\\phi = K_f i_f$), the nonlinear product $\\phi \\cdot I_a$ becomes strictly linear in $i_f$ with motor constant $K_m = K_1 K_f I_a$.',
      },
      {
        title: 'Write Newton-Euler rotational balance and integrate speed to angle',
        math: '$$J\\dot{\\omega} + b\\omega = T_m(t) - T_d(t) \\;\\Rightarrow\\; \\Omega(s) = \\frac{1}{Js + b}\\left[T_m(s) - T_d(s)\\right], \\qquad \\Theta(s) = \\frac{1}{s}\\Omega(s)$$',
        reasoning:
          'Net torque accelerates inertia $J$ against viscous damping $b$ (time constant $\\tau_m = J/b$), and angle $\\theta$ is the integral of angular speed $\\omega$.',
      },
      {
        title: 'Multiply the cascaded blocks ($T_d = 0$)',
        math: '$$\\frac{\\Omega(s)}{V_f(s)} = \\frac{K_m}{(L_f s + R_f)(J s + b)}, \\qquad \\frac{\\Theta(s)}{V_f(s)} = \\frac{K_m}{s(L_f s + R_f)(J s + b)}$$',
        reasoning:
          'Notice the free integrator pole at $s = 0$ in $\\Theta(s)/V_f(s)$: a constant field voltage keeps the motor spinning at steady speed, so angle $\\theta(t)$ ramps up linearly! For disturbance torque at $V_f = 0$, $\\Theta(s)/T_d(s) = \\frac{-1}{s(Js+b)}$.',
      },
    ],
    finalAnswer:
      'Speed: $\\frac{\\Omega(s)}{V_f(s)} = \\frac{K_m}{(L_f s + R_f)(Js + b)}$. Position: $\\frac{\\Theta(s)}{V_f(s)} = \\frac{K_m}{s(L_f s + R_f)(Js + b)}$. No back-EMF loop exists because $I_a$ is held constant and no back-EMF is induced in the field winding.',
    recognizeCue:
      'Prof. Chan\'s Recommended Example 2.5 (8 lecture slides): "Derive the transfer function of a field-controlled DC motor" or contrast field vs. armature control.',
    shortcut:
      'Four-stage cascade: $\\frac{1}{L_f s + R_f} \\to K_m \\to \\frac{1}{Js + b} \\to \\frac{1}{s}$. Multiply all four blocks!',
    commonMistakes: [
      'Inserting a back-EMF feedback loop $K_b \\omega$ (that belongs ONLY to the armature-controlled motor!).',
      'Forgetting the free $1/s$ integrator pole when asked for position $\\Theta(s)$ instead of speed $\\Omega(s)$.',
      'Dropping the minus sign on the disturbance transfer function $-1/[s(Js+b)]$.',
    ],
    memorize:
      '$\\frac{\\Theta(s)}{V_f(s)} = \\frac{K_m}{s(L_f s + R_f)(Js + b)}$ — third order (poles at $0, -R_f/L_f, -b/J$), zero back-EMF feedback.',
  },

  {
    id: 'ex2-6',
    code: 'Ex2.6',
    title: 'Multiloop Block Diagram with Positive Inner Feedback',
    hw: 'Recommended',
    source: 'Dorf & Bishop Ex 2.6, pp. 78–79 (PDF p. 33) (Prof. Self-Study Tip)',
    problemType: 'E',
    typeLabel: 'Type E · Multiloop Positive Feedback',
    difficulty: 4,
    priority: 'VERY HIGH',
    role: 'Prof Tip',
    originalStatement:
      'Reduce the multiple-loop feedback control system of Figure 2.25: forward blocks $G_1(s), G_2(s), G_3(s), G_4(s)$ in series; inner loop feeds back from output $Y(s)$ through $H_1(s)$ with a PLUS ($+$) sign into the summer before $G_3(s)$; middle loop taps between $G_3(s)$ and $G_4(s)$ through $H_2(s)$ with a MINUS ($-$) sign into the summer before $G_2(s)$; outer loop feeds back from $Y(s)$ through $H_3(s)$ with a MINUS ($-$) sign into the input summer before $G_1(s)$. Find $T(s) = Y(s)/R(s)$.',
    bookAnswer: '$T(s) = \\frac{G_1 G_2 G_3 G_4}{1 - G_3 G_4 H_1 + G_2 G_3 H_2 + G_1 G_2 G_3 G_4 H_3}$',
    given: [
      'Forward cascade: $G_1 \\to G_2 \\to G_3 \\to G_4$ from $R(s)$ to $Y(s)$',
      'Inner loop ($H_1$ around $G_3 G_4$): POSITIVE feedback ($+$ at summer before $G_3$)',
      'Middle loop ($H_2$ tapping between $G_3$ and $G_4$): NEGATIVE feedback ($-$ at summer before $G_2$)',
      'Outer loop ($H_3$ from $Y$ to input summer): NEGATIVE feedback ($-$ at summer before $G_1$)',
    ],
    find: ['Closed-loop transfer function $T(s) = Y(s)/R(s)$'],
    coreIntuition:
      'Every student knows $G/(1 + GH)$ for negative feedback—and that automatic habit causes the #1 blunder on Example 2.6! Here the innermost loop $G_3 G_4 H_1$ enters its summer with a PLUS sign, making it POSITIVE feedback ($1 - G_3 G_4 H_1$). Also, the $H_2$ pickoff sits trapped inside the $H_1$ loop, so we either move the $H_2$ pickoff behind $G_4$ (dividing $H_2$ by $G_4$) or just use signal algebra and skip redrawing altogether!',
    quickCheck: {
      question:
        'Why does the term $G_3 G_4 H_1$ appear with a MINUS sign ($1 - G_3 G_4 H_1 + \\dots$) in the denominator of Example 2.6 while the other two loops have PLUS signs?',
      options: [
        'Because the $H_1$ loop enters its summing junction with a $+$ sign (positive feedback), flipping $1 + GH$ to $1 - GH$.',
        'Because $H_1$ taps before $G_4$.',
        'Because $G_3$ and $G_4$ are negative.',
        'Because Mason\'s rule always subtracts $H_1$.',
      ],
      correctIndex: 0,
      explanation:
        'In $1 - \\sum L_k$, negative feedback loops have $L_k < 0$ (producing $+|L_k|$ in the denominator), while the positive feedback loop $L_1 = +G_3 G_4 H_1$ produces $-G_3 G_4 H_1$!',
    },
    steps: [
      {
        title: 'Untangle overlapping loops (or write signal equations)',
        math: '$$\\text{Move } H_2 \\text{ pickoff behind } G_4 \\;\\Rightarrow\\; H_2\'(s) = \\frac{H_2(s)}{G_4(s)}$$',
        reasoning:
          'Moving the $H_2$ tap forward past $G_4$ requires dividing by $G_4$ so the signal entering $H_2$ stays identical ($Y \\cdot (H_2/G_4) = (G_4 V_3)(H_2/G_4) = H_2 V_3$). Now the inner loop $G_3 G_4 H_1$ is completely isolated!',
      },
      {
        title: 'Reduce the POSITIVE inner feedback loop ($H_1$)',
        math: '$$G_a(s) = \\frac{G_3 G_4}{1 - G_3 G_4 H_1}$$',
        reasoning:
          'Watch the sign! Because $H_1 Y$ enters the summer before $G_3$ with a PLUS sign, positive feedback gives $1 - G_3 G_4 H_1$ in the denominator.',
        tip: 'Verify by signal algebra: let $V_3 = Y/G_4$. Then $V_2 = G_1(R - H_3 Y) - (H_2/G_4)Y$, and $Y/G_4 = G_3(G_2 V_2 + H_1 Y)$!',
      },
      {
        title: 'Reduce the NEGATIVE middle loop ($H_2/G_4$)',
        math: '$$G_b(s) = \\frac{G_2 G_a}{1 + G_2 G_a (H_2/G_4)} = \\frac{G_2 G_3 G_4}{1 - G_3 G_4 H_1 + G_2 G_3 H_2}$$',
        reasoning:
          'Notice $G_4$ in $G_a$ cancels $G_4$ in $H_2/G_4$, leaving $+G_2 G_3 H_2$ in the denominator (positive sign because $H_2$ is negative feedback).',
      },
      {
        title: 'Close the NEGATIVE outer loop ($H_3$)',
        math: '$$T(s) = \\frac{G_1 G_b}{1 + G_1 G_b H_3} = \\frac{G_1 G_2 G_3 G_4}{1 - G_3 G_4 H_1 + G_2 G_3 H_2 + G_1 G_2 G_3 G_4 H_3}$$',
        reasoning:
          'Every loop here touches every other loop, so the denominator is simply $1 - (\\text{positive loop}) + (\\text{negative loops})$, and the numerator is the forward product $G_1 G_2 G_3 G_4$.',
      },
    ],
    finalAnswer:
      '$T(s) = \\frac{Y(s)}{R(s)} = \\frac{G_1 G_2 G_3 G_4}{1 - G_3 G_4 H_1 + G_2 G_3 H_2 + G_1 G_2 G_3 G_4 H_3}$.',
    recognizeCue:
      'Prof. Chan\'s Recommended Example 2.6: overlapping multiloop diagram where one inner summer has a $+$ feedback sign.',
    shortcut:
      'To move a pickoff point FORWARD past block $G$, insert $1/G$; to move it BACKWARD past $G$, insert $G$. Or skip moving blocks and write 3 node equations!',
    commonMistakes: [
      'Writing $1 + G_3 G_4 H_1$ instead of $1 - G_3 G_4 H_1$ on the positive inner feedback loop!',
      'Multiplying by $G_4$ instead of dividing by $G_4$ when moving the $H_2$ pickoff forward across $G_4$.',
    ],
    memorize:
      'Positive feedback $\\implies 1 - GH$. Negative feedback $\\implies 1 + GH$. Moving pickoff forward past $G$ $\\implies$ insert $1/G$.',
  },
];
