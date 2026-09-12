import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  LogOut,
  PawPrint,
  Plus,
  Pencil,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ClientAuthGate } from "@/components/ClientAuthGate";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { ogMeta, withSiteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { logoutClient } from "@/lib/client-auth";
import {
  createPet,
  deletePet,
  getMyProfile,
  type ClientBooking,
  type MeProfile,
  type Pet,
  type Prescription,
} from "@/lib/client-medical";

const title = "My Account — Paw-M Veterinary Clinic";
const description =
  "Manage your pets, appointments, prescriptions and orders at Paw-M Veterinary Clinic in New Cairo.";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: ogMeta(title, description, "/account"),
    links: [{ rel: "canonical", href: withSiteUrl("/account") }],
  }),
  component: AccountPage,
});

type Tab = "overview" | "pets" | "appointments" | "orders" | "prescriptions";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "pets", label: "My Pets", icon: PawPrint },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "prescriptions", label: "Prescriptions", icon: FileText },
];

function AccountPage() {
  return (
    <ClientAuthGate>
      <AccountPortal />
    </ClientAuthGate>
  );
}

function AccountPortal() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMyProfile,
  });

  const signOut = async () => {
    await logoutClient();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <>
      <section className="hero-gradient border-b border-border pb-4 pt-32 sm:pt-40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Breadcrumbs
            items={[
              { label: t("crumb.home"), to: "/" },
              { label: "My Account", to: "/account" },
            ]}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                {((profile?.client.fullName ?? "?").charAt(0) || "?").toUpperCase()}
              </span>
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Welcome back{profile ? `, ${profile.client.fullName.split(" ")[0]}` : ""}
                </h1>
                <p className="text-sm text-muted-foreground">{profile?.client.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav className="flex flex-col gap-1 lg:sticky lg:top-24 lg:self-start">
            {TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  tab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="min-w-0">
            {isLoading && !profile ? (
              <Card>
                <CardContent className="py-16 text-center text-sm text-muted-foreground">
                  Loading your account…
                </CardContent>
              </Card>
            ) : tab === "overview" ? (
              <OverviewTab
                profile={profile!}
                onGoPets={() => setTab("pets")}
                onGoRx={() => setTab("prescriptions")}
              />
            ) : tab === "pets" ? (
              <PetsTab profile={profile!} refetch={refetch} />
            ) : tab === "appointments" ? (
              <AppointmentsTab profile={profile!} />
            ) : tab === "orders" ? (
              <OrdersTab profile={profile!} />
            ) : (
              <PrescriptionsTab profile={profile!} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function OverviewTab({
  profile,
  onGoPets,
  onGoRx,
}: {
  profile: MeProfile;
  onGoPets: () => void;
  onGoRx: () => void;
}) {
  const upcoming = profile.bookings.filter((b) => b.status === "confirmed");
  const issued = profile.prescriptions.filter((p) => p.status === "issued");
  const recent = [...profile.bookings]
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 3);

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="My Pets" value={String(profile.pets.length)} onClick={onGoPets} />
        <StatCard label="Upcoming visits" value={String(upcoming.length)} />
        <StatCard label="Prescriptions" value={String(issued.length)} onClick={onGoRx} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent appointments</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {recent.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No bookings yet.{" "}
              <Link to="/book" className="text-primary underline-offset-4 hover:underline">
                Book a visit
              </Link>
            </p>
          )}
          {recent.map((b) => (
            <div
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3"
            >
              <div>
                <p className="text-sm font-medium">
                  {b.petName} · {b.doctorName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fmtTime(b.date, b.time)} — {b.symptoms || b.status}
                </p>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-border p-4 text-start shadow-card transition-colors",
        onClick ? "hover:border-primary/40" : "cursor-default",
      )}
    >
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </button>
  );
}

function PetsTab({ profile, refetch }: { profile: MeProfile; refetch: () => void }) {
  const [open, setOpen] = useState(false);
  const pets = profile.pets;

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My pets</h2>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Add a pet
        </Button>
      </div>
      {pets.length === 0 && (
        <Card>
          <CardContent className="py-14 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-3xl bg-primary/10 text-primary">
              <PawPrint className="size-7" />
            </span>
            <p className="mt-4 text-sm text-muted-foreground">
              No pets yet. Add your first pet to get faster bookings and visit history.
            </p>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} refetch={refetch} />
        ))}
      </div>
      {open && (
        <AddPetDialog
          onClose={() => {
            setOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}

function PetCard({ pet, refetch }: { pet: Pet; refetch: () => void }) {
  const handleDelete = async () => {
    if (!window.confirm(`Delete ${pet.name} and its medical history?`)) return;
    try {
      await deletePet(pet.id);
      toast.success(`${pet.name} deleted`);
      refetch();
    } catch {
      toast.error("Could not delete the pet");
    }
  };

  return (
    <Link
      to="/account/pets/$petId"
      params={{ petId: pet.id }}
      className="group flex items-center gap-4 rounded-2xl border border-border p-4 shadow-card transition-colors hover:border-primary/40"
    >
      {pet.photo ? (
        <img
          src={pet.photo}
          alt={pet.name}
          className="size-14 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-muted text-2xl">
          {emojiFor(pet.species)}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{pet.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {[pet.species, pet.breed, pet.sex ? (pet.sex === "male" ? "Male" : "Female") : ""]
            .filter(Boolean)
            .join(" · ")}
          {pet.weightKg ? ` · ${pet.weightKg} kg` : ""}
        </span>
        {pet.dob && (
          <span className="block text-xs text-muted-foreground">Born {fmt(pet.dob)}</span>
        )}
      </span>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 px-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Delete pet"
        onClick={(e) => {
          e.preventDefault();
          handleDelete();
        }}
      >
        <Trash2 className="size-4" />
      </Button>
    </Link>
  );
}

const EMPTY_PET = {
  name: "",
  species: "Dog",
  breed: "",
  sex: "female",
  dob: "",
  weightKg: "",
  color: "",
  microchip: "",
  notes: "",
  photo: "",
};

function AddPetDialog({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState(EMPTY_PET);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) return;
    setBusy(true);
    try {
      await createPet({
        name: form.name.trim(),
        species: form.species === "Other" ? form.breed || "Other" : form.species,
        breed: form.breed.trim(),
        sex: form.sex,
        dob: form.dob,
        weightKg: form.weightKg.trim(),
        color: form.color.trim(),
        microchip: form.microchip.trim(),
        photo: form.photo,
        notes: form.notes.trim(),
      });
      toast.success(`${form.name.trim()} added to your pets`);
      onClose();
    } catch {
      toast.error("Could not add the pet");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a pet</DialogTitle>
          <DialogDescription>
            Saved pets appear in the booking flow and keep a lifelong visit history.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {form.photo ? (
            <div className="flex items-center gap-3">
              <img src={form.photo} alt="Pet" className="size-16 rounded-2xl object-cover" />
              <Button size="sm" variant="outline" onClick={() => set("photo", "")}>
                Remove photo
              </Button>
            </div>
          ) : (
            <PetPhotoPicker onPicked={(dataUrl) => set("photo", dataUrl)} />
          )}
          <Field label="Name" required>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Species">
              <Select value={form.species} onValueChange={(v) => set("species", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Other"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Breed">
              <Input value={form.breed} onChange={(e) => set("breed", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sex">
              <Select value={form.sex} onValueChange={(v) => set("sex", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Date of birth">
              <Input
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={form.dob}
                onChange={(e) => set("dob", e.target.value)}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Weight (kg)">
              <Input value={form.weightKg} onChange={(e) => set("weightKg", e.target.value)} />
            </Field>
            <Field label="Color">
              <Input value={form.color} onChange={(e) => set("color", e.target.value)} />
            </Field>
          </div>
          <Field label="Microchip">
            <Input value={form.microchip} onChange={(e) => set("microchip", e.target.value)} />
          </Field>
          <Field label="Notes">
            <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={busy || !form.name.trim()}>
            {busy ? "Saving…" : "Add pet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PetPhotoPicker({ onPicked }: { onPicked: (dataUrl: string) => void }) {
  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const max = 512;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      onPicked(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.src = URL.createObjectURL(file);
  };
  return (
    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
      <Plus className="size-4" /> Add a photo
      <input type="file" accept="image/*" className="hidden" onChange={pick} />
    </label>
  );
}

function AppointmentsTab({ profile }: { profile: MeProfile }) {
  const sorted = [...profile.bookings].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="grid gap-5">
      <h2 className="text-lg font-semibold">Appointments</h2>
      {sorted.length === 0 && (
        <Card>
          <CardContent className="py-14 text-center text-sm text-muted-foreground">
            No appointments yet.
          </CardContent>
        </Card>
      )}
      <div className="grid gap-3">
        {sorted.map((b) => (
          <div key={b.id} className="rounded-2xl border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">
                {b.petName} — {b.doctorName}
              </p>
              <StatusBadge status={b.status} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {fmtTime(b.date, b.time)}
              {b.followUpDate ? ` · Follow-up ${fmt(b.followUpDate)}` : ""}
            </p>
            {b.symptoms && <p className="mt-2 text-sm text-muted-foreground">{b.symptoms}</p>}
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              {b.diagnosis && (
                <p className="rounded-lg bg-muted/60 p-2">
                  <span className="font-semibold text-foreground">Diagnosis: </span>
                  {b.diagnosis}
                </p>
              )}
              {b.treatmentNotes && (
                <p className="rounded-lg bg-muted/60 p-2">
                  <span className="font-semibold text-foreground">Treatment: </span>
                  {b.treatmentNotes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersTab({ profile }: { profile: MeProfile }) {
  const sorted = [...profile.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="grid gap-5">
      <h2 className="text-lg font-semibold">Orders</h2>
      {sorted.length === 0 && (
        <Card>
          <CardContent className="py-14 text-center text-sm text-muted-foreground">
            No orders yet.{" "}
            <Link to="/store" className="text-primary underline-offset-4 hover:underline">
              Visit the store
            </Link>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-3">
        {sorted.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">Order {o.id.replace(/^order-/, "#")}</p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline">{o.paymentStatus.replace("_", " ")}</Badge>
                <StatusBadge status={o.status} />
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {fmt(o.createdAt)} · {o.paymentMethod} · EGP {o.total.toFixed(2)}
            </p>
            <ul className="mt-2 grid gap-1 text-xs text-muted-foreground">
              {o.items.slice(0, 3).map((item) => (
                <li key={item.id}>
                  {item.qty}× {item.name}
                </li>
              ))}
              {o.items.length > 3 && <li>… and {o.items.length - 3} more</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrescriptionsTab({ profile }: { profile: MeProfile }) {
  return (
    <div className="grid gap-5">
      <h2 className="text-lg font-semibold">Prescriptions</h2>
      {profile.prescriptions.length === 0 && (
        <Card>
          <CardContent className="py-14 text-center text-sm text-muted-foreground">
            No prescriptions yet.
          </CardContent>
        </Card>
      )}
      <div className="grid gap-3">
        {[...profile.prescriptions]
          .sort((a, b) => (b.issuedAt ?? b.createdAt).localeCompare(a.issuedAt ?? a.createdAt))
          .map((rx) => (
            <Link
              key={rx.id}
              to="/account/rx/$rxId"
              params={{ rxId: rx.id }}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border p-4 transition-colors hover:border-primary/40"
            >
              <div>
                <p className="font-mono text-sm font-semibold">{rx.rxNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {rx.petName || rx.pet?.name || "Pet"} · {fmt(rx.issuedAt ?? rx.createdAt)}
                  {rx.diagnosis ? ` · ${rx.diagnosis}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <RxBadge status={rx.status} />
                <Pencil className="size-3.5 text-muted-foreground" />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    completed: "bg-sky-100 text-sky-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        styles[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

function RxBadge({ status }: { status: Prescription["status"] }) {
  const styles = {
    draft: "bg-amber-100 text-amber-700",
    issued: "bg-emerald-100 text-emerald-700",
    void: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase", styles[status])}
    >
      {status}
    </span>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}

function fmtTime(date: string, time: string): string {
  try {
    const d = new Date(`${date}T${time || "00:00"}:00`);
    return d.toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return `${date} ${time}`;
  }
}

function fmt(input?: string | null): string {
  if (!input) return "—";
  try {
    return format(parseISO(input), "d MMM yyyy");
  } catch {
    return input;
  }
}

function emojiFor(species: string): string {
  const clean = species.toLowerCase();
  if (clean.includes("cat")) return "🐱";
  if (clean.includes("bird")) return "🐦";
  if (clean.includes("rabbit")) return "🐰";
  if (clean.includes("reptile") || clean.includes("lizard") || clean.includes("turtle"))
    return "🦎";
  if (clean.includes("hamster") || clean.includes("rodent") || clean.includes("rat")) return "🐹";
  return "🐶";
}
