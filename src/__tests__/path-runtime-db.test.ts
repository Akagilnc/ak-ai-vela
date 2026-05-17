import { describe, expect, it } from "vitest";

describe("Path overview runtime DB baseline", () => {
  it("can run the /path stage query through the app Prisma client", async () => {
    const { prisma } = await import("@/lib/prisma");

    const stage = await prisma.pathStage.findFirst({
      where: { slug: "g1-to-g3-foundation" },
    });

    expect(stage?.slug).toBe("g1-to-g3-foundation");
  });
});
