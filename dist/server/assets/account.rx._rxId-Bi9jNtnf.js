import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Copy, Printer } from "lucide-react";
import { toast } from "sonner";
import { aC as Route, u as useI18n, B as Button } from "./router-bUAwJbNn.js";
import { C as Card, c as CardContent } from "./card-tcQ3aelV.js";
import { C as ClientAuthGate } from "./ClientAuthGate-B6FL1ypd.js";
import { B as Breadcrumbs } from "./Breadcrumbs-BvH_GNc7.js";
import { e as getPrescription } from "./client-medical-awJ0PRFZ.js";
import { P as PrintCss, a as PrescriptionDocument } from "./PrescriptionDocument-Dc22I2D2.js";
import "react";
import "motion/react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./server-nkD8CjI6.js";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "@tanstack/router-core/ssr/server";
import "node:async_hooks";
import "h3-v2";
import "tiny-invariant";
import "seroval";
import "@tanstack/react-router/ssr/server";
import "./input-DoZjCe2M.js";
import "./label-DedY5Dfk.js";
import "@radix-ui/react-label";
import "qrcode";
function RxPage() {
  const {
    rxId
  } = Route.useParams();
  const {
    t
  } = useI18n();
  const {
    data: rx,
    isLoading,
    error
  } = useQuery({
    queryKey: ["prescription", rxId],
    queryFn: () => getPrescription(rxId),
    retry: 1
  });
  const copyNumber = async () => {
    if (!rx) return;
    try {
      await navigator.clipboard.writeText(rx.rxNumber);
      toast.success("Prescription number copied");
    } catch {
      toast.error("Could not copy");
    }
  };
  return /* @__PURE__ */ jsxs(ClientAuthGate, { children: [
    /* @__PURE__ */ jsx(PrintCss, {}),
    /* @__PURE__ */ jsx("section", { className: "hero-gradient min-h-screen pb-24 pt-32 sm:pt-40", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-5 sm:px-8", children: [
      /* @__PURE__ */ jsx(Breadcrumbs, { items: [{
        label: t("crumb.home"),
        to: "/"
      }, {
        label: "My Account",
        to: "/account"
      }, {
        label: "Prescriptions",
        to: "/account"
      }, {
        label: (rx == null ? void 0 : rx.rxNumber) ?? "Rx",
        to: `/account/rx/${rxId}`
      }] }),
      isLoading && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-16 text-center text-sm text-muted-foreground", children: "Loading…" }) }),
      error && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "py-16 text-center text-sm text-muted-foreground", children: [
        "This prescription could not be loaded.",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/account", className: "text-primary underline-offset-4 hover:underline", children: "Back to My Account" })
      ] }) }),
      rx && /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "no-print flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxs(Link, { to: "/account", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }),
            " My Account"
          ] }) }),
          /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: copyNumber, children: [
            /* @__PURE__ */ jsx(Copy, { className: "size-4" }),
            " ",
            rx.rxNumber
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", className: "ml-auto shadow-glow", onClick: () => window.print(), children: [
            /* @__PURE__ */ jsx(Printer, { className: "size-4" }),
            " Print / Save PDF"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "print-sheet overflow-hidden rounded-2xl border border-border shadow-card", children: /* @__PURE__ */ jsx(PrescriptionDocument, { rx }) }),
        /* @__PURE__ */ jsx("p", { className: "no-print text-center text-xs text-muted-foreground", children: "Show the printed copy when collecting medication. The QR code lets any clinic verify this prescription instantly." })
      ] })
    ] }) })
  ] });
}
export {
  RxPage as component
};
