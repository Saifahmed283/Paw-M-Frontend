import type { Lang } from "@/lib/i18n";
import type { Status } from "@/lib/clinic-store";

export const STATUS_OPTIONS: { value: Status | "all"; key: string }[] = [
  { value: "all", key: "dash.filterAll" },
  { value: "pending", key: "dash.filterPending" },
  { value: "confirmed", key: "dash.filterConfirmed" },
  { value: "completed", key: "dash.filterCompleted" },
  { value: "cancelled", key: "dash.filterCancelled" },
];

/** Format a date as YYYY-MM-DD in the user's local timezone (never UTC). */
export function localISODate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** Current calendar date in the user's local timezone (YYYY-MM-DD). */
export function localTodayISO(): string {
  return localISODate(new Date());
}

// The backend keys workdays and active sessions by the clinic's operational day
// in Africa/Cairo, not by each browser's timezone. formatToParts guarantees a
// YYYY-MM-DD key even on runtimes where en-CA formats with a different separator.
const CLINIC_DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Africa/Cairo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Current calendar date in Africa/Cairo (YYYY-MM-DD) for day folders and shifts. */
export function clinicTodayISO(): string {
  const parts = CLINIC_DATE_FORMATTER.formatToParts(new Date());
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function formatDate(dateISO: string, lang: Lang) {
  if (!dateISO) return "—";
  // Accept both date-only (YYYY-MM-DD) and full ISO timestamps.
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(dateISO) ? `${dateISO}T00:00:00` : dateISO;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return dateISO;
  return d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(iso: string, lang: Lang) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMoney(amount: number | null | undefined, currency: string) {
  const safe = Number.isFinite(amount) ? Number(amount) : 0;
  return currency === "$" ? `$${safe.toFixed(2)}` : `${currency} ${safe.toFixed(2)}`;
}
