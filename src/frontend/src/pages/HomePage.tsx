import { LevelBadge } from "@/components/LevelBadge";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import { useUnits } from "@/hooks/useQueries";
import { useProgressStore } from "@/lib/progress-store";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  Flame,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

/**
 * Pantalla de inicio. Muestra el saludo personalizado, el progreso del día,
 * la racha, el XP de hoy, el objetivo diario, el botón para continuar
 * aprendiendo, la siguiente lección, las palabras aprendidas y el progreso
 * general. Todo el progreso proviene del modo invitado local y el contenido
 * del catálogo del backend.
 */
export function HomePage() {
  const navigate = useNavigate();
  const {
    name,
    xp,
    streak,
    dailyGoal,
    xpToday,
    level,
    completedLessons,
    learnedWords,
  } = useProgressStore();

  const { data: units, isLoading } = useUnits();

  const nextUnit = units?.find((u) => !u.locked && u.lessons.length > 0);
  const nextLesson = nextUnit?.lessons[0];

  const totalLessons =
    units?.reduce((acc, u) => acc + u.lessons.length, 0) ?? 0;
  const overallProgress =
    totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;
  const dailyProgress = dailyGoal > 0 ? (xpToday / dailyGoal) * 100 : 0;

  const greeting = name.trim() ? `¡Hola, ${name.trim()}!` : "¡Hola!";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-5"
      data-ocid="home.page"
    >
      {/* Saludo y nivel */}
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {greeting}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ¿Listo para seguir aprendiendo Aymara hoy?
          </p>
        </div>
        <LevelBadge level={level} data-ocid="home.level_badge" />
      </header>

      {/* Tarjeta principal: continuar aprendiendo */}
      <section
        className="pattern-weave relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-subtle"
        data-ocid="home.continue_card"
      >
        <div className="flex items-center gap-2 text-accent">
          <Sparkles className="size-4" aria-hidden="true" />
          <span className="font-display text-xs font-bold uppercase tracking-wide">
            Siguiente lección
          </span>
        </div>

        {isLoading ? (
          <div className="mt-3 space-y-2" data-ocid="home.loading_state">
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        ) : nextUnit && nextLesson ? (
          <div className="mt-3">
            <h2 className="font-display text-xl font-bold text-foreground">
              {nextLesson.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {nextUnit.title} · {nextLesson.objective}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            El mapa de aprendizaje se está preparando.
          </p>
        )}

        <PrimaryButton
          className="mt-5 w-full"
          onClick={() => navigate({ to: "/learn" })}
          data-ocid="home.continue_button"
        >
          Continuar aprendiendo
          <ChevronRight className="size-5" aria-hidden="true" />
        </PrimaryButton>
      </section>

      {/* Métricas rápidas */}
      <section className="grid grid-cols-3 gap-3" data-ocid="home.stats">
        <StatCard
          icon={<Flame className="size-5 text-warning" aria-hidden="true" />}
          label="Racha"
          value={`${streak} ${streak === 1 ? "día" : "días"}`}
          dataOcid="home.streak"
        />
        <StatCard
          icon={<Zap className="size-5 text-primary" aria-hidden="true" />}
          label="XP hoy"
          value={`${xpToday} XP`}
          dataOcid="home.xp_today"
        />
        <StatCard
          icon={<Trophy className="size-5 text-accent" aria-hidden="true" />}
          label="Palabras"
          value={`${learnedWords.length}`}
          dataOcid="home.words_learned"
        />
      </section>

      {/* Objetivo diario */}
      <section
        className="rounded-3xl border border-border bg-card p-5 shadow-subtle"
        data-ocid="home.daily_goal"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="size-5 text-primary" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-foreground">
              Objetivo diario
            </h3>
          </div>
          <span className="font-display text-sm font-bold text-accent">
            {xpToday} / {dailyGoal} XP
          </span>
        </div>
        <ProgressBar
          value={dailyProgress}
          className="mt-3"
          data-ocid="home.daily_goal_bar"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {dailyProgress >= 100
            ? "¡Objetivo cumplido! Gran trabajo hoy."
            : `Te faltan ${Math.max(0, dailyGoal - xpToday)} XP para cumplir tu objetivo.`}
        </p>
      </section>

      {/* Progreso general */}
      <section
        className="rounded-3xl border border-border bg-card p-5 shadow-subtle"
        data-ocid="home.overall_progress"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-accent" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-foreground">
              Tu progreso
            </h3>
          </div>
          <span className="font-display text-sm font-bold text-accent">
            {Math.round(overallProgress)}%
          </span>
        </div>
        <ProgressBar
          value={overallProgress}
          className="mt-3"
          data-ocid="home.overall_progress_bar"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {completedLessons.length} de {totalLessons} lecciones completadas ·{" "}
          {xp} XP en total
        </p>
      </section>
    </motion.div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  dataOcid: string;
}

function StatCard({ icon, label, value, dataOcid }: StatCardProps) {
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card px-2 py-4 text-center shadow-subtle"
      data-ocid={dataOcid}
    >
      {icon}
      <span className="font-display text-lg font-bold text-foreground">
        {value}
      </span>
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
