import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  addBookingRequest,
  deleteDoctor,
  deleteRequest,
  deleteService,
  get,
  resetAll,
  saveDoctor,
  saveService,
  setBookingStatus,
  updateSettings,
} from "@/lib/clinic-store";

class MemoryStorage {
  store = new Map<string, string>();
  getItem(key: string) {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("window", { localStorage: storage });
  resetAll();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("clinic-store bookings", () => {
  it("adds a booking request as pending and returns snapshot", () => {
    const snap = addBookingRequest({
      ownerName: "Test",
      phone: "123",
      email: "t@t.com",
      petName: "Rex",
      animalType: "Dog",
      breed: "Lab",
      age: "3",
      weight: "20",
      symptoms: "limp",
      allergies: "",
      medications: "",
      doctorId: "dr-1",
      doctorName: "Dr. E",
      date: "2026-08-10",
      time: "09:00",
      emergency: false,
    });
    expect(snap.requests[0]!.status).toBe("pending");
    expect(snap.requests[0]!.doctorName).toBe("Dr. E");
  });

  it("transitions status and deletes requests", () => {
    const { requests } = addBookingRequest({
      ownerName: "A",
      phone: "1",
      email: "a@a.com",
      petName: "P",
      animalType: "Cat",
      breed: "",
      age: "",
      weight: "",
      symptoms: "x",
      allergies: "",
      medications: "",
      doctorId: "d",
      doctorName: "Dr",
      date: "2026-08-10",
      time: "09:00",
      emergency: false,
    });
    setBookingStatus(requests[0]!.id, "confirmed");
    expect(get().requests[0]!.status).toBe("confirmed");

    deleteRequest(requests[0]!.id);
    expect(get().requests).toHaveLength(0);
  });

  it("upserts doctors and services", () => {
    const doc = get().doctors[0]!;
    const updated = { ...doc, name: "Dr. Updated" };
    saveDoctor(updated);
    expect(get().doctors.find((d) => d.id === doc.id)!.name).toBe("Dr. Updated");

    const svc = get().services[0]!;
    const svcUpdated = { ...svc, title: "Updated service" };
    saveService(svcUpdated);
    expect(get().services.find((s) => s.slug === svc.slug)!.title).toBe("Updated service");

    deleteService(svc.slug);
    expect(get().services.find((s) => s.slug === svc.slug)).toBeUndefined();
    deleteDoctor(doc.id);
    expect(get().doctors.find((d) => d.id === doc.id)).toBeUndefined();
  });

  it("sanitizes settings on update", () => {
    updateSettings({
      phone: "+1 (415) 555 <script>",
      whatsapp: "abc+1415def",
      email: " not-valid ",
    });
    const s = get().settings;
    // sanitizePhone keeps dialable chars only
    expect(s.phone).not.toContain("<script>");
    expect(s.whatsapp).not.toContain("abc");
  });
});
