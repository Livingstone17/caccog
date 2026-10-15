/**
 * Email delivery via Resend's HTTP API (no SDK needed).
 * Falls back to logging when RESEND_API_KEY is not configured, so local
 * development and previews always succeed.
 */
interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
  html?: string;
}

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
  html,
}: SendEmailOptions): Promise<{ delivered: boolean; mocked: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.info("[email:mock]", { to, subject, text });
    return { delivered: true, mocked: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html: html ?? `<pre>${escapeHtml(text)}</pre>`,
      reply_to: replyTo,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("[email:error]", res.status, detail);
    return { delivered: false, mocked: false };
  }

  return { delivered: true, mocked: false };
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
