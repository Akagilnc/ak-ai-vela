// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import ErrorBoundary from "@/app/path/seg/[slug]/error";
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
});
