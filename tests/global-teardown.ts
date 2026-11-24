import { type FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

async function apiRequest(method: string, path: string, token: string, data?: unknown) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const res = await fetch(`${API_BASE_URL}${path}`, { method, headers, body: data ? JSON.stringify(data) : undefined });
  return { ok: res.ok, json: () => res.json(), text: () => res.text() };
}

async function getAdminToken(): Promise<string | null> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'test-admin', password: 'TestPass123!' }),
  });
  if (!res.ok) return null;
  const body = await res.json();
  return body.token || null;
}

async function cleanupTestData(token: string) {
  console.log('🧹 Cleaning up test data...');

  // Clean up test bookings
  try {
    const bookingsRes = await apiRequest('GET', '/bookings?limit=200', token);
    if (bookingsRes.ok) {
      const { data: bookings } = await bookingsRes.json();
      const testBookings = bookings.filter((b: any) => 
        b.ownerName?.startsWith('Test Owner') || b.petName?.startsWith('Test Pet')
      );
      for (const booking of testBookings) {
        await apiRequest('DELETE', `/bookings/${booking.id}`, token);
      }
      console.log(`  ✓ Deleted ${testBookings.length} test bookings`);
    }
  } catch (e) {
    console.log('  ⚠ Failed to clean bookings:', e);
  }

  // Clean up test orders
  try {
    const ordersRes = await apiRequest('GET', '/orders?limit=200', token);
    if (ordersRes.ok) {
      const { data: orders } = await ordersRes.json();
      const testOrders = orders.filter((o: any) => o.customerName?.startsWith('Test Customer'));
      for (const order of testOrders) {
        await apiRequest('DELETE', `/orders/${order.id}`, token);
      }
      console.log(`  ✓ Deleted ${testOrders.length} test orders`);
    }
  } catch (e) {
    console.log('  ⚠ Failed to clean orders:', e);
  }

  // Clean up test payments
  try {
    const paymentsRes = await apiRequest('GET', '/payments?limit=200', token);
    if (paymentsRes.ok) {
      const { data: payments } = await paymentsRes.json();
      const testPayments = payments.filter((p: any) => p.title?.includes('Test'));
      for (const payment of testPayments) {
        await apiRequest('DELETE', `/payments/${payment.id}`, token);
      }
      console.log(`  ✓ Deleted ${testPayments.length} test payments`);
    }
  } catch (e) {
    console.log('  ⚠ Failed to clean payments:', e);
  }

  // Clean up test clients
  try {
    const clientsRes = await apiRequest('GET', '/clients?limit=200', token);
    if (clientsRes.ok) {
      const { data: clients } = await clientsRes.json();
      const testClients = clients.filter((c: any) => c.fullName?.startsWith('Test Client'));
      for (const client of testClients) {
        await apiRequest('DELETE', `/clients/${client.id}`, token);
      }
      console.log(`  ✓ Deleted ${testClients.length} test clients`);
    }
  } catch (e) {
    console.log('  ⚠ Failed to clean clients:', e);
  }

  // Clean up test products
  try {
    const productsRes = await apiRequest('GET', '/products?limit=200', token);
    if (productsRes.ok) {
      const { data: products } = await productsRes.json();
      const testProducts = products.filter((p: any) => p.name?.startsWith('Test Product'));
      for (const product of testProducts) {
        await apiRequest('DELETE', `/products/${product.id}`, token);
      }
      console.log(`  ✓ Deleted ${testProducts.length} test products`);
    }
  } catch (e) {
    console.log('  ⚠ Failed to clean products:', e);
  }
}

export default async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');

  // Only run cleanup if not in CI (to preserve test artifacts for debugging)
  if (process.env.CI) {
    console.log('ℹ Skipping cleanup in CI to preserve test artifacts');
    return;
  }

  const token = await getAdminToken();
  if (!token) {
    console.log('⚠ Could not get admin token, skipping cleanup');
    return;
  }

  await cleanupTestData(token);

  console.log('✅ Global teardown complete');
}