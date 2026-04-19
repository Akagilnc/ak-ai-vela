import Link from "next/link";
import type { Block } from "@/lib/path/types";

/**
 * Converts inline CSS string ("margin-bottom: 10px; color: red") to React CSSProperties.
 * Keeps the renderer tolerant of raw style strings embedded in block data.
 */
function parseInlineStyle(css: string): React.CSSProperties {
  const style: Record<string, string> = {};
  css.split(";").forEach((rule) => {
    const [k, v] = rule.split(":").map((s) => s.trim());
    if (!k || !v) return;
    const camelKey = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    style[camelKey] = v;
  });
  return style as React.CSSProperties;
}

function glyphFor(variant: "output" | "heart" | "warn"): string {
  return variant === "output" ? "◆" : variant === "warn" ? "▲" : "❋";
}

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          className="body-p"
          style={block.inlineStyle ? parseInlineStyle(block.inlineStyle) : undefined}
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    case "triad":
      return (
        <div className="triad">
          {block.items.map((item, i) => (
            <div key={i} className="triad-item">
              <div className="hd">
                <span className="tag">{item.tag}</span>
                <h5>{item.title}</h5>
                <span className="freq">{item.freq}</span>
              </div>
              <p dangerouslySetInnerHTML={{ __html: item.html }} />
            </div>
          ))}
        </div>
      );

    case "route":
      return (
        <>
          <div className="route">
            {block.steps.map((s, i) => (
              <div key={i} className="route-step">
                <span className="n">{i + 1}</span>
                <div>
                  <div className="zone">{s.zone}</div>
                  <div className="desc">{s.desc}</div>
                </div>
                <span className="dur">{s.dur}</span>
              </div>
            ))}
          </div>
          {block.aside ? (
            <p className="aside-note" dangerouslySetInnerHTML={{ __html: block.aside }} />
          ) : null}
        </>
      );

    case "trivia":
      return (
        <>
          <details className="trivia" open>
            <summary>
              <span className="emoji">💬</span>
              <span className="lbl">{block.label}</span>
              <span className="hint">
                teleprompter <span className="chev">▾</span>
              </span>
            </summary>
            <div className="tele">
              <div className="tele-head">{block.head}</div>
              {block.sub ? <div className="tele-sub">{block.sub}</div> : null}
              <ul>
                {block.lines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </details>
          {block.trailingCallout ? (
            <div className="callout heart" style={{ marginTop: 12 }}>
              <span className="glyph">❋</span>
              <div className="body">
                <span className="zh-lbl">{block.trailingCallout.lbl}</span>
                <span dangerouslySetInnerHTML={{ __html: block.trailingCallout.html }} />
              </div>
            </div>
          ) : null}
        </>
      );

    case "callout":
      return (
        <div className={`callout ${block.variant}`}>
          <span className="glyph">{glyphFor(block.variant)}</span>
          <div className="body">
            <span className="zh-lbl">{block.lbl}</span>{" "}
            <span dangerouslySetInnerHTML={{ __html: block.html }} />
          </div>
        </div>
      );

    case "callout-trio":
      return (
        <div className="callout-trio" style={{ marginTop: 0 }}>
          {block.items.map((item, i) => (
            <div key={i} className={`callout ${item.variant}`}>
              <span className="glyph">{glyphFor(item.variant)}</span>
              <div className="body">
                <span className="zh-lbl">{item.lbl}</span>{" "}
                <span dangerouslySetInnerHTML={{ __html: item.html }} />
              </div>
            </div>
          ))}
        </div>
      );

    case "path-opts":
      return (
        <div className="path-opts">
          {block.opts.map((opt, i) => (
            <div key={i} className="path-opt" data-effort={opt.effortKey}>
              <div className="hd">
                <span className="letter">{opt.letter}</span>
                <span className="label">{opt.label}</span>
                <span className="effort">{opt.effort}</span>
              </div>
              {opt.bodyHtml ? (
                <p
                  className="body-p"
                  dangerouslySetInnerHTML={{ __html: opt.bodyHtml }}
                />
              ) : (
                <div className="loc-list">
                  {opt.locCards?.map((card, j) => {
                    const body = (
                      <>
                        <div className="loc-photo has-photo">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/assets/img/${card.photo}`}
                            alt={card.name}
                            loading="lazy"
                          />
                        </div>
                        <div className="loc-meta">
                          <div className="loc-name">{card.name}</div>
                          <div className="loc-desc">{card.desc}</div>
                          {card.link ? (
                            <span className="inner-link">{card.link.label}</span>
                          ) : null}
                        </div>
                      </>
                    );
                    return card.link ? (
                      <Link
                        key={j}
                        href={`/path/${card.link.gotoActivitySlug}`}
                        className="loc-card linked"
                      >
                        {body}
                      </Link>
                    ) : (
                      <div key={j} className="loc-card">
                        {body}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      );

    case "sub-block":
      return (
        <div className="sub-block">
          {block.blocks.map((b, i) => (
            <BlockRenderer key={i} block={b} />
          ))}
        </div>
      );

    case "list-check":
      return (
        <>
          {block.intro ? (
            <p className="body-p" style={{ marginBottom: 10 }}>
              {block.intro}
            </p>
          ) : null}
          <ul className="check">
            {block.items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </>
      );

    case "list-bullets":
      return (
        <ul className="bullets">
          {block.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );

    case "photo-row":
      return (
        <div className="photo-row" style={{ marginTop: 14 }}>
          {block.photos.map((p, i) => (
            <div key={i} className="photo-ph has-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/assets/img/${p.src}`} alt={p.alt} loading="lazy" />
              <span className="cap">{p.cap}</span>
            </div>
          ))}
        </div>
      );

    case "id-table":
      return (
        <>
          {block.intro ? (
            <p
              className="body-p"
              style={{
                marginBottom: 10,
                color: "var(--mute)",
                fontSize: 12,
              }}
            >
              {block.intro}
            </p>
          ) : null}
          <div className="id-table">
            {block.rows.map((row, i) => (
              <div key={i} className="id-row" data-level={row.level}>
                <div className="img has-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/img/${row.photo}`}
                    alt={row.zh}
                    loading="lazy"
                  />
                </div>
                <div className="meta">
                  <div className="zh">{row.zh}</div>
                  <div className="trait">{row.trait}</div>
                </div>
                <div className="level">{row.level}</div>
              </div>
            ))}
          </div>
          {block.aside ? <p className="aside-note">{block.aside}</p> : null}
        </>
      );

    case "steps":
      return (
        <ol className="steps">
          {block.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ol>
      );

    case "philosophy":
      return (
        <div className="philosophy">
          <div className="lbl">{block.lbl}</div>
          <p dangerouslySetInnerHTML={{ __html: block.html }} />
        </div>
      );

    case "sources":
      return (
        <div className="sources">
          <div className="t">{block.title}</div>
          <ul>
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );

    case "aside-note":
      return (
        <p
          className="aside-note"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    default: {
      // Exhaustive switch — compiler will flag any new block type that's missed.
      const _never: never = block;
      void _never;
      return null;
    }
  }
}
