import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Cursor } from "@/components/site/cursor";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { organizationJsonLd } from "@/lib/jsonld";

/**
 * Public site layout.
 *
 * Everything the church website needs on every page — navigation, footer,
 * custom cursor, smooth scrolling and the organization JSON-LD — lives here
 * rather than in the root layout, so the Sanity Studio at /studio is not
 * wrapped in it.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <SmoothScroll />
      <Nav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <Cursor />
    </>
  );
}
