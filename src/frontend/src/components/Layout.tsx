import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  BookMarked,
  BookOpen,
  Gamepad2,
  Home,
  Settings,
  User,
} from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/learn", label: "Aprender", icon: BookOpen },
  { to: "/play", label: "Jugar", icon: Gamepad2 },
  { to: "/vocabulary", label: "Vocabulario", icon: BookMarked },
  { to: "/profile", label: "Perfil", icon: User },
];

/**
 * Diseño móvil de la app: cabecera con identidad Aymara, contenido con
 * fondo cálido y una barra de navegación inferior fija con las cinco
 * secciones principales. El ajuste (Settings) se accede desde el perfil.
 */
export function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-subtle">
        <div className="pattern-weave h-1.5 w-full" aria-hidden="true" />
        <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
            data-ocid="layout.brand"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
              A
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Aymara Yatiqaña
            </span>
          </Link>
          <Link
            to="/settings"
            aria-label="Configuración"
            className={cn(
              "flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              pathname === "/settings" && "bg-muted text-foreground",
            )}
            data-ocid="layout.settings"
          >
            <Settings className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-28 pt-6">
        <Outlet />
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card shadow-elevated"
        aria-label="Navegación principal"
      >
        <div className="mx-auto grid w-full max-w-md grid-cols-5">
          {NAV_ITEMS.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2",
                  "text-[11px] font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid={`layout.nav.${item.label.toLowerCase()}`}
              >
                <Icon
                  className={cn("size-6", active && "scale-110")}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
