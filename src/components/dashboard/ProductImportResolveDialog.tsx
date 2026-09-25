import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useClinicStore,
  type ProductImportMode,
  type ProductImportPreviewRow,
} from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const DIFF_FIELDS = [
  { key: "name", label: "dash.form.product.name" },
  { key: "price", label: "dash.form.product.price" },
  { key: "stock", label: "dash.form.product.stock" },
  { key: "category", label: "dash.form.product.category" },
  { key: "petType", label: "dash.form.product.petType" },
  { key: "barcode", label: "dash.form.product.barcode" },
] as const;

const DESCRIPTION_PREVIEW = 48;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rows: ProductImportPreviewRow[];
  newCount: number;
  resolutions: Record<number, ProductImportMode>;
  onResolutionChange: (index: number, mode: ProductImportMode) => void;
  onBulkChange: (mode: ProductImportMode) => void;
  onConfirm: () => void;
  importing: boolean;
};

export function ProductImportResolveDialog({
  open,
  onOpenChange,
  rows,
  newCount,
  resolutions,
  onResolutionChange,
  onBulkChange,
  onConfirm,
  importing,
}: Props) {
  const { t } = useI18n();
  const { settings } = useClinicStore();

  const formatPrice = (value: number) =>
    settings.currency === "$" ? `$${value.toFixed(2)}` : `${settings.currency} ${value.toFixed(2)}`;

  const showValue = (field: string, source: Record<string, unknown>) => {
    if (field === "price") return formatPrice(Number(source["price"] ?? 0));
    const value = source[field];
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
  };

  const updatedCount = useMemo(
    () => rows.filter((row) => resolutions[row.index] === "replace").length,
    [rows, resolutions],
  );
  const keptCount = rows.length - updatedCount;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !importing) onOpenChange(false);
      }}
    >
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("dash.importProductsDuplicatesTitle")}</DialogTitle>
          <DialogDescription>
            {t("dash.importProductsDuplicatesDescription", { count: String(rows.length) })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {t("dash.importProductsPlan", {
              added: String(newCount),
              updated: String(updatedCount),
              kept: String(keptCount),
            })}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={importing}
              onClick={() => onBulkChange("skip")}
            >
              {t("dash.importProductsKeepAll")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={importing}
              onClick={() => onBulkChange("replace")}
            >
              {t("dash.importProductsUpdateAll")}
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border">
          {rows.map((row) => {
            const mode = resolutions[row.index] ?? "skip";
            const existing = row.existing;
            const changes = existing
              ? DIFF_FIELDS.map((field) => ({
                  label: t(field.label),
                  from: showValue(field.key, existing as unknown as Record<string, unknown>),
                  to: showValue(field.key, row.item as unknown as Record<string, unknown>),
                })).filter((change) => change.from !== change.to)
              : [];
            const descriptionChanged =
              existing !== null && existing.description.trim() !== row.item.description.trim();
            const unchanged = existing !== null && changes.length === 0 && !descriptionChanged;

            return (
              <div
                key={row.index}
                className="flex flex-col gap-2 border-b p-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-medium">{row.item.name}</p>
                  {existing ? (
                    changes.length > 0 ? (
                      <ul className="space-y-0.5 text-xs text-muted-foreground">
                        {changes.map((change) => (
                          <li key={change.label} className="flex flex-wrap items-center gap-1.5">
                            <span>{change.label}</span>
                            <span className="line-through">{change.from}</span>
                            <span aria-hidden="true">&rarr;</span>
                            <span className="font-medium text-foreground">{change.to}</span>
                          </li>
                        ))}
                        {descriptionChanged && (
                          <li className="flex flex-wrap items-center gap-1.5">
                            <span>{t("dash.form.product.desc")}</span>
                            <span className="line-through">
                              {existing.description.slice(0, DESCRIPTION_PREVIEW)}
                            </span>
                            <span aria-hidden="true">&rarr;</span>
                            <span className="font-medium text-foreground">
                              {row.item.description.slice(0, DESCRIPTION_PREVIEW)}
                            </span>
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {unchanged ? t("dash.importProductsNoChanges") : null}
                      </p>
                    )
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {t("dash.importProductsRepeatRow")}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="sm"
                    variant={mode === "skip" ? "secondary" : "ghost"}
                    disabled={importing}
                    aria-pressed={mode === "skip"}
                    onClick={() => onResolutionChange(row.index, "skip")}
                  >
                    {t("dash.importProductsKeepCurrent")}
                  </Button>
                  <Button
                    size="sm"
                    variant={mode === "replace" ? "secondary" : "ghost"}
                    className={cn(mode === "replace" && "text-amber-700 hover:text-amber-800")}
                    disabled={importing}
                    aria-pressed={mode === "replace"}
                    onClick={() => onResolutionChange(row.index, "replace")}
                  >
                    {t("dash.importProductsUpdateExisting")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" disabled={importing} onClick={() => onOpenChange(false)}>
            {t("dash.cancel")}
          </Button>
          <Button disabled={importing} onClick={onConfirm}>
            {importing
              ? t("dash.importing")
              : t("dash.importProductsConfirm", {
                  added: String(newCount),
                  updated: String(updatedCount),
                })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
