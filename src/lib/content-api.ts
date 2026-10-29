import type { SiteContent, SiteSection } from '@/lib/site-content';

export interface RemoteSection {
  content: unknown;
  updatedAt: string;
}

export interface RemoteDraft {
  content: unknown;
  savedAt: string;
}

export interface UploadedFile {
  id: number;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type AstroEnv = {
  PUBLIC_API_URL?: string;
};

const env = (import.meta as ImportMeta & { env?: AstroEnv }).env;
export const API_BASE = (env?.PUBLIC_API_URL?.replace(/\/$/, '') || '/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !(init.body instanceof FormData) && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
  const text = await response.text();
  let body: unknown = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const message =
      typeof body === 'object' && body !== null && 'error' in body
        ? String((body as { error?: { message?: string } }).error?.message ?? '')
        : '';
    throw new ApiError(message || `Request failed (${response.status}).`, response.status);
  }

  return body as T;
}

export async function fetchRemoteContent(): Promise<
  Partial<Record<SiteSection, RemoteSection>> | null
> {
  try {
    const data = await request<{ sections?: Partial<Record<SiteSection, RemoteSection>> }>(
      '/content'
    );
    return data.sections ?? {};
  } catch {
    return null;
  }
}

export async function saveRemoteSection(section: SiteSection, content: unknown): Promise<boolean> {
  try {
    await request(`/content/${section}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function saveRemoteContent(content: SiteContent): Promise<boolean> {
  try {
    await request('/content', {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function resetRemoteContent(): Promise<boolean> {
  try {
    await request('/content', { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

export async function fetchRemoteDrafts(): Promise<
  Partial<Record<SiteSection, RemoteDraft>> | null
> {
  try {
    const data = await request<{ drafts?: Partial<Record<SiteSection, RemoteDraft>> }>('/drafts');
    return data.drafts ?? {};
  } catch {
    return null;
  }
}

export async function saveRemoteDraft(section: SiteSection, content: unknown): Promise<boolean> {
  try {
    await request(`/drafts/${section}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function clearRemoteDraft(section: SiteSection): Promise<boolean> {
  try {
    await request(`/drafts/${section}`, { method: 'DELETE' });
    return true;
  } catch {
    return false;
  }
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  const form = new FormData();
  form.append('file', file);

  const data = await request<{ upload: UploadedFile }>('/uploads', {
    method: 'POST',
    body: form,
  });

  return data.upload;
}

export async function listUploads(): Promise<UploadedFile[]> {
  const data = await request<{ uploads: UploadedFile[] }>('/uploads');
  return data.uploads;
}

export async function removeUpload(id: number): Promise<boolean> {
  await request(`/uploads/${id}`, { method: 'DELETE' });
  return true;
}
