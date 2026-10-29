import mysql from 'mysql2/promise';
import { config } from '../config.mjs';

export function createPool(overrides = {}) {
  return mysql.createPool({
    host: overrides.host ?? config.host,
    port: overrides.port ?? config.port,
    user: overrides.user ?? config.user,
    password: overrides.password ?? config.password,
    database: overrides.database ?? config.database,
    charset: 'utf8mb4',
    connectionLimit: overrides.connectionLimit ?? 10,
    waitForConnections: true,
    enableKeepAlive: true,
  });
}
