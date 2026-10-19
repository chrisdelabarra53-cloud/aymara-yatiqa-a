import { MatchWordsGame } from "@/components/play/MatchWordsGame";
import { MemoryGame } from "@/components/play/MemoryGame";
import { useWords } from "@/hooks/useQueries";
import { ArrowLeft, Brain, Link2, Loader2, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type GameId = "memory" | "match";

interface GameOption {
  id: GameId;
  title: string;
  description: string;
  icon: typeof Brain;
  accent: string;
}

const GAMES: GameOption[] = [
  {
    id: "memory",
    title: "Memoria Aymara",
    description: "Empareja cada palabra Aymara con su imagen.",
    icon: Brain,
    accent: "bg-accent/15 text-accent",
  },
  {
    id: "match",
    title: "Empareja palabras",
    description: "Asocia la palabra Aymara con su traducción al español.",
    icon: Link2,
    accent: "bg-warning/15 text-warning",
  },
];

/**
 * Sección Jugar: elige entre los dos juegos disponibles. Cada juego otorga
 * XP y contribuye al progreso general del usuario en modo invitado.
 */
export function PlayPage() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const { data: words, isLoading, isError, refetch } = useWords();

  const active = GAMES.find((g) => g.id === activeGame);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-5"
      data-ocid="play.page"
    >
      {active ? (
        <>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveGame(null)}
              aria-label="Volver a la selección de juegos"
              className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-ocid="play.back_button"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                {active.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {active.description}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div
              className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-10 text-center"
              data-ocid="play.loading_state"
            >
              <Loader2
                className="size-8 animate-spin text-accent"
                aria-hidden="true"
              />
              <p className="text-base text-muted-foreground">
                Cargando palabras…
              </p>
            </div>
          ) : isError || !words ? (
            <div
              className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-8 text-center"
              data-ocid="play.error_state"
            >
              <p className="text-base text-muted-foreground">
                No pudimos cargar las palabras del juego.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 font-display text-sm font-bold text-primary-foreground shadow-subtle transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                data-ocid="play.retry_button"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Reintentar
              </button>
            </div>
          ) : active.id === "memory" ? (
            <MemoryGame words={words} />
          ) : (
            <MatchWordsGame words={words} />
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-2 pt-2 text-center">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-warning/15">
              <Brain className="size-8 text-warning" aria-hidden="true" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Jugar
            </h1>
            <p className="max-w-xs text-base text-muted-foreground">
              Elige un juego para practicar Aymara y ganar XP.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {GAMES.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => setActiveGame(game.id)}
                  className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 text-left shadow-subtle transition-all hover:-translate-y-0.5 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  data-ocid={`play.game.${game.id}`}
                >
                  <span
                    className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${game.accent}`}
                  >
                    <Icon className="size-7" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-bold text-foreground">
                      {game.title}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {game.description}
                    </span>
                  </span>
                  <ArrowLeft
                    className="size-5 rotate-180 text-muted-foreground"
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </>
      )}
    </motion.section>
  );
}
