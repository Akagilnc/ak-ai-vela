import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PathCuratedViewPage } from "@/components/path/path-curated-view";

type RouteParams = Promise<{ slug: string }>;

const loadCuratedView = cache(async (slug: string) => {
  return prisma.pathCuratedView.findUnique({
    where: { slug },
    include: { atoms: { include: { atom: true } } },
  });
});

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
  if (!view) return { title: "Path Explorer · Vela" };

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
  // newly seeded slug must resolve immediately without a rebuild. notFound()
  // returns a real HTTP 404 + not-found UI in production; `next dev` streams it
  // as 200 (framework artifact). Do NOT add `dynamicParams = false` to "fix"
  // that — it would 404 every newly seeded view until the next build.
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
