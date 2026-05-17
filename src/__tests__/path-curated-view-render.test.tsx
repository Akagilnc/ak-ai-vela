// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { PathCuratedViewPage } from "@/components/path/path-curated-view";
import { selectSlot, type SlotAtom } from "@/lib/path/curated-slot";
import { prisma } from "@/lib/prisma";

const LIXIA_SLUG = "g1-may-lixia-solar-term";
const LIXIA_LEAD_LINE =
  "每年 5 月上旬立夏节气。2026 年为 **5 月 5 日（周二）**，刚好在劳动节假期内。";
const LIXIA_WHY_SPECIAL =
  "立夏是 culture + nature 双触发点——有传统习俗（秤人、立夏蛋、养蚕），也是春末转夏的明显自然变化节点。一年 24 节气是她和自然对表的锚点。";
const LIXIA_HEART =
  '节气不是传统文化 performance，是季节感的 anchor。让她知道一年的 cycle 不只是"放假 / 上学"。';
const LIXIA_OUTPUT =
  "节气 log 1 页 + 家里 1 个 artifact（蛋 / 种子 / 书签 / 秤数值）。**关键**：每年 5 月 5 日她再看这一页，会看到自己 1 年的变化 layer——这是 portfolio 里不刻意的 serendipity。";
const LIXIA_SERENDIPITY =
  "每年 5 月 5 日她再看这一页，会看到自己 1 年的变化 layer——这是 portfolio 里不刻意的 serendipity。";

function normalizeInterests(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

describe("PathCuratedViewPage", () => {
  it("renders authored prose verbatim and splits atoms into tight and explore slots", async () => {
    const view = await prisma.pathCuratedView.findUnique({
      where: { slug: LIXIA_SLUG },
      include: {
        atoms: {
          include: { atom: true },
          orderBy: { id: "asc" },
        },
      },
    });

    expect(view).not.toBeNull();
    if (!view) {
      throw new Error(`${LIXIA_SLUG} curated view must be seeded`);
    }

    const slotAtoms: SlotAtom[] = view.atoms
      .map(({ atom }) => ({
        slug: atom.slug,
        interests: normalizeInterests(atom.interests),
        frictionLevel: atom.frictionLevel,
        cadenceRole: atom.cadenceRole,
        displayOrder: atom.displayOrder,
      }))
      .sort((a, b) => {
        const order = a.displayOrder - b.displayOrder;
        if (order !== 0) return order;
        return a.slug.localeCompare(b.slug);
      });
    const expectedSlot = selectSlot(slotAtoms, {
      tightRatio: view.defaultTightRatio,
      frictionCeiling: view.frictionCeilingDefault,
    });
    const atomBySlug = new Map(
      view.atoms.map(({ atom }) => [atom.slug, atom] as const),
    );
    function seededAtom(slug: string) {
      const atom = atomBySlug.get(slug);
      if (!atom) {
        throw new Error(`${slug} atom must be linked to ${LIXIA_SLUG}`);
      }
      return atom;
    }

    render(<PathCuratedViewPage view={view} />);

    expect(
      screen.getByRole("heading", { name: "立夏节气段" }),
    ).toBeInTheDocument();
    expect(screen.getByText(LIXIA_LEAD_LINE)).toBeInTheDocument();
    expect(screen.getByText(LIXIA_WHY_SPECIAL)).toBeInTheDocument();
    expect(screen.getByText(LIXIA_HEART)).toBeInTheDocument();
    expect(screen.getByText(LIXIA_OUTPUT)).toBeInTheDocument();
    expect(screen.getByText(LIXIA_SERENDIPITY)).toBeInTheDocument();

    const proseRegions = ["一句话", "为什么特别", "心法", "产出", "serendipity"].map(
      (name) => screen.getByRole("region", { name }),
    );
    expect(proseRegions).toHaveLength(5);

    const tightRegion = screen.getByRole("region", { name: "贴身" });
    const exploreRegion = screen.getByRole("region", { name: "探索" });
    const tightTitles = within(tightRegion)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    const exploreTitles = within(exploreRegion)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);

    expect(tightTitles).toEqual(
      expectedSlot.tight.map((atom) => seededAtom(atom.slug).title),
    );
    expect(exploreTitles).toEqual(
      expectedSlot.explore.map((atom) => seededAtom(atom.slug).title),
    );

    for (const atom of expectedSlot.tight) {
      expect(
        within(tightRegion).getByText(seededAtom(atom.slug).body),
      ).toBeInTheDocument();
    }
    for (const atom of expectedSlot.explore) {
      expect(
        within(exploreRegion).getByText(seededAtom(atom.slug).body),
      ).toBeInTheDocument();
    }

    const exploreIntro = within(exploreRegion).getByText(/有空不妨试试/);
    expect(exploreIntro.textContent).toContain(
      "下面这些不一定贴她现在的兴趣",
    );
    expect(exploreIntro.textContent).not.toMatch(/顺路|又不亏|不亏|反正/);
  });
});
