import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readPort(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const config = {
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: readPort(process.env.DB_PORT, 3307),
  user: process.env.DB_USER ?? 'portfolio',
  password: process.env.DB_PASSWORD ?? 'portfolio_local',
  database: process.env.DB_NAME ?? 'portfolio_cms',
  apiHost: process.env.API_HOST ?? '127.0.0.1',
  apiPort: readPort(process.env.API_PORT, 8787),
  uploadDir: path.resolve(rootDir, process.env.UPLOAD_DIR ?? 'uploads'),
  maxUploadBytes: readPort(process.env.MAX_UPLOAD_MB, 50) * 1024 * 1024,
  publicApiUrl: process.env.PUBLIC_API_URL ?? '/api',
  rootDir,
};
