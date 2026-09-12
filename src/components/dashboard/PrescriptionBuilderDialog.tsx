import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPrescription,
  getPets,
  updatePrescription,
  type Prescription,
  type RxItem,
} from "@/lib/client-medical";
import { useClinicStore } from "@/lib/clinic-store";
import { carePlanFor, RX_CARE_PLAN } from "@/lib/rx-options";
import { cn } from "@/lib/utils";
import { Field } from "./dashboard-helpers";

const EMPTY_ITEM: RxItem = {
  medication: "",
  dose: "",
  frequency: "",
  route: "",
  duration: "",
  note: "",
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function PrescriptionBuilderDialog({
  open,
  onClose,
  onSaved,
  preset,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  preset?: { petId?: string; doctorId?: string; bookingId?: string; diagnosis?: string };
  editing?: Prescription | null;
}) {
  const qc = useQueryClient();
  const { doctors } = useClinicStore();
  const { data: pets = [] } = useQuery({
    queryKey: ["all-pets"],
    queryFn: getPets,
  });

  const [petId, setPetId] = useState(preset?.petId ?? editing?.pet?.id ?? "");
  const [patientName, setPatientName] = useState(
    editing && !editing.pet ? (editing.petName ?? "") : "",
  );
  const [patientBreed, setPatientBreed] = useState(
    editing && !editing.pet ? (editing.petBreed ?? "") : "",
  );
  const [doctorId, setDoctorId] = useState(
    preset?.doctorId ?? editing?.doctor?.id ?? doctors[0]?.id ?? "",
  );
  const [bookingId, setBookingId] = useState<string | null>(
    preset?.bookingId ?? editing?.booking?.id ?? null,
  );
  const [diagnosis, setDiagnosis] = useState(preset?.diagnosis ?? editing?.diagnosis ?? "");
  const [items, setItems] = useState<RxItem[]>(
    editing?.items?.length
      ? editing.items.map((i) => ({ ...EMPTY_ITEM, ...i }))
      : [{ ...EMPTY_ITEM }],
  );
  const [instructions, setInstructions] = useState(editing?.instructions ?? "");
  const [followUpDate, setFollowUpDate] = useState((editing?.followUpDate ?? "").slice(0, 10));
  const [status, setStatus] = useState<"draft" | "issued" | "void">(
    editing?.status === "issued" || editing?.status === "void" ? editing.status : "draft",
  );
  const [busy, setBusy] = useState(false);

  const selectedPet = pets.find((p) => p.id === petId);
  const isWalkIn = !petId;
  const petSpecies = selectedPet?.species ?? editing?.pet?.species ?? "";
  const [planSpecies, setPlanSpecies] = useState(
    carePlanFor(petSpecies).length > 0 ? petSpecies : "Dog",
  );
  useEffect(() => {
    if (carePlanFor(petSpecies).length > 0) setPlanSpecies(petSpecies);
  }, [petSpecies]);

  const plan = useMemo(() => carePlanFor(planSpecies), [planSpecies]);
  const [planCategory, setPlanCategory] = useState(plan[0]?.label ?? "");
  const [planItem, setPlanItem] = useState(plan[0]?.items[0] ?? "");

  useEffect(() => {
    const first = plan[0];
    setPlanCategory((current) =>
      first && plan.some((c) => c.label === current) ? current : (first?.label ?? ""),
    );
    setPlanItem((current) =>
      first && first.items.includes(current) ? current : (first?.items[0] ?? ""),
    );
  }, [plan, planSpecies]);

  const changePlanCategory = (label: string) => {
    setPlanCategory(label);
    setPlanItem(plan.find((c) => c.label === label)?.items[0] ?? "");
  };

  const addPlanItem = () => {
    const cat = plan.find((c) => c.label === planCategory);
    if (!cat || !planItem) return;
    setItems((list) => [
      ...list,
      { ...EMPTY_ITEM, medication: planItem, ...cat.defaults, note: cat.label },
    ]);
  };

  const valid =
    doctorId &&
    items.length > 0 &&
    items.every((i) => i.medication.trim() && i.dose.trim() && i.frequency.trim()) &&
    (isWalkIn ? patientName.trim().length > 0 : true);

  const setItem = (index: number, key: keyof RxItem, value: string) =>
    setItems((list) => list.map((item, i) => (i === index ? { ...item, [key]: value } : item)));

  const save = async () => {
    if (!valid) {
      toast.error("Medication, dose and frequency are required on every line");
      return;
    }
    setBusy(true);
    const payload = {
      diagnosis: diagnosis.trim(),
      items: items.map((i) => ({
        medication: i.medication.trim(),
        dose: i.dose.trim(),
        frequency: i.frequency.trim(),
        route: i.route.trim(),
        duration: i.duration.trim(),
        note: i.note.trim(),
      })),
      instructions: instructions.trim(),
      followUpDate,
      status: editing ? (status === "void" ? "void" : "issued") : status,
    };
    try {
      if (editing) {
        await updatePrescription(editing.id, payload);
        toast.success(editing.status === "void" ? "Prescription updated" : "Prescription updated");
      } else {
        await createPrescription({
          ...payload,
          petId: petId || null,
          petName: selectedPet ? selectedPet.name : patientName.trim(),
          petSpecies: selectedPet ? selectedPet.species : planSpecies,
          petBreed: selectedPet ? selectedPet.breed : patientBreed.trim(),
          doctorId,
          bookingId: bookingId || null,
        });
        toast.success(status === "draft" ? "Draft saved" : "Prescription issued");
      }
      qc.invalidateQueries({ queryKey: ["prescriptions"] });
      qc.invalidateQueries({ queryKey: ["me"] });
      onSaved();
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? (err.message.split(": ").pop() ?? "Failed to save")
          : "Failed to save",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit ${editing.rxNumber}` : "Write a prescription"}</DialogTitle>
          <DialogDescription>
            The signed document becomes printable and verifiable once issued. A signature (if set on
            the clinician) is captured on the prescription.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Patient">
              <Select
                value={petId || "__walkin"}
                onValueChange={(v) => setPetId(v === "__walkin" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} — {pet.species}
                      {"client" in pet && (pet as { client?: { fullName: string } }).client
                        ? ` · ${(pet as { client: { fullName: string } }).client.fullName}`
                        : ""}
                    </SelectItem>
                  ))}
                  <SelectItem value="__walkin">Walk-in patient (no pet file)</SelectItem>
                </SelectContent>
              </Select>
              {isWalkIn && (
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Patient name"
                    />
                    <Input
                      value={patientBreed}
                      onChange={(e) => setPatientBreed(e.target.value)}
                      placeholder="Breed (optional)"
                    />
                  </div>
                  <Select value={planSpecies} onValueChange={setPlanSpecies}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(RX_CARE_PLAN).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </Field>
            <Field label="Prescribing clinician">
              <Select value={doctorId} onValueChange={setDoctorId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Diagnosis">
            <Textarea
              rows={2}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Clinical diagnosis for this visit"
            />
          </Field>

          <div className="grid gap-3">
            {plan.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="mb-2 text-xs font-semibold text-foreground">
                  {planSpecies} wellness &amp; care plan
                </p>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-3">
                    <Field label="Species">
                      <Select value={planSpecies} onValueChange={setPlanSpecies}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(RX_CARE_PLAN).map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Category">
                      <Select value={planCategory} onValueChange={changePlanCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {plan.map((c) => (
                            <SelectItem key={c.label} value={c.label}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Care item">
                      <Select value={planItem} onValueChange={setPlanItem}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {plan
                            .find((c) => c.label === planCategory)
                            ?.items.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Button size="sm" variant="outline" className="h-9" onClick={addPlanItem}>
                    <Plus className="size-3.5" /> Add
                  </Button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Medication lines</Label>
              <Button
                size="sm"
                variant="outline"
                className="h-7"
                onClick={() => setItems((list) => [...list, { ...EMPTY_ITEM }])}
                disabled={items.length >= 30}
              >
                <Plus className="size-3.5" /> Add line
              </Button>
            </div>
            <ItemTable
              items={items}
              setItem={setItem}
              onRemove={(i) => setItems((list) => list.filter((_, j) => j !== i))}
            />
          </div>

          <Field label="Instructions">
            <Textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="How the medication should be administered"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Follow-up date">
              <Input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </Field>
            <Field label="Status">
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as "draft" | "issued" | "void")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {editing ? (
                    <>
                      <SelectItem value="issued">Issued — printable &amp; verifiable</SelectItem>
                      <SelectItem value="void">Void — invalidated</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="draft">Draft — not yet handed out</SelectItem>
                      <SelectItem value="issued">Issue now — printable &amp; verifiable</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {editing?.booking?.id && (
            <p className="text-xs text-muted-foreground">
              Linked to booking {editing.booking.date} {editing.booking.time}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={busy || !valid}>
            {busy
              ? "Saving…"
              : editing
                ? "Save changes"
                : status === "issued"
                  ? "Issue prescription"
                  : "Save draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ItemTable({
  items,
  setItem,
  onRemove,
}: {
  items: RxItem[];
  setItem: (index: number, key: keyof RxItem, value: string) => void;
  onRemove: (index: number) => void;
}) {
  const inputCls =
    "h-9 rounded-lg border border-border bg-background px-2.5 text-sm outline-none focus:border-primary";
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left text-xs font-medium text-muted-foreground">
            <th className="p-1.5">Medication *</th>
            <th className="p-1.5">Dose *</th>
            <th className="p-1.5">Frequency *</th>
            <th className="p-1.5">Route</th>
            <th className="p-1.5">Duration</th>
            <th className="p-1.5">Note</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              {(["medication", "dose", "frequency", "route", "duration", "note"] as const).map(
                (key) => (
                  <td key={key} className={cn("p-1.5", key === "note" ? "w-32" : "")}>
                    <input
                      value={item[key]}
                      onChange={(e) => setItem(i, key, e.target.value)}
                      className={cn(
                        inputCls,
                        "w-full",
                        (key === "medication" || key === "dose" || key === "frequency") &&
                          !item[key] &&
                          "border-rose-300",
                      )}
                    />
                  </td>
                ),
              )}
              <td className="p-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-8 px-0 text-muted-foreground hover:text-destructive"
                  aria-label="Remove line"
                  onClick={() => onRemove(i)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
