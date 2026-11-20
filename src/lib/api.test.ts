import { describe, expect, it } from "vitest";

import {
  ApiError,
  apiErrorMessage,
  apiErrorKey,
  localizedApiErrorMessage,
  type ApiErrorKey,
} from "@/lib/api";
import { DICTS } from "@/lib/i18n";

const FALLBACK = "Something went wrong — please try again.";
const t = (key: string) => `translated:${key}`;
const envelope = (status: number, message: string) =>
  new ApiError(status, `API ${status}: ${message}`);

const KNOWN_KEYS: ApiErrorKey[] = [
  "apiError.noEmployee",
  "apiError.suspended",
  "apiError.csrf",
  "apiError.rateLimited",
  "apiError.unreachable",
];

describe("apiErrorMessage", () => {
  it("keeps unknown backend text verbatim (existing behaviour)", () => {
    expect(apiErrorMessage(envelope(500, "Database is on fire"), FALLBACK)).toBe(
      "Database is on fire",
    );
    expect(apiErrorMessage(new Error("weird failure"), FALLBACK)).toBe("weird failure");
  });

  it("falls back when there is no usable error text", () => {
    expect(apiErrorMessage({}, FALLBACK)).toBe(FALLBACK);
    expect(apiErrorMessage(new Error(""), FALLBACK)).toBe(FALLBACK);
  });
});

describe("apiErrorKey", () => {
  it.each([
    [envelope(403, "No employee profile found for your account."), "apiError.noEmployee"],
    [
      envelope(403, '{"error":"No employee profile found for your account."}'),
      "apiError.noEmployee",
    ],
    [envelope(403, "Account suspended"), "apiError.suspended"],
    [envelope(403, "Account suspended — contact the clinic"), "apiError.suspended"],
    [envelope(403, "CSRF token mismatch"), "apiError.csrf"],
    [envelope(429, "Too Many Requests"), "apiError.rateLimited"],
    [new TypeError("Failed to fetch"), "apiError.unreachable"],
    [new Error("NetworkError when attempting to fetch resource."), "apiError.unreachable"],
  ])("maps %s to %s", (err, key) => {
    expect(apiErrorKey(err)).toBe(key);
  });

  it("recognises a 429 status even when the response text is generic", () => {
    expect(apiErrorKey(new ApiError(429, "API 429: slow down"))).toBe("apiError.rateLimited");
    expect(apiErrorKey({ status: 429, message: "slow down" })).toBe("apiError.rateLimited");
  });

  it("returns null for unknown failures", () => {
    expect(apiErrorKey(new Error("API 500: Database is on fire"))).toBeNull();
    expect(apiErrorKey(new Error("something odd"))).toBeNull();
    expect(apiErrorKey({})).toBeNull();
  });

  it("has English and Arabic copy for every recognised key", () => {
    for (const lang of ["en", "ar"] as const) {
      for (const key of KNOWN_KEYS) {
        expect(DICTS[lang][key]).toBeTruthy();
      }
    }
  });
});

describe("localizedApiErrorMessage", () => {
  it("localises known backend and transport failures", () => {
    expect(
      localizedApiErrorMessage(
        envelope(403, "No employee profile found for your account."),
        t,
        FALLBACK,
      ),
    ).toBe("translated:apiError.noEmployee");
    expect(localizedApiErrorMessage(envelope(403, "Account suspended"), t, FALLBACK)).toBe(
      "translated:apiError.suspended",
    );
    expect(localizedApiErrorMessage(envelope(403, "CSRF token mismatch"), t, FALLBACK)).toBe(
      "translated:apiError.csrf",
    );
    expect(localizedApiErrorMessage(envelope(429, "Too Many Requests"), t, FALLBACK)).toBe(
      "translated:apiError.rateLimited",
    );
    expect(localizedApiErrorMessage(new TypeError("Failed to fetch"), t, FALLBACK)).toBe(
      "translated:apiError.unreachable",
    );
  });

  it("surfaces unknown backend text verbatim and keeps the generic fallback", () => {
    expect(localizedApiErrorMessage(envelope(500, "Database is on fire"), t, FALLBACK)).toBe(
      "Database is on fire",
    );
    expect(localizedApiErrorMessage({}, t, FALLBACK)).toBe(FALLBACK);
  });

  it("does not regress to a raw i18n key when a translation is missing", () => {
    expect(
      localizedApiErrorMessage(envelope(403, "CSRF token mismatch"), (key) => key, FALLBACK),
    ).toBe(FALLBACK);
  });
});
