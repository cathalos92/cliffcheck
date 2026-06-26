import type { Metadata } from "next";
import "./globals.css";

/**
 * Root layout. System-font stack only — DESIGN.md bans custom font loading
 * (target users are on cheap Android phones with variable font rendering, so
 * fast + readable wins). The font stack lives in --font-sans (app/globals.css);
 * no next/font import here by design.
 */
export const metadata: Metadata = {
  title: "CliffCheck",
  description:
    "See the hidden math behind benefits cliffs — and the exact income target to escape one. Your data stays on your device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
