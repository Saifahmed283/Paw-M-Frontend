import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clinicTodayISO,
  localISODate,
  localTodayISO,
} from "@/components/dashboard/dashboard-format";

describe("clinicTodayISO", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses the Africa/Cairo day, not the UTC day (summer, UTC+3)", () => {
    vi.useFakeTimers();
    // 22:30 UTC on 1 June is already 01:30 on 2 June in Cairo.
    vi.setSystemTime(new Date("2026-06-01T22:30:00.000Z"));
    expect(clinicTodayISO()).toBe("2026-06-02");
  });

  it("uses the Africa/Cairo day in winter too (UTC+2)", () => {
    vi.useFakeTimers();
    // 22:30 UTC on 15 January rolls over to 00:30 on 16 January in Cairo.
    vi.setSystemTime(new Date("2026-01-15T22:30:00.000Z"));
    expect(clinicTodayISO()).toBe("2026-01-16");
  });

  it("always returns a zero-padded YYYY-MM-DD key", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T10:00:00.000Z")); // 12:00 in Cairo
    expect(clinicTodayISO()).toBe("2026-01-02");
    expect(clinicTodayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("leaves localTodayISO on the browser's own calendar", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T10:00:00.000Z"));
    expect(localTodayISO()).toBe(localISODate(new Date()));
  });
});
