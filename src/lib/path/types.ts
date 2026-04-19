/**
 * Re-export Path Explorer section / block types from the seed data file.
 *
 * Seed data lives in docs/research/data/g1-may-seed.ts (single source of truth
 * for both prisma/seed.ts and React components). This file is a thin alias so
 * components can import via @/lib/path/types instead of deep relative paths.
 *
 * Nesting invariant: `SubBlock.blocks` is typed as `Exclude<Block, SubBlock>[]`
 * directly in the seed file (see SubBlock interface there), so sub-blocks
 * cannot nest — enforced at the compiler level, no runtime depth guard needed.
 */

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
