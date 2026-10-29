import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { config } from '../config.mjs';

const schemaPath = path.join(config.rootDir, 'server', 'db', 'schema.sql');
const database = config.database.replace(/[^a-zA-Z0-9_]/g, '');

if (!database) {
  throw new Error('DB_NAME must contain at least one valid identifier character.');
}

const connection = await mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  multipleStatements: true,
});

try {
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.query(`USE \`${database}\``);
  const schema = await fs.readFile(schemaPath, 'utf8');
  await connection.query(schema);

  const [tables] = await connection.query('SHOW TABLES');
  const names = tables.map((row) => Object.values(row)[0]);
  console.log(`Database ready: ${database}`);
  console.log(`Tables: ${names.join(', ')}`);
} finally {
  await connection.end();
}

await fs.mkdir(config.uploadDir, { recursive: true });
console.log(`Upload directory ready: ${config.uploadDir}`);
