import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";

interface AudioPillProps {
  /** Texto principal (palabra o frase en Aymara). */
  text: string;
  /** Campo de audio asociado; vacío significa "audio pendiente". */
  audio?: string;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Muestra una palabra o frase Aymara. Cuando no existe audio asociado se
 * muestra una insignia clara de "audio pendiente" en lugar de fingir que hay
 * reproducción. No reproduce audio todavía.
 */
export function AudioPill({ text, audio, className, ...rest }: AudioPillProps) {
  const hasAudio = Boolean(audio && audio.trim().length > 0);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3",
        className,
      )}
      {...rest}
    >
      <span className="font-display text-lg font-bold text-foreground">
        {text}
      </span>
      {hasAudio ? (
        <span
          className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent"
          data-ocid="learn.audio.available"
        >
          <Volume2 className="size-3.5" aria-hidden="true" />
          Audio
        </span>
      ) : (
        <span
          className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-1 text-xs font-semibold text-warning"
          data-ocid="learn.audio.pending"
        >
          <Volume2 className="size-3.5" aria-hidden="true" />
          Audio pendiente
        </span>
      )}
    </div>
  );
}
