import { dbRequest, noStore, type ApiRequest, type ApiResponse } from "./_lib/supabase.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  noStore(res);
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "method_not_allowed" });
  try {
    const [services, barbers, haircuts] = await Promise.all([
      dbRequest("services?select=id,name,description,duration_minutes,price_cents,accent&active=eq.true&order=id&limit=50"),
      dbRequest("barbers?select=id,name,title,bio,image_url&active=eq.true&order=id&limit=50"),
      dbRequest("haircut_styles?select=id,name,description,image_url&active=eq.true&order=id&limit=100"),
    ]);
    return res.status(200).json({ services, barbers, haircuts });
  } catch { return res.status(503).json({ ok: false, error: "catalog_unavailable" }); }
}
