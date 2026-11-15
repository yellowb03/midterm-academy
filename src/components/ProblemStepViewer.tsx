import React, { useState } from 'react';
import { CheckCircle, Eye, Lightbulb, WarningOctagon, BookmarkSimple, CaretRight, Brain, Sparkle, Target } from '@phosphor-icons/react';
import { HomeworkProblem } from '../types';
import { MathText } from './MathText';
import { ProblemVisual } from './ProblemVisual';

interface ProblemStepViewerProps {
  problem: HomeworkProblem;
  isMastered: boolean;
  onToggleMastered: (id: string) => void;
}

const surface = 'rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5';
const quiet = 'rounded-md border border-[var(--rule)] bg-[var(--surface-muted)] p-3';
const action = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--forest)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--forest-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]';

export const ProblemStepViewer: React.FC<ProblemStepViewerProps> = ({ problem, isMastered, onToggleMastered }) => {
  const [revealedCount, setRevealedCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showBookAnswer, setShowBookAnswer] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showHints, setShowHints] = useState(false);
  const allStepsRevealed = revealedCount >= problem.steps.length;

  return <div className="space-y-6 text-[var(--ink)]">
    <article className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div>
          <p className="text-sm font-semibold text-[var(--ink-secondary)]">{problem.hw} · {problem.typeLabel} · {problem.source}</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">{problem.code}: {problem.title}</h2>
          <p className="mt-2 text-sm text-[var(--ink-secondary)]">Difficulty {problem.difficulty}/5 · {problem.priority.toLowerCase()} priority</p>
        </div>
        <button type="button" onClick={() => onToggleMastered(problem.id)} aria-pressed={isMastered} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--rule-strong)] px-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]">
          <CheckCircle size={18} weight={isMastered ? 'fill' : 'regular'} className={isMastered ? 'text-[var(--success-ink)]' : ''} />
          {isMastered ? 'Marked complete' : 'Mark as complete'}
        </button>
      </header>

      <section aria-labelledby="problem-statement-heading" className="max-w-[74ch]">
        <h3 id="problem-statement-heading" className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-secondary)]">Problem statement</h3>
        <div className="mt-2 text-base leading-relaxed"><MathText text={problem.originalStatement} /></div>
        <div className="mt-4" data-problem-visual><ProblemVisual problemId={problem.code} problemTitle={problem.title} /></div>
        {problem.bookAnswer && <div className="mt-4 border-t border-[var(--rule)] pt-3">
          <button type="button" onClick={() => setShowBookAnswer((v) => !v)} aria-expanded={showBookAnswer} className="min-h-11 rounded px-2 text-sm font-semibold text-[var(--forest)] hover:bg-[var(--forest-tint)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]">{showBookAnswer ? 'Hide book answer' : 'Show book answer'}</button>
          {showBookAnswer && <p className="mt-2 text-sm leading-relaxed"><span className="font-semibold">Book answer: </span><MathText text={problem.bookAnswer} /></p>}
        </div>}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className={quiet} aria-labelledby="given-heading">
          <h3 id="given-heading" className="text-sm font-semibold">Given</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">{problem.given.map((item, idx) => <li key={idx}><MathText text={item} /></li>)}</ul>
        </section>
        <section className={quiet} aria-labelledby="find-heading">
          <h3 id="find-heading" className="text-sm font-semibold">Find</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">{problem.find.map((item, idx) => <li key={idx}><MathText text={item} /></li>)}</ul>
        </section>
      </div>
      <p className="max-w-[74ch] text-sm leading-relaxed text-[var(--ink-secondary)]"><Brain size={17} weight="duotone" aria-hidden="true" className="mr-1 inline align-[-3px] text-[var(--forest)]" /><span className="font-semibold text-[var(--ink)]">Start with the model: </span><MathText text={problem.coreIntuition} /></p>
      <p className="max-w-[74ch] border-l-2 border-[var(--forest)] pl-3 text-sm leading-relaxed">Take a moment to set up the problem on paper. Open a hint or solution whenever it would help.</p>
    </article>

    {problem.quickCheck && <section className={surface} aria-labelledby="quick-check-heading">
      <div className="flex items-center gap-2"><Target size={18} aria-hidden="true" className="text-[var(--forest)]" /><h3 id="quick-check-heading" className="font-serif text-xl font-semibold">Quick check</h3></div>
      <p className="mt-2 text-base leading-relaxed"><MathText text={problem.quickCheck.question} /></p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">{problem.quickCheck.options.map((opt, idx) => {
        const picked = selectedChoice === idx;
        const correct = idx === problem.quickCheck!.correctIndex;
        const feedback = selectedChoice !== null;
        const cls = !feedback ? 'border-[var(--rule-strong)] hover:bg-[var(--surface-muted)]' : correct ? 'border-[var(--success-ink)] bg-[var(--success-bg)]' : picked ? 'border-[var(--error-ink)] bg-[var(--error-bg)]' : 'border-[var(--rule)]';
        return <button key={idx} type="button" aria-pressed={picked} onClick={() => setSelectedChoice(idx)} className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${cls}`}><MathText text={opt} /></button>;
      })}</div>
      {selectedChoice !== null && <p className={`mt-3 rounded-md border p-3 text-sm leading-relaxed ${selectedChoice === problem.quickCheck.correctIndex ? 'border-[var(--success-ink)] bg-[var(--success-bg)]' : 'border-[var(--caution-ink)] bg-[var(--caution-bg)]'}`} role="status"><strong>{selectedChoice === problem.quickCheck.correctIndex ? 'Correct. ' : 'Review this idea. '}</strong><MathText text={problem.quickCheck.explanation} /></p>}
    </section>}

    <section className={surface} aria-labelledby="solution-heading">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--rule)] pb-4">
        <div><h3 id="solution-heading" className="font-serif text-xl font-semibold">Worked solution</h3><p className="mt-1 text-sm text-[var(--ink-secondary)]">Each step pairs the mathematics with its reasoning.</p></div>
        <div className="flex flex-wrap gap-2">
          {revealedCount > 0 && <button type="button" onClick={() => { setRevealedCount(0); setShowAnswer(false); }} className="min-h-11 rounded-md border border-[var(--rule-strong)] px-3 text-sm font-medium hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]">Reset steps</button>}
          <button type="button" onClick={() => setRevealedCount(problem.steps.length)} className={action}><Eye size={17} aria-hidden="true" /> Show all steps</button>
        </div>
      </div>
      {revealedCount === 0 ? <div className="py-4"><button type="button" onClick={() => setRevealedCount(1)} className={action}><Eye size={17} aria-hidden="true" /> Reveal step 1 of {problem.steps.length}<CaretRight size={15} aria-hidden="true" /></button></div> : <ol className="divide-y divide-[var(--rule)]">{problem.steps.slice(0, revealedCount).map((step, idx) => <li key={idx} className="py-5">
        <h4 className="font-semibold">{idx + 1}. {step.title}</h4>
        <div className="my-3 overflow-x-auto rounded-md bg-[var(--surface-muted)] px-4 py-3"><MathText text={step.math} className="text-base" /></div>
        <p className="max-w-[74ch] text-sm leading-relaxed"><span className="font-semibold">Reasoning: </span><MathText text={step.reasoning} /></p>
        {step.tip && <p className="mt-3 text-sm leading-relaxed text-[var(--ink-secondary)]"><Sparkle size={16} aria-hidden="true" className="mr-1 inline text-[var(--forest)]" /><MathText text={step.tip} /></p>}
      </li>)}</ol>}
      {revealedCount > 0 && !allStepsRevealed && <button type="button" onClick={() => setRevealedCount((c) => Math.min(c + 1, problem.steps.length))} className={`${action} mt-3`}><Eye size={17} aria-hidden="true" /> Reveal step {revealedCount + 1} of {problem.steps.length}<CaretRight size={15} aria-hidden="true" /></button>}
      <div className="mt-4 border-t border-[var(--rule)] pt-3">
        <button type="button" onClick={() => { if (!allStepsRevealed) setShowAnswer((v) => !v); }} aria-expanded={showAnswer || allStepsRevealed} className="min-h-11 rounded px-2 text-sm font-semibold text-[var(--forest)] hover:bg-[var(--forest-tint)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]">{allStepsRevealed ? 'Final answer included below' : showAnswer ? 'Hide final answer' : 'Show final answer'}</button>
        {(showAnswer || allStepsRevealed) && <div className="mt-2 rounded-md border border-[var(--rule)] bg-[var(--surface-muted)] p-3 text-sm leading-relaxed"><strong>Worked solution answer: </strong><MathText text={problem.finalAnswer} /></div>}
      </div>
    </section>

    <section className={surface}>
      <button type="button" onClick={() => setShowHints((v) => !v)} aria-expanded={showHints} className="flex min-h-11 w-full items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"><span className="flex items-center gap-2 font-serif text-xl font-semibold"><Lightbulb size={19} weight="duotone" aria-hidden="true" className="text-[var(--forest)]" />Method notes</span><span className="text-sm font-semibold text-[var(--forest)]">{showHints ? 'Hide' : 'Show'}</span></button>
      {showHints && <div className="mt-4 grid gap-x-6 gap-y-4 border-t border-[var(--rule)] pt-4 sm:grid-cols-2">
        <div><h4 className="text-sm font-semibold">Recognition cue</h4><p className="mt-1 text-sm leading-relaxed"><MathText text={problem.recognizeCue} /></p></div>
        <div><h4 className="text-sm font-semibold">Shortcut</h4><p className="mt-1 text-sm leading-relaxed"><MathText text={problem.shortcut} /></p></div>
        <div><h4 className="flex items-center gap-1.5 text-sm font-semibold"><WarningOctagon size={16} aria-hidden="true" /> Common mistakes</h4><ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">{problem.commonMistakes.map((m, idx) => <li key={idx}><MathText text={m} /></li>)}</ul></div>
        <div><h4 className="flex items-center gap-1.5 text-sm font-semibold"><BookmarkSimple size={16} aria-hidden="true" /> Key takeaway</h4><p className="mt-1 text-sm leading-relaxed"><MathText text={problem.memorize} /></p></div>
      </div>}
    </section>
  </div>;
};
