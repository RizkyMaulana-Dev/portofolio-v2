const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

export function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function deepClone(value) {
  if (value === undefined) return undefined;
  return structuredClone(value);
}

function assertSafeKey(key) {
  if (FORBIDDEN_KEYS.has(key)) {
    throw new Error(`Unsafe object key: ${key}`);
  }
}

export function deepMerge(base, patch) {
  if (!isPlainObject(patch)) return deepClone(patch);

  const output = isPlainObject(base) ? deepClone(base) : {};

  for (const [key, value] of Object.entries(patch)) {
    assertSafeKey(key);

    if (isPlainObject(value) && isPlainObject(output[key])) {
      output[key] = deepMerge(output[key], value);
    } else {
      output[key] = deepClone(value);
    }
  }

  return output;
}

export function parsePath(path) {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new Error('Path must be a non-empty string.');
  }

  const normalized = path.trim().replace(/\[(\d+)\]/g, '.$1');
  const segments = normalized.split('.').filter(segment => segment !== '');

  if (segments.length === 0) {
    throw new Error('Path must contain at least one segment.');
  }

  for (const segment of segments) {
    assertSafeKey(segment);
  }

  return segments;
}

export function getAtPath(root, path) {
  const segments = parsePath(path);
  let current = root;

  for (const segment of segments) {
    if (Array.isArray(current)) {
      if (!/^\d+$/.test(segment)) {
        return { exists: false, value: undefined };
      }

      const index = Number(segment);
      if (index < 0 || index >= current.length) {
        return { exists: false, value: undefined };
      }

      current = current[index];
      continue;
    }

    if (!isPlainObject(current) || !Object.hasOwn(current, segment)) {
      return { exists: false, value: undefined };
    }

    current = current[segment];
  }

  return { exists: true, value: current };
}

export function setAtPath(root, path, value) {
  const segments = parsePath(path);
  const output = deepClone(root);
  let current = output;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    const nextSegment = segments[index + 1];

    if (Array.isArray(current)) {
      const arrayIndex = Number(segment);
      if (!Number.isInteger(arrayIndex) || arrayIndex < 0 || arrayIndex >= current.length) {
        throw new Error(`Array index ${segment} does not exist at this path.`);
      }

      if (current[arrayIndex] === null || current[arrayIndex] === undefined) {
        current[arrayIndex] = /^\d+$/.test(nextSegment) ? [] : {};
      }

      current = current[arrayIndex];
      continue;
    }

    if (!isPlainObject(current)) {
      throw new Error(`Cannot traverse into a non-object value at "${segment}".`);
    }

    if (current[segment] === null || current[segment] === undefined) {
      current[segment] = /^\d+$/.test(nextSegment) ? [] : {};
    }

    current = current[segment];
  }

  const last = segments.at(-1);
  const previous = getAtPath(output, path).value;

  if (Array.isArray(current)) {
    const arrayIndex = Number(last);
    if (!Number.isInteger(arrayIndex) || arrayIndex < 0 || arrayIndex > current.length) {
      throw new Error(`Array index ${last} is out of range.`);
    }

    current[arrayIndex] = deepClone(value);
  } else if (isPlainObject(current)) {
    current[last] = deepClone(value);
  } else {
    throw new Error(`Cannot set a field on a non-object value at "${last}".`);
  }

  return { content: output, previousValue: previous };
}

function itemSearchText(item) {
  const values = [];

  function walk(value) {
    if (typeof value === 'string' || typeof value === 'number') {
      values.push(String(value));
      return;
    }

    if (Array.isArray(value)) {
      for (const entry of value) walk(entry);
      return;
    }

    if (isPlainObject(value)) {
      for (const entry of Object.values(value)) walk(entry);
    }
  }

  walk(item);
  return values.join(' ').toLowerCase();
}

function itemLabel(item) {
  if (!isPlainObject(item)) return String(item);

  return (
    item.title ??
    item.label ??
    item.name ??
    item.slug ??
    item.id ??
    item.credentialId ??
    '(untitled item)'
  );
}

export function summarizeItem(item, index) {
  if (!isPlainObject(item)) {
    return { index, value: item };
  }

  const summary = {
    index,
    label: itemLabel(item),
  };

  for (const key of [
    'title',
    'label',
    'name',
    'slug',
    'id',
    'category',
    'issuer',
    'year',
    'date',
    'href',
    'credentialId',
  ]) {
    if (item[key] !== undefined) summary[key] = item[key];
  }

  const preview = item.summary ?? item.description ?? item.text ?? item.note;
  if (typeof preview === 'string') {
    summary.preview = preview.length > 160 ? `${preview.slice(0, 157)}...` : preview;
  }

  return summary;
}

export function itemMatchesQuery(item, query) {
  return itemSearchText(item).includes(query.toLowerCase());
}

export function resolveItemIndex(items, { index, match } = {}) {
  if (!Array.isArray(items)) {
    throw new Error('The selected path is not an array.');
  }

  if (index !== undefined) {
    if (!Number.isInteger(index) || index < 0 || index >= items.length) {
      throw new Error(`Index ${index} is out of range (0–${Math.max(items.length - 1, 0)}).`);
    }

    return index;
  }

  if (typeof match !== 'string' || match.trim() === '') {
    throw new Error('Provide an item index or a match string.');
  }

  const needle = match.trim().toLowerCase();
  const scored = [];

  items.forEach((item, itemIndex) => {
    let best = 0;

    if (isPlainObject(item)) {
      for (const key of ['slug', 'id', 'title', 'label', 'name', 'credentialId', 'href']) {
        const value = item[key];
        if (typeof value !== 'string') continue;

        if (value === match) best = Math.max(best, 3);
        else if (value.toLowerCase() === needle) best = Math.max(best, 2);
        else if (value.toLowerCase().includes(needle)) best = Math.max(best, 1);
      }
    } else if (String(item).toLowerCase().includes(needle)) {
      best = 1;
    }

    if (best > 0) scored.push({ index: itemIndex, score: best, label: itemLabel(item) });
  });

  if (scored.length === 0) {
    throw new Error(
      `No item matched "${match}". Use cms_list_items first to inspect available indexes.`
    );
  }

  const highest = Math.max(...scored.map(entry => entry.score));
  const bestMatches = scored.filter(entry => entry.score === highest);

  if (bestMatches.length > 1) {
    const candidates = bestMatches
      .slice(0, 8)
      .map(entry => `${entry.index}: ${entry.label}`)
      .join(', ');
    throw new Error(
      `Match "${match}" is ambiguous (${candidates}). Use an explicit index instead.`
    );
  }

  return bestMatches[0].index;
}

export function walkStrings(value, path, visit, state = { visited: 0, limit: 5000 }) {
  if (state.visited >= state.limit) return;

  if (typeof value === 'string') {
    state.visited += 1;
    visit(path, value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      walkStrings(entry, `${path}[${index}]`, visit, state);
    });
    return;
  }

  if (isPlainObject(value)) {
    for (const [key, entry] of Object.entries(value)) {
      walkStrings(entry, path ? `${path}.${key}` : key, visit, state);
    }
  }
}
