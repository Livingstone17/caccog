"use client";

import { useState } from "react";
import { PrivacyNotice } from "@/components/ui/privacy-notice";
import { cn } from "@/lib/utils";

type Topic = "prayer" | "contact";

interface FormState {
  status: "idle" | "sending" | "success" | "error";
  message?: string;
}

const field =
  "min-h-12 w-full rounded-none border border-white/15 bg-charcoal/60 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors duration-300 hover:border-orange/50 focus:border-orange";

export function ContactForm({ initialTopic = "contact" }: { initialTopic?: Topic }) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<FormState>({ status: "idle" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.includes("@") || message.trim().length < 5) {
      setState({
        status: "error",
        message: "Please fill in your name, a valid email and your message.",
      });
      return;
    }

    setState({ status: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          name,
          email,
          phone,
          subject: topic === "contact" ? subject : "",
          message,
          company: honeypot,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setState({
          status: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }
      setState({ status: "success" });
    } catch {
      setState({
        status: "error",
        message: "Network error — please try again.",
      });
    }
  };

  if (state.status === "success") {
    return (
      <div
        className="surface flex min-h-72 flex-col items-center justify-center p-10 text-center"
        role="status"
      >
        <span
          className="border-orange bg-orange/15 text-ember flex size-12 items-center justify-center rounded-full border"
          aria-hidden
        >
          ✓
        </span>
        <h2 className="font-display mt-6 text-3xl font-light text-white">
          {topic === "prayer" ? "Your request is received" : "Message sent"}
        </h2>
        <p className="text-muted mt-4 max-w-sm text-sm leading-relaxed">
          {topic === "prayer"
            ? "Thank you for trusting us with this. Our team will stand with you in prayer."
            : "Thank you for reaching out. Someone from the church will get back to you shortly."}
        </p>
        <button
          type="button"
          onClick={() => {
            setState({ status: "idle" });
            setMessage("");
            setSubject("");
          }}
          className="text-orange hover:text-ember mt-8 text-xs tracking-[0.24em] uppercase transition-colors duration-500"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="surface p-6 md:p-9" noValidate>
      <div
        className="inline-flex rounded-full border border-white/15 p-1"
        role="tablist"
        aria-label="Message type"
      >
        {(["prayer", "contact"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={topic === t}
            onClick={() => setTopic(t)}
            className={cn(
              "min-h-10 rounded-full px-5 text-xs tracking-[0.2em] uppercase transition-colors duration-500",
              topic === t ? "bg-orange text-black" : "text-white/70 hover:text-white",
            )}
          >
            {t === "prayer" ? "Prayer request" : "General enquiry"}
          </button>
        ))}
      </div>

      <p className="text-muted mt-4 text-sm leading-relaxed">
        {topic === "prayer"
          ? "Share as much or as little as you like. Your request is treated with care and confidentiality."
          : "Questions about visiting, ministries, giving or anything else — we are glad to help."}
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="text-orange block text-[0.62rem] tracking-[0.28em] uppercase">
          Your name *
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={`mt-2 ${field}`}
          />
        </label>
        <label className="text-orange block text-[0.62rem] tracking-[0.28em] uppercase">
          Email *
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={`mt-2 ${field}`}
          />
        </label>
        {topic === "contact" && (
          <>
            <label className="text-orange block text-[0.62rem] tracking-[0.28em] uppercase">
              Phone (optional)
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                className={`mt-2 ${field}`}
              />
            </label>
            <label className="text-orange block text-[0.62rem] tracking-[0.28em] uppercase">
              Subject
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`mt-2 ${field}`}
              />
            </label>
          </>
        )}
      </div>

      <label className="text-orange mt-4 block text-[0.62rem] tracking-[0.28em] uppercase">
        {topic === "prayer" ? "Your request *" : "Message *"}
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`mt-2 resize-y ${field}`}
        />
      </label>

      {/* Honeypot */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
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

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border-orange/40 bg-orange/10 text-ember mt-5 border px-4 py-3 text-sm"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={state.status === "sending"}
        className="bg-orange hover:bg-orange-bright mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full px-8 py-3.5 text-[0.8rem] font-medium tracking-[0.22em] text-black uppercase transition-colors duration-500 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {state.status === "sending"
          ? "Sending…"
          : topic === "prayer"
            ? "Send prayer request"
            : "Send message"}
      </button>

      <PrivacyNotice className="mt-5" />
    </form>
  );
}
