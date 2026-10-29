# Local MySQL CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the portfolio CMS from browser-only storage to a local MySQL-backed API, add autosaved drafts that survive a closed tab, and add drag-and-drop file uploads without changing the public site's static build behavior.

**Architecture:** A local Node/Express API owns MySQL persistence, drafts, revisions, and uploads. Astro stays static; the public site hydrates from the API when available and falls back to the existing localStorage/default content. The admin dashboard reads/writes the API and keeps localStorage as a fail-safe cache. Uploaded files live in `uploads/` and are served by the API through the Astro dev proxy.

**Tech Stack:** Astro 5, React 19, TypeScript, Node 22, Express, mysql2, multer, MySQL 8.4 (Docker Compose for local development), Node test runner.

**Spec:** The user brief in this session: local MySQL first, easy CMS editing, edits must survive closing the tab, add drag-and-drop file uploads, preserve the public design and auth.

## Global Constraints

- Keep `admin@gmail.com` / `admin123` and the `rizky-portfolio-content-v1` local cache key.
- Keep the public site buildable as static output for GitHub Pages (`GITHUB_PAGES=true`).
- API binds to `127.0.0.1` by default and is for local development.
- Uploads accept images, videos, and PDFs; maximum file size is 50 MB.
- Never commit `.env`, `uploads/`, or database volumes.
- Use the existing visual language and Tailwind tokens; do not redesign public sections.
- Use `npx pnpm@10.20.0` for dependency changes because the project declares pnpm.
- Every backend behavior gets a failing Node test before implementation.

---

## File Map

**Create**

- `docker-compose.yml` — local MySQL 8.4 service on `127.0.0.1:3307`.
- `.env.example` — documented local DB/API settings.
- `server/config.mjs` — reads DB/API environment values.
- `server/db/pool.mjs` — mysql2 pool factory.
- `server/db/schema.sql` — tables for content, drafts, revisions, uploads.
- `server/scripts/setup-db.mjs` — creates/applies schema.
- `server/lib/sections.mjs` — section whitelist and JSON validation.
- `server/lib/content-service.mjs` — content/draft/revision operations.
- `server/lib/upload-service.mjs` — upload persistence and file cleanup.
- `server/app.mjs` — Express app factory.
- `server/index.mjs` — local HTTP entry point.
- `server/tests/api.test.mjs` — integration tests for content and upload endpoints.
- `scripts/dev.mjs` — starts API and Astro together.
- `src/lib/content-api.ts` — browser API client and upload helpers.
- `src/lib/content-drafts.ts` — draft metadata and localStorage helpers.
- `src/components/admin/media-library.tsx` — drag-and-drop media view.
- `docs/LOCAL_CMS.md` — setup, recovery behavior, and future hosting notes.

**Modify**

- `package.json` — dependencies and dev/db scripts.
- `astro.config.mjs` — dev/preview proxy for `/api` and `/uploads`.
- `.gitignore` — ignore uploads and local DB artifacts.
- `src/lib/paths.ts` — leave `/uploads/*` unprefixed.
- `src/lib/site-content.ts` — remote hydration and merge helpers.
- `src/components/admin/admin-types.ts` — section-aware draft hook with autosave.
- `src/components/admin/admin-fields.tsx` — drop fields, multi-file field, saving states.
- `src/components/admin/admin-dashboard.tsx` — API load/save, draft bootstrap, status.
- `src/components/admin/admin-overview.tsx` — MySQL/local status card.
- `src/components/admin/sections/*.tsx` — pass section/draft state and add file fields.
- `src/lib/admin-auth.ts` / `src/components/admin/admin-login.tsx` — only copy updates if needed.

---

## Task 1: Local database and schema

**Files:** `docker-compose.yml`, `.env.example`, `.gitignore`, `server/db/schema.sql`, `server/config.mjs`, `server/db/pool.mjs`, `server/scripts/setup-db.mjs`.

**Interfaces:**
- Produces `config` with `{ host, port, user, password, database, apiPort, uploadDir }`.
- Produces `createPool(config)` returning a mysql2 promise pool.
- Produces tables: `content_sections`, `content_drafts`, `content_revisions`, `uploads`.

- [x] Start MySQL through Docker Compose on port 3307.
- [x] Apply `node server/scripts/setup-db.mjs`; verify all four tables exist.
- [x] Confirm `GITHUB_PAGES=true npx astro build` still works without a database.

## Task 2: Content and draft API (TDD)

**Files:** `server/lib/sections.mjs`, `server/lib/content-service.mjs`, `server/app.mjs`, `server/index.mjs`, `server/tests/api.test.mjs`.

**Interfaces:**
- `isSection(value): value is 'hero'|'about'|'work'|'videos'|'site'`.
- `createContentService(pool)` returns `{ list, saveSection, saveAll, listDrafts, saveDraft, clearDraft, resetAll, listRevisions }`.
- `GET /api/content` → `{ sections: { [section]: { content, updatedAt } } }`.
- `PUT /api/content/:section` body `{ content }` → `{ section, updatedAt }`.
- `GET /api/drafts` → `{ drafts: { [section]: { content, savedAt } } }`.
- `PUT /api/drafts/:section` body `{ content }` → `{ section, savedAt }`.
- `DELETE /api/drafts/:section` → `{ ok: true }`.
- `DELETE /api/content` → `{ ok: true }`.

- [x] **Step 1: Write failing integration tests** for health, empty content, save/read section, draft save/read/clear, and invalid section rejection.
- [x] **Step 2: Run `node --test server/tests/api.test.mjs`; expect failure because `server/app.mjs` does not exist.**
- [x] **Step 3: Implement the service and the three content/draft routes.**
- [x] **Step 4: Re-run the tests; expect all content/draft tests to pass.**
- [x] **Step 5: Commit the task.**

## Task 3: Upload API (TDD)

**Files:** `server/lib/upload-service.mjs`, `server/app.mjs`, `server/tests/api.test.mjs`.

**Interfaces:**
- `POST /api/uploads` multipart field `file` → `{ upload: { id, originalName, mimeType, size, url, createdAt } }`.
- `GET /api/uploads` → `{ uploads: Upload[] }`.
- `DELETE /api/uploads/:id` → `{ ok: true }`.
- `GET /uploads/:name` serves stored files.

- [x] **Step 1: Add failing tests** for JPEG/PDF upload, listing, static serving, and rejection of unsupported MIME types.
- [x] **Step 2: Run the upload tests; expect 404/route failure.**
- [x] **Step 3: Implement multer storage, upload rows, static serving, and delete cleanup.**
- [x] **Step 4: Re-run tests; expect pass.**
- [x] **Step 5: Commit the task.**

## Task 4: Public content hydration and API client

**Files:** `src/lib/content-api.ts`, `src/lib/site-content.ts`, `src/lib/paths.ts`, `astro.config.mjs`.

**Interfaces:**
- `fetchRemoteContent()`, `saveRemoteSection(section, value)`, `resetRemoteContent()`, `fetchRemoteDrafts()`, `saveRemoteDraft(section, value)`, `clearRemoteDraft(section)`, `uploadFile(file)`, `listUploads()`, `removeUpload(id)`.
- `mergeRemoteSections(sections)` fills missing fields with defaults.
- `hydrateSiteContentFromServer()` is idempotent and fails silently.
- `useSiteContent()` triggers one remote hydration attempt on mount.

- [x] **Step 1: Add a failing test for merge behavior** (pure content merge with a partial hero object) in `tests/site-content.test.ts` using the Node test runner or a small `tsx` harness.
- [x] **Step 2: Implement the client, merge helper, and hydration.**
- [x] **Step 3: Verify with the test and `npx astro check`.**
- [x] **Step 4: Commit the task.**

## Task 5: Admin autosave and recoverable drafts

**Files:** `src/lib/content-drafts.ts`, `src/components/admin/admin-types.ts`, `src/components/admin/admin-fields.tsx`, `src/components/admin/admin-dashboard.tsx`, `src/components/admin/admin-overview.tsx`, all section components.

**Interfaces:**
- `readLocalDraft(section)`, `writeLocalDraft(section, value)`, `clearLocalDraft(section)`.
- `seedDraftsFromServer(drafts)` only overwrites an older local draft.
- `useSectionDraft(section, initial, onSave)` returns `{ draft, setDraft, isDirty, isSaving, restoredAt, save, discardDraft }`.
- Admin status is `'mysql' | 'browser'`.

- [x] **Step 1: Write a failing test for local draft read/write/clear and server-draft seeding.**
- [x] **Step 2: Implement draft helpers and the hook.**
- [x] **Step 3: Wire the dashboard to load MySQL first, migrate existing local content when the DB is empty, and fall back to browser mode.**
- [x] **Step 4: Add the restored-draft banner and autosave status to `FormShell`.**
- [x] **Step 5: Verify recovery by typing, closing the tab, reopening, and saving.**
- [x] **Step 6: Commit the task.**

## Task 6: Drag-and-drop uploads and media library

**Files:** `src/components/admin/admin-fields.tsx`, `src/components/admin/media-library.tsx`, `src/components/admin/admin-dashboard.tsx`, `src/components/admin/admin-types.ts`, `src/components/admin/sections/about-section.tsx`, `src/components/admin/sections/work-section.tsx`, `src/components/admin/sections/videos-section.tsx`.

**Interfaces:**
- `<FileDropField label value onChange accept kind hint />` uploads one file and writes the returned `/uploads/...` URL.
- `<MediaListField label values onChange accept hint />` uploads multiple files.
- `MediaLibrary` lists, uploads, copies, and deletes files.

- [x] **Step 1: Add a failing test for upload URL resolution/`withBase` handling of `/uploads/...`.**
- [x] **Step 2: Implement the components and the Media nav item.**
- [x] **Step 3: Add drop fields for project cover/gallery/video and certificate image/PDF.**
- [x] **Step 4: Verify upload, preview, copy URL, and remove.**
- [x] **Step 5: Commit the task.**

## Task 7: Documentation and full verification

**Files:** `docs/LOCAL_CMS.md`, `README.md`, `package.json`.

- [x] Document `docker compose up -d mysql`, `npx pnpm@10.20.0 install`, `node server/scripts/setup-db.mjs`, and `npm run dev`.
- [x] Explain draft recovery, the browser fallback, and why uploaded files are excluded from the static GitHub Pages build.
- [x] Run `node --test server/tests/*.test.mjs`, `npx astro check`, and `GITHUB_PAGES=true npx astro build`.
- [x] Manually verify admin login, content save, edit/reopen recovery, drag-drop upload, media copy/delete, and public hydration.
- [x] Commit the final task.

## Review Focus

- **Closing the tab during a long edit:** the newest keystroke must survive in both browser storage and MySQL, and reopening must make it obvious that a draft was restored.
- **MySQL temporarily unavailable:** the admin must load from browser storage, keep edits safe, and clearly label the failure instead of silently claiming a DB save.
- **Uploading a disallowed or oversized file:** the API must reject it without leaving orphan rows/files, and the UI must keep the existing value intact.
- **Remote content with missing/new fields:** merging must preserve defaults and never blank a section because the database has an older shape.
- **GitHub Pages static build:** the absence of an API must not break the public site; the public design must render exactly as before from defaults/local cache.
