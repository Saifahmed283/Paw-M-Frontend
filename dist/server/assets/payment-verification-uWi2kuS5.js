import { c as api } from "./i18n-B17xJ44j.js";
import { z as invalidateFinance } from "./router-A82Obkr4.js";
// src/lib/payment-verification.ts
/** Only these methods can be chosen in store and cashier flows. */
var STORE_CHECKOUT_METHODS = ["cash", "instapay"];
function canSubmitTransfer(order) {
	return order.paymentMethod === "instapay" && (order.paymentStatus === "unpaid" || order.paymentStatus === "rejected");
}
function showCashPickupNotice(order) {
	return order.paymentMethod === "cash" && order.paymentStatus !== "paid";
}
/** Mixed-method splits cannot be settled by a single trusted verification path. */
function usesSinglePaymentMethod(allocations) {
	return allocations.every((a) => a.method === allocations[0]?.method);
}
function canConfirmCashReceived(order) {
	return order.paymentMethod === "cash" && order.paymentStatus !== "paid";
}
/** Client-side guard only; a correct backend must still validate the amount. */
function cashAmountMatches(total, amountReceived) {
	return Number.isFinite(total) && Number.isFinite(amountReceived) && Math.abs(total - amountReceived) < .005;
}
function canMarkOrderCompleted(order) {
	return order.paymentStatus === "paid";
}
/** Order payments are settled through order verification, never from Finance. */
function isOrderPayment(payment) {
	return payment.kind === "order" || Boolean(payment.orderId);
}
function canSettlePayment(payment) {
	return !isOrderPayment(payment) && payment.status !== "paid";
}
function canApproveVerification(input) {
	return input.bankTransactionReference.trim().length > 0;
}
function canRejectVerification(input) {
	return input.reason.trim().length > 0;
}
function varianceTone(variance) {
	if (!Number.isFinite(variance) || Math.abs(variance) < .005) return "neutral";
	return variance > 0 ? "positive" : "negative";
}
async function submitTransferSubmission(orderId, input) {
	try {
		const result = await api.post(`/orders/${encodeURIComponent(orderId)}/transfer-submission`, {
			senderName: input.senderName.trim(),
			transferReference: input.transferReference.trim(),
			...input.transferredAt ? { transferredAt: input.transferredAt } : {},
			...input.evidenceBase64 ? { evidenceBase64: input.evidenceBase64 } : {},
			...input.note?.trim() ? { note: input.note.trim() } : {},
			...input.phone ? { phone: input.phone } : {}
		});
		invalidateFinance();
		return result;
	} catch (err) {
		console.error("Failed to submit transfer details", err);
		throw err;
	}
}
async function confirmCashReceived(orderId, input) {
	try {
		const updated = await api.post(`/orders/${encodeURIComponent(orderId)}/confirm-cash`, {
			amountReceived: input.amountReceived,
			...input.note?.trim() ? { note: input.note.trim() } : {}
		});
		invalidateFinance();
		return updated;
	} catch (err) {
		console.error("Failed to confirm cash receipt", err);
		throw err;
	}
}
async function getVerificationSubmissions(status = "submitted") {
	const query = status === "all" ? "" : `?status=${encodeURIComponent(status)}`;
	return api.get(`/payment-verification/admin/submissions${query}`);
}
async function approveVerification(verificationId, input) {
	try {
		const updated = await api.post(`/payment-verification/admin/${encodeURIComponent(verificationId)}/approve`, {
			bankTransactionReference: input.bankTransactionReference.trim(),
			...input.note?.trim() ? { note: input.note.trim() } : {}
		});
		invalidateFinance();
		return updated;
	} catch (err) {
		console.error("Failed to approve transfer", err);
		throw err;
	}
}
async function rejectVerification(verificationId, input) {
	try {
		const updated = await api.post(`/payment-verification/admin/${encodeURIComponent(verificationId)}/reject`, { reason: input.reason.trim() });
		invalidateFinance();
		return updated;
	} catch (err) {
		console.error("Failed to reject transfer", err);
		throw err;
	}
}
async function getVerificationEvidenceUrl(verificationId) {
	return api.get(`/payment-verification/admin/${encodeURIComponent(verificationId)}/evidence-url`);
}
async function closeCashDrawer(input) {
	try {
		const result = await api.post("/payment-verification/admin/cash-drawer/close", {
			countedAmount: input.countedAmount,
			...input.note?.trim() ? { note: input.note.trim() } : {}
		});
		invalidateFinance();
		return result;
	} catch (err) {
		console.error("Failed to close cash drawer", err);
		throw err;
	}
}
async function getCashDrawer(date) {
	return api.get(`/payment-verification/admin/cash-drawer?date=${encodeURIComponent(date)}`);
}
export { showCashPickupNotice as _, canMarkOrderCompleted as a, varianceTone as b, canSubmitTransfer as c, confirmCashReceived as d, getCashDrawer as f, rejectVerification as g, isOrderPayment as h, canConfirmCashReceived as i, cashAmountMatches as l, getVerificationSubmissions as m, approveVerification as n, canRejectVerification as o, getVerificationEvidenceUrl as p, canApproveVerification as r, canSettlePayment as s, STORE_CHECKOUT_METHODS as t, closeCashDrawer as u, submitTransferSubmission as v, usesSinglePaymentMethod as y };
