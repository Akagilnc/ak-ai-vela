import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RadarChart } from "./radar-chart";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const school = await prisma.school.findUnique({ where: { id } });
  if (!school) return { title: "School Not Found — Vela" };
  return { title: `${school.name} — Vela` };
}

export default async function SchoolDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const school = await prisma.school.findUnique({ where: { id } });
  if (!school) notFound();

  const programs: string[] = JSON.parse(school.programs);
  const deadline = school.applicationDeadline
    ? JSON.parse(school.applicationDeadline)
    : null;
  const scholarships = school.internationalScholarships
    ? JSON.parse(school.internationalScholarships)
    : null;

  const radarData = {
    acceptance: school.radarAcceptance ?? 0,
    international: school.radarInternational ?? 0,
    sat: school.radarSAT ?? 0,
    cost: school.radarCost ?? 0,
    aid: school.radarAid ?? 0,
  };

  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <Link
          href="/schools"
          className="text-sm text-vela-text-secondary hover:text-vela-primary transition-colors"
        >
          &larr; Back to Schools
        </Link>

        {/* Header */}
        <div className="mt-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-vela-heading font-display">
                {school.name}
              </h1>
              {school.nameZh && (
                <p className="text-lg text-vela-text-secondary mt-1">
                  {school.nameZh}
                </p>
              )}
              <p className="text-vela-text-secondary mt-1">{school.location}</p>
            </div>
            {school.ranking && (
              <div className="text-center">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-vela-primary text-white text-xl font-mono font-bold">
                  #{school.ranking}
                </span>
                <p className="text-xs text-vela-muted mt-1">US News</p>
              </div>
            )}
          </div>
          {school.website && (
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-vela-primary hover:underline"
            >
              Visit Website &rarr;
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: data sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Admissions */}
            <section className="bg-vela-surface border border-vela-border rounded-lg p-5">
              <h2 className="text-xl font-semibold text-vela-heading font-display mb-4">
                Admissions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Stat label="Acceptance Rate" value={school.acceptanceRate != null ? `${(school.acceptanceRate * 100).toFixed(1)}%` : null} />
                <Stat label="Intl Accept Rate" value={school.internationalAcceptRate != null ? `${(school.internationalAcceptRate * 100).toFixed(1)}%` : null} />
                <Stat label="Median SAT" value={school.medianSAT?.toString()} />
                <Stat label="SAT Range" value={school.sat25th && school.sat75th ? `${school.sat25th}–${school.sat75th}` : null} />
                <Stat label="Median ACT" value={school.medianACT?.toString()} />
                <Stat label="ACT Range" value={school.act25th && school.act75th ? `${school.act25th}–${school.act75th}` : null} />
                <Stat label="Avg GPA" value={school.avgGPA?.toFixed(2)} />
                <Stat label="English Req" value={school.englishRequirements} mono={false} />
              </div>
              {deadline && (
                <div className="mt-4 pt-4 border-t border-vela-border">
                  <p className="text-sm text-vela-muted mb-2">Application Deadlines</p>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(deadline).map(([type, date]) => (
                      <span
                        key={type}
                        className="inline-flex items-center gap-1 text-sm bg-vela-secondary/20 text-vela-heading px-3 py-1 rounded-full"
                      >
                        <span className="font-medium">{type}:</span> {date as string}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Financial */}
            <section className="bg-vela-surface border border-vela-border rounded-lg p-5">
              <h2 className="text-xl font-semibold text-vela-heading font-display mb-4">
                Financial
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Stat label="Annual Cost" value={school.estimatedAnnualCost != null ? `$${school.estimatedAnnualCost.toLocaleString()}` : null} />
                <Stat label="Aid Recipients" value={school.financialAidPct != null ? `${(school.financialAidPct * 100).toFixed(0)}%` : null} />
                <Stat label="Need-Blind" value={school.needBlind ? "Yes" : "No"} mono={false} />
              </div>
              {scholarships && (
                <p className="mt-4 pt-4 border-t border-vela-border text-sm text-vela-text">
                  {scholarships}
                </p>
              )}
            </section>

            {/* International */}
            <section className="bg-vela-surface border border-vela-border rounded-lg p-5">
              <h2 className="text-xl font-semibold text-vela-heading font-display mb-4">
                International Students
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Stat label="Intl Students" value={school.internationalStudentPct != null ? `${(school.internationalStudentPct * 100).toFixed(0)}%` : null} />
                <Stat label="Visa/OPT" value={school.visaOPTSupport ? "Supported" : "N/A"} mono={false} />
              </div>
            </section>

            {/* Pre-Vet */}
            {school.hasPreVetTrack && (
              <section className="bg-vela-surface border border-vela-border rounded-lg p-5">
                <h2 className="text-xl font-semibold text-vela-heading font-display mb-3">
                  Pre-Vet Program
                </h2>
                {school.preVetNotes && (
                  <p className="text-sm text-vela-text leading-relaxed">
                    {school.preVetNotes}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {programs.map((p) => (
                    <span
                      key={p}
                      className="text-xs bg-vela-primary/10 text-vela-primary px-2 py-1 rounded-full"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column: radar chart */}
          <div className="lg:col-span-1">
            <div className="bg-vela-surface border border-vela-border rounded-lg p-5 sticky top-8">
              <h2 className="text-xl font-semibold text-vela-heading font-display mb-4">
                Profile
              </h2>
              <RadarChart data={radarData} />
              <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
                <RadarLegendItem label="Acceptance" value={radarData.acceptance} />
                <RadarLegendItem label="International" value={radarData.international} />
                <RadarLegendItem label="SAT Competitiveness" value={radarData.sat} />
                <RadarLegendItem label="Affordability" value={radarData.cost} />
                <RadarLegendItem label="Financial Aid" value={radarData.aid} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  mono = true,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-vela-muted text-xs">{label}</p>
      <p
        className={`text-vela-text font-medium ${mono ? "font-mono" : ""}`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

function RadarLegendItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-vela-text-secondary">{label}</span>
      <span className="font-mono font-medium text-vela-text">{value}</span>
    </div>
  );
}
