import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { PawMLogo } from "@/components/PawMMark";
import { Bell, Lock, LogOut, RefreshCw } from "lucide-react";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Banknote,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  HeartPulse,
  History,
  LayoutDashboard,
  ListChecks,
  LogIn,
  MessageSquareText,
  Package,
  Pencil,
  Plus,
  Radio,
  Settings,
  ShoppingBag,
  Star,
  Stethoscope,
  Timer,
  Trash2,
  UploadCloud,
  Users,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Dashboard Panels
import { StaffOverviewPanel } from "@/components/dashboard/StaffOverviewPanel";
import { PayrollPanel } from "@/components/dashboard/PayrollPanel";
import { TasksPanel } from "@/components/dashboard/TasksPanel";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import {
  PaginationBar,
  SearchBox,
  SortChip,
  sortedSlice,
  useGrid,
  useSortState,
  type SortState,
} from "@/components/dash-grid";
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
  archiveBooking,
  archiveOrder,
  checkIn,
  checkOut,
  createPayment,
  deleteDoctor,
  deleteOrder,
  deletePayment,
  deleteProduct,
  deleteRequest,
  deleteReview,
  deleteService,
  loadAuditLogs,
  loadWorkDay,
  loadWorkDays,
  refreshClinicData,
  saveDoctor,
  saveProduct,
  saveService,
  setBookingStatus,
  setOrderPaymentStatus,
  setOrderStatus,
  setReviewStatus,
  syncGoogleReviews as syncReviews,
  updatePayment,
  updateSettings,
  useClinicStore,
  type AuditLog,
  type BookingRequest,
  type Doctor,
  type Order,
  type Payment,
  type PaymentMethod,
  type Product,
  type Review,
  type ServiceItem,
  type Status,
} from "@/lib/clinic-store";
import {
  changeCredentials,
  currentRole,
  currentUsername,
  hasMinRole,
  isAuthConfigured,
  isAuthed,
  login,
  logout,
  MIN_PASSWORD,
  MIN_USERNAME,
  register,
  remainingLockMs,
} from "@/lib/auth";
import { useI18n, type Lang, LanguageToggle } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Staff Dashboard — Paw-M" }, { name: "robots", content: "noindex, nofollow" }],
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

function formatDayName(dateISO: string, lang: Lang) {
  if (!dateISO) return "—";
  const d = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateISO;
  return d.toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dayCountsLine(
  t: (k: string, v?: Record<string, string>) => string,
  bookings: number,
  orders: number,
  payments: number,
) {
  const part = (n: number, one: string, many: string) =>
    n === 1 ? t(one) : t(many, { n: String(n) });
  return [
    part(bookings, "workdays.counts.apptOne", "workdays.counts.apptMany"),
    part(orders, "workdays.counts.orderOne", "workdays.counts.orderMany"),
    part(payments, "workdays.counts.payOne", "workdays.counts.payMany"),
  ].join(" · ");
}

function clock(iso: string, lang: Lang) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString(lang === "ar" ? "ar" : "en-US", {
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
  onArchive,
}: {
  requests: BookingRequest[];
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
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
                  {(r.status === "completed" || r.status === "cancelled") && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-muted-foreground hover:text-foreground"
                      aria-label={t("dash.archive")}
                      title={t("dash.archive")}
                      onClick={() => onArchive(r.id)}
                    >
                      <Archive className="size-3.5" />
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

  const save = async () => {
    await saveService({
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

function ServicesPanel() {
  const { t, tOr } = useI18n();
  const { services } = useClinicStore();
  const [editing, setEditing] = useState<ServiceItem | "new" | null>(null);
  const [query, setQuery] = useState("");
  const grid = useGrid(services, query, ["title", "description"]);

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
        <div className="mb-4">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
        </div>
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
              {grid.slice.map((s) => (
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
                        onClick={async () => {
                          await deleteService(s.slug);
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
        <ServiceDialog
          service={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </Card>
  );
}

function formatMoney(amount: number, currency: string) {
  return currency === "$" ? `$${amount.toFixed(2)}` : `${currency} ${amount.toFixed(2)}`;
}

function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  const { t } = useI18n();
  const styles: Record<PaymentMethod, string> = {
    cash: "bg-amber-500/15 text-amber-600",
    fawry: "bg-primary/15 text-primary",
    instapay: "bg-violet-500/15 text-violet-600",
  };
  return (
    <Badge variant="outline" className={cn("border-transparent", styles[method])}>
      {t(`checkout.method.${method}.short`)}
    </Badge>
  );
}

function PaymentStatusBadge({ status }: { status: "unpaid" | "paid" }) {
  const { t } = useI18n();
  return status === "paid" ? (
    <Badge className="border-transparent bg-success/15 text-success">{t("pay.paid")}</Badge>
  ) : (
    <Badge className="border-transparent bg-muted text-muted-foreground">{t("pay.unpaid")}</Badge>
  );
}

function PaymentDialog({ payment, onClose }: { payment: Payment | null; onClose: () => void }) {
  const { t } = useI18n();
  const [title, setTitle] = useState(payment?.title ?? "");
  const [amount, setAmount] = useState(payment ? String(payment.amount) : "");
  const [method, setMethod] = useState<PaymentMethod>(payment?.method ?? "cash");
  const [status, setStatus] = useState<"unpaid" | "paid">(payment?.status ?? "paid");
  const [date, setDate] = useState(payment?.date ?? new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState(payment?.notes ?? "");
  const [orderId, setOrderId] = useState(payment?.orderId ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const value = Number.parseFloat(amount);
    if (!title.trim() || !Number.isFinite(value) || value <= 0) {
      toast.error(t("payments.invalid"));
      return;
    }
    setSaving(true);
    try {
      if (payment) {
        await updatePayment(payment.id, {
          title: title.trim(),
          amount: value,
          method,
          status,
          date,
          notes: notes.trim(),
          orderId: orderId.trim(),
        });
      } else {
        await createPayment({
          title: title.trim(),
          amount: value,
          method,
          status,
          date,
          notes: notes.trim(),
          orderId: orderId.trim(),
        });
      }
      toast.success(t("dash.toast.saved"));
      onClose();
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{payment ? t("payments.edit") : t("payments.add")}</DialogTitle>
          <DialogDescription>
            {payment ? t("payments.editHint") : t("payments.addHint")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label={t("payments.title")}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("payments.titlePlaceholder")}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("payments.amount")}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Field>
            <Field label={t("payments.date")}>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("payments.method")}>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="cash">{t("checkout.method.cash.short")}</option>
                <option value="fawry">{t("checkout.method.fawry.short")}</option>
                <option value="instapay">{t("checkout.method.instapay.short")}</option>
              </select>
            </Field>
            <Field label={t("payments.status")}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "unpaid" | "paid")}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="paid">{t("pay.paid")}</option>
                <option value="unpaid">{t("pay.unpaid")}</option>
              </select>
            </Field>
          </div>
          <Field label={t("payments.orderId")}>
            <Input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder={t("payments.orderIdHint")}
            />
          </Field>
          <Field label={t("payments.notes")}>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder={t("payments.notesPlaceholder")}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {t("payments.cancel")}
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? t("payments.saving") : t("payments.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PaymentsPanel() {
  const { t, lang } = useI18n();
  const { payments, settings } = useClinicStore();
  const [editing, setEditing] = useState<Payment | null>(null);
  const [adding, setAdding] = useState(false);
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [instapayDraft, setInstapayDraft] = useState(settings.instapay);
  const [query, setQuery] = useState("");
  const { sort, toggle } = useSortState("date", "desc");
  const comparators: Record<string, (a: Payment, b: Payment) => number> = {
    date: (a, b) => a.date.localeCompare(b.date),
    amount: (a, b) => a.amount - b.amount,
    title: (a, b) => a.title.localeCompare(b.title),
  };

  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const collected = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === "unpaid").reduce((s, p) => s + p.amount, 0);
  const thisMonth = payments
    .filter((p) => p.status === "paid" && p.date.startsWith(monthPrefix))
    .reduce((s, p) => s + p.amount, 0);

  const summary = [
    {
      key: "payments.summary.collected",
      value: formatMoney(collected, settings.currency),
      icon: Wallet,
      tone: "text-success",
    },
    {
      key: "payments.summary.pending",
      value: formatMoney(pending, settings.currency),
      icon: Banknote,
      tone: "text-amber-500",
    },
    {
      key: "payments.summary.month",
      value: formatMoney(thisMonth, settings.currency),
      icon: CalendarClock,
      tone: "text-primary",
    },
    {
      key: "payments.summary.records",
      value: String(payments.length),
      icon: ListChecks,
      tone: "text-violet-500",
    },
  ];

  const filtered = payments.filter((p) => {
    if (methodFilter !== "all" && p.method !== methodFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });
  const sorted = sortedSlice(filtered, sort, comparators);
  const grid = useGrid(sorted, query, ["title", "notes", "orderId"]);

  const remove = async (id: string) => {
    await deletePayment(id);
    toast.success(t("dash.toast.deleted"));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <Card key={s.key}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{t(s.key)}</p>
                <p className="mt-1 text-2xl font-bold">{s.value}</p>
              </div>
              <s.icon className={cn("size-6", s.tone)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("payments.providers")}</CardTitle>
          <CardDescription>{t("payments.providersDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold">{t("payments.instapay")}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "border-transparent",
                    settings.instapay.trim()
                      ? "bg-success/15 text-success"
                      : "bg-amber-500/15 text-amber-600",
                  )}
                >
                  {settings.instapay.trim()
                    ? t("payments.configured")
                    : t("payments.notConfigured")}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t("payments.instapayHint")}</p>
              <Input
                className="mt-3"
                value={instapayDraft}
                onChange={(e) => setInstapayDraft(e.target.value)}
                placeholder={t("dash.settings.instapay")}
                aria-label={t("payments.instapay")}
              />
            </div>
            <Button
              size="sm"
              disabled={instapayDraft.trim() === settings.instapay.trim()}
              onClick={async () => {
                await updateSettings({ instapay: instapayDraft.trim() });
                toast.success(t("dash.toast.saved"));
              }}
            >
              {t("payments.providersSave")}
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2">
                <Badge className="border-transparent bg-primary/15 text-primary">
                  {t("payments.fawry")}
                </Badge>
                <p className="text-xs text-muted-foreground">{t("payments.fawryInfo")}</p>
              </div>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2">
                <Badge className="border-transparent bg-amber-500/15 text-amber-600">
                  {t("payments.cash")}
                </Badge>
                <p className="text-xs text-muted-foreground">{t("payments.cashInfo")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">{t("dash.payments")}</CardTitle>
              <CardDescription>{t("payments.hint")}</CardDescription>
            </div>
            <Button size="sm" onClick={() => setAdding(true)}>
              <Plus className="size-4" /> {t("payments.add")}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", key: "dash.filterAll" },
                { value: "cash", key: "checkout.method.cash.short" },
                { value: "fawry", key: "checkout.method.fawry.short" },
                { value: "instapay", key: "checkout.method.instapay.short" },
              ].map((m) => (
                <button
                  key={m.value}
                  onClick={() => {
                    setMethodFilter(m.value);
                    grid.setPage(1);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    methodFilter === m.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(m.key)}
                </button>
              ))}
              <span className="mx-1 hidden w-px bg-border sm:block" />
              {[
                { value: "all", key: "dash.filterAll" },
                { value: "paid", key: "pay.paid" },
                { value: "unpaid", key: "pay.unpaid" },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    setStatusFilter(s.value);
                    grid.setPage(1);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    statusFilter === s.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(s.key)}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <SortChip
                label={t("dash.sort.date")}
                active={sort.key === "date"}
                dir={sort.dir}
                onToggle={() => toggle("date", true)}
              />
              <SortChip
                label={t("dash.sort.amount")}
                active={sort.key === "amount"}
                dir={sort.dir}
                onToggle={() => toggle("amount", true)}
              />
              <SortChip
                label={t("dash.sort.title")}
                active={sort.key === "title"}
                dir={sort.dir}
                onToggle={() => toggle("title")}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {grid.slice.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">{t("dash.empty")}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("payments.date")}</TableHead>
                      <TableHead>{t("payments.title")}</TableHead>
                      <TableHead>{t("payments.method")}</TableHead>
                      <TableHead className="text-end">{t("payments.amount")}</TableHead>
                      <TableHead>{t("payments.status")}</TableHead>
                      <TableHead>{t("payments.notes")}</TableHead>
                      <TableHead className="text-end">{t("dash.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grid.slice.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="whitespace-nowrap text-sm">
                          {formatDate(p.date, lang)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{p.title}</div>
                          {p.orderId && (
                            <div className="font-mono text-[11px] text-muted-foreground">
                              {p.orderId}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <PaymentMethodBadge method={p.method} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-end font-bold">
                          {formatMoney(p.amount, settings.currency)}
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={p.status} />
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate text-xs text-muted-foreground" title={p.notes}>
                            {p.notes || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2"
                              aria-label={t("dash.edit")}
                              onClick={() => setEditing(p)}
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-muted-foreground hover:text-destructive"
                              aria-label={t("dash.delete")}
                              onClick={() => remove(p.id)}
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
              <PaginationBar
                total={grid.total}
                page={grid.page}
                pageSize={grid.pageSize}
                pageCount={grid.pageCount}
                onPage={grid.setPage}
                onPageSize={grid.setPageSize}
              />
            </>
          )}
        </CardContent>
      </Card>

      {adding && <PaymentDialog payment={null} onClose={() => setAdding(false)} />}
      {editing && <PaymentDialog payment={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ArchivePanel() {
  const { t, lang } = useI18n();
  const { requests, orders, settings } = useClinicStore();
  const [reqQuery, setReqQuery] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const { sort: reqSort, toggle: toggleReqSort } = useSortState("newest", "desc");
  const { sort: ordSort, toggle: toggleOrdSort } = useSortState("newest", "desc");

  const archivedRequests = useMemo(() => requests.filter((r) => r.archived), [requests]);
  const archivedOrders = useMemo(() => orders.filter((o) => o.archived), [orders]);

  const reqComparators: Record<string, (a: BookingRequest, b: BookingRequest) => number> = {
    newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    appointment: (a, b) => (a.date + a.time).localeCompare(b.date + b.time),
    owner: (a, b) => a.ownerName.localeCompare(b.ownerName),
  };
  const ordComparators: Record<string, (a: Order, b: Order) => number> = {
    newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    owner: (a, b) => a.customerName.localeCompare(b.customerName),
    total: (a, b) => a.total - b.total,
  };
  const sortedReqs = sortedSlice(archivedRequests, reqSort, reqComparators);
  const sortedOrds = sortedSlice(archivedOrders, ordSort, ordComparators);
  const reqGrid = useGrid(sortedReqs, reqQuery, ["ownerName", "petName", "doctorName", "phone"]);
  const ordGrid = useGrid(sortedOrds, orderQuery, ["customerName", "phone", "email", "id"]);

  const restoreReq = async (id: string) => {
    await archiveBooking(id, false);
    toast.success(t("dash.toast.restored"));
  };
  const deleteReq = async (id: string) => {
    await deleteRequest(id);
    toast.success(t("dash.toast.deleted"));
  };
  const restoreOrd = async (id: string) => {
    await archiveOrder(id, false);
    toast.success(t("dash.toast.restored"));
  };
  const deleteOrd = async (id: string) => {
    await deleteOrder(id);
    toast.success(t("dash.toast.deleted"));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">{t("archive.requests")}</CardTitle>
              <CardDescription>{t("archive.requestsDesc")}</CardDescription>
            </div>
            {archivedRequests.length > 0 && (
              <Badge variant="outline" className="text-muted-foreground">
                {archivedRequests.length}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SearchBox value={reqQuery} onChange={setReqQuery} placeholder={t("dash.search")} />
            <div className="flex flex-wrap items-center gap-1.5">
              <SortChip
                label={t("dash.sort.recent")}
                active={reqSort.key === "newest"}
                dir={reqSort.dir}
                onToggle={() => toggleReqSort("newest", true)}
              />
              <SortChip
                label={t("dash.sort.appointment")}
                active={reqSort.key === "appointment"}
                dir={reqSort.dir}
                onToggle={() => toggleReqSort("appointment")}
              />
              <SortChip
                label={t("dash.sort.owner")}
                active={reqSort.key === "owner"}
                dir={reqSort.dir}
                onToggle={() => toggleReqSort("owner")}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reqGrid.slice.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">{t("archive.empty")}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("dash.owner")}</TableHead>
                      <TableHead>{t("dash.pet")}</TableHead>
                      <TableHead>{t("dash.date")}</TableHead>
                      <TableHead>{t("dash.time")}</TableHead>
                      <TableHead>{t("dash.statusCol")}</TableHead>
                      <TableHead className="text-end">{t("dash.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reqGrid.slice.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="whitespace-nowrap font-medium">{r.ownerName}</div>
                          <div className="whitespace-nowrap text-xs text-muted-foreground">
                            {r.phone}
                          </div>
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
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7"
                              onClick={() => restoreReq(r.id)}
                            >
                              <ArchiveRestore className="size-3.5" /> {t("archive.restore")}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-muted-foreground hover:text-destructive"
                              aria-label={t("dash.delete")}
                              title={t("archive.deletePermanent")}
                              onClick={() => deleteReq(r.id)}
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
              <PaginationBar
                total={reqGrid.total}
                page={reqGrid.page}
                pageSize={reqGrid.pageSize}
                pageCount={reqGrid.pageCount}
                onPage={reqGrid.setPage}
                onPageSize={reqGrid.setPageSize}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">{t("archive.orders")}</CardTitle>
              <CardDescription>{t("archive.ordersDesc")}</CardDescription>
            </div>
            {archivedOrders.length > 0 && (
              <Badge variant="outline" className="text-muted-foreground">
                {archivedOrders.length}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SearchBox value={orderQuery} onChange={setOrderQuery} placeholder={t("dash.search")} />
            <div className="flex flex-wrap items-center gap-1.5">
              <SortChip
                label={t("dash.sort.recent")}
                active={ordSort.key === "newest"}
                dir={ordSort.dir}
                onToggle={() => toggleOrdSort("newest", true)}
              />
              <SortChip
                label={t("dash.sort.owner")}
                active={ordSort.key === "owner"}
                dir={ordSort.dir}
                onToggle={() => toggleOrdSort("owner")}
              />
              <SortChip
                label={t("dash.sort.total")}
                active={ordSort.key === "total"}
                dir={ordSort.dir}
                onToggle={() => toggleOrdSort("total", true)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {ordGrid.slice.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">{t("archive.empty")}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("dash.owner")}</TableHead>
                      <TableHead>{t("payments.amount")}</TableHead>
                      <TableHead>{t("payments.method")}</TableHead>
                      <TableHead>{t("payments.status")}</TableHead>
                      <TableHead>{t("dash.statusCol")}</TableHead>
                      <TableHead className="text-end">{t("dash.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordGrid.slice.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>
                          <div className="whitespace-nowrap font-medium">{o.customerName}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">{o.id}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-bold">
                          {formatMoney(o.total, settings.currency)}
                        </TableCell>
                        <TableCell>
                          <PaymentMethodBadge method={o.paymentMethod} />
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge
                            status={o.paymentStatus === "paid" ? "paid" : "unpaid"}
                          />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={o.status} />
                        </TableCell>
                        <TableCell className="text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7"
                              onClick={() => restoreOrd(o.id)}
                            >
                              <ArchiveRestore className="size-3.5" /> {t("archive.restore")}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-muted-foreground hover:text-destructive"
                              aria-label={t("dash.delete")}
                              title={t("archive.deletePermanent")}
                              onClick={() => deleteOrd(o.id)}
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
              <PaginationBar
                total={ordGrid.total}
                page={ordGrid.page}
                pageSize={ordGrid.pageSize}
                pageCount={ordGrid.pageCount}
                onPage={ordGrid.setPage}
                onPageSize={ordGrid.setPageSize}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsPanel() {
  const { t, lang, setLang } = useI18n();
  const { settings } = useClinicStore();
  const [gsBusy, setGsBusy] = useState(false);
  const [gsResult, setGsResult] = useState<{ synced: number; total: number } | null>(null);
  const [gsError, setGsError] = useState<string | null>(null);
  const [credsForm, setCredsForm] = useState({
    currentPassword: "",
    newUsername: "",
    newPassword: "",
    confirm: "",
  });
  const [form, setForm] = useState({
    name: settings.name,
    tagline: settings.tagline,
    phone: settings.phone,
    emergency: settings.emergency,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    currency: settings.currency,
    instapay: settings.instapay,
  });

  useEffect(() => {
    setForm({
      name: settings.name,
      tagline: settings.tagline,
      phone: settings.phone,
      emergency: settings.emergency,
      whatsapp: settings.whatsapp,
      email: settings.email,
      address: settings.address,
      currency: settings.currency,
      instapay: settings.instapay,
    });
  }, [settings]);

  const save = async () => {
    if (!form.currency.trim()) {
      toast.error(t("dash.settings.currencyEmpty"));
      return;
    }
    try {
      await updateSettings({ ...form, currency: form.currency.trim() });
      toast.success(t("dash.toast.saved"));
    } catch {
      toast.error(t("dash.toast.error"));
    }
  };

  const doSync = async () => {
    setGsBusy(true);
    setGsError(null);
    setGsResult(null);
    try {
      const r = await syncReviews();
      setGsResult(r);
      toast.success(
        t("dash.settings.googleSyncSuccess", {
          synced: String(r.synced),
          total: String(r.total),
        }),
      );
    } catch {
      setGsError(t("dash.settings.googleSyncFail"));
      toast.error(t("dash.settings.googleSyncFail"));
    } finally {
      setGsBusy(false);
    }
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
          <Field label={t("dash.settings.tagline")}>
            <Input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
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
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("dash.settings.currency")}>
              <Input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                maxLength={8}
                placeholder="$"
              />
            </Field>
            <Field label={t("dash.settings.instapay")}>
              <Input
                value={form.instapay}
                onChange={(e) => setForm({ ...form, instapay: e.target.value })}
                maxLength={80}
                placeholder="01xxxxxxxxxx"
              />
            </Field>
          </div>
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
          <CardTitle className="text-base">{t("auth.changeCredentials")}</CardTitle>
          <CardDescription>{t("auth.changeCredentialsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label={t("auth.currentPassword")}>
            <Input
              type="password"
              value={credsForm.currentPassword}
              onChange={(e) => setCredsForm({ ...credsForm, currentPassword: e.target.value })}
              autoComplete="current-password"
              maxLength={128}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("auth.newUsername")}>
              <Input
                value={credsForm.newUsername}
                onChange={(e) => setCredsForm({ ...credsForm, newUsername: e.target.value })}
                autoComplete="username"
                maxLength={40}
              />
            </Field>
            <Field label={t("auth.newPassword")}>
              <Input
                type="password"
                value={credsForm.newPassword}
                onChange={(e) => setCredsForm({ ...credsForm, newPassword: e.target.value })}
                autoComplete="new-password"
                maxLength={128}
              />
            </Field>
          </div>
          <Field label={t("auth.confirmNewPassword")}>
            <Input
              type="password"
              value={credsForm.confirm}
              onChange={(e) => setCredsForm({ ...credsForm, confirm: e.target.value })}
              autoComplete="new-password"
              maxLength={128}
            />
          </Field>
          <div className="flex items-center gap-3">
            <Button
              onClick={async () => {
                if (credsForm.newPassword !== credsForm.confirm) {
                  toast.error(t("auth.mismatch"));
                  return;
                }
                if (credsForm.newUsername && credsForm.newUsername.trim().length < MIN_USERNAME) {
                  toast.error(t("auth.usernameTooShort"));
                  return;
                }
                if (credsForm.newPassword && credsForm.newPassword.length < MIN_PASSWORD) {
                  toast.error(t("auth.passTooShort"));
                  return;
                }
                if (!credsForm.newUsername && !credsForm.newPassword) {
                  toast.error(t("auth.nothingToChange"));
                  return;
                }
                try {
                  const payload: {
                    currentPassword: string;
                    newUsername?: string;
                    newPassword?: string;
                  } = { currentPassword: credsForm.currentPassword };
                  if (credsForm.newUsername) payload.newUsername = credsForm.newUsername;
                  if (credsForm.newPassword) payload.newPassword = credsForm.newPassword;
                  await changeCredentials(payload);
                  toast.success(t("auth.credsChanged"));
                  setCredsForm({
                    currentPassword: "",
                    newUsername: "",
                    newPassword: "",
                    confirm: "",
                  });
                } catch {
                  toast.error(t("auth.wrongCurrent"));
                }
              }}
            >
              {t("auth.changeCredentials")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("dash.settings.googleSync")}</CardTitle>
          <CardDescription>{t("dash.settings.googleSyncDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button onClick={doSync} disabled={gsBusy} variant="outline" size="sm">
            <RefreshCw className={cn("size-4", gsBusy && "animate-spin")} />
            {gsBusy ? t("dash.settings.googleSyncBtn") + "…" : t("dash.settings.googleSyncBtn")}
          </Button>
          {gsResult && !gsError && (
            <span className="text-xs text-success">
              ✓{" "}
              {t("dash.settings.googleSyncSuccess", {
                synced: String(gsResult.synced),
                total: String(gsResult.total),
              })}
            </span>
          )}
          {gsError && <span className="text-xs text-destructive">{gsError}</span>}
        </CardContent>
      </Card>
    </div>
  );
}

const PRODUCT_CATEGORIES = ["food", "treats", "toys", "grooming", "health", "accessories"] as const;
const PET_TYPES = ["dog", "cat", "both"] as const;
const LOW_STOCK_THRESHOLD = 5;

const EMPTY_PRODUCT = {
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    stock: "",
    image: "",
    category: "accessories",
    petType: "both",
    featured: false,
    barcode: "",
  };

function ProductDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { t } = useI18n();
  const [form, setForm] = useState(() =>
product
        ? {
            name: product.name,
            description: product.description,
            price: String(product.price),
            compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : "",
            stock: String(product.stock),
            image: product.image,
            category: product.category,
            petType: product.petType ?? "both",
            featured: product.featured,
            barcode: product.barcode ?? "",
          }
      : EMPTY_PRODUCT,
  );

  const save = async () => {
    const price = Number(form.price);
    const stock = Number(form.stock);
    const compareRaw = form.compareAtPrice.trim();
    const compareAt = compareRaw ? Number(compareRaw) : null;
    if (!form.name.trim()) {
      toast.error(t("dash.form.product.requiredName"));
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      toast.error(t("dash.form.product.requiredPrice"));
      return;
    }
    if (compareAt !== null && (!Number.isFinite(compareAt) || compareAt < price)) {
      toast.error(t("dash.form.product.requiredCompare"));
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      toast.error(t("dash.form.product.requiredStock"));
      return;
    }
await saveProduct({
        id: product?.id ?? `prod-${Date.now().toString(36)}`,
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        compareAtPrice: compareAt,
        stock,
        image: form.image.trim(),
        category: form.category || "accessories",
        petType: form.petType,
        featured: form.featured,
        barcode: form.barcode.trim(),
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
          <DialogTitle>{product ? t("dash.editProduct") : t("dash.addProduct")}</DialogTitle>
          <DialogDescription>{t("dash.products.hint")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label={t("dash.form.product.name")}>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label={t("dash.form.product.barcode")}>
            <Input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("dash.form.product.price")}>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </Field>
            <Field label={t("dash.form.product.compare")}>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.compareAtPrice}
                onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                placeholder={t("dash.form.product.comparePlaceholder")}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("dash.form.product.stock")}>
              <Input
                type="number"
                min={0}
                step={1}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </Field>
            <Field label={t("dash.form.product.category")}>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`store.cat.${c}`)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label={t("dash.form.product.petType")}>
            <select
              value={form.petType}
              onChange={(e) => setForm({ ...form, petType: e.target.value })}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {PET_TYPES.map((p) => (
                <option key={p} value={p}>
                  {t(`store.pet.${p}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("dash.form.product.image")}>
            <Input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://…"
            />
          </Field>
          {form.image && (
            <img
              src={form.image}
              alt=""
              className="h-32 w-full rounded-xl border border-border object-cover"
            />
          )}
          <Field label={t("dash.form.product.desc")}>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="size-4 rounded border-input accent-primary"
            />
            {t("dash.form.product.featured")}
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("dash.cancel")}
          </Button>
          <Button onClick={save}>{t("dash.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProductsPanel() {
  const { t } = useI18n();
  const { products, settings } = useClinicStore();
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [petType, setPetType] = useState<string>("all");
  const [importOpen, setImportOpen] = useState(false);
  const { sort, toggle } = useSortState("name");
  const comparators: Record<string, (a: Product, b: Product) => number> = {
    name: (a, b) => a.name.localeCompare(b.name),
    price: (a, b) => a.price - b.price,
    stock: (a, b) => a.stock - b.stock,
  };
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (petType === "all" || (p.petType ?? "both") === petType),
      ),
    [products, category, petType],
  );
  const sorted = sortedSlice(filtered, sort, comparators);
  const grid = useGrid(sorted, query, ["name", "category", "id"]);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">{t("dash.products")}</CardTitle>
          <CardDescription>{t("dash.products.hint")}</CardDescription>
        </div>
<Button size="sm" onClick={() => setEditing("new")}>
            <Plus className="size-4" /> {t("dash.addProduct")}
          </Button>
          <Button size="sm" onClick={() => setImportOpen(true)}>
            <UploadCloud className="size-4" /> {t("dash.importProducts")}
          </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              grid.setPage(1);
            }}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            aria-label={t("dash.form.product.category")}
          >
            <option value="all">{t("dash.filterAll")}</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`store.cat.${c}`)}
              </option>
            ))}
          </select>
          <select
            value={petType}
            onChange={(e) => {
              setPetType(e.target.value);
              grid.setPage(1);
            }}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            aria-label={t("dash.form.product.petType")}
          >
            <option value="all">{t("dash.filterAll")}</option>
            {PET_TYPES.map((p) => (
              <option key={p} value={p}>
                {t(`store.pet.${p}`)}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap items-center gap-1.5">
            <SortChip
              label={t("dash.sort.name")}
              active={sort.key === "name"}
              dir={sort.dir}
              onToggle={() => toggle("name")}
            />
            <SortChip
              label={t("dash.sort.price")}
              active={sort.key === "price"}
              dir={sort.dir}
              onToggle={() => toggle("price", true)}
            />
            <SortChip
              label={t("dash.sort.stock")}
              active={sort.key === "stock"}
              dir={sort.dir}
              onToggle={() => toggle("stock", true)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("dash.form.product.name")}</TableHead>
                <TableHead>{t("dash.form.product.category")}</TableHead>
                <TableHead>{t("dash.form.product.petType")}</TableHead>
                <TableHead>{t("dash.form.product.price")}</TableHead>
                <TableHead>{t("dash.form.product.stock")}</TableHead>
                <TableHead>{t("dash.form.product.featured")}</TableHead>
                <TableHead className="text-end">{t("dash.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grid.slice.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {p.image && (
                        <img
                          src={p.image}
                          alt=""
                          className="size-10 rounded-lg border border-border object-cover"
                        />
                      )}
                      <span className="whitespace-nowrap font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {t(`store.cat.${p.category}`)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {t(`store.pet.${p.petType ?? "both"}`)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm font-semibold">
                    {settings.currency === "$"
                      ? `$${p.price.toFixed(2)}`
                      : `${settings.currency} ${p.price.toFixed(2)}`}
                    {p.compareAtPrice != null && p.compareAtPrice > p.price && (
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground line-through">
                        {settings.currency === "$"
                          ? `$${p.compareAtPrice.toFixed(2)}`
                          : `${settings.currency} ${p.compareAtPrice.toFixed(2)}`}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {p.stock <= 0 ? (
                      <Badge className="bg-destructive/15 text-destructive">
                        {t("store.outOfStock")}
                      </Badge>
                    ) : p.stock <= LOW_STOCK_THRESHOLD ? (
                      <Badge className="bg-amber-500/15 text-amber-600">
                        {t("dash.lowStock")} · {p.stock}
                      </Badge>
                    ) : (
                      p.stock
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      aria-label={t("dash.form.product.featured")}
                      onClick={async () => {
                        await saveProduct({ ...p, featured: !p.featured });
                        toast.success(t("dash.toast.saved"));
                      }}
                    >
                      <Star
                        className={cn(
                          "size-4",
                          p.featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground",
                        )}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={() => setEditing(p)}
                      >
                        {t("dash.edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        aria-label={t("dash.delete")}
                        onClick={async () => {
                          await deleteProduct(p.id);
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
        <ProductDialog
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Import Products Dialog */}
      <Dialog open={importOpen} onOpenChange={(open) => { if (!open) setImportOpen(false); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("dash.importProducts")}</DialogTitle>
            <DialogDescription>{t("dash.importProductsHint")}</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const file = e.target.elements.file.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = async (event) => {
                const csvText = event.target.result;
                // Parse CSV and import products
                const lines = csvText.trim().split('\n');
                const headers = lines[0].split(',').map(h => h.trim());
                // Find column indices
                const nameIdx = headers.findIndex(h => h === 'Name' || h === 'Name ');
                const typeIdx = headers.findIndex(h => h === 'Type' || h === 'Type ');
                const categoryIdx = headers.findIndex(h => h === 'Category' || h === 'Category ');
                const kgIdx = headers.findIndex(h => h === 'Kg' || h === 'Kg ');
                const priceIdx = headers.findIndex(h => h === 'Price' || h === 'Price ');
                if (nameIdx === -1 || categoryIdx === -1 || kgIdx === -1 || priceIdx === -1) {
                  toast.error(t("dash.importProductsMissingColumns"));
                  return;
                }
                const productsToImport = [];
                for (let i = 1; i < lines.length; i++) {
                  const line = lines[i].trim();
                  if (!line) continue;
                  const values = line.split(',').map(v => v.trim());
                  const name = values[nameIdx] || '';
                  const type = values[typeIdx] !== undefined ? values[typeIdx] : '';
                  const category = values[categoryIdx] || '';
                  const kg = values[kgIdx] || '';
                  const priceStr = values[priceIdx] || '0';
                  if (!name || !category) continue;
                  const price = parseFloat(priceStr);
                  if (isNaN(price)) continue;
                  let petType = "both";
                  if (type) {
                    const lowerType = type.toLowerCase();
                    if (lowerType.includes('dog')) petType = "dog";
                    else if (lowerType.includes('cat')) petType = "cat";
                  }
                  let description = '';
                  if (kg) {
                    description = kg;
                  }
                  if (type && type !== kg) {
                    description = description ? `${description} ${type}`.trim() : type;
                  }
                  if (!description) {
                    description = 'Pet food product';
                  }
                  productsToImport.push({
                    name,
                    description,
                    price,
                    compareAtPrice: null,
                    image: "",
                    category,
                    petType,
                    stock: 0,
                    minStockAlert: 5,
                    featured: false,
                    barcode: "",
                  });
                }
                // Import products
                const importPromises = productsToImport.map(product => 
                  saveProduct(product)
                );
                await Promise.all(importPromises);
                toast.success(t("dash.importProductsSuccess", { count: productsToImport.length }));
                setImportOpen(false);
              };
              reader.onerror = () => {
                toast.error(t("dash.importProductsError"));
              };
              reader.readAsText(file);
            }}>
              <div className="space-y-4">
                <label className="flex flex-col space-y-1">
                  <span className="text-sm font-medium">{t("dash.uploadFile")}</span>
                  <input
                    type="file"
                    accept=".csv"
                    id="file"
                    required
                    onChange={(e) => {
                      // Reset form if needed
                    }}
                  />
                </label>
                <Button type="submit">{t("dash.import")}</Button>
              </div>
            </form>
          </DialogContent>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>
              {t("dash.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </Card>
  );
}

function OrdersPanel() {
  const { t } = useI18n();
  const { orders, settings } = useClinicStore();
  const [proofOrder, setProofOrder] = useState<Order | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const { sort, toggle } = useSortState("newest", "desc");
  const activeOrders = useMemo(() => orders.filter((o) => !o.archived), [orders]);
  const comparators: Record<string, (a: Order, b: Order) => number> = {
    newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    owner: (a, b) => a.customerName.localeCompare(b.customerName),
    total: (a, b) => a.total - b.total,
  };
  const filtered = useMemo(
    () =>
      activeOrders.filter(
        (o) =>
          (statusFilter === "all" || o.status === statusFilter) &&
          (paymentFilter === "all" || o.paymentStatus === paymentFilter),
      ),
    [activeOrders, statusFilter, paymentFilter],
  );
  const sorted = sortedSlice(filtered, sort, comparators);
  const grid = useGrid(sorted, query, ["customerName", "phone", "email", "id"]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("dash.orders")}</CardTitle>
        <CardDescription>{t("dash.orders.hint")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  setStatusFilter(s.value);
                  grid.setPage(1);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === s.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {t(s.key)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", key: "dash.filterAll" },
              { value: "paid", key: "pay.paid" },
              { value: "proof_submitted", key: "pay.underReview" },
              { value: "unpaid", key: "pay.unpaid" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  setPaymentFilter(p.value);
                  grid.setPage(1);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  paymentFilter === p.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {t(p.key)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <SortChip
              label={t("dash.sort.recent")}
              active={sort.key === "newest"}
              dir={sort.dir}
              onToggle={() => toggle("newest", true)}
            />
            <SortChip
              label={t("dash.sort.owner")}
              active={sort.key === "owner"}
              dir={sort.dir}
              onToggle={() => toggle("owner")}
            />
            <SortChip
              label={t("dash.sort.total")}
              active={sort.key === "total"}
              dir={sort.dir}
              onToggle={() => toggle("total", true)}
            />
          </div>
        </div>
        {grid.slice.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">{t("dash.empty")}</p>
        ) : (
          <>
            <div className="space-y-3">
              {grid.slice.map((o) => (
                <div key={o.id} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{o.customerName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {o.phone} · {o.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{o.address}</p>
                      <p className="mt-1 text-xs font-mono text-muted-foreground">{o.id}</p>
                    </div>
                    <div className="text-end">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <StatusBadge status={o.status} />
                        <Badge
                          variant="outline"
                          className="border-transparent bg-primary/10 text-primary"
                        >
                          {t(`checkout.method.${o.paymentMethod}.short`)}
                        </Badge>
                        {o.paymentStatus === "paid" ? (
                          <Badge className="border-transparent bg-success/15 text-success">
                            {t("pay.paid")}
                          </Badge>
                        ) : o.paymentStatus === "proof_submitted" ? (
                          <Badge className="border-transparent bg-amber-500/15 text-amber-600">
                            {t("pay.underReview")}
                          </Badge>
                        ) : (
                          <Badge className="border-transparent bg-muted text-muted-foreground">
                            {t("pay.unpaid")}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1.5 text-lg font-bold">
                        {settings.currency === "$"
                          ? `$${o.total.toFixed(2)}`
                          : `${settings.currency} ${o.total.toFixed(2)}`}
                      </p>
                      {o.paymentRef && (
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                          {t("track.fawryRef")}: {o.paymentRef}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {o.items.map((item) => (
                      <span
                        key={`${o.id}-${item.id}`}
                        className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs"
                      >
                        {item.name} × {item.qty}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {o.paymentStatus !== "paid" && o.paymentMethod !== "cash" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 border-success/30 text-success hover:bg-success/10 hover:text-success"
                        onClick={async () => {
                          await setOrderPaymentStatus(o.id, "paid");
                          toast.success(t("dash.toast.paid"));
                        }}
                      >
                        {t("dash.markPaid")}
                      </Button>
                    )}
                    {o.paymentStatus === "proof_submitted" && (o.proofImage || o.paymentRef) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={() => setProofOrder(o)}
                      >
                        {t("dash.viewProof")}
                      </Button>
                    )}
                    {o.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={async () => {
                          await setOrderStatus(o.id, "confirmed");
                          toast.success(t("dash.toast.saved"));
                        }}
                      >
                        {t("dash.confirmRow")}
                      </Button>
                    )}
                    {o.status !== "completed" && o.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        onClick={async () => {
                          await setOrderStatus(o.id, "completed");
                          toast.success(t("dash.toast.completed"));
                        }}
                      >
                        {t("dash.complete")}
                      </Button>
                    )}
                    {o.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-muted-foreground hover:text-destructive"
                        onClick={async () => {
                          await setOrderStatus(o.id, "cancelled");
                          toast.success(t("dash.toast.saved"));
                        }}
                      >
                        {t("dash.cancelRow")}
                      </Button>
                    )}
                    {(o.status === "completed" || o.status === "cancelled") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        aria-label={t("dash.archive")}
                        title={t("dash.archive")}
                        onClick={async () => {
                          await archiveOrder(o.id, true);
                          toast.success(t("dash.toast.archived"));
                        }}
                      >
                        <Archive className="size-3.5" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-muted-foreground hover:text-destructive"
                      aria-label={t("dash.delete")}
                      onClick={async () => {
                        await deleteOrder(o.id);
                        toast.success(t("dash.toast.deleted"));
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <PaginationBar
              total={grid.total}
              page={grid.page}
              pageSize={grid.pageSize}
              pageCount={grid.pageCount}
              onPage={grid.setPage}
              onPageSize={grid.setPageSize}
            />
          </>
        )}
      </CardContent>

      <Dialog open={Boolean(proofOrder)} onOpenChange={(open) => !open && setProofOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("dash.paymentProof")}</DialogTitle>
            <DialogDescription>{proofOrder?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            {proofOrder?.paymentRef && (
              <p className="rounded-xl bg-muted/50 px-4 py-2.5 font-mono text-sm">
                {t("checkout.refNumber")}: {proofOrder.paymentRef}
              </p>
            )}
            {proofOrder?.proofImage ? (
              <a href={proofOrder.proofImage} target="_blank" rel="noreferrer">
                <img
                  src={proofOrder.proofImage}
                  alt={t("track.proofImageAlt")}
                  className="max-h-96 w-full rounded-xl border border-border object-cover"
                />
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">{t("dash.noImage")}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProofOrder(null)}>
              {t("dash.close")}
            </Button>
            {proofOrder && proofOrder.paymentStatus !== "paid" && (
              <Button
                onClick={async () => {
                  await setOrderPaymentStatus(proofOrder.id, "paid");
                  toast.success(t("dash.toast.paid"));
                  setProofOrder(null);
                }}
              >
                {t("dash.markPaid")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function ReviewsPanel() {
  const { t } = useI18n();
  const { products, reviews } = useClinicStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const filtered = useMemo(
    () => reviews.filter((r) => statusFilter === "all" || r.status === statusFilter),
    [reviews, statusFilter],
  );
  const grid = useGrid(filtered, query, ["author", "comment", "productId"]);
  const pending = grid.slice.filter((r) => r.status === "pending");
  const approved = grid.slice.filter((r) => r.status === "approved");
  const productName = (productId: string) =>
    products.find((product) => product.id === productId)?.name ?? productId;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("dash.reviews")}</CardTitle>
        <CardDescription>{t("dash.reviews.hint")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", key: "dash.filterAll" },
              { value: "pending", key: "dash.reviews.pending" },
              { value: "approved", key: "dash.reviews.approved" },
              { value: "rejected", key: "dash.reviews.rejected" },
            ].map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  setStatusFilter(s.value);
                  grid.setPage(1);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === s.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {t(s.key)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                {t("dash.reviews.pending")}
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600">
                  {pending.length}
                </span>
              </h3>
              <div className="space-y-3">
                {pending.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{r.author}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {r.productId === "clinic"
                              ? t("reviews.googleSource")
                              : productName(r.productId)}
                          </p>
                          {r.productId === "clinic" && (
                            <Badge
                              variant="secondary"
                              className="ms-1 text-[10px] px-1.5 py-0 align-middle"
                            >
                              {t("reviews.badge.google")}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3.5",
                              i < r.rating ? "fill-amber-400 text-amber-400" : "text-border",
                            )}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {r.comment}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="h-7"
                        onClick={async () => {
                          await setReviewStatus(r.id, "approved");
                          toast.success(t("dash.toast.saved"));
                        }}
                      >
                        {t("dash.reviews.approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        aria-label={t("dash.delete")}
                        onClick={async () => {
                          await deleteReview(r.id);
                          toast.success(t("dash.toast.deleted"));
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                {t("dash.reviews.approved")}
                <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-bold text-green-600">
                  {approved.length}
                </span>
              </h3>
              <div className="space-y-3">
                {approved.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        {r.author}
                        {r.productId !== "clinic" && (
                          <span className="font-normal text-muted-foreground">
                            — {productName(r.productId)}
                          </span>
                        )}
                      </p>
                      {r.productId === "clinic" && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {t("reviews.googleSource")}
                        </p>
                      )}
                      {r.productId !== "clinic" && (
                        <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3.5",
                              i < r.rating ? "fill-amber-400 text-amber-400" : "text-border",
                            )}
                          />
                        ))}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        aria-label={t("dash.delete")}
                        onClick={async () => {
                          await deleteReview(r.id);
                          toast.success(t("dash.toast.deleted"));
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {approved.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">{t("dash.empty")}</p>
          )}
        </div>

        <PaginationBar
          total={grid.total}
          page={grid.page}
          pageSize={grid.pageSize}
          pageCount={grid.pageCount}
          onPage={grid.setPage}
          onPageSize={grid.setPageSize}
        />
      </CardContent>
    </Card>
  );
}

function WorkdaysPanel() {
  const { t, tOr, lang } = useI18n();
  const { workDays, workDay, settings } = useClinicStore();
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (openDay) {
      loadWorkDay(openDay).catch(() => undefined);
    } else {
      loadWorkDays().catch(() => undefined);
    }
  }, [openDay]);

  const restoreBooking = async (id: string) => {
    if (busy) return;
    setBusy(true);
    try {
      await archiveBooking(id, false);
      toast.success(t("dash.toast.restored"));
      await Promise.all([loadWorkDay(openDay!), refreshClinicData()]);
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  const restoreOrder = async (id: string) => {
    if (busy) return;
    setBusy(true);
    try {
      await archiveOrder(id, false);
      toast.success(t("dash.toast.restored"));
      await Promise.all([loadWorkDay(openDay!), refreshClinicData()]);
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  if (openDay && workDay) {
    const hasAnything =
      workDay.bookings.length > 0 ||
      workDay.orders.length > 0 ||
      workDay.payments.length > 0 ||
      workDay.logs.length > 0;
    const sessionLine = workDay.session
      ? workDay.session.endedAt
        ? t("workdays.sessionRange", {
            from: clock(workDay.session.startedAt, lang),
            to: clock(workDay.session.endedAt, lang),
          })
        : t("workdays.sessionOpen")
      : t("workdays.noSession");

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-base font-bold">
              <FolderOpen className="size-4 text-primary" />
              {formatDayName(workDay.date, lang)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{sessionLine}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>
              <span className="block text-xs text-muted-foreground">{t("workdays.revenue")}</span>
              <span className="font-bold">
                {formatMoney(
                  workDay.orders
                    .filter((o) => o.status !== "cancelled")
                    .reduce((s, o) => s + o.total, 0),
                  settings.currency,
                )}
              </span>
            </span>
            <span>
              <span className="block text-xs text-muted-foreground">
                {t("workdays.paymentsReceived")}
              </span>
              <span className="font-bold">
                {formatMoney(
                  workDay.payments
                    .filter((p) => p.status === "paid")
                    .reduce((s, p) => s + p.amount, 0),
                  settings.currency,
                )}
              </span>
            </span>
            <Button size="sm" variant="outline" onClick={() => setOpenDay(null)}>
              <ChevronLeft className="size-4 rtl:rotate-180" /> {t("workdays.back")}
            </Button>
          </div>
        </div>

        {!hasAnything && (
          <Card>
            <CardContent>
              <p className="py-6 text-sm text-muted-foreground">{t("workdays.noActivity")}</p>
            </CardContent>
          </Card>
        )}

        {workDay.bookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="size-4" /> {t("workdays.appointments")}
                <Badge variant="outline" className="text-muted-foreground">
                  {workDay.bookings.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workDay.bookings.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {r.time} · {r.ownerName}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {r.petName} ({tOr(`animal.${r.animalType}`, r.animalType)}) —{" "}
                          {r.doctorName}
                        </p>
                        {r.symptoms && (
                          <p className="mt-1 text-xs text-muted-foreground">{r.symptoms}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={r.status} />
                        {r.archived && (
                          <Badge variant="outline" className="border-transparent bg-muted">
                            {t("archive.title")}
                          </Badge>
                        )}
                        {r.archived && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            disabled={busy}
                            onClick={() => restoreBooking(r.id)}
                          >
                            <ArchiveRestore className="size-3.5" /> {t("workdays.restore")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {workDay.orders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="size-4" /> {t("workdays.sales")}
                <Badge variant="outline" className="text-muted-foreground">
                  {workDay.orders.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workDay.orders.map((o) => (
                  <div key={o.id} className="rounded-xl border border-border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {o.customerName}{" "}
                          <span className="font-mono text-[11px] font-normal text-muted-foreground">
                            {o.id}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {o.items.map((it) => `${it.name} ×${it.qty}`).join(", ")}
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {formatMoney(o.total, settings.currency)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <PaymentMethodBadge method={o.paymentMethod} />
                        <PaymentStatusBadge
                          status={o.paymentStatus === "paid" ? "paid" : "unpaid"}
                        />
                        <StatusBadge status={o.status} />
                        {o.archived && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            disabled={busy}
                            onClick={() => restoreOrder(o.id)}
                          >
                            <ArchiveRestore className="size-3.5" /> {t("workdays.restore")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {workDay.payments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Banknote className="size-4" /> {t("workdays.payments")}
                <Badge variant="outline" className="text-muted-foreground">
                  {workDay.payments.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workDay.payments.map((p) => (
                  <div key={p.id} className="rounded-xl border border-border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{p.title}</p>
                        {p.notes && <p className="mt-1 text-xs text-muted-foreground">{p.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">
                          {formatMoney(p.amount, settings.currency)}
                        </span>
                        <PaymentMethodBadge method={p.method} />
                        <PaymentStatusBadge status={p.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {workDay.logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="size-4" /> {t("workdays.activity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-44">{t("logs.time")}</TableHead>
                      <TableHead className="w-52">{t("logs.action")}</TableHead>
                      <TableHead>{t("logs.detail")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workDay.logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatTime(log.createdAt, lang)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-transparent bg-muted text-foreground"
                          >
                            {tOr(`logs.action.${log.action}`, log.action)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.detail}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FolderOpen className="size-4" /> {t("dash.workdays")}
        </CardTitle>
        <CardDescription>{t("dash.workdays.hint")}</CardDescription>
      </CardHeader>
      <CardContent>
        {workDays.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">{t("workdays.noDays")}</p>
        ) : (
          <div className="space-y-3">
            {workDays.map((d) => (
              <button
                key={d.date}
                onClick={() => setOpenDay(d.date)}
                className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4 text-start transition-colors hover:bg-card/60"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <CalendarDays className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold">{formatDayName(d.date, lang)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {d.session
                        ? d.session.endedAt
                          ? t("workdays.sessionRange", {
                              from: clock(d.session.startedAt, lang),
                              to: clock(d.session.endedAt, lang),
                            })
                          : t("workdays.sessionOpen")
                        : t("workdays.noSession")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <p className="text-sm font-semibold">
                      {formatMoney(d.revenue, settings.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dayCountsLine(t, d.bookings, d.orders, d.payments)}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LogsPanel() {
  const { t, tOr, lang } = useI18n();
  const { auditLogs } = useClinicStore();
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");

  useEffect(() => {
    loadAuditLogs().catch(() => undefined);
  }, []);

  const filtered = useMemo(
    () => auditLogs.filter((l) => actionFilter === "all" || l.action === actionFilter),
    [auditLogs, actionFilter],
  );
  const grid = useGrid(filtered, query, ["detail", "target", "action"]);

  const actionOptions = useMemo(
    () => Array.from(new Set(auditLogs.map((l) => l.action))).sort(),
    [auditLogs],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="size-4" /> {t("logs.title")}
        </CardTitle>
        <CardDescription>{t("logs.desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBox value={query} onChange={setQuery} placeholder={t("dash.search")} />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              grid.setPage(1);
            }}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            aria-label={t("logs.action")}
          >
            <option value="all">{t("dash.filterAll")}</option>
            {actionOptions.map((a) => (
              <option key={a} value={a}>
                {tOr(`logs.action.${a}`, a)}
              </option>
            ))}
          </select>
        </div>
        {grid.slice.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">{t("logs.empty")}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-44">{t("logs.time")}</TableHead>
                    <TableHead className="w-52">{t("logs.action")}</TableHead>
                    <TableHead>{t("logs.detail")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grid.slice.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatTime(log.createdAt, lang)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-transparent bg-muted text-foreground"
                        >
                          {tOr(`logs.action.${log.action}`, log.action)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.detail}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <PaginationBar
              total={grid.total}
              page={grid.page}
              pageSize={grid.pageSize}
              pageCount={grid.pageCount}
              onPage={grid.setPage}
              onPageSize={grid.setPageSize}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ShiftBanner() {
  const { t, lang } = useI18n();
  const { workSession } = useClinicStore();
  const [busy, setBusy] = useState(false);

  const sessionStarted = workSession ? new Date(workSession.startedAt) : null;

  const doCheckIn = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await checkIn();
      await refreshClinicData();
      if (result.archived.bookings > 0 || result.archived.orders > 0) {
        toast.success(
          t("dash.shiftArchivedOnStart", {
            requests: String(result.archived.bookings),
            orders: String(result.archived.orders),
          }),
        );
      } else {
        toast.success(t("dash.shiftStarted"));
      }
      toast.success(
        t("dash.dayFolderOpen", {
          name: formatDayName(new Date().toISOString().slice(0, 10), lang),
        }),
      );
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  const doCheckOut = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await checkOut();
      await refreshClinicData();
      toast.success(
        t("dash.shiftEnded", {
          requests: String(result.archived.bookings),
          orders: String(result.archived.orders),
        }),
      );
      toast.success(
        t("dash.dayFolderSaved", {
          name: formatDayName(new Date().toISOString().slice(0, 10), lang),
        }),
      );
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4",
        sessionStarted ? "border-success/30 bg-success/10" : "border-amber-500/30 bg-amber-500/10",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid size-10 place-items-center rounded-xl",
            sessionStarted ? "bg-success/20 text-success" : "bg-amber-500/15 text-amber-600",
          )}
        >
          {sessionStarted ? <Timer className="size-5" /> : <LogIn className="size-5" />}
        </span>
        <div>
          <p className="text-sm font-bold">
            {sessionStarted ? t("dash.checkedIn") : t("dash.notCheckedIn")}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {sessionStarted
              ? `${t("dash.checkedInSince")} ${sessionStarted.toLocaleString(
                  lang === "ar" ? "ar" : "en-US",
                  { hour: "2-digit", minute: "2-digit" },
                )}`
              : t("dash.shiftHint")}
          </p>
        </div>
      </div>
      <Button
        variant={sessionStarted ? "outline" : "default"}
        className={cn(!sessionStarted && "shadow-glow")}
        onClick={sessionStarted ? doCheckOut : doCheckIn}
        disabled={busy}
      >
        {sessionStarted ? t("dash.checkOut") : t("dash.checkIn")}
      </Button>
    </div>
  );
}

const NAV_ITEMS: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}[] = [
  { id: "overview", icon: LayoutDashboard, roles: ["all"] },
  { id: "requests", icon: ListChecks, roles: ["all"] },
  { id: "staff-overview", icon: Users, roles: ["admin"] },
  { id: "payroll", icon: Banknote, roles: ["payroll", "admin"] },
  { id: "tasks", icon: ListChecks, roles: ["staff"] },
  { id: "notifications", icon: Bell, roles: ["all"] },
  { id: "reservations", icon: CalendarCheck, roles: ["staff", "payroll", "admin"] },
  { id: "doctors", icon: Users, roles: ["payroll", "admin"] },
  { id: "services", icon: HeartPulse, roles: ["payroll", "admin"] },
  { id: "products", icon: ShoppingBag, roles: ["payroll", "admin"] },
  { id: "orders", icon: Package, roles: ["payroll", "admin"] },
  { id: "reviews", icon: MessageSquareText, roles: ["payroll", "admin"] },
  { id: "workdays", icon: FolderOpen, roles: ["payroll", "admin"] },
  { id: "archive", icon: Archive, roles: ["payroll", "admin"] },
  { id: "logs", icon: History, roles: ["admin"] },
  { id: "settings", icon: Settings, roles: ["admin"] },
];

function AuthGate({ onUnlocked }: { onUnlocked: (role: string) => void }) {
  const { t } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lockedFor, setLockedFor] = useState(remainingLockMs());
  const [setup, setSetup] = useState(false);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    isAuthConfigured()
      .then((configured) => {
        setSetup(!configured);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      if (setup) {
        if (username.trim().length < MIN_USERNAME) {
          setError(t("auth.usernameTooShort"));
        } else if (password.length < MIN_PASSWORD) {
          setError(t("auth.passTooShort"));
        } else if (password !== confirm) {
          setError(t("auth.mismatch"));
        } else {
          await register(username, password);
          await login(username, password);
          onUnlocked(currentRole());
        }
      } else {
        if (await login(username, password)) {
          onUnlocked(currentRole());
        } else {
          setError(remainingLockMs() > 0 ? t("auth.locked") : t("auth.invalidCreds"));
        }
      }
    } catch {
      setError(t("auth.invalidCreds"));
    } finally {
      setBusy(false);
    }
  };

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-5 py-32">
        <div className="text-sm text-muted-foreground">…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-5 py-32">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-card"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            window.location.href = "/";
          }}
          className="mb-4 -ms-2 text-muted-foreground"
        >
          <ArrowLeft className="size-4 me-1" /> {t("dash.back")}
        </Button>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="size-5" />
        </span>
        <h1 className="mt-5 text-center text-xl font-bold">
          {setup ? t("auth.setupTitle") : t("auth.signIn")}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {setup ? t("auth.setupDesc") : t("auth.signInDesc")}
        </p>

        <div className="mt-5 grid gap-4">
          <Field label={t("auth.username")}>
            <Input
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("auth.usernamePlaceholder")}
              maxLength={40}
            />
          </Field>
          <Field label={t("auth.password")}>
            <Input
              type="password"
              autoComplete={setup ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.passwordPlaceholder")}
              maxLength={128}
            />
          </Field>
        </div>

        {setup && (
          <div className="mt-4">
            <Field label={t("auth.setupConfirm")}>
              <Input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t("auth.passwordPlaceholder")}
                maxLength={128}
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
  const [role, setRole] = useState<string>("staff");

  useEffect(() => {
    if (isAuthed()) {
      setAuthed(true);
      setRole(currentRole());
      const firstAllowed = NAV_ITEMS.find(
        (i) => i.roles.includes("all") || i.roles.includes(currentRole()),
      );
      if (firstAllowed) setTab(firstAllowed.id);
    }
  }, []);
  const [tab, setTab] = useState<string>("overview");
  const [query, setQuery] = useState("");
  const [resQuery, setResQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const currentNav = NAV_ITEMS.find((i) => i.id === tab) ?? NAV_ITEMS[0]!;

  const todayISO = new Date().toISOString().slice(0, 10);

  const requests = useMemo(() => {
    const q = query.trim().toLowerCase();
    return store.requests.filter((r) => {
      if (r.archived) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.ownerName, r.petName, r.doctorName, r.phone, r.symptoms]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [store.requests, query, statusFilter]);

  const reqGrid = useGrid(requests, "", [], 10);

  const upcomingBase = useMemo(
    () =>
      store.requests
        .filter((r) => !r.archived && r.status === "confirmed" && r.date >= todayISO)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [store.requests, todayISO],
  );
  const resGrid = useGrid(upcomingBase, resQuery, ["ownerName", "petName", "doctorName", "phone"]);

  if (!authed) {
    return (
      <AuthGate
        onUnlocked={(r) => {
          setAuthed(true);
          setRole(r);
        }}
      />
    );
  }

  const signOut = () => {
    logout();
    setAuthed(false);
  };

  const backToSite = () => {
    logout();
    setAuthed(false);
    window.location.href = "/";
  };

  const pendingCount = store.requests.filter((r) => !r.archived && r.status === "pending").length;
  const confirmedCount = store.requests.filter(
    (r) => !r.archived && r.status === "confirmed",
  ).length;
  const completedCount = store.requests.filter(
    (r) => !r.archived && r.status === "completed",
  ).length;

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

  const confirmReq = async (id: string) => {
    await setBookingStatus(id, "confirmed");
    toast.success(t("dash.toast.confirmed"));
  };
  const cancelReq = async (id: string) => {
    await setBookingStatus(id, "cancelled");
    toast.success(t("dash.toast.cancelled"));
  };
  const removeReq = async (id: string) => {
    await deleteRequest(id);
    toast.success(t("dash.toast.deleted"));
  };
  const archiveReq = async (id: string) => {
    await archiveBooking(id, true);
    toast.success(t("dash.toast.archived"));
  };

  const todayAppointments = store.requests
    .filter((r) => !r.archived && r.date === todayISO && r.status === "confirmed")
    .sort((a, b) => a.time.localeCompare(b.time));

  const recent = [...store.requests]
    .filter((r) => !r.archived)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-e border-border bg-card/60 backdrop-blur-sm lg:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
          <PawMLogo />
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
          {NAV_ITEMS.filter(
            (item) => item.roles.includes("all") || item.roles.includes(currentRole()),
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "relative flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                tab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-card hover:text-foreground",
              )}
            >
              {tab === item.id && (
                <span className="absolute inset-y-1.5 start-0 w-1 rounded-full bg-primary" />
              )}
              <item.icon className="size-3.5" />
              {t(`dash.${item.id}`)}
              {item.id === "requests" && pendingCount > 0 && (
                <span className="ms-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600">
                  {pendingCount}
                </span>
              )}
              {item.id === "reviews" &&
                store.reviews.filter((r) => r.status === "pending").length > 0 && (
                  <span className="ms-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600">
                    {store.reviews.filter((r) => r.status === "pending").length}
                  </span>
                )}
            </button>
          ))}
        </nav>
        <div className="shrink-0 space-y-2 border-t border-border p-2.5">
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href="/" onClick={backToSite}>
              {t("dash.back")}
            </a>
          </Button>
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="truncate text-xs font-medium text-muted-foreground"
                title={currentUsername()}
              >
                {currentUsername() || t("auth.staff")}
              </span>
              {role === "admin" && (
                <Badge variant="default" className="text-[10px] px-1.5 py-0">
                  Admin
                </Badge>
              )}
              {role === "payroll" && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Payroll
                </Badge>
              )}
              {role === "staff" && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  Staff
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <LanguageToggle />
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="size-4" /> {t("auth.signOut")}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <currentNav.icon className="size-5" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{t("dash.title")}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t("dash.subtitle")}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:hidden">
              <label className="sr-only">{t("dash.srSection")}</label>
              <select
                value={tab}
                onChange={(e) => setTab(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                aria-label={t("dash.title")}
              >
                {NAV_ITEMS.filter(
                  (item) => item.roles.includes("all") || item.roles.includes(currentRole()),
                ).map((item) => (
                  <option key={item.id} value={item.id}>
                    {t(`dash.${item.id}`)}
                  </option>
                ))}
              </select>
              <Button asChild variant="outline" size="sm">
                <a href="/" onClick={backToSite}>
                  {t("dash.back")}
                </a>
              </Button>
              <LanguageToggle />
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="size-4" /> {t("auth.signOut")}
              </Button>
            </div>
          </div>
          <Separator className="mt-4" />
        </div>

        <ShiftBanner />

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
                              onClick={async () => {
                                await setBookingStatus(r.id, "completed");
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
                        count: String(reqGrid.total),
                        rows: t("dash.rows"),
                      })}
                    </p>
                    <Button size="sm" variant="outline" onClick={() => setTab("reservations")}>
                      <CalendarCheck className="size-4" /> {t("dash.viewReservations")}
                    </Button>
                  </div>
                  <div className="pt-3">
                    <RequestsTable
                      requests={reqGrid.slice}
                      onConfirm={confirmReq}
                      onCancel={cancelReq}
                      onDelete={removeReq}
                      onArchive={archiveReq}
                    />
                    <div className="pt-3">
                      <PaginationBar
                        total={reqGrid.total}
                        page={reqGrid.page}
                        pageSize={reqGrid.pageSize}
                        pageCount={reqGrid.pageCount}
                        onPage={reqGrid.setPage}
                        onPageSize={reqGrid.setPageSize}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {tab === "staff-overview" && <StaffOverviewPanel />}
            {tab === "payroll" && <PayrollPanel />}
            {tab === "tasks" && <TasksPanel />}
            {tab === "notifications" && <NotificationsPanel />}
            {tab === "reservations" && (
              <Card>
                <CardHeader className="space-y-4">
                  <CardTitle className="text-base">{t("dash.reservations")}</CardTitle>
                  <CardDescription>{t("dash.reservationsDesc")}</CardDescription>
                  <div className="w-full sm:max-w-xs">
                    <SearchBox
                      value={resQuery}
                      onChange={setResQuery}
                      placeholder={t("dash.search")}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {resGrid.slice.length === 0 ? (
                    <p className="py-6 text-sm text-muted-foreground">{t("dash.empty")}</p>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {resGrid.slice.map((r) => (
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
                                onClick={async () => {
                                  await setBookingStatus(r.id, "completed");
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
                      <PaginationBar
                        total={resGrid.total}
                        page={resGrid.page}
                        pageSize={resGrid.pageSize}
                        pageCount={resGrid.pageCount}
                        onPage={resGrid.setPage}
                        onPageSize={resGrid.setPageSize}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {tab === "doctors" && <DoctorsPanel />}
            {tab === "services" && <ServicesPanel />}
            {tab === "products" && <ProductsPanel />}
            {tab === "orders" && <OrdersPanel />}
            {tab === "payments" && <PaymentsPanel />}
            {tab === "reviews" && <ReviewsPanel />}
            {tab === "workdays" && <WorkdaysPanel />}
            {tab === "archive" && <ArchivePanel />}
            {tab === "logs" && <LogsPanel />}
            {tab === "settings" && <SettingsPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
