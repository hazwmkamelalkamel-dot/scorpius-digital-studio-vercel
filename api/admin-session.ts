import { createHmac, timingSafeEqual } from "node:crypto";
function verifyAdminCookie(cookie: string | undefined) { const token = cookie?.split(";").map((v) => v.trim()).find((v) => v.startsWith("scorpius_admin="))?.slice(15); if (!token) return false; const [body, signature] = token.split("."); const expected = body && process.env.ADMIN_SESSION_SECRET ? createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(body).digest("base64url") : ""; const a = Buffer.from(signature || ""); const b = Buffer.from(expected); return Boolean(body && signature && a.length === b.length && timingSafeEqual(a, b) && body.startsWith("admin|") && Number(body.split("|")[1]) > Date.now()); }
export default function handler(req: Request) {
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  if (req.method !== "GET") return Response.json({ ok: false, error: "method_not_allowed" }, { status: 405, headers });
  const requestHeaders = req.headers as Headers & { cookie?: string };
  const cookie = typeof requestHeaders.get === "function" ? requestHeaders.get("cookie") : requestHeaders.cookie;
  return Response.json({ ok: verifyAdminCookie(cookie || undefined) }, { headers });
}
