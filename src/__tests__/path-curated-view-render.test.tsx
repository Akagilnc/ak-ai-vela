// @vitest-environment jsdom
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { PathCuratedViewPage } from "@/components/path/path-curated-view";
import { selectSlot, type SlotAtom } from "@/lib/path/curated-slot";
import { G1_MAY_ATOM_SEED } from "../../docs/research/data/g1-may-atoms";

const LIXIA_SLUG = "g1-may-lixia-solar-term";
const LIXIA_LEAD_LINE =
  "每年 5 月上旬立夏节气。2026 年为 **5 月 5 日（周二）**，刚好在劳动节假期内。";
const LIXIA_WHY_SPECIAL =
  "立夏是 culture + nature 双触发点——有传统习俗（秤人、立夏蛋、养蚕），也是春末转夏的明显自然变化节点。一年 24 节气是她和自然对表的锚点。";
const LIXIA_HEART =
  '节气不是传统文化 performance，是季节感的 anchor。让她知道一年的 cycle 不只是"放假 / 上学"。';

type CuratedViewProp = ComponentProps<typeof PathCuratedViewPage>["view"];

function normalizeInterests(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function viewFromSeed(slug: string): CuratedViewProp {
  const view = G1_MAY_ATOM_SEED.curatedViews.find((candidate) => candidate.slug === slug);
  if (!view) throw new Error(`${slug} view must exist in G1 May atom seed`);

  const atomBySlug = new Map(
    G1_MAY_ATOM_SEED.atoms.map((atom) => [atom.slug, atom] as const),
  );
  const atoms = G1_MAY_ATOM_SEED.viewAtomLinks
    .filter((link) => link.viewSlug === slug)
    .map(({ atomSlug }) => {
      const atom = atomBySlug.get(atomSlug);
      if (!atom) throw new Error(`${atomSlug} atom must exist in G1 May atom seed`);
      return {
        atom: {
          slug: atom.slug,
          title: atom.title,
          body: atom.body,
          interests: [...atom.interests],
          frictionLevel: atom.frictionLevel,
          cadenceRole: atom.cadenceRole,
          displayOrder: atom.displayOrder,
        },
      };
    });

  return {
    slug: view.slug,
    title: view.title,
    month: view.month,
    leadLine: view.leadLine,
    whySpecial: view.whySpecial,
    heart: view.heart,
    output: view.output,
    serendipity: view.serendipity,
    proseBlocks: view.proseBlocks,
    defaultTightRatio: view.defaultTightRatio,
    frictionCeilingDefault: view.frictionCeilingDefault,
    atoms,
  };
}

function firstRenderedSnippet(body: string) {
  const firstLine = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) return "";
  return firstLine
    .replace(/\*\*/g, "")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function expectAtomBodyRendered(
  region: HTMLElement,
  atom: CuratedViewProp["atoms"][number]["atom"],
) {
  const heading = within(region).getByRole("heading", {
    level: 3,
    name: atom.title,
  });
  const card = heading.closest("li");
  expect(card).toHaveTextContent(firstRenderedSnippet(atom.body));
}

function closestListItemForText(text: string) {
  const element = screen.getByText(text);
  const item = element.closest("li");
  if (!item) throw new Error(`Expected "${text}" to be inside a list item`);
  return item;
}

function directListItems(list: Element) {
  return Array.from(list.children).filter(
    (child): child is HTMLElement => child.tagName === "LI",
  );
}

function renderedSectionLabels(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>("main > section.d-sec"))
    .map((section) => section.dataset.target ?? "");
}

describe("PathCuratedViewPage", () => {
  it("renders authored prose verbatim and splits atoms into tight and explore slots", () => {
    const view = viewFromSeed(LIXIA_SLUG);

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

    const lixiaRender = render(<PathCuratedViewPage view={view} />);

    expect(
      screen.getByRole("heading", { name: "立夏节气段" }),
    ).toBeInTheDocument();

    const proseRegions = [
      "触发条件",
      "前置",
      "时间",
      "为什么特别",
      "产出",
      "心法",
    ].map((name) => screen.getByRole("region", { name }));
    expect(renderedSectionLabels(lixiaRender.container).slice(0, 6)).toEqual([
      "触发条件",
      "前置",
      "时间",
      "为什么特别",
      "产出",
      "心法",
    ]);
    expect(proseRegions[0]).toHaveTextContent(firstRenderedSnippet(LIXIA_LEAD_LINE));
    expect(proseRegions[1]).toHaveTextContent("无。");
    expect(proseRegions[2]).toHaveTextContent("1-2 小时，不占 weekend 半天");
    expect(proseRegions[3]).toHaveTextContent(LIXIA_WHY_SPECIAL);
    expect(
      screen.queryByRole("region", {
        name: "做什么（从下面挑 2-3 项组合，不用全做）",
      }),
    ).not.toBeInTheDocument();
    expect(proseRegions[4]).toHaveTextContent(
      "节气 log 1 页 + 家里 1 个 artifact",
    );
    expect(within(proseRegions[4]).getByText("关键")).toBeInTheDocument();
    expect(proseRegions[5]).toHaveTextContent(LIXIA_HEART);
    expect(
      screen.queryByRole("region", { name: "serendipity" }),
    ).not.toBeInTheDocument();
    expect(
      proseRegions[4].textContent?.match(/portfolio 里不刻意的 serendipity/g),
    ).toHaveLength(1);

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
      expectAtomBodyRendered(tightRegion, seededAtom(atom.slug));
    }
    for (const atom of expectedSlot.explore) {
      expectAtomBodyRendered(exploreRegion, seededAtom(atom.slug));
    }

    const exploreIntro = within(exploreRegion).getByText(/有空不妨试试/);
    expect(exploreIntro.textContent).toContain(
      "下面这些不一定贴她现在的兴趣",
    );
    expect(exploreIntro.textContent).not.toMatch(/顺路|又不亏|不亏|反正/);
  });

  it("renders real seed atom markdown as structured tables and nested routes", () => {
    const dongtan = viewFromSeed("g1-may-dongtan-migration-tail");
    const dongtanRender = render(<PathCuratedViewPage view={dongtan} />);

    const birdTable = screen.getByRole("table");
    expect(birdTable).toHaveTextContent("反嘴鹬");
    expect(birdTable).toHaveTextContent("黑翅长脚鹬");
    const dongtanFolderNames = screen.getAllByText("2026-05-10 东滩");
    expect(dongtanFolderNames).toHaveLength(1);
    expect(dongtanFolderNames[0].tagName).toBe("CODE");
    expect(screen.queryByText(/`2026-05-10 东滩`/)).not.toBeInTheDocument();

    dongtanRender.unmount();

    const baseline = viewFromSeed("g1-may-baseline");
    render(<PathCuratedViewPage view={baseline} />);

    const oceanFirstStep = closestListItemForText("海底隧道");
    const oceanList = oceanFirstStep.closest("ol");
    if (!oceanList) throw new Error("Ocean route should render as an ordered list");
    const oceanSteps = directListItems(oceanList);
    expect(oceanSteps).toHaveLength(5);
    expect(oceanSteps[4]).toHaveTextContent("出口 5 min");

    const yangtzeStep = closestListItemForText("长江区（中国淡水）");
    expect(yangtzeStep.closest("ol")).toBe(oceanList);
    const nestedLists = within(yangtzeStep).getAllByRole("list");
    expect(nestedLists.every((list) => list.tagName === "UL")).toBe(true);
    expect(within(yangtzeStep).getByText("可以讲的小故事")).toBeInTheDocument();
    expect(within(yangtzeStep).getByText(/长江江豚被叫/)).toBeInTheDocument();

    const naturalFirstStep = closestListItemForText("生命长河");
    const naturalList = naturalFirstStep.closest("ol");
    if (!naturalList) {
      throw new Error("Natural history route should render as an ordered list");
    }
    expect(directListItems(naturalList)).toHaveLength(4);
    expect(screen.getByRole("link", { name: "sh-aquarium.com" })).toHaveAttribute(
      "href",
      "https://www.sh-aquarium.com/zh/html/index.aspx",
    );
  });

  it("uses source-authored labels for baseline and labor budget prose", () => {
    const baseline = viewFromSeed("g1-may-baseline");
    const baselineRender = render(<PathCuratedViewPage view={baseline} />);

    expect(screen.getByRole("region", { name: "时间占用" })).toHaveTextContent(
      "一个月 3-5 次 weekend 半天",
    );
    expect(
      screen.queryByRole("region", { name: "为什么特别" }),
    ).not.toBeInTheDocument();

    baselineRender.unmount();

    const labor = viewFromSeed("g1-may-labor-holiday");
    render(<PathCuratedViewPage view={labor} />);

    expect(screen.getByRole("region", { name: "时间预算" })).toHaveTextContent(
      "5 天里用 1-2 天",
    );
    expect(
      screen.queryByRole("region", { name: "为什么特别" }),
    ).not.toBeInTheDocument();
  });

  it("renders ordered source prose blocks that do not fit the legacy five fields", () => {
    const baseline = viewFromSeed("g1-may-baseline");
    const baselineRender = render(<PathCuratedViewPage view={baseline} />);

    expect(renderedSectionLabels(baselineRender.container).slice(0, 4)).toEqual([
      "一句话",
      "时间占用",
      "产出",
      "心法",
    ]);
    expect(screen.getByRole("region", { name: "时间占用" })).toHaveTextContent(
      "≤ 总周末时间 40%",
    );

    baselineRender.unmount();

    const labor = viewFromSeed("g1-may-labor-holiday");
    const laborRender = render(<PathCuratedViewPage view={labor} />);

    expect(renderedSectionLabels(laborRender.container).slice(0, 6)).toEqual([
      "触发条件",
      "前置",
      "时间预算",
      "产出",
      "避坑",
      "心法",
    ]);
    expect(screen.getByRole("region", { name: "前置" })).toHaveTextContent(
      "家里有基本出行 planning 能力",
    );
    expect(screen.getByRole("region", { name: "避坑" })).toHaveTextContent(
      "提前预约票 + 尽量挪到 5/4 或 5/5",
    );

    laborRender.unmount();

    const lixia = viewFromSeed("g1-may-lixia-solar-term");
    const lixiaRender = render(<PathCuratedViewPage view={lixia} />);

    expect(screen.getByRole("region", { name: "前置" })).toHaveTextContent("无。");
    expect(screen.getByRole("region", { name: "时间" })).toHaveTextContent(
      "1-2 小时，不占 weekend 半天",
    );

    lixiaRender.unmount();

    const neighborhood = viewFromSeed("g1-may-neighborhood-ecology");
    const neighborhoodRender = render(<PathCuratedViewPage view={neighborhood} />);

    expect(screen.getByRole("region", { name: "时间" })).toHaveTextContent(
      "一次 15-30 分钟",
    );
    expect(
      screen.getByRole("region", {
        name: "5 种家门口可见的初夏生物（带辨识特征）",
      }),
    ).toHaveTextContent("菜粉蝶");

    neighborhoodRender.unmount();
  });

  it("uses source-authored labels for trigger and time-window prose", () => {
    const labor = viewFromSeed("g1-may-labor-holiday");
    const laborRender = render(<PathCuratedViewPage view={labor} />);

    expect(screen.getByRole("region", { name: "触发条件" })).toHaveTextContent(
      "每年 5/1-5 假期",
    );

    laborRender.unmount();

    const dongtan = viewFromSeed("g1-may-dongtan-migration-tail");
    const dongtanRender = render(<PathCuratedViewPage view={dongtan} />);

    expect(screen.getByRole("region", { name: "触发条件" })).toHaveTextContent(
      "每年 5 月上中旬",
    );
    expect(
      screen.getByRole("region", { name: "为什么是这个时间窗" }),
    ).toHaveTextContent("春季鸟类迁徙主季是 3-4 月");
    expect(renderedSectionLabels(dongtanRender.container).slice(0, 11)).toEqual([
      "触发条件",
      "前置",
      "时间",
      "为什么是这个时间窗",
      "出发前准备（家长花 5-10 分钟翻下面 5 种就够）",
      "怎么做（按顺序）",
      "产出",
      "避坑",
      "Backup plan（看不到鸟 / 天气不行时的替代）",
      "重要心法",
      "心法",
    ]);
    expect(
      screen.getByRole("region", {
        name: "Backup plan（看不到鸟 / 天气不行时的替代）",
      }),
    ).toHaveTextContent("完全不去崇明 backup");
    expect(screen.getByRole("region", { name: "重要心法" })).toHaveTextContent(
      "提前准备 2-3 个",
    );

    dongtanRender.unmount();

    const neighborhood = viewFromSeed("g1-may-neighborhood-ecology");
    render(<PathCuratedViewPage view={neighborhood} />);

    expect(screen.getByRole("region", { name: "触发条件" })).toHaveTextContent(
      "每年 5 月下旬起",
    );
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
    expect(region).toHaveTextContent("一个月 3-5 次 weekend 半天");
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
    expect(laborRegion).toHaveTextContent(
      "5 天里用 1-2 天 做 nature-themed 活动",
    );
    expect(within(laborRegion).getByText("1-2 天").tagName).toBe("STRONG");
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

  it("falls back to legacy prose when authored proseBlocks are partial", () => {
    const view = {
      slug: "test-partial-authored-prose",
      title: "Partial authored prose",
      month: 5,
      leadLine: "Legacy lead",
      whySpecial: "Legacy why",
      heart: null,
      output: null,
      serendipity: null,
      proseBlocks: [
        { key: "leadLine", label: "一句话", value: "Authored lead" },
        { key: "whySpecial", label: "为什么特别", value: "   " },
      ],
      defaultTightRatio: 100,
      frictionCeilingDefault: 3,
      atoms: [
        {
          atom: {
            slug: "partial-prose-atom",
            title: "Partial prose atom",
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

    expect(screen.getByRole("region", { name: "一句话" })).toHaveTextContent(
      "Legacy lead",
    );
    expect(screen.getByRole("region", { name: "为什么特别" })).toHaveTextContent(
      "Legacy why",
    );
    expect(screen.queryByText("Authored lead")).not.toBeInTheDocument();
  });

  it("falls back to legacy prose when authored proseBlocks repeat keys", () => {
    const view = {
      slug: "test-duplicate-authored-prose",
      title: "Duplicate authored prose",
      month: 5,
      leadLine: "Legacy lead",
      whySpecial: "Legacy why",
      heart: null,
      output: null,
      serendipity: null,
      proseBlocks: [
        { key: "leadLine", label: "一句话", value: "Authored lead" },
        { key: "leadLine", label: "重复一句话", value: "Duplicate lead" },
      ],
      defaultTightRatio: 100,
      frictionCeilingDefault: 3,
      atoms: [
        {
          atom: {
            slug: "duplicate-prose-atom",
            title: "Duplicate prose atom",
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

    expect(screen.getByRole("region", { name: "一句话" })).toHaveTextContent(
      "Legacy lead",
    );
    expect(screen.getByRole("region", { name: "为什么特别" })).toHaveTextContent(
      "Legacy why",
    );
    expect(screen.queryByText("Authored lead")).not.toBeInTheDocument();
    expect(screen.queryByText("Duplicate lead")).not.toBeInTheDocument();
  });

  it("falls back to legacy prose when a known view has valid but incomplete authored proseBlocks", () => {
    const view = {
      slug: "g1-may-labor-holiday",
      title: "Known view incomplete prose",
      month: 5,
      leadLine: "Legacy lead",
      whySpecial: "Legacy time budget",
      heart: null,
      output: null,
      serendipity: null,
      proseBlocks: [{ key: "leadLine", label: "触发条件", value: "Authored lead" }],
      defaultTightRatio: 100,
      frictionCeilingDefault: 3,
      atoms: [
        {
          atom: {
            slug: "known-incomplete-prose-atom",
            title: "Known incomplete prose atom",
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

    expect(screen.getByRole("region", { name: "触发条件" })).toHaveTextContent(
      "Legacy lead",
    );
    expect(screen.getByRole("region", { name: "时间预算" })).toHaveTextContent(
      "Legacy time budget",
    );
    expect(screen.queryByText("Authored lead")).not.toBeInTheDocument();
  });

  it("keeps authored prose DOM IDs distinct from fixed atom section IDs", () => {
    const view = {
      slug: "test-prose-id-collision",
      title: "ID collision proof",
      month: 5,
      leadLine: null,
      whySpecial: null,
      heart: null,
      output: null,
      serendipity: null,
      proseBlocks: [
        { key: "tight", label: "Tight prose", value: "Authored tight prose" },
        { key: "explore", label: "Explore prose", value: "Authored explore prose" },
      ],
      defaultTightRatio: 100,
      frictionCeilingDefault: 3,
      atoms: [
        {
          atom: {
            slug: "id-collision-atom",
            title: "ID collision atom",
            body: "Atom body",
            interests: [],
            frictionLevel: 0,
            cadenceRole: "LIGHT_RECURRING",
            displayOrder: 1,
          },
        },
      ],
    } satisfies CuratedViewProp;

    const { container } = render(<PathCuratedViewPage view={view} />);

    expect(container.querySelectorAll("#curated-prose-tight")).toHaveLength(1);
    expect(container.querySelectorAll("#curated-prose-explore")).toHaveLength(1);
    expect(container.querySelectorAll("#curated-tight")).toHaveLength(1);
    expect(container.querySelectorAll("#curated-explore")).toHaveLength(0);
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

    const body = screen
      .getAllByText(
        (_, element) => element?.textContent === "第一行\n第二行",
      )
      .find((element) => element.tagName === "P");
    if (!body) throw new Error("line-break paragraph should render");
    expect(body).toHaveStyle({ whiteSpace: "pre-wrap" });
  });

  it("renders parent-facing markdown as structure instead of raw syntax", () => {
    const view = {
      slug: "test-markdown-render",
      title: "Test markdown render",
      month: 5,
      leadLine: "> **重点**：[官网](https://example.com) 可查",
      whySpecial: null,
      heart: null,
      output: null,
      serendipity: null,
      defaultTightRatio: 100,
      frictionCeilingDefault: 3,
      atoms: [
        {
          atom: {
            slug: "markdown-atom",
            title: "Markdown atom",
            body: `| 物种 | 特征 |
|-|-|
| 菜粉蝶 | **白色小蝴蝶** |

- [资料](https://example.com/species)
- [内部](/path/seg/example)

1. **第一步** 看路线
2. **第二步** 讲故事
   - 💬 **故事**
     - 细节一
     - 细节二
3. **第三步** 收尾

_[提示 [路线](https://example.com/route) 查]_`,
            interests: [],
            frictionLevel: 0,
            cadenceRole: "LIGHT_RECURRING",
            displayOrder: 1,
          },
        },
      ],
    } satisfies CuratedViewProp;

    render(<PathCuratedViewPage view={view} />);

    expect(screen.getByText("重点").tagName).toBe("STRONG");
    expect(screen.getByRole("link", { name: "官网" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByRole("table")).toHaveTextContent("菜粉蝶");
    expect(screen.getByText("白色小蝴蝶").tagName).toBe("STRONG");
    expect(screen.getByRole("link", { name: "资料" })).toHaveAttribute(
      "href",
      "https://example.com/species",
    );
    expect(screen.getByRole("link", { name: "资料" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: "内部" })).toHaveAttribute(
      "href",
      "/path/seg/example",
    );
    expect(screen.getByRole("link", { name: "内部" })).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "路线" })).toHaveAttribute(
      "href",
      "https://example.com/route",
    );
    const blockquote = screen.getByText("重点").closest("blockquote");
    expect(blockquote).toBeInTheDocument();
    expect(blockquote).not.toHaveTextContent(">");
    const orderedLists = screen
      .getAllByRole("list")
      .filter((list) => list.tagName === "OL");
    expect(orderedLists).toHaveLength(1);
    const routeItems = Array.from(orderedLists[0].children);
    expect(routeItems).toHaveLength(3);
    expect(routeItems[2]).toHaveTextContent("第三步");
    const nestedLists = within(routeItems[1] as HTMLElement).getAllByRole("list");
    expect(nestedLists.every((list) => list.tagName === "UL")).toBe(true);
    expect(within(routeItems[1] as HTMLElement).getByText("故事").tagName).toBe(
      "STRONG",
    );
    expect(within(routeItems[1] as HTMLElement).getByText("细节二")).toBeInTheDocument();
    expect(screen.queryByText(/\*\*重点\*\*/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\[官网\]/)).not.toBeInTheDocument();
  });
});
