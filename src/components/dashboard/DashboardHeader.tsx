import {
  ArrowLeft,
  LogOut,
  Menu,
  Moon,
  ScanLine,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageToggle } from "@/lib/i18n-components";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/use-theme-hook";
import { currentUsername, currentRole, logout } from "@/lib/auth";
import { ALL_NAV_ITEMS, NAV_GROUPS } from "./dashboard-nav";
import { NotificationBell } from "./NotificationBell";
import { CommandBar, type CommandItem } from "@/design-system/primitives/CommandBar";
import { navigateToDashboardTab } from "@/lib/dashboard-navigation";
import { cn } from "@/lib/utils";

function RoleIcon({ role }: { role: string }) {
  if (role === "admin") return <ShieldAlert className="size-3.5" />;
  if (role === "payroll") return <ShieldCheck className="size-3.5" />;
  return <Shield className="size-3.5" />;
}

function RoleBadge({ role }: { role: string }) {
  const { t } = useI18n();
  const labels: Record<string, string> = {
    admin: t("role.admin"),
    payroll: t("role.payroll"),
    staff: t("role.staff"),
  };
  const styles: Record<string, string> = {
    admin: "border-[var(--urgent)]/50 bg-[var(--urgent)]/20 text-white",
    payroll: "border-[var(--gold-500)]/50 bg-[var(--gold-500)]/15 text-[var(--gold-400)]",
    staff: "border-white/20 bg-white/10 text-white/85",
  };
  return (
    <Badge
      variant="outline"
      className={cn("gap-1 px-2 py-0 text-[10px] font-semibold", styles[role] ?? styles["staff"])}
    >
      <RoleIcon role={role} />
      {labels[role] ?? role}
    </Badge>
  );
}

export function DashboardHeader({
  canAccess,
  onMobileMenuToggle,
}: {
  canAccess: (tabId: string) => boolean;
  onMobileMenuToggle?: (() => void) | undefined;
}) {
  const { t } = useI18n();
  const { dark, toggle: toggleTheme } = useTheme();
  const username = currentUsername();
  const role = currentRole();

  const commands: CommandItem[] = ALL_NAV_ITEMS.filter((item) => canAccess(item.id)).map((item) => {
    const Icon = item.icon;
    const group = NAV_GROUPS.find((g) => g.items.some((i) => i.id === item.id));
    return {
      id: item.id,
      label: t(`dash.${item.id}`),
      group: group ? t(group.label) : undefined,
      icon: <Icon className="size-4" />,
      onSelect: () => navigateToDashboardTab(item.id),
    };
  });

  const handleSignOut = () => {
    logout();
    window.location.reload();
  };

  const handleBackToSite = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-2 border-b border-[var(--navy-700)] bg-[var(--navy-900)] px-3 text-white sm:gap-3 sm:px-6">
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--gold-500)]/50" />

      {onMobileMenuToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-white/70 hover:bg-white/10 hover:text-white"
          onClick={onMobileMenuToggle}
          aria-label={t("header.openMenu")}
        >
          <Menu className="size-4" />
        </Button>
      )}

      <div className="ms-auto flex items-center gap-2 sm:gap-3">
        <CommandBar
          items={commands}
          className="hidden h-9 max-w-[260px] border-white/15 bg-white/5 text-white/70 placeholder:text-white/40 lg:flex"
        />

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="hidden text-white/80 hover:bg-white/10 hover:text-white sm:inline-flex"
        >
          <Link to="/cashier" title={t("header.cashier")} className="gap-2">
            <ScanLine className="size-4 shrink-0 text-[var(--gold-400)]" />
            <span className="text-sm font-semibold">{t("header.cashier")}</span>
          </Link>
        </Button>

        <div className="hidden md:block">
          <NotificationBell />
        </div>
        <LanguageToggle className="hidden size-8 sm:grid" />

        <Button
          variant="ghost"
          size="icon"
          className="hidden size-8 text-white/70 hover:bg-white/10 hover:text-white sm:inline-flex"
          onClick={toggleTheme}
          title={dark ? t("header.lightMode") : t("header.darkMode")}
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 px-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <span className="grid size-7 place-items-center rounded-[var(--radius-md)] bg-[var(--gold-500)] font-data text-xs font-bold text-[var(--navy-900)]">
                {username?.[0]?.toUpperCase() ?? "S"}
              </span>
              <span className="hidden text-sm font-semibold sm:inline-block">
                {username || t("auth.staff")}
              </span>
              <span className="hidden lg:inline-flex">
                <RoleBadge role={role} />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5">
              <p className="text-sm font-semibold">{username || t("auth.staff")}</p>
              <p className="text-xs text-ink-faint">{t(`role.${role}`)}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleBackToSite} className="gap-2 text-ink-soft">
              <ArrowLeft className="size-4 rtl:rotate-180" />
              {t("dash.back")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-status-critical">
              <LogOut className="size-4" />
              {t("auth.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
