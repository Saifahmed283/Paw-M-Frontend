import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PawMMark } from "@/components/PawMMark";
import { useI18n } from "@/lib/i18n";
import { useClinicStore } from "@/lib/clinic-store";
import { cn } from "@/lib/utils";
import { NAV_GROUPS, type NavItem } from "./dashboard-nav";

function NavBadge({ item }: { item: NavItem }) {
  const store = useClinicStore();

  let count = 0;

  if (item.id === "requests") {
    count = store.requests.filter((r) => !r.archived && r.status === "pending").length;
  } else if (item.id === "orders") {
    count = store.orders.filter((o) => !o.archived).length;
  } else if (item.id === "reviews") {
    count = store.reviews.filter((r) => r.status === "pending").length;
  }

  if (count <= 0) return null;

  return (
    <span className="ms-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold tabular-nums text-amber-600 dark:bg-amber-400/15 dark:text-amber-400">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function DashboardSidebar({
  activeTab,
  onTabChange,
  canAccess,
  collapsed,
  onToggleCollapse,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  canAccess: (tabId: string) => boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const { t } = useI18n();

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-dvh shrink-0 flex-col border-e border-border bg-card/80 backdrop-blur-xl transition-[width] duration-300 ease-[var(--ease-entrance)]",
        collapsed ? "w-[68px]" : "w-60",
      )}
    >
      {/* Logo bar */}
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
        <PawMMark className="size-7 text-primary" />
        {!collapsed && (
          <span className="text-lg font-bold tracking-[-0.03em] text-foreground">Paw-M</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ms-auto size-7 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={onToggleCollapse}
          aria-label={collapsed ? t("dash.expandSidebar") : t("dash.collapseSidebar")}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-4 px-2.5">
          {NAV_GROUPS.map((group) => {
            const visible = group.items.filter((item) => canAccess(item.id));
            if (visible.length === 0) return null;
            return (
              <div key={group.label}>
                {!collapsed && (
                  <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {t(group.label)}
                  </p>
                )}
                <div className="space-y-0.5">
                  {visible.map((item) => (
                    <NavItemButton
                      key={item.id}
                      item={item}
                      active={activeTab === item.id}
                      collapsed={collapsed}
                      onClick={() => onTabChange(item.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}

function NavItemButton({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const { t } = useI18n();
  const Icon = item.icon;

  const content = (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-200",
        collapsed && "justify-center px-0",
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {active && <span className="absolute inset-y-1.5 start-0 w-[3px] rounded-full bg-primary" />}
      <Icon
        className={cn(
          "shrink-0 transition-colors",
          collapsed ? "size-5" : "size-4",
          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      {!collapsed && (
        <>
          <span className="truncate">{t(`dash.${item.id}`)}</span>
          <NavBadge item={item} />
        </>
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {t(`dash.${item.id}`)}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
