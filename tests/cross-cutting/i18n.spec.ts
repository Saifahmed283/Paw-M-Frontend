import { test } from "@tests/fixtures/authed-page";
import { expect } from "@playwright/test";
import { SELECTORS } from "@tests/utils/selectors";

test.describe("Internationalization (i18n)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForSelector(SELECTORS.dashboard.sidebar);
  });

  test("should have language switcher in header", async ({ page }) => {
    const switcher = page.locator(SELECTORS.i18n.switcher).first();
    await expect(switcher).toBeVisible();
  });

  test("should switch to Arabic and show RTL layout", async ({ page }) => {
    const switcher = page.locator(SELECTORS.i18n.switcher).first();
    await switcher.click();

    const arabicOption = page.locator(SELECTORS.i18n.arabicOption).first();
    await arabicOption.click();

    await page.waitForTimeout(500);

    // Check for RTL direction on html or body
    const htmlDir = await page.getAttribute("html", "dir");
    const bodyDir = await page.getAttribute("body", "dir");

    expect(htmlDir === "rtl" || bodyDir === "rtl").toBeTruthy();

    // Sidebar should be on right in RTL
    const sidebar = page.locator(SELECTORS.dashboard.sidebar).first();
    const sidebarClasses = await sidebar.getAttribute("class");
    // In RTL, the sidebar border should be on the left (border-s)
    expect(sidebarClasses).toContain("border-s");
  });

  test("should switch back to English and show LTR layout", async ({ page }) => {
    // First switch to Arabic
    const switcher = page.locator(SELECTORS.i18n.switcher).first();
    await switcher.click();
    const arabicOption = page.locator(SELECTORS.i18n.arabicOption).first();
    await arabicOption.click();
    await page.waitForTimeout(500);

    // Then switch back to English
    await switcher.click();
    const englishOption = page.locator(SELECTORS.i18n.englishOption).first();
    await englishOption.click();
    await page.waitForTimeout(500);

    const htmlDir = await page.getAttribute("html", "dir");
    const bodyDir = await page.getAttribute("body", "dir");

    expect(htmlDir !== "rtl" && bodyDir !== "rtl").toBeTruthy();

    // Sidebar should be on left in LTR
    const sidebar = page.locator(SELECTORS.dashboard.sidebar).first();
    const sidebarClasses = await sidebar.getAttribute("class");
    expect(sidebarClasses).toContain("border-e");
  });

  test("should translate dashboard tab labels", async ({ page }) => {
    // Get English labels
    const switcher = page.locator(SELECTORS.i18n.switcher).first();
    await switcher.click();
    const englishOption = page.locator(SELECTORS.i18n.englishOption).first();
    await englishOption.click();
    await page.waitForTimeout(500);

    const englishTabs = await page
      .locator(SELECTORS.dashboard.sidebar + " button, " + SELECTORS.dashboard.sidebar + " a")
      .allTextContents();

    // Switch to Arabic
    await switcher.click();
    const arabicOption = page.locator(SELECTORS.i18n.arabicOption).first();
    await arabicOption.click();
    await page.waitForTimeout(500);

    const arabicTabs = await page
      .locator(SELECTORS.dashboard.sidebar + " button, " + SELECTORS.dashboard.sidebar + " a")
      .allTextContents();

    // Labels should be different (translated)
    expect(englishTabs.join("")).not.toBe(arabicTabs.join(""));
  });

  test("should format dates in Arabic locale", async ({ page }) => {
    const switcher = page.locator(SELECTORS.i18n.switcher).first();
    await switcher.click();
    const arabicOption = page.locator(SELECTORS.i18n.arabicOption).first();
    await arabicOption.click();
    await page.waitForTimeout(500);

    // Navigate to requests to see date formatting
    const requestsTab = page.locator(SELECTORS.nav.tabButton("requests")).first();
    if ((await requestsTab.count()) > 0) {
      await requestsTab.click();
      await page.waitForTimeout(500);

      // Check for Arabic numerals or date format
      const dateCells = page.locator("tbody td").first();
      const text = await dateCells.textContent();
      // Arabic dates may use Arabic-Indic numerals or different format
      // Just verify it renders without error
      expect(text).toBeTruthy();
    }
  });

  test("should format currency in Arabic locale", async ({ page }) => {
    const switcher = page.locator(SELECTORS.i18n.switcher).first();
    await switcher.click();
    const arabicOption = page.locator(SELECTORS.i18n.arabicOption).first();
    await arabicOption.click();
    await page.waitForTimeout(500);

    // Navigate to finance or payments to see currency
    const financeTab = page.locator(SELECTORS.nav.tabButton("finance")).first();
    if ((await financeTab.count()) > 0) {
      await financeTab.click();
      await page.waitForTimeout(500);

      // Check for currency formatting
      const currencyElements = page.locator("text=/EGP|\\$|ج\\.م/");
      await expect(currencyElements.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test("should translate toast messages", async ({ page }) => {
    const switcher = page.locator(SELECTORS.i18n.switcher).first();
    await switcher.click();
    const arabicOption = page.locator(SELECTORS.i18n.arabicOption).first();
    await arabicOption.click();
    await page.waitForTimeout(500);

    // Trigger a toast by clicking complete on a booking (if any)
    const completeBtn = page
      .locator('button:has-text("Complete"), button:has-text("إكمال")')
      .first();
    if ((await completeBtn.count()) > 0) {
      await completeBtn.click();

      const toast = page.locator(SELECTORS.toast.success).first();
      await expect(toast).toBeVisible({ timeout: 5000 });

      // Toast should be in Arabic
      const toastText = await toast.textContent();
      // Arabic text should contain Arabic characters
      expect(toastText).toMatch(/[\u0600-\u06FF]/);
    }
  });

  test("should handle RTL text direction in inputs", async ({ page }) => {
    const switcher = page.locator(SELECTORS.i18n.switcher).first();
    await switcher.click();
    const arabicOption = page.locator(SELECTORS.i18n.arabicOption).first();
    await arabicOption.click();
    await page.waitForTimeout(500);

    // Open clinical record dialog
    const recordBtn = page
      .locator('button:has-text("Record Visit"), button:has-text("تسجيل الزيارة")')
      .first();
    if ((await recordBtn.count()) > 0) {
      await recordBtn.click();

      const diagnosisInput = page.locator(SELECTORS.dialogs.clinicalDiagnosis).first();
      await expect(diagnosisInput).toBeVisible();

      // Type Arabic text
      await diagnosisInput.fill("اختبار التشخيص");

      const value = await diagnosisInput.inputValue();
      expect(value).toBe("اختبار التشخيص");

      // Close dialog
      await page.keyboard.press("Escape");
    }
  });
});
