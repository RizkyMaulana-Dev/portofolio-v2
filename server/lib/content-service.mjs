import { SECTIONS, isSection } from './sections.mjs';

function readJson(value) {
  if (typeof value !== 'string') return value;
  return JSON.parse(value);
}

function asIso(value) {
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function serialize(content) {
  return JSON.stringify(content);
}

export function createContentService(pool) {
  async function list() {
    const [rows] = await pool.query(
      'SELECT section, content, updated_at FROM content_sections ORDER BY section'
    );
    const sections = {};

    for (const row of rows) {
      sections[row.section] = {
        content: readJson(row.content),
        updatedAt: asIso(row.updated_at),
      };
    }

    return sections;
  }

  async function saveSection(section, content) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const json = serialize(content);

      await connection.execute(
        `INSERT INTO content_sections (section, content)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE content = ?, updated_at = CURRENT_TIMESTAMP(3)`,
        [section, json, json]
      );
      await connection.execute(
        'INSERT INTO content_revisions (section, content) VALUES (?, ?)',
        [section, json]
      );
      await connection.execute('DELETE FROM content_drafts WHERE section = ?', [section]);
      await connection.commit();

      const [[row]] = await connection.execute(
        'SELECT updated_at FROM content_sections WHERE section = ?',
        [section]
      );

      return { section, updatedAt: asIso(row.updated_at) };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async function saveAll(contentMap) {
    const entries = Object.entries(contentMap).filter(([section]) => isSection(section));
    if (entries.length === 0) return { ok: true };

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      for (const [section, content] of entries) {
        const json = serialize(content);
        await connection.execute(
          `INSERT INTO content_sections (section, content)
           VALUES (?, ?)
           ON DUPLICATE KEY UPDATE content = ?, updated_at = CURRENT_TIMESTAMP(3)`,
          [section, json, json]
        );
        await connection.execute(
          'INSERT INTO content_revisions (section, content) VALUES (?, ?)',
          [section, json]
        );
      }

      await connection.execute('DELETE FROM content_drafts');
      await connection.commit();
      return { ok: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async function listDrafts() {
    const [rows] = await pool.query(
      'SELECT section, content, saved_at FROM content_drafts ORDER BY section'
    );
    const drafts = {};

    for (const row of rows) {
      drafts[row.section] = {
        content: readJson(row.content),
        savedAt: asIso(row.saved_at),
      };
    }

    return drafts;
  }

  async function saveDraft(section, content) {
    const json = serialize(content);

    await pool.execute(
      `INSERT INTO content_drafts (section, content)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content = ?, saved_at = CURRENT_TIMESTAMP(3)`,
      [section, json, json]
    );

    const [[row]] = await pool.execute(
      'SELECT saved_at FROM content_drafts WHERE section = ?',
      [section]
    );

    return { section, savedAt: asIso(row.saved_at) };
  }

  async function clearDraft(section) {
    await pool.execute('DELETE FROM content_drafts WHERE section = ?', [section]);
    return { ok: true };
  }

  async function resetAll() {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      await connection.execute('DELETE FROM content_drafts');
      await connection.execute('DELETE FROM content_sections');
      await connection.commit();
      return { ok: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async function listRevisions(section, limit = 20) {
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const [rows] = await pool.execute(
      `SELECT id, section, content, created_at
       FROM content_revisions
       WHERE section = ?
       ORDER BY created_at DESC, id DESC
       LIMIT ${safeLimit}`,
      [section]
    );

    return rows.map((row) => ({
      id: Number(row.id),
      section: row.section,
      content: readJson(row.content),
      createdAt: asIso(row.created_at),
    }));
  }

  async function health() {
    await pool.query('SELECT 1');
    return { ok: true };
  }

  return {
    list,
    saveSection,
    saveAll,
    listDrafts,
    saveDraft,
    clearDraft,
    resetAll,
    listRevisions,
    health,
    sections: SECTIONS,
  };
}
