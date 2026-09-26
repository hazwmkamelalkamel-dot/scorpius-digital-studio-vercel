import { verifyAdminCookie } from "./admin-login.js";
export default function handler(req: Request) {
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  if (req.method !== "GET") return Response.json({ ok: false, error: "method_not_allowed" }, { status: 405, headers });
  return Response.json({ ok: verifyAdminCookie(req.headers.get("cookie") || undefined) }, { headers });
}
