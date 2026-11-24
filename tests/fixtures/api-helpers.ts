import { test as base, type Page, type APIRequestContext } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

interface TestUser {
  username: string;
  password: string;
  role: 'staff' | 'payroll' | 'admin';
  token?: string;
}

const TEST_USERS: TestUser[] = [
  { username: 'technical-support', password: 'TS@pawm2026', role: 'admin' },
  { username: 'test-staff', password: 'TestPass123!', role: 'staff' },
  { username: 'test-payroll', password: 'TestPass123!', role: 'payroll' },
];

async function apiRequest(request: APIRequestContext, method: string, path: string, data?: unknown, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return request.fetch(`${API_BASE_URL}${path}`, { method, headers, data: data ? JSON.stringify(data) : undefined });
}

export async function ensureTestUsers(request: APIRequestContext): Promise<TestUser[]> {
  const results: TestUser[] = [];

  for (const user of TEST_USERS) {
    // Try to login first
    const loginRes = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { username: user.username, password: user.password },
    });

    if (loginRes.ok()) {
      const body = await loginRes.json();
      results.push({ ...user, token: body.token });
      continue;
    }

    // Create user via credentials endpoint (requires admin)
    // For now, we'll try to register or use existing
    // The backend may not have a registration endpoint for staff
    // So we'll rely on the login working if users exist
    console.log(`User ${user.username} not found, will need to be created manually or via seed`);
  }

  return results;
}

export async function loginUser(request: APIRequestContext, username: string, password: string): Promise<string | null> {
  const res = await request.post(`${API_BASE_URL}/auth/login`, {
    data: { username, password },
  });

  if (!res.ok()) return null;
  const body = await res.json();
  return body.token || null;
}

export async function createTestBooking(request: APIRequestContext, token: string, overrides: Record<string, unknown> = {}) {
  const today = new Date().toISOString().split('T')[0];
  const booking = {
    ownerName: `Test Owner ${Date.now()}`,
    phone: '+201234567890',
    email: 'test@example.com',
    petName: `Test Pet ${Date.now()}`,
    animalType: 'dog',
    age: '2',
    weight: '10',
    symptoms: 'Test symptoms',
    allergies: '',
    medications: '',
    doctorId: 'doctor-1',
    doctorName: 'Dr. Test',
    date: today,
    time: '10:00',
    emergency: false,
    ...overrides,
  };

  const res = await apiRequest(request, 'POST', '/bookings', booking, token);
  if (!res.ok()) {
    const err = await res.text();
    throw new Error(`Failed to create booking: ${err}`);
  }
  return res.json();
}

export async function deleteTestBooking(request: APIRequestContext, token: string, id: string) {
  const res = await apiRequest(request, 'DELETE', `/bookings/${id}`, undefined, token);
  return res.ok();
}

export async function setBookingStatus(request: APIRequestContext, token: string, id: string, status: string) {
  const res = await apiRequest(request, 'PATCH', `/bookings/${id}/status`, { status }, token);
  return res.ok();
}

export async function createTestClient(request: APIRequestContext, token: string, overrides: Record<string, unknown> = {}) {
  const client = {
    fullName: `Test Client ${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    phone: '+201234567890',
    type: 'clinic',
    ...overrides,
  };

  const res = await apiRequest(request, 'POST', '/clients', client, token);
  if (!res.ok()) {
    const err = await res.text();
    throw new Error(`Failed to create client: ${err}`);
  }
  return res.json();
}

export async function deleteTestClient(request: APIRequestContext, token: string, id: string) {
  const res = await apiRequest(request, 'DELETE', `/clients/${id}`, undefined, token);
  return res.ok();
}

export async function createTestProduct(request: APIRequestContext, token: string, overrides: Record<string, unknown> = {}) {
  const product = {
    name: `Test Product ${Date.now()}`,
    description: 'Test product description',
    price: 100,
    image: '',
    category: 'medication',
    stock: 10,
    featured: false,
    ...overrides,
  };

  const res = await apiRequest(request, 'POST', '/products', product, token);
  if (!res.ok()) {
    const err = await res.text();
    throw new Error(`Failed to create product: ${err}`);
  }
  return res.json();
}

export async function createTestOrder(request: APIRequestContext, token: string, overrides: Record<string, unknown> = {}) {
  const order = {
    customerName: `Test Customer ${Date.now()}`,
    phone: '+201234567890',
    email: 'test@example.com',
    address: 'Test Address',
    items: [{ id: 'item-1', name: 'Test Item', price: 50, qty: 2 }],
    total: 100,
    paymentMethod: 'cash',
    paymentRef: '',
    proofImage: '',
    source: 'pos',
    ...overrides,
  };

  const res = await apiRequest(request, 'POST', '/orders', order, token);
  if (!res.ok()) {
    const err = await res.text();
    throw new Error(`Failed to create order: ${err}`);
  }
  return res.json();
}

export { TEST_USERS };