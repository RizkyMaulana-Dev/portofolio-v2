const DEFAULT_MODULES = {
  hero: () => import('../../src/content/hero.ts'),
  about: () => import('../../src/content/about.ts'),
  work: () => import('../../src/content/work.ts'),
  videos: () => import('../../src/content/videos.ts'),
  site: () => import('../../src/content/site.ts'),
};

export async function loadDefaultContent() {
  const entries = await Promise.all(
    Object.entries(DEFAULT_MODULES).map(async ([section, load]) => {
      const loaded = await load();

      if (!loaded[section] || typeof loaded[section] !== 'object') {
        throw new Error(`Default content export "${section}" was not found.`);
      }

      return [section, loaded[section]];
    })
  );

  return Object.fromEntries(entries);
}
