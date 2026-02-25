/**
 * Skin Type Quiz – questions and scoring
 *
 * Manually paste scraped questions/answers here. Keep this file as the single
 * source of truth so the app (and AI) can read it directly.
 *
 * SCORING: For each answer, list which skin type(s) it suggests and the weight (1 = weak, 2 = strong).
 * The quiz will sum weights per type and pick the highest (or use logic you add later).
 */

export type SkinTypeId =
  | "oily"
  | "dry"
  | "combination"
  | "normal"
  | "sensitive";

/** One answer option: label and how it affects each skin type score (optional weight, default 1). */
export interface QuizAnswer {
  label: string;
  /** Which skin type(s) this answer suggests; use weights to indicate strength (e.g. strong oily = 2). */
  scores: Partial<Record<SkinTypeId, number>>;
}

/** One multiple-choice question. */
export interface QuizQuestion {
  id: string;
  title: string;
  question: string;
  answers: QuizAnswer[];
}

/** All quiz questions in order. */
export interface SkinTypeQuizData {
  questions: QuizQuestion[];
  /** Optional: display names and descriptions for each result (for results screen). */
  resultDescriptions?: Partial<
    Record<SkinTypeId, { label: string; description?: string }>
  >;
}

/**
 * EXAMPLE – replace with your scraped content.
 * Copy the block below for each question; fill in id, question, and for each answer: label + scores.
 */
export const SKIN_TYPE_QUIZ: SkinTypeQuizData = {
  questions: [
    {
      id: "q1",
      title: "Hydration",
      question: "When you wake up in the morning, your skin feels:",
      answers: [
        { label: "Tight and in need of moisturizer", scores: { dry: 2 } },
        { label: "Comfortable and balanced", scores: { normal: 2 } },
        { label: "Oily in some areas", scores: { combination: 2 } },
        { label: "Oily all over", scores: { oily: 2 } },
      ],
    },
    {
      id: "q2",
      title: "Hydration",
      question: "By midday, your T-zone (forehead, nose, chin):",
      answers: [
        { label: "Still feels tight or normal", scores: { dry: 2 } },
        { label: "Has a slight shine", scores: { normal: 2 } },
        { label: "Is noticeably shiny", scores: { combination: 2 } },
        { label: "Is very oily and shiny", scores: { oily: 2 } },
      ],
    },
    {
      id: "q3",
      title: "Hydration",
      question:
        "How does your skin feel 2-3 hours after cleansing (without moisturizer)?",
      answers: [
        { label: "Very tight and uncomfortable", scores: { dry: 2 } },
        { label: "Slightly tight", scores: { normal: 2 } },
        { label: "Comfortable", scores: { combination: 2 } },
        { label: "Already showing oil", scores: { oily: 2 } },
      ],
    },
    {
      id: "q4",
      title: "Hydration",
      question: "Your pores are:",
      answers: [
        { label: "Barely visible", scores: { dry: 2 } },
        { label: "Small and fine", scores: { normal: 2 } },
        {
          label: "Visible, especially on nose and cheek",
          scores: { combination: 2 },
        },
        { label: "Large and visible across the face", scores: { oily: 2 } },
      ],
    },
    {
      id: "q5",
      title: "Hydration",
      question: "How often do you typically need to moisturize?",
      answers: [
        { label: "Multiple times a day", scores: { dry: 2 } },
        { label: "Twice daily (morning and night)", scores: { normal: 2 } },
        { label: "Once daily", scores: { combination: 2 } },
        { label: "Rarely or occasionally", scores: { oily: 2 } },
      ],
    },
    {
      id: "q6",
      title: "Reactivity",
      question: "When trying new skincare products, your skin:",
      answers: [
        {
          label: "Often breaks out, stings, or gets irritated",
          scores: { sensitive: 2 },
        },
        {
          label: "Sometimes reacts but usually adjusts",
          scores: { sensitive: 1, normal: 1 },
        },
        { label: "Rarely has reactions", scores: { normal: 2 } },
        { label: "Can handle almost anything", scores: { oily: 1, normal: 1 } },
      ],
    },
    {
      id: "q7",
      title: "Reactivity",
      question: "In windy or cold weather, your skin:",
      answers: [
        {
          label: "Becomes very red and irritated",
          scores: { sensitive: 2 },
        },
        { label: "Gets slightly red or tight", scores: { sensitive: 1, normal: 1 } },
        { label: "Feels a bit dry but manageable", scores: { dry: 1, combination: 1 } },
        { label: "Doesn't seem affected", scores: { oily: 1, normal: 1 } },
      ],
    },
    {
      id: "q8",
      title: "Reactivity",
      question: "Fragranced products (perfumes, scented lotions):",
      answers: [
        {
          label: "Always cause irritation or breakouts",
          scores: { sensitive: 2 },
        },
        { label: "Sometimes cause problems", scores: { sensitive: 1, normal: 1 } },
        { label: "Rarely bother you", scores: { normal: 2 } },
        { label: "Never cause issues", scores: { oily: 1, normal: 1 } },
      ],
    },
    {
      id: "q9",
      title: "Reactivity",
      question: "After sun exposure (even with sunscreen), your skin:",
      answers: [
        {
          label: "Gets very red and burns easily",
          scores: { sensitive: 2 },
        },
        { label: "Sometimes gets pink or burns", scores: { sensitive: 1, normal: 1 } },
        {
          label: "Tans gradually with minimal burning",
          scores: { combination: 1, normal: 1 },
        },
        { label: "Rarely burns, tans easily", scores: { oily: 1, normal: 1 } },
      ],
    },
    {
      id: "q10",
      title: "Reactivity",
      question:
        "How does your skin react to stress, hormonal changes, or diet?",
      answers: [
        {
          label: "Very noticeable reactions (breakouts, redness, sensitivity)",
          scores: { sensitive: 2 },
        },
        {
          label: "Some reactions during major changes",
          scores: { sensitive: 1, normal: 1 },
        },
        { label: "Mild reactions occasionally", scores: { combination: 1, normal: 1 } },
        { label: "Skin stays pretty much the same", scores: { oily: 1, normal: 1 } },
      ],
    },
    {
      id: "q11",
      title: "Reactivity",
      question: "Retinol or acid products (AHA/BHA):",
      answers: [
        {
          label: "Cause irritation even in small amounts",
          scores: { sensitive: 2 },
        },
        {
          label: "Need to be introduced very slowly",
          scores: { sensitive: 1, normal: 1 },
        },
        {
          label: "Can be tolerated with gradual introduction",
          scores: { combination: 1, normal: 1 },
        },
        { label: "Can use regularly without issue", scores: { oily: 1, normal: 1 } },
      ],
    },
    {
      id: "q12",
      title: "Pigmentation",
      question: "When you get a pimple or minor injury, afterward you:",
      answers: [
        {
          label: "Almost always get a dark mark that lasts months",
          scores: { sensitive: 1 },
        },
        {
          label: "Sometimes get marks that fade slowly",
          scores: { normal: 2 },
        },
        {
          label: "Occasionally get marks that fade within a few weeks",
          scores: { combination: 1, normal: 1 },
        },
        { label: "Rarely get any lasting marks", scores: { oily: 1, normal: 1 } },
      ],
    },
    {
      id: "q13",
      title: "Pigmentation",
      question: "Your skin tone on your face is:",
      answers: [
        {
          label: "Very uneven with many dark spots or patches",
          scores: { sensitive: 1 },
        },
        {
          label: "Somewhat uneven with some spots",
          scores: { normal: 2 },
        },
        {
          label: "Mostly even with few to no spots",
          scores: { combination: 1, normal: 1 },
        },
        { label: "Very even with few to no spots", scores: { oily: 1, normal: 1 } },
      ],
    },
    {
      id: "q14",
      title: "Pigmentation",
      question: "In the past, sun exposure has caused:",
      answers: [
        {
          label: "Many freckles, sun spots, or melasma",
          scores: { sensitive: 1 },
        },
        {
          label: "Some freckles or spots",
          scores: { normal: 2 },
        },
        {
          label: "Occasional light freckling",
          scores: { combination: 1, normal: 1 },
        },
        { label: "Very little pigmentation change", scores: { oily: 1, normal: 1 } },
      ],
    },
    {
      id: "q15",
      title: "Pigmentation",
      question: "Your family history includes:",
      answers: [
        {
          label: "Many relatives with melasma, sun spots, or uneven skin tone",
          scores: { sensitive: 1 },
        },
        {
          label: "Some relatives with pigmentation issues",
          scores: { normal: 2 },
        },
        {
          label: "Few relatives with these issues",
          scores: { combination: 1, normal: 1 },
        },
        {
          label: "No family history of pigmentation problems",
          scores: { oily: 1, normal: 1 },
        },
      ],
    },
    {
      id: "q16",
      title: "Pigmentation",
      question: "When you tan:",
      answers: [
        {
          label: "You burn and develop uneven pigmentation",
          scores: { sensitive: 1 },
        },
        {
          label: "You tan unevenly with some spots",
          scores: { normal: 2 },
        },
        {
          label: "You tan fairly evenly",
          scores: { combination: 1, normal: 1 },
        },
        { label: "You tan very evenly without spots", scores: { oily: 1, normal: 1 } },
      ],
    },
    // Add more questions in the same format:
    // {
    //   id: "q2",
    //   question: "...",
    //   answers: [
    //     { label: "...", scores: { oily: 1, dry: 0 } },
    //   ],
    // },
  ],

  resultDescriptions: {
    oily: {
      label: "Oily",
      description:
        "Your skin produces more sebum than it needs, especially in the T-zone. Pores may look larger and skin can look shiny within a few hours of cleansing. Lightweight, non-comedogenic products and gentle oil control (without over-stripping) work best.",
    },
    dry: {
      label: "Dry",
      description:
        "Your skin doesn’t hold onto moisture well and can feel tight or flaky, especially after cleansing or in dry air. Focus on hydrating serums, barrier-supporting moisturizers, and avoiding harsh or stripping products.",
    },
    combination: {
      label: "Combination",
      description:
        "Your skin is oily in the T-zone (forehead, nose, chin) and drier or normal on the cheeks. Use targeted products: lighter or oil-controlling options in the T-zone and more hydration where needed elsewhere.",
    },
    normal: {
      label: "Normal",
      description:
        "Your skin is well-balanced—not overly oily or dry, and it tolerates most products without strong reactions. A consistent routine with a gentle cleanser, light moisturizer, and daily sunscreen will help maintain its health.",
    },
    sensitive: {
      label: "Sensitive",
      description:
        "Your skin reacts easily to new products, fragrance, or environmental factors (wind, cold, sun). Choose fragrance-free, soothing formulas and patch-test new products. Strengthening the barrier can help over time.",
    },
  },
};

/** Display labels for the five score axes (used on results screen). */
export const SKIN_TYPE_DISPLAY_LABELS: Record<SkinTypeId, string> = {
  oily: "Oiliness",
  dry: "Dryness",
  combination: "T-zone / combination",
  normal: "Balance",
  sensitive: "Sensitivity",
};

/** Gemstone Skin Type name and tagline for results hero (e.g. "QUARTZ 💎 Clear and resilient"). */
export const GEMSTONE_BY_SKIN_TYPE: Record<
  SkinTypeId,
  { name: string; tagline: string }
> = {
  oily: { name: "Quartz", tagline: "Clear and resilient" },
  dry: { name: "Pearl", tagline: "Nourished and luminous" },
  combination: { name: "Topaz", tagline: "Balanced and radiant" },
  normal: { name: "Diamond", tagline: "Clear and balanced" },
  sensitive: { name: "Rose Quartz", tagline: "Calm and soothed" },
};

/** One step in a routine: label shown to user + full product names for lookup in boutique. */
export interface RoutineStep {
  label: string;
  productNames: string[];
}

/** Routine notes: AM/PM steps with labels and linked product names (match getSkincareCarouselItems). */
export const ROUTINE_NOTES_BY_SKIN_TYPE: Partial<
  Record<
    SkinTypeId,
    { am: RoutineStep[]; pm: RoutineStep[]; optional?: { label: string; productNames: string[] } }
  >
> = {
  oily: {
    am: [
      {
        label: "Simply Clean or Gentle Cleanser",
        productNames: [
          "SkinCeuticals Simply Clean | Gentle Foaming Cleanser for All Skin Types",
          "SkinCeuticals Gentle Cleanser | Soothing Cream Cleanser for Dry & Sensitive Skin",
        ],
      },
      {
        label: "Phloretin CF or Silymarin CF",
        productNames: [
          "SkinCeuticals Phloretin CF | Antioxidant Serum for Environmental Damage & Uneven Skin Tone",
          "SkinCeuticals Silymarin CF | Antioxidant Serum for Oily & Acne-Prone Skin",
        ],
      },
      {
        label: "Blemish + Age Defense",
        productNames: [
          "SkinCeuticals Blemish + Age Defense | Targeted Serum for Acne and Signs of Aging",
        ],
      },
      {
        label: "P-Tiox",
        productNames: [
          "SkinCeuticals P-Tiox | Glass Skin Serum for Skin Protection & Repair",
        ],
      },
      {
        label: "On The Daily SPF 45 or Let's Get Physical Tinted SPF 44",
        productNames: [
          "The Treatment On The Daily SPF 45 | Lightweight Sunscreen for Daily Protection",
          "The Treatment Let's Get Physical Tinted SPF 44 | Lightweight Tinted Sunscreen with Broad Spectrum Protection",
        ],
      },
    ],
    pm: [
      {
        label: "Simply Clean or LHA Cleanser",
        productNames: [
          "SkinCeuticals Simply Clean | Gentle Foaming Cleanser for All Skin Types",
          "SkinCeuticals LHA Cleanser | Exfoliating Face Wash for Acne-Prone & Congested Skin",
        ],
      },
      {
        label: "Retinol 0.5",
        productNames: [
          "SkinCeuticals Retinol 0.5% | Anti-Aging Serum for Wrinkles & Skin Renewal",
        ],
      },
      {
        label: "P-Tiox",
        productNames: [
          "SkinCeuticals P-Tiox | Glass Skin Serum for Skin Protection & Repair",
        ],
      },
      {
        label: "Daily Moisture",
        productNames: [
          "SkinCeuticals Daily Moisture | Lightweight Hydrating Moisturizer for All Skin Types",
        ],
      },
    ],
    optional: {
      label: "Glycolic 10 Renew Overnight 1–2×/week",
      productNames: [
        "SkinCeuticals Glycolic 10 Renew Overnight | Exfoliating Night Serum for Smoother, Radiant Skin",
      ],
    },
  },
  dry: {
    am: [
      {
        label: "Replenishing Cleanser or Gentle Cleanser",
        productNames: [
          "SkinCeuticals Replenishing Cleanser | Hydrating Face Wash for Dry & Sensitive Skin",
          "SkinCeuticals Gentle Cleanser | Soothing Cream Cleanser for Dry & Sensitive Skin",
        ],
      },
      {
        label: "Hyaluronic Acid Intensifier",
        productNames: [
          "SkinCeuticals Hyaluronic Acid Intensifier | Multi-Glycan Hydrating Serum for Plump & Smooth Skin",
        ],
      },
      {
        label: "Hydrating B5 Gel",
        productNames: [
          "SkinCeuticals Hydrating B5 Gel | Lightweight Moisturizer with Vitamin B5 for Deep Skin Hydration",
        ],
      },
      {
        label: "Triple Lipid Restore or Emollience",
        productNames: [
          "SkinCeuticals Triple Lipid Restore 2:4:2 | Anti-Aging Moisturizer for Skin Barrier Repair & Hydration",
          "SkinCeuticals Emollience | Hydrating Moisturizer for Normal to Dry Skin",
        ],
      },
      {
        label: "On The Daily SPF 45",
        productNames: [
          "The Treatment On The Daily SPF 45 | Lightweight Sunscreen for Daily Protection",
        ],
      },
    ],
    pm: [
      {
        label: "Replenishing Cleanser or Gentle Cleanser",
        productNames: [
          "SkinCeuticals Replenishing Cleanser | Hydrating Face Wash for Dry & Sensitive Skin",
          "SkinCeuticals Gentle Cleanser | Soothing Cream Cleanser for Dry & Sensitive Skin",
        ],
      },
      {
        label: "Daily Ceramide Comfort",
        productNames: [
          "GM Collin Daily Ceramide Comfort | Nourishing Skin Barrier Capsules for Hydration & Repair (20 Ct.)",
        ],
      },
      {
        label: "Hydrating B5 Gel",
        productNames: [
          "SkinCeuticals Hydrating B5 Gel | Lightweight Moisturizer with Vitamin B5 for Deep Skin Hydration",
        ],
      },
      {
        label: "Renew Overnight or Hydra Balm",
        productNames: [
          "SkinCeuticals Renew Overnight | Intensive Night Cream for Dry & Dehydrated Skin",
          "SkinCeuticals Hydra Balm | Intensive Moisturizing Balm for Compromised, Dry & Dehydrated Skin",
        ],
      },
    ],
    optional: {
      label: "Hydrating B5 Mask 1–2×/week",
      productNames: [
        "SkinCeuticals Hydrating B5 Mask | Nourishing Face Mask with Vitamin B5 for Intense Moisture",
      ],
    },
  },
  combination: {
    am: [
      {
        label: "Simply Clean or Gentle Cleanser",
        productNames: [
          "SkinCeuticals Simply Clean | Gentle Foaming Cleanser for All Skin Types",
          "SkinCeuticals Gentle Cleanser | Soothing Cream Cleanser for Dry & Sensitive Skin",
        ],
      },
      {
        label: "Silymarin CF or Phyto Corrective Gel",
        productNames: [
          "SkinCeuticals Silymarin CF | Antioxidant Serum for Oily & Acne-Prone Skin",
          "SkinCeuticals Phyto Corrective Gel | Soothing Hydrating Serum for Redness & Sensitive Skin",
        ],
      },
      {
        label: "Hydrating B5 Gel",
        productNames: [
          "SkinCeuticals Hydrating B5 Gel | Lightweight Moisturizer with Vitamin B5 for Deep Skin Hydration",
        ],
      },
      {
        label: "Equalizing Toner (T-zone)",
        productNames: [
          "SkinCeuticals Equalizing Toner | Alcohol-Free Toner for Balanced, Refreshed Skin",
        ],
      },
      {
        label: "Daily Moisture",
        productNames: [
          "SkinCeuticals Daily Moisture | Lightweight Hydrating Moisturizer for All Skin Types",
        ],
      },
      {
        label: "On The Daily SPF 45",
        productNames: [
          "The Treatment On The Daily SPF 45 | Lightweight Sunscreen for Daily Protection",
        ],
      },
    ],
    pm: [
      {
        label: "Simply Clean or Gentle Cleanser",
        productNames: [
          "SkinCeuticals Simply Clean | Gentle Foaming Cleanser for All Skin Types",
          "SkinCeuticals Gentle Cleanser | Soothing Cream Cleanser for Dry & Sensitive Skin",
        ],
      },
      {
        label: "Hydrating B5 Gel",
        productNames: [
          "SkinCeuticals Hydrating B5 Gel | Lightweight Moisturizer with Vitamin B5 for Deep Skin Hydration",
        ],
      },
      {
        label: "Daily Moisture",
        productNames: [
          "SkinCeuticals Daily Moisture | Lightweight Hydrating Moisturizer for All Skin Types",
        ],
      },
    ],
    optional: {
      label: "Phyto Corrective Masque 1×/week",
      productNames: [
        "SkinCeuticals Phyto Corrective Masque | Soothing Hydrating Mask for Redness & Sensitive Skin",
      ],
    },
  },
  normal: {
    am: [
      {
        label: "Simply Clean",
        productNames: [
          "SkinCeuticals Simply Clean | Gentle Foaming Cleanser for All Skin Types",
        ],
      },
      {
        label: "C E Ferulic or P-Tiox",
        productNames: [
          "SkinCeuticals C E Ferulic | Antioxidant Vitamin C Serum for Brightening & Anti-Aging",
          "SkinCeuticals P-Tiox | Glass Skin Serum for Skin Protection & Repair",
        ],
      },
      {
        label: "Hydrating B5 Gel",
        productNames: [
          "SkinCeuticals Hydrating B5 Gel | Lightweight Moisturizer with Vitamin B5 for Deep Skin Hydration",
        ],
      },
      {
        label: "Daily Moisture",
        productNames: [
          "SkinCeuticals Daily Moisture | Lightweight Hydrating Moisturizer for All Skin Types",
        ],
      },
      {
        label: "On The Daily SPF 45 or Let's Get Physical Tinted SPF 44",
        productNames: [
          "The Treatment On The Daily SPF 45 | Lightweight Sunscreen for Daily Protection",
          "The Treatment Let's Get Physical Tinted SPF 44 | Lightweight Tinted Sunscreen with Broad Spectrum Protection",
        ],
      },
    ],
    pm: [
      {
        label: "Simply Clean",
        productNames: [
          "SkinCeuticals Simply Clean | Gentle Foaming Cleanser for All Skin Types",
        ],
      },
      {
        label: "P-Tiox",
        productNames: [
          "SkinCeuticals P-Tiox | Glass Skin Serum for Skin Protection & Repair",
        ],
      },
      {
        label: "Hydrating B5 Gel",
        productNames: [
          "SkinCeuticals Hydrating B5 Gel | Lightweight Moisturizer with Vitamin B5 for Deep Skin Hydration",
        ],
      },
      {
        label: "Daily Moisture",
        productNames: [
          "SkinCeuticals Daily Moisture | Lightweight Hydrating Moisturizer for All Skin Types",
        ],
      },
    ],
    optional: {
      label: "Retinol 0.3 or 0.5 2–3×/week",
      productNames: [
        "SkinCeuticals Retinol 0.3% | Anti-Aging Serum for Wrinkles & Skin Renewal",
        "SkinCeuticals Retinol 0.5% | Anti-Aging Serum for Wrinkles & Skin Renewal",
      ],
    },
  },
  sensitive: {
    am: [
      {
        label: "Sensiderm Cleansing Milk or Soothing Cleanser",
        productNames: [
          "GM Collin Sensiderm Cleansing Milk | Gentle Cleanser for Sensitive & Irritated Skin",
          "SkinCeuticals Soothing Cleanser | Gentle Face Wash for Sensitive & Irritated Skin",
        ],
      },
      {
        label: "Phyto Corrective Gel",
        productNames: [
          "SkinCeuticals Phyto Corrective Gel | Soothing Hydrating Serum for Redness & Sensitive Skin",
        ],
      },
      {
        label: "Triple Lipid Restore or Epidermal Repair",
        productNames: [
          "SkinCeuticals Triple Lipid Restore 2:4:2 | Anti-Aging Moisturizer for Skin Barrier Repair & Hydration",
          "SkinCeuticals Epidermal Repair | Calming Therapeutic Treatment for Compromised or Sensitive Skin",
        ],
      },
      {
        label: "On The Daily SPF 45",
        productNames: [
          "The Treatment On The Daily SPF 45 | Lightweight Sunscreen for Daily Protection",
        ],
      },
    ],
    pm: [
      {
        label: "Sensiderm Cleansing Milk or Soothing Cleanser",
        productNames: [
          "GM Collin Sensiderm Cleansing Milk | Gentle Cleanser for Sensitive & Irritated Skin",
          "SkinCeuticals Soothing Cleanser | Gentle Face Wash for Sensitive & Irritated Skin",
        ],
      },
      {
        label: "Redness Neutralizer",
        productNames: [
          "SkinCeuticals Redness Neutralizer | Soothing Serum for Sensitive & Redness-Prone Skin",
        ],
      },
      {
        label: "Triple Lipid Restore or Epidermal Repair",
        productNames: [
          "SkinCeuticals Triple Lipid Restore 2:4:2 | Anti-Aging Moisturizer for Skin Barrier Repair & Hydration",
          "SkinCeuticals Epidermal Repair | Calming Therapeutic Treatment for Compromised or Sensitive Skin",
        ],
      },
    ],
    optional: {
      label: "Phyto Corrective Masque 1×/week",
      productNames: [
        "SkinCeuticals Phyto Corrective Masque | Soothing Hydrating Mask for Redness & Sensitive Skin",
      ],
    },
  },
};

/** In-person treatment recommendations per skin type for "Your personalized treatment recommendations" section. */
export const TREATMENT_RECOMMENDATIONS_BY_SKIN_TYPE: Partial<
  Record<SkinTypeId, { heading: string; items: string[] }>
> = {
  oily: {
    heading: "Balanced, clear skin — ideal for advanced rejuvenation",
    items: [
      "Sofwave/Ultherapy – Tightens and improves skin quality",
      "Sculptra – Collagen and structural support",
      "Fillers – For contour and volume",
      "PRFM Microneedling – Collagen stimulation and textural improvement with brightening benefits",
    ],
  },
  dry: {
    heading: "Hydration and renewal",
    items: [
      "Hydrafacial – Deep hydration and gentle exfoliation",
      "PRP/PRFM – Natural growth factors for rejuvenation",
      "Laser resurfacing – Texture and tone improvement",
      "Custom facials – Nourishing, barrier-supporting treatments",
    ],
  },
  combination: {
    heading: "Balance and radiance",
    items: [
      "Hydrafacial – Balance and clarity",
      "Chemical peels – Refine T-zone, nourish cheeks",
      "Microneedling – Texture and glow",
      "LED therapy – Calm and clarify",
    ],
  },
  normal: {
    heading: "Maintain and enhance",
    items: [
      "Sofwave/Ultherapy – Maintain firmness and quality",
      "Chemical peels – Radiance and clarity",
      "Microneedling – Collagen and texture",
      "Custom facials – Tailored to your goals",
    ],
  },
  sensitive: {
    heading: "Gentle, calming treatments",
    items: [
      "Hydrafacial – Soothing, hydrating cleanse",
      "LED therapy – Calm and reduce redness",
      "Custom gentle facials – Fragrance-free, barrier-supporting",
      "PRP – Natural healing and rejuvenation",
    ],
  },
};

/** Short advice line when this type appears as a secondary tendency. */
export const SECONDARY_TENDENCY_ADVICE: Partial<Record<SkinTypeId, string>> = {
  oily: "Consider lightweight, non-comedogenic products in oilier areas.",
  dry: "Add extra hydration where skin feels tight; avoid over-cleansing.",
  combination: "You may benefit from using different products on the T-zone vs cheeks.",
  normal: "Keep a simple, consistent routine to maintain balance.",
  sensitive: "Patch-test new products and favor fragrance-free, soothing options.",
};

// ---------------------------------------------------------------------------
// Scoring: answer index (0-based) per question id → total per skin type → winner
// ---------------------------------------------------------------------------

/** Display order for skin type score breakdown. */
export const SKIN_TYPE_SCORE_ORDER: SkinTypeId[] = [
  "oily",
  "dry",
  "combination",
  "normal",
  "sensitive",
];

/**
 * Compute per–skin-type scores from quiz answers (for results screen charts).
 * @param answersByQuestionId Map of question id → selected answer index (0-based)
 * @returns Scores for each skin type
 */
export function computeQuizScores(
  answersByQuestionId: Record<string, number>
): Record<SkinTypeId, number> {
  const totals: Record<SkinTypeId, number> = {
    oily: 0,
    dry: 0,
    combination: 0,
    normal: 0,
    sensitive: 0,
  };
  for (const q of SKIN_TYPE_QUIZ.questions) {
    const answerIndex = answersByQuestionId[q.id];
    if (answerIndex == null || answerIndex < 0 || answerIndex >= q.answers.length)
      continue;
    const answer = q.answers[answerIndex];
    for (const [type, weight] of Object.entries(answer.scores)) {
      if (type in totals) totals[type as SkinTypeId] += weight;
    }
  }
  return totals;
}

/**
 * Compute skin type result from quiz answers.
 * @param answersByQuestionId Map of question id → selected answer index (0-based)
 * @returns The skin type with the highest total score; ties broken by order: oily < dry < combination < normal < sensitive
 */
export function computeQuizResult(
  answersByQuestionId: Record<string, number>
): SkinTypeId {
  return computeQuizProfile(answersByQuestionId).primary;
}

/** Profile: primary type, optional secondary tendency, and raw scores. */
export interface SkinProfile {
  primary: SkinTypeId;
  secondary?: SkinTypeId;
  scores: Record<SkinTypeId, number>;
}

/** Score gap under which we show a "with X tendency" secondary (e.g. 2 points). */
const SECONDARY_THRESHOLD = 2;

/**
 * Compute full profile from quiz answers (primary, optional secondary, scores).
 * Secondary is set when the second-highest type is within SECONDARY_THRESHOLD of primary.
 */
export function computeQuizProfile(
  answersByQuestionId: Record<string, number>
): SkinProfile {
  const scores = computeQuizScores(answersByQuestionId);
  const ordered = [...SKIN_TYPE_SCORE_ORDER].sort(
    (a, b) => (scores[b] ?? 0) - (scores[a] ?? 0)
  );
  const primary = ordered[0] as SkinTypeId;
  const primaryScore = scores[primary] ?? 0;
  const second = ordered[1] as SkinTypeId;
  const secondScore = scores[second] ?? 0;
  const secondary =
    second !== primary && primaryScore - secondScore <= SECONDARY_THRESHOLD
      ? second
      : undefined;
  return { primary, secondary, scores };
}

/**
 * Human-readable result label and description from a profile.
 * Used on the results screen and stored in the quiz payload.
 */
export function getResultSummary(profile: SkinProfile): {
  label: string;
  description: string;
} {
  const desc = SKIN_TYPE_QUIZ.resultDescriptions?.[profile.primary];
  const primaryLabel = desc?.label ?? profile.primary;
  const label = profile.secondary
    ? `${primaryLabel} with ${(SKIN_TYPE_QUIZ.resultDescriptions?.[profile.secondary]?.label ?? profile.secondary)} tendency`
    : primaryLabel;
  const parts: string[] = [];
  if (desc?.description) parts.push(desc.description);
  if (profile.secondary && SECONDARY_TENDENCY_ADVICE[profile.secondary])
    parts.push(SECONDARY_TENDENCY_ADVICE[profile.secondary]!);
  const description = parts.join(" ");
  return { label, description };
}

// ---------------------------------------------------------------------------
// Skin type → product names (must match names in treatmentBoutiqueProducts / getSkincareCarouselItems)
// Aligned with RECOMMENDED_PRODUCTS_BY_CONTEXT Skincare categories where possible.
// ---------------------------------------------------------------------------

export const SKIN_TYPE_TO_PRODUCTS: Record<SkinTypeId, string[]> = {
  dry: [
    "SkinCeuticals Hyaluronic Acid Intensifier | Multi-Glycan Hydrating Serum for Plump & Smooth Skin",
    "SkinCeuticals Hydrating B5 Gel | Lightweight Moisturizer with Vitamin B5 for Deep Skin Hydration",
    "GM Collin Daily Ceramide Comfort | Nourishing Skin Barrier Capsules for Hydration & Repair (20 Ct.)",
    "SkinCeuticals Triple Lipid Restore 2:4:2 | Anti-Aging Moisturizer for Skin Barrier Repair & Hydration",
    "SkinCeuticals Hydra Balm | Intensive Moisturizing Balm for Compromised, Dry & Dehydrated Skin",
    "SkinCeuticals Renew Overnight | Intensive Night Cream for Dry & Dehydrated Skin",
    "SkinCeuticals Emollience | Hydrating Moisturizer for Normal to Dry Skin",
  ],
  oily: [
    "SkinCeuticals Blemish + Age Defense | Targeted Serum for Acne and Signs of Aging",
    "SkinCeuticals Silymarin CF | Antioxidant Serum for Oily & Acne-Prone Skin",
    "SkinCeuticals Purifying Cleanser | Deep Cleansing Face Wash for Oily & Acne-Prone Skin",
    "Skinceuticals Clarifying Clay Mask | Detoxifying Face Mask for Oil Control",
    "SkinCeuticals Daily Moisture | Lightweight Hydrating Moisturizer for All Skin Types",
    "The TreatMINT Cooling Clay Mask | Detoxifying & Refreshing Face Mask for Clear Skin",
  ],
  combination: [
    "SkinCeuticals Daily Moisture | Lightweight Hydrating Moisturizer for All Skin Types",
    "SkinCeuticals Hydrating B5 Gel | Lightweight Moisturizer with Vitamin B5 for Deep Skin Hydration",
    "SkinCeuticals Silymarin CF | Antioxidant Serum for Oily & Acne-Prone Skin",
    "SkinCeuticals Equalizing Toner | Alcohol-Free Toner for Balanced, Refreshed Skin",
    "SkinCeuticals Phyto Corrective Gel | Soothing Hydrating Serum for Redness & Sensitive Skin",
    "The Treatment On The Daily SPF 45 | Lightweight Sunscreen for Daily Protection",
  ],
  normal: [
    "SkinCeuticals Daily Moisture | Lightweight Hydrating Moisturizer for All Skin Types",
    "SkinCeuticals Simply Clean | Gentle Foaming Cleanser for All Skin Types",
    "SkinCeuticals P-Tiox | Glass Skin Serum for Skin Protection & Repair",
    "SkinCeuticals C E Ferulic | Antioxidant Vitamin C Serum for Brightening & Anti-Aging",
    "The Treatment On The Daily SPF 45 | Lightweight Sunscreen for Daily Protection",
    "SkinCeuticals Hydrating B5 Gel | Lightweight Moisturizer with Vitamin B5 for Deep Skin Hydration",
  ],
  sensitive: [
    "GM Collin Sensiderm Cleansing Milk | Gentle Cleanser for Sensitive & Irritated Skin",
    "SkinCeuticals Triple Lipid Restore 2:4:2 | Anti-Aging Moisturizer for Skin Barrier Repair & Hydration",
    "SkinCeuticals Phyto Corrective Gel | Soothing Hydrating Serum for Redness & Sensitive Skin",
    "The Treatment On The Daily SPF 45 | Lightweight Sunscreen for Daily Protection",
    "SkinCeuticals Soothing Cleanser | Gentle Face Wash for Sensitive & Irritated Skin",
    "SkinCeuticals Redness Neutralizer | Soothing Serum for Sensitive & Redness-Prone Skin",
    "SkinCeuticals Epidermal Repair | Calming Therapeutic Treatment for Compromised or Sensitive Skin",
  ],
};

/**
 * Why we recommend each product (for quiz results UI).
 * Shown as "Recommended for: …" under each product. Key = exact product name from SKIN_TYPE_TO_PRODUCTS.
 */
export const RECOMMENDED_PRODUCT_REASONS: Record<string, string> = {
  "SkinCeuticals Hyaluronic Acid Intensifier | Multi-Glycan Hydrating Serum for Plump & Smooth Skin":
    "Deep hydration & plumping",
  "SkinCeuticals Hydrating B5 Gel | Lightweight Moisturizer with Vitamin B5 for Deep Skin Hydration":
    "Lightweight hydration",
  "GM Collin Daily Ceramide Comfort | Nourishing Skin Barrier Capsules for Hydration & Repair (20 Ct.)":
    "Barrier repair & hydration",
  "SkinCeuticals Triple Lipid Restore 2:4:2 | Anti-Aging Moisturizer for Skin Barrier Repair & Hydration":
    "Barrier repair & hydration",
  "SkinCeuticals Hydra Balm | Intensive Moisturizing Balm for Compromised, Dry & Dehydrated Skin":
    "Intensive moisture for dry skin",
  "SkinCeuticals Renew Overnight | Intensive Night Cream for Dry & Dehydrated Skin":
    "Night hydration",
  "SkinCeuticals Emollience | Hydrating Moisturizer for Normal to Dry Skin":
    "Hydration for normal to dry",
  "SkinCeuticals Blemish + Age Defense | Targeted Serum for Acne and Signs of Aging":
    "Acne & oil control, anti-aging",
  "SkinCeuticals Silymarin CF | Antioxidant Serum for Oily & Acne-Prone Skin":
    "Oil control & antioxidant protection",
  "SkinCeuticals Purifying Cleanser | Deep Cleansing Face Wash for Oily & Acne-Prone Skin":
    "Deep cleansing, oil control",
  "Skinceuticals Clarifying Clay Mask | Detoxifying Face Mask for Oil Control":
    "Oil control & clarifying",
  "SkinCeuticals Daily Moisture | Lightweight Hydrating Moisturizer for All Skin Types":
    "Lightweight hydration, all skin types",
  "The TreatMINT Cooling Clay Mask | Detoxifying & Refreshing Face Mask for Clear Skin":
    "Detoxifying & clear skin",
  "SkinCeuticals Equalizing Toner | Alcohol-Free Toner for Balanced, Refreshed Skin":
    "Balance & refresh",
  "SkinCeuticals Phyto Corrective Gel | Soothing Hydrating Serum for Redness & Sensitive Skin":
    "Soothing redness & sensitivity",
  "The Treatment On The Daily SPF 45 | Lightweight Sunscreen for Daily Protection":
    "Daily sun protection",
  "SkinCeuticals Simply Clean | Gentle Foaming Cleanser for All Skin Types":
    "Gentle cleansing",
  "SkinCeuticals P-Tiox | Glass Skin Serum for Skin Protection & Repair":
    "Protection & repair",
  "SkinCeuticals C E Ferulic | Antioxidant Vitamin C Serum for Brightening & Anti-Aging":
    "Brightening & antioxidant protection",
  "GM Collin Sensiderm Cleansing Milk | Gentle Cleanser for Sensitive & Irritated Skin":
    "Gentle cleansing for sensitive skin",
  "SkinCeuticals Soothing Cleanser | Gentle Face Wash for Sensitive & Irritated Skin":
    "Gentle cleansing for sensitive skin",
  "SkinCeuticals Redness Neutralizer | Soothing Serum for Sensitive & Redness-Prone Skin":
    "Redness & sensitivity",
  "SkinCeuticals Epidermal Repair | Calming Therapeutic Treatment for Compromised or Sensitive Skin":
    "Calming & barrier repair",
};

/**
 * Return recommended product names for a skin type (from our boutique list).
 * Use with getSkincareCarouselItems() or TREATMENT_BOUTIQUE_SKINCARE to resolve to full product objects.
 */
export function getRecommendedProductsForSkinType(skinType: SkinTypeId): string[] {
  return [...(SKIN_TYPE_TO_PRODUCTS[skinType] ?? [])];
}

// ---------------------------------------------------------------------------
// Persistence: build payload for Airtable "Skincare Quiz" long text field
// ---------------------------------------------------------------------------

/** Airtable field name for the skincare quiz JSON (same in Patients and Web Popup Leads). */
export const SKINCARE_QUIZ_FIELD_NAME = "Skincare Quiz";

/**
 * Build the object to store in Airtable "Skincare Quiz" (long text) as JSON.
 * Use with updateLeadRecord(recordId, tableName, { [SKINCARE_QUIZ_FIELD_NAME]: JSON.stringify(payload) }).
 */
export function buildSkincareQuizPayload(answersByQuestionId: Record<string, number>): {
  version: 1;
  completedAt: string;
  answers: Record<string, number>;
  result: SkinTypeId;
  recommendedProductNames: string[];
  resultLabel?: string;
  resultDescription?: string;
  secondary?: SkinTypeId;
} {
  const profile = computeQuizProfile(answersByQuestionId);
  const { label: resultLabel, description: resultDescription } =
    getResultSummary(profile);
  return {
    version: 1,
    completedAt: new Date().toISOString(),
    answers: { ...answersByQuestionId },
    result: profile.primary,
    recommendedProductNames: getRecommendedProductsForSkinType(profile.primary),
    resultLabel,
    resultDescription,
    secondary: profile.secondary,
  };
}
