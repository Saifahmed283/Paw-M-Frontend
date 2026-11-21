import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ServiceItem } from "@/lib/clinic-store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

type Props = {
  services: ServiceItem[];
  currency: string;
  onAdd: (service: ServiceItem, price: number, note: string) => void;
};

/**
 * Compact till form: choose a service from the catalogue, confirm or adjust
 * the price for this visit, and add an optional note for the clinic team.
 */
export function ClinicServicePanel({ services, currency, onAdd }: Props) {
  const { t } = useI18n();

  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  if (services.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        {t("cashier.noServices")}
      </p>
    );
  }

  const selected = services.find((service) => service.slug === slug);
  const priceValue = Number.parseFloat(price);
  const validPrice = Number.isFinite(priceValue) && priceValue >= 0;

  const selectService = (nextSlug: string) => {
    const service = services.find((s) => s.slug === nextSlug);
    setSlug(nextSlug);
    setPrice(service ? String(Math.max(0, service.price ?? 0)) : "");
    setNote("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!selected || !validPrice) return;
    onAdd(selected, priceValue, note.trim());
    setNote("");
  };

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-xl border border-border bg-card p-4">
      <div className="grid gap-2">
        <Label htmlFor="cashier-service">{t("cashier.clinicService")}</Label>
        <Select value={slug} onValueChange={selectService}>
          <SelectTrigger id="cashier-service">
            <SelectValue placeholder={t("cashier.selectService")} />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.slug} value={service.slug}>
                {service.title} — {formatPrice(service.price ?? 0, currency)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="cashier-service-price">{t("cashier.servicePrice")}</Label>
          <Input
            id="cashier-service-price"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            disabled={!selected}
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cashier-service-note">{t("cashier.serviceNote")}</Label>
          <Textarea
            id="cashier-service-note"
            rows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t("cashier.serviceNotePlaceholder")}
            disabled={!selected}
            className="resize-none"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {selected ? t("cashier.servicePriceHint") : t("cashier.clinicServiceDesc")}
      </p>

      <Button type="submit" disabled={!selected || !validPrice} className="w-full sm:w-auto">
        <Plus className="me-2 size-4" />
        {t("cashier.addService")}
      </Button>
    </form>
  );
}
