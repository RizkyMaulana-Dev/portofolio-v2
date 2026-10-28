import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Presentational theme control. The inline controller in Layout.astro updates
 * the document theme, localStorage, and the button's accessible state.
 */
export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      data-theme-toggle
      aria-label="Switch to dark mode"
      aria-pressed="false"
      title="Switch to dark mode"
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-card-border)] bg-[var(--color-glass)] text-foreground backdrop-blur-md transition-[background-color,border-color,color,transform] duration-200 ease-out",
        "hover:bg-[var(--color-glass-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "motion-safe:hover:scale-105 motion-safe:active:scale-95",
        className
      )}
    >
      <span className="relative block h-4 w-4" aria-hidden="true">
        <Moon className="theme-icon-moon absolute inset-0 h-4 w-4" strokeWidth={1.6} />
        <Sun className="theme-icon-sun absolute inset-0 h-4 w-4" strokeWidth={1.6} />
      </span>
    </button>
  );
}
