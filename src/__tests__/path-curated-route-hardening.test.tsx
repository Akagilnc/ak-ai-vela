// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

const MOCK_CURATED_VIEWS = vi.hoisted(() => [
  {
    slug: "g1-may-baseline",
    title: "5 月底盘",
    leadLine: "5 月春末夏初，天气刚好。",
    whySpecial: "一个月 3-5 次 weekend 半天。",
  },
  {
    slug: "g1-may-dongtan-migration-tail",
    title: "东滩迁徙尾声段",
    leadLine: "每年 5 月上中旬，春季候鸟最后一批离开上海。",
    whySpecial: "春季鸟类迁徙主季是 3-4 月。",
  },
  {
    slug: "g1-may-labor-holiday",
    title: "劳动节 5 天段",
    leadLine: "每年 5/1-5 假期。",
    whySpecial: "5 天里用 1-2 天做 nature-themed 活动。",
  },
  {
    slug: "g1-may-lixia-solar-term",
    title: "立夏节气段",
    leadLine: "每年 5 月上旬立夏节气。",
    whySpecial: "立夏是 culture + nature 双触发点。",
  },
  {
    slug: "g1-may-neighborhood-ecology",
    title: "初夏家门口生态段",
    leadLine: "每年 5 月下旬起，第一批初夏物种开始出现。",
    whySpecial: "她家 50 米内就有 100 种生物。",
  },
]);

vi.mock("@/lib/prisma", () => ({
  prisma: {
    pathCuratedView: {
      findMany: async () => MOCK_CURATED_VIEWS.map(({ slug }) => ({ slug })),
    },
  },
}));

vi.mock("@/lib/path/curated-view-query", () => ({
  loadCuratedView: async (slug: string) =>
    MOCK_CURATED_VIEWS.find((view) => view.slug === slug) ?? null,
}));

import ErrorBoundary from "@/app/path/seg/[slug]/error";
import PathCuratedSegmentLayout from "@/app/path/seg/[slug]/layout";
import Loading from "@/app/path/seg/[slug]/loading";
import NotFound from "@/app/path/seg/[slug]/not-found";
import {
  generateMetadata,
  generateStaticParams,
} from "@/app/path/seg/[slug]/page";

const LIXIA_SLUG = "g1-may-lixia-solar-term";
const SEEDED_CURATED_SLUGS = [
  "g1-may-baseline",
  "g1-may-dongtan-migration-tail",
  "g1-may-labor-holiday",
  "g1-may-lixia-solar-term",
  "g1-may-neighborhood-ecology",
];

describe("/path/seg/[slug] route hardening", () => {
  it("renders a branded route-transition skeleton for curated segments", () => {
    render(<Loading />);

    const busyRegion = screen.getByLabelText("策展段加载中");
    expect(busyRegion).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Curated View")).toBeInTheDocument();
    expect(screen.getByText("贴身")).toBeInTheDocument();
    expect(screen.getByText("探索")).toBeInTheDocument();
  });

  it("renders the branded Chinese error boundary with retry and path fallback", () => {
    const reset = vi.fn();

    render(<ErrorBoundary error={new Error("db hiccup")} reset={reset} />);

    expect(
      screen.getByRole("heading", { name: "加载出了点问题" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "重试" }));
    expect(reset).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "返回当月卡片" })).toHaveAttribute(
      "href",
      "/path",
    );
  }, 15_000);

  it("hides error details in production", () => {
    const reset = vi.fn();
    vi.stubEnv("NODE_ENV", "production");

    try {
      render(<ErrorBoundary error={new Error("db hiccup")} reset={reset} />);
    } finally {
      vi.unstubAllEnvs();
    }

    expect(screen.getByRole("heading", { name: "加载出了点问题" })).toBeInTheDocument();
    expect(screen.queryByText("db hiccup")).not.toBeInTheDocument();
  });

  it("renders the branded curated segment not-found UI", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { name: "这张卡找不到了" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("链接可能已过期，或者卡片还没上线。回到当月卡片看看其他活动。"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回当月卡片" })).toHaveAttribute(
      "href",
      "/path",
    );
  });

  it("generates static params for every seeded curated-view slug", async () => {
    const params = await generateStaticParams();

    expect(params.map((param) => param.slug).sort()).toEqual(
      SEEDED_CURATED_SLUGS,
    );
  });

  it("generates metadata from curated-view title and authored prose", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: LIXIA_SLUG }),
    });

    expect(metadata).toEqual({
      title: "立夏节气段 · Vela Path Explorer",
      description: "每年 5 月上旬立夏节气。",
      openGraph: {
        title: "立夏节气段",
        description: "每年 5 月上旬立夏节气。",
        type: "article",
      },
    });
  });

  it("falls back to whySpecial when metadata leadLine is missing", async () => {
    const view = MOCK_CURATED_VIEWS[0] as {
      slug: string;
      title: string;
      leadLine: string | null;
      whySpecial: string | null;
    };
    const original = { leadLine: view.leadLine, whySpecial: view.whySpecial };
    view.leadLine = null;
    view.whySpecial = "为什么特别第一句。第二句不会进 metadata。";

    try {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: view.slug }),
      });

      expect(metadata.description).toBe("为什么特别第一句。");
      expect(metadata.openGraph).toMatchObject({
        description: "为什么特别第一句。",
      });
    } finally {
      Object.assign(view, original);
    }
  });

  it("omits metadata descriptions when both prose fields are empty", async () => {
    const view = MOCK_CURATED_VIEWS[0] as {
      slug: string;
      title: string;
      leadLine: string | null;
      whySpecial: string | null;
    };
    const original = { leadLine: view.leadLine, whySpecial: view.whySpecial };
    view.leadLine = null;
    view.whySpecial = null;

    try {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: view.slug }),
      });

      expect(metadata).toEqual({
        title: "5 月底盘 · Vela Path Explorer",
        openGraph: {
          title: "5 月底盘",
          type: "article",
        },
      });
    } finally {
      Object.assign(view, original);
    }
  });

  it("keeps existing curated-view slugs inside the streaming layout", async () => {
    const child = <div data-testid="validated-child" />;

    await expect(
      PathCuratedSegmentLayout({
        children: child,
        params: Promise.resolve({ slug: LIXIA_SLUG }),
      }),
    ).resolves.toEqual(child);
  });

  it("rejects unknown curated-view slugs before the loading stream starts", async () => {
    await expect(
      PathCuratedSegmentLayout({
        children: <div />,
        params: Promise.resolve({ slug: "__missing_curated_view__" }),
      }),
    ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
  });

  it("throws the route-level 404 for an unknown curated-view slug", async () => {
    await expect(
      generateMetadata({
        params: Promise.resolve({ slug: "__missing_curated_view__" }),
      }),
    ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
  });
});
