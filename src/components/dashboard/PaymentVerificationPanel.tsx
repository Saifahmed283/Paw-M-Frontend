import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Banknote, CheckCircle2, FileImage, Landmark, RefreshCw, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { localizedApiErrorMessage } from "@/lib/api";
import { useClinicStore } from "@/lib/clinic-store";
import {
  approveVerification,
  canApproveVerification,
  canRejectVerification,
  closeCashDrawer,
  getCashDrawer,
  getVerificationEvidenceUrl,
  getVerificationSubmissions,
  rejectVerification,
  varianceTone,
  type CashDrawerDay,
  type VerificationDecision,
  type VerificationSubmission,
} from "@/lib/payment-verification";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { clinicTodayISO, formatMoney, formatTime } from "./dashboard-format";

const DECISIONS: readonly VerificationDecision[] = [
  "submitted",
  "under_review",
  "approved",
  "rejected",
];

type ReviewAction = { submission: VerificationSubmission; mode: "approve" | "reject" };

function decisionTone(decision: VerificationDecision): string {
  if (decision === "approved") return "bg-success/15 text-success";
  if (decision === "rejected") return "bg-destructive/15 text-destructive";
  if (decision === "under_review") return "bg-amber-500/15 text-amber-600";
  return "bg-muted text-muted-foreground";
}

export function PaymentVerificationPanel() {
  const { t, lang } = useI18n();
  const { settings } = useClinicStore();
  const [status, setStatus] = useState<VerificationDecision>("submitted");
  const [submissions, setSubmissions] = useState<VerificationSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [evidenceBusyId, setEvidenceBusyId] = useState<string | null>(null);
  const [reviewAction, setReviewAction] = useState<ReviewAction | null>(null);
  const [bankReference, setBankReference] = useState("");
  const [reason, setReason] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [drawerDate, setDrawerDate] = useState(clinicTodayISO());
  const [drawer, setDrawer] = useState<CashDrawerDay | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [countedAmount, setCountedAmount] = useState("");
  const [drawerNote, setDrawerNote] = useState("");
  const [closingDrawer, setClosingDrawer] = useState(false);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getVerificationSubmissions(status);
      setSubmissions(result.submissions ?? []);
    } catch (err) {
      toast.error(localizedApiErrorMessage(err, t, t("verif.loadFailed")));
    } finally {
      setLoading(false);
    }
  }, [status, t]);

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
    void loadSubmissions();
  }, [loadSubmissions]);

  useEffect(() => {
    void loadDrawer(drawerDate);
  }, [drawerDate, loadDrawer]);

  const openEvidence = async (submission: VerificationSubmission) => {
    setEvidenceBusyId(submission.id);
    try {
      const { url } = await getVerificationEvidenceUrl(submission.id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(localizedApiErrorMessage(err, t, t("verif.evidenceFailed")));
    } finally {
      setEvidenceBusyId(null);
    }
  };

  const openReview = (action: ReviewAction) => {
    setReviewAction(action);
    setBankReference("");
    setReason("");
    setReviewNote("");
  };

  const submitReview = async () => {
    if (!reviewAction || reviewing) return;
    if (
      reviewAction.mode === "approve" &&
      !canApproveVerification({ bankTransactionReference: bankReference })
    ) {
      toast.error(t("verif.bankRefRequired"));
      return;
    }
    if (reviewAction.mode === "reject" && !canRejectVerification({ reason })) {
      toast.error(t("verif.reasonRequired"));
      return;
    }
    setReviewing(true);
    try {
      if (reviewAction.mode === "approve") {
        await approveVerification(reviewAction.submission.id, {
          bankTransactionReference: bankReference,
          ...(reviewNote.trim() ? { note: reviewNote } : {}),
        });
        toast.success(t("verif.approved"));
      } else {
        await rejectVerification(reviewAction.submission.id, { reason });
        toast.success(t("verif.rejectedDone"));
      }
      setReviewAction(null);
      await loadSubmissions();
    } catch (err) {
      toast.error(localizedApiErrorMessage(err, t, t("dash.toast.error")));
    } finally {
      setReviewing(false);
    }
  };

  const submitDrawer = async () => {
    const amount = Number(countedAmount);
    if (!Number.isFinite(amount) || amount < 0) {
      toast.error(t("verif.drawerInvalid"));
      return;
    }
    setClosingDrawer(true);
    try {
      await closeCashDrawer({
        countedAmount: amount,
        ...(drawerNote.trim() ? { note: drawerNote } : {}),
      });
      toast.success(t("verif.drawerSaved"));
      setDrawerNote("");
      await loadDrawer(drawerDate);
    } catch (err) {
      toast.error(localizedApiErrorMessage(err, t, t("dash.toast.error")));
    } finally {
      setClosingDrawer(false);
    }
  };

  const reviewValid = reviewAction
    ? reviewAction.mode === "approve"
      ? canApproveVerification({ bankTransactionReference: bankReference })
      : canRejectVerification({ reason })
    : false;

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
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Landmark className="size-4 text-primary" /> {t("verif.queueTitle")}
              </CardTitle>
              <CardDescription>{t("verif.queueDesc")}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="verif-status" className="text-xs text-muted-foreground">
                {t("verif.status")}
              </Label>
              <select
                id="verif-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as VerificationDecision)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              >
                {DECISIONS.map((decision) => (
                  <option key={decision} value={decision}>
                    {t(`verif.status.${decision}`)}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void loadSubmissions()}
                disabled={loading}
              >
                <RefreshCw className={cn("size-4", loading && "animate-spin")} />
                {t("dash.refresh")}
              </Button>
            </div>
          </div>
          <p className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs text-amber-600">
            {t("verif.bankWarning")}
          </p>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">
              {loading ? t("dash.loading") : t("dash.empty")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("verif.order")}</TableHead>
                    <TableHead>{t("verif.customer")}</TableHead>
                    <TableHead>{t("verif.details")}</TableHead>
                    <TableHead>{t("payments.amount")}</TableHead>
                    <TableHead>{t("dash.date")}</TableHead>
                    <TableHead>{t("verif.status")}</TableHead>
                    <TableHead className="text-end">{t("dash.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="font-mono text-xs">{submission.orderId}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">
                          {submission.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{submission.customerName}</div>
                        <div className="text-xs text-muted-foreground">{submission.phone}</div>
                      </TableCell>
                      <TableCell className="max-w-[240px]">
                        <div className="text-xs">{submission.senderName}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          {submission.customerRef}
                        </div>
                        {submission.transferredAt && (
                          <div className="text-[11px] text-muted-foreground">
                            {formatTime(submission.transferredAt, lang)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-bold">
                        {formatMoney(submission.total, settings.currency)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs">
                        {formatTime(submission.createdAt, lang)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn("border-transparent", decisionTone(submission.decision))}
                        >
                          {t(`verif.status.${submission.decision}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2"
                            disabled={evidenceBusyId === submission.id || !submission.evidenceKey}
                            onClick={() => void openEvidence(submission)}
                          >
                            <FileImage className="size-3.5" />
                            {t("verif.viewEvidence")}
                          </Button>
                          {submission.decision === "submitted" ||
                          submission.decision === "under_review" ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 border-success/30 px-2 text-success hover:bg-success/10 hover:text-success"
                                onClick={() => openReview({ submission, mode: "approve" })}
                              >
                                <CheckCircle2 className="size-3.5" />
                                {t("verif.approve")}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-destructive hover:text-destructive"
                                onClick={() => openReview({ submission, mode: "reject" })}
                              >
                                <XCircle className="size-3.5" />
                                {t("verif.reject")}
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
          <div>
            <Button
              onClick={() => void submitDrawer()}
              disabled={closingDrawer}
              className="w-full sm:w-auto"
            >
              {closingDrawer ? t("dash.saving") : t("verif.drawerClose")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={Boolean(reviewAction)} onOpenChange={(open) => !open && setReviewAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {reviewAction?.mode === "reject" ? t("verif.reject") : t("verif.approve")}
            </DialogTitle>
            <DialogDescription>
              {reviewAction?.submission.orderId} · {reviewAction?.submission.customerRef}
            </DialogDescription>
          </DialogHeader>
          <p className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs text-amber-600">
            {t("verif.bankWarning")}
          </p>
          <div className="grid gap-4">
            {reviewAction?.mode === "approve" ? (
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
            {reviewAction?.mode === "approve" && (
              <div>
                <Label htmlFor="review-note">{t("verif.note")}</Label>
                <Textarea
                  id="review-note"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="mt-1.5"
                  rows={2}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" disabled={reviewing} onClick={() => setReviewAction(null)}>
              {t("payments.cancel")}
            </Button>
            <Button onClick={() => void submitReview()} disabled={reviewing || !reviewValid}>
              {reviewing
                ? t("dash.saving")
                : reviewAction?.mode === "reject"
                  ? t("verif.reject")
                  : t("verif.approve")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
