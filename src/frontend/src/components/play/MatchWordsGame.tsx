import { PrimaryButton } from "@/components/PrimaryButton";
import { XpToast } from "@/components/XpToast";
import { useProgressStore } from "@/lib/progress-store";
import type { Word } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, Link2, RefreshCw, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

const PAIR_COUNT = 6;
const GAME_XP = 10;

interface Round {
  selected: Word[];
  aymara: Word[];
  spanish: Word[];
}

function buildRound(words: Word[]): Round {
  const selected = [...words]
    .sort(() => Math.random() - 0.5)
    .slice(0, PAIR_COUNT);
  const aymara = [...selected].sort(() => Math.random() - 0.5);
  const spanish = [...selected].sort(() => Math.random() - 0.5);
  return { selected, aymara, spanish };
}

interface MatchWordsGameProps {
  words: Word[];
}

/**
 * Empareja palabras: asocia cada palabra Aymara con su traducción al español.
 * Al completar la ronda otorga XP y registra las palabras aprendidas.
 */
export function MatchWordsGame({ words }: MatchWordsGameProps) {
  const addXp = useProgressStore((s) => s.addXp);
  const learnWord = useProgressStore((s) => s.learnWord);

  const [round, setRound] = useState<Round>(() => buildRound(words));
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [showXp, setShowXp] = useState(false);
  const xpAwarded = useRef(false);

  const totalPairs = round.selected.length;
  const complete = matched.size === totalPairs && totalPairs > 0;

  useEffect(() => {
    if (complete && !xpAwarded.current) {
      xpAwarded.current = true;
      addXp(GAME_XP);
      setShowXp(true);
      const t = setTimeout(() => setShowXp(false), 2200);
      return () => clearTimeout(t);
    }
  }, [complete, addXp]);

  function handleLeft(wordId: string) {
    if (matched.has(wordId) || complete) return;
    setSelectedLeft(wordId);
    setWrong(null);
  }

  function handleRight(wordId: string) {
    if (matched.has(wordId) || complete) return;
    if (selectedLeft === null) return;
    if (selectedLeft === wordId) {
      setMatched((prev) => new Set(prev).add(wordId));
      setSelectedLeft(null);
      learnWord(wordId, 40);
    } else {
      setWrong(wordId);
      setSelectedLeft(null);
      setTimeout(() => setWrong(null), 650);
    }
  }

  function reset() {
    xpAwarded.current = false;
    setRound(buildRound(words));
    setSelectedLeft(null);
    setMatched(new Set());
    setWrong(null);
    setShowXp(false);
  }

  if (words.length < 2) {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-8 text-center"
        data-ocid="match.empty_state"
      >
        <Link2 className="size-8 text-warning" aria-hidden="true" />
        <p className="text-base text-muted-foreground">
          Necesitamos al menos dos palabras para emparejar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold text-foreground">
          Emparejadas: {matched.size}/{totalPairs}
        </p>
        <p className="text-sm text-muted-foreground">
          Toca una palabra Aymara y luego su traducción
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Columna Aymara */}
        <div className="flex flex-col gap-2.5">
          {round.aymara.map((w) => {
            const id = String(w.id);
            const isMatched = matched.has(id);
            const isSelected = selectedLeft === id;
            return (
              <button
                key={`a-${id}`}
                type="button"
                onClick={() => handleLeft(id)}
                disabled={isMatched}
                className={cn(
                  "flex min-h-14 items-center justify-center rounded-2xl border px-3 py-2 text-center font-display text-sm font-bold transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isMatched
                    ? "border-accent bg-accent/15 text-accent"
                    : isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-subtle"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted",
                )}
                data-ocid="match.aymara_item"
              >
                {w.aymara}
              </button>
            );
          })}
        </div>

        {/* Columna Español */}
        <div className="flex flex-col gap-2.5">
          {round.spanish.map((w) => {
            const id = String(w.id);
            const isMatched = matched.has(id);
            const isWrong = wrong === id;
            return (
              <button
                key={`s-${id}`}
                type="button"
                onClick={() => handleRight(id)}
                disabled={isMatched}
                className={cn(
                  "flex min-h-14 items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-center text-sm font-semibold transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isMatched
                    ? "border-accent bg-accent/15 text-accent"
                    : isWrong
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted",
                )}
                data-ocid="match.spanish_item"
              >
                {isMatched ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : isWrong ? (
                  <X className="size-4" aria-hidden="true" />
                ) : null}
                {w.spanish}
              </button>
            );
          })}
        </div>
      </div>

      {complete ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 rounded-3xl border border-accent/30 bg-accent/10 p-5 text-center"
          data-ocid="match.success_state"
        >
          <p className="font-display text-lg font-bold text-foreground">
            ¡Ronda completada!
          </p>
          <p className="text-sm text-muted-foreground">
            Emparejaste {totalPairs} palabras y ganaste {GAME_XP} XP.
          </p>
          <PrimaryButton onClick={reset} data-ocid="match.restart_button">
            <RefreshCw className="size-5" aria-hidden="true" />
            Jugar de nuevo
          </PrimaryButton>
        </motion.div>
      ) : null}

      <XpToast amount={GAME_XP} show={showXp} message="Empareja palabras" />
    </div>
  );
}
