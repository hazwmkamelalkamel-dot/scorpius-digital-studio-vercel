import { dbRequest, noStore, parseBody, type ApiRequest, type ApiResponse } from "./_supabase";

type BookingInput = { customer_name?: unknown; customer_phone?: unknown; service_id?: unknown; barber_id?: unknown; haircut_style_id?: unknown; appointment_at?: unknown; notes?: unknown };
const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const id = (value: unknown) => Number.isInteger(Number(value)) && Number(value) > 0 ? Number(value) : null;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  noStore(res);
  try {
    if (req.method === "GET") {
      const url = new URL(req.url || "/", "http://localhost"); const barber = id(url.searchParams.get("barber_id")); const from = url.searchParams.get("from"); const to = url.searchParams.get("to");
      if (!barber || !from || !to) return res.status(400).json({ ok: false, error: "invalid_range" });
      const query = `bookings?select=appointment_at&barber_id=eq.${barber}&appointment_at=gte.${encodeURIComponent(from)}&appointment_at=lt.${encodeURIComponent(to)}&status=not.eq.cancelled&order=appointment_at&limit=200`;
      return res.status(200).json(await dbRequest(query));
    }
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });
    const body = parseBody<BookingInput>(req); const customer_name = text(body.customer_name, 120); const customer_phone = text(body.customer_phone, 25); const service_id = id(body.service_id); const barber_id = id(body.barber_id); const haircut_style_id = id(body.haircut_style_id); const appointment_at = text(body.appointment_at, 50); const notes = text(body.notes, 1000) || null;
    if (customer_name.length < 2 || !/^[0-9+ ()-]{7,25}$/.test(customer_phone) || !service_id || !barber_id || !haircut_style_id || !appointment_at || Number.isNaN(Date.parse(appointment_at))) return res.status(400).json({ ok: false, error: "invalid_booking" });
    const rows = await dbRequest("bookings", { method: "POST", body: JSON.stringify({ customer_name, customer_phone, service_id, barber_id, haircut_style_id, appointment_at: new Date(appointment_at).toISOString(), notes, status: "pending" }) });
    return res.status(201).json({ ok: true, booking: rows });
  } catch (error) {
    if (error instanceof Error && error.message.includes("409")) return res.status(409).json({ ok: false, error: "slot_unavailable" });
    return res.status(503).json({ ok: false, error: "booking_unavailable" });
  }
}
