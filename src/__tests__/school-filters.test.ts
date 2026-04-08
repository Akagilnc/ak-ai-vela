import { describe, it, expect } from "vitest";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const url = `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

describe("school filtering and sorting", () => {
  it("filters by state", async () => {
    const schools = await prisma.school.findMany({
      where: { state: "PA" },
    });
    expect(schools.length).toBeGreaterThan(0);
    for (const school of schools) {
      expect(school.state).toBe("PA");
    }
  });

  it("filters by pre-vet only", async () => {
    const schools = await prisma.school.findMany({
      where: { hasPreVetTrack: true },
    });
    expect(schools.length).toBeGreaterThan(0);
    for (const school of schools) {
      expect(school.hasPreVetTrack).toBe(true);
    }
  });

  it("sorts by ranking ascending", async () => {
    const schools = await prisma.school.findMany({
      orderBy: { ranking: "asc" },
    });
    for (let i = 1; i < schools.length; i++) {
      if (schools[i].ranking != null && schools[i - 1].ranking != null) {
        expect(schools[i].ranking!).toBeGreaterThanOrEqual(
          schools[i - 1].ranking!
        );
      }
    }
  });

  it("sorts by acceptance rate ascending", async () => {
    const schools = await prisma.school.findMany({
      orderBy: { acceptanceRate: "asc" },
    });
    for (let i = 1; i < schools.length; i++) {
      if (
        schools[i].acceptanceRate != null &&
        schools[i - 1].acceptanceRate != null
      ) {
        expect(schools[i].acceptanceRate!).toBeGreaterThanOrEqual(
          schools[i - 1].acceptanceRate!
        );
      }
    }
  });

  it("sorts by cost ascending", async () => {
    const schools = await prisma.school.findMany({
      orderBy: { estimatedAnnualCost: "asc" },
    });
    for (let i = 1; i < schools.length; i++) {
      if (
        schools[i].estimatedAnnualCost != null &&
        schools[i - 1].estimatedAnnualCost != null
      ) {
        expect(schools[i].estimatedAnnualCost!).toBeGreaterThanOrEqual(
          schools[i - 1].estimatedAnnualCost!
        );
      }
    }
  });

  it("combines state and pre-vet filters", async () => {
    const allPreVet = await prisma.school.findMany({
      where: { hasPreVetTrack: true },
    });
    // Pick a state that has pre-vet schools
    const statesWithPreVet = [...new Set(allPreVet.map((s) => s.state))];
    expect(statesWithPreVet.length).toBeGreaterThan(0);

    const testState = statesWithPreVet[0];
    const filtered = await prisma.school.findMany({
      where: { state: testState, hasPreVetTrack: true },
    });
    expect(filtered.length).toBeGreaterThan(0);
    for (const school of filtered) {
      expect(school.state).toBe(testState);
      expect(school.hasPreVetTrack).toBe(true);
    }
  });
});
