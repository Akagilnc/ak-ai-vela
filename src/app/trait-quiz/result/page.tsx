/**
 * v0.6 trait quiz result page — `/trait-quiz/result?score=ABC123`
 *
 * Server-rendered (Next.js 16 async page) per test plan §6.1 + §6.2.
 *   - searchParams is a Promise<{ score?: string | string[] }>
 *   - Repeated query (?score=a&score=b) → take first
 *   - Missing → render Empty state
 *   - decode error variants → render Error state with appropriate copy
 */

import { decodeAndClassifyScore } from "@/lib/traits/temperament/score-encoding";
import { ResultPage } from "@/components/trait-quiz/v6/result-page";
import { ResultEmptyState, ResultErrorState } from "@/components/trait-quiz/v6/error-states";

type SearchParams = Promise<{ score?: string | string[] }>;

export default async function TraitQuizResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  // Normalize repeated query: take first item
  const score = Array.isArray(params.score) ? params.score[0] : params.score;

  if (!score || score.length === 0) {
    return <ResultEmptyState />;
  }

  const decoded = decodeAndClassifyScore(score);
  if ("error" in decoded) {
    return <ResultErrorState variant={decoded.error} score={score} />;
  }

  return (
    <ResultPage
      type={decoded.type}
      confidence={decoded.confidence}
      dimScores={decoded.dims}
    />
  );
}
