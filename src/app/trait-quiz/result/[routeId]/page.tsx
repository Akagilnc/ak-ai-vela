/**
 * Legacy v0.5 result page route — `/trait-quiz/result/[routeId]`.
 *
 * v0.6 uses `/trait-quiz/result?score=...` instead. Old shared URLs from
 * v0.5 land here. Per test plan CP3, render a graceful "测评已升级"
 * message rather than 404 or React error boundary.
 */

import { ResultErrorState } from "@/components/trait-quiz/v6/error-states";

type Params = Promise<{ routeId: string }>;

export default async function LegacyTraitResultPage({
  params,
}: {
  params: Params;
}) {
  const { routeId } = await params;
  // Pass the legacy routeId as "score" so the error UI shows context;
  // schema_unsupported variant emits "测评已升级" copy.
  return <ResultErrorState variant="schema_unsupported" score={routeId} />;
}
