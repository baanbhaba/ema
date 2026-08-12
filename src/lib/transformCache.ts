/**
 * Transformation Cache — Two-tier caching for AI-generated Rust code.
 *
 * Tier 1 (hot):  In-memory Map — zero-latency, lives for the browser session.
 * Tier 2 (warm): IndexedDB — survives page refreshes, scoped per browser.
 * Tier 3 (cold): Neon DB via /api/projects/:id/transformations — survives devices.
 *
 * The cache prevents redundant AI API calls which are both slow (2-5s) and
 * expensive. A transformation is keyed by `${projectId}::${stepId}`.
 *
 * Invalidation policy:
 *   - Explicit: call invalidateTransformation(projectId, stepId)
 *   - Source change: whenever uploadedSources changes, all transforms for
 *     that projectId should be invalidated.
 */

import { fetchApi } from "../api/client";
import { logger } from "./logger";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CachedTransformation {
  stepId: string;
  rustCode: string;
  javaCode: string;
  modelUsed: string;
  createdAt: string;
  /** True if this came from the DB (persisted) vs. local-only */
  persisted: boolean;
}

// ─── In-memory hot cache ──────────────────────────────────────────────────────

const memoryCache = new Map<string, CachedTransformation>();

function cacheKey(projectId: string, stepId: string): string {
  return `${projectId}::${stepId}`;
}

// ─── IndexedDB warm cache ─────────────────────────────────────────────────────

const IDB_NAME = "alchemi-cache";
const IDB_STORE = "transformations";
const IDB_VERSION = 1;

let _db: IDBDatabase | null = null;

async function openIdb(): Promise<IDBDatabase | null> {
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

async function idbGet(key: string): Promise<CachedTransformation | null> {
  const db = await openIdb();
  if (!db) return null;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(key);
    req.onsuccess = () => resolve(req.result?.data ?? null);
    req.onerror = () => resolve(null);
  });
}

async function idbSet(key: string, data: CachedTransformation): Promise<void> {
  const db = await openIdb();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put({ key, data });
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openIdb();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

// ─── DB (Tier 3) ──────────────────────────────────────────────────────────────

async function fetchFromDb(
  projectId: string,
  stepId: string
): Promise<CachedTransformation | null> {
  try {
    const data = await fetchApi<{
      transformedRustCode: string;
      rawJavaCode: string;
      modelUsed: string;
      createdAt: string;
    }>(`/projects/${projectId}/transformations/${encodeURIComponent(stepId)}`);

    if (!data?.transformedRustCode) return null;

    return {
      stepId,
      rustCode: data.transformedRustCode,
      javaCode: data.rawJavaCode ?? "",
      modelUsed: data.modelUsed ?? "unknown",
      createdAt: data.createdAt ?? new Date().toISOString(),
      persisted: true,
    };
  } catch {
    return null;
  }
}

async function persistToDb(
  projectId: string,
  entry: CachedTransformation
): Promise<void> {
  try {
    await fetchApi(`/projects/${projectId}/transformations`, {
      method: "POST",
      body: JSON.stringify({
        stepId: entry.stepId,
        rawJavaCode: entry.javaCode,
        transformedRustCode: entry.rustCode,
        modelUsed: entry.modelUsed,
      }),
    });
    logger.info("transformCache", "Transformation persisted to DB", {
      projectId,
      stepId: entry.stepId,
    });
  } catch (err) {
    logger.warn("transformCache", "Failed to persist transformation to DB — cached locally", {
      projectId,
      stepId: entry.stepId,
    }, err instanceof Error ? err : undefined);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get a cached transformation. Checks memory → IDB → DB in order.
 * Promotes to hotter tiers on each miss.
 */
export async function getCachedTransformation(
  projectId: string,
  stepId: string
): Promise<CachedTransformation | null> {
  const key = cacheKey(projectId, stepId);

  // Tier 1: memory
  const hot = memoryCache.get(key);
  if (hot) {
    logger.debug("transformCache", "Cache HIT (memory)", { projectId, stepId });
    return hot;
  }

  // Tier 2: IndexedDB
  const warm = await idbGet(key);
  if (warm) {
    logger.debug("transformCache", "Cache HIT (IDB)", { projectId, stepId });
    memoryCache.set(key, warm);
    return warm;
  }

  // Tier 3: DB
  const cold = await fetchFromDb(projectId, stepId);
  if (cold) {
    logger.debug("transformCache", "Cache HIT (DB)", { projectId, stepId });
    memoryCache.set(key, cold);
    await idbSet(key, cold);
    return cold;
  }

  logger.debug("transformCache", "Cache MISS", { projectId, stepId });
  return null;
}

/**
 * Store a transformation result in all three cache tiers.
 * DB persistence is fire-and-forget (non-blocking).
 */
export async function setCachedTransformation(
  projectId: string,
  entry: CachedTransformation
): Promise<void> {
  const key = cacheKey(projectId, entry.stepId);

  // Write to memory and IDB synchronously (fast)
  memoryCache.set(key, entry);
  await idbSet(key, entry);

  // Write to DB asynchronously (non-blocking)
  if (!entry.persisted) {
    persistToDb(projectId, entry).catch(() => {});
  }
}

/**
 * Get all cached step IDs for a project (from memory only — fast).
 */
export function getCachedStepIds(projectId: string): string[] {
  return [...memoryCache.keys()]
    .filter((k) => k.startsWith(`${projectId}::`))
    .map((k) => k.split("::")[1]);
}

/**
 * Invalidate a specific transformation cache entry.
 */
export async function invalidateTransformation(
  projectId: string,
  stepId: string
): Promise<void> {
  const key = cacheKey(projectId, stepId);
  memoryCache.delete(key);
  await idbDelete(key);
  logger.info("transformCache", "Transformation cache invalidated", { projectId, stepId });
}

/**
 * Invalidate ALL transformations for a project (e.g. after source code changes).
 */
export async function invalidateProjectTransformations(projectId: string): Promise<void> {
  const keys = [...memoryCache.keys()].filter((k) => k.startsWith(`${projectId}::`));
  for (const key of keys) {
    memoryCache.delete(key);
    await idbDelete(key);
  }
  logger.info("transformCache", "All transformations invalidated for project", { projectId, count: keys.length });
}

/**
 * Get all transformations for a project from the DB — used for downstream
 * pipeline consumers (Benchmark, Report, Exporter).
 */
export async function getAllProjectTransformations(
  projectId: string
): Promise<CachedTransformation[]> {
  try {
    const data = await fetchApi<{
      transformedRustCode: string;
      rawJavaCode: string;
      modelUsed: string;
      createdAt: string;
      stepId: string | null;
    }[]>(`/projects/${projectId}/transformations`);

    if (!Array.isArray(data)) return [];

    return data.map((t) => ({
      stepId: t.stepId ?? "step-unknown",
      rustCode: t.transformedRustCode,
      javaCode: t.rawJavaCode ?? "",
      modelUsed: t.modelUsed ?? "unknown",
      createdAt: t.createdAt ?? new Date().toISOString(),
      persisted: true,
    }));
  } catch {
    // Fall back to what we have in memory
    return [...memoryCache.entries()]
      .filter(([k]) => k.startsWith(`${projectId}::`))
      .map(([, v]) => v);
  }
}
