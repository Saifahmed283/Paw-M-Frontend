import { api } from "@/lib/api";
import type { CashWithdrawal } from "@/lib/clinic-store";

export type CashWithdrawalDay = {
  date: string;
  available: number;
  expected: number;
  counted: number | null;
  openingAmount: number;
  reserved: number;
  close: {
    id: string;
    date: string;
    expected: number;
    counted: number;
    variance: number;
    note: string;
    countedBy: number;
    createdAt: string;
  } | null;
  withdrawals: CashWithdrawal[];
};

type WithdrawalResult = {
  withdrawal: CashWithdrawal;
  available?: number;
};

export async function getCashWithdrawals(date: string): Promise<CashWithdrawalDay> {
  return api.get<CashWithdrawalDay>(
    `/cash-withdrawals?date=${encodeURIComponent(date)}&status=all`,
  );
}

export async function requestCashWithdrawal(
  date: string,
  input: { amount: number; note: string },
): Promise<WithdrawalResult> {
  return api.post<WithdrawalResult>("/cash-withdrawals", {
    date,
    amount: input.amount,
    note: input.note.trim(),
  });
}

export async function approveCashWithdrawal(
  id: string,
  input: { note?: string } = {},
): Promise<WithdrawalResult> {
  return api.post<WithdrawalResult>(`/cash-withdrawals/${encodeURIComponent(id)}/approve`, {
    note: input.note?.trim() ?? "",
  });
}

export async function rejectCashWithdrawal(
  id: string,
  input: { reason: string },
): Promise<WithdrawalResult> {
  return api.post<WithdrawalResult>(`/cash-withdrawals/${encodeURIComponent(id)}/reject`, {
    reason: input.reason.trim(),
  });
}
