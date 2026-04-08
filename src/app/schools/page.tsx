import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SchoolFilters } from "./school-filters";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata = {
  title: "Browse Schools — Vela",
};

export default async function SchoolsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const stateFilter = typeof params.state === "string" ? params.state : undefined;
  const preVetOnly = params.preVet === "true";
  const sortBy = typeof params.sort === "string" ? params.sort : "ranking";

  const schools = await prisma.school.findMany({
    where: {
      ...(stateFilter ? { state: stateFilter } : {}),
      ...(preVetOnly ? { hasPreVetTrack: true } : {}),
    },
    orderBy: sortBy === "name"
      ? { name: "asc" }
      : sortBy === "acceptance"
        ? { acceptanceRate: "desc" }
        : sortBy === "cost"
          ? { estimatedAnnualCost: "asc" }
          : { ranking: "asc" },
  });

  const allStates = await prisma.school.findMany({
    select: { state: true },
    distinct: ["state"],
    orderBy: { state: "asc" },
  });
  const states = allStates.map((s) => s.state);

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-vela-text-secondary hover:text-vela-primary transition-colors"
          >
            &larr; Back
          </Link>
          <h1 className="text-3xl font-bold text-vela-heading font-display mt-2">
            Browse Schools
          </h1>
          <p className="text-vela-text-secondary mt-1">
            {schools.length} schools with pre-vet programs
          </p>
        </div>

        <SchoolFilters
          states={states}
          currentState={stateFilter}
          currentSort={sortBy}
          preVetOnly={preVetOnly}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {schools.map((school) => (
            <Link
              key={school.id}
              href={`/schools/${school.id}`}
              className="block bg-vela-surface border border-vela-border rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-vela-heading truncate">
                    {school.name}
                  </h2>
                  {school.nameZh && (
                    <p className="text-sm text-vela-text-secondary">
                      {school.nameZh}
                    </p>
                  )}
                </div>
                {school.ranking && (
                  <span className="ml-2 shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-vela-primary text-white text-sm font-mono font-bold">
                    #{school.ranking}
                  </span>
                )}
              </div>

              <p className="text-sm text-vela-text-secondary mb-3">
                {school.location}
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {school.acceptanceRate != null && (
                  <div>
                    <span className="text-vela-muted">Acceptance</span>
                    <p className="font-mono font-medium text-vela-text">
                      {(school.acceptanceRate * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
                {school.medianSAT != null && (
                  <div>
                    <span className="text-vela-muted">Median SAT</span>
                    <p className="font-mono font-medium text-vela-text">
                      {school.medianSAT}
                    </p>
                  </div>
                )}
                {school.estimatedAnnualCost != null && (
                  <div>
                    <span className="text-vela-muted">Annual Cost</span>
                    <p className="font-mono font-medium text-vela-text">
                      ${school.estimatedAnnualCost.toLocaleString()}
                    </p>
                  </div>
                )}
                {school.internationalStudentPct != null && (
                  <div>
                    <span className="text-vela-muted">International</span>
                    <p className="font-mono font-medium text-vela-text">
                      {(school.internationalStudentPct * 100).toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>

              {school.hasPreVetTrack && (
                <div className="mt-3 pt-3 border-t border-vela-border">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-vela-primary bg-vela-primary/10 px-2 py-1 rounded-full">
                    Pre-Vet Track
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>

        {schools.length === 0 && (
          <div className="text-center py-16 text-vela-text-secondary">
            No schools match your filters.
          </div>
        )}
      </div>
    </main>
  );
}
