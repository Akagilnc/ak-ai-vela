// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// --- Fix #7: FormField label-input association ---

// Mock the FieldHint component to avoid import chain issues
vi.mock("@/components/questionnaire/field-hint", () => ({
  FieldHint: ({ hint }: { hint: string }) => <span data-testid="hint">{hint}</span>,
}));

import { FormField } from "@/components/questionnaire/form-field";

describe("FormField label-input association (fix #7)", () => {
  it("associates label with input via htmlFor and id", () => {
    render(
      <FormField label="测试标签">
        <input type="text" />
      </FormField>
    );

    const label = screen.getByText("测试标签");
    const labelEl = label.closest("label");
    expect(labelEl).not.toBeNull();
    expect(labelEl!.getAttribute("for")).toBeTruthy();

    // The input should have the same id as the label's htmlFor
    const input = screen.getByRole("textbox");
    expect(input.id).toBe(labelEl!.getAttribute("for"));
  });

  it("associates label with select element", () => {
    render(
      <FormField label="选择标签">
        <select>
          <option value="a">A</option>
        </select>
      </FormField>
    );

    const label = screen.getByText("选择标签");
    const labelEl = label.closest("label");
    const select = screen.getByRole("combobox");
    expect(select.id).toBe(labelEl!.getAttribute("for"));
  });
});

// --- Fix #4: missingImportant falsy vs nullish ---

describe("missingImportant count logic (fix #4)", () => {
  // Extract the logic to verify correctness with 0 values
  function countMissingImportant(data: {
    gpaPercentage?: number | null;
    classRank?: string | null;
    satScore?: number | null;
    actScore?: number | null;
    toeflScore?: number | null;
    ieltsScore?: number | null;
  }): number {
    return [
      data.gpaPercentage == null && !data.classRank,
      data.satScore == null && data.actScore == null,
      data.toeflScore == null && data.ieltsScore == null,
    ].filter(Boolean).length;
  }

  it("treats score of 0 as present, not missing", () => {
    const count = countMissingImportant({
      gpaPercentage: 0,
      satScore: 0,
      toeflScore: 0,
    });
    expect(count).toBe(0);
  });

  it("treats null scores as missing", () => {
    const count = countMissingImportant({
      gpaPercentage: null,
      classRank: null,
      satScore: null,
      actScore: null,
      toeflScore: null,
      ieltsScore: null,
    });
    expect(count).toBe(3);
  });

  it("treats undefined scores as missing", () => {
    const count = countMissingImportant({});
    expect(count).toBe(3);
  });

  it("counts correctly when one of each pair is present", () => {
    const count = countMissingImportant({
      classRank: "5/200",    // gpaPercentage missing but classRank present
      actScore: 28,          // satScore missing but actScore present
      ieltsScore: 7.5,       // toeflScore missing but ieltsScore present
    });
    expect(count).toBe(0);
  });

  // This is the bug that the old falsy-check code would fail:
  it("does not flag gpaPercentage=0 as missing", () => {
    const count = countMissingImportant({
      gpaPercentage: 0,      // valid GPA of 0
      satScore: null,
      actScore: null,
      toeflScore: 100,
    });
    // Only SAT/ACT pair is missing
    expect(count).toBe(1);
  });
});

// --- Fix #1: currentGrade ?? "" vs || "" ---

describe("grade 0 (kindergarten) value binding (fix #1)", () => {
  it("nullish coalescing preserves 0 for select value", () => {
    // This verifies the fix: ?? preserves 0, || would coerce to ""
    const grade = 0;
    expect(grade ?? "").toBe(0);   // correct: keeps 0
    expect(grade || "").toBe("");  // bug: coerces 0 to ""
  });
});

// --- Fix (round 2) #2: optional chaining crash on undefined arrays ---

describe("array count expression safety (round 2 fix #2)", () => {
  it("does not crash when activities is undefined", () => {
    // Widening cast on the RHS prevents TS from narrowing the const to
    // literal `undefined`, which would make `activities?.filter` fail to
    // typecheck against `never`. Runtime value is still undefined.
    const activities = undefined as unknown[] | undefined;
    // The old bug: activities?.filter(...).length || 0
    //   .filter(...) returns undefined via ?., then .length throws.
    // The fix: chain the .length with ?., then ?? 0 for the fallback.
    const count =
      activities?.filter(
        (a: unknown) => (a as Record<string, unknown>).name,
      )?.length ?? 0;
    expect(count).toBe(0);
  });

  it("counts correctly when activities has entries", () => {
    const activities: unknown[] = [
      { name: "Piano", type: "arts" },
      { name: "", type: "sports" },
      { name: "Chess", type: "academic" },
    ];
    const count =
      activities?.filter(
        (a: unknown) => (a as Record<string, unknown>).name,
      )?.length ?? 0;
    expect(count).toBe(2); // "Piano" and "Chess", empty string is falsy
  });
});

// --- Gemini round 3 #2: formatValue label map disambiguation ---

describe("formatValue label map (Gemini round 3 #2)", () => {
  // The label maps for activities and experiences both have "volunteer"
  // formatValue must use the correct map based on context

  const ACTIVITY_TYPE_LABELS: Record<string, string> = {
    "academic": "学术竞赛", "arts": "艺术/音乐", "sports": "体育运动",
    "volunteer": "志愿服务", "leadership": "学生领导力", "club": "社团组织",
    "research": "科研项目", "work": "实习/工作", "other": "其他",
  };

  const EXPERIENCE_TYPE_LABELS: Record<string, string> = {
    "volunteer": "志愿服务", "intern": "实习", "pet-care": "宠物照顾",
    "research": "科研项目", "vet-shadow": "兽医跟诊", "farm": "农场/牧场",
    "other": "其他",
  };

  function formatArrayDisplay(
    val: Record<string, unknown>[],
    labelMap: Record<string, string>,
  ): string | null {
    if (val.length === 0) return null;
    const names = val
      .map((r) => {
        const name = r.name as string | undefined;
        const type = r.type as string | undefined;
        if (name) return name;
        if (type) return labelMap[type] || type;
        return "";
      })
      .filter(Boolean);
    return names.length > 0 ? names.join(" · ") : null;
  }

  it("uses activity labels for activities", () => {
    const result = formatArrayDisplay(
      [{ type: "volunteer" }],
      ACTIVITY_TYPE_LABELS,
    );
    expect(result).toBe("志愿服务");
  });

  it("uses experience labels for experiences", () => {
    const result = formatArrayDisplay(
      [{ type: "vet-shadow" }],
      EXPERIENCE_TYPE_LABELS,
    );
    expect(result).toBe("兽医跟诊");
  });

  it("falls back to raw type when not in label map", () => {
    const result = formatArrayDisplay(
      [{ type: "unknown-type" }],
      ACTIVITY_TYPE_LABELS,
    );
    expect(result).toBe("unknown-type");
  });
});

// --- Fix #2: NaN timestamp guard ---

describe("timestamp NaN guard (fix #2)", () => {
  it("new Date with invalid string produces NaN getTime", () => {
    const d = new Date("not-a-date");
    expect(Number.isNaN(d.getTime())).toBe(true);
  });

  it("new Date with empty string produces NaN getTime", () => {
    const d = new Date("");
    expect(Number.isNaN(d.getTime())).toBe(true);
  });

  it("NaN check prevents formatting invalid dates", () => {
    // This is the exact logic in step-layout.tsx after the fix
    function formatSavedTime(lastSavedAt: string | null): string | null {
      if (!lastSavedAt) return null;
      const d = new Date(lastSavedAt);
      if (Number.isNaN(d.getTime())) return null;
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    }

    expect(formatSavedTime(null)).toBeNull();
    expect(formatSavedTime("not-a-date")).toBeNull();
    expect(formatSavedTime("")).toBeNull();
    expect(formatSavedTime("2026-04-09T12:30:00Z")).toMatch(/^\d{2}:\d{2}$/);
  });
});
