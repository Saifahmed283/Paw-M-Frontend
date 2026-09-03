export type Role = "staff" | "payroll" | "admin";

export type RolePermissions = Partial<Record<Role, string[]>>;

export const ALL_TAB_IDS = [
  "overview",
  "requests",
  "staff-overview",
  "payroll",
  "tasks",
  "notifications",
  "reservations",
  "doctors",
  "services",
  "products",
  "orders",
  "reviews",
  "workdays",
  "archive",
  "logs",
  "settings",
] as const;

export const SHARED_TAB_IDS: string[] = ["overview", "requests", "notifications"];

export const ROLE_ORDER: Role[] = ["staff", "payroll", "admin"];

const FULL_ACCESS: string[] = [...ALL_TAB_IDS];

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  admin: FULL_ACCESS,
  payroll: [
    "overview",
    "requests",
    "notifications",
    "reservations",
    "payroll",
    "doctors",
    "services",
    "products",
    "orders",
    "reviews",
    "workdays",
    "archive",
  ],
  staff: ["overview", "requests", "notifications", "tasks", "reservations"],
};

export function allowedTabsForRole(perms: RolePermissions | undefined, role: string): string[] {
  if (role === "admin") return FULL_ACCESS;
  const list =
    perms && perms[role as Role] ? perms[role as Role]! : DEFAULT_ROLE_PERMISSIONS[role as Role];
  return list ?? [];
}
