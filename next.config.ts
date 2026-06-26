import type { NextConfig } from "next";

/**
 * CliffCheck — full SSR/SSG on Vercel.
 *
 * Deliberately NO `output: 'export'`: the re-platform wants dynamic OG images
 * and ISR per-state SEO pages (docs/replatform/PLAN.md §"Migration & deploy").
 * The old VibesOS "no build step / static export / GitHub Pages" rules are void.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
