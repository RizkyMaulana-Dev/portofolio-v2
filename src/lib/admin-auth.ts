const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';
const SESSION_KEY = 'rizky-admin-session-v1';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export interface AdminSession {
  email: string;
  createdAt: number;
  expiresAt: number;
}

export type SignInResult =
  | { ok: true }
  | { ok: false; message: string };

function isSession(value: unknown): value is AdminSession {
  if (typeof value !== 'object' || value === null) return false;
  const session = value as Partial<AdminSession>;
  return (
    typeof session.email === 'string' &&
    typeof session.createdAt === 'number' &&
    typeof session.expiresAt === 'number'
  );
}

export function signIn(email: string, password: string): SignInResult {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return {
      ok: false,
      message: 'Email atau password tidak cocok.',
    };
  }

  const now = Date.now();
  const session: AdminSession = {
    email: ADMIN_EMAIL,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };

  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    return {
      ok: false,
      message: 'Browser tidak mengizinkan penyimpanan sesi.',
    };
  }

  return { ok: true };
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(SESSION_KEY);
    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);
    if (!isSession(parsed)) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }

    if (parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function signOut(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore unavailable storage.
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}
