import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle,
  DollarSign,
  ListChecks,
  ShoppingBag,
  CalendarCheck,
} from "lucide-react";
import { isAuthed } from "@/lib/auth";

interface Notification {
  id: number;
  title: string;
  body: string;
  type: string;
  readBy?: string[];
  createdAt: string;
  data?: unknown;
}

const POLL_INTERVAL = 30_000;

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  payroll: DollarSign,
  task: ListChecks,
  system: CheckCircle,
  approval: CheckCircle,
  broadcast: Bell,
  order: ShoppingBag,
  booking: CalendarCheck,
};

export function useNotificationCount() {
  const [count, setCount] = useState(0);
  const userId = useRef<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("paw-m:admin-session");
      if (raw) {
        const parsed = JSON.parse(raw);
        userId.current = String(parsed.id);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const fetchCount = useCallback(async () => {
    if (!userId.current || !isAuthed()) return;
    try {
      const res = await api.get<Notification[]>("/notifications/me");
      if (Array.isArray(res)) {
        const unread = res.filter((n) => !n.readBy || !n.readBy.includes(userId.current!)).length;
        setCount(unread);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchCount]);

  return count;
}

export function NotificationsPanel() {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = localStorage.getItem("paw-m:admin-session")
    ? JSON.parse(localStorage.getItem("paw-m:admin-session") || "{}").id
    : null;

  const fetchNotifications = useCallback(async () => {
    try {
      if (userId) {
        const response = await api.get<Notification[]>("/notifications/me");
        if (Array.isArray(response)) {
          setNotifications(response);
          const unread = response.filter(
            (n) => !n.readBy || !n.readBy.includes(userId.toString()),
          ).length;
          setUnreadCount(unread);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  async function markAsRead(notificationId: number) {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  async function markAllAsRead() {
    try {
      await Promise.all(notifications.map((n) => api.patch(`/notifications/${n.id}/read`)));
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-12">
          <div className="flex space-x-2">
            <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
            <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
            <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold">{t("dash.notifications")}</h2>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="icon" onClick={markAllAsRead} className="ml-4">
            <CheckCircle className="h-3 w-3 text-success" />
            <span className="ml-1 text-xs">{unreadCount}</span>
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">{t("dash.noNotifications")}</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = TYPE_ICON[notification.type] ?? Bell;
            return (
              <div key={notification.id} className="border rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => markAsRead(notification.id)}
                    className={
                      notification.readBy && notification.readBy.includes(userId.toString())
                        ? "text-muted-foreground"
                        : "text-primary"
                    }
                  >
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm">{notification.body}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
