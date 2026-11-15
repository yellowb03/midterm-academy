import React, { useState } from 'react';
import { ShieldCheck, BookBookmark, Warning, Check } from '@phosphor-icons/react';
import { laplacePairs, blockRules, examTraps, sanityGates, notationGlossary, ch46Pivot, scopeItems } from '../data/curriculum';
import { MathText } from '../components/MathText';

const sections = [
  ['course-scope', 'Course and scope'], ['laplace-pairs', 'Laplace pairs'], ['block-rules', 'Block diagram rules'],
  ['common-checks', 'Common errors and checks'], ['notation', 'Notation'], ['ch46-notes', 'Chapters 4â€“6 preparation note'],
] as const;

export const CheatSheetPage: React.FC = () => {
  const [checkedGates, setCheckedGates] = useState<number[]>([]);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const toggleGate = (idx: number) => setCheckedGates((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);
  const copyTaEmail = async () => {
    try { await navigator.clipboard.writeText(ch46Pivot.taEmailTemplate); setCopiedEmail(true); window.setTimeout(() => setCopiedEmail(false), 2000); }
    catch { /* Clipboard may be restricted in non-HTTPS contexts. */ }
  };

  return <main className="mx-auto max-w-5xl space-y-10 text-[var(--ink)]">
    <header className="border-b border-[var(--rule)] pb-6">
      <p className="text-sm font-semibold text-[var(--forest)]">Reference Â· equations, methods, and course evidence</p>
      <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Control systems reference</h1>
      <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-[var(--ink-secondary)]">Look up transform pairs, block diagram rules, notation, and checks. The course and scope records below retain the source status of each claim.</p>
      <nav className="print:hidden mt-5" aria-label="Reference contents"><h2 className="text-sm font-semibold">On this page</h2><ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">{sections.map(([id, label]) => <li key={id}><a className="min-h-11 inline-flex items-center text-[var(--forest)] underline decoration-[var(--rule-strong)] underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]" href={`#${id}`}>{label}</a></li>)}</ul></nav>
      <button type="button" onClick={() => window.print()} className="print:hidden mt-2 min-h-11 rounded-md border border-[var(--rule-strong)] px-3 text-sm font-semibold hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]">Print reference</button>
    </header>

    <section id="course-scope" className="scroll-mt-8 space-y-4">
      <div><p className="text-sm font-semibold text-[var(--ink-secondary)]">Course record</p><h2 className="font-serif text-2xl font-semibold">Course and scope</h2><p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-[var(--ink-secondary)]">These entries reflect the current source data. Scope predictions remain labeled by their stated confidence; they are not official exam confirmation.</p></div>
      <div className="overflow-x-auto rounded-md border border-[var(--rule)]">
        <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
          <thead className="bg-[var(--surface-muted)]"><tr><th scope="col" className="p-3 font-semibold">Topic</th><th scope="col" className="p-3 font-semibold">Current record</th><th scope="col" className="p-3 font-semibold">Status in source</th></tr></thead>
          <tbody>{scopeItems.map((item, i) => <tr key={item.parameter} className={i % 2 ? 'bg-[var(--surface-muted)]/50' : 'bg-[var(--surface)]'}><th scope="row" className="border-t border-[var(--rule)] p-3 font-semibold">{item.parameter}</th><td className="border-t border-[var(--rule)] p-3 leading-relaxed">{item.evidence}</td><td className="border-t border-[var(--rule)] p-3 text-sm">{item.status === 'CONFIRMED' ? 'Confirmed in source' : item.status === 'STRONG INFERENCE' ? 'Strong inference' : 'Speculation'}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">Source record: <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5">src/data/curriculum.ts Â· scopeItems</code>. Ch. 4â€“6 status remains unconfirmed; see the preparation note below.</p>
    </section>

    <section id="laplace-pairs" className="scroll-mt-8 space-y-4">
      <div><p className="text-sm font-semibold text-[var(--ink-secondary)]">Lookup table</p><h2 className="font-serif text-2xl font-semibold">Laplace transform pairs</h2><p className="mt-2 text-sm text-[var(--ink-secondary)]">Pairs and notes from the existing course reference data.</p></div>
      <div className="overflow-x-auto rounded-md border border-[var(--rule)]">
        <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
          <thead className="bg-[var(--surface-muted)]"><tr><th scope="col" className="p-3 font-semibold">Signal</th><th scope="col" className="p-3 font-semibold">Time domain</th><th scope="col" className="p-3 font-semibold">Laplace domain</th><th scope="col" className="p-3 font-semibold">Note</th></tr></thead>
          <tbody>{laplacePairs.map((pair, i) => <tr key={i} className="border-t border-[var(--rule)]"><th scope="row" className="p-3 font-medium">{pair.name}</th><td className="p-3"><MathText text={pair.timeDomain} /></td><td className="p-3"><MathText text={pair.laplaceDomain} /></td><td className="max-w-sm p-3 text-[var(--ink-secondary)]">{pair.note && <MathText text={pair.note} />}</td></tr>)}</tbody>
        </table>
      </div>
    </section>

    <section id="block-rules" className="scroll-mt-8 space-y-4">
      <div><p className="text-sm font-semibold text-[var(--ink-secondary)]">Reduction methods</p><h2 className="font-serif text-2xl font-semibold">Block diagram rules</h2><p className="mt-2 text-sm text-[var(--ink-secondary)]">Check the summing sign and signal path before applying a reduction.</p></div>
      <dl className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">{blockRules.map((rule, i) => <div key={i} className="grid gap-2 py-4 sm:grid-cols-[minmax(10rem,0.6fr)_minmax(10rem,0.8fr)_minmax(0,1.6fr)]"><dt className="font-semibold">{rule.name}</dt><dd className="overflow-x-auto font-medium"><MathText text={rule.formula} /></dd><dd className="text-sm leading-relaxed text-[var(--ink-secondary)]"><MathText text={rule.diagramDesc} /> <span className="font-semibold text-[var(--caution-ink)]">Check: </span><MathText text={rule.pitfall} /></dd></div>)}</dl>
      <p className="text-sm text-[var(--ink-secondary)]">Source record: <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5">src/data/curriculum.ts Â· blockRules</code>.</p>
    </section>

    <section id="common-checks" className="scroll-mt-8 space-y-8">
      <div><p className="text-sm font-semibold text-[var(--ink-secondary)]">Review before submitting</p><h2 className="font-serif text-2xl font-semibold">Common errors and checks</h2></div>
      <div className="space-y-5">{examTraps.map((trap) => <article key={trap.number} className="border-t border-[var(--rule)] pt-4">
        <h3 className="font-semibold">{trap.number}. {trap.title}</h3><p className="mt-1 max-w-[70ch] text-sm leading-relaxed text-[var(--ink-secondary)]"><span className="font-semibold text-[var(--ink)]">Why it matters: </span><MathText text={trap.whyStudentsLoseMarks} /></p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-md bg-[var(--error-bg)] p-3 text-sm leading-relaxed"><p className="mb-1 font-semibold text-[var(--error-ink)]">Common error</p><MathText text={trap.wrongWay} /></div><div className="rounded-md bg-[var(--success-bg)] p-3 text-sm leading-relaxed"><p className="mb-1 font-semibold text-[var(--success-ink)]">Correction</p><MathText text={trap.rightWay} /></div></div>
      </article>)}</div>
      <div className="border-y border-[var(--rule)] py-5">
        <div className="flex items-center gap-2"><ShieldCheck size={19} aria-hidden="true" className="text-[var(--forest)]" /><h3 className="font-serif text-xl font-semibold">Sanity gates</h3></div>
        <p className="mt-1 text-sm text-[var(--ink-secondary)]">Use as a personal checklist; checked states are temporary for this page session.</p>
        <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">{sanityGates.map((gate, idx) => {
          const checked = checkedGates.includes(idx);
          return <li key={idx} className="border-t border-[var(--rule)] py-3"><button type="button" onClick={() => toggleGate(idx)} aria-pressed={checked} className="flex min-h-11 w-full items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? 'border-[var(--success-ink)] bg-[var(--success-bg)] text-[var(--success-ink)]' : 'border-[var(--rule-strong)]'}`}>{checked && <Check size={14} weight="bold" aria-hidden="true" />}</span><span className="font-semibold">{gate.title}</span></button><p className="ml-7 text-sm leading-relaxed"><MathText text={gate.check} /></p><p className="ml-7 mt-1 text-sm text-[var(--ink-secondary)]"><span className="font-semibold">Why: </span><MathText text={gate.why} /></p></li>;
        })}</ul>
      </div>
      <p className="text-sm text-[var(--ink-secondary)]">Source records: <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5">src/data/curriculum.ts Â· examTraps, sanityGates</code>.</p>
    </section>

    <section id="notation" className="scroll-mt-8 space-y-4">
      <div className="flex items-start gap-3"><BookBookmark size={20} aria-hidden="true" className="mt-1 text-[var(--forest)]" /><div><p className="text-sm font-semibold text-[var(--ink-secondary)]">Symbol lookup</p><h2 className="font-serif text-2xl font-semibold">Lecture and textbook notation</h2></div></div>
      <div className="overflow-x-auto rounded-md border border-[var(--rule)]"><table className="w-full min-w-[42rem] border-collapse text-left text-sm">
        <thead className="bg-[var(--surface-muted)]"><tr><th scope="col" className="p-3 font-semibold">Concept</th><th scope="col" className="p-3 font-semibold">Lecture slides</th><th scope="col" className="p-3 font-semibold">Textbook</th><th scope="col" className="p-3 font-semibold">Distinction</th></tr></thead>
        <tbody>{notationGlossary.map((row, idx) => <tr key={idx} className="border-t border-[var(--rule)]"><th scope="row" className="p-3 font-semibold">{row.symbol}</th><td className="p-3"><MathText text={row.lecture} /></td><td className="p-3"><MathText text={row.textbook} /></td><td className="max-w-md p-3 leading-relaxed text-[var(--ink-secondary)]"><MathText text={row.trap} /></td></tr>)}</tbody>
      </table></div>
      <p className="text-sm text-[var(--ink-secondary)]">Source record: <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5">src/data/curriculum.ts Â· notationGlossary</code>.</p>
    </section>

    <section id="ch46-notes" className="scroll-mt-8 space-y-4 border-t-2 border-[var(--caution-ink)] pt-5">
      <div className="flex items-start gap-3"><Warning size={21} aria-hidden="true" className="mt-1 shrink-0 text-[var(--caution-ink)]" /><div><p className="text-sm font-semibold text-[var(--caution-ink)]">Preparation note Â· not confirmed exam scope</p><h2 className="font-serif text-2xl font-semibold">Chapters 4â€“6 contingency material</h2><p className="mt-2 max-w-[70ch] text-sm leading-relaxed"><MathText text={ch46Pivot.warning} /></p></div></div>
      <div className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">{ch46Pivot.topics.map((topic, idx) => <article key={idx} className="py-4"><h3 className="font-semibold">{topic.title}</h3><div className="mt-2 flex flex-wrap gap-2">{topic.formulas.map((formula, fIdx) => <div key={fIdx} className="max-w-full overflow-x-auto rounded-md bg-[var(--surface-muted)] px-3 py-2"><MathText text={formula} /></div>)}</div><p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-[var(--ink-secondary)]"><MathText text={topic.note} /></p></article>)}</div>
      <div className="rounded-md bg-[var(--caution-bg)] p-4"><p className="text-sm leading-relaxed">{ch46Pivot.taEmailTemplate}</p><button type="button" onClick={copyTaEmail} className="print:hidden mt-3 min-h-11 rounded-md border border-[var(--caution-ink)] px-3 text-sm font-semibold text-[var(--caution-ink)] hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]">{copiedEmail ? 'Copied' : 'Copy inquiry text'}</button></div>
      <p className="text-sm text-[var(--ink-secondary)]">Source record: <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5">src/data/curriculum.ts Â· ch46Pivot</code>.</p>
    </section>
  </main>;
};

