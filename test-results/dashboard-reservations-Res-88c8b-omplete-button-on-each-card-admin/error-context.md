# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard\reservations.spec.ts >> Reservations Tab >> should show Complete button on each card
- Location: tests\dashboard\reservations.spec.ts:56:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[data-testid="dashboard-sidebar"], aside.bg-\\[var\\(--navy-900\\)\\]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - complementary [ref=e4]:
        - generic [ref=e5]:
          - img "Paw-M" [ref=e7]
          - paragraph [ref=e8]: Staff portal
          - heading "Care behind every credential." [level=2] [ref=e9]
          - paragraph [ref=e11]: A considered workspace for the people who make it happen.
        - generic [ref=e12]:
          - generic [ref=e13]: Secure access
          - generic [ref=e17]: Clear records
          - generic [ref=e24]: Care first
      - generic [ref=e29]:
        - button "Back to site" [ref=e30] [cursor=pointer]
        - heading "Staff sign-in" [level=1] [ref=e32]
        - paragraph [ref=e33]: Restricted area. Sign in with your staff credentials to continue.
        - generic [ref=e34]:
          - generic [ref=e35]:
            - generic [ref=e36]: Username
            - textbox "e.g. admin" [active] [ref=e38]
          - generic [ref=e39]:
            - generic [ref=e40]: Password
            - generic [ref=e41]:
              - textbox "••••••••" [ref=e42]
              - button "Show password" [ref=e43]
        - button "Sign in" [ref=e48] [cursor=pointer]
        - paragraph [ref=e49]: Can't sign in? Contact your administrator.
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { SELECTORS } from '@tests/utils/selectors';
  3   | 
  4   | test.describe('Reservations Tab', () => {
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await page.goto('/dashboard');
> 7   |     await page.waitForSelector(SELECTORS.dashboard.sidebar);
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  8   |     
  9   |     // Navigate to reservations tab (staff, payroll, admin all have access)
  10  |     const reservationsTab = page.locator(SELECTORS.nav.tabButton('reservations')).first();
  11  |     if (await reservationsTab.count() > 0) {
  12  |       await reservationsTab.click();
  13  |       await page.waitForTimeout(500);
  14  |     }
  15  |   });
  16  | 
  17  |   test('should display search input', async ({ page }) => {
  18  |     const searchInput = page.locator(SELECTORS.reservations.searchInput).first();
  19  |     await expect(searchInput).toBeVisible();
  20  |   });
  21  | 
  22  |   test('should display confirmed future bookings', async ({ page }) => {
  23  |     const cards = page.locator(SELECTORS.reservations.card(''));
  24  |     const count = await cards.count();
  25  |     
  26  |     // Should have at least the container
  27  |     if (count === 0) {
  28  |       // Check for empty state
  29  |       const empty = page.locator('text=No reservations, text=Empty');
  30  |       await expect(empty.first()).toBeVisible({ timeout: 5000 });
  31  |     } else {
  32  |       // First card should be visible
  33  |       await expect(cards.first()).toBeVisible();
  34  |     }
  35  |   });
  36  | 
  37  |   test('each reservation card should show key info', async ({ page }) => {
  38  |     const cards = page.locator(SELECTORS.reservations.card(''));
  39  |     const count = await cards.count();
  40  |     
  41  |     if (count > 0) {
  42  |       const firstCard = cards.first();
  43  |       
  44  |       // Should show date and time
  45  |       await expect(firstCard.locator('text=/\\d{4}-\\d{2}-\\d{2}/')).toBeVisible();
  46  |       await expect(firstCard.locator('text=/\\d{2}:\\d{2}/')).toBeVisible();
  47  |       
  48  |       // Should show pet name and owner
  49  |       await expect(firstCard.locator('text=/Pet|Owner/')).toBeVisible();
  50  |       
  51  |       // Should show doctor name
  52  |       await expect(firstCard.locator('text=/Dr\\./')).toBeVisible();
  53  |     }
  54  |   });
  55  | 
  56  |   test('should show Complete button on each card', async ({ page }) => {
  57  |     const cards = page.locator(SELECTORS.reservations.card(''));
  58  |     const count = await cards.count();
  59  |     
  60  |     if (count > 0) {
  61  |       const firstCard = cards.first();
  62  |       const completeBtn = firstCard.locator(SELECTORS.reservations.completeButton(''));
  63  |       await expect(completeBtn).toBeVisible();
  64  |     }
  65  |   });
  66  | 
  67  |   test('clicking Complete should show success toast', async ({ page }) => {
  68  |     const cards = page.locator(SELECTORS.reservations.card(''));
  69  |     const count = await cards.count();
  70  |     
  71  |     if (count > 0) {
  72  |       const firstCard = cards.first();
  73  |       const completeBtn = firstCard.locator(SELECTORS.reservations.completeButton(''));
  74  |       await completeBtn.click();
  75  |       
  76  |       const toast = page.locator(SELECTORS.toast.success);
  77  |       await expect(toast).toBeVisible({ timeout: 5000 });
  78  |       await expect(toast).toContainText(/complete/i);
  79  |     }
  80  |   });
  81  | 
  82  |   test('should show Record Visit button', async ({ page }) => {
  83  |     const cards = page.locator(SELECTORS.reservations.card(''));
  84  |     const count = await cards.count();
  85  |     
  86  |     if (count > 0) {
  87  |       const firstCard = cards.first();
  88  |       const recordBtn = firstCard.locator(SELECTORS.reservations.recordVisitButton(''));
  89  |       await expect(recordBtn).toBeVisible();
  90  |     }
  91  |   });
  92  | 
  93  |   test('clicking Record Visit should open clinical record dialog', async ({ page }) => {
  94  |     const cards = page.locator(SELECTORS.reservations.card(''));
  95  |     const count = await cards.count();
  96  |     
  97  |     if (count > 0) {
  98  |       const firstCard = cards.first();
  99  |       const recordBtn = firstCard.locator(SELECTORS.reservations.recordVisitButton(''));
  100 |       await recordBtn.click();
  101 |       
  102 |       const dialog = page.locator(SELECTORS.dialogs.clinicalRecord).first();
  103 |       await expect(dialog).toBeVisible({ timeout: 5000 });
  104 |       
  105 |       // Should have diagnosis, treatment, follow-up fields
  106 |       await expect(page.locator(SELECTORS.dialogs.clinicalDiagnosis)).toBeVisible();
  107 |       await expect(page.locator(SELECTORS.dialogs.clinicalTreatment)).toBeVisible();
```