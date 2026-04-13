import type { Interest, ResourceLevel, TraitAnswers } from "./types";

// Fold interest into route dimension
// animal-science → animal (shorter, cleaner in route IDs)
export function foldInterest(interest: Interest): string {
  return interest === "animal-science" ? "animal" : interest;
}

// Fold resource level: high stays, medium+limited → std
export function foldResource(resource: ResourceLevel): "high" | "std" {
  return resource === "high" ? "high" : "std";
}

// Match answers to a route ID
// Format: {ageGroup}-{foldedInterest}-{foldedResource}
// Route determines the roadmap content. Modifiers (learningDrive, socialStyle, etc.)
// customize portrait text and action-item wording within a route.
export function matchRoute(answers: TraitAnswers): string {
  const age = answers.ageGroup;
  const interest = foldInterest(answers.interest);
  const resource = foldResource(answers.resourceLevel);
  return `${age}-${interest}-${resource}`;
}
