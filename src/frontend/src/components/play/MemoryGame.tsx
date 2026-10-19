import { PrimaryButton } from "@/components/PrimaryButton";
import { XpToast } from "@/components/XpToast";
import { useProgressStore } from "@/lib/progress-store";
import type { Word } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Bird,
  Cloud,
  CloudSun,
  Flower2,
  Heart,
  Home,
  Mountain,
  RefreshCw,
  Sparkles,
  Sun,
  Utensils,
  Waves,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

const PAIR_COUNT = 6;
const GAME_XP = 10;

interface MemoryCard {
  key: string;
  wordId: string;
  kind: "word" | "image";
  aymara: string;
  spanish: string;
  category: string;
  image?: string;
}

/** Icono por categoría para representar visualmente la palabra. */
function CategoryIcon({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const cat = category.toLowerCase();
  const Icon =
    cat.includes("animal") || cat.includes("ave")
      ? Bird
      : cat.includes("naturaleza") ||
          cat.includes("planta") ||
          cat.includes("flor")
        ? Flower2
        : cat.includes("agua") || cat.includes("rio") || cat.includes("lago")
          ? Waves
          : cat.includes("monta") || cat.includes("cerro")
            ? Mountain
            : cat.includes("sol") || cat.includes("dia")
              ? Sun
              : cat.includes("nube") ||
                  cat.includes("clima") ||
                  cat.includes("tiempo")
                ? CloudSun
                : cat.includes("familia") || cat.includes("persona")
                  ? Heart
                  : cat.includes("casa") || cat.includes("hogar")
                    ? Home
                    : cat.includes("comida") || cat.includes("alimento")
                      ? Utensils
                      : cat.includes("cielo") || cat.includes("lluvia")
                        ? Cloud
                        : Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}

function buildCards(words: Word[]): MemoryCard[] {
  const selected = [...words]
    .sort(() => Math.random() - 0.5)
    .slice(0, PAIR_COUNT);
  const cards: MemoryCard[] = [];
  for (const w of selected) {
    cards.push({
      key: `w-${w.id}`,
      wordId: String(w.id),
      kind: "word",
      aymara: w.aymara,
      spanish: w.spanish,
      category: w.category,
      image: w.image,
    });
    cards.push({
      key: `i-${w.id}`,
      wordId: String(w.id),
      kind: "image",
      aymara: w.aymara,
      spanish: w.spanish,
      category: w.category,
      image: w.image,
    });
  }
  return cards.sort(() => Math.random() - 0.5);
}

interface MemoryGameProps {
  words: Word[];
}

/**
 * Memoria Aymara: empareja cada palabra Aymara con su imagen (o icono de
 * categoría). Al completar el tablero otorga XP y registra las palabras
 * aprendidas en el progreso local.
 */
export function MemoryGame({ words }: MemoryGameProps) {
  const addXp = useProgressStore((s) => s.addXp);
  const learnWord = useProgressStore((s) => s.learnWord);

  const [cards, setCards] = useState<MemoryCard[]>(() => buildCards(words));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const xpAwarded = useRef(false);

  const totalPairs = cards.length / 2;
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

  function handleFlip(card: MemoryCard) {
    if (busy || complete) return;
    if (matched.has(card.wordId)) return;
    if (flipped.includes(card.key)) return;
    if (flipped.length === 2) return;

    const next = [...flipped, card.key];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next.map((k) => cards.find((c) => c.key === k)!);
      if (a.wordId === b.wordId) {
        setBusy(true);
        setTimeout(() => {
          setMatched((prev) => new Set(prev).add(a.wordId));
          setFlipped([]);
          setBusy(false);
          learnWord(a.wordId, 40);
        }, 450);
      } else {
        setBusy(true);
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 750);
      }
    }
  }

  function reset() {
    xpAwarded.current = false;
    setCards(buildCards(words));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setShowXp(false);
  }

  if (words.length < 2) {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-8 text-center"
        data-ocid="memory.empty_state"
      >
        <Sparkles className="size-8 text-warning" aria-hidden="true" />
        <p className="text-base text-muted-foreground">
          Necesitamos al menos dos palabras para jugar a la memoria.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold text-foreground">
          Pares: {matched.size}/{totalPairs}
        </p>
        <p className="text-sm text-muted-foreground">Intentos: {moves}</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {cards.map((card) => {
          const isFaceUp =
            flipped.includes(card.key) || matched.has(card.wordId);
          const isMatched = matched.has(card.wordId);
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => handleFlip(card)}
              aria-label={
                isFaceUp
                  ? card.kind === "word"
                    ? card.aymara
                    : card.spanish
                  : "Carta oculta"
              }
              className="aspect-square [perspective:1000px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              data-ocid={`memory.card.${card.kind}`}
            >
              <div
                className={cn(
                  "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
                  isFaceUp && "[transform:rotateY(180deg)]",
                )}
              >
                {/* Reverso */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center rounded-2xl border border-border bg-primary shadow-subtle",
                    "[backface-visibility:hidden]",
                  )}
                >
                  <span className="font-display text-2xl font-bold text-primary-foreground/80">
                    ?
                  </span>
                </div>
                {/* Cara */}
                <div
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border p-2 shadow-subtle [backface-visibility:hidden] [transform:rotateY(180deg)]",
                    isMatched
                      ? "border-accent bg-accent/15"
                      : "border-border bg-card",
                  )}
                >
                  {card.kind === "word" ? (
                    <span className="text-center font-display text-sm font-bold leading-tight text-foreground">
                      {card.aymara}
                    </span>
                  ) : card.image ? (
                    <img
                      src={card.image}
                      alt={card.aymara}
                      className="size-full rounded-xl object-cover"
                    />
                  ) : (
                    <>
                      <CategoryIcon
                        category={card.category}
                        className="size-7 text-accent"
                      />
                      <span className="text-center text-[11px] font-medium leading-tight text-muted-foreground">
                        {card.spanish}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {complete ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 rounded-3xl border border-accent/30 bg-accent/10 p-5 text-center"
          data-ocid="memory.success_state"
        >
          <p className="font-display text-lg font-bold text-foreground">
            ¡Tablero completado!
          </p>
          <p className="text-sm text-muted-foreground">
            Resolviste la memoria en {moves} intentos y ganaste {GAME_XP} XP.
          </p>
          <PrimaryButton onClick={reset} data-ocid="memory.restart_button">
            <RefreshCw className="size-5" aria-hidden="true" />
            Jugar de nuevo
          </PrimaryButton>
        </motion.div>
      ) : null}

      <XpToast amount={GAME_XP} show={showXp} message="Memoria completada" />
    </div>
  );
}
