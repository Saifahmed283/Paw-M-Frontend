import { useState } from "react";
import { ArrowLeftRight, Check, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/clinic-store";
import type { SplitPaymentAllocation } from "./types";

type Props = {
  total: number;
  currency: string;
  allocations: SplitPaymentAllocation[];
  onAllocationsChange: (a: SplitPaymentAllocation[]) => void;
};

const METHODS: PaymentMethod[] = ["cash", "fawry", "instapay"];

function methodLabel(m: PaymentMethod, t: (k: string) => string): string {
  return t(`checkout.method.${m}.short`);
}

export function SplitPayment({ total, currency, allocations, onAllocationsChange }: Props) {
  const { t } = useI18n();
  const [enabled, setEnabled] = useState(allocations.length > 1);

  const allocated = allocations.reduce((n, a) => n + a.amount, 0);
  const remaining = total - allocated;
  const complete = Math.abs(remaining) < 0.005;

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      onAllocationsChange([{ method: "cash", amount: Math.round(total * 100) / 100 }]);
      return next;
    });
  };

  const addMethod = (method: PaymentMethod) => {
    if (allocations.some((a) => a.method === method)) return;
    onAllocationsChange([...allocations, { method, amount: 0 }]);
  };

  const updateAmount = (index: number, amount: number) => {
    const clamped = Math.min(Math.round(amount * 100) / 100, total);
    onAllocationsChange(
      allocations.map((a, i) => (i === index ? { ...a, amount: Math.max(0, clamped) } : a)),
    );
  };

  const resetToSingle = () => {
    onAllocationsChange([{ method: "cash", amount: Math.round(total * 100) / 100 }]);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-sm font-semibold transition hover:border-primary/40"
      >
        <span className="flex items-center gap-2">
          <ArrowLeftRight className="size-4 text-muted-foreground" />
          {t("cashier.splitPayment")}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-bold",
            enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {enabled ? t("cashier.on") : t("cashier.off")}
        </span>
      </button>

      {enabled && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {METHODS.filter((m) => !allocations.some((a) => a.method === m)).map((m) => (
              <Button
                key={m}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addMethod(m)}
                className="gap-1"
              >
                <Plus className="size-3.5" />
                {methodLabel(m, t)}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            {allocations.map((a, idx) => (
              <div key={a.method} className="flex items-center gap-2">
                <span className="w-24 shrink-0 text-xs font-semibold">
                  {methodLabel(a.method, t)}
                </span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {currency}
                  </span>
                  <Input
                    type="number"
                    min={0}
                    max={total}
                    inputMode="decimal"
                    value={a.amount === 0 ? "" : String(a.amount)}
                    onChange={(e) => {
                      const v = e.target.value === "" ? 0 : Number(e.target.value);
                      if (Number.isFinite(v)) updateAmount(idx, v);
                    }}
                    className="pl-8"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => {
                    if (allocations.length <= 1) {
                      resetToSingle();
                      return;
                    }
                    const next = allocations.filter((_, i) => i !== idx);
                    onAllocationsChange(next);
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("cashier.allocated")}</span>
            <span>
              {allocated.toFixed(2)} {currency}
            </span>
          </div>
          <div
            className={cn(
              "flex justify-between text-sm font-semibold",
              complete ? "text-success" : "text-amber-600",
            )}
          >
            <span>{complete ? t("cashier.fullyAllocated") : t("cashier.unallocated")}</span>
            <span>
              {Math.abs(remaining).toFixed(2)} {currency}
            </span>
          </div>

          {!complete && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {t("cashier.splitNotComplete")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
