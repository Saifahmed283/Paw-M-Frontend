import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Archive, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  setOrderStatus,
  archiveOrder,
  deleteOrder,
  type Order,
} from "@/lib/clinic-store";
import {
  canConfirmCashReceived,
  canMarkOrderCompleted,
  cashAmountMatches,
  confirmCashReceived,
} from "@/lib/payment-verification";
import { localizedApiErrorMessage } from "@/lib/api";
import { navigateToDashboardTab } from "@/lib/dashboard-navigation";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./dashboard-helpers";
import { STATUS_OPTIONS } from "./dashboard-format";
import { ConfirmActionDialog } from "./ConfirmActionDialog";

type PendingAction = {
  id: string;
  kind: "cancel" | "archive" | "delete";
  label: string;
};

export function OrdersPanel() {
  const { t } = useI18n();
  const { orders, settings } = useClinicStore();
  const [proofOrder, setProofOrder] = useState<Order | null>(null);
  const [cashOrder, setCashOrder] = useState<Order | null>(null);
  const [cashAmount, setCashAmount] = useState("");
  const [cashNote, setCashNote] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [confirming, setConfirming] = useState(false);
  const { sort, toggle } = useSortState("newest", "desc");
  const activeOrders = useMemo(() => orders.filter((o) => !o.archived), [orders]);
  const comparators: Record<string, (a: Order, b: Order) => number> = {
    newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    owner: (a, b) => a.customerName.localeCompare(b.customerName),
    total: (a, b) => a.total - b.total,
  };
  const filtered = useMemo(
    () =>
      activeOrders.filter(
        (o) =>
          (statusFilter === "all" || o.status === statusFilter) &&
          (paymentFilter === "all" || o.paymentStatus === paymentFilter),
      ),
    [activeOrders, statusFilter, paymentFilter],
  );
  const sorted = sortedSlice(filtered, sort, comparators);
  const grid = useGrid(sorted, query, ["customerName", "phone", "email", "id"]);

  const runAction = async (id: string, action: () => Promise<void>, successKey: string) => {
    if (busyId) return;
    setBusyId(id);
    try {
      await action();
      toast.success(t(successKey));
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusyId(null);
    }
  };

  const openCashDialog = (order: Order) => {
    setCashOrder(order);
    setCashAmount(order.total.toFixed(2));
    setCashNote("");
  };

  const confirmCash = async () => {
    if (!cashOrder || busyId) return;
    const amount = Number(cashAmount);
    if (!cashAmountMatches(cashOrder.total, amount)) {
      toast.error(t("dash.cashMismatch"));
      return;
    }
    setBusyId(cashOrder.id);
    try {
      await confirmCashReceived(cashOrder.id, {
        amountReceived: amount,
        ...(cashNote.trim() ? { note: cashNote } : {}),
      });
      toast.success(t("dash.cashConfirmed"));
      setCashOrder(null);
    } catch (err) {
      toast.error(localizedApiErrorMessage(err, t, t("dash.toast.error")));
    } finally {
      setBusyId(null);
    }
  };

  const executePendingAction = async () => {
    if (!pendingAction || confirming) return;
    const { id, kind } = pendingAction;
    setConfirming(true);
    try {
      if (kind === "cancel") await setOrderStatus(id, "cancelled");
      else if (kind === "archive") await archiveOrder(id, true);
      else await deleteOrder(id);
      toast.success(
        t(
          kind === "delete"
            ? "dash.toast.deleted"
            : kind === "archive"
              ? "dash.toast.archived"
              : "dash.toast.saved",
        ),
      );
      setPendingAction(null);
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("dash.orders")}</CardTitle>
        <CardDescription>{t("dash.orders.hint")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => (
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
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {t(s.key)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", key: "dash.filterAll" },
              { value: "paid", key: "pay.paid" },
              { value: "proof_submitted", key: "pay.underReview" },
              { value: "under_review", key: "verif.underReview" },
              { value: "rejected", key: "track.statusRejected" },
              { value: "unpaid", key: "pay.unpaid" },
            ].map((p) => (
              <button
                type="button"
                key={p.value}
                onClick={() => {
                  setPaymentFilter(p.value);
                  grid.setPage(1);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  paymentFilter === p.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {t(p.key)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <SortChip
              label={t("dash.sort.recent")}
              active={sort.key === "newest"}
              dir={sort.dir}
              onToggle={() => toggle("newest", true)}
            />
            <SortChip
              label={t("dash.sort.owner")}
              active={sort.key === "owner"}
              dir={sort.dir}
              onToggle={() => toggle("owner")}
            />
            <SortChip
              label={t("dash.sort.total")}
              active={sort.key === "total"}
              dir={sort.dir}
              onToggle={() => toggle("total", true)}
            />
          </div>
        </div>
        {grid.slice.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">{t("dash.empty")}</p>
        ) : (
          <>
            <div className="space-y-3">
              {grid.slice.map((o) => (
                <div key={o.id} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{o.customerName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {o.phone} · {o.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{o.address}</p>
                      <p className="mt-1 text-xs font-mono text-muted-foreground">{o.id}</p>
                    </div>
                    <div className="text-end">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <StatusBadge status={o.status} />
                        <Badge
                          variant="outline"
                          className="border-transparent bg-primary/10 text-primary"
                        >
                          {t(`checkout.method.${o.paymentMethod}.short`)}
                        </Badge>
                        {o.paymentStatus === "paid" ? (
                          <Badge className="border-transparent bg-success/15 text-success">
                            {t("pay.paid")}
                          </Badge>
                        ) : o.paymentStatus === "proof_submitted" ||
                          o.paymentStatus === "under_review" ? (
                          <Badge className="border-transparent bg-amber-500/15 text-amber-600">
                            {t("pay.underReview")}
                          </Badge>
                        ) : o.paymentStatus === "rejected" ? (
                          <Badge className="border-transparent bg-destructive/15 text-destructive">
                            {t("track.statusRejected")}
                          </Badge>
                        ) : (
                          <Badge className="border-transparent bg-muted text-muted-foreground">
                            {t("pay.unpaid")}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1.5 text-lg font-bold">
                        {settings.currency === "$"
                          ? `$${o.total.toFixed(2)}`
                          : `${settings.currency} ${o.total.toFixed(2)}`}
                      </p>
                      {o.paymentRef && (
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                          {t("checkout.refNumber")}: {o.paymentRef}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {o.items.map((item) => (
                      <span
                        key={`${o.id}-${item.id}`}
                        className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs"
                      >
                        {item.name} × {item.qty}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {canConfirmCashReceived(o) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 border-success/30 text-success hover:bg-success/10 hover:text-success"
                        disabled={busyId === o.id}
                        onClick={() => openCashDialog(o)}
                      >
                        {t("dash.confirmCash")}
                      </Button>
                    )}
                    {o.paymentMethod === "instapay" && o.paymentStatus !== "paid" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={() => navigateToDashboardTab("payment-verification")}
                      >
                        {t("verif.goQueue")}
                      </Button>
                    )}
                    {o.paymentStatus === "proof_submitted" && (o.proofImage || o.paymentRef) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={() => setProofOrder(o)}
                      >
                        {t("dash.viewProof")}
                      </Button>
                    )}
                    {o.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        disabled={busyId === o.id}
                        onClick={() =>
                          runAction(
                            o.id,
                            () => setOrderStatus(o.id, "confirmed"),
                            "dash.toast.saved",
                          )
                        }
                      >
                        {t("dash.confirmRow")}
                      </Button>
                    )}
                    {o.status !== "completed" && o.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        disabled={busyId === o.id || !canMarkOrderCompleted(o)}
                        title={
                          canMarkOrderCompleted(o) ? undefined : t("dash.completeRequiresPayment")
                        }
                        aria-label={
                          canMarkOrderCompleted(o) ? undefined : t("dash.completeRequiresPayment")
                        }
                        onClick={() =>
                          runAction(
                            o.id,
                            () => setOrderStatus(o.id, "completed"),
                            "dash.toast.completed",
                          )
                        }
                      >
                        {t("dash.complete")}
                      </Button>
                    )}
                    {!canMarkOrderCompleted(o) && (
                      <span className="w-full text-[11px] text-amber-600">
                        {t("dash.completeRequiresPayment")}
                      </span>
                    )}
                    {o.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-muted-foreground hover:text-destructive"
                        disabled={busyId === o.id}
                        onClick={() =>
                          setPendingAction({ id: o.id, kind: "cancel", label: t("dash.cancelRow") })
                        }
                      >
                        {t("dash.cancelRow")}
                      </Button>
                    )}
                    {(o.status === "completed" || o.status === "cancelled") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        aria-label={t("dash.archive")}
                        title={t("dash.archive")}
                        disabled={busyId === o.id}
                        onClick={() =>
                          setPendingAction({ id: o.id, kind: "archive", label: t("dash.archive") })
                        }
                      >
                        <Archive className="size-3.5" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-muted-foreground hover:text-destructive"
                      aria-label={t("dash.delete")}
                      disabled={busyId === o.id}
                      onClick={() =>
                        setPendingAction({ id: o.id, kind: "delete", label: t("dash.delete") })
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
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
            />
          </>
        )}
      </CardContent>

      <Dialog open={Boolean(proofOrder)} onOpenChange={(open) => !open && setProofOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("dash.paymentProof")}</DialogTitle>
            <DialogDescription>{proofOrder?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            {proofOrder?.paymentRef && (
              <p className="rounded-xl bg-muted/50 px-4 py-2.5 font-mono text-sm">
                {t("checkout.refNumber")}: {proofOrder.paymentRef}
              </p>
            )}
            {proofOrder?.proofImage ? (
              <a href={proofOrder.proofImage} target="_blank" rel="noreferrer">
                <img
                  src={proofOrder.proofImage}
                  alt={t("track.proofImageAlt")}
                  className="max-h-96 w-full rounded-xl border border-border object-cover"
                />
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">{t("dash.noImage")}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProofOrder(null)}>
              {t("dash.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(cashOrder)} onOpenChange={(open) => !open && setCashOrder(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("dash.confirmCash")}</DialogTitle>
            <DialogDescription>
              {cashOrder?.id} · {t("dash.cashConfirmHint")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="cash-amount">{t("dash.cashAmount")}</Label>
              <Input
                id="cash-amount"
                type="number"
                min="0"
                step="0.01"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="cash-note">{t("verif.note")}</Label>
              <Textarea
                id="cash-note"
                rows={2}
                value={cashNote}
                onChange={(e) => setCashNote(e.target.value)}
                className="mt-1.5"
              />
            </div>
            {cashOrder && !cashAmountMatches(cashOrder.total, Number(cashAmount)) && (
              <p className="text-xs text-destructive">{t("dash.cashMismatch")}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCashOrder(null)} disabled={Boolean(busyId)}>
              {t("dash.close")}
            </Button>
            <Button
              onClick={confirmCash}
              disabled={
                Boolean(busyId) ||
                !cashOrder ||
                !cashAmountMatches(cashOrder.total, Number(cashAmount))
              }
            >
              {t("dash.confirmCash")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={pendingAction !== null}
        title={pendingAction?.label ?? t("dash.confirm")}
        description={t("dash.cannotUndo")}
        busy={confirming}
        onConfirm={executePendingAction}
        onClose={() => !confirming && setPendingAction(null)}
      />
    </Card>
  );
}
