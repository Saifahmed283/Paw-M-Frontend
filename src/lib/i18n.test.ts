import { describe, expect, it } from "vitest";

import { DICTS, EN } from "@/lib/i18n";

describe("i18n dictionaries", () => {
  it("keeps Arabic and English keys in parity", () => {
    expect(Object.keys(DICTS.ar).sort()).toEqual(Object.keys(EN).sort());
  });

  it("adds verification copy in both languages", () => {
    const requiredKeys = [
      "checkout.notPaidYet",
      "checkout.notPaidNote",
      "track.senderAndRefRequired",
      "verif.bankRefRequired",
      "verif.reasonRequired",
      "verif.queueTitle",
      "verif.drawerTitle",
      "verif.drawerVariance",
      "verif.status.superseded",
      "dash.confirmCash",
      "dash.completeRequiresPayment",
      "cashier.paymentPendingNotice",
      "cashier.singleMethodOnly",
      "dash.payment-verification",
    ];

    for (const key of requiredKeys) {
      expect(EN[key], `missing English key ${key}`).toBeTruthy();
      expect(DICTS.ar[key], `missing Arabic key ${key}`).toBeTruthy();
    }
  });
});
