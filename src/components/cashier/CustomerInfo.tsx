import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import type { CustomerInfo } from "./types";

type Props = {
  customer: CustomerInfo;
  onChange: (c: CustomerInfo) => void;
};

export function CustomerInfoPanel({ customer, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="customer-name" className="text-xs text-muted-foreground">
            {t("cashier.customerName")}
          </Label>
          <Input
            id="customer-name"
            value={customer.name}
            onChange={(e) => onChange({ ...customer, name: e.target.value })}
            placeholder={t("cashier.customerNamePlaceholder")}
            autoComplete="off"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="customer-phone" className="text-xs text-muted-foreground">
            {t("cashier.customerPhone")}
          </Label>
          <Input
            id="customer-phone"
            value={customer.phone}
            onChange={(e) => onChange({ ...customer, phone: e.target.value })}
            placeholder={t("cashier.customerPhonePlaceholder")}
            inputMode="tel"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
