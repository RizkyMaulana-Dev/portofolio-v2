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

// Smooth 0→1 ramp between two edges
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Scroll progress where the orbit starts locking into idle mode
const IDLE_START = 0.96;

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

  // Clamp: past the hero (p > 1) the orbit must stay frozen at its final pose
  const progress = Math.min(1, Math.max(0, p));

  // 0 → orbiting with scroll, 1 → orbit locked, cards idle-floating in place
  const idle = smoothstep(IDLE_START, 1, progress);

  const spin = easeInOutCubic(progress) * Math.PI * 2 * 0.8;
  // Angle wobble fades out at the end so cards stop drifting sideways
  const wobble = Math.sin(t * 0.8 + i) * 0.08 * (1 - idle);
  const angle = spin + (i * (Math.PI * 2)) / cfg.cardCount + wobble;

  const layer = i % 2;
  // Radius pulse also fades out so x position freezes
  const R = W * (layer ? cfg.radiusOuter : cfg.radiusInner) +
    Math.sin(t * 0.9 + i * 2) * W * 0.008 * (1 - idle);

  const x = cfg.centerX + Math.cos(angle) * R;
  const z = Math.sin(angle); // -1 (back) ... +1 (front)

  // While orbiting: subtle bob. When idle: slow floating bob in place.
  const orbitBob = Math.sin(t * 1.1 + i * 1.7) * H * 0.012;
  const idleFloat = Math.sin(t * 0.55 + i * 1.4) * H * 0.016;
  const bob = orbitBob * (1 - idle) + idleFloat * idle;

  const y =
    cfg.centerY - H * 0.10 + z * H * 0.07 +
    bob +
    (layer ? -H * 0.05 : H * 0.03);

  // Gentle breathing only when idle (no rotation on any axis)
  const scale = 0.78 + 0.28 * z + Math.sin(t * 0.5 + i) * 0.012 * idle;
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