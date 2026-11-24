import { test as base, type Page, type APIRequestContext } from '@playwright/test';
import { 
  createTestBooking, 
  deleteTestBooking, 
  setBookingStatus,
  createTestClient,
  deleteTestClient,
  createTestProduct,
  createTestOrder,
  loginUser,
  TEST_USERS 
} from './api-helpers';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

interface TestFixtures {
  adminToken: string;
  staffToken: string;
  payrollToken: string;
  testBooking: { id: string; [key: string]: any } | null;
  testClient: { id: string; [key: string]: any } | null;
  testProduct: { id: string; [key: string]: any } | null;
  testOrder: { id: string; [key: string]: any } | null;
}

export const test = base.extend<TestFixtures>({
  // Get auth tokens for all roles
  adminToken: async ({ request }, use) => {
    const token = await loginUser(request, 'technical-support', 'TS@pawm2026');
    await use(token || '');
  },
  
  staffToken: async ({ request }, use) => {
    const token = await loginUser(request, 'test-staff', 'TestPass123!');
    await use(token || '');
  },
  
  payrollToken: async ({ request }, use) => {
    const token = await loginUser(request, 'test-payroll', 'TestPass123!');
    await use(token || '');
  },

  // Create a test booking for each test
  testBooking: async ({ adminToken }, use) => {
    if (!adminToken) {
      await use(null);
      return;
    }
    
    const request = await (global as any).playwrightRequest?.fetch?.(API_BASE_URL) 
      || (await import('@playwright/test')).request;
    
    // Create a fresh request context
    const apiRequest = await (await import('@playwright/test')).request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: { 'Authorization': `Bearer ${adminToken}` },
    });
    
    let booking = null;
    try {
      booking = await createTestBooking(apiRequest, adminToken, { status: 'pending' });
      await use(booking);
    } finally {
      if (booking?.id) {
        await deleteTestBooking(apiRequest, adminToken, booking.id);
      }
      await apiRequest.dispose();
    }
  },

  // Create a test client
  testClient: async ({ adminToken }, use) => {
    if (!adminToken) {
      await use(null);
      return;
    }
    
    const apiRequest = await (await import('@playwright/test')).request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: { 'Authorization': `Bearer ${adminToken}` },
    });
    
    let client = null;
    try {
      client = await createTestClient(apiRequest, adminToken);
      await use(client);
    } finally {
      if (client?.id) {
        await deleteTestClient(apiRequest, adminToken, client.id);
      }
      await apiRequest.dispose();
    }
  },

  // Create a test product
  testProduct: async ({ adminToken }, use) => {
    if (!adminToken) {
      await use(null);
      return;
    }
    
    const apiRequest = await (await import('@playwright/test')).request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: { 'Authorization': `Bearer ${adminToken}` },
    });
    
    let product = null;
    try {
      product = await createTestProduct(apiRequest, adminToken);
      await use(product);
    } finally {
      if (product?.id) {
        await apiRequest.delete(`/products/${product.id}`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
      }
      await apiRequest.dispose();
    }
  },

  // Create a test order
  testOrder: async ({ adminToken }, use) => {
    if (!adminToken) {
      await use(null);
      return;
    }
    
    const apiRequest = await (await import('@playwright/test')).request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: { 'Authorization': `Bearer ${adminToken}` },
    });
    
    let order = null;
    try {
      order = await createTestOrder(apiRequest, adminToken);
      await use(order);
    } finally {
      if (order?.id) {
        await apiRequest.delete(`/orders/${order.id}`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
      }
      await apiRequest.dispose();
    }
  },
});

// Helper to create API request context with auth
export async function createApiRequest(token: string): Promise<APIRequestContext> {
  const { request } = await import('@playwright/test');
  return request.newContext({
    baseURL: API_BASE_URL,
    extraHTTPHeaders: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
  });
}

export { TEST_USERS };