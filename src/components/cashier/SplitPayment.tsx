import { useEffect, useState } from "react";
import { ArrowLeftRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/clinic-store";
import { STORE_CHECKOUT_METHODS } from "@/lib/payment-verification";
import type { SplitPaymentAllocation } from "./types";

type Props = {
  total: number;
  currency: string;
  allocations: SplitPaymentAllocation[];
  onAllocationsChange: (a: SplitPaymentAllocation[]) => void;
  onMethodChange?: (method: PaymentMethod) => void;
};

const METHODS: readonly PaymentMethod[] = STORE_CHECKOUT_METHODS;

function methodLabel(m: PaymentMethod, t: (k: string) => string): string {
  return t(`checkout.method.${m}.short`);
}

/**
 * Payment-method picker for the till. Mixed-method splits are intentionally not
 * offered: an InstaPay portion would need bank-statement verification while a
 * cash portion is settled at the counter, which cannot be represented by one
 * order payment status. Each order uses exactly one trusted settlement path.
 */
export function SplitPayment({
  total,
  currency,
  allocations,
  onAllocationsChange,
  onMethodChange,
}: Props) {
  const { t } = useI18n();
  const [enabled, setEnabled] = useState(allocations.length > 0);
  const selectedMethod = allocations[0]?.method ?? "cash";
  const amount = Math.round(total * 100) / 100;

  useEffect(() => {
    if (allocations.length === 0) setEnabled(false);
  }, [allocations.length]);

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      onAllocationsChange(next ? [{ method: selectedMethod, amount }] : []);
      return next;
    });
  };

  const selectMethod = (method: PaymentMethod) => {
    onAllocationsChange([{ method, amount }]);
    onMethodChange?.(method);
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
          <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            {t("cashier.singleMethodOnly")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {METHODS.map((method) => (
              <Button
                key={method}
                type="button"
                variant={method === selectedMethod ? "default" : "outline"}
                size="sm"
                disabled={method === selectedMethod}
                onClick={() => selectMethod(method)}
                className="gap-1"
              >
                <Check className="size-3.5" />
                {methodLabel(method, t)}
              </Button>
            ))}
          </div>
          <div className="flex justify-between rounded-xl border border-border px-3 py-2 text-sm">
            <span className="text-muted-foreground">{methodLabel(selectedMethod, t)}</span>
            <span className="font-semibold">
              {amount.toFixed(2)} {currency}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
