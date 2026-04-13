import { describe, it, expect } from "vitest";
import { ROUTES, getRoute, getAllRouteIds } from "../routes";
import { matchRoute } from "../match";
import type { TraitAnswers } from "../types";

function makeAnswers(overrides: Partial<TraitAnswers> = {}): TraitAnswers {
  return {
    ageGroup: "lower",
    interest: "animal-science",
    interestDetail: "caring",
    learningDrive: "self-driven",
    driveDetail: "deep-focus",
    socialStyle: "team",
    socialDetail: "leader",
    englishLevel: "average",
    resourceLevel: "medium",
    parentStyle: "proactive",
    ...overrides,
  };
}

describe("routes data integrity", () => {
  it("has 24 routes (3 ages × 4 interests × 2 resources)", () => {
    expect(getAllRouteIds()).toHaveLength(24);
  });

  it("every route has an id matching its key", () => {
    for (const [key, route] of Object.entries(ROUTES)) {
      expect(route.id).toBe(key);
    }
  });

  it("every route has a non-empty name and description", () => {
    for (const route of Object.values(ROUTES)) {
      expect(route.name.length, `${route.id} missing name`).toBeGreaterThan(0);
      expect(route.description.length, `${route.id} missing description`).toBeGreaterThan(0);
    }
  });

  it("every route has exactly 3 stages", () => {
    for (const route of Object.values(ROUTES)) {
      expect(route.stages, `${route.id} should have 3 stages`).toHaveLength(3);
    }
  });

  it("every stage has a label, period, and at least one section", () => {
    for (const route of Object.values(ROUTES)) {
      for (const stage of route.stages) {
        expect(stage.label.length).toBeGreaterThan(0);
        expect(stage.period.length).toBeGreaterThan(0);
        expect(stage.sections.length).toBeGreaterThan(0);
      }
    }
  });

  it("every section has a valid type", () => {
    const validTypes = ["action", "relax", "why"];
    for (const route of Object.values(ROUTES)) {
      for (const stage of route.stages) {
        for (const section of stage.sections) {
          expect(validTypes, `${route.id} has invalid section type ${section.type}`).toContain(section.type);
        }
      }
    }
  });

  it("every section has at least one item with non-empty text", () => {
    for (const route of Object.values(ROUTES)) {
      for (const stage of route.stages) {
        for (const section of stage.sections) {
          expect(section.items.length, `${route.id} section "${section.title}" has no items`).toBeGreaterThan(0);
          for (const item of section.items) {
            expect(item.text.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("all matchRoute results have a corresponding route", () => {
    const ageGroups: TraitAnswers["ageGroup"][] = ["lower", "upper", "middle-school"];
    const interests: TraitAnswers["interest"][] = ["animal-science", "stem", "humanities", "exploring"];
    const resources: TraitAnswers["resourceLevel"][] = ["high", "medium", "limited"];

    for (const ageGroup of ageGroups) {
      for (const interest of interests) {
        for (const resourceLevel of resources) {
          const routeId = matchRoute(makeAnswers({ ageGroup, interest, resourceLevel }));
          const route = getRoute(routeId);
          expect(route, `No route found for ${routeId}`).toBeDefined();
        }
      }
    }
  });

  it("has at least some verified items with sources", () => {
    let verifiedCount = 0;
    for (const route of Object.values(ROUTES)) {
      for (const stage of route.stages) {
        for (const section of stage.sections) {
          for (const item of section.items) {
            if (item.verified) verifiedCount++;
          }
        }
      }
    }
    expect(verifiedCount).toBeGreaterThan(0);
  });
});
