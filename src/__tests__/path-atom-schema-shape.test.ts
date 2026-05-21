import { describe, it, expect } from "vitest";
import { Prisma } from "@prisma/client";

/**
 * Static-shape invariants for the Path Explorer atom/curated-view schema.
 *
 * This intentionally reads the generated Prisma DMMF, not the schema text.
 * Slice 1 should stay red until prisma generate/migrate is run later.
 */

type DmmfModel = (typeof Prisma.dmmf.datamodel.models)[number];

const models = new Map(Prisma.dmmf.datamodel.models.map((m) => [m.name, m]));

function expectModel(name: string, dbName: string): DmmfModel {
  const model = models.get(name);
  expect(model, `${name} model must be generated`).toBeTruthy();
  expect(model?.dbName).toBe(dbName);
  return model as DmmfModel;
}

function expectFields(
  model: DmmfModel,
  expected: Array<{ name: string; kind: string; type: string }>,
) {
  const fields = new Map(model.fields.map((f) => [f.name, f]));
  for (const e of expected) {
    const field = fields.get(e.name);
    expect(field, `${model.name}.${e.name}`).toBeTruthy();
    expect(field?.kind, `${model.name}.${e.name}.kind`).toBe(e.kind);
    expect(field?.type, `${model.name}.${e.name}.type`).toBe(e.type);
  }
}

describe("Path atom schema shape", () => {
  it("adds atom, curated view, and join models to the generated Prisma DMMF", () => {
    const atom = expectModel("PathAtom", "path_atoms");
    expectFields(atom, [
      { name: "id", kind: "scalar", type: "Int" },
      { name: "slug", kind: "scalar", type: "String" },
      { name: "title", kind: "scalar", type: "String" },
      { name: "body", kind: "scalar", type: "String" },
      { name: "stageId", kind: "scalar", type: "String" },
      { name: "stage", kind: "object", type: "PathStage" },
      { name: "gradeFrom", kind: "scalar", type: "Int" },
      { name: "gradeTo", kind: "scalar", type: "Int" },
      { name: "interests", kind: "scalar", type: "Json" },
      { name: "scheduleKind", kind: "scalar", type: "String" },
      { name: "windowType", kind: "scalar", type: "String" },
      { name: "cadenceRole", kind: "scalar", type: "String" },
      { name: "frictionLevel", kind: "scalar", type: "Int" },
      { name: "setting", kind: "scalar", type: "String" },
      { name: "displayOrder", kind: "scalar", type: "Int" },
      { name: "createdAt", kind: "scalar", type: "DateTime" },
      { name: "updatedAt", kind: "scalar", type: "DateTime" },
      { name: "curatedViews", kind: "object", type: "PathCuratedViewAtom" },
    ]);

    const curatedView = expectModel("PathCuratedView", "path_curated_views");
    expectFields(curatedView, [
      { name: "id", kind: "scalar", type: "Int" },
      { name: "slug", kind: "scalar", type: "String" },
      { name: "title", kind: "scalar", type: "String" },
      { name: "stageId", kind: "scalar", type: "String" },
      { name: "stage", kind: "object", type: "PathStage" },
      { name: "month", kind: "scalar", type: "Int" },
      { name: "leadLine", kind: "scalar", type: "String" },
      { name: "whySpecial", kind: "scalar", type: "String" },
      { name: "heart", kind: "scalar", type: "String" },
      { name: "output", kind: "scalar", type: "String" },
      { name: "serendipity", kind: "scalar", type: "String" },
      { name: "proseBlocks", kind: "scalar", type: "Json" },
      { name: "defaultTightRatio", kind: "scalar", type: "Int" },
      { name: "frictionCeilingDefault", kind: "scalar", type: "Int" },
      { name: "displayOrder", kind: "scalar", type: "Int" },
      { name: "createdAt", kind: "scalar", type: "DateTime" },
      { name: "updatedAt", kind: "scalar", type: "DateTime" },
      { name: "atoms", kind: "object", type: "PathCuratedViewAtom" },
    ]);

    const join = expectModel("PathCuratedViewAtom", "path_curated_view_atoms");
    expectFields(join, [
      { name: "id", kind: "scalar", type: "Int" },
      { name: "curatedViewId", kind: "scalar", type: "Int" },
      { name: "curatedView", kind: "object", type: "PathCuratedView" },
      { name: "atomId", kind: "scalar", type: "Int" },
      { name: "atom", kind: "object", type: "PathAtom" },
    ]);

    const stage = expectModel("PathStage", "path_stages");
    expectFields(stage, [
      { name: "atoms", kind: "object", type: "PathAtom" },
      { name: "curatedViews", kind: "object", type: "PathCuratedView" },
    ]);
  });
});
