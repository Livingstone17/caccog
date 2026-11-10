/**
 * Page-level transition: a slow, calm fade with a slight rise.
 *
 * This is intentionally a plain div + CSS animation (see `.animate-page-enter`
 * in globals.css) rather than a Framer Motion `initial={{ opacity: 0 }}`. A
 * JS-driven `initial` is server-rendered as `opacity: 0` and only resolves
 * after hydration, so any page that fails to hydrate shows nothing at all.
 * The CSS animation also collapses to instant under `prefers-reduced-motion`.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-enter">{children}</div>;
}
