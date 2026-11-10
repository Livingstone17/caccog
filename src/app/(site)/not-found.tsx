import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS } from "@/content/site";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-6 pt-24">
      <div
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(30,30,30,0.9),transparent_75%)]"
        aria-hidden
      />
      <div className="relative text-center">
        <p className="eyebrow">Lost in the halls</p>
        <h1 className="font-display text-ember mt-6 text-[clamp(5rem,22vw,11rem)] leading-none font-light">
          404
        </h1>
        <p className="text-muted mx-auto mt-6 max-w-md text-base leading-relaxed">
          This page has moved, or perhaps it never existed. Everything you need is just a
          step away.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Return home</ButtonLink>
          <ButtonLink href="/plan-your-visit" variant="ghost">
            Plan your visit
          </ButtonLink>
        </div>

        <nav aria-label="404 links" className="mt-12">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs tracking-[0.2em] text-white/55 uppercase">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-ember transition-colors duration-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
