import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const loadCuratedView = cache(async (slug: string) => {
  return prisma.pathCuratedView.findUnique({
    where: { slug },
    include: { atoms: { include: { atom: true } } },
  });
});
