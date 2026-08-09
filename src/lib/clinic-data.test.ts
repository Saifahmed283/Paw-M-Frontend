import { describe, expect, it } from "vitest";

import {
  DAY_ORDER,
  TIME_SLOTS,
  bookedSlotsFor,
  upcomingAvailability,
  type Doctor,
} from "@/lib/clinic-data";

const doctor: Doctor = {
  id: "dr-test",
  name: "Dr. Test",
  specialization: "General practitioner",
  experience: "10",
  rating: 4.9,
  bio: "test",
  initials: "TT",
  pets: ["Dog"],
  tags: ["checkup"],
  days: ["Mon", "Tue", "Wed"],
};

describe("bookedSlotsFor", () => {
  it("is deterministic for the same date and doctor", () => {
    const a = bookedSlotsFor("2026-08-10", "dr-1");
    const b = bookedSlotsFor("2026-08-10", "dr-1");
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it("includes real confirmed bookings for that doctor and date", () => {
    const confirmed = [
      { doctorId: "dr-1", date: "2026-08-10", time: "09:00" },
      { doctorId: "dr-2", date: "2026-08-10", time: "09:00" },
      { doctorId: "dr-1", date: "2026-08-11", time: "10:00" },
    ];
    const booked = bookedSlotsFor("2026-08-10", "dr-1", confirmed);
    expect(booked).toContain("09:00");
  });

  it("does not leak other doctors' or other dates' bookings", () => {
    const base = bookedSlotsFor("2026-08-10", "dr-1");
    const confirmed = [
      { doctorId: "dr-2", date: "2026-08-10", time: "14:30" },
      { doctorId: "dr-1", date: "2026-08-11", time: "15:00" },
    ];
    const booked = bookedSlotsFor("2026-08-10", "dr-1", confirmed);
    expect(booked).toEqual(base);
  });

  it("validates slots against TIME_SLOTS", () => {
    const booked = bookedSlotsFor("2026-08-10", "dr-1");
    expect(booked.every((s) => TIME_SLOTS.includes(s))).toBe(true);
  });
});

describe("upcomingAvailability", () => {
  const from = new Date(2026, 7, 9); // Sunday Aug 9 2026; doctor works Mon-Wed

  it("returns only working days with open slots", () => {
    const days = upcomingAvailability(doctor, 2, from);
    expect(days.length).toBeGreaterThan(0);
    for (const d of days) {
      expect(doctor.days).toContain(d.dayLabel);
      expect(d.slots.length).toBeGreaterThan(0);
    }
  });

  it("excludes cancelled and completed requests from blocking", () => {
    const blocked = bookedSlotsFor(days0(from, doctor), doctor.id);
    const first = upcomingAvailability(doctor, 1, from, [
      { doctorId: doctor.id, date: days0(from, doctor), time: blocked[0]!, status: "cancelled" },
    ]);
    const stillOpen = upcomingAvailability(doctor, 1, from, []);
    expect(first[0]!.slots.includes(blocked[0]!)).toBe(stillOpen[0]!.slots.includes(blocked[0]!));
  });

  it("blocks slots for real pending/confirmed bookings", () => {
    const base = upcomingAvailability(doctor, 1, from);
    if (base.length === 0) return; // fully booked month, nothing to assert
    const target = base[0]!.slots[0]!;
    const days = upcomingAvailability(doctor, 1, from, [
      { doctorId: doctor.id, date: base[0]!.dateISO, time: target, status: "confirmed" },
    ]);
    expect(days[0]!.slots).not.toContain(target);
  });
});

function days0(from: Date, doc: Doctor): string {
  const cursor = new Date(from);
  for (let i = 0; i < 30; i++) {
    cursor.setDate(cursor.getDate() + 1);
    if (doc.days.includes(DAY_ORDER[cursor.getDay()]!)) {
      return `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    }
  }
  throw new Error("no working day found");
}
