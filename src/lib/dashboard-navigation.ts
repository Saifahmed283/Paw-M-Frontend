/**
 * Bridge for cross-component dashboard navigation.
 *
 * Inside the dashboard the active tab switches in place via a window event.
 * Callers outside the dashboard (notably the cashier's "Open verification
 * queue" button) must first navigate to /dashboard — otherwise the event is
 * dispatched with no listener and appears to do nothing.
 */
export const DASHBOARD_NAVIGATE_EVENT = "pawm:dashboard-navigate";

export type DashboardNavigateDetail = {
  tabId: string;
  /** Optional record to focus/highlight once the tab is open. */
  recordId?: string | number;
};

export function navigateToDashboardTab(tabId: string, recordId?: string | number) {
  if (typeof window === "undefined") return;
  const detail: DashboardNavigateDetail = recordId === undefined ? { tabId } : { tabId, recordId };

  if (window.location.pathname === "/dashboard") {
    window.dispatchEvent(new CustomEvent(DASHBOARD_NAVIGATE_EVENT, { detail }));
    return;
  }

  // The dashboard's tab lives in local state, so a plain event fired from
  // another route has no listener. Carry the requested tab in the URL and let
  // the dashboard apply it when it mounts.
  const params = new URLSearchParams({ tab: tabId });
  if (recordId !== undefined) params.set("record", String(recordId));
  window.location.assign(`/dashboard?${params.toString()}`);
}
