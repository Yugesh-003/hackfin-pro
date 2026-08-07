import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  FileText,
  PlusCircle,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Download,
  Receipt,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/hooks/useTransactions";
import { parseCSV, parseExcel } from "@/lib/transactionParser";
import { CATEGORY_LABELS } from "@/types";
import type {
  Transaction,
  TransactionCategory,
  TransactionType,
} from "@/types";
import { Reveal } from "@/components/landing/Reveal";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/transactions")({
  head: () => ({ meta: [{ title: "Transactions — FinMentor AI" }] }),
  component: TransactionsPage,
});

// ── Category badge colors ──────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  food_dining: "bg-orange-100 text-orange-700",
  groceries: "bg-green-100 text-green-700",
  transport: "bg-blue-100 text-blue-700",
  entertainment: "bg-purple-100 text-purple-700",
  subscriptions: "bg-indigo-100 text-indigo-700",
  shopping: "bg-pink-100 text-pink-700",
  utilities: "bg-gray-100 text-gray-700",
  healthcare: "bg-red-100 text-red-700",
  education: "bg-cyan-100 text-cyan-700",
  travel: "bg-sky-100 text-sky-700",
  investment: "bg-emerald-100 text-emerald-700",
  savings: "bg-teal-100 text-teal-700",
  debt_emi: "bg-rose-100 text-rose-700",
  insurance: "bg-violet-100 text-violet-700",
  salary: "bg-lime-100 text-lime-700",
  transfer: "bg-slate-100 text-slate-700",
  other: "bg-muted text-muted-foreground",
};

// ── Manual Entry Form ──────────────────────────────────────────────────────────

const EMPTY_FORM = {
  date: new Date().toISOString().split("T")[0],
  description: "",
  category: "other" as TransactionCategory,
  amount: "",
  type: "debit" as TransactionType,
};

function ManualEntryForm({ onSuccess }: { onSuccess: () => void }) {
  const { addOne } = useTransactions();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    setLoading(true);
    try {
      await addOne({
        date: new Date(form.date),
        description: form.description || "Transaction",
        category: form.category,
        amount,
        type: form.type,
        source: "manual",
      });
      setForm(EMPTY_FORM);
      onSuccess();
    } catch {
      setError("Failed to save transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tx-date">Date</Label>
          <Input
            id="tx-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tx-amount">Amount (₹)</Label>
          <Input
            id="tx-amount"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className="rounded-xl"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tx-description">Description</Label>
        <Input
          id="tx-description"
          placeholder="Zomato order, Electricity bill…"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className="rounded-xl"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tx-type">Type</Label>
          <Select
            value={form.type}
            onValueChange={(v) =>
              setForm((f) => ({ ...f, type: v as TransactionType }))
            }
          >
            <SelectTrigger id="tx-type" className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="debit">Debit (Money out)</SelectItem>
              <SelectItem value="credit">Credit (Money in)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tx-category">Category</Label>
          <Select
            value={form.category}
            onValueChange={(v) =>
              setForm((f) => ({ ...f, category: v as TransactionCategory }))
            }
          >
            <SelectTrigger id="tx-category" className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="rounded-full bg-gradient-brand hover:opacity-90"
      >
        <PlusCircle className="h-4 w-4" />
        {loading ? "Saving…" : "Add Transaction"}
      </Button>
    </form>
  );
}

// ── Upload Zone ────────────────────────────────────────────────────────────────

function UploadZone({
  accept,
  label,
  onFile,
}: {
  accept: string;
  label: string;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex flex-col items-center justify-center gap-3 cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all",
        dragging
          ? "border-primary bg-primary-soft/50"
          : "border-border hover:border-primary/50 hover:bg-muted/50",
      )}
    >
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Upload className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          Drop your {label} here
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          or click to browse — {accept}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ── Upload Panel (CSV or Excel) ────────────────────────────────────────────────

function FileUploadPanel({
  type,
  onSuccess,
}: {
  type: "csv" | "excel";
  onSuccess: () => void;
}) {
  const { addMany } = useTransactions();
  const { user } = useAuth();
  const [status, setStatus] = useState<
    "idle" | "parsing" | "success" | "error"
  >("idle");
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!user) return;
    setStatus("parsing");
    setError(null);
    try {
      const rows =
        type === "csv"
          ? await parseCSV(file, user.uid)
          : await parseExcel(file, user.uid);

      if (rows.length === 0) {
        throw new Error(
          "No valid rows found. Check that the file has Date, Description, Category, Amount, and Type columns.",
        );
      }

      await addMany(rows);
      setCount(rows.length);
      setStatus("success");
      setTimeout(onSuccess, 1500);
    } catch (err: unknown) {
      setStatus("error");
      setError(
        (err as Error).message ?? "Failed to parse file. Please check the format.",
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Template download */}
      <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium">Use our template</span>
          <span className="text-muted-foreground">
            — Date, Description, Category, Amount, Type
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs"
          onClick={() => {
            const header = "Date,Description,Category,Amount,Type\n";
            const sample =
              "2024-01-15,Zomato order,food_dining,350,debit\n" +
              "2024-01-16,Salary,salary,50000,credit\n" +
              "2024-01-17,Netflix,subscriptions,649,debit\n";
            const blob = new Blob([header + sample], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "finmentor_template.csv";
            a.click();
          }}
        >
          <Download className="h-3.5 w-3.5" />
          Download Template
        </Button>
      </div>

      <UploadZone
        accept={type === "csv" ? ".csv" : ".xlsx,.xls"}
        label={type === "csv" ? "CSV file" : "Excel file"}
        onFile={handleFile}
      />

      <AnimatePresence>
        {status === "parsing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Parsing file…
          </motion.div>
        )}
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-primary font-medium"
          >
            <CheckCircle2 className="h-4 w-4" />
            {count} transactions imported successfully!
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Transaction Row ────────────────────────────────────────────────────────────

function TransactionRow({
  tx,
  onDelete,
}: {
  tx: Transaction;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-foreground truncate">
            {tx.description}
          </p>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
              CATEGORY_COLORS[tx.category] ?? CATEGORY_COLORS.other,
            )}
          >
            {CATEGORY_LABELS[tx.category]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {new Date(tx.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <p
        className={cn(
          "text-sm font-semibold shrink-0",
          tx.type === "credit" ? "text-primary" : "text-foreground",
        )}
      >
        {tx.type === "credit" ? "+" : "−"}₹
        {tx.amount.toLocaleString("en-IN")}
      </p>

      <button
        onClick={() => onDelete(tx.id)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded-lg"
        aria-label="Delete transaction"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

function TransactionsPage() {
  const { transactions, loading, removeOne, refresh } = useTransactions();

  const handleSuccess = () => {
    refresh();
  };

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Transactions"
        description="Import your bank transactions to power your personalized learning journey."
      />

      {/* Import / Entry Tabs */}
      <Reveal>
        <div className="card-surface p-6">
          <Tabs defaultValue="csv">
            <TabsList className="rounded-xl mb-6">
              <TabsTrigger value="csv" className="rounded-lg">
                CSV Upload
              </TabsTrigger>
              <TabsTrigger value="excel" className="rounded-lg">
                Excel Upload
              </TabsTrigger>
              <TabsTrigger value="manual" className="rounded-lg">
                Manual Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="csv">
              <FileUploadPanel type="csv" onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="excel">
              <FileUploadPanel type="excel" onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="manual">
              <ManualEntryForm onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
        </div>
      </Reveal>

      {/* Transaction List */}
      <Reveal delayIndex={1}>
        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Receipt className="h-4.5 w-4.5 text-primary" />
              All Transactions
              {transactions.length > 0 && (
                <Badge variant="secondary" className="rounded-full text-xs">
                  {transactions.length}
                </Badge>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState
              icon={<Receipt className="h-8 w-8" />}
              title="No transactions yet"
              description="Upload a CSV or Excel file, or add transactions manually above."
            />
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  onDelete={removeOne}
                />
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
