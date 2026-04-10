// Shared test factory for Prisma `School` fixtures.
//
// Before this helper, five separate test files each copied a local
// `makeSchool()` that cast `as unknown as School` and diverged from the
// real Prisma schema: it used fields like `slug`, `nameCn`, `city`,
// `country`, `type`, `hasAnimalScience`, `hasPreVet` (none of which exist
// on the model) while omitting required ones like `createdAt`, `location`,
// `programs`, and `hasPreVetTrack`. Casting masked the drift and made the
// tests a weak guardrail against future Prisma schema changes.
//
// This factory matches the real `School` model exactly — no cast needed.
// Override any field via the `overrides` parameter for dimension tests
// that need to pin specific metric values. Per PR #7 Copilot review.

import type { School } from "@prisma/client";

export function makeSchool(overrides: Partial<School> = {}): School {
  return {
    id: "school-1",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
    name: "Test University",
    nameZh: null,
    location: "Test City, CA",
    state: "CA",
    ranking: null,
    website: null,
    programs: '["pre-vet","animal-science","biology"]',
    acceptanceRate: null,
    internationalAcceptRate: null,
    medianSAT: null,
    medianACT: null,
    sat25th: 1400,
    sat75th: 1500,
    act25th: 31,
    act75th: 34,
    avgGPA: 3.8,
    applicationDeadline: null,
    internationalStudentPct: null,
    internationalScholarships: null,
    visaOPTSupport: false,
    englishRequirements: null,
    estimatedAnnualCost: null,
    financialAidPct: null,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes: null,
    radarAcceptance: null,
    radarInternational: null,
    radarSAT: null,
    radarCost: null,
    radarAid: null,
    ...overrides,
  };
}
