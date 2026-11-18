import { useEffect, useMemo, useState } from "react";
import { Loader2, Minus, Plus, ReceiptText, Search, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { Order } from "@/lib/clinic-store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orders: Order[];
  currency: string;
  onRefunded: () => void;
};

type RefundResponse = {
  refundedAmount: number;
  remainingRefundable: number;
  fullyRefunded: boolean;
};

export function RefundDialog({ open, onOpenChange, orders, currency, onRefunded }: Props) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [qtyByLine, setQtyByLine] = useState<Record<number, number>>({});
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setQuery("");
    setSelectedId("");
    setQtyByLine({});
    setReason("");
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((o) =>
        !q
          ? true
          : `${o.id} ${o.customerName} ${o.phone}`.toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [orders, query]);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  const chosen = useMemo(() => {
    if (!selected) return [];
    return selected.items
      .map((line, index) => ({ ...line, index, qty: qtyByLine[index] ?? 0 }))
      .filter((line) => line.qty > 0);
  }, [selected, qtyByLine]);

  const orderSubtotal = selected
    ? selected.items.reduce((n, i) => n + (Number(i.price) || 0) * i.qty, 0)
    : 0;
  const chosenSubtotal = chosen.reduce((n, i) => n + (Number(i.price) || 0) * i.qty, 0);
  const discountShare =
    orderSubtotal > 0 ? ((Number(selected?.discountAmount) || 0) * chosenSubtotal) / orderSubtotal : 0;
  const refundAmount = Math.max(0, Math.round((chosenSubtotal - discountShare) * 100) / 100);

  const setQty = (index: number, qty: number, max: number) => {
    setQtyByLine((prev) => ({ ...prev, [index]: Math.min(max, Math.max(0, qty)) }));
  };

  const fullRefund = () => {
    if (!selected) return;
    setQtyByLine(Object.fromEntries(selected.items.map((line, i) => [i, line.qty])));
  };

  const submit = async () => {
    if (!selected || chosen.length === 0 || busy) return;
    setBusy(true);
    try {
      const isFull = selected.items.every((line, i) => (qtyByLine[i] ?? 0) === line.qty);
      const result = await api.post<RefundResponse>(`/orders/${selected.id}/refund`, {
        reason: reason.trim(),
        items: isFull ? [] : chosen.map((line) => ({ id: line.id, qty: line.qty })),
      });
      toast.success(
        t("cashier.refundDone", { amount: formatPrice(result.refundedAmount, currency) }),
      );
      onRefunded();
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error && err.message ? err.message : t("dash.toast.error");
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Undo2 className="size-5 text-primary" />
            {t("cashier.refundTitle")}
          </DialogTitle>
          <DialogDescription>{t("cashier.refundDesc")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("cashier.refundSearch")}
              className="pl-9"
            />
          </div>

          <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
            {matches.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t("cashier.refundNoOrders")}
              </p>
            ) : (
              matches.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(order.id);
                    setQtyByLine({});
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-start transition-all",
                    selectedId === order.id
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      <ReceiptText className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate font-mono">{order.id}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {order.customerName}
                      {order.phone ? ` · ${order.phone}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-bold">
                    {formatPrice(order.total, currency)}
                  </span>
                </button>
              ))
            )}
          </div>

          {selected && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-3 duration-300">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("cashier.refundLines")}
                </p>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={fullRefund}
                    className="font-semibold text-primary hover:underline"
                  >
                    {t("cashier.refundFull")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQtyByLine({})}
                    className="text-muted-foreground hover:underline"
                  >
                    {t("cashier.refundClear")}
                  </button>
                </div>
              </div>

              <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
                {selected.items.map((line, index) => {
                  const qty = qtyByLine[index] ?? 0;
                  return (
                    <div
                      key={`${line.id}-${index}`}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border p-2.5 transition-colors",
                        qty > 0 ? "border-primary/40 bg-primary/5" : "border-border",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{line.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatPrice(line.price, currency)} × {line.qty}
                        </span>
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-7"
                          onClick={() => setQty(index, qty - 1, line.qty)}
                          disabled={qty === 0}
                          aria-label={t("cashier.decrease")}
                        >
                          <Minus className="size-3.5" />
                        </Button>
                        <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-7"
                          onClick={() => setQty(index, qty + 1, line.qty)}
                          disabled={qty >= line.qty}
                          aria-label={t("cashier.increase")}
                        >
                          <Plus className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="refund-reason" className="text-xs text-muted-foreground">
                  {t("cashier.refundReason")}
                </Label>
                <Textarea
                  id="refund-reason"
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t("cashier.refundReasonPlaceholder")}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3">
                <span className="text-sm font-semibold">{t("cashier.refundAmount")}</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(refundAmount, currency)}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cashier.close")}
          </Button>
          <Button onClick={submit} disabled={!selected || chosen.length === 0 || busy} className="gap-1.5">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Undo2 className="size-4" />}
            {busy ? t("dash.saving") : t("cashier.refundConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
