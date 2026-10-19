import type { Level, UserProgress } from "@/lib/types";
import { LEVELS } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "aymara-yatiqana-progress";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function levelForXp(xp: number): Level {
  let current: Level = LEVELS[0].level;
  for (const t of LEVELS) {
    if (xp >= t.minXp) current = t.level;
  }
  return current;
}

interface ProgressState extends UserProgress {
  /** Nivel derivado del XP acumulado. */
  level: Level;
  /** Añade XP y actualiza racha, XP del día y nivel. */
  addXp: (amount: number) => void;
  /** Marca una lección como completada y otorga su XP. */
  completeLesson: (lessonId: string, xp: number) => void;
  /** Registra una palabra aprendida con su dominio. */
  learnWord: (wordId: string, mastery: number) => void;
  /** Actualiza el dominio de una palabra. */
  updateMastery: (wordId: string, mastery: number) => void;
  /** Establece el nombre del usuario. */
  setName: (name: string) => void;
  /** Establece el avatar seleccionado. */
  setAvatar: (avatar: number) => void;
  /** Establece el objetivo diario. */
  setDailyGoal: (goal: number) => void;
  /** Activa o desactiva el sonido. */
  setSoundEnabled: (enabled: boolean) => void;
  /** Reinicia todo el progreso local. */
  resetProgress: () => void;
}

const initialState: UserProgress = {
  name: "",
  avatar: 0,
  xp: 0,
  streak: 0,
  dailyGoal: 20,
  xpToday: 0,
  lastActivityDate: null,
  completedLessons: [],
  learnedWords: [],
  mastery: {},
  soundEnabled: true,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,
      level: levelForXp(0),

      addXp: (amount) => {
        const state = get();
        const today = todayKey();
        const isNewDay = state.lastActivityDate !== today;
        const streak = isNewDay
          ? state.lastActivityDate === null
            ? 1
            : state.streak + 1
          : state.streak;
        set({
          xp: state.xp + amount,
          xpToday: isNewDay ? amount : state.xpToday + amount,
          streak,
          lastActivityDate: today,
          level: levelForXp(state.xp + amount),
        });
      },

      completeLesson: (lessonId, xp) => {
        const state = get();
        if (state.completedLessons.includes(lessonId)) {
          // Ya completada: solo refresca la racha del día.
          state.addXp(0);
          return;
        }
        set({ completedLessons: [...state.completedLessons, lessonId] });
        state.addXp(xp);
      },

      learnWord: (wordId, mastery) => {
        const state = get();
        if (state.learnedWords.includes(wordId)) {
          set({ mastery: { ...state.mastery, [wordId]: mastery } });
          return;
        }
        set({
          learnedWords: [...state.learnedWords, wordId],
          mastery: { ...state.mastery, [wordId]: mastery },
        });
      },

      updateMastery: (wordId, mastery) => {
        set((s) => ({ mastery: { ...s.mastery, [wordId]: mastery } }));
      },

      setName: (name) => set({ name }),
      setAvatar: (avatar) => set({ avatar }),
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      resetProgress: () => set({ ...initialState, level: levelForXp(0) }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => {
        const { level: _level, ...rest } = state;
        return rest;
      },
    },
  ),
);
