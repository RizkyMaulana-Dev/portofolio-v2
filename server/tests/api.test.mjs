import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { once } from 'node:events';
import { createPool } from '../db/pool.mjs';

let app;
let server;
let pool;
let baseUrl;

async function cleanContent() {
  await pool.query('DELETE FROM content_drafts');
  await pool.query('DELETE FROM content_sections');
  await pool.query('DELETE FROM content_revisions');
}

async function request(path, options) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'content-type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });
  const text = await response.text();
  return {
    status: response.status,
    body: text ? JSON.parse(text) : null,
  };
}

before(async () => {
  pool = createPool();
  const { createApp } = await import('../app.mjs');
  app = createApp({ pool });
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(async () => {
  await cleanContent();
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  if (pool) await pool.end();
});

describe('content API', () => {
  test('reports database health', async () => {
    const result = await request('/api/health');

    assert.equal(result.status, 200);
    assert.equal(result.body.ok, true);
  });

  test('returns an empty section map before the first save', async () => {
    const result = await request('/api/content');

    assert.equal(result.status, 200);
    assert.deepEqual(result.body.sections, {});
  });

  test('saves and reads a section', async () => {
    const saved = await request('/api/content/hero', {
      method: 'PUT',
      body: JSON.stringify({ content: { brand: 'Test brand' } }),
    });

    assert.equal(saved.status, 200);
    assert.equal(saved.body.section, 'hero');

    const read = await request('/api/content');
    assert.equal(read.status, 200);
    assert.equal(read.body.sections.hero.content.brand, 'Test brand');
  });

  test('normalizes a section without losing the current shape', async () => {
    await request('/api/content/hero', {
      method: 'PUT',
      body: JSON.stringify({ content: { headline: ['Hello', 'world'] } }),
    });

    const read = await request('/api/content');
    assert.deepEqual(read.body.sections.hero.content.headline, ['Hello', 'world']);
  });

  test('rejects an unknown section', async () => {
    const result = await request('/api/content/not-a-section', {
      method: 'PUT',
      body: JSON.stringify({ content: { brand: 'Nope' } }),
    });

    assert.equal(result.status, 400);
    assert.match(result.body.error.message, /section/i);
  });

  test('rejects non-object content', async () => {
    const result = await request('/api/content/hero', {
      method: 'PUT',
      body: JSON.stringify({ content: ['not', 'an', 'object'] }),
    });

    assert.equal(result.status, 400);
  });

  test('saves, reads, and clears a draft', async () => {
    const saved = await request('/api/drafts/about', {
      method: 'PUT',
      body: JSON.stringify({ content: { eyebrow: 'Draft eyebrow' } }),
    });

    assert.equal(saved.status, 200);
    assert.equal(saved.body.section, 'about');

    const read = await request('/api/drafts');
    assert.equal(read.status, 200);
    assert.equal(read.body.drafts.about.content.eyebrow, 'Draft eyebrow');

    const cleared = await request('/api/drafts/about', { method: 'DELETE' });
    assert.equal(cleared.status, 200);
    assert.equal(cleared.body.ok, true);

    const afterClear = await request('/api/drafts');
    assert.deepEqual(afterClear.body.drafts, {});
  });

  test('clears a draft when the section is saved', async () => {
    await request('/api/drafts/work', {
      method: 'PUT',
      body: JSON.stringify({ content: { projects: [] } }),
    });

    await request('/api/content/work', {
      method: 'PUT',
      body: JSON.stringify({ content: { projects: [] } }),
    });

    const drafts = await request('/api/drafts');
    assert.deepEqual(drafts.body.drafts, {});

    const revisions = await request('/api/revisions/work');
    assert.equal(revisions.status, 200);
    assert.equal(revisions.body.revisions.length, 1);
  });

  test('bulk saves all sections and resets content', async () => {
    const saved = await request('/api/content', {
      method: 'PUT',
      body: JSON.stringify({
        content: {
          hero: { brand: 'Bulk hero' },
          site: { name: 'Bulk name' },
        },
      }),
    });

    assert.equal(saved.status, 200);

    const read = await request('/api/content');
    assert.equal(read.body.sections.hero.content.brand, 'Bulk hero');
    assert.equal(read.body.sections.site.content.name, 'Bulk name');

    const reset = await request('/api/content', { method: 'DELETE' });
    assert.equal(reset.status, 200);

    const afterReset = await request('/api/content');
    assert.deepEqual(afterReset.body.sections, {});
  });
});
