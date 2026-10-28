/**
 * Resolve a root-relative path against Astro's configured base.
 *
 * GitHub Pages serves this repository from `/portofolio-v2/`, while local
 * development stays at the domain root. Content keeps base-less paths so the
 * same CMS value works in both environments.
 */
const rawBase = import.meta.env.BASE_URL ?? "/";
const base = rawBase === "/" ? "" : rawBase.replace(/\/$/, "");

export function withBase(path: string): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return path;

  // Do not prefix a path that already contains the deployment base.
  if (base && (path === base || path.startsWith(`${base}/`))) return path;

  return path === "/" ? `${base}/` : `${base}${path}`;
}
