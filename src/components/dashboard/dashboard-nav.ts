import {
  Archive,
  Banknote,
  CalendarCheck,
  FileText,
  FolderOpen,
  HeartPulse,
  History,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  Package,
  Settings,
  ShoppingBag,
  Stethoscope,
  Users,
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
    label: "nav.group.team",
    items: [
      { id: "staff-overview", icon: Users, roles: ["admin"] },
      { id: "payroll", icon: Banknote, roles: ["payroll", "admin"] },
      { id: "clients", icon: Users, roles: ["payroll", "admin"] },
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
