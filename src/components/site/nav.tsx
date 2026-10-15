"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_LINKS, siteSettings } from "@/content/site";
import { buttonClass } from "@/components/ui/button";
import { cn, isPlaceholder } from "@/lib/utils";

/** Official church lockup (brand/logo-master.jpg → pnpm logo:assets). */
function Wordmark() {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={1080}
      height={438}
      sizes="140px"
      className="h-11 w-auto md:h-14"
    />
  );
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const id = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const trigger = hamburgerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const firstLink = overlayRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <a
        href="#main"
        className="focus:bg-orange sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:px-5 focus:py-2 focus:text-sm focus:text-black"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-700 ease-[var(--ease-sanctuary)]",
          scrolled
            ? "border-b border-white/10 bg-black/72 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-page flex h-20 items-center justify-between md:h-24">
          {/* The logo image is decorative inside the link; the link's
              accessible name carries the brand (WCAG 2.5.3). */}
          <Link href="/" aria-label={`${siteSettings.name} CAC — home`}>
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-2 text-[0.72rem] font-medium tracking-[0.24em] uppercase transition-colors duration-500",
                    active ? "text-ember" : "text-white/75 hover:text-white",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "bg-orange absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-sanctuary)]",
                      active && "scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
            <Link href="/give" className={buttonClass("primary", "ml-2 px-6 py-2.5")}>
              Give
            </Link>
          </nav>

          <button
            ref={hamburgerRef}
            type="button"
            className="flex size-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/20 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={cn(
                "h-px w-5 bg-current transition-transform duration-500",
                open && "translate-y-[3.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-current transition-transform duration-500",
                open && "-translate-y-[3.5px] -rotate-45",
              )}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={overlayRef}
            className="fixed inset-0 z-40 flex flex-col bg-black/97 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="flex flex-1 flex-col justify-center px-8 pt-24 pb-16">
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {[...NAV_LINKS, { href: "/give", label: "Give" }].map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduce ? 0 : 0.1 + i * 0.06,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      className="font-display hover:text-ember block border-b border-white/8 py-4 text-4xl font-light text-white transition-colors duration-500 sm:text-5xl"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                className="text-muted mt-10 space-y-3 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduce ? 0 : 0.5, duration: 0.8 }}
              >
                <p>{siteSettings.address.line1}</p>
                <p>{siteSettings.city}</p>
                <div className="flex gap-4 pt-2">
                  <a
                    href={siteSettings.socials.facebook}
                    className="text-orange hover:text-ember text-xs tracking-[0.2em] uppercase"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                  {!isPlaceholder(siteSettings.socials.youtube) && (
                    <a
                      href={siteSettings.socials.youtube}
                      className="text-orange hover:text-ember text-xs tracking-[0.2em] uppercase"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      YouTube
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
