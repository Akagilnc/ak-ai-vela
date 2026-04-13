import { z } from "zod";

// Age group categories
export const AgeGroup = z.enum(["lower", "upper", "middle-school"]);
export type AgeGroup = z.infer<typeof AgeGroup>;

// Interest categories
export const Interest = z.enum(["animal-science", "stem", "humanities", "exploring"]);
export type Interest = z.infer<typeof Interest>;

// Interest detail — varies by interest branch
export const InterestDetail = z.enum([
  // animal-science branch
  "caring", "science", "career",
  // stem branch
  "builder", "digital", "experiment",
  // humanities branch
  "visual", "narrative", "performing",
  // exploring branch
  "physical", "screen", "quiet",
]);
export type InterestDetail = z.infer<typeof InterestDetail>;

// Learning drive
export const LearningDrive = z.enum(["self-driven", "guided-start", "companion"]);
export type LearningDrive = z.infer<typeof LearningDrive>;

// Drive detail — varies by learning drive branch
export const DriveDetail = z.enum([
  // self-driven branch
  "deep-focus", "multi-explorer", "funnel",
  // guided-start branch
  "creative-adapter", "mastery-seeker", "peer-teacher",
  // companion branch
  "dialogue-learner", "observer-learner", "comfort-explorer",
]);
export type DriveDetail = z.infer<typeof DriveDetail>;

// Social style
export const SocialStyle = z.enum(["team", "small-group", "solo"]);
export type SocialStyle = z.infer<typeof SocialStyle>;

// Social detail — varies by social style branch
export const SocialDetail = z.enum([
  // team branch
  "leader", "collaborator", "executor",
  // small-group branch
  "co-creator", "parallel-player", "mentor-friend",
  // solo branch
  "content-solo", "slow-warmer", "solo-creator",
]);
export type SocialDetail = z.infer<typeof SocialDetail>;

// English level
export const EnglishLevel = z.enum(["strong", "average", "weak"]);
export type EnglishLevel = z.infer<typeof EnglishLevel>;

// Resource level
export const ResourceLevel = z.enum(["high", "medium", "limited"]);
export type ResourceLevel = z.infer<typeof ResourceLevel>;

// Parent style
export const ParentStyle = z.enum(["proactive", "need-guidance", "hands-off"]);
export type ParentStyle = z.infer<typeof ParentStyle>;

// Full trait answers schema
export const TraitAnswersSchema = z.object({
  ageGroup: AgeGroup,
  interest: Interest,
  interestDetail: InterestDetail,
  learningDrive: LearningDrive,
  driveDetail: DriveDetail,
  socialStyle: SocialStyle,
  socialDetail: SocialDetail,
  englishLevel: EnglishLevel,
  resourceLevel: ResourceLevel,
  parentStyle: ParentStyle,
});

export type TraitAnswers = z.infer<typeof TraitAnswersSchema>;

// Route ID format: {ageGroup}-{foldedInterest}-{foldedResource}
// foldedInterest: "animal" | "stem" | "humanities" | "exploring"
// foldedResource: "high" | "std" (medium + limited fold to std)
export type RouteId = string;

// A single stage in the roadmap
export type Stage = {
  label: string;        // e.g. "小学低年级 (G1-G3)"
  period: string;       // e.g. "6-9岁"
  sections: StageSection[];
};

export type StageSection = {
  type: "action" | "relax" | "why";
  title: string;
  items: StageSectionItem[];
};

export type StageSectionItem = {
  text: string;
  verified?: boolean;
  source?: string;      // fact-check source URL or reference
};

// A complete route (one of 12 predefined)
export type Route = {
  id: RouteId;
  name: string;         // e.g. "动物科学探索路线"
  description: string;  // short description of this route
  stages: Stage[];
};

// Goal confirmation options
export const GoalTarget = z.enum(["top30", "top50", "undecided"]);
export type GoalTarget = z.infer<typeof GoalTarget>;
