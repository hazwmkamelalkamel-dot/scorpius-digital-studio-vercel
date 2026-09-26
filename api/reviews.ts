import { dbRequest } from "./_lib/supabase.js";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const text = (v: unknown, max: number) => typeof v === "string" ? v.trim().slice(0, max) : "";
export default async function handler(req: Request) {
  try {
    if (req.method === "GET") return Response.json(await dbRequest("reviews?select=id,name,role,quote,rating,created_at&status=eq.approved&order=created_at.desc&limit=30"), { headers });
    if (req.method !== "POST") return Response.json({ ok: false, error: "method_not_allowed" }, { status: 405, headers });
    const body = await req.json() as Record<string, unknown>; const name = text(body.name, 120); const role = text(body.role, 120) || "عميل SCORPIUS"; const quote = text(body.quote, 1200); const rating = Number(body.rating);
    if (name.length < 2 || quote.length < 8 || !Number.isInteger(rating) || rating < 1 || rating > 5) return Response.json({ ok: false, error: "invalid_review" }, { status: 400, headers });
    return Response.json({ ok: true, review: await dbRequest("reviews", { method: "POST", body: JSON.stringify({ name, role, quote, rating, status: "pending" }) }) }, { status: 201, headers });
  } catch { return Response.json({ ok: false, error: "reviews_unavailable" }, { status: 503, headers }); }
}
