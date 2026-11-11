import { ButtonLink } from "@/components/ui/button";

/**
 * Stand-in for the Paystack checkout while the church's merchant account is
 * being set up. Swap this back for `<GiveForm />` on /give once Paystack is live.
 */
export function OnlineGivingSoon() {
  return (
    <div className="surface relative overflow-hidden p-6 md:p-9">
      <div
        className="pointer-events-none absolute -top-28 -right-20 size-64 rounded-full bg-[radial-gradient(circle,rgba(255,122,26,0.16),transparent_65%)]"
        aria-hidden
      />

      <p className="eyebrow">Online giving</p>

      <p className="border-orange/40 text-orange mt-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.6rem] tracking-[0.22em] uppercase">
        <span className="bg-orange size-1.5 rounded-full" aria-hidden />
        Coming soon
      </p>

      <h2 className="font-display mt-5 text-2xl leading-snug font-light text-white md:text-3xl">
        Card giving is not available just yet
      </h2>

      <p className="text-muted mt-4 text-sm leading-relaxed">
        We are working on setting this up. In the meantime, please give by bank transfer
        instead — the church account details are beside this panel, or just below it on a
        phone.
      </p>

      <ButtonLink href="#bank-transfer" className="mt-7 w-full sm:w-auto">
        Use bank transfer instead
      </ButtonLink>
    </div>
  );
}
