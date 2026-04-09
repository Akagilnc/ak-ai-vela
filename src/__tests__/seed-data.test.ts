import { describe, it, expect } from "vitest";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { TEST_DB_URL } from "./helpers/test-db";

const adapter = new PrismaBetterSqlite3({ url: TEST_DB_URL });
const prisma = new PrismaClient({ adapter });

describe("seed data integrity", () => {
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

  it("all schools have radar chart data", async () => {
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      expect(school.radarAcceptance).not.toBeNull();
      expect(school.radarInternational).not.toBeNull();
      expect(school.radarSAT).not.toBeNull();
      expect(school.radarCost).not.toBeNull();
      expect(school.radarAid).not.toBeNull();
    }
  });

  it("radar values are within 0-100 range", async () => {
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      for (const field of [
        school.radarAcceptance,
        school.radarInternational,
        school.radarSAT,
        school.radarCost,
        school.radarAid,
      ]) {
        expect(field).toBeGreaterThanOrEqual(0);
        expect(field).toBeLessThanOrEqual(100);
      }
    }
  });

  it("target range fields are present for all schools", async () => {
    const schools = await prisma.school.findMany();
    for (const school of schools) {
      expect(school.sat25th).not.toBeNull();
      expect(school.sat75th).not.toBeNull();
      expect(school.act25th).not.toBeNull();
      expect(school.act75th).not.toBeNull();
      expect(school.avgGPA).not.toBeNull();
      // Sanity: 25th < 75th
      expect(school.sat25th!).toBeLessThan(school.sat75th!);
      expect(school.act25th!).toBeLessThan(school.act75th!);
    }
  });
});
