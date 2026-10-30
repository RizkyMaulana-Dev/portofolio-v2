import { config } from '../config.mjs';

const DEFAULT_TIMEOUT_MS = 20_000;

function normalizeApiBase(value) {
  const url = new URL(value);
  const pathname = url.pathname.replace(/\/+$/, '');

  if (!pathname.endsWith('/api')) {
    url.pathname = `${pathname}/api`;
  } else {
    url.pathname = pathname;
  }

  return url.toString().replace(/\/+$/, '');
}

function defaultApiBase() {
  if (process.env.CMS_API_URL?.trim()) {
    return normalizeApiBase(process.env.CMS_API_URL.trim());
  }

  return `http://${config.apiHost}:${config.apiPort}/api`;
}

export class CmsApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'CmsApiError';
    this.status = status;
    this.body = body;
  }
}

export function createCmsApiClient({
  baseUrl = defaultApiBase(),
  fetchImpl = globalThis.fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('A fetch implementation is required.');
  }

  const apiBase = baseUrl.replace(/\/+$/, '');

  async function request(path, options = {}) {
    const headers = new Headers(options.headers);

    if (options.body !== undefined && !(options.body instanceof FormData)) {
      headers.set('content-type', 'application/json');
    }

    let response;

    try {
      response = await fetchImpl(`${apiBase}${path}`, {
        ...options,
        headers,
        signal: options.signal ?? AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      const detail =
        error?.name === 'TimeoutError'
          ? `CMS API timed out after ${timeoutMs} ms.`
          : `Cannot reach CMS API at ${apiBase}. Is the local API running?`;
      throw new CmsApiError(detail, 0, error);
    }

    const text = await response.text();
    let body = null;

    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    if (!response.ok) {
      const message =
        typeof body === 'object' && body !== null ? String(body.error?.message ?? '') : '';
      throw new CmsApiError(
        message || `CMS API request failed (${response.status}).`,
        response.status,
        body
      );
    }

    return body;
  }

  return {
    baseUrl: apiBase,

    async health() {
      return request('/health');
    },

    async getContent() {
      return request('/content');
    },

    async getDrafts() {
      return request('/drafts');
    },

    async saveSection(section, content) {
      return request(`/content/${encodeURIComponent(section)}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
      });
    },

    async saveDraft(section, content) {
      return request(`/drafts/${encodeURIComponent(section)}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
      });
    },

    async clearDraft(section) {
      return request(`/drafts/${encodeURIComponent(section)}`, {
        method: 'DELETE',
      });
    },

    async listRevisions(section, limit = 20) {
      const query = new URLSearchParams({ limit: String(limit) });
      return request(`/revisions/${encodeURIComponent(section)}?${query}`);
    },

    async resetContent() {
      return request('/content', { method: 'DELETE' });
    },

    async listUploads() {
      return request('/uploads');
    },

    async uploadBytes(bytes, filename, mimeType) {
      const form = new FormData();
      form.append('file', new Blob([bytes], { type: mimeType }), filename);
      return request('/uploads', { method: 'POST', body: form });
    },

    async deleteUpload(id) {
      return request(`/uploads/${encodeURIComponent(String(id))}`, {
        method: 'DELETE',
      });
    },
  };
}
