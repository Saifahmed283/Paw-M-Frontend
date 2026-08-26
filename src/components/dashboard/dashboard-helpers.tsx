import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useI18n, type Lang } from "@/lib/i18n";
import type { PaymentMethod, Status } from "@/lib/clinic-store";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: Status }) {
  const { t } = useI18n();
  const styles: Record<Status, string> = {
    pending: "bg-amber-500/15 text-amber-600",
    confirmed: "bg-success/15 text-success",
    completed: "bg-primary/15 text-primary",
    cancelled: "bg-muted text-muted-foreground line-through",
  };
  return (
    <Badge variant="outline" className={cn("border-transparent", styles[status])}>
      {t(`dash.status.${status}`)}
    </Badge>
  );
}

export const STATUS_OPTIONS: { value: Status | "all"; key: string }[] = [
  { value: "all", key: "dash.filterAll" },
  { value: "pending", key: "dash.filterPending" },
  { value: "confirmed", key: "dash.filterConfirmed" },
  { value: "completed", key: "dash.filterCompleted" },
  { value: "cancelled", key: "dash.filterCancelled" },
];

export function formatDate(dateISO: string, lang: Lang) {
  if (!dateISO) return "—";
  const d = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateISO;
  return d.toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(iso: string, lang: Lang) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(lang === "ar" ? "ar" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDayName(dateISO: string, lang: Lang) {
  if (!dateISO) return "—";
  const d = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateISO;
  return d.toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function dayCountsLine(
  t: (k: string, v?: Record<string, string>) => string,
  bookings: number,
  orders: number,
  payments: number,
) {
  const part = (n: number, one: string, many: string) =>
    n === 1 ? t(one) : t(many, { n: String(n) });
  return [
    part(bookings, "workdays.counts.apptOne", "workdays.counts.apptMany"),
    part(orders, "workdays.counts.orderOne", "workdays.counts.orderMany"),
    part(payments, "workdays.counts.payOne", "workdays.counts.payMany"),
  ].join(" · ");
}

export function clock(iso: string, lang: Lang) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString(lang === "ar" ? "ar" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function formatMoney(amount: number, currency: string) {
  return currency === "$" ? `$${amount.toFixed(2)}` : `${currency} ${amount.toFixed(2)}`;
}

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  const { t } = useI18n();
  const styles: Record<PaymentMethod, string> = {
    cash: "bg-amber-500/15 text-amber-600",
    fawry: "bg-primary/15 text-primary",
    instapay: "bg-violet-500/15 text-violet-600",
  };
  return (
    <Badge variant="outline" className={cn("border-transparent", styles[method])}>
      {t(`checkout.method.${method}.short`)}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: "unpaid" | "paid" }) {
  const { t } = useI18n();
  return status === "paid" ? (
    <Badge className="border-transparent bg-success/15 text-success">{t("pay.paid")}</Badge>
  ) : (
    <Badge className="border-transparent bg-muted text-muted-foreground">{t("pay.unpaid")}</Badge>
  );
}
