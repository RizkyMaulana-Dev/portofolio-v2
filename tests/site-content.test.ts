import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultSiteContent, mergeRemoteSections } from '../src/lib/site-content';
import { resolveWithBase } from '../src/lib/paths';

test('merges a partial remote hero without dropping default fields', () => {
  const merged = mergeRemoteSections({
    hero: {
      content: { brand: 'Remote brand' },
      updatedAt: '2026-10-29T00:00:00.000Z',
    },
  });

  assert.equal(merged.hero.brand, 'Remote brand');
  assert.deepEqual(merged.hero.headline, defaultSiteContent.hero.headline);
  assert.deepEqual(merged.about.heading, defaultSiteContent.about.heading);
});

test('keeps local fallback values for sections the API has not stored yet', () => {
  const merged = mergeRemoteSections(
    {
      site: {
        content: { name: 'Remote name' },
        updatedAt: '2026-10-29T00:00:00.000Z',
      },
    },
    {
      ...defaultSiteContent,
      about: {
        ...defaultSiteContent.about,
        heading: ['Local', 'heading'],
      },
    }
  );

  assert.equal(merged.site.name, 'Remote name');
  assert.deepEqual(merged.about.heading, ['Local', 'heading']);
});

test('does not prefix uploaded media with the GitHub Pages base', () => {
  assert.equal(resolveWithBase('/uploads/photo.png', '/portofolio-v2/'), '/uploads/photo.png');
  assert.equal(resolveWithBase('/images/cover.webp', '/portofolio-v2/'), '/portofolio-v2/images/cover.webp');
  assert.equal(resolveWithBase('https://example.com/photo.png', '/portofolio-v2/'), 'https://example.com/photo.png');
});
