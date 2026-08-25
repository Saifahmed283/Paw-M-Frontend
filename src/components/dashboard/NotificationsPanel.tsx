import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, X, CheckCircle, DollarSign, ListChecks } from "lucide-react";

export function NotificationsPanel() {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = localStorage.getItem("paw-m:admin-session")
    ? JSON.parse(localStorage.getItem("paw-m:admin-session") || "{}").id
    : null;

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  async function fetchNotifications() {
    setLoading(true);
    try {
      if (userId) {
        const response = await api.get("/api/notifications/me");
        if (Array.isArray(response)) {
          setNotifications(response);
          const unread = response.filter(
            (n: any) => !n.readBy || !n.readBy.includes(userId.toString()),
          ).length;
          setUnreadCount(unread);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId: number) {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
      await fetchNotifications(); // Refresh the list
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  async function markAllAsRead() {
    try {
      // Mark each notification as read
      await Promise.all(
        notifications.map((n: any) => api.patch(`/api/notifications/${n.id}/read`)),
      );
      await fetchNotifications(); // Refresh the list
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
          {notifications.map((notification) => (
            <div key={notification.id} className="border rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {notification.type === "payroll" && (
                    <DollarSign className="h-4 w-4 text-success" />
                  )}
                  {notification.type === "task" && (
                    <ListChecks className="h-4 w-4 text-muted-foreground" />
                  )}
                  {notification.type === "system" && (
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  {notification.type === "approval" && (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  {notification.type === "broadcast" && (
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  )}
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
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm">{notification.body}</p>
              {notification.data && (
                <div className="mt-3 p-3 bg-muted rounded">
                  <p className="text-xs font-medium">{t("dash.details")}</p>
                  <pre className="text-xs mt-1 whitespace-pre-wrap">
                    {JSON.stringify(notification.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
