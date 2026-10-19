import type { Lesson, LessonId, Unit, UnitId } from "@/backend";
import { ProgressBar } from "@/components/ProgressBar";
import { LessonPlayer } from "@/components/learn/LessonPlayer";
import { useUnits } from "@/hooks/useQueries";
import { useProgressStore } from "@/lib/progress-store";
import { BookOpen, Check, Lock, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

interface ActiveLesson {
  unitId: UnitId;
  lessonId: LessonId;
}

/** Dominio medio de una lección a partir del dominio de sus palabras. */
function lessonMastery(
  lesson: Lesson,
  mastery: Record<string, number>,
): number {
  if (lesson.vocabulary.length === 0) return 0;
  const sum = lesson.vocabulary.reduce(
    (acc, id) => acc + (mastery[String(id)] ?? 0),
    0,
  );
  return Math.round(sum / lesson.vocabulary.length);
}

/**
 * Mapa vertical de aprendizaje. La Unidad 1 'Primeros pasos' está desbloqueada
 * y muestra sus lecciones con progreso; las unidades 2-15 aparecen bloqueadas.
 * Tocar una lección desbloqueada abre el reproductor de lección.
 */
export function LearnPage() {
  const { data: units, isLoading } = useUnits();
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const mastery = useProgressStore((s) => s.mastery);
  const [active, setActive] = useState<ActiveLesson | null>(null);

  const unitProgress = useMemo(() => {
    const map: Record<string, number> = {};
    for (const unit of units ?? []) {
      if (unit.locked || unit.lessons.length === 0) continue;
      const done = unit.lessons.filter((l) =>
        completedLessons.includes(String(l.id)),
      ).length;
      map[String(unit.id)] = Math.round((done / unit.lessons.length) * 100);
    }
    return map;
  }, [units, completedLessons]);

  if (active) {
    return (
      <LessonPlayer
        unitId={active.unitId}
        lessonId={active.lessonId}
        onExit={() => setActive(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center gap-4 py-16 text-center"
        data-ocid="learn.loading"
      >
        <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-muted-foreground">Cargando mapa de aprendizaje…</p>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-5"
      data-ocid="learn.page"
    >
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Aprender
        </h1>
        <p className="text-base text-muted-foreground">
          Avanza por las unidades para dominar el Aymara.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {units?.map((unit, ui) => (
          <UnitCard
            key={String(unit.id)}
            unit={unit}
            index={ui}
            progress={unitProgress[String(unit.id)] ?? 0}
            completedLessons={completedLessons}
            mastery={mastery}
            onOpenLesson={(lessonId) =>
              setActive({ unitId: unit.id, lessonId })
            }
          />
        ))}
      </div>
    </motion.section>
  );
}

interface UnitCardProps {
  unit: Unit;
  index: number;
  progress: number;
  completedLessons: string[];
  mastery: Record<string, number>;
  onOpenLesson: (lessonId: LessonId) => void;
}

function UnitCard({
  unit,
  index,
  progress,
  completedLessons,
  mastery,
  onOpenLesson,
}: UnitCardProps) {
  const ocid = `learn.unit.${index + 1}`;

  if (unit.locked) {
    return (
      <div
        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 opacity-80"
        data-ocid={ocid}
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Lock className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold text-foreground">
            {unit.title}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {unit.description}
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Bloqueada
        </span>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-subtle"
      data-ocid={ocid}
    >
      <div className="pattern-weave-soft flex items-center gap-3 border-b border-border p-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Sparkles className="size-5 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold text-foreground">
            {unit.title}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {unit.description}
          </p>
        </div>
        <span className="shrink-0 font-display text-sm font-bold text-accent">
          {progress}%
        </span>
      </div>

      <div className="flex flex-col gap-2 p-3">
        {unit.lessons.map((lesson, li) => {
          const done = completedLessons.includes(String(lesson.id));
          const dom = lessonMastery(lesson, mastery);
          return (
            <button
              key={String(lesson.id)}
              type="button"
              onClick={() => onOpenLesson(lesson.id)}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-ocid={`learn.lesson.${index + 1}.${li + 1}`}
            >
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                  done
                    ? "bg-accent text-accent-foreground"
                    : "border-2 border-primary/40 text-primary"
                }`}
              >
                {done ? (
                  <Check className="size-5" aria-hidden="true" />
                ) : (
                  <span className="font-display text-sm font-bold">
                    {li + 1}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-foreground">
                  {lesson.title}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <ProgressBar
                    value={dom}
                    className="h-1.5"
                    data-ocid={`learn.lesson.${index + 1}.${li + 1}.progress`}
                  />
                  <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                    {dom}%
                  </span>
                </div>
              </div>
              <BookOpen
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
