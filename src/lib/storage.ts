"use client";

import { useCallback, useEffect, useState } from "react";

export const STORAGE_KEY = "semtm0051-coursework-align-v1";

export type Status = "open" | "scored" | "peeked";

export type Attempt = {
  status: Status;
  values: Record<string, string>;
  order: string[];
};

export type CursorKey = "words" | "rules" | "torch" | "path";

export type Store = {
  attempts: Record<string, Attempt>;
  cursor: Record<CursorKey, number>;
};

export const emptyAttempt = (): Attempt => ({
  status: "open",
  values: {},
  order: [],
});

export const emptyStore = (): Store => ({
  attempts: {},
  cursor: { words: 0, rules: 0, torch: 0, path: 0 },
});

function sanitize(raw: unknown): Store {
  const base = emptyStore();
  if (!raw || typeof raw !== "object") return base;
  const data = raw as Partial<Store>;
  if (data.attempts && typeof data.attempts === "object") {
    for (const [id, attempt] of Object.entries(data.attempts)) {
      if (!attempt || typeof attempt !== "object") continue;
      const row = attempt as Partial<Attempt>;
      const status: Status =
        row.status === "scored" || row.status === "peeked" ? row.status : "open";
      base.attempts[id] = {
        status,
        values: row.values && typeof row.values === "object" ? row.values : {},
        order: Array.isArray(row.order) ? row.order.filter((item) => typeof item === "string") : [],
      };
    }
  }
  if (data.cursor) {
    for (const key of ["words", "rules", "torch", "path"] as const) {
      const n = data.cursor[key];
      if (typeof n === "number" && n >= 0) base.cursor[key] = n;
    }
  }
  return base;
}

export function readStore(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const text = window.localStorage.getItem(STORAGE_KEY);
    if (!text) return emptyStore();
    return sanitize(JSON.parse(text));
  } catch {
    return emptyStore();
  }
}

const listeners = new Set<() => void>();

export function writeStore(store: Store) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  listeners.forEach((listener) => listener());
}

export function subscribeStore(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function updateStore(fn: (draft: Store) => void) {
  const next = readStore();
  fn(next);
  writeStore(next);
}

export function useStore() {
  const [store, setStore] = useState<Store>(emptyStore);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setStore(readStore());
    setReady(true);
    return subscribeStore(() => setStore(readStore()));
  }, []);
  const update = useCallback((fn: (draft: Store) => void) => {
    updateStore(fn);
  }, []);
  return { store, ready, update };
}
