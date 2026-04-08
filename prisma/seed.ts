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
    sat25th: 1450,
    sat75th: 1570,
    act25th: 33,
    act75th: 35,
    avgGPA: 3.9,
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
    sat25th: 1230,
    sat75th: 1450,
    act25th: 27,
    act75th: 33,
    avgGPA: 3.7,
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
    sat25th: 1090,
    sat75th: 1310,
    act25th: 23,
    act75th: 29,
    avgGPA: 3.4,
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
  {
    name: "University of Pennsylvania",
    nameZh: "宾夕法尼亚大学",
    location: "Philadelphia, PA",
    state: "PA",
    ranking: 6,
    website: "https://www.upenn.edu",
    programs: JSON.stringify(["pre-vet", "biology", "animal-science"]),
    acceptanceRate: 0.059,
    internationalAcceptRate: 0.05,
    medianSAT: 1540,
    medianACT: 35,
    sat25th: 1500,
    sat75th: 1570,
    act25th: 34,
    act75th: 36,
    avgGPA: 3.95,
    applicationDeadline: JSON.stringify({ ED: "Nov 1", RD: "Jan 5" }),
    internationalStudentPct: 0.12,
    internationalScholarships: JSON.stringify(
      "Need-based aid available for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 100+ / IELTS 7.0+",
    estimatedAnnualCost: 87000,
    financialAidPct: 0.53,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to Penn Vet, one of the oldest vet schools in the US. Strong pre-vet advising through the College of Arts & Sciences.",
    radarAcceptance: 10,
    radarInternational: 50,
    radarSAT: 98,
    radarCost: 15,
    radarAid: 65,
  },
  {
    name: "Tufts University",
    nameZh: "塔夫茨大学",
    location: "Medford, MA",
    state: "MA",
    ranking: 40,
    website: "https://www.tufts.edu",
    programs: JSON.stringify(["pre-vet", "biology", "animal-science"]),
    acceptanceRate: 0.10,
    internationalAcceptRate: 0.09,
    medianSAT: 1490,
    medianACT: 34,
    sat25th: 1430,
    sat75th: 1540,
    act25th: 33,
    act75th: 35,
    avgGPA: 3.9,
    applicationDeadline: JSON.stringify({ ED1: "Nov 1", ED2: "Jan 4", RD: "Jan 4" }),
    internationalStudentPct: 0.14,
    internationalScholarships: JSON.stringify(
      "Need-based aid available for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 100+ / IELTS 7.0+",
    estimatedAnnualCost: 82000,
    financialAidPct: 0.50,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to Cummings School of Veterinary Medicine. Exceptional pre-vet track with early clinical exposure.",
    radarAcceptance: 18,
    radarInternational: 55,
    radarSAT: 93,
    radarCost: 18,
    radarAid: 60,
  },
  {
    name: "University of Wisconsin-Madison",
    nameZh: "威斯康星大学麦迪逊分校",
    location: "Madison, WI",
    state: "WI",
    ranking: 35,
    website: "https://www.wisc.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    acceptanceRate: 0.49,
    internationalAcceptRate: 0.45,
    medianSAT: 1400,
    medianACT: 31,
    sat25th: 1330,
    sat75th: 1480,
    act25th: 29,
    act75th: 33,
    avgGPA: 3.8,
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Feb 1" }),
    internationalStudentPct: 0.13,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.5+",
    estimatedAnnualCost: 58000,
    financialAidPct: 0.60,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "Top 10 vet school. Strong dairy and large-animal programs. Pre-vet advising through CALS.",
    radarAcceptance: 65,
    radarInternational: 55,
    radarSAT: 80,
    radarCost: 45,
    radarAid: 65,
  },
  {
    name: "Ohio State University",
    nameZh: "俄亥俄州立大学",
    location: "Columbus, OH",
    state: "OH",
    ranking: 43,
    website: "https://www.osu.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    acceptanceRate: 0.53,
    internationalAcceptRate: 0.48,
    medianSAT: 1370,
    medianACT: 30,
    sat25th: 1290,
    sat75th: 1450,
    act25th: 28,
    act75th: 33,
    avgGPA: 3.75,
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Feb 1" }),
    internationalStudentPct: 0.11,
    internationalScholarships: JSON.stringify(
      "International merit scholarships available ($2k-$10k)"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 56000,
    financialAidPct: 0.72,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "Top 5 vet school. Pre-vet early assurance program. Large animal hospital on campus.",
    radarAcceptance: 70,
    radarInternational: 45,
    radarSAT: 75,
    radarCost: 48,
    radarAid: 75,
  },
  {
    name: "Texas A&M University",
    nameZh: "德州农工大学",
    location: "College Station, TX",
    state: "TX",
    ranking: 47,
    website: "https://www.tamu.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    acceptanceRate: 0.63,
    internationalAcceptRate: 0.55,
    medianSAT: 1310,
    medianACT: 29,
    sat25th: 1210,
    sat75th: 1420,
    act25th: 26,
    act75th: 32,
    avgGPA: 3.65,
    applicationDeadline: JSON.stringify({ EA: "Oct 15", RD: "Dec 1" }),
    internationalStudentPct: 0.06,
    internationalScholarships: JSON.stringify(
      "International merit scholarships available ($3k-$12k)"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.0+",
    estimatedAnnualCost: 52000,
    financialAidPct: 0.65,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "Top 5 vet school with the largest veterinary teaching hospital. Strong pre-vet pipeline with guaranteed interview program.",
    radarAcceptance: 78,
    radarInternational: 25,
    radarSAT: 65,
    radarCost: 55,
    radarAid: 70,
  },
  {
    name: "University of Florida",
    nameZh: "佛罗里达大学",
    location: "Gainesville, FL",
    state: "FL",
    ranking: 27,
    website: "https://www.ufl.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    acceptanceRate: 0.23,
    internationalAcceptRate: 0.20,
    medianSAT: 1420,
    medianACT: 32,
    sat25th: 1350,
    sat75th: 1500,
    act25th: 30,
    act75th: 34,
    avgGPA: 3.85,
    applicationDeadline: JSON.stringify({ RD: "Nov 1" }),
    internationalStudentPct: 0.06,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.0+",
    estimatedAnnualCost: 50000,
    financialAidPct: 0.70,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "Top 10 vet school. Excellent pre-vet advising through CALS. Large animal hospital and wildlife clinic.",
    radarAcceptance: 40,
    radarInternational: 25,
    radarSAT: 85,
    radarCost: 55,
    radarAid: 75,
  },
  {
    name: "Purdue University",
    nameZh: "普渡大学",
    location: "West Lafayette, IN",
    state: "IN",
    ranking: 51,
    website: "https://www.purdue.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    acceptanceRate: 0.53,
    internationalAcceptRate: 0.48,
    medianSAT: 1350,
    medianACT: 30,
    sat25th: 1260,
    sat75th: 1450,
    act25th: 27,
    act75th: 33,
    avgGPA: 3.7,
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Jan 15" }),
    internationalStudentPct: 0.20,
    internationalScholarships: JSON.stringify(
      "Merit-based scholarships available for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.5+",
    estimatedAnnualCost: 48000,
    financialAidPct: 0.62,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "Top 10 vet school. Strong pre-vet program with early clinical exposure. High international student community.",
    radarAcceptance: 70,
    radarInternational: 80,
    radarSAT: 72,
    radarCost: 55,
    radarAid: 65,
  },
  {
    name: "Michigan State University",
    nameZh: "密歇根州立大学",
    location: "East Lansing, MI",
    state: "MI",
    ranking: 77,
    website: "https://www.msu.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    acceptanceRate: 0.71,
    internationalAcceptRate: 0.65,
    medianSAT: 1250,
    medianACT: 27,
    sat25th: 1140,
    sat75th: 1350,
    act25th: 24,
    act75th: 30,
    avgGPA: 3.5,
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Feb 1" }),
    internationalStudentPct: 0.14,
    internationalScholarships: JSON.stringify(
      "International merit awards available ($5k-$20k)"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 55000,
    financialAidPct: 0.70,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "Top 10 vet school. Pre-vet early admission program. Extensive animal labs and farm facilities.",
    radarAcceptance: 82,
    radarInternational: 55,
    radarSAT: 50,
    radarCost: 48,
    radarAid: 75,
  },
  {
    name: "University of Georgia",
    nameZh: "佐治亚大学",
    location: "Athens, GA",
    state: "GA",
    ranking: 47,
    website: "https://www.uga.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    acceptanceRate: 0.43,
    internationalAcceptRate: 0.38,
    medianSAT: 1360,
    medianACT: 30,
    sat25th: 1280,
    sat75th: 1440,
    act25th: 28,
    act75th: 33,
    avgGPA: 3.8,
    applicationDeadline: JSON.stringify({ EA: "Oct 15", RD: "Jan 1" }),
    internationalStudentPct: 0.05,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.5+",
    estimatedAnnualCost: 52000,
    financialAidPct: 0.65,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "Top 15 vet school. Strong pre-vet pipeline with early assurance program. Wildlife and exotic animal facilities.",
    radarAcceptance: 60,
    radarInternational: 20,
    radarSAT: 75,
    radarCost: 52,
    radarAid: 68,
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
