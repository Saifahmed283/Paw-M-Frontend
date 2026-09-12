import { api } from "@/lib/api";
import type { Order } from "@/lib/clinic-store";

export type Pet = {
  id: string;
  clientId: string;
  name: string;
  species: string;
  breed: string;
  sex: string;
  dob: string;
  weightKg: string;
  color: string;
  microchip: string;
  photo: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type RxItem = {
  medication: string;
  dose: string;
  frequency: string;
  route: string;
  duration: string;
  note: string;
};

export type SignatureSnapshot = {
  name: string;
  title: string;
  licenseNumber: string;
  signatureImage: string;
};

export type Prescription = {
  id: string;
  rxNumber: string;
  verifyCode: string;
  status: "draft" | "issued" | "void";
  diagnosis: string;
  items: RxItem[];
  instructions: string;
  followUpDate: string;
  issuedAt: string | null;
  signatureSnapshot: SignatureSnapshot | null;
  petName?: string | null;
  petSpecies?: string | null;
  petBreed?: string | null;
  pet?: {
    id: string;
    name: string;
    species: string;
    breed: string;
    dob: string;
    weightKg: string;
  } | null;
  client?: { id: string; fullName: string; email: string; phone: string };
  doctor?: {
    id: string;
    name: string;
    title: string;
    licenseNumber: string;
    signatureImage: string;
    experience: string;
    specialization: string;
  };
  booking?: {
    id: string;
    date: string;
    time: string;
    diagnosis: string;
    treatmentNotes: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientBooking = {
  id: string;
  doctorId: string;
  doctorName: string;
  petName: string;
  animalType: string;
  date: string;
  time: string;
  symptoms: string;
  status: string;
  diagnosis: string;
  treatmentNotes: string;
  followUpDate: string;
  petId: string | null;
  pet?: { id: string; name: string; species: string } | null;
  createdAt: string;
};

export type MeProfile = {
  client: { id: string; email: string; fullName: string; phone: string; createdAt: string };
  pets: Pet[];
  bookings: ClientBooking[];
  orders: Order[];
  prescriptions: Prescription[];
};

export type PetHistory = {
  pet: Pet;
  bookings: ClientBooking[];
  prescriptions: Prescription[];
};

export async function getMyProfile(): Promise<MeProfile> {
  return api.get<MeProfile>("/me");
}

export async function getPets(): Promise<Pet[]> {
  return api.get<Pet[]>("/pets");
}

export type PetInput = Omit<Pet, "id" | "clientId" | "createdAt" | "updatedAt">;

export async function createPet(input: PetInput): Promise<Pet> {
  return api.post<Pet>("/pets", input);
}

export async function updatePet(id: string, patch: Partial<PetInput>): Promise<Pet> {
  return api.patch<Pet>(`/pets/${id}`, patch);
}

export async function deletePet(id: string): Promise<void> {
  return api.delete(`/pets/${id}`);
}

export async function getPetHistory(id: string): Promise<PetHistory> {
  return api.get<PetHistory>(`/pets/${id}/history`);
}

export async function getPrescription(id: string): Promise<Prescription> {
  return api.get<Prescription>(`/prescriptions/${id}`);
}

export async function listPrescriptions(params?: {
  petId?: string;
  status?: string;
}): Promise<Prescription[]> {
  const q = new URLSearchParams();
  if (params?.petId) q.set("petId", params.petId);
  if (params?.status) q.set("status", params.status);
  return api.get<Prescription[]>(`/prescriptions${q.size ? `?${q.toString()}` : ""}`);
}

export type PrescriptionInput = {
  petId?: string | null;
  petName?: string;
  petSpecies?: string;
  petBreed?: string;
  doctorId: string;
  bookingId?: string | null;
  diagnosis?: string;
  items: RxItem[];
  instructions?: string;
  followUpDate?: string;
  status?: "draft" | "issued";
};

export async function createPrescription(input: PrescriptionInput): Promise<Prescription> {
  return api.post<Prescription>("/prescriptions", input);
}

export async function updatePrescription(
  id: string,
  patch: Partial<{
    diagnosis: string;
    items: RxItem[];
    instructions: string;
    followUpDate: string;
    status: "issued" | "void";
  }>,
): Promise<Prescription> {
  return api.patch<Prescription>(`/prescriptions/${id}`, patch);
}

export async function verifyRxCode(code: string): Promise<{
  valid: boolean;
  message?: string;
  rxNumber?: string;
  issuedAt?: string | null;
  pet?: Prescription["pet"];
  doctor?: Pick<Prescription["doctor"], "name" | "title" | "licenseNumber">;
  diagnosis?: string;
}> {
  return api.get<{
    valid: boolean;
    message?: string;
    rxNumber?: string;
    issuedAt?: string | null;
    pet?: Prescription["pet"];
    doctor?: Pick<Prescription["doctor"], "name" | "title" | "licenseNumber">;
    diagnosis?: string;
  }>(`/prescriptions/verify?code=${encodeURIComponent(code)}`);
}

export async function saveBookingClinical(
  id: string,
  patch: { diagnosis?: string; treatmentNotes?: string; followUpDate?: string },
): Promise<ClientBooking> {
  return api.patch<ClientBooking>(`/bookings/${id}/clinical`, patch);
}
