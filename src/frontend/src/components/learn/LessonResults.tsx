import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import { CheckCircle2, Trophy } from "lucide-react";
import { motion } from "motion/react";

interface LessonResultsProps {
  correctCount: number;
  total: number;
  xp: number;
  onExit: () => void;
}

/**
 * Pantalla final de una lección: porcentaje de dominio, XP obtenido,
 * aciertos sobre total y botón para salir.
 */
export function LessonResults({
  correctCount,
  total,
  xp,
  onExit,
}: LessonResultsProps) {
  const mastery = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center gap-5 text-center"
      data-ocid="learn.results"
    >
      <div className="flex size-16 items-center justify-center rounded-3xl bg-accent/15">
        <Trophy className="size-8 text-accent" aria-hidden="true" />
      </div>

      <h2 className="font-display text-2xl font-bold text-foreground">
        ¡Lección completada!
      </h2>

      <div className="w-full rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Dominio</span>
          <span className="font-display font-bold text-foreground">
            {mastery}%
          </span>
        </div>
        <ProgressBar value={mastery} data-ocid="learn.results.mastery" />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted p-3">
            <p className="font-display text-2xl font-bold text-accent">
              +{xp} XP
            </p>
            <p className="text-xs text-muted-foreground">XP ganado</p>
          </div>
          <div className="rounded-xl bg-muted p-3">
            <p className="flex items-center justify-center gap-1 font-display text-2xl font-bold text-foreground">
              <CheckCircle2
                className="size-5 text-success"
                aria-hidden="true"
              />
              {correctCount}/{total}
            </p>
            <p className="text-xs text-muted-foreground">Aciertos</p>
          </div>
        </div>
      </div>

      <PrimaryButton
        onClick={onExit}
        className="w-full"
        data-ocid="learn.results.exit"
      >
        Continuar
      </PrimaryButton>
    </motion.div>
  );
}
