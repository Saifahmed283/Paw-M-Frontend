import { useMemo, useState } from "react";
import {
  Activity,
  Bath,
  FolderHeart,
  FlaskConical,
  Pill,
  Plus,
  Salad,
  ScanLine,
  Scissors,
  Siren,
  Sparkles,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
  onAdd: (service: ServiceItem, note: string) => void;
};

export function ClinicServicePanel({ services, currency, onAdd }: Props) {
  const { t } = useI18n();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const selected = useMemo(
    () => services.find((s) => s.slug === selectedSlug) ?? null,
    [services, selectedSlug],
  );

  const add = () => {
    if (!selected) return;
    onAdd(selected, note.trim());
    setNote("");
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{t("cashier.clinicServiceDesc")}</p>

      {services.length === 0 ? (
        <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          {t("cashier.noServices")}
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.icon] ?? Stethoscope;
            const active = selectedSlug === service.slug;
            return (
              <button
                key={service.slug}
                type="button"
                onClick={() => setSelectedSlug(service.slug)}
                aria-pressed={active}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-3 text-start transition-colors",
                  active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg",
                    active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{service.title}</span>
                    <span className="shrink-0 text-sm font-bold">
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

      <div className="space-y-1.5">
        <Label htmlFor="cashier-service-note" className="text-xs text-muted-foreground">
          {t("cashier.serviceNote")} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="cashier-service-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("cashier.serviceNotePlaceholder")}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">{t("cashier.serviceNoteHint")}</p>
      </div>

      <Button onClick={add} disabled={!selected} className="w-full">
        <Plus className="size-4 me-1.5" />
        {t("cashier.addService")}
      </Button>
    </div>
  );
}
