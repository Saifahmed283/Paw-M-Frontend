export function formatPrice(price: number, currency = "EGP"): string {
  const n = Number.isFinite(price) ? price : 0;
  return currency === "$" ? `$${n.toFixed(2)}` : `${currency} ${n.toFixed(2)}`;
}

export function formatDate(value: string | Date, locale?: string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(locale || "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
