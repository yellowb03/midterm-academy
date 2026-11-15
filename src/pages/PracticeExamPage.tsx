import React, { useEffect, useState } from 'react';
import { Timer, Play, Pause, ArrowCounterClockwise, CheckCircle, WarningOctagon, Eye } from '@phosphor-icons/react';
import { practiceQuestions } from '../data/practiceExam';
import { MathText } from '../components/MathText';
import { ExamDiagram } from '../components/ExamDiagram';

const surface = 'rounded-lg border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5';
const button = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[var(--rule-strong)] px-3 py-2 text-sm font-semibold hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]';

export const PracticeExamPage: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(90 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeQId, setActiveQId] = useState(practiceQuestions[0]?.id ?? 'Q1');
  const [revealedParts, setRevealedParts] = useState<Record<string, boolean>>({});
  const [partScores, setPartScores] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const formatClock = (secs: number) => `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  const activeQ = practiceQuestions.find((q) => q.id === activeQId) ?? practiceQuestions[0];
  const totalPossible = practiceQuestions.reduce((sum, q) => sum + q.points, 0);
  const totalEarned = practiceQuestions.reduce((sum, q) => sum + q.parts.reduce((partSum, part) => {
    const score = partScores[`${q.id}-${part.label}`];
    return partSum + (score === undefined || score === '' ? 0 : Number(score));
  }, 0), 0);
  const scoredParts = Object.values(partScores).filter((score) => score !== '').length;

  const togglePartReveal = (key: string) => setRevealedParts((prev) => ({ ...prev, [key]: !prev[key] }));
  const revealAllInQuestion = () => setRevealedParts((prev) => ({
    ...prev,
    ...Object.fromEntries(activeQ.parts.map((p) => [`${activeQ.id}-${p.label}`, true])),
  }));

  return <main className="space-y-6 text-[var(--ink)]">
    <header className="border-b border-[var(--rule)] pb-5">
      <p className="text-sm font-semibold text-[var(--forest)]">Exam practice</p>
      <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Practice simulation</h1>
      <p className="mt-2 max-w-3xl text-base leading-relaxed text-[var(--ink-secondary)]">Seven questions · {totalPossible} points in the current practice set. Work on paper, then choose when to review each solution and rubric.</p>
      <p className="mt-3 max-w-3xl rounded-md border border-[var(--caution-ink)] bg-[var(--caution-bg)] p-3 text-sm leading-relaxed"><strong>Timing note: </strong>The 90-minute timer is a simulation default. Official exam duration is not confirmed here.</p>
    </header>

    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,auto)]">
      <section className={`${surface} flex flex-wrap items-center justify-between gap-3`} aria-label="Simulation timer">
        <div className="flex items-center gap-3">
          <Timer size={21} aria-hidden="true" className="text-[var(--forest)]" />
          <div><div className="font-mono text-xl font-semibold tabular-nums" aria-live="off">{formatClock(secondsLeft)}</div><div className="text-sm text-[var(--ink-secondary)]">Simulation timer · 90 min default</div></div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setTimerRunning((r) => !r)} aria-label={timerRunning ? 'Pause simulation timer' : 'Start simulation timer'} className={button}>{timerRunning ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}{timerRunning ? 'Pause' : 'Start'}</button>
          <button type="button" onClick={() => { setTimerRunning(false); setSecondsLeft(90 * 60); }} aria-label="Reset simulation timer" className={button}><ArrowCounterClockwise size={17} aria-hidden="true" />Reset</button>
        </div>
      </section>
      <section className={`${surface} flex items-center justify-between gap-5`} aria-live="polite">
        <div><div className="font-serif text-2xl font-semibold tabular-nums">{totalEarned} / {totalPossible}</div><div className="text-sm text-[var(--ink-secondary)]">Self-entered rubric estimate</div></div>
        <div className="text-right text-sm text-[var(--ink-secondary)]">{scoredParts} of {practiceQuestions.reduce((n, q) => n + q.parts.length, 0)} parts scored</div>
      </section>
    </div>

    <nav aria-label="Practice questions" className="grid grid-cols-2 gap-x-4 sm:grid-cols-4 lg:grid-cols-7">
      {practiceQuestions.map((q) => {
        const active = q.id === activeQ.id;
        const qScore = q.parts.reduce((sum, part) => {
          const score = partScores[`${q.id}-${part.label}`];
          return sum + (score === undefined || score === '' ? 0 : Number(score));
        }, 0);
        const hasScore = q.parts.some((part) => partScores[`${q.id}-${part.label}`] !== undefined && partScores[`${q.id}-${part.label}`] !== '');
        return <button key={q.id} type="button" aria-current={active ? 'page' : undefined} onClick={() => setActiveQId(q.id)} className={`min-h-14 border-b-2 px-2 py-3 text-left focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] ${active ? 'border-[var(--forest)] bg-[var(--forest-tint)]' : 'border-[var(--rule)] hover:bg-[var(--surface-muted)]'}`}>
          <span className="block text-sm font-semibold">{q.id} · {q.points} pts</span><span className="mt-0.5 block text-xs text-[var(--ink-secondary)]">{hasScore ? `Self-scored ${qScore}/${q.points}` : 'Not scored'}</span>
        </button>;
      })}
    </nav>

    <article className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--rule)] pb-4">
        <div><p className="text-sm font-semibold text-[var(--ink-secondary)]">Problem {activeQ.number} · {activeQ.points} points</p><h2 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">{activeQ.title}</h2><div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--ink-secondary)]">{activeQ.topicTags.map((tag, i) => <span key={i}>{tag}</span>)}</div></div>
        <button type="button" onClick={revealAllInQuestion} className={button}><Eye size={17} aria-hidden="true" />Show all solutions for this question</button>
      </header>

      <div className="max-w-[74ch] text-base leading-relaxed"><MathText text={activeQ.stem} /></div>
      {activeQ.diagramType && <ExamDiagram type={activeQ.diagramType} />}

      <div className={surface}>
        <label htmlFor={`scratch-${activeQ.id}`} className="block text-sm font-semibold">Your working notes <span className="font-normal text-[var(--ink-secondary)]">(optional, stays in this page session)</span></label>
        <textarea id={`scratch-${activeQ.id}`} rows={4} value={notes[activeQ.id] ?? ''} onChange={(e) => setNotes((prev) => ({ ...prev, [activeQ.id]: e.target.value }))} placeholder="Set up equations, assumptions, or intermediate results here…" className="mt-2 w-full rounded-md border border-[var(--rule-strong)] bg-[var(--surface)] p-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]" />
      </div>

      <div className="space-y-5">{activeQ.parts.map((part) => {
        const key = `${activeQ.id}-${part.label}`;
        const revealed = !!revealedParts[key];
        const score = partScores[key] ?? '';
        return <section key={key} className="border-t border-[var(--rule)] pt-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="max-w-[74ch] text-base leading-relaxed"><span className="mr-2 font-semibold">{part.label} · {part.points} pts</span><MathText text={part.prompt} /></div>
            <button type="button" onClick={() => togglePartReveal(key)} aria-expanded={revealed} className={button}>{revealed ? 'Hide solution and rubric' : 'I have attempted this · show solution'}</button>
          </div>
          {revealed && <div className="mt-4 space-y-5 border-t border-[var(--rule)] pt-4">
            <ol className="divide-y divide-[var(--rule)]">{part.solutionSteps.map((st, idx) => <li key={idx} className="py-4"><h4 className="font-semibold">{idx + 1}. {st.title}</h4><div className="my-2 overflow-x-auto rounded-md bg-[var(--surface-muted)] px-3 py-2"><MathText text={st.math} /></div><p className="max-w-[74ch] text-sm leading-relaxed"><MathText text={st.reasoning} /></p></li>)}</ol>
            <div className="rounded-md bg-[var(--surface-muted)] p-3 text-sm leading-relaxed"><strong>Worked answer: </strong><MathText text={part.finalAnswer} /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><h4 className="font-semibold">Rubric criteria</h4><ul className="mt-2 divide-y divide-[var(--rule)]">{part.rubricItems.map((r, i) => <li key={i} className="flex justify-between gap-3 py-2 text-sm"><MathText text={r.criterion} /><span className="shrink-0 font-mono tabular-nums">{r.points} pt{r.points === 1 ? '' : 's'}</span></li>)}</ul></div>
              <div className="rounded-md border border-[var(--rule)] bg-[var(--surface-muted)] p-3">
                <h4 className="flex items-center gap-1.5 font-semibold"><WarningOctagon size={16} aria-hidden="true" />Common deductions</h4><p className="mt-2 text-sm leading-relaxed"><MathText text={part.deductionWarning} /></p>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-[var(--rule)] pt-3">
                  <div><label htmlFor={`score-${key}`} className="block text-sm font-semibold">Your rubric estimate</label><span className="text-xs text-[var(--ink-secondary)]">Enter a score after comparing your work</span></div>
                  <input id={`score-${key}`} type="number" min={0} max={part.points} step={0.5} value={score} onChange={(e) => { const value = e.target.value; const valid = value === '' ? '' : String(Math.max(0, Math.min(part.points, Number(value) || 0))); setPartScores((prev) => ({ ...prev, [key]: valid })); }} className="min-h-11 w-24 rounded-md border border-[var(--rule-strong)] bg-[var(--surface)] px-2 text-center font-mono tabular-nums focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]" />
                  <button type="button" onClick={() => setPartScores((prev) => ({ ...prev, [key]: String(part.points) }))} className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-[var(--success-ink)] hover:bg-[var(--success-bg)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"><CheckCircle size={16} aria-hidden="true" />Full points</button>
                </div>
              </div>
            </div>
          </div>}
        </section>;
      })}</div>
    </article>
  </main>;
};
