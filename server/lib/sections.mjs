export const SECTIONS = Object.freeze(['hero', 'about', 'work', 'videos', 'site']);

export function isSection(value) {
  return typeof value === 'string' && SECTIONS.includes(value);
}

export function isContentObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
