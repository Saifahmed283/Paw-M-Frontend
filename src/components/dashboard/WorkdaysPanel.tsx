import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArchiveRestore,
  Banknote,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  History,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useClinicStore,
  loadWorkDay,
  loadWorkDays,
  refreshClinicData,
  archiveBooking,
  archiveOrder,
} from "@/lib/clinic-store";
import { useI18n, type Lang } from "@/lib/i18n";
import { StatusBadge, PaymentMethodBadge, PaymentStatusBadge } from "./dashboard-helpers";
import { formatMoney, formatTime } from "./dashboard-format";

function formatDayName(dateISO: string, lang: Lang) {
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

function dayCountsLine(
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

function clock(iso: string, lang: Lang) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString(lang === "ar" ? "ar" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function WorkdaysPanel() {
  const { t, tOr, lang } = useI18n();
  const { workDays, workDay, settings } = useClinicStore();
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (openDay) {
      loadWorkDay(openDay).catch(() => undefined);
    } else {
      loadWorkDays().catch(() => undefined);
    }
  }, [openDay]);

  const restoreBooking = async (id: string) => {
    if (busy) return;
    setBusy(true);
    try {
      await archiveBooking(id, false);
      toast.success(t("dash.toast.restored"));
      await Promise.all([loadWorkDay(openDay!), refreshClinicData()]);
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  const restoreOrder = async (id: string) => {
    if (busy) return;
    setBusy(true);
    try {
      await archiveOrder(id, false);
      toast.success(t("dash.toast.restored"));
      await Promise.all([loadWorkDay(openDay!), refreshClinicData()]);
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  if (openDay && workDay) {
    const hasAnything =
      workDay.bookings.length > 0 ||
      workDay.orders.length > 0 ||
      workDay.payments.length > 0 ||
      workDay.logs.length > 0;
    const sessionLine = workDay.session
      ? workDay.session.endedAt
        ? t("workdays.sessionRange", {
            from: clock(workDay.session.startedAt, lang),
            to: clock(workDay.session.endedAt, lang),
          })
        : t("workdays.sessionOpen")
      : t("workdays.noSession");

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-base font-bold">
              <FolderOpen className="size-4 text-primary" />
              {formatDayName(workDay.date, lang)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{sessionLine}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>
              <span className="block text-xs text-muted-foreground">{t("workdays.revenue")}</span>
              <span className="font-bold">
                {formatMoney(
                  workDay.orders
                    .filter((o) => o.status !== "cancelled")
                    .reduce((s, o) => s + o.total, 0),
                  settings.currency,
                )}
              </span>
            </span>
            <span>
              <span className="block text-xs text-muted-foreground">
                {t("workdays.paymentsReceived")}
              </span>
              <span className="font-bold">
                {formatMoney(
                  workDay.payments
                    .filter((p) => p.status === "paid")
                    .reduce((s, p) => s + p.amount, 0),
                  settings.currency,
                )}
              </span>
            </span>
            <Button size="sm" variant="outline" onClick={() => setOpenDay(null)}>
              <ChevronLeft className="size-4 rtl:rotate-180" /> {t("workdays.back")}
            </Button>
          </div>
        </div>

        {!hasAnything && (
          <Card>
            <CardContent>
              <p className="py-6 text-sm text-muted-foreground">{t("workdays.noActivity")}</p>
            </CardContent>
          </Card>
        )}

        {workDay.bookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="size-4" /> {t("workdays.appointments")}
                <Badge variant="outline" className="text-muted-foreground">
                  {workDay.bookings.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workDay.bookings.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {r.time} · {r.ownerName}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {r.petName} ({tOr(`animal.${r.animalType}`, r.animalType)}) —{" "}
                          {r.doctorName}
                        </p>
                        {r.symptoms && (
                          <p className="mt-1 text-xs text-muted-foreground">{r.symptoms}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={r.status} />
                        {r.archived && (
                          <Badge variant="outline" className="border-transparent bg-muted">
                            {t("archive.title")}
                          </Badge>
                        )}
                        {r.archived && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            disabled={busy}
                            onClick={() => restoreBooking(r.id)}
                          >
                            <ArchiveRestore className="size-3.5" /> {t("workdays.restore")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {workDay.orders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="size-4" /> {t("workdays.sales")}
                <Badge variant="outline" className="text-muted-foreground">
                  {workDay.orders.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workDay.orders.map((o) => (
                  <div key={o.id} className="rounded-xl border border-border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {o.customerName}{" "}
                          <span className="font-mono text-[11px] font-normal text-muted-foreground">
                            {o.id}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {o.items.map((it) => `${it.name} ×${it.qty}`).join(", ")}
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {formatMoney(o.total, settings.currency)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <PaymentMethodBadge method={o.paymentMethod} />
                        <PaymentStatusBadge
                          status={o.paymentStatus === "paid" ? "paid" : "unpaid"}
                        />
                        <StatusBadge status={o.status} />
                        {o.archived && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            disabled={busy}
                            onClick={() => restoreOrder(o.id)}
                          >
                            <ArchiveRestore className="size-3.5" /> {t("workdays.restore")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {workDay.payments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Banknote className="size-4" /> {t("workdays.payments")}
                <Badge variant="outline" className="text-muted-foreground">
                  {workDay.payments.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workDay.payments.map((p) => (
                  <div key={p.id} className="rounded-xl border border-border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{p.title}</p>
                        {p.notes && <p className="mt-1 text-xs text-muted-foreground">{p.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">
                          {formatMoney(p.amount, settings.currency)}
                        </span>
                        <PaymentMethodBadge method={p.method} />
                        <PaymentStatusBadge status={p.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {workDay.logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="size-4" /> {t("workdays.activity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-44">{t("logs.time")}</TableHead>
                      <TableHead className="w-52">{t("logs.action")}</TableHead>
                      <TableHead>{t("logs.detail")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workDay.logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatTime(log.createdAt, lang)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-transparent bg-muted text-foreground"
                          >
                            {tOr(`logs.action.${log.action}`, log.action)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.detail}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FolderOpen className="size-4" /> {t("dash.workdays")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {workDays.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">{t("workdays.noDays")}</p>
        ) : (
          <div className="space-y-3">
            {workDays.map((d) => (
              <button
                key={d.date}
                onClick={() => setOpenDay(d.date)}
                className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4 text-start transition-colors hover:bg-card/60"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <CalendarDays className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold">{formatDayName(d.date, lang)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {d.session
                        ? d.session.endedAt
                          ? t("workdays.sessionRange", {
                              from: clock(d.session.startedAt, lang),
                              to: clock(d.session.endedAt, lang),
                            })
                          : t("workdays.sessionOpen")
                        : t("workdays.noSession")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <p className="text-sm font-semibold">
                      {formatMoney(d.revenue, settings.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dayCountsLine(t, d.bookings, d.orders, d.payments)}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
