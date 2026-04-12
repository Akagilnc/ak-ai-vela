import { describe, it, expect, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { TEST_DB_URL } from "./helpers/test-db";

const adapter = new PrismaBetterSqlite3({ url: TEST_DB_URL });
const prisma = new PrismaClient({ adapter });

describe("seed data integrity", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("has at least 10 schools", async () => {
    const count = await prisma.school.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  it("all schools have required fields", async () => {
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      expect(school.name).toBeTruthy();
      expect(school.location).toBeTruthy();
      expect(school.state).toBeTruthy();
      expect(school.programs).toBeTruthy();
    }
  });

  it("all schools have valid JSON in programs field", async () => {
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      const programs = JSON.parse(school.programs);
      expect(Array.isArray(programs)).toBe(true);
      expect(programs.length).toBeGreaterThan(0);
    }
  });

  it("all pre-vet schools have pre-vet notes", async () => {
    const schools = await prisma.school.findMany({
      where: { hasPreVetTrack: true },
    });
    expect(schools.length).toBeGreaterThan(0);
    for (const school of schools) {
      expect(school.preVetNotes).toBeTruthy();
    }
  });

  it("schools with radar chart SAT data have all radar fields", async () => {
    // Some schools are test-free (radarSAT = null). For those, skip
    // the SAT radar check but still verify the other 4 dimensions.
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      expect(school.radarAcceptance).not.toBeNull();
      expect(school.radarInternational).not.toBeNull();
      expect(school.radarCost).not.toBeNull();
      expect(school.radarAid).not.toBeNull();
      // radarSAT may be null for test-free schools
      if (school.radarSAT !== null) {
        expect(school.radarSAT).toBeGreaterThanOrEqual(0);
        expect(school.radarSAT).toBeLessThanOrEqual(100);
      }
    }
  });

  it("radar values are within 0-100 range", async () => {
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      for (const field of [
        school.radarAcceptance,
        school.radarInternational,
        school.radarCost,
        school.radarAid,
      ]) {
        expect(field).toBeGreaterThanOrEqual(0);
        expect(field).toBeLessThanOrEqual(100);
      }
    }
  });

  it("schools that report test scores have valid SAT/ACT ranges", async () => {
    // Test-free schools (UC Davis, CSU) have null SAT/ACT. Only validate
    // schools that actually report scores.
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      if (school.sat25th !== null && school.sat75th !== null) {
        expect(school.sat25th).toBeLessThan(school.sat75th!);
      }
      if (school.act25th !== null && school.act75th !== null) {
        expect(school.act25th).toBeLessThan(school.act75th!);
      }
    }
  });

  it("all schools have a valid testPolicy", async () => {
    const allowed = ["required", "optional", "free", "blind"];
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      expect(school.testPolicy).not.toBeNull();
      expect(allowed).toContain(school.testPolicy);
    }
  });

  it("test-free schools have null scores and free policy", async () => {
    const testFreeSchools = await prisma.school.findMany({
      where: { testPolicy: "free" },
    });
    expect(testFreeSchools.length).toBeGreaterThan(0);
    for (const school of testFreeSchools) {
      expect(school.sat25th).toBeNull();
      expect(school.sat75th).toBeNull();
      expect(school.act25th).toBeNull();
      expect(school.act75th).toBeNull();
      expect(school.medianSAT).toBeNull();
      expect(school.medianACT).toBeNull();
    }
  });

  it("all schools have AAVMC classification fields", async () => {
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      expect(typeof school.aavmcAccredited).toBe("boolean");
      expect(typeof school.hasVetSchool).toBe("boolean");
    }
  });

  it("all current schools are AAVMC-accredited vet school hosts", async () => {
    // All 12 initial schools have their own vet school. This test will
    // need updating when pre-vet feeder schools (no vet school) are added.
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      expect(school.aavmcAccredited).toBe(true);
      expect(school.hasVetSchool).toBe(true);
    }
  });

  it("all schools have a dataConfidence value from the allowed set", async () => {
    const allowed = ["verified", "partial", "estimated", "unknown"];
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      if (school.dataConfidence !== null) {
        expect(allowed).toContain(school.dataConfidence);
      }
    }
  });

  it("all schools have a dataSource string", async () => {
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      expect(school.dataSource).toBeTruthy();
    }
  });

  it("CDS-sourced schools have retrieval dates", async () => {
    // Schools sourced from CDS should have retrieval dates even if
    // dataConfidence is "partial" (some fields like financialAidPct
    // are retained estimates pending re-verification).
    const cdsSourced = await prisma.school.findMany({
      where: { dataSource: { startsWith: "CDS" } },
    });
    expect(cdsSourced.length).toBeGreaterThan(0);
    for (const school of cdsSourced) {
      expect(school.dataSourceRetrievedAt).not.toBeNull();
    }
  });
});
