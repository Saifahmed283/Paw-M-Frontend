import { useSyncExternalStore } from "react";

/**
 * Tiny external store for shared chrome. The site header and the mobile
 * ActionDock both need to open the same CartDrawer — this keeps a single
 * drawer instance instead of two competing ones.
 */
let cartOpen = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function openCart() {
  if (cartOpen) return;
  cartOpen = true;
  emit();
}

export function closeCart() {
  if (!cartOpen) return;
  cartOpen = false;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Server snapshot is always closed so hydration never mismatches. */
export function useCartOpen() {
  return useSyncExternalStore(
    subscribe,
    () => cartOpen,
    () => false,
  );
}
