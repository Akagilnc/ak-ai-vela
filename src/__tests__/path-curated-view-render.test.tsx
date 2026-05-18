// @vitest-environment jsdom
import type { ComponentProps } from "react";
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

type CuratedViewProp = ComponentProps<typeof PathCuratedViewPage>["view"];

function normalizeInterests(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

async function loadSeededView(slug: string): Promise<CuratedViewProp> {
  const view = await prisma.pathCuratedView.findUnique({
    where: { slug },
    include: {
      atoms: {
        include: { atom: true },
        orderBy: { id: "asc" },
      },
    },
  });

  expect(view).not.toBeNull();
  if (!view) {
    throw new Error(`${slug} curated view must be seeded`);
  }

  return view;
}

describe("PathCuratedViewPage", () => {
  it("renders authored prose verbatim and splits atoms into tight and explore slots", async () => {
    const view = await loadSeededView(LIXIA_SLUG);

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

  it("uses source-authored labels for baseline and labor budget prose", async () => {
    const baseline = await loadSeededView("g1-may-baseline");
    const baselineRender = render(<PathCuratedViewPage view={baseline} />);

    expect(screen.getByRole("region", { name: "时间占用" })).toHaveTextContent(
      "一个月 3-5 次 weekend 半天",
    );
    expect(
      screen.queryByRole("region", { name: "为什么特别" }),
    ).not.toBeInTheDocument();

    baselineRender.unmount();

    const labor = await loadSeededView("g1-may-labor-holiday");
    render(<PathCuratedViewPage view={labor} />);

    expect(screen.getByRole("region", { name: "时间预算" })).toHaveTextContent(
      "5 天里用 **1-2 天**",
    );
    expect(
      screen.queryByRole("region", { name: "为什么特别" }),
    ).not.toBeInTheDocument();
  });

  it("does not repeat an inline source label after promoting it to a heading", () => {
    const view = {
      slug: "g1-may-baseline",
      title: "Baseline",
      month: 5,
      leadLine: "Lead",
      whySpecial: "**时间占用**：一个月 3-5 次 weekend 半天",
      heart: null,
      output: null,
      serendipity: null,
      defaultTightRatio: 100,
      frictionCeilingDefault: 3,
      atoms: [
        {
          atom: {
            slug: "baseline-atom",
            title: "Baseline atom",
            body: "Atom body",
            interests: [],
            frictionLevel: 0,
            cadenceRole: "LIGHT_RECURRING",
            displayOrder: 1,
          },
        },
      ],
    } satisfies CuratedViewProp;

    const baselineRender = render(<PathCuratedViewPage view={view} />);

    const region = screen.getByRole("region", { name: "时间占用" });
    expect(
      within(region).getByText("一个月 3-5 次 weekend 半天"),
    ).toBeInTheDocument();
    expect(region).not.toHaveTextContent("**时间占用**");

    baselineRender.unmount();

    const laborView = {
      ...view,
      slug: "g1-may-labor-holiday",
      title: "Labor",
      whySpecial: "时间预算：5 天里用 **1-2 天** 做 nature-themed 活动",
    } satisfies CuratedViewProp;

    render(<PathCuratedViewPage view={laborView} />);

    const laborRegion = screen.getByRole("region", { name: "时间预算" });
    expect(
      within(laborRegion).getByText(
        "5 天里用 **1-2 天** 做 nature-themed 活动",
      ),
    ).toBeInTheDocument();
    expect(laborRegion).not.toHaveTextContent("时间预算：");
  });

  it("skips prose sections that have no authored text", () => {
    const view = {
      slug: "test-empty-prose",
      title: "Test empty prose",
      month: 5,
      leadLine: "Lead",
      whySpecial: "   ",
      heart: null,
      output: "Output",
      serendipity: null,
      defaultTightRatio: 100,
      frictionCeilingDefault: 3,
      atoms: [
        {
          atom: {
            slug: "empty-prose-atom",
            title: "Empty prose atom",
            body: "Atom body",
            interests: [],
            frictionLevel: 0,
            cadenceRole: "LIGHT_RECURRING",
            displayOrder: 1,
          },
        },
      ],
    } satisfies CuratedViewProp;

    render(<PathCuratedViewPage view={view} />);

    expect(
      screen.getByRole("region", { name: "一句话" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "为什么特别" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "心法" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "产出" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "serendipity" }),
    ).not.toBeInTheDocument();
  });

  it("preserves atom body line breaks in rendered detail cards", () => {
    const view = {
      slug: "test-curated-view",
      title: "Test curated view",
      month: 5,
      leadLine: "Lead",
      whySpecial: null,
      heart: null,
      output: null,
      serendipity: null,
      defaultTightRatio: 100,
      frictionCeilingDefault: 3,
      atoms: [
        {
          atom: {
            slug: "line-break-atom",
            title: "Line break atom",
            body: "第一行\n第二行",
            interests: [],
            frictionLevel: 0,
            cadenceRole: "LIGHT_RECURRING",
            displayOrder: 1,
          },
        },
      ],
    } satisfies CuratedViewProp;

    render(<PathCuratedViewPage view={view} />);

    const body = screen.getByText(
      (_, element) => element?.textContent === "第一行\n第二行",
    );
    expect(body).toHaveStyle({ whiteSpace: "pre-wrap" });
  });
});
