import Link from "next/link";
import type { PathActivity } from "@prisma/client";
import type { ActivitySection } from "@/lib/path/types";
import { BackIcon, ShareIcon, ClockIcon } from "./path-icons";
import { BlockRenderer } from "./block-renderer";
import { PathSubNav } from "./path-sub-nav";
import { PathLightbox } from "./path-lightbox";
import { PathDetailNav } from "./path-detail-nav";

type TileChip = { cls: string; t: string };

type Props = {
  activity: PathActivity;
  index: number;                 // 0-based position in overall activity list
  total: number;
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
};

export function PathActivityDetail({
  activity,
  index,
  total,
  prev,
  next,
}: Props) {
  const chips = (activity.chips as unknown as TileChip[]) ?? [];
  const sections = (activity.sections as unknown as ActivitySection[]) ?? [];
  const pos = String(index + 1).padStart(2, "0");
  const tot = String(total).padStart(2, "0");

  return (
    <>
      <div className="app-chrome detail-mode">
        <Link href="/path" className="back-btn">
          <BackIcon />
          <span>5 月</span>
        </Link>
        <div className="center-title">
          <span className="idx">
            {pos} / {tot}
          </span>
          {activity.title}
        </div>
        <button className="icon-btn" aria-label="分享" type="button">
          <ShareIcon />
        </button>
      </div>

      <PathSubNav targets={sections.map((s) => s.target)} />

      <div className="detail-body" id="detail-body">
        <div className="card-intro" data-kind={activity.cardType}>
          <div className="kicker">
            <span className="pip"></span>
            <span>{activity.kicker}</span>
          </div>
          <h2>{activity.title}</h2>
          <p
            className="summary"
            dangerouslySetInnerHTML={{ __html: activity.summary }}
          />
          <div className="chip-row">
            {chips.map((ch, i) => (
              <span key={i} className={`chip ${ch.cls}`}>
                {ch.t}
              </span>
            ))}
          </div>
          <div className="trigger">
            <span className="lbl">{activity.triggerLabel}</span>
            <span dangerouslySetInnerHTML={{ __html: activity.triggerText }} />
          </div>
          <div className="meta-bar">
            <span className="ico">
              <ClockIcon />
            </span>
            <span
              className="txt"
              dangerouslySetInnerHTML={{ __html: activity.timeText }}
            />
            <span className="pct">{activity.timePct}</span>
          </div>
        </div>

        {sections.map((section, i) => (
          <section
            key={section.target}
            className="d-sec"
            id={`sec-${i}`}
            data-target={section.target}
          >
            {section.title || section.numLabel ? (
              <div className="d-sec-head">
                {section.numLabel ? (
                  <span className="num">{section.numLabel}</span>
                ) : null}
                {section.title ? <h3>{section.title}</h3> : null}
                {section.chip ? <span className="chip">{section.chip}</span> : null}
              </div>
            ) : null}
            {section.blocks.map((block, j) => (
              <BlockRenderer key={j} block={block} />
            ))}
          </section>
        ))}
      </div>

      <div className="d-footer">
        {prev ? (
          <Link href={`/path/${prev.slug}`} className="prev">
            <span className="ic">←</span>
            <div className="stack">
              <span className="dir">上一张</span>
              <span className="ti">{prev.title}</span>
            </div>
          </Link>
        ) : (
          <button className="prev" disabled type="button">
            <span className="ic">←</span>
            <div className="stack">
              <span className="dir">上一张</span>
              <span className="ti">—</span>
            </div>
          </button>
        )}
        {next ? (
          <Link href={`/path/${next.slug}`} className="next">
            <div className="stack">
              <span className="dir">下一张</span>
              <span className="ti">{next.title}</span>
            </div>
            <span className="ic">→</span>
          </Link>
        ) : (
          <button className="next" disabled type="button">
            <div className="stack">
              <span className="dir">下一张</span>
              <span className="ti">—</span>
            </div>
            <span className="ic">→</span>
          </button>
        )}
      </div>

      <PathLightbox />
      <PathDetailNav prevSlug={prev?.slug} nextSlug={next?.slug} />
    </>
  );
}
