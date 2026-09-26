import { timingSafeEqual } from "node:crypto";
import { createHmac } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
type Request = IncomingMessage & { body?: unknown; method?: string };
type Response = ServerResponse & { status: (code: number) => Response; json: (payload: unknown) => void };
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const SESSION_MS = 8 * 60 * 60 * 1000;
function sameSecret(input: string, expected: string) { const a = Buffer.from(input); const b = Buffer.from(expected); return a.length === b.length && timingSafeEqual(a, b); }
function clientKey(req: Request) { const forwarded = req.headers["x-forwarded-for"]; return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress || "unknown"; }
function sign(payload: string) { return createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "").update(payload).digest("base64url"); }
function sessionCookie(value: string, maxAge: number) { return `scorpius_admin=${value}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Strict`; }
export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store"); res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });
  const configuredEmail = process.env.NABDA_ADMIN_EMAIL; const configuredPassword = process.env.NABDA_ADMIN_PASSWORD; const secret = process.env.ADMIN_SESSION_SECRET;
  if (!configuredEmail || !configuredPassword || !secret) return res.status(503).json({ ok: false, error: "admin_not_configured" });
  const key = clientKey(req); const now = Date.now(); const current = attempts.get(key);
  if (current && current.resetAt > now && current.count >= MAX_ATTEMPTS) return res.status(429).json({ ok: false, error: "too_many_attempts" });
  if (!current || current.resetAt <= now) attempts.set(key, { count: 1, resetAt: now + WINDOW_MS }); else current.count += 1;
  let payload: { email?: unknown; password?: unknown } = {};
  try { payload = typeof req.body === "string" ? JSON.parse(req.body) : (req.body as typeof payload) || {}; } catch { return res.status(400).json({ ok: false, error: "invalid_request" }); }
  const valid = typeof payload.email === "string" && typeof payload.password === "string" && sameSecret(payload.email.trim().toLowerCase(), configuredEmail.trim().toLowerCase()) && sameSecret(payload.password, configuredPassword);
  if (!valid) return res.status(401).json({ ok: false, error: "invalid_credentials" });
  attempts.delete(key); const expires = now + SESSION_MS; const body = `admin|${expires}`; const token = `${body}.${sign(body)}`;
  res.setHeader("Set-Cookie", sessionCookie(token, Math.floor(SESSION_MS / 1000))); return res.status(200).json({ ok: true, expiresAt: expires });
}
export function verifyAdminCookie(header: string | undefined) { const token = header?.split(";").map((item) => item.trim()).find((item) => item.startsWith("scorpius_admin="))?.slice("scorpius_admin=".length); if (!token) return false; const [body, signature] = token.split("."); if (!body || !signature || !process.env.ADMIN_SESSION_SECRET || !sameSecret(signature, sign(body))) return false; const [role, expires] = body.split("|"); return role === "admin" && Number(expires) > Date.now(); }
