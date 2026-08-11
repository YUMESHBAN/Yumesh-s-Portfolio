import assert from "node:assert/strict";
import test from "node:test";

import { checkContactRateLimit } from "./contact-rate-limit";

test("allows five contact submissions and rejects the sixth within ten minutes", () => {
  const client = `test-${Date.now()}`;
  const now = Date.now();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    assert.deepEqual(checkContactRateLimit(client, now), { allowed: true, retryAfterSeconds: 0 });
  }

  assert.deepEqual(checkContactRateLimit(client, now), { allowed: false, retryAfterSeconds: 600 });
});

test("allows a contact submission after the ten-minute window expires", () => {
  const client = `test-expiry-${Date.now()}`;
  const now = Date.now();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    checkContactRateLimit(client, now);
  }

  assert.deepEqual(checkContactRateLimit(client, now + 10 * 60 * 1000), { allowed: true, retryAfterSeconds: 0 });
});
