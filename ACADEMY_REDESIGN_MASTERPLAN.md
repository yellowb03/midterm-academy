# Midterm Academy: Comprehensive Redesign Masterplan

**Document type:** implementation specification; presentation, information architecture, interaction, pedagogy, accessibility, migration, and QA requirements.  
**Product name:** Midterm Academy  
**Course context:** F030100 · Automatic Control  
**Implementation baseline:** existing React 19, TypeScript, Vite, Tailwind CSS 4, KaTeX, and Phosphor React application.  
**Audience:** student studying control systems on desktop or mobile; occasional instructor or teaching assistant reviewing provenance and scope.  
**Decision status:** design direction is settled. Values labeled “candidate” are implementation-ready design values that may be tuned after inspecting the rendered implementation, while preserving the intent and contrast requirements.

---

## Contents

[Purpose](#1-purpose-and-design-outcome) | [Evidence and decisions](#2-audit-boundary-and-source-evidence) | [Principles](#3-product-principles) | [Visual system](#4-brand-and-visual-system) | [Routes](#5-information-architecture-and-routes) | [Home](#6-home-resume-curriculum-and-quiet-utilities) | [Bite-sized lessons](#7-learn-bite-sized-lesson-experience) | [Labs](#8-seven-interactive-labs-unified-frame-and-individual-requirements) | [Practice](#9-practice-problem-library-and-problem-study-page) | [Exam](#10-exam-practice-simulation-and-review) | [Reference](#11-reference-formulas-methods-scope-and-sources) | [Progress](#15-progress-local-persistence-and-migration) | [Implementation map](#17-file-by-file-implementation-map) | [Phases](#18-implementation-phases-and-dependencies) | [QA](#19-qa-plan-and-acceptance-criteria) | [Summary](#22-final-design-summary)

## 1. Purpose and design outcome

Redesign every part of the application’s visual language and learning experience so it reads as a serious, humane, well-organized engineering academy. The current source presents course material through a dark dashboard shell, dense card compositions, five tab labels, several large mixed-purpose pages, and seven technically rich interactive laboratories. The new product should retain the educational material and scientific tools while giving them a clear course structure and a calmer editorial presentation.

The experience should communicate three things immediately:

1. **This is a course of study.** A learner can orient themselves in the syllabus, enter a lesson, practice a method, sit a practice exam, and consult a reference.
2. **The material teaches reasoning.** Equations appear with their assumptions, definitions, and explanatory steps. The system invites the learner to attempt work before revealing solutions, while allowing help without penalty or artificial locking.
3. **The interface respects attention.** Typography, spacing, and clear section order do most of the work. Color identifies meaning; borders contain only objects that need containment. Navigation remains available without competing with the lesson.

The desired visual language is **warm paper and ink with a restrained forest accent**: a quiet ivory ground, dark readable text, thin warm-gray rules, one deep green action color, and semantic colors reserved for correctness, caution, and plots. Headings use a readable serif; interface and body text use a calm sans serif. No ornamental texture, grain, glass effects, gradients, ambient glows, marketing hero, decorative animation, or gratuitous iconography should be introduced.

The outcome is not a new brand or a course-content rewrite. Retain the name **Midterm Academy** and the course identity **Automatic Control**. Existing educational content, figures, formulas, lab models, and attribution remain traceable. Reorganizing where those items appear and changing how they are revealed is part of the redesign; replacing their meaning or asserting unsupported course facts is not.

### 1.1 Design outcomes

- A learner sees a brief “Continue” action and a scannable curriculum, not a dashboard of metrics.
- The primary navigation has five stable destinations: **Home, Learn, Practice, Exam, Reference**.
- Each page has one clear job and a dominant next action for the active task area. This is a compositional rule, not a ban on secondary controls or a claim that every screen must have exactly one button.
- Lessons teach in short, logical bites, one at a time by default. Each bite keeps the reasoning needed to understand its point together, with a previous/continue path and an outline for optional skipping. Learners can switch to a full-lesson review view. Bite count and order follow the actual topic; no fixed nine-beat template is imposed.
- The default lesson view presents one bite at a time in a calm, readable layout; a learner may choose a full-lesson review view at any time. Focus mode is optional and never hides reasoning needed to understand the current bite.
- Practice provides the problem statement before answer material. The first view does not expose a supplied book answer before the learner has had a chance to work.
- The learner can distinguish **lesson completion**, **self-reported confidence**, and **assessed performance**. These concepts are not combined into one readiness percentage.
- The exam interface clearly labels the existing 90-minute timer as a simulation setting, not a verified official exam duration.
- Course-scope uncertainty is prominent and neutrally stated. Chapters 4–6 are not represented as confirmed exam content.
- Desktop and mobile layouts remain legible, functional, and accessible; controls do not depend on hover, color, or precise dragging.

### 1.2 Out of scope for a presentation redesign

The following require a separately approved content or feature decision. The redesign may define how they would appear, but must not silently claim they already exist or add unsupported material:

- New lessons, problem solutions, exam questions, grading claims, course scope, official exam timing, or instructor statements.
- User accounts, cloud synchronization, teacher dashboards, shared classrooms, analytics, or server storage.
- Adaptive recommendations or a computed “mastery” model.
- New mathematical models or alternate numerical outputs for any lab.
- New course references or citations not present in the source material.

---

## 2. Audit boundary and source evidence

This plan is grounded in static inspection of files in the checkout. It is not a report of a live application walkthrough. No screenshot comparison, browser interaction, viewport measurement, accessibility audit, or runtime performance profile is claimed here. The existing `REDESIGN.md` contains specific screenshot dimensions and rendered page-height statements; this plan does not adopt those as confirmed findings because that evidence is not established in the current source audit.

Source-backed inventory can be used to plan implementation. Visual statements such as “crowded,” “clips,” or “looks like a dashboard” are design interpretations of markup, CSS, and component composition, not verified observations of a running build. Before final acceptance, implementers must inspect the rebuilt application at desktop and mobile sizes and document actual results.

| Evidence source | What static inspection establishes | What it does not establish |
|---|---|---|
| `package.json` | React 19, TypeScript build, Vite 8, Tailwind CSS 4 plugin, KaTeX, Phosphor React; scripts are `dev`, `build`, and `preview`. | Deployed hosting configuration, compatibility on every browser, or runtime performance. |
| `src/App.tsx` | The current app switches among five page components using React state; progress is read and written to local storage under `control-studio-progress-v1`; lessons, problems, and checked study blocks are the saved arrays. | That progress storage has been exercised in a browser, survives every failure mode, or represents mastery. |
| `src/components/TopNav.tsx` | Five current tabs are labeled Roadmap, Visual Theory, 24 Solved Problems, Practice Midterm, and Cheat Sheet & Traps; the nav computes a percentage by adding completed lessons and mastered problems as equal items. | Any validity of that percentage as academic readiness. The arithmetic itself demonstrates why it should be removed. |
| `src/pages/OverviewPage.tsx` | Home currently combines a promotional intro, completion counts, scope note, seven-lesson grid, recognition flowchart, plans, and scope/evidence table. | The rendered height, actual visual crowding, or usability. |
| `src/pages/TheoryStudioPage.tsx`, `src/data/theoryLessons.ts` | The theory page displays lesson content, a lab, sections, worked walkthrough, concept checks, tips/traps, and related problems. Lesson data includes seven records and lab IDs. | Correctness of every pedagogical claim or math result. These require subject review. |
| `src/pages/ProblemBankPage.tsx`, `src/components/ProblemStepViewer.tsx`, `src/data/homeworkProblems.ts` | Search and filters, a problem selector, statement, optional figure, given/find data, quick check, staged steps, final answer, cues, pitfalls, and answer-related fields exist. The page has 24 problem records as described by its heading and data inventory. | Exact visual layout on screen, or that every source answer and solution has been independently checked. |
| `src/pages/PracticeExamPage.tsx`, `src/data/practiceExam.ts` | The practice exam has seven question records, point and rubric data, notes, per-part reveal and score controls, and a 90-minute timer initialized in component state. | Whether 90 minutes is official, whether timer operation is robust after tab suspension, or whether notes/scores persist. |
| `src/pages/CheatSheetPage.tsx`, `src/data/curriculum.ts` | Reference material includes transform pairs, block rules, traps, sanity gates, notation, Ch. 4–6 contingency material, and a TA inquiry text. | Current official scope or that the contingency formulas are appropriate for the actual exam. |
| `src/components/RecognitionFlowchart.tsx` | An interactive classifier/recognition flow exists with symptom selection, branches, cues, formulas, lesson IDs, and example problem IDs. | The correctness or completeness of every decision branch. |
| `src/components/InteractiveLabs/*.tsx` | Seven distinct simulations and their controls/presets can be identified in source. They are part of the learning product and must be individually retained and reviewed. | Their behavior, visual output, responsiveness, numerical accuracy, or keyboard accessibility without runtime QA. |
| `src/index.css` and component markup | Dark color-scheme variables, system sans-serif, dark canvas/surface colors, cyan slider accent, and globally smooth scrolling are declared. | The perceived visual quality or contrast of every rendered combination. |

### 2.1 Existing redesign document: use and corrections

`REDESIGN.md` is a substantial prior design draft and useful feature inventory. Preserve its useful structural ideas where they remain compatible with this plan: clear routes, a course home, focused lesson and problem contexts, separate exam review, a readable reference, student-controlled answer reveal, and a phased implementation. It should not be treated as proof that a runtime defect has occurred.

This masterplan explicitly corrects or supersedes these decisions in that draft:

| Prior draft direction | Masterplan decision | Reason |
|---|---|---|
| “Closed Loop” as a new product identity and course identity emphasis. | Retain **Midterm Academy / Automatic Control**. | The task is a redesign, not a rebrand. |
| Claims based on screenshots at 1440×900 and 390×844, and a lesson height around 5,500px / home around 4,100px. | Do not repeat these as verified facts. | This document only records the current source audit; the prior claims need reproducible render evidence. |
| “One idea per screen,” “one primary action,” and one level of container nesting as absolute laws. | Use one dominant task action and one clear content hierarchy; allow secondary actions and nested objects when their semantics require them. | A rigid rule would force unnecessary pagination and can harm complex engineering explanations. |
| Required nine-beat lesson sequence and lesson-step URL segments. | Use a short, logical bite sequence with one bite visible by default, optional full-lesson review, and proposed bite metadata tied to existing lesson content. | Lesson bite count and teaching order must fit the subject; fixed beats can fragment explanations or imply unsupported content. |
| Must reveal each step only after the learner acts, “never dumps” content. | Attempt-before-answer is the default design. Provide visible optional hints and answer reveal without a forced lock. | Learners need agency and may be reviewing, checking, or using assistive technology. |
| Default dark “Night” theme as an optional system-level alternative and large plotted color set. | Warm light paper is the sole specified default direction. Dark theme is not required in this redesign phase; assess later if requested. | A second theme doubles token and contrast QA and has not been requested. Plots get a limited, purpose-labeled palette. |
| A global progress ring/account area. | No combined readiness percentage or ring. Present separate descriptive states only where useful. | Lesson completion, self-report, and scored performance have different meanings and scales. |
| Global navigation removed in lesson focus mode and exam mode treated as exclusive. | Keep wayfinding available through a compact, task-appropriate shell. Focus mode may reduce visual distractions, but navigation remains accessible. Exam mode may isolate active work while preserving clear exit/resume behavior. | Prevents disorientation and accidental lock-in. |
| Treat `#/reference#laplace-pairs` style URLs and page-by-page flow as required. | Use stable routes and section fragments. Exact routing implementation may use the existing Vite setup; use ordinary URL semantics and browser history. | Avoid the ambiguous double-fragment pattern and decouple information architecture from implementation detail. |
| Convert exam into a timed practice flow as if duration were established. | Label 90 minutes as a configurable simulation default only; no official duration claim. | Source timer default is not evidence of official exam timing. |
| Course scope wording implying Chapters 1–3 + HW1–4 are the exam. | Preserve provenance, uncertainty labels, and explicit caveat. | Released material and planned syllabus can disagree; the app must not resolve that uncertainty by assertion. |

---

## 3. Product principles

The principles below guide judgment, rather than prescribing a rigid template.

### 3.1 Quiet hierarchy

Use headings, short introductory copy, spacing, and rules to organize information. Use filled panels only for interactive objects, notices, answer feedback, or a figure that benefits from a bounded surface. Do not place every paragraph in a card. Avoid nested cards; a lab can be one contained interactive object inside a lesson, but its controls, graph, and explanation should not each be another card in the card.

### 3.2 Learning before scoring

The product presents explanation and meaningful practice before completion counts. Completion means “I finished this lesson,” not “I mastered it.” A self-rating means the learner’s own confidence. A rubric score means the learner evaluated work against listed criteria. A correct concept-check response means performance on that check only. Keep these states separately named and separately stored if implementation adds persistence.

### 3.3 Explain assumptions and symbols

For each derived equation, explain the model and the conditions that make the equation valid. State sign convention, coordinate definitions, input/output, units where known, and initial conditions where relevant. Avoid dropping directly from a verbal prompt to a formula. When multiple conventions exist, identify the convention used in the cited source and explain translation where supported.

### 3.4 Respect the learner’s pace

Let a learner scroll through an explanation, jump to a section, replay a lab, reveal a hint, or open the solution. There is no punishment for asking for help. The default ordering of controls should encourage a first attempt, but the content remains available.

### 3.5 One meaningful accent

Forest green identifies primary action, active navigation, and non-evaluative focus states. It must not also mean “correct.” Correctness is reserved for a deeper green semantic token with a text label and icon; caution and error each receive their own text and icon. Avoid tinting headings according to topic.

### 3.6 Provenance without false certainty

Show where a claim or problem came from in a consistent, quiet source line. Preserve textbook exercise codes, homework assignment labels, figure attribution and course slide references already present. Clearly label status such as confirmed, strong inference, or speculation wherever it exists. Never upgrade an inference into a fact as part of copyediting.

### 3.7 Content fidelity precedes polish

Visual redesign is not permission to simplify away derivation steps, change a formula, remove a diagram, alter a lab model, or trim an exception. Preserve the current source content, then make its structure easier to understand. Any discovered discrepancy goes into a content QA issue and is corrected only against authoritative source material.

---

## 4. Brand and visual system

### 4.1 Brand language

Use “Midterm Academy” as the primary wordmark, with “Automatic Control” as the course subtitle. A small course code, if present, is supporting information and should use the exact existing source spelling: `F030100`. Do not invent an emblem or imply official university endorsement. A small monogram “MA” is unnecessary unless a concrete header layout requires it. Use plain Phosphor icons only for action or orientation, at consistent stroke weight; never add icons to every heading by default.

Copy voice is direct, specific, and respectful. Prefer “Try the sign check” over “Master the fatal feedback trap.” Avoid fear-based labels such as “fatal,” “emergency,” and “zero credit” unless these are direct, evidenced assessment language and essential context. Replace promotional phrasing (“master every step,” “all you need,” “exam hack”) with explanatory copy. Do not claim a lesson is guaranteed to match a future exam.

### 4.2 Color tokens

These are candidate values for the initial paper theme. Define each once as CSS custom properties and consume tokens throughout; no component-specific raw hex palette. Validate all foreground/background pairs against WCAG 2.2 AA in implementation. For normal text use at least 4.5:1 contrast; for large text and non-text control boundaries use at least 3:1. Do not rely on the color values alone to communicate state.

| Token | Candidate value | Role |
|---|---:|---|
| `--paper` | `#F7F6F1` | App canvas, warm neutral, not a faux-paper texture. |
| `--surface` | `#FFFFFF` | Main content surface for a figure or interactive object. Keep use sparse. |
| `--surface-muted` | `#F0EEE7` | Inputs, code-like readouts, quiet inset areas, and subtle alternate table rows. |
| `--ink` | `#20231F` | Main headings and body text. |
| `--ink-secondary` | `#50574F` | Secondary explanatory text; verify contrast before use at small sizes. |
| `--ink-muted` | `#62685F` | Captions and metadata, only when contrast remains sufficient. |
| `--forest` | `#285B45` | Primary action, active nav indicator, links in non-evaluative contexts. |
| `--forest-hover` | `#1E4937` | Hover/pressed primary action. |
| `--forest-tint` | `#E5EEE8` | Light selected/active background. |
| `--rule` | `#D9D8CF` | Quiet section rules. |
| `--rule-strong` | `#9AA096` | Input outline, table boundaries, focus-ring base if appropriate. |
| `--success-ink` | `#246341` | Correct feedback, always paired with “Correct” or explanatory text. |
| `--success-bg` | `#E5F1E8` | Correct response background. |
| `--caution-ink` | `#7A4B0A` | Scope caveat, caution, assumption note. |
| `--caution-bg` | `#F5EDDB` | Caution background. |
| `--error-ink` | `#8B3030` | Incorrect response or error message. |
| `--error-bg` | `#F7E8E6` | Error background. |
| `--focus-ring` | `#1C6B9A` | Visible keyboard focus, separate from semantic status. |
| `--plot-1` | `#285B45` | Primary signal or response. |
| `--plot-2` | `#456F9B` | Comparator, input or secondary response. |
| `--plot-3` | `#B26B24` | Disturbance or highlighted perturbation. |
| `--plot-reference` | `#6E756B` | Baseline, asymptote or reference line. |

Plot traces require distinct dash patterns or markers in addition to color, and a legend with series names. Do not map “input” to blue and “output” to amber globally if the source diagram or control meaning needs another mapping. Every lab’s legend must make meanings explicit.

### 4.3 Typography

Use **Source Sans 3** for body and interface text and **Source Serif 4** for editorial headings. These are the intentional design choices; implementation should self-host the licensed font files after verifying license and bundle impact, with system-compatible fallbacks so the page remains usable before fonts load. Do not substitute generic Inter/system defaults as the chosen visual direction.

- Body and UI: Source Sans 3; lesson body 20px/1.55 on desktop and 18px/1.5 on mobile. Supporting UI may be smaller but should remain comfortably readable.
- Headings: Source Serif 4, with clear size and weight hierarchy. Page title 40px desktop and 32px mobile; section title 27px/1.25; subsection title 20px/1.35.
- Captions and metadata: 14px minimum where practical; never use low-contrast small text for essential conditions or source context.
- Lesson bites: body copy is typically 60-120 words and has a soft maximum of 160 words, excluding a clearly optional detail disclosure. The count is a design guide, not permission to remove required reasoning.
- Equations remain rendered with KaTeX. Do not apply uppercase transforms, letter spacing, or a different color to math tokens. Numeric values, times, matrices, and labels use tabular numerals where alignment matters.
- Limit body copy line length to 65-72 characters. Use sentence case for headings and navigation. Eyebrow labels are optional and rare; avoid all-caps as default.

### 4.4 Space, shape, and content width

Use a 4px spacing base with a deliberately small set of common values: 4, 8, 12, 16, 24, 32, 40, 48, 64, and 80px. Use 1px rules. Standard controls should be at least 44px high on touch. Body text width: 68ch target, 74ch maximum. Main course home width: 1000–1120px. Lesson reading column: 720–800px. Lab visual region: may use 1100–1200px inside its focused section. Practice may use a 320px library pane plus 700px detail pane at wide screens, with a stacked flow below the responsive threshold.

Use square or lightly rounded geometry. Candidate radii: 4px for inputs, 6px for small panels, 8px for a figure/lab frame, and no pill radius except status chips with a genuine status. Shadows are not a structural separator; use a rule or surface difference first. Avoid multiple nested shadows.

### 4.5 Motion and texture

No decorative motion, grain, glass, gradient, glows, parallax, animated page entrances, or perpetual movement. Use immediate state changes or a short opacity transition (100–160ms) only when it improves feedback. Honor `prefers-reduced-motion`; the product is fully usable with animation disabled. Remove global smooth scrolling as a required behavior; route changes and focus movement must not animate the learner unexpectedly. Lab playback is functional simulation, not decoration, and needs an explicit play/pause control plus a reduced-motion-safe representation.

---

## 5. Information architecture and routes

### 5.1 Primary navigation

The global shell presents five text-first destinations:

| Label | Purpose | Existing content |
|---|---|---|
| Home | Resume study and browse curriculum. | Overview, lesson list, scope note, and links to supporting tools. |
| Learn | Open a lesson and follow its explanation. | Seven theory lessons and associated interactive labs. |
| Practice | Search, filter, and solve homework problems. | All existing problem records, figures, steps, source answers, checks, and cues. |
| Exam | Understand and use the practice exam. | Existing seven-question mock, timer, rubric, score controls, and review. |
| Reference | Look up formulas, notation, pitfalls, sanity checks, and scope evidence. | Existing Cheat Sheet & Traps material and course evidence. |

The labels remain visible on desktop. The mobile navigation can use a bottom bar or a compact horizontal menu, but all five labels must remain visible or available without relying on icon recognition. Do not put a readiness percentage, progress ring, rank, or “streak” in the nav. A small settings affordance is optional; do not create settings that have no functional purpose.

### 5.2 Secondary study tools

Keep **Study plan** and **Problem classifier** discoverable from Home and relevant contexts. They are secondary tools, not primary global destinations. A study plan helps a learner choose a time-bounded sequence; it must not claim the selected plan guarantees readiness. The classifier helps identify a problem type; it should state that its output is a study aid and preserve the current branches and links. Course source/scope information sits in Reference under “Course and scope,” not in an alarming home dashboard.

### 5.3 URL and history behavior

Use stable, bookmarkable paths or hash routes that work in the existing hosting setup. Preferred conceptual paths are `/`, `/learn/:lessonId` (with an optional stable bite fragment/query only if implemented), `/practice`, `/practice/:problemId`, `/exam`, `/exam/review`, `/reference`, `/reference/:section`, `/study-plan`, and `/classifier`. If hash routing is selected for static-host compatibility, preserve the same unambiguous path semantics after `#`; do not use a second hash delimiter for an in-page section.

Requirements:

- Back and forward navigate between meaningful page and selected item states.
- Reload returns to the same selected lesson/problem/reference section where possible.
- Invalid IDs receive a clear not-found state and safe route back to the list.
- Route changes place keyboard/screen-reader focus at the page title and set an accurate document title. Within Learn, Previous/Continue and outline jumps focus the selected bite heading; changing bites never requires answering a check.
- In-page section links have stable IDs and preserve native browser behavior.
- Preserve a return path from detail views to their originating list and filters when feasible.

### 5.4 Global shell

**Desktop header:** left-aligned brand; center/left text navigation; right quiet utility area for locally saved progress status only if it conveys a distinct, plain fact such as “3 lessons marked complete.” Avoid aggregate percentages. Header should remain compact and not consume excessive vertical space. Active location uses text weight and a short underline or light tint, not a large colorful pill.

**Mobile header:** brand and current page identity at top. Use either a clearly labeled bottom navigation with safe-area padding or a menu button that reveals all five text destinations. If bottom navigation is used, ensure it does not cover content, keyboard, or focused controls. At least 44px target size.

**Footer:** “Midterm Academy · Automatic Control” and a short local-storage statement only if accurate for the build. Course source/limitations link to Reference. Do not claim “verified” as a blanket statement unless each listed source is actually audited and described. Remove mojibake and normalize punctuation/encoding.

---

## 6. Home: resume, curriculum, and quiet utilities

### 6.1 Purpose and content order

Home is a student’s course landing page, not a marketing page or analytics dashboard. It begins with the course identity and the most useful next step, then exposes the learning sequence.

1. **Heading:** “Automatic Control” with “Midterm Academy” brand context. A short factual subheading: “Lessons, worked problems, a practice exam, and reference material for this course.” Avoid promises of guaranteed exam coverage.
2. **Continue learning:** show only when there is an identifiable last-visited lesson or selected problem. Include lesson title, section/position if reliably stored, and a clear “Continue” link. For no prior activity, present “Start with the first lesson” or “Browse lessons.” Do not invent resume progress if the data model cannot identify it.
3. **Curriculum list:** seven rows, each with chapter or section label, title, one-line learning focus based on existing content, and a neutral state such as “Not started,” “In progress,” or “Marked complete” only where the underlying state supports it. A row is a full-width link/button with a clear hit target. No multi-column lesson card grid.
4. **Study tools:** a plain, short row of links to Practice, Exam, Reference, classifier, and Study plan. Keep the primary study path visually dominant.
5. **Scope note:** compact, always visible note that distinguishes confirmed released materials from unresolved exam coverage. Link to the evidence table. Avoid a dismissible alert that could make uncertainty disappear permanently.

### 6.2 Text wireframe: desktop

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Midterm Academy      Home   Learn   Practice   Exam   Reference          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ Automatic Control                                                       │
│ Course materials for F030100                                             │
│ Lessons, worked problems, an exam simulation, and a course reference.    │
│                                                                          │
│ Continue learning                                                        │
│ [Chapter 2 · Laplace response]                            [Continue →]   │
│                                                                          │
│ Course sequence                                                         │
│ 01  Feedback principles and sensitivity                 In progress →    │
│ 02  Linearization around an operating point             Not started →    │
│ 03  Laplace response and the final value theorem         Not started →    │
│ 04  Physical models and the field-controlled motor       Not started →    │
│ 05  Block diagrams and transfer functions               Not started →    │
│ 06  State-space realization                              Not started →    │
│ 07  State transition and system response                 Not started →    │
│                                                                          │
│ Study tools                                                              │
│ Practice problems · Practice exam · Reference · Classifier · Study plan  │
│                                                                          │
│ Course scope note                                                        │
│ Released materials cover Chapters 1–3 and HW 1–4. Planned schedule and   │
│ released materials do not fully settle exam coverage for Chapters 4–6.  │
│ Review the evidence and confirm with the course staff. [Scope details]   │
└──────────────────────────────────────────────────────────────────────────┘
```

The example row labels are descriptive mappings to existing lesson content, not new claims about official syllabus sequencing. Confirm lesson order and exact display titles against `theoryLessons.ts` before implementation.

### 6.3 Text wireframe: mobile

```text
┌───────────────────────────────┐
│ Midterm Academy               │
│ Home                          │
├───────────────────────────────┤
│ Automatic Control             │
│ Course materials for F030100  │
│                               │
│ Continue learning             │
│ Chapter 2 · Laplace response  │
│ [Continue]                    │
│                               │
│ Course sequence               │
│ 01 Feedback principles      → │
│    In progress                │
│ 02 Linearization            → │
│    Not started                │
│ ...                           │
│                               │
│ Study tools                   │
│ Practice · Exam · Reference   │
│ Classifier · Study plan       │
│                               │
│ Course scope note             │
│ Chapters 4–6 coverage is not  │
│ settled by released files.    │
│ [Read the evidence]           │
├───────────────────────────────┤
│ Home Learn Practice Exam Ref  │
└───────────────────────────────┘
```

### 6.4 Home states and behavior

- **First visit:** omit “Continue” and show “Start learning” pointing to the first lesson. State that progress is stored in the current browser only if local storage is functioning as designed; handle unavailable storage gracefully.
- **Returning visit:** show the last-visited item only after that state is deliberately implemented. A selected lesson alone may be enough to resume the lesson at its top; do not imply a remembered paragraph location unless stored.
- **Storage unavailable/corrupt:** show no false completion; provide a neutral explanation only if the user attempts to save or if progress is otherwise visible.
- **All lessons marked complete:** retain completion as self-marked; do not label the learner “ready.” Offer Practice and Exam as possible next activities without saying they are required.
- **No course source confirmation:** keep the scope note visible; use direct wording and do not bury caveat in a footer.

---

## 7. Learn: bite-sized lesson experience

### 7.1 One complete bite at a time

The default lesson view presents one short, logical bite at a time. A bite is a coherent explanation, not a sentence fragment or forced interaction. Keep the reasoning needed for its point together: define quantities and assumptions, show the relevant equation or visual, explain the transition, and state what the result means. Core reasoning is visible by default; optional details may add context but must not repair an incomplete explanation.

Each bite centers on one learning point and one main equation, diagram, plot, or worked move. A supporting expression is fine when it completes the same reasoning. Prose is typically 60-120 words with a soft maximum of 160, excluding a clearly optional detail disclosure. This is a design guide, not a reason to omit a definition, sign, initial condition, assumption, intermediate operation, or sanity check. A necessary derivation may exceed the guideline; keep it complete and split only at a natural reasoning boundary.

Bite count is flexible. Create as many as the topic needs, with no minimum quota or fixed nine-step template. Order bites by conceptual dependency. A source section may become one bite or several. A lab, figure, or check may appear beside the bite it supports or immediately after the needed context.

The source `theoryLessons.ts` currently stores lesson-level sections, workedWalkthrough steps, conceptChecks, tipsAndTraps, and lab associations. The storyboards below are proposed editorial mappings, not existing metadata or new technical content. Implementation may add reviewed presentation metadata to map source material into bites, while preserving lesson IDs and all source reasoning. Every proposed bite must map to source fields and receive math review.

### 7.2 Navigation and full-lesson review

The default view has Previous and Continue controls plus a visible outline whose headings can be selected to skip forward or back. These are navigation controls, not correctness gates: no bite requires an answer, scroll depth, or completion state before continuing. A clear toggle switches between One bite at a time and Full lesson review. Review presents all bites in order with the same headings and content hierarchy.

Keep the selected bite when toggling views. On wide screens, use a compact outline rail; on narrow screens, place an On this lesson disclosure near the title. Navigation by button or outline returns focus to the selected bite heading. Keep the route back to Learn/Home accessible. Focus mode may reduce shell distractions but must remain reversible and must not hide equation context.

Use a stable lesson route such as `/learn/:lessonId`. Add a stable bite fragment or query only if useful for reload/bookmark behavior. Browser Back/Forward must remain predictable. Persist last-bite position only if stable IDs and migration behavior are implemented; otherwise open at the first bite without implying remembered position. Lesson completion is a separate self-marked action.

### 7.3 Desktop wireframe

```text
Header: Midterm Academy | Home | Learn | Practice | Exam | Reference
Lesson: Learn / Chapter 2 / Linearization
Title: Linearization: zooming in until curves look straight
Controls: [Lesson outline] [Full lesson review] [Focus reading]
Outline: Overview; Choose a point; Local slope; Deviation variables;
         Pendulum example; Check the result; Lab; Wrap-up
Current bite: Bite 3 of 8 - Local slope
Heading: Tangent slope at the operating point
Body: Near x0, the curve is approximated by its tangent. The local
      gain is the derivative at x0. This is a local model; it does not
      make the original curve linear everywhere.
Equation: Delta y approximately f'(x0) times Delta x
Definitions: Delta x is change from x0; Delta y is output change.
[Optional Taylor detail]
[Previous]                                                [Continue]
Related lab/check appears when its context has been established.
```

### 7.4 Mobile wireframe

```text
Midterm Academy | Learn
Learn / Chapter 2
Linearization
[On this lesson] [One bite at a time] [Full review]
Bite 3 of 8 - Local slope
Tangent slope at the point
Near x0, the curve is locally approximated by its tangent.
Equation: Delta y approximately f'(x0) times Delta x
Define Delta x and Delta y beside the equation.
[Optional Taylor detail]
[Previous] [Continue]
Lab or check when this bite needs it.
Home | Learn | Practice | Exam | Reference
```

Controls wrap or stack at 320px. A wide equation may scroll within its own labeled region; the page itself must not scroll horizontally. Toggling review preserves the selected position.

### 7.5 Proposed source-mapped storyboards

These are flexible draft bite titles and learner actions, mapped to existing `sections`, `workedWalkthrough`, `conceptChecks`, `tipsAndTraps`, and lab associations. Confirm exact source fields and math before implementation. No learner action gates navigation.

#### `ch1-feedback` - Feedback Control & Why Sensitivity Drops

1. **Open and closed loop** - `sections`: compare forward path and measured-output feedback. Learner traces reference, output, and returned measurement.
2. **Name the signals** - `sections`, `intuitionHook`: define reference, measured output, error, disturbance, and sensor noise. Learner locates each signal.
3. **Close the loop algebraically** - `sections`: derive the relation using the source sign convention. Learner follows the signal equation to the transfer ratio.
4. **Sensitivity to plant change** - `sections`, `mentalModel`: introduce loop gain and S_G^T with assumptions. Learner compares high/low loop gain.
5. **Disturbance rejection** - workedWalkthrough "Turntable Speed Control: Quantifying Sensitivity & Disturbance Rejection", disturbance step. Learner distinguishes load disturbance from reference change.
6. **Sensor-noise cost** - same workedWalkthrough, sensor-noise step. Learner predicts the effect of measurement noise.
7. **Stability caveat and recap** - `sections`, `tipsAndTraps`, `conceptChecks`, Feedback lab. Learner explains why feedback benefit does not guarantee stability.

#### `ch2-linearization` - Linearization: Zooming In Until Curves Look Straight

1. **Why a local model?** - `intuitionHook`, `mentalModel`, `sections`: connect nonlinearity to approximation near an operating point. Learner identifies the point.
2. **First-order Taylor expansion** - `sections`: show retained derivative term and omitted higher-order behavior. Learner locates local slope.
3. **Perturbation versus absolute value** - `sections`: distinguish Delta x/Delta y from x/y. Learner labels baseline and deviation quantities.
4. **Differentiate the torque law** - workedWalkthrough "Pendulum Restoring Torque Linearization", symbolic derivative step. Learner identifies what is differentiated before substitution.
5. **Evaluate at zero** - workedWalkthrough theta0=0 and model statement. Learner checks small-angle result and units/sign.
6. **Evaluate at pi/6** - workedWalkthrough second operating point and absolute/deviation form. Learner compares local slopes.
7. **Check the approximation range** - `tipsAndTraps`, `conceptChecks`, Linearization lab. Learner moves the point and observes curve/tangent separation.

#### `ch2-laplace` - The Laplace Lens, Partial Fractions & FVT

1. **What the transform changes** - `sections`: connect the time-domain differential equation to an expression in s under the stated convention.
2. **Initial conditions enter** - workedWalkthrough "2nd-Order ODE with Non-Zero Initial Conditions", term-by-term transform. Learner identifies initial-value terms.
3. **Separate response sources** - `sections`, checks: distinguish zero-input and zero-state response. Learner classifies a term by source.
4. **Collect Y(s)** - workedWalkthrough grouping step. Learner checks the common denominator.
5. **Find residues** - workedWalkthrough Heaviside cover-up. Learner chooses evaluation points; preserve repeated/complex-pole conditions where present.
6. **Invert and sanity-check** - workedWalkthrough inversion and three-point check. Learner checks initial value, long-time behavior, and units as applicable.
7. **Gate the final value theorem** - `sections`, `tipsAndTraps`, `conceptChecks`, Laplace lab. Learner inspects poles before using FVT.

#### `ch2-physical-motor` - Physical Modeling & The Field-Controlled DC Motor

1. **Choose across/through variables** - `sections`: define electrical/mechanical variables and signs. Learner matches effort/flow quantities.
2. **Draw the relative-motion FBD** - workedWalkthrough "Base-Excited Positioning Carriage", FBD step. Learner marks motion and forces.
3. **Write force balance** - workedWalkthrough Newton-law step. Learner identifies relative displacement/velocity terms.
4. **Transform the mechanical model** - workedWalkthrough Laplace/transfer-function step. Learner checks zero-initial-condition assumptions.
5. **Run physical limits** - workedWalkthrough DC/high-frequency checks. Learner predicts limits.
6. **Build the motor electrical relation** - `sections`: field-controlled model and stated KVL/KCL/back-EMF assumptions. Learner traces voltage to field flux.
7. **Connect torque and motion** - `sections`, MotorPhysicsLab. Learner traces electrical/mechanical coupling and changes one parameter.
8. **Compare disturbance cases** - `tipsAndTraps`, `conceptChecks`, workedWalkthrough. Learner distinguishes model response from an unsupported assumption.

#### `ch2-block-diagrams` - Block Diagram Algebra & Positive Feedback Sign Flips

1. **Read the diagram as signal equations** - `sections`: label summers, pickoffs, blocks, and directions.
2. **Reduce a single loop** - `sections`: derive G/(1 +/- GH) using the displayed sign convention. Learner traces the feedback sign.
3. **Move a pickoff or summer** - `sections`: state the movement rule and compensation factor. Learner predicts the required change.
4. **Set up a multiloop system** - workedWalkthrough "Multiloop Reduction via Signal Equations", intermediate-signal step. Learner names the signal between G1 and G2.
5. **Write and substitute equations** - workedWalkthrough summer-equation steps. Learner preserves positive-feedback signs.
6. **Solve and verify** - workedWalkthrough denominator/transfer-ratio step, tips, checks. Learner compares algebraic methods.
7. **Explore sign flips** - BlockDiagramLab and checks. Learner switches loop sign and observes denominator change.

#### `ch3-state-space` - Inside the Black Box: State Variables & Companion Form

1. **What counts as a state?** - `sections`: connect stored energy/initial conditions to a minimal state description. Learner identifies independent states.
2. **Choose phase variables** - workedWalkthrough "3rd-Order Transfer Function to Companion Form", integrator-state step. Learner follows source state order.
3. **Normalize the denominator** - workedWalkthrough monic-division step. Learner checks each coefficient.
4. **Build state equations** - `sections`, workedWalkthrough: assemble A and B for the chosen order. Learner checks dimensions and placement.
5. **Build the output equation** - workedWalkthrough numerator step. Learner traces coefficients into C and direct term D.
6. **Check transfer equivalence** - workedWalkthrough matrix assembly and checks. Learner verifies the realization represents the transfer function.
7. **Explore a realization** - CompanionStateLab, `tipsAndTraps`, recap. Learner changes a coefficient and sees affected entries.

#### `ch3-transition` - State Evolution: Eigenvalues, Resolvent, Phi(t) & G(s)

1. **From state equation to evolution** - `sections`: connect x_dot=A x to the transition matrix. Learner identifies what Phi(t) maps.
2. **Find eigenvalues** - workedWalkthrough "Eigenvalues, Resolvent & State Transition Matrix", characteristic-roots step. Learner checks the characteristic polynomial.
3. **Form the resolvent** - workedWalkthrough (sI-A)^(-1). Learner tracks adjugate signs and determinant.
4. **Expand matrix entries** - workedWalkthrough partial fractions. Learner classifies poles before inversion.
5. **Invert to Phi(t)** - workedWalkthrough inverse transform. Learner connects poles to time-domain terms.
6. **Pass identity/derivative checks** - workedWalkthrough gates and checks. Learner verifies Phi(0)=I and the applicable derivative identity.
7. **Relate state response and transfer function** - `sections`, `tipsAndTraps`, TransitionMatrixLab. Learner changes initial state/time and interprets the result.

### 7.6 Fully written example bite and feedback (proposed editorial copy)

**Lesson:** `ch2-linearization`. **Bite:** "The tangent gives a local model." **Source mapping:** `sections` on tangent-line/perturbation and existing linearization concepts. Proposed copy is subject to math review against authoritative course materials.

> Near an operating point x0, a smooth curve can be approximated by its tangent. If y=f(x), a small input change Delta x produces an output change described by Delta y approximately equals f'(x0) times Delta x. The slope f'(x0) is evaluated at the chosen point, so this model is local: it describes nearby changes, not the whole nonlinear curve. Here Delta x=x-x0 and Delta y=f(x)-f(x0); these are changes from a baseline, not the absolute values x and y.

Main visual: one curve, the operating point (x0, f(x0)), and its tangent. Caption marks the local region and labels slope f'(x0). The visual supports the explanation rather than replacing it.

**Optional check:** "In this approximation, what does f'(x0) describe?" Choices: "The local slope at the selected operating point" (correct); "The output value everywhere"; "The amount of sensor noise."

**Proposed feedback, subject to math review:** Correct: "Yes. The derivative is the tangent slope at x0, so it maps a small Delta x to an approximate Delta y nearby." Not quite: "Look at where the tangent touches the curve. f'(x0) is the slope there; it does not say the whole curve is linear." Previous/Continue and outline navigation remain available before and after answering.

### 7.7 Math, checks, and QA

Use KaTeX for existing math text. Keep explanatory prose beside display equations and define symbols before use. Preserve signs, assumptions, units, initial conditions, normalization, intermediate algebra, and sanity checks. Contain equation overflow within a labeled equation region rather than the page.

Checks are optional teaching moments near the idea they test. They are keyboard-operable and explain why an answer fits. Learners may change an answer, retry, skip, or continue without answering. A correct answer is not a completion or mastery score. Full lesson review contains the same checks in context without sequential gating.

Acceptance: every bite maps to source fields; no derivation step disappears; core reasoning is visible; word guidance is met or a reason for exceeding it is recorded; one main idea and visual/equation per bite; Previous/Continue/outline/review work without gates; focus moves to the selected heading; 20px desktop and 18px mobile body text remain readable; bite location never implies mastery.

---

## 8. Seven interactive labs: unified frame and individual requirements

### 8.1 Shared lab frame

Every lab should retain its existing mathematical model, controls, presets, figures/plots, and interpretive content. Redesign the frame as one contained laboratory section within a lesson, with:

1. A single title and brief purpose sentence; remove duplicate outer/inner titles.
2. A short “Question to investigate” or “What to observe” prompt from existing content, if accurate.
3. The primary visualization, sized for legibility with descriptive axis labels, units if provided, and legends.
4. Only the controls that affect that visualization, grouped and labeled. Show current numerical values next to sliders; allow keyboard adjustment and provide a numeric field or buttons where slider precision is insufficient.
5. Scenario presets as named buttons or a select with a selected state; identify the exact change they produce. A preset is an example, not an endorsed answer.
6. Pause/play, reset-to-default, and “restore this scenario” behavior where playback or persistent manipulation exists. Never reset without a clear action.
7. A concise interpretation that updates only when its source assumptions change and does not assert a conclusion inconsistent with the current values.
8. A text equivalent for the central lesson: important numerical relationships or observed trend must be available without reading color or motion.

Do not present all control values in a grid of stat cards. Keep parameter labels, unit labels, and the equation that relates them together. Hide neither necessary units nor assumptions in hover tooltips. Ensure plot canvas resizes with its container, has a useful fallback when canvas is unavailable, and does not become unreadable on a phone. If a full-resolution graph cannot fit, preserve the graph with horizontal scaling or a compact aspect ratio while retaining axes and controls.

### 8.2 Lab-specific implementation brief

The names below map directly to current files under `src/components/InteractiveLabs/`. Verify each lab’s actual runtime and source math before changing styles or interaction. Do not infer physical correctness from labels alone.

#### A. Feedback and sensitivity — `FeedbackLab.tsx`

**Current source cues:** loop gain, plant gain change, disturbance toggle/magnitude, noise toggle, presets, response trace/hover time, and a dynamic insight are represented in state.  
**Learning role:** distinguish open-loop/closed-loop behavior, sensitivity to plant changes, disturbance rejection, sensor noise effects, and stability-related tradeoffs, matching existing lesson content.

- Keep baseline and modified response visually comparable, with a legend that distinguishes each trace and a textual summary of the changed parameter.
- Group gain/sensitivity settings separately from disturbance and measurement-noise controls. Use explicit “plant gain change,” “load disturbance,” and “sensor noise” names; do not conflate them.
- When a toggle is off, its controls should be disabled and visibly inactive, not removed if removal would cause layout jump. State this accessibly.
- If the chart exposes hover-time readouts, provide keyboard focusable data inspection or a table/list equivalent. Touch users must not need hover.
- Presets such as a wear/gain-drop case should explain their input values and update the text insight. Do not let the insight imply that larger feedback gain is always better; retain the noise tradeoff and any stability qualification present in source.
- Label the reference input, output, disturbance, and noise paths consistently with the block diagram and the lesson. Audit signs, units, and assumed transfer functions.

#### B. Linearization — `LinearizationLab.tsx`

**Current source cues:** operating point angle, angular deviation, presets, an animation toggle, pendulum visualization, and plot dimensions.  
**Learning role:** compare a nonlinear relation with its local tangent approximation and distinguish perturbation/deviation form from absolute tangent line.

- The graph must show nonlinear curve, operating point, and local tangent with distinct line style and direct legend labels. Include the selected operating point and perturbation range numerically.
- Present the baseline value and slope alongside the approximation; do not show only `Δy = m Δx` when the absolute tangent model is being discussed.
- Identify angular units consistently (degrees in control, radians in the equation if that is the source convention); show any conversion explicitly. Check all limits and trigonometric functions against source.
- Animation is optional and may be replaced by a “Show motion” button or frame-independent diagram. Reduced-motion mode must not autoplay movement.
- The selected preset and custom slider state must stay in sync. A clear reset returns to the default operating point and perturbation.
- Provide text stating where the approximation is local and what changing the operating point does, without inventing an error bound.

#### C. Laplace response and FVT — `LaplaceStepLab.tsx`

**Current source cues:** scenario presets include Ex. 2.2, E2.4, underdamped, imaginary-axis FVT, and right-half-plane FVT cases; damping ratio control; component visibility toggle; paired s-plane/time plots; hover time.  
**Learning role:** connect poles and terms to response, include nonzero initial conditions where relevant, and explain the Final Value Theorem’s pole condition.

- Give the time response the primary visual weight and the s-plane plot a clearly labeled companion view; neither should be a tiny dashboard tile. On mobile, stack them and retain an explicit link or heading between views.
- Name the active case in plain language. FVT cases must say “condition satisfied” or “condition not satisfied” only after the actual pole condition is checked in the model. Never present a final value as valid when the theorem condition fails.
- Distinguish input response, zero-input response, and total response if the current model includes them. Ensure the nonzero initial-condition examples show exactly which initial conditions are used.
- The damping slider applies only to compatible scenarios; disable or explain it for unrelated presets. Provide units for time and pole axes if applicable.
- Toggling components should update a visible legend and accessible descriptions. A hover-time readout needs a touch and keyboard alternative.
- Audit repeated poles, complex poles, signs in residues, and the requirement that poles of `sY(s)` be in the required region before calling a final-value result valid.

#### D. Field-controlled motor — `MotorPhysicsLab.tsx`

**Current source cues:** field resistance/inductance, motor constant, inertia, damping, disturbance torque toggle, armature-control comparison, selected block, preset, hover time, and plotted response.  
**Learning role:** connect electrical subsystem and mechanical dynamics for the field-controlled motor while distinguishing the armature-controlled comparison.

- Introduce the baseline field-control assumptions before showing sliders. Keep the armature-control comparison explicitly identified as a comparison case, not a toggle that silently changes the stated model.
- Group `R_f`, `L_f`, motor/torque constant, inertia `J`, damping `b`, and disturbance torque with visible units where source data specifies them. If no unit is present in source, do not fabricate one; flag the content for review.
- Label electrical and mechanical blocks and the signals linking them. The selected block highlight must have text/line distinction, not color alone.
- Disturbance torque control should be disabled when the disturbance is off and read clearly as an external torque input. Do not add a back-EMF loop to the field-controlled model unless the authoritative source says otherwise. The existing reference flags this as a potential modeling trap; independently verify it against course material.
- If a response position integrates velocity and includes a pole at the origin, explain that only if it follows from the current model. Include initial condition and output definition in the lab context.
- Compare cases using matched axes when the purpose is comparison; explain when axis scales differ.

#### E. Block-diagram algebra — `BlockDiagramLab.tsx`

**Current source cues:** sign-flip mode, negative/positive feedback sign, parameters `K`, `a`, `H`, sign-flip presets, step count, s-plane/step plot widths, presets, range controls, and a derivation step flow.  
**Learning role:** trace sign conventions through a feedback relation and connect the characteristic equation to system behavior.

- Keep the original block diagram visible while showing the algebra. Highlight the active summing sign and signal direction directly on the diagram, with accessible labels.
- Show one algebraic transformation at a time only as an optional teaching affordance; also provide a “Show all steps” action and a readable complete derivation. Do not force a linear lock.
- State how each preset affects the denominator/closed-loop poles and whether a stability claim is conditional on parameter assumptions. Include the sign convention used in the diagram.
- Distinguish negative-feedback denominator `1 + GH` from positive-feedback `1 - GH` in context, not as an isolated colored formula. Audit all parameter ranges for invalid divisions or singular cases.
- Provide a no-animation/static rendering of pole/step changes. If step response data is included, label initial/final values and ensure axis units/conditions are shown.

#### F. Companion state-space — `CompanionStateLab.tsx`

**Current source cues:** order 2 or 3, leading coefficient, denominator coefficients, numerator coefficient, monic and non-monic presets, selected signal probe, plot, and sliders.  
**Learning role:** map an ODE/transfer-function denominator to phase variables and companion matrices while illustrating normalization by the leading coefficient.

- Show the source differential equation before the matrix. Present coefficient values in a form that makes the polynomial order and leading coefficient unambiguous.
- When the leading coefficient is not 1, visibly show division of the entire equation before filling the companion matrix. Never silently normalize. Label what values are normalized and preserve the original equation for comparison.
- Label state definitions and the selected probe (for example, a state versus its derivative) beside the diagram/plot. Clarify whether a tap is before or after an integrator if the visual uses integrator chains.
- Keep matrix dimensions and row/column meaning legible, including input matrix and output relation. Distinguish state variables from coefficient labels.
- Presets illustrate distinct cases; changing a custom coefficient clears the preset selection and updates outputs. Provide reset and explicit numeric readout.
- Audit denominator signs, coefficient ordering, numerator mapping, and state ordering against the source derivation. Numeric output must match symbolic equations before the visual is approved.

#### G. Transition matrix — `TransitionMatrixLab.tsx`

**Current source cues:** system presets, initial state vector `x0`, time value, play/pause state, phase/time plot widths, regime presets, and interactive evolution.  
**Learning role:** connect `Φ(t) = e^(At)` with state trajectories and verify its relation to the initial condition and system matrix.

- Present `x(0)`, selected time, and the system preset near the graph. Include a static formula and a plain-language explanation of how the initial state enters the trajectory.
- Make play/pause explicit and repeatable. Time scrubbing remains keyboard-operable; play stops at its defined endpoint and can be restarted. Do not autoplay.
- Distinguish state-plane trajectory from state-versus-time traces with headings and axes. Use marker/dash styles in addition to plot colors.
- If presets represent stable, unstable, or oscillatory regimes, label those classifications only after verifying eigenvalues. Explain conditions represented by each preset.
- Include checks `Φ(0)=I` and `dΦ/dt|₀=A` in optional explanatory content if they are present or source-supported. Do not claim the displayed matrix passed them without numerical verification.
- Provide a static accessible summary of the trajectory and endpoint; no information is available only through movement.

### 8.3 Lab quality gate

Before accepting a lab, verify source formula and signs against an authoritative lesson/problem, independent numeric values for representative presets, input ranges and edge cases, reset state, keyboard interaction, screen reader labels, reduced motion, narrow viewport, and graph text alternative. A visual restyle is not acceptance if the simulation changes meaning or loses controls.

---

## 9. Practice: problem library and problem study page

### 9.1 Library page

Practice is a searchable index of the existing problems with a separate focused problem detail. The current data includes 20 assigned textbook problems plus four examples according to the present page title. Validate that count and labels against every record before copying the headline. Show clear grouping by homework set and problem type, but do not make the learner parse fourteen simultaneous filter chips.

Desktop: left library pane with search and two compact filters (assignment/source and problem type), count of visible results, result rows, and a main problem detail. Mobile: show the result list first; selecting a problem opens a detail route/view with an obvious “Back to results” action and retained filters. Search works on code and title; empty state offers “Clear filters.” Result identity must include code, title, assignment/source, and meaningful priority metadata only if the source meaning is explained. Avoid colored priority badges as decoration.

### 9.2 Filtering correctness

Selection must always be derived from the filtered result set when filters change. The current `ProblemBankPage.tsx` source resolves `activeProblem` from all problems before considering filtered results; consequently, the active detail can remain outside the displayed filtered list. Redesign implementation must correct the selection invariant: the selected detail is in the visible filtered set, or the state explicitly says no result is selected. If a selected item is filtered out, select the first visible result or show the result list empty. Never display one problem in the detail while a different problem appears selected.

Search, filter, and selection state should be encoded in URL or restorable when sensible. Add counts as descriptive results (“8 problems”) rather than score. Keep keyboard focus from jumping unexpectedly while the list changes.

### 9.3 Focused problem page order

1. Problem code/title, source and assignment information.
2. Original problem statement and original figure/diagram if present. Preserve labels, units, and caption.
3. “Given” and “Find” as simple lists if they improve comprehension; do not repeat data redundantly.
4. A pause/attempt prompt: “Try setting up the model before opening the solution.” This is encouragement, not a lock.
5. A quick check if the problem record includes one. Learner chooses a response; feedback explains the concept.
6. Optional hint / recognition cue. Keep this separate from the full derivation.
7. Step-by-step solution, with each mathematical transformation paired with reasoning. Default to first step visible or collapsed in a way that does not conceal the problem; reveal one at a time is optional. Offer “Show all steps.”
8. Final answer and source answer, with source provenance and a clear distinction between them. Do not render `bookAnswer` next to the original statement before the attempt; the current `ProblemStepViewer.tsx` does so.
9. Method summary, common mistakes, shortcut, and memory note. Keep supplementary material after the derivation and avoid four redundant panels.
10. Related lesson and next/previous problem links.

### 9.4 Reveal and answer behavior

Answer content should be concealed until a deliberate “Show solution” action. This protects the first-attempt opportunity without making answer access punitive. A “Show all solution steps” control is available. No timed lock or completion gate. If a solution is revealed, make the state clear and reversible where practical. When the user changes problem, reset transient reveal state or restore it intentionally; never leak a previous problem’s revealed content into the next problem.

Book answers are not always identical in notation or method to a worked solution. If both exist, show “Book answer” and “Worked solution” distinctly, preserve the original wording, and clarify their source. Content QA must compare results and units before publication.

### 9.5 Text wireframes

```text
Desktop
┌──────────────────────────────────────────────────────────────────────────┐
│ Practice                                                                 │
│ [Search code or title________________] [Assignment ▾] [Type ▾]           │
├───────────────────────┬──────────────────────────────────────────────────┤
│ 8 problems            │ E2.21 · Positioning slide with base excitation   │
│ E2.2 Thermistor       │ HW 2 · Textbook source                           │
│ E2.3 Spring stiffness│ Original problem statement and figure            │
│ E2.4 Step response    │ Given / Find                                     │
│ E2.21 Base excitation │ [Try the setup]                                  │
│ E2.25 Multiloop       │ Hint (optional)                                  │
│ ...                   │ [Show worked solution]                           │
│                       │ Step 1: FBD · equation · reasoning               │
│                       │ Step 2: Laplace transform · reasoning           │
│                       │ Final result · source answer · checks            │
└───────────────────────┴──────────────────────────────────────────────────┘

Mobile
┌───────────────────────────────┐
│ Practice                      │
│ [Search________________]       │
│ [Assignment ▾] [Type ▾]        │
│ 8 problems                    │
│ E2.21 · Base excitation     →  │
├───────────────────────────────┤
│ Problem detail (after select) │
│ [← Back to results]           │
│ Original prompt and figure    │
│ Given / Find                  │
│ [Show worked solution]        │
│ Derivation and answer         │
├───────────────────────────────┤
│ Home Learn Practice Exam Ref  │
└───────────────────────────────┘
```

---

## 10. Exam: practice simulation and review

### 10.1 Exam landing

The landing page describes the included practice set factually: it contains seven question records and 100 points according to current data, subject to content audit. It may offer a choice of timed or untimed practice. The source initializes a 90-minute timer; therefore label this “90-minute simulation default” or “Simulation timer: 90 min,” and state that official exam timing is not confirmed here. If duration can be edited or disabled, make that choice before starting and show the exact consequence.

Explain that the simulation includes a question set, scratchpad fields, revealable worked solutions, rubric criteria, and self-entered scores if these remain implemented. Clarify that the app does not automatically grade handwritten work. A score entered by a learner is self-assessed against the visible rubric, not an official or objective grade.

### 10.2 Active simulation

Use a calm exam shell with course/product identity, a labeled timer, question navigation, progress by question answered/visited only if those states are implemented, and a clear exit/finish action. Do not expose solutions with a one-click button placed beside every prompt before the learner can work. Keep scratchpad and response area near the relevant subproblem. Show diagrams as readable figure regions with captions and alternatives.

Timer requirements if retained:

- Use elapsed-time/deadline calculation rather than assuming interval ticks are exact; browser tab suspension can delay interval callbacks. Display the remaining value from a timestamp on each update.
- Make start, pause, resume, reset, and finish semantics explicit. Confirm before reset only if it destroys notes or self-scores; otherwise preserve them.
- Make clear whether pause is allowed in the chosen simulation mode. Do not label a paused timer “official.”
- Keep screen-reader announcements sparse (for example at minute boundaries and expiry), not every second.
- Persist notes, selected question, timer state, revealed solutions, and self-entered rubric scores only if that behavior is deliberately implemented and the user understands the local storage scope. These fields do not exist in the current `App.tsx` saved progress model and are currently component state; persistence is a separate feature decision.
- When time expires, do not delete work. Offer “Continue reviewing” or “Finish simulation” based on designed behavior.

### 10.3 Review

After the learner finishes or exits, a review view summarizes question-by-question self-assessment against existing rubric items. The aggregate score is labeled “Self-entered score” or “Your rubric estimate,” with total possible points. Never call it “grade,” “readiness,” or “mastery” without qualification. A blank score is distinct from zero. A score should only be included in total when set/confirmed; ensure a default zero is not mistaken for an entered score.

Show the solution and deductions after the learner elects to review. Preserve every rubric item, point allocation, and deduction warning. Allow jump to a question and compare work with the steps. Provide a clear return to Exam landing.

### 10.4 Exam wireframe

```text
Landing
┌──────────────────────────────────────────────────────────────────────────┐
│ Practice exam                                                           │
│ Seven questions · 100 points in the current practice set                 │
│ Timer option: 90-minute simulation default · official duration unknown  │
│ [Start timed practice] [Start untimed practice]                          │
│ Solutions appear in review or when you request them.                     │
└──────────────────────────────────────────────────────────────────────────┘

Active
┌──────────────────────────────────────────────────────────────────────────┐
│ Practice simulation       Question 3 of 7         01:23:18 remaining     │
│ [Question list]          Prompt, diagram, parts and scratchpad             │
│                         [Save/continue] [Finish simulation]              │
└──────────────────────────────────────────────────────────────────────────┘

Review
┌──────────────────────────────────────────────────────────────────────────┐
│ Review your work                                                        │
│ Self-entered rubric estimate: 71 / 100 · 5 parts not scored              │
│ Q1 · 12/14    Q2 · Not scored    ...                                     │
│ [Review Q1] [View worked solution]                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Reference: formulas, methods, scope, and sources

Reference is an organized lookup document, not a wall of color-coded trap cards. Use a compact table of contents with section anchors and page headings. Keep tables semantic and horizontally scrollable at narrow sizes. A print style removes navigation, interactive controls, and repeated chrome while retaining citations, equations, diagrams, and scope qualifications.

Recommended sections and source mapping:

1. **Start here / scope and source record:** course code/name, instructor and text only as present in source data, released slide coverage, HW assignment evidence, planned schedule evidence, core-scope status, and separate confidence labels. Present confirmed facts, strong inference, and speculation in distinct textual labels. Do not turn the existing “core midterm scope” estimates into official scope.
2. **Laplace pairs:** preserve `laplacePairs`, including the derivative rules with nonzero initial conditions and their explanatory notes. Keep time-domain and transform-domain columns. Distinguish causal/unit-step conventions if source context calls for them.
3. **Block diagram rules:** preserve cascade, parallel, positive/negative feedback, pickoff movement, and summing movement rules. Show signal diagram, formula, and caveat as one aligned entry. Audit sign and multiplication/division direction.
4. **Common errors and checks:** preserve all ten `examTraps` and `sanityGates`, but use an instructional format: “Check,” “Why it matters,” and “Example of correction.” Avoid “fatal/high-frequency” labels unless supported by actual assessment evidence. The current source text may state claims about explicit grading behavior; qualify or remove only after source review, not silent redesign.
5. **Notation:** preserve distinctions between lecture and textbook symbols and explain each one. Use columns for concept, lecture notation, textbook notation, and distinction.
6. **Classifier:** link to secondary Problem classifier page; keep pathway outputs as study suggestions.
7. **Chapters 4–6 contingency notes:** retain the current contingency material only with a high-visibility label: “Preparation note; not confirmed exam scope.” Preserve its source caveat and any conditions attached to formulas. Add no unsupported derivations or claims.
8. **References and provenance:** expose source labels for each row or section. Link to local source names where useful; no dead external URLs.

### 11.1 Scope statement requirements

The existing curriculum data states that the planned schedule originally placed a midterm in Week 9 covering Weeks 1–8, while released slide materials in the packet include introductory/Chapters 1–3 content and HW1–4. The data itself says the mismatch leaves Ch. 4–6 uncertain and contains speculative estimates. The redesign must preserve that nuance. The statement should not say “the midterm covers Chapters 1–3,” “Chapters 4–6 are included,” or “80–100% likely” as established fact. Use neutral phrasing such as:

> The available course files support preparation from the Intro and Chapters 1–3 materials and HW1–4. The planned schedule and released materials do not by themselves confirm whether Chapters 4–6 are included. Check the current course announcement or ask course staff; the Ch. 4–6 notes here are contingency references.

Before shipping, validate the exact source evidence, date/context, and wording against current course documents. If current confirmation is unavailable, preserve the caveat and make no prediction.

### 11.2 Print

Print view uses a white background, black text, visible URLs only where meaningful, no fixed navigation, no cropped equations, no background-dependent diagrams, and sensible page breaks that do not split a formula from its definition. Hide interactive controls but include static lab diagrams/summary where possible. The print stylesheet must not remove source notes, caveats, labels, or figure captions.

---

## 12. Study plan and problem classifier

### 12.1 Study plan

Retain the existing 1h, 3h, 6h, and 9h plans from `curriculum.ts`, including order, durations, breaks, and target IDs. They are prewritten study schedules, not recommendations proven to produce readiness. The user can select a plan, check off blocks if the existing behavior is retained, and open target lessons/problems. Distinguish scheduled duration from actual elapsed study time. Do not use a giant clock/countdown unless the user explicitly starts a session.

Wireframe: plan selector as compact tabs or select; summary total and intended content; vertical sequence of blocks; each block includes time range, focus, duration, target links, and optional local checkbox. The existing `checkedBlocks` local state is keyed by a block string; define a stable key during implementation so changing wording does not orphan checked items. If changing plan clears or preserves checks, explain it. Ensure the 9h description and underlying block durations add up; run a content audit rather than visually trusting labels.

### 12.2 Classifier

Preserve `RecognitionFlowchart` symptoms, branch conditions, cues, formulas, lesson links, and example problem IDs. Present the classifier as a guided decision aid with a clear way to reset, go back to a prior choice, and inspect why a branch was selected. Avoid implying the classification is authoritative or exhaustive. Always let the learner browse practice directly. Ensure all branch labels and math fit on mobile and do not rely on red/green mapping to distinguish answer paths.

---

## 13. Shared components and interaction behavior

Implement a small, consistent component language rather than a new decorative component for each topic.

### 13.1 Buttons and links

- Primary action: forest fill, clear verb label, adequate contrast and 44px target.
- Secondary action: text or thin outlined style; use for alternate actions such as “Show hint.”
- Destructive/reset action: plain label and confirmation only when unsaved work would be lost.
- Text links remain underlined or have another non-color affordance. Focus ring is visible.
- Avoid icon-only controls without an accessible name and tooltip/visible label.

### 13.2 Inputs

Associate visible labels with all inputs. Sliders show current value, min/max where useful, and units. Keyboard arrow adjustment works. Numeric entry validates bounds and communicates invalid values without silent clamping where that could hide an error. Toggles have labels that state the effect. Disabled controls explain why if the reason is not obvious.

### 13.3 Disclosure and tabs

Use disclosure for optional supplementary notes, full solutions after request, detailed source notes, and extended interpretation. Never hide a required definition or a step needed to understand the presented result. Native buttons with `aria-expanded`/`aria-controls`; keyboard behavior follows expected patterns. Tabs are appropriate only when the user is selecting between peer views such as “List / diagram,” not for serial lesson content.

### 13.4 Feedback states

Correctness feedback includes a text label (“Correct,” “Try again,” “This answer is not correct”) and explanation. Color and icon reinforce the text. Error messages appear near the control, are announced, and remain until corrected/dismissed. Do not use transient toast as the only persistence of important feedback.

### 13.5 Empty, loading, and error states

- No problem matches: state that no result matches, offer “Clear filters.”
- Missing lesson/problem ID: explain the selected item is unavailable and offer list navigation.
- Local storage blocked: allow the app to work for the session and explain that state may not persist if the user tries to rely on persistence.
- KaTeX error: render source equation text as fallback and log for content QA; do not blank the lesson.
- Lab calculation error or invalid denominator: state what parameter combination is invalid and let the user reset; do not display `NaN` or misleading blank chart.
- Canvas unavailable: show a text explanation, formula, and static values/diagram where feasible.

---

## 14. Accessibility, responsive behavior, and performance

### 14.1 Accessibility acceptance requirements

- Semantic landmarks: header, nav, main, footer; one page-level `h1`; nested headings in order.
- Full keyboard use of navigation, filters, lesson anchors, checks, reveals, lab controls, chart inspection, timer controls, and route exit.
- Visible focus outline at all times; never remove outlines without an equivalent.
- AA contrast minimum for text and controls. Test selected, hover, disabled, error, success, and caution states.
- No state communicated only by color, position, animation, hover, or sound.
- Touch targets at least 44×44 CSS pixels where practical, especially mobile navigation, sliders, and buttons.
- Respect 200% zoom and reflow without horizontal page scrolling at 320 CSS px. Math and data tables may have their own labeled scroll containers.
- Screen-reader labels for sliders, play/pause, timer, preset controls, diagram/plot descriptions, and progress states. Use live regions sparingly.
- Reduced-motion preference honored; no autoplay or parallax.
- Correct heading order, alternative text for informative images, captions for figures, and empty alt for decoration.
- Color contrast of plot traces supplemented by line style/markers; keyboard and textual graph alternatives provided.

### 14.2 Responsive breakpoints and adaptation

Use content-driven breakpoints and test the actual layout at narrow phones, common phone portrait, tablet, and desktop. Suggested initial breakpoints: 640px and 900px, with the wide lab/sidebar layout only when both width and available height make it useful. Do not set fixed page heights. On mobile, stack side-by-side content, convert rails into disclosures, let tables scroll in a labeled region, and place lab controls after or immediately beside the graph depending on the task sequence. Avoid sticky controls covering graph content. Do not shrink body type to fit.

### 14.3 Performance

Keep the existing stack unless a concrete implementation requirement makes a change necessary. Avoid adding large libraries for simple routes, animations, charting, or state. Reuse canvas plots already implemented after auditing them. Load only the necessary icon components. Do not add remote fonts or image assets without an explicit need. Measure bundle/build output and inspect performance after implementation; this masterplan makes no current runtime performance claim.

---

## 15. Progress, local persistence, and migration

### 15.1 Current saved data

`App.tsx` currently persists `masteredProblems`, `completedLessons`, and `checkedBlocks` under `control-studio-progress-v1`. Preserve these records for migration. Where a migrated problem mark is displayed, use "Previously marked comfortable (self-reported)"; do not label it "Marked for review," objective mastery, or a score. If current interaction semantics do not support that label, preserve the value until product review defines its meaning.

### 15.2 Migration requirements

- Keep reading `control-studio-progress-v1` during migration.
- If a new schema is needed, write a versioned migration that preserves every existing ID and state. Do not make a migration that resets the old key before verifying the new value was saved.
- Unknown fields and malformed JSON must not crash the app; fallback is an empty session state with an optional recovery message.
- Do not recast `masteredProblems` as scored assessment. Preserve meaning or ask product/content owner to define a new model.
- `completedLessons` may drive “Marked complete” only; do not interpret as comprehension.
- `checkedBlocks` are plan checklist state, not time-on-task or completion of an academic outcome.
- Proposed new fields such as `lastVisitedLesson`, `lastVisitedProblem`, self-confidence, exam session, notes, rubric scores, reveal state, timestamps, or assessment performance are **not present** in current data. Add only after feature decisions, names, migration, privacy copy, reset behavior, and retention semantics are specified.
- Provide “Reset local progress” only if designed with an understandable confirmation, scope of deletion, and no effect on source content. Not required as a new feature in this presentation phase.

### 15.3 Progress language

Allowed labels include "Not started," "In progress," "Marked complete," "Previously marked comfortable (self-reported)," and "Self-entered rubric estimate," where the relevant source state exists. Do not label migrated problem marks "Marked for review." Disallowed combined indicators include readiness percentages and progress rings combining lesson/problem counts.

---

## 16. Content integrity and instructor review

The data contains many technical claims and mathematical results. A design implementation is not an independent proof. Every content-preserving move should still be checked for signs, assumptions, units, and boundary conditions.

### 16.1 Mandatory subject-matter checks

- **Feedback:** distinguish reference, output, measured output, actuating error, disturbance, and sensor noise; preserve loop sign and assumptions.
- **Linearization:** check operating point, derivative, radians/degrees, absolute baseline versus deviation variables, and range where the local approximation is used.
- **Laplace:** check unilateral/bilateral convention where stated, initial values at `0−` versus `0+`, correct transform terms, partial fraction residues, repeated/complex poles, input transform, and FVT pole condition.
- **Physical models:** verify free-body diagrams, action/reaction directions, base-excitation signs, force/torque balance, KVL/KCL, units, and initial conditions.
- **Block diagrams:** check sign at every summing junction, pickoff placement, branch compensation, algebra, and singular parameter cases.
- **State space:** check state ordering, row/column dimensions, monic normalization, `A`, `B`, `C`, `D`, output definitions, and transfer-function equivalence.
- **Transition matrix:** check eigenvalue regimes, initial state, formula, `Φ(0)=I`, and derivative identity when shown.
- **Motor:** verify field-controlled versus armature-controlled assumptions; back-EMF inclusion or omission; torque and motor constants; block coupling; disturbance; and units.
- **Exam:** verify question totals equal the advertised points, part rubric sums, units/sign conventions, diagram labels, and timer wording.
- **Reference:** verify every formula and its applicability conditions, especially FVT, second-order response, Routh notes, and steady-state error expressions.

### 16.2 Content correction process

If a mismatch is found, record source file, data key, exact equation/phrase, authoritative comparison, and proposed correction. Do not fix an uncertain technical issue by choosing the most familiar textbook convention. Compare professor slides, assigned problem statement, source textbook excerpt, and existing solution evidence in that priority order as available. Preserve unresolved uncertainty in the UI until reviewed.

### 16.3 Text edits

Normalize encoding artifacts (for example, mojibake punctuation) and remove imitation brand references such as “Khan-style” only when doing so does not remove meaningful attribution. Avoid rewriting technical language for style until the math is checked. Keep prose concise, but not at the expense of the derivation.

---

## 17. File-by-file implementation map

The following map scopes the later implementation. It is not permission to delete or overwrite source data indiscriminately. Preserve existing files and build incrementally; when replacing components, retain them until routes and parity are verified.

| File | Planned change | Preservation / review |
|---|---|---|
| `src/App.tsx` | Replace tab-only navigation with route state, route title/focus behavior, new global shell, and deliberate local-progress migration. | Preserve existing progress key and arrays; no new schema fields assumed. |
| `src/components/TopNav.tsx` | Rebuild text-first Home/Learn/Practice/Exam/Reference nav; remove aggregate readiness percentage and decorative active pills. | Preserve clear active route and mobile access. |
| `src/index.css` | Define paper/ink/forest tokens, type stacks, accessible focus, KaTeX adaptation, responsive baseline, reduced motion, print rules. | Remove dark-only `color-scheme`, raw palette dependencies, and global smooth scroll after checking component styles. |
| `src/pages/OverviewPage.tsx` | Rebuild Home as resume + curriculum rows + study tools + scope note. | Preserve seven lessons, classifier/study plan entry points, and course source caveat. |
| `src/pages/TheoryStudioPage.tsx` | Convert page to bite-first lesson flow with full-lesson review toggle, outline, optional focus mode, and checks near their teaching point. Keep source reasoning visible within each bite. | Preserve lesson data, all math, figures, lab links, concepts, worked examples, tips and related IDs. |
| `src/pages/ProblemBankPage.tsx` | Convert to searchable library/detail routing and correct selection/filter invariant. | Preserve all 24 records, source IDs, filters, image links, and progress semantics. |
| `src/components/ProblemStepViewer.tsx` | Reorder answer flow to prompt → attempt → optional hint/check → revealable derivation → final/book answer and source. | Specifically move `bookAnswer` out of pre-attempt statement view; preserve every step, reasoning, pitfall, and method cue. |
| `src/components/ProblemVisual.tsx` | Restyle technical figures and interaction. | Preserve original problem diagram meaning, units, geometry, captions, and alt text; verify rendered figure. |
| `src/pages/PracticeExamPage.tsx` | Split landing/simulation/review states; label 90 min as simulation default, improve timer semantics and score labeling. | Preserve seven question records and rubric; no official duration claim; notes/scores currently transient. |
| `src/pages/CheatSheetPage.tsx` | Reorganize as Reference with anchored sections, scope source table, formula lookup, print layout. | Preserve all pairs/rules/traps/gates/notation/Ch. 4–6 caveat and no unsupported certainty. |
| `src/components/RecognitionFlowchart.tsx` | Restyle as secondary classifier, improve step/back/reset behavior and accessible explanation. | Preserve branch mapping, cues, formulas and IDs; audit branch correctness. |
| `src/components/MathText.tsx` | Review KaTeX error handling, accessible output, inline/display spacing and overflow. | Preserve source TeX faithfully and provide fallback. |
| `src/components/ExamDiagram.tsx` | Restyle diagrams and improve labels/alternative descriptions. | Preserve diagram topology and all plus/minus signs exactly. |
| `src/components/InteractiveLabs/FeedbackLab.tsx` | Apply common lab frame and feedback-specific grouping/legends/text alternative. | Keep model and presets; verify output math and noise/disturbance distinctions. |
| `src/components/InteractiveLabs/LinearizationLab.tsx` | Apply common lab frame, equation/plot pairing, units, and reduced-motion behavior. | Keep operating point/preset math and curve/tangent relationship. |
| `src/components/InteractiveLabs/LaplaceStepLab.tsx` | Apply common frame; clarify FVT cases, poles, initial conditions, plot legends. | Preserve scenarios, response equations, and theorem conditions. |
| `src/components/InteractiveLabs/MotorPhysicsLab.tsx` | Apply common frame; group electrical/mechanical controls and assumptions. | Preserve field motor model, comparison, disturbance cases; verify units and back-EMF assumptions. |
| `src/components/InteractiveLabs/BlockDiagramLab.tsx` | Apply common frame; show diagram and derivation together, simplify preset/control composition. | Preserve sign-flip cases and derivation; audit parameter edge cases. |
| `src/components/InteractiveLabs/CompanionStateLab.tsx` | Apply common frame; show normalization and state definitions alongside matrices. | Preserve order, coefficients, probe cases, and model outputs. |
| `src/components/InteractiveLabs/TransitionMatrixLab.tsx` | Apply common frame; distinguish phase/time views, controls and playback. | Preserve presets, initial state, time, and trajectory mathematics. |
| `src/data/theoryLessons.ts` | Add reviewed presentation metadata for bite mapping only if needed; keep source lesson content and stable IDs. | Bite labels/order are proposed editorial mappings, not new lesson content. Preserve each source reasoning step; do not force a fixed count. |
| `src/data/homeworkProblems.ts` | Preserve source material; add metadata only if separately approved. | Do not silently delete or alter book answers or correct math without authoritative review. |
| `src/data/practiceExam.ts` | Preserve question, part, rubric, deduction and diagram data. | Audit point sums and mathematics. |
| `src/data/curriculum.ts` | Preserve study plans, scope evidence, reference tables, classifier data. | Explicitly qualify uncertain claims and audit schedule totals. |
| `src/types.ts` | Change only when required by an approved route or feature data model. | Do not add confidence, notes, last-viewed, timer-persistence or mastery fields by assumption. |
| `public/assets/*` | Preserve all diagrams and equation images currently referenced. | Verify references, resolution, alt text, and output after styling. |
| `package.json`, lockfile, Vite config | No planned framework replacement. Add dependencies only if justified. | Existing React/Tailwind/Vite/KaTeX/Phosphor stack remains. |

---

## 18. Implementation phases and dependencies

### Phase 0 — source and content inventory

1. Reopen all pages, data records, lab components, asset references, and `REDESIGN.md`.
2. Verify seven lessons, seven labs, all problem IDs, seven exam questions, point totals, and all reference tables. Record any discrepancy.
3. Map every current route/tab and local state to the target information architecture.
4. Audit formulas and assumptions against authoritative course materials available in the repository. Mark unresolved items; do not block a visual conversion on unsupported claims.

**Exit condition:** complete inventory with exact IDs and current data semantics; no deletion list without explicit rationale.

### Phase 1 — design foundation and shell

1. Implement token definitions, typography, focus styles, button/input baselines, responsive shell, and page title behavior.
2. Keep all existing pages reachable behind the new shell during transition.
3. Implement route/history behavior and local-progress backward compatibility before replacing old navigation.

**Exit condition:** every existing area remains reachable; routes reload; old progress is read without loss; visible nav has five destination labels; no readiness score.

### Phase 2 — Home and Reference

1. Rebuild Home with resume/curriculum/tool links/scope note.
2. Rebuild Reference with anchors, semantic tables, source status, caveat, and print mode.
3. Audit copy and provenance; correct encoding defects.

**Exit condition:** all old home features have a destination; scope uncertainty remains clear; print output retains context and source notes.

### Phase 3 — lesson and lab frame

1. Convert lesson content into short, source-mapped logical bites, one at a time by default. Keep each bite's full reasoning visible; add a full-lesson review view.
2. Add outline navigation, optional focus controls, and Previous/Continue actions without answer gating.
3. Migrate seven labs one at a time using the common frame and the per-lab requirements in §8.2.
4. Verify content and representative outputs after each lab; do not batch restyle all seven without checking individual model assumptions.

**Exit condition:** seven lesson links and their seven labs work; all original teaching content remains mapped across bites; bite navigation and full-review view work without gating; typography and desktop/mobile behavior are checked; no lab output silently changed.

### Phase 4 — practice and exam

1. Rebuild problem library/detail and fix filter-selection invariant.
2. Move source answer out of the pre-attempt view and implement deliberate reveal.
3. Split exam landing, active simulation and review.
4. Clarify timer, score, and persistence semantics.

**Exit condition:** all 24 problems resolve to correct details under filtering; all seven exam questions/diagrams/rubric points are present; self-entered scores are distinguished from graded performance.

### Phase 5 — consolidation and final review

1. Remove legacy navigation/styles only after parity and route checks.
2. Confirm all prior destinations and asset references remain reachable.
3. Run accessible keyboard and screen reader checks, contrast review, responsive inspection, formula overflow check, print inspection, and progress migration check.
4. Record only observed results. Repair defects and repeat affected checks after the last rebuild.

**Exit condition:** acceptance checklist in §20 passes, known limitations are listed, and final evidence corresponds to the final rendered build.

### Dependencies and implementation risks

- Routing decisions affect reload and browser history; settle them before route-specific page work.
- Progress migration depends on stable current IDs; do not rename IDs casually.
- Labs combine canvas, math, and state; each requires its own model review and visual QA.
- Redesigning data order can make an answer visible unintentionally; test initial state of every problem and exam part.
- User-entered notes/scores/persistence add privacy and migration decisions; they are not required to deliver the visual redesign.
- Existing files may include source data whose meaning is uncertain; preserve until source review resolves whether to reword.

---

## 19. QA plan and acceptance criteria

The following are verification requirements for implementation, not results already obtained. The implementation owner should report checks performed and any failures; do not mark a section complete solely because code compiles.

### 19.1 Coverage and content

- [ ] Home, Learn, Practice, Exam, and Reference are reachable by visible navigation.
- [ ] Study plan and classifier are reachable from Home and relevant contexts.
- [ ] All seven lessons appear once with correct stable IDs, title, chapter context, and related lab. Each bite maps to source fields; one-bite view is the default, full-lesson review is available, and neither requires answer gating.
- [ ] Each of seven labs is individually checked against its lab-specific requirements in §8.2.
- [ ] All 24 problem records, statements, source labels, figures, solutions, answers, checks, and cues remain accessible.
- [ ] All seven practice exam questions, parts, diagrams, point totals, rubrics, deduction notes, and solutions remain accessible.
- [ ] All reference data remains represented: transform pairs, block rules, traps, sanity gates, notation rows, scope items, contingency notes, and TA question.
- [ ] Every figure and equation asset reference resolves in the final app.
- [ ] No content removal is hidden inside a layout change; differences are enumerated.

### 19.2 Behavior

- [ ] Browser back/forward and reload work for destination and selected-item views.
- [ ] Every filter state selects a visible matching problem or an explicit empty state.
- [ ] Changing a problem does not leak prior reveal state into the next item.
- [ ] Book answer is hidden until the learner requests solution/review.
- [ ] “Show all” remains available; no forced answer lock.
- [ ] Lesson completion remains a separate self-marked state. Bite location is not mastery; Previous/Continue/outline and full-review toggling preserve the selected position and allow skipping.
- [ ] No aggregate readiness percentage or misleading progress ring remains.
- [ ] Timer is clearly a simulation setting; time behavior survives browser throttling without drift; pause/reset/expiry behavior is understandable.
- [ ] Blank score differs from zero; self-entered total is labeled; points cannot exceed rubric maxima.
- [ ] Local storage reads the old key and preserves states through the chosen migration.
- [ ] Controls have reset, disabled, invalid, error, and no-data behavior where relevant.

### 19.3 Visual and content QA

- [ ] Inspect final render at 1440×900, 1024×768, 768×1024, 390×844, and 320×568 or equivalent real viewport widths. These are target checks, not claimed measurements.
- [ ] Reading column, mathematical expressions, tables, diagrams, and navigation remain legible at each target; lesson body is 20px desktop and 18px mobile in the selected fonts. Bite content remains concise without clipping core reasoning.
- [ ] No page-level horizontal scroll; table/math overflow is contained and labeled.
- [ ] Paper/ink/forest system is consistent; semantic color is not decorative; no unrequested grain, glass, glow, gradients, or marketing visuals appear.
- [ ] Each page has one clear primary task, without deleting necessary secondary controls.
- [ ] Labs preserve model and output; representative presets are compared numerically against source equations.
- [ ] Scope copy never describes Chapters 4–6 as confirmed when not supported.
- [ ] Every technical claim that changed copy has an authoritative source review record.
- [ ] Print reference and lesson layout preserve formulas, labels, captions, assumptions, and caveats.

### 19.4 Accessibility

- [ ] Complete keyboard-only route through app, filters, checks, reveals, all labs, exam and reference.
- [ ] Focus indicator visible and focus moves sensibly on route changes.
- [ ] Screen-reader names, headings, live feedback, timer announcements and diagram descriptions are reviewed.
- [ ] Contrast checked for text and control boundaries, including disabled and semantic states.
- [ ] Reduced-motion mode checked, including every animated lab.
- [ ] 200% zoom and 320px reflow checked.
- [ ] Touch targets and slider alternatives are usable without pixel-precise gestures.
- [ ] Plots communicate series and values without color/hover alone.

### 19.5 Delivery record

The eventual implementation handoff should include: changed file list; route map; progress migration behavior; content parity notes; unresolved source questions; per-lab results and representative values; responsive sizes inspected; accessibility checks; known limitations; and final artifact location. Distinguish “source inspected,” “build completed,” “visual inspection performed,” and “content independently verified.”

---

## 20. Priority issue list

### P0 — correctness and misleading signals

1. Remove the combined readiness calculation in `TopNav.tsx`; its denominator adds lesson completions and problem marks as equivalent.
2. Correct the problem selection/filter invariant in `ProblemBankPage.tsx`.
3. Hide `bookAnswer` until a deliberate reveal/review action.
4. Label the existing 90-minute timer as a practice simulation default, not official duration.
5. Keep Ch. 4–6 coverage uncertain and clearly sourced; no unsupported exam-scope claim.
6. Audit formulas, sign conventions, units, initial conditions, and lab model assumptions before or alongside styling.

### P1 — course experience

1. Replace the mixed dashboard-like Home composition with resume, curriculum, and study tools.
2. Establish visible Home/Learn/Practice/Exam/Reference routing and browser history.
3. Implement bite-first lessons with short logical steps, full reasoning in each bite, optional full-lesson review, outline navigation, and no mandatory gating.
4. Create a coherent shared lab frame and restyle all seven labs individually.
5. Separate exam landing, simulation, and review; label self-assessed score.
6. Preserve old local progress under `control-studio-progress-v1`.

### P2 — polish and utility

1. Improve print reference and semantic tables.
2. Normalize encoding, copy tone, component spacing, figure captions, and alternate text.
3. Verify keyboard, screen reader, contrast, reduced motion, narrow viewport, and zoom behavior.

---

## 21. Decisions that remain intentionally open

These questions are separated from settled design so an implementer does not invent answers:

- **Router choice:** React Router versus a small custom/hash router. Keep URL behavior requirements regardless of implementation.
- **Dark theme:** not part of this redesign scope. Revisit only if requested; a second theme requires full contrast and plot review.
- **Confidence reflection:** potentially useful but requires new data and a clear definition; not present in current schema.
- **Last-visited resume location:** only implement if a meaningful stable section/scroll state is defined and tested. A lesson-level resume is sufficient for initial version.
- **Exam persistence:** notes and scores are currently transient component state. Decide whether to persist only after specifying privacy, retention, reset and recovery behavior.
- **Official exam duration and coverage:** unresolved by this app audit. Use current course communication as authority when available; do not infer from the timer or schedule alone.
- **Lab numeric correctness:** requires verification against equations/source and representative calculations; source presence alone is not proof.
- **Typeface licensing and bundling:** Source Sans 3 for body/UI and Source Serif 4 for headings are settled choices. Self-host after confirming license and bundle impact, with system fallbacks.

---

## 22. Final design summary

Midterm Academy should feel like a carefully edited engineering course: warm paper, dark ink, one restrained forest action color, readable serif section titles, and precise mathematical text. Home helps a learner resume and find their place. Learn presents complete reasoning in short logical bites by default, with a full-lesson review view available. Practice offers a clear attempt-first path with voluntary solution reveal. Exam distinguishes a simulation from an official exam and self-scoring from grading. Reference preserves lookup value and the limits of what the course files establish. The seven interactive labs remain central educational artifacts and receive individual, model-aware redesigns.

The product should never claim to know whether a student is ready, whether a future exam definitely includes Ch. 4–6, or whether a 90-minute setting is official. It should show what the source materials say, what the learner has marked, and what remains uncertain—each as a different thing.

---

## Appendix A. Route and source-content crosswalk

| Current source area | Target location | Essential content |
|---|---|---|
| `OverviewPage.tsx` hero and course identity | Home | Course name and short factual purpose. Remove marketing pitch. |
| `OverviewPage.tsx` lesson grid | Home curriculum rows + Learn lesson route | Seven lessons and completion state. |
| `OverviewPage.tsx` classifier | Secondary Classifier route | Symptoms, branches, cues, formulas, lesson/problem links. |
| `OverviewPage.tsx` study plan selector and blocks | Secondary Study plan route | 1h/3h/6h/9h content and checkbox behavior. |
| `OverviewPage.tsx` course evidence matrix | Reference / Course and scope | Evidence and status labels with uncertainty preserved. |
| `TheoryStudioPage.tsx` | Learn | Bite-based explanation, checks, walkthrough, tips, related practice, and full-lesson review. |
| `InteractiveLabs/*.tsx` | Embedded Learn lab section | All seven simulations and their distinct models/controls. |
| `ProblemBankPage.tsx` | Practice index and selected detail | Search, filters, problem source, status. |
| `ProblemStepViewer.tsx` | Practice detail | Prompt, optional hint, check, steps, final/book answer, mistakes, method. |
| `PracticeExamPage.tsx` | Exam landing, simulation, review | Questions, timer, scratchpad, reveals, rubrics, self-scores. |
| `CheatSheetPage.tsx` | Reference sections | Pairs, block rules, traps, sanity gates, notation, contingency and source query. |

## Appendix B. Text and display terminology

| Prefer | Avoid unless explicitly substantiated |
|---|---|
| “Practice exam” / “Practice simulation” | “Official midterm” |
| “90-minute simulation default” | “90-minute exam” |
| “Available course files indicate…” | “The exam covers…” when unresolved |
| “Marked complete” | “Mastered” when only a toggle was recorded |
| “Your self-entered rubric estimate” | “Your grade” |
| “Try the problem before opening the solution” | “Answer locked until you prove mastery” |
| “Reference” | “Fatal traps” as a headline |
| “Study suggestion” | “Guaranteed exam readiness” |
| “Source answer” | unlabeled numeric answer shown beside prompt |

## Appendix C. Scope of this specification

This file is an implementable design and QA brief only. It does not state that any application code has been changed, that the final interface has been rendered, that accessibility testing has passed, or that the current course scope is known. The implementation phase must produce those results and report the evidence separately.
