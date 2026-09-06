import { useState } from "react";
import { BadgePercent, Percent, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { I18nValue } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { DiscountType, OrderDiscount } from "./types";

type Props = {
  orderDiscount: OrderDiscount;
  subtotal: number;
  currency: string;
  onApplyOrderDiscount: (d: OrderDiscount) => void;
};

const PRESETS = [5, 10, 15, 20, 25, 50];

function fmt(n: number): string {
  return n.toFixed(2);
}

function discountLabel(d: OrderDiscount, subtotal: number, t: I18nValue["t"]): string {
  if (d.type === "percent") return `${d.value}%`;
  if (d.type === "fixed") return fmt(d.value);
  return "-";
}

export function DiscountPanel({ orderDiscount, subtotal, currency, onApplyOrderDiscount }: Props) {
  const { t } = useI18n();
  const [method, setMethod] = useState<DiscountType>(
    orderDiscount.type === "none" ? "percent" : orderDiscount.type,
  );
  const [value, setValue] = useState(
    orderDiscount.type !== "none" ? String(orderDiscount.value) : "",
  );

  const clamp = (n: number) =>
    method === "percent" ? Math.min(100, Math.max(0, n)) : Math.min(subtotal, Math.max(0, n));

  const apply = (raw: number) => {
    const clamped = clamp(method === "percent" ? raw : Math.round(raw * 100) / 100);
    if (clamped <= 0) {
      onApplyOrderDiscount({ type: "none", value: 0 });
      setValue("");
      return;
    }
    const d: OrderDiscount = { type: method, value: clamped };
    if (method === "fixed") d.label = t("cashier.discountOrder");
    onApplyOrderDiscount(d);
    setValue(String(clamped));
  };

  const active = orderDiscount.type !== "none";
  const discountAmount =
    orderDiscount.type === "percent"
      ? subtotal * (orderDiscount.value / 100)
      : orderDiscount.type === "fixed"
        ? orderDiscount.value
        : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <BadgePercent className="size-4 text-muted-foreground" />
        {t("cashier.discount")}
        {active && (
          <span className="text-destructive">−{discountLabel(orderDiscount, subtotal, t)}</span>
        )}
      </div>

      <div className="flex gap-2">
        {(
          [
            ["percent", t("cashier.discountPercent")],
            ["fixed", t("cashier.discountFixed")],
          ] as [DiscountType, string][]
        ).map(([m, label]) => (
          <Button
            key={m}
            type="button"
            variant={method === m ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => {
              setMethod(m);
              setValue("");
            }}
          >
            {m === "percent" ? <Percent className="mr-1 size-3.5" /> : null}
            {label}
          </Button>
        ))}
      </div>

      {active && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full text-destructive"
          onClick={() => {
            onApplyOrderDiscount({ type: "none", value: 0 });
            setValue("");
          }}
        >
          <X className="mr-1 size-3.5" />
          {t("cashier.removeDiscount")}
        </Button>
      )}

      <div className="flex gap-2">
        <Label className="sr-only" htmlFor="discount-input">
          {t("cashier.discount")}
        </Label>
        <div className="relative flex-1">
          {method === "percent" ? (
            <Percent className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          ) : (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {currency}
            </span>
          )}
          <Input
            id="discount-input"
            type="number"
            min={0}
            max={method === "percent" ? 100 : undefined}
            inputMode="decimal"
            value={value}
            onChange={(e) => {
              const raw = e.target.value;
              setValue(raw);
              if (raw !== "") {
                const n = Number(raw);
                if (Number.isFinite(n)) apply(n);
              } else {
                onApplyOrderDiscount({ type: "none", value: 0 });
              }
            }}
            placeholder={method === "percent" ? "10" : "0.00"}
            className="pr-9"
          />
        </div>
      </div>

      {method === "percent" && (
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant={
                orderDiscount.value === preset && orderDiscount.type === "percent"
                  ? "secondary"
                  : "outline"
              }
              size="sm"
              className={cn("h-7 px-2 text-xs")}
              onClick={() => apply(preset)}
            >
              {preset}%
            </Button>
          ))}
        </div>
      )}

      {active && discountAmount > 0 && (
        <>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("cashier.discountApplied")}</span>
            <span className="font-semibold text-destructive">−{fmt(discountAmount)}</span>
          </div>
        </>
      )}
    </div>
  );
}
