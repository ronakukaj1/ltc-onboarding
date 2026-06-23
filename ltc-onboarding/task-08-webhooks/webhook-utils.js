import crypto from "crypto";

const SECRET = process.env.WEBHOOK_SECRET ?? "dev-secret-change-me";

export function createSignature(body) {
  const raw = JSON.stringify(body);
  const hash = crypto.createHmac("sha256", SECRET).update(raw).digest("hex");
  return `sha256=${hash}`;
}

export function verifySignature(body, signature) {
  if (!signature) {
    return false;
  }

  const expected = createSignature(body);

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
