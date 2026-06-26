import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/chrome/SiteChrome";

/**
 * Root layout. System-font stack only — DESIGN.md bans custom font loading
 * (target users are on cheap Android phones with variable font rendering, so
 * fast + readable wins). The font stack lives in --font-sans (app/globals.css);
 * no next/font import here by design.
 *
 * Renders the shared SiteChrome shell (Header + TrustBadge + Footer) around all
 * pages (task-116). Landing (task-117) and calculator (task-118) render as
 * `children` inside this frame.
 */
export const metadata: Metadata = {
  title: "CliffCheck — see what a raise really costs you",
  description:
    "A raise should never make you poorer. CliffCheck reveals the hidden math behind benefits cliffs — and the exact income target to clear one. Free, private, and your data never leaves your phone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
