/**
 * SiteChrome — the shared premium frame both surfaces inherit (task-116).
 *
 * Composes Header + TrustBadge + page content + Footer into the single shell
 * rendered by app/layout.tsx. The landing (task-117) and calculator (task-118)
 * render INSIDE this frame as `children`; they do not re-implement chrome.
 *
 * Layout note: the page content lives in a flex column so the footer settles at
 * the bottom on short pages (min-height: 100dvh) without a fixed footer.
 */
import { Header } from "./Header";
import { TrustBadge } from "./TrustBadge";
import { Footer } from "./Footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <TrustBadge />
      <main style={{ flex: "1 0 auto" }}>{children}</main>
      <Footer />
    </div>
  );
}
