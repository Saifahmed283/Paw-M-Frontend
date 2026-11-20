import { useMemo, useState } from "react";
import {
  Activity,
  Bath,
  Check,
  FolderHeart,
  FlaskConical,
  Pill,
  Plus,
  Salad,
  ScanLine,
  Scissors,
  Search,
  Siren,
  Sparkles,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ServiceItem } from "@/lib/clinic-store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Maps the icon names stored with clinic services to lucide components. */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  Activity,
  Bath,
  FolderHeart,
  FlaskConical,
  Pill,
  Salad,
  ScanLine,
  Scissors,
  Siren,
  Sparkles,
  Stethoscope,
  Syringe,
};

type Props = {
  services: ServiceItem[];
  currency: string;
  onAdd: (service: ServiceItem, price: number, note: string) => void;
};

export function ClinicServicePanel({ services, currency, onAdd }: Props) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  const visibleServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) => s.title.toLowerCase().includes(q) || (s.description ?? "").toLowerCase().includes(q),
    );
  }, [services, query]);

  const selected = useMemo(
    () => services.find((s) => s.slug === selectedSlug) ?? null,
    [services, selectedSlug],
  );
  const parsedPrice = Number(price);
  const validPrice = price.trim() !== "" && Number.isFinite(parsedPrice) && parsedPrice >= 0;

  const select = (service: ServiceItem) => {
    setSelectedSlug(service.slug);
    setPrice(String(service.price ?? 0));
  };

  const add = () => {
    if (!selected || !validPrice) return;
    onAdd(selected, Math.round(parsedPrice * 100) / 100, note.trim());
    setNote("");
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{t("cashier.clinicServiceDesc")}</p>

      {services.length > 0 && (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("dash.search")}
            className="h-10 pl-9"
            autoComplete="off"
          />
        </div>
      )}

      {services.length === 0 ? (
        <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          {t("cashier.noServices")}
        </p>
      ) : visibleServices.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">{t("dash.empty")}</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {visibleServices.map((service) => {
            const Icon = SERVICE_ICONS[service.icon] ?? Stethoscope;
            const active = selectedSlug === service.slug;
            return (
              <button
                key={service.slug}
                type="button"
                onClick={() => select(service)}
                aria-pressed={active}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl border p-2.5 text-start transition-all duration-200",
                  active
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm",
                )}
              >
                <span
                  className={cn(
                    "relative grid size-9 shrink-0 place-items-center rounded-lg",
                    active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {active && (
                    <span className="absolute -end-1 -top-1 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-2.5" />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{service.title}</span>
                    <span className="shrink-0 text-sm font-bold text-primary">
                      {formatPrice(service.price ?? 0, currency)}
                    </span>
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                    {service.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
        {selected && (
          <div className="flex items-center justify-between gap-2 border-b pb-2">
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <Check className="size-3.5" />
              </span>
              <span className="truncate">{selected.title}</span>
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatPrice(selected.price ?? 0, currency)}
            </span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="cashier-service-price" className="text-xs text-muted-foreground">
            {t("cashier.servicePrice")}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {currency}
            </span>
            <Input
              id="cashier-service-price"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="h-9 pl-10"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">{t("cashier.servicePriceHint")}</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cashier-service-note" className="text-xs text-muted-foreground">
            {t("cashier.serviceNote")} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="cashier-service-note"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("cashier.serviceNotePlaceholder")}
            className="resize-none"
          />
        </div>

        <Button onClick={add} disabled={!selected || !validPrice} className="w-full">
          <Plus className="size-4 me-1.5" />
          {t("cashier.addService")}
        </Button>
      </div>
    </div>
  );
}
