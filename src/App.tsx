import React, { useCallback, useEffect, useState } from 'react';
import { TopNav, type PageTab } from './components/TopNav';
import { OverviewPage, type HomeTool, type ResumeTarget } from './pages/OverviewPage';
import { TheoryStudioPage } from './pages/TheoryStudioPage';
import { ProblemBankPage } from './pages/ProblemBankPage';
import { PracticeExamPage } from './pages/PracticeExamPage';
import { CheatSheetPage } from './pages/CheatSheetPage';
import { theoryLessons } from './data/theoryLessons';
import { homeworkProblems } from './data/homeworkProblems';

const STORAGE_KEY = 'control-studio-progress-v1';
const LAST_ACTIVITY_KEY = 'control-studio-last-activity-v1';

interface SavedProgress {
  masteredProblems: string[];
  completedLessons: string[];
  checkedBlocks: string[];
}

interface RouteState {
  tab: PageTab;
  lessonId: string;
  problemId: string;
  homeTool: HomeTool;
  notFound: string | null;
}

function loadProgress(): SavedProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        masteredProblems: Array.isArray(parsed.masteredProblems) ? parsed.masteredProblems : [],
        completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
        checkedBlocks: Array.isArray(parsed.checkedBlocks) ? parsed.checkedBlocks : [],
      };
    }
  } catch {
    // Local progress is optional; the app remains usable when storage is blocked.
  }
  return { masteredProblems: [], completedLessons: [], checkedBlocks: [] };
}

const initialRoute: RouteState = {
  tab: 'overview',
  lessonId: theoryLessons[0]?.id ?? 'ch1-feedback',
  problemId: homeworkProblems[0]?.id ?? 'e2-2',
  homeTool: null,
  notFound: null,
};

function routeFromHash(): RouteState {
  const route = { ...initialRoute };
  let path: string[];
  try { path = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent); }
  catch { return { ...route, notFound: 'invalid route' }; }
  if (path.length === 0) return route;
  if (path[0] === 'study-plan') { route.homeTool = 'plan'; return route; }
  if (path[0] === 'classifier') { route.homeTool = 'classifier'; return route; }
  if (path[0] === 'learn') {
    if (path[1] && theoryLessons.some((lesson) => lesson.id === path[1])) {
      route.tab = 'theory';
      route.lessonId = path[1];
    } else route.notFound = path[1] ?? 'lesson';
    return route;
  }
  if (path[0] === 'practice') {
    route.tab = 'problems';
    if (path[1]) {
      const match = homeworkProblems.find((problem) => problem.id === path[1] || problem.code.toLowerCase() === path[1].toLowerCase());
      if (match) route.problemId = match.id;
      else route.notFound = path[1];
    }
    return route;
  }
  if (path[0] === 'exam' && path.length === 1) route.tab = 'exam';
  else if (path[0] === 'reference' && path.length === 1) route.tab = 'cheatsheet';
  else route.notFound = path.join('/');
  return route;
}

function hrefForRoute(route: RouteState): string {
  if (route.tab === 'overview' && route.homeTool === 'plan') return '#/study-plan';
  if (route.tab === 'overview' && route.homeTool === 'classifier') return '#/classifier';
  if (route.tab === 'theory') return `#/learn/${encodeURIComponent(route.lessonId)}`;
  if (route.tab === 'problems') return route.problemId ? `#/practice/${encodeURIComponent(route.problemId)}` : '#/practice';
  if (route.tab === 'exam') return '#/exam';
  if (route.tab === 'cheatsheet') return '#/reference';
  return '#/';
}

function loadLastActivity(): ResumeTarget | null {
  try {
    const value = JSON.parse(localStorage.getItem(LAST_ACTIVITY_KEY) ?? 'null') as ResumeTarget | null;
    if (value?.kind === 'lesson' && theoryLessons.some((lesson) => lesson.id === value.id)) return value;
    if (value?.kind === 'problem' && homeworkProblems.some((problem) => problem.id === value.id)) return value;
  } catch {
    // Ignore malformed or unavailable resume state.
  }
  return null;
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => routeFromHash());
  const [progress, setProgress] = useState<SavedProgress>(loadProgress);
  const [resumeTarget, setResumeTarget] = useState<ResumeTarget | null>(loadLastActivity);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* ignore storage failures */ }
  }, [progress]);

  useEffect(() => {
    const syncRoute = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const navigate = useCallback((next: RouteState, replace = false) => {
    const href = hrefForRoute(next);
    if (window.location.hash !== href) {
      if (replace) window.history.replaceState(null, '', href);
      else window.history.pushState(null, '', href);
    }
    setRoute(next);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const navigateTab = (tab: PageTab) => {
    navigate({ ...route, tab, homeTool: null, notFound: null });
  };

  const toggleHomeTool = (tool: HomeTool) => navigate({ ...route, tab: 'overview', homeTool: tool, notFound: null });

  const openLesson = (lessonId: string) => {
    const target = { kind: 'lesson' as const, id: lessonId };
    setResumeTarget(target);
    try { localStorage.setItem(LAST_ACTIVITY_KEY, JSON.stringify(target)); } catch { /* ignore storage failures */ }
    navigate({ ...route, tab: 'theory', lessonId, notFound: null });
  };

  const openProblem = (problemId: string) => {
    const match = homeworkProblems.find(
      (problem) => problem.id.toLowerCase() === problemId.toLowerCase() || problem.code.toLowerCase() === problemId.toLowerCase()
    );
    if (!match) {
      navigate({ ...route, tab: 'problems', notFound: null });
      return;
    }
    const target = { kind: 'problem' as const, id: match.id };
    setResumeTarget(target);
    try { localStorage.setItem(LAST_ACTIVITY_KEY, JSON.stringify(target)); } catch { /* ignore storage failures */ }
    navigate({ ...route, tab: 'problems', problemId: match.id, notFound: null });
  };

  const toggleMastered = (id: string) => setProgress((prev) => ({
    ...prev,
    masteredProblems: prev.masteredProblems.includes(id)
      ? prev.masteredProblems.filter((value) => value !== id)
      : [...prev.masteredProblems, id],
  }));

  const toggleLessonComplete = (id: string) => setProgress((prev) => ({
    ...prev,
    completedLessons: prev.completedLessons.includes(id)
      ? prev.completedLessons.filter((value) => value !== id)
      : [...prev.completedLessons, id],
  }));

  const toggleStudyBlock = (blockKey: string) => setProgress((prev) => ({
    ...prev,
    checkedBlocks: prev.checkedBlocks.includes(blockKey)
      ? prev.checkedBlocks.filter((value) => value !== blockKey)
      : [...prev.checkedBlocks, blockKey],
  }));

  const selectedLesson = theoryLessons.find((lesson) => lesson.id === route.lessonId);
  const selectedProblem = homeworkProblems.find((problem) => problem.id === route.problemId);
  const pageName = route.notFound ? 'Page not found' : route.tab === 'overview' ? 'Home'
    : route.tab === 'theory' ? selectedLesson?.title ?? 'Learn'
      : route.tab === 'problems' ? selectedProblem?.title ?? 'Practice'
        : route.tab === 'exam' ? 'Practice exam' : 'Reference';

  useEffect(() => {
    document.title = `${pageName} · Automatic Control Midterm Academy`;
    const frame = window.requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('#academy-main h1, #academy-main h2');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [route, pageName]);

  return (
    <div className="academy-shell">
      <TopNav activeTab={route.notFound ? 'overview' : route.tab} onSelectTab={navigateTab} />
      <div id="academy-main" className="academy-content">
        {route.notFound && <main className="route-not-found" aria-labelledby="not-found-title"><p className="home-eyebrow">Page unavailable</p><h1 id="not-found-title" className="display-face">We couldn’t find that page.</h1><p>The address “{route.notFound}” does not match a lesson or problem in this academy.</p><button type="button" className="academy-button" onClick={() => navigate({ ...initialRoute })}>Return to Home <ArrowIcon /></button><style>{`.route-not-found h1{margin:0 0 8px;font-size:clamp(32px,5vw,44px);font-weight:500}.route-not-found p:not(.home-eyebrow){color:var(--ink-soft);margin:0 0 18px}`}</style></main>}
        {!route.notFound && route.tab === 'overview' && <OverviewPage
          onNavigateTab={navigateTab}
          onOpenLesson={openLesson}
          onOpenProblem={openProblem}
          completedLessons={progress.completedLessons}
          checkedBlocks={progress.checkedBlocks}
          onToggleStudyBlock={toggleStudyBlock}
          resumeTarget={resumeTarget}
          activeTool={route.homeTool}
          onToggleTool={toggleHomeTool}
        />}
        {!route.notFound && route.tab === 'theory' && <TheoryStudioPage
          activeLessonId={route.lessonId}
          onSelectLesson={openLesson}
          completedLessons={progress.completedLessons}
          onToggleLessonComplete={toggleLessonComplete}
          onOpenProblem={openProblem}
        />}
        {!route.notFound && route.tab === 'problems' && <ProblemBankPage
          activeProblemId={route.problemId}
          onSelectProblem={openProblem}
          masteredProblems={progress.masteredProblems}
          onToggleMastered={toggleMastered}
        />}
        {!route.notFound && route.tab === 'exam' && <PracticeExamPage />}
        {!route.notFound && route.tab === 'cheatsheet' && <CheatSheetPage />}
      </div>
      <footer className="academy-footer">
        <div><span>Midterm Academy · Automatic Control</span><span>Progress and last study location save to this browser when local storage is available.</span></div>
        <button type="button" onClick={() => navigateTab('cheatsheet')}>Course notes & scope <ArrowIcon /></button>
      </footer>
      <style>{`
        .academy-footer { display:flex; justify-content:space-between; gap:24px; align-items:center; border-top:1px solid var(--rule); padding:20px max(20px, calc((100vw - 1080px) / 2)); color:var(--ink-faint); font-size:13px; }
        .academy-footer div { display:flex; flex-wrap:wrap; gap:4px 16px; }
        .academy-footer div span:first-child { color:var(--ink-soft); font-weight:600; }
        .academy-footer button { display:inline-flex; align-items:center; gap:7px; border:0; padding:6px 0; background:transparent; color:var(--forest-dark); font-weight:600; cursor:pointer; }
        @media(max-width:640px){ .academy-footer{ align-items:flex-start; flex-direction:column; gap:8px; padding:16px; } }
      `}</style>
    </div>
  );
}

function ArrowIcon() {
  return <span aria-hidden="true">→</span>;
}
