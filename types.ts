
export enum SyllabusTopic {
  BASIC_IDEAS = "1. Basic Economic Ideas",
  PRICE_SYSTEM = "2. The Price System & Microeconomy",
  GOVT_MICRO = "3. Govt Micro Intervention",
  MACROECONOMY = "4. The Macroeconomy",
  GOVT_MACRO = "5. Govt Macro Intervention",
  INTERNATIONAL = "6. International Economic Issues",
  
  // A Level Topics
  PRICE_SYSTEM_AL = "7. The Price System & Microeconomy (AL)",
  GOVT_MICRO_AL = "8. Govt Micro Intervention (AL)",
  MACROECONOMY_AL = "9. The Macroeconomy (AL)",
  GOVT_MACRO_AL = "10. Govt Macro Intervention (AL)",
  INTERNATIONAL_AL = "11. International Economic Issues (AL)"
}

export interface Question {
  id: string;
  year: string;
  paper: string; // e.g., "9708/22"
  variant: "Feb/March" | "May/June" | "Oct/Nov";
  questionNumber: string;
  questionText: string;
  topic: SyllabusTopic;
  chapter: string; // e.g., "1.1 Scarcity, choice and opportunity cost"
  markScheme: string; // The raw content from the MS PDF
  maxMarks: number;
}

export interface ClozeBlank {
  id: number;
  original: string;
  hint: string;
}

export interface ClozeFeedback {
  score: number;
  comment: string;
}

export interface QuestionState {
  generatorEssay: string;
  graderEssay: string;
  graderFeedback: string;
  realTimeEssay: string;
  
  // Logic Trainer / Cloze State
  clozeData?: {
    textWithBlanks: string; // The text containing [BLANK_1] etc
    blanks: ClozeBlank[];
  };
  clozeUserAnswers?: Record<number, string>;
  clozeFeedback?: Record<number, ClozeFeedback>;
}

export interface KeyDebate {
  title: string;
  pros: string;
  cons: string;
  dependencies: string;
}

export interface TopicAnalysisData {
  lastUpdated: string;
  questionCount: number;
  ao1: string[];
  ao2: string[];
  ao3: string[];
  keyDebates: KeyDebate[];
}

export enum AppMode {
  GENERATOR = "Model Essay Generator",
  IMPROVER = "Logic Trainer",
  GRADER = "Essay Grader",
  COACH = "Real-time Coach",
  LOGIC_CHAIN = "Logic Chain Improver",
  TOPIC_ANALYSIS = "Topic Analysis",
  SYLLABUS_TRACKER = "Syllabus Tracker",
  STRATEGY = "Exam Strategy"
}

export interface SyllabusItem {
  id: string;
  title: string;
  points: string[];
}

export interface SyllabusSection {
  id: string;
  title: string;
  subsections: SyllabusItem[];
}

export interface LogicChainItem {
  id: string;
  context: string; // e.g. "Impact on Consumers" or "Short Run"
  chain: string;
}

export interface SyllabusStatus {
  status: 'R' | 'A' | 'G' | null;
  lastPracticed?: string;
  
  // Revised Structure for "Handbook Mode"
  ao1Definition?: string; // Formal textbook definition
  ao2Chains?: LogicChainItem[]; // List of specific logic chains
  
  // Legacy fields (kept for backward compatibility with existing saves)
  userChain?: string;
  modelChain?: string;
  feedback?: string;
  ao1Notes?: string; 
}
