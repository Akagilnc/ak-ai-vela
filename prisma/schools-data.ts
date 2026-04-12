// Shared school seed data used by both prisma/seed.ts and the test
// globalSetup that provisions an isolated SQLite database for vitest.
// Keeping this as a pure data module (no prisma import) lets tests import
// it without triggering the PrismaClient singleton in seed.ts.
//
// Data provenance fields (dataSource, dataConfidence, etc.) track where
// each school's admissions numbers came from and how much we trust them.
// See prisma/schema.prisma for field definitions.
//
// PR #2 (v0.3.3.0): Re-verified all 12 schools against CDS 2024-2025.
// Schools that stopped reporting SAT/ACT (test-free) or GPA have those
// fields set to null with dataConfidence reflecting the gap.

export const schools = [
  {
    // SOURCE: CDS 2024-2025 from irp.dpb.cornell.edu
    name: "Cornell University",
    nameZh: "康奈尔大学",
    location: "Ithaca, NY",
    state: "NY",
    ranking: 17,
    website: "https://www.cornell.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.084,
    internationalAcceptRate: null, // CDS does not break out international acceptance separately
    medianSAT: 1535,
    medianACT: 34,
    sat25th: 1500,
    sat75th: 1570,
    act25th: 33,
    act75th: 35,
    avgGPA: null, // Cornell does not report GPA in CDS 2024-2025
    applicationDeadline: JSON.stringify({ ED: "Nov 1", RD: "Jan 2" }),
    internationalStudentPct: 0.103,
    internationalScholarships: JSON.stringify(
      "Need-based aid available for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 100+ / IELTS 7.0+",
    estimatedAnnualCost: 92844,
    financialAidPct: 0.55, // broad estimate, retained from prior seed
    needBasedAidPct: 0.47,
    needBlind: false, // need-aware for international applicants
    hasPreVetTrack: true,
    preVetNotes:
      "College of Agriculture and Life Sciences offers dedicated pre-vet advising. Home to one of the top vet schools (Cornell CVM).",
    radarAcceptance: 15,
    radarInternational: 55,
    radarSAT: 95,
    radarCost: 10,
    radarAid: 60,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://irp.dpb.cornell.edu/wp-content/uploads/2025/07/CDS-2024-2025-v6-print.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial", // CDS fields verified; financialAidPct retained from prior seed
  },
  {
    // SOURCE: CDS 2024-2025 from aggiedata.ucdavis.edu
    // NOTE: UC Davis is test-free; SAT/ACT not reported in CDS
    name: "University of California, Davis",
    nameZh: "加州大学戴维斯分校",
    location: "Davis, CA",
    state: "CA",
    ranking: 28,
    website: "https://www.ucdavis.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "free",
    acceptanceRate: 0.418,
    internationalAcceptRate: null,
    medianSAT: null, // test-free admissions
    medianACT: null,
    sat25th: null,
    sat75th: null,
    act25th: null,
    act75th: null,
    avgGPA: 4.0, // CDS reports 4.04 (weighted); capped to 4.0 for engine compatibility
    applicationDeadline: JSON.stringify({ RD: "Nov 30" }),
    internationalStudentPct: 0.130,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 7.0+",
    estimatedAnnualCost: 75724,
    financialAidPct: 0.68, // broad estimate, retained from prior seed
    needBasedAidPct: 0.536,
    needBlind: true, // UC system is need-blind for domestic by policy
    hasPreVetTrack: true,
    preVetNotes:
      "#1 ranked veterinary school in the US. Extensive animal science research facilities. Strong pre-vet advising program.",
    radarAcceptance: 55,
    radarInternational: 60,
    radarSAT: null, // test-free: no radar for SAT
    radarCost: 30,
    radarAid: 65,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://aggiedata.ucdavis.edu/sites/g/files/dgvnsk1841/files/media/documents/CDS_UCD.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial", // CDS fields verified; financialAidPct retained from prior seed
  },
  {
    // SOURCE: CDS 2024-2025 (FY2026) from ir.colostate.edu
    // NOTE: CSU is test-free; SAT/ACT not reported in CDS
    name: "Colorado State University",
    nameZh: "科罗拉多州立大学",
    location: "Fort Collins, CO",
    state: "CO",
    ranking: 151,
    website: "https://www.colostate.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "free",
    acceptanceRate: 0.886,
    internationalAcceptRate: null,
    medianSAT: null, // test-free admissions
    medianACT: null,
    sat25th: null,
    sat75th: null,
    act25th: null,
    act75th: null,
    avgGPA: 3.7,
    applicationDeadline: JSON.stringify({ EA: "Dec 1", RD: "Feb 1" }),
    internationalStudentPct: 0.025,
    internationalScholarships: JSON.stringify(
      "International merit awards available ($5k-$15k)"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 53621,
    financialAidPct: 0.78, // broad estimate, retained from prior seed
    needBasedAidPct: 0.471,
    needBlind: false,
    hasPreVetTrack: true,
    preVetNotes:
      "Top 3 vet school. Excellent hands-on animal experience opportunities. Pre-vet living-learning community.",
    radarAcceptance: 90,
    radarInternational: 20,
    radarSAT: null, // test-free: no radar for SAT
    radarCost: 50,
    radarAid: 60,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://www.ir.colostate.edu/wp-content/uploads/sites/21/2026/03/CSU_CDS_FY2026_Access.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial", // CDS fields verified; financialAidPct retained from prior seed
  },
  {
    // SOURCE: CDS 2024-2025 from ira.upenn.edu
    name: "University of Pennsylvania",
    nameZh: "宾夕法尼亚大学",
    location: "Philadelphia, PA",
    state: "PA",
    ranking: 6,
    website: "https://www.upenn.edu",
    programs: JSON.stringify(["pre-vet", "biology", "animal-science"]),
    testPolicy: "optional",
    acceptanceRate: 0.054,
    internationalAcceptRate: null,
    medianSAT: 1540,
    medianACT: 35,
    sat25th: 1510,
    sat75th: 1570,
    act25th: 34,
    act75th: 36,
    avgGPA: 3.9,
    applicationDeadline: JSON.stringify({ ED: "Nov 1", RD: "Jan 5" }),
    internationalStudentPct: 0.133,
    internationalScholarships: JSON.stringify(
      "Need-based aid available for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 100+ / IELTS 7.0+",
    estimatedAnnualCost: 91112,
    financialAidPct: 0.53, // broad estimate, retained from prior seed
    needBasedAidPct: 0.496,
    needBlind: true, // UPenn is need-blind for domestic applicants
    hasPreVetTrack: true,
    preVetNotes:
      "Home to Penn Vet, one of the oldest vet schools in the US. Strong pre-vet advising through the College of Arts & Sciences.",
    radarAcceptance: 10,
    radarInternational: 55,
    radarSAT: 98,
    radarCost: 10,
    radarAid: 60,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl: "https://ira.upenn.edu/penn-numbers/common-data-set",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial", // CDS fields verified; financialAidPct retained from prior seed
  },
  {
    // SOURCE: CDS 2024-2025 from provost.tufts.edu
    // NOTE: Tufts does not report GPA in CDS
    name: "Tufts University",
    nameZh: "塔夫茨大学",
    location: "Medford, MA",
    state: "MA",
    ranking: 40,
    website: "https://www.tufts.edu",
    programs: JSON.stringify(["pre-vet", "biology", "animal-science"]),
    testPolicy: "optional",
    acceptanceRate: 0.115,
    internationalAcceptRate: null,
    medianSAT: 1515,
    medianACT: 34,
    sat25th: 1470,
    sat75th: 1560,
    act25th: 33,
    act75th: 35,
    avgGPA: null, // Tufts does not report GPA in CDS 2024-2025
    applicationDeadline: JSON.stringify({
      ED1: "Nov 1",
      ED2: "Jan 4",
      RD: "Jan 4",
    }),
    internationalStudentPct: 0.125,
    internationalScholarships: JSON.stringify(
      "Need-based aid available for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 100+ / IELTS 7.0+",
    estimatedAnnualCost: 93182,
    financialAidPct: 0.50, // broad estimate, retained from prior seed
    needBasedAidPct: 0.378,
    needBlind: false, // need-aware for international applicants
    hasPreVetTrack: true,
    preVetNotes:
      "Home to Cummings School of Veterinary Medicine. Exceptional pre-vet track with early clinical exposure.",
    radarAcceptance: 18,
    radarInternational: 55,
    radarSAT: 93,
    radarCost: 10,
    radarAid: 50,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://provost.tufts.edu/institutionalresearch/wp-content/uploads/sites/5/CDS_2024-2025-1.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial", // CDS fields verified; financialAidPct retained from prior seed
  },
  {
    // SOURCE: CDS 2024-2025 from data.wisc.edu
    name: "University of Wisconsin-Madison",
    nameZh: "威斯康星大学麦迪逊分校",
    location: "Madison, WI",
    state: "WI",
    ranking: 35,
    website: "https://www.wisc.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.452,
    internationalAcceptRate: null,
    medianSAT: 1430,
    medianACT: 31,
    sat25th: 1350,
    sat75th: 1510,
    act25th: 29,
    act75th: 33,
    avgGPA: 3.9,
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Feb 1" }),
    internationalStudentPct: 0.105,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.5+",
    estimatedAnnualCost: 59711,
    financialAidPct: 0.60, // broad estimate, retained from prior seed
    needBasedAidPct: 0.353,
    needBlind: true, // public university, need-blind for domestic
    hasPreVetTrack: true,
    preVetNotes:
      "Top 10 vet school. Strong dairy and large-animal programs. Pre-vet advising through CALS.",
    radarAcceptance: 60,
    radarInternational: 50,
    radarSAT: 82,
    radarCost: 40,
    radarAid: 55,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl: "https://data.wisc.edu/common-data-set-and-rankings/",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial", // CDS fields verified; financialAidPct retained from prior seed
  },
  {
    // SOURCE: CDS 2024-2025 from irp.osu.edu (PDF extraction failed;
    // values from web search cross-referenced with BigFuture/EARI)
    name: "Ohio State University",
    nameZh: "俄亥俄州立大学",
    location: "Columbus, OH",
    state: "OH",
    ranking: 43,
    website: "https://www.osu.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.527,
    internationalAcceptRate: null,
    medianSAT: 1360,
    medianACT: 30,
    sat25th: 1280,
    sat75th: 1430,
    act25th: 28,
    act75th: 32,
    avgGPA: null, // not confirmed from CDS (PDF extraction failed)
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Feb 1" }),
    internationalStudentPct: 0.088, // ~5,901 intl of ~66,901 total (Fall 2024)
    internationalScholarships: JSON.stringify(
      "International merit scholarships available ($2k-$10k)"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 56000, // retained, not confirmed from CDS
    financialAidPct: 0.72, // retained, not confirmed from CDS
    needBasedAidPct: null, // could not extract from CDS
    needBlind: true, // public university
    hasPreVetTrack: true,
    preVetNotes:
      "Top 5 vet school. Pre-vet early assurance program. Large animal hospital on campus.",
    radarAcceptance: 65,
    radarInternational: 45,
    radarSAT: 75,
    radarCost: 45,
    radarAid: 75,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource:
      "CDS 2024-2025 (partial: PDF extraction failed, supplemented with web sources)",
    dataSourceUrl:
      "https://irp.osu.edu/sites/default/files/documents/2025/11/CDS-2024-2025-The-Ohio-State-University-Columbus.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: null,
    dataConfidence: "partial",
  },
  {
    // SOURCE: CDS 2024-2025 from abpa.tamu.edu
    // NOTE: Texas A&M does not report GPA in CDS
    name: "Texas A&M University",
    nameZh: "德州农工大学",
    location: "College Station, TX",
    state: "TX",
    ranking: 47,
    website: "https://www.tamu.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.573,
    internationalAcceptRate: null,
    medianSAT: 1275,
    medianACT: 28,
    sat25th: 1150,
    sat75th: 1400,
    act25th: 25,
    act75th: 31,
    avgGPA: null, // Texas A&M does not report GPA in CDS 2024-2025
    applicationDeadline: JSON.stringify({ EA: "Oct 15", RD: "Dec 1" }),
    internationalStudentPct: 0.012,
    internationalScholarships: JSON.stringify(
      "International merit scholarships available ($3k-$12k)"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.0+",
    estimatedAnnualCost: 53165,
    financialAidPct: 0.65, // broad estimate, retained from prior seed
    needBasedAidPct: 0.444,
    needBlind: true, // public university
    hasPreVetTrack: true,
    preVetNotes:
      "Top 5 vet school with the largest veterinary teaching hospital. Strong pre-vet pipeline with guaranteed interview program.",
    radarAcceptance: 72,
    radarInternational: 10,
    radarSAT: 60,
    radarCost: 50,
    radarAid: 55,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://abpa.tamu.edu/getattachment/439f54fe-1105-48af-955a-405775f80872/CDS-2024-2025_TexasA-M.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial", // CDS fields verified; financialAidPct retained from prior seed
  },
  {
    // SOURCE: CDS 2024-2025 from ir.aa.ufl.edu
    name: "University of Florida",
    nameZh: "佛罗里达大学",
    location: "Gainesville, FL",
    state: "FL",
    ranking: 27,
    website: "https://www.ufl.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.242,
    internationalAcceptRate: null,
    medianSAT: 1400,
    medianACT: 31,
    sat25th: 1320,
    sat75th: 1480,
    act25th: 29,
    act75th: 33,
    avgGPA: 3.92,
    applicationDeadline: JSON.stringify({ RD: "Nov 1" }),
    internationalStudentPct: 0.030,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.0+",
    estimatedAnnualCost: 41273,
    financialAidPct: 0.70, // broad estimate, retained from prior seed
    needBasedAidPct: 0.666,
    needBlind: true, // public university
    hasPreVetTrack: true,
    preVetNotes:
      "Top 10 vet school. Excellent pre-vet advising through CALS. Large animal hospital and wildlife clinic.",
    radarAcceptance: 35,
    radarInternational: 20,
    radarSAT: 85,
    radarCost: 60,
    radarAid: 75,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://data-apps.ir.aa.ufl.edu/public/cds/CDS_2024-2025_UFMAIN_Post_v1.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial", // CDS fields verified; financialAidPct retained from prior seed
  },
  {
    // SOURCE: CDS 2024-2025 from purdue.edu/idata
    name: "Purdue University",
    nameZh: "普渡大学",
    location: "West Lafayette, IN",
    state: "IN",
    ranking: 51,
    website: "https://www.purdue.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.499,
    internationalAcceptRate: null,
    medianSAT: 1340,
    medianACT: 30,
    sat25th: 1200,
    sat75th: 1480,
    act25th: 27,
    act75th: 34,
    avgGPA: 3.76,
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Jan 15" }),
    internationalStudentPct: 0.098,
    internationalScholarships: JSON.stringify(
      "Merit-based scholarships available for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.5+",
    estimatedAnnualCost: 45824,
    financialAidPct: 0.62, // broad estimate, retained from prior seed
    needBasedAidPct: 0.314,
    needBlind: true, // public university
    hasPreVetTrack: true,
    preVetNotes:
      "Top 10 vet school. Strong pre-vet program with early clinical exposure. High international student community.",
    radarAcceptance: 65,
    radarInternational: 50,
    radarSAT: 72,
    radarCost: 55,
    radarAid: 50,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://www.purdue.edu/idata/wp-content/uploads/2025/06/CDS_2024-2025.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial", // CDS fields verified; financialAidPct retained from prior seed
  },
  {
    // SOURCE: CDS 2024-2025 from ir.msu.edu
    name: "Michigan State University",
    nameZh: "密歇根州立大学",
    location: "East Lansing, MI",
    state: "MI",
    ranking: 77,
    website: "https://www.msu.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.848,
    internationalAcceptRate: null,
    medianSAT: 1210,
    medianACT: 27,
    sat25th: 1100,
    sat75th: 1320,
    act25th: 24,
    act75th: 30,
    avgGPA: 3.74,
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Feb 1" }),
    internationalStudentPct: 0.050,
    internationalScholarships: JSON.stringify(
      "International merit awards available ($5k-$20k)"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 57906,
    financialAidPct: 0.70, // broad estimate, retained from prior seed
    needBasedAidPct: 0.439,
    needBlind: true, // public university
    hasPreVetTrack: true,
    preVetNotes:
      "Top 10 vet school. Pre-vet early admission program. Extensive animal labs and farm facilities.",
    radarAcceptance: 88,
    radarInternational: 35,
    radarSAT: 48,
    radarCost: 40,
    radarAid: 55,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://xmc-michiganstab57e-msustrategi129d-prod9868.sitecorecloud.io/-/media/project/msu/ir/docs/cds/cds-2024-2025.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial", // CDS fields verified; financialAidPct retained from prior seed
  },
  {
    // SOURCE: CDS 2024-2025 from oir.uga.edu
    name: "University of Georgia",
    nameZh: "佐治亚大学",
    location: "Athens, GA",
    state: "GA",
    ranking: 47,
    website: "https://www.uga.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.379,
    internationalAcceptRate: null,
    medianSAT: 1320,
    medianACT: 29,
    sat25th: 1220,
    sat75th: 1420,
    act25th: 26,
    act75th: 32,
    avgGPA: 4.0, // CDS reports 4.15 (weighted); capped to 4.0 for engine compatibility
    applicationDeadline: JSON.stringify({ EA: "Oct 15", RD: "Jan 1" }),
    internationalStudentPct: 0.013,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.5+",
    estimatedAnnualCost: 43926,
    financialAidPct: 0.65, // broad estimate, retained from prior seed
    needBasedAidPct: 0.295,
    needBlind: true, // public university
    hasPreVetTrack: true,
    preVetNotes:
      "Top 15 vet school. Strong pre-vet pipeline with early assurance program. Wildlife and exotic animal facilities.",
    radarAcceptance: 52,
    radarInternational: 10,
    radarSAT: 72,
    radarCost: 58,
    radarAid: 48,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://oir.uga.edu/wp-content/uploads/UGA_CDS_2024-2025.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial", // CDS fields verified; financialAidPct retained from prior seed
  },
];
