// src/lib/product-categories.ts
/**
* Product categories are stored as lowercase slugs. Historically the Excel
* import produced capitalized values ("Food", "Health") and blanks, so every
* consumer normalizes before comparing or looking up a translation.
*/
var PRODUCT_CATEGORIES = [
	"food",
	"treats",
	"toys",
	"grooming",
	"health",
	"accessories",
	"litter"
];
function categoryKey(value) {
	return String(value ?? "").trim().toLowerCase().replace(/[\s_]+/g, "-") || "uncategorized";
}
/** Distinct categories present in a product list, in display order. */
function countByCategory(products) {
	const counts = /* @__PURE__ */ new Map();
	for (const p of products) {
		const key = categoryKey(p.category);
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	return [...counts].map(([key, count]) => ({
		key,
		count
	})).sort((a, b) => {
		const ia = PRODUCT_CATEGORIES.indexOf(a.key);
		const ib = PRODUCT_CATEGORIES.indexOf(b.key);
		if (ia !== ib) return (ia < 0 ? PRODUCT_CATEGORIES.length : ia) - (ib < 0 ? PRODUCT_CATEGORIES.length : ib);
		return a.key.localeCompare(b.key);
	});
}
export { categoryKey as n, countByCategory as r, PRODUCT_CATEGORIES as t };
