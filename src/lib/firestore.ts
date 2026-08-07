/**
 * Firestore CRUD helpers.
 * All operations are scoped to the authenticated user's UID.
 * Collections follow the schema defined in PROJECT.md.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Account,
  Transaction,
  UserProgress,
  QuizResult,
  Achievement,
  FinancialProfile,
} from "@/types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function toDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return new Date(value as string);
}

function deserialize<T>(data: DocumentData, id: string): T {
  const out: Record<string, unknown> = { id, ...data };
  // Convert Firestore Timestamps to JS Date objects
  for (const key of Object.keys(out)) {
    if (out[key] instanceof Timestamp) {
      out[key] = toDate(out[key]);
    }
  }
  return out as T;
}

// ── Users ──────────────────────────────────────────────────────────────────────

export async function getUser(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return deserialize<DocumentData>(snap.data(), snap.id);
}

export async function updateUser(uid: string, data: Partial<DocumentData>) {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ── Accounts ───────────────────────────────────────────────────────────────────

export async function getAccounts(uid: string): Promise<Account[]> {
  const q = query(collection(db, "accounts"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => deserialize<Account>(d.data(), d.id));
}

export async function createAccount(
  uid: string,
  data: Omit<Account, "id" | "uid" | "createdAt">,
): Promise<string> {
  const ref = await addDoc(collection(db, "accounts"), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteAccount(accountId: string) {
  await deleteDoc(doc(db, "accounts", accountId));
}

// ── Transactions ───────────────────────────────────────────────────────────────

export async function getTransactions(uid: string): Promise<Transaction[]> {
  const q = query(
    collection(db, "transactions"),
    where("uid", "==", uid),
    orderBy("date", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => deserialize<Transaction>(d.data(), d.id));
}

export async function addTransaction(
  uid: string,
  data: Omit<Transaction, "id" | "uid" | "createdAt">,
): Promise<string> {
  const ref = await addDoc(collection(db, "transactions"), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function addTransactionsBatch(
  uid: string,
  items: Omit<Transaction, "id" | "uid" | "createdAt">[],
): Promise<void> {
  // Firestore doesn't support bulk writes without batched writes,
  // but for simplicity in MVP we write sequentially.
  for (const item of items) {
    await addDoc(collection(db, "transactions"), {
      ...item,
      uid,
      createdAt: serverTimestamp(),
    });
  }
}

export async function deleteTransaction(txId: string) {
  await deleteDoc(doc(db, "transactions", txId));
}

// ── Financial Profile (cached analysis result) ─────────────────────────────────

export async function getFinancialProfile(
  uid: string,
): Promise<FinancialProfile | null> {
  const snap = await getDoc(doc(db, "financialProfiles", uid));
  if (!snap.exists()) return null;
  return deserialize<FinancialProfile>(snap.data(), snap.id);
}

export async function saveFinancialProfile(
  uid: string,
  profile: Omit<FinancialProfile, "uid">,
) {
  await setDoc(doc(db, "financialProfiles", uid), {
    ...profile,
    uid,
    analysedAt: serverTimestamp(),
  });
}

// ── Progress ───────────────────────────────────────────────────────────────────

export async function getProgress(uid: string): Promise<UserProgress | null> {
  const snap = await getDoc(doc(db, "progress", uid));
  if (!snap.exists()) return null;
  return deserialize<UserProgress>(snap.data(), snap.id);
}

export async function saveProgress(
  uid: string,
  data: Partial<Omit<UserProgress, "uid">>,
) {
  await setDoc(
    doc(db, "progress", uid),
    { ...data, uid, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

// ── Quiz Results ───────────────────────────────────────────────────────────────

export async function saveQuizResult(
  uid: string,
  result: Omit<QuizResult, "id" | "uid" | "completedAt">,
): Promise<string> {
  const ref = await addDoc(collection(db, "quizResults"), {
    ...result,
    uid,
    completedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getQuizResults(uid: string): Promise<QuizResult[]> {
  const q = query(collection(db, "quizResults"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => deserialize<QuizResult>(d.data(), d.id));
}

// ── Achievements ───────────────────────────────────────────────────────────────

export async function getAchievements(uid: string): Promise<Achievement[]> {
  const q = query(
    collection(db, "achievements"),
    where("uid", "==", uid),
    orderBy("unlockedAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => deserialize<Achievement>(d.data(), d.id));
}

export async function unlockAchievement(
  uid: string,
  achievement: Omit<Achievement, "id" | "uid" | "unlockedAt">,
): Promise<string> {
  const ref = await addDoc(collection(db, "achievements"), {
    ...achievement,
    uid,
    unlockedAt: serverTimestamp(),
  });
  return ref.id;
}
