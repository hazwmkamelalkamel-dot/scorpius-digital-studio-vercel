import { dbRequest } from "./_lib/supabase.js";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const text = (v: unknown, max: number) => typeof v === "string" ? v.trim().slice(0, max) : ""; const id = (v: unknown) => Number.isInteger(Number(v)) && Number(v) > 0 ? Number(v) : null;
export default async function handler(req: Request) {
  try {
    const url = new URL(req.url);
    if (req.method === "GET") { const barber = id(url.searchParams.get("barber_id")); const from = url.searchParams.get("from"); const to = url.searchParams.get("to"); if (!barber || !from || !to) return Response.json({ ok: false, error: "invalid_range" }, { status: 400, headers }); return Response.json(await dbRequest(`bookings?select=appointment_at&barber_id=eq.${barber}&appointment_at=gte.${encodeURIComponent(from)}&appointment_at=lt.${encodeURIComponent(to)}&status=not.eq.cancelled&order=appointment_at&limit=200`), { headers }); }
    if (req.method !== "POST") return Response.json({ ok: false, error: "method_not_allowed" }, { status: 405, headers });
    const body = await req.json() as Record<string, unknown>; const customer_name = text(body.customer_name, 120); const customer_phone = text(body.customer_phone, 25); const service_id = id(body.service_id); const barber_id = id(body.barber_id); const haircut_style_id = id(body.haircut_style_id); const appointment_at = text(body.appointment_at, 50); const notes = text(body.notes, 1000) || null;
    if (customer_name.length < 2 || !/^[0-9+ ()-]{7,25}$/.test(customer_phone) || !service_id || !barber_id || !haircut_style_id || !appointment_at || Number.isNaN(Date.parse(appointment_at))) return Response.json({ ok: false, error: "invalid_booking" }, { status: 400, headers });
    return Response.json({ ok: true, booking: await dbRequest("bookings", { method: "POST", body: JSON.stringify({ customer_name, customer_phone, service_id, barber_id, haircut_style_id, appointment_at: new Date(appointment_at).toISOString(), notes, status: "pending" }) }) }, { status: 201, headers });
  } catch (e) { return Response.json({ ok: false, error: e instanceof Error && e.message.includes("409") ? "slot_unavailable" : "booking_unavailable" }, { status: e instanceof Error && e.message.includes("409") ? 409 : 503, headers }); }
}
