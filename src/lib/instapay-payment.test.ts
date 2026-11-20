import { describe, expect, it } from "vitest";

import { instapayAccountLabel, instapayLink, instapayQrText } from "@/lib/instapay-payment";

describe("InstaPay payment helper", () => {
  it("accepts only real http(s) or instapay links", () => {
    expect(instapayLink(" https://bank.example/pay ")).toBe("https://bank.example/pay");
    expect(instapayLink("instapay://pay/123")).toBe("instapay://pay/123");
    expect(instapayLink("01001234567")).toBeNull();
    expect(instapayLink("javascript:alert(1)")).toBeNull();
    expect(instapayLink("")).toBeNull();
  });

  it("uses the raw configured value as the account number", () => {
    expect(instapayAccountLabel(" 01001234567 ")).toBe("01001234567");
  });

  it("encodes the account and amount as readable QR text", () => {
    expect(instapayQrText(" 01001234567 ", "EGP 250.00")).toBe(
      "InstaPay\nAccount: 01001234567\nAmount: EGP 250.00",
    );
  });
});
