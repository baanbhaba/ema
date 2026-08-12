/**
 * SecureStorage — A unified, hardened browser storage layer.
 *
 * Why localStorage is problematic for auth/sensitive data:
 *   - XSS-accessible: any injected script can read all keys
 *   - Persists indefinitely: no session boundary
 *   - No server-side invalidation: stolen token stays valid client-side
 *
 * Strategy used here:
 *   1. Auth tokens/usernames → sessionStorage (tab-scoped, cleared on tab close)
 *   2. Large project source code → IndexedDB (no size limit, not in HTTP headers)
 *   3. Pipeline navigation state → Zustand in-memory store (no persistence needed)
 *   4. Auth Zustand persist adapter → sessionStorage (overrides the default localStorage)
 *
 * httpOnly cookies (ideal for auth) require a server-side session endpoint which
 * is tracked as a future enhancement. For now sessionStorage is the secure upgrade.
 */

const IDB_NAME = "alchemi-secure";
const IDB_STORE = "source_code";
const IDB_VERSION = 1;

let _db: IDBDatabase | null = null;

// ─── IndexedDB init ───────────────────────────────────────────────────────────

async function openDb(): Promise<IDBDatabase | null> {
  if (_db) return _db;
  if (typeof indexedDB === "undefined") return null;
  return new Promise((resolve) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = (e) => {
      _db = (e.target as IDBOpenDBRequest).result;
      resolve(_db);
    };
    req.onerror = () => resolve(null);
  });
}

// ─── Source code store (IndexedDB) ────────────────────────────────────────────

/** Store raw source code map for a project in IndexedDB */
export async function storeSourceCode(
  projectId: string,
  sourceMap: Record<string, string>
): Promise<void> {
  const db = await openDb();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put({ key: `src_${projectId}`, data: sourceMap });
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

/** Retrieve source code map for a project from IndexedDB */
export async function getSourceCode(
  projectId: string
): Promise<Record<string, string> | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(`src_${projectId}`);
    req.onsuccess = () => resolve(req.result?.data ?? null);
    req.onerror = () => resolve(null);
  });
}

/** Remove source code for a project from IndexedDB */
export async function removeSourceCode(projectId: string): Promise<void> {
  const db = await openDb();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(`src_${projectId}`);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

// ─── Auth session (sessionStorage) ───────────────────────────────────────────

const AUTH_TOKEN_KEY = "ema_token";
const AUTH_USERNAME_KEY = "ema_username";

export function setAuthSession(token: string, username: string): void {
  try {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    sessionStorage.setItem(AUTH_USERNAME_KEY, username);
  } catch {
    // Private browsing with no storage quota — silently ignore
  }
}

export function getAuthToken(): string | null {
  try {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getAuthUsername(): string | null {
  try {
    return sessionStorage.getItem(AUTH_USERNAME_KEY);
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  try {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USERNAME_KEY);
  } catch {
    // Ignore
  }
}

// ─── Zustand sessionStorage adapter ──────────────────────────────────────────
// Drop-in replacement for `createJSONStorage(() => localStorage)` in useAuthStore.

export const sessionStorageAdapter = {
  getItem: (name: string): string | null => {
    try {
      return sessionStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      sessionStorage.setItem(name, value);
    } catch {
      // No-op if storage quota exceeded or private mode
    }
  },
  removeItem: (name: string): void => {
    try {
      sessionStorage.removeItem(name);
    } catch {
      // No-op
    }
  },
};
