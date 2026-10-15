import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { statementOfFaith, storyTimeline, visionMission } from "@/content/pages";
import { loadLeaders } from "@/content";
import { isPlaceholder } from "@/lib/utils";

export const metadata: Metadata = pageMetadata("/about", {
  title: "About",
  description:
    "The story, vision and statement of faith of Citadel of Grace, a Christ Apostolic Church (CAC) congregation — plus the leaders who serve the church.",
});

function Portrait({ name }: { name: string }) {
  return (
    <div
      className="relative flex aspect-[4/5] w-full items-end overflow-hidden border border-white/10 bg-[linear-gradient(160deg,#1e1e1e_0%,#161616_60%,#101010_100%)]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_25%,rgba(255,122,26,0.14),transparent_70%)]" />
      <svg
        viewBox="0 0 200 250"
        className="text-orange/35 absolute top-1/2 left-1/2 w-2/3 -translate-x-1/2 -translate-y-[54%]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="100" cy="88" r="40" />
        <path d="M28 240c8-52 36-82 72-82s64 30 72 82" />
      </svg>
      <div className="relative w-full bg-gradient-to-t from-black/90 to-transparent p-5 pt-12">
        <p className="text-orange/80 text-[0.58rem] tracking-[0.3em] uppercase">
          Portrait pending
        </p>
        <p className="text-muted mt-1 text-sm">{name}</p>
      </div>
    </div>
  );
}

export default async function AboutPage() {
  const leaders = await loadLeaders();

  return (
    <>
      <PageHeader
        eyebrow="Who we are"
        title="A house of grace, a citadel of faith"
        intro="Learn the story of Citadel of Grace, what we believe, and the people God has placed to serve this congregation."
      />

      {/* Vision & mission */}
      <Section id="vision">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <Reveal className="bg-charcoal/30 border border-white/10 p-8 md:p-10">
            <p className="eyebrow">Vision</p>
            <p className="font-display text-ember mt-5 text-2xl leading-snug font-light md:text-3xl">
              {isPlaceholder(visionMission.vision) ? (
                <span className="placeholder-chip">{visionMission.vision}</span>
              ) : (
                visionMission.vision
              )}
            </p>
          </Reveal>
          <Reveal
            delay={0.1}
            className="bg-charcoal/30 border border-white/10 p-8 md:p-10"
          >
            <p className="eyebrow">Mission</p>
            <p className="font-display mt-5 text-2xl leading-snug font-light text-white md:text-3xl">
              {isPlaceholder(visionMission.mission) ? (
                <span className="placeholder-chip">{visionMission.mission}</span>
              ) : (
                visionMission.mission
              )}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Story timeline */}
      <Section
        id="story"
        className="bg-charcoal/25 border-y border-white/8"
        align="left"
        eyebrow="Our story"
        title="How we got here"
      >
        <ol className="border-orange/30 relative mx-auto max-w-2xl space-y-10 border-l pl-8 md:pl-10">
          {storyTimeline.map((entry, i) => (
            <Reveal as="li" key={i} delay={i * 0.08} className="relative">
              <span
                className="border-orange absolute top-1.5 -left-[41px] size-2.5 rotate-45 border bg-black md:-left-[49px]"
                aria-hidden
              />
              <p className="text-orange text-xs tracking-[0.3em] uppercase">
                {entry.year}
              </p>
              <h3 className="font-display mt-2 text-2xl font-normal text-white">
                {isPlaceholder(entry.title) ? (
                  <span className="placeholder-chip">{entry.title}</span>
                ) : (
                  entry.title
                )}
              </h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">{entry.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Statement of faith */}
      <Section
        id="beliefs"
        align="left"
        eyebrow="Statement of faith"
        title="What we believe"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {statementOfFaith.map((belief, i) => (
            <Reveal
              key={i}
              delay={i * 0.07}
              className="bg-charcoal/30 hover:border-orange/40 border border-white/10 p-7 transition-[border-color] duration-700 md:p-8"
            >
              <span className="font-display text-orange/60 text-3xl font-light">
                0{i + 1}
              </span>
              <h3 className="font-display mt-4 text-xl font-normal text-white">
                {isPlaceholder(belief.title) ? (
                  <span className="placeholder-chip">{belief.title}</span>
                ) : (
                  belief.title
                )}
              </h3>
              <p className="text-muted mt-3 text-sm leading-relaxed">{belief.body}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-white/50">
          Approved doctrinal wording will be published here once supplied by church
          leadership, in line with the constitution of the Christ Apostolic Church.
        </p>
      </Section>

      {/* Leadership */}
      <Section
        id="leadership"
        className="bg-charcoal/25 border-t border-white/8"
        eyebrow="Leadership"
        title="The team who serve"
        intro="Pastors and ministry leaders who shepherd, teach and serve the congregation."
      >
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((leader, i) => (
            <Reveal as="li" key={leader.id} delay={i * 0.08}>
              <Portrait name={leader.name} />
              <div className="mt-5">
                <h3 className="font-display text-xl font-normal text-white">
                  {isPlaceholder(leader.name) ? (
                    <span className="placeholder-chip">{leader.name}</span>
                  ) : (
                    leader.name
                  )}
                </h3>
                <p className="text-orange mt-1 text-[0.68rem] tracking-[0.26em] uppercase">
                  {leader.role}
                </p>
                <p className="text-muted mt-3 text-sm leading-relaxed">{leader.bio}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}
