import type { OrderItem, PaymentMethod, Product } from "@/lib/clinic-store";

export type CartItem = OrderItem & {
  productId: string;
  stock: number;
  image: string;
  /** Original catalog unit price. */
  originalPrice: number;
};

export type DiscountType = "none" | "percent" | "fixed";

export type ItemDiscount = {
  type: DiscountType;
  value: number;
};

export type OrderDiscount = {
  type: DiscountType;
  value: number;
  label?: string;
};

export type HeldSale = {
  id: string;
  label: string;
  heldAt: number;
  cart: CartItem[];
  itemDiscounts: Record<string, ItemDiscount>;
  orderDiscount: OrderDiscount;
  customer: CustomerInfo;
  paymentMethod: PaymentMethod;
};

export type CustomerInfo = {
  name: string;
  phone: string;
};

export type SplitPaymentAllocation = {
  method: PaymentMethod;
  amount: number;
};

export function itemEffectivePrice(
  originalPrice: number,
  discount: ItemDiscount | undefined,
): number {
  const base = originalPrice;
  const d = discount && discount.type !== "none" ? discount : { type: "none" as const, value: 0 };
  if (d.type === "percent") {
    const pct = Math.min(100, Math.max(0, d.value));
    return Math.max(0, base * (1 - pct / 100));
  }
  if (d.type === "fixed") {
    const fixed = Math.min(Math.max(0, d.value), base);
    return Math.max(0, base - fixed);
  }
  return base;
}

export function lineTotal(cartItem: CartItem, discount: ItemDiscount | undefined): number {
  return itemEffectivePrice(cartItem.originalPrice, discount) * cartItem.qty;
}

export function orderDiscountAmount(
  subtotalAfterItemDiscounts: number,
  orderDiscount: OrderDiscount,
): number {
  const d = orderDiscount && orderDiscount.type !== "none" ? orderDiscount : null;
  if (!d) return 0;
  if (d.type === "percent") {
    const pct = Math.min(100, Math.max(0, d.value));
    return subtotalAfterItemDiscounts * (pct / 100);
  }
  if (d.type === "fixed") {
    return Math.min(Math.max(0, d.value), subtotalAfterItemDiscounts);
  }
  return 0;
}

/** Stable, readable id for a held or transient sale. */
export function saleId(): string {
  return `SALE-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

export function productKey(p: Product): string {
  return p.id;
}
