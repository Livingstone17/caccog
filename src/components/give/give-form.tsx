"use client";

import { useState } from "react";
import { siteSettings } from "@/content/site";
import { CopyButton } from "@/components/ui/copy-button";
import { PrivacyNotice } from "@/components/ui/privacy-notice";
import { isPlaceholder } from "@/lib/utils";

const PURPOSES = [
  { id: "tithe", label: "Tithe" },
  { id: "offering", label: "Offering" },
  { id: "building", label: "Building fund" },
  { id: "missions", label: "Missions" },
  { id: "other", label: "Other" },
] as const;

const planId = process.env.NEXT_PUBLIC_PAYSTACK_PLAN_ID;

export function GiveForm() {
  const presets = siteSettings.giving.presets;
  const [amountKobo, setAmountKobo] = useState<number>(presets[1]?.amountKobo ?? 100_000);
  const [customAmount, setCustomAmount] = useState("");
  const [purpose, setPurpose] = useState<string>("offering");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const usingCustom = customAmount !== "";
  const displayAmount = usingCustom
    ? Math.round((parseFloat(customAmount) || 0) * 100)
    : amountKobo;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayAmount || displayAmount < 100_000) {
      setError("Please choose an amount of at least ₦1,000.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email for your receipt.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/give/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          amountKobo: displayAmount,
          purpose,
          frequency,
          plan: frequency === "monthly" ? planId : undefined,
          company: honeypot,
        }),
      });
      const data = (await res.json()) as {
        authorization_url?: string;
        error?: string;
      };

      if (!res.ok || !data.authorization_url) {
        setError(data.error ?? "We could not start checkout. Please try again.");
        return;
      }
      window.location.assign(data.authorization_url);
    } catch {
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "min-h-12 w-full rounded-none border border-white/15 bg-charcoal/60 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors duration-300 hover:border-orange/50 focus:border-orange";

  return (
    <form onSubmit={submit} className="surface p-6 md:p-9" noValidate>
      {/* Amount presets */}
      <fieldset>
        <legend className="text-orange text-[0.62rem] tracking-[0.28em] uppercase">
          Amount
        </legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {presets.map((p) => {
            const active = !usingCustom && amountKobo === p.amountKobo;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setAmountKobo(p.amountKobo);
                  setCustomAmount("");
                }}
                aria-pressed={active}
                className={`min-h-12 rounded-full border px-6 text-sm transition-colors duration-500 ${
                  active
                    ? "border-orange bg-orange/15 text-ember"
                    : "hover:border-orange/50 border-white/20 text-white/80"
                }`}
              >
                {p.label}
              </button>
            );
          })}
          <label className="focus-within:border-orange relative flex min-h-12 items-center rounded-full border border-white/20 px-5">
            <span className="mr-2 text-sm text-white/60">₦</span>
            <input
              type="number"
              inputMode="numeric"
              min={1000}
              placeholder="Custom"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              aria-label="Custom amount in naira"
              className="w-24 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </label>
        </div>
      </fieldset>

      {/* Purpose */}
      <fieldset className="mt-8">
        <legend className="text-orange text-[0.62rem] tracking-[0.28em] uppercase">
          Purpose
        </legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {PURPOSES.map((p) => {
            const active = purpose === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPurpose(p.id)}
                aria-pressed={active}
                className={`min-h-11 rounded-full border px-5 text-sm transition-colors duration-500 ${
                  active
                    ? "border-ember/60 bg-ember/10 text-ember"
                    : "hover:border-orange/50 border-white/15 text-white/75"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Frequency */}
      <fieldset className="mt-8">
        <legend className="text-orange text-[0.62rem] tracking-[0.28em] uppercase">
          Frequency
        </legend>
        <div className="mt-4 flex gap-3">
          {(["once", "monthly"] as const).map((f) => {
            const disabled = f === "monthly" && !planId;
            const active = frequency === f;
            return (
              <button
                key={f}
                type="button"
                disabled={disabled}
                onClick={() => setFrequency(f)}
                aria-pressed={active}
                className={`min-h-11 rounded-full border px-5 text-sm transition-colors duration-500 ${
                  active
                    ? "border-orange bg-orange/15 text-ember"
                    : "hover:border-orange/50 border-white/15 text-white/75"
                } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {f === "once" ? "One-time" : "Monthly (recurring)"}
              </button>
            );
          })}
        </div>
        {!planId && (
          <p className="mt-3 text-xs text-white/50">
            Recurring giving activates once a Paystack plan code is configured.
          </p>
        )}
      </fieldset>

      {/* Details */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="text-orange block text-[0.62rem] tracking-[0.28em] uppercase">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            autoComplete="name"
            className={`mt-2 ${field}`}
          />
        </label>
        <label className="text-orange block text-[0.62rem] tracking-[0.28em] uppercase">
          Email for receipt
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={`mt-2 ${field}`}
          />
        </label>
      </div>

      {/* Honeypot */}
      <div
        className="absolute top-auto -left-[9999px] h-px w-px overflow-hidden"
        aria-hidden
      >
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="border-orange/40 bg-orange/10 text-ember mt-6 border px-4 py-3 text-sm"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="bg-orange hover:bg-orange-bright mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full px-7 py-3.5 text-[0.8rem] font-medium tracking-[0.22em] text-black uppercase transition-colors duration-500 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {busy ? "Redirecting to Paystack…" : `Give ${formatNaira(displayAmount)}`}
      </button>

      <PrivacyNotice variant="give" className="mt-5" />
      <p className="mt-2 text-xs leading-relaxed text-white/55">
        A receipt is emailed to you as soon as your gift is confirmed.
      </p>
    </form>
  );
}

function formatNaira(kobo: number): string {
  if (!kobo || Number.isNaN(kobo)) return "";
  return `₦${(kobo / 100).toLocaleString("en-NG")}`;
}

export function BankTransfer() {
  const bank = siteSettings.giving.bank;
  const rows = [
    { label: "Account name", value: bank.accountName },
    { label: "Account number", value: bank.accountNumber },
    { label: "Bank", value: bank.bank },
  ];

  return (
    <div id="bank-transfer" className="surface p-6 md:p-9">
      <p className="eyebrow">Bank transfer</p>
      <p className="text-muted mt-4 text-sm leading-relaxed">
        You can also give by direct transfer to the church account. Please use your name
        as the description, and keep your teller or receipt — the media team can confirm
        it for you.
      </p>

      <dl className="mt-7 divide-y divide-white/10 border-y border-white/10">
        {rows.map((row) => {
          const pending = isPlaceholder(row.value);
          // Each row is one `div > (dt, dd)` group — the only nesting ARIA
          // allows inside a `<dl>` (axe definition-list / dlitem).
          return (
            <div key={row.label} className="py-4">
              <dt className="text-orange/80 text-[0.6rem] tracking-[0.28em] uppercase">
                {row.label}
              </dt>
              <dd className="mt-1.5 flex items-center justify-between gap-4">
                <span className="font-display text-lg font-normal text-white md:text-xl">
                  {pending ? (
                    <span className="placeholder-chip">{row.value}</span>
                  ) : (
                    row.value
                  )}
                </span>
                {!pending && (
                  <CopyButton
                    value={row.value}
                    label={`Copy ${row.label.toLowerCase()}`}
                  />
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-5 text-xs text-white/50">
        Bank details are pending confirmation from church leadership — see
        CONTENT_TODO.md.
      </p>
    </div>
  );
}
