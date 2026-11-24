# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cashier\settle-bill.spec.ts >> Settle bill opens the verification queue from the cashier
- Location: tests\cashier\settle-bill.spec.ts:34:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('table').first().locator('tbody tr').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('table').first().locator('tbody tr').first() with timeout 15000ms
  - waiting for getByRole('table').first().locator('tbody tr').first()

```

```yaml
- main:
  - complementary:
    - img "Paw-M"
    - paragraph: Paw-M
    - paragraph: Staff Console
    - navigation "Mobile":
      - paragraph: Main
      - button "Overview"
      - button "Requests"
      - button "Reservations"
      - paragraph: Clinic
      - button "Doctors"
      - button "Services"
      - button "Prescriptions"
      - paragraph: Store
      - button "Products"
      - button "Orders"
      - button "Reviews"
      - paragraph: Team
      - button "Staff"
      - button "Clients"
      - paragraph: Finance
      - button "Payroll"
      - button "Finance"
      - button "Verification"
      - paragraph: Data
      - button "Workdays"
      - button "Archive"
      - button "Activity log"
      - paragraph: System
      - button "Settings"
    - text: Live clinic status
  - button "Collapse sidebar"
  - button "Search pages and actions… ⌘K"
  - link "Cashier":
    - /url: /cashier
  - button "Notifications": "73"
  - button "Switch to العربية": ع
  - button "Switch to dark mode"
  - button "T technical-support Admin"
  - main:
    - paragraph: You're checked in
    - paragraph: Checked in since 08:14 PM
    - button "Check out & archive"
    - text: Payment verification queue Check the bank statement before approving or rejecting an InstaPay transfer. Status
    - combobox "Status":
      - option "All statuses" [selected]
      - option "Submitted"
      - option "Under review"
      - option "Approved"
      - option "Rejected"
      - option "Superseded"
    - button "Refresh"
    - text: Showing verification for order ORD-2WGLYY
    - button "Show all"
    - paragraph: Check the bank statement first — only approve when the transfer is present.
    - paragraph: Nothing here yet.
    - text: Cash drawer Compare counted cash with verified cash payments for the clinic day. Date
    - textbox "Date": 2026-11-24
    - button "Refresh"
    - paragraph: Expected cash
    - paragraph: EGP 830.00
    - paragraph: Counted cash
    - paragraph: —
    - paragraph: Variance
    - paragraph: —
    - paragraph: 2 cash payments
    - text: Counted amount
    - spinbutton "Counted amount"
    - text: Note (optional)
    - textbox "Note (optional)"
    - button "Close cash drawer" [disabled]
    - paragraph: You can save or update this at any time. The expected total is locked to the amount shown when you save, so later approvals will not change it.
- region "Notifications alt+T"
```

# Test source

```ts
  1  | import fs from "node:fs";
  2  | import path from "node:path";
  3  | import { test, expect, type Page } from "@playwright/test";
  4  | 
  5  | /** Sign in the same way staff do: the SPA reads the session from sessionStorage. */
  6  | async function signIn(page: Page) {
  7  |   const authFile = path.resolve(process.cwd(), "tests", ".auth", "admin.json");
  8  |   const state = JSON.parse(fs.readFileSync(authFile, "utf8")) as {
  9  |     cookies: { name: string; value: string }[];
  10 |   };
  11 |   const token = state.cookies.find((c) => c.name === "paw-m-session")?.value;
  12 |   if (!token) throw new Error("No staff token in tests/.auth/admin.json — run global setup");
  13 | 
  14 |   await page.addInitScript(
  15 |     ([t]) => {
  16 |       sessionStorage.setItem(
  17 |         "paw-m:admin-session",
  18 |         JSON.stringify({
  19 |           username: "technical-support",
  20 |           role: "admin",
  21 |           expiresAt: Date.now() + 8 * 60 * 60 * 1000,
  22 |           token: t,
  23 |         }),
  24 |       );
  25 |     },
  26 |     [token],
  27 |   );
  28 |   await page.goto("/cashier");
  29 |   await page.waitForLoadState("domcontentloaded");
  30 |   // Let the route hydrate and the payment queries resolve.
  31 |   await page.waitForTimeout(1500);
  32 | }
  33 | 
  34 | test("Settle bill opens the verification queue from the cashier", async ({ page }) => {
  35 |   await signIn(page);
  36 | 
  37 |   // A fresh shift asks for cash custody first; answering unlocks the till.
  38 |   if (await page.getByRole("heading", { name: /cash custody & handover/i }).isVisible()) {
  39 |     await page.getByRole("button", { name: /^no drawer$/i }).click();
  40 |     await page.getByRole("button", { name: /confirm & open till/i }).click();
  41 |     await expect(page.getByRole("heading", { name: /cash custody & handover/i })).toBeHidden({
  42 |       timeout: 10000,
  43 |     });
  44 |   }
  45 | 
  46 |   const settleButtons = page.getByRole("button", { name: /settle bill/i });
  47 |   if ((await settleButtons.count()) === 0) {
  48 |     test.skip(true, "no unpaid payment requests to settle");
  49 |   }
  50 |   await settleButtons.first().click();
  51 | 
  52 |   const dialog = page.getByRole("dialog");
  53 |   await expect(dialog).toBeVisible();
  54 |   await expect(dialog.getByText(/settled via order verification/i)).toBeVisible();
  55 |   const queue = dialog.getByRole("button", { name: /open verification queue/i });
  56 |   await expect(queue).toBeVisible();
  57 | 
  58 |   await queue.click();
  59 |   await expect(page).toHaveURL(/\/dashboard\?tab=payment-verification/);
  60 |   await expect(page.getByText(/payment verification queue/i).first()).toBeVisible({
  61 |     timeout: 15000,
  62 |   });
  63 |   // The clicked bill must actually have a review row waiting in the queue.
  64 |   await expect(page.getByText(/showing verification for order/i)).toBeVisible();
> 65 |   await expect(page.getByRole("table").first().locator("tbody tr").first()).toBeVisible({
     |                                                                             ^ Error: expect(locator).toBeVisible() failed
  66 |     timeout: 15000,
  67 |   });
  68 | });
  69 | 
  70 | test("verification queue shows actionable bank transfers", async ({ page }) => {
  71 |   await signIn(page);
  72 |   await page.goto("/dashboard?tab=payment-verification");
  73 |   await expect(page.getByText(/payment verification queue/i).first()).toBeVisible({
  74 |     timeout: 15000,
  75 |   });
  76 | 
  77 |   const firstRow = page.getByRole("table").first().locator("tbody tr").first();
  78 |   await expect(firstRow).toBeVisible({ timeout: 15000 });
  79 |   await expect(firstRow.getByRole("button", { name: /approve/i })).toBeVisible();
  80 |   await expect(firstRow.getByRole("button", { name: /reject/i })).toBeVisible();
  81 |   await expect(page.getByRole("option", { name: /all statuses/i })).toBeAttached();
  82 | });
  83 | 
```