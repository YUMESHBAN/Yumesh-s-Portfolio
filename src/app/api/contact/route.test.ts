import assert from "node:assert/strict";
import test from "node:test";

import { POST } from "./route";

function contactRequest(client: string) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": client },
    body: JSON.stringify({
      name: "Asha Sharma",
      email: "asha@example.com",
      inquiryType: "freelance_project",
      subject: "Portfolio website project",
      message: "We need help improving our company portfolio website.",
      website: "",
    }),
  });
}

test("the contact route returns 503 when email delivery is not configured", async () => {
  const client = `route-test-${Date.now()}`;
  const originalSmtpHost = process.env.SMTP_HOST;
  process.env.SMTP_HOST = "";

  try {
    const response = await POST(contactRequest(client));
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      message: "The contact form is temporarily unavailable. Please email me directly.",
    });
  } finally {
    process.env.SMTP_HOST = originalSmtpHost;
  }
});

test("the contact route rejects whitespace-only fields", async () => {
  const request = new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "   ",
      email: "asha@example.com",
      inquiryType: "job_opportunity",
      subject: "    ",
      message: "          ",
      website: "",
    }),
  });

  assert.equal((await POST(request)).status, 400);
});

test("the honeypot accepts bot submissions without email configuration", async () => {
  const request = contactRequest(`honeypot-test-${Date.now()}`);
  const body = await request.json();
  const response = await POST(
    new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify({ ...body, website: "https://spam.example" }),
    }),
  );

  assert.equal(response.status, 200);
});
