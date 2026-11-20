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
import { useI18n } from "@/lib/i18n";
import { carePlanFor, RX_CARE_PLAN } from "@/lib/rx-options";
import { cn } from "@/lib/utils";
import { Field } from "./dashboard-helpers";
import { ConfirmActionDialog } from "./ConfirmActionDialog";

const EMPTY_ITEM: RxItem = {
  medication: "",
  dose: "",
  frequency: "",
  route: "",
  duration: "",
  note: "",
};

type RxStatus = "draft" | "issued" | "void";

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
  const { t } = useI18n();
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
  const [status, setStatus] = useState<RxStatus>(
    editing?.status === "issued" || editing?.status === "void" ? editing.status : "draft",
  );
  const [busy, setBusy] = useState(false);
  const [confirmVoid, setConfirmVoid] = useState(false);

  // Doctors load through React Query, so default once they arrive.
  useEffect(() => {
    if (!doctorId && doctors.length > 0 && doctors[0]) setDoctorId(doctors[0].id);
  }, [doctors, doctorId]);

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
    Boolean(doctorId) &&
    items.length > 0 &&
    items.every((i) => i.medication.trim() && i.dose.trim() && i.frequency.trim()) &&
    (isWalkIn ? patientName.trim().length > 0 : true);

  const setItem = (index: number, key: keyof RxItem, value: string) =>
    setItems((list) => list.map((item, i) => (i === index ? { ...item, [key]: value } : item)));

  const performSave = async () => {
    if (busy) return;
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
    };
    try {
      if (editing) {
        // The update API only accepts issued/void — make issuing an edited
        // draft explicit in the UI instead of silently changing its status.
        await updatePrescription(editing.id, {
          ...payload,
          status: status === "void" ? "void" : "issued",
        });
        toast.success(t("rx.builder.updated"));
      } else {
        await createPrescription({
          ...payload,
          status: status === "draft" ? "draft" : "issued",
          petId: petId || null,
          petName: selectedPet ? selectedPet.name : patientName.trim(),
          petSpecies: selectedPet ? selectedPet.species : planSpecies,
          petBreed: selectedPet ? selectedPet.breed : patientBreed.trim(),
          doctorId,
          bookingId: bookingId || null,
        });
        toast.success(status === "draft" ? t("rx.builder.savedDraft") : t("rx.builder.issued"));
      }
      // The list panel invalidates ["prescriptions"] through onSaved().
      qc.invalidateQueries({ queryKey: ["me"] });
      setConfirmVoid(false);
      onSaved();
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? (err.message.split(": ").pop() ?? t("rx.builder.failed"))
          : t("rx.builder.failed"),
      );
    } finally {
      setBusy(false);
    }
  };

  const save = () => {
    if (busy || !valid) {
      if (!valid) toast.error(t("rx.builder.required"));
      return;
    }
    // Voiding an issued prescription is irreversible — require a second step.
    if (editing && status === "void" && editing.status !== "void") {
      setConfirmVoid(true);
      return;
    }
    void performSave();
  };

  const saveLabel = busy
    ? t("dash.saving")
    : editing
      ? t("dash.save")
      : status === "issued"
        ? t("rx.builder.issue")
        : t("rx.builder.saveDraft");

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editing
              ? t("rx.builder.editTitle", { code: editing.rxNumber })
              : t("rx.builder.title")}
          </DialogTitle>
          <DialogDescription>{t("rx.builder.hint")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("rx.builder.patient")}>
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
                  <SelectItem value="__walkin">{t("rx.builder.walkIn")}</SelectItem>
                </SelectContent>
              </Select>
              {isWalkIn && (
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder={t("rx.builder.patientName")}
                    />
                    <Input
                      value={patientBreed}
                      onChange={(e) => setPatientBreed(e.target.value)}
                      placeholder={t("rx.builder.breed")}
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
            <Field label={t("rx.builder.clinician")}>
              {doctors.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
                  {t("rx.builder.noClinician")}
                </p>
              ) : (
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
              )}
            </Field>
          </div>

          <Field label={t("rx.builder.diagnosis")}>
            <Textarea
              rows={2}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder={t("rx.builder.diagnosisPlaceholder")}
            />
          </Field>

          <div className="grid gap-3">
            {plan.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="mb-2 text-xs font-semibold text-foreground">
                  {t("rx.builder.carePlan", { species: planSpecies })}
                </p>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-3">
                    <Field label={t("rx.builder.species")}>
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
                    <Field label={t("rx.builder.category")}>
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
                    <Field label={t("rx.builder.careItem")}>
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
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-9"
                    onClick={addPlanItem}
                    disabled={busy}
                  >
                    <Plus className="size-3.5" /> {t("rx.builder.add")}
                  </Button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("rx.builder.medicationLines")}
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7"
                onClick={() => setItems((list) => [...list, { ...EMPTY_ITEM }])}
                disabled={busy || items.length >= 30}
              >
                <Plus className="size-3.5" /> {t("rx.builder.addLine")}
              </Button>
            </div>
            <ItemTable
              items={items}
              setItem={setItem}
              onRemove={(i) => setItems((list) => list.filter((_, j) => j !== i))}
              disabled={busy}
            />
          </div>

          <Field label={t("rx.builder.instructions")}>
            <Textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={t("rx.builder.instructionsPlaceholder")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("rx.builder.followUp")}>
              <Input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </Field>
            <Field label={t("rx.builder.status")}>
              <Select value={status} onValueChange={(v) => setStatus(v as RxStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {!editing && (
                    <SelectItem value="draft">{t("rx.builder.status.draft")}</SelectItem>
                  )}
                  <SelectItem value="issued">
                    {editing ? t("rx.status.issued") : t("rx.builder.status.issued")}
                  </SelectItem>
                  {editing && <SelectItem value="void">{t("rx.builder.status.void")}</SelectItem>}
                </SelectContent>
              </Select>
              {editing?.status === "draft" && (
                <p className="mt-1 text-xs text-amber-600">{t("rx.builder.draftWillIssue")}</p>
              )}
            </Field>
          </div>

          {editing?.booking?.id && (
            <p className="text-xs text-muted-foreground">
              {t("rx.builder.linkedBooking", {
                date: editing.booking.date,
                time: editing.booking.time,
              })}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
            {t("dash.cancel")}
          </Button>
          <Button type="button" onClick={save} disabled={busy || !valid}>
            {saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
      <ConfirmActionDialog
        open={confirmVoid}
        title={t("rx.void")}
        description={t("rx.voidConfirm", { code: editing?.rxNumber ?? "" })}
        busy={busy}
        onConfirm={performSave}
        onClose={() => !busy && setConfirmVoid(false)}
      />
    </Dialog>
  );
}

function ItemTable({
  items,
  setItem,
  onRemove,
  disabled = false,
}: {
  items: RxItem[];
  setItem: (index: number, key: keyof RxItem, value: string) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const inputCls =
    "h-9 rounded-lg border border-border bg-background px-2.5 text-sm outline-none focus:border-primary";
  const columns: { key: keyof RxItem; label: string; required?: boolean }[] = [
    { key: "medication", label: t("rx.builder.medication"), required: true },
    { key: "dose", label: t("rx.builder.dose"), required: true },
    { key: "frequency", label: t("rx.builder.frequency"), required: true },
    { key: "route", label: t("rx.builder.route") },
    { key: "duration", label: t("rx.builder.duration") },
    { key: "note", label: t("rx.builder.note") },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left text-xs font-medium text-muted-foreground">
            {columns.map((c) => (
              <th key={c.key} className="p-1.5">
                {c.label}
              </th>
            ))}
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} className={cn("p-1.5", c.key === "note" ? "w-32" : "")}>
                  <input
                    value={item[c.key]}
                    onChange={(e) => setItem(i, c.key, e.target.value)}
                    disabled={disabled}
                    className={cn(
                      inputCls,
                      "w-full",
                      c.required && !item[c.key] && "border-rose-300",
                    )}
                  />
                </td>
              ))}
              <td className="p-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-9 w-8 px-0 text-muted-foreground hover:text-destructive"
                  aria-label={t("rx.builder.removeLine")}
                  onClick={() => onRemove(i)}
                  disabled={disabled || items.length === 1}
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
