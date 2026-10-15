import { siteSettings } from "@/content/site";
import { welcomeStatement } from "@/content/pages";
import { Reveal, Text } from "@/components/ui/reveal";
import { Divider } from "@/components/ui/section";
import { isPlaceholder } from "@/lib/utils";
import pastor from "@/app/pastor.png";
import Image from "next/image";

/** Welcome statement — the hero text cross-fades into this section. */
export function Welcome() {
  return (
    <section id="welcome" className="relative bg-white" aria-labelledby="welcome-title">
      <div className="container-page py-10 text-center md:py-22">
        <Reveal>
          <p className="eyebrow">Welcome home</p>
        </Reveal>
      </div>
      <div className="welcomeContainer grid pr-[20vw] pl-[20vw] md:grid-cols-2">
        <div className="relative h-[60vh] w-full overflow-hidden">
          <Image
            src={pastor}
            alt="lead pastor"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="welcomeNote mt-32">
          <Reveal delay={0.1}>
            <h2
              id="welcome-title"
              className="font-display mx-auto max-w-3xl text-3xl leading-[1.35] font-light text-black md:text-[2.6rem]"
            >
              Our Lead Pastor
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="font-display mx-auto max-w-3xl text-sm leading-[1.35] font-light text-black/65 md:text-[1.6rem]">
              {welcomeStatement}
            </p>
          </Reveal>
          <Reveal delay={0.3}>

            <p className="text-muted mx-auto mt-8 max-w-xl text-base leading-relaxed">
              <Text>{siteSettings.fullName}</Text> meets in{" "}
              <Text>{siteSettings.city}</Text>. Doors are open — come as you are.
            </p>
          </Reveal>
        </div>
      </div>
      <Reveal delay={0.3}>
        <Divider className="mt-5" />
      </Reveal>
    </section>
  );
}

/** Service times strip — the fastest answer to "when is the service?". */ export function ServiceStrip() {
  return (
    <section
      aria-label="Service times"
      className="bg-charcoal/50 border-y border-white/10"
    >
      <div className="container-page">
        <ul className="grid divide-y divide-white/10 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3">
          {siteSettings.serviceTimes.map((t) => (
            <li
              key={t.id}
              className="flex items-baseline justify-between gap-4 px-1 py-6 md:flex-col md:items-center md:gap-2 md:px-6 md:text-center lg:first:col-span-1"
            >
              <span className="text-orange text-[0.62rem] font-medium tracking-[0.32em] uppercase">
                {t.label}
              </span>
              <span className="flex items-baseline gap-2 md:flex-col md:gap-1">
                <span className="font-display text-2xl font-light text-white md:text-3xl">
                  {t.day}
                </span>
                <span
                  className={
                    isPlaceholder(t.time)
                      ? "placeholder-chip"
                      : "text-ember text-lg md:text-xl"
                  }
                >
                  {t.time}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
