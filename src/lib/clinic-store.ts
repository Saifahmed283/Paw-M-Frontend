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

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

// All three methods are offered at checkout. Fawry and InstaPay settle through
// submitted payment proof; cash is confirmed at the counter.
export type PaymentMethod = "cash" | "fawry" | "instapay";
export type PaymentStatus = "unpaid" | "proof_submitted" | "under_review" | "rejected" | "paid";

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

export type PaymentKind = "order" | "visit" | "manual" | "refund";
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
  status: PaymentStatus;
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

/** Start-of-shift cash custody & handover declaration for the open shift. */
export type CashCustody = {
  id: string;
  workSessionId: string;
  employeeId: string;
  date: string;
  hasDrawer: boolean;
  openingAmount: number;
  note: string;
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
  workSessionLoading: boolean;
  cashCustody: CashCustody | null;
  cashCustodyLoading: boolean;
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
  cashCustody: ["cash-custody"] as const,
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
    workSessionLoading: false,
    cashCustody: null,
    cashCustodyLoading: false,
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

/** Orders and their Payment rows are kept in sync, so refresh both together. */
export function invalidateFinance() {
  invalidate(QUERY_KEYS.orders);
  invalidate(QUERY_KEYS.payments);
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

export async function fetchAllPayments() {
  const payments: Payment[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    const result = await api.getPage<Payment>(`/payments?limit=200&page=${page}`);
    payments.push(...result.data);
    pageCount = Math.max(1, result.pagination.pages);
    page += 1;
  } while (page <= pageCount);

  return payments;
}

export async function fetchAllOrders() {
  const orders: Order[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    const result = await api.getPage<Order>(`/orders?limit=200&page=${page}`);
    orders.push(...result.data);
    pageCount = Math.max(1, result.pagination.pages);
    page += 1;
  } while (page <= pageCount);

  return orders;
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
    queryFn: () => api.get<Doctor[]>("/doctors?limit=200"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.doctors,
    enabled: mounted,
  });

  const { data: services = seedDefaults.services } = useQuery({
    queryKey: QUERY_KEYS.services,
    queryFn: () => api.get<ServiceItem[]>("/services?limit=200"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.services,
    enabled: mounted,
  });

  const {
    data: products = seedDefaults.products,
    isError: productsFailed,
    error: productsError,
  } = useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: fetchAllProducts,
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.products,
    enabled: mounted,
  });

  const { data: requests = seedDefaults.requests } = useQuery({
    queryKey: QUERY_KEYS.bookings,
    queryFn: () => api.get<BookingRequest[]>("/bookings?limit=200"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.requests,
    enabled: mounted && isAuthed(),
  });

  const { data: orders = seedDefaults.orders } = useQuery({
    queryKey: QUERY_KEYS.orders,
    queryFn: fetchAllOrders,
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.orders,
    enabled: mounted && isAuthed(),
  });

  const { data: reviews = seedDefaults.reviews } = useQuery({
    queryKey: QUERY_KEYS.reviews,
    queryFn: () => api.get<Review[]>("/reviews?limit=200"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.reviews,
    enabled: mounted,
  });

  const { data: payments = seedDefaults.payments } = useQuery({
    queryKey: QUERY_KEYS.payments,
    queryFn: fetchAllPayments,
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

  const { data: workSession = null, isLoading: workSessionLoading } = useQuery({
    queryKey: QUERY_KEYS.workSession,
    queryFn: () => api.get<WorkSession | null>("/work-session"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? null,
    enabled: mounted && isAuthed(),
  });

  const { data: cashCustody = null, isLoading: cashCustodyLoading } = useQuery({
    queryKey: QUERY_KEYS.cashCustody,
    queryFn: () => api.get<CashCustody | null>("/work-session/custody"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? null,
    enabled: mounted && isAuthed(),
  });

  const { data: auditLogs = seedDefaults.auditLogs } = useQuery({
    queryKey: QUERY_KEYS.auditLogs,
    queryFn: () => api.get<AuditLog[]>("/audit-logs?limit=200"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.auditLogs,
    enabled: mounted && isAuthed(),
  });

  const { data: workDays = seedDefaults.workDays } = useQuery({
    queryKey: QUERY_KEYS.workDays,
    queryFn: () => api.get<WorkDaySummary[]>("/work-days?limit=200"),
    staleTime: Infinity,
    placeholderData: (prev) => prev ?? seedDefaults.workDays,
    enabled: mounted && isAuthed(),
  });

  // This cache entry is populated explicitly by loadWorkDay(date) — the
  // backend only serves /work-days/:date (there is no /work-days/today route).
  const { data: workDay } = useQuery<WorkDayDetail | null>({
    queryKey: ["work-day"],
    queryFn: () => null,
    staleTime: Infinity,
    enabled: false,
  });

  // While the app is not yet mounted (the SSR/hydration phase), always expose
  // the seed defaults — never cache-fetched data, regardless of how fast any
  // fetch resolves or when the deferred refresh fires. This keeps the client's
  // first (hydration) render byte-identical to the server render so React never
  // sees a hydration mismatch on the public site data. After mount, flip to the
  // real data.
  const store = useMemo<Store>(() => {
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
      // While the hook is still mounting the session query has not started yet;
      // report loading so consumers never mistake "not fetched" for "no shift".
      workSessionLoading: !mounted || workSessionLoading,
      cashCustody: gated(cashCustody, null),
      cashCustodyLoading: !mounted || cashCustodyLoading,
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
    workSessionLoading,
    cashCustody,
    cashCustodyLoading,
    auditLogs,
    workDays,
    workDay,
  ]);

  // A failed products fetch must not be indistinguishable from an empty
  // catalogue: `products` falls back to an empty array, which previously made a
  // request error look exactly like every product having been deleted.
  return { ...store, productsFailed, productsError };
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
  invalidate(QUERY_KEYS.cashCustody);
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

// Product lists now expose stored base64 images as a generated endpoint URL, so
// the edit form receives that URL instead of the original data. Echoing it back
// on save would overwrite the stored image with a URL that points at itself, so
// it is omitted and PATCH leaves the existing image untouched.
const GENERATED_IMAGE_URL = /\/api\/products\/[^/]+\/image(?:[?#]|$)/;

function productPayload(product: ProductDraft) {
  const isGeneratedImage = GENERATED_IMAGE_URL.test(product.image);
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    ...(isGeneratedImage ? {} : { image: product.image }),
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
  /** POS cash sales are received at the counter and marked paid atomically. */
  cashReceived?: boolean | undefined;
  cashReceivedAmount?: number | undefined;
}) {
  try {
    const created = await api.post<Order>("/orders", input);
    invalidateFinance();
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
  proof: {
    paymentRef?: string | undefined;
    proofImage?: string | undefined;
    phone?: string | undefined;
  },
) {
  try {
    const updated = await api.post<Order>(`/orders/${id}/payment-proof`, proof);
    invalidateFinance();
    return updated;
  } catch (err) {
    console.error("Failed to submit payment proof", err);
    throw err;
  }
}

export async function setOrderPaymentStatus(
  id: string,
  paymentStatus: PaymentStatus,
  paymentMethod?: PaymentMethod,
) {
  try {
    await api.patch<Order>(`/orders/${id}/payment`, {
      paymentStatus,
      ...(paymentMethod ? { paymentMethod } : {}),
    });
    invalidateFinance();
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
  status?: PaymentStatus;
  date: string;
  notes?: string | undefined;
  orderId?: string | undefined;
  kind?: PaymentKind | undefined;
}) {
  try {
    const created = await api.post<Payment>("/payments", {
      ...input,
      kind: input.kind ?? "manual",
    });
    invalidateFinance();
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
    invalidateFinance();
    return updated;
  } catch (err) {
    console.error("Failed to update payment", err);
    throw err;
  }
}

export async function deletePayment(id: string) {
  try {
    await api.delete(`/payments/${id}`);
    invalidateFinance();
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
  status?: PaymentStatus | undefined;
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
    invalidateFinance();
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
    invalidateFinance();
    return updated;
  } catch (err) {
    console.error("Failed to add payment items", err);
    throw err;
  }
}

export async function settlePayment(id: string, input: { method: PaymentMethod; notes?: string }) {
  try {
    const updated = await api.post<Payment>(`/payments/${id}/settle`, input);
    invalidateFinance();
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
    // A new shift always needs a fresh custody declaration, even when the
    // check-in is triggered from the dashboard rather than the cashier.
    invalidate(QUERY_KEYS.cashCustody);
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
    invalidate(QUERY_KEYS.cashCustody);
    return result;
  } catch (err) {
    console.error("Failed to check out", err);
    throw err;
  }
}

/** Record the start-of-shift cash custody & handover declaration. */
export async function saveCashCustody(input: {
  hasDrawer: boolean;
  openingAmount: number;
  note?: string;
}): Promise<CashCustody> {
  try {
    const created = await api.post<CashCustody>("/work-session/custody", {
      hasDrawer: input.hasDrawer,
      openingAmount: input.hasDrawer ? Math.round(input.openingAmount * 100) / 100 : 0,
      ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    });
    invalidate(QUERY_KEYS.cashCustody);
    return created;
  } catch (err) {
    console.error("Failed to save cash custody", err);
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
    workSessionLoading: false,
    cashCustody: qc.getQueryData<CashCustody | null>(QUERY_KEYS.cashCustody) ?? null,
    cashCustodyLoading: false,
    auditLogs: qc.getQueryData<AuditLog[]>(QUERY_KEYS.auditLogs) ?? [],
    workDays: qc.getQueryData<WorkDaySummary[]>(QUERY_KEYS.workDays) ?? [],
    workDay: qc.getQueryData<WorkDayDetail>(["work-day"]) ?? null,
  };
}

export type { Doctor };
