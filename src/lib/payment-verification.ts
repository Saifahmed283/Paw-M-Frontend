import { api } from "@/lib/api";
import { invalidateFinance, type Order, type PaymentMethod } from "@/lib/clinic-store";

/** Only these methods can be chosen in store and cashier flows. */
export const STORE_CHECKOUT_METHODS = [
  "cash",
  "fawry",
  "instapay",
] as const satisfies readonly PaymentMethod[];

/** Orders settled by submitting evidence, not by cash confirmation. */
const PROOF_PAYMENT_METHODS: readonly PaymentMethod[] = ["fawry", "instapay"];

export type VerificationDecision =
  "submitted" | "under_review" | "approved" | "rejected" | "superseded";

export type VerificationSubmission = {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  total: number;
  createdAt: string;
  source: string;
  decision: VerificationDecision;
  customerRef: string;
  senderName: string;
  transferredAt: string;
  evidenceKey: string;
  note: string;
  reviewerId: string;
  reviewedAt: string;
  bankTransactionReference: string;
};

export type VerificationList = {
  submissions: VerificationSubmission[];
  total: number;
};

export type ApproveVerificationResult = {
  verification: VerificationSubmission;
  order: Order;
};

export type TransferSubmissionInput = {
  senderName: string;
  transferReference: string;
  transferredAt?: string | undefined;
  evidenceBase64?: string | undefined;
  note?: string | undefined;
  /** Sent only for guest (phone-owned) orders, matching the tracking proof flow. */
  phone?: string | undefined;
};

export type TransferSubmissionResult = {
  id: string;
  decision: VerificationDecision;
  createdAt: string;
};

export type CashDrawerClose = {
  id: string;
  date: string;
  expected: number;
  counted: number;
  variance: number;
  countedBy: number;
  note: string;
};

export type CashDrawerDay = {
  date: string;
  close: CashDrawerClose | null;
  expected: number;
  payments: Array<{
    id: string;
    orderId: string;
    method: string;
    amount: number;
    source: string;
    bankTransactionReference: string | null;
    customerName: string;
    createdAt: string;
  }>;
};

/* ── Pure UI guards (the backend remains authoritative) ───────────────────── */

export function isStoreCheckoutMethod(method: PaymentMethod): boolean {
  return (STORE_CHECKOUT_METHODS as readonly PaymentMethod[]).includes(method);
}

export function canSubmitTransfer(order: Pick<Order, "paymentMethod" | "paymentStatus">): boolean {
  // A submitted proof is already queued for review; the backend rejects
  // duplicate submissions until it is rejected or settled.
  return (
    PROOF_PAYMENT_METHODS.includes(order.paymentMethod) &&
    (order.paymentStatus === "unpaid" || order.paymentStatus === "rejected")
  );
}

export function showCashPickupNotice(
  order: Pick<Order, "paymentMethod" | "paymentStatus">,
): boolean {
  return order.paymentMethod === "cash" && order.paymentStatus !== "paid";
}

/** Mixed-method splits cannot be settled by a single trusted verification path
 * (cash is attested at the counter, Fawry/InstaPay need proof review). */
export function usesSinglePaymentMethod(
  allocations: readonly { method: PaymentMethod }[],
): boolean {
  return allocations.every((a) => a.method === allocations[0]?.method);
}

export function canConfirmCashReceived(
  order: Pick<Order, "paymentMethod" | "paymentStatus">,
): boolean {
  return order.paymentMethod === "cash" && order.paymentStatus !== "paid";
}

/** Client-side guard only; a correct backend must still validate the amount. */
export function cashAmountMatches(total: number, amountReceived: number): boolean {
  return (
    Number.isFinite(total) &&
    Number.isFinite(amountReceived) &&
    Math.abs(total - amountReceived) < 0.005
  );
}

export function canMarkOrderCompleted(order: Pick<Order, "paymentStatus">): boolean {
  return order.paymentStatus === "paid";
}

/** Order payments are settled through order verification, never from Finance. */
export function isOrderPayment(payment: {
  kind?: string | undefined;
  orderId?: string | null;
}): boolean {
  return payment.kind === "order" || Boolean(payment.orderId);
}

export function canSettlePayment(payment: {
  kind?: string | undefined;
  orderId?: string | null;
  status: string;
}): boolean {
  return !isOrderPayment(payment) && payment.status !== "paid";
}

export function canApproveVerification(input: { bankTransactionReference: string }): boolean {
  return input.bankTransactionReference.trim().length > 0;
}

export function canRejectVerification(input: { reason: string }): boolean {
  return input.reason.trim().length > 0;
}

export function varianceTone(variance: number): "positive" | "negative" | "neutral" {
  if (!Number.isFinite(variance) || Math.abs(variance) < 0.005) return "neutral";
  return variance > 0 ? "positive" : "negative";
}

/* ── API helpers (all paths are relative to the /api-prefixed base) ──────── */

export async function submitTransferSubmission(
  orderId: string,
  input: TransferSubmissionInput,
): Promise<TransferSubmissionResult> {
  try {
    const result = await api.post<TransferSubmissionResult>(
      `/orders/${encodeURIComponent(orderId)}/transfer-submission`,
      {
        senderName: input.senderName.trim(),
        transferReference: input.transferReference.trim(),
        ...(input.transferredAt ? { transferredAt: input.transferredAt } : {}),
        ...(input.evidenceBase64 ? { evidenceBase64: input.evidenceBase64 } : {}),
        ...(input.note?.trim() ? { note: input.note.trim() } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
      },
    );
    invalidateFinance();
    return result;
  } catch (err) {
    console.error("Failed to submit transfer details", err);
    throw err;
  }
}

export async function confirmCashReceived(
  orderId: string,
  input: { amountReceived: number; note?: string | undefined },
): Promise<Order> {
  try {
    const updated = await api.post<Order>(`/orders/${encodeURIComponent(orderId)}/confirm-cash`, {
      amountReceived: input.amountReceived,
      ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    });
    invalidateFinance();
    return updated;
  } catch (err) {
    console.error("Failed to confirm cash receipt", err);
    throw err;
  }
}

export async function getVerificationSubmissions(
  status: VerificationDecision | "all" = "submitted",
): Promise<VerificationList> {
  const query = status === "all" ? "" : `?status=${encodeURIComponent(status)}`;
  return api.get<VerificationList>(`/payment-verification/admin/submissions${query}`);
}

export async function approveVerification(
  verificationId: string,
  input: { bankTransactionReference: string; note?: string | undefined },
): Promise<ApproveVerificationResult> {
  try {
    const updated = await api.post<ApproveVerificationResult>(
      `/payment-verification/admin/${encodeURIComponent(verificationId)}/approve`,
      {
        bankTransactionReference: input.bankTransactionReference.trim(),
        ...(input.note?.trim() ? { note: input.note.trim() } : {}),
      },
    );
    invalidateFinance();
    return updated;
  } catch (err) {
    console.error("Failed to approve transfer", err);
    throw err;
  }
}

export async function rejectVerification(
  verificationId: string,
  input: { reason: string },
): Promise<VerificationSubmission> {
  try {
    const updated = await api.post<VerificationSubmission>(
      `/payment-verification/admin/${encodeURIComponent(verificationId)}/reject`,
      { reason: input.reason.trim() },
    );
    invalidateFinance();
    return updated;
  } catch (err) {
    console.error("Failed to reject transfer", err);
    throw err;
  }
}

export async function getVerificationEvidenceUrl(
  verificationId: string,
): Promise<{ url: string; expiresAt: string }> {
  return api.get<{ url: string; expiresAt: string }>(
    `/payment-verification/admin/${encodeURIComponent(verificationId)}/evidence-url`,
  );
}

export async function closeCashDrawer(input: {
  countedAmount: number;
  note?: string | undefined;
}): Promise<CashDrawerClose> {
  try {
    const result = await api.post<CashDrawerClose>(
      "/payment-verification/admin/cash-drawer/close",
      {
        countedAmount: input.countedAmount,
        ...(input.note?.trim() ? { note: input.note.trim() } : {}),
      },
    );
    invalidateFinance();
    return result;
  } catch (err) {
    console.error("Failed to close cash drawer", err);
    throw err;
  }
}

export async function getCashDrawer(date: string): Promise<CashDrawerDay> {
  return api.get<CashDrawerDay>(
    `/payment-verification/admin/cash-drawer?date=${encodeURIComponent(date)}`,
  );
}
