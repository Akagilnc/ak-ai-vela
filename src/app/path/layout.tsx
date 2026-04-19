import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Path Explorer · Vela",
  description: "Vela Path Explorer — G1-G3 月度活动卡",
};

export default function PathLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* vela.css is served from public/assets/ and styles every .stage / .tile / .d-sec rule */}
      <link rel="stylesheet" href="/assets/vela.css" />
      {/* R14 a11y fix: skip-to-content links — hidden off-viewport via the
          `.skip-link` class in vela.css, pulled into view via :focus.
          Pure CSS so the layout stays a Server Component. Two anchors:
          overview pages have `<main id="path-main">`, detail pages have
          `<main id="detail-body">`. The irrelevant target is a no-op
          jump (the anchor exists in DOM but the matching id doesn't on
          that page), which is harmless. */}
      <a href="#path-main" className="skip-link">
        跳到主内容
      </a>
      <a href="#detail-body" className="skip-link">
        跳到正文
      </a>
      {children}
    </>
  );
}
