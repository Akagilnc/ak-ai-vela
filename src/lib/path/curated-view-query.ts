import { cache } from "react";
import { prisma } from "@/lib/prisma";

const SLUG_PATTERN = /^[a-z0-9-]{1,80}$/;

export const loadCuratedView = cache(async (slug: string) => {
  if (!SLUG_PATTERN.test(slug)) return null;

  return prisma.pathCuratedView.findUnique({
    where: { slug },
    include: { atoms: { include: { atom: true } } },
  });
});
