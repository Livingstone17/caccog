import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "quiet" | "secondary";

const variants: Record<Variant, string> = {
  primary:
    "bg-orange text-black hover:bg-orange-bright border border-orange/60 hover:border-orange-bright",
  ghost:
    "bg-transparent text-white border border-white/35 hover:border-white/70 hover:bg-white/5",
  quiet: "bg-transparent text-white/70 border border-transparent hover:text-white",
  secondary: "text-black border border-orange/40 hover:text-orange",
};

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-[0.8rem] font-medium uppercase tracking-[0.22em] transition-[background-color,border-color,color,box-shadow] duration-500 ease-[var(--ease-sanctuary)] will-change-transform";

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className,
  external,
}: ButtonLinkProps) {
  const cls = buttonClass(variant, className);
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: Variant }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}
