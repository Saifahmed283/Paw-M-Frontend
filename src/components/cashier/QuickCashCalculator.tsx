import { useState } from "react";
import { Banknote, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  total: number;
  currency: string;
  onCashReceivedChange: (amount: number) => void;
};

export function QuickCashCalculator({ total, currency, onCashReceivedChange }: Props) {
  const { t } = useI18n();
  const [received, setReceived] = useState<number>(0);

  const change = Math.max(0, received - total);
  const shortfall = Math.max(0, total - received);
  const settled = received >= total;

  const setAmt = (n: number) => {
    const v = Math.round(n * 100) / 100;
    setReceived(v);
    onCashReceivedChange(v);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Wallet className="size-4 text-muted-foreground" />
        {t("cashier.cashReceived")}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {currency}
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
            className="pl-10 text-lg font-semibold"
            autoFocus={false}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => setAmt(total)}
          className="gap-1.5 whitespace-nowrap"
        >
          <Banknote className="size-4" />
          {t("cashier.exact")}
        </Button>
      </div>

      <Separator />

      <div
        className={cn(
          "flex items-center justify-between rounded-xl p-3 text-sm",
          settled ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
        )}
      >
        <span>{settled ? t("cashier.changeDue") : t("cashier.remaining")}</span>
        <span className={cn("text-lg font-bold", settled && "text-success")}>
          {settled ? change.toFixed(2) : shortfall.toFixed(2)} {currency}
        </span>
      </div>
    </div>
  );
}
