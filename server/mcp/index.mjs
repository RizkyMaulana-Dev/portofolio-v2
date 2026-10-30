#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createCmsApiClient } from './api-client.mjs';
import { loadDefaultContent } from './defaults.mjs';
import { createCmsMcpServer } from './server.mjs';

async function main() {
  const api = createCmsApiClient();
  let defaults = {};

  try {
    defaults = await loadDefaultContent();
  } catch (error) {
    console.error(
      '[cms-mcp] Default content src/content tidak termuat. Jalankan lewat "npm run mcp" (tsx) agar fallback default tersedia.'
    );
    console.error(`[cms-mcp] ${error.message}`);
  }

  const server = createCmsMcpServer({ api, defaults });
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error(`[cms-mcp] Portfolio CMS MCP siap. API: ${api.baseUrl}`);
}

main().catch(error => {
  console.error('[cms-mcp] Gagal menjalankan server:', error);
  process.exit(1);
});
