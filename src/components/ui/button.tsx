import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isIcon = size === "icon";

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.02] motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98]",
          {
            "bg-primary text-primary-foreground hover:shadow-lg": variant === "default",
            "bg-[var(--color-glass)] backdrop-blur border border-border text-foreground hover:bg-[var(--color-glass-strong)]":
              variant === "outline",
            "bg-muted/30 text-foreground hover:bg-muted/50": variant === "secondary",
            "text-foreground hover:bg-muted/30": variant === "ghost",
          },
          {
            "h-12 px-7": variant === "default" && !isIcon,
            "h-12 px-6": variant === "outline" && !isIcon,
            "h-10 px-4": (variant === "secondary" || variant === "ghost") && !isIcon,
          },
          {
            "h-10 px-4 text-sm": size === "sm",
            "h-14 px-8 text-base": size === "lg",
            "h-12 w-12": isIcon,
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };