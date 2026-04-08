import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const url =
  process.env.DATABASE_URL ||
  `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

const schools = [
  {
    name: "Cornell University",
    nameZh: "康奈尔大学",
    location: "Ithaca, NY",
    state: "NY",
    ranking: 17,
    website: "https://www.cornell.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    acceptanceRate: 0.089,
    internationalAcceptRate: 0.08,
    medianSAT: 1510,
    medianACT: 34,
    applicationDeadline: JSON.stringify({ ED: "Nov 1", RD: "Jan 2" }),
    internationalStudentPct: 0.11,
    internationalScholarships: JSON.stringify(
      "Need-based aid available for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 100+ / IELTS 7.0+",
    estimatedAnnualCost: 82000,
    financialAidPct: 0.55,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "College of Agriculture and Life Sciences offers dedicated pre-vet advising. Home to one of the top vet schools (Cornell CVM).",
    radarAcceptance: 15,
    radarInternational: 55,
    radarSAT: 95,
    radarCost: 20,
    radarAid: 70,
  },
  {
    name: "University of California, Davis",
    nameZh: "加州大学戴维斯分校",
    location: "Davis, CA",
    state: "CA",
    ranking: 28,
    website: "https://www.ucdavis.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    acceptanceRate: 0.369,
    internationalAcceptRate: 0.35,
    medianSAT: 1330,
    medianACT: 30,
    applicationDeadline: JSON.stringify({ RD: "Nov 30" }),
    internationalStudentPct: 0.17,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 7.0+",
    estimatedAnnualCost: 70000,
    financialAidPct: 0.68,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "#1 ranked veterinary school in the US. Extensive animal science research facilities. Strong pre-vet advising program.",
    radarAcceptance: 55,
    radarInternational: 70,
    radarSAT: 70,
    radarCost: 35,
    radarAid: 75,
  },
  {
    name: "Colorado State University",
    nameZh: "科罗拉多州立大学",
    location: "Fort Collins, CO",
    state: "CO",
    ranking: 151,
    website: "https://www.colostate.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    acceptanceRate: 0.85,
    internationalAcceptRate: 0.80,
    medianSAT: 1200,
    medianACT: 26,
    applicationDeadline: JSON.stringify({ EA: "Dec 1", RD: "Feb 1" }),
    internationalStudentPct: 0.05,
    internationalScholarships: JSON.stringify(
      "International merit awards available ($5k-$15k)"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 45000,
    financialAidPct: 0.78,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "Top 3 vet school. Excellent hands-on animal experience opportunities. Pre-vet living-learning community.",
    radarAcceptance: 90,
    radarInternational: 30,
    radarSAT: 40,
    radarCost: 65,
    radarAid: 80,
  },
];

async function seedSchools() {
  console.log("Seeding schools (safe for existing student data)...");

  for (const school of schools) {
    const existing = await prisma.school.findFirst({
      where: { name: school.name, state: school.state },
    });

    if (existing) {
      await prisma.school.update({ where: { id: existing.id }, data: school });
    } else {
      await prisma.school.create({ data: school });
    }
  }

  console.log(`Seeded ${schools.length} schools`);
}

async function resetAll() {
  console.log("RESETTING: clearing ALL data and re-seeding...");

  await prisma.questionnaireResult.deleteMany();
  await prisma.student.deleteMany();
  await prisma.school.deleteMany();

  for (const school of schools) {
    await prisma.school.create({ data: school });
  }

  console.log(`Reset complete. Seeded ${schools.length} schools`);
}

async function main() {
  const isReset = process.argv.includes("--reset");

  if (isReset) {
    await resetAll();
  } else {
    await seedSchools();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
