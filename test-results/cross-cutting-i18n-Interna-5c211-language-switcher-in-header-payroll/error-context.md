# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-cutting\i18n.spec.ts >> Internationalization (i18n) >> should have language switcher in header
- Location: tests\cross-cutting\i18n.spec.ts:10:3

# Error details

```
Error: page.waitForSelector: Target page, context or browser has been closed
Call log:
  - waiting for locator('[data-testid="dashboard-sidebar"], aside.bg-\\[var\\(--navy-900\\)\\]') to be visible

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { SELECTORS } from '@tests/utils/selectors';
  3   | 
  4   | test.describe('Internationalization (i18n)', () => {
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await page.goto('/dashboard');
> 7   |     await page.waitForSelector(SELECTORS.dashboard.sidebar);
      |                ^ Error: page.waitForSelector: Target page, context or browser has been closed
  8   |   });
  9   | 
  10  |   test('should have language switcher in header', async ({ page }) => {
  11  |     const switcher = page.locator(SELECTORS.i18n.switcher).first();
  12  |     await expect(switcher).toBeVisible();
  13  |   });
  14  | 
  15  |   test('should switch to Arabic and show RTL layout', async ({ page }) => {
  16  |     const switcher = page.locator(SELECTORS.i18n.switcher).first();
  17  |     await switcher.click();
  18  |     
  19  |     const arabicOption = page.locator(SELECTORS.i18n.arabicOption).first();
  20  |     await arabicOption.click();
  21  |     
  22  |     await page.waitForTimeout(500);
  23  |     
  24  |     // Check for RTL direction on html or body
  25  |     const htmlDir = await page.getAttribute('html', 'dir');
  26  |     const bodyDir = await page.getAttribute('body', 'dir');
  27  |     
  28  |     expect(htmlDir === 'rtl' || bodyDir === 'rtl').toBeTruthy();
  29  |     
  30  |     // Sidebar should be on right in RTL
  31  |     const sidebar = page.locator(SELECTORS.dashboard.sidebar).first();
  32  |     const sidebarClasses = await sidebar.getAttribute('class');
  33  |     // In RTL, the sidebar border should be on the left (border-s)
  34  |     expect(sidebarClasses).toContain('border-s');
  35  |   });
  36  | 
  37  |   test('should switch back to English and show LTR layout', async ({ page }) => {
  38  |     // First switch to Arabic
  39  |     const switcher = page.locator(SELECTORS.i18n.switcher).first();
  40  |     await switcher.click();
  41  |     const arabicOption = page.locator(SELECTORS.i18n.arabicOption).first();
  42  |     await arabicOption.click();
  43  |     await page.waitForTimeout(500);
  44  |     
  45  |     // Then switch back to English
  46  |     await switcher.click();
  47  |     const englishOption = page.locator(SELECTORS.i18n.englishOption).first();
  48  |     await englishOption.click();
  49  |     await page.waitForTimeout(500);
  50  |     
  51  |     const htmlDir = await page.getAttribute('html', 'dir');
  52  |     const bodyDir = await page.getAttribute('body', 'dir');
  53  |     
  54  |     expect(htmlDir !== 'rtl' && bodyDir !== 'rtl').toBeTruthy();
  55  |     
  56  |     // Sidebar should be on left in LTR
  57  |     const sidebar = page.locator(SELECTORS.dashboard.sidebar).first();
  58  |     const sidebarClasses = await sidebar.getAttribute('class');
  59  |     expect(sidebarClasses).toContain('border-e');
  60  |   });
  61  | 
  62  |   test('should translate dashboard tab labels', async ({ page }) => {
  63  |     // Get English labels
  64  |     const switcher = page.locator(SELECTORS.i18n.switcher).first();
  65  |     await switcher.click();
  66  |     const englishOption = page.locator(SELECTORS.i18n.englishOption).first();
  67  |     await englishOption.click();
  68  |     await page.waitForTimeout(500);
  69  |     
  70  |     const englishTabs = await page.locator(SELECTORS.dashboard.sidebar + ' button, ' + SELECTORS.dashboard.sidebar + ' a').allTextContents();
  71  |     
  72  |     // Switch to Arabic
  73  |     await switcher.click();
  74  |     const arabicOption = page.locator(SELECTORS.i18n.arabicOption).first();
  75  |     await arabicOption.click();
  76  |     await page.waitForTimeout(500);
  77  |     
  78  |     const arabicTabs = await page.locator(SELECTORS.dashboard.sidebar + ' button, ' + SELECTORS.dashboard.sidebar + ' a').allTextContents();
  79  |     
  80  |     // Labels should be different (translated)
  81  |     expect(englishTabs.join('')).not.toBe(arabicTabs.join(''));
  82  |   });
  83  | 
  84  |   test('should format dates in Arabic locale', async ({ page }) => {
  85  |     const switcher = page.locator(SELECTORS.i18n.switcher).first();
  86  |     await switcher.click();
  87  |     const arabicOption = page.locator(SELECTORS.i18n.arabicOption).first();
  88  |     await arabicOption.click();
  89  |     await page.waitForTimeout(500);
  90  |     
  91  |     // Navigate to requests to see date formatting
  92  |     const requestsTab = page.locator(SELECTORS.nav.tabButton('requests')).first();
  93  |     if (await requestsTab.count() > 0) {
  94  |       await requestsTab.click();
  95  |       await page.waitForTimeout(500);
  96  |       
  97  |       // Check for Arabic numerals or date format
  98  |       const dateCells = page.locator('tbody td').first();
  99  |       const text = await dateCells.textContent();
  100 |       // Arabic dates may use Arabic-Indic numerals or different format
  101 |       // Just verify it renders without error
  102 |       expect(text).toBeTruthy();
  103 |     }
  104 |   });
  105 | 
  106 |   test('should format currency in Arabic locale', async ({ page }) => {
  107 |     const switcher = page.locator(SELECTORS.i18n.switcher).first();
```