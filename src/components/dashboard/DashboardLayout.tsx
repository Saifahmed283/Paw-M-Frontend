import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

export function DashboardLayout({
  activeTab,
  onTabChange,
  canAccess,
  children,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  canAccess: (tabId: string) => boolean;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setMobileOpen(false);
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-muted/30">
        {/* Desktop sidebar */}
        {!isMobile && (
          <DashboardSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            canAccess={canAccess}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
        )}

        {/* Mobile sidebar */}
        {isMobile && (
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="left" className="w-60 p-0">
              <DashboardSidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                canAccess={canAccess}
                collapsed={false}
                onToggleCollapse={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        )}

        {/* Main content area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader onMobileMenuToggle={isMobile ? () => setMobileOpen(true) : undefined} />

          <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
