import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useClinicStore, saveDoctor, deleteDoctor, type Doctor } from "@/lib/clinic-store";
import { useI18n } from "@/lib/i18n";
import { Field } from "./dashboard-helpers";

const EMPTY_DOCTOR = {
  name: "",
  title: "",
  licenseNumber: "",
  signatureImage: "",
  specialization: "",
  experience: "",
  rating: "4.8",
  bio: "",
  tags: "",
  pets: "",
  days: "Mon, Tue, Wed, Thu, Fri, Sat",
};

function DoctorDialog({ doctor, onClose }: { doctor: Doctor | null; onClose: () => void }) {
  const { t } = useI18n();
  const [form, setForm] = useState(() =>
    doctor
      ? {
          name: doctor.name,
          title: doctor.title ?? "",
          licenseNumber: doctor.licenseNumber ?? "",
          signatureImage: doctor.signatureImage ?? "",
          specialization: doctor.specialization,
          experience: doctor.experience,
          rating: String(doctor.rating),
          bio: doctor.bio,
          tags: doctor.tags.join(", "),
          pets: doctor.pets.join(", "),
          days: doctor.days.join(", "),
        }
      : EMPTY_DOCTOR,
  );

  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    const initials =
      form.name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "DR";
    await saveDoctor({
      id: doctor?.id ?? `dr-${Date.now().toString(36)}`,
      name: form.name.trim() || t("dash.unnamed"),
      title: form.title.trim(),
      licenseNumber: form.licenseNumber.trim(),
      signatureImage: form.signatureImage,
      specialization: form.specialization.trim(),
      experience: form.experience.trim(),
      rating: Math.min(5, Math.max(1, Number(form.rating) || 4.8)),
      bio: form.bio.trim(),
      initials,
      days: form.days
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      pets: form.pets
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    });
    toast.success(t("dash.toast.saved"));
    onClose();
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{doctor ? t("dash.editDoctor") : t("dash.addDoctor")}</DialogTitle>
          <DialogDescription>{t("dash.doctors.hint")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label={t("dash.form.name")}>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title">
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Veterinary Surgeon"
              />
            </Field>
            <Field label="License number">
              <Input
                value={form.licenseNumber}
                onChange={(e) => set("licenseNumber", e.target.value)}
                placeholder="VET-EG-0000"
              />
            </Field>
          </div>
          <Field label="Signature">
            {form.signatureImage ? (
              <div className="flex items-center gap-3">
                <img
                  src={form.signatureImage}
                  alt="Signature"
                  className="h-14 rounded-lg border border-border bg-muted object-contain px-2"
                />
                <Button size="sm" variant="outline" onClick={() => set("signatureImage", "")}>
                  Remove
                </Button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
                Upload signature image (used on printed prescriptions)
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement("canvas");
                      const max = 400;
                      const scale = Math.min(1, max / Math.max(img.width, img.height));
                      canvas.width = Math.round(img.width * scale);
                      canvas.height = Math.round(img.height * scale);
                      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
                      set("signatureImage", canvas.toDataURL("image/png"));
                    };
                    img.src = URL.createObjectURL(file);
                  }}
                />
              </label>
            )}
          </Field>
          <Field label={t("dash.form.specialization")}>
            <Input
              value={form.specialization}
              onChange={(e) => set("specialization", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("dash.form.experience")}>
              <Input value={form.experience} onChange={(e) => set("experience", e.target.value)} />
            </Field>
            <Field label={t("dash.form.rating")}>
              <Input
                type="number"
                min={1}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
              />
            </Field>
          </div>
          <Field label={t("dash.form.bio")}>
            <Textarea rows={2} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
          </Field>
          <Field label={t("dash.form.pets")}>
            <Input value={form.pets} onChange={(e) => set("pets", e.target.value)} />
          </Field>
          <Field label={t("dash.form.tags")}>
            <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} />
          </Field>
          <Field label={t("dash.form.days")}>
            <Input value={form.days} onChange={(e) => set("days", e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("dash.close")}
          </Button>
          <Button onClick={save} disabled={!form.name.trim()}>
            {t("dash.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DoctorsPanel() {
  const { t, tOr } = useI18n();
  const { doctors } = useClinicStore();
  const [editing, setEditing] = useState<Doctor | "new" | null>(null);
  const [query, setQuery] = useState("");
  const { sort, toggle } = useSortState("name");
  const comparators: Record<string, (a: Doctor, b: Doctor) => number> = {
    name: (a, b) => a.name.localeCompare(b.name),
    spec: (a, b) => a.specialization.localeCompare(b.specialization),
    rating: (a, b) => a.rating - b.rating,
  };
  const sorted = sortedSlice(doctors, sort, comparators);
  const grid = useGrid(sorted, query, ["name", "specialization", "experience"]);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">{t("dash.doctors")}</CardTitle>
          <CardDescription>{t("dash.doctors.hint")}</CardDescription>
        </div>
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus className="size-4" /> {t("dash.addDoctor")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
          <div className="flex flex-wrap items-center gap-1.5">
            <SortChip
              label={t("dash.sort.name")}
              active={sort.key === "name"}
              dir={sort.dir}
              onToggle={() => toggle("name")}
            />
            <SortChip
              label={t("dash.sort.spec")}
              active={sort.key === "spec"}
              dir={sort.dir}
              onToggle={() => toggle("spec")}
            />
            <SortChip
              label={t("dash.sort.rating")}
              active={sort.key === "rating"}
              dir={sort.dir}
              onToggle={() => toggle("rating", true)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("dash.form.name")}</TableHead>
                <TableHead>{t("dash.form.specialization")}</TableHead>
                <TableHead>{t("dash.form.experience")}</TableHead>
                <TableHead>{t("dash.form.rating")}</TableHead>
                <TableHead>{t("dash.form.days")}</TableHead>
                <TableHead className="text-end">{t("dash.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grid.slice.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {tOr(`doc.${d.id}.name`, d.name)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {tOr(`doc.${d.id}.spec`, d.specialization)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {tOr(`doc.${d.id}.exp`, d.experience)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    ★ {d.rating.toFixed(1)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {d.days.map((day) => tOr(`day.${day}`, day)).join(", ")}
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={() => setEditing(d)}
                      >
                        {t("dash.edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        aria-label={t("dash.delete")}
                        onClick={async () => {
                          await deleteDoctor(d.id);
                          toast.success(t("dash.toast.deleted"));
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {grid.slice.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">{t("dash.empty")}</p>
          )}
          <PaginationBar
            total={grid.total}
            page={grid.page}
            pageSize={grid.pageSize}
            pageCount={grid.pageCount}
            onPage={grid.setPage}
            onPageSize={grid.setPageSize}
          />
        </div>
      </CardContent>
      {editing && (
        <DoctorDialog
          doctor={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </Card>
  );
}
