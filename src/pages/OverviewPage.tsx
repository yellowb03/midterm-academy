import React, { useState } from 'react';
import { ArrowRight, CaretDown, CaretUp } from '@phosphor-icons/react';
import { studyPlans } from '../data/curriculum';
import { theoryLessons } from '../data/theoryLessons';
import { homeworkProblems } from '../data/homeworkProblems';
import { RecognitionFlowchart } from '../components/RecognitionFlowchart';
import { MathText } from '../components/MathText';
import type { PageTab } from '../components/TopNav';

export interface ResumeTarget {
  kind: 'lesson' | 'problem';
  id: string;
}

export type HomeTool = 'plan' | 'classifier' | null;

interface OverviewPageProps {
  onNavigateTab: (tab: PageTab) => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenProblem: (problemId: string) => void;
  completedLessons: string[];
  checkedBlocks: string[];
  onToggleStudyBlock: (blockKey: string) => void;
  resumeTarget: ResumeTarget | null;
  activeTool: HomeTool;
  onToggleTool: (tool: HomeTool) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateTab,
  onOpenLesson,
  onOpenProblem,
  completedLessons,
  checkedBlocks,
  onToggleStudyBlock,
  resumeTarget,
  activeTool,
  onToggleTool,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState('3h');
  const selectedPlan = studyPlans.find((plan) => plan.id === selectedPlanId) ?? studyPlans[0];
  const resumeLesson = resumeTarget?.kind === 'lesson'
    ? theoryLessons.find((lesson) => lesson.id === resumeTarget.id)
    : undefined;
  const resumeProblem = resumeTarget?.kind === 'problem'
    ? homeworkProblems.find((problem) => problem.id === resumeTarget.id)
    : undefined;
  const resumeLabel = resumeLesson?.title ?? resumeProblem?.title;
  const onResume = () => {
    if (resumeLesson) onOpenLesson(resumeLesson.id);
    else if (resumeProblem) onOpenProblem(resumeProblem.id);
    else onOpenLesson(theoryLessons[0].id);
  };

  return (
    <main className="academy-home">
      <section className="home-intro" aria-labelledby="home-title">
        <p className="home-eyebrow">NCKU · F030100</p>
        <h1 id="home-title" tabIndex={-1} className="display-face">Automatic Control</h1>
        <p className="home-deck">Lessons, worked problems, a practice exam, and reference material for this course.</p>
      </section>

      <section className="resume-panel" aria-labelledby="resume-title">
        <div>
          <p className="home-eyebrow">Your study desk</p>
          <h2 id="resume-title">{resumeLabel ? 'Continue learning' : 'Begin with the first lesson'}</h2>
          <p>{resumeLabel ? <><span className="resume-kind">{resumeLesson ? `Lesson ${resumeLesson.number}` : resumeProblem?.code}</span> · {resumeLabel}</> : 'Start with feedback principles, or browse the full course sequence below.'}</p>
        </div>
        <button type="button" className="academy-button" onClick={onResume}>
          {resumeLabel ? 'Continue' : 'Start lesson'} <ArrowRight size={17} weight="bold" />
        </button>
      </section>

      <section className="curriculum-section" aria-labelledby="curriculum-title">
        <div className="section-heading">
          <div>
            <p className="home-eyebrow">Course sequence</p>
            <h2 id="curriculum-title" className="display-face">Seven lessons</h2>
          </div>
          <button type="button" className="text-link" onClick={() => onNavigateTab('theory')}>Browse Learn <ArrowRight size={15} /></button>
        </div>
        <ol className="curriculum-list">
          {theoryLessons.map((lesson) => {
            const complete = completedLessons.includes(lesson.id);
            const inProgress = resumeTarget?.kind === 'lesson' && resumeTarget.id === lesson.id && !complete;
            return (
              <li key={lesson.id}>
                <button type="button" className="curriculum-row" onClick={() => onOpenLesson(lesson.id)}>
                  <span className="curriculum-number">{String(lesson.number).padStart(2, '0')}</span>
                  <span className="curriculum-copy">
                    <span className="curriculum-chapter">{lesson.chapterTag.replace(/Chapter\s+\d+\s*[·.]?\s*/i, '')}</span>
                    <span className="curriculum-title"><MathText text={lesson.title} /></span>
                    <span className="curriculum-focus"><MathText text={lesson.subtitle} /></span>
                  </span>
                  <span className={`curriculum-status${complete ? ' is-complete' : ''}`}>
                    {complete ? 'Marked complete' : inProgress ? 'In progress' : 'Not started'}
                  </span>
                  <ArrowRight className="curriculum-arrow" size={18} />
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="tools-section" aria-labelledby="tools-title">
        <div className="section-heading">
          <div>
            <p className="home-eyebrow">Along the way</p>
            <h2 id="tools-title" className="display-face">Study tools</h2>
          </div>
        </div>
        <div className="tool-links">
          <button type="button" onClick={() => onNavigateTab('problems')}>Practice problems <ArrowRight size={15} /></button>
          <button type="button" onClick={() => onNavigateTab('exam')}>Practice exam <ArrowRight size={15} /></button>
          <button type="button" onClick={() => onNavigateTab('cheatsheet')}>Reference <ArrowRight size={15} /></button>
          <button type="button" aria-expanded={activeTool === 'classifier'} onClick={() => onToggleTool(activeTool === 'classifier' ? null : 'classifier')}>Problem classifier {activeTool === 'classifier' ? <CaretUp size={15} /> : <CaretDown size={15} />}</button>
          <button type="button" aria-expanded={activeTool === 'plan'} onClick={() => onToggleTool(activeTool === 'plan' ? null : 'plan')}>Study plan {activeTool === 'plan' ? <CaretUp size={15} /> : <CaretDown size={15} />}</button>
        </div>
        {activeTool === 'classifier' && (
          <div className="utility-panel">
            <div className="utility-heading"><h3>Problem classifier</h3><p>A study aid for choosing a method from the features in a problem.</p></div>
            <RecognitionFlowchart onNavigateToLesson={onOpenLesson} onNavigateToProblem={onOpenProblem} />
          </div>
        )}
        {activeTool === 'plan' && (
          <div className="utility-panel">
            <div className="utility-heading"><h3>Choose a study block</h3><p>A suggested sequence for the time you have; it does not guarantee exam readiness.</p></div>
            <div className="plan-tabs" role="group" aria-label="Study plan duration">
              {studyPlans.map((plan) => <button key={plan.id} type="button" className={selectedPlanId === plan.id ? 'is-selected' : ''} aria-pressed={selectedPlanId === plan.id} onClick={() => setSelectedPlanId(plan.id)}>{plan.name.split(' ')[0]} · {plan.duration.split(' ')[0]}</button>)}
            </div>
            <p className="plan-summary">{selectedPlan.subtitle}</p>
            <ol className="plan-list">
              {selectedPlan.blocks.map((block, index) => {
                const key = `${selectedPlan.id}-${index}`;
                const checked = checkedBlocks.includes(key);
                return <li key={key} className={checked ? 'is-checked' : ''}>
                  <label><input type="checkbox" checked={checked} onChange={() => onToggleStudyBlock(key)} /><span className="plan-time">{block.time}</span><span className="plan-focus"><MathText text={block.focus} /></span></label>
                  <span className="plan-duration">{block.duration}</span>
                  {block.targetIds.length > 0 && <div className="plan-targets">{block.targetIds.map((id) => <button key={id} type="button" onClick={() => onOpenProblem(id)}>{id}</button>)}</div>}
                </li>;
              })}
            </ol>
          </div>
        )}
      </section>

      <aside className="scope-note" aria-labelledby="scope-title">
        <div className="scope-marker" aria-hidden="true">i</div>
        <div><p className="home-eyebrow">Course scope</p><h2 id="scope-title">Materials and exam coverage</h2>
          <p>The available course materials identified in this academy cover Chapters 1–3 and Homework 1–4. Whether Chapters 4–6 are included on the midterm remains unresolved; confirm the current scope with the instructor or TA.</p>
          <button type="button" className="text-link" onClick={() => onNavigateTab('cheatsheet')}>See course notes in Reference <ArrowRight size={15} /></button>
        </div>
      </aside>

      <style>{`
        .academy-home { --home-rule: var(--rule); }
        .academy-home h1, .academy-home h2, .academy-home h3, .academy-home p { margin-top: 0; }
        .home-intro { padding: 8px 0 28px; }
        .home-eyebrow { margin-bottom: 7px !important; color: var(--forest); font-size: 11px; font-weight: 700; letter-spacing: .12em; line-height: 1.3; text-transform: uppercase; }
        .home-intro h1 { margin-bottom: 9px; font-size: clamp(38px, 6vw, 54px); font-weight: 500; letter-spacing: -.035em; line-height: 1.08; }
        .home-deck { max-width: 60ch; margin-bottom: 0; color: var(--ink-soft); font-size: 18px; line-height: 1.5; }
        .resume-panel { display: flex; align-items: center; justify-content: space-between; gap: 24px; border-block: 1px solid var(--rule); padding: 20px 0; }
        .resume-panel h2 { margin-bottom: 3px; font-size: 19px; font-weight: 600; }
        .resume-panel p:not(.home-eyebrow) { margin-bottom: 0; color: var(--ink-soft); font-size: 15px; }
        .resume-kind { color: var(--ink); font-weight: 600; }
        .curriculum-section, .tools-section { margin-top: 52px; }
        .section-heading { display: flex; justify-content: space-between; align-items: end; gap: 16px; margin-bottom: 13px; }
        .section-heading h2 { margin-bottom: 0; font-size: 29px; font-weight: 500; line-height: 1.2; }
        .text-link { display: inline-flex; min-height: 40px; align-items: center; gap: 7px; border: 0; padding: 4px 0; background: transparent; color: var(--forest-dark); font-size: 14px; font-weight: 600; text-decoration: underline; text-decoration-color: #9aab9e; text-underline-offset: 3px; cursor: pointer; }
        .text-link:hover { text-decoration-color: currentColor; }
        .curriculum-list { margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--rule); }
        .curriculum-list li { border-bottom: 1px solid var(--rule); }
        .curriculum-row { display: grid; width: 100%; min-height: 86px; grid-template-columns: 48px minmax(0, 1fr) auto 20px; align-items: center; gap: 16px; border: 0; padding: 13px 4px; background: transparent; text-align: left; cursor: pointer; }
        .curriculum-row:hover { background: rgba(49,87,70,.045); }
        .curriculum-number { align-self: start; padding-top: 4px; color: #8a8d83; font-family: "Source Serif 4", Georgia, serif; font-size: 20px; }
        .curriculum-copy { display: grid; min-width: 0; gap: 2px; }
        .curriculum-chapter { color: var(--ink-faint); font-size: 12px; }
        .curriculum-title { color: var(--ink); font-size: 17px; font-weight: 600; }
        .curriculum-focus { overflow: hidden; color: var(--ink-soft); font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
        .curriculum-status { color: var(--ink-faint); font-size: 13px; white-space: nowrap; }
        .curriculum-status.is-complete { color: var(--forest-dark); }
        .curriculum-arrow { color: #84887e; }
        .tool-links { display: flex; flex-wrap: wrap; border-block: 1px solid var(--rule); }
        .tool-links button { display: inline-flex; min-height: 52px; align-items: center; gap: 7px; border: 0; border-right: 1px solid var(--rule); padding: 0 18px; background: transparent; color: var(--forest-dark); font-size: 14px; font-weight: 600; cursor: pointer; }
        .tool-links button:first-child { padding-left: 0; }
        .tool-links button:hover { text-decoration: underline; text-underline-offset: 3px; }
        .utility-panel { margin-top: 18px; border: 1px solid var(--rule); border-radius: 6px; padding: 20px; background: var(--paper-raised); }
        .utility-heading h3 { margin-bottom: 3px; font-family: "Source Serif 4", Georgia, serif; font-size: 21px; font-weight: 500; }
        .utility-heading p, .plan-summary { margin-bottom: 16px; color: var(--ink-soft); font-size: 14px; }
        .plan-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 13px; }
        .plan-tabs button, .plan-targets button { min-height: 38px; border: 1px solid var(--rule); border-radius: 4px; padding: 6px 11px; background: var(--paper); color: var(--ink-soft); font-size: 13px; cursor: pointer; }
        .plan-tabs button.is-selected { border-color: var(--forest); background: var(--forest-wash); color: var(--forest-dark); }
        .plan-list { margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--rule); }
        .plan-list li { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 16px; border-bottom: 1px solid var(--rule); padding: 12px 0; }
        .plan-list label { display: flex; align-items: start; gap: 10px; color: var(--ink); }
        .plan-list input { width: 18px; height: 18px; margin: 1px 0 0; accent-color: var(--forest); }
        .plan-time { flex: 0 0 104px; color: var(--ink-faint); font-size: 12px; font-variant-numeric: tabular-nums; }
        .plan-focus { font-size: 14px; }
        .plan-list .is-checked .plan-focus { color: var(--ink-faint); text-decoration: line-through; }
        .plan-duration { color: var(--ink-faint); font-size: 12px; }
        .plan-targets { grid-column: 1 / -1; display: flex; gap: 6px; padding-left: 28px; }
        .plan-targets button { min-height: 30px; padding: 3px 8px; }
        .scope-note { display: grid; grid-template-columns: 32px 1fr; gap: 14px; margin-top: 44px; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 22px 0; }
        .scope-marker { display: grid; width: 26px; height: 26px; place-items: center; border: 1px solid #a8b7aa; border-radius: 50%; color: var(--forest-dark); font-family: Georgia, serif; font-weight: 700; }
        .scope-note h2 { margin-bottom: 5px; font-size: 18px; font-weight: 600; }
        .scope-note p:not(.home-eyebrow) { max-width: 78ch; margin-bottom: 6px; color: var(--ink-soft); font-size: 14px; line-height: 1.55; }
        @media (max-width: 640px) {
          .home-intro { padding-top: 0; }
          .home-deck { font-size: 16px; }
          .resume-panel { align-items: flex-start; flex-direction: column; gap: 14px; }
          .resume-panel .academy-button { width: 100%; }
          .curriculum-section, .tools-section { margin-top: 40px; }
          .curriculum-row { grid-template-columns: 32px minmax(0, 1fr) 18px; gap: 10px; padding-block: 12px; }
          .curriculum-status { grid-column: 2; grid-row: 2; margin-top: 2px; font-size: 12px; }
          .curriculum-arrow { grid-column: 3; grid-row: 1 / span 2; }
          .curriculum-title { font-size: 16px; }
          .curriculum-focus { max-width: calc(100vw - 105px); }
          .tool-links { display: grid; grid-template-columns: 1fr 1fr; }
          .tool-links button { justify-content: space-between; border-right: 0; border-bottom: 1px solid var(--rule); padding-inline: 8px; text-align: left; }
          .tool-links button:first-child { padding-left: 8px; }
          .tool-links button:nth-child(odd) { border-right: 1px solid var(--rule); }
          .tool-links button:last-child { grid-column: 1 / -1; border-bottom: 0; }
          .utility-panel { padding: 14px; }
          .plan-list li { grid-template-columns: 1fr; }
          .plan-duration { padding-left: 28px; }
          .plan-time { flex-basis: 92px; }
          .scope-note { margin-top: 34px; }
        }
      `}</style>
    </main>
  );
};
