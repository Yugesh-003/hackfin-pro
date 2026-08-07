import { useState, useEffect, useCallback } from "react";
import type { Transaction } from "@/types";
import {
  getTransactions,
  addTransaction,
  addTransactionsBatch,
  deleteTransaction,
} from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getTransactions(user.uid);
      setTransactions(data);
    } catch (err) {
      setError("Failed to load transactions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addOne = async (
    tx: Omit<Transaction, "id" | "uid" | "createdAt">,
  ) => {
    if (!user) return;
    await addTransaction(user.uid, tx);
    await fetchTransactions();
  };

  const addMany = async (
    txs: Omit<Transaction, "id" | "uid" | "createdAt">[],
  ) => {
    if (!user) return;
    await addTransactionsBatch(user.uid, txs);
    await fetchTransactions();
  };

  const removeOne = async (txId: string) => {
    await deleteTransaction(txId);
    setTransactions((prev) => prev.filter((t) => t.id !== txId));
  };

  return {
    transactions,
    loading,
    error,
    addOne,
    addMany,
    removeOne,
    refresh: fetchTransactions,
  };
}
