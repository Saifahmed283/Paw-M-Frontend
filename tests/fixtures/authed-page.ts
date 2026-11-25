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
  const expectedUrl = new RegExp(`[?&]tab=${tabId}(?:&|$)`);

  // The mobile hook can flip from desktop to sheet after the banner mounts, so
  // wait for either entry point before deciding which one to use.
  await menu.or(nav).first().waitFor({ state: "visible" });

  // On small viewports the rail lives in a Radix sheet. Selecting a tab closes
  // the sheet immediately, so Playwright's normal click can see the button
  // detach mid-action and retry forever. A DOM click is synchronous and avoids
  // that race while still exercising the same React onClick handler.
  for (let attempt = 0; attempt < 2; attempt++) {
    if (await nav.isVisible().catch(() => false)) {
      await nav.evaluate((el) => (el as HTMLElement).click());
    } else {
      await menu.click();
      await nav.waitFor({ state: "visible" });
      await nav.evaluate((el) => (el as HTMLElement).click());
    }

    try {
      await page.waitForURL(expectedUrl, { timeout: 3000 });
      return;
    } catch {
      // A transient re-render can swallow the click; reopen the sheet and retry.
    }
  }

  throw new Error(`Clicking dashboard tab ${tabId} did not update the URL`);
}

/** Start each shift test from a known checked-out state. */
export async function resetWorkSession(page: Page) {
  // The cookie alone is rejected by the API's CSRF guard on POSTs. Use the
  // readable test-session cookie to send the same Bearer token the UI uses.
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((cookie) => cookie.name === "paw-m-test-session");
  let token: string | undefined;
  try {
    if (sessionCookie) {
      token = JSON.parse(decodeURIComponent(sessionCookie.value)).token;
    }
  } catch {
    // A malformed fixture cookie must not break the reset; the app will fail auth.
  }
  const headers: Record<string, string> = { "x-pawm-e2e": "1" };
  if (token) headers.Authorization = `Bearer ${token}`;

  await page.request
    .post(`${API_BASE_URL}/work-session/check-out`, { headers })
    .catch(() => undefined);
}
