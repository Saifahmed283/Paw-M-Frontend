import {
  ArrowLeft,
  Menu,
  Moon,
  Sun,
  LogOut,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ScanLine,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { ALL_NAV_ITEMS } from "./dashboard-nav";
import { NotificationBell } from "./NotificationBell";
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
    admin: "bg-destructive/10 text-destructive border-destructive/20",
    payroll:
      "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:bg-violet-400/10 dark:text-violet-400",
    staff: "bg-primary/10 text-primary border-primary/20",
  };
  return (
    <Badge
      variant="outline"
      className={cn("gap-1 text-[10px] font-semibold px-1.5 py-0", styles[role] ?? styles["staff"])}
    >
      <RoleIcon role={role} />
      {labels[role] ?? role}
    </Badge>
  );
}

export function DashboardHeader({
  onMobileMenuToggle,
}: {
  onMobileMenuToggle?: (() => void) | undefined;
}) {
  const { t } = useI18n();
  const { dark, toggle: toggleTheme } = useTheme();
  const username = currentUsername();
  const role = currentRole();

  const handleSignOut = () => {
    logout();
    window.location.reload();
  };

  const handleBackToSite = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card/80 px-3 backdrop-blur-xl sm:gap-3 sm:px-6">
      {/* Mobile menu button */}
      {onMobileMenuToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 lg:hidden"
          onClick={onMobileMenuToggle}
        >
          <Menu className="size-4" />
        </Button>
      )}

      {/* Right side controls */}
      <div className="ms-auto flex items-center gap-1 sm:gap-1.5">
        <Link to="/cashier" title={t("header.cashier")} className="shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 px-2 text-muted-foreground hover:text-foreground"
          >
            <ScanLine className="size-4 shrink-0" />
            <span className="hidden text-sm font-medium md:inline">{t("header.cashier")}</span>
          </Button>
        </Link>

        <div className="hidden sm:block">
          <NotificationBell />
        </div>
        <LanguageToggle className="hidden size-8 sm:grid" />

        <Button
          variant="ghost"
          size="icon"
          className="hidden size-8 text-muted-foreground hover:text-foreground sm:inline-flex"
          onClick={toggleTheme}
          title={dark ? t("header.lightMode") : t("header.darkMode")}
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />

        {/* Account dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 px-2 text-muted-foreground hover:text-foreground"
            >
              <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                {username?.[0]?.toUpperCase() ?? "S"}
              </span>
              <span className="hidden text-sm font-medium sm:inline-block">
                {username || t("auth.staff")}
              </span>
              <span className="hidden lg:inline-flex">
                <RoleBadge role={role} />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{username || t("auth.staff")}</p>
              <p className="text-xs text-muted-foreground">{t(`role.${role}`)}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleBackToSite} className="gap-2 text-muted-foreground">
              <ArrowLeft className="size-4" />
              {t("dash.back")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-destructive">
              <LogOut className="size-4" />
              {t("auth.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
