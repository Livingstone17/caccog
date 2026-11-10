import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { getMinistries, getMinistryBySlug } from "@/content/ministries";
import { loadMinistries } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { isPlaceholder } from "@/lib/utils";

export async function generateMetadata(
  props: PageProps<"/ministries/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const ministry = getMinistryBySlug(slug);
  if (!ministry) return { title: "Ministry not found" };
  return pageMetadata(`/ministries/${ministry.slug}`, {
    title: `${ministry.name} Ministry`,
    description: ministry.summary,
  });
}

export function generateStaticParams() {
  return getMinistries().map((m) => ({ slug: m.slug }));
}

export default async function MinistryPage(props: PageProps<"/ministries/[slug]">) {
  const { slug } = await props.params;
  const ministry =
    (await loadMinistries()).find((m) => m.slug === slug) ?? getMinistryBySlug(slug);
  if (!ministry) notFound();

  return (
    <>
      <PageHeader eyebrow="Ministry" title={ministry.name} intro={ministry.summary} />

      <Section id="ministry" align="left">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <Reveal>
            <p className="eyebrow">About this ministry</p>
            <p className="text-muted mt-5 text-base leading-relaxed md:text-lg">
              {isPlaceholder(ministry.description) ? (
                <span className="placeholder-chip">{ministry.description}</span>
              ) : (
                ministry.description
              )}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="surface p-7">
              <dl className="divide-y divide-white/10">
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="text-orange/80 text-[0.62rem] tracking-[0.28em] uppercase">
                    Meets
                  </dt>
                  <dd className="text-sm text-white">
                    {isPlaceholder(ministry.meetingTime) ? (
                      <span className="placeholder-chip">{ministry.meetingTime}</span>
                    ) : (
                      ministry.meetingTime
                    )}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="text-orange/80 text-[0.62rem] tracking-[0.28em] uppercase">
                    Led by
                  </dt>
                  <dd className="text-sm text-white">
                    {isPlaceholder(ministry.leader) ? (
                      <span className="placeholder-chip">{ministry.leader}</span>
                    ) : (
                      ministry.leader
                    )}
                  </dd>
                </div>
              </dl>
              <div className="mt-7 flex flex-col gap-3">
                <ButtonLink href="/contact">Get involved</ButtonLink>
                <ButtonLink href="/ministries" variant="ghost">
                  All ministries
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-14 border-t border-white/10 pt-8 text-center">
          <Link
            href="/ministries"
            className="group text-orange hover:text-ember inline-flex items-center gap-3 text-[0.7rem] tracking-[0.3em] uppercase transition-colors duration-500"
          >
            <span
              className="transition-transform duration-500 group-hover:-translate-x-1.5"
              aria-hidden
            >
              ←
            </span>
            Back to all ministries
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
