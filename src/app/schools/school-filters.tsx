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
      router.push(`/schools?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={currentState ?? ""}
        onChange={(e) => updateParam("state", e.target.value || null)}
        className="bg-vela-surface border border-vela-border rounded-sm px-3 py-2 text-sm text-vela-text focus:outline-none focus:ring-2 focus:ring-vela-primary"
      >
        <option value="">All States</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={currentSort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="bg-vela-surface border border-vela-border rounded-sm px-3 py-2 text-sm text-vela-text focus:outline-none focus:ring-2 focus:ring-vela-primary"
      >
        <option value="ranking">Sort by Ranking</option>
        <option value="name">Sort by Name</option>
        <option value="acceptance">Sort by Acceptance Rate</option>
        <option value="cost">Sort by Cost (low first)</option>
      </select>

      <label className="flex items-center gap-2 text-sm text-vela-text cursor-pointer">
        <input
          type="checkbox"
          checked={preVetOnly}
          onChange={(e) =>
            updateParam("preVet", e.target.checked ? "true" : null)
          }
          className="w-4 h-4 accent-vela-primary"
        />
        Pre-Vet Only
      </label>
    </div>
  );
}
