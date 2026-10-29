import crypto from 'node:crypto';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import multer from 'multer';
import { config } from '../config.mjs';

const MIME_EXTENSIONS = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['image/avif', '.avif'],
  ['video/mp4', '.mp4'],
  ['video/webm', '.webm'],
  ['video/quicktime', '.mov'],
  ['application/pdf', '.pdf'],
]);

function asIso(value) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toUpload(row) {
  return {
    id: Number(row.id),
    originalName: row.original_name,
    mimeType: row.mime_type,
    size: Number(row.size),
    url: row.url,
    createdAt: asIso(row.created_at),
  };
}

function createStorage(uploadDir) {
  return multer.diskStorage({
    destination: (_request, _file, done) => done(null, uploadDir),
    filename: (_request, file, done) => {
      const extension =
        MIME_EXTENSIONS.get(file.mimetype) ??
        path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
      done(null, `${crypto.randomUUID()}${extension}`);
    },
  });
}

export function createUploadService({
  pool,
  uploadDir = config.uploadDir,
  maxUploadBytes = config.maxUploadBytes,
} = {}) {
  if (!pool) throw new Error('createUploadService requires a MySQL pool.');
  fs.mkdirSync(uploadDir, { recursive: true });

  const upload = multer({
    storage: createStorage(uploadDir),
    limits: { fileSize: maxUploadBytes, files: 1 },
    fileFilter: (_request, file, done) => {
      if (!MIME_EXTENSIONS.has(file.mimetype)) {
        const error = new Error(
          'Only PNG, JPEG, WebP, GIF, AVIF, MP4, WebM, MOV, and PDF files are allowed.'
        );
        error.status = 400;
        done(error);
        return;
      }

      done(null, true);
    },
  });

  async function list() {
    const [rows] = await pool.query(
      'SELECT id, original_name, mime_type, size, url, created_at FROM uploads ORDER BY created_at DESC, id DESC'
    );
    return rows.map(toUpload);
  }

  async function save(file) {
    const url = `/uploads/${file.filename}`;

    try {
      const [result] = await pool.execute(
        `INSERT INTO uploads (stored_name, original_name, mime_type, size, url)
         VALUES (?, ?, ?, ?, ?)`,
        [file.filename, file.originalname, file.mimetype, file.size, url]
      );

      const [[row]] = await pool.execute(
        'SELECT id, original_name, mime_type, size, url, created_at FROM uploads WHERE id = ?',
        [result.insertId]
      );

      return toUpload(row);
    } catch (error) {
      await fsPromises.unlink(file.path).catch(() => undefined);
      throw error;
    }
  }

  async function remove(id) {
    const [[row]] = await pool.execute(
      'SELECT stored_name FROM uploads WHERE id = ?',
      [id]
    );

    if (!row) {
      const error = new Error('Upload not found.');
      error.status = 404;
      throw error;
    }

    await pool.execute('DELETE FROM uploads WHERE id = ?', [id]);
    await fsPromises.unlink(path.join(uploadDir, row.stored_name)).catch(() => undefined);
    return { ok: true };
  }

  return {
    uploadDir,
    middleware: upload,
    list,
    save,
    remove,
  };
}
