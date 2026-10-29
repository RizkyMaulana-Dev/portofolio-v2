import { createApp } from './app.mjs';
import { config } from './config.mjs';
import { createPool } from './db/pool.mjs';

const pool = createPool();
const app = createApp({ pool });

const server = app.listen(config.apiPort, config.apiHost, () => {
  console.log(`CMS API listening on http://${config.apiHost}:${config.apiPort}`);
});

async function shutdown(signal) {
  console.log(`\n${signal} received; closing CMS API.`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
