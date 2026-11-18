import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, FileText, Pencil, Plus, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PaginationBar,
  SearchBox,
  SortChip,
  sortedSlice,
  useGrid,
  useSortState,
} from "@/components/dash-grid";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { listPrescriptions, updatePrescription, type Prescription } from "@/lib/client-medical";
import { PrescriptionDocument, PrintCss } from "@/components/PrescriptionDocument";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { formatDate } from "./dashboard-format";
import { ConfirmActionDialog } from "./ConfirmActionDialog";
import { PrescriptionBuilderDialog } from "./PrescriptionBuilderDialog";

type StatusFilter = "all" | "draft" | "issued" | "void";

export function PrescriptionsPanel() {
  const { t, lang } = useI18n();
  const qc = useQueryClient();
  const {
    data: prescriptions = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: () => listPrescriptions(),
  });

  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [builder, setBuilder] = useState<"new" | null>(null);
  const [editing, setEditing] = useState<Prescription | null>(null);
  const [viewing, setViewing] = useState<Prescription | null>(null);
  const [pendingVoid, setPendingVoid] = useState<Prescription | null>(null);
  const [voiding, setVoiding] = useState(false);
  const { sort, toggle } = useSortState("createdAt", "desc");

  const comparators: Record<string, (a: Prescription, b: Prescription) => number> = {
    // Comparators are ascending; sortedSlice reverses them for "desc".
    createdAt: (a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""),
    rxNumber: (a, b) => a.rxNumber.localeCompare(b.rxNumber),
    pet: (a, b) => (a.petName || a.pet?.name || "").localeCompare(b.petName || b.pet?.name || ""),
  };

  const filtered = prescriptions.filter((rx) => {
    if (filter !== "all" && rx.status !== filter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [rx.rxNumber, rx.petName || rx.pet?.name, rx.client?.fullName, rx.doctor?.name, rx.diagnosis]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const sorted = sortedSlice(filtered, sort, comparators);
  const grid = useGrid(sorted, "", []);

  // The text/status filters are applied above, so the pager must return to page 1.
  useEffect(() => grid.setPage(1), [filter, query, grid.setPage]);

  const refresh = () => qc.invalidateQueries({ queryKey: ["prescriptions"] });

  const confirmVoid = async () => {
    if (!pendingVoid || voiding) return;
    setVoiding(true);
    try {
      await updatePrescription(pendingVoid.id, { status: "void" });
      toast.success(t("rx.toast.voided"));
      setPendingVoid(null);
      refresh();
    } catch {
      toast.error(t("rx.toast.voidFailed"));
    } finally {
      setVoiding(false);
    }
  };

  const filters: { value: StatusFilter; label: string }[] = [
    { value: "all", label: t("dash.filterAll") },
    { value: "draft", label: t("rx.status.draft") },
    { value: "issued", label: t("rx.status.issued") },
    { value: "void", label: t("rx.status.void") },
  ];

  return (
    <Card>
      <PrintCss />
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">{t("dash.prescriptions")}</CardTitle>
          <CardDescription>{t("rx.list.hint")}</CardDescription>
        </div>
        <Button size="sm" onClick={() => setBuilder("new")}>
          <Plus className="size-4" /> {t("rx.new")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("rx.search")} />
          <div className="flex flex-wrap items-center gap-1.5">
            <SortChip
              active={sort.key === "createdAt"}
              dir={sort.dir}
              label={t("rx.sort.recent")}
              onToggle={() => toggle("createdAt", true)}
            />
            <SortChip
              active={sort.key === "rxNumber"}
              dir={sort.dir}
              label={t("rx.sort.number")}
              onToggle={() => toggle("rxNumber")}
            />
            <SortChip
              active={sort.key === "pet"}
              dir={sort.dir}
              label={t("rx.sort.pet")}
              onToggle={() => toggle("pet")}
            />
          </div>
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(v) => setFilter((v as StatusFilter) ?? "all")}
          >
            {filters.map((f) => (
              <ToggleGroupItem key={f.value} value={f.value} className="text-xs">
                {f.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("rx.table.rxNumber")}</TableHead>
                <TableHead>{t("rx.table.pet")}</TableHead>
                <TableHead>{t("rx.table.owner")}</TableHead>
                <TableHead>{t("rx.table.clinician")}</TableHead>
                <TableHead>{t("rx.table.issued")}</TableHead>
                <TableHead>{t("rx.table.status")}</TableHead>
                <TableHead className="text-end">{t("rx.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                    {t("dash.loading")}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && isError && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                    <p>{t("dash.errorLoad")}</p>
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => refetch()}>
                      {t("dash.retry")}
                    </Button>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && grid.slice.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                    {filter === "all"
                      ? t("rx.empty")
                      : t("rx.emptyFiltered", { status: t(`rx.status.${filter}`) })}
                  </TableCell>
                </TableRow>
              )}
              {!isError &&
                grid.slice.map((rx) => (
                  <TableRow key={rx.id}>
                    <TableCell className="whitespace-nowrap font-mono text-sm font-semibold">
                      {rx.rxNumber}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="font-medium">{rx.petName || rx.pet?.name || "—"}</span>
                      <span className="block text-xs text-muted-foreground">
                        {rx.petSpecies || rx.pet?.species || ""}
                        {rx.client?.fullName ? ` · ${rx.client.fullName}` : ""}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {rx.client?.fullName ?? "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {rx.doctor?.name ?? "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {rx.issuedAt ? formatDate(rx.issuedAt, lang) : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusPill status={rx.status} />
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7"
                          onClick={() => setViewing(rx)}
                        >
                          <FileText className="size-3.5" /> {t("rx.view")}
                        </Button>
                        {rx.status !== "void" && (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-7"
                              aria-label={t("dash.edit")}
                              onClick={() => setEditing(rx)}
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-7 text-muted-foreground hover:text-destructive"
                              aria-label={t("rx.void")}
                              onClick={() => setPendingVoid(rx)}
                            >
                              <Ban className="size-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {!isError && (
            <PaginationBar
              total={grid.total}
              page={grid.page}
              pageSize={grid.pageSize}
              pageCount={grid.pageCount}
              onPage={grid.setPage}
              onPageSize={grid.setPageSize}
            />
          )}
        </div>
      </CardContent>

      {builder && <PrescriptionBuilderDialog open onClose={() => setBuilder(null)} onSaved={refresh} />}
      {editing && (
        <PrescriptionBuilderDialog
          open
          editing={editing}
          onClose={() => setEditing(null)}
          onSaved={refresh}
        />
      )}
      {viewing && (
        <Dialog open onOpenChange={(o) => !o && setViewing(null)}>
          <DialogContent className="max-h-[90dvh] overflow-y-auto p-0 sm:max-w-2xl">
            <DialogHeader className="sr-only">
              <DialogTitle>{viewing.rxNumber}</DialogTitle>
            </DialogHeader>
            <div className="no-print flex flex-wrap items-center gap-2 px-6 pt-4">
              <Button size="sm" variant="outline" onClick={() => window.print()}>
                <Printer className="size-4" /> {t("rx.print")}
              </Button>
            </div>
            <div className="print-sheet px-6 pb-6">
              <PrescriptionDocument rx={viewing} />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <ConfirmActionDialog
        open={pendingVoid !== null}
        title={t("rx.void")}
        description={t("rx.voidConfirm", { code: pendingVoid?.rxNumber ?? "" })}
        busy={voiding}
        onConfirm={confirmVoid}
        onClose={() => !voiding && setPendingVoid(null)}
      />
    </Card>
  );
}

function StatusPill({ status }: { status: Prescription["status"] }) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase",
        status === "issued"
          ? "bg-emerald-100 text-emerald-700"
          : status === "void"
            ? "bg-red-100 text-red-700"
            : "bg-amber-100 text-amber-700",
      )}
    >
      {t(`rx.status.${status}`)}
    </span>
  );
}
