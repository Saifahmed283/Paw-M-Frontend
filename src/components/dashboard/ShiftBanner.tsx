import { useState } from "react";
import { toast } from "sonner";
import { LogIn, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { checkIn, checkOut, refreshClinicData, useClinicStore } from "@/lib/clinic-store";
import { cn } from "@/lib/utils";
import { localTodayISO } from "./dashboard-format";

function formatDayName(dateISO: string, lang: "en" | "ar") {
  const date = new Date(`${dateISO}T00:00:00`);
  return date.toLocaleDateString(lang === "ar" ? "ar" : "en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ShiftBanner() {
  const { t, lang } = useI18n();
  const { workSession } = useClinicStore();
  const [busy, setBusy] = useState(false);
  // An invalid timestamp must not put the banner into a fake "checked in"
  // state that renders the literal text "Invalid Date".
  const startedAt = workSession ? new Date(workSession.startedAt) : null;
  const sessionStarted = startedAt && !Number.isNaN(startedAt.getTime()) ? startedAt : null;

  const doCheckIn = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await checkIn();
      await refreshClinicData();
      const archived = result.archived ?? { bookings: 0, orders: 0 };
      const shiftMessage =
        archived.bookings > 0 || archived.orders > 0
          ? t("dash.shiftArchivedOnStart", {
              requests: String(archived.bookings),
              orders: String(archived.orders),
            })
          : t("dash.shiftStarted");
      const folderMessage = t("dash.dayFolderOpen", {
        name: formatDayName(localTodayISO(), lang),
      });
      toast.success(`${shiftMessage} · ${folderMessage}`);
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  const doCheckOut = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await checkOut();
      await refreshClinicData();
      const archived = result.archived ?? { bookings: 0, orders: 0 };
      const shiftMessage = t("dash.shiftEnded", {
        requests: String(archived.bookings),
        orders: String(archived.orders),
      });
      const folderMessage = t("dash.dayFolderSaved", {
        name: formatDayName(localTodayISO(), lang),
      });
      toast.success(`${shiftMessage} · ${folderMessage}`);
    } catch {
      toast.error(t("dash.toast.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4",
        sessionStarted ? "border-success/30 bg-success/10" : "border-amber-500/30 bg-amber-500/10",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid size-10 place-items-center rounded-xl",
            sessionStarted ? "bg-success/20 text-success" : "bg-amber-500/15 text-amber-600",
          )}
        >
          {sessionStarted ? <Timer className="size-5" /> : <LogIn className="size-5" />}
        </span>
        <div>
          <p className="text-sm font-bold">
            {sessionStarted ? t("dash.checkedIn") : t("dash.notCheckedIn")}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {sessionStarted
              ? `${t("dash.checkedInSince")} ${sessionStarted.toLocaleString(
                  lang === "ar" ? "ar" : "en-US",
                  { hour: "2-digit", minute: "2-digit" },
                )}`
              : t("dash.shiftHint")}
          </p>
        </div>
      </div>
      <Button
        variant={sessionStarted ? "outline" : "default"}
        className={cn(!sessionStarted && "shadow-glow")}
        onClick={sessionStarted ? doCheckOut : doCheckIn}
        disabled={busy}
      >
        {sessionStarted ? t("dash.checkOut") : t("dash.checkIn")}
      </Button>
    </div>
  );
}
