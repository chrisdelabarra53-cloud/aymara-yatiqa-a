import { Badge } from "@/components/ui/badge";
import type { Level } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: Level;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Insignia que muestra el nivel de usuario. Usa el verde andino para el
 * nivel actual y un tono dorado para los niveles superiores.
 */
export function LevelBadge({ level, className, ...rest }: LevelBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-full border-transparent bg-accent/15 px-3 py-1 font-display text-xs font-bold text-accent",
        className,
      )}
      {...rest}
    >
      {level}
    </Badge>
  );
}
