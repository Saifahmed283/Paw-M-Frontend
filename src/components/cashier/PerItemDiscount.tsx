import { useState } from "react";
import { BadgePercent, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { ItemDiscount } from "./types";

type Props = {
  price: number;
  qty: number;
  stock: number;
  discount: ItemDiscount | undefined;
  onChange: (d: ItemDiscount) => void;
};

export function PerItemDiscount({ price, qty, stock, discount, onChange }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"percent" | "fixed">(
    discount && discount.type === "fixed" ? "fixed" : "percent",
  );
  const [value, setValue] = useState(
    discount && discount.type !== "none" ? String(discount.value) : "",
  );

  const active = discount && discount.type !== "none";

  const apply = (raw: number) => {
    const val = methodClamp(raw);
    if (val <= 0) {
      onChange({ type: "none", value: 0 });
      setValue("");
      return;
    }
    onChange({ type: mode, value: val });
    setValue(String(val));
  };

  const methodClamp = (n: number) =>
    mode === "percent" ? Math.min(100, Math.max(0, n)) : Math.min(price, Math.max(0, n));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7", active && "text-primary")}
          title={t("cashier.itemDiscount")}
          aria-label={t("cashier.itemDiscount")}
        >
          <BadgePercent className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-3" align="end">
        <div className="space-y-2">
          <p className="text-xs font-semibold">{t("cashier.itemDiscount")}</p>
          <div className="flex gap-1.5">
            {(["percent", "fixed"] as const).map((m) => (
              <Button
                key={m}
                type="button"
                variant={mode === m ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => {
                  setMode(m);
                  setValue("");
                  onChange({ type: "none", value: 0 });
                }}
              >
                {m === "percent" ? "%" : t("cashier.discountFixed")}
              </Button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <Input
              type="number"
              min={0}
              max={mode === "percent" ? 100 : price}
              inputMode="decimal"
              value={value}
              onChange={(e) => {
                const raw = e.target.value;
                setValue(raw);
                if (raw !== "") {
                  const n = Number(raw);
                  if (Number.isFinite(n)) apply(n);
                } else {
                  onChange({ type: "none", value: 0 });
                }
              }}
              placeholder={mode === "percent" ? "10" : "0.00"}
              className="h-8 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2"
              onClick={() => {
                onChange({ type: "none", value: 0 });
                setValue("");
              }}
              disabled={!active}
              aria-label={t("cashier.removeDiscount")}
            >
              <X className="size-3.5" />
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {t("cashier.qty")}: {qty} · {t("cashier.stock")}: {stock}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
