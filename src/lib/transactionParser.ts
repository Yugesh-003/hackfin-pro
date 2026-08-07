/**
 * Transaction parser utility.
 * Converts raw CSV/Excel rows into normalized Transaction objects.
 *
 * Expected columns (case-insensitive):
 *   Date | Description | Category | Amount | Type
 */

import type {
  Transaction,
  TransactionCategory,
  TransactionType,
  RawTransactionRow,
} from "@/types";

// ── Category name → TransactionCategory mapping ────────────────────────────

const CATEGORY_MAP: Record<string, TransactionCategory> = {
  // Food
  food: "food_dining",
  dining: "food_dining",
  "food & dining": "food_dining",
  "food and dining": "food_dining",
  restaurant: "food_dining",
  delivery: "food_dining",
  zomato: "food_dining",
  swiggy: "food_dining",

  // Groceries
  grocery: "groceries",
  groceries: "groceries",
  supermarket: "groceries",

  // Transport
  transport: "transport",
  transportation: "transport",
  cab: "transport",
  uber: "transport",
  ola: "transport",
  fuel: "transport",
  petrol: "transport",
  metro: "transport",

  // Entertainment
  entertainment: "entertainment",
  movies: "entertainment",
  gaming: "entertainment",
  sports: "entertainment",

  // Subscriptions
  subscription: "subscriptions",
  subscriptions: "subscriptions",
  netflix: "subscriptions",
  spotify: "subscriptions",
  prime: "subscriptions",
  hotstar: "subscriptions",

  // Shopping
  shopping: "shopping",
  amazon: "shopping",
  flipkart: "shopping",
  clothing: "shopping",
  apparel: "shopping",

  // Utilities
  utilities: "utilities",
  utility: "utilities",
  electricity: "utilities",
  water: "utilities",
  gas: "utilities",
  internet: "utilities",
  mobile: "utilities",
  phone: "utilities",

  // Healthcare
  healthcare: "healthcare",
  medical: "healthcare",
  pharmacy: "healthcare",
  hospital: "healthcare",
  doctor: "healthcare",

  // Education
  education: "education",
  course: "education",
  books: "education",
  school: "education",
  college: "education",

  // Travel
  travel: "travel",
  hotel: "travel",
  flight: "travel",
  vacation: "travel",

  // Investment
  investment: "investment",
  "mutual fund": "investment",
  "mutual funds": "investment",
  stocks: "investment",
  sip: "investment",

  // Savings
  savings: "savings",
  saving: "savings",
  fd: "savings",
  "fixed deposit": "savings",
  rd: "savings",

  // Debt / EMI
  debt: "debt_emi",
  emi: "debt_emi",
  loan: "debt_emi",
  "credit card": "debt_emi",
  "debt/emi": "debt_emi",
  "debt emi": "debt_emi",

  // Insurance
  insurance: "insurance",
  lic: "insurance",
  policy: "insurance",

  // Salary / Income
  salary: "salary",
  income: "salary",
  wages: "salary",

  // Transfer
  transfer: "transfer",
  "self transfer": "transfer",
  "inter-bank transfer": "transfer",
};

function normalizeCategory(raw: string): TransactionCategory {
  const key = raw.toLowerCase().trim();
  return CATEGORY_MAP[key] ?? "other";
}

function normalizeType(raw: string): TransactionType {
  const key = raw.toLowerCase().trim();
  if (key === "credit" || key === "cr" || key === "in" || key === "income") {
    return "credit";
  }
  return "debit";
}

function parseDate(raw: string): Date {
  // Try common formats: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD-MM-YYYY
  const cleaned = raw.trim();

  // ISO format
  if (/^\d{4}-\d{2}-\d{2}/.test(cleaned)) {
    return new Date(cleaned);
  }

  // DD/MM/YYYY
  const dmyMatch = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    const year = y.length === 2 ? `20${y}` : y;
    return new Date(`${year}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
  }

  return new Date(cleaned);
}

// ── CSV Parser ─────────────────────────────────────────────────────────────────

export async function parseCSV(
  file: File,
  uid: string,
): Promise<Omit<Transaction, "id" | "uid" | "createdAt">[]> {
  const { default: Papa } = await import("papaparse");

  return new Promise((resolve, reject) => {
    Papa.parse<RawTransactionRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        try {
          resolve(normalizeRows(results.data, uid));
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => reject(err),
    });
  });
}

// ── Excel Parser ───────────────────────────────────────────────────────────────

export async function parseExcel(
  file: File,
  uid: string,
): Promise<Omit<Transaction, "id" | "uid" | "createdAt">[]> {
  const XLSX = await import("xlsx");

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<RawTransactionRow>(sheet, {
    defval: "",
    raw: false,
  });

  return normalizeRows(rows, uid);
}

// ── Row normalizer ─────────────────────────────────────────────────────────────

function normalizeRows(
  rows: RawTransactionRow[],
  _uid: string,
): Omit<Transaction, "id" | "uid" | "createdAt">[] {
  return rows
    .filter((row) => row.Amount && row.Date)
    .map((row) => ({
      date: parseDate(row.Date ?? ""),
      description: (row.Description ?? "").trim() || "Transaction",
      category: normalizeCategory(row.Category ?? ""),
      amount: Math.abs(parseFloat((row.Amount ?? "0").replace(/[₹,]/g, ""))),
      type: normalizeType(row.Type ?? "debit"),
      source: "csv" as const,
    }));
}
