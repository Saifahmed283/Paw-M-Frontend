import { Printer, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import type { CartItem, ItemDiscount, OrderDiscount, CustomerInfo } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: { name: string; phone: string; address: string };
  customer: CustomerInfo;
  cart: CartItem[];
  itemDiscounts: Record<string, ItemDiscount>;
  orderDiscount: OrderDiscount;
  currency: string;
};

export function ReceiptPreview({
  open,
  onOpenChange,
  settings,
  customer,
  cart,
  itemDiscounts,
  orderDiscount,
  currency,
}: Props) {
  const { t } = useI18n();

  const subtotal = cart.reduce((n, i) => n + i.price * i.qty, 0);
  const itemDiscountTotal = cart.reduce((n, i) => {
    const d = itemDiscounts[i.id];
    if (!d || d.type === "none") return n;
    const eff = d.type === "percent" ? i.price * (d.value / 100) : Math.min(d.value, i.price);
    return n + eff * i.qty;
  }, 0);
  const subtotalAfterItems = subtotal - itemDiscountTotal;
  const orderDiscAmt =
    orderDiscount.type === "percent"
      ? subtotalAfterItems * (orderDiscount.value / 100)
      : orderDiscount.type === "fixed"
        ? orderDiscount.value
        : 0;
  const total = Math.max(0, subtotalAfterItems - orderDiscAmt);
  const now = new Date();

  const print = () => {
    const win = window.open("", "_blank", "width=420,height=600");
    if (!win) return;
    win.document.write(buildHtml());
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 250);
  };

  const buildHtml = () => {
    const rows = cart
      .map((i) => {
        const d = itemDiscounts[i.id];
        const eff =
          d && d.type === "percent"
            ? i.price * (1 - d.value / 100)
            : d && d.type === "fixed"
              ? Math.max(0, i.price - d.value)
              : i.price;
        return `
          <tr>
            <td>${esc(i.name)}</td>
            <td>${i.qty}</td>
            <td class="num">${eff.toFixed(2)}</td>
            <td class="num">${(eff * i.qty).toFixed(2)}</td>
          </tr>`;
      })
      .join("");
    const discRow =
      itemDiscountTotal > 0 || orderDiscAmt > 0
        ? `<tr><td colspan="3" class="lbl">${esc(t("cashier.discountApplied"))}</td><td class="num">-${(
            itemDiscountTotal + orderDiscAmt
          ).toFixed(2)}</td></tr>`
        : "";
    return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(t("cashier.receiptPreview"))}</title>
      <style>
        body{font-family:'Courier New',monospace;margin:0;padding:16px;color:#111;font-size:13px}
        h1{font-size:16px;margin:0 0 2px}
        .center{text-align:center}
        .muted{color:#666;font-weight:400}
        .divider{border-top:1px dashed #333;margin:8px 0}
        table{width:100%;border-collapse:collapse}
        td{padding:2px 0;vertical-align:top}
        td.num{text-align:right}
        td.lbl{color:#666}
        .total{font-size:15px;font-weight:bold}
        .foot{margin-top:8px;text-align:center;color:#333}
      </style></head><body>
      <div class="center">
      <img src="/assets/logos/logo-monochrome.png" alt="Paw-M Clinic" style="height:40px;width:40px;margin:0 auto 4px;display:block;margin-left:auto;margin-right:auto" aria-hidden="true" />
      <h1>${esc(settings.name)}</h1>
      ${settings.phone ? `<div class="muted">${esc(settings.phone)}</div>` : ""}
      ${settings.address ? `<div class="muted">${esc(settings.address)}</div>` : ""}</div>
      <div class="divider"></div>
      <div>${t("cashier.orderId")}: ${new Date().getTime().toString(36).toUpperCase()}</div>
      ${customer.name ? `<div>${esc(customer.name)}</div>` : ""}
      ${customer.phone ? `<div>${esc(customer.phone)}</div>` : ""}
      <div class="muted">${now.toLocaleString()}</div>
      <div class="divider"></div>
      <table><thead><tr><th>${esc(t("cashier.receiptItem"))}</th><th>${esc(t("cashier.receiptQty"))}</th><th>@</th><th class="num">${esc(t("cashier.receiptTotal"))}</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="divider"></div>
      <table>
        ${discRow}
        <tr class="total"><td colspan="3">${esc(t("cashier.total"))}</td><td class="num">${total.toFixed(
          2,
        )} ${esc(currency)}</td></tr>
      </table>
      <div class="divider"></div>
      <div class="foot">${esc(t("cashier.receiptThanks"))}</div>
      </body></html>`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ReceiptText className="size-5" />
            {t("cashier.receiptPreview")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 rounded-xl bg-muted/40 p-4 font-mono text-sm">
          <div className="flex flex-col items-center gap-1">
            <img
              src="/assets/logos/logo-monochrome.png"
              alt="Paw-M Clinic"
              className="h-10 w-10 shrink-0"
              decoding="async"
            />
            <p className="text-base font-bold">{settings.name}</p>
            {settings.phone && <p className="text-xs text-muted-foreground">{settings.phone}</p>}
            {settings.address && (
              <p className="text-xs text-muted-foreground">{settings.address}</p>
            )}
          </div>
          <div className="border-t border-dashed border-foreground/25 pt-2">
            <p className="text-xs text-muted-foreground">{now.toLocaleString()}</p>
            {customer.name && <p>{customer.name}</p>}
            {customer.phone && <p>{customer.phone}</p>}
          </div>
          <div className="border-t border-dashed border-foreground/25 pt-1">
            {cart.map((i) => (
              <div key={i.id} className="flex justify-between gap-2">
                <span className="flex-1 truncate">
                  {i.name}
                  <span className="text-muted-foreground"> × {i.qty}</span>
                </span>
                <span>
                  {(() => {
                    const d = itemDiscounts[i.id];
                    const eff =
                      d && d.type === "percent"
                        ? i.price * (1 - d.value / 100)
                        : d && d.type === "fixed"
                          ? Math.max(0, i.price - d.value)
                          : i.price;
                    return (eff * i.qty).toFixed(2);
                  })()}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-foreground/25 pt-2">
            {(itemDiscountTotal > 0 || orderDiscAmt > 0) && (
              <div className="flex justify-between text-destructive">
                <span>{t("cashier.discountApplied")}</span>
                <span>-{(itemDiscountTotal + orderDiscAmt).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold">
              <span>{t("cashier.total")}</span>
              <span>
                {total.toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cashier.close")}
          </Button>
          <Button onClick={print} className="gap-2">
            <Printer className="size-4" />
            {t("cashier.printReceipt")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
