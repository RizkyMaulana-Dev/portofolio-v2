import type { Accent } from "@/content/about";

const ACCENT_HEX: Record<Accent, string> = {
  lime: "#D7F56B",
  violet: "#B9A2FF",
  peach: "#FFB98A",
  sky: "#8FD3FF",
  sun: "#FFD36B",
  rose: "#FF9FC0",
};

const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(to right, rgb(17 17 17 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(17 17 17 / 0.045) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};

const SCANLINE_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, rgb(17 17 17 / 0.03) 0px, rgb(17 17 17 / 0.03) 1px, transparent 1px, transparent 5px)",
};

export function PostArt({ accent, mark }: { accent: Accent; mark: string }) {
  const color = ACCENT_HEX[accent];

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-surface">
      <div className="absolute inset-0" style={GRID_STYLE} />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 14% 6%, ${color}bf 0%, ${color}33 34%, transparent 68%), radial-gradient(circle at 94% 100%, ${color}80 0%, transparent 54%)`,
        }}
      />

      <div className="absolute top-1/2 right-[-12%] aspect-square w-[54%] -translate-y-1/2 rounded-full border border-foreground/10" />
      <div className="absolute top-1/2 right-[4%] aspect-square w-[30%] -translate-y-1/2 rounded-full border border-foreground/10" />
      <span className="absolute top-1/2 right-[18%] h-2 w-2 -translate-y-1/2 rounded-full bg-foreground/60" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-[clamp(4.5rem,12vw,11rem)] leading-none italic text-foreground/70">
          {mark}
        </span>
      </div>

      <div className="absolute inset-0 opacity-30" style={SCANLINE_STYLE} />
    </div>
  );
}
