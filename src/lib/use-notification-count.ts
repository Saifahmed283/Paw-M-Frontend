import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
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
