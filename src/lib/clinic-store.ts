import { useSyncExternalStore } from "react";
import { DOCTORS, SERVICES, CLINIC, type Doctor } from "@/lib/clinic-data";
import { sanitizeEmail, sanitizePhone, sanitizeWhatsapp } from "@/lib/sanitize";
import { api } from "@/lib/api";

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

type Listener = () => void;

function seed(): Store {
  return {
    requests: [],
    doctors: DOCTORS,
    services: SERVICES,
    products: [],
    orders: [],
    reviews: [],
    payments: [],
    settings: { ...CLINIC },
    workSession: null,
    auditLogs: [],
    workDays: [],
    workDay: null,
  };
}

let state: Store = seed();
const listeners = new Set<Listener>();

/**
 * What the server rendered. `useSyncExternalStore` uses this for SSR output
 * and for the client's hydration pass, so the two always agree even if data
 * arrives from the backend while hydration is still in progress.
 */
const serverSnapshot: Store = seed();

function emit() {
  for (const l of listeners) l();
}

function set(mutator: (prev: Store) => Store) {
  state = mutator(state);
  emit();
}

function getSnapshot(): Store {
  return state;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useClinicStore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}

/** Refreshes all clinic data from the backend (no-op while one is in flight). */
export function refreshClinicData() {
  return ensureLoaded();
}

async function loadAll() {
  let failed = false;
  const markFailed = () => {
    failed = true;
    return [] as never[];
  };
  try {
    const [
      bookings,
      doctors,
      services,
      products,
      orders,
      reviews,
      payments,
      settings,
      workSession,
      auditLogs,
    ] = await Promise.all([
      api.get<BookingRequest[]>("/bookings").catch(markFailed),
      api.get<Doctor[]>("/doctors").catch(markFailed),
      api.get<ServiceItem[]>("/services").catch(markFailed),
      api.get<Product[]>("/products").catch(markFailed),
      api.get<Order[]>("/orders").catch(markFailed),
      api.get<Review[]>("/reviews").catch(markFailed),
      api.get<Payment[]>("/payments").catch(markFailed),
      api.get<Partial<ClinicSettings>>("/settings").catch(() => ({}) as Partial<ClinicSettings>),
      api.get<WorkSession | null>("/work-session").catch(() => null),
      api.get<AuditLog[]>("/audit-logs").catch(() => [] as AuditLog[]),
    ]);
    set((prev) => ({
      ...prev,
      requests: Array.isArray(bookings) ? (bookings as BookingRequest[]) : prev.requests,
      doctors: Array.isArray(doctors) && doctors.length ? (doctors as Doctor[]) : prev.doctors,
      services:
        Array.isArray(services) && services.length ? (services as ServiceItem[]) : prev.services,
      products: Array.isArray(products) ? (products as Product[]) : prev.products,
      orders: Array.isArray(orders) ? (orders as Order[]) : prev.orders,
      reviews: Array.isArray(reviews) ? (reviews as Review[]) : prev.reviews,
      payments: Array.isArray(payments) ? (payments as Payment[]) : prev.payments,
      settings: { ...prev.settings, ...(settings as Partial<ClinicSettings>) },
      workSession: workSession ?? prev.workSession,
      auditLogs: Array.isArray(auditLogs) ? (auditLogs as AuditLog[]) : prev.auditLogs,
    }));
    lastLoadFailed = failed;
  } catch (err) {
    lastLoadFailed = true;
    console.error("Failed to load clinic data from backend", err);
  }
}

let loadPromise: Promise<void> | null = null;
let hasLoadedOnce = false;
let lastLoadFailed = false;

/**
 * Loads clinic data from the backend. A successful load is cached for the
 * session; a FAILED load (backend briefly unreachable, e.g. during startup)
 * is retried on the next call so the site never gets stuck with empty data.
 */
function ensureLoaded() {
  if (!loadPromise && (!hasLoadedOnce || lastLoadFailed)) {
    hasLoadedOnce = true;
    loadPromise = loadAll().finally(() => {
      loadPromise = null;
    });
  }
  return loadPromise ?? Promise.resolve();
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function addBookingRequest(
  input: Omit<BookingRequest, "id" | "status" | "createdAt">,
) {
  await ensureLoaded();
  try {
    const created = await api.post<BookingRequest>("/bookings", {
      ...input,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    set((s) => ({
      ...s,
      requests: [created, ...s.requests],
    }));
  } catch (err) {
    console.error("Failed to add booking", err);
    throw err;
  }
  return getSnapshot();
}

export async function setBookingStatus(id: string, status: Status) {
  await ensureLoaded();
  try {
    const updated = await api.patch<BookingRequest>(`/bookings/${id}/status`, { status });
    set((s) => ({
      ...s,
      requests: s.requests.map((r) => (r.id === id ? updated : r)),
    }));
  } catch (err) {
    console.error("Failed to update booking status", err);
    throw err;
  }
}

export async function deleteRequest(id: string) {
  await ensureLoaded();
  try {
    await api.delete(`/bookings/${id}`);
    set((s) => ({
      ...s,
      requests: s.requests.filter((r) => r.id !== id),
    }));
  } catch (err) {
    console.error("Failed to delete booking", err);
    throw err;
  }
}

export async function saveDoctor(doctor: Doctor) {
  await ensureLoaded();
  try {
    const exists = state.doctors.some((d) => d.id === doctor.id);
    const saved = exists
      ? await api.patch<Doctor>(`/doctors/${doctor.id}`, doctor)
      : await api.post<Doctor>("/doctors", doctor);
    set((s) => ({
      ...s,
      doctors: exists
        ? s.doctors.map((d) => (d.id === doctor.id ? saved : d))
        : [saved, ...s.doctors],
    }));
  } catch (err) {
    console.error("Failed to save doctor", err);
    throw err;
  }
}

export async function deleteDoctor(id: string) {
  await ensureLoaded();
  try {
    await api.delete(`/doctors/${id}`);
    set((s) => ({
      ...s,
      doctors: s.doctors.filter((d) => d.id !== id),
    }));
  } catch (err) {
    console.error("Failed to delete doctor", err);
    throw err;
  }
}

export async function saveService(service: ServiceItem) {
  await ensureLoaded();
  try {
    const exists = state.services.some((sv) => sv.slug === service.slug);
    const saved = exists
      ? await api.patch<ServiceItem>(`/services/${service.slug}`, service)
      : await api.post<ServiceItem>("/services", service);
    set((s) => ({
      ...s,
      services: exists
        ? s.services.map((sv) => (sv.slug === service.slug ? saved : sv))
        : [saved, ...s.services],
    }));
  } catch (err) {
    console.error("Failed to save service", err);
    throw err;
  }
}

export async function deleteService(slug: string) {
  await ensureLoaded();
  try {
    await api.delete(`/services/${slug}`);
    set((s) => ({
      ...s,
      services: s.services.filter((sv) => sv.slug !== slug),
    }));
  } catch (err) {
    console.error("Failed to delete service", err);
    throw err;
  }
}

export async function saveProduct(product: Product) {
  await ensureLoaded();
  try {
    const exists = state.products.some((p) => p.id === product.id);
    const saved = exists
      ? await api.patch<Product>(`/products/${product.id}`, product)
      : await api.post<Product>("/products", product);
    set((s) => ({
      ...s,
      products: exists
        ? s.products.map((p) => (p.id === product.id ? saved : p))
        : [saved, ...s.products],
    }));
  } catch (err) {
    console.error("Failed to save product", err);
    throw err;
  }
}

export async function deleteProduct(id: string) {
  await ensureLoaded();
  try {
    await api.delete(`/products/${id}`);
    set((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== id),
    }));
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
  await ensureLoaded();
  try {
    const created = await api.post<Order>("/orders", input);
    set((s) => ({
      ...s,
      orders: [created, ...s.orders],
    }));
    return created;
  } catch (err) {
    console.error("Failed to create order", err);
    throw err;
  }
}

export async function trackOrder(orderId: string, phone: string) {
  await ensureLoaded();
  return api.get<Order>(
    `/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`,
  );
}

export async function submitPaymentProof(
  id: string,
  proof: { paymentRef?: string | undefined; proofImage?: string | undefined },
) {
  await ensureLoaded();
  try {
    const updated = await api.post<Order>(`/orders/${id}/payment-proof`, proof);
    set((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? updated : o)),
    }));
    return updated;
  } catch (err) {
    console.error("Failed to submit payment proof", err);
    throw err;
  }
}

export async function setOrderPaymentStatus(id: string, paymentStatus: PaymentStatus) {
  await ensureLoaded();
  try {
    const updated = await api.patch<Order>(`/orders/${id}/payment`, { paymentStatus });
    set((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? updated : o)),
    }));
  } catch (err) {
    console.error("Failed to update order payment status", err);
    throw err;
  }
}

export async function createReview(input: {
  productId: string;
  author: string;
  rating: number;
  comment: string;
}) {
  await ensureLoaded();
  try {
    const created = await api.post<Review>("/reviews", input);
    set((s) => ({
      ...s,
      reviews: [created, ...s.reviews],
    }));
    return created;
  } catch (err) {
    console.error("Failed to create review", err);
    throw err;
  }
}

export async function setReviewStatus(id: string, status: "approved" | "rejected") {
  await ensureLoaded();
  try {
    const updated = await api.patch<Review>(`/reviews/${id}`, { status });
    set((s) => ({
      ...s,
      reviews: s.reviews.map((r) => (r.id === id ? updated : r)),
    }));
  } catch (err) {
    console.error("Failed to update review", err);
    throw err;
  }
}

export async function deleteReview(id: string) {
  await ensureLoaded();
  try {
    await api.delete(`/reviews/${id}`);
    set((s) => ({
      ...s,
      reviews: s.reviews.filter((r) => r.id !== id),
    }));
  } catch (err) {
    console.error("Failed to delete review", err);
    throw err;
  }
}

export async function syncGoogleReviews(
  placeId?: string,
): Promise<{ synced: number; total: number }> {
  await ensureLoaded();
  try {
    const data = await api.post<{ synced: number; total: number }>(
      "/google/sync-reviews",
      placeId ? { placeId } : undefined,
    );
    const reviews = await api.get<Review[]>("/reviews");
    set((s) => ({ ...s, reviews: Array.isArray(reviews) ? reviews : s.reviews }));
    return data;
  } catch (err) {
    console.error("Failed to sync Google reviews", err);
    throw err;
  }
}

export async function setOrderStatus(id: string, status: Status) {
  await ensureLoaded();
  try {
    const updated = await api.patch<Order>(`/orders/${id}/status`, { status });
    set((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? updated : o)),
    }));
  } catch (err) {
    console.error("Failed to update order status", err);
    throw err;
  }
}

export async function deleteOrder(id: string) {
  await ensureLoaded();
  try {
    await api.delete(`/orders/${id}`);
    set((s) => ({
      ...s,
      orders: s.orders.filter((o) => o.id !== id),
    }));
  } catch (err) {
    console.error("Failed to delete order", err);
    throw err;
  }
}

export async function archiveBooking(id: string, archived: boolean) {
  await ensureLoaded();
  try {
    const updated = await api.patch<BookingRequest>(`/bookings/${id}/archive`, { archived });
    set((s) => ({
      ...s,
      requests: s.requests.map((r) => (r.id === id ? updated : r)),
    }));
  } catch (err) {
    console.error("Failed to archive booking", err);
    throw err;
  }
}

export async function archiveOrder(id: string, archived: boolean) {
  await ensureLoaded();
  try {
    const updated = await api.patch<Order>(`/orders/${id}/archive`, { archived });
    set((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? updated : o)),
    }));
  } catch (err) {
    console.error("Failed to archive order", err);
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
  await ensureLoaded();
  try {
    const created = await api.post<Payment>("/payments", input);
    set((s) => ({
      ...s,
      payments: [created, ...s.payments],
    }));
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
  await ensureLoaded();
  try {
    const updated = await api.patch<Payment>(`/payments/${id}`, patch);
    set((s) => ({
      ...s,
      payments: s.payments.map((p) => (p.id === id ? updated : p)),
    }));
    return updated;
  } catch (err) {
    console.error("Failed to update payment", err);
    throw err;
  }
}

export async function deletePayment(id: string) {
  await ensureLoaded();
  try {
    await api.delete(`/payments/${id}`);
    set((s) => ({
      ...s,
      payments: s.payments.filter((p) => p.id !== id),
    }));
  } catch (err) {
    console.error("Failed to delete payment", err);
    throw err;
  }
}

export async function updateSettings(patch: Partial<ClinicSettings>) {
  await ensureLoaded();
  const clean: Partial<ClinicSettings> = { ...patch };
  if (patch.phone !== undefined) clean.phone = sanitizePhone(patch.phone);
  if (patch.emergency !== undefined) clean.emergency = sanitizePhone(patch.emergency);
  if (patch.whatsapp !== undefined) clean.whatsapp = sanitizeWhatsapp(patch.whatsapp);
  if (patch.email !== undefined) clean.email = sanitizeEmail(patch.email) ?? "";
  try {
    const updated = await api.patch<ClinicSettings>("/settings", clean);
    set((s) => ({ ...s, settings: { ...s.settings, ...updated } }));
  } catch (err) {
    console.error("Failed to update settings", err);
    throw err;
  }
}

export async function checkIn() {
  await ensureLoaded();
  try {
    const result = await api.post<{
      session: WorkSession;
      archived: { bookings: number; orders: number };
    }>("/work-session/check-in", {});
    set((s) => ({ ...s, workSession: result.session }));
    return result;
  } catch (err) {
    console.error("Failed to check in", err);
    throw err;
  }
}

export async function checkOut() {
  await ensureLoaded();
  try {
    const result = await api.post<{
      session: WorkSession;
      archived: { bookings: number; orders: number };
    }>("/work-session/check-out", {});
    set((s) => ({
      ...s,
      workSession: s.workSession?.id === result.session.id ? null : s.workSession,
    }));
    return result;
  } catch (err) {
    console.error("Failed to check out", err);
    throw err;
  }
}

export async function loadAuditLogs() {
  await ensureLoaded();
  try {
    const logs = await api.get<AuditLog[]>("/audit-logs");
    set((s) => ({ ...s, auditLogs: Array.isArray(logs) ? logs : s.auditLogs }));
    return logs;
  } catch (err) {
    console.error("Failed to load audit logs", err);
    throw err;
  }
}

export async function loadWorkDays() {
  await ensureLoaded();
  try {
    const days = await api.get<WorkDaySummary[]>("/work-days");
    set((s) => ({ ...s, workDays: Array.isArray(days) ? days : s.workDays }));
    return days;
  } catch (err) {
    console.error("Failed to load workday folders", err);
    throw err;
  }
}

export async function loadWorkDay(date: string) {
  await ensureLoaded();
  try {
    const day = await api.get<WorkDayDetail>(`/work-days/${date}`);
    set((s) => ({ ...s, workDay: day }));
    return day;
  } catch (err) {
    console.error("Failed to load workday folder", err);
    throw err;
  }
}

export async function resetAll() {
  await ensureLoaded();
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
    set((s) => ({
      ...s,
      requests: [],
      doctors: Array.isArray(doctors) && doctors.length ? doctors : fresh.doctors,
      services: Array.isArray(services) && services.length ? services : fresh.services,
      products: Array.isArray(products) ? products : fresh.products,
      orders: Array.isArray(orders) ? orders : fresh.orders,
      reviews: Array.isArray(reviews) ? reviews : fresh.reviews,
      payments: Array.isArray(payments) ? payments : fresh.payments,
      settings: { ...fresh.settings, ...(settings ?? {}) },
    }));
  } catch (err) {
    console.error("Failed to reset", err);
    throw err;
  }
}

export function get() {
  return state;
}

export type { Doctor };
