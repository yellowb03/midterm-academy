import React, { useState } from 'react';
import {
  ArrowCounterClockwise,
  ArrowRight,
  BookOpen,
  CaretRight,
  CheckCircle,
  ClipboardText,
  Compass,
  GitBranch,
  Lightning,
  MagnifyingGlass,
  Sliders,
  Sparkle,
} from '@phosphor-icons/react';
import { flowchartSymptoms } from '../data/curriculum';
import { FlowchartSymptom, ProblemTypeCode } from '../types';
import { MathText } from './MathText';

export interface RecognitionFlowchartProps {
  onNavigateToLesson?: (lessonId: string) => void;
  onNavigateToProblem?: (problemId: string) => void;
}

const PROBLEM_TYPE_STYLES: Record<
  ProblemTypeCode,
  { badge: string; border: string; glow: string }
> = {
  A: {
    badge: 'bg-sky-400/15 text-sky-300 border-sky-400/40',
    border: 'border-sky-400/40',
    glow: 'shadow-sky-950/40',
  },
  B: {
    badge: 'bg-amber-400/15 text-amber-300 border-amber-400/40',
    border: 'border-amber-400/40',
    glow: 'shadow-amber-950/40',
  },
  C: {
    badge: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/40',
    border: 'border-emerald-400/40',
    glow: 'shadow-emerald-950/40',
  },
  D: {
    badge: 'bg-sky-400/15 text-sky-200 border-sky-400/50',
    border: 'border-sky-400/40',
    glow: 'shadow-sky-950/40',
  },
  E: {
    badge: 'bg-amber-400/15 text-amber-200 border-amber-400/50',
    border: 'border-amber-400/40',
    glow: 'shadow-amber-950/40',
  },
  F: {
    badge: 'bg-rose-400/15 text-rose-200 border-rose-400/45',
    border: 'border-rose-400/40',
    glow: 'shadow-rose-950/40',
  },
  G: {
    badge: 'bg-emerald-400/15 text-emerald-200 border-emerald-400/50',
    border: 'border-emerald-400/40',
    glow: 'shadow-emerald-950/40',
  },
};

function renderSymptomIcon(id: string) {
  switch (id) {
    case 'physical-diagram':
      return <Sliders size={18} weight="duotone" className="text-sky-300" />;
    case 'nonlinear-law':
      return <Sparkle size={18} weight="duotone" className="text-amber-300" />;
    case 'ode-or-tf':
      return <Lightning size={18} weight="duotone" className="text-emerald-300" />;
    case 'block-diagram':
      return <GitBranch size={18} weight="duotone" className="text-amber-300" />;
    case 'state-matrices':
      return <Compass size={18} weight="duotone" className="text-emerald-300" />;
    default:
      return <MagnifyingGlass size={18} weight="duotone" className="text-sky-300" />;
  }
}

export const RecognitionFlowchart: React.FC<RecognitionFlowchartProps> = ({
  onNavigateToLesson,
  onNavigateToProblem,
}) => {
  const [selectedSymptomId, setSelectedSymptomId] = useState<string | null>(
    flowchartSymptoms[0]?.id ?? null
  );
  const [selectedBranchIdx, setSelectedBranchIdx] = useState<number | null>(0);

  const selectedSymptom: FlowchartSymptom | undefined = flowchartSymptoms.find(
    (s) => s.id === selectedSymptomId
  );

  const selectedBranch =
    selectedSymptom && selectedBranchIdx !== null
      ? selectedSymptom.branches[selectedBranchIdx]
      : undefined;

  const handleSelectSymptom = (symptom: FlowchartSymptom) => {
    setSelectedSymptomId(symptom.id);
    // Auto-select immediately if there is only 1 branch; otherwise prompt sub-case pick
    setSelectedBranchIdx(symptom.branches.length === 1 ? 0 : null);
  };

  const handleReset = () => {
    setSelectedSymptomId(null);
    setSelectedBranchIdx(null);
  };

  const verdictStyle = selectedBranch
    ? PROBLEM_TYPE_STYLES[selectedBranch.problemType]
    : PROBLEM_TYPE_STYLES.A;

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#0f1522] p-4 sm:p-6 shadow-2xl space-y-5">
      {/* Top Progress Breadcrumb & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
              selectedSymptom
                ? 'border-sky-400/50 bg-sky-400/15 text-sky-200'
                : 'border-sky-400/70 bg-sky-400/20 text-sky-100'
            }`}
          >
            <span className="font-mono">1</span> Visual Symptom
          </span>
          <CaretRight size={14} className="text-slate-600" />
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
              selectedBranch
                ? 'border-amber-400/50 bg-amber-400/15 text-amber-200'
                : selectedSymptom
                  ? 'border-amber-400/70 bg-amber-400/20 text-amber-100'
                  : 'border-slate-700/70 bg-slate-900/60 text-slate-500'
            }`}
          >
            <span className="font-mono">2</span> Sub-Case
          </span>
          <CaretRight size={14} className="text-slate-600" />
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
              selectedBranch
                ? 'border-emerald-400/60 bg-emerald-400/15 text-emerald-200'
                : 'border-slate-700/70 bg-slate-900/60 text-slate-500'
            }`}
          >
            <span className="font-mono">3</span> Instant Verdict
          </span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-slate-100 transition-colors"
        >
          <ArrowCounterClockwise size={13} /> Clear Selection
        </button>
      </div>

      {/* Step 1: What do you see on the exam page? */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sky-300">
            Step 1 · What do you see on the exam page?
          </h3>
          <span className="text-xs text-slate-400">
            {flowchartSymptoms.length} exam patterns
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {flowchartSymptoms.map((symptom, idx) => {
            const isSelected = symptom.id === selectedSymptomId;
            return (
              <button
                key={symptom.id}
                type="button"
                onClick={() => handleSelectSymptom(symptom)}
                className={`group text-left rounded-xl border p-3.5 transition-all ${
                  isSelected
                    ? 'border-sky-400/70 bg-sky-400/12 shadow-lg shadow-sky-950/30'
                    : 'border-slate-800 bg-[#090d16] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/80 bg-[#0f1522]">
                      {renderSymptomIcon(symptom.id)}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-400">
                      0{idx + 1}
                    </span>
                  </div>
                  <span className="rounded-full border border-slate-700/70 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                    {symptom.branches.length}{' '}
                    {symptom.branches.length === 1 ? 'case' : 'cases'}
                  </span>
                </div>

                <div
                  className={`mt-2.5 text-sm font-bold leading-snug ${
                    isSelected ? 'text-sky-100' : 'text-slate-100 group-hover:text-white'
                  }`}
                >
                  {symptom.prompt}
                </div>
                <div className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  <MathText text={symptom.cue} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Which sub-case? */}
      {selectedSymptom && (
        <div className="space-y-2.5 border-t border-slate-800/80 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              Step 2 · Which sub-case is the question asking for?
            </h3>
            <span className="text-xs text-slate-400">
              Selected: <span className="text-slate-200 font-medium">{selectedSymptom.prompt}</span>
            </span>
          </div>

          <div
            className={`grid grid-cols-1 gap-3 ${
              selectedSymptom.branches.length > 1 ? 'md:grid-cols-2' : ''
            }`}
          >
            {selectedSymptom.branches.map((branch, idx) => {
              const isSelected = selectedBranchIdx === idx;
              const style = PROBLEM_TYPE_STYLES[branch.problemType];
              return (
                <button
                  key={`${selectedSymptom.id}-${idx}`}
                  type="button"
                  onClick={() => setSelectedBranchIdx(idx)}
                  className={`flex items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-amber-400/70 bg-amber-400/12 shadow-lg shadow-amber-950/30'
                      : 'border-slate-800 bg-[#090d16] hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-1.5">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold tracking-wide ${style.badge}`}
                    >
                      Type {branch.problemType} · {branch.typeName}
                    </span>
                    <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-200">
                      <MathText text={branch.condition} />
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className={`mt-1 shrink-0 transition-transform ${
                      isSelected ? 'text-amber-300 translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Instant Verdict Card */}
      {selectedBranch ? (
        <div
          className={`rounded-2xl border ${verdictStyle.border} bg-[#090d16] p-4 sm:p-5 shadow-xl ${verdictStyle.glow} space-y-4`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <CheckCircle size={20} weight="fill" className="text-emerald-400 shrink-0" />
              <span
                className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold tracking-wide ${verdictStyle.badge}`}
              >
                Problem Type {selectedBranch.problemType}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-50">
                {selectedBranch.typeName}
              </h4>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
              15-Second Triage Locked
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* First 30-Second Move */}
            <div className="lg:col-span-6 rounded-xl border border-sky-400/25 bg-[#0f1522] p-3.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                First 30-Second Move
              </div>
              <div className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-200">
                <MathText text={selectedBranch.firstMove} />
              </div>
            </div>

            {/* Key Formula */}
            <div className="lg:col-span-6 rounded-xl border border-amber-400/25 bg-[#0f1522] p-3.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Key Formula to Write Immediately
              </div>
              <div className="mt-1 text-slate-100">
                <MathText text={selectedBranch.keyFormula} className="text-xs sm:text-sm" />
              </div>
            </div>
          </div>

          {/* Action Navigation Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              {onNavigateToLesson && (
                <button
                  type="button"
                  onClick={() => onNavigateToLesson(selectedBranch.lessonId)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/50 bg-sky-400/15 px-3.5 py-2 text-xs font-bold text-sky-200 hover:bg-sky-400/25 transition-colors"
                >
                  <BookOpen size={15} weight="duotone" />
                  Open Theory Lesson
                </button>
              )}

              {onNavigateToProblem &&
                selectedBranch.exampleProblemIds.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-400 inline-flex items-center gap-1 ml-1">
                      <ClipboardText size={14} /> Practice HW:
                    </span>
                    {selectedBranch.exampleProblemIds.map((pid) => (
                      <button
                        key={pid}
                        type="button"
                        onClick={() => onNavigateToProblem(pid)}
                        className="rounded-lg border border-amber-400/45 bg-amber-400/12 px-2.5 py-1.5 font-mono text-xs font-bold text-amber-200 hover:bg-amber-400/25 transition-colors"
                      >
                        {pid}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-700/80 bg-[#090d16]/70 p-4 text-center text-xs text-slate-400">
          {selectedSymptom
            ? 'Pick one of the sub-cases in Step 2 above to reveal your First 30-Second Move, Key Formula, and HW links.'
            : 'Pick any visual symptom in Step 1 above to start the 15-second classifier.'}
        </div>
      )}
    </div>
  );
};
