// Stable test selectors for Paw-M dashboard
// Add data-testid attributes to components for reliable selection

export const SELECTORS = {
  // Auth
  login: {
    usernameInput: 'input[autocomplete="username"], input[placeholder*="username" i], input[placeholder*="Username" i]',
    passwordInput: 'input[autocomplete="current-password"], input[type="password"]',
    submitButton: 'button[type="submit"], button:has-text("Sign in"), button:has-text("Login"), button:has-text("Unlock")',
    errorToast: '[data-sonner-toast]',
  },

  // Dashboard Layout
  dashboard: {
    sidebar: '[data-testid="dashboard-sidebar"], aside.bg-\\[var\\(--navy-900\\)\\]',
    header: '[data-testid="dashboard-header"], header',
    mainContent: 'main[class*="flex-1"]',
    mobileMenuButton: 'button[aria-label*="menu"], button:has([data-lucide="menu"])',
    sidebarCollapsed: 'aside[class*="w-20"]',
    sidebarExpanded: 'aside[class*="w-64"]',
  },

  // Navigation
  nav: {
    tabButton: (tabId: string) => `[data-testid="nav-${tabId}"], button:has-text("${tabId}"), a[href*="${tabId}"]`,
    activeTab: 'button[class*="bg-white/10"], [aria-current="page"]',
    badge: '.bg-\\[var\\(--gold-500\\)\\]',
    toggleCollapse: 'button[aria-label*="collapse"], button:has([data-lucide="chevron-left"])',
  },

  // Shift Banner
  shiftBanner: {
    container: '[data-testid="shift-banner"], .shift-banner',
    checkInButton: '[data-testid="check-in-btn"], button:has-text("Check In"), button:has-text("Check in")',
    checkOutButton: '[data-testid="check-out-btn"], button:has-text("Check Out"), button:has-text("Check out")',
    statusOrb: '[data-testid="shift-status"], .status-orb',
    sessionTime: '[data-testid="session-time"]',
  },

  // Overview Tab
  overview: {
    statsCards: '[data-testid="overview-stats"], .grid > .stat-card',
    statCard: (label: string) => `[data-testid="stat-${label.toLowerCase().replace(/\s+/g, '-')}"]`,
    todayAppointments: '[data-testid="today-appointments"], .overview-card:has-text("Today")',
    appointmentItem: '[data-testid="today-appointment"]',
    completeButton: 'button:has-text("Complete"), button:has-text("Mark Complete")',
    recentActivity: '[data-testid="recent-activity"], .overview-card:has-text("Recent")',
    recentTable: 'table',
    recentRow: 'tbody tr',
  },

  // Requests Tab
  requests: {
    searchInput: '[data-testid="requests-search"], input[placeholder*="Search"], input[aria-label*="Search"]',
    statusFilter: '[data-testid="status-filter"], [role="radiogroup"]',
    statusOption: (status: string) => `[data-testid="status-${status}"], [value="${status}"]`,
    table: '[data-testid="requests-table"], table',
    row: (id: string) => `[data-testid="booking-row-${id}"], tbody tr:has-text("${id}")`,
    confirmButton: (id: string) => `[data-testid="confirm-btn-${id}"], button:has-text("Confirm")`,
    cancelButton: (id: string) => `[data-testid="cancel-btn-${id}"], button:has-text("Cancel")`,
    archiveButton: (id: string) => `[data-testid="archive-btn-${id}"], button[aria-label*="Archive"]`,
    deleteButton: (id: string) => `[data-testid="delete-btn-${id}"], button[aria-label*="Delete"]`,
    statusBadge: (id: string) => `[data-testid="status-badge-${id}"], .status-badge`,
    pagination: '[data-testid="pagination"], nav[aria-label="Pagination"]',
    pageInfo: '[data-testid="page-info"], p:has-text("Showing")',
  },

  // Reservations Tab
  reservations: {
    searchInput: '[data-testid="reservations-search"], input[placeholder*="Search"]',
    card: (id: string) => `[data-testid="reservation-${id}"], .rounded-xl.border:has-text("${id}")`,
    completeButton: (id: string) => `[data-testid="complete-res-${id}"], button:has-text("Complete")`,
    recordVisitButton: (id: string) => `[data-testid="record-visit-${id}"], button:has-text("Record Visit")`,
    prescriptionButton: (id: string) => `[data-testid="prescription-${id}"], button:has-text("Prescription")`,
    paymentButton: (id: string) => `[data-testid="payment-${id}"], button:has-text("Request Payment")`,
    cancelButton: (id: string) => `[data-testid="cancel-res-${id}"], button:has-text("Cancel")`,
    diagnosis: '[data-testid="diagnosis"], .bg-muted\\/60:has-text("Diagnosis")',
    treatment: '[data-testid="treatment"], .bg-muted\\/60:has-text("Treatment")',
    pagination: '[data-testid="pagination"]',
  },

  // Dialogs
  dialogs: {
    clinicalRecord: '[data-testid="clinical-record-dialog"], [role="dialog"]:has-text("Visit Record")',
    clinicalDiagnosis: '[data-testid="clinical-diagnosis"], textarea[placeholder*="Diagnosis"]',
    clinicalTreatment: '[data-testid="clinical-treatment"], textarea[placeholder*="Treatment"]',
    clinicalFollowUp: '[data-testid="clinical-followup"], input[type="date"]',
    clinicalSave: '[data-testid="clinical-save"], button:has-text("Save Visit")',
    clinicalCancel: '[data-testid="clinical-cancel"], button:has-text("Cancel")',
    
    prescription: '[data-testid="prescription-dialog"], [role="dialog"]:has-text("Prescription")',
    
    requestPayment: '[data-testid="request-payment-dialog"], [role="dialog"]:has-text("Request Payment")',
    paymentServiceItem: '[data-testid="payment-service-item"]',
    paymentCustomLabel: '[data-testid="payment-custom-label"], input[placeholder*="Label"]',
    paymentCustomAmount: '[data-testid="payment-custom-amount"], input[placeholder*="Amount"]',
    paymentAddLine: '[data-testid="payment-add-line"], button:has-text("Add")',
    paymentSend: '[data-testid="payment-send"], button:has-text("Send")',
    paymentTotal: '[data-testid="payment-total"]',
  },

  // Clients Panel
  clients: {
    table: '[data-testid="clients-table"], table',
    row: (id: string) => `[data-testid="client-row-${id}"], tbody tr:has-text("${id}")`,
    viewButton: (id: string) => `[data-testid="view-client-${id}"], button:has-text("View")`,
    suspendButton: (id: string) => `[data-testid="suspend-${id}"], button:has-text("Suspend")`,
    unsuspendButton: (id: string) => `[data-testid="unsuspend-${id}"], button:has-text("Unsuspend")`,
    notifyButton: (id: string) => `[data-testid="notify-${id}"], button:has-text("Notify")`,
    detailView: '[data-testid="client-detail"], .client-detail',
    detailBack: '[data-testid="client-back"], button:has-text("Back")',
    petsList: '[data-testid="client-pets"]',
    bookingsList: '[data-testid="client-bookings"]',
    paymentsList: '[data-testid="client-payments"]',
  },

  // Payments Panel
  payments: {
    table: '[data-testid="payments-table"], table',
    row: (id: string) => `[data-testid="payment-row-${id}"], tbody tr:has-text("${id}")`,
    verifyButton: (id: string) => `[data-testid="verify-payment-${id}"], button:has-text("Verify")`,
    settleButton: (id: string) => `[data-testid="settle-payment-${id}"], button:has-text("Settle")`,
    statusBadge: (id: string) => `[data-testid="payment-status-${id}"], .payment-status-badge`,
    methodBadge: (id: string) => `[data-testid="payment-method-${id}"], .payment-method-badge`,
  },

  // Toast notifications
  toast: {
    container: '[data-sonner-toaster]',
    toast: '[data-sonner-toast]',
    success: '[data-sonner-toast][data-type="success"], .bg-green-500',
    error: '[data-sonner-toast][data-type="error"], .bg-red-500',
    info: '[data-sonner-toast][data-type="info"], .bg-blue-500',
  },

  // Language switcher
  i18n: {
    switcher: '[data-testid="language-switcher"], button:has-text("EN"), button:has-text("AR")',
    englishOption: '[data-testid="lang-en"], [value="en"]',
    arabicOption: '[data-testid="lang-ar"], [value="ar"]',
  },

  // Settings
  settings: {
    tabs: '[data-testid="settings-tabs"], [role="tablist"]',
    tabPanel: (name: string) => `[data-testid="settings-${name}"], [role="tabpanel"]:has-text("${name}")`,
    saveButton: '[data-testid="settings-save"], button:has-text("Save")',
  },
} as const;

// Helper to wait for toast and get message
export async function waitForToast(page: any, type: 'success' | 'error' | 'info' = 'success', timeout = 5000) {
  const toast = page.locator(SELECTORS.toast[type === 'success' ? 'success' : type === 'error' ? 'error' : 'info']);
  await toast.first().waitFor({ state: 'visible', timeout });
  const text = await toast.first().textContent();
  await toast.first().waitFor({ state: 'hidden', timeout: 10000 });
  return text;
}

// Helper to check if element exists without throwing
export async function elementExists(page: any, selector: string): Promise<boolean> {
  try {
    await page.locator(selector).first().waitFor({ state: 'attached', timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}