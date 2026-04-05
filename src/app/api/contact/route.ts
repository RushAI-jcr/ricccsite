import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const RECIPIENTS = [
  "juan_rojas@rush.edu",
  "juancroj@gmail.com",
  "Kevin_Buell@rush.edu",
];

// Rate limit: 3 submissions per IP per 15 minutes
const submissions = new Map<string, { count: number; resetAt: number }>();

function checkContactRateLimit(ip: string): boolean {
  const now = Date.now();
  if (submissions.size > 200) {
    for (const [key, entry] of submissions) {
      if (now > entry.resetAt) submissions.delete(key);
    }
  }
  const entry = submissions.get(ip);
  if (!entry || now > entry.resetAt) {
    submissions.set(ip, { count: 1, resetAt: now + 15 * 60_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

const ContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(254),
  track: z.string().min(1).max(100),
  proposal: z.string().min(1).max(2000),
  // Honeypot — hidden field that bots fill in, humans leave empty
  website: z.string().max(0, "Bot detected").optional().default(""),
});

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildHtml(name: string, email: string, track: string, proposal: string, siteUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, Helvetica, sans-serif; color: #1c1c13; line-height: 1.6; max-width: 600px;">
  <div style="border-bottom: 3px solid #004923; padding-bottom: 12px; margin-bottom: 24px;">
    <strong style="color: #004923; font-size: 18px;">RICCC Lab: Collaboration Inquiry</strong>
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 8px 12px; font-weight: bold; width: 140px; vertical-align: top; color: #5f5858;">Name</td>
      <td style="padding: 8px 12px;">${escapeHtml(name)}</td>
    </tr>
    <tr style="background: #f8f4e5;">
      <td style="padding: 8px 12px; font-weight: bold; vertical-align: top; color: #5f5858;">Email</td>
      <td style="padding: 8px 12px;"><a href="mailto:${escapeHtml(email)}" style="color: #00A66C;">${escapeHtml(email)}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 12px; font-weight: bold; vertical-align: top; color: #5f5858;">Partnership Track</td>
      <td style="padding: 8px 12px;">${escapeHtml(track)}</td>
    </tr>
  </table>
  <div style="margin-bottom: 24px;">
    <strong style="color: #5f5858;">Proposal Overview</strong>
    <div style="margin-top: 8px; padding: 16px; background: #f8f4e5; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(proposal)}</div>
  </div>
  <div style="font-size: 12px; color: #a59f9f; border-top: 1px solid #eaeaea; padding-top: 12px;">
    Sent from the RICCC Lab website contact form · <a href="${siteUrl}" style="color: #00A66C;">riccc-lab.com</a>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  // Rate limit
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkContactRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, email, track, proposal, website } = parsed.data;

  // Honeypot triggered — silently succeed so bots think it worked
  if (website) {
    return NextResponse.json({ ok: true });
  }

  const domain = process.env.RESEND_DOMAIN ?? "riccc-lab.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${domain}`;

  try {
    await getResend().emails.send({
      from: `RICCC Lab <noreply@${domain}>`,
      to: RECIPIENTS,
      replyTo: email,
      subject: `RICCC Collaboration Inquiry: ${track}`,
      html: buildHtml(name, email, track, proposal, siteUrl),
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Partnership Track: ${track}`,
        "",
        "Proposal Overview:",
        proposal,
        "",
        "---",
        "Sent from the RICCC Lab website contact form",
      ].join("\n"),
      headers: {
        "X-Entity-Ref-ID": `riccc-contact-${Date.now()}`,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send error:", err);
    return NextResponse.json(
      { error: "Failed to send. Please email us directly at info@riccc-lab.com" },
      { status: 500 }
    );
  }
}
