// Password-gate session helpers. Uses Web Crypto (HMAC-SHA256) so the same
// code runs in Edge middleware and Node route handlers.

export const SESSION_COOKIE = "brew_session";
const SESSION_DAYS = 30;

function getSecret(): string {
  const s = process.env.BREW_SESSION_SECRET;
  if (!s) throw new Error("BREW_SESSION_SECRET is not set");
  return s;
}

function toBase64Url(bytes: ArrayBuffer): string {
  const b = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toBase64Url(sig);
}

// Constant-time-ish string compare.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Create a signed session token: `<expEpoch>.<hmac>`. */
export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(exp);
  const sig = await hmac(payload, getSecret());
  return `${payload}.${sig}`;
}

/** Verify a session token's signature and expiry. */
export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmac(payload, getSecret());
  if (!safeEqual(sig, expected)) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return true;
}

/**
 * Check a submitted password against BREW_PASSWORD.
 * Compares fixed-length HMAC digests so neither timing nor the length-mismatch
 * short-circuit leaks the real password length.
 */
export async function checkPassword(password: string): Promise<boolean> {
  const expected = process.env.BREW_PASSWORD;
  if (!expected) return false;
  const secret = getSecret();
  const [a, b] = await Promise.all([
    hmac(password, secret),
    hmac(expected, secret),
  ]);
  return safeEqual(a, b);
}

export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;
