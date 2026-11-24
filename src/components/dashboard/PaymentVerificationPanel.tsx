import { useState } from "react";

import { useI18n } from "@/lib/i18n";
import type { VerificationFilter } from "@/lib/payment-verification";
import { CashDrawerCard } from "./verification/CashDrawerCard";
import { ReviewDialog, type ReviewAction } from "./verification/ReviewDialog";
import { useVerificationQueue } from "./verification/useVerificationQueue";
import { VerificationQueueCard } from "./verification/VerificationQueueCard";

/**
 * Admin payment-verification tab.
 *
 * The queue and the end-of-day cash drawer are deliberately separate cards:
 * one reviews individual bank/outlet transfers, the other reconciles physical
 * cash. The queue list lives in a hook so both stay easy to reason about.
 */
export function PaymentVerificationPanel({
  focusOrderId,
  onClearFocus,
}: {
  focusOrderId: string | undefined;
  onClearFocus?: () => void;
}) {
  const { t } = useI18n();
  const [reviewAction, setReviewAction] = useState<ReviewAction | null>(null);
  const queue = useVerificationQueue({ t, focusOrderId });

  const changeStatus = (next: VerificationFilter) => {
    // A focused sale must stay visible even when the chosen status would hide it.
    queue.setStatus(focusOrderId ? "all" : next);
  };

  return (
    <div className="grid gap-6">
      <VerificationQueueCard
        submissions={queue.submissions}
        loading={queue.loading}
        status={queue.status}
        focusOrderId={focusOrderId}
        onStatusChange={changeStatus}
        onReload={() => void queue.reload()}
        onReview={setReviewAction}
        onClearFocus={onClearFocus ?? (() => undefined)}
      />
      <CashDrawerCard />
      {reviewAction && (
        <ReviewDialog
          key={`${reviewAction.mode}-${reviewAction.submission.id}`}
          action={reviewAction}
          onClose={() => setReviewAction(null)}
          onReviewed={queue.reload}
        />
      )}
    </div>
  );
}
