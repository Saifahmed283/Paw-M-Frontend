import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CLINIC, CLINIC_REVIEWS, DOCTORS, SERVICES, type Doctor } from "@/lib/clinic-data";
import { sanitizeEmail, sanitizePhone, sanitizeWhatsapp } from "@/lib/sanitize";
import { api } from "@/lib/api";
import { isAuthed } from "@/lib/auth";
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
  createdAt: string;
};

export type ServiceItem = {
  slug: string;
  icon: string;
  title: string;
  description: string;
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
  barcode?: string;
  barcodeImage?: string;
  createdAt: string;
  updatedAt: string;
};

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
  createdAt: string;
};

export type Payment = {
  id: string;
  title: string;
  amount: number;
  method: PaymentMethod;
  status: "unpaid" | "paid";
  date: string;
  notes: string;
  orderId: string;
  createdAt: string;
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
    queryFn: () => api.get<Product[]>("/products"),
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

export async function saveProduct(product: Product) {
  try {
    const current = getQc()?.getQueryData<Product[]>(QUERY_KEYS.products) ?? [];
    const exists = current.some((p) => p.id === product.id);
    const saved = exists
      ? await api.patch<Product>(`/products/${product.id}`, product)
      : await api.post<Product>("/products", product);
    invalidate(QUERY_KEYS.products);
  } catch (err) {
    console.error("Failed to save product", err);
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
    settings: qc.getQueryData<ClinicSettings>(QUERY_KEYS.settings) ?? { ...CLINIC },
    workSession: qc.getQueryData<WorkSession | null>(QUERY_KEYS.workSession) ?? null,
    auditLogs: qc.getQueryData<AuditLog[]>(QUERY_KEYS.auditLogs) ?? [],
    workDays: qc.getQueryData<WorkDaySummary[]>(QUERY_KEYS.workDays) ?? [],
    workDay: qc.getQueryData<WorkDayDetail>(["work-day"]) ?? null,
  };
}

export type { Doctor };
