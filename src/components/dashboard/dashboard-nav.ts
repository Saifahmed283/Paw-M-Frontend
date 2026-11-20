import {
  Archive,
  Banknote,
  CalendarCheck,
  Contact,
  FileText,
  FolderOpen,
  HeartPulse,
  History,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type NavItem = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
};

/**
 * Single source of truth for the staff sidebar. Group order is the daily
 * workflow (what you do first → what you administer last); item order inside
 * a group follows the same principle. `ALL_NAV_ITEMS` derives the landing tab
 * from this order, so keep the most common entry points at the top.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "nav.group.main",
    items: [
      { id: "overview", icon: LayoutDashboard, roles: ["all"] },
      { id: "requests", icon: ListChecks, roles: ["all"] },
      { id: "reservations", icon: CalendarCheck, roles: ["staff", "payroll", "admin"] },
    ],
  },
  {
    label: "nav.group.clinic",
    items: [
      { id: "doctors", icon: Stethoscope, roles: ["payroll", "admin"] },
      { id: "services", icon: HeartPulse, roles: ["payroll", "admin"] },
      { id: "prescriptions", icon: FileText, roles: ["staff", "payroll", "admin"] },
    ],
  },
  {
    label: "nav.group.store",
    items: [
      { id: "products", icon: ShoppingBag, roles: ["payroll", "admin"] },
      { id: "orders", icon: Package, roles: ["payroll", "admin"] },
      { id: "reviews", icon: MessageSquareText, roles: ["payroll", "admin"] },
    ],
  },
  {
    label: "nav.group.team",
    items: [
      { id: "staff-overview", icon: Users, roles: ["admin"] },
      { id: "recruitment", icon: UserPlus, roles: ["admin"] },
      { id: "clients", icon: Contact, roles: ["payroll", "admin"] },
    ],
  },
  {
    label: "nav.group.finance",
    items: [
      { id: "payroll", icon: Banknote, roles: ["payroll", "admin"] },
      { id: "finance", icon: Wallet, roles: ["payroll", "admin"] },
      { id: "payment-verification", icon: ShieldCheck, roles: ["admin"] },
    ],
  },
  {
    label: "nav.group.data",
    items: [
      { id: "workdays", icon: FolderOpen, roles: ["payroll", "admin"] },
      { id: "archive", icon: Archive, roles: ["payroll", "admin"] },
      { id: "logs", icon: History, roles: ["admin"] },
    ],
  },
  {
    label: "nav.group.system",
    items: [{ id: "settings", icon: Settings, roles: ["admin"] }],
  },
];

export const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
