import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface XpToastProps {
  /** Cantidad de XP ganada. */
  amount: number;
  /** Controla si el toast está visible. */
  show: boolean;
  /** Mensaje opcional que acompaña al XP. */
  message?: string;
  "data-ocid"?: string;
}

/**
 * Toast animado que aparece al ganar XP. Sube y se desvanece con una
 * pequeña animación de entrada, respetando prefers-reduced-motion.
 */
export function XpToast({ amount, show, message, ...rest }: XpToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4"
          {...rest}
        >
          <div className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-base font-bold text-primary-foreground shadow-elevated">
            <Sparkles className="size-5 text-warning" aria-hidden="true" />
            <span>+{amount} XP</span>
            {message ? (
              <span className="font-body text-sm font-medium text-primary-foreground/90">
                {message}
              </span>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
