import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { CLINIC, DOCTORS, SERVICES } from "@/lib/clinic-data";
import {
  addBookingRequest,
  deleteDoctor,
  deleteRequest,
  deleteService,
  fetchAllProducts,
  get,
  importProducts,
  parseProductCsv,
  previewProductImports,
  productImportKey,
  resetAll,
  saveDoctor,
  saveService,
  setBookingStatus,
  updateSettings,
  type Product,
  type ProductImportItem,
} from "@/lib/clinic-store";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
    getPage: vi.fn(),
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
    if (path === "/reviews") return Promise.resolve([]);
    if (path === "/payments") return Promise.resolve([]);
    if (path === "/work-session") return Promise.resolve(null);
    if (path === "/audit-logs") return Promise.resolve([]);
    if (path === "/work-days") return Promise.resolve([]);
    return Promise.resolve(null);
  });
}

beforeEach(() => {
  vi.mocked(api.get).mockReset();
  vi.mocked(api.getPage).mockReset();
  vi.mocked(api.getPage).mockResolvedValue({
    data: [],
    pagination: { page: 1, limit: 200, total: 0, pages: 0 },
  });
  vi.mocked(api.post).mockReset();
  vi.mocked(api.patch).mockReset();
  vi.mocked(api.delete).mockReset();
  mockApiDefaults();
  return resetAll();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function makeProduct(product: Partial<Product> & Pick<Product, "id" | "name">): Product {
  return {
    description: "",
    price: 0,
    compareAtPrice: null,
    image: "",
    category: "food",
    petType: "both",
    stock: 0,
    featured: false,
    barcode: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...product,
  };
}

describe("clinic-store bookings", () => {
  it("adds a booking request as pending and calls API", async () => {
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
    vi.mocked(api.post).mockImplementation((_path, body) =>
      Promise.resolve({
        ...(body as object),
        id: "req-1",
        status: "pending",
        createdAt: new Date().toISOString(),
      }),
    );
    await addBookingRequest(input);
    expect(api.post).toHaveBeenCalledWith(
      "/bookings",
      expect.objectContaining({ status: "pending" }),
    );
    expect(api.post).toHaveBeenCalledWith(
      "/bookings",
      expect.objectContaining({ doctorName: "Dr. E" }),
    );
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
    await addBookingRequest(input);

    vi.mocked(api.patch).mockResolvedValue({ id: "req-1", ...input, status: "confirmed" });
    await setBookingStatus("req-1", "confirmed");
    expect(api.patch).toHaveBeenCalledWith("/bookings/req-1/status", { status: "confirmed" });

    vi.mocked(api.delete).mockResolvedValue(undefined);
    await deleteRequest("req-1");
    expect(api.delete).toHaveBeenCalledWith("/bookings/req-1");
  });

  it("upserts doctors and services", async () => {
    const doc = get().doctors[0]!;
    const updated = { ...doc, name: "Dr. Updated" };
    vi.mocked(api.patch).mockResolvedValue(updated);
    await saveDoctor(updated);
    expect(api.patch).toHaveBeenCalledWith(`/doctors/${doc.id}`, updated);

    const svc = get().services[0]!;
    const svcUpdated = { ...svc, title: "Updated service" };
    vi.mocked(api.patch).mockResolvedValue(svcUpdated);
    await saveService(svcUpdated);
    expect(api.patch).toHaveBeenCalledWith(`/services/${svc.slug}`, svcUpdated);

    vi.mocked(api.delete).mockResolvedValue(undefined);
    await deleteService(svc.slug);
    expect(api.delete).toHaveBeenCalledWith(`/services/${svc.slug}`);

    await deleteDoctor(doc.id);
    expect(api.delete).toHaveBeenCalledWith(`/doctors/${doc.id}`);
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
    vi.mocked(api.patch).mockImplementation((_path, body) => Promise.resolve(body));
    await updateSettings({
      phone: "+1 (415) 555 <script>",
      whatsapp: "abc+1415def",
      email: " not-valid ",
    });
    expect(api.patch).toHaveBeenCalledWith(
      "/settings",
      expect.objectContaining({
        phone: expect.not.stringContaining("<script>"),
        whatsapp: expect.not.stringContaining("abc"),
      }),
    );
  });
});

describe("product CSV import", () => {
  it("parses quoted fields, K/g weights, localized prices, stock, and valid row numbers", () => {
    const csv = [
      "\uFEFFNo,Name,Type,Category,K/g,Barcode / QR value,Price,Stock",
      '1,"Food, Treats",Cat,Food,500 g,ABC-123,"19,50",7',
      "2,Invalid,,Food,,,not-a-price,2",
      "3,,,,,,,",
    ].join("\n");

    const result = parseProductCsv(csv, "Imported product");

    expect(result.items).toEqual([
      {
        name: "Food, Treats",
        description: "500 g Cat",
        price: 19.5,
        category: "food",
        petType: "cat",
        stock: 7,
        barcode: "ABC-123",
      },
    ]);
    expect(result.invalidRows).toEqual([3]);
  });

  it("requires the core product columns", () => {
    expect(() => parseProductCsv("Name,Type\nFood,Cat", "Imported product")).toThrow(
      "missing-required-columns",
    );
  });

  it("matches duplicates by normalized barcode or fallback product details", () => {
    const existing = [
      makeProduct({ id: "barcode-product", name: "Cat Food", barcode: " 001 " }),
      makeProduct({
        id: "detail-product",
        name: "Dog Treats",
        description: "Natural",
        category: "treats",
        petType: "dog",
      }),
    ];
    const items: ProductImportItem[] = [
      {
        name: "Updated Cat Food",
        description: "New",
        price: 20,
        category: "food",
        petType: "cat",
        stock: 2,
        barcode: "001",
      },
      {
        name: " dog treats ",
        description: "changed description",
        price: 10,
        category: "Treats",
        petType: "dog",
        stock: 1,
        barcode: null,
      },
      {
        name: "New Toy",
        description: "Rope",
        price: 5,
        category: "toys",
        petType: "both",
        stock: 4,
        barcode: "NEW-1",
      },
    ];

    const result = previewProductImports(existing, items);

    expect(result).toEqual({
      rows: [
        expect.objectContaining({ duplicate: true, existing: existing[0] }),
        expect.objectContaining({ duplicate: true, existing: existing[1] }),
        expect.objectContaining({ duplicate: false, existing: null }),
      ],
      duplicateCount: 2,
      newCount: 1,
    });
    expect(productImportKey(items[0]!)).toBe(productImportKey(existing[0]!));
  });

  it("fetches every product page", async () => {
    const first = makeProduct({ id: "p1", name: "First" });
    const second = makeProduct({ id: "p2", name: "Second" });
    vi.mocked(api.getPage)
      .mockResolvedValueOnce({
        data: [first],
        pagination: { page: 1, limit: 200, total: 2, pages: 2 },
      })
      .mockResolvedValueOnce({
        data: [second],
        pagination: { page: 2, limit: 200, total: 2, pages: 2 },
      });

    await expect(fetchAllProducts()).resolves.toEqual([first, second]);
    expect(api.getPage).toHaveBeenNthCalledWith(1, "/products?limit=200&page=1");
    expect(api.getPage).toHaveBeenNthCalledWith(2, "/products?limit=200&page=2");
  });

  it("sends one atomic import request with the selected duplicate mode", async () => {
    const products: ProductImportItem[] = [
      {
        name: "Food",
        description: "500 g",
        price: 10,
        category: "food",
        petType: "both",
        stock: 2,
        barcode: null,
      },
    ];
    vi.mocked(api.post).mockResolvedValue({
      summary: { created: 1, updated: 0, skipped: 0 },
    });

    await importProducts(products, "skip");

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith("/products/import", {
      products,
      duplicateAction: "skip",
    });
  });
});
