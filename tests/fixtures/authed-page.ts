/* eslint-disable react-hooks/rules-of-hooks */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test as base, type Page } from "@playwright/test";

const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001/api";

/**
 * Playwright storageState cannot persist sessionStorage, but the SPA keeps its
 * staff session there. Global setup writes a readable cookie containing the
 * token; this fixture copies it into sessionStorage before the app boots.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Long E2E runs exceed the dev API's per-IP budget. Tag browser traffic so
    // the backend can exempt it from throttling outside production.
    await page.setExtraHTTPHeaders({ "x-pawm-e2e": "1" });
    await page.addInitScript({
      path: path.resolve(fixtureDir, "../seed-session.js"),
    });
    await use(page);
  },
});

/** Wait for the authenticated dashboard shell (works on desktop and mobile). */
export async function waitForDashboard(page: Page) {
  await page.locator('[data-testid="shift-banner"]').waitFor({ state: "visible" });
}

/** Navigate straight to a dashboard tab — the URL is the source of truth. */
export async function openDashboardTab(page: Page, tab: string) {
  await page.goto(`/dashboard?tab=${tab}`);
  await waitForDashboard(page);
}

/** Click a sidebar tab, opening the mobile sheet first when needed. */
export async function clickDashboardTab(page: Page, tabId: string) {
  await waitForDashboard(page);
  const nav = page.getByTestId(`nav-${tabId}`);
  const menu = page.getByRole("button", { name: /open menu/i });

  // On small viewports the rail lives in a Radix sheet. Selecting a tab closes
  // the sheet immediately, so Playwright's normal click can see the button
  // detach mid-action and retry forever. A DOM click is synchronous and avoids
  // that race while still exercising the same React onClick handler.
  if (await menu.isVisible().catch(() => false)) {
    await menu.click();
    await nav.waitFor({ state: "visible" });
    await nav.evaluate((el) => (el as HTMLElement).click());
    return;
  }
  await nav.click();
}

/** Start each shift test from a known checked-out state. */
export async function resetWorkSession(page: Page) {
  await page.request
    .post(`${API_BASE_URL}/work-session/check-out`, {
      headers: { "x-pawm-e2e": "1" },
    })
    .catch(() => undefined);
}
