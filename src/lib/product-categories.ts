/**
 * Product categories are stored as lowercase slugs. Historically the Excel
 * import produced capitalized values ("Food", "Health") and blanks, so every
 * consumer normalizes before comparing or looking up a translation.
 */
export const PRODUCT_CATEGORIES = [
  "food",
  "treats",
  "toys",
  "grooming",
  "health",
  "accessories",
  "litter",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export function categoryKey(value: string | null | undefined): string {
  const key = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
  return key || "uncategorized";
}

export function isProductCategory(value: string): value is ProductCategory {
  return (PRODUCT_CATEGORIES as readonly string[]).includes(value);
}

export type CategoryCount = { key: string; count: number };

/** Distinct categories present in a product list, in display order. */
export function countByCategory(products: { category: string }[]): CategoryCount[] {
  const counts = new Map<string, number>();
  for (const p of products) {
    const key = categoryKey(p.category);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => {
      const ia = PRODUCT_CATEGORIES.indexOf(a.key as ProductCategory);
      const ib = PRODUCT_CATEGORIES.indexOf(b.key as ProductCategory);
      if (ia !== ib)
        return (
          (ia < 0 ? PRODUCT_CATEGORIES.length : ia) - (ib < 0 ? PRODUCT_CATEGORIES.length : ib)
        );
      return a.key.localeCompare(b.key);
    });
}
