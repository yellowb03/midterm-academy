import React from 'react';

export type PageTab = 'overview' | 'theory' | 'problems' | 'exam' | 'cheatsheet';

interface TopNavProps {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
}

const NAV_ITEMS: { id: PageTab; label: string }[] = [
  { id: 'overview', label: 'Home' },
  { id: 'theory', label: 'Learn' },
  { id: 'problems', label: 'Practice' },
  { id: 'exam', label: 'Exam' },
  { id: 'cheatsheet', label: 'Reference' },
];

export const TopNav: React.FC<TopNavProps> = ({ activeTab, onSelectTab }) => (
  <header className="academy-header">
    <div className="academy-header__inner">
      <button
        type="button"
        onClick={() => onSelectTab('overview')}
        className="academy-brand"
        aria-label="Midterm Academy home"
      >
        <span className="academy-brand__name">Midterm Academy</span>
        <span className="academy-brand__course">Automatic Control · F030100</span>
      </button>
      <nav aria-label="Primary navigation" className="academy-nav">
        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelectTab(id)}
            aria-current={activeTab === id ? 'page' : undefined}
            className={`academy-nav__item${activeTab === id ? ' is-active' : ''}`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
    <style>{`
      .academy-header { position: relative; z-index: 20; border-bottom: 1px solid var(--rule); background: var(--paper-raised); }
      .academy-header__inner { width: min(100% - 40px, 1080px); min-height: 68px; margin: auto; display: flex; align-items: center; justify-content: space-between; gap: 28px; }
      .academy-brand { display: flex; flex-direction: column; align-items: flex-start; border: 0; padding: 4px 0; background: transparent; color: var(--ink); text-align: left; cursor: pointer; }
      .academy-brand__name { font-family: "Source Serif 4", Georgia, serif; font-size: 19px; font-weight: 600; line-height: 1.12; }
      .academy-brand__course { margin-top: 3px; color: var(--ink-faint); font-size: 12px; line-height: 1.2; }
      .academy-nav { display: flex; align-items: stretch; gap: 4px; align-self: stretch; }
      .academy-nav__item { position: relative; min-width: 70px; border: 0; border-bottom: 2px solid transparent; padding: 0 12px; background: transparent; color: var(--ink-soft); font-size: 15px; font-weight: 600; cursor: pointer; }
      .academy-nav__item:hover { color: var(--ink); }
      .academy-nav__item.is-active { border-bottom-color: var(--forest); color: var(--forest-dark); }
      @media (max-width: 640px) {
        .academy-header__inner { width: calc(100% - 28px); min-height: 0; display: block; padding-top: 12px; }
        .academy-brand { margin-bottom: 8px; }
        .academy-brand__name { font-size: 18px; }
        .academy-nav { width: 100%; justify-content: space-between; gap: 0; }
        .academy-nav__item { min-width: 0; min-height: 44px; flex: 1; padding: 0 4px; font-size: 13px; }
      }
      @media (max-width: 360px) { .academy-nav__item { font-size: 12px; } }
    `}</style>
  </header>
);
