// Shared school seed data used by both prisma/seed.ts and the test
// globalSetup that provisions an isolated SQLite database for vitest.
// Keeping this as a pure data module (no prisma import) lets tests import
// it without triggering the PrismaClient singleton in seed.ts.
//
// Data provenance fields (dataSource, dataConfidence, etc.) track where
// each school's admissions numbers came from and how much we trust them.
// See prisma/schema.prisma for field definitions.
//
// PR #18 (v0.3.3.0): Re-verified all 12 schools against CDS 2024-2025.
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
  // ═══════════════════════════════════════════════════════════════════
  // v0.3.4.0 EXPANSION: 14 Tier A AAVMC schools added below (PR #19)
  // All CDS 2024-2025 unless noted. GPA > 4.0 capped to 4.0 (weighted).
  // ═══════════════════════════════════════════════════════════════════
  {
    // SOURCE: CDS 2024-2025 from auburn.edu (HTML sections, no PDF)
    name: "Auburn University",
    nameZh: "奥本大学",
    location: "Auburn, AL",
    state: "AL",
    ranking: 93,
    website: "https://www.auburn.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.459,
    internationalAcceptRate: null,
    medianSAT: 1320,
    medianACT: 28,
    sat25th: 1260,
    sat75th: 1380,
    act25th: 26,
    act75th: 31,
    avgGPA: 4.0, // CDS reports 4.09 (weighted); capped to 4.0
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Feb 1" }),
    internationalStudentPct: 0.016,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 58914,
    financialAidPct: 0.36, // broad estimate from CDS H2
    needBasedAidPct: 0.355,
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to the Auburn CVM, one of the oldest vet schools in the US. Strong large-animal and equine programs. Pre-vet early acceptance pathway available.",
    radarAcceptance: 60,
    radarInternational: 10,
    radarSAT: 72,
    radarCost: 38,
    radarAid: 50,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025 (HTML)",
    dataSourceUrl:
      "https://auburn.edu/administration/ir/common-data-set/2024/",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial",
  },
  {
    // SOURCE: CDS 2024-2025 from ir.iastate.edu
    name: "Iowa State University",
    nameZh: "爱荷华州立大学",
    location: "Ames, IA",
    state: "IA",
    ranking: 98,
    website: "https://www.iastate.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.886,
    internationalAcceptRate: null,
    medianSAT: 1240,
    medianACT: 25,
    sat25th: 1130,
    sat75th: 1350,
    act25th: 21,
    act75th: 28,
    avgGPA: 3.75,
    applicationDeadline: JSON.stringify({ RD: "May 1" }),
    internationalStudentPct: 0.037,
    internationalScholarships: JSON.stringify(
      "Merit scholarships available for international students ($2k-$10k)"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 39689,
    financialAidPct: 0.55, // broad estimate
    needBasedAidPct: 0.544,
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Top 15 vet school. Strong pre-vet advising with dedicated program coordinator. Extensive dairy and livestock facilities.",
    radarAcceptance: 90,
    radarInternational: 25,
    radarSAT: 52,
    radarCost: 70,
    radarAid: 65,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://www.ir.iastate.edu/files/documents/cds/CDS-24-25.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial",
  },
  {
    // SOURCE: CDS 2024-2025 from dmi.illinois.edu (XLSX)
    // NOTE: UIUC does not report GPA in CDS
    name: "University of Illinois Urbana-Champaign",
    nameZh: "伊利诺伊大学厄巴纳-香槟分校",
    location: "Champaign, IL",
    state: "IL",
    ranking: 35,
    website: "https://illinois.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.424,
    internationalAcceptRate: null,
    medianSAT: 1455,
    medianACT: 32,
    sat25th: 1390,
    sat75th: 1520,
    act25th: 30,
    act75th: 34,
    avgGPA: null, // UIUC does not report GPA in CDS 2024-2025
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Jan 5" }),
    internationalStudentPct: 0.149,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.5+",
    estimatedAnnualCost: 54578,
    financialAidPct: 0.45, // broad estimate
    needBasedAidPct: 0.450,
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to the UIUC CVM. Strong pre-vet program through the College of ACES. Research-intensive with wildlife and exotic animal focus.",
    radarAcceptance: 55,
    radarInternational: 75,
    radarSAT: 92,
    radarCost: 45,
    radarAid: 55,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025 (XLSX)",
    dataSourceUrl:
      "https://www.dmi.illinois.edu/stuenr/misc/cds_2024_2025.xlsx",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial",
  },
  {
    // SOURCE: CDS 2024-2025 from k-state.edu
    name: "Kansas State University",
    nameZh: "堪萨斯州立大学",
    location: "Manhattan, KS",
    state: "KS",
    ranking: 170,
    website: "https://www.k-state.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.820,
    internationalAcceptRate: null,
    medianSAT: 1158,
    medianACT: 24,
    sat25th: 1060,
    sat75th: 1255,
    act25th: 20,
    act75th: 27,
    avgGPA: 3.81,
    applicationDeadline: JSON.stringify({ RD: "rolling" }),
    internationalStudentPct: 0.017,
    internationalScholarships: JSON.stringify(
      "International merit awards available ($3k-$10k)"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 39838,
    financialAidPct: 0.48, // broad estimate
    needBasedAidPct: 0.481,
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Top 10 vet school. Pre-vet early admission program with the K-State CVM. Exceptional large-animal and food-animal medicine programs.",
    radarAcceptance: 85,
    radarInternational: 10,
    radarSAT: 42,
    radarCost: 70,
    radarAid: 60,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://www.k-state.edu/data/institutional-research/resources/common-data-set/CDS_2024_2025.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial",
  },
  {
    // SOURCE: CDS 2024-2025 from lsu.edu (section PDFs)
    name: "Louisiana State University",
    nameZh: "路易斯安那州立大学",
    location: "Baton Rouge, LA",
    state: "LA",
    ranking: 60,
    website: "https://www.lsu.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.733,
    internationalAcceptRate: null,
    medianSAT: 1250,
    medianACT: 27,
    sat25th: 1180,
    sat75th: 1320,
    act25th: 24,
    act75th: 30,
    avgGPA: 3.83,
    applicationDeadline: JSON.stringify({ EA: "Nov 15", RD: "Apr 15" }),
    internationalStudentPct: 0.015,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 43773,
    financialAidPct: 0.55, // broad estimate
    needBasedAidPct: null, // CDS H2 data extraction ambiguous
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to the LSU SVM. Strong pre-vet track with early clinical exposure. Unique programs in aquatic animal health and wildlife medicine.",
    radarAcceptance: 78,
    radarInternational: 10,
    radarSAT: 55,
    radarCost: 60,
    radarAid: 65,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025 (section PDFs)",
    dataSourceUrl: "https://www.lsu.edu/data/common-data-set/index.php",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial",
  },
  {
    // SOURCE: CDS 2024-2025 from idr.umn.edu
    // NOTE: GPA and cost not extracted from PDF (parsing failure)
    name: "University of Minnesota Twin Cities",
    nameZh: "明尼苏达大学双城分校",
    location: "St. Paul, MN",
    state: "MN",
    ranking: 53,
    website: "https://twin-cities.umn.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.797,
    internationalAcceptRate: null,
    medianSAT: 1395,
    medianACT: 29,
    sat25th: 1320,
    sat75th: 1470,
    act25th: 26,
    act75th: 31,
    avgGPA: null, // CDS PDF extraction failed for GPA field
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Jan 15" }),
    internationalStudentPct: 0.048,
    internationalScholarships: JSON.stringify(
      "Global Excellence Scholarship and merit awards for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 66000, // from admissions website, CDS extraction failed
    financialAidPct: 0.50, // broad estimate
    needBasedAidPct: 0.497,
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to the UMN CVM. Strong pre-vet advising through the College of Food, Agriculture and Natural Resource Sciences. Research programs in comparative medicine.",
    radarAcceptance: 82,
    radarInternational: 30,
    radarSAT: 82,
    radarCost: 35,
    radarAid: 60,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource:
      "CDS 2024-2025 (partial: GPA and cost from web, PDF extraction incomplete)",
    dataSourceUrl:
      "https://idr.umn.edu/sites/idr.umn.edu/files/cds_2024_2025_tc_1.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: null,
    dataConfidence: "partial",
  },
  {
    // SOURCE: web sources (CDS 2024-25 PDF not accessible)
    name: "Mississippi State University",
    nameZh: "密西西比州立大学",
    location: "Mississippi State, MS",
    state: "MS",
    ranking: 199,
    website: "https://www.msstate.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.776,
    internationalAcceptRate: null,
    medianSAT: 1225,
    medianACT: 25,
    sat25th: 1100,
    sat75th: 1350,
    act25th: 21,
    act75th: 29,
    avgGPA: 3.6, // web estimate
    applicationDeadline: JSON.stringify({ RD: "rolling" }),
    internationalStudentPct: 0.013,
    internationalScholarships: JSON.stringify(
      "International merit awards available ($3k-$12k)"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.0+",
    estimatedAnnualCost: 50117,
    financialAidPct: 0.66, // broad estimate from web
    needBasedAidPct: null, // not confirmed
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to the MSU CVM. Strong pre-vet program with hands-on animal experience. Equine, food-animal, and wildlife medicine programs.",
    radarAcceptance: 82,
    radarInternational: 8,
    radarSAT: 50,
    radarCost: 50,
    radarAid: 72,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource:
      "web sources (CDS 2024-2025 PDF not accessible, used CDS-derived aggregators)",
    dataSourceUrl: "https://www.ir.msstate.edu/cdsets.php",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: null,
    dataConfidence: "estimated",
  },
  {
    // SOURCE: web sources (CDS behind SharePoint auth)
    name: "University of Missouri",
    nameZh: "密苏里大学",
    location: "Columbia, MO",
    state: "MO",
    ranking: 105,
    website: "https://missouri.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.785,
    internationalAcceptRate: null,
    medianSAT: 1240,
    medianACT: 27,
    sat25th: 1150,
    sat75th: 1330,
    act25th: 23,
    act75th: 30,
    avgGPA: 3.6, // web estimate
    applicationDeadline: JSON.stringify({ RD: "rolling" }),
    internationalStudentPct: 0.010,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 54264,
    financialAidPct: 0.44, // broad estimate from web
    needBasedAidPct: null, // not confirmed
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to the Mizzou CVM. One of the oldest vet schools in the US. Strong comparative medicine and veterinary pathobiology programs.",
    radarAcceptance: 82,
    radarInternational: 8,
    radarSAT: 52, // consistent with Iowa State (same median SAT 1240)
    radarCost: 45,
    radarAid: 55,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource:
      "web sources (CDS 2024-2025 behind SharePoint auth, used CDS-derived aggregators)",
    dataSourceUrl: "https://ir.missouri.edu/common-data-set",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: null,
    dataConfidence: "estimated",
  },
  {
    // SOURCE: CDS 2024-2025 from report.isa.ncsu.edu
    name: "North Carolina State University",
    nameZh: "北卡罗来纳州立大学",
    location: "Raleigh, NC",
    state: "NC",
    ranking: 60,
    website: "https://www.ncsu.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.413,
    internationalAcceptRate: null,
    medianSAT: 1365,
    medianACT: 29,
    sat25th: 1290,
    sat75th: 1440,
    act25th: 25,
    act75th: 32,
    avgGPA: 3.83,
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Jan 15" }),
    internationalStudentPct: 0.022,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 85+ / IELTS 6.5+",
    estimatedAnnualCost: 46140,
    financialAidPct: 0.46, // broad estimate
    needBasedAidPct: 0.464,
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to the NC State CVM. Top 5 vet school. Strong pre-vet program with guaranteed interview for qualified in-state students. Extensive research in infectious disease and comparative medicine.",
    radarAcceptance: 55,
    radarInternational: 15,
    radarSAT: 78,
    radarCost: 55,
    radarAid: 58,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://report.isa.ncsu.edu/ir/cds/pdfs/CDS_2024-25.v3.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial",
  },
  {
    // SOURCE: web sources (CDS PDF returned 403)
    name: "Oklahoma State University",
    nameZh: "俄克拉荷马州立大学",
    location: "Stillwater, OK",
    state: "OK",
    ranking: 187,
    website: "https://go.okstate.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.750,
    internationalAcceptRate: null,
    medianSAT: 1145,
    medianACT: 24,
    sat25th: 1040,
    sat75th: 1250,
    act25th: 20,
    act75th: 27,
    avgGPA: 3.6, // web estimate
    applicationDeadline: JSON.stringify({ RD: "rolling" }),
    internationalStudentPct: 0.059,
    internationalScholarships: JSON.stringify(
      "International merit awards available ($3k-$10k)"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 45100,
    financialAidPct: 0.58, // broad estimate from web
    needBasedAidPct: null, // not confirmed
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to the OSU CVHS. Strong pre-vet program with dedicated advising. Teaching hospital with diverse caseload. Food-animal and equine medicine programs.",
    radarAcceptance: 80,
    radarInternational: 35,
    radarSAT: 42,
    radarCost: 58,
    radarAid: 68,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource:
      "web sources (CDS 2024-2025 PDF returned 403, used CDS-derived aggregators)",
    dataSourceUrl: "https://ira.okstate.edu/common-data-set.html",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: null,
    dataConfidence: "estimated",
  },
  {
    // SOURCE: CDS 2024-2025 from oregonstate.edu
    name: "Oregon State University",
    nameZh: "俄勒冈州立大学",
    location: "Corvallis, OR",
    state: "OR",
    ranking: 162,
    website: "https://oregonstate.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.773,
    internationalAcceptRate: null,
    medianSAT: 1275,
    medianACT: 28,
    sat25th: 1160,
    sat75th: 1390,
    act25th: 24,
    act75th: 31,
    avgGPA: 3.70,
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Feb 1" }),
    internationalStudentPct: 0.031,
    internationalScholarships: JSON.stringify(
      "International merit awards and Cultural Diversity Scholarships available"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.5+",
    estimatedAnnualCost: 58605,
    financialAidPct: 0.49, // broad estimate
    needBasedAidPct: 0.489,
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to the Carlson CVM (established 2015). Pre-vet advising through the Carlson College. Growing program with marine and wildlife veterinary medicine focus.",
    radarAcceptance: 82,
    radarInternational: 20,
    radarSAT: 58,
    radarCost: 38,
    radarAid: 60,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://institutionalresearch.oregonstate.edu/sites/institutionalresearch.oregonstate.edu/files/2025-07/cds_2024-25.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial",
  },
  {
    // SOURCE: CDS 2024-2025 from irsa.utk.edu
    // NOTE: Tennessee REQUIRES SAT/ACT (not optional)
    name: "University of Tennessee Knoxville",
    nameZh: "田纳西大学诺克斯维尔分校",
    location: "Knoxville, TN",
    state: "TN",
    ranking: 53,
    website: "https://www.utk.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "required",
    acceptanceRate: 0.416,
    internationalAcceptRate: null,
    medianSAT: 1285,
    medianACT: 28,
    sat25th: 1210,
    sat75th: 1360,
    act25th: 25,
    act75th: 31,
    avgGPA: 4.0, // CDS reports 4.17 (weighted); capped to 4.0
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Dec 15" }),
    internationalStudentPct: 0.009,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.5+",
    estimatedAnnualCost: 46550,
    financialAidPct: 0.43, // broad estimate
    needBasedAidPct: 0.425,
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to the UT CVM. Strong pre-vet advising with dedicated track in the Herbert College of Agriculture. Large-animal and comparative biomedical programs.",
    radarAcceptance: 55,
    radarInternational: 5,
    radarSAT: 68,
    radarCost: 55,
    radarAid: 55,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://irsa.utk.edu/wp-content/uploads/sites/107/2026/01/CDS_2024-2025_All.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial",
  },
  {
    // SOURCE: CDS 2024-2025 from aie.vt.edu (XLSX)
    // Virginia-Maryland Regional CVM is jointly operated by VT and UMD
    name: "Virginia Tech",
    nameZh: "弗吉尼亚理工大学",
    location: "Blacksburg, VA",
    state: "VA",
    ranking: 47,
    website: "https://www.vt.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "optional",
    acceptanceRate: 0.550,
    internationalAcceptRate: null,
    medianSAT: 1365,
    medianACT: 30,
    sat25th: 1280,
    sat75th: 1450,
    act25th: 28,
    act75th: 32,
    avgGPA: 4.0, // CDS reports 4.09 (weighted); capped to 4.0
    applicationDeadline: JSON.stringify({ EA: "Nov 1", RD: "Jan 15" }),
    internationalStudentPct: 0.047,
    internationalScholarships: JSON.stringify(
      "Limited merit scholarships for international students"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 80+ / IELTS 6.5+",
    estimatedAnnualCost: 54356,
    financialAidPct: 0.43, // broad estimate
    needBasedAidPct: 0.434,
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Co-host of the Virginia-Maryland CVM (with University of Maryland). Strong pre-vet track through the College of Agriculture and Life Sciences. Diverse clinical rotations across two states.",
    radarAcceptance: 65,
    radarInternational: 30,
    radarSAT: 78,
    radarCost: 45,
    radarAid: 55,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025 (XLSX)",
    dataSourceUrl:
      "https://aie.vt.edu/content/dam/aie_vt_edu/common-data-set/24-25/2024-2025-CDS.xlsx",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial",
  },
  {
    // SOURCE: CDS 2024-2025 from wsu.edu
    // NOTE: WSU is test-FREE (does not consider SAT/ACT at all)
    name: "Washington State University",
    nameZh: "华盛顿州立大学",
    location: "Pullman, WA",
    state: "WA",
    ranking: 187,
    website: "https://wsu.edu",
    programs: JSON.stringify(["pre-vet", "animal-science", "biology"]),
    testPolicy: "free",
    acceptanceRate: 0.866,
    internationalAcceptRate: null,
    medianSAT: null, // test-free admissions
    medianACT: null,
    sat25th: null,
    sat75th: null,
    act25th: null,
    act75th: null,
    avgGPA: 3.44,
    applicationDeadline: JSON.stringify({ RD: "Jan 31" }),
    internationalStudentPct: 0.024,
    internationalScholarships: JSON.stringify(
      "International Academic Award and merit scholarships available"
    ),
    visaOPTSupport: true,
    englishRequirements: "TOEFL 79+ / IELTS 6.5+",
    estimatedAnnualCost: 45422,
    financialAidPct: 0.55, // broad estimate
    needBasedAidPct: 0.551,
    needBlind: true,
    hasPreVetTrack: true,
    preVetNotes:
      "Home to the WSU CVM, one of the top vet schools in the western US. Strong pre-vet program with early clinical exposure. Veterinary teaching hospital with diverse caseload including wildlife.",
    radarAcceptance: 90,
    radarInternational: 15,
    radarSAT: null, // test-free: no radar for SAT
    radarCost: 58,
    radarAid: 65,
    aavmcAccredited: true,
    hasVetSchool: true,
    dataSource: "CDS 2024-2025",
    dataSourceUrl:
      "https://wpcdn.web.wsu.edu/wsuwp/uploads/sites/3447/2025/04/CDS_2024-2025.pdf",
    dataSourceRetrievedAt: new Date("2026-04-12"),
    lastVerifiedAt: new Date("2026-04-12"),
    dataConfidence: "partial",
  },
];
