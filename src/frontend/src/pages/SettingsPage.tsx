import { PrimaryButton } from "@/components/PrimaryButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useProgressStore } from "@/lib/progress-store";
import { cn } from "@/lib/utils";
import { RotateCcw, Settings, Volume2 } from "lucide-react";
import { motion } from "motion/react";

/** Opciones de objetivo diario de XP. */
const GOAL_OPTIONS = [10, 20, 30, 50];

export function SettingsPage() {
  const {
    dailyGoal,
    soundEnabled,
    setDailyGoal,
    setSoundEnabled,
    resetProgress,
  } = useProgressStore();

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-6"
      data-ocid="settings.page"
    >
      {/* Cabecera */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-16 items-center justify-center rounded-3xl bg-muted">
          <Settings
            className="size-8 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Configuración
        </h1>
        <p className="max-w-xs text-base text-muted-foreground">
          Ajusta tu objetivo diario, el sonido y tu progreso local.
        </p>
      </div>

      {/* Objetivo diario */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-subtle">
        <h2 className="font-display text-base font-bold text-foreground">
          Objetivo diario
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          La cantidad de XP que quieres ganar cada día.
        </p>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {GOAL_OPTIONS.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => setDailyGoal(goal)}
              aria-pressed={dailyGoal === goal}
              className={cn(
                "min-h-12 rounded-2xl border-2 font-display text-base font-bold transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                dailyGoal === goal
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground hover:bg-muted/70",
              )}
              data-ocid={`settings.goal_option.${goal}`}
            >
              {goal}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm font-semibold text-muted-foreground">
          Objetivo actual: {dailyGoal} XP al día
        </p>
      </div>

      {/* Sonido */}
      <div className="flex items-center justify-between rounded-3xl border border-border bg-card p-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-muted">
            <Volume2 className="size-5 text-accent" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display text-base font-bold text-foreground">
              Sonido
            </p>
            <p className="text-sm text-muted-foreground">
              {soundEnabled ? "Activado" : "Desactivado"}
            </p>
          </div>
        </div>
        <Switch
          checked={soundEnabled}
          onCheckedChange={setSoundEnabled}
          aria-label="Activar o desactivar el sonido"
          data-ocid="settings.sound_toggle"
        />
      </div>

      {/* Reiniciar progreso */}
      <div className="rounded-3xl border border-destructive/30 bg-card p-5 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-destructive/10">
            <RotateCcw className="size-5 text-destructive" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display text-base font-bold text-foreground">
              Reiniciar progreso
            </p>
            <p className="text-sm text-muted-foreground">
              Borra todo tu progreso local en este dispositivo.
            </p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <PrimaryButton
              className="mt-4 w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="settings.reset_button"
            >
              Reiniciar progreso
            </PrimaryButton>
          </AlertDialogTrigger>
          <AlertDialogContent data-ocid="settings.reset_dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Reiniciar tu progreso?</AlertDialogTitle>
              <AlertDialogDescription>
                Se borrarán tu XP, racha, lecciones completadas y palabras
                aprendidas en este dispositivo. Esta acción no se puede
                deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="settings.reset_cancel_button">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={resetProgress}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-ocid="settings.reset_confirm_button"
              >
                Sí, reiniciar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.section>
  );
}
