import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import type { PaymentKind, PaymentMethod, PaymentStatus, Status } from "@/lib/clinic-store";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, testId }: { status: Status; testId?: string }) {
  const { t } = useI18n();
  const styles: Record<Status, string> = {
    pending: "bg-[var(--gold-tint)] text-[var(--gold-700)] dark:text-[var(--gold-300)]",
    confirmed: "bg-[var(--accent-tint)] text-[var(--blue-700)] dark:text-[var(--blue-400)]",
    completed: "bg-[var(--primary-tint)] text-[var(--blue-700)] dark:text-[var(--blue-400)]",
    cancelled: "bg-[var(--surface-2)] text-ink-soft line-through",
  };
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent", styles[status])}
      data-testid={testId}
    >
      {t(`dash.status.${status}`)}
    </Badge>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  const { t } = useI18n();
  const styles: Record<PaymentMethod, string> = {
    cash: "bg-[var(--gold-tint)] text-[var(--gold-700)] dark:text-[var(--gold-300)]",
    fawry: "bg-[var(--primary-tint)] text-[var(--blue-700)] dark:text-[var(--blue-400)]",
    instapay: "bg-[var(--accent-tint)] text-[var(--blue-700)] dark:text-[var(--blue-400)]",
  };
  return (
    <Badge variant="outline" className={cn("border-transparent", styles[method])}>
      {t(`checkout.method.${method}.short`)}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { t } = useI18n();
  if (status === "paid") {
    return (
      <Badge className="border-transparent bg-[var(--accent-tint)] text-[var(--blue-700)] dark:text-[var(--blue-400)]">
        {t("pay.paid")}
      </Badge>
    );
  }
  if (status === "proof_submitted" || status === "under_review") {
    return (
      <Badge className="border-transparent bg-[var(--gold-tint)] text-[var(--gold-700)] dark:text-[var(--gold-300)]">
        {t("pay.underReview")}
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge className="border-transparent bg-[var(--urgent-tint)] text-[var(--urgent)]">
        {t("verif.rejected")}
      </Badge>
    );
  }
  return (
    <Badge className="border-transparent bg-[var(--surface-2)] text-ink-soft">
      {t("pay.unpaid")}
    </Badge>
  );
}

export function PaymentKindBadge({ kind }: { kind: PaymentKind }) {
  const { t } = useI18n();
  const styles: Record<PaymentKind, string> = {
    order: "bg-[var(--gold-tint)] text-[var(--gold-700)] dark:text-[var(--gold-300)]",
    visit: "bg-[var(--primary-tint)] text-[var(--blue-700)] dark:text-[var(--blue-400)]",
    manual: "bg-[var(--surface-2)] text-ink-soft",
    refund: "bg-[var(--urgent-tint)] text-[var(--urgent)]",
  };
  return (
    <Badge variant="outline" className={cn("border-transparent", styles[kind ?? "manual"])}>
      {t(`payments.kind.${kind ?? "manual"}`)}
    </Badge>
  );
}
