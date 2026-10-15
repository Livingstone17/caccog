import { Reveal, SplitHeadline } from "./reveal";

/**
 * Interior page masthead: tall, calm, one idea — with a soft ember behind the
 * type so the transparent nav stays legible.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-white/8 pt-36 pb-16 md:pt-44 md:pb-20">
      <div
        className="absolute inset-0 bg-[radial-gradient(70%_100%_at_50%_-10%,rgba(30,30,30,0.9),transparent_70%)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(255,122,26,0.1),transparent_75%)]"
        aria-hidden
      />
      <div className="container-page relative text-center">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <SplitHeadline
          as="h1"
          text={title}
          delay={0.12}
          className="font-display mx-auto mt-6 max-w-3xl text-5xl leading-[1.05] font-light text-white md:text-6xl lg:text-7xl"
        />
        {intro && (
          <Reveal delay={0.35}>
            <p className="text-muted mx-auto mt-7 max-w-2xl text-base leading-relaxed md:text-lg">
              {intro}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
