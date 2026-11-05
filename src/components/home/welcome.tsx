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
    <section id="welcome" className="relative bg-black" aria-labelledby="welcome-title">
      <div className="container-page py-14 md:py-22">
        <Reveal>
          <p className="eyebrow text-center">Welcome home</p>
        </Reveal>

        <div className="mt-10 grid items-center gap-10 md:mt-14 md:grid-cols-2 md:gap-14 lg:gap-20">
          {/* Native portrait is ~4:5 (1122×1402); keep that frame so cover
              crops minimally and the face stays the focal point. */}
          <Reveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[18.5rem] [mask-image:linear-gradient(to_bottom,black_58%,transparent_100%)] [mask-size:100%_100%] [mask-repeat:no-repeat] sm:max-w-sm md:mx-0 md:max-w-md lg:max-w-[26rem]">
              <Image
                src={pastor}
                alt="Pastor Samuel Babatope, Lead Pastor of CAC Citadel of Grace"
                fill
                sizes="(max-width: 768px) 18.5rem, (max-width: 1024px) 28rem, 26rem"
                className="object-contain object-center"
                placeholder="blur"
              />
            </div>
          </Reveal>

          <div className="text-center md:text-left">
            <Reveal delay={0.1}>
              <h2
                id="welcome-title"
                className="font-display text-3xl leading-[1.35] font-light text-white md:text-[2.6rem]"
              >
                Our Lead Pastor
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="font-display mx-auto mt-5 max-w-xl text-base leading-relaxed font-light text-white/65 md:mx-0 md:text-xl md:leading-[1.45]">
                {welcomeStatement}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-muted mx-auto mt-8 max-w-xl text-base leading-relaxed md:mx-0">
                <Text>{siteSettings.fullName}</Text> meets in{" "}
                <Text>{siteSettings.city}</Text>. Doors are open — come as you are.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.3}>
          <Divider className="mt-14 md:mt-20" />
        </Reveal>
      </div>
    </section>
  );
}

/** Service times strip — the fastest answer to "when is the service?". */
export function ServiceStrip() {
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
