import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:5173";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001/api";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "test-results.json" }],
    ["junit", { outputFile: "test-results.xml" }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  expect: {
    toHaveScreenshot: { maxDiffPixels: 100 },
  },
  globalSetup: "./tests/global-setup.ts",
  globalTeardown: "./tests/global-teardown.ts",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@tests": path.resolve(__dirname, "tests"),
    },
  },
  projects: [
    {
      name: "staff",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/.auth/staff.json",
      },
    },
    {
      name: "payroll",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/.auth/payroll.json",
      },
    },
    {
      name: "admin",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/.auth/admin.json",
      },
    },
    {
      name: "mobile-staff",
      use: {
        ...devices["iPhone 13"],
        storageState: "tests/.auth/staff.json",
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      VITE_API_URL: API_BASE_URL,
    },
  },
  outputDir: "test-results/",
});
