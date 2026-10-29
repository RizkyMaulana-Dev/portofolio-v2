/**
 * Resolve a root-relative path against Astro's configured base.
 *
 * GitHub Pages serves this repository from `/portofolio-v2/`, while local
 * development stays at the domain root. Content keeps base-less paths so the
 * same CMS value works in both environments.
 *
 * Uploaded files live on the local CMS API (`/uploads/...`); the dev server
 * proxies that path directly, so it must not receive the Pages base.
 */
export function resolveWithBase(path: string, rawBase = "/"): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return path;
  if (path === "/uploads" || path.startsWith("/uploads/")) return path;

  const base = rawBase === "/" ? "" : rawBase.replace(/\/$/, "");

  // Do not prefix a path that already contains the deployment base.
  if (base && (path === base || path.startsWith(`${base}/`))) return path;

  return path === "/" ? `${base}/` : `${base}${path}`;
}

const rawBase = (
  (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/"
);

export function withBase(path: string): string {
  return resolveWithBase(path, rawBase);
}
