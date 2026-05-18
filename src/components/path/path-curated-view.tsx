import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
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
  proseBlocks?: unknown;
  atoms: Array<{ atom: CuratedAtom }>;
};

type Props = {
  view: CuratedViewForPage;
};

type AuthoredProseBlock = {
  key: string;
  label: string;
  value: string;
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
  // The derived seed stores source prose in stable fields; labels stay source-authored per view.
  "g1-may-baseline": { whySpecial: "时间占用" },
  "g1-may-labor-holiday": { leadLine: "触发条件", whySpecial: "时间预算" },
  "g1-may-lixia-solar-term": { leadLine: "触发条件" },
  "g1-may-dongtan-migration-tail": {
    leadLine: "触发条件",
    whySpecial: "为什么是这个时间窗",
  },
  "g1-may-neighborhood-ecology": { leadLine: "触发条件" },
};

const AUTHORED_PROSE_KEYS_BY_SLUG: Record<string, readonly string[]> = {
  "g1-may-baseline": ["leadLine", "timeBudget", "output", "heart"],
  "g1-may-labor-holiday": [
    "leadLine",
    "precondition",
    "timeBudget",
    "output",
    "pitfalls",
    "heart",
  ],
  "g1-may-lixia-solar-term": [
    "leadLine",
    "precondition",
    "time",
    "whySpecial",
    "output",
    "heart",
  ],
  "g1-may-dongtan-migration-tail": [
    "leadLine",
    "precondition",
    "time",
    "whySpecial",
    "prepGuide",
    "howTo",
    "output",
    "pitfalls",
    "backupPlan",
    "backupHeart",
    "heart",
  ],
  "g1-may-neighborhood-ecology": [
    "leadLine",
    "precondition",
    "time",
    "whySpecial",
    "speciesGuide",
    "howTo",
    "output",
    "pitfalls",
    "heart",
    "sources",
  ],
};

const EXPLORE_INTRO =
  "下面这些不一定贴她现在的兴趣，但很可能玩得来，有空不妨试试。";

const markdownBlockSpacing: CSSProperties = {
  margin: "0 0 10px",
  whiteSpace: "pre-wrap",
};

const markdownListSpacing: CSSProperties = {
  margin: "0 0 10px",
  paddingLeft: 22,
};

const markdownBlockquoteStyle: CSSProperties = {
  borderLeft: "3px solid var(--color-border)",
  color: "var(--color-secondary-text)",
  margin: "0 0 10px",
  paddingLeft: 12,
};

const markdownTableStyle: CSSProperties = {
  borderCollapse: "collapse",
  fontSize: 13,
  margin: "0 0 10px",
  width: "100%",
};

const markdownCellStyle: CSSProperties = {
  border: "1px solid var(--color-border)",
  padding: "6px 8px",
  textAlign: "left",
  verticalAlign: "top",
};

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

function markdownHrefKind(href: string): "external" | "internal" | null {
  if (href.startsWith("/") && !href.startsWith("//")) return "internal";
  if (/^https?:\/\//i.test(href)) return "external";
  return null;
}

function renderInlineMarkdown(value: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const tokenPattern = /(`[^`\n]+`|\*\*[^*]+\*\*|_[^_\n]+_|\[[^\[\]]+\]\([^)]+\))/g;
  let cursor = 0;
  let tokenIndex = 0;

  for (const match of value.matchAll(tokenPattern)) {
    const [token] = match;
    const start = match.index ?? 0;
    if (start > cursor) {
      parts.push(value.slice(cursor, start));
    }

    const key = `${keyPrefix}-${tokenIndex++}`;
    if (token.startsWith("**")) {
      parts.push(
        <strong key={key}>
          {renderInlineMarkdown(token.slice(2, -2), `${key}-strong`)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      parts.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("_")) {
      parts.push(
        <em key={key}>{renderInlineMarkdown(token.slice(1, -1), `${key}-em`)}</em>,
      );
    } else {
      const linkMatch = token.match(/^\[([^\[\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const hrefKind = markdownHrefKind(href);
        parts.push(
          hrefKind === "external" ? (
            <a key={key} href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
          ) : hrefKind === "internal" ? (
            <Link key={key} href={href}>
              {label}
            </Link>
          ) : (
            label
          ),
        );
      } else {
        parts.push(token);
      }
    }

    cursor = start + token.length;
  }

  if (cursor < value.length) {
    parts.push(value.slice(cursor));
  }

  return parts;
}

function isTableLine(value: string) {
  return /^\s*\|.*\|\s*$/.test(value);
}

function isTableSeparator(value: string) {
  return /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/.test(value);
}

function isBlockquoteLine(value: string) {
  return /^\s*>\s?/.test(value);
}

type MarkdownListKind = "ordered" | "unordered";

type MarkdownListItem = {
  content: string;
  children: MarkdownListNode[];
};

type MarkdownListNode = {
  kind: MarkdownListKind;
  start: number | undefined;
  items: MarkdownListItem[];
};

type MarkdownListLine = {
  kind: MarkdownListKind;
  indent: number;
  number: number | undefined;
  content: string;
};

function parseMarkdownListLine(value: string): MarkdownListLine | null {
  const match = value.match(/^(\s*)(?:(\d+)\.\s+|-\s+)(.+)$/);
  if (!match) return null;

  return {
    kind: match[2] ? "ordered" : "unordered",
    indent: match[1].replace(/\t/g, "  ").length,
    number: match[2] ? Number(match[2]) : undefined,
    content: match[3],
  };
}

function parseMarkdownList(
  lines: string[],
  startIndex: number,
  kind: MarkdownListKind,
  indent: number,
): { node: MarkdownListNode; nextIndex: number } {
  const node: MarkdownListNode = {
    kind,
    start: undefined,
    items: [],
  };
  let index = startIndex;

  while (index < lines.length) {
    if (!lines[index].trim()) break;

    const parsed = parseMarkdownListLine(lines[index]);
    if (!parsed || parsed.indent < indent) break;

    const currentItem = node.items[node.items.length - 1];
    if (parsed.indent > indent) {
      if (!currentItem) break;
      const child = parseMarkdownList(lines, index, parsed.kind, parsed.indent);
      currentItem.children.push(child.node);
      index = child.nextIndex;
      continue;
    }

    if (parsed.kind !== kind) break;
    if (node.kind === "ordered" && node.start == null) {
      node.start = parsed.number;
    }
    node.items.push({ content: parsed.content, children: [] });
    index += 1;
  }

  return { node, nextIndex: index };
}

function renderMarkdownList(node: MarkdownListNode, keyPrefix: string) {
  const items = node.items.map((item, itemIndex) => (
    <li key={`${keyPrefix}-li-${itemIndex}`}>
      {renderInlineMarkdown(item.content, `${keyPrefix}-li-${itemIndex}`)}
      {item.children.map((child, childIndex) =>
        renderMarkdownList(child, `${keyPrefix}-child-${itemIndex}-${childIndex}`),
      )}
    </li>
  ));

  if (node.kind === "ordered") {
    return (
      <ol key={keyPrefix} start={node.start} style={markdownListSpacing}>
        {items}
      </ol>
    );
  }

  return (
    <ul key={keyPrefix} style={markdownListSpacing}>
      {items}
    </ul>
  );
}

function splitTableRow(value: string) {
  return value
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderMarkdownBlocks(text: string): ReactNode[] {
  const lines = text.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let index = 0;
  let blockIndex = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (isBlockquoteLine(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && isBlockquoteLine(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      blocks.push(
        <blockquote key={`quote-${blockIndex++}`} style={markdownBlockquoteStyle}>
          {renderMarkdownBlocks(quoteLines.join("\n"))}
        </blockquote>,
      );
      continue;
    }

    if (
      isTableLine(line) &&
      index + 1 < lines.length &&
      isTableSeparator(lines[index + 1])
    ) {
      const header = splitTableRow(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && isTableLine(lines[index])) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }
      blocks.push(
        <table key={`table-${blockIndex++}`} style={markdownTableStyle}>
          <thead>
            <tr>
              {header.map((cell, cellIndex) => (
                <th key={cellIndex} style={markdownCellStyle}>
                  {renderInlineMarkdown(cell, `th-${blockIndex}-${cellIndex}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={markdownCellStyle}>
                    {renderInlineMarkdown(cell, `td-${blockIndex}-${rowIndex}-${cellIndex}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      );
      continue;
    }

    const listLine = parseMarkdownListLine(line);
    if (listLine) {
      const { node, nextIndex } = parseMarkdownList(
        lines,
        index,
        listLine.kind,
        listLine.indent,
      );
      blocks.push(renderMarkdownList(node, `list-${blockIndex++}`));
      index = nextIndex;
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !(
        parseMarkdownListLine(lines[index]) ||
        isBlockquoteLine(lines[index]) ||
        (isTableLine(lines[index]) &&
          index + 1 < lines.length &&
          isTableSeparator(lines[index + 1]))
      )
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push(
      <p key={`p-${blockIndex++}`} style={markdownBlockSpacing}>
        {renderInlineMarkdown(paragraphLines.join("\n"), `p-${blockIndex}`)}
      </p>,
    );
  }

  return blocks;
}

function MarkdownText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      {renderMarkdownBlocks(text)}
    </div>
  );
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

function normalizeProseBlocks(value: unknown): AuthoredProseBlock[] {
  if (!Array.isArray(value)) return [];

  const blocks: AuthoredProseBlock[] = [];
  const seenKeys = new Set<string>();
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const block = item as Record<string, unknown>;
    const key = typeof block.key === "string" ? block.key.trim() : "";
    const label = typeof block.label === "string" ? block.label.trim() : "";
    const blockValue = typeof block.value === "string" ? block.value.trim() : "";
    if (
      !key ||
      !/^[a-z][a-zA-Z0-9_-]*$/.test(key) ||
      !label ||
      !blockValue ||
      seenKeys.has(key)
    ) {
      return [];
    }
    seenKeys.add(key);

    blocks.push({
      key,
      label,
      value: blockValue,
    });
  }

  return blocks;
}

function includesExpectedProseKeys(
  blocks: AuthoredProseBlock[],
  expectedKeys: readonly string[],
) {
  let expectedIndex = 0;
  for (const block of blocks) {
    if (block.key === expectedKeys[expectedIndex]) expectedIndex += 1;
  }
  return expectedIndex === expectedKeys.length;
}

function proseBlocksForView(view: CuratedViewForPage) {
  const authoredBlocks = normalizeProseBlocks(view.proseBlocks);
  const expectedKeys = AUTHORED_PROSE_KEYS_BY_SLUG[view.slug];
  if (
    authoredBlocks.length > 0 &&
    (!expectedKeys || includesExpectedProseKeys(authoredBlocks, expectedKeys))
  ) {
    return authoredBlocks;
  }

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
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            background: "rgba(255,255,255,0.46)",
            padding: 14,
          }}
        >
          <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>{atom.title}</h3>
          <MarkdownText
            text={atom.body}
            style={{
              color: "var(--ink)",
              fontSize: 14,
              lineHeight: 1.65,
              margin: 0,
              whiteSpace: "pre-wrap",
            }}
          />
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
  const overviewHref = view.month ? `/path?month=${view.month}` : "/path";

  return (
    <>
      <header className="app-chrome detail-mode">
        <Link href={overviewHref} className="back-btn">
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
            id={`curated-prose-${block.key}`}
            data-target={block.label}
            aria-labelledby={`curated-prose-${block.key}-heading`}
          >
            <div className="d-sec-head">
              <span className="num">{String(index + 1).padStart(2, "0")}</span>
              <h2 id={`curated-prose-${block.key}-heading`}>{block.label}</h2>
            </div>
            <MarkdownText
              className="summary"
              text={block.value}
              style={{ whiteSpace: "pre-wrap" }}
            />
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
