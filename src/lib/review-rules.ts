import type { QuestionnaireDraft } from "./types";

// Count how many "important for report quality" slots the user hasn't
// filled. The review page surfaces this as a soft warning: "⚠ 缺少 N 项
// 信息可能影响报告准确性". The rule must branch on schoolSystem because
// different pathways have different data sources:
//
//   - international: GPA percentage is meaningless (IB/AP/A-Level use
//     their own scales), but curriculumType is what the analysis needs.
//   - public / private (Chinese schools): GPA percentage or class rank
//     is the academic signal.
//   - homeschool / other / unknown: no single GPA proxy exists; only
//     test scores carry weight.
//
// Test-score pairs (SAT/ACT, TOEFL/IELTS) are always required because
// every downstream pathway needs a standardized academic signal and an
// English proficiency signal. One of each pair is enough.
//
// Null-safety: use `== null` (catches null and undefined but NOT 0) so a
// user who actually entered 0 is counted as present. The same rule
// applies to classRank and curriculumType, which are strings — empty
// string is treated as missing.
export function countMissingImportant(data: QuestionnaireDraft): number {
  const system = data.schoolSystem;

  const missingAcademic = (() => {
    if (system === "international") {
      // IB / AP / A-Level etc. — curriculumType is the required anchor.
      return !data.curriculumType;
    }
    if (system === "public" || system === "private") {
      // Need a GPA percentage OR a class rank; one or the other is fine.
      return data.gpaPercentage == null && !data.classRank;
    }
    // homeschool / other / undefined: no GPA slot to check. Don't flag.
    return false;
  })();

  const missingStandardizedTest =
    data.satScore == null && data.actScore == null;
  const missingEnglishTest =
    data.toeflScore == null && data.ieltsScore == null;

  return [missingAcademic, missingStandardizedTest, missingEnglishTest].filter(
    Boolean,
  ).length;
}
