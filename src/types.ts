export type ProblemTypeCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type PriorityLevel = 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
export type HomeworkSet = 'HW 1' | 'HW 2' | 'HW 3' | 'HW 4' | 'Recommended';
export type LabId =
  | 'feedback'
  | 'linearization'
  | 'laplace'
  | 'motor'
  | 'block-diagram'
  | 'companion'
  | 'transition-matrix';

export interface SolutionStep {
  title: string;
  math: string;
  reasoning: string;
  tip?: string;
}

export interface QuickCheck {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface HomeworkProblem {
  id: string;
  code: string;
  title: string;
  hw: HomeworkSet;
  source: string;
  problemType: ProblemTypeCode;
  typeLabel: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  priority: PriorityLevel;
  role: 'Core' | 'Extension' | 'Prof Tip';
  originalStatement: string;
  figureUrl?: string;
  figureCaption?: string;
  bookAnswer?: string;
  given: string[];
  find: string[];
  coreIntuition: string;
  quickCheck?: QuickCheck;
  steps: SolutionStep[];
  finalAnswer: string;
  recognizeCue: string;
  shortcut: string;
  commonMistakes: string[];
  memorize: string;
}

export interface ConceptCheckChoice {
  text: string;
  correct: boolean;
  feedback: string;
}

export interface ConceptCheckMCQ {
  id: string;
  question: string;
  choices: ConceptCheckChoice[];
}

export interface TheorySection {
  heading: string;
  explanation: string;
  math?: string;
  whyItWorks: string;
  visualNote?: string;
}

export interface TheoryLesson {
  id: string;
  number: number;
  chapterTag: string;
  title: string;
  subtitle: string;
  examWeight: string;
  labId: LabId;
  labTitle: string;
  labPrompt: string;
  intuitionHook: string;
  mentalModel: string[];
  sections: TheorySection[];
  workedWalkthrough: {
    title: string;
    context: string;
    steps: SolutionStep[];
    takeaway: string;
  };
  conceptChecks: ConceptCheckMCQ[];
  tipsAndTraps: {
    shortcuts: string[];
    traps: string[];
    memorize: string[];
  };
  relatedProblemIds: string[];
}

export interface RubricCriterion {
  criterion: string;
  points: number;
}

export interface PracticeQuestionPart {
  label: string;
  points: number;
  prompt: string;
  solutionSteps: SolutionStep[];
  finalAnswer: string;
  rubricItems: RubricCriterion[];
  deductionWarning: string;
}

export interface PracticeQuestion {
  id: string;
  number: number;
  title: string;
  points: number;
  topicTags: string[];
  stem: string;
  diagramType?: 'q1-feedback' | 'q4-cart' | 'q5-multiloop' | 'q6-integrators';
  parts: PracticeQuestionPart[];
}

export interface ScopeItem {
  parameter: string;
  evidence: string;
  status: 'CONFIRMED' | 'STRONG INFERENCE' | 'SPECULATION';
}

export interface FlowchartSymptom {
  id: string;
  prompt: string;
  cue: string;
  branches: {
    condition: string;
    problemType: ProblemTypeCode;
    typeName: string;
    firstMove: string;
    keyFormula: string;
    lessonId: string;
    exampleProblemIds: string[];
  }[];
}

export interface StudyBlock {
  time: string;
  focus: string;
  duration: string;
  targetIds: string[];
}

export interface StudyPlan {
  id: '1h' | '3h' | '6h' | '9h';
  name: string;
  duration: string;
  subtitle: string;
  blocks: StudyBlock[];
}

export interface ExamTrap {
  number: number;
  title: string;
  wrongWay: string;
  rightWay: string;
  whyStudentsLoseMarks: string;
}

export interface LaplacePair {
  name: string;
  timeDomain: string;
  laplaceDomain: string;
  note?: string;
}

export interface BlockRule {
  name: string;
  diagramDesc: string;
  formula: string;
  pitfall: string;
}
