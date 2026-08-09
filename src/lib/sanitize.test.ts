import { describe, expect, it } from "vitest";

import {
  mailtoHref,
  sanitizeEmail,
  sanitizePhone,
  sanitizeWhatsapp,
  telHref,
  waMeHref,
} from "@/lib/sanitize";

describe("sanitizePhone", () => {
  it("keeps dialable characters", () => {
    expect(sanitizePhone("+1 (415) 555-0100")).toBe("+1 (415) 555-0100");
  });

  it("strips letters and control chars", () => {
    expect(sanitizePhone("abc123\n\t")).toBe("123");
    expect(sanitizePhone("javascript:alert(1)")).toBe("(1)");
  });
});

describe("sanitizeWhatsapp", () => {
  it("keeps only digits", () => {
    expect(sanitizeWhatsapp("+1 (415) 555-0911")).toBe("14155550911");
  });
});

describe("sanitizeEmail", () => {
  it("accepts a valid email", () => {
    expect(sanitizeEmail(" Alex@Example.COM ")).toBe("alex@example.com");
  });

  it("rejects invalid emails", () => {
    expect(sanitizeEmail("not an email")).toBeNull();
    expect(sanitizeEmail("a@b")).toBeNull();
    expect(sanitizeEmail("a b@c.com")).toBeNull();
  });
});

describe("telHref", () => {
  it("builds a tel: link", () => {
    expect(telHref("+1 (415) 555 0911")).toBe("tel:+1 (415) 555 0911");
  });

  it("returns null for empty input", () => {
    expect(telHref("")).toBeNull();
    expect(telHref("abc")).toBeNull();
  });

  it("never emits javascript:", () => {
    expect(telHref("javascript:alert(1)")).toMatch(/^tel:/);
  });
});

describe("mailtoHref", () => {
  it("builds a mailto: link for a valid email", () => {
    expect(mailtoHref("hello@pawcare.clinic")).toBe("mailto:hello@pawcare.clinic");
  });

  it("blocks header-injection vectors", () => {
    expect(mailtoHref("x@y.com?bcc=attacker@evil")).toBeNull();
    expect(mailtoHref('x@y.com"><script>')).toBeNull();
  });

  it("returns null for invalid input", () => {
    expect(mailtoHref("")).toBeNull();
    expect(mailtoHref("nope")).toBeNull();
  });
});

describe("waMeHref", () => {
  it("builds a wa.me link from digits", () => {
    expect(waMeHref("+14155550911")).toBe("https://wa.me/14155550911");
  });

  it("returns null when no digits exist", () => {
    expect(waMeHref("call us")).toBeNull();
    expect(waMeHref("")).toBeNull();
  });
});
