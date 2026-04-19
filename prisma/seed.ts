import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import { schools } from "./schools-data";
import { G1_MAY_SEED } from "../docs/research/data/g1-may-seed";

const url =
  process.env.DATABASE_URL ||
  `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

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

async function seedPathExplorer() {
  console.log("Seeding Path Explorer v0.1 (G1 May, 1 stage + 1 goal + 5 activities)...");

  const { stage, goals, activities } = G1_MAY_SEED;

  // Pre-compute valid slug sets so we can purge anything NOT in the source of
  // truth inside the same transaction — prevents silent orphan rows after the
  // manifest gets an activity/goal renamed or removed.
  const validGoalSlugs = goals.map((g) => g.slug);
  const validActivitySlugs = activities.map((a) => a.slug);

  // Wrap the whole slice in an interactive transaction so a partial crash
  // doesn't leave the UI with a half-seeded manifest. Ordering inside the
  // transaction mirrors FK dependency (stage → goals → activities).
  await prisma.$transaction(async (tx) => {
    // Stage: upsert by slug
    const stageRow = await tx.pathStage.upsert({
      where: { slug: stage.slug },
      update: {
        title: stage.title,
        description: stage.description,
        gradeFrom: stage.gradeFrom,
        gradeTo: stage.gradeTo,
        orderIndex: stage.orderIndex,
      },
      create: stage,
    });

    // Purge stale activities / goals under this stage before upserting the
    // current set. Activities first (FK-leaf), then goals.
    await tx.pathActivity.deleteMany({
      where: {
        goal: { stageId: stageRow.id },
        slug: { notIn: validActivitySlugs },
      },
    });
    await tx.pathGoal.deleteMany({
      where: { stageId: stageRow.id, slug: { notIn: validGoalSlugs } },
    });

    // Goals: upsert by slug, resolve stageSlug → stageId, build slug→id map
    // so the activities loop doesn't need per-row findUnique queries.
    const goalIdBySlug = new Map<string, string>();
    for (const goal of goals) {
      const { stageSlug, ...rest } = goal;
      if (stageSlug !== stageRow.slug) {
        throw new Error(
          `PathGoal "${rest.slug}" references unknown stage "${stageSlug}"`,
        );
      }
      const row = await tx.pathGoal.upsert({
        where: { slug: rest.slug },
        update: { ...rest, stageId: stageRow.id },
        create: { ...rest, stageId: stageRow.id },
      });
      goalIdBySlug.set(row.slug, row.id);
    }

    // Activities: upsert by slug, resolve goalSlug → goalId from in-memory map.
    // Json fields (previews/chips/sections) cast to Prisma.InputJsonValue.
    for (const activity of activities) {
      const { goalSlug, previews, chips, sections, ...rest } = activity;
      const goalId = goalIdBySlug.get(goalSlug);
      if (!goalId) {
        throw new Error(
          `PathActivity "${rest.slug}" references unknown goal "${goalSlug}"`,
        );
      }
      const jsonFields = {
        previews: previews as unknown as Prisma.InputJsonValue,
        chips: chips as unknown as Prisma.InputJsonValue,
        sections: sections as unknown as Prisma.InputJsonValue,
      };
      await tx.pathActivity.upsert({
        where: { slug: rest.slug },
        update: { ...rest, ...jsonFields, goalId },
        create: { ...rest, ...jsonFields, goalId },
      });
    }
  });

  console.log(
    `Seeded Path Explorer: 1 stage, ${goals.length} goals, ${activities.length} activities`,
  );
}

async function resetAll() {
  console.log("RESETTING: clearing ALL data and re-seeding...");

  // Clear in FK dependency order: leaves first
  await prisma.questionnaireResult.deleteMany();
  await prisma.student.deleteMany();
  await prisma.school.deleteMany();
  await prisma.pathInterest.deleteMany();
  await prisma.pathDecisionBranch.deleteMany();
  await prisma.pathDecision.deleteMany();
  await prisma.pathActivity.deleteMany();
  await prisma.pathGoal.deleteMany();
  await prisma.pathStage.deleteMany();

  for (const school of schools) {
    await prisma.school.create({ data: school });
  }

  await seedPathExplorer();

  console.log(`Reset complete. Seeded ${schools.length} schools + Path Explorer`);
}

async function main() {
  const isReset = process.argv.includes("--reset");

  if (isReset) {
    await resetAll();
  } else {
    await seedSchools();
    await seedPathExplorer();
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
