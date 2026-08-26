import { useSyncExternalStore } from "react";

import { storageGet, storageRemove, storageSet } from "@/lib/storage";
import type { Product } from "@/lib/clinic-store";

const CART_KEY = "paw-m:cart";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
};

type Listener = () => void;

function readCart(): CartItem[] {
  const raw = storageGet("local", CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed.filter((i) => i && typeof i.id === "string") : [];
  } catch {
    return [];
  }
}

let state: CartItem[] = readCart();
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

function commit(next: CartItem[]) {
  state = next;
  storageSet("local", CART_KEY, JSON.stringify(next));
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartItem[] {
  return state;
}

/**
 * The server always renders an empty cart, so hydration must use an empty
 * snapshot too — otherwise a cart that persisted in localStorage would make
 * the client's first render disagree with the server HTML.
 */
const serverSnapshot: CartItem[] = [];

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}

export function useCartCount() {
  return useSyncExternalStore(
    subscribe,
    () => state.reduce((n, i) => n + i.qty, 0),
    () => 0,
  );
}

export function addToCart(product: Product, qty = 1) {
  const safeQty = Math.max(1, qty);
  const existing = state.find((i) => i.id === product.id);
  if (existing) {
    commit(
      state.map((i) =>
        i.id === product.id ? { ...i, qty: Math.min(i.qty + safeQty, Math.max(1, i.stock)) } : i,
      ),
    );
  } else {
    commit([
      ...state,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: safeQty,
        stock: product.stock,
      },
    ]);
  }
}

export function setCartQty(id: string, qty: number) {
  commit(
    state.map((i) =>
      i.id === id ? { ...i, qty: Math.min(Math.max(1, qty), Math.max(1, i.stock)) } : i,
    ),
  );
}

export function removeFromCart(id: string) {
  commit(state.filter((i) => i.id !== id));
}

export function clearCart() {
  commit([]);
  storageRemove("local", CART_KEY);
}

export function cartCount(): number {
  return state.reduce((n, i) => n + i.qty, 0);
}

export function cartTotal(): number {
  return state.reduce((n, i) => n + i.qty * i.price, 0);
}

export function getCart(): CartItem[] {
  return state;
}
