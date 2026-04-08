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
  name: z.string({ error: "请填写活动名称" }).min(1, "请填写活动名称"),
  type: z.string({ error: "请选择活动类型" }).min(1, "请选择活动类型"),
  hoursPerWeek: z.number({ error: "请输入数字" }).min(0, "不能为负数").optional(),
  durationMonths: z.number({ error: "请输入数字" }).min(0, "不能为负数").optional(),
  description: z.string().optional(),
});

// Animal experience entry schema
const animalExperienceSchema = z.object({
  type: z.string({ error: "请选择经历类型" }).min(1, "请选择经历类型"),
  organization: z.string().optional(),
  hours: z.number({ error: "请输入数字" }).min(0, "不能为负数").optional(),
  durationMonths: z.number({ error: "请输入数字" }).min(0, "不能为负数").optional(),
  description: z.string().optional(),
});

// Questionnaire answer schema (validated at app layer)
// Base schema without conditional refinement
// All error messages in Chinese (Zod v4 uses { error: "..." })
const questionnaireBaseSchema = z.object({
  // Schema version for future evolution
  schemaVersion: z.literal(1).default(1),

  // Section 1: Child basics
  childName: z.string({ error: "请填写孩子姓名" }).min(1, "请填写孩子姓名"),
  birthYear: z.number({ error: "请选择出生年份" })
    .int("请选择有效年份").min(1998, "请选择有效年份").max(2023, "请选择有效年份"),
  currentGrade: z.number({ error: "请选择当前年级" })
    .int("请选择有效年级").min(0, "请选择有效年级").max(12, "请选择有效年级"),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
    error: "请选择性别",
  }).optional(),

  // Section 2: School system
  schoolSystem: z.enum(["public", "international", "private", "homeschool", "other"], {
    error: "请选择学校类型",
  }),
  schoolName: z.string().optional(),
  schoolCity: z.string().optional(),

  // Section 3: Academic performance
  gpaType: z.enum(["percentage", "rank", "international", "unknown"], {
    error: "请选择成绩类型",
  }),
  gpaPercentage: z.number({ error: "请输入有效数字" })
    .min(0, "最小为 0").max(100, "最大为 100").optional(),
  classRank: z.string().optional(), // e.g. "5/200"
  scienceGPA: z.number({ error: "请输入有效数字" })
    .min(0, "最小为 0").max(100, "最大为 100").optional(),

  // Section 3: Conditional fields for international schools
  curriculumType: z.enum(["IB", "AP", "A-Level", "other"], {
    error: "请选择课程体系",
  }).optional(),
  ibDiploma: z.boolean().optional(),
  apCourses: z.array(z.string()).optional(),

  // Section 4: Test scores
  satScore: z.number({ error: "请输入有效数字" })
    .int("请输入整数").min(400, "SAT 范围 400-1600").max(1600, "SAT 范围 400-1600").optional(),
  actScore: z.number({ error: "请输入有效数字" })
    .int("请输入整数").min(1, "ACT 范围 1-36").max(36, "ACT 范围 1-36").optional(),
  toeflScore: z.number({ error: "请输入有效数字" })
    .int("请输入整数").min(0, "TOEFL 范围 0-120").max(120, "TOEFL 范围 0-120").optional(),
  ieltsScore: z.number({ error: "请输入有效数字" })
    .min(0, "IELTS 范围 0-9").max(9, "IELTS 范围 0-9").optional(),

  // Section 5: Extracurriculars
  activities: z.array(activitySchema).optional(),

  // Section 6: Special experiences (pre-vet relevant)
  animalExperience: z.array(animalExperienceSchema).optional(),

  // Section 7: Family finances
  budgetRange: z
    .enum(["under-30k", "30k-50k", "50k-70k", "70k-100k", "over-100k", "flexible"], {
      error: "请选择预算范围",
    })
    .optional(),
  needFinancialAid: z.boolean().optional(),

  // Section 8: Target preferences
  targetMajor: z.enum(["pre-vet", "animal-science", "biology", "other"], {
    error: "请选择专业方向",
  }).optional(),
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

  // Filter out empty array entries (user left blank entries that would fail validation)
  if (Array.isArray(cleaned.activities)) {
    cleaned.activities = (cleaned.activities as Record<string, unknown>[]).filter(
      (a) => a.name && (a.name as string).trim().length > 0
    );
    if ((cleaned.activities as unknown[]).length === 0) {
      delete cleaned.activities;
    }
  }
  if (Array.isArray(cleaned.animalExperience)) {
    cleaned.animalExperience = (cleaned.animalExperience as Record<string, unknown>[]).filter(
      (a) => a.type && (a.type as string).trim().length > 0
    );
    if ((cleaned.animalExperience as unknown[]).length === 0) {
      delete cleaned.animalExperience;
    }
  }

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
