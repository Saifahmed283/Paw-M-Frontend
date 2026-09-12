import { describe, expect, it } from "vitest";

import { ALL_TAB_IDS, DEFAULT_ROLE_PERMISSIONS, allowedTabsForRole } from "@/lib/roles";

describe("roles permissions", () => {
  it("gives admin full access to every tab", () => {
    expect(allowedTabsForRole(DEFAULT_ROLE_PERMISSIONS, "admin")).toEqual([...ALL_TAB_IDS]);
    expect(allowedTabsForRole(undefined, "admin")).toEqual([...ALL_TAB_IDS]);
  });

  it("falls back to defaults when no permissions are configured", () => {
    expect(allowedTabsForRole(undefined, "staff")).toEqual(DEFAULT_ROLE_PERMISSIONS.staff);
    expect(allowedTabsForRole(undefined, "payroll")).toEqual(DEFAULT_ROLE_PERMISSIONS.payroll);
  });

  it("applies custom role permission lists", () => {
    const custom = { staff: ["overview", "requests"] };
    expect(allowedTabsForRole(custom, "staff")).toEqual(["overview", "requests"]);
    expect(allowedTabsForRole(custom, "staff")).not.toContain("settings");
  });

  it("ignores unknown roles and returns an empty list", () => {
    expect(allowedTabsForRole(DEFAULT_ROLE_PERMISSIONS, "guest")).toEqual([]);
  });

  it("defaults include shared tabs plus role-specific tabs", () => {
    expect(DEFAULT_ROLE_PERMISSIONS.staff).toContain("overview");
    expect(DEFAULT_ROLE_PERMISSIONS.staff).toContain("reservations");
    expect(DEFAULT_ROLE_PERMISSIONS.staff).not.toContain("payroll");
    expect(DEFAULT_ROLE_PERMISSIONS.staff).not.toContain("tasks");
    expect(DEFAULT_ROLE_PERMISSIONS.staff).not.toContain("notifications");
    expect(DEFAULT_ROLE_PERMISSIONS.payroll).toContain("archive");
    expect(DEFAULT_ROLE_PERMISSIONS.payroll).not.toContain("tasks");
  });

  it("gives staff and payroll access to the prescriptions tab", () => {
    expect(ALL_TAB_IDS).toContain("prescriptions");
    expect(DEFAULT_ROLE_PERMISSIONS.staff).toContain("prescriptions");
    expect(DEFAULT_ROLE_PERMISSIONS.payroll).toContain("prescriptions");
    expect(allowedTabsForRole(undefined, "staff")).toContain("prescriptions");
    expect(allowedTabsForRole(undefined, "payroll")).toContain("prescriptions");
    expect(allowedTabsForRole(undefined, "admin")).toContain("prescriptions");
  });
});
