import { PrimaryButton } from "@/components/PrimaryButton";
import type { Exercise } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  total: number;
  onCorrect: () => void;
  onContinue: () => void;
}

type Feedback = "idle" | "correct" | "wrong";

/**
 * Renderiza los 7 tipos de ejercicio con retroalimentación inmediata de
 * acierto/error y explicación. Otorga +5 XP por ejercicio correcto vía
 * onCorrect (el orquestador decide cuándo sumar).
 */
export function ExerciseCard({
  exercise,
  index,
  total,
  onCorrect,
  onContinue,
}: ExerciseCardProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [awarded, setAwarded] = useState(false);

  const isCorrect = (): boolean => {
    switch (exercise.exerciseType) {
      case "orderWords":
        return selected.join("") === exercise.correctAnswer;
      case "multipleChoice":
        return (
          [...selected].sort().join(",") ===
          exercise.correctAnswer
            .split(",")
            .map((s) => s.trim())
            .sort()
            .join(",")
        );
      default:
        return selected.length === 1 && selected[0] === exercise.correctAnswer;
    }
  };

  const handleSubmit = () => {
    if (selected.length === 0 || feedback !== "idle") return;
    const ok = isCorrect();
    setFeedback(ok ? "correct" : "wrong");
    if (ok && !awarded) {
      setAwarded(true);
      onCorrect();
    }
  };

  const handleContinue = () => {
    setSelected([]);
    setFeedback("idle");
    setAwarded(false);
    onContinue();
  };

  const toggleOption = (option: string) => {
    if (feedback !== "idle") return;
    if (
      exercise.exerciseType === "multipleChoice" ||
      exercise.exerciseType === "orderWords"
    ) {
      setSelected((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option],
      );
    } else {
      setSelected([option]);
    }
  };

  const renderOptions = () => {
    if (exercise.exerciseType === "orderWords") {
      const words = exercise.options;
      return (
        <div className="flex flex-wrap justify-center gap-2">
          {words.map((word, i) => {
            const isPicked = selected.includes(word);
            return (
              <button
                key={word}
                type="button"
                onClick={() => toggleOption(word)}
                disabled={feedback !== "idle"}
                className={cn(
                  "min-h-11 rounded-xl border px-4 py-2 font-body text-base font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isPicked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted",
                  feedback !== "idle" && "pointer-events-none opacity-70",
                )}
                data-ocid={`learn.exercise.option.${i}`}
              >
                {word}
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {exercise.options.map((option, i) => {
          const isSelected = selected.includes(option);
          const isAnswer = option === exercise.correctAnswer;
          const showCorrect = feedback === "correct" && isAnswer;
          const showWrong = feedback === "wrong" && isSelected && !isAnswer;
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              disabled={feedback !== "idle"}
              className={cn(
                "flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left font-body text-base font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                showCorrect
                  ? "border-success bg-success/15 text-foreground"
                  : showWrong
                    ? "border-destructive bg-destructive/15 text-foreground"
                    : isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-foreground hover:bg-muted",
                feedback !== "idle" && "pointer-events-none",
              )}
              data-ocid={`learn.exercise.option.${i}`}
            >
              <span>{option}</span>
              {showCorrect && (
                <Check
                  className="size-5 shrink-0 text-success"
                  aria-hidden="true"
                />
              )}
              {showWrong && (
                <X
                  className="size-5 shrink-0 text-destructive"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col gap-4"
      data-ocid="learn.exercise"
    >
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Ejercicio {index + 1} de {total}
        </span>
        <span className="font-semibold text-accent">+5 XP</span>
      </div>

      <p className="font-display text-xl font-bold leading-snug text-foreground">
        {exercise.prompt}
      </p>

      {renderOptions()}

      {feedback === "idle" ? (
        <PrimaryButton
          onClick={handleSubmit}
          disabled={selected.length === 0}
          data-ocid="learn.exercise.submit"
        >
          Comprobar
        </PrimaryButton>
      ) : (
        <div
          className={cn(
            "flex flex-col gap-3 rounded-2xl border p-4",
            feedback === "correct"
              ? "border-success bg-success/10"
              : "border-destructive bg-destructive/10",
          )}
          data-ocid={
            feedback === "correct"
              ? "learn.exercise.correct"
              : "learn.exercise.wrong"
          }
        >
          <p
            className={cn(
              "flex items-center gap-2 font-display text-base font-bold",
              feedback === "correct" ? "text-success" : "text-destructive",
            )}
          >
            {feedback === "correct" ? (
              <>
                <Check className="size-5" aria-hidden="true" /> ¡Correcto! +5 XP
              </>
            ) : (
              <>
                <X className="size-5" aria-hidden="true" /> Incorrecto
              </>
            )}
          </p>
          {exercise.explanation ? (
            <p className="text-sm text-muted-foreground">
              {exercise.explanation}
            </p>
          ) : null}
          <PrimaryButton
            onClick={handleContinue}
            data-ocid="learn.exercise.continue"
          >
            Continuar
          </PrimaryButton>
        </div>
      )}
    </motion.div>
  );
}
