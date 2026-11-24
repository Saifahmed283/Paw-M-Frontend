import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Banknote, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { localizedApiErrorMessage } from "@/lib/api";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import {
  closeCashDrawer,
  getCashDrawer,
  varianceTone,
  type CashDrawerDay,
} from "@/lib/payment-verification";
import { cn } from "@/lib/utils";
import { clinicTodayISO, formatMoney } from "../dashboard-format";

export function CashDrawerCard() {
  const { t } = useI18n();
  const { settings } = useClinicStore();
  const [drawerDate, setDrawerDate] = useState(clinicTodayISO());
  const [drawer, setDrawer] = useState<CashDrawerDay | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [countedAmount, setCountedAmount] = useState("");
  const [drawerNote, setDrawerNote] = useState("");
  const [closingDrawer, setClosingDrawer] = useState(false);

  const loadDrawer = useCallback(
    async (date: string) => {
      setDrawerLoading(true);
      try {
        const result = await getCashDrawer(date);
        setDrawer(result);
        const counted = result.close?.counted;
        setCountedAmount(counted === null || counted === undefined ? "" : counted.toFixed(2));
      } catch (err) {
        toast.error(localizedApiErrorMessage(err, t, t("verif.drawerLoadFailed")));
      } finally {
        setDrawerLoading(false);
      }
    },
    [t],
  );

  useEffect(() => {
    void loadDrawer(drawerDate);
  }, [drawerDate, loadDrawer]);

  const hasClose = Boolean(drawer?.close);

  const submitDrawer = async () => {
    // An untouched number input reads as "0" in JS. Never save that by accident.
    if (countedAmount.trim() === "") {
      toast.error(t("verif.drawerInvalid"));
      return;
    }
    const amount = Number(countedAmount);
    if (!Number.isFinite(amount) || amount < 0) {
      toast.error(t("verif.drawerInvalid"));
      return;
    }
    setClosingDrawer(true);
    try {
      const saved = await closeCashDrawer({
        date: drawerDate,
        countedAmount: amount,
        ...(drawerNote.trim() ? { note: drawerNote } : {}),
      });
      // Show the server's saved values immediately; don't wait for a second GET.
      setCountedAmount(saved.counted.toFixed(2));
      setDrawer((previous) =>
        previous
          ? { ...previous, close: saved, expected: saved.expected }
          : { date: saved.date, close: saved, expected: saved.expected, payments: [] },
      );
      toast.success(t(hasClose ? "verif.drawerUpdated" : "verif.drawerSaved"));
      setDrawerNote("");
      await loadDrawer(drawerDate);
    } catch (err) {
      toast.error(localizedApiErrorMessage(err, t, t("dash.toast.error")));
    } finally {
      setClosingDrawer(false);
    }
  };

  const counted = drawer?.close?.counted;
  const variance = drawer?.close?.variance;
  const varianceClass =
    variance !== null && variance !== undefined
      ? {
          positive: "text-success",
          negative: "text-destructive",
          neutral: "text-muted-foreground",
        }[varianceTone(variance)]
      : "text-muted-foreground";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Banknote className="size-4 text-primary" /> {t("verif.drawerTitle")}
        </CardTitle>
        <CardDescription>{t("verif.drawerDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="drawer-date" className="text-xs text-muted-foreground">
              {t("dash.date")}
            </Label>
            <Input
              id="drawer-date"
              type="date"
              value={drawerDate}
              onChange={(e) => setDrawerDate(e.target.value || clinicTodayISO())}
              className="mt-1"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={drawerLoading}
            onClick={() => void loadDrawer(drawerDate)}
          >
            <RefreshCw className={cn("size-4", drawerLoading && "animate-spin")} />
            {t("dash.refresh")}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">{t("verif.drawerExpected")}</p>
            <p className="mt-1 text-xl font-bold">
              {formatMoney(drawer?.expected ?? 0, settings.currency)}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">{t("verif.drawerCounted")}</p>
            <p className="mt-1 text-xl font-bold">
              {counted === null || counted === undefined
                ? "—"
                : formatMoney(counted, settings.currency)}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">{t("verif.drawerVariance")}</p>
            <p className={cn("mt-1 text-xl font-bold", varianceClass)}>
              {variance === null || variance === undefined
                ? "—"
                : formatMoney(variance, settings.currency)}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("verif.drawerPayments", { count: String(drawer?.payments?.length ?? 0) })}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="drawer-counted" className="text-xs text-muted-foreground">
              {t("verif.drawerCountedInput")}
            </Label>
            <Input
              id="drawer-counted"
              type="number"
              min="0"
              step="0.01"
              value={countedAmount}
              onChange={(e) => setCountedAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="drawer-note" className="text-xs text-muted-foreground">
              {t("verif.note")}
            </Label>
            <Input
              id="drawer-note"
              value={drawerNote}
              onChange={(e) => setDrawerNote(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Button
            onClick={() => void submitDrawer()}
            disabled={closingDrawer || countedAmount.trim() === ""}
            className="w-full sm:w-auto"
          >
            {closingDrawer
              ? t("dash.saving")
              : t(hasClose ? "verif.drawerUpdate" : "verif.drawerClose")}
          </Button>
          <p className="text-xs text-muted-foreground">{t("verif.drawerSnapshot")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
