import { describe, it, expect } from "vitest";
import { formatPrice, formatDate } from "./format";

describe("formatPrice", () => {
  it("formats with default EGP currency", () => {
    expect(formatPrice(10)).toBe("EGP 10.00");
    expect(formatPrice(0)).toBe("EGP 0.00");
    expect(formatPrice(123.456)).toBe("EGP 123.46");
  });

  it("formats with custom currency prefix", () => {
    expect(formatPrice(50, "$")).toBe("$50.00");
    expect(formatPrice(0, "EUR")).toBe("EUR 0.00");
  });

  it("handles negative values", () => {
    expect(formatPrice(-5)).toBe("EGP -5.00");
  });

  it("handles NaN/Infinity as 0", () => {
    expect(formatPrice(NaN)).toBe("EGP 0.00");
    expect(formatPrice(Infinity)).toBe("EGP 0.00");
  });
});

describe("formatDate", () => {
  it("formats a Date object", () => {
    const date = new Date("2026-01-15T00:00:00");
    const result = formatDate(date);
    expect(result).toBe("Jan 15, 2026");
  });

  it("formats an ISO string", () => {
    const result = formatDate("2026-03-22");
    expect(result).toBe("Mar 22, 2026");
  });

  it("returns '-' for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("-");
    expect(formatDate("")).toBe("-");
  });
});
