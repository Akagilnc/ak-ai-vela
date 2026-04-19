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
      {children}
    </>
  );
}
