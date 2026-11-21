import { ReceiptText } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  amountLabel: string;
  /** The order ID doubles as the Fawry payment reference. */
  reference?: string | undefined;
  compact?: boolean;
};

/**
 * Fawry has no account number to configure — the order ID is the reference the
 * customer quotes at an outlet or in the app. We show that reference, the total,
 * and the same proof-verification promise as InstaPay.
 */
export function FawryPaymentPanel({ amountLabel, reference, compact = false }: Props) {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--gold-500)]/35 bg-[var(--surface-2)] p-4",
        compact && "p-3",
      )}
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-[var(--gold-700)] dark:text-[var(--gold-400)]">
        <ReceiptText className="size-4" />
        {t("checkout.fawryHowTitle")}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("checkout.fawryHow")}</p>

      <div
        className={cn(
          "mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-[var(--gold-500)]/20 pt-3",
          compact && "mt-2 pt-2",
        )}
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {t("checkout.method.fawry.short")}
          </p>
          <p className="mt-0.5 text-sm font-semibold">{t("checkout.fawrySteps")}</p>
        </div>
        <p className="font-data text-lg font-bold tabular-nums">{amountLabel}</p>
      </div>

      {reference && (
        <div className="mt-3 rounded-[var(--radius-md)] border border-dashed border-[var(--gold-500)]/45 bg-[var(--canvas)] p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {t("checkout.fawryRefTitle")}
          </p>
          <p className="mt-0.5 font-mono text-sm font-bold break-all">{reference}</p>
        </div>
      )}

      <p className="mt-3 text-xs font-medium text-amber-600">{t("checkout.notPaidNote")}</p>
    </div>
  );
}
