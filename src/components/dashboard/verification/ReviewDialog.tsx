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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { localizedApiErrorMessage } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import {
  approveVerification,
  canApproveVerification,
  canRejectVerification,
  isActionableVerification,
  rejectVerification,
  type VerificationSubmission,
} from "@/lib/payment-verification";

export type ReviewAction = {
  mode: "approve" | "reject";
  submission: VerificationSubmission;
};

export function ReviewDialog({
  action,
  onClose,
  onReviewed,
}: {
  action: ReviewAction;
  onClose: () => void;
  onReviewed: () => Promise<void>;
}) {
  const { t } = useI18n();
  const [bankReference, setBankReference] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const valid =
    action.mode === "approve"
      ? canApproveVerification({ bankTransactionReference: bankReference })
      : canRejectVerification({ reason });

  const submit = async () => {
    if (!valid || busy) return;
    if (!isActionableVerification(action.submission.decision)) {
      toast.error(t("verif.alreadyDecided"));
      onClose();
      return;
    }
    setBusy(true);
    try {
      if (action.mode === "approve") {
        await approveVerification(action.submission.id, {
          bankTransactionReference: bankReference,
          ...(note.trim() ? { note } : {}),
        });
        toast.success(t("verif.approved"));
      } else {
        await rejectVerification(action.submission.id, { reason });
        toast.success(t("verif.rejectedDone"));
      }
      onClose();
      await onReviewed();
    } catch (err) {
      toast.error(localizedApiErrorMessage(err, t, t("dash.toast.error")));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t(action.mode === "reject" ? "verif.reject" : "verif.approve")}
          </DialogTitle>
          <DialogDescription>
            {action.submission.orderId} · {action.submission.customerName}
          </DialogDescription>
        </DialogHeader>
        <p className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs text-amber-600">
          {t("verif.bankWarning")}
        </p>
        <div className="grid gap-4">
          {action.mode === "approve" ? (
            <div>
              <Label htmlFor="bank-ref">{t("verif.bankRef")}</Label>
              <Input
                id="bank-ref"
                value={bankReference}
                onChange={(e) => setBankReference(e.target.value)}
                className="mt-1.5"
                placeholder={t("verif.bankRefPlaceholder")}
                required
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="reject-reason">{t("verif.reason")}</Label>
              <Textarea
                id="reject-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1.5"
                rows={3}
                placeholder={t("verif.reasonPlaceholder")}
                required
              />
            </div>
          )}
          {action.mode === "approve" && (
            <div>
              <Label htmlFor="review-note">{t("verif.note")}</Label>
              <Textarea
                id="review-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1.5"
                rows={2}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" disabled={busy} onClick={onClose}>
            {t("payments.cancel")}
          </Button>
          <Button onClick={() => void submit()} disabled={busy || !valid}>
            {busy
              ? t("dash.saving")
              : t(action.mode === "reject" ? "verif.reject" : "verif.approve")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
