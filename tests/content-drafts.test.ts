import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDraftStore, seedDraftsFromServer } from '../src/lib/content-drafts';

class MemoryStorage {
  data = new Map();

  getItem(key: string) {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.data.set(key, value);
  }

  removeItem(key: string) {
    this.data.delete(key);
  }
}

test('writes, reads, and clears a local draft', () => {
  const store = createDraftStore(new MemoryStorage());

  store.write('hero', { brand: 'Draft brand' }, 1000);
  assert.deepEqual(store.read('hero'), {
    value: { brand: 'Draft brand' },
    updatedAt: 1000,
  });

  store.clear('hero');
  assert.equal(store.read('hero'), null);
});

test('ignores malformed local draft data', () => {
  const storage = new MemoryStorage();
  storage.setItem('rizky-portfolio-draft-v1:hero', '{broken json');
  const store = createDraftStore(storage);

  assert.equal(store.read('hero'), null);
});

test('seeds server drafts only when they are newer than the local copy', () => {
  const storage = new MemoryStorage();
  const store = createDraftStore(storage);
  store.write('hero', { brand: 'Local newer' }, Date.parse('2026-10-29T12:00:10.000Z'));
  store.write('about', { eyebrow: 'Local older' }, Date.parse('2026-10-29T12:00:00.000Z'));

  seedDraftsFromServer(
    {
      hero: {
        content: { brand: 'Server older' },
        savedAt: '2026-10-29T12:00:00.000Z',
      },
      about: {
        content: { eyebrow: 'Server newer' },
        savedAt: '2026-10-29T12:00:05.000Z',
      },
    },
    store
  );

  assert.deepEqual(store.read('hero'), {
    value: { brand: 'Local newer' },
    updatedAt: Date.parse('2026-10-29T12:00:10.000Z'),
  });
  assert.equal(store.read<{ eyebrow: string }>('about')?.value.eyebrow, 'Server newer');
});
