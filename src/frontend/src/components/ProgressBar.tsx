import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** Valor de progreso entre 0 y 100. */
  value: number;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Barra de progreso con relleno en verde andino y transición suave.
 * Se usa para el objetivo diario, el dominio de palabras y el avance de lecciones.
 */
export function ProgressBar({ value, className, ...rest }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={-1}
      className={cn(
        "h-2.5 w-full overflow-hidden rounded-full bg-primary/15",
        className,
      )}
      {...rest}
    >
      <div
        className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
