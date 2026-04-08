"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function SchoolFilters({
  states,
  currentState,
  currentSort,
  preVetOnly,
}: {
  states: string[];
  currentState?: string;
  currentSort: string;
  preVetOnly: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.replace(qs ? `/schools?${qs}` : "/schools");
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <select
        value={currentState ?? ""}
        onChange={(e) => updateParam("state", e.target.value || null)}
        aria-label="按州筛选"
        className="bg-vela-surface border border-vela-border rounded-sm px-3 py-2 text-sm text-vela-text"
      >
        <option value="">所有州</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={currentSort}
        onChange={(e) => updateParam("sort", e.target.value)}
        aria-label="排序方式"
        className="bg-vela-surface border border-vela-border rounded-sm px-3 py-2 text-sm text-vela-text"
      >
        <option value="ranking">按排名</option>
        <option value="name">按名称</option>
        <option value="acceptance">按录取率</option>
        <option value="cost">按费用（低优先）</option>
      </select>

      <label className="flex items-center gap-2 min-h-[44px] px-2 text-sm text-vela-text cursor-pointer">
        <input
          type="checkbox"
          checked={preVetOnly}
          onChange={(e) =>
            updateParam("preVet", e.target.checked ? "true" : null)
          }
          className="w-5 h-5 accent-vela-primary"
        />
        仅 Pre-Vet
      </label>
    </div>
  );
}
