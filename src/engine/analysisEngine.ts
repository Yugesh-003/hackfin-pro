/**
 * Financial Analysis Engine — completely rule-based, zero AI.
 *
 * Input:  Transaction[]
 * Output: FinancialProfile
 *
 * Scoring rubric (0–100):
 *   Savings rate      0–30 pts  (ideal ≥ 20%)
 *   Debt/EMI ratio    0–20 pts  (ideal < 30% of expenses)
 *   Emergency fund    0–20 pts  (ideal ≥ 3 months)
 *   Investment rate   0–15 pts  (ideal ≥ 10% of income)
 *   Subscription load 0–15 pts  (ideal < 10% of expenses)
 */

import type {
  Transaction,
  TransactionCategory,
  FinancialProfile,
  CategoryBreakdown,
  FinancialObservation,
} from "@/types";
import { CATEGORY_LABELS } from "@/types";

// ── Internal helpers ──────────────────────────────────────────────────────────

const INCOME_CATEGORIES: TransactionCategory[] = ["salary"];
const SAVINGS_CATEGORIES: TransactionCategory[] = ["savings", "investment"];
const TRANSFER_CATEGORIES: TransactionCategory[] = ["transfer"];

function sum(txns: Transaction[]): number {
  return txns.reduce((acc, t) => acc + t.amount, 0);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ── Main export ───────────────────────────────────────────────────────────────

export function analyzeTransactions(
  uid: string,
  transactions: Transaction[],
): FinancialProfile {
  if (transactions.length === 0) {
    return emptyProfile(uid);
  }

  // Exclude internal transfers from spending analysis
  const nonTransfer = transactions.filter(
    (t) => !TRANSFER_CATEGORIES.includes(t.category),
  );

  const credits = nonTransfer.filter((t) => t.type === "credit");
  const debits = nonTransfer.filter((t) => t.type === "debit");

  // ── Income & Expenses ────────────────────────────────────────────────────

  // Salary credits = income; other credits (savings inflows, etc.) excluded
  const incomeTransactions = credits.filter((t) =>
    INCOME_CATEGORIES.includes(t.category),
  );
  const monthlyIncome = sum(incomeTransactions) || sum(credits); // fallback to all credits

  const monthlyExpenses = sum(
    debits.filter((t) => !SAVINGS_CATEGORIES.includes(t.category)),
  );

  const savingsAndInvestments = sum(
    debits.filter((t) => SAVINGS_CATEGORIES.includes(t.category)),
  );

  const savingsRate =
    monthlyIncome > 0
      ? clamp(
          ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100,
          0,
          100,
        )
      : 0;

  const investmentRate =
    monthlyIncome > 0
      ? clamp((savingsAndInvestments / monthlyIncome) * 100, 0, 100)
      : 0;

  const cashFlow = monthlyIncome - monthlyExpenses;

  // ── Category Breakdown ───────────────────────────────────────────────────

  const categoryMap = new Map<
    TransactionCategory,
    { amount: number; count: number }
  >();

  for (const t of debits) {
    if (SAVINGS_CATEGORIES.includes(t.category)) continue;
    const existing = categoryMap.get(t.category) ?? { amount: 0, count: 0 };
    categoryMap.set(t.category, {
      amount: existing.amount + t.amount,
      count: existing.count + 1,
    });
  }

  const totalExpenses = monthlyExpenses || 1; // avoid divide-by-zero

  const categoryBreakdown: CategoryBreakdown[] = Array.from(
    categoryMap.entries(),
  )
    .map(([category, { amount, count }]) => ({
      category,
      label: CATEGORY_LABELS[category],
      amount,
      percentage: parseFloat(((amount / totalExpenses) * 100).toFixed(1)),
      count,
    }))
    .sort((a, b) => b.amount - a.amount);

  const highestExpenseCategory =
    categoryBreakdown[0]?.category ?? "other";

  // ── Specific spend buckets ───────────────────────────────────────────────

  const subscriptionSpend =
    categoryMap.get("subscriptions")?.amount ?? 0;
  const debtEmiSpend = categoryMap.get("debt_emi")?.amount ?? 0;

  // ── Emergency Fund Estimate ──────────────────────────────────────────────
  // How many months of expenses are covered by savings/investments in statement

  const emergencyFundMonths =
    monthlyExpenses > 0
      ? clamp(savingsAndInvestments / (monthlyExpenses / 12), 0, 12)
      : 0;

  // ── Observations ────────────────────────────────────────────────────────

  const observations: FinancialObservation[] = [];

  if (savingsRate < 10) {
    observations.push({
      type: "warning",
      message: "Your savings rate is below 10%. Financial experts recommend saving at least 20% of income.",
    });
  } else if (savingsRate >= 20) {
    observations.push({
      type: "positive",
      message: `Great savings rate of ${savingsRate.toFixed(0)}%. You're building a strong financial foundation.`,
    });
  }

  const foodDiningAmount = categoryMap.get("food_dining")?.amount ?? 0;
  if (foodDiningAmount / totalExpenses > 0.25) {
    observations.push({
      type: "warning",
      message: "Food & dining accounts for over 25% of your expenses. Small changes here can free up significant savings.",
      category: "food_dining",
    });
  }

  if (subscriptionSpend / totalExpenses > 0.1) {
    observations.push({
      type: "info",
      message: "Subscription spending exceeds 10% of expenses. Review which subscriptions you're actively using.",
      category: "subscriptions",
    });
  }

  if (debtEmiSpend / monthlyIncome > 0.4) {
    observations.push({
      type: "warning",
      message: "Debt & EMI payments exceed 40% of income. High debt burden limits your financial flexibility.",
      category: "debt_emi",
    });
  }

  if (investmentRate < 5 && monthlyIncome > 0) {
    observations.push({
      type: "info",
      message: "No significant investments detected. Starting early, even with small amounts, creates long-term wealth.",
    });
  }

  if (emergencyFundMonths < 3) {
    observations.push({
      type: "warning",
      message: "Emergency fund appears insufficient. Aim for 3–6 months of expenses as a financial safety net.",
    });
  }

  // ── Financial Health Score ───────────────────────────────────────────────

  let score = 0;

  // Savings rate (0–30 pts)
  if (savingsRate >= 30) score += 30;
  else if (savingsRate >= 20) score += 24;
  else if (savingsRate >= 10) score += 16;
  else if (savingsRate >= 5) score += 8;

  // Debt/EMI ratio (0–20 pts; lower is better)
  const debtRatio = monthlyIncome > 0 ? debtEmiSpend / monthlyIncome : 1;
  if (debtRatio < 0.1) score += 20;
  else if (debtRatio < 0.2) score += 16;
  else if (debtRatio < 0.3) score += 10;
  else if (debtRatio < 0.4) score += 5;

  // Emergency fund (0–20 pts)
  if (emergencyFundMonths >= 6) score += 20;
  else if (emergencyFundMonths >= 3) score += 14;
  else if (emergencyFundMonths >= 1) score += 7;

  // Investment rate (0–15 pts)
  if (investmentRate >= 15) score += 15;
  else if (investmentRate >= 10) score += 12;
  else if (investmentRate >= 5) score += 7;
  else if (investmentRate >= 2) score += 3;

  // Subscription load (0–15 pts; lower is better)
  const subRatio = totalExpenses > 0 ? subscriptionSpend / totalExpenses : 0;
  if (subRatio < 0.05) score += 15;
  else if (subRatio < 0.1) score += 10;
  else if (subRatio < 0.15) score += 5;

  return {
    uid,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    cashFlow,
    categoryBreakdown,
    highestExpenseCategory,
    subscriptionSpend,
    debtEmiSpend,
    emergencyFundMonths,
    investmentRate,
    observations,
    financialHealthScore: clamp(Math.round(score), 0, 100),
    analysedAt: new Date(),
  };
}

function emptyProfile(uid: string): FinancialProfile {
  return {
    uid,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
    cashFlow: 0,
    categoryBreakdown: [],
    highestExpenseCategory: "other",
    subscriptionSpend: 0,
    debtEmiSpend: 0,
    emergencyFundMonths: 0,
    investmentRate: 0,
    observations: [],
    financialHealthScore: 0,
    analysedAt: new Date(),
  };
}
