import type { DiscussedItem } from "../types";
import type { TreatmentChapter } from "./blueprintTreatmentChapters";
import type {
  BlueprintAnalysisOverviewSnapshot,
  PlanTreatmentRow,
} from "./postVisitBlueprintAnalysis";
import {
  formatTreatmentPlanRecordMetaLine,
  getCheckoutDisplayName,
  getDisplayAreaForItem,
  TREATMENT_PLAN_BULLET,
} from "../components/modals/DiscussedTreatmentsModal/utils";
import { patientFacingSkincareShortName } from "./pvbSkincareDisplay";
import {
  buildChapterAnalysisParagraph,
  getChapterOverviewMergedConcerns,
  maybeAppendIntroScanBridge,
  type ChapterOverviewAnalysisInput,
} from "./pvbChapterOverviewFromAnalysis";

/** One plan line for chapter overview: skincare uses short names and avoids repeating product in meta. */
function buildChapterPlanBulletLine(item: DiscussedItem): string {
  const isSkincare = (item.treatment ?? "").trim().toLowerCase() === "skincare";
  const rawLabel = getCheckoutDisplayName(item);
  const label = isSkincare ? patientFacingSkincareShortName(rawLabel) : rawLabel;
  if (!isSkincare) {
    const meta = formatTreatmentPlanRecordMetaLine(item);
    return meta ? `${label} — ${meta}` : label;
  }
  const area = getDisplayAreaForItem(item);
  const metaParts: string[] = [];
  if (area) metaParts.push(area);
  if (item.quantity && String(item.quantity).trim()) {
    metaParts.push(`Qty: ${item.quantity}`);
  }
  const meta = metaParts.join(TREATMENT_PLAN_BULLET);
  return meta ? `${label} — ${meta}` : label;
}

function formatEnglishList(items: string[]): string {
  const clean = items.map((s) => s.trim()).filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0] ?? "";
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")}, and ${clean[clean.length - 1]}`;
}

/** One short sentence: what this category does technically (after the client-specific lead). */
const TREATMENT_CATEGORY_INTRO: Partial<Record<string, string>> = {
  Skincare: "It supports your home routine and in-office results.",
  "Energy Device": "It uses light or controlled heat to improve tone, texture, and collagen signaling.",
  Laser: "It refreshes tone and texture and supports collagen renewal over a series.",
  "Chemical Peel": "It speeds surface renewal for clarity and fine lines.",
  Microneedling: "It stimulates collagen; often paired with topicals for texture and scars.",
  Filler: "It restores volume and contour where structure has changed.",
  Neurotoxin: "It softens dynamic lines by relaxing specific muscles.",
  Biostimulants: "It encourages gradual collagen and structural improvement.",
  Kybella: "It reduces small, defined fat pockets (often under the chin).",
  Threadlift: "It lifts and supports tissue for mild sagging.",
  PRP: "It uses your own growth factors to support rejuvenation.",
  PDGF: "It supports tissue repair and quality in targeted areas.",
};

/**
 * Top-of-page copy: connects listed chapters to scan findings / focus areas / visit themes.
 */
export function buildPvbPlanBridgeParagraph(
  chapterDisplayNames: string[],
  snapshot: BlueprintAnalysisOverviewSnapshot | null,
  globalInsights: { interests: string[]; findings: string[] },
): string | null {
  if (chapterDisplayNames.length === 0) return null;
  const list = formatEnglishList(chapterDisplayNames);
  const out: string[] = [];
  out.push(
    `The sections below cover ${list}—each with context, videos from your team, and—where available—real patient examples.`,
  );

  const findingParts: string[] = [];
  if (snapshot?.detectedIssueLabels?.length) {
    findingParts.push(...snapshot.detectedIssueLabels.slice(0, 8));
  }
  for (const f of globalInsights.findings.slice(0, 6)) {
    const t = f.trim();
    if (t && !findingParts.some((x) => x.toLowerCase() === t.toLowerCase())) {
      findingParts.push(t);
    }
  }

  const focusNames =
    snapshot?.areas?.filter((a) => a.hasInterest).map((a) => a.name) ?? [];
  const extraInterests = globalInsights.interests.slice(0, 6);

  if (findingParts.length) {
    const f = formatEnglishList(findingParts);
    if (focusNames.length) {
      out.push(
        `Together, these options address findings from your assessment (${f}) while respecting the regions you wanted to prioritize (${formatEnglishList(focusNames)}).`,
      );
    } else {
      out.push(
        `They were chosen to work with patterns noted in your scan (${f}) and what you discussed with your provider.`,
      );
    }
  } else if (focusNames.length) {
    out.push(
      `They align with the areas you emphasized during your visit (${formatEnglishList(focusNames)}).`,
    );
  } else if (extraInterests.length) {
    out.push(
      `They reflect what you shared as priorities: ${formatEnglishList(extraInterests)}.`,
    );
  }

  return out.join(" ");
}

/** Shape of the patient’s chapter list—drives holistic “whole plan” framing copy. */
export type PvbMainOverviewPlanShape = {
  chapterCount: number;
  /** Plan includes a Skincare chapter (home regimen / products). */
  includesSkincare: boolean;
  /** At least one non-skincare treatment chapter (procedures, injectables, devices, etc.). */
  includesInOfficeOrProcedures: boolean;
};

export type PvbMainOverviewPersonalization = {
  goals?: string[];
  findings?: string[];
  focusAreas?: string[];
  chapterNames?: string[];
  /** Per-item interests from discussed items (e.g. "wrinkle prevention", "hydration"). */
  interests?: string[];
  /** Per-item display areas (e.g. "forehead", "lower face"). */
  displayAreas?: string[];
  patientFirstName?: string;
  ageRange?: string | null;
  skinType?: string | null;
};

function dedupeText(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of items) {
    const t = raw.trim();
    if (!t) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}

/**
 * Opening copy for the top “Personalized Treatment Overview”: emphasizes that this is one
 * coordinated plan (home care, maintenance, aesthetics) rather than disconnected items.
 * Returns two short paragraphs so the typewriter paces them separately.
 */
export function buildPvbMainPlanFramingParagraphs(
  shape: PvbMainOverviewPlanShape,
  personalization?: PvbMainOverviewPersonalization | null,
): string[] {
  if (shape.chapterCount <= 0) return [];

  const goals = dedupeText(personalization?.goals ?? []).slice(0, 3);
  const findings = dedupeText(personalization?.findings ?? []).slice(0, 3);
  const focus = dedupeText(personalization?.focusAreas ?? []).slice(0, 2);
  const interests = dedupeText(personalization?.interests ?? []).slice(0, 3);
  const areas = dedupeText(personalization?.displayAreas ?? []).slice(0, 3);
  const namedChapters = dedupeText(personalization?.chapterNames ?? []).slice(0, 4);
  const firstName = personalization?.patientFirstName?.trim() || "";
  const ageRange = personalization?.ageRange?.trim() || "";
  const skinType = personalization?.skinType?.trim() || "";

  const forName = firstName ? `For ${firstName}` : "For you";

  let open: string;
  if (goals.length > 0 && findings.length > 0) {
    open = `${forName}, this plan was built around ${formatEnglishList(goals)}\u2014informed by what your analysis found, including ${formatEnglishList(findings)}.`;
  } else if (goals.length > 0) {
    open = `${forName}, this plan is designed around ${formatEnglishList(goals)}.${focus.length > 0 ? ` Your provider focused on ${formatEnglishList(focus)}.` : ""}`;
  } else if (findings.length > 0 && areas.length > 0) {
    open = `${forName}, this plan was put together for ${formatEnglishList(areas)}, to address ${formatEnglishList(findings)}\u2014the concerns your team tied to those areas during your visit and assessment.`;
  } else if (findings.length > 0) {
    open = `${forName}, your team identified ${formatEnglishList(findings)}\u2014the plan below addresses each of these.`;
  } else if (interests.length > 0 && areas.length > 0) {
    open = `${forName}, this plan targets ${formatEnglishList(interests)} across ${formatEnglishList(areas)}, based on what you discussed with your provider.`;
  } else if (interests.length > 0) {
    open = `${forName}, this plan is focused on ${formatEnglishList(interests)}, based on what came up during your visit.`;
  } else if (areas.length > 0) {
    open = `${forName}, this plan was put together to address ${formatEnglishList(areas)}, based on your visit.`;
  } else if (namedChapters.length > 0) {
    open = `${forName}, your provider put together a plan covering ${formatEnglishList(namedChapters)} based on what you discussed during your visit.`;
  } else {
    open = `${forName}, your provider put together this plan based on what you discussed during your visit.`;
  }

  const profileParts: string[] = [];
  if (ageRange) profileParts.push(ageRange);
  if (skinType) profileParts.push(`${skinType} skin`);
  const profileNote = profileParts.length > 0
    ? ` Given your profile (${profileParts.join(", ")}), the approach and product selection were tailored to match.`
    : "";

  let bridge: string;
  if (shape.includesSkincare && shape.includesInOfficeOrProcedures) {
    bridge = namedChapters.length > 0
      ? `Your plan covers ${formatEnglishList(namedChapters)}\u2014starting with medical-grade skincare as a daily foundation, then layering in-office treatments to target your top concerns.${profileNote}`
      : `Your plan starts with medical-grade skincare for daily care, then layers in-office treatments that target your top aesthetic concerns.${profileNote}`;
  } else if (shape.includesSkincare) {
    bridge = `Your plan focuses on a strong at-home skincare foundation to keep your results consistent over time.${profileNote}`;
  } else if (shape.includesInOfficeOrProcedures) {
    bridge = namedChapters.length > 0
      ? `Your plan includes ${formatEnglishList(namedChapters)}, paired together so each treatment reinforces the others.${profileNote}`
      : `Your plan pairs in-office treatments with a maintenance rhythm so timing and upkeep stay aligned with your goals.${profileNote}`;
  } else {
    bridge = `Each step advances the same goals and keeps next actions clear.${profileNote}`;
  }

  return [open, bridge];
}

export type ChapterOverviewParts = {
  /** Client-first line: how this chapter applies to this patient (not generic modality marketing). */
  complementTop?: string;
  /** Short modality explainer after the client lead. */
  intro: string;
  planBullets: string[];
  analysis: string;
  /** Tie-back to the coordinated plan and other chapters. */
  complementBottom?: string;
};

export type ChapterOverviewBuildOptions = {
  overviewSnapshot: BlueprintAnalysisOverviewSnapshot | null;
  planRow: PlanTreatmentRow | null;
};

/** Per-chapter context to generate complement-sandwich bookends (top + bottom around the core overview). */
export type ChapterComplementSandwichContext = {
  chapterIndex: number;
  totalChapters: number;
  /** Display names in plan order (same order as TOC chapters). */
  allChapterDisplayNames: string[];
  planShape: PvbMainOverviewPlanShape;
  /** Patient-specific priorities from the overview (goals/findings/focus). */
  patientPriorities?: string[];
};

function planPillarPhraseForComplement(planShape: PvbMainOverviewPlanShape): string {
  if (planShape.includesSkincare && planShape.includesInOfficeOrProcedures) {
    return "your medical-grade home routine, maintenance between visits, and in-office treatments";
  }
  if (planShape.includesSkincare && !planShape.includesInOfficeOrProcedures) {
    return "consistent at-home care and long-term maintenance";
  }
  if (!planShape.includesSkincare && planShape.includesInOfficeOrProcedures) {
    return "your in-office treatments and the upkeep rhythm your team recommends";
  }
  return "every step in this guide";
}

/**
 * Opening line: always patient-specific when possible. Avoid generic “neuromodulators are studied…” copy.
 */
function buildChapterClientApplicationTop(
  chapter: TreatmentChapter,
  mergedConcerns: string[],
  analysisInput: ChapterOverviewAnalysisInput | undefined,
  complementCtx: ChapterComplementSandwichContext | null | undefined,
): string | undefined {
  const self = chapter.displayName.trim();
  if (mergedConcerns.length > 0) {
    return `For you, ${self} is here to address ${formatEnglishList(
      mergedConcerns.slice(0, 5),
    )}—from what came up in your visit and plan.`;
  }
  if (chapter.displayArea?.trim()) {
    return `For you, this step applies to ${chapter.displayArea.trim()}.`;
  }
  const interest = analysisInput?.planRow?.interest?.trim();
  if (interest) {
    return `For you, this reflects what you discussed: ${interest}.`;
  }
  const priority =
    (complementCtx?.patientPriorities ?? []).find((p) => p.trim().length > 0) ?? "";
  if (priority) {
    return `For you, this supports your interest in ${priority.trim()}.`;
  }
  if (complementCtx && complementCtx.totalChapters > 1) {
    const others = complementCtx.allChapterDisplayNames.filter(
      (_, i) => i !== complementCtx.chapterIndex,
    );
    return `For you, ${self} is one section of your plan alongside ${formatEnglishList(others)}.`;
  }
  return `For you, ${self} is in this guide from what you reviewed with your team.`;
}

function buildChapterComplementBottom(
  chapter: TreatmentChapter,
  ctx: ChapterComplementSandwichContext,
): string {
  const self = chapter.displayName.trim();
  const pillars = planPillarPhraseForComplement(ctx.planShape);
  const priority =
    (ctx.patientPriorities ?? []).find((p) => p.trim().length > 0) ?? "";
  const priorityTail = priority ? ` Matches your priority around ${priority}.` : "";
  if (ctx.totalChapters <= 1) {
    return `${self} fits with ${pillars}—steady follow-through keeps results on track.${priorityTail}`;
  }
  const others = ctx.allChapterDisplayNames.filter((_, i) => i !== ctx.chapterIndex);
  const othersList = formatEnglishList(others);
  return `${self} works alongside ${othersList} so ${pillars} stay one coordinated plan.${priorityTail}`;
}

/**
 * Per-treatment overview: category context, plan rows (SKU / area / qty), and analysis-linked narrative.
 * Pass `options` when `analysisSummary.overviewSnapshot` + plan rows are available on the blueprint.
 */
export function buildChapterOverviewContent(
  chapter: TreatmentChapter,
  options?: ChapterOverviewBuildOptions | null,
  complementContext?: ChapterComplementSandwichContext | null,
): ChapterOverviewParts {
  const introBase =
    TREATMENT_CATEGORY_INTRO[chapter.treatment] ??
    `It's the part of your plan focused on ${chapter.displayName}.`;

  const ctx: ChapterOverviewAnalysisInput | undefined =
    options != null
      ? {
          overviewSnapshot: options.overviewSnapshot,
          planRow: options.planRow,
        }
      : undefined;

  const mergedConcerns = getChapterOverviewMergedConcerns(chapter, ctx);

  const complementTop = buildChapterClientApplicationTop(
    chapter,
    mergedConcerns,
    ctx,
    complementContext ?? null,
  );

  const hadExplicitAddressingSentence =
    Boolean(complementTop) || mergedConcerns.length > 0 || Boolean(chapter.displayArea?.trim());

  let intro = introBase;
  if (mergedConcerns.length === 0) {
    intro = ctx ? maybeAppendIntroScanBridge(intro, chapter, ctx) : intro;
  }

  const planBullets = chapter.planItems.map((item) =>
    buildChapterPlanBulletLine(item),
  );

  const analysis = buildChapterAnalysisParagraph(chapter, mergedConcerns, {
    hadExplicitAddressingSentence,
  });

  let complementBottom: string | undefined;
  if (complementContext && complementContext.totalChapters > 0) {
    complementBottom = buildChapterComplementBottom(chapter, complementContext);
  }

  return {
    complementTop: complementTop?.trim() || undefined,
    intro,
    planBullets,
    analysis,
    complementBottom,
  };
}
