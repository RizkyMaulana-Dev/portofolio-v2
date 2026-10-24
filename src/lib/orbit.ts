// Pure orbit math - DESIGN.md §8.1

export interface StageSize {
  width: number;
  height: number;
}

export interface OrbitConfig {
  cardCount: number;
  radiusInner: number;
  radiusOuter: number;
  centerX: number;
  centerY: number;
}

export interface CardTransform {
  x: number;
  y: number;
  scale: number;
  rotY: number;
  rotZ: number;
  opacity: number;
  blur: number;
  front: boolean;
}

// Ease-in-out cubic: smooth acceleration/deceleration
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Main orbit computation - pure function, no React
// t = elapsed time in seconds (for ambient wobble)
// p = scroll progress [0,1]
export function computeCard(
  i: number,
  p: number,
  t: number,
  size: StageSize,
  cfg: OrbitConfig,
): CardTransform {
  const W = size.width;
  const H = size.height;

  const spin = easeInOutCubic(p) * Math.PI * 2 * 1.5;
  const wobble = Math.sin(t * 0.8 + i) * 0.08;
  const angle = spin + (i * (Math.PI * 2)) / cfg.cardCount + wobble;

  const layer = i % 2;
  const R = W * (layer ? cfg.radiusOuter : cfg.radiusInner) +
    Math.sin(t * 0.9 + i * 2) * W * 0.008;

  const x = cfg.centerX + Math.cos(angle) * R;
  const z = Math.sin(angle); // -1 (back) ... +1 (front)
  const y =
    cfg.centerY - H * 0.10 + z * H * 0.07 +
    Math.sin(t * 1.1 + i * 1.7) * H * 0.012 +
    (layer ? -H * 0.05 : H * 0.03);

  const scale = 0.78 + 0.28 * z;
  const rotY = -Math.cos(angle) * 38; // degrees
  const rotZ = Math.cos(angle + 1) * 5; // degrees
  const opacity = 0.55 + 0.45 * (z + 1) / 2;
  const blur = z > 0 ? 0 : (1 - z) * 0.6;

  // Hysteresis: switch z-layer at left/right sides, not center
  // front when cos(angle) is near +1 (card passing in front)
  const front = z > 0;

  return {
    x,
    y,
    scale,
    rotY,
    rotZ,
    opacity,
    blur,
    front,
  };
}

// Helper: get card count by breakpoint
export function getCardCount(width: number): number {
  if (width < 768) return 4;     // mobile
  if (width < 1024) return 5;    // tablet
  return 6;                       // desktop
}

// Helper: radius config by breakpoint
export function getOrbitConfig(width: number): OrbitConfig {
  const cardCount = getCardCount(width);
  return {
    cardCount,
    radiusInner: 0.21,
    radiusOuter: 0.27,
    centerX: width / 2,
    centerY: 0, // will be set via useStageSize
  };
}