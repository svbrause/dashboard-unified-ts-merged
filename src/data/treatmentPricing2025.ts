/**
 * The Treatment Skin Boutique – Price List 2025
 * Sourced from PRICE LIST 2025.pdf. Use for display and treatment meta price ranges.
 */

export interface TreatmentPriceItem {
  name: string;
  price: number;
  note?: string;
}

/** Category used in the dashboard (maps to ALL_TREATMENTS). */
export type DashboardTreatmentCategory =
  | "Skincare"
  | "Laser"
  | "Chemical Peel"
  | "Microneedling"
  | "Filler"
  | "Neurotoxin"
  | "Biostimulants"
  | "Kybella"
  | "Threadlift";

/** All 2025 prices by PDF section (for reference and lookup). */
export const TREATMENT_PRICE_LIST_2025: {
  category: string;
  items: TreatmentPriceItem[];
}[] = [
  {
    category: "Consultations",
    items: [
      { name: "Acne Consultation", price: 150 },
      { name: "Cosmelan Consultation", price: 150 },
      { name: "Injectable Consultation", price: 150 },
      { name: "Laser Consultation", price: 150 },
      { name: "Ultherapy Consultation", price: 150 },
      { name: "Hair Restoration Consultation", price: 150 },
    ],
  },
  {
    category: "Injectables",
    items: [
      { name: "Botox 1-Unit", price: 13, note: "CA locations only" },
      { name: "Dysport 1-Unit", price: 5.2, note: "CA locations only" },
      { name: "Botox Sweating Treatment", price: 995 },
      { name: "Botox – Henderson (1–50u vial)", price: 650 },
      { name: "Dysport – Henderson (1–300u vial)", price: 995 },
      { name: "Fillers (except Voluma & Volux)", price: 750 },
      { name: "Voluma", price: 850 },
      { name: "Volux", price: 950 },
      { name: "Radiesse", price: 900 },
      { name: "Radiesse – 2 Syringes", price: 1530 },
      { name: "Radiesse – 3 Syringes", price: 2295 },
      { name: "Radiesse – 4 Syringes", price: 2880 },
      { name: "Radiesse – 5 Syringes", price: 3510 },
      { name: "Radiesse – 6 Syringes", price: 4050 },
      { name: "Sculptra – 1 Vial", price: 800 },
      { name: "Sculptra – 3 Vials", price: 2250 },
      { name: "Sculptra – 4 Vials", price: 3000 },
      { name: "Sculptra – 5 Vials", price: 3500 },
      { name: "Sculptra – 6 Vials", price: 4000 },
      { name: "Sculptra – 8 Vials", price: 5200 },
      { name: "Skinvive II", price: 750 },
      { name: "Skinvive III Add-On Syringe", price: 375 },
      { name: "Spider Vein Treatment", price: 750 },
      { name: "Spider Vein Treatment Package (3)", price: 2025 },
    ],
  },
  {
    category: "Other Treatments",
    items: [
      { name: "Filler Dissolver", price: 300 },
      { name: "Pronox Treatment", price: 75 },
      { name: "Vitamin B-12 Shot", price: 25 },
      { name: "Cortisone Shot", price: 50 },
      { name: "Zapping Treatment (Milia/Sebaceous Hyperplasia)", price: 150 },
      { name: "Light Stim Add-On", price: 40, note: "Esti services only" },
      { name: "Nerve Block", price: 25 },
    ],
  },
  {
    category: "Facial Services",
    items: [
      { name: "Focused Facial", price: 75 },
      { name: "Acne Facial", price: 150 },
      { name: "Calming Facial", price: 150 },
      { name: "Signature Facial", price: 150 },
      { name: "Treatman Facial", price: 150 },
      { name: "Treat Yourself Facial", price: 200 },
      { name: "Glass Skin Facial", price: 250 },
      { name: "Dermaplaning", price: 150 },
      { name: "Dermasweep", price: 150 },
      { name: "Dermasweep – Face, Neck & Chest", price: 275 },
      { name: "Dermasweep w/ Premium Infusion", price: 225 },
      { name: "Dermasweep w/ Premium Infusion – Face, Neck & Chest", price: 325 },
    ],
  },
  {
    category: "Chemical Peel",
    items: [
      { name: "Brightening Lactic Peel – Full Face", price: 85 },
      { name: "Brightening Lactic Peel – Full Back", price: 225 },
      { name: "Brightening Lactic Peel – Upper Back", price: 165 },
      { name: "Jessner's Peel – Full Face", price: 180 },
      { name: "Jessner's Peel – Face & Neck or Chest", price: 270 },
      { name: "Jessner's Peel – Face, Neck & Chest", price: 360 },
      { name: "Jessner's Peel – Full Back", price: 415 },
      { name: "Jessner's Peel – Upper Back", price: 355 },
      { name: "Sal-X Plus Acne Peel – Full Face", price: 125 },
      { name: "Sal-X Plus Acne Peel – Face, Neck & Chest", price: 250 },
      { name: "Sal-X Plus Acne Peel – Face, Neck or Chest", price: 180 },
      { name: "Sal-X Plus Acne Peel – Full Back", price: 310 },
      { name: "Sal-X Plus Acne Peel – Upper Back", price: 245 },
      { name: "Cosmelan MD Peel", price: 900 },
      { name: "Lactic Peel Add-On", price: 50, note: "Esti services only" },
    ],
  },
  {
    category: "Sofwave",
    items: [
      { name: "Sofwave – Full Face", price: 2850, note: "Claremont only" },
      { name: "Sofwave – Full Face + Neck", price: 3900 },
      { name: "Sofwave – Lower Face", price: 2000 },
      { name: "Sofwave – Lower Face + Neck", price: 3150 },
      { name: "Sofwave – Neck", price: 1650 },
      { name: "Sofwave – Brows", price: 800 },
    ],
  },
  {
    category: "Ultherapy",
    items: [
      { name: "Ultherapy – Full Face", price: 3500, note: "Newport only" },
      { name: "Ultherapy – Full Face + Neck", price: 4000 },
      { name: "Ultherapy – Lower Face", price: 2500 },
      { name: "Ultherapy – Lower Face + Neck", price: 3500 },
      { name: "Ultherapy – Upper Face", price: 1500 },
      { name: "Ultherapy – Neck", price: 2000 },
      { name: "Ultherapy – Brows", price: 500 },
    ],
  },
  {
    category: "Laser",
    items: [
      { name: "Moxi Full Face", price: 550 },
      { name: "Moxi Face, Neck & Chest", price: 995 },
      { name: "Moxi Neck", price: 400 },
      { name: "Moxi Chest", price: 550 },
      { name: "Moxi Hands", price: 350 },
      { name: "BBL Full Face", price: 550 },
      { name: "BBL Face, Neck & Chest", price: 995 },
      { name: "BBL Neck", price: 400 },
      { name: "BBL Chest", price: 550 },
      { name: "BBL Hands", price: 350 },
      { name: "BBL Full Arms & Hands", price: 995 },
      { name: "BBL Upper Arms", price: 600 },
      { name: "BBL Forearms", price: 600 },
      { name: "BBL Full Back", price: 850 },
      { name: "BBL Upper Back", price: 550 },
      { name: "BBL Lower Back", price: 550 },
      { name: "BBL Full Legs", price: 1075 },
      { name: "BBL Upper Legs/Thighs", price: 850 },
      { name: "BBL Lower Legs", price: 650 },
      { name: "BBL Spot Treatment", price: 250 },
      { name: "BBL + Moxi Full Face", price: 750 },
      { name: "BBL + Moxi Face, Neck & Chest", price: 1150 },
      { name: "BBL + Moxi Neck", price: 500 },
      { name: "BBL + Moxi Chest", price: 650 },
      { name: "BBL + Moxi Arms & Hands", price: 1095 },
      { name: "BBL + Moxi Hands", price: 450 },
      { name: "Moxi Full Face 3PK", price: 1485 },
      { name: "Moxi Face, Neck & Chest 3PK", price: 2687 },
      { name: "BBL Full Face 3PK", price: 1485 },
      { name: "BBL + Moxi Full Face 3PK", price: 2025 },
      { name: "BBL + Moxi Face, Neck & Chest 3PK", price: 3105 },
    ],
  },
  {
    category: "Medical Spa",
    items: [
      { name: "Microneedling", price: 500, note: "CA locations only" },
      { name: "Microneedling & PRFM Add-On Neck or Chest", price: 250 },
      { name: "PRFM Microneedling", price: 775, note: "CA locations only" },
      { name: "PRFM Hair Restoration", price: 750, note: "CA locations only" },
      { name: "PRFM Injections", price: 750, note: "CA locations only" },
      { name: "PRFM Additional Tube", price: 250 },
      { name: "Microneedling (Henderson)", price: 300 },
      { name: "PRFM Microneedling (Henderson)", price: 550 },
      { name: "PRFM Hair Restoration (Henderson)", price: 500 },
      { name: "PRFM Injections (Henderson)", price: 500 },
      { name: "Microneedling 5PK", price: 2000, note: "CA" },
      { name: "Microneedling 5PK (Henderson)", price: 1200 },
      { name: "PRFM Microneedling 5PK", price: 3100, note: "CA" },
      { name: "PRFM Microneedling 5PK (Henderson)", price: 2200 },
      { name: "PRFM Hair Restoration 5PK (Henderson)", price: 2000 },
      { name: "PRFM Injections 5PK (Henderson)", price: 2000 },
    ],
  },
];

/** Format price for display. */
export function formatPrice(price: number): string {
  if (price % 1 === 0) return `$${price.toLocaleString()}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

/** Get min and max price from a list of items. */
function getMinMax(items: TreatmentPriceItem[]): { min: number; max: number } {
  if (items.length === 0) return { min: 0, max: 0 };
  const prices = items.map((i) => i.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** All items that map to a dashboard category (for price range). */
function getItemsForDashboardCategory(
  category: DashboardTreatmentCategory
): TreatmentPriceItem[] {
  const flat: TreatmentPriceItem[] = [];
  for (const section of TREATMENT_PRICE_LIST_2025) {
    if (
      section.category === "Injectables" &&
      (category === "Filler" || category === "Neurotoxin" || category === "Biostimulants")
    ) {
      const injectables = section.items;
      if (category === "Neurotoxin") {
        flat.push(
          ...injectables.filter(
            (i) =>
              i.name.includes("Botox") ||
              i.name.includes("Dysport") ||
              i.name.includes("Sweating")
          )
        );
      } else if (category === "Filler") {
        flat.push(
          ...injectables.filter(
            (i) =>
              i.name.includes("Filler") ||
              i.name.includes("Voluma") ||
              i.name.includes("Volux") ||
              i.name.includes("Dissolver")
          )
        );
      } else if (category === "Biostimulants") {
        flat.push(
          ...injectables.filter(
            (i) =>
              i.name.includes("Radiesse") ||
              i.name.includes("Sculptra") ||
              i.name.includes("Skinvive")
          )
        );
      }
    } else if (
      section.category === "Facial Services" &&
      category === "Skincare"
    ) {
      flat.push(...section.items);
    } else if (
      section.category === "Chemical Peel" &&
      category === "Chemical Peel"
    ) {
      flat.push(...section.items);
    } else if (section.category === "Laser" && category === "Laser") {
      flat.push(...section.items);
    } else if (section.category === "Sofwave" && category === "Laser") {
      flat.push(...section.items);
    } else if (section.category === "Ultherapy" && category === "Laser") {
      flat.push(...section.items);
    } else if (
      section.category === "Medical Spa" &&
      category === "Microneedling"
    ) {
      flat.push(
        ...section.items.filter(
          (i) =>
            i.name.includes("Microneedling") || i.name.includes("PRFM")
        )
      );
    }
  }
  return flat;
}

/**
 * Price range string for dashboard treatment category (from 2025 list).
 * Use in TREATMENT_META.priceRange. Returns undefined if no 2025 prices map to that category.
 */
export function getPriceRange2025(
  category: DashboardTreatmentCategory
): string | undefined {
  const items = getItemsForDashboardCategory(category);
  if (items.length === 0) return undefined;
  const { min, max } = getMinMax(items);
  if (min === max) return formatPrice(min);
  return `${formatPrice(min)}–${formatPrice(max)}`;
}

/**
 * Full flat list of all 2025 services with price and category (for search/display).
 */
export function getAllPrices2025(): (TreatmentPriceItem & { category: string })[] {
  const out: (TreatmentPriceItem & { category: string })[] = [];
  for (const section of TREATMENT_PRICE_LIST_2025) {
    for (const item of section.items) {
      out.push({ ...item, category: section.category });
    }
  }
  return out;
}
