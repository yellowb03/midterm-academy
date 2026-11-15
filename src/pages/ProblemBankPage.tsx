import React, { useEffect, useMemo, useState } from 'react';
import { MagnifyingGlass, CheckCircle, Funnel, ArrowLeft, X } from '@phosphor-icons/react';
import { homeworkProblems } from '../data/homeworkProblems';
import { HomeworkSet, ProblemTypeCode } from '../types';
import { ProblemStepViewer } from '../components/ProblemStepViewer';

interface ProblemBankPageProps {
  activeProblemId: string;
  onSelectProblem: (id: string) => void;
  masteredProblems: string[];
  onToggleMastered: (id: string) => void;
}

const HW_FILTERS: ('ALL' | HomeworkSet)[] = ['ALL', 'Recommended', 'HW 1', 'HW 2', 'HW 3', 'HW 4'];
const TYPE_FILTERS: ('ALL' | ProblemTypeCode)[] = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

export const ProblemBankPage: React.FC<ProblemBankPageProps> = ({
  activeProblemId,
  onSelectProblem,
  masteredProblems,
  onToggleMastered,
}) => {
  const [hwFilter, setHwFilter] = useState<'ALL' | HomeworkSet>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | ProblemTypeCode>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return homeworkProblems.filter((p) => {
      if (hwFilter !== 'ALL' && p.hw !== hwFilter) return false;
      if (typeFilter !== 'ALL' && p.problemType !== typeFilter) return false;
      return !q || `${p.code} ${p.title} ${p.typeLabel} ${p.coreIntuition}`.toLowerCase().includes(q);
    });
  }, [hwFilter, typeFilter, searchQuery]);

  // The selected detail always comes from the visible result set.
  const activeProblem = filtered.find((p) => p.id === activeProblemId) ?? filtered[0] ?? null;
  useEffect(() => {
    if (activeProblem && activeProblem.id !== activeProblemId) onSelectProblem(activeProblem.id);
  }, [activeProblem, activeProblemId, onSelectProblem]);

  const clearFilters = () => {
    setSearchQuery('');
    setHwFilter('ALL');
    setTypeFilter('ALL');
    setMobileDetailOpen(false);
  };

  const listHiddenOnMobile = mobileDetailOpen && !!activeProblem;

  return (
    <main className="space-y-6 text-[var(--ink)]">
      <header className="border-b border-[var(--rule)] pb-5">
        <p className="mb-1 text-sm font-semibold text-[var(--forest)]">Practice library</p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Practice a problem</h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-[var(--ink-secondary)]">
          Browse the existing 24 problems. Start with the prompt and try your setup before opening a worked solution.
        </p>
      </header>

      <section aria-label="Search and filter problems" className="space-y-4 border-b border-[var(--rule)] pb-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(15rem,1fr)_minmax(11rem,14rem)_minmax(9rem,12rem)]">
          <label className="relative block">
            <span className="sr-only">Search by code, title, or method</span>
            <MagnifyingGlass size={18} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setMobileDetailOpen(false); }}
              placeholder="Search code, title, or method"
              className="min-h-11 w-full rounded-md border border-[var(--rule-strong)] bg-[var(--surface)] py-2 pl-10 pr-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
            />
          </label>
          <label className="flex min-h-11 items-center gap-2 rounded-md border border-[var(--rule-strong)] bg-[var(--surface)] px-3 text-sm">
            <Funnel size={17} aria-hidden="true" className="shrink-0 text-[var(--ink-muted)]" />
            <span className="sr-only">Filter by assignment</span>
            <select value={hwFilter} onChange={(e) => { setHwFilter(e.target.value as 'ALL' | HomeworkSet); setMobileDetailOpen(false); }} className="w-full bg-transparent text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]">
              {HW_FILTERS.map((hw) => <option key={hw} value={hw}>{hw === 'ALL' ? 'All assignments and examples' : hw === 'Recommended' ? 'Recommended examples' : hw}</option>)}
            </select>
          </label>
          <label className="flex min-h-11 items-center gap-2 rounded-md border border-[var(--rule-strong)] bg-[var(--surface)] px-3 text-sm">
            <span className="shrink-0 text-[var(--ink-secondary)]">Type</span>
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value as 'ALL' | ProblemTypeCode); setMobileDetailOpen(false); }} className="w-full bg-transparent text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]">
              {TYPE_FILTERS.map((type) => <option key={type} value={type}>{type === 'ALL' ? 'All types' : `Type ${type}`}</option>)}
            </select>
          </label>
        </div>
        <div className="flex min-h-8 items-center justify-between gap-3 text-sm text-[var(--ink-secondary)]" aria-live="polite">
          <span>{filtered.length} {filtered.length === 1 ? 'problem' : 'problems'}</span>
          {(searchQuery || hwFilter !== 'ALL' || typeFilter !== 'ALL') && (
            <button type="button" onClick={clearFilters} className="inline-flex min-h-10 items-center gap-1.5 rounded px-2 font-semibold text-[var(--forest)] hover:bg-[var(--forest-tint)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]">
              <X size={15} aria-hidden="true" /> Clear filters
            </button>
          )}
        </div>
      </section>

      <div className="grid items-start gap-7 lg:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.65fr)]">
        <aside className={listHiddenOnMobile ? 'hidden lg:block' : 'block'} aria-label="Problem results">
          {filtered.length === 0 ? (
            <div className="border-y border-[var(--rule)] py-8">
              <h2 className="font-serif text-xl font-semibold">No problems found</h2>
              <p className="mt-1 text-sm text-[var(--ink-secondary)]">Try a shorter search or clear one of the filters.</p>
              <button type="button" onClick={clearFilters} className="mt-4 min-h-11 rounded-md bg-[var(--forest)] px-4 font-semibold text-white hover:bg-[var(--forest-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]">Clear filters</button>
            </div>
          ) : (
            <ol className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
              {filtered.map((p) => {
                const selected = p.id === activeProblem?.id;
                const mastered = masteredProblems.includes(p.id);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      aria-current={selected ? 'true' : undefined}
                      onClick={() => { onSelectProblem(p.id); setMobileDetailOpen(true); }}
                      className={`w-full py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--focus-ring)] ${selected ? 'bg-[var(--forest-tint)] px-3' : 'px-1 hover:bg-[var(--surface-muted)]'}`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block text-xs font-semibold text-[var(--ink-secondary)]">{p.hw} · Type {p.problemType}{p.priority === 'VERY HIGH' ? ' · High yield' : ''}</span>
                          <span className="mt-1 block font-semibold leading-snug text-[var(--ink)]">{p.code}: {p.title}</span>
                        </span>
                        {mastered && <CheckCircle size={19} weight="fill" aria-label="Marked as mastered" className="mt-1 shrink-0 text-[var(--success-ink)]" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </aside>

        <section className={!listHiddenOnMobile ? 'min-w-0' : 'min-w-0'} aria-label="Selected problem">
          {activeProblem ? <>
            {mobileDetailOpen && <button type="button" onClick={() => setMobileDetailOpen(false)} className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-[var(--forest)] hover:bg-[var(--forest-tint)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] lg:hidden"><ArrowLeft size={17} aria-hidden="true" /> Back to results</button>}
            <ProblemStepViewer key={activeProblem.id} problem={activeProblem} isMastered={masteredProblems.includes(activeProblem.id)} onToggleMastered={onToggleMastered} />
          </> : <div className="hidden lg:block border-y border-[var(--rule)] py-8 text-sm text-[var(--ink-secondary)]">Choose a problem to view its prompt.</div>}
        </section>
      </div>
    </main>
  );
};
