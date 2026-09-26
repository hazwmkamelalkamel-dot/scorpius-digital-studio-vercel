import type { IncomingMessage } from "node:http";

export type ApiRequest = IncomingMessage & { body?: unknown; method?: string };
export type ApiResponse = { status: (code: number) => ApiResponse; json: (payload: unknown) => void; setHeader: (name: string, value: string) => void };
export type DbRow = Record<string, unknown>;

const url = () => process.env.VITE_SUPABASE_URL;
const serviceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function dbRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = url();
  const key = serviceKey();
  if (!base || !key) throw new Error("database_not_configured");
  const response = await fetch(`${base}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation", ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`database_${response.status}`);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function parseBody<T>(req: ApiRequest): T {
  if (typeof req.body === "string") return JSON.parse(req.body) as T;
  return (req.body || {}) as T;
}

export function adminOnly(req: ApiRequest, res: ApiResponse): boolean {
  const cookie = req.headers.cookie;
  const token = cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith("scorpius_admin="))?.slice("scorpius_admin=".length);
  if (!token) { res.status(401).json({ ok: false, error: "unauthorized" }); return false; }
  const [body, signature] = token.split(".");
  const expected = body && process.env.ADMIN_SESSION_SECRET ? createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(body).digest("base64url") : "";
  const signatureBuffer = Buffer.from(signature || ""); const expectedBuffer = Buffer.from(expected); const valid = Boolean(body && signature && expected && signatureBuffer.length === expectedBuffer.length && timingSafeEqual(signatureBuffer, expectedBuffer) && body.startsWith("admin|") && Number(body.split("|")[1]) > Date.now());
  if (!valid) { res.status(401).json({ ok: false, error: "unauthorized" }); return false; }
  return true;
}

import { createHmac, timingSafeEqual } from "node:crypto";

export function noStore(res: ApiResponse) { res.setHeader("Cache-Control", "no-store"); res.setHeader("X-Content-Type-Options", "nosniff"); }
