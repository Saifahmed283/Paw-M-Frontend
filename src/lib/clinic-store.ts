import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CLINIC, CLINIC_REVIEWS, DOCTORS, SERVICES, type Doctor } from "@/lib/clinic-data";
import { sanitizeEmail, sanitizePhone, sanitizeWhatsapp } from "@/lib/sanitize";
import { api } from "@/lib/api";
import { isAuthed } from "@/lib/auth";
import type { Prescription } from "@/lib/client-medical";
import type { RolePermissions } from "@/lib/roles";

export type Status = "pending" | "confirmed" | "completed" | "cancelled";

export type BookingRequest = {
  id: string;
  ownerName: string;
  phone: string;
  email: string;
  petName: string;
  animalType: string;
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
  archived?: boolean;
  petId?: string | null;
  diagnosis?: string;
  treatmentNotes?: string;
  followUpDate?: string;
  pet?: { id: string; name: string; species: string } | null;
  createdAt: string;
};

export type ServiceItem = {
  slug: string;
  icon: string;
  title: string;
  description: string;
  price?: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  category: string;
  petType?: string;
  stock: number;
  featured: boolean;
  barcode?: string | null;
  barcodeImage?: string | null;
  minStockAlert?: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductDraft = Omit<Product, "id" | "createdAt" | "updatedAt">;

export type ProductImportItem = {
  name: string;
  description: string;
  price: number;
  category: string;
  petType: "dog" | "cat" | "both";
  stock: number;
  barcode: string | null;
};

export type ProductImportMode = "replace" | "skip";

export type ProductImportResult = {
  summary: {
    created: number;
    updated: number;
    skipped: number;
  };
  results?: { index: number; action: "created" | "updated" | "skipped" }[];
  detail?: string;
};

export type ProductImportPreviewRow = {
  index: number;
  item: ProductImportItem;
  duplicate: boolean;
  existing: Product | null;
};

function normalizeProductText(value: unknown) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalizeImportHeader(value: string) {
  return value
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function findImportHeader(headers: string[], aliases: string[]) {
  const normalized = new Set(aliases.map(normalizeImportHeader));
  return headers.findIndex((header) => normalized.has(normalizeImportHeader(header)));
}

function parseCsvRows(csvText: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const character = csvText[index]!;
    if (quoted) {
      if (character === '"' && csvText[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
      continue;
    }
    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(value.trim());
      value = "";
    } else if (character === "\n") {
      row.push(value.trim());
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      value = "";
    } else if (character !== "\r") {
      value += character;
    }
  }

  row.push(value.trim());
  if (row.some((cell) => cell !== "")) rows.push(row);
  return rows;
}

function parseImportNumber(rawValue: string) {
  let value = rawValue.trim().replace(/\s/g, "");
  if (!value) return Number.NaN;
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");
  if (lastComma !== -1 && lastDot !== -1) {
    value =
      lastComma > lastDot ? value.replace(/,/g, "") : value.replace(/\./g, "").replace(",", ".");
  } else if (lastComma !== -1) {
    value = value.replace(",", ".");
  }
  return Number(value.replace(/[^0-9.+-]/g, ""));
}

export function productImportKey(product: {
  name: string;
  category: string;
  petType?: string;
  barcode?: string | null;
}) {
  const barcode = normalizeProductText(product.barcode);
  if (barcode) return `barcode:${barcode}`;
  return [
    "details",
    normalizeProductText(product.name),
    normalizeProductText(product.category),
    normalizeProductText(product.petType ?? "both"),
  ].join("|");
}

export function parseProductCsv(csvText: string, defaultDescription: string) {
  const rows = parseCsvRows(csvText.replace(/^\uFEFF/, ""));
  const headers = rows[0];
  if (!headers) throw new Error("missing-required-columns");

  const nameIndex = findImportHeader(headers, ["Name"]);
  const typeIndex = findImportHeader(headers, ["Type"]);
  const categoryIndex = findImportHeader(headers, ["Category"]);
  const weightIndex = findImportHeader(headers, ["Kg", "K/g"]);
  const priceIndex = findImportHeader(headers, ["Price"]);
  const barcodeIndex = findImportHeader(headers, ["Barcode / QR value", "Barcode / QR", "Barcode"]);
  const stockIndex = findImportHeader(headers, ["Stock"]);

  if (nameIndex === -1 || categoryIndex === -1 || priceIndex === -1) {
    throw new Error("missing-required-columns");
  }

  const items: ProductImportItem[] = [];
  const invalidRows: number[] = [];
  const getValue = (values: string[], index: number) => (index === -1 ? "" : (values[index] ?? ""));

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const values = rows[rowIndex]!;
    const name = getValue(values, nameIndex).trim();
    const type = getValue(values, typeIndex).trim();
    const categoryValue = getValue(values, categoryIndex).trim();
    const weight = getValue(values, weightIndex).trim();
    const priceValue = getValue(values, priceIndex).trim();
    const barcodeValue = getValue(values, barcodeIndex).trim();
    const stockValue = getValue(values, stockIndex).trim();

    if (![name, type, categoryValue, weight, priceValue, barcodeValue, stockValue].some(Boolean)) {
      continue;
    }

    const price = parseImportNumber(priceValue);
    const stock = stockValue ? parseImportNumber(stockValue) : 0;
    if (!name || !categoryValue || !Number.isFinite(price) || price < 0) {
      invalidRows.push(rowIndex + 1);
      continue;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      invalidRows.push(rowIndex + 1);
      continue;
    }

    const normalizedType = normalizeProductText(type);
    const isDog = normalizedType.includes("dog");
    const isCat = normalizedType.includes("cat");
    const petType: ProductImportItem["petType"] =
      isDog && isCat ? "both" : isDog ? "dog" : isCat ? "cat" : "both";
    const category = normalizeProductText(categoryValue);
    const description =
      Array.from(new Set([weight, type].filter(Boolean))).join(" ") || defaultDescription;

    items.push({
      name,
      description,
      price,
      category,
      petType,
      stock,
      barcode: barcodeValue || null,
    });
  }

  return { items, invalidRows };
}

export function previewProductImports(existingProducts: Product[], incoming: ProductImportItem[]) {
  const existingByKey = new Map(
    existingProducts.map((product) => [productImportKey(product), product]),
  );
  const seen = new Set<string>();
  const rows: ProductImportPreviewRow[] = incoming.map((item, index) => {
    const key = productImportKey(item);
    const existing = existingByKey.get(key) ?? null;
    const duplicate = Boolean(existing) || seen.has(key);
    seen.add(key);
    return { index, item, duplicate, existing };
  });
  const duplicateCount = rows.filter((row) => row.duplicate).length;
  return { rows, duplicateCount, newCount: rows.length - duplicateCount };
}

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type PaymentMethod = "cash" | "fawry" | "instapay";
export type PaymentStatus = "unpaid" | "proof_submitted" | "paid";

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: Status;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentRef: string;
  proofImage: string;
  paidAt?: string | null;
  archived?: boolean;
  source?: string;
  discountAmount?: number;
  discountLabel?: string;
  createdAt: string;
};

export type PaymentKind = "order" | "visit" | "manual";
export type PaymentItemKind = "service" | "product" | "other";

export type PaymentItem = {
  id: string;
  paymentId: string;
  label: string;
  amount: number;
  kind: PaymentItemKind;
  referenceId?: string | null;
  createdAt: string;
};

export type ClientRef = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
};

export type BookingRef = {
  id: string;
  petName: string;
  doctorName: string;
  date: string;
  status: Status;
};

export type Payment = {
  id: string;
  title: string;
  amount: number;
  method: PaymentMethod;
  status: "unpaid" | "paid";
  date: string;
  notes: string;
  orderId?: string | null;
  clientId?: string | null;
  bookingId?: string | null;
  kind: PaymentKind;
  requestedBy?: string;
  client?: ClientRef | null;
  booking?: BookingRef | null;
  items?: PaymentItem[];
  createdAt: string;
};

export type ClientType = "store" | "clinic" | "both" | "new";

export type ClientSummary = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  suspended?: boolean;
  suspendedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  type: ClientType;
  petsCount: number;
  bookingsCount: number;
  ordersCount: number;
  totalPaid: number;
  outstanding: number;
  lastActivity: string;
};

export type ClientPet = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  dob?: string;
  weightKg?: number;
  color?: string;
  photo?: string;
  notes?: string;
  createdAt: string;
};

export type ClientDetailBooking = {
  id: string;
  petId?: string | null;
  petName: string;
  doctorId?: string;
  doctorName: string;
  date: string;
  time: string;
  status: Status;
  symptoms?: string;
  diagnosis?: string;
  treatmentNotes?: string;
  followUpDate?: string;
  pet?: { id: string; name: string; species: string } | null;
  prescriptions?: {
    id: string;
    rxNumber: string;
    status: string;
    followUpDate?: string;
    issuedAt?: string | null;
  }[];
};

export type ClientDetail = {
  client: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    suspended?: boolean;
    suspendedAt?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  pets: ClientPet[];
  bookings: ClientDetailBooking[];
  prescriptions: Prescription[];
  orders: Order[];
  payments: Payment[];
  stats: {
    bookingsCount: number;
    completedCount: number;
    paidVisit: number;
    outstandingVisit: number;
    nextAppointment: ClientDetailBooking | null;
    followUpDate: string;
  };
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type ClinicSettings = {
  name: string;
  tagline: string;
  phone: string;
  emergency: string;
  whatsapp: string;
  email: string;
  address: string;
  currency: string;
  instapay: string;
  rolePermissions?: RolePermissions;
};

export type WorkSession = {
  id: string;
  startedAt: string;
  endedAt: string | null;
  date: string;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  action: string;
  target: string;
  detail: string;
  createdAt: string;
};

export type WorkDaySummary = {
  date: string;
  bookings: number;
  orders: number;
  payments: number;
  revenue: number;
  paymentsTotal: number;
  session: {
    id: string;
    startedAt: string;
    endedAt: string | null;
  } | null;
};

export type WorkDayDetail = {
  date: string;
  session: WorkSession | null;
  bookings: BookingRequest[];
  orders: Order[];
  payments: Payment[];
  logs: AuditLog[];
};

type Store = {
  requests: BookingRequest[];
  doctors: Doctor[];
  services: ServiceItem[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  payments: Payment[];
  clients: ClientSummary[];
  settings: ClinicSettings;
  workSession: WorkSession | null;
  auditLogs: AuditLog[];
  workDays: WorkDaySummary[];
  workDay: WorkDayDetail | null;
};

const QUERY_KEYS = {
  doctors: ["doctors"] as const,
  services: ["services"] as const,
  products: ["products"] as const,
  bookings: ["bookings"] as const,
  orders: ["orders"] as const,
  reviews: ["reviews"] as const,
  payments: ["payments"] as const,
  clients: ["clients"] as const,
  settings: ["settings"] as const,
  workSession: ["work-session"] as const,
  auditLogs: ["audit-logs"] as const,
  workDays: ["work-days"] as const,
} as const;

const seedDefaults = {
  doctors: DOCTORS,
  services: SERVICES,
  reviews: CLINIC_REVIEWS.map((review, index) => ({
    ...review,
    id: `clinic-review-${index + 1}`,
    productId: "clinic",
    status: "approved" as const,
    createdAt: new Date(0).toISOString(),
  })),
  settings: { ...CLINIC } as ClinicSettings,
  requests: [] as BookingRequest[],
  products: [] as Product[],
  orders: [] as Order[],
  payments: [] as Payment[],
  clients: [] as ClientSummary[],
  auditLogs: [] as AuditLog[],
  workDays: [] as WorkDaySummary[],
};

function seed(): Store {
  return {
    requests: [],
    doctors: DOCTORS,
    services: SERVICES,
    products: [],
    orders: [],
    reviews: CLINIC_REVIEWS.map((review, index) => ({
      ...review,
      id: `clinic-review-${index + 1}`,
      productId: "clinic",
      status: "approved" as const,
      createdAt: new Date(0).toISOString(),
    })),
    payments: [],
    clients: [],
    settings: { ...CLINIC },
    workSession: null,
    auditLogs: [],
    workDays: [],
    workDay: null,
  };
}

let queryClientInstance: ReturnType<typeof useQueryClient> | null = null;

function getQc(): ReturnType<typeof useQueryClient> | null {
  return queryClientInstance;
}

function invalidate(key: readonly unknown[]) {
  getQc()?.invalidateQueries({ queryKey: key, exact: true });
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function fetchAllProducts() {
  const products: Product[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    const result = await api.getPage<Product>(`/products?limit=200&page=${page}`);
    products.push(...result.data);
    pageCount = Math.max(1, result.pagination.pages);
    page += 1;
  } while (page <= pageCount);

  return products;
}

export function useClinicStore() {
  const qc = useQueryClient();
  queryClientInstance = qc;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: doctors = seedDefaults.doctors } = useQuery({
    queryKey: QUERY_KEYS.doctors,
    queryFn: () => api.get<Doctor[]>("/doctors"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.doctors,
    enabled: mounted,
  });

  const { data: services = seedDefaults.services } = useQuery({
    queryKey: QUERY_KEYS.services,
    queryFn: () => api.get<ServiceItem[]>("/services"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.services,
    enabled: mounted,
  });

  const { data: products = seedDefaults.products } = useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: fetchAllProducts,
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.products,
    enabled: mounted,
  });

  const { data: requests = seedDefaults.requests } = useQuery({
    queryKey: QUERY_KEYS.bookings,
    queryFn: () => api.get<BookingRequest[]>("/bookings"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.requests,
    enabled: mounted && isAuthed(),
  });

  const { data: orders = seedDefaults.orders } = useQuery({
    queryKey: QUERY_KEYS.orders,
    queryFn: () => api.get<Order[]>("/orders"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.orders,
    enabled: mounted && isAuthed(),
  });

  const { data: reviews = seedDefaults.reviews } = useQuery({
    queryKey: QUERY_KEYS.reviews,
    queryFn: () => api.get<Review[]>("/reviews"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.reviews,
    enabled: mounted,
  });

  const { data: payments = seedDefaults.payments } = useQuery({
    queryKey: QUERY_KEYS.payments,
    queryFn: () => api.get<Payment[]>("/payments"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.payments,
    enabled: mounted && isAuthed(),
  });

  const { data: clients = seedDefaults.clients } = useQuery({
    queryKey: QUERY_KEYS.clients,
    queryFn: () => api.get<ClientSummary[]>("/clients?limit=200"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.clients,
    enabled: mounted && isAuthed(),
  });

  const { data: settings = seedDefaults.settings } = useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn: () => api.get<ClinicSettings>("/settings"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.settings,
    enabled: mounted,
  });

  const { data: workSession = null } = useQuery({
    queryKey: QUERY_KEYS.workSession,
    queryFn: () => api.get<WorkSession | null>("/work-session"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? null,
    enabled: mounted && isAuthed(),
  });

  const { data: auditLogs = seedDefaults.auditLogs } = useQuery({
    queryKey: QUERY_KEYS.auditLogs,
    queryFn: () => api.get<AuditLog[]>("/audit-logs"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.auditLogs,
    enabled: mounted && isAuthed(),
  });

  const { data: workDays = seedDefaults.workDays } = useQuery({
    queryKey: QUERY_KEYS.workDays,
    queryFn: () => api.get<WorkDaySummary[]>("/work-days"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.workDays,
    enabled: mounted && isAuthed(),
  });

  const { data: workDay } = useQuery<WorkDayDetail | null>({
    queryKey: ["work-day"],
    queryFn: () => api.get<WorkDayDetail>("/work-days/today"),
    staleTime: Infinity,
    enabled: false,
  });

  // While the app is not yet mounted (the SSR/hydration phase), always expose
  // the seed defaults — never cache-fetched data, regardless of how fast any
  // fetch resolves or when the deferred refresh fires. This keeps the client's
  // first (hydration) render byte-identical to the server render so React never
  // sees a hydration mismatch on the public site data. After mount, flip to the
  // real data.
  return useMemo<Store>(() => {
    const gated = <T>(value: T, seed: T): T => (mounted ? value : seed);
    return {
      requests: gated(requests, seedDefaults.requests),
      doctors: gated(doctors, seedDefaults.doctors),
      services: gated(services, seedDefaults.services),
      products: gated(products, seedDefaults.products),
      orders: gated(orders, seedDefaults.orders),
      reviews: gated(reviews, seedDefaults.reviews),
      payments: gated(payments, seedDefaults.payments),
      clients: gated(clients, seedDefaults.clients),
      settings: gated(settings, seedDefaults.settings),
      workSession: gated(workSession, null),
      auditLogs: gated(auditLogs, seedDefaults.auditLogs),
      workDays: gated(workDays, seedDefaults.workDays),
      workDay: gated(workDay ?? null, null),
    };
  }, [
    mounted,
    requests,
    doctors,
    services,
    products,
    orders,
    reviews,
    payments,
    clients,
    settings,
    workSession,
    auditLogs,
    workDays,
    workDay,
  ]);
}

/** Refreshes all clinic data from the backend (no-op while one is in flight). */
export function refreshClinicData() {
  invalidate(QUERY_KEYS.bookings);
  invalidate(QUERY_KEYS.doctors);
  invalidate(QUERY_KEYS.services);
  invalidate(QUERY_KEYS.products);
  invalidate(QUERY_KEYS.orders);
  invalidate(QUERY_KEYS.reviews);
  invalidate(QUERY_KEYS.payments);
  invalidate(QUERY_KEYS.clients);
  invalidate(QUERY_KEYS.settings);
  invalidate(QUERY_KEYS.workSession);
  invalidate(QUERY_KEYS.auditLogs);
  invalidate(QUERY_KEYS.workDays);
}

export async function refreshPublicData() {
  invalidate(QUERY_KEYS.settings);
  invalidate(QUERY_KEYS.doctors);
  invalidate(QUERY_KEYS.services);
  invalidate(QUERY_KEYS.products);
  invalidate(QUERY_KEYS.reviews);
}

export async function addBookingRequest(
  input: Omit<BookingRequest, "id" | "status" | "createdAt">,
) {
  try {
    const created = await api.post<BookingRequest>("/bookings", {
      ...input,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    invalidate(QUERY_KEYS.bookings);
    return get();
  } catch (err) {
    console.error("Failed to add booking", err);
    throw err;
  }
}

export async function setBookingStatus(id: string, status: Status) {
  try {
    const updated = await api.patch<BookingRequest>(`/bookings/${id}/status`, { status });
    invalidate(QUERY_KEYS.bookings);
  } catch (err) {
    console.error("Failed to update booking status", err);
    throw err;
  }
}

export async function deleteRequest(id: string) {
  try {
    await api.delete(`/bookings/${id}`);
    invalidate(QUERY_KEYS.bookings);
  } catch (err) {
    console.error("Failed to delete booking", err);
    throw err;
  }
}

export async function archiveBooking(id: string, archived: boolean) {
  try {
    const updated = await api.patch<BookingRequest>(`/bookings/${id}/archive`, { archived });
    invalidate(QUERY_KEYS.bookings);
  } catch (err) {
    console.error("Failed to archive booking", err);
    throw err;
  }
}

export async function saveDoctor(doctor: Doctor) {
  try {
    const current = getQc()?.getQueryData<Doctor[]>(QUERY_KEYS.doctors) ?? DOCTORS;
    const exists = current.some((d) => d.id === doctor.id);
    const saved = exists
      ? await api.patch<Doctor>(`/doctors/${doctor.id}`, doctor)
      : await api.post<Doctor>("/doctors", doctor);
    invalidate(QUERY_KEYS.doctors);
  } catch (err) {
    console.error("Failed to save doctor", err);
    throw err;
  }
}

export async function deleteDoctor(id: string) {
  try {
    await api.delete(`/doctors/${id}`);
    invalidate(QUERY_KEYS.doctors);
  } catch (err) {
    console.error("Failed to delete doctor", err);
    throw err;
  }
}

export async function saveService(service: ServiceItem) {
  try {
    const current = getQc()?.getQueryData<ServiceItem[]>(QUERY_KEYS.services) ?? SERVICES;
    const exists = current.some((sv) => sv.slug === service.slug);
    const saved = exists
      ? await api.patch<ServiceItem>(`/services/${service.slug}`, service)
      : await api.post<ServiceItem>("/services", service);
    invalidate(QUERY_KEYS.services);
  } catch (err) {
    console.error("Failed to save service", err);
    throw err;
  }
}

export async function deleteService(slug: string) {
  try {
    await api.delete(`/services/${slug}`);
    invalidate(QUERY_KEYS.services);
  } catch (err) {
    console.error("Failed to delete service", err);
    throw err;
  }
}

function productPayload(product: ProductDraft) {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    image: product.image,
    category: product.category,
    petType: product.petType ?? "both",
    stock: product.stock,
    featured: product.featured,
    barcode: product.barcode?.trim() || null,
    barcodeImage: product.barcodeImage || null,
  };
}

function cacheProduct(product: Product) {
  const queryClient = getQc();
  if (!queryClient) return;
  queryClient.setQueryData<Product[]>(QUERY_KEYS.products, (current = []) => [
    product,
    ...current.filter((item) => item.id !== product.id),
  ]);
}

export async function createProduct(product: ProductDraft) {
  try {
    const saved = await api.post<Product>("/products", productPayload(product));
    cacheProduct(saved);
    invalidate(QUERY_KEYS.products);
    return saved;
  } catch (err) {
    console.error("Failed to create product", err);
    throw err;
  }
}

export async function updateProduct(id: string, product: ProductDraft) {
  try {
    const saved = await api.patch<Product>(`/products/${id}`, productPayload(product));
    cacheProduct(saved);
    invalidate(QUERY_KEYS.products);
    return saved;
  } catch (err) {
    console.error("Failed to update product", err);
    throw err;
  }
}

export async function importProducts(
  products: ProductImportItem[],
  duplicateAction: ProductImportMode,
  resolutions?: ProductImportMode[],
) {
  try {
    const result = await api.post<ProductImportResult>("/products/import", {
      products,
      duplicateAction,
      ...(resolutions ? { resolutions } : {}),
    });
    invalidate(QUERY_KEYS.products);
    return result;
  } catch (err) {
    console.error("Failed to import products", err);
    throw err;
  }
}

export async function deleteProduct(id: string) {
  try {
    await api.delete(`/products/${id}`);
    invalidate(QUERY_KEYS.products);
  } catch (err) {
    console.error("Failed to delete product", err);
    throw err;
  }
}

export async function createOrder(input: {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  paymentRef?: string | undefined;
  proofImage?: string | undefined;
  source?: "pos" | "store" | undefined;
  discountAmount?: number | undefined;
  discountLabel?: string | undefined;
}) {
  try {
    const created = await api.post<Order>("/orders", input);
    invalidate(QUERY_KEYS.orders);
    return created;
  } catch (err) {
    console.error("Failed to create order", err);
    throw err;
  }
}

export async function trackOrder(orderId: string, phone: string) {
  return api.get<Order>(
    `/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`,
  );
}

export async function submitPaymentProof(
  id: string,
  proof: { paymentRef?: string | undefined; proofImage?: string | undefined },
) {
  try {
    const updated = await api.post<Order>(`/orders/${id}/payment-proof`, proof);
    invalidate(QUERY_KEYS.orders);
    return updated;
  } catch (err) {
    console.error("Failed to submit payment proof", err);
    throw err;
  }
}

export async function setOrderPaymentStatus(id: string, paymentStatus: PaymentStatus) {
  try {
    const updated = await api.patch<Order>(`/orders/${id}/payment`, { paymentStatus });
    invalidate(QUERY_KEYS.orders);
  } catch (err) {
    console.error("Failed to update order payment status", err);
    throw err;
  }
}

export async function setOrderStatus(id: string, status: Status) {
  try {
    const updated = await api.patch<Order>(`/orders/${id}/status`, { status });
    invalidate(QUERY_KEYS.orders);
  } catch (err) {
    console.error("Failed to update order status", err);
    throw err;
  }
}

export async function deleteOrder(id: string) {
  try {
    await api.delete(`/orders/${id}`);
    invalidate(QUERY_KEYS.orders);
  } catch (err) {
    console.error("Failed to delete order", err);
    throw err;
  }
}

export async function archiveOrder(id: string, archived: boolean) {
  try {
    const updated = await api.patch<Order>(`/orders/${id}/archive`, { archived });
    invalidate(QUERY_KEYS.orders);
  } catch (err) {
    console.error("Failed to archive order", err);
    throw err;
  }
}

export async function createReview(input: {
  productId: string;
  author: string;
  rating: number;
  comment: string;
}) {
  try {
    const created = await api.post<Review>("/reviews", input);
    invalidate(QUERY_KEYS.reviews);
    return created;
  } catch (err) {
    console.error("Failed to create review", err);
    throw err;
  }
}

export async function setReviewStatus(id: string, status: "approved" | "rejected") {
  try {
    const updated = await api.patch<Review>(`/reviews/${id}`, { status });
    invalidate(QUERY_KEYS.reviews);
  } catch (err) {
    console.error("Failed to update review", err);
    throw err;
  }
}

export async function deleteReview(id: string) {
  try {
    await api.delete(`/reviews/${id}`);
    invalidate(QUERY_KEYS.reviews);
  } catch (err) {
    console.error("Failed to delete review", err);
    throw err;
  }
}

export async function syncGoogleReviews(
  placeId?: string,
): Promise<{ synced: number; total: number }> {
  try {
    const data = await api.post<{ synced: number; total: number }>(
      "/google/sync-reviews",
      placeId ? { placeId } : undefined,
    );
    invalidate(QUERY_KEYS.reviews);
    return data;
  } catch (err) {
    console.error("Failed to sync Google reviews", err);
    throw err;
  }
}

export async function createPayment(input: {
  title: string;
  amount: number;
  method: PaymentMethod;
  status: "unpaid" | "paid";
  date: string;
  notes?: string | undefined;
  orderId?: string | undefined;
}) {
  try {
    const created = await api.post<Payment>("/payments", input);
    invalidate(QUERY_KEYS.payments);
    return created;
  } catch (err) {
    console.error("Failed to create payment", err);
    throw err;
  }
}

export async function updatePayment(
  id: string,
  patch: Partial<
    Pick<Payment, "title" | "amount" | "method" | "status" | "date" | "notes" | "orderId">
  >,
) {
  try {
    const updated = await api.patch<Payment>(`/payments/${id}`, patch);
    invalidate(QUERY_KEYS.payments);
    return updated;
  } catch (err) {
    console.error("Failed to update payment", err);
    throw err;
  }
}

export async function deletePayment(id: string) {
  try {
    await api.delete(`/payments/${id}`);
    invalidate(QUERY_KEYS.payments);
  } catch (err) {
    console.error("Failed to delete payment", err);
    throw err;
  }
}

export type PaymentRequestInput = {
  title: string;
  kind?: PaymentKind;
  clientId?: string | null;
  bookingId?: string | null;
  amount: number;
  method: PaymentMethod;
  status?: "unpaid" | "paid" | undefined;
  date?: string;
  notes?: string;
  requestedBy?: string;
  items?: {
    label: string;
    amount: number;
    kind: "service" | "product" | "other";
    referenceId?: string | null | undefined;
  }[];
};

export async function createPaymentRequest(input: PaymentRequestInput) {
  try {
    const created = await api.post<Payment>("/payments", input);
    invalidate(QUERY_KEYS.payments);
    return created;
  } catch (err) {
    console.error("Failed to create payment request", err);
    throw err;
  }
}

export async function addPaymentItem(
  id: string,
  items: { label: string; amount: number; kind: "service" | "product" | "other" }[],
) {
  try {
    const updated = await api.post<Payment>(`/payments/${id}/items`, { items });
    invalidate(QUERY_KEYS.payments);
    return updated;
  } catch (err) {
    console.error("Failed to add payment items", err);
    throw err;
  }
}

export async function settlePayment(id: string, input: { method: PaymentMethod; notes?: string }) {
  try {
    const updated = await api.post<Payment>(`/payments/${id}/settle`, input);
    invalidate(QUERY_KEYS.payments);
    return updated;
  } catch (err) {
    console.error("Failed to settle payment", err);
    throw err;
  }
}

export async function getClient(id: string) {
  return api.get<ClientDetail>(`/clients/${id}`);
}

export async function setClientSuspended(id: string, suspended: boolean) {
  const updated = await api.patch<ClientSummary>(`/clients/${id}`, { suspended });
  invalidate(QUERY_KEYS.clients);
  return updated;
}

export async function deleteClient(id: string) {
  await api.delete(`/clients/${id}`);
  invalidate(QUERY_KEYS.clients);
}

export async function notifyClient(id: string, input: { title: string; body: string }) {
  const created = await api.post<{ notification: ClientNotification }>(
    `/clients/${id}/notify`,
    input,
  );
  return created.notification;
}

export type ClientNotification = {
  id: string;
  clientId: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export async function updateSettings(patch: Partial<ClinicSettings>) {
  const clean: Partial<ClinicSettings> = { ...patch };
  if (patch.phone !== undefined) clean.phone = sanitizePhone(patch.phone);
  if (patch.emergency !== undefined) clean.emergency = sanitizePhone(patch.emergency);
  if (patch.whatsapp !== undefined) clean.whatsapp = sanitizeWhatsapp(patch.whatsapp);
  if (patch.email !== undefined) clean.email = sanitizeEmail(patch.email) ?? "";
  try {
    const updated = await api.patch<ClinicSettings>("/settings", clean);
    invalidate(QUERY_KEYS.settings);
  } catch (err) {
    console.error("Failed to update settings", err);
    throw err;
  }
}

export async function checkIn() {
  try {
    const result = await api.post<{
      session: WorkSession;
      archived: { bookings: number; orders: number };
    }>("/work-session/check-in", {});
    invalidate(QUERY_KEYS.workSession);
    return result;
  } catch (err) {
    console.error("Failed to check in", err);
    throw err;
  }
}

export async function checkOut() {
  try {
    const result = await api.post<{
      session: WorkSession;
      archived: { bookings: number; orders: number };
    }>("/work-session/check-out", {});
    invalidate(QUERY_KEYS.workSession);
    return result;
  } catch (err) {
    console.error("Failed to check out", err);
    throw err;
  }
}

export async function loadAuditLogs() {
  try {
    const logs = await api.get<AuditLog[]>("/audit-logs");
    invalidate(QUERY_KEYS.auditLogs);
    return logs;
  } catch (err) {
    console.error("Failed to load audit logs", err);
    throw err;
  }
}

export async function loadWorkDays() {
  try {
    const days = await api.get<WorkDaySummary[]>("/work-days");
    invalidate(QUERY_KEYS.workDays);
    return days;
  } catch (err) {
    console.error("Failed to load workday folders", err);
    throw err;
  }
}

export async function loadWorkDay(date: string) {
  try {
    const day = await api.get<WorkDayDetail>(`/work-days/${date}`);
    getQc()?.setQueryData(["work-day"], day);
    return day;
  } catch (err) {
    console.error("Failed to load workday folder", err);
    throw err;
  }
}

export async function resetAll() {
  try {
    const [doctors, services, products, orders, reviews, payments, settings] = await Promise.all([
      api.get<Doctor[]>("/doctors"),
      api.get<ServiceItem[]>("/services"),
      api.get<Product[]>("/products"),
      api.get<Order[]>("/orders"),
      api.get<Review[]>("/reviews"),
      api.get<Payment[]>("/payments"),
      api.get<ClinicSettings>("/settings"),
    ]);
    const fresh = seed();
    const qc = getQc();
    if (qc) {
      qc.setQueryData(QUERY_KEYS.bookings, []);
      qc.setQueryData(
        QUERY_KEYS.doctors,
        Array.isArray(doctors) && doctors.length ? doctors : fresh.doctors,
      );
      qc.setQueryData(
        QUERY_KEYS.services,
        Array.isArray(services) && services.length ? services : fresh.services,
      );
      qc.setQueryData(QUERY_KEYS.products, Array.isArray(products) ? products : fresh.products);
      qc.setQueryData(QUERY_KEYS.orders, Array.isArray(orders) ? orders : fresh.orders);
      qc.setQueryData(QUERY_KEYS.reviews, Array.isArray(reviews) ? reviews : fresh.reviews);
      qc.setQueryData(QUERY_KEYS.payments, Array.isArray(payments) ? payments : fresh.payments);
      qc.setQueryData(QUERY_KEYS.settings, { ...fresh.settings, ...(settings ?? {}) });
    }
  } catch (err) {
    console.error("Failed to reset", err);
    throw err;
  }
}

export function get(): Store {
  const qc = getQc();
  if (!qc) return seed();
  return {
    requests: qc.getQueryData<BookingRequest[]>(QUERY_KEYS.bookings) ?? [],
    doctors: qc.getQueryData<Doctor[]>(QUERY_KEYS.doctors) ?? DOCTORS,
    services: qc.getQueryData<ServiceItem[]>(QUERY_KEYS.services) ?? SERVICES,
    products: qc.getQueryData<Product[]>(QUERY_KEYS.products) ?? [],
    orders: qc.getQueryData<Order[]>(QUERY_KEYS.orders) ?? [],
    reviews:
      qc.getQueryData<Review[]>(QUERY_KEYS.reviews) ??
      CLINIC_REVIEWS.map((review, index) => ({
        ...review,
        id: `clinic-review-${index + 1}`,
        productId: "clinic",
        status: "approved" as const,
        createdAt: new Date(0).toISOString(),
      })),
    payments: qc.getQueryData<Payment[]>(QUERY_KEYS.payments) ?? [],
    clients: qc.getQueryData<ClientSummary[]>(QUERY_KEYS.clients) ?? [],
    settings: qc.getQueryData<ClinicSettings>(QUERY_KEYS.settings) ?? { ...CLINIC },
    workSession: qc.getQueryData<WorkSession | null>(QUERY_KEYS.workSession) ?? null,
    auditLogs: qc.getQueryData<AuditLog[]>(QUERY_KEYS.auditLogs) ?? [],
    workDays: qc.getQueryData<WorkDaySummary[]>(QUERY_KEYS.workDays) ?? [],
    workDay: qc.getQueryData<WorkDayDetail>(["work-day"]) ?? null,
  };
}

export type { Doctor };
