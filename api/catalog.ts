import { dbRequest } from "./_lib/supabase.js";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
export default async function handler(req: Request) {
  if (req.method !== "GET") return Response.json({ ok: false, error: "method_not_allowed" }, { status: 405, headers });
  try { const [services, barbers, haircuts] = await Promise.all([dbRequest("services?select=id,name,description,duration_minutes,price_cents,accent&active=eq.true&order=id&limit=50"), dbRequest("barbers?select=id,name,title,bio,image_url&active=eq.true&order=id&limit=50"), dbRequest("haircut_styles?select=id,name,description,image_url&active=eq.true&order=id&limit=100")]); return Response.json({ services, barbers, haircuts }, { headers }); } catch { return Response.json({ ok: false, error: "catalog_unavailable" }, { status: 503, headers }); }
}
