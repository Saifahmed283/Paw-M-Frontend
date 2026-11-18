import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  CalendarCheck,
  Check,
  CheckCheck,
  DollarSign,
  ListChecks,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { navigateToDashboardTab } from "@/lib/dashboard-navigation";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Notification {
  id: string | number;
  title: string;
  body: string;
  type: string;
  isRead?: boolean;
  createdAt: string;
  data?: unknown;
}

type NotificationPage = {
  data: Notification[];
  pagination?: { total?: number };
};

const POLL_INTERVAL = 30_000;
const FETCH_LIMIT = 200;

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  payroll: DollarSign,
  task: ListChecks,
  system: Check,
  approval: Check,
  broadcast: Bell,
  order: ShoppingBag,
  booking: CalendarCheck,
};

function extractList(res: Notification[] | NotificationPage | null | undefined): Notification[] {
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  return [];
}

/** Map a notification to the dashboard tab that shows the underlying record. */
function targetTabFor(notification: Notification): string | null {
  const data =
    notification.data && typeof notification.data === "object"
      ? (notification.data as Record<string, unknown>)
      : {};
  if (data["orderId"] != null) return "orders";
  if (data["bookingId"] != null) return "requests";
  if (notification.type === "order") return "orders";
  if (notification.type === "booking") return "requests";
  if (notification.type === "payroll") return "payroll";
  return null;
}

export function NotificationBell() {
  const { t, lang } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get<Notification[] | NotificationPage>(
        `/notifications/me?limit=${FETCH_LIMIT}`,
      );
      setNotifications(extractList(res));
    } catch {
      /* ignore transient failures — keep the last good list visible */
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    // Only poll while the tab is actually visible. An unconditional 30s timer
    // kept spending the server's shared API budget in the background and
    // prevented the client from ever recovering once a limit was reached.
    const start = () => {
      if (timer === undefined) timer = setInterval(fetchNotifications, POLL_INTERVAL);
    };
    const stop = () => {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        fetchNotifications();
        start();
      }
    };

    // Respect an already-hidden tab on first mount.
    if (!document.hidden) {
      fetchNotifications();
      start();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (notification: Notification) => {
    const previous = notifications;
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
    );

    const tabId = targetTabFor(notification);
    if (tabId) {
      setOpen(false);
      navigateToDashboardTab(tabId, extractRecordId(notification));
    }

    try {
      await api.patch(`/notifications/${notification.id}/read`);
    } catch {
      // Roll back the optimistic change so the badge stays truthful.
      setNotifications(previous);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await Promise.all(unread.map((n) => api.patch(`/notifications/${n.id}/read`)));
    } catch {
      setNotifications(previous);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8 text-muted-foreground hover:text-foreground"
          aria-label={t("dash.notifications")}
          title={t("dash.notifications")}
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -end-1 -top-1 min-w-[18px] px-1 text-[10px] font-bold tabular-nums">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
          <p className="text-sm font-semibold">{t("dash.notifications")}</p>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={markAllAsRead}>
              <CheckCheck className="size-3.5" />
              {t("dash.markAllRead")}
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="grid place-items-center py-10 text-sm text-muted-foreground">
            {t("dash.noNotifications")}
          </div>
        ) : (
          <ScrollArea className="max-h-[26rem]">
            <ul className="p-1">
              {notifications.map((notification) => {
                const Icon = TYPE_ICON[notification.type] ?? Bell;
                const unread = !notification.isRead;
                return (
                  <li key={notification.id}>
                    <button
                      type="button"
                      onClick={() => markAsRead(notification)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 text-start transition-colors hover:bg-muted",
                        unread && "bg-primary/5",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg",
                          unread ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{notification.title}</span>
                          {unread && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                          {notification.body}
                        </span>
                        <span className="mt-1 block text-[11px] text-muted-foreground/70">
                          {formatDate(notification.createdAt, lang)}
                        </span>
                      </span>
                      <Check
                        className={cn(
                          "mt-1 size-3.5 shrink-0",
                          unread ? "text-muted-foreground/40" : "text-success",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function extractRecordId(notification: Notification): string | number | undefined {
  const data =
    notification.data && typeof notification.data === "object"
      ? (notification.data as Record<string, unknown>)
      : {};
  const value = data["orderId"] ?? data["bookingId"];
  return typeof value === "string" || typeof value === "number" ? value : undefined;
}
