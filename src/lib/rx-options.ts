export type RxOptionDefaults = {
  dose?: string;
  frequency?: string;
  route?: string;
  duration?: string;
  note?: string;
};

export type RxCareCategory = {
  label: string;
  defaults?: RxOptionDefaults;
  items: string[];
};

export const RX_CARE_PLAN: Record<string, RxCareCategory[]> = {
  Dog: [
    {
      label: "Vaccination Schedule",
      defaults: { dose: "1 dose", route: "Subcutaneous", frequency: "Per protocol" },
      items: ["Rabies", "DHPP (3-year protocol)", "Bordetella", "Leptospirosis", "Lyme Disease"],
    },
    {
      label: "Parasite Prevention",
      defaults: { dose: "1 dose", frequency: "Monthly" },
      items: ["Flea, Tick & Mosquito Control", "Heartworm Prevention", "Intestinal Worm Control"],
    },
    {
      label: "Dental Health Check",
      defaults: { frequency: "During exam" },
      items: ["Dental Examination", "Dental Cleaning", "Oral Health & Nutrition"],
    },
    {
      label: "Nutrition Tips",
      defaults: { frequency: "During consult" },
      items: ["Balanced Diet Advice", "Weight Management", "Supplements Guidance"],
    },
  ],
  Cat: [
    {
      label: "Vaccination Schedule",
      defaults: { dose: "1 dose", route: "Subcutaneous", frequency: "Per protocol" },
      items: ["FVRCP", "FeLV", "Rabies", "Feline Leukemia (FeLV)", "FIP (if at risk)"],
    },
    {
      label: "Flea & Worm Control",
      defaults: { dose: "1 dose", frequency: "Monthly" },
      items: [
        "Flea Prevention",
        "Tick Prevention",
        "Intestinal Worm Control",
        "Heartworm Prevention (if needed)",
      ],
    },
    {
      label: "Litter Box Hygiene",
      defaults: { frequency: "Daily" },
      items: [
        "Litter Box Cleaning & Hygiene",
        "Odor Control",
        "Litter Box Training",
        "Multi-Cat Household Tips",
      ],
    },
    {
      label: "Senior Cat Care",
      defaults: { frequency: "As recommended" },
      items: [
        "Senior Cat Nutrition",
        "Regular Health Checks",
        "Mobility & Comfort Care",
        "Monitoring & Early Detection",
      ],
    },
  ],
};

export function carePlanFor(species: string): RxCareCategory[] {
  const key = Object.keys(RX_CARE_PLAN).find(
    (k) => k.toLowerCase() === species.trim().toLowerCase(),
  );
  return key ? (RX_CARE_PLAN[key] ?? []) : [];
}
