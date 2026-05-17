export type SlotAtom = {
  slug: string;
  interests: string[];
  frictionLevel: number;
  cadenceRole: string;
  displayOrder: number;
};

export type SlotConfig = {
  tightRatio: number;
  frictionCeiling: number;
};

export type ChildProfile = {
  interests?: string[];
};

type RankedAtom = {
  atom: SlotAtom;
  index: number;
  matched: boolean;
};

export function selectSlot(
  atoms: SlotAtom[],
  config: SlotConfig,
  childProfile?: ChildProfile,
): { tight: SlotAtom[]; explore: SlotAtom[] } {
  const eligible = atoms.filter(
    (atom) => atom.frictionLevel <= config.frictionCeiling,
  );

  let tightQuota = Math.floor((eligible.length * config.tightRatio) / 100);
  let exploreQuota = eligible.length - tightQuota;

  if (eligible.length >= 2 && exploreQuota === 0) {
    exploreQuota = 1;
    tightQuota = eligible.length - 1;
  }

  const interestSignal = childProfile?.interests ?? [];
  const hasInterestSignal = interestSignal.length > 0;
  const interestSet = new Set(interestSignal);

  const ranked = eligible
    .map<RankedAtom>((atom, index) => ({
      atom,
      index,
      matched:
        hasInterestSignal &&
        atom.interests.some((interest) => interestSet.has(interest)),
    }))
    .sort((a, b) => {
      if (a.matched !== b.matched) return a.matched ? -1 : 1;
      if (a.atom.displayOrder !== b.atom.displayOrder) {
        return a.atom.displayOrder - b.atom.displayOrder;
      }
      return a.index - b.index;
    });

  const tightRanked = ranked.slice(0, tightQuota);
  const tightIndexes = new Set(tightRanked.map((item) => item.index));

  const remainingRanked = ranked.filter((item) => !tightIndexes.has(item.index));

  const exploreRanked = hasInterestSignal
    ? remainingRanked.sort((a, b) => {
        if (a.atom.frictionLevel !== b.atom.frictionLevel) {
          return a.atom.frictionLevel - b.atom.frictionLevel;
        }
        if (a.atom.displayOrder !== b.atom.displayOrder) {
          return a.atom.displayOrder - b.atom.displayOrder;
        }
        return a.index - b.index;
      })
    : remainingRanked;

  const explore = exploreRanked.map((item) => item.atom);

  return {
    tight: tightRanked.map((item) => item.atom),
    explore,
  };
}
