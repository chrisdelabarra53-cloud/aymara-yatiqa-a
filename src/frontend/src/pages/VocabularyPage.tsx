import { ProgressBar } from "@/components/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWords } from "@/hooks/useQueries";
import { useProgressStore } from "@/lib/progress-store";
import { masteryStatus } from "@/lib/types";
import type { Word } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BookMarked, Info, Languages, Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";

/** Etiqueta legible para el estado de dominio de una palabra. */
const MASTERY_LABEL: Record<string, string> = {
  nueva: "Nueva",
  aprendida: "Aprendida",
  dominada: "Dominada",
};

/** Colores de acento por estado de dominio. */
const MASTERY_STYLE: Record<string, string> = {
  nueva: "bg-warning/15 text-warning",
  aprendida: "bg-accent/15 text-accent",
  dominada: "bg-primary/15 text-primary",
};

/** Convierte el id numérico del backend a la clave usada en el progreso local. */
function wordKey(id: Word["id"]): string {
  return id.toString();
}

/** Tarjeta de una palabra aprendida. */
function WordCard({ word, mastery }: { word: Word; mastery: number }) {
  const status = masteryStatus(mastery);
  const hasAudio = word.audio.trim().length > 0;

  return (
    <Card
      className="overflow-hidden border-border bg-card shadow-subtle"
      data-ocid="vocabulary.word_card"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-xl font-bold tracking-tight text-foreground">
              {word.aymara}
            </p>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {word.spanish}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "shrink-0 rounded-full border-transparent px-2.5 py-1 text-xs font-bold",
              MASTERY_STYLE[status],
            )}
            data-ocid="vocabulary.mastery_badge"
          >
            {MASTERY_LABEL[status]}
          </Badge>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full border-border bg-muted/40 px-2.5 py-0.5 text-xs font-semibold capitalize text-muted-foreground"
            data-ocid="vocabulary.category_badge"
          >
            {word.category}
          </Badge>
          {hasAudio ? (
            <span
              className="inline-flex items-center gap-1 text-xs font-medium text-accent"
              data-ocid="vocabulary.audio_available"
            >
              <Volume2 className="size-3.5" aria-hidden="true" />
              Audio disponible
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 text-xs font-medium text-warning"
              data-ocid="vocabulary.audio_pending"
            >
              <VolumeX className="size-3.5" aria-hidden="true" />
              Audio pendiente
            </span>
          )}
        </div>

        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground">Dominio</span>
            <span className="font-bold text-foreground">{mastery}%</span>
          </div>
          <ProgressBar value={mastery} data-ocid="vocabulary.mastery_bar" />
        </div>
      </CardContent>
    </Card>
  );
}

/** Esqueleto de carga para la lista de palabras. */
function WordListSkeleton() {
  return (
    <div className="space-y-3" data-ocid="vocabulary.loading_state">
      {[0, 1, 2, 3].map((n) => (
        <Card key={n} className="border-border bg-card shadow-subtle">
          <CardContent className="space-y-3 p-4">
            <Skeleton className="h-6 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-2.5 w-full rounded-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Sección de vocabulario. Lista las palabras aprendidas con su traducción,
 * categoría y estado de dominio, cruzando el catálogo del backend con el
 * progreso local del modo invitado.
 */
export function VocabularyPage() {
  const { data: words, isLoading, isError } = useWords();
  const learnedWords = useProgressStore((s) => s.learnedWords);
  const mastery = useProgressStore((s) => s.mastery);

  const learnedSet = new Set(learnedWords);
  const learned = (words ?? []).filter((w) => learnedSet.has(wordKey(w.id)));

  const averageMastery =
    learned.length > 0
      ? Math.round(
          learned.reduce((sum, w) => sum + (mastery[wordKey(w.id)] ?? 0), 0) /
            learned.length,
        )
      : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-4"
      data-ocid="vocabulary.page"
    >
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/15">
            <BookMarked className="size-6 text-accent" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Vocabulario
            </h1>
            <p className="text-sm text-muted-foreground">
              Tus palabras aprendidas
            </p>
          </div>
        </div>
      </header>

      <div
        className="flex items-start gap-2 rounded-2xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning-foreground"
        data-ocid="vocabulary.review_notice"
      >
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          El contenido lingüístico es inicial y está sujeto a revisión por
          hablantes o especialistas en Aymara.
        </p>
      </div>

      {isLoading ? (
        <WordListSkeleton />
      ) : isError ? (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center"
          data-ocid="vocabulary.error_state"
        >
          <p className="text-sm text-muted-foreground">
            No se pudo cargar el vocabulario. Inténtalo de nuevo más tarde.
          </p>
        </div>
      ) : learned.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center"
          data-ocid="vocabulary.empty_state"
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
            <Languages
              className="size-7 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Aún no has aprendido palabras
          </h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            Completa lecciones en la sección Aprender y tus palabras aparecerán
            aquí con su traducción y dominio.
          </p>
        </div>
      ) : (
        <>
          <Card className="border-border bg-card shadow-subtle">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-display text-lg font-bold text-foreground">
                  {learned.length}{" "}
                  {learned.length === 1 ? "palabra" : "palabras"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Dominio medio del vocabulario
                </p>
              </div>
              <div className="w-32">
                <div className="mb-1 text-right text-sm font-bold text-accent">
                  {averageMastery}%
                </div>
                <ProgressBar
                  value={averageMastery}
                  data-ocid="vocabulary.summary_bar"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3" data-ocid="vocabulary.list">
            {learned.map((word) => (
              <WordCard
                key={wordKey(word.id)}
                word={word}
                mastery={mastery[wordKey(word.id)] ?? 0}
              />
            ))}
          </div>
        </>
      )}
    </motion.section>
  );
}
