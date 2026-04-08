import { z } from "zod";

// Gap analysis result type
export type GapSeverity = "green" | "yellow" | "red" | "no-data";

export type GapResult = {
  dimension: string;
  label: string;
  current: number | null;
  target: { min: number; max: number } | null;
  normalized: number | null;
  severity: GapSeverity;
  action: string | null;
};

// Questionnaire answer schema (validated at app layer)
export const questionnaireSchema = z.object({
  // Section 1: Child basics
  childName: z.string().min(1),
  birthYear: z.number().int(),
  currentGrade: z.number().int(),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),

  // Section 2: School system
  schoolSystem: z.enum(["public", "international", "private", "homeschool", "other"]),
  schoolName: z.string().optional(),
  schoolCity: z.string().optional(),

  // Section 3: Academic performance
  gpaType: z.enum(["percentage", "rank", "unknown"]),
  gpaPercentage: z.number().min(0).max(100).optional(),
  classRank: z.string().optional(), // e.g. "5/200"
  scienceGPA: z.number().min(0).max(100).optional(),

  // Section 4: Test scores
  satScore: z.number().int().min(400).max(1600).optional(),
  actScore: z.number().int().min(1).max(36).optional(),
  toeflScore: z.number().int().min(0).max(120).optional(),
  ieltsScore: z.number().min(0).max(9).optional(),

  // Section 5: Extracurriculars
  activities: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        hoursPerWeek: z.number().optional(),
        durationMonths: z.number().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),

  // Section 6: Special experiences (pre-vet relevant)
  animalExperience: z
    .array(
      z.object({
        type: z.string(), // e.g. "volunteer", "intern", "pet care", "research"
        organization: z.string().optional(),
        hours: z.number().optional(),
        durationMonths: z.number().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),

  // Section 7: Family finances
  budgetRange: z
    .enum(["under-30k", "30k-50k", "50k-70k", "70k-100k", "over-100k", "flexible"])
    .optional(),
  needFinancialAid: z.boolean().optional(),

  // Section 8: Target preferences
  targetMajor: z.enum(["pre-vet", "animal-science", "biology", "other"]).optional(),
  targetMajorOther: z.string().optional(),
  preferredRegion: z.string().optional(),
  biggestConcern: z.string().max(200).optional(),
});

export type QuestionnaireAnswers = z.infer<typeof questionnaireSchema>;
