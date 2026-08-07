// ============================================================
// FinMentor AI — Domain Types
// ============================================================

// ── Authentication ────────────────────────────────────────

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
}

// ── Accounts ──────────────────────────────────────────────

export type AccountType = "savings" | "current" | "credit" | "other";

export interface Account {
  id: string;
  uid: string;
  name: string; // e.g. "SBI Savings", "HDFC Credit Card"
  bankName: string;
  accountType: AccountType;
  createdAt: Date;
}

// ── Transactions ──────────────────────────────────────────

export type TransactionType = "debit" | "credit";

export type TransactionCategory =
  | "food_dining"
  | "groceries"
  | "transport"
  | "entertainment"
  | "subscriptions"
  | "shopping"
  | "utilities"
  | "healthcare"
  | "education"
  | "travel"
  | "investment"
  | "savings"
  | "debt_emi"
  | "insurance"
  | "salary"
  | "transfer"
  | "other";

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  food_dining: "Food & Dining",
  groceries: "Groceries",
  transport: "Transport",
  entertainment: "Entertainment",
  subscriptions: "Subscriptions",
  shopping: "Shopping",
  utilities: "Utilities",
  healthcare: "Healthcare",
  education: "Education",
  travel: "Travel",
  investment: "Investment",
  savings: "Savings",
  debt_emi: "Debt / EMI",
  insurance: "Insurance",
  salary: "Salary",
  transfer: "Transfer",
  other: "Other",
};

export interface Transaction {
  id: string;
  uid: string;
  accountId?: string;
  date: Date;
  description: string;
  category: TransactionCategory;
  amount: number; // always positive; use `type` for direction
  type: TransactionType;
  source: "manual" | "csv" | "excel";
  createdAt: Date;
}

// Raw shape from CSV / Excel before normalization
export interface RawTransactionRow {
  Date: string;
  Description: string;
  Category: string;
  Amount: string;
  Type: string;
}

// ── Financial Analysis ────────────────────────────────────

export interface CategoryBreakdown {
  category: TransactionCategory;
  label: string;
  amount: number;
  percentage: number;
  count: number;
}

export type ObservationType = "warning" | "info" | "positive";

export interface FinancialObservation {
  type: ObservationType;
  message: string;
  category?: TransactionCategory;
}

export interface FinancialProfile {
  uid: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number; // 0–100 (percentage)
  cashFlow: number; // income − expenses
  categoryBreakdown: CategoryBreakdown[];
  highestExpenseCategory: TransactionCategory;
  subscriptionSpend: number;
  debtEmiSpend: number;
  emergencyFundMonths: number; // estimated months of runway
  investmentRate: number; // % of income going to investments
  observations: FinancialObservation[];
  financialHealthScore: number; // 0–100 rule-based
  analysedAt: Date;
}

// ── Lessons ───────────────────────────────────────────────

export type LessonTopic =
  | "budgeting"
  | "saving"
  | "emergency_fund"
  | "debt"
  | "investing"
  | "goal_planning"
  | "insurance"
  | "digital_safety"
  | "spending_psychology"
  | "financial_independence";

export const TOPIC_LABELS: Record<LessonTopic, string> = {
  budgeting: "Budgeting",
  saving: "Smart Saving",
  emergency_fund: "Emergency Fund",
  debt: "Debt Management",
  investing: "Investing",
  goal_planning: "Goal Planning",
  insurance: "Insurance",
  digital_safety: "Digital Safety",
  spending_psychology: "Spending Psychology",
  financial_independence: "Financial Independence",
};

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  topic: LessonTopic;
  title: string;
  objective: string;
  content: string; // markdown prose
  keyTakeaways: string[];
  quiz: [QuizQuestion, QuizQuestion]; // exactly two questions
  estimatedMinutes: number;
  defaultOrder: number; // 1–10; overridden by recommendation engine
}

// ── Quiz Results ──────────────────────────────────────────

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface QuizResult {
  id: string;
  uid: string;
  lessonId: string;
  answers: QuizAnswer[];
  score: number; // 0 | 50 | 100
  passed: boolean; // true if score >= 50 (at least 1/2 correct)
  attempt: number; // 1-based attempt number
  completedAt: Date;
}

// ── Progress ──────────────────────────────────────────────

export type LessonStatus =
  | "locked"
  | "unlocked"
  | "in_progress"
  | "completed";

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  completedAt?: Date;
  bestQuizScore?: number; // 0–100
  attempts: number;
}

export interface SkillProgress {
  topic: LessonTopic;
  label: string;
  percentage: number; // 0–100
}

export interface UserProgress {
  uid: string;
  literacyScore: number; // 0–1000
  financialHealthScore: number; // 0–100 from analysis
  currentLessonId: string | null;
  lessonProgress: LessonProgress[];
  skillProgress: SkillProgress[];
  quizAccuracy: number; // percentage
  currentStreak: number; // days
  lastActiveAt: Date;
  roadmap: string[]; // ordered lesson IDs
  updatedAt: Date;
}

// ── Achievements ──────────────────────────────────────────

export type AchievementType =
  | "first_lesson"
  | "first_quiz_passed"
  | "three_day_streak"
  | "five_day_streak"
  | "saving_explorer"
  | "budget_beginner"
  | "financial_learner"
  | "debt_slayer"
  | "investment_starter"
  | "quiz_perfectionist";

export interface Achievement {
  id: string;
  uid: string;
  type: AchievementType;
  title: string;
  description: string;
  emoji: string;
  unlockedAt: Date;
}

// ── AI Mentor ─────────────────────────────────────────────

export interface MentorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ── Lesson Personalization (AI) ───────────────────────────

export interface LessonPersonalization {
  insight: string; // 2–3 sentences connecting lesson to user data
  action: string; // one concrete action the user can take this week
}

// ── UI Helpers ────────────────────────────────────────────

export interface NavItem {
  label: string;
  to: string;
  icon: string; // lucide icon name
}
