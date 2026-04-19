/**
 * Re-export Path Explorer section / block types from the seed data file.
 *
 * Seed data lives in docs/research/data/g1-may-seed.ts (single source of truth
 * for both prisma/seed.ts and React components). This file is a thin alias so
 * components can import via @/lib/path/types instead of deep relative paths.
 *
 * Nesting invariant: `SubBlock.blocks` in the source type allows `Block[]`
 * (including other sub-blocks), but the demo + v0.1 renderer only ever use
 * one level of nesting. `NonSubBlock` below encodes that contract so callers
 * that care about recursion bounds can opt into the stricter shape.
 */

import type { Block, SubBlock } from "../../../docs/research/data/g1-may-seed";

export type {
  ActivitySection,
  Block,
  ParagraphBlock,
  TriadBlock,
  RouteBlock,
  TriviaBlock,
  CalloutBlock,
  CalloutTrioBlock,
  PathOptsBlock,
  SubBlock,
  ListCheckBlock,
  ListBulletsBlock,
  PhotoRowBlock,
  IdTableBlock,
  StepsBlock,
  PhilosophyBlock,
  SourcesBlock,
  AsideNoteBlock,
} from "../../../docs/research/data/g1-may-seed";

/** All Block variants except `sub-block` — the type that sub-block.blocks should hold. */
export type NonSubBlock = Exclude<Block, SubBlock>;
