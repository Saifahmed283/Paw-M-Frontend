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
    <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 p-1.5">
      <span className="ps-1 text-[10px] font-bold uppercase tracking-wider text-white/50">
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
              setReceived(0);
              onCashReceivedChange(0);
              return;
            }
            const n = Number(raw);
            if (Number.isFinite(n)) setAmt(n);
          }}
          placeholder="0.00"
          aria-label={t("cashier.cashReceived")}
          className="h-8 w-24 border-0 bg-transparent p-0 pe-8 text-center text-sm font-bold tabular-nums text-white shadow-none placeholder:text-white/30 focus-visible:ring-0"
        />
        <span className="pointer-events-none absolute end-1.5 top-1/2 -translate-y-1/2 text-[10px] text-white/40">
          {currency}
        </span>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setAmt(total)}
        className="h-8 gap-1 border-0 bg-white/15 px-2 text-xs text-white hover:bg-white/25"
        title={t("cashier.exact")}
      >
        <Banknote className="size-3.5" />
        <span className="hidden 2xl:inline">{t("cashier.exact")}</span>
      </Button>

      <span className="h-5 w-px bg-white/15" />

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
        className="h-8 w-16 border-0 bg-transparent p-0 text-center text-xs font-semibold tabular-nums text-white shadow-none placeholder:text-white/30 focus-visible:ring-0"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={addExtra}
        aria-label={t("cashier.addAmount")}
        title={t("cashier.addAmount")}
        className="size-8 text-white/70 hover:bg-white/10 hover:text-white"
      >
        <Plus className="size-3.5" />
      </Button>

      <span
        className={cn(
          "flex min-w-[92px] items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold tabular-nums",
          settled ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-200",
        )}
      >
        {settled && <Check className="size-3" />}
        {(settled ? change : shortfall).toFixed(2)} {currency}
      </span>
    </div>
  );
}
