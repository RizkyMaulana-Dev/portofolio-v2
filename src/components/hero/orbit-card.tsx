import { cn } from "@/lib/utils";
import {
  Target,
  MessageCircle,
  Layers,
  Briefcase,
  NotebookPen,
  PenTool,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  MessageCircle,
  Layers,
  Briefcase,
  NotebookPen,
  PenTool,
};

const ACCENTS: Record<string, string> = {
  lime: "bg-lime",
  violet: "bg-violet",
  peach: "bg-peach",
  sky: "bg-sky",
  sun: "bg-sun",
  rose: "bg-rose",
};

interface OrbitCardProps {
  title: string;
  caption: string;
  accent: string;
  icon: string;
}

export function OrbitCard({ title, caption, accent, icon }: OrbitCardProps) {
  const Icon = ICONS[icon] ?? Target;

  return (
    <div
      className={cn(
        "glass-card p-4 w-[clamp(9.5rem,15vw,14rem)] max-[767px]:w-[8.5rem] select-none",
        "shadow-[0_24px_48px_-12px_rgb(0_0_0/0.15)]",
        "overflow-hidden"
      )}
      aria-hidden="true"
    >
      <div
        className="h-[1px] w-full bg-gradient-to-r from-[var(--color-card-border)] to-transparent"
        aria-hidden="true"
      />
      <div
        className={cn(
          "flex h-10 w-10 rounded-xl items-center justify-center mb-3 mt-2",
          ACCENTS[accent] ?? ACCENTS.lime
        )}
      >
        <Icon className="h-5 w-5 text-white" aria-hidden="true" />
      </div>
      <h3 className="text-[15px] font-medium tracking-[-0.01em] text-foreground">
        {title}
      </h3>
      <p className="text-[13px] text-muted-foreground mt-0.5">{caption}</p>
    </div>
  );
}