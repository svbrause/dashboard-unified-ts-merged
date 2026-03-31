import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Provider } from "../types";
import {
  isPostVisitBlueprintSender,
  providerShowsTheTreatmentPreviewUi,
} from "./providerHelpers";

describe("The Treatment preview feature gate", () => {
  const treatmentProvider = {
    id: "p1",
    name: "The Treatment",
    code: "TheTreatment250",
  } as Provider;

  const adminProvider = {
    id: "p2",
    name: "Admin",
    code: "password",
  } as Provider;

  beforeEach(() => {
    vi.stubEnv("VITE_THE_TREATMENT_PREVIEW_FEATURES", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("hides Post-Visit Blueprint sender for The Treatment when preview env is unset", () => {
    expect(isPostVisitBlueprintSender(treatmentProvider)).toBe(false);
  });

  it("allows Post-Visit Blueprint sender for The Treatment when preview env is true", () => {
    vi.stubEnv("VITE_THE_TREATMENT_PREVIEW_FEATURES", "true");
    expect(isPostVisitBlueprintSender(treatmentProvider)).toBe(true);
  });

  it("never gates admin blueprint provider on preview env", () => {
    expect(isPostVisitBlueprintSender(adminProvider)).toBe(true);
  });

  it("providerShowsTheTreatmentPreviewUi is false for Treatment when preview off", () => {
    expect(providerShowsTheTreatmentPreviewUi(treatmentProvider)).toBe(false);
  });

  it("providerShowsTheTreatmentPreviewUi is true for Treatment when preview on", () => {
    vi.stubEnv("VITE_THE_TREATMENT_PREVIEW_FEATURES", "true");
    expect(providerShowsTheTreatmentPreviewUi(treatmentProvider)).toBe(true);
  });

  it("providerShowsTheTreatmentPreviewUi stays true for non-Treatment providers", () => {
    const other = {
      id: "p3",
      name: "Other Clinic",
      code: "SomeOtherCode",
    } as Provider;
    expect(providerShowsTheTreatmentPreviewUi(other)).toBe(true);
  });

  it("providerShowsTheTreatmentPreviewUi is true when provider is missing", () => {
    expect(providerShowsTheTreatmentPreviewUi(null)).toBe(true);
  });
});
