import { useState, useEffect, useCallback } from "react";
import type { UserProgress, LessonStatus } from "@/types";
import { getProgress, saveProgress, getAchievements } from "@/lib/firestore";
import type { Achievement } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { LESSONS } from "@/data/lessons";
import { computeLiteracyScore } from "@/engine/recommendationEngine";

const DEFAULT_PROGRESS = (uid: string): UserProgress => ({
  uid,
  literacyScore: 0,
  financialHealthScore: 0,
  currentLessonId: null,
  lessonProgress: LESSONS.map((l, i) => ({
    lessonId: l.id,
    status: (i === 0 ? "unlocked" : "locked") as LessonStatus,
    attempts: 0,
  })),
  skillProgress: LESSONS.map((l) => ({
    topic: l.topic,
    label: l.title.split(":")[0],
    percentage: 0,
  })),
  quizAccuracy: 0,
  currentStreak: 0,
  lastActiveAt: new Date(),
  roadmap: LESSONS.map((l) => l.id),
  updatedAt: new Date(),
});

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [p, a] = await Promise.all([
        getProgress(user.uid),
        getAchievements(user.uid),
      ]);
      setProgress(p ?? DEFAULT_PROGRESS(user.uid));
      setAchievements(a);
    } catch (err) {
      console.error("Failed to load progress", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const updateProgress = async (data: Partial<Omit<UserProgress, "uid">>) => {
    if (!user || !progress) return;
    const updated = { ...progress, ...data, updatedAt: new Date() };
    setProgress(updated);
    await saveProgress(user.uid, data);
  };

  const markLessonComplete = async (lessonId: string, quizScore: number) => {
    if (!user || !progress) return;

    const updatedLessonProgress = progress.lessonProgress.map((lp, idx) => {
      if (lp.lessonId === lessonId) {
        return {
          ...lp,
          status: "completed" as LessonStatus,
          completedAt: new Date(),
          bestQuizScore: Math.max(lp.bestQuizScore ?? 0, quizScore),
          attempts: lp.attempts + 1,
        };
      }
      // Unlock the next lesson
      const lessonIds = progress.roadmap;
      const currentIdx = lessonIds.indexOf(lessonId);
      if (
        idx > 0 &&
        progress.lessonProgress[idx - 1]?.lessonId === lessonId &&
        lp.status === "locked"
      ) {
        return { ...lp, status: "unlocked" as LessonStatus };
      }
      // Unlock next by roadmap position
      if (
        lessonIds[currentIdx + 1] === lp.lessonId &&
        lp.status === "locked"
      ) {
        return { ...lp, status: "unlocked" as LessonStatus };
      }
      return lp;
    });

    const completedCount = updatedLessonProgress.filter(
      (lp) => lp.status === "completed",
    ).length;

    const avgQuizScore =
      updatedLessonProgress
        .filter((lp) => lp.bestQuizScore !== undefined)
        .reduce((sum, lp) => sum + (lp.bestQuizScore ?? 0), 0) /
      Math.max(completedCount, 1);

    const newLiteracyScore = computeLiteracyScore({
      lessonsCompleted: completedCount,
      totalLessons: LESSONS.length,
      quizAccuracy: avgQuizScore,
      streakDays: progress.currentStreak,
      achievementCount: achievements.length,
    });

    const updatedSkillProgress = progress.skillProgress.map((sp) => {
      const lessonForTopic = LESSONS.find((l) => l.topic === sp.topic);
      if (!lessonForTopic) return sp;
      const lp = updatedLessonProgress.find(
        (l) => l.lessonId === lessonForTopic.id,
      );
      return {
        ...sp,
        percentage: lp?.status === "completed" ? 100 : lp?.status === "in_progress" ? 50 : 0,
      };
    });

    await updateProgress({
      lessonProgress: updatedLessonProgress,
      skillProgress: updatedSkillProgress,
      literacyScore: newLiteracyScore,
      quizAccuracy: avgQuizScore,
    });
  };

  return {
    progress,
    achievements,
    loading,
    updateProgress,
    markLessonComplete,
    refresh: fetchProgress,
  };
}
