import type { Metadata } from "next";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "@fontsource/geist-mono/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vela — 美国大学申请规划",
  description: "AI 驱动的美国大学申请规划工具，帮助中国家庭看清差距、找到方向",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning on <html>: mobile webviews (iOS Safari,
    // WeChat) and a growing list of browser extensions inject attributes
    // onto the <html> tag before React hydrates — `style="zoom:…"`,
    // `data-kantu="*"`, translate flags, etc. React throws a hydration
    // mismatch for any unexpected attribute and unmounts the whole tree,
    // which is exactly what the initial PR was trying to fix. React only
    // supports this at the element where third-party injection is
    // expected, so we keep it scoped to <html>. See PR 8 review thread.
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
