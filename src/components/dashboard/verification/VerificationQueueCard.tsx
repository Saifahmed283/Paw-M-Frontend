import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, FileImage, Landmark, RefreshCw, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localizedApiErrorMessage } from "@/lib/api";
import { useClinicStore } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import {
  getVerificationEvidenceUrl,
  isActionableVerification,
  type VerificationFilter,
  type VerificationSubmission,
} from "@/lib/payment-verification";
import { cn } from "@/lib/utils";
import { formatMoney, formatTime } from "../dashboard-format";
import type { ReviewAction } from "./ReviewDialog";
import { decisionTone, FILTERS } from "./presentation";

export function VerificationQueueCard({
  submissions,
  loading,
  status,
  focusOrderId,
  onStatusChange,
  onReload,
  onReview,
  onClearFocus,
}: {
  submissions: VerificationSubmission[];
  loading: boolean;
  status: VerificationFilter;
  focusOrderId: string | undefined;
  onStatusChange: (status: VerificationFilter) => void;
  onReload: () => void;
  onReview: (action: ReviewAction) => void;
  onClearFocus: () => void;
}) {
  const { t, lang } = useI18n();
  const { settings } = useClinicStore();
  const [evidenceBusyId, setEvidenceBusyId] = useState<string | null>(null);

  const openEvidence = (submission: VerificationSubmission) => {
    if (!submission.evidenceKey || evidenceBusyId) return;
    setEvidenceBusyId(submission.id);
    // Reserve the tab inside the click gesture. Opening it after the signed
    // URL resolves is treated as a popup by browsers and silently blocked.
    const tab = window.open("", "_blank");
    getVerificationEvidenceUrl(submission.id)
      .then(({ url }) => {
        if (tab) {
          tab.opener = null;
          tab.location.assign(url);
        } else {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      })
      .catch((err) => {
        tab?.close();
        toast.error(localizedApiErrorMessage(err, t, t("verif.evidenceFailed")));
      })
      .finally(() => setEvidenceBusyId(null));
  };

  return (
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
              onChange={(e) => onStatusChange(e.target.value as VerificationFilter)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
            >
              {FILTERS.map((filter) => (
                <option key={filter} value={filter}>
                  {filter === "all" ? t("verif.filterAll") : t(`verif.status.${filter}`)}
                </option>
              ))}
            </select>
            <Button size="sm" variant="outline" onClick={onReload} disabled={loading}>
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
              {t("dash.refresh")}
            </Button>
          </div>
        </div>
        {focusOrderId && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary-tint px-3 py-2 text-xs">
            <span>{t("verif.focusedOrder", { orderId: focusOrderId })}</span>
            <Button size="sm" variant="ghost" className="h-6 px-2" onClick={onClearFocus}>
              {t("verif.clearFocus")}
            </Button>
          </div>
        )}
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
                {submissions.map((submission) => {
                  const actionable = isActionableVerification(submission.decision);
                  return (
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
                        <div className="text-xs">
                          {submission.senderName || t(`checkout.method.${submission.method}.short`)}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          {submission.customerRef || submission.note || t("verif.awaitingProof")}
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
                          {submission.evidenceKey && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2"
                              disabled={evidenceBusyId === submission.id}
                              onClick={() => openEvidence(submission)}
                            >
                              <FileImage className="size-3.5" />
                              {t("verif.viewEvidence")}
                            </Button>
                          )}
                          {actionable && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 border-success/30 px-2 text-success hover:bg-success/10 hover:text-success"
                                onClick={() => onReview({ mode: "approve", submission })}
                              >
                                <CheckCircle2 className="size-3.5" />
                                {t("verif.approve")}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-destructive hover:text-destructive"
                                onClick={() => onReview({ mode: "reject", submission })}
                              >
                                <XCircle className="size-3.5" />
                                {t("verif.reject")}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
