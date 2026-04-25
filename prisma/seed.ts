import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import { schools } from "./schools-data";
import { G1_MAY_SEED } from "../docs/research/data/g1-may-seed";
import { G1_JUN_SEED } from "../docs/research/data/g1-jun-seed";

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
  // Merge per-month seed exports into one set of stage/goals/activities.
  // Both seeds reference the same STAGE_G1_G3 / GOAL_G1_G3_FOUNDATION rows
  // (deduped here by slug), so `validGoalSlugs` shrinks naturally and the
  // purge step below doesn't accidentally delete rows shared between months.
  const allSeeds = [G1_MAY_SEED, G1_JUN_SEED];
  const stage = allSeeds[0].stage; // both seeds share STAGE_G1_G3 (asserted in path-seed-shape.test.ts)
  const goalsBySlug = new Map<string, (typeof allSeeds)[number]["goals"][number]>();
  for (const s of allSeeds) {
    for (const g of s.goals) goalsBySlug.set(g.slug, g);
  }
  const goals = Array.from(goalsBySlug.values());
  const activities = allSeeds.flatMap((s) => s.activities);

  console.log(
    `Seeding Path Explorer v0.2 (G1 May+Jun, 1 stage + ${goals.length} goal(s) + ${activities.length} activities)...`,
  );

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
