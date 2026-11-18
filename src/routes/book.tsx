import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Banknote, Check, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ClientAuthGate } from "@/components/ClientAuthGate";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ANIMAL_TYPES, TIME_SLOTS, bookedSlotsFor } from "@/lib/clinic-data";
import { addBookingRequest, useClinicStore } from "@/lib/clinic-store";
import { currentClient, clientIsAuthed } from "@/lib/client-auth";
import { getPets, type Pet } from "@/lib/client-medical";
import { useI18n } from "@/lib/i18n";
import { ogMeta, withSiteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

const title = "Book an Appointment — Paw-M Veterinary Clinic";
const description =
  "Book your pet's veterinary appointment at Paw-M in New Cairo in under a minute. Live availability across every clinician, with instant confirmation.";

const DRAFT_KEY = "paw-m:booking-draft";

type Draft = {
  ownerName: string;
  phone: string;
  email: string;
  petId?: string;
  petName: string;
  animalType: string;
  customAnimalType?: string;
  age: string;
  weight: string;
  symptoms: string;
  allergies: string;
  medications: string;
  doctorId: string;
  date: string;
  time: string;
  emergency: boolean;
};

const EMPTY: Draft = {
  ownerName: "",
  phone: "",
  email: "",
  petName: "",
  animalType: "Dog",
  age: "",
  weight: "",
  symptoms: "",
  allergies: "",
  medications: "",
  doctorId: "",
  date: "",
  time: "",
  emergency: false,
};

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): { doctor?: string } =>
    typeof search["doctor"] === "string" ? { doctor: search["doctor"] as string } : {},
  head: () => ({
    meta: ogMeta(title, description, "/book"),
    links: [{ rel: "canonical", href: withSiteUrl("/book") }],
  }),
  component: BookPage,
});

function BookPage() {
  return (
    <ClientAuthGate>
      <BookingForm />
    </ClientAuthGate>
  );
}

function BookingForm() {
  const { doctor } = Route.useSearch();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { doctors, requests } = useClinicStore();
  const firstDoctor = doctors[0];
  const STEPS = [
    t("booking.step.owner"),
    t("booking.step.pet"),
    t("booking.step.case"),
    t("booking.step.schedule"),
  ];
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({
    ...EMPTY,
    doctorId: doctor ?? firstDoctor?.id ?? "",
  });
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [petMode, setPetMode] = useState<"saved" | "new">("saved");
  const client = currentClient();

  // Pull the account holder's details straight from the session so the owner
  // step acts as a summary instead of a blank form.
  useEffect(() => {
    if (!client) return;
    setDraft((d) => ({
      ...d,
      ownerName: d.ownerName || client.fullName,
      phone: d.phone || client.phone,
      email: d.email || client.email,
    }));
  }, [client]);

  useEffect(() => {
    let cancel = false;
    if (!clientIsAuthed()) {
      setPetMode("new");
      return;
    }
    getPets()
      .then((pets) => {
        if (cancel) return;
        setMyPets(pets);
        setPetMode(pets.length > 0 ? "saved" : "new");
      })
      .catch(() => {
        if (!cancel) setPetMode("new");
      });
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(DRAFT_KEY);
    } catch {
      /* storage unavailable */
    }
    if (raw) {
      try {
        setDraft((d) => ({ ...d, ...(JSON.parse(raw) as Draft), doctorId: doctor ?? d.doctorId }));
      } catch {
        /* ignore malformed draft */
      }
    }
  }, [doctor]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* storage unavailable */
    }
  }, [draft]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const today = new Date().toISOString().slice(0, 10);
  const activeBookings = requests.filter((r) => r.status !== "cancelled");
  const booked = draft.date ? bookedSlotsFor(draft.date, draft.doctorId, activeBookings) : [];

  const valid = [
    draft.ownerName.trim().length > 1 && draft.phone.trim().length > 5,
    draft.petName.trim().length > 0 && draft.animalType.length > 0,
    draft.symptoms.trim().length > 4,
    Boolean(draft.date && draft.time),
  ];

  const submit = async () => {
    const selDoctor = doctors.find((d) => d.id === draft.doctorId);
    if (!selDoctor) {
      toast.error(t("booking.error.doctor"));
      setStep(3);
      return;
    }
    try {
      await addBookingRequest({
        ownerName: draft.ownerName,
        phone: draft.phone,
        email: draft.email,
        petName: draft.petName,
        animalType:
          draft.animalType === "Other" && draft.customAnimalType
            ? draft.customAnimalType
            : draft.animalType,
        age: draft.age,
        weight: draft.weight,
        symptoms: draft.symptoms,
        allergies: draft.allergies,
        medications: draft.medications,
        doctorId: selDoctor.id,
        doctorName: t(`doc.${selDoctor.id}.name`),
        date: draft.date,
        time: draft.time,
        emergency: draft.emergency,
        petId: draft.petId ?? null,
      });
    } catch {
      toast.error(t("booking.error.failed"));
      return;
    }
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* storage unavailable */
    }
    toast.success(t("booking.requested"));
    navigate({
      to: "/booking/success",
      search: {
        pet: draft.petName,
        date: draft.date,
        time: draft.time,
        doctor: t(`doc.${selDoctor.id}.name`),
      },
    });
  };

  return (
    <section className="hero-gradient min-h-screen pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Breadcrumbs
          items={[
            { label: t("crumb.home"), to: "/" },
            { label: t("crumb.book"), to: "/book" },
          ]}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-3xl font-bold sm:text-4xl">{t("booking.title")}</h1>
          <p className="mt-3 text-base text-muted-foreground">{t("booking.subtitle")}</p>
        </motion.div>

        <ol className="mt-8 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
                  i < step
                    ? "bg-success text-success-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:inline",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border" />}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
          >
            {step === 0 && (
              <div className="grid gap-5">
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary">
                      {(draft.ownerName || "?").charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-medium">
                        {draft.ownerName || t("booking.owner.summary")}
                      </p>
                      <p className="text-xs text-muted-foreground">{draft.email}</p>
                      <p className="text-xs text-muted-foreground">{draft.phone}</p>
                    </div>
                    <span className="ml-auto rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                      {t("booking.owner.account")}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{t("booking.owner.hint")}</p>
              </div>
            )}

            {step === 1 &&
              (petMode === "saved" && myPets.length > 0 ? (
                <div className="grid gap-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {myPets.map((pet) => (
                      <button
                        key={pet.id}
                        type="button"
                        onClick={() => {
                          setPetMode("saved");
                          set("petId", pet.id);
                          set("petName", pet.name);
                          set("animalType", pet.species);
                          set("customAnimalType", undefined);
                          set("age", pet.dob ? yearsBetween(pet.dob) : "");
                          set("weight", pet.weightKg ? `${pet.weightKg} kg` : "");
                        }}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                          draft.petId === pet.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40",
                        )}
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-lg">
                          {emojiFor(pet.species)}
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">{pet.name}</span>
                          <span className="block text-xs text-muted-foreground">
                            {[pet.species, pet.breed].filter(Boolean).join(" · ")}
                            {pet.weightKg ? ` · ${pet.weightKg} kg` : ""}
                          </span>
                        </span>
                        {draft.petId === pet.id && (
                          <Check className="ml-auto size-4 text-primary" strokeWidth={3} />
                        )}
                      </button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-self-start"
                    onClick={() => {
                      setPetMode("new");
                      set("petId", undefined);
                    }}
                  >
                    <Plus className="size-4" /> {t("booking.pet.addNew")}
                  </Button>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {myPets.length === 0 && petMode === "saved" ? (
                    <p className="text-sm text-muted-foreground sm:col-span-2">
                      {t("booking.pet.loading")}
                    </p>
                  ) : null}
                  <Field label={t("booking.pet.name")} required>
                    <Input
                      value={draft.petName}
                      onChange={(e) => {
                        set("petName", e.target.value);
                        set("petId", undefined);
                      }}
                      placeholder={t("booking.ph.petName")}
                    />
                  </Field>
                  <Field label={t("booking.pet.type")} required>
                    <div className="flex flex-wrap gap-2">
                      {ANIMAL_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            set("animalType", type);
                            set("petId", undefined);
                            // Clear custom animal type when switching from Other to a specific type
                            if (type !== "Other") {
                              set("customAnimalType", undefined);
                            }
                          }}
                          className={cn(
                            "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                            draft.animalType === type
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:border-primary/40",
                          )}
                        >
                          {t(`animal.${type}`)}
                        </button>
                      ))}
                    </div>
                    {draft.animalType === "Other" && (
                      <Field label={t("booking.pet.otherType")}>
                        <Input
                          value={draft.customAnimalType ?? ""}
                          onChange={(e) => set("customAnimalType", e.target.value)}
                          placeholder={t("booking.ph.otherPetType")}
                        />
                      </Field>
                    )}
                  </Field>
                  <Field label={t("booking.pet.age")}>
                    <Input
                      value={draft.age}
                      onChange={(e) => set("age", e.target.value)}
                      placeholder={t("booking.ph.age")}
                    />
                  </Field>
                  <Field label={t("booking.pet.weight")}>
                    <Input
                      value={draft.weight}
                      onChange={(e) => set("weight", e.target.value)}
                      placeholder={t("booking.ph.weight")}
                    />
                  </Field>
                  {myPets.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="justify-self-start sm:col-span-2"
                      onClick={() => setPetMode("saved")}
                    >
                      <ArrowLeft className="size-4" /> {t("booking.pet.chooseSaved")}
                    </Button>
                  )}
                </div>
              ))}

            {step === 2 && (
              <div className="grid gap-5">
                <Field label={t("booking.case.symptoms")} required>
                  <Textarea
                    rows={4}
                    value={draft.symptoms}
                    onChange={(e) => set("symptoms", e.target.value)}
                    placeholder={t("booking.ph.symptoms")}
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("booking.case.allergies")}>
                    <Input
                      value={draft.allergies}
                      onChange={(e) => set("allergies", e.target.value)}
                      placeholder={t("booking.ph.allergies")}
                    />
                  </Field>
                  <Field label={t("booking.case.medications")}>
                    <Input
                      value={draft.medications}
                      onChange={(e) => set("medications", e.target.value)}
                      placeholder={t("booking.ph.medications")}
                    />
                  </Field>
                </div>
                <label className="flex items-center justify-between rounded-xl border border-border p-4">
                  <span>
                    <span className="block text-sm font-medium">{t("booking.case.emergency")}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {t("booking.case.emergencyDesc")}
                    </span>
                  </span>
                  <Switch checked={draft.emergency} onCheckedChange={(v) => set("emergency", v)} />
                </label>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-6">
                <Field label={t("booking.schedule.doctor")}>
                  <div className="flex flex-wrap gap-2">
                    {doctors.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => set("doctorId", d.id)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                          draft.doctorId === d.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary/40",
                        )}
                      >
                        {t(`doc.${d.id}.name`)}
                      </button>
                    ))}
                    {doctors.length === 0 && (
                      <p className="w-full text-xs text-muted-foreground">
                        {t("booking.empty.doctors")}
                      </p>
                    )}
                  </div>
                </Field>

                <Field label={t("booking.schedule.date")} required>
                  <Input
                    type="date"
                    min={today}
                    value={draft.date}
                    onChange={(e) => set("date", e.target.value)}
                  />
                </Field>

                <Field label={t("booking.schedule.time")} required>
                  {!draft.date ? (
                    <p className="text-sm text-muted-foreground">{t("booking.schedule.hint")}</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {TIME_SLOTS.map((slot) => {
                        const taken = booked.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={taken}
                            onClick={() => set("time", slot)}
                            className={cn(
                              "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                              taken &&
                                "cursor-not-allowed border-border text-muted-foreground/40 line-through",
                              !taken &&
                                draft.time === slot &&
                                "border-primary bg-primary text-primary-foreground",
                              !taken &&
                                draft.time !== slot &&
                                "border-border text-foreground hover:border-primary/40",
                            )}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </Field>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
              <Banknote className="size-4 shrink-0 text-primary/70" />
              <span>{t("book.feeNote")}</span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="size-4" /> {t("booking.back")}
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!valid[step]}
                  className="shadow-glow"
                >
                  {t("booking.continue")} <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button onClick={submit} disabled={!valid[3]} className="shadow-glow">
                  {t("booking.confirm")} <Check className="size-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}

function yearsBetween(dob: string): string {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "";
  const years = Math.max(0, Math.floor((Date.now() - d.getTime()) / 31_557_600_000));
  if (years >= 1) return `${years} year${years === 1 ? "" : "s"}`;
  const months = Math.max(0, Math.floor((Date.now() - d.getTime()) / 2_629_800_000));
  return months >= 1 ? `${months} month${months === 1 ? "" : "s"}` : "Under 1 month";
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
