import { Archive, Clock, PauseCircle, PlayCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import type { HeldSale } from "./types";

type Props = {
  heldSales: HeldSale[];
  currency: string;
  onHold: () => void;
  onResume: (id: string) => void;
  onDiscard: (id: string) => void;
  canHold: boolean;
};

function timeAgo(ts: number, t: (k: string, p?: Record<string, string>) => string): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return t("time.shortSec", { n: String(s) });
  const m = Math.floor(s / 60);
  if (m < 60) return t("time.shortMin", { n: String(m) });
  const h = Math.floor(m / 60);
  return t("time.shortHrMin", { h: String(h), m: String(m % 60) });
}

export function HoldManager({ heldSales, currency, onHold, onResume, onDiscard, canHold }: Props) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <PauseCircle className="size-4 text-muted-foreground" />
          {t("cashier.heldSales")}
          {heldSales.length > 0 && <Badge variant="secondary">{heldSales.length}</Badge>}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onHold}
          disabled={!canHold}
          className="gap-1.5"
        >
          <Archive className="size-3.5" />
          {t("cashier.holdSale")}
        </Button>
      </div>

      {heldSales.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          {t("cashier.noHeldSales")}
        </p>
      ) : (
        <div className="space-y-2">
          {heldSales.map((held) => {
            const items = held.cart.reduce((n, i) => n + i.qty, 0);
            const subtotal = held.cart.reduce((n, i) => n + i.price * i.qty, 0);
            return (
              <div
                key={held.id}
                className="flex items-center gap-2 rounded-xl border border-border p-2.5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">{held.label || held.id}</span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      {timeAgo(held.heldAt, t)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {items} {t("cashier.items")} · {formatPrice(subtotal, currency)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onResume(held.id)}
                  title={t("cashier.resumeSale")}
                  aria-label={t("cashier.resumeSale")}
                >
                  <PlayCircle className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onDiscard(held.id)}
                  title={t("cashier.discardHeld")}
                  aria-label={t("cashier.discardHeld")}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
