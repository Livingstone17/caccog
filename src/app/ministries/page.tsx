import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { loadMinistries } from "@/content";
import { isPlaceholder } from "@/lib/utils";

export const metadata: Metadata = pageMetadata("/ministries", {
  title: "Ministries",
  description:
    "Choir, youth, women, men, children, ushers, media and more — find a ministry at Citadel of Grace to belong to and serve in.",
});

export default async function MinistriesPage() {
  const ministries = await loadMinistries();

  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="Ministries & departments"
        intro="There is a place for you to belong, to grow and to serve. Explore the departments of the church."
      />
      <Section id="ministries" align="left">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ministries.map((ministry, i) => (
            <Reveal as="li" key={ministry.id} delay={(i % 3) * 0.08} className="h-full">
              <Link
                href={`/ministries/${ministry.slug}`}
                className="group bg-charcoal/35 hover:border-orange/45 relative flex h-full flex-col overflow-hidden border border-white/10 p-7 transition-[border-color,background-color] duration-700 before:absolute before:inset-0 before:bg-[radial-gradient(90%_60%_at_50%_0%,rgba(255,122,26,0.12),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-100 md:p-8"
              >
                <span className="bg-orange relative size-1.5 rotate-45" aria-hidden />
                <h2 className="font-display group-hover:text-ember relative mt-6 text-2xl font-normal text-white transition-colors duration-500">
                  {ministry.name}
                </h2>
                <p className="text-muted relative mt-3 flex-1 text-sm leading-relaxed">
                  {isPlaceholder(ministry.summary) ? (
                    <span className="placeholder-chip">{ministry.summary}</span>
                  ) : (
                    ministry.summary
                  )}
                </p>
                <p className="text-orange/85 relative mt-6 text-[0.62rem] tracking-[0.26em] uppercase">
                  {ministry.meetingTime}
                </p>
                <span
                  className="text-orange relative mt-5 inline-flex items-center gap-2 text-[0.68rem] tracking-[0.24em] uppercase transition-transform duration-500 group-hover:translate-x-1.5"
                  aria-hidden
                >
                  Learn more →
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}
