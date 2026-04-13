import { describe, it, expect } from "vitest";
import { QUESTIONS, FIRST_QUESTION_ID, buildQuestionFlow, TOTAL_TRAIT_QUESTIONS } from "../questions";
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

describe("questions", () => {
  it("FIRST_QUESTION_ID is ageGroup", () => {
    expect(FIRST_QUESTION_ID).toBe("ageGroup");
  });

  it("all question IDs referenced in next() exist in QUESTIONS", () => {
    for (const q of Object.values(QUESTIONS)) {
      // Test with each of the question's own options
      for (const opt of q.options) {
        const partial: Partial<TraitAnswers> = { [q.key]: opt.value } as Partial<TraitAnswers>;
        const nextId = q.next(partial);
        if (nextId !== null) {
          expect(QUESTIONS[nextId], `Question ${q.id} points to missing question ${nextId}`).toBeDefined();
        }
      }
    }
  });

  it("each question key matches a valid TraitAnswers field", () => {
    const validKeys: Array<keyof TraitAnswers> = [
      "ageGroup", "interest", "interestDetail", "learningDrive",
      "driveDetail", "socialStyle", "socialDetail",
      "englishLevel", "resourceLevel", "parentStyle",
    ];
    for (const q of Object.values(QUESTIONS)) {
      expect(validKeys, `Question ${q.id} has invalid key ${q.key}`).toContain(q.key);
    }
  });
});

describe("buildQuestionFlow", () => {
  it("produces exactly 10 questions for animal-science path", () => {
    const flow = buildQuestionFlow(makeAnswers({
      interest: "animal-science",
      learningDrive: "self-driven",
      socialStyle: "team",
    }));
    expect(flow).toHaveLength(TOTAL_TRAIT_QUESTIONS);
  });

  it("produces exactly 10 questions for stem path", () => {
    const flow = buildQuestionFlow(makeAnswers({
      interest: "stem",
      learningDrive: "guided-start",
      socialStyle: "small-group",
    }));
    expect(flow).toHaveLength(TOTAL_TRAIT_QUESTIONS);
  });

  it("produces exactly 10 questions for humanities path", () => {
    const flow = buildQuestionFlow(makeAnswers({
      interest: "humanities",
      learningDrive: "companion",
      socialStyle: "solo",
    }));
    expect(flow).toHaveLength(TOTAL_TRAIT_QUESTIONS);
  });

  it("produces exactly 10 questions for exploring path", () => {
    const flow = buildQuestionFlow(makeAnswers({
      interest: "exploring",
      learningDrive: "self-driven",
      socialStyle: "team",
    }));
    expect(flow).toHaveLength(TOTAL_TRAIT_QUESTIONS);
  });

  it("all 9 branching paths produce 10 questions", () => {
    // 4 interest × 3 drive × 3 social = 36 combos, all should be 10 questions
    const interests: TraitAnswers["interest"][] = ["animal-science", "stem", "humanities", "exploring"];
    const drives: TraitAnswers["learningDrive"][] = ["self-driven", "guided-start", "companion"];
    const socials: TraitAnswers["socialStyle"][] = ["team", "small-group", "solo"];

    for (const interest of interests) {
      for (const drive of drives) {
        for (const social of socials) {
          const answers = makeAnswers({
            interest,
            learningDrive: drive,
            socialStyle: social,
          });
          const flow = buildQuestionFlow(answers);
          expect(flow, `${interest}/${drive}/${social}`).toHaveLength(TOTAL_TRAIT_QUESTIONS);
        }
      }
    }
  });

  it("starts with ageGroup and ends with parentStyle", () => {
    const flow = buildQuestionFlow(makeAnswers());
    expect(flow[0]).toBe("ageGroup");
    expect(flow[flow.length - 1]).toBe("parentStyle");
  });

  it("always includes the 4 non-branching questions in order", () => {
    const flow = buildQuestionFlow(makeAnswers());
    const nonBranching = flow.filter((id) =>
      ["ageGroup", "englishLevel", "resourceLevel", "parentStyle"].includes(id)
    );
    expect(nonBranching).toEqual(["ageGroup", "englishLevel", "resourceLevel", "parentStyle"]);
  });
});
