import { useSyncExternalStore } from "react";

import { storageGet, storageRemove, storageSet } from "@/lib/storage";

const WISHLIST_KEY = "paw-m:wishlist";

type Listener = () => void;

function readWishlist(): string[] {
  const raw = storageGet("local", WISHLIST_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

let state: string[] = readWishlist();
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

function commit(next: string[]) {
  state = next;
  storageSet("local", WISHLIST_KEY, JSON.stringify(next));
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string[] {
  return state;
}

export function useWishlist() {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}

export function useIsWished(id: string) {
  return useSyncExternalStore(
    subscribe,
    () => state.includes(id),
    () => false,
  );
}

/**
 * The server never has a wishlist, so hydration must assume empty — otherwise
 * localStorage items would make the client's first render disagree with the
 * server HTML.
 */
const serverSnapshot: string[] = [];

export function isWished(id: string): boolean {
  return state.includes(id);
}

export function toggleWishlist(id: string): boolean {
  const wished = isWished(id);
  commit(wished ? state.filter((x) => x !== id) : [...state, id]);
  return !wished;
}

export function clearWishlist() {
  commit([]);
  storageRemove("local", WISHLIST_KEY);
}
