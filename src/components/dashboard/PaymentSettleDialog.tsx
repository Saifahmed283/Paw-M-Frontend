import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  settlePayment,
  useClinicStore,
  type Payment,
  type PaymentMethod,
} from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { Field } from "./dashboard-helpers";
import { formatMoney } from "./dashboard-format";

export function PaymentSettleDialog({
  payment,
  onClose,
}: {
  payment: Payment;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const { settings } = useClinicStore();
  const [method, setMethod] = useState<PaymentMethod>(payment.method || "cash");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const settle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await settlePayment(payment.id, { method, notes: notes.trim() });
      toast.success(t("payments.settled"));
      onClose();
    } catch (err) {
      const message = err instanceof Error && err.message ? err.message : "";
      toast.error(message || t("dash.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("payments.settle")}</DialogTitle>
          <DialogDescription>{t("payments.settleHint")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="rounded-xl border border-border p-3">
            <p className="text-sm font-semibold">{payment.title}</p>
            <p className="mt-1 text-xl font-bold">
              {formatMoney(payment.amount, settings.currency)}
            </p>
          </div>
          <Field label={t("payments.settleMethod")}>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="cash">{t("checkout.method.cash.short")}</option>
              <option value="fawry">{t("checkout.method.fawry.short")}</option>
              <option value="instapay">{t("checkout.method.instapay.short")}</option>
            </select>
          </Field>
          <Field label={t("payments.settleNotes")}>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("payments.notesPlaceholder")}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {t("payments.cancel")}
          </Button>
          <Button onClick={settle} disabled={busy}>
            {busy ? t("payments.saving") : t("payments.settle")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
