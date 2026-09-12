import { useState } from "react";
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
import { SortChip, sortedSlice, useGrid, useSortState } from "@/components/dash-grid";
import { SearchBox } from "@/components/dash-grid";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { listPrescriptions, updatePrescription, type Prescription } from "@/lib/client-medical";
import { PrescriptionDocument, PrintCss } from "@/components/PrescriptionDocument";
import { cn } from "@/lib/utils";
import { PrescriptionBuilderDialog } from "./PrescriptionBuilderDialog";

type StatusFilter = "all" | "draft" | "issued" | "void";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "issued", label: "Issued" },
  { value: "void", label: "Void" },
];

export function PrescriptionsPanel() {
  const qc = useQueryClient();
  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: () => listPrescriptions(),
  });

  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [builder, setBuilder] = useState<"new" | null>(null);
  const [editing, setEditing] = useState<Prescription | null>(null);
  const [viewing, setViewing] = useState<Prescription | null>(null);
  const { sort, toggle } = useSortState("createdAt");

  const comparators: Record<string, (a: Prescription, b: Prescription) => number> = {
    createdAt: (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
    rxNumber: (a, b) => a.rxNumber.localeCompare(b.rxNumber),
    pet: (a, b) => (a.petName || a.pet?.name || "").localeCompare(b.petName || b.pet?.name || ""),
  };

  const filtered = prescriptions.filter((rx) => {
    if (filter !== "all" && rx.status !== filter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [
      rx.rxNumber,
      rx.petName || rx.pet?.name,
      rx.client?.fullName,
      rx.doctor?.name,
      rx.diagnosis,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const sorted = sortedSlice(filtered, sort, comparators);
  const grid = useGrid(sorted, "", [], 12);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["prescriptions"] });
  };

  const voidRx = async (rx: Prescription) => {
    if (!window.confirm(`Void ${rx.rxNumber}? It will no longer verify as authentic.`)) return;
    try {
      await updatePrescription(rx.id, { status: "void" });
      toast.success("Prescription voided");
      refresh();
    } catch {
      toast.error("Could not void the prescription");
    }
  };

  return (
    <Card>
      <PrintCss />
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">Prescriptions</CardTitle>
          <CardDescription>
            Signed, numbered prescriptions with QR verification for clients.
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => setBuilder("new")}>
          <Plus className="size-4" /> New prescription
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Search by Rx, pet, owner, doctor…"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <SortChip
              active={sort.key === "createdAt"}
              dir={sort.dir}
              label="Recent"
              onToggle={() => toggle("createdAt", true)}
            />
            <SortChip
              active={sort.key === "rxNumber"}
              dir={sort.dir}
              label="Rx number"
              onToggle={() => toggle("rxNumber")}
            />
            <SortChip
              active={sort.key === "pet"}
              dir={sort.dir}
              label="Pet"
              onToggle={() => toggle("pet")}
            />
          </div>
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(v) => setFilter((v as StatusFilter) ?? "all")}
          >
            {FILTERS.map((f) => (
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
                <TableHead>Rx number</TableHead>
                <TableHead>Pet</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Clinician</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && grid.slice.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                    No prescriptions{filter !== "all" ? ` in ${filter} state` : ""}.
                  </TableCell>
                </TableRow>
              )}
              {grid.slice.map((rx) => (
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
                    {rx.issuedAt ? new Date(rx.issuedAt).toLocaleDateString("en-GB") : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={rx.status} />
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={() => setViewing(rx)}
                      >
                        <FileText className="size-3.5" /> View
                      </Button>
                      {rx.status !== "void" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            onClick={() => setEditing(rx)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-muted-foreground hover:text-destructive"
                            aria-label="Void prescription"
                            onClick={() => voidRx(rx)}
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
        </div>
      </CardContent>

      {builder && (
        <PrescriptionBuilderDialog open onClose={() => setBuilder(null)} onSaved={refresh} />
      )}
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
          <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-2xl">
            <DialogHeader className="sr-only">
              <DialogTitle>{viewing.rxNumber}</DialogTitle>
            </DialogHeader>
            <div className="no-print flex flex-wrap items-center gap-2 px-6 pt-4">
              <Button size="sm" variant="outline" onClick={() => window.print()}>
                <Printer className="size-4" /> Print
              </Button>
            </div>
            <div className="print-sheet px-6 pb-6">
              <PrescriptionDocument rx={viewing} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

function StatusPill({ status }: { status: Prescription["status"] }) {
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
      {status}
    </span>
  );
}
