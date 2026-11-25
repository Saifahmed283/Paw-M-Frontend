import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  ArchiveRestore,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FolderOpen,
  History,
  Package,
  Send,
  Users,
  Wallet,
  XCircle,
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
import { localizedApiErrorMessage } from "@/lib/api";
import { currentRole } from "@/lib/auth";
import {
  approveCashWithdrawal,
  getCashWithdrawals,
  rejectCashWithdrawal,
  requestCashWithdrawal,
  type CashWithdrawalDay,
} from "@/lib/cash-withdrawals";
import {
  useClinicStore,
  loadWorkDay,
  loadWorkDays,
  refreshClinicData,
  archiveBooking,
  archiveOrder,
  type Order,
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

function clock(iso: string | null | undefined, lang: Lang) {
  if (!iso) return "—";
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
  showLogs,
}: {
  member: WorkDayStaff;
  currency: string;
  lang: Lang;
  showLogs: boolean;
}) {
  const { t, tOr } = useI18n();
  const logs = useGrid(member.logs ?? [], "", [], 10);

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
            {member.lastCheckOut
              ? t("workdays.sessionRange", {
                  from: clock(member.firstCheckIn ?? member.startedAt, lang),
                  to: clock(member.lastCheckOut, lang),
                })
              : t("workdays.sessionOpen")}
          </span>
          <span>
            {t("workdays.shifts")}: <b className="text-foreground">{member.shiftCount ?? 1}</b>
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
            {t("workdays.myCash")}:{" "}
            <b className="text-foreground">{formatMoney(member.cashCollected ?? 0, currency)}</b>
          </span>
          <span>
            {t("workdays.actionsDone")}: <b className="text-foreground">{member.activityCount}</b>
          </span>
        </div>
        {showLogs && logs.total > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-44">{t("logs.time")}</TableHead>
                  <TableHead className="w-52">{t("logs.action")}</TableHead>
                  <TableHead>{t("logs.detail")}</TableHead>
                  <TableHead className="w-20 text-end">{t("workdays.count")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.slice.map((entry) => (
                  <TableRow key={entry.id} data-testid={`workday-staff-log-${entry.id}`}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatTime(entry.createdAt, lang)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-transparent bg-muted text-foreground"
                      >
                        {tOr(`logs.action.${entry.action}`, entry.action)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{entry.detail}</TableCell>
                    <TableCell className="text-end text-xs font-semibold">
                      {t("workdays.timesRepeated", { n: String(entry.count) })}
                    </TableCell>
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
                {t("workdays.pending")}: {formatMoney(row.pending, currency)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("workdays.refunded")}: {formatMoney(row.refunded, currency)}
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
            <span className="block text-xs text-muted-foreground">{t("workdays.pending")}</span>
            <b>{formatMoney(finance.totals.pending, currency)}</b>
          </span>
          <span>
            <span className="block text-xs text-muted-foreground">{t("workdays.refunded")}</span>
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

function StaffSummaryCard({
  workDay,
  currency,
  lang,
}: {
  workDay: WorkDayDetail;
  currency: string;
  lang: Lang;
}) {
  const { t } = useI18n();
  const member = workDay.staff?.[0];
  const cash = workDay.finance?.byMethod.find((row) => row.method === "cash")?.collected ?? 0;
  const cells = [
    { label: t("workdays.hours"), value: (member?.hours ?? 0).toFixed(2) },
    { label: t("workdays.firstCheckIn"), value: clock(member?.firstCheckIn, lang) },
    { label: t("workdays.lastCheckOut"), value: clock(member?.lastCheckOut, lang) },
    { label: t("workdays.shifts"), value: String(member?.shiftCount ?? 0) },
    { label: t("workdays.myCash"), value: formatMoney(cash, currency) },
    { label: t("workdays.ordersHandled"), value: String(workDay.orders.length) },
    {
      label: t("workdays.myProducts"),
      value: formatMoney(workDay.finance?.totals.products ?? 0, currency),
    },
    {
      label: t("workdays.revenue"),
      value: formatMoney(workDay.finance?.totals.sales ?? 0, currency),
    },
  ];

  return (
    <Card data-testid="workday-my-summary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock3 className="size-4 text-primary" /> {t("workdays.myDay")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cells.map((cell) => (
          <div key={cell.label} className="rounded-xl border border-border p-3">
            <p className="text-xs text-muted-foreground">{cell.label}</p>
            <p className="mt-1 text-sm font-bold">{cell.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function StaffProductsCard({ finance, currency }: { finance: WorkDayFinance; currency: string }) {
  const { t, tOr } = useI18n();
  const items = useGrid(finance.items, "", [], 10);
  if (items.total === 0) return null;

  return (
    <Card data-testid="workday-my-products">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="size-4 text-primary" /> {t("workdays.myProducts")}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
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
              <TableRow key={`${item.kind}:${item.label}`} data-testid="workday-my-product">
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
          testId="workday-my-products"
        />
      </CardContent>
    </Card>
  );
}

function WithdrawalCard({
  date,
  canReview,
  data,
  loading,
  onChanged,
}: {
  date: string;
  canReview: boolean;
  data: CashWithdrawalDay | null;
  loading: boolean;
  onChanged: () => Promise<void>;
}) {
  const { t, lang } = useI18n();
  const { settings } = useClinicStore();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const rows = useGrid(data?.withdrawals ?? [], "", [], 10);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0 || note.trim().length < 3) return;
    setBusy("submit");
    try {
      await requestCashWithdrawal(date, { amount: value, note });
      toast.success(t("withdraw.requested"));
      setAmount("");
      setNote("");
      await onChanged();
    } catch (err) {
      toast.error(localizedApiErrorMessage(err, t, t("withdraw.failed")));
    } finally {
      setBusy(null);
    }
  };

  const decide = async (id: string, mode: "approve" | "reject", reason: string) => {
    setBusy(id);
    try {
      if (mode === "approve") {
        await approveCashWithdrawal(id, { note: reason });
        toast.success(t("withdraw.approved"));
      } else {
        await rejectCashWithdrawal(id, { reason });
        toast.success(t("withdraw.rejected"));
      }
      await onChanged();
    } catch (err) {
      toast.error(localizedApiErrorMessage(err, t, t("withdraw.failed")));
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card data-testid="withdrawal-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Wallet className="size-4 text-primary" /> {t("withdraw.title")}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{t("withdraw.desc")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="rounded-lg border border-primary/20 bg-primary-tint px-3 py-2 text-xs">
          {t("withdraw.available")}: <b>{formatMoney(data?.available ?? 0, settings.currency)}</b>
        </p>

        {!canReview && (
          <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[150px_1fr_auto] sm:items-end">
            <label className="space-y-1 text-xs">
              <span className="text-muted-foreground">{t("withdraw.amount")}</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                data-testid="withdrawal-amount"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
            </label>
            <label className="space-y-1 text-xs">
              <span className="text-muted-foreground">{t("withdraw.note")}</span>
              <input
                type="text"
                minLength={3}
                maxLength={500}
                required
                value={note}
                onChange={(event) => setNote(event.target.value)}
                data-testid="withdrawal-note"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
            </label>
            <Button
              type="submit"
              size="sm"
              disabled={busy === "submit"}
              data-testid="withdrawal-submit"
            >
              <Send className="size-3.5" /> {t("withdraw.submit")}
            </Button>
          </form>
        )}

        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">{t("dash.loading")}</p>
        ) : rows.total === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">{t("withdraw.empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("dash.date")}</TableHead>
                  <TableHead>{t("withdraw.requester")}</TableHead>
                  <TableHead>{t("withdraw.note")}</TableHead>
                  <TableHead className="text-end">{t("withdraw.amount")}</TableHead>
                  <TableHead>{t("verif.status")}</TableHead>
                  {canReview && <TableHead className="text-end">{t("dash.actions")}</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice.map((row) => {
                  const reason = reviewNotes[row.id] ?? "";
                  return (
                    <TableRow key={row.id} data-testid={`withdrawal-row-${row.id}`}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {formatTime(row.createdAt, lang)}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {row.employeeName || row.requesterUsername}
                      </TableCell>
                      <TableCell className="max-w-[260px] text-sm text-muted-foreground">
                        {row.note}
                        {row.reviewNote && (
                          <span className="mt-0.5 block text-xs">{row.reviewNote}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-end font-bold">
                        {formatMoney(row.amount, settings.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-muted-foreground">
                          {t(`withdraw.status.${row.status}`)}
                        </Badge>
                      </TableCell>
                      {canReview && (
                        <TableCell>
                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            {row.status === "pending" ? (
                              <>
                                <input
                                  type="text"
                                  maxLength={500}
                                  value={reason}
                                  onChange={(event) =>
                                    setReviewNotes((prev) => ({
                                      ...prev,
                                      [row.id]: event.target.value,
                                    }))
                                  }
                                  placeholder={t("withdraw.reviewNote")}
                                  aria-label={t("withdraw.reviewNote")}
                                  data-testid={`withdrawal-review-note-${row.id}`}
                                  className="h-8 w-44 rounded-lg border border-input bg-background px-2 text-xs"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-success hover:bg-success/10 hover:text-success"
                                  disabled={busy === row.id}
                                  data-testid={`withdrawal-approve-${row.id}`}
                                  onClick={() => decide(row.id, "approve", reason)}
                                >
                                  <CheckCircle2 className="size-3.5" /> {t("withdraw.approve")}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-destructive hover:text-destructive"
                                  disabled={busy === row.id || reason.trim().length < 3}
                                  data-testid={`withdrawal-reject-${row.id}`}
                                  onClick={() => decide(row.id, "reject", reason)}
                                >
                                  <XCircle className="size-3.5" /> {t("withdraw.reject")}
                                </Button>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <PaginationBar
              total={rows.total}
              page={rows.page}
              pageSize={rows.pageSize}
              pageCount={rows.pageCount}
              onPage={rows.setPage}
              onPageSize={rows.setPageSize}
              testId="withdrawals"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OrdersCard({
  orders,
  currency,
  busy,
  onRestore,
}: {
  orders: Order[];
  currency: string;
  busy: boolean;
  onRestore: (id: string) => void;
}) {
  const { t } = useI18n();
  const grid = useGrid(orders, "", [], 10);
  if (orders.length === 0) return null;

  return (
    <Card data-testid="workday-sales">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="size-4" /> {t("workdays.sales")}
          <Badge variant="outline" className="text-muted-foreground">
            {orders.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {grid.slice.map((order) => (
            <div
              key={order.id}
              data-testid={`workday-order-${order.id}`}
              className="rounded-xl border border-border p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {order.customerName}{" "}
                    <span className="font-mono text-[11px] font-normal text-muted-foreground">
                      {order.id}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.items.map((item) => `${item.name} ×${item.qty}`).join(", ")}
                  </p>
                  <p className="mt-1 text-sm font-bold">{formatMoney(order.total, currency)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PaymentMethodBadge method={order.paymentMethod} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <StatusBadge status={order.status} />
                  {order.archived && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7"
                      disabled={busy}
                      onClick={() => onRestore(order.id)}
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
          total={grid.total}
          page={grid.page}
          pageSize={grid.pageSize}
          pageCount={grid.pageCount}
          onPage={grid.setPage}
          onPageSize={grid.setPageSize}
          testId="workday-sales"
        />
      </CardContent>
    </Card>
  );
}

function WorkDayDetailView({
  workDay,
  currency,
  busy,
  withdrawals,
  withdrawalsLoading,
  canReviewWithdrawals,
  onBack,
  onRestoreBooking,
  onRestoreOrder,
  onWithdrawalsChanged,
}: {
  workDay: WorkDayDetail;
  currency: string;
  busy: boolean;
  withdrawals: CashWithdrawalDay | null;
  withdrawalsLoading: boolean;
  canReviewWithdrawals: boolean;
  onBack: () => void;
  onRestoreBooking: (id: string) => void;
  onRestoreOrder: (id: string) => void;
  onWithdrawalsChanged: () => Promise<void>;
}) {
  const { t, tOr, lang } = useI18n();
  const bookings = useGrid(workDay.bookings, "", [], 10);
  const payments = useGrid(workDay.payments, "", [], 10);
  const logs = useGrid(workDay.logs, "", [], 10);
  const isStaffView = workDay.view === "staff" && !canReviewWithdrawals;

  const hasAnything =
    workDay.bookings.length > 0 ||
    workDay.orders.length > 0 ||
    workDay.payments.length > 0 ||
    workDay.logs.length > 0 ||
    (workDay.staff?.length ?? 0) > 0 ||
    (withdrawals?.withdrawals.length ?? 0) > 0;

  const latest = workDay.sessions?.at(-1) ?? workDay.session;
  const sessionLine = latest
    ? latest.endedAt
      ? t("workdays.sessionRange", {
          from: clock(latest.startedAt, lang),
          to: clock(latest.endedAt, lang),
        })
      : t("workdays.sessionOpen")
    : t("workdays.noSession");

  const salesTotal = isStaffView
    ? (workDay.finance?.totals.sales ?? 0)
    : workDay.orders
        .filter((order) => order.status !== "cancelled")
        .reduce((sum, order) => sum + order.total, 0);
  const cashTotal = isStaffView
    ? (workDay.finance?.byMethod.find((row) => row.method === "cash")?.collected ?? 0)
    : workDay.payments
        .filter((payment) => payment.status === "paid")
        .reduce((sum, payment) => sum + payment.amount, 0);

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
            <span className="font-bold">{formatMoney(salesTotal, currency)}</span>
          </span>
          <span>
            <span className="block text-xs text-muted-foreground">
              {isStaffView ? t("workdays.myCash") : t("workdays.paymentsReceived")}
            </span>
            <span className="font-bold">{formatMoney(cashTotal, currency)}</span>
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

      {isStaffView ? (
        <>
          {workDay.finance && (
            <StaffSummaryCard workDay={workDay} currency={currency} lang={lang} />
          )}
          {workDay.finance && <StaffProductsCard finance={workDay.finance} currency={currency} />}
        </>
      ) : (
        workDay.finance && <FinanceCard finance={workDay.finance} currency={currency} />
      )}

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
              <StaffShiftCard
                key={member.id}
                member={member}
                currency={currency}
                lang={lang}
                showLogs={!isStaffView}
              />
            ))
          )}
        </CardContent>
      </Card>

      <OrdersCard
        orders={workDay.orders}
        currency={currency}
        busy={busy}
        onRestore={onRestoreOrder}
      />

      {!isStaffView && workDay.bookings.length > 0 && (
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
              {bookings.slice.map((entry) => (
                <div
                  key={entry.id}
                  data-testid={`workday-booking-${entry.id}`}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {entry.time} · {entry.ownerName}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {entry.petName} ({tOr(`animal.${entry.animalType}`, entry.animalType)}) —{" "}
                        {entry.doctorName}
                      </p>
                      {entry.symptoms && (
                        <p className="mt-1 text-xs text-muted-foreground">{entry.symptoms}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={entry.status} />
                      {entry.archived && (
                        <Badge variant="outline" className="border-transparent bg-muted">
                          {t("archive.title")}
                        </Badge>
                      )}
                      {entry.archived && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7"
                          disabled={busy}
                          onClick={() => onRestoreBooking(entry.id)}
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

      {!isStaffView && workDay.payments.length > 0 && (
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
              {payments.slice.map((payment) => (
                <div
                  key={payment.id}
                  data-testid={`workday-payment-${payment.id}`}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{payment.title}</p>
                      {payment.notes && (
                        <p className="mt-1 text-xs text-muted-foreground">{payment.notes}</p>
                      )}
                      {payment.items && payment.items.length > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {payment.items.map((item) => item.label).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {formatMoney(payment.amount, currency)}
                      </span>
                      <PaymentMethodBadge method={payment.method} />
                      <PaymentStatusBadge status={payment.status} />
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

      {!isStaffView && workDay.logs.length > 0 && (
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
                  {logs.slice.map((entry) => (
                    <TableRow key={entry.id} data-testid={`workday-log-${entry.id}`}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatTime(entry.createdAt, lang)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-transparent bg-muted text-foreground"
                        >
                          {tOr(`logs.action.${entry.action}`, entry.action)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {entry.detail}
                      </TableCell>
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

      <WithdrawalCard
        date={workDay.date}
        canReview={canReviewWithdrawals}
        data={withdrawals}
        loading={withdrawalsLoading}
        onChanged={onWithdrawalsChanged}
      />
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
              {grid.slice.map((day) => (
                <button
                  key={day.date}
                  data-testid={`workday-folder-${day.date}`}
                  onClick={() => onOpen(day.date)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4 text-start transition-colors hover:bg-card/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <CalendarDays className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">{formatDayName(day.date, lang)}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {day.session
                          ? day.session.endedAt
                            ? t("workdays.sessionRange", {
                                from: clock(day.session.startedAt, lang),
                                to: clock(day.session.endedAt, lang),
                              })
                            : t("workdays.sessionOpen")
                          : t("workdays.noSession")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-end">
                      <p className="text-sm font-semibold">{formatMoney(day.revenue, currency)}</p>
                      <p className="text-xs text-muted-foreground">
                        {dayCountsLine(t, day.bookings, day.orders, day.payments)}
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
  const [withdrawals, setWithdrawals] = useState<CashWithdrawalDay | null>(null);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);
  const canReviewWithdrawals = currentRole() === "admin";

  const loadWithdrawalsFor = async (date: string) => {
    setWithdrawalsLoading(true);
    try {
      setWithdrawals(await getCashWithdrawals(date));
    } catch {
      setWithdrawals(null);
    } finally {
      setWithdrawalsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    if (openDay) {
      setLoadingDay(true);
      Promise.all([loadWorkDay(openDay), loadWithdrawalsFor(openDay)])
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
    if (!openDay) return;
    await Promise.all([loadWorkDay(openDay), loadWithdrawalsFor(openDay), refreshClinicData()]);
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
        withdrawals={withdrawals}
        withdrawalsLoading={withdrawalsLoading}
        canReviewWithdrawals={canReviewWithdrawals}
        onBack={() => {
          setOpenDay(null);
          setWithdrawals(null);
        }}
        onRestoreBooking={restoreBooking}
        onRestoreOrder={restoreOrder}
        onWithdrawalsChanged={loadWithdrawalsFor.bind(null, openDay)}
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
