import type { VerificationDecision, VerificationFilter } from "@/lib/payment-verification";

export const DECISIONS: readonly VerificationDecision[] = [
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "superseded",
];

export const FILTERS: readonly VerificationFilter[] = ["all", ...DECISIONS];

export function decisionTone(decision: VerificationDecision): string {
  if (decision === "approved") return "bg-success/15 text-success";
  if (decision === "rejected") return "bg-destructive/15 text-destructive";
  if (decision === "under_review") return "bg-amber-500/15 text-amber-600";
  return "bg-muted text-muted-foreground";
}
