import express from 'express';
import { createContentService } from './lib/content-service.mjs';
import { isContentObject, isSection } from './lib/sections.mjs';

function asyncRoute(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

function assertSection(section) {
  if (!isSection(section)) {
    const error = new Error('Unknown content section.');
    error.status = 400;
    throw error;
  }
}

function assertContent(content) {
  if (!isContentObject(content)) {
    const error = new Error('Content must be a JSON object.');
    error.status = 400;
    throw error;
  }
}

export function createApp({ pool, contentService } = {}) {
  if (!pool) throw new Error('createApp requires a MySQL pool.');
  const content = contentService ?? createContentService(pool);
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '8mb' }));

  app.get(
    '/api/health',
    asyncRoute(async (_request, response) => {
      response.json(await content.health());
    })
  );

  app.get(
    '/api/content',
    asyncRoute(async (_request, response) => {
      response.json({ sections: await content.list() });
    })
  );

  app.put(
    '/api/content',
    asyncRoute(async (request, response) => {
      const value = request.body?.content;
      assertContent(value);

      const entries = Object.entries(value);
      for (const [section] of entries) assertSection(section);

      response.json(await content.saveAll(value));
    })
  );

  app.put(
    '/api/content/:section',
    asyncRoute(async (request, response) => {
      const { section } = request.params;
      assertSection(section);
      assertContent(request.body?.content);

      response.json(await content.saveSection(section, request.body.content));
    })
  );

  app.delete(
    '/api/content',
    asyncRoute(async (_request, response) => {
      response.json(await content.resetAll());
    })
  );

  app.get(
    '/api/drafts',
    asyncRoute(async (_request, response) => {
      response.json({ drafts: await content.listDrafts() });
    })
  );

  app.put(
    '/api/drafts/:section',
    asyncRoute(async (request, response) => {
      const { section } = request.params;
      assertSection(section);
      assertContent(request.body?.content);

      response.json(await content.saveDraft(section, request.body.content));
    })
  );

  app.delete(
    '/api/drafts/:section',
    asyncRoute(async (request, response) => {
      const { section } = request.params;
      assertSection(section);
      response.json(await content.clearDraft(section));
    })
  );

  app.get(
    '/api/revisions/:section',
    asyncRoute(async (request, response) => {
      const { section } = request.params;
      assertSection(section);
      response.json({
        revisions: await content.listRevisions(section, request.query.limit),
      });
    })
  );

  app.use('/api', (_request, response) => {
    response.status(404).json({ error: { message: 'API route not found.' } });
  });

  app.use((error, _request, response, _next) => {
    const status = error.status ?? (error.type === 'entity.too.large' ? 413 : 500);
    if (status >= 500) console.error(error);
    response.status(status).json({
      error: { message: status >= 500 ? 'Internal server error.' : error.message },
    });
  });

  return app;
}
