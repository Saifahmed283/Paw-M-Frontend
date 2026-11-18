import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import type { PaymentKind, PaymentMethod, PaymentStatus, Status } from "@/lib/clinic-store";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: Status }) {
  const { t } = useI18n();
  const styles: Record<Status, string> = {
    pending: "bg-amber-500/15 text-amber-600",
    confirmed: "bg-success/15 text-success",
    completed: "bg-primary/15 text-primary",
    cancelled: "bg-muted text-muted-foreground line-through",
  };
  return (
    <Badge variant="outline" className={cn("border-transparent", styles[status])}>
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
    cash: "bg-amber-500/15 text-amber-600",
    fawry: "bg-primary/15 text-primary",
    instapay: "bg-violet-500/15 text-violet-600",
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
      <Badge className="border-transparent bg-success/15 text-success">{t("pay.paid")}</Badge>
    );
  }
  if (status === "proof_submitted") {
    return (
      <Badge className="border-transparent bg-amber-500/15 text-amber-600">
        {t("pay.underReview")}
      </Badge>
    );
  }
  return (
    <Badge className="border-transparent bg-muted text-muted-foreground">{t("pay.unpaid")}</Badge>
  );
}

export function PaymentKindBadge({ kind }: { kind: PaymentKind }) {
  const { t } = useI18n();
  const styles: Record<PaymentKind, string> = {
    order: "bg-amber-500/15 text-amber-600",
    visit: "bg-primary/15 text-primary",
    manual: "bg-muted text-muted-foreground",
    refund: "bg-destructive/15 text-destructive",
  };
  return (
    <Badge variant="outline" className={cn("border-transparent", styles[kind ?? "manual"])}>
      {t(`payments.kind.${kind ?? "manual"}`)}
    </Badge>
  );
}
