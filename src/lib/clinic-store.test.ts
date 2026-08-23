import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { CLINIC, DOCTORS, SERVICES } from "@/lib/clinic-data";
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

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const SETTINGS = { ...CLINIC };

function mockApiDefaults() {
  vi.mocked(api.get).mockImplementation((path: string) => {
    if (path === "/doctors") return Promise.resolve(DOCTORS);
    if (path === "/services") return Promise.resolve(SERVICES);
    if (path === "/settings") return Promise.resolve(SETTINGS);
    if (path === "/bookings") return Promise.resolve([]);
    if (path === "/products") return Promise.resolve([]);
    if (path === "/orders") return Promise.resolve([]);
    return Promise.resolve(null);
  });
}

beforeEach(() => {
  vi.mocked(api.get).mockReset();
  vi.mocked(api.post).mockReset();
  vi.mocked(api.patch).mockReset();
  vi.mocked(api.delete).mockReset();
  mockApiDefaults();
  return resetAll();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("clinic-store bookings", () => {
  it("adds a booking request as pending and returns snapshot", async () => {
    const input = {
      ownerName: "Test",
      phone: "123",
      email: "t@t.com",
      petName: "Rex",
      animalType: "Dog",
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
    };
    vi.mocked(api.post).mockImplementation((path, body) =>
      Promise.resolve({
        ...(body as object),
        id: "req-1",
        status: "pending",
        createdAt: new Date().toISOString(),
      }),
    );
    const snap = await addBookingRequest(input);
    expect(api.post).toHaveBeenCalledWith(
      "/bookings",
      expect.objectContaining({ status: "pending" }),
    );
    expect(snap.requests[0]!.status).toBe("pending");
    expect(snap.requests[0]!.doctorName).toBe("Dr. E");
  });

  it("transitions status and deletes requests", async () => {
    const input = {
      ownerName: "A",
      phone: "1",
      email: "a@a.com",
      petName: "P",
      animalType: "Cat",
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
    };
    vi.mocked(api.post).mockResolvedValue({
      ...input,
      id: "req-1",
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    const { requests } = await addBookingRequest(input);

    vi.mocked(api.patch).mockResolvedValue({ ...requests[0]!, status: "confirmed" });
    await setBookingStatus(requests[0]!.id, "confirmed");
    expect(get().requests[0]!.status).toBe("confirmed");

    vi.mocked(api.delete).mockResolvedValue(undefined);
    await deleteRequest(requests[0]!.id);
    expect(get().requests).toHaveLength(0);
  });

  it("upserts doctors and services", async () => {
    const doc = get().doctors[0]!;
    const updated = { ...doc, name: "Dr. Updated" };
    vi.mocked(api.patch).mockResolvedValue(updated);
    await saveDoctor(updated);
    expect(api.patch).toHaveBeenCalledWith(`/doctors/${doc.id}`, updated);
    expect(get().doctors.find((d) => d.id === doc.id)!.name).toBe("Dr. Updated");

    const svc = get().services[0]!;
    const svcUpdated = { ...svc, title: "Updated service" };
    vi.mocked(api.patch).mockResolvedValue(svcUpdated);
    await saveService(svcUpdated);
    expect(get().services.find((s) => s.slug === svc.slug)!.title).toBe("Updated service");

    vi.mocked(api.delete).mockResolvedValue(undefined);
    await deleteService(svc.slug);
    expect(get().services.find((s) => s.slug === svc.slug)).toBeUndefined();

    await deleteDoctor(doc.id);
    expect(get().doctors.find((d) => d.id === doc.id)).toBeUndefined();
  });

  it("creates new doctors via POST when the id is unknown", async () => {
    const fresh = {
      id: "dr-new",
      name: "Dr. New",
      specialization: "General",
      experience: "5 years",
      rating: 4.5,
      days: ["Mon"],
      bio: "",
      initials: "DN",
      tags: [],
      pets: ["Dog"],
    };
    vi.mocked(api.post).mockResolvedValue(fresh);
    await saveDoctor(fresh);
    expect(api.post).toHaveBeenCalledWith("/doctors", fresh);
  });

  it("sanitizes settings on update", async () => {
    vi.mocked(api.patch).mockImplementation((path, body) => Promise.resolve(body));
    await updateSettings({
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
