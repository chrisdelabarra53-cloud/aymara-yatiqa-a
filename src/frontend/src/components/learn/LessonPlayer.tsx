import type { LessonId, UnitId } from "@/backend";
import { PrimaryButton } from "@/components/PrimaryButton";
import { XpToast } from "@/components/XpToast";
import { AudioPill } from "@/components/learn/AudioPill";
import { ExerciseCard } from "@/components/learn/ExerciseCard";
import { LessonResults } from "@/components/learn/LessonResults";
import { useLesson, useUnits, useWords } from "@/hooks/useQueries";
import { useProgressStore } from "@/lib/progress-store";
import { ArrowLeft, BookOpen, Info, ListChecks } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

type Phase = "intro" | "vocab" | "examples" | "exercises" | "results";

interface LessonPlayerProps {
  unitId: UnitId;
  lessonId: LessonId;
  onExit: () => void;
}

/**
 * Orquesta el flujo completo de una lección: intro → vocabulario → ejemplos →
 * ejercicios → resultados. Otorga +20 XP por lección (con guarda contra doble
 * entrega), +50 XP cuando se completa toda la unidad, marca el vocabulario
 * como aprendido y muestra un toast al ganar XP.
 */
export function LessonPlayer({ unitId, lessonId, onExit }: LessonPlayerProps) {
  const { data: lesson } = useLesson(unitId, lessonId);
  const { data: units } = useUnits();
  const { data: words } = useWords();

  const completeLesson = useProgressStore((s) => s.completeLesson);
  const learnWord = useProgressStore((s) => s.learnWord);
  const addXp = useProgressStore((s) => s.addXp);

  const [phase, setPhase] = useState<Phase>("intro");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [toast, setToast] = useState<{
    amount: number;
    message?: string;
  } | null>(null);

  const unit = useMemo(
    () => units?.find((u) => u.id === unitId) ?? null,
    [units, unitId],
  );

  const vocabWords = useMemo(
    () =>
      (lesson?.vocabulary ?? [])
        .map((id) => words?.find((w) => w.id === id))
        .filter((w): w is NonNullable<typeof w> => Boolean(w)),
    [lesson, words],
  );

  if (!lesson) {
    return (
      <div
        className="flex flex-col items-center gap-4 py-16 text-center"
        data-ocid="learn.lesson.loading"
      >
        <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-muted-foreground">Cargando lección…</p>
      </div>
    );
  }

  const total = lesson.exercises.length;
  const mastery = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const showToast = (amount: number, message?: string) => {
    setToast({ amount, message });
    window.setTimeout(() => setToast(null), 2600);
  };

  const finishLesson = () => {
    const lessonKey = String(lesson.id);
    const before = useProgressStore.getState().completedLessons;
    const wasAlreadyComplete = before.includes(lessonKey);

    if (!wasAlreadyComplete) {
      completeLesson(lessonKey, 20);
      showToast(20, "Lección completada");
    }

    for (const w of vocabWords) {
      learnWord(String(w.id), mastery);
    }

    const unitLessons = unit?.lessons ?? [];
    const allBefore =
      unitLessons.length > 0 &&
      unitLessons.every((l) => before.includes(String(l.id)));
    const newlyCompletesUnit =
      !wasAlreadyComplete &&
      !allBefore &&
      unitLessons.every(
        (l) => before.includes(String(l.id)) || String(l.id) === lessonKey,
      );
    if (newlyCompletesUnit) {
      addXp(50);
      showToast(50, "Unidad completada");
    }

    setPhase("results");
  };

  const handleCorrect = () => {
    setCorrectCount((c) => c + 1);
    addXp(5);
    showToast(5, "+5 XP");
  };

  const handleContinue = () => {
    if (exerciseIndex + 1 < total) {
      setExerciseIndex((i) => i + 1);
    } else {
      finishLesson();
    }
  };

  const phaseNav = (next: Phase) => (
    <PrimaryButton
      onClick={() => setPhase(next)}
      className="w-full"
      data-ocid={`learn.phase.${next}`}
    >
      Continuar
    </PrimaryButton>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-5"
      data-ocid="learn.lesson"
    >
      <XpToast
        amount={toast?.amount ?? 0}
        show={Boolean(toast)}
        message={toast?.message}
        data-ocid="learn.xp_toast"
      />

      {phase === "intro" && (
        <div className="flex flex-col gap-5" data-ocid="learn.phase.intro">
          <button
            type="button"
            onClick={onExit}
            className="flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-ocid="learn.lesson.exit"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Salir
          </button>

          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <BookOpen className="size-7 text-primary" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {lesson.title}
            </h2>
            <p className="max-w-sm text-base text-muted-foreground">
              {lesson.objective}
            </p>
            <p className="text-sm font-semibold text-accent">+20 XP</p>
          </div>

          <div
            className="flex items-start gap-2 rounded-2xl border border-warning/40 bg-warning/10 p-3 text-sm text-foreground"
            data-ocid="learn.lesson.review_note"
          >
            <Info
              className="mt-0.5 size-4 shrink-0 text-warning"
              aria-hidden="true"
            />
            <p>
              Contenido inicial sujeto a revisión por hablantes o especialistas
              en Aymara.
            </p>
          </div>

          {phaseNav("vocab")}
        </div>
      )}

      {phase === "vocab" && (
        <div className="flex flex-col gap-4" data-ocid="learn.phase.vocab">
          <div className="flex items-center gap-2">
            <ListChecks className="size-5 text-accent" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-foreground">
              Vocabulario
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {vocabWords.map((w) => (
              <div
                key={String(w.id)}
                className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-3"
                data-ocid={`learn.vocab.${String(w.id)}`}
              >
                <AudioPill text={w.aymara} audio={w.audio} />
                <p className="px-1 text-sm text-muted-foreground">
                  {w.spanish}
                </p>
              </div>
            ))}
          </div>
          {phaseNav("examples")}
        </div>
      )}

      {phase === "examples" && (
        <div className="flex flex-col gap-4" data-ocid="learn.phase.examples">
          <h2 className="font-display text-xl font-bold text-foreground">
            Ejemplos
          </h2>
          <div className="flex flex-col gap-3">
            {lesson.examples.map((ex, i) => (
              <AudioPill key={ex} text={ex} data-ocid={`learn.example.${i}`} />
            ))}
          </div>
          {phaseNav("exercises")}
        </div>
      )}

      {phase === "exercises" && (
        <ExerciseCard
          key={exerciseIndex}
          exercise={lesson.exercises[exerciseIndex]}
          index={exerciseIndex}
          total={total}
          onCorrect={handleCorrect}
          onContinue={handleContinue}
        />
      )}

      {phase === "results" && (
        <LessonResults
          correctCount={correctCount}
          total={total}
          xp={20}
          onExit={onExit}
        />
      )}
    </motion.div>
  );
}
