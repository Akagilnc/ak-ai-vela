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

// Activity entry schema
const activitySchema = z.object({
  name: z.string().min(1, "请填写活动名称"),
  type: z.string().min(1, "请选择活动类型"),
  hoursPerWeek: z.number().min(0).optional(),
  durationMonths: z.number().min(0).optional(),
  description: z.string().optional(),
});

// Animal experience entry schema
const animalExperienceSchema = z.object({
  type: z.string().min(1, "请选择经历类型"),
  organization: z.string().optional(),
  hours: z.number().min(0).optional(),
  durationMonths: z.number().min(0).optional(),
  description: z.string().optional(),
});

// Questionnaire answer schema (validated at app layer)
// Base schema without conditional refinement
const questionnaireBaseSchema = z.object({
  // Schema version for future evolution
  schemaVersion: z.literal(1).default(1),

  // Section 1: Child basics
  childName: z.string().min(1, "请填写孩子姓名"),
  birthYear: z.number().int().min(2000).max(2015),
  currentGrade: z.number().int().min(6).max(12),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),

  // Section 2: School system
  schoolSystem: z.enum(["public", "international", "private", "homeschool", "other"]),
  schoolName: z.string().optional(),
  schoolCity: z.string().optional(),

  // Section 3: Academic performance
  gpaType: z.enum(["percentage", "rank", "international", "unknown"]),
  gpaPercentage: z.number().min(0).max(100).optional(),
  classRank: z.string().optional(), // e.g. "5/200"
  scienceGPA: z.number().min(0).max(100).optional(),

  // Section 3: Conditional fields for international schools
  curriculumType: z.enum(["IB", "AP", "A-Level", "other"]).optional(),
  ibDiploma: z.boolean().optional(),
  apCourses: z.array(z.string()).optional(),

  // Section 4: Test scores
  satScore: z.number().int().min(400).max(1600).optional(),
  actScore: z.number().int().min(1).max(36).optional(),
  toeflScore: z.number().int().min(0).max(120).optional(),
  ieltsScore: z.number().min(0).max(9).optional(),

  // Section 5: Extracurriculars
  activities: z.array(activitySchema).optional(),

  // Section 6: Special experiences (pre-vet relevant)
  animalExperience: z.array(animalExperienceSchema).optional(),

  // Section 7: Family finances
  budgetRange: z
    .enum(["under-30k", "30k-50k", "50k-70k", "70k-100k", "over-100k", "flexible"])
    .optional(),
  needFinancialAid: z.boolean().optional(),

  // Section 8: Target preferences
  targetMajor: z.enum(["pre-vet", "animal-science", "biology", "other"]).optional(),
  targetMajorOther: z.string().optional(),
  preferredRegion: z.string().optional(),
  biggestConcern: z.string().max(200, "最多 200 个字符").optional(),
});

// Full schema with conditional validation
export const questionnaireSchema = questionnaireBaseSchema.superRefine((data, ctx) => {
  // When schoolSystem is "international", require curriculumType
  if (data.schoolSystem === "international") {
    if (!data.curriculumType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "国际学校请选择课程体系",
        path: ["curriculumType"],
      });
    }
  }

  // When schoolSystem is "public" or "private", require at least gpaPercentage or classRank
  if (data.schoolSystem === "public" || data.schoolSystem === "private") {
    if (data.gpaPercentage == null && !data.classRank) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "请填写百分制成绩或年级排名",
        path: ["gpaPercentage"],
      });
    }
  }
});

export type QuestionnaireAnswers = z.infer<typeof questionnaireSchema>;

// Partial type for draft state (all fields optional except schemaVersion)
export type QuestionnaireDraft = Partial<QuestionnaireAnswers> & { schemaVersion?: number };

// Per-step validation schemas for client-side step navigation guards
export const stepSchemas = {
  1: questionnaireBaseSchema.pick({
    childName: true,
    birthYear: true,
    currentGrade: true,
    gender: true,
  }),
  2: questionnaireBaseSchema.pick({
    schoolSystem: true,
    schoolName: true,
    schoolCity: true,
  }),
  3: questionnaireBaseSchema.pick({
    gpaType: true,
    gpaPercentage: true,
    classRank: true,
    scienceGPA: true,
    curriculumType: true,
    ibDiploma: true,
    apCourses: true,
  }),
  4: questionnaireBaseSchema.pick({
    satScore: true,
    actScore: true,
    toeflScore: true,
    ieltsScore: true,
  }),
  5: questionnaireBaseSchema.pick({
    activities: true,
  }),
  6: questionnaireBaseSchema.pick({
    animalExperience: true,
  }),
  7: questionnaireBaseSchema.pick({
    budgetRange: true,
    needFinancialAid: true,
  }),
  8: questionnaireBaseSchema.pick({
    targetMajor: true,
    targetMajorOther: true,
    preferredRegion: true,
    biggestConcern: true,
  }),
} as const;

// Canonicalize questionnaire data by removing stale conditional fields
// Called server-side before validation to prevent dirty data
export function canonicalizeAnswers(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned = { ...data };
  const system = cleaned.schoolSystem as string;

  if (system === "international") {
    // International: remove public/private fields
    delete cleaned.gpaPercentage;
    delete cleaned.classRank;
  } else if (system === "public" || system === "private") {
    // Public/Private: remove international fields
    delete cleaned.curriculumType;
    delete cleaned.ibDiploma;
    delete cleaned.apCourses;
  }
  // homeschool/other: keep everything

  return cleaned;
}

// Step metadata for progress stepper and UI
export const STEP_META = [
  { step: 1, label: "基本信息", emoji: "" },
  { step: 2, label: "学校体系", emoji: "" },
  { step: 3, label: "学业情况", emoji: "" },
  { step: 4, label: "标化考试", emoji: "" },
  { step: 5, label: "课外活动", emoji: "" },
  { step: 6, label: "特殊经历", emoji: "" },
  { step: 7, label: "家庭财务", emoji: "" },
  { step: 8, label: "目标偏好", emoji: "" },
] as const;

export const TOTAL_STEPS = 8;
