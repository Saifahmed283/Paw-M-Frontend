import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArchiveRestore,
  Banknote,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FolderOpen,
  History,
  Package,
  Users,
  Wallet,
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
import { PaginationBar, useGrid } from "@/components/dash-grid";
import {
  useClinicStore,
  loadWorkDay,
  loadWorkDays,
  refreshClinicData,
  archiveBooking,
  archiveOrder,
  type WorkDayDetail,
  type WorkDayFinance,
  type WorkDayStaff,
  type WorkDaySummary,
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

function StaffShiftCard({
  member,
  currency,
  lang,
}: {
  member: WorkDayStaff;
  currency: string;
  lang: Lang;
}) {
  const { t, tOr } = useI18n();
  const logs = useGrid(member.logs, "", [], 10);

  return (
    <Card data-testid={`workday-staff-${member.id}`}>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-sm">
          <Users className="size-4 text-primary" />
          {member.employee?.fullName || t("workdays.noStaff")}
          <Badge variant="outline" className="text-muted-foreground">
            {tOr(`staff.role.${member.employee?.role}`, member.employee?.role ?? "")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span>
            {member.endedAt
              ? t("workdays.sessionRange", {
                  from: clock(member.startedAt, lang),
                  to: clock(member.endedAt, lang),
                })
              : t("workdays.sessionOpen")}
          </span>
          <span>
            {t("workdays.hours")}: <b className="text-foreground">{member.hours.toFixed(2)}</b>
          </span>
          <span>
            {t("workdays.ordersHandled")}: <b className="text-foreground">{member.ordersCount}</b>
          </span>
          <span>
            {t("workdays.revenue")}:{" "}
            <b className="text-foreground">{formatMoney(member.revenue, currency)}</b>
          </span>
          <span>
            {t("workdays.actionsDone")}: <b className="text-foreground">{member.activityCount}</b>
          </span>
        </div>
        {member.logs.length > 0 && (
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
                {logs.slice.map((log) => (
                  <TableRow key={log.id} data-testid={`workday-staff-log-${log.id}`}>
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
                    <TableCell className="text-sm text-muted-foreground">{log.detail}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationBar
              total={logs.total}
              page={logs.page}
              pageSize={logs.pageSize}
              pageCount={logs.pageCount}
              onPage={logs.setPage}
              onPageSize={logs.setPageSize}
              testId={`workday-staff-${member.id}-logs`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FinanceCard({ finance, currency }: { finance: WorkDayFinance; currency: string }) {
  const { t, tOr } = useI18n();
  const items = useGrid(finance.items, "", [], 10);

  const methodLabel = (method: string) => tOr(`checkout.method.${method}.short`, method);

  return (
    <Card data-testid="workday-finance">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Wallet className="size-4 text-primary" /> {t("workdays.finance")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {finance.byMethod.map((row) => (
            <div
              key={row.method}
              className="rounded-xl border border-border p-4"
              data-testid={`workday-finance-${row.method}`}
            >
              <p className="text-xs text-muted-foreground">{methodLabel(row.method)}</p>
              <p className="mt-1 text-lg font-bold">{formatMoney(row.collected, currency)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("clients.outstanding")}: {formatMoney(row.pending, currency)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("workdays.payments")}: {formatMoney(row.refunded, currency)}
              </p>
            </div>
          ))}
          <div className="rounded-xl border border-border p-4" data-testid="workday-finance-drawer">
            <p className="text-xs text-muted-foreground">{t("workdays.cashDrawer")}</p>
            <p className="mt-1 text-lg font-bold">
              {formatMoney(finance.cashDrawer.counted ?? finance.cashDrawer.expected, currency)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("workdays.expected")}: {formatMoney(finance.cashDrawer.expected, currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("workdays.variance")}:{" "}
              {finance.cashDrawer.variance === null
                ? "—"
                : formatMoney(finance.cashDrawer.variance, currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("workdays.opening")}: {formatMoney(finance.openingAmount, currency)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-4 text-sm">
          <span>
            <span className="block text-xs text-muted-foreground">{t("workdays.sales")}</span>
            <b>{formatMoney(finance.totals.sales, currency)}</b>
          </span>
          <span>
            <span className="block text-xs text-muted-foreground">{t("workdays.orders")}</span>
            <b>{formatMoney(finance.totals.orders, currency)}</b>
          </span>
          <span>
            <span className="block text-xs text-muted-foreground">
              {t("workdays.productLines")}
            </span>
            <b>{formatMoney(finance.totals.products, currency)}</b>
          </span>
          <span>
            <span className="block text-xs text-muted-foreground">{t("workdays.payments")}</span>
            <b>{formatMoney(finance.totals.payments, currency)}</b>
          </span>
          <span>
            <span className="block text-xs text-muted-foreground">{t("clients.outstanding")}</span>
            <b>{formatMoney(finance.totals.pending, currency)}</b>
          </span>
          <span>
            <span className="block text-xs text-muted-foreground">{t("workdays.revenue")}</span>
            <b>{formatMoney(finance.totals.refunded, currency)}</b>
          </span>
        </div>

        {finance.byKind.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {finance.byKind.map((row) => (
              <Badge key={row.kind} variant="outline" className="text-muted-foreground">
                {tOr(`payments.kind.${row.kind}`, row.kind)}: {row.count} ·{" "}
                {formatMoney(row.collected, currency)}
              </Badge>
            ))}
          </div>
        )}

        {finance.items.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("workdays.category")}</TableHead>
                  <TableHead>{t("dash.name")}</TableHead>
                  <TableHead className="text-end">{t("workdays.count")}</TableHead>
                  <TableHead className="text-end">{t("workdays.amount")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.slice.map((item) => (
                  <TableRow key={`${item.kind}:${item.label}`} data-testid="workday-finance-item">
                    <TableCell>{tOr(`payments.item.${item.kind}`, item.kind)}</TableCell>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-end">{item.count}</TableCell>
                    <TableCell className="text-end font-semibold">
                      {formatMoney(item.amount, currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationBar
              total={items.total}
              page={items.page}
              pageSize={items.pageSize}
              pageCount={items.pageCount}
              onPage={items.setPage}
              onPageSize={items.setPageSize}
              testId="workday-finance-items"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WorkDayDetailView({
  workDay,
  currency,
  busy,
  onBack,
  onRestoreBooking,
  onRestoreOrder,
}: {
  workDay: WorkDayDetail;
  currency: string;
  busy: boolean;
  onBack: () => void;
  onRestoreBooking: (id: string) => void;
  onRestoreOrder: (id: string) => void;
}) {
  const { t, tOr, lang } = useI18n();
  const bookings = useGrid(workDay.bookings, "", [], 10);
  const orders = useGrid(workDay.orders, "", [], 10);
  const payments = useGrid(workDay.payments, "", [], 10);
  const logs = useGrid(workDay.logs, "", [], 10);

  const hasAnything =
    workDay.bookings.length > 0 ||
    workDay.orders.length > 0 ||
    workDay.payments.length > 0 ||
    workDay.logs.length > 0;

  const latest = workDay.sessions?.at(-1) ?? workDay.session;
  const sessionLine = latest
    ? latest.endedAt
      ? t("workdays.sessionRange", {
          from: clock(latest.startedAt, lang),
          to: clock(latest.endedAt, lang),
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
                  .reduce((sum, o) => sum + o.total, 0),
                currency,
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
                  .reduce((sum, p) => sum + p.amount, 0),
                currency,
              )}
            </span>
          </span>
          <Button size="sm" variant="outline" onClick={onBack}>
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

      {workDay.finance && <FinanceCard finance={workDay.finance} currency={currency} />}

      <Card data-testid="workday-staff">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock3 className="size-4" /> {t("workdays.staff")}
            <Badge variant="outline" className="text-muted-foreground">
              {workDay.staff?.length ?? 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(workDay.staff ?? []).length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">{t("workdays.noStaff")}</p>
          ) : (
            (workDay.staff ?? []).map((member) => (
              <StaffShiftCard key={member.id} member={member} currency={currency} lang={lang} />
            ))
          )}
        </CardContent>
      </Card>

      {workDay.bookings.length > 0 && (
        <Card data-testid="workday-appointments">
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
              {bookings.slice.map((r) => (
                <div
                  key={r.id}
                  data-testid={`workday-booking-${r.id}`}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {r.time} · {r.ownerName}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {r.petName} ({tOr(`animal.${r.animalType}`, r.animalType)}) — {r.doctorName}
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
                          onClick={() => onRestoreBooking(r.id)}
                        >
                          <ArchiveRestore className="size-3.5" /> {t("workdays.restore")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <PaginationBar
              total={bookings.total}
              page={bookings.page}
              pageSize={bookings.pageSize}
              pageCount={bookings.pageCount}
              onPage={bookings.setPage}
              onPageSize={bookings.setPageSize}
              testId="workday-appointments"
            />
          </CardContent>
        </Card>
      )}

      {workDay.orders.length > 0 && (
        <Card data-testid="workday-sales">
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
              {orders.slice.map((o) => (
                <div
                  key={o.id}
                  data-testid={`workday-order-${o.id}`}
                  className="rounded-xl border border-border p-4"
                >
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
                      <p className="mt-1 text-sm font-bold">{formatMoney(o.total, currency)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <PaymentMethodBadge method={o.paymentMethod} />
                      <PaymentStatusBadge status={o.paymentStatus} />
                      <StatusBadge status={o.status} />
                      {o.archived && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7"
                          disabled={busy}
                          onClick={() => onRestoreOrder(o.id)}
                        >
                          <ArchiveRestore className="size-3.5" /> {t("workdays.restore")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <PaginationBar
              total={orders.total}
              page={orders.page}
              pageSize={orders.pageSize}
              pageCount={orders.pageCount}
              onPage={orders.setPage}
              onPageSize={orders.setPageSize}
              testId="workday-sales"
            />
          </CardContent>
        </Card>
      )}

      {workDay.payments.length > 0 && (
        <Card data-testid="workday-payments">
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
              {payments.slice.map((p) => (
                <div
                  key={p.id}
                  data-testid={`workday-payment-${p.id}`}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{p.title}</p>
                      {p.notes && <p className="mt-1 text-xs text-muted-foreground">{p.notes}</p>}
                      {p.items && p.items.length > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {p.items.map((item) => item.label).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{formatMoney(p.amount, currency)}</span>
                      <PaymentMethodBadge method={p.method} />
                      <PaymentStatusBadge status={p.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <PaginationBar
              total={payments.total}
              page={payments.page}
              pageSize={payments.pageSize}
              pageCount={payments.pageCount}
              onPage={payments.setPage}
              onPageSize={payments.setPageSize}
              testId="workday-payments"
            />
          </CardContent>
        </Card>
      )}

      {workDay.logs.length > 0 && (
        <Card data-testid="workday-activity">
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
                  {logs.slice.map((log) => (
                    <TableRow key={log.id} data-testid={`workday-log-${log.id}`}>
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
                      <TableCell className="text-sm text-muted-foreground">{log.detail}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <PaginationBar
                total={logs.total}
                page={logs.page}
                pageSize={logs.pageSize}
                pageCount={logs.pageCount}
                onPage={logs.setPage}
                onPageSize={logs.setPageSize}
                testId="workday-activity"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function WorkDayFolders({
  workDays,
  currency,
  onOpen,
}: {
  workDays: WorkDaySummary[];
  currency: string;
  onOpen: (date: string) => void;
}) {
  const { t, lang } = useI18n();
  const grid = useGrid(workDays, "", [], 10);

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
          <>
            <div className="space-y-3">
              {grid.slice.map((d) => (
                <button
                  key={d.date}
                  data-testid={`workday-folder-${d.date}`}
                  onClick={() => onOpen(d.date)}
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
                      <p className="text-sm font-semibold">{formatMoney(d.revenue, currency)}</p>
                      <p className="text-xs text-muted-foreground">
                        {dayCountsLine(t, d.bookings, d.orders, d.payments)}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
                  </div>
                </button>
              ))}
            </div>
            <PaginationBar
              total={grid.total}
              page={grid.page}
              pageSize={grid.pageSize}
              pageCount={grid.pageCount}
              onPage={grid.setPage}
              onPageSize={grid.setPageSize}
              testId="workday-folders"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function WorkdaysPanel() {
  const { t } = useI18n();
  const { workDays, workDay, settings } = useClinicStore();
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);

  useEffect(() => {
    let active = true;
    if (openDay) {
      setLoadingDay(true);
      loadWorkDay(openDay)
        .catch(() => undefined)
        .finally(() => {
          if (active) setLoadingDay(false);
        });
    } else {
      loadWorkDays().catch(() => undefined);
    }
    return () => {
      active = false;
    };
  }, [openDay]);

  const reloadCurrentDay = async () => {
    await Promise.all([openDay ? loadWorkDay(openDay) : loadWorkDays(), refreshClinicData()]);
  };

  const restoreBooking = async (id: string) => {
    if (busy) return;
    setBusy(true);
    try {
      await archiveBooking(id, false);
      toast.success(t("dash.toast.restored"));
      await reloadCurrentDay();
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
      await reloadCurrentDay();
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  if (openDay) {
    if (loadingDay || !workDay || workDay.date !== openDay) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderOpen className="size-4" /> {t("dash.workdays")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="py-6 text-center text-sm text-muted-foreground">{t("dash.loading")}</p>
          </CardContent>
        </Card>
      );
    }
    return (
      <WorkDayDetailView
        key={openDay}
        workDay={workDay}
        currency={settings.currency}
        busy={busy}
        onBack={() => setOpenDay(null)}
        onRestoreBooking={restoreBooking}
        onRestoreOrder={restoreOrder}
      />
    );
  }

  return (
    <WorkDayFolders
      workDays={workDays}
      currency={settings.currency}
      onOpen={(date) => setOpenDay(date)}
    />
  );
}
