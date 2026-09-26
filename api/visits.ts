import { dbRequest } from "./_lib/supabase.js";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
export default async function handler(req: Request) {
  if (req.method !== "POST") return Response.json({ ok: false, error: "method_not_allowed" }, { status: 405, headers });
  try { const body = await req.json() as { path?: unknown }; const path = typeof body.path === "string" ? body.path.slice(0, 300) : ""; if (!path.startsWith("/")) return Response.json({ ok: false, error: "invalid_path" }, { status: 400, headers }); await dbRequest("visits", { method: "POST", body: JSON.stringify({ path }) }); return Response.json({ ok: true }, { status: 201, headers }); } catch { return Response.json({ ok: false }, { status: 503, headers }); }
}
