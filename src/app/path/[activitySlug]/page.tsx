import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PathActivityDetail } from "@/components/path/path-activity-detail";

type RouteParams = Promise<{ activitySlug: string }>;

// Slug shape guard: only accept lowercase alphanumerics + dashes, 1-80 chars.
// Rejects malformed paths before they hit Prisma (cheap DB-lookup shield).
const SLUG_PATTERN = /^[a-z0-9-]{1,80}$/;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

async function loadContext(activitySlug: string) {
  if (!SLUG_PATTERN.test(activitySlug)) return null;

  // v0.1: activities are all within the G1-G3 stage + month 5. Prev/next query
  // is scoped by the activity's own goal+month so it stays deterministic when
  // additional months / stages land in future seeds.
  const activity = await prisma.pathActivity.findUnique({
    where: { slug: activitySlug },
  });
  if (!activity) return null;

  const neighbors = await prisma.pathActivity.findMany({
    where: { goalId: activity.goalId, month: activity.month },
    orderBy: [{ displayOrder: "asc" }, { slug: "asc" }],
    select: { slug: true, title: true, displayOrder: true },
  });
  const idx = neighbors.findIndex((n) => n.slug === activitySlug);
  if (idx === -1) return null;

  const prev = idx > 0 ? neighbors[idx - 1] : null;
  const next = idx < neighbors.length - 1 ? neighbors[idx + 1] : null;

  return { activity, idx, total: neighbors.length, prev, next };
}

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { activitySlug } = await params;
  const ctx = await loadContext(activitySlug);
  if (!ctx) return { title: "Path Explorer · Vela" };

  const { activity } = ctx;
  const previews = (activity.previews as unknown as string[]) ?? [];
  const description = stripHtml(activity.summary).slice(0, 160);
  const ogImage = previews[0] ? `/assets/img/${previews[0]}` : undefined;

  return {
    title: `${activity.title} · Vela Path Explorer`,
    description,
    openGraph: {
      title: activity.title,
      description,
      type: "article",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function PathActivityPage({
  params,
}: {
  params: RouteParams;
}) {
  const { activitySlug } = await params;
  const ctx = await loadContext(activitySlug);
  if (!ctx) notFound();

  return (
    <div className="stage">
      <div
        className="stage-inner"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <PathActivityDetail
          activity={ctx.activity}
          index={ctx.idx}
          total={ctx.total}
          prev={ctx.prev ? { slug: ctx.prev.slug, title: ctx.prev.title } : null}
          next={ctx.next ? { slug: ctx.next.slug, title: ctx.next.title } : null}
        />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const rows = await prisma.pathActivity.findMany({ select: { slug: true } });
  return rows.map((r) => ({ activitySlug: r.slug }));
}
