import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import type { PaymentMethod, Status } from "@/lib/clinic-store";
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

export function PaymentStatusBadge({ status }: { status: "unpaid" | "paid" }) {
  const { t } = useI18n();
  return status === "paid" ? (
    <Badge className="border-transparent bg-success/15 text-success">{t("pay.paid")}</Badge>
  ) : (
    <Badge className="border-transparent bg-muted text-muted-foreground">{t("pay.unpaid")}</Badge>
  );
}
