import { useState } from "react";
import { Banknote, Check, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  total: number;
  currency: string;
  onCashReceivedChange: (amount: number) => void;
  /** Optional controlled amount so the same calculator can be mounted in
   *  more than one responsive slot without keeping separate values. */
  received?: number;
  onReceivedChange?: (amount: number) => void;
};

export function QuickCashCalculator({
  total,
  currency,
  onCashReceivedChange,
  received: controlledReceived,
  onReceivedChange,
}: Props) {
  const { t } = useI18n();
  const [internalReceived, setInternalReceived] = useState(0);
  const received = controlledReceived ?? internalReceived;
  const [extra, setExtra] = useState("");

  const change = Math.max(0, received - total);
  const shortfall = Math.max(0, total - received);
  const settled = total > 0 && received >= total;

  const setAmt = (n: number) => {
    const v = Math.round(n * 100) / 100;
    setInternalReceived(v);
    onReceivedChange?.(v);
    onCashReceivedChange(v);
  };

  const addExtra = () => {
    const n = Number(extra);
    if (extra.trim() === "" || !Number.isFinite(n) || n <= 0) return;
    setAmt(received + n);
    setExtra("");
  };

  const clearAmt = () => {
    setInternalReceived(0);
    onReceivedChange?.(0);
    onCashReceivedChange(0);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border bg-muted/40 p-1.5">
      <span className="hidden ps-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground lg:inline">
        {t("cashier.cashReceived")}
      </span>

      <div className="relative">
        <Input
          type="number"
          min={0}
          inputMode="decimal"
          value={received === 0 ? "" : String(received)}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              setInternalReceived(0);
              onReceivedChange?.(0);
              onCashReceivedChange(0);
              return;
            }
            const n = Number(raw);
            if (Number.isFinite(n)) setAmt(n);
          }}
          placeholder="0.00"
          aria-label={t("cashier.cashReceived")}
          className="h-8 w-20 border-0 bg-transparent p-0 pe-8 text-center text-sm font-bold tabular-nums text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0 sm:w-24"
        />
        <span className="pointer-events-none absolute end-1.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
          {currency}
        </span>
      </div>

      <span className="h-5 w-px bg-border" />

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearAmt}
          disabled={received === 0}
          className="h-8 size-8 gap-0 p-0 text-xs text-muted-foreground"
          aria-label={t("cashier.clear")}
        >
          <Minus className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={addExtra}
          aria-label={t("cashier.addAmount")}
          title={t("cashier.addAmount")}
          className="size-8 text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

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
        placeholder="+ 0.00"
        aria-label={t("cashier.extraAmount")}
        className="h-8 w-16 border-0 bg-transparent p-0 text-center text-xs font-semibold tabular-nums text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
      />

      <span
        className={cn(
          "flex min-w-[92px] items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold tabular-nums",
          settled ? "bg-success/15 text-success" : "bg-amber-500/15 text-amber-600",
        )}
      >
        {settled ? (
          <>
            <Check className="size-3" />
            {t("cashier.change")}: {change.toFixed(2)} {currency}
          </>
        ) : (
          <>
            <Minus className="size-3" />
            {t("cashier.due")}: {shortfall.toFixed(2)} {currency}
          </>
        )}
      </span>
    </div>
  );
}
