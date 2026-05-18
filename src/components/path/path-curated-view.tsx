import Link from "next/link";
import type { PathAtom, PathCuratedView } from "@prisma/client";
import { selectSlot, type SlotAtom } from "@/lib/path/curated-slot";
import { BackIcon } from "./path-icons";

type CuratedAtom = Pick<
  PathAtom,
  | "slug"
  | "title"
  | "body"
  | "interests"
  | "frictionLevel"
  | "cadenceRole"
  | "displayOrder"
>;

export type CuratedViewForPage = Pick<
  PathCuratedView,
  | "slug"
  | "title"
  | "month"
  | "leadLine"
  | "whySpecial"
  | "heart"
  | "output"
  | "serendipity"
  | "defaultTightRatio"
  | "frictionCeilingDefault"
> & {
  atoms: Array<{ atom: CuratedAtom }>;
};

type Props = {
  view: CuratedViewForPage;
};

const PROSE_BLOCKS = [
  { key: "leadLine", label: "一句话" },
  { key: "whySpecial", label: "为什么特别" },
  { key: "heart", label: "心法" },
  { key: "output", label: "产出" },
  { key: "serendipity", label: "serendipity" },
] as const;

type ProseKey = (typeof PROSE_BLOCKS)[number]["key"];

const PROSE_LABEL_OVERRIDES_BY_SLUG: Record<
  string,
  Partial<Record<ProseKey, string>>
> = {
  // These two seed rows store source-authored time labels in whySpecial.
  "g1-may-baseline": { whySpecial: "时间占用" },
  "g1-may-labor-holiday": { whySpecial: "时间预算" },
};

const EXPLORE_INTRO =
  "下面这些不一定贴她现在的兴趣，但很可能玩得来，有空不妨试试。";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripPromotedInlineLabel(value: string, label: string) {
  const labelPattern = escapeRegExp(label);
  const inlineLabelPattern = new RegExp(
    `^(?:\\*\\*)?${labelPattern}(?:\\*\\*)?\\s*[：:]\\s*`,
  );

  return value.replace(inlineLabelPattern, "").trimStart();
}

function normalizeInterests(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toSlotAtom(atom: CuratedAtom): SlotAtom {
  return {
    slug: atom.slug,
    interests: normalizeInterests(atom.interests),
    frictionLevel: atom.frictionLevel,
    cadenceRole: atom.cadenceRole,
    displayOrder: atom.displayOrder,
  };
}

function proseBlocksForView(view: CuratedViewForPage) {
  const labelOverrides = PROSE_LABEL_OVERRIDES_BY_SLUG[view.slug] ?? {};

  return PROSE_BLOCKS.flatMap((block) => {
    const value = view[block.key];
    if (!value?.trim()) return [];
    const labelOverride = labelOverrides[block.key];
    const renderedValue = labelOverride
      ? stripPromotedInlineLabel(value, labelOverride)
      : value;
    if (!renderedValue.trim()) return [];

    return [
      {
        ...block,
        label: labelOverride ?? block.label,
        value: renderedValue,
      },
    ];
  });
}

function AtomList({ atoms }: { atoms: CuratedAtom[] }) {
  return (
    <ul
      style={{
        display: "grid",
        gap: 12,
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {atoms.map((atom) => (
        <li
          key={atom.slug}
          style={{
            border: "1px solid var(--line)",
            borderRadius: 12,
            background: "rgba(255,255,255,0.46)",
            padding: 14,
          }}
        >
          <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>{atom.title}</h3>
          <p
            style={{
              color: "var(--ink)",
              fontSize: 14,
              lineHeight: 1.65,
              margin: 0,
              whiteSpace: "pre-wrap",
            }}
          >
            {atom.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function PathCuratedViewPage({ view }: Props) {
  const atoms = [...view.atoms].sort((a, b) => {
    const order = a.atom.displayOrder - b.atom.displayOrder;
    if (order !== 0) return order;
    return a.atom.slug.localeCompare(b.atom.slug);
  });
  const atomBySlug = new Map(atoms.map(({ atom }) => [atom.slug, atom]));
  const slot = selectSlot(
    atoms.map(({ atom }) => toSlotAtom(atom)),
    {
      tightRatio: view.defaultTightRatio,
      frictionCeiling: view.frictionCeilingDefault,
    },
  );
  const tightAtoms = slot.tight
    .map((atom) => atomBySlug.get(atom.slug))
    .filter((atom): atom is CuratedAtom => Boolean(atom));
  const exploreAtoms = slot.explore
    .map((atom) => atomBySlug.get(atom.slug))
    .filter((atom): atom is CuratedAtom => Boolean(atom));
  const renderedProseBlocks = proseBlocksForView(view);
  const atomSectionStart = renderedProseBlocks.length + 1;

  return (
    <>
      <header className="app-chrome detail-mode">
        <Link href="/path" className="back-btn">
          <BackIcon />
          <span>Path</span>
        </Link>
        <div className="center-title">Curated View</div>
      </header>

      <main
        className="detail-body"
        id="detail-body"
        aria-labelledby="curated-title"
      >
        <section
          className="card-intro"
          data-kind="event"
          aria-labelledby="curated-title"
        >
          <div className="kicker">
            <span className="pip"></span>
            <span>{view.month ? `${view.month} 月策展段` : "策展段"}</span>
          </div>
          <h1 id="curated-title">{view.title}</h1>
        </section>

        {renderedProseBlocks.map((block, index) => (
          <section
            key={block.key}
            className="d-sec"
            id={`curated-${block.key}`}
            data-target={block.label}
            aria-labelledby={`curated-${block.key}-heading`}
          >
            <div className="d-sec-head">
              <span className="num">{String(index + 1).padStart(2, "0")}</span>
              <h2 id={`curated-${block.key}-heading`}>{block.label}</h2>
            </div>
            <p className="summary" style={{ whiteSpace: "pre-wrap" }}>
              {block.value}
            </p>
          </section>
        ))}

        <section
          className="d-sec"
          id="curated-tight"
          data-target="贴身"
          aria-labelledby="curated-tight-heading"
        >
          <div className="d-sec-head">
            <span className="num">
              {String(atomSectionStart).padStart(2, "0")}
            </span>
            <h2 id="curated-tight-heading">贴身</h2>
            <span className="chip">{tightAtoms.length} 个</span>
          </div>
          <AtomList atoms={tightAtoms} />
        </section>

        {exploreAtoms.length > 0 ? (
          <section
            className="d-sec"
            id="curated-explore"
            data-target="探索"
            aria-labelledby="curated-explore-heading"
          >
            <div className="d-sec-head">
              <span className="num">
                {String(atomSectionStart + 1).padStart(2, "0")}
              </span>
              <h2 id="curated-explore-heading">探索</h2>
              <span className="chip">{exploreAtoms.length} 个</span>
            </div>
            <p className="summary">{EXPLORE_INTRO}</p>
            <AtomList atoms={exploreAtoms} />
          </section>
        ) : null}
      </main>
    </>
  );
}
