import Link from "next/link";
import type { PathActivity } from "@prisma/client";
import { parseChips, parsePreviews } from "@/lib/path/parse";
import { ArrowIcon } from "./path-icons";

type Props = {
  activity: PathActivity;
  index: number;         // 0-based position in list
  total: number;         // total tile count (for "01 / 05")
};

function stripBold(html: string): string {
  return html.replace(/<\/?b>/g, "");
}

export function PathActivityTile({ activity, index, total }: Props) {
  const chips = parseChips(activity.chips);
  const previews = parsePreviews(activity.previews);
  const firstChip = chips[0]?.t ?? "";
  const lastChip = chips.at(-1)?.t ?? "";
  const hasPreviews = previews.length > 0;
  const pos = String(index + 1).padStart(2, "0");
  const tot = String(total).padStart(2, "0");

  return (
    <Link
      href={`/path/${activity.slug}`}
      className={`tile ${activity.cardType}${hasPreviews ? " has-previews" : ""}`}
      aria-label={`打开 ${activity.title}`}
    >
      <div className="strap">
        <span className="pip"></span>
        <span className="kicker">{activity.kicker}</span>
        <span className="idx">
          {pos} / {tot}
        </span>
      </div>
      <div className="tile-body">
        <h3>{activity.title}</h3>
        <p className="ledge">{stripBold(activity.summary)}</p>
        {hasPreviews ? (
          <div className="tile-previews" aria-hidden="true">
            {previews.map((f) => (
              <span className="tp" key={f}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/assets/img/${f}`} alt="" loading="lazy" />
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="tile-foot">
        <span className="trigger-chip">{firstChip}</span>
        <span className="time-chip">{lastChip}</span>
        <span className="arrow">
          打开 <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}
