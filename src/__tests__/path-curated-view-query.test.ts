import { beforeEach, describe, expect, it, vi } from "vitest";

const findUnique = vi.hoisted(() => vi.fn());

vi.mock("@/lib/prisma", () => ({
  prisma: {
    pathCuratedView: {
      findUnique,
    },
  },
}));

import { loadCuratedView } from "@/lib/path/curated-view-query";

describe("loadCuratedView", () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it("rejects malformed slugs before they hit Prisma", async () => {
    await expect(loadCuratedView("../secret")).resolves.toBeNull();
    await expect(loadCuratedView("g1-may-baseline!")).resolves.toBeNull();
    await expect(loadCuratedView("A".repeat(81))).resolves.toBeNull();

    expect(findUnique).not.toHaveBeenCalled();
  });

  it("queries Prisma for valid curated slugs", async () => {
    findUnique.mockResolvedValueOnce({ slug: "g1-may-baseline" });

    await expect(loadCuratedView("g1-may-baseline")).resolves.toEqual({
      slug: "g1-may-baseline",
    });
    expect(findUnique).toHaveBeenCalledWith({
      where: { slug: "g1-may-baseline" },
      include: { atoms: { include: { atom: true } } },
    });
  });
});
