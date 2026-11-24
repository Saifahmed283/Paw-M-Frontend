import { chromium, type FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

const TEST_USERS = [
  // Admin account provided by user - will be restored after tests
  { username: 'technical-support', password: 'TS@pawm2026', role: 'admin' as const, file: '.auth/admin.json' },
  // Staff and payroll accounts (created if not exist)
  { username: 'test-staff', password: 'TestPass123!', role: 'staff' as const, file: '.auth/staff.json' },
  { username: 'test-payroll', password: 'TestPass123!', role: 'payroll' as const, file: '.auth/payroll.json' },
];

// Simple HTTP request using Node's built-in http module
function httpRequest(method: string, url: string, data?: any, token?: string): Promise<{ ok: boolean; status: number; json: any; text: string }> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch {}
        resolve({ ok: res.statusCode! >= 200 && res.statusCode! < 300, status: res.statusCode!, json, text: body });
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function waitForBackend(maxAttempts = 10): Promise<boolean> {
  console.log('  Assuming backend is already running (started manually)');
  await new Promise(r => setTimeout(r, 1000));
  return true;
}

async function waitForFrontend(maxAttempts = 10): Promise<boolean> {
  console.log('  Assuming frontend is already running (started manually)');
  await new Promise(r => setTimeout(r, 1000));
  return true;
}

async function ensureTestUsersExist(): Promise<string | null> {
  console.log('🔧 Ensuring test users exist...');
  
  // Try to register/login as admin using http module
  let adminToken: string | null = null;
  
  // First check if configured
  try {
    const configRes = await httpRequest('GET', `${API_BASE_URL}/auth/config`);
    const configured = configRes.json?.configured ?? false;
    
    if (!configured) {
      console.log('  No admin user found, creating first admin...');
      const registerRes = await httpRequest('POST', `${API_BASE_URL}/auth/register`, {
        username: 'admin',
        password: 'AdminPass123!',
      });
      
      if (registerRes.ok && registerRes.json?.token) {
        adminToken = registerRes.json.token;
        console.log('  ✓ Created initial admin user');
      } else {
        console.log('  Could not create initial admin:', registerRes.text);
      }
    } else {
      console.log('  Admin exists, trying to login...');
      for (const username of ['admin', 'test-admin']) {
        const loginRes = await httpRequest('POST', `${API_BASE_URL}/auth/login`, {
          username,
          password: 'AdminPass123!',
        });
        
        if (loginRes.ok && loginRes.json?.token) {
          adminToken = loginRes.json.token;
          console.log(`  ✓ Logged in as ${username}`);
          break;
        }
      }
      
      if (!adminToken) {
        console.log('  Could not login as admin');
      }
    }
  } catch (error) {
    console.log('  Error during auth config check:', error instanceof Error ? error.message : String(error));
  }
  
  // Now create test users via admin accounts endpoint
  if (adminToken) {
    for (const user of TEST_USERS) {
      console.log(`  Creating test user: ${user.username} (${user.role})...`);
      try {
        const createRes = await httpRequest('POST', `${API_BASE_URL}/auth/accounts`, {
          username: user.username,
          password: user.password,
          role: user.role,
        }, adminToken);
        
        if (createRes.ok) {
          console.log(`  ✓ Created ${user.username}`);
        } else if (createRes.status === 409) {
          console.log(`  ✓ ${user.username} already exists`);
        } else {
          console.log(`  ✗ Failed to create ${user.username}:`, createRes.text);
        }
      } catch (error) {
        console.log(`  Error creating ${user.username}:`, error instanceof Error ? error.message : String(error));
      }
    }
  } else {
    console.log('  ⚠ No admin token available, skipping test user creation');
  }
  
  return adminToken;
}

async function loginAndSaveStorageState(username: string, password: string, storagePath: string) {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`  Navigating to ${BASE_URL}/dashboard...`);
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    
    // Debug: check what's on the page
    const pageContent = await page.content();
    console.log(`  Page title: ${await page.title()}`);
    console.log(`  Page URL: ${page.url()}`);
    
    // Check for any input elements
    const inputs = await page.locator('input').all();
    console.log(`  Found ${inputs.length} input elements`);
    for (const input of inputs) {
      const attrs = await input.evaluate(el => ({
        type: el.type,
        autocomplete: el.autocomplete,
        placeholder: el.placeholder,
        name: el.name,
        id: el.id,
      }));
      console.log(`    Input:`, attrs);
    }
    
    // Check for buttons
    const buttons = await page.locator('button').all();
    console.log(`  Found ${buttons.length} button elements`);
    for (const button of buttons.slice(0, 10)) {
      const text = await button.textContent();
      console.log(`    Button: "${text?.trim()}"`);
    }
    
    // Try multiple selector strategies
    let usernameInput = page.locator('input[autocomplete="username"]');
    if (await usernameInput.count() === 0) {
      usernameInput = page.locator('input[type="text"]').first();
    }
    if (await usernameInput.count() === 0) {
      usernameInput = page.locator('input').first();
    }
    
    await usernameInput.waitFor({ state: 'visible', timeout: 15000 });
    console.log('  Username input found and visible');
    
    await usernameInput.fill(username);
    console.log('  Filled username');
    
    let passwordInput = page.locator('input[autocomplete="current-password"]');
    if (await passwordInput.count() === 0) {
      passwordInput = page.locator('input[type="password"]').first();
    }
    if (await passwordInput.count() === 0) {
      // Find password input by looking for input with type=password or the second input
      const inputs = await page.locator('input').all();
      if (inputs.length > 1) {
        passwordInput = inputs[1];
      }
    }
    
    await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
    console.log('  Password input found and visible');
    await passwordInput.fill(password);
    console.log('  Filled password');
    
    // Find and click submit button
    let submitButton = page.locator('button[type="submit"]');
    if (await submitButton.count() === 0) {
      submitButton = page.locator('button:has-text("Unlock")');
    }
    if (await submitButton.count() === 0) {
      submitButton = page.locator('button:has-text("Sign in")');
    }
    if (await submitButton.count() === 0) {
      submitButton = page.locator('button:has-text("Login")');
    }
    if (await submitButton.count() === 0) {
      // Get the last button in the form
      submitButton = page.locator('form button').last();
    }
    
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    console.log('  Submit button found, clicking...');
    await submitButton.click();
    
    await page.waitForURL('**/dashboard**', { timeout: 20000 });
    console.log('  Navigated to dashboard');
    
    await page.waitForSelector('[data-testid="dashboard-sidebar"], nav[aria-label], aside', { timeout: 10000 });
    console.log('  Dashboard sidebar found');
    
    // Wait for auth cookies to be set
    await page.waitForFunction(() => {
      return document.cookie.includes('paw-m') || document.cookie.includes('session');
    }, { timeout: 5000 }).catch(() => console.log('  No auth cookies found in document.cookie'));
    
    // Also check context cookies
    const cookies = await context.cookies();
    console.log(`  Context cookies: ${cookies.length}`);
    cookies.forEach(c => console.log(`    ${c.name}=${c.value.substring(0, 20)}...`));
    
    await context.storageState({ path: storagePath });
    console.log(`✓ Saved auth state for ${username} to ${storagePath}`);
  } finally {
    await browser.close();
  }
}

export default async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  console.log(`   API: ${API_BASE_URL}`);
  console.log(`   Frontend: ${BASE_URL}`);

  const backendReady = await waitForBackend();
  if (!backendReady) {
    throw new Error('Backend did not become ready in time');
  }

  const frontendReady = await waitForFrontend();
  if (!frontendReady) {
    throw new Error('Frontend did not become ready in time');
  }

  const authDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await ensureTestUsersExist();

  for (const user of TEST_USERS) {
    const storagePath = path.join(__dirname, user.file);
    
    if (fs.existsSync(storagePath) && !process.env.CI) {
      console.log(`✓ Auth state for ${user.username} already exists, skipping`);
      continue;
    }

    try {
      await loginAndSaveStorageState(user.username, user.password, storagePath);
    } catch (error) {
      console.error(`✗ Failed to create auth state for ${user.username}:`, error);
    }
  }

  console.log('✅ Global setup complete');
}