import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { PawMLogo } from "@/components/PawMMark";
import { LogOut, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n, type Lang } from "@/lib/i18n";
import { LanguageToggle } from "@/lib/i18n-components";
import { isAuthed, logout, currentRole, currentUsername } from "@/lib/auth";
import { useClinicStore } from "@/lib/clinic-store";
import { ShiftBanner } from "@/components/dashboard/ShiftBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [{ title: "Staff Portal — Paw-M" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: StaffPage,
});

function StaffPage() {
  const { t, lang } = useI18n();
  const store = useClinicStore();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (isAuthed()) {
      setAuthed(true);
    } else {
      window.location.href = "/";
    }
  }, []);

  const signOut = () => {
    logout();
    setAuthed(false);
    window.location.href = "/";
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-5 py-32">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Ensure the user is staff
  if (currentRole() !== "staff") {
    window.location.href = "/dashboard";
    return null;
  }

  const workSession = store.workSession;

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-e border-border bg-card/60 backdrop-blur-sm lg:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
          <PawMLogo />
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
          {/* Staff-specific nav items can go here */}
        </nav>
        <div className="shrink-0 space-y-2 border-t border-border p-2.5">
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href="/" onClick={() => signOut()}>
              {t("dash.back")}
            </a>
          </Button>
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="truncate text-xs font-medium text-muted-foreground"
                title={currentUsername()}
              >
                {currentUsername() || t("auth.staff")}
              </span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                Staff
              </Badge>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <LanguageToggle />
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="size-4" /> {t("auth.signOut")}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <User className="size-5" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{t("dash.title")}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{t("dash.staff_portal")}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:hidden">
              <Button asChild variant="outline" size="sm">
                <a href="/" onClick={() => signOut()}>
                  {t("dash.back")}
                </a>
              </Button>
              <LanguageToggle />
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="size-4" /> {t("auth.signOut")}
              </Button>
            </div>
          </div>
          <Separator className="mt-4" />
        </div>

        <ShiftBanner />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key="staff"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("dash.staff.kpi")}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {/* Personal KPIs go here */}
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("dash.staff.today_sessions")}
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {/* Calculate today's sessions for this staff */}
                      {0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("dash.staff.earnings_today")}
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {/* Calculate today's earnings for this staff */}
                      {0}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Today's appointments for this staff */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("dash.staff.today_appointments")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* List of appointments */}
                  <p className="text-sm text-muted-foreground">{t("dash.loading")}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
