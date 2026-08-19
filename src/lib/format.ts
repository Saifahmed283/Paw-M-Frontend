export function formatPrice(price: number, currency = "$"): string {
  const n = Number.isFinite(price) ? price : 0;
  return currency === "$" ? `$${n.toFixed(2)}` : `${currency} ${n.toFixed(2)}`;
}
