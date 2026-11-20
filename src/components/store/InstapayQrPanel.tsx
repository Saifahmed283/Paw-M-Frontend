import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, ExternalLink, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { instapayAccountLabel, instapayLink, instapayQrText } from "@/lib/instapay-payment";
import { cn } from "@/lib/utils";

type Props = {
  account: string;
  amountLabel: string;
  compact?: boolean;
};

/** Shows exactly how to pay: a scannable QR, the raw number, and a real link if configured. */
export function InstapayQrPanel({ account, amountLabel, compact = false }: Props) {
  const { t } = useI18n();
  const [qr, setQr] = useState("");
  const number = instapayAccountLabel(account);
  const href = instapayLink(account);

  useEffect(() => {
    let active = true;
    setQr("");
    if (!number) return;
    QRCode.toDataURL(instapayQrText(number, amountLabel), {
      margin: 1,
      width: compact ? 256 : 384,
      color: { dark: "#17301f", light: "#ffffff" },
    })
      .then((dataUrl) => {
        if (active) setQr(dataUrl);
      })
      .catch(() => {
        if (active) setQr("");
      });
    return () => {
      active = false;
    };
  }, [number, amountLabel, compact]);

  if (!number) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-700">
        {t("checkout.instapayMissing")}
      </div>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(number);
      toast.success(t("checkout.instapayCopied"));
    } catch {
      toast.error(t("checkout.instapayCopyFailed"));
    }
  };

  return (
    <div className={cn("rounded-2xl border border-primary/25 bg-primary/8 p-4", compact && "p-3")}>
      <p className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Smartphone className="size-4" />
        {t("checkout.instapayQrTitle")}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {t("checkout.instapayQrHint", { amount: amountLabel })}
      </p>

      <div
        className={cn(
          "mt-3 flex flex-col items-center gap-3 sm:flex-row sm:items-start",
          compact && "mt-2",
        )}
      >
        <div
          className={cn(
            "grid shrink-0 place-items-center rounded-xl border border-border bg-white p-2",
            compact ? "size-32" : "size-40",
          )}
        >
          {qr ? (
            <img src={qr} alt={t("checkout.instapayQrAlt")} className="size-full" />
          ) : (
            <Smartphone className="size-8 animate-pulse text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {t("checkout.method.instapay.short")}
          </p>
          <p className="mt-0.5 font-mono text-base font-bold break-all">{number}</p>
          <p className="mt-1 text-sm font-semibold">{amountLabel}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {t("checkout.instapayScanNote")}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button type="button" size="sm" variant="outline" onClick={copy}>
              <Copy className="size-3.5" />
              {t("checkout.instapayCopy")}
            </Button>
            {href && (
              <Button asChild size="sm">
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5" />
                  {t("checkout.instapayOpen")}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
