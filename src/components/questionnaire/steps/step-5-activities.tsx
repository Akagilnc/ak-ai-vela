"use client";

import { useCallback } from "react";
import { StepLayout } from "../step-layout";
import { FormField, inputClass, selectClass } from "../form-field";
import { useQuestionnaire } from "../questionnaire-provider";

type Activity = {
  name: string;
  type: string;
  hoursPerWeek?: number;
  durationMonths?: number;
  description?: string;
};

const EMPTY_ACTIVITY: Activity = { name: "", type: "" };
const MAX_ACTIVITIES = 10;

const ACTIVITY_TYPES = [
  { value: "academic", label: "学术竞赛" },
  { value: "arts", label: "艺术/音乐" },
  { value: "sports", label: "体育运动" },
  { value: "volunteer", label: "志愿服务" },
  { value: "leadership", label: "学生领导力" },
  { value: "club", label: "社团组织" },
  { value: "research", label: "科研项目" },
  { value: "work", label: "实习/工作" },
  { value: "other", label: "其他" },
];

export function Step5Activities() {
  const { data, setArrayItem, addArrayItem, removeArrayItem } = useQuestionnaire();

  // Ensure at least one entry
  const activities = (data.activities as Activity[] | undefined)?.length
    ? (data.activities as Activity[])
    : [{ ...EMPTY_ACTIVITY }];

  // On first render, initialize if empty
  const initializeIfEmpty = useCallback(() => {
    if (!data.activities || (data.activities as Activity[]).length === 0) {
      addArrayItem("activities", { ...EMPTY_ACTIVITY });
    }
  }, [data.activities, addArrayItem]);

  // Call once
  if (!data.activities || (data.activities as Activity[]).length === 0) {
    initializeIfEmpty();
  }

  const updateEntry = (index: number, field: keyof Activity, value: unknown) => {
    const entry = { ...activities[index], [field]: value };
    setArrayItem("activities", index, entry);
  };

  const addEntry = () => {
    if (activities.length < MAX_ACTIVITIES) {
      addArrayItem("activities", { ...EMPTY_ACTIVITY });
    }
  };

  const removeEntry = (index: number) => {
    if (activities.length > 1) {
      removeArrayItem("activities", index);
    } else {
      // Can't remove last, just clear it
      setArrayItem("activities", 0, { ...EMPTY_ACTIVITY });
    }
  };

  return (
    <StepLayout
      step={5}
      title="课外活动"
      subtitle="我们来看看孩子的特长和爱好"
    >
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <fieldset
            key={index}
            className="space-y-3 pb-5 border-b border-vela-border last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <legend className="text-sm font-medium text-vela-text">
                活动 {index + 1}
              </legend>
              <button
                type="button"
                onClick={() => removeEntry(index)}
                className="text-sm text-vela-muted hover:text-vela-error transition-colors"
              >
                删除
              </button>
            </div>

            <FormField label="活动名称">
              <input
                type="text"
                value={activity.name || ""}
                onChange={(e) => updateEntry(index, "name", e.target.value)}
                placeholder="例如: 生物奥赛"
                className={inputClass}
              />
            </FormField>

            <FormField label="活动类型">
              <select
                value={activity.type || ""}
                onChange={(e) => updateEntry(index, "type", e.target.value)}
                className={selectClass}
              >
                <option value="">请选择</option>
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="每周小时">
                <input
                  type="number"
                  min={0}
                  value={activity.hoursPerWeek ?? ""}
                  onChange={(e) =>
                    updateEntry(index, "hoursPerWeek", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="小时"
                  className={inputClass}
                />
              </FormField>
              <FormField label="持续月数">
                <input
                  type="number"
                  min={0}
                  value={activity.durationMonths ?? ""}
                  onChange={(e) =>
                    updateEntry(index, "durationMonths", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="月"
                  className={inputClass}
                />
              </FormField>
            </div>
          </fieldset>
        ))}

        {activities.length < MAX_ACTIVITIES && (
          <button
            type="button"
            onClick={addEntry}
            className="w-full py-2 text-sm text-vela-primary border border-dashed border-vela-border rounded-md hover:border-vela-primary hover:bg-vela-surface/50 transition-colors"
          >
            + 添加更多活动
          </button>
        )}
      </div>
    </StepLayout>
  );
}
