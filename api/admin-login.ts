import { timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

type Request = IncomingMessage & { body?: unknown; method?: string };
type Response = ServerResponse & { status: (code: number) => Response; json: (payload: unknown) => void };

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function sameSecret(input: string, expected: string) {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function clientKey(req: Request) {
  const forwarded = req.headers["x-forwarded-for"];
  return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "unknown";
}

export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });
  const key = clientKey(req);
  const now = Date.now();
  const current = attempts.get(key);
  if (current && current.resetAt > now && current.count >= MAX_ATTEMPTS) return res.status(429).json({ ok: false, error: "too_many_attempts" });
  if (!current || current.resetAt <= now) attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  else current.count += 1;

  let payload: { email?: unknown; password?: unknown } = {};
  try { payload = typeof req.body === "string" ? JSON.parse(req.body) : (req.body as typeof payload) || {}; } catch { return res.status(400).json({ ok: false, error: "invalid_request" }); }
  const configuredEmail = process.env.NABDA_ADMIN_EMAIL;
  const configuredPassword = process.env.NABDA_ADMIN_PASSWORD;
  const valid = Boolean(configuredEmail && configuredPassword && typeof payload.email === "string" && typeof payload.password === "string" && sameSecret(payload.email.trim().toLowerCase(), configuredEmail.trim().toLowerCase()) && sameSecret(payload.password, configuredPassword));
  if (!valid) return res.status(401).json({ ok: false, error: "invalid_credentials" });
  attempts.delete(key);
  return res.status(200).json({ ok: true });
}
