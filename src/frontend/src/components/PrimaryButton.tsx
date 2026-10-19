import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  "data-ocid"?: string;
}

/**
 * Botón principal de la app: píldora grande, rojo profundo, con elevación
 * sutil al pasar el cursor y foco visible para accesibilidad.
 */
export function PrimaryButton({
  children,
  onClick,
  className,
  type = "button",
  disabled,
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl",
        "bg-primary px-6 py-3 font-display text-base font-bold text-primary-foreground",
        "shadow-subtle transition-all duration-200",
        "hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-elevated",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "active:translate-y-0 active:bg-primary/95",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
