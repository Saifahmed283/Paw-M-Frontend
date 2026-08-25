export function formatPrice(price: number, currency = "$"): string {
  const n = Number.isFinite(price) ? price : 0;
  return currency === "$" ? `$${n.toFixed(2)}` : `${currency} ${n.toFixed(2)}`;
}

export function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
