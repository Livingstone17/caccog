/**
 * Email delivery via Resend's HTTP API (no SDK needed).
 *
 * Configure with RESEND_API_KEY + EMAIL_FROM — the `from` address must sit on a
 * domain verified in Resend. Without both, sends are logged to the server
 * console and reported as `mocked: true`, so callers can tell the visitor the
 * truth instead of claiming an email went out.
 *
 * Verify the credentials end to end with `pnpm email:test you@example.com`.
 */
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
  html?: string;
}

export interface SendEmailResult {
  /** Resend accepted the message. Also true when delivery is mocked. */
  delivered: boolean;
  /** Nothing was sent because RESEND_API_KEY / EMAIL_FROM are missing. */
  mocked: boolean;
  /** Resend's message id, when it accepted the email. */
  id?: string;
  /** Resend's error text, or the timeout/network failure. */
  error?: string;
}

const ENDPOINT = "https://api.resend.com/emails";
const TIMEOUT_MS = 10_000;

/** Read the email env vars once, trimmed, so stray whitespace can't break auth. */
export function emailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  return { apiKey, from, configured: Boolean(apiKey && from) };
}

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
  html,
}: SendEmailOptions): Promise<SendEmailResult> {
  const { apiKey, from } = emailConfig();
  const recipients = Array.isArray(to) ? to : [to];

  if (!apiKey || !from) {
    console.info("[email:mock]", { to: recipients, subject, text });
    return { delivered: true, mocked: true };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject,
        text,
        html: html ?? `<pre>${escapeHtml(text)}</pre>`,
        reply_to: replyTo || undefined,
      }),
      // Never let a slow Resend response hang a form submission.
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    const payload = (await res.json().catch(() => null)) as {
      id?: string;
      message?: string;
    } | null;

    if (!res.ok) {
      const detail = payload?.message ?? `Resend responded ${res.status}`;
      console.error("[email:error]", res.status, detail, { to: recipients, subject });
      return { delivered: false, mocked: false, error: detail };
    }

    console.info("[email:sent]", payload?.id ?? "(no id)", "→", recipients.join(", "));
    return { delivered: true, mocked: false, id: payload?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email request failed";
    console.error("[email:exception]", message, { to: recipients, subject });
    return { delivered: false, mocked: false, error: message };
  }
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
