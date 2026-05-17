import { notFound } from "next/navigation";
import { loadCuratedView } from "@/lib/path/curated-view-query";

type RouteParams = Promise<{ slug: string }>;

export default async function PathCuratedSegmentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: RouteParams;
}) {
  const { slug } = await params;
  // This gate runs before loading.tsx can stream, so missing slugs get a real 404.
  const view = await loadCuratedView(slug);

  if (!view) notFound();

  return children;
}
