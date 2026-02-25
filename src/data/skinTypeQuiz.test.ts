import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  computeQuizScores,
  computeQuizResult,
  computeQuizProfile,
  getResultSummary,
  buildSkincareQuizPayload,
  getRecommendedProductsForSkinType,
  SKIN_TYPE_QUIZ,
  type SkinTypeId,
} from "./skinTypeQuiz";

describe("skinTypeQuiz", () => {
  describe("computeQuizScores", () => {
    it("returns zeros when no answers", () => {
      const scores = computeQuizScores({});
      expect(scores).toEqual({
        oily: 0,
        dry: 0,
        combination: 0,
        normal: 0,
        sensitive: 0,
      });
    });

    it("sums scores for selected answers", () => {
      // q1: index 0 = "Tight and in need of moisturizer" -> dry: 2
      // q2: index 3 = "Is very oily and shiny" -> oily: 2
      const scores = computeQuizScores({ q1: 0, q2: 3 });
      expect(scores.dry).toBe(2);
      expect(scores.oily).toBe(2);
    });

    it("ignores out-of-range answer index", () => {
      const scores = computeQuizScores({ q1: 999 });
      expect(scores.oily).toBe(0);
      expect(scores.dry).toBe(0);
    });
  });

  describe("computeQuizResult", () => {
    it("returns primary type with highest score", () => {
      const answers: Record<string, number> = {};
      SKIN_TYPE_QUIZ.questions.forEach((q) => {
        const dryIdx = q.answers.findIndex((a) => a.scores?.dry);
        if (dryIdx >= 0) answers[q.id] = dryIdx;
      });
      const result = computeQuizResult(answers);
      expect(result).toBe("dry");
    });
  });

  describe("computeQuizProfile", () => {
    it("returns primary and scores", () => {
      const profile = computeQuizProfile({});
      expect(profile.primary).toBeDefined();
      expect(["oily", "dry", "combination", "normal", "sensitive"]).toContain(
        profile.primary
      );
      expect(profile.scores).toHaveProperty("oily");
    });
  });

  describe("getResultSummary", () => {
    it("returns label and description for profile", () => {
      const profile = computeQuizProfile({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
      const summary = getResultSummary(profile);
      expect(typeof summary.label).toBe("string");
      expect(typeof summary.description).toBe("string");
    });
  });

  describe("buildSkincareQuizPayload", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-01T12:00:00.000Z"));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("builds payload with version, completedAt, result, products", () => {
      const answers = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
      const payload = buildSkincareQuizPayload(answers);
      expect(payload.version).toBe(1);
      expect(payload.completedAt).toBe("2025-06-01T12:00:00.000Z");
      expect(payload.answers).toEqual(answers);
      expect(payload.result).toBeDefined();
      expect(Array.isArray(payload.recommendedProductNames)).toBe(true);
      expect(payload.resultLabel).toBeDefined();
    });
  });

  describe("getRecommendedProductsForSkinType", () => {
    it("returns array of product names for each type", () => {
      const types: SkinTypeId[] = ["oily", "dry", "combination", "normal", "sensitive"];
      for (const t of types) {
        const products = getRecommendedProductsForSkinType(t);
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBeGreaterThan(0);
      }
    });
  });
});
