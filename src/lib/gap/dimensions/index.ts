// Dimension registry. v1 ships 4 dimensions:
//   - GPA (universal)
//   - SAT (universal)
//   - ACT (universal)
//   - Pre-vet Experience (pre-vet / animal-science only)
//
// Deferred to v2 (post-陪课):
//   - Science GPA (pre-vet only) — pending scienceGPA field evolution
//   - English (TOEFL / IELTS) — needs englishRequirements seed data
//   - Budget — dimension ready but not wired; un-block when Kailing
//     surfaces budget as a 陪课 talking point.
//
// Order matters for report display: GPA first (highest weight signal),
// then test scores, then pre-vet experience (the Vela differentiator).

import type { Dimension } from "../types";
import { gpaDimension } from "./gpa";
import { satDimension } from "./sat";
import { actDimension } from "./act";
import { prevetExperienceDimension } from "./prevet-experience";

export const DIMENSIONS: readonly Dimension[] = [
  gpaDimension,
  satDimension,
  actDimension,
  prevetExperienceDimension,
];

// Static catalog for M4 report UI to render N/A sections for filtered-out
// dimensions. Pure metadata — does not call appliesTo.
// `readonly` prevents consumers from mutating the catalog in place.
export const ALL_DIMENSIONS_META: readonly {
  id: string;
  label: string;
  prevetOnly: boolean;
}[] = DIMENSIONS.map((d) => ({
  id: d.id,
  label: d.label,
  prevetOnly: d.prevetOnly,
}));
