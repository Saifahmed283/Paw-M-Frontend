import { describe, expect, it } from "vitest";

import { RX_CARE_PLAN, carePlanFor } from "@/lib/rx-options";

describe("rx care plan options", () => {
  it("defines plans for dog and cat", () => {
    expect(Object.keys(RX_CARE_PLAN)).toContain("Dog");
    expect(Object.keys(RX_CARE_PLAN)).toContain("Cat");
  });

  it("has non-empty categories with non-empty items", () => {
    for (const species of Object.keys(RX_CARE_PLAN)) {
      for (const category of RX_CARE_PLAN[species] ?? []) {
        expect(category.label.length).toBeGreaterThan(0);
        expect(category.items.length).toBeGreaterThan(0);
        for (const item of category.items) {
          expect(item.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("includes the dog wellness items", () => {
    const dogItems = (RX_CARE_PLAN["Dog"] ?? []).flatMap((c) => c.items);
    expect(dogItems).toContain("Rabies");
    expect(dogItems).toContain("DHPP (3-year protocol)");
    expect(dogItems).toContain("Heartworm Prevention");
    expect(dogItems).toContain("Dental Cleaning");
    expect(dogItems).toContain("Weight Management");
  });

  it("includes the cat wellness items", () => {
    const catItems = (RX_CARE_PLAN["Cat"] ?? []).flatMap((c) => c.items);
    expect(catItems).toContain("FVRCP");
    expect(catItems).toContain("FIP (if at risk)");
    expect(catItems).toContain("Litter Box Training");
    expect(catItems).toContain("Senior Cat Nutrition");
  });

  it("matches species names case-insensitively", () => {
    expect(carePlanFor("dog")).toEqual(RX_CARE_PLAN["Dog"] ?? []);
    expect(carePlanFor(" CAT ")).toEqual(RX_CARE_PLAN["Cat"] ?? []);
  });

  it("returns an empty plan for unknown species", () => {
    expect(carePlanFor("Rabbit")).toEqual([]);
    expect(carePlanFor("")).toEqual([]);
  });

  it("provides defaults on the vaccination category", () => {
    for (const species of Object.keys(RX_CARE_PLAN)) {
      const vac = (RX_CARE_PLAN[species] ?? []).find((c) => c.label === "Vaccination Schedule");
      expect(vac?.defaults?.dose).toBe("1 dose");
      expect(vac?.defaults?.route).toBe("Subcutaneous");
    }
  });
});
