import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PathActivityDetail } from "@/components/path/path-activity-detail";

type RouteParams = Promise<{ activitySlug: string }>;

export default async function PathActivityPage({
  params,
}: {
  params: RouteParams;
}) {
  const { activitySlug } = await params;

  // v0.1: single global activity list ordered by displayOrder.
  // Fetched once to resolve current activity + prev/next neighbors.
  const all = await prisma.pathActivity.findMany({
    orderBy: { displayOrder: "asc" },
    select: { id: true, slug: true, title: true, displayOrder: true },
  });

  const idx = all.findIndex((a) => a.slug === activitySlug);
  if (idx === -1) notFound();

  const activity = await prisma.pathActivity.findUnique({
    where: { slug: activitySlug },
  });
  if (!activity) notFound();

  const prev = idx > 0 ? { slug: all[idx - 1].slug, title: all[idx - 1].title } : null;
  const next =
    idx < all.length - 1
      ? { slug: all[idx + 1].slug, title: all[idx + 1].title }
      : null;

  return (
    <div className="stage">
      <div
        className="stage-inner"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <PathActivityDetail
          activity={activity}
          index={idx}
          total={all.length}
          prev={prev}
          next={next}
        />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const rows = await prisma.pathActivity.findMany({ select: { slug: true } });
  return rows.map((r) => ({ activitySlug: r.slug }));
}
