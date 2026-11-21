import { ScanLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useHardwareScanner } from "./useHardwareScanner";

export const SCANNER_ACTIVE_WINDOW_MS = 30_000;

function timeAgo(ts: number, t: (k: string, p?: Record<string, string>) => string): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return t("time.shortSec", { n: String(s) });
  const m = Math.floor(s / 60);
  if (m < 60) return t("time.shortMin", { n: String(m) });
  const h = Math.floor(m / 60);
  return t("time.shortHrMin", { h: String(h), m: String(m % 60) });
}

/**
 * A quiet, one-click status badge for the USB scanner. The big diagnostic panel
 * was replaced by this icon so the till keeps its space; the full test helper
 * lives in a popover for the rare times it's needed.
 */
export function ScannerStatusIcon({ className }: { className?: string }) {
  const { t } = useI18n();
  const { detected, lastCode, lastAt, scanCount } = useHardwareScanner();
  const [now, setNow] = useState(() => Date.now());
  const [testValue, setTestValue] = useState("");
  const testRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const active = detected && lastAt !== null && now - lastAt <= SCANNER_ACTIVE_WINDOW_MS;

  let message: string;
  if (active && lastAt !== null) message = t("cashier.scannerActive", { ago: timeAgo(lastAt, t) });
  else if (detected && lastAt !== null)
    message = t("cashier.scannerSeen", { ago: timeAgo(lastAt, t) });
  else message = t("cashier.scannerNever");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={message}
          title={message}
          className={cn(
            "relative inline-grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] border transition-colors",
            active
              ? "border-success/40 bg-success/10 text-success"
              : detected
                ? "border-[var(--gold-500)]/40 bg-[var(--gold-500)]/10 text-[var(--gold-700)] dark:text-[var(--gold-400)]"
                : "border-border bg-surface-2 text-muted-foreground hover:text-foreground",
            className,
          )}
        >
          <ScanLine className="size-4" />
          <span
            aria-hidden
            className={cn(
              "absolute -end-0.5 -top-0.5 size-2.5 rounded-full border-2 border-[var(--surface)]",
              active ? "bg-success" : detected ? "bg-[var(--gold-500)]" : "bg-muted-foreground/50",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 space-y-2">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <ScanLine className="size-4" />
          {t("cashier.scanBarcode")}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">{message}</p>
        {lastCode && <p className="rounded-md bg-muted px-2 py-1 font-mono text-xs">{lastCode}</p>}
        {scanCount > 0 && (
          <p className="text-xs text-muted-foreground">
            {t("cashier.scannerCount", { count: String(scanCount) })}
          </p>
        )}
        <div className="space-y-1.5 border-t pt-2">
          <Input
            ref={testRef}
            data-barcode-input
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setTestValue("");
              }
            }}
            placeholder={t("cashier.scannerTestPlaceholder")}
            autoComplete="off"
            className="h-8 font-mono text-xs"
          />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {t("cashier.scannerTestDesc")}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
