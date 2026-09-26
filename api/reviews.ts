import { dbRequest, noStore, parseBody, type ApiRequest, type ApiResponse } from "./_lib/supabase.js";

type ReviewInput = { name?: unknown; role?: unknown; quote?: unknown; rating?: unknown };
const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  noStore(res);
  try {
    if (req.method === "GET") {
      const rows = await dbRequest("reviews?select=id,name,role,quote,rating,created_at&status=eq.approved&order=created_at.desc&limit=30");
      return res.status(200).json(rows);
    }
    if (req.method === "POST") {
      const body = parseBody<ReviewInput>(req);
      const name = text(body.name, 120); const role = text(body.role, 120) || "عميل SCORPIUS"; const quote = text(body.quote, 1200); const rating = Number(body.rating);
      if (name.length < 2 || quote.length < 8 || !Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ ok: false, error: "invalid_review" });
      const rows = await dbRequest("reviews", { method: "POST", body: JSON.stringify({ name, role, quote, rating, status: "pending" }) });
      return res.status(201).json({ ok: true, review: rows });
    }
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  } catch { return res.status(503).json({ ok: false, error: "reviews_unavailable" }); }
}
