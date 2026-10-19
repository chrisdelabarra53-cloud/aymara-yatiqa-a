import { LevelBadge } from "@/components/LevelBadge";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import { useProgressStore } from "@/lib/progress-store";
import { LEVELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Check,
  Flame,
  Pencil,
  Settings,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

/** Avatares originales inspirados en el contexto andino. */
const AVATARS = [
  {
    id: 0,
    src: "/assets/generated/avatar-1.dim_256x256.png",
    alt: "Avatar con chullo andino",
  },
  {
    id: 1,
    src: "/assets/generated/avatar-2.dim_256x256.png",
    alt: "Avatar con aguayo tejido",
  },
  {
    id: 2,
    src: "/assets/generated/avatar-3.dim_256x256.png",
    alt: "Avatar con poncho andino",
  },
  {
    id: 3,
    src: "/assets/generated/avatar-4.dim_256x256.png",
    alt: "Avatar con bufanda tejida",
  },
];

/** Progreso hacia el siguiente nivel, en porcentaje. */
function levelProgress(xp: number): {
  current: number;
  next: number;
  pct: number;
} {
  let current = LEVELS[0].minXp;
  let next = LEVELS[1].minXp;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) {
      current = LEVELS[i].minXp;
      next = LEVELS[i + 1]?.minXp ?? LEVELS[i].minXp;
    }
  }
  const span = next - current;
  const pct = span > 0 ? Math.min(100, ((xp - current) / span) * 100) : 100;
  return { current, next, pct };
}

export function ProfilePage() {
  const {
    name,
    avatar,
    xp,
    level,
    streak,
    dailyGoal,
    xpToday,
    completedLessons,
    learnedWords,
    setName,
    setAvatar,
  } = useProgressStore();

  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(name);

  const { next, pct } = levelProgress(xp);
  const dailyPct =
    dailyGoal > 0 ? Math.min(100, (xpToday / dailyGoal) * 100) : 0;
  const selectedAvatar = AVATARS[avatar] ?? AVATARS[0];

  const saveName = () => {
    setName(draftName.trim());
    setEditingName(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-6"
      data-ocid="profile.page"
    >
      {/* Cabecera del perfil */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div
            className="pattern-weave-soft absolute -inset-3 rounded-full"
            aria-hidden="true"
          />
          <img
            src={selectedAvatar.src}
            alt={selectedAvatar.alt}
            className="relative size-28 rounded-full border-4 border-card object-cover shadow-elevated"
            data-ocid="profile.avatar"
          />
          <span className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full bg-warning font-display text-sm font-bold text-warning-foreground shadow-subtle">
            {streak}
          </span>
        </div>

        {editingName ? (
          <div className="flex w-full max-w-xs items-center gap-2">
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              maxLength={24}
              aria-label="Nombre"
              className="min-h-11 flex-1 rounded-xl border border-input bg-card px-3 text-center font-display text-lg font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-ocid="profile.name_input"
            />
            <button
              type="button"
              onClick={saveName}
              aria-label="Guardar nombre"
              className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-ocid="profile.save_name_button"
            >
              <Check className="size-5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {name.trim() || "Estudiante"}
            </h1>
            <button
              type="button"
              onClick={() => {
                setDraftName(name);
                setEditingName(true);
              }}
              aria-label="Editar nombre"
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-ocid="profile.edit_name_button"
            >
              <Pencil className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}

        <LevelBadge level={level} data-ocid="profile.level_badge" />

        <Link
          to="/settings"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          data-ocid="profile.settings_link"
        >
          <Settings className="size-4" aria-hidden="true" />
          Configuración
        </Link>
      </div>

      {/* XP y nivel */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-warning" aria-hidden="true" />
            <span className="font-display text-2xl font-bold text-foreground">
              {xp}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              XP
            </span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {next > xp
              ? `${next - xp} XP para el siguiente nivel`
              : "Nivel máximo"}
          </span>
        </div>
        <ProgressBar
          value={pct}
          className="mt-3"
          data-ocid="profile.level_progress"
        />
      </div>

      {/* Estadísticas personales */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-border bg-card p-4 shadow-subtle">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="size-4 text-warning" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Racha
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {streak} días
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-4 shadow-subtle">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="size-4 text-accent" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Lecciones
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {completedLessons.length}
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-4 shadow-subtle">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Check className="size-4 text-accent" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Palabras
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {learnedWords.length}
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-4 shadow-subtle">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="size-4 text-warning" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Hoy
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {xpToday}
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              / {dailyGoal} XP
            </span>
          </p>
        </div>
      </div>

      {/* Objetivo diario */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-subtle">
        <div className="flex items-center justify-between">
          <span className="font-display text-base font-bold text-foreground">
            Objetivo diario
          </span>
          <span className="text-sm font-semibold text-muted-foreground">
            {xpToday} / {dailyGoal} XP
          </span>
        </div>
        <ProgressBar
          value={dailyPct}
          className="mt-3"
          data-ocid="profile.daily_progress"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {dailyPct >= 100
            ? "¡Objetivo cumplido hoy! Sigue así."
            : `Te faltan ${dailyGoal - xpToday} XP para cumplir tu objetivo.`}
        </p>
      </div>

      {/* Selección de avatar */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-subtle">
        <h2 className="font-display text-base font-bold text-foreground">
          Elige tu avatar
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Personajes originales inspirados en los Andes.
        </p>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {AVATARS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAvatar(a.id)}
              aria-label={`Seleccionar ${a.alt}`}
              aria-pressed={avatar === a.id}
              className={cn(
                "relative flex items-center justify-center rounded-2xl border-2 p-1.5 transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                avatar === a.id
                  ? "border-primary bg-primary/10"
                  : "border-transparent bg-muted hover:bg-muted/70",
              )}
              data-ocid={`profile.avatar_option.${a.id}`}
            >
              <img
                src={a.src}
                alt=""
                className="size-14 rounded-xl object-cover"
                aria-hidden="true"
              />
              {avatar === a.id && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" aria-hidden="true" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <PrimaryButton
        onClick={() => setEditingName(true)}
        className="w-full"
        data-ocid="profile.edit_profile_button"
      >
        Editar perfil
      </PrimaryButton>
    </motion.section>
  );
}
