import { CircleAlert, ScanLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function ScannerStatus({ className }: { className?: string }) {
  const { t } = useI18n();
  const { detected, lastCode, lastAt, scanCount } = useHardwareScanner();
  const [now, setNow] = useState(() => Date.now());
  const [testing, setTesting] = useState(false);
  const [testValue, setTestValue] = useState("");
  const testRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (testing) testRef.current?.focus();
  }, [testing]);

  const active = detected && lastAt !== null && now - lastAt <= SCANNER_ACTIVE_WINDOW_MS;

  const dotClass = cn(
    "size-2 shrink-0 rounded-full",
    active ? "bg-success" : detected ? "bg-muted-foreground" : "bg-warning",
    active && "animate-pulse",
  );

  let message: string;
  if (active && lastAt !== null) message = t("cashier.scannerActive", { ago: timeAgo(lastAt, t) });
  else if (detected && lastAt !== null) message = t("cashier.scannerSeen", { ago: timeAgo(lastAt, t) });
  else message = t("cashier.scannerNever");

  return (
    <div className={cn("rounded-lg border bg-muted/40 px-3 py-2.5", className)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <span className={cn("relative flex items-center", active && "text-success")}>
            <span className={dotClass} aria-hidden />
          </span>
          {message}
        </span>
        {detected && (
          <span className="ml-auto inline-flex items-center gap-3 text-xs text-muted-foreground">
            {lastCode && <span className="font-mono">{lastCode}</span>}
            {scanCount > 0 && <span>{t("cashier.scannerCount", { count: String(scanCount) })}</span>}
          </span>
        )}
      </div>

      <div className="mt-2 border-t pt-2">
        {!testing ? (
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => setTesting(true)}>
            <ScanLine className="size-3.5" />
            {t("cashier.scannerTest")}
          </Button>
        ) : (
          <div className="space-y-2">
            <Input
              ref={testRef}
              type="text"
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
              className="h-9 font-mono text-xs"
            />
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <CircleAlert className="mt-0.5 size-3.5 shrink-0" />
              {t("cashier.scannerTestDesc")}
            </p>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setTesting(false)}>
              {t("cashier.scannerTestClose")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}