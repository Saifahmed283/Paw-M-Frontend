import { describe, it, expect, vi, beforeEach } from "vitest";
import { StorageKey } from "./storage";

vi.mock("./storage", () => {
  const store: Record<string, string> = {};
  return {
    storageGet: vi.fn((_scope: string, key: string) => store[key] ?? null),
    storageSet: vi.fn((_scope: string, key: string, value: string) => {
      store[key] = value;
    }),
    storageRemove: vi.fn((_scope: string, key: string) => {
      delete store[key];
    }),
    StorageKey: {},
  };
});

import {
  addToCart,
  setCartQty,
  removeFromCart,
  clearCart,
  cartCount,
  cartTotal,
  getCart,
} from "./cart-store";
import type { Product } from "./clinic-store";

const mockProduct: Product = {
  id: "prod-1",
  name: "Shampoo",
  price: 25,
  image: "img.png",
  stock: 10,
  category: "grooming",
  description: "test",
  sku: "SKU-001",
  skuPrefix: "GRO",
  lowStockThreshold: 3,
  createdAt: "2026-01-01",
};

const mockProduct2: Product = {
  ...mockProduct,
  id: "prod-2",
  name: "Conditioner",
  price: 30,
};

describe("cart-store", () => {
  beforeEach(() => {
    clearCart();
  });

  it("starts empty", () => {
    expect(getCart()).toEqual([]);
    expect(cartCount()).toBe(0);
    expect(cartTotal()).toBe(0);
  });

  it("adds a new product", () => {
    addToCart(mockProduct, 2);
    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe("prod-1");
    expect(cart[0].qty).toBe(2);
    expect(cartCount()).toBe(2);
    expect(cartTotal()).toBe(50);
  });

  it("increments quantity for existing product", () => {
    addToCart(mockProduct, 1);
    addToCart(mockProduct, 3);
    expect(getCart()).toHaveLength(1);
    expect(getCart()[0].qty).toBe(4);
  });

  it("caps quantity at stock", () => {
    addToCart(mockProduct, 8);
    addToCart(mockProduct, 5);
    expect(getCart()[0].qty).toBe(10);
  });

  it("does not allow qty below 1", () => {
    addToCart(mockProduct, 0);
    expect(getCart()[0].qty).toBe(1);
  });

  it("sets quantity for a product", () => {
    addToCart(mockProduct, 1);
    setCartQty("prod-1", 5);
    expect(getCart()[0].qty).toBe(5);
  });

  it("caps setCartQty at stock", () => {
    addToCart(mockProduct, 1);
    setCartQty("prod-1", 99);
    expect(getCart()[0].qty).toBe(10);
  });

  it("floors setCartQty at 1", () => {
    addToCart(mockProduct, 1);
    setCartQty("prod-1", -5);
    expect(getCart()[0].qty).toBe(1);
  });

  it("removes a product", () => {
    addToCart(mockProduct, 1);
    addToCart(mockProduct2, 1);
    removeFromCart("prod-1");
    expect(getCart()).toHaveLength(1);
    expect(getCart()[0].id).toBe("prod-2");
  });

  it("clears the entire cart", () => {
    addToCart(mockProduct, 1);
    addToCart(mockProduct2, 1);
    clearCart();
    expect(getCart()).toEqual([]);
    expect(cartCount()).toBe(0);
    expect(cartTotal()).toBe(0);
  });

  it("calculates total across multiple items", () => {
    addToCart(mockProduct, 2);
    addToCart(mockProduct2, 3);
    expect(cartTotal()).toBe(140);
  });
});
