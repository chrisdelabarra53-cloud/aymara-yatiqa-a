import type {
  Exercise,
  ExerciseType,
  Lesson,
  Phrase,
  Unit,
  Word,
} from "@/backend";

export type { Exercise, ExerciseType, Lesson, Phrase, Unit, Word };

/** Niveles de usuario que suben con el XP acumulado. */
export type Level =
  | "Principiante"
  | "Explorador"
  | "Aprendiz"
  | "Hablante inicial"
  | "Conversador"
  | "Hablante avanzado";

export interface LevelThreshold {
  level: Level;
  minXp: number;
}

/** Umbrales de XP para cada nivel. */
export const LEVELS: LevelThreshold[] = [
  { level: "Principiante", minXp: 0 },
  { level: "Explorador", minXp: 100 },
  { level: "Aprendiz", minXp: 300 },
  { level: "Hablante inicial", minXp: 700 },
  { level: "Conversador", minXp: 1400 },
  { level: "Hablante avanzado", minXp: 2400 },
];

/** Progreso local del modo invitado, persistido en el dispositivo. */
export interface UserProgress {
  /** Nombre del usuario (modo invitado). */
  name: string;
  /** Avatar seleccionado (índice de la lista de avatares). */
  avatar: number;
  /** XP total acumulado. */
  xp: number;
  /** Racha diaria actual. */
  streak: number;
  /** Objetivo diario de XP configurable. */
  dailyGoal: number;
  /** XP ganado hoy. */
  xpToday: number;
  /** Fecha (YYYY-MM-DD) de la última actividad registrada. */
  lastActivityDate: string | null;
  /** Lecciones completadas, indexadas por id de lección. */
  completedLessons: string[];
  /** Palabras aprendidas, indexadas por id de palabra. */
  learnedWords: string[];
  /** Dominio por palabra (0-100), indexado por id de palabra. */
  mastery: Record<string, number>;
  /** Sonido activado o desactivado. */
  soundEnabled: boolean;
}

/** Estado de dominio de una palabra aprendida. */
export type MasteryStatus = "nueva" | "aprendida" | "dominada";

export function masteryStatus(mastery: number): MasteryStatus {
  if (mastery >= 80) return "dominada";
  if (mastery >= 40) return "aprendida";
  return "nueva";
}
