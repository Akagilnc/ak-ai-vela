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

  // Stage: upsert by slug
  const stageRow = await prisma.pathStage.upsert({
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

  // Goals: upsert by slug, resolve stageSlug → stageId
  for (const goal of goals) {
    const { stageSlug, ...rest } = goal;
    if (stageSlug !== stageRow.slug) {
      throw new Error(`PathGoal "${rest.slug}" references unknown stage "${stageSlug}"`);
    }
    await prisma.pathGoal.upsert({
      where: { slug: rest.slug },
      update: { ...rest, stageId: stageRow.id },
      create: { ...rest, stageId: stageRow.id },
    });
  }

  // Activities: upsert by slug, resolve goalSlug → goalId
  // Json fields (previews/chips/sections) must be cast to Prisma.InputJsonValue
  for (const activity of activities) {
    const { goalSlug, previews, chips, sections, ...rest } = activity;
    const goal = await prisma.pathGoal.findUnique({ where: { slug: goalSlug } });
    if (!goal) {
      throw new Error(`PathActivity "${rest.slug}" references unknown goal "${goalSlug}"`);
    }
    const jsonFields = {
      previews: previews as Prisma.InputJsonValue,
      chips: chips as Prisma.InputJsonValue,
      sections: sections as Prisma.InputJsonValue,
    };
    await prisma.pathActivity.upsert({
      where: { slug: rest.slug },
      update: { ...rest, ...jsonFields, goalId: goal.id },
      create: { ...rest, ...jsonFields, goalId: goal.id },
    });
  }

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
