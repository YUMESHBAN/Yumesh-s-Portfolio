import { z } from "zod";

import { checkContactRateLimit } from "@/lib/contact-rate-limit";

export const runtime = "nodejs";

const inquiryTypeLabels = {
  job_opportunity: "Job opportunity",
  freelance_project: "Freelance / project",
  collaboration_other: "Collaboration / other",
} as const;

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  inquiryType: z.enum(["job_opportunity", "freelance_project", "collaboration_other"]),
  organizationOrProject: z.string().trim().max(120).optional(),
  subject: z.string().trim().min(4).max(120),
  message: z.string().trim().min(10).max(3000),
  website: z.string().optional(),
});

function firstConfigured(...values: Array<string | undefined>) {
  return values.find((value) => value && value.trim().length > 0)?.trim();
}

function commaList(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getClientAddress(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function getEmailConfig() {
  const host = firstConfigured(process.env.SMTP_HOST);
  const port = Number(firstConfigured(process.env.SMTP_PORT) || 587);
  const user = firstConfigured(process.env.SMTP_USER);
  const pass = firstConfigured(process.env.SMTP_PASS);
  const from = firstConfigured(
    process.env.SMTP_FROM,
    user ? `Yumesh Ban Portfolio <${user}>` : undefined,
  );
  const recipients = commaList(process.env.CONTACT_TO_EMAIL);

  return {
    host,
    port,
    user,
    pass,
    from,
    to: recipients.length ? Array.from(new Set(recipients)) : user ? [user] : [],
    secure: firstConfigured(process.env.SMTP_SECURE) === "true" || port === 465,
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ message: "Please fill all fields correctly." }, { status: 400 });
  }

  const data = parsed.data;

  if (data.website) {
    return Response.json({ message: "Thanks. Your message has been received." });
  }

  const rateLimit = checkContactRateLimit(getClientAddress(request));

  if (!rateLimit.allowed) {
    return Response.json(
      { message: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const emailConfig = getEmailConfig();

  if (!emailConfig.host || !emailConfig.user || !emailConfig.pass || !emailConfig.from || emailConfig.to.length === 0) {
    return Response.json(
      { message: "The contact form is temporarily unavailable. Please email me directly." },
      { status: 503 },
    );
  }

  try {
    const nodemailer = await import("nodemailer");
    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeOrganizationOrProject = escapeHtml(data.organizationOrProject || "Not provided");
    const safeSubject = escapeHtml(data.subject);
    const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br />");
    const inquiryTypeLabel = inquiryTypeLabels[data.inquiryType];

    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    await transporter.sendMail({
      from: emailConfig.from,
      to: emailConfig.to,
      replyTo: data.email,
      subject: `[Portfolio] [${inquiryTypeLabel}] ${data.subject}`,
      text: `Inquiry type: ${inquiryTypeLabel}\nName: ${data.name}\nEmail: ${data.email}\nCompany or project: ${data.organizationOrProject || "Not provided"}\nSubject: ${data.subject}\n\n${data.message}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171717">
          <h2>New portfolio contact message</h2>
          <p><strong>Inquiry type:</strong> ${inquiryTypeLabel}</p>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Company or project:</strong> ${safeOrganizationOrProject}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr />
          <p>${safeMessage}</p>
        </div>
      `,
    });
  } catch {
    return Response.json(
      { message: "The message could not be sent right now. Please email me directly." },
      { status: 502 },
    );
  }

  return Response.json({ message: "Thanks. Your message has been sent." });
}
