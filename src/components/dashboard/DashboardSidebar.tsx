import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PawMMark } from "@/components/PawMMark";
import { StatusOrb } from "@/design-system/primitives/StatusOrb";
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
    <span className="ms-auto rounded-[var(--radius-sm)] bg-[var(--gold-500)] px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums text-[var(--navy-900)]">
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
  const { requests, orders } = useClinicStore();
  const attention = requests.filter((r) => !r.archived && r.status === "pending").length;
  const openOrders = orders.filter((o) => !o.archived).length;
  const systemTone = attention > 0 ? "watch" : openOrders > 0 ? "ok" : "idle";

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-dvh shrink-0 flex-col border-e border-[var(--navy-700)] bg-[var(--navy-900)] text-white transition-[width] duration-300 ease-[var(--ease-entrance)]",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      {/* Identity */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-white/10 px-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] border border-[var(--gold-500)]/50 text-[var(--gold-400)]">
          <PawMMark className="size-6" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold tracking-tight text-white">
              Paw-M
            </p>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--gold-400)]">
              Staff Console
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-7 shrink-0 rounded-[var(--radius-md)] text-white/50 hover:bg-white/10 hover:text-white",
            collapsed && "absolute end-1 top-[52px]",
          )}
          onClick={onToggleCollapse}
          aria-label={collapsed ? t("dash.expandSidebar") : t("dash.collapseSidebar")}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
      </div>

      <div className="h-px shrink-0 bg-[var(--gold-500)]/50" />

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-6 px-3" aria-label={t("header.mobileAria")}>
          {NAV_GROUPS.map((group) => {
            const visible = group.items.filter((item) => canAccess(item.id));
            if (visible.length === 0) return null;
            return (
              <div key={group.label}>
                {!collapsed && (
                  <p className="mb-2 px-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--gold-400)]/80">
                    {t(group.label)}
                  </p>
                )}
                <div className="space-y-1">
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

      {/* Live system strip */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <div
          className={cn(
            "rounded-[var(--radius-md)] border border-white/10 bg-white/5 px-3 py-2",
            collapsed && "px-0",
          )}
        >
          <StatusOrb
            tone={systemTone}
            size="sm"
            label={collapsed ? undefined : t("story.liveStatus")}
            className="[&>span:last-child]:text-white/75"
          />
        </div>
      </div>
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
        "group relative flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-semibold transition-colors duration-200",
        collapsed && "justify-center px-0",
        active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
      )}
    >
      {active && <span className="absolute inset-y-1.5 start-0 w-[2px] bg-[var(--gold-500)]" />}
      <Icon
        className={cn(
          "shrink-0 transition-colors",
          collapsed ? "size-5" : "size-4",
          active ? "text-[var(--gold-400)]" : "text-white/45 group-hover:text-white/80",
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
