/**
 * /tool — the calculator surface (task-118). The product core.
 *
 * Server shell: renders the <Calculator/> client island inside the shared chrome
 * (Header + TrustBadge + Footer from app/layout). The tool is calm and instant —
 * all motion/colour rules from DESIGN.md apply (no count-up tickers on real
 * money, amber focus rings, single column ≤540px).
 *
 * Financial inputs NEVER leave the device: the calculator is a client island
 * with no fetch, no server action, no API route. The only thing that can be
 * shared is the scenario shape, via the URL hash (lib/profile-url.ts).
 *
 * <noscript> carry-forward (task-117): the tool needs JS to compute live, so we
 * give no-JS visitors a clear, warm message rather than a blank screen.
 */
import type { Metadata } from "next";
import { Calculator } from "@/components/calculator/Calculator";

export const metadata: Metadata = {
  title: "Check your number — CliffCheck",
  description:
    "See what a raise really leaves you with after benefits, and the income where you clear every cliff. Free, private, instant — your data never leaves your phone.",
};

export default function ToolPage() {
  return (
    <>
      <noscript>
        <div
          style={{
            maxWidth: 540,
            margin: "0 auto",
            padding: "32px 16px",
            textAlign: "center",
            color: "#57534E",
            lineHeight: 1.6,
          }}
        >
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1C1917" }}>
            CliffCheck needs JavaScript
          </h1>
          <p>
            The calculator does all its math right here on your device — nothing
            is sent anywhere — so it needs JavaScript switched on. Turn it on and
            reload to see your number.
          </p>
        </div>
      </noscript>
      <Calculator />
    </>
  );
}
