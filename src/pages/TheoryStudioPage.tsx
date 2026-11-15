import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  BookOpen,
  CheckCircle,
  Lightbulb,
  List,
  Question,
  WarningOctagon,
} from '@phosphor-icons/react';
import { theoryLessons } from '../data/theoryLessons';
import { LabId } from '../types';
import { MathText } from '../components/MathText';
import { FeedbackLab } from '../components/InteractiveLabs/FeedbackLab';
import { LinearizationLab } from '../components/InteractiveLabs/LinearizationLab';
import { LaplaceStepLab } from '../components/InteractiveLabs/LaplaceStepLab';
import { MotorPhysicsLab } from '../components/InteractiveLabs/MotorPhysicsLab';
import { BlockDiagramLab } from '../components/InteractiveLabs/BlockDiagramLab';
import { CompanionStateLab } from '../components/InteractiveLabs/CompanionStateLab';
import { TransitionMatrixLab } from '../components/InteractiveLabs/TransitionMatrixLab';

interface TheoryStudioPageProps {
  activeLessonId: string;
  onSelectLesson: (id: string) => void;
  completedLessons: string[];
  onToggleLessonComplete: (id: string) => void;
  onOpenProblem: (problemId: string) => void;
}

type Bite =
  | { id: string; title: string; kind: 'overview' }
  | { id: string; title: string; kind: 'model'; modelIndex: number }
  | { id: string; title: string; kind: 'section'; sectionIndex: number }
  | { id: string; title: string; kind: 'walkthrough'; stepIndex: number }
  | { id: string; title: string; kind: 'check'; checkIndex: number };

const renderLab = (labId: LabId) => {
  switch (labId) {
    case 'feedback': return <FeedbackLab />;
    case 'linearization': return <LinearizationLab />;
    case 'laplace': return <LaplaceStepLab />;
    case 'motor': return <MotorPhysicsLab />;
    case 'block-diagram': return <BlockDiagramLab />;
    case 'companion': return <CompanionStateLab />;
    case 'transition-matrix': return <TransitionMatrixLab />;
  }
};

const controlClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700';
const quietControlClass = `${controlClass} border-stone-300 bg-white text-stone-800 hover:bg-stone-100`;

export const TheoryStudioPage: React.FC<TheoryStudioPageProps> = ({
  activeLessonId,
  onSelectLesson,
  completedLessons,
  onToggleLessonComplete,
  onOpenProblem,
}) => {
  const lesson = theoryLessons.find((item) => item.id === activeLessonId) ?? theoryLessons[0];
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [activeBite, setActiveBite] = useState(0);
  const [fullReview, setFullReview] = useState(false);
  const currentHeadingRef = useRef<HTMLHeadingElement>(null);
  const isCompleted = completedLessons.includes(lesson.id);

  // Each bite points directly to existing lesson data. This keeps source wording,
  // equations, reasoning, and checks intact while avoiding a second content copy.
  const bites = useMemo<Bite[]>(() => [
    { id: 'overview', title: 'Start with the intuition', kind: 'overview' },
    ...lesson.mentalModel.map((model, modelIndex) => ({
      id: `model-${modelIndex + 1}`,
      title: `Mental model ${modelIndex + 1}`,
      kind: 'model' as const,
      modelIndex,
    })),
    ...lesson.sections.map((section, sectionIndex) => ({
      id: `section-${sectionIndex + 1}`,
      title: section.heading,
      kind: 'section' as const,
      sectionIndex,
    })),
    { id: 'walkthrough-context', title: lesson.workedWalkthrough.title, kind: 'walkthrough', stepIndex: 0 },
    ...lesson.workedWalkthrough.steps.map((step, stepIndex) => ({
      id: `walkthrough-${stepIndex + 1}`,
      title: step.title,
      kind: 'walkthrough' as const,
      stepIndex: stepIndex + 1,
    })),
    ...lesson.conceptChecks.map((check, checkIndex) => ({
      id: `check-${check.id}`,
      title: `Check ${checkIndex + 1}: ${check.question.replace(/\$[^$]*\$/g, '').slice(0, 52).trim()}${check.question.length > 52 ? '…' : ''}`,
      kind: 'check' as const,
      checkIndex,
    })),
  ], [lesson]);
  const selectedBiteIndex = Math.min(activeBite, bites.length - 1);

  useEffect(() => {
    setActiveBite(0);
    setFullReview(false);
  }, [lesson.id]);

  useEffect(() => {
    if (!fullReview) {
      currentHeadingRef.current?.focus({ preventScroll: true });
      currentHeadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeBite, fullReview, lesson.id]);

  const handleSelectLesson = (id: string) => {
    if (id !== lesson.id) {
      onSelectLesson(id);
      setActiveBite(0);
      setFullReview(false);
    }
  };

  const renderBiteContent = (bite: Bite) => {
    if (bite.kind === 'overview') {
      return <p className="max-w-3xl text-lg leading-8 text-stone-700"><MathText text={lesson.intuitionHook} /></p>;
    }

    if (bite.kind === 'model') {
      return <p className="max-w-3xl border-l-2 border-emerald-700 pl-5 text-xl leading-9 text-stone-800"><MathText text={lesson.mentalModel[bite.modelIndex]} /></p>;
    }

    if (bite.kind === 'section') {
      const section = lesson.sections[bite.sectionIndex];
      return (
        <div className="space-y-6">
          <p className="max-w-3xl whitespace-pre-line text-lg leading-8 text-stone-700"><MathText text={section.explanation} /></p>
          {section.math && <div className="overflow-x-auto border-y border-stone-300 py-5 text-stone-900"><MathText text={section.math} /></div>}
          <p className="max-w-3xl border-l-2 border-emerald-700 pl-4 text-base leading-7 text-stone-700"><span className="font-semibold text-stone-900">Why this works. </span><MathText text={section.whyItWorks} /></p>
          {section.visualNote && <p className="text-sm leading-6 text-stone-600"><span className="font-semibold">Visual cue: </span><MathText text={section.visualNote} /></p>}
        </div>
      );
    }

    if (bite.kind === 'walkthrough') {
      if (bite.stepIndex === 0) {
        return <p className="max-w-3xl text-lg leading-8 text-stone-700"><MathText text={lesson.workedWalkthrough.context} /></p>;
      }
      const step = lesson.workedWalkthrough.steps[bite.stepIndex - 1];
      return (
        <div className="space-y-5">
          {bite.stepIndex === 1 && <p className="max-w-3xl text-base leading-7 text-stone-600"><MathText text={lesson.workedWalkthrough.context} /></p>}
          <div className="overflow-x-auto border-y border-stone-300 py-5 text-stone-900"><MathText text={step.math} /></div>
          <p className="max-w-3xl text-lg leading-8 text-stone-700"><MathText text={step.reasoning} /></p>
          {step.tip && <p className="max-w-3xl text-base leading-7 text-stone-600"><span className="font-semibold text-stone-900">Method note. </span><MathText text={step.tip} /></p>}
          {bite.stepIndex === lesson.workedWalkthrough.steps.length && <p className="max-w-3xl border-l-2 border-emerald-700 pl-4 text-base leading-7 text-stone-700"><span className="font-semibold text-stone-900">Takeaway. </span><MathText text={lesson.workedWalkthrough.takeaway} /></p>}
        </div>
      );
    }

    const check = lesson.conceptChecks[bite.checkIndex];
    const picked = mcqAnswers[check.id];
    return (
      <div className="max-w-3xl space-y-5">
        <p className="text-lg leading-8 text-stone-800"><MathText text={check.question} /></p>
        <div className="grid gap-3 sm:grid-cols-2">
          {check.choices.map((choice, choiceIndex) => {
            const selected = picked === choiceIndex;
            const statusClass = picked === undefined ? 'border-stone-300 hover:border-emerald-700 hover:bg-emerald-50' : selected && choice.correct ? 'border-emerald-700 bg-emerald-50' : selected ? 'border-rose-700 bg-rose-50' : choice.correct ? 'border-emerald-700 bg-emerald-50/60' : 'border-stone-200 text-stone-500';
            return <button key={choiceIndex} type="button" onClick={() => setMcqAnswers((previous) => ({ ...previous, [check.id]: choiceIndex }))} aria-pressed={selected} className={`min-h-14 rounded-md border p-4 text-left text-base leading-6 text-stone-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${statusClass}`}><MathText text={choice.text} /></button>;
          })}
        </div>
        {picked !== undefined && <p className={`border-l-2 pl-4 text-base leading-7 ${check.choices[picked].correct ? 'border-emerald-700 text-stone-700' : 'border-rose-700 text-stone-700'}`}><MathText text={check.choices[picked].feedback} /></p>}
        <p className="text-sm text-stone-500">You can continue at any time; this check does not gate the lesson.</p>
      </div>
    );
  };

  const renderBite = (bite: Bite, index: number, selected = false) => (
    <article key={bite.id} className={fullReview ? 'border-b border-stone-300 py-10 first:pt-0 last:border-b-0' : 'min-h-[340px]'}>
      <div className="mb-4 text-sm font-semibold tracking-wide text-emerald-800">Bite {index + 1} of {bites.length}</div>
      <h2 ref={selected ? currentHeadingRef : undefined} tabIndex={selected ? -1 : undefined} id={`theory-bite-${bite.id}`} className="mb-5 max-w-4xl scroll-mt-20 font-serif text-3xl leading-tight tracking-tight text-stone-950 sm:text-4xl">{bite.title}</h2>
      {bite.kind === 'check' && <div className="mb-4 flex items-center gap-2 text-sm font-medium text-stone-600"><Question size={18} /> Practice check · optional</div>}
      {renderBiteContent(bite)}
    </article>
  );

  const renderOutline = (compact = false) => (
    <nav aria-label="Lesson outline" className={compact ? 'space-y-1' : 'sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2'}>
      {!compact && <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">On this lesson</p>}
      {bites.map((bite, index) => <button key={bite.id} type="button" onClick={() => { setActiveBite(index); setFullReview(false); }} aria-current={!fullReview && selectedBiteIndex === index ? 'step' : undefined} className={`block w-full rounded px-3 py-2 text-left text-sm leading-5 ${selectedBiteIndex === index && !fullReview ? 'bg-emerald-50 font-semibold text-emerald-900' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'}`}><span className="mr-2 text-xs text-stone-400">{index + 1}</span>{bite.title}</button>)}
    </nav>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-stone-300 pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600"><Atom size={17} />Lesson {lesson.number} · {lesson.chapterTag} · {lesson.examWeight}</div>
          <h1 className="font-serif text-3xl leading-tight tracking-tight text-stone-950 sm:text-4xl"><MathText text={lesson.title} /></h1>
          <p className="mt-2 max-w-3xl text-base leading-7 text-stone-600"><MathText text={lesson.subtitle} /></p>
        </div>
        <button type="button" onClick={() => onToggleLessonComplete(lesson.id)} className={`${quietControlClass} ${isCompleted ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : ''}`}><CheckCircle size={18} weight={isCompleted ? 'fill' : 'regular'} />{isCompleted ? 'Lesson completed' : 'Mark lesson complete'}</button>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <details className="rounded-md border border-stone-300 bg-white p-3">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-stone-800"><BookOpen size={18} />Other core lessons</summary>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">{theoryLessons.map((item) => {
            const active = item.id === lesson.id;
            const done = completedLessons.includes(item.id);
            return <button key={item.id} type="button" onClick={() => handleSelectLesson(item.id)} aria-current={active ? 'page' : undefined} className={`flex min-h-14 items-center justify-between gap-3 rounded-md border px-4 py-3 text-left ${active ? 'border-emerald-800 bg-emerald-50 text-emerald-950' : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-100'}`}><span><span className="mr-2 text-sm text-stone-500">{item.number}.</span><MathText text={item.title} /></span>{done && <CheckCircle size={18} weight="fill" className="shrink-0 text-emerald-800" />}</button>;
          })}</div>
        </details>
        <details className="rounded-md border border-stone-300 bg-white p-3 lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-stone-800"><List size={18} /> On this lesson</summary>
          <div className="mt-3">{renderOutline(true)}</div>
        </details>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-md border border-stone-300 bg-white p-1" aria-label="Lesson display mode">
            <button type="button" onClick={() => setFullReview(false)} aria-pressed={!fullReview} className={`min-h-10 rounded px-3 text-sm font-semibold ${!fullReview ? 'bg-emerald-800 text-white' : 'text-stone-700 hover:bg-stone-100'}`}>One bite at a time</button>
            <button type="button" onClick={() => setFullReview(true)} aria-pressed={fullReview} className={`min-h-10 rounded px-3 text-sm font-semibold ${fullReview ? 'bg-emerald-800 text-white' : 'text-stone-700 hover:bg-stone-100'}`}>Full lesson review</button>
          </div>
          <span className="text-sm text-stone-500">{fullReview ? 'All lesson bites' : `Bite ${selectedBiteIndex + 1} of ${bites.length}`}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">{renderOutline()}</aside>
        <main aria-label="Lesson content" className="min-w-0">
          <div className="border-y border-stone-300 bg-[#faf9f6] px-5 py-8 sm:px-8 sm:py-10">
            {fullReview ? bites.map((bite, index) => renderBite(bite, index)) : renderBite(bites[selectedBiteIndex], selectedBiteIndex, true)}
            {!fullReview && <div className="mt-10 flex items-center justify-between gap-3 border-t border-stone-300 pt-5">
              <button type="button" disabled={selectedBiteIndex === 0} onClick={() => setActiveBite((current) => Math.max(0, current - 1))} className={`${quietControlClass} disabled:cursor-not-allowed disabled:opacity-40`}><ArrowLeft size={17} />Previous</button>
              {selectedBiteIndex < bites.length - 1 ? <button type="button" onClick={() => setActiveBite((current) => Math.min(bites.length - 1, current + 1))} className={`${controlClass} border-emerald-800 bg-emerald-800 text-white hover:bg-emerald-900`}>Continue<ArrowRight size={17} /></button> : <span className="text-sm font-medium text-stone-600">End of lesson bites</span>}
            </div>}
          </div>

          <div className="mt-8 space-y-5">
            <details className="border-b border-stone-300 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-serif text-2xl text-stone-900"><span>{lesson.labTitle}</span><span className="text-sm font-sans font-medium text-emerald-800">Open interactive lab</span></summary>
              <p className="my-4 max-w-3xl text-base leading-7 text-stone-600"><MathText text={lesson.labPrompt} /></p>
              <div className="rounded-md border border-stone-300 bg-white p-4 sm:p-6">{renderLab(lesson.labId)}</div>
            </details>

            <details className="border-b border-stone-300 py-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-serif text-2xl text-stone-900"><Lightbulb size={22} />Shortcuts, traps, and formulas</summary>
              <div className="mt-5 grid gap-6 md:grid-cols-3">
                <div><h3 className="mb-2 font-semibold text-stone-900">Shortcuts</h3><ul className="space-y-2 text-base leading-7 text-stone-700">{lesson.tipsAndTraps.shortcuts.map((tip, index) => <li key={index}><MathText text={tip} /></li>)}</ul></div>
                <div><h3 className="mb-2 flex items-center gap-2 font-semibold text-stone-900"><WarningOctagon size={18} />Common traps</h3><ul className="space-y-2 text-base leading-7 text-stone-700">{lesson.tipsAndTraps.traps.map((tip, index) => <li key={index}><MathText text={tip} /></li>)}</ul></div>
                <div><h3 className="mb-2 font-semibold text-stone-900">Remember</h3><ul className="space-y-2 text-base leading-7 text-stone-700">{lesson.tipsAndTraps.memorize.map((tip, index) => <li key={index}><MathText text={tip} /></li>)}</ul></div>
              </div>
            </details>

            <section className="flex flex-wrap items-center justify-between gap-4 py-4" aria-labelledby="related-problems-heading">
              <div><h2 id="related-problems-heading" className="font-serif text-2xl text-stone-900">Practice this lesson</h2><p className="mt-1 text-stone-600">Related problems are available whenever you are ready.</p></div>
              <div className="flex flex-wrap gap-2">{lesson.relatedProblemIds.map((problemId) => <button key={problemId} type="button" onClick={() => onOpenProblem(problemId)} className={quietControlClass}>{problemId}<ArrowRight size={16} /></button>)}</div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};
