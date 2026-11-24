import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { createOrder } from "@/lib/clinic-store";
import {
  STORE_CHECKOUT_METHODS,
  approveVerification,
  canApproveVerification,
  canConfirmCashReceived,
  canMarkOrderCompleted,
  canRejectVerification,
  canSettlePayment,
  canSubmitTransfer,
  cashAmountMatches,
  closeCashDrawer,
  confirmCashReceived,
  getCashDrawer,
  getVerificationEvidenceUrl,
  getVerificationSubmissions,
  isActionableVerification,
  isOrderPayment,
  rejectVerification,
  showCashPickupNotice,
  submitTransferSubmission,
  usesSinglePaymentMethod,
  varianceTone,
} from "@/lib/payment-verification";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
    getPage: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

beforeEach(() => {
  vi.mocked(api.get).mockReset();
  vi.mocked(api.post).mockReset();
  vi.mocked(api.patch).mockReset();
});

describe("store checkout methods", () => {
  it("offers cash, Fawry and InstaPay", () => {
    expect([...STORE_CHECKOUT_METHODS]).toEqual(["cash", "fawry", "instapay"]);
  });

  it("does not generate a client payment reference when an order is created", async () => {
    vi.mocked(api.post).mockResolvedValue({
      id: "ord-1",
      paymentMethod: "instapay",
    });
    await createOrder({
      customerName: "Test",
      phone: "123",
      email: "t@t.com",
      address: "",
      items: [{ id: "p1", name: "Food", price: 10, qty: 1 }],
      paymentMethod: "instapay",
    });

    const body = vi.mocked(api.post).mock.calls[0]?.[1];
    expect(body).toEqual(expect.objectContaining({ paymentMethod: "instapay" }));
    expect(body).not.toHaveProperty("paymentRef");
    expect(body).not.toHaveProperty("proofImage");
  });

  it("sends POS cash receipt fields when the till takes cash", async () => {
    vi.mocked(api.post).mockResolvedValue({ id: "ord-2", paymentMethod: "cash" });
    await createOrder({
      customerName: "Walk-in",
      phone: "",
      email: "",
      address: "",
      items: [{ id: "p1", name: "Food", price: 100, qty: 1 }],
      paymentMethod: "cash",
      source: "pos",
      cashReceived: true,
      cashReceivedAmount: 100,
    });

    expect(api.post).toHaveBeenCalledWith(
      "/orders",
      expect.objectContaining({
        source: "pos",
        cashReceived: true,
        cashReceivedAmount: 100,
      }),
    );
  });
});

describe("verification UI guards", () => {
  it("allows proof details for unpaid or rejected Fawry and InstaPay orders only", () => {
    for (const method of ["fawry", "instapay"] as const) {
      expect(canSubmitTransfer({ paymentMethod: method, paymentStatus: "unpaid" })).toBe(true);
      expect(canSubmitTransfer({ paymentMethod: method, paymentStatus: "rejected" })).toBe(true);
      expect(canSubmitTransfer({ paymentMethod: method, paymentStatus: "proof_submitted" })).toBe(
        false,
      );
      expect(canSubmitTransfer({ paymentMethod: method, paymentStatus: "under_review" })).toBe(
        false,
      );
      expect(canSubmitTransfer({ paymentMethod: method, paymentStatus: "paid" })).toBe(false);
    }
    expect(canSubmitTransfer({ paymentMethod: "cash", paymentStatus: "unpaid" })).toBe(false);
  });

  it("shows cash pickup and confirmation only for unpaid cash orders", () => {
    expect(showCashPickupNotice({ paymentMethod: "cash", paymentStatus: "unpaid" })).toBe(true);
    expect(showCashPickupNotice({ paymentMethod: "cash", paymentStatus: "paid" })).toBe(false);
    expect(canConfirmCashReceived({ paymentMethod: "cash", paymentStatus: "unpaid" })).toBe(true);
    expect(canConfirmCashReceived({ paymentMethod: "instapay", paymentStatus: "unpaid" })).toBe(
      false,
    );
  });

  it("matches cash amounts to the cent and gates completion on payment", () => {
    expect(cashAmountMatches(100, 100)).toBe(true);
    expect(cashAmountMatches(100, 99.99)).toBe(false);
    expect(canMarkOrderCompleted({ paymentStatus: "paid" })).toBe(true);
    expect(canMarkOrderCompleted({ paymentStatus: "under_review" })).toBe(false);
  });

  it("rejects mixed cash and proof-based allocations", () => {
    expect(usesSinglePaymentMethod([])).toBe(true);
    expect(usesSinglePaymentMethod([{ method: "cash" }])).toBe(true);
    expect(usesSinglePaymentMethod([{ method: "cash" }, { method: "cash" }])).toBe(true);
    expect(usesSinglePaymentMethod([{ method: "cash" }, { method: "instapay" }])).toBe(false);
    expect(usesSinglePaymentMethod([{ method: "cash" }, { method: "fawry" }])).toBe(false);
    expect(usesSinglePaymentMethod([{ method: "fawry" }, { method: "instapay" }])).toBe(false);
  });

  it("keeps order-kind payments out of manual settlement", () => {
    expect(isOrderPayment({ kind: "order", orderId: null })).toBe(true);
    expect(isOrderPayment({ kind: "manual", orderId: "ord-1" })).toBe(true);
    expect(isOrderPayment({ kind: "visit", orderId: null })).toBe(false);
    expect(canSettlePayment({ kind: "order", orderId: null, status: "unpaid" })).toBe(false);
    expect(canSettlePayment({ kind: "visit", orderId: null, status: "unpaid" })).toBe(true);
    expect(canSettlePayment({ kind: "manual", orderId: null, status: "paid" })).toBe(false);
  });
});

describe("transfer submission API", () => {
  it("posts the new transfer payload to the order endpoint", async () => {
    vi.mocked(api.post).mockResolvedValue({
      id: "ver-1",
      decision: "submitted",
      createdAt: "2026-11-20T10:00:00.000Z",
    });

    await submitTransferSubmission("ord-1", {
      senderName: "  Sender  ",
      transferReference: "  TRX-1  ",
      transferredAt: "2026-11-20T09:00:00.000Z",
      evidenceBase64: "data:image/png;base64,AA",
      note: "  note  ",
      phone: "123",
    });

    expect(api.post).toHaveBeenCalledWith("/orders/ord-1/transfer-submission", {
      senderName: "Sender",
      transferReference: "TRX-1",
      transferredAt: "2026-11-20T09:00:00.000Z",
      evidenceBase64: "data:image/png;base64,AA",
      note: "note",
      phone: "123",
    });
  });

  it("omits optional fields instead of sending empty values", async () => {
    vi.mocked(api.post).mockResolvedValue({
      id: "ver-2",
      decision: "under_review",
      createdAt: "2026-11-20T10:00:00.000Z",
    });

    await submitTransferSubmission("ord-2", {
      senderName: "Sender",
      transferReference: "TRX-2",
    });

    expect(api.post).toHaveBeenCalledWith("/orders/ord-2/transfer-submission", {
      senderName: "Sender",
      transferReference: "TRX-2",
    });
  });
});

describe("admin verification API", () => {
  it("loads submissions with the requested status", async () => {
    vi.mocked(api.get).mockResolvedValue({ submissions: [], total: 0 });
    await getVerificationSubmissions("submitted");
    expect(api.get).toHaveBeenCalledWith(
      "/payment-verification/admin/submissions?status=submitted",
    );
  });

  it("can focus the queue on the order the cashier just settled", async () => {
    vi.mocked(api.get).mockResolvedValue({ submissions: [], total: 0 });
    await getVerificationSubmissions("all", { orderId: "ORD-1" });
    expect(api.get).toHaveBeenCalledWith("/payment-verification/admin/submissions?orderId=ORD-1");
  });

  it("only treats submitted and under-review rows as actionable", () => {
    expect(isActionableVerification("submitted")).toBe(true);
    expect(isActionableVerification("under_review")).toBe(true);
    expect(isActionableVerification("approved")).toBe(false);
    expect(isActionableVerification("superseded")).toBe(false);
  });

  it("requires a bank transaction reference before approval", async () => {
    expect(canApproveVerification({ bankTransactionReference: "   " })).toBe(false);
    expect(canApproveVerification({ bankTransactionReference: "BANK-1" })).toBe(true);

    vi.mocked(api.post).mockResolvedValue({ id: "ver-1", decision: "approved" });
    await approveVerification("ver-1", {
      bankTransactionReference: "  BANK-1  ",
      note: " checked ",
    });
    expect(api.post).toHaveBeenCalledWith("/payment-verification/admin/ver-1/approve", {
      bankTransactionReference: "BANK-1",
      note: "checked",
    });
  });

  it("requires a reason before rejection", async () => {
    expect(canRejectVerification({ reason: "" })).toBe(false);
    expect(canRejectVerification({ reason: "No bank record" })).toBe(true);

    vi.mocked(api.post).mockResolvedValue({ id: "ver-1", decision: "rejected" });
    await rejectVerification("ver-1", { reason: "  No bank record  " });
    expect(api.post).toHaveBeenCalledWith("/payment-verification/admin/ver-1/reject", {
      reason: "No bank record",
    });
  });

  it("opens signed evidence URLs", async () => {
    vi.mocked(api.get).mockResolvedValue({
      url: "https://example.com/evidence",
      expiresAt: "2026-11-20T11:00:00.000Z",
    });
    await expect(getVerificationEvidenceUrl("ver-1")).resolves.toEqual({
      url: "https://example.com/evidence",
      expiresAt: "2026-11-20T11:00:00.000Z",
    });
    expect(api.get).toHaveBeenCalledWith("/payment-verification/admin/ver-1/evidence-url");
  });
});

describe("cash drawer", () => {
  it("loads the clinic day and reports variance direction", async () => {
    const close = {
      id: "drawer-1",
      date: "2026-11-20",
      expected: 100,
      counted: 95,
      variance: -5,
      countedBy: 7,
      note: "",
    };
    vi.mocked(api.get).mockResolvedValue({
      date: "2026-11-20",
      close,
      expected: 100,
      payments: [],
    });
    await expect(getCashDrawer("2026-11-20")).resolves.toEqual({
      date: "2026-11-20",
      close,
      expected: 100,
      payments: [],
    });
    expect(api.get).toHaveBeenCalledWith("/payment-verification/admin/cash-drawer?date=2026-11-20");
    expect(varianceTone(-5)).toBe("negative");
    expect(varianceTone(0)).toBe("neutral");
    expect(varianceTone(5)).toBe("positive");
  });

  it("closes the drawer with the counted amount", async () => {
    vi.mocked(api.post).mockResolvedValue({
      id: "drawer-1",
      date: "2026-11-20",
      expected: 100,
      counted: 98,
      variance: -2,
      countedBy: 7,
      note: "short",
    });
    await closeCashDrawer({ date: "2026-11-20", countedAmount: 98, note: " short " });
    expect(api.post).toHaveBeenCalledWith("/payment-verification/admin/cash-drawer/close", {
      date: "2026-11-20",
      countedAmount: 98,
      note: "short",
    });
  });

  it("confirms cash with the exact order total", async () => {
    vi.mocked(api.post).mockResolvedValue({ id: "ord-1", paymentStatus: "paid" });
    await confirmCashReceived("ord-1", { amountReceived: 100 });
    expect(api.post).toHaveBeenCalledWith("/orders/ord-1/confirm-cash", {
      amountReceived: 100,
    });
  });
});
