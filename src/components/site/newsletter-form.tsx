"use client";

import { useState } from "react";
import { PrivacyNotice } from "@/components/ui/privacy-notice";

/** Compact newsletter signup (Brevo) for the footer. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      setError("Enter a valid email address.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: honeypot }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error ?? "Please try again later.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Network error — please try again.");
    }
  };

  if (status === "done") {
    return (
      <p className="text-ember text-sm" role="status">
        Thank you — you are subscribed.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <label className="text-orange/80 block text-[0.6rem] tracking-[0.28em] uppercase">
        Stay in the loop
        <span className="focus-within:border-orange mt-2 flex overflow-hidden rounded-full border border-white/20">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            aria-label="Email address for the newsletter"
            className="min-h-11 w-full bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/35"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="bg-orange hover:bg-orange-bright min-h-11 shrink-0 px-5 text-[0.62rem] font-medium tracking-[0.2em] text-black uppercase transition-colors duration-500 disabled:opacity-70"
          >
            {status === "sending" ? "…" : "Join"}
          </button>
        </span>
      </label>
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px] h-px w-px opacity-0"
        aria-hidden
      />
      {status === "error" && error && (
        <p className="text-ember mt-2 text-xs" role="alert">
          {error}
        </p>
      )}
      <PrivacyNotice className="mt-3 max-w-xs" />
    </form>
  );
}
