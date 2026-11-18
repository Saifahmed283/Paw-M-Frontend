/**
 * Lightweight bridge for cross-component dashboard navigation.
 *
 * The dashboard keeps its active tab in local state (it is not URL-driven), so
 * components rendered inside the shell — e.g. the notification bell — use this
 * event to ask the shell to switch tabs without prop-drilling through layout.
 */
export const DASHBOARD_NAVIGATE_EVENT = "pawm:dashboard-navigate";

export type DashboardNavigateDetail = {
  tabId: string;
  /** Optional record to focus/highlight once the tab is open. */
  recordId?: string | number;
};

export function navigateToDashboardTab(tabId: string, recordId?: string | number) {
  if (typeof window === "undefined") return;
  const detail: DashboardNavigateDetail =
    recordId === undefined ? { tabId } : { tabId, recordId };
  window.dispatchEvent(new CustomEvent(DASHBOARD_NAVIGATE_EVENT, { detail }));
}
