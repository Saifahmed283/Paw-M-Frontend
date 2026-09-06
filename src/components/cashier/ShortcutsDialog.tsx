import { Keyboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ShortcutsDialog({ open, onOpenChange }: Props) {
  const { t } = useI18n();

  const items = [
    { combos: "F1", label: t("cashier.shortcut.quickAdd") },
    { combos: "F2", label: t("cashier.shortcut.scan") },
    { combos: "F3", label: t("cashier.shortcut.hold") },
    { combos: "F4", label: t("cashier.shortcut.receipt") },
    { combos: "F5", label: t("cashier.shortcut.pay") },
    { combos: "F8", label: t("cashier.shortcut.clear") },
    { combos: "F9", label: t("cashier.shortcut.help") },
    { combos: "Esc", label: t("cashier.shortcut.close") },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="size-5" />
            {t("cashier.keyboardShortcuts")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <kbd className="rounded border border-border bg-muted px-2 py-1 font-mono text-xs font-semibold">
                {item.combos}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
