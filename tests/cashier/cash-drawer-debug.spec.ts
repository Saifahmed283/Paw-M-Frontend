import fs from "node:fs";
import path from "node:path";
import { test, expect, type Page } from "@playwright/test";

async function signIn(page: Page) {
  const state = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "tests/.auth/admin.json"), "utf8")) as {
    cookies: { name: string; value: string }[];
  };
  const token = state.cookies.find((c) => c.name === "paw-m-session")?.value;
  if (!token) throw new Error("No token");
  await page.addInitScript(([t]) => {
    sessionStorage.setItem("paw-m:admin-session", JSON.stringify({
      username: "technical-support",
      role: "admin",
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      token: t,
    }));
  }, [token]);
}

test("debug drawer payload", async ({ page }) => {
  await signIn(page);
  const requests: unknown[] = [];
  await page.route("**/cash-drawer/close", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ id: "stub", date: "2026-11-24", expected: 830, counted: 830.5, variance: 0.5, countedBy: 8, note: "" }),
    });
  });
  await page.goto("/dashboard?tab=payment-verification");
  await expect(page.getByText("Cash drawer")).toBeVisible({ timeout: 15000 });
  const input = page.locator("#drawer-counted");
  await input.fill("830.50");
  await expect(input).toHaveValue("830.50");
  await page.locator("#drawer-note").fill("counted by debug");
  await page.getByRole("button", { name: "Close cash drawer" }).click();
  await expect.poll(() => requests.length).toBe(1);
  console.log("DRAWER REQUEST PAYLOAD:", JSON.stringify(requests[0]));
});
