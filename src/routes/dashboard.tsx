import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { Lock, LogOut } from "lucide-react";
import {
  CalendarCheck,
  CalendarClock,
  HeartPulse,
  LayoutDashboard,
  ListChecks,
  Plus,
  Radio,
  Settings,
  Stethoscope,
  Trash2,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  deleteDoctor,
  deleteRequest,
  deleteService,
  saveDoctor,
  saveService,
  setBookingStatus,
  updateSettings,
  useClinicStore,
  type BookingRequest,
  type Doctor,
  type ServiceItem,
  type Status,
} from "@/lib/clinic-store";
import { isAuthed, isPinConfigured, logout, remainingLockMs, setPin, unlock } from "@/lib/auth";
import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Staff Dashboard — PawCare" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

function StatusBadge({ status }: { status: Status }) {
  const { t } = useI18n();
  const styles: Record<Status, string> = {
    pending: "bg-amber-500/15 text-amber-600",
    confirmed: "bg-success/15 text-success",
    completed: "bg-primary/15 text-primary",
    cancelled: "bg-muted text-muted-foreground line-through",
  };
  return (
    <Badge variant="outline" className={cn("border-transparent", styles[status])}>
      {t(`dash.status.${status}`)}
    </Badge>
  );
}

const STATUS_OPTIONS: { value: Status | "all"; key: string }[] = [
  { value: "all", key: "dash.filterAll" },
  { value: "pending", key: "dash.filterPending" },
  { value: "confirmed", key: "dash.filterConfirmed" },
  { value: "completed", key: "dash.filterCompleted" },
  { value: "cancelled", key: "dash.filterCancelled" },
];

function formatDate(dateISO: string, lang: Lang) {
  if (!dateISO) return "—";
  const d = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateISO;
  return d.toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string, lang: Lang) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(lang === "ar" ? "ar" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function RequestsTable({
  requests,
  onConfirm,
  onCancel,
  onDelete,
}: {
  requests: BookingRequest[];
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { t, lang } = useI18n();
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("dash.owner")}</TableHead>
            <TableHead>{t("dash.pet")}</TableHead>
            <TableHead>{t("dash.doctor")}</TableHead>
            <TableHead>{t("dash.date")}</TableHead>
            <TableHead>{t("dash.time")}</TableHead>
            <TableHead>{t("dash.requestedAt")}</TableHead>
            <TableHead>{t("dash.notes")}</TableHead>
            <TableHead>{t("dash.statusCol")}</TableHead>
            <TableHead className="text-end">{t("dash.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center text-sm text-muted-foreground">
                {t("dash.empty")}
              </TableCell>
            </TableRow>
          )}
          {requests.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="whitespace-nowrap font-medium">{r.ownerName}</div>
                <div className="whitespace-nowrap text-xs text-muted-foreground">{r.phone}</div>
              </TableCell>
              <TableCell>
                <div className="whitespace-nowrap font-medium">{r.petName}</div>
                <div className="text-xs text-muted-foreground">{r.animalType}</div>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">{r.doctorName}</TableCell>
              <TableCell className="whitespace-nowrap text-sm">
                {formatDate(r.date, lang)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">{r.time}</TableCell>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {formatTime(r.createdAt, lang)}
              </TableCell>
              <TableCell className="max-w-[220px]">
                <div className="truncate text-xs text-muted-foreground" title={r.symptoms}>
                  {r.emergency && (
                    <Badge className="mb-1 border-amber-500/30 bg-rose-500/15 text-rose-600">
                      {t("dash.emergency.yes")}
                    </Badge>
                  )}
                  {r.symptoms}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={r.status} />
              </TableCell>
              <TableCell className="text-end">
                <div className="flex items-center justify-end gap-1.5">
                  {r.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7"
                      onClick={() => onConfirm(r.id)}
                    >
                      {t("dash.confirmRow")}
                    </Button>
                  )}
                  {r.status !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7"
                      onClick={() => onCancel(r.id)}
                    >
                      {t("dash.cancelRow")}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-muted-foreground hover:text-destructive"
                    aria-label={t("dash.delete")}
                    onClick={() => onDelete(r.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const EMPTY_DOCTOR = {
  name: "",
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

  const save = () => {
    const initials =
      form.name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "DR";
    saveDoctor({
      id: doctor?.id ?? `dr-${Date.now().toString(36)}`,
      name: form.name.trim() || t("dash.unnamed"),
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

function ServiceDialog({ service, onClose }: { service: ServiceItem | null; onClose: () => void }) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    title: service?.title ?? "",
    description: service?.description ?? "",
  });

  const save = () => {
    saveService({
      slug: service?.slug ?? `svc-${Date.now().toString(36)}`,
      icon: service?.icon ?? "Stethoscope",
      title: form.title.trim() || t("dash.untitled"),
      description: form.description.trim(),
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{service ? t("dash.editService") : t("dash.addService")}</DialogTitle>
          <DialogDescription>{t("dash.services.hint")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label={t("dash.form.service.title")}>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </Field>
          <Field label={t("dash.form.service.desc")}>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {t("dash.close")}
          </Button>
          <Button onClick={save} disabled={!form.title.trim()}>
            {t("dash.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DoctorsPanel() {
  const { t, tOr } = useI18n();
  const { doctors } = useClinicStore();
  const [editing, setEditing] = useState<Doctor | "new" | null>(null);

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
              {doctors.map((d) => (
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
                        onClick={() => {
                          deleteDoctor(d.id);
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
          {doctors.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">{t("dash.empty")}</p>
          )}
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

function ServicesPanel() {
  const { t, tOr } = useI18n();
  const { services } = useClinicStore();
  const [editing, setEditing] = useState<ServiceItem | "new" | null>(null);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">{t("dash.services")}</CardTitle>
          <CardDescription>{t("dash.services.hint")}</CardDescription>
        </div>
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus className="size-4" /> {t("dash.addService")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("dash.form.service.title")}</TableHead>
                <TableHead>{t("dash.form.service.desc")}</TableHead>
                <TableHead className="text-end">{t("dash.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s.slug}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {tOr(`svc.${s.slug}.title`, s.title)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tOr(`svc.${s.slug}.desc`, s.description)}
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={() => setEditing(s)}
                      >
                        {t("dash.edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        aria-label={t("dash.delete")}
                        onClick={() => {
                          deleteService(s.slug);
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
          {services.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">{t("dash.empty")}</p>
          )}
        </div>
      </CardContent>
      {editing && (
        <ServiceDialog
          service={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </Card>
  );
}

function SettingsPanel() {
  const { t, lang, setLang } = useI18n();
  const { settings } = useClinicStore();
  const [pinForm, setPinForm] = useState({ current: "", next: "", confirm: "" });
  const [form, setForm] = useState({
    name: settings.name,
    phone: settings.phone,
    emergency: settings.emergency,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
  });

  const save = () => {
    updateSettings(form);
    toast.success(t("dash.toast.saved"));
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("dash.settings.general")}</CardTitle>
          <CardDescription>{t("dash.settings.generalDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label={t("dash.settings.name")}>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("dash.settings.phone")}>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
            <Field label={t("dash.settings.emergency")}>
              <Input
                value={form.emergency}
                onChange={(e) => setForm({ ...form, emergency: e.target.value })}
              />
            </Field>
          </div>
          <Field label={t("dash.settings.email")}>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label={t("dash.settings.whatsapp")}>
            <Input
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
          </Field>
          <Field label={t("dash.settings.address")}>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Field>
          <div className="flex items-center gap-3">
            <Button onClick={save}>{t("dash.save")}</Button>
            <span className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground">
              {t("dash.settings.persist")}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("dash.settings.lang")}</CardTitle>
          <CardDescription>{t("dash.settings.langDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            value={lang}
            onValueChange={(v) => {
              if (v === "en" || v === "ar") setLang(v as Lang);
            }}
          >
            <ToggleGroupItem value="en" size="sm">
              English
            </ToggleGroupItem>
            <ToggleGroupItem value="ar" size="sm">
              العربية
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("auth.changePin")}</CardTitle>
          <CardDescription>{t("auth.setupDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label={t("auth.currentPin")}>
            <Input
              type="password"
              value={pinForm.current}
              onChange={(e) => setPinForm({ ...pinForm, current: e.target.value })}
              autoComplete="off"
              inputMode="numeric"
              maxLength={32}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("auth.newPin")}>
              <Input
                type="password"
                value={pinForm.next}
                onChange={(e) => setPinForm({ ...pinForm, next: e.target.value })}
                autoComplete="new-password"
                inputMode="numeric"
                maxLength={32}
              />
            </Field>
            <Field label={t("auth.confirmNewPin")}>
              <Input
                type="password"
                value={pinForm.confirm}
                onChange={(e) => setPinForm({ ...pinForm, confirm: e.target.value })}
                autoComplete="new-password"
                inputMode="numeric"
                maxLength={32}
              />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={async () => {
                if (pinForm.next !== pinForm.confirm) {
                  toast.error(t("auth.mismatch"));
                  return;
                }
                if (pinForm.next.length < 4) {
                  toast.error(t("auth.pinTooShort"));
                  return;
                }
                try {
                  await setPin(pinForm.current, pinForm.next);
                  toast.success(t("auth.pinChanged"));
                  setPinForm({ current: "", next: "", confirm: "" });
                } catch {
                  toast.error(t("auth.wrongCurrent"));
                }
              }}
            >
              {t("auth.changePin")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "overview", icon: LayoutDashboard },
  { id: "requests", icon: ListChecks },
  { id: "reservations", icon: CalendarCheck },
  { id: "doctors", icon: Users },
  { id: "services", icon: HeartPulse },
  { id: "settings", icon: Settings },
] as const;

function AuthGate({ onUnlocked }: { onUnlocked: () => void }) {
  const { t } = useI18n();
  const [pin, setPinInput] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lockedFor, setLockedFor] = useState(remainingLockMs());
  const setup = !isPinConfigured();
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      if (setup) {
        if (pin.length < 4) {
          setError(t("auth.pinTooShort"));
        } else if (pin !== confirm) {
          setError(t("auth.mismatch"));
        } else {
          await setPin("", pin);
          await unlock(pin);
          onUnlocked();
        }
      } else {
        if (await unlock(pin)) {
          onUnlocked();
        } else {
          setError(remainingLockMs() > 0 ? t("auth.locked") : t("auth.invalidPin"));
        }
      }
    } catch {
      setError(t("auth.invalidPin"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-5 py-32">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-card"
      >
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="size-5" />
        </span>
        <h1 className="mt-5 text-center text-xl font-bold">
          {setup ? t("auth.setupTitle") : t("auth.signIn")}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {setup ? t("auth.setupDesc") : t("auth.signInDesc")}
        </p>

        <Field label={t("auth.pin")}>
          <Input
            type="password"
            autoFocus
            autoComplete="off"
            value={pin}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder={t("auth.pinPlaceholder")}
            inputMode="numeric"
            maxLength={32}
          />
        </Field>

        {setup && (
          <div className="mt-4">
            <Field label={t("auth.setupConfirm")}>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t("auth.pinPlaceholder")}
                inputMode="numeric"
                maxLength={32}
              />
            </Field>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        {lockedFor > 0 && (
          <p className="mt-2 text-xs text-amber-600">
            {t("auth.locked", { minutes: String(Math.ceil(lockedFor / 60000)) })}
          </p>
        )}

        <Button type="submit" disabled={busy} className="mt-6 w-full shadow-glow">
          {t("auth.unlock")}
        </Button>
      </form>
    </div>
  );
}

function DashboardPage() {
  const { t, tOr, lang } = useI18n();
  const store = useClinicStore();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (isAuthed()) setAuthed(true);
  }, []);
  const [tab, setTab] = useState<string>("overview");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const requests = useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.requests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.ownerName, r.petName, r.doctorName, r.phone, r.symptoms]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [store.requests, query, statusFilter]);

  if (!authed) {
    return <AuthGate onUnlocked={() => setAuthed(true)} />;
  }

  const signOut = () => {
    logout();
    setAuthed(false);
  };

  const pendingCount = store.requests.filter((r) => r.status === "pending").length;
  const confirmedCount = store.requests.filter((r) => r.status === "confirmed").length;
  const completedCount = store.requests.filter((r) => r.status === "completed").length;

  const todayISO = new Date().toISOString().slice(0, 10);
  const stats = [
    {
      key: "dash.overview.stats.pending",
      value: pendingCount,
      icon: Radio,
      tone: "text-amber-500",
    },
    {
      key: "dash.overview.stats.confirmed",
      value: confirmedCount,
      icon: CalendarClock,
      tone: "text-success",
    },
    {
      key: "dash.overview.stats.completed",
      value: completedCount,
      icon: HeartPulse,
      tone: "text-primary",
    },
    {
      key: "dash.overview.stats.doctors",
      value: store.doctors.length,
      icon: Stethoscope,
      tone: "text-violet-500",
    },
  ];

  const confirmReq = (id: string) => {
    setBookingStatus(id, "confirmed");
    toast.success(t("dash.toast.confirmed"));
  };
  const cancelReq = (id: string) => {
    setBookingStatus(id, "cancelled");
    toast.success(t("dash.toast.cancelled"));
  };
  const removeReq = (id: string) => {
    deleteRequest(id);
    toast.success(t("dash.toast.deleted"));
  };

  const todayAppointments = store.requests
    .filter((r) => r.date === todayISO && r.status === "confirmed")
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcoming = store.requests
    .filter((r) => r.status === "confirmed" && r.date >= todayISO)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const recent = [...store.requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex max-w-7xl gap-6 px-5 py-10 pt-20 sm:px-8 sm:pt-24">
        <aside className="sticky top-24 hidden h-fit min-w-[200px] shrink-0 lg:block">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  tab === item.id
                    ? "bg-card text-foreground shadow-card"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {t(`dash.${item.id}`)}
                {item.id === "requests" && pendingCount > 0 && (
                  <span className="ms-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <Button asChild variant="outline" className="mt-6 w-full">
            <a href="/">{t("dash.back")}</a>
          </Button>
          <Button variant="ghost" className="mt-2 w-full" onClick={signOut}>
            <LogOut className="size-4" /> {t("auth.signOut")}
          </Button>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{t("dash.title")}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t("dash.subtitle")}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:hidden">
                <label className="sr-only">{t("dash.srSection")}</label>
                <select
                  value={tab}
                  onChange={(e) => setTab(e.target.value)}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  aria-label={t("dash.title")}
                >
                  {NAV_ITEMS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {t(`dash.${item.id}`)}
                    </option>
                  ))}
                </select>
                <Button asChild variant="outline" size="sm">
                  <a href="/">{t("dash.back")}</a>
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="size-4" /> {t("auth.signOut")}
                </Button>
              </div>
            </div>
            <Separator className="mt-4" />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {tab === "overview" && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((s) => (
                      <Card key={s.key}>
                        <CardContent className="flex items-center justify-between p-5">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">{t(s.key)}</p>
                            <p className="mt-1 text-3xl font-bold">{s.value}</p>
                          </div>
                          <s.icon className={cn("size-6", s.tone)} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t("dash.overview.today")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {todayAppointments.length === 0 ? (
                        <p className="py-4 text-sm text-muted-foreground">
                          {t("dash.overview.noData")}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {todayAppointments.map((r) => (
                            <div
                              key={r.id}
                              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3"
                            >
                              <div className="flex items-center gap-3">
                                <span className="grid size-9 place-items-center rounded-lg bg-success/15 font-mono text-xs font-bold text-success">
                                  {r.time}
                                </span>
                                <div>
                                  <p className="text-sm font-semibold">
                                    {r.petName}{" "}
                                    <span className="text-muted-foreground">— {r.ownerName}</span>
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {r.doctorName} · {tOr(`animal.${r.animalType}`, r.animalType)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setBookingStatus(r.id, "completed");
                                  toast.success(t("dash.toast.completed"));
                                }}
                              >
                                {t("dash.complete")}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{t("dash.overview.recent")}</CardTitle>
                        <CardDescription>{t("dash.overview.recentDesc")}</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setTab("requests")}>
                        {t("dash.overview.viewAll")}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {recent.length === 0 ? (
                        <p className="py-4 text-sm text-muted-foreground">{t("dash.empty")}</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableBody>
                              {recent.map((r) => (
                                <TableRow key={r.id}>
                                  <TableCell className="whitespace-nowrap font-medium">
                                    {r.ownerName}
                                  </TableCell>
                                  <TableCell className="whitespace-nowrap">{r.petName}</TableCell>
                                  <TableCell className="whitespace-nowrap">
                                    {formatDate(r.date, lang)}
                                  </TableCell>
                                  <TableCell className="whitespace-nowrap">{r.time}</TableCell>
                                  <TableCell>
                                    <StatusBadge status={r.status} />
                                  </TableCell>
                                  <TableCell className="text-end">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7"
                                      onClick={() => setTab("requests")}
                                    >
                                      {t("dash.openRow")}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {tab === "requests" && (
                <Card>
                  <CardHeader className="space-y-4">
                    <CardTitle className="text-base">{t("dash.requests")}</CardTitle>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="w-full sm:max-w-xs">
                        <Input
                          placeholder={t("dash.search")}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          aria-label={t("dash.search")}
                        />
                      </div>
                      <ToggleGroup
                        type="single"
                        value={statusFilter}
                        onValueChange={(v) => setStatusFilter((v as Status | "all") ?? "all")}
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <ToggleGroupItem key={o.value} value={o.value} className="text-xs">
                            {t(o.key)}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                      <p className="text-xs text-muted-foreground">
                        {t("dash.showing", {
                          count: String(requests.length),
                          rows: t("dash.rows"),
                        })}
                      </p>
                      <Button size="sm" variant="outline" onClick={() => setTab("reservations")}>
                        <CalendarCheck className="size-4" /> {t("dash.viewReservations")}
                      </Button>
                    </div>
                    <div className="pt-3">
                      <RequestsTable
                        requests={requests}
                        onConfirm={confirmReq}
                        onCancel={cancelReq}
                        onDelete={removeReq}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {tab === "reservations" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t("dash.reservations")}</CardTitle>
                    <CardDescription>{t("dash.reservationsDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcoming.length === 0 ? (
                      <p className="py-6 text-sm text-muted-foreground">{t("dash.empty")}</p>
                    ) : (
                      <div className="space-y-3">
                        {upcoming.map((r) => (
                          <div key={r.id} className="rounded-xl border border-border p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">
                                  {formatDate(r.date, lang)} · {r.time}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {r.petName} ({tOr(`animal.${r.animalType}`, r.animalType)}) —{" "}
                                  {r.ownerName}
                                </p>
                                <p className="text-xs text-muted-foreground">{r.doctorName}</p>
                                {r.emergency && (
                                  <Badge className="mt-2 border-amber-500/30 bg-rose-500/15 text-rose-600">
                                    {t("dash.emergency.yes")}
                                  </Badge>
                                )}
                              </div>
                              <StatusBadge status={r.status} />
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setBookingStatus(r.id, "completed");
                                  toast.success(t("dash.toast.completed"));
                                }}
                              >
                                {t("dash.complete")}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => cancelReq(r.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                {t("dash.cancelRow")}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {tab === "doctors" && <DoctorsPanel />}
              {tab === "services" && <ServicesPanel />}
              {tab === "settings" && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
