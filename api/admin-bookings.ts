import { adminOnly, dbRequest, noStore, type ApiRequest, type ApiResponse } from "./_supabase";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  noStore(res);
  if (!adminOnly(req, res)) return;
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "method_not_allowed" });
  try {
    const rows = await dbRequest("bookings?select=id,customer_name,customer_phone,appointment_at,status,notes,created_at,services(name),barbers(name),haircut_styles(name)&order=appointment_at.desc&limit=100");
    return res.status(200).json(rows);
  } catch { return res.status(503).json({ ok: false, error: "admin_data_unavailable" }); }
}
