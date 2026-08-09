import { useSyncExternalStore } from "react";
import { DOCTORS, SERVICES, CLINIC, type Doctor } from "@/lib/clinic-data";
import { sanitizeEmail, sanitizePhone, sanitizeWhatsapp } from "@/lib/sanitize";

export type Status = "pending" | "confirmed" | "completed" | "cancelled";

export type BookingRequest = {
  id: string;
  ownerName: string;
  phone: string;
  email: string;
  petName: string;
  animalType: string;
  breed: string;
  age: string;
  weight: string;
  symptoms: string;
  allergies: string;
  medications: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  emergency: boolean;
  status: Status;
  createdAt: string;
};

export type ServiceItem = {
  slug: string;
  icon: string;
  title: string;
  description: string;
};

export type ClinicSettings = {
  name: string;
  tagline: string;
  phone: string;
  emergency: string;
  whatsapp: string;
  email: string;
  address: string;
};

type Store = {
  requests: BookingRequest[];
  doctors: Doctor[];
  services: ServiceItem[];
  settings: ClinicSettings;
};

type Listener = () => void;

const STORAGE_KEY = "pawcare:clinic-store";

function seed(): Store {
  return {
    requests: [],
    doctors: DOCTORS,
    services: SERVICES,
    settings: { ...CLINIC },
  };
}

function persist(state: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

function load(): Store {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const s = seed();
      persist(s);
      return s;
    }
    const parsed = JSON.parse(raw) as Partial<Store>;
    const base = seed();
    return {
      requests: Array.isArray(parsed.requests) ? parsed.requests : base.requests,
      doctors:
        Array.isArray(parsed.doctors) && parsed.doctors.length ? parsed.doctors : base.doctors,
      services:
        Array.isArray(parsed.services) && parsed.services.length ? parsed.services : base.services,
      settings: parsed.settings ? { ...base.settings, ...parsed.settings } : base.settings,
    };
  } catch {
    return seed();
  }
}

let state: Store = load();
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

function set(mutator: (prev: Store) => Store) {
  state = mutator(state);
  persist(state);
  emit();
}

function getSnapshot(): Store {
  return state;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function addBookingRequest(input: Omit<BookingRequest, "id" | "status" | "createdAt">) {
  set((s) => ({
    ...s,
    requests: [
      {
        ...input,
        id: uid("req"),
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      ...s.requests,
    ],
  }));
  return getSnapshot();
}

export function setBookingStatus(id: string, status: Status) {
  set((s) => ({
    ...s,
    requests: s.requests.map((r) => (r.id === id ? { ...r, status } : r)),
  }));
}

export function deleteRequest(id: string) {
  set((s) => ({ ...s, requests: s.requests.filter((r) => r.id !== id) }));
}

export function saveDoctor(doctor: Doctor) {
  set((s) => {
    const exists = s.doctors.some((d) => d.id === doctor.id);
    return {
      ...s,
      doctors: exists
        ? s.doctors.map((d) => (d.id === doctor.id ? doctor : d))
        : [doctor, ...s.doctors],
    };
  });
}

export function deleteDoctor(id: string) {
  set((s) => ({ ...s, doctors: s.doctors.filter((d) => d.id !== id) }));
}

export function saveService(service: ServiceItem) {
  set((s) => {
    const exists = s.services.some((sv) => sv.slug === service.slug);
    return {
      ...s,
      services: exists
        ? s.services.map((sv) => (sv.slug === service.slug ? service : sv))
        : [service, ...s.services],
    };
  });
}

export function deleteService(slug: string) {
  set((s) => ({ ...s, services: s.services.filter((sv) => sv.slug !== slug) }));
}

export function updateSettings(patch: Partial<ClinicSettings>) {
  const clean: Partial<ClinicSettings> = { ...patch };
  if (patch.phone !== undefined) clean.phone = sanitizePhone(patch.phone);
  if (patch.emergency !== undefined) clean.emergency = sanitizePhone(patch.emergency);
  if (patch.whatsapp !== undefined) clean.whatsapp = sanitizeWhatsapp(patch.whatsapp);
  if (patch.email !== undefined) clean.email = sanitizeEmail(patch.email) ?? "";
  set((s) => ({ ...s, settings: { ...s.settings, ...clean } }));
}

export function resetAll() {
  const s = seed();
  persist(s);
  state = s;
  emit();
}

export function get() {
  return state;
}

export function useClinicStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export type { Doctor };
