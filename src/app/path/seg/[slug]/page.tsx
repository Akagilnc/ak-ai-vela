import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PathCuratedViewPage } from "@/components/path/path-curated-view";
import { prisma } from "@/lib/prisma";
import { loadCuratedView } from "@/lib/path/curated-view-query";

type RouteParams = Promise<{ slug: string }>;

function firstSentence(value: string | null): string | undefined {
  const text = value?.trim();
  if (!text) return undefined;
  return (text.match(/^.*?[。！？.!?]/u)?.[0] ?? text).trim();
}

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const view = await loadCuratedView(slug);
  if (!view) notFound();

  const description =
    firstSentence(view.leadLine) ?? firstSentence(view.whySpecial);

  return {
    title: `${view.title} · Vela Path Explorer`,
    ...(description ? { description } : {}),
    openGraph: {
      title: view.title,
      ...(description ? { description } : {}),
      type: "article",
    },
  };
}

export default async function PathCuratedSegmentPage({
  params,
}: {
  params: RouteParams;
}) {
  const { slug } = await params;
  const view = await loadCuratedView(slug);
  // Keep dynamicParams at its default (true): curated views are DB-seeded, so a
  // newly seeded slug must resolve immediately without a rebuild.
  if (!view) notFound();

  return (
    <div className="stage">
      <div
        className="stage-inner"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <PathCuratedViewPage view={view} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const rows = await prisma.pathCuratedView.findMany({
    select: { slug: true },
  });
  return rows.map((row) => ({ slug: row.slug }));
}
