import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Banknote, CalendarClock, ListChecks, Pencil, Plus, Trash2, Undo2, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  PaginationBar,
  SearchBox,
  SortChip,
  sortedSlice,
  useGrid,
  useSortState,
} from "@/components/dash-grid";
import {
  useClinicStore,
  deletePayment,
  createPayment,
  updatePayment,
  updateSettings,
  type Payment,
  type PaymentMethod,
} from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  Field,
  PaymentKindBadge,
  PaymentMethodBadge,
  PaymentStatusBadge,
} from "./dashboard-helpers";
import { formatMoney, formatDate, localTodayISO } from "./dashboard-format";
import { PaymentSettleDialog } from "./PaymentSettleDialog";
import { ConfirmActionDialog } from "./ConfirmActionDialog";

function PaymentDialog({ payment, onClose }: { payment: Payment | null; onClose: () => void }) {
  const { t } = useI18n();
  const [title, setTitle] = useState(payment?.title ?? "");
  const [amount, setAmount] = useState(payment ? String(payment.amount) : "");
  const [method, setMethod] = useState<PaymentMethod>(payment?.method ?? "cash");
  const [status, setStatus] = useState<"unpaid" | "paid">(
    payment?.status === "paid" ? "paid" : "unpaid",
  );
  const [date, setDate] = useState(payment?.date ?? localTodayISO());
  const [notes, setNotes] = useState(payment?.notes ?? "");
  const [orderId, setOrderId] = useState(payment?.orderId ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (saving) return;
    const value = Number.parseFloat(amount);
    if (!title.trim() || !Number.isFinite(value) || value <= 0) {
      toast.error(t("payments.invalid"));
      return;
    }
    // Editing an under-review payment must not silently downgrade it to unpaid
    // just because the status dropdown has no "proof submitted" option.
    const keepReviewStatus = payment?.status === "proof_submitted" && status === "unpaid";
    const payload = {
      title: title.trim(),
      amount: value,
      method,
      ...(keepReviewStatus ? {} : { status }),
      date,
      notes: notes.trim(),
      orderId: orderId.trim(),
    };
    setSaving(true);
    try {
      if (payment) await updatePayment(payment.id, payload);
      else await createPayment(payload);
      toast.success(t("dash.toast.saved"));
      onClose();
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{payment ? t("payments.edit") : t("payments.add")}</DialogTitle>
          <DialogDescription>
            {payment ? t("payments.editHint") : t("payments.addHint")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label={t("payments.title")}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("payments.titlePlaceholder")}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("payments.amount")}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Field>
            <Field label={t("payments.date")}>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("payments.method")}>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="cash">{t("checkout.method.cash.short")}</option>
                <option value="fawry">{t("checkout.method.fawry.short")}</option>
                <option value="instapay">{t("checkout.method.instapay.short")}</option>
              </select>
            </Field>
            <Field label={t("payments.status")}>
              {payment?.status === "proof_submitted" ? (
                <div className="flex h-9 items-center rounded-lg border border-border bg-muted/40 px-3">
                  <PaymentStatusBadge status="proof_submitted" />
                </div>
              ) : (
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "unpaid" | "paid")}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                >
                  <option value="paid">{t("pay.paid")}</option>
                  <option value="unpaid">{t("pay.unpaid")}</option>
                </select>
              )}
            </Field>
          </div>
          <Field label={t("payments.orderId")}>
            <Input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder={t("payments.orderIdHint")}
            />
          </Field>
          <Field label={t("payments.notes")}>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder={t("payments.notesPlaceholder")}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {t("payments.cancel")}
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? t("payments.saving") : t("payments.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PaymentsPanel() {
  const { t, lang } = useI18n();
  const { payments, orders, settings } = useClinicStore();
  const [editing, setEditing] = useState<Payment | null>(null);
  const [adding, setAdding] = useState(false);
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [instapayDraft, setInstapayDraft] = useState(settings.instapay);
  const [query, setQuery] = useState("");
  const [settling, setSettling] = useState<Payment | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Payment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [savingProvider, setSavingProvider] = useState(false);
  const settlingPayment = payments.find((p) => p.id === settling?.id) ?? settling;

  // Older sales were stored only as Orders. Surface them as read-only payment
  // rows so Finance collects every sale, while new sales already have a Payment.
  const linkedOrderIds = new Set(
    payments.filter((p) => p.orderId).map((p) => p.orderId as string),
  );
  const orderRows: Payment[] = orders
    .filter((o) => !linkedOrderIds.has(o.id) && !o.archived && o.status !== "cancelled")
    .map((o) => ({
      id: `order-${o.id}`,
      title: `${o.source === "pos" ? "POS" : "Store"} — ${o.customerName}`,
      amount: o.total,
      method: o.paymentMethod,
      status: o.paymentStatus,
      date: (o.createdAt || "").slice(0, 10),
      notes: "Order payment",
      orderId: o.id,
      kind: "order",
      createdAt: o.createdAt,
    }));
  const rows: Payment[] = [...payments, ...orderRows];

  // Keep the editable draft in sync when settings are refreshed elsewhere.
  useEffect(() => setInstapayDraft(settings.instapay), [settings.instapay]);
  const { sort, toggle } = useSortState("date", "desc");
  const comparators: Record<string, (a: Payment, b: Payment) => number> = {
    date: (a, b) => a.date.localeCompare(b.date),
    amount: (a, b) => a.amount - b.amount,
    title: (a, b) => a.title.localeCompare(b.title),
  };

  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  // Refunds are negative paid rows; keep them visible but out of sales totals.
  const sales = rows.filter((p) => p.kind !== "refund");
  const collected = sales
    .filter((p) => p.status === "paid" && p.amount > 0)
    .reduce((s, p) => s + p.amount, 0);
  const pending = sales
    .filter((p) => p.status !== "paid" && p.amount > 0)
    .reduce((s, p) => s + p.amount, 0);
  const refunded = rows
    .filter((p) => p.kind === "refund" && p.status === "paid")
    .reduce((s, p) => s + Math.abs(p.amount), 0);
  const thisMonth = sales
    .filter((p) => p.status === "paid" && p.amount > 0 && (p.date ?? "").startsWith(monthPrefix))
    .reduce((s, p) => s + p.amount, 0);

  const summary = [
    {
      key: "payments.summary.collected",
      value: formatMoney(collected, settings.currency),
      icon: Wallet,
      tone: "text-success",
    },
    {
      key: "payments.summary.pending",
      value: formatMoney(pending, settings.currency),
      icon: Banknote,
      tone: "text-amber-500",
    },
    {
      key: "payments.summary.month",
      value: formatMoney(thisMonth, settings.currency),
      icon: CalendarClock,
      tone: "text-primary",
    },
    {
      key: "payments.summary.refunded",
      value: formatMoney(refunded, settings.currency),
      icon: Undo2,
      tone: "text-destructive",
    },
    {
      key: "payments.summary.records",
      value: String(rows.length),
      icon: ListChecks,
      tone: "text-violet-500",
    },
  ];

  const filtered = rows.filter((p) => {
    if (methodFilter !== "all" && p.method !== methodFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });
  const sorted = sortedSlice(filtered, sort, comparators);
  const grid = useGrid(sorted, query, ["title", "notes", "orderId"]);

  const saveProvider = async () => {
    if (savingProvider) return;
    setSavingProvider(true);
    try {
      await updateSettings({ instapay: instapayDraft.trim() });
      toast.success(t("dash.toast.saved"));
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setSavingProvider(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    try {
      await deletePayment(pendingDelete.id);
      toast.success(t("dash.toast.deleted"));
      setPendingDelete(null);
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <Card key={s.key}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t(s.key)}</p>
                <p className="mt-1 text-2xl font-bold">{s.value}</p>
              </div>
              <s.icon className={cn("size-6", s.tone)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("payments.providers")}</CardTitle>
          <CardDescription>{t("payments.providersDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold">{t("payments.instapay")}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "border-transparent",
                    settings.instapay.trim()
                      ? "bg-success/15 text-success"
                      : "bg-amber-500/15 text-amber-600",
                  )}
                >
                  {settings.instapay.trim()
                    ? t("payments.configured")
                    : t("payments.notConfigured")}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t("payments.instapayHint")}</p>
              <Input
                className="mt-3"
                value={instapayDraft}
                onChange={(e) => setInstapayDraft(e.target.value)}
                placeholder={t("dash.settings.instapay")}
                aria-label={t("payments.instapay")}
              />
            </div>
            <Button
              size="sm"
              disabled={savingProvider || instapayDraft.trim() === settings.instapay.trim()}
              onClick={saveProvider}
            >
              {savingProvider ? t("dash.saving") : t("payments.providersSave")}
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2">
                <Badge className="border-transparent bg-primary/15 text-primary">
                  {t("payments.fawry")}
                </Badge>
                <p className="text-xs text-muted-foreground">{t("payments.fawryInfo")}</p>
              </div>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2">
                <Badge className="border-transparent bg-amber-500/15 text-amber-600">
                  {t("payments.cash")}
                </Badge>
                <p className="text-xs text-muted-foreground">{t("payments.cashInfo")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">{t("dash.payments")}</CardTitle>
              <CardDescription>{t("payments.hint")}</CardDescription>
            </div>
            <Button size="sm" onClick={() => setAdding(true)}>
              <Plus className="size-4" /> {t("payments.add")}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", key: "dash.filterAll" },
                { value: "cash", key: "checkout.method.cash.short" },
                { value: "fawry", key: "checkout.method.fawry.short" },
                { value: "instapay", key: "checkout.method.instapay.short" },
              ].map((m) => (
                <button
                  type="button"
                  key={m.value}
                  onClick={() => {
                    setMethodFilter(m.value);
                    grid.setPage(1);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    methodFilter === m.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(m.key)}
                </button>
              ))}
              <span className="mx-1 hidden w-px bg-border sm:block" />
              {[
                { value: "all", key: "dash.filterAll" },
                { value: "paid", key: "pay.paid" },
                { value: "unpaid", key: "pay.unpaid" },
                { value: "proof_submitted", key: "pay.underReview" },
              ].map((s) => (
                <button
                  type="button"
                  key={s.value}
                  onClick={() => {
                    setStatusFilter(s.value);
                    grid.setPage(1);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    statusFilter === s.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(s.key)}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <SortChip
                label={t("dash.sort.date")}
                active={sort.key === "date"}
                dir={sort.dir}
                onToggle={() => toggle("date", true)}
              />
              <SortChip
                label={t("dash.sort.amount")}
                active={sort.key === "amount"}
                dir={sort.dir}
                onToggle={() => toggle("amount", true)}
              />
              <SortChip
                label={t("dash.sort.title")}
                active={sort.key === "title"}
                dir={sort.dir}
                onToggle={() => toggle("title")}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {grid.slice.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">{t("dash.empty")}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("payments.date")}</TableHead>
                      <TableHead>{t("payments.title")}</TableHead>
                      <TableHead>{t("payments.kind.short")}</TableHead>
                      <TableHead>{t("payments.method")}</TableHead>
                      <TableHead className="text-end">{t("payments.amount")}</TableHead>
                      <TableHead>{t("payments.status")}</TableHead>
                      <TableHead>{t("payments.notes")}</TableHead>
                      <TableHead className="text-end">{t("dash.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grid.slice.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="whitespace-nowrap text-sm">
                          {formatDate(p.date, lang)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{p.title}</div>
                          {p.orderId && (
                            <div className="font-mono text-[11px] text-muted-foreground">
                              {p.orderId}
                            </div>
                          )}
                          {p.client?.fullName && (
                            <div className="text-[11px] text-muted-foreground">
                              {p.client.fullName}
                            </div>
                          )}
                          {p.items && p.items.length > 0 && (
                            <div className="mt-0.5 text-[11px] text-muted-foreground">
                              {p.items.map((it) => it.label).join(" · ")}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <PaymentKindBadge kind={p.kind} />
                        </TableCell>
                        <TableCell>
                          <PaymentMethodBadge method={p.method} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-end font-bold">
                          {formatMoney(p.amount, settings.currency)}
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={p.status} />
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate text-xs text-muted-foreground" title={p.notes}>
                            {p.notes || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="text-end">
                          {p.id.startsWith("order-") ? (
                            <Badge variant="outline" className="border-transparent bg-muted text-[10px] text-muted-foreground">
                              {t("payments.kind.order")}
                            </Badge>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              {p.status !== "paid" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2"
                                  onClick={() => setSettling(p)}
                                >
                                  {t("payments.settle")}
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2"
                                aria-label={t("dash.edit")}
                                onClick={() => setEditing(p)}
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-muted-foreground hover:text-destructive"
                                aria-label={t("dash.delete")}
                                onClick={() => setPendingDelete(p)}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <PaginationBar
                total={grid.total}
                page={grid.page}
                pageSize={grid.pageSize}
                pageCount={grid.pageCount}
                onPage={grid.setPage}
                onPageSize={grid.setPageSize}
              />
            </>
          )}
        </CardContent>
      </Card>

      {adding && <PaymentDialog payment={null} onClose={() => setAdding(false)} />}
      {editing && <PaymentDialog payment={editing} onClose={() => setEditing(null)} />}
      {settlingPayment && (
        <PaymentSettleDialog payment={settlingPayment} onClose={() => setSettling(null)} />
      )}
      <ConfirmActionDialog
        open={pendingDelete !== null}
        title={t("dash.delete")}
        description={t("dash.cannotUndo")}
        busy={deleting}
        onConfirm={confirmDelete}
        onClose={() => !deleting && setPendingDelete(null)}
      />
    </div>
  );
}
