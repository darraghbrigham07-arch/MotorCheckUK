import { createHmac, timingSafeEqual } from "node:crypto";

export function normalizeRegistration(value: string) {
  return value.toUpperCase().replace(/[\s-]/g, "");
}

export function isValidRegistration(value: string) {
  return /^[A-Z0-9]{2,8}$/.test(value);
}

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAccessToken(registration: string, sessionId: string, secret: string) {
  const payload = Buffer.from(JSON.stringify({
    registration, sessionId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  })).toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}

export function verifyAccessToken(token: string | undefined, registration: string, secret: string) {
  if (!token) return false;
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return false;
  const expected = signature(payload, secret);
  const a = Buffer.from(suppliedSignature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return decoded.registration === registration && typeof decoded.exp === "number" && decoded.exp > Math.floor(Date.now() / 1000);
  } catch { return false; }
}

export function accessCookieName(registration: string) {
  return `mc_paid_${registration}`;
}
