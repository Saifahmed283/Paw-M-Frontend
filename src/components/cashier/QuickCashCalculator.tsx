import { useState } from "react";
import { Banknote, Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  total: number;
  currency: string;
  onCashReceivedChange: (amount: number) => void;
};

export function QuickCashCalculator({ total, currency, onCashReceivedChange }: Props) {
  const { t } = useI18n();
  const [received, setReceived] = useState(0);
  const [extra, setExtra] = useState("");

  const change = Math.max(0, received - total);
  const shortfall = Math.max(0, total - received);
  const settled = total > 0 && received >= total;

  const setAmt = (n: number) => {
    const v = Math.round(n * 100) / 100;
    setReceived(v);
    onCashReceivedChange(v);
  };

  const addExtra = () => {
    const n = Number(extra);
    if (extra.trim() === "" || !Number.isFinite(n) || n <= 0) return;
    setAmt(received + n);
    setExtra("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-muted/40 p-2">
      <div className="flex min-w-[190px] flex-1 items-center gap-2 rounded-xl bg-background px-3 shadow-sm">
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          {t("cashier.cashReceived")}
        </span>
        <Input
          type="number"
          min={0}
          inputMode="decimal"
          value={received === 0 ? "" : String(received)}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              setReceived(0);
              onCashReceivedChange(0);
              return;
            }
            const n = Number(raw);
            if (Number.isFinite(n)) setAmt(n);
          }}
          placeholder="0.00"
          aria-label={t("cashier.cashReceived")}
          className="h-9 min-w-0 flex-1 border-0 p-0 text-end text-base font-bold shadow-none focus-visible:ring-0"
        />
        <span className="shrink-0 text-xs text-muted-foreground">{currency}</span>
      </div>

      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() => setAmt(total)}
        className="h-9 gap-1.5 rounded-xl px-3"
      >
        <Banknote className="size-3.5" />
        {t("cashier.exact")}
      </Button>

      <div className="flex h-9 items-center gap-1 rounded-xl bg-background px-2 shadow-sm">
        <span className="text-sm text-muted-foreground">+</span>
        <Input
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addExtra();
            }
          }}
          placeholder="0.00"
          aria-label={t("cashier.extraAmount")}
          className="h-8 w-16 border-0 p-0 text-center text-sm font-semibold shadow-none focus-visible:ring-0"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={addExtra}
          aria-label={t("cashier.addAmount")}
          className="size-6 rounded-lg"
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      <span
        className={cn(
          "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold",
          settled ? "bg-success/15 text-success" : "bg-amber-500/15 text-amber-600",
        )}
      >
        {settled && <Check className="size-3.5" />}
        {settled ? t("cashier.changeDue") : t("cashier.remaining")}
        <span className="font-mono text-sm">
          {(settled ? change : shortfall).toFixed(2)} {currency}
        </span>
      </span>
    </div>
  );
}
