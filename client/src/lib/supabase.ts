const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

type Row = Record<string, unknown>;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!supabaseConfigured) throw new Error("قاعدة البيانات غير مهيأة بعد");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
  });
  if (!response.ok) throw new Error("تعذر الاتصال بقاعدة البيانات");
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type PublicReview = { id: string; name: string; role: string; quote: string; rating: number; created_at: string };
export async function getApprovedReviews() {
  return request<PublicReview[]>("reviews?select=id,name,role,quote,rating,created_at&status=eq.approved&order=created_at.desc&limit=30");
}
export async function submitReview(input: { name: string; role: string; quote: string; rating: number }) {
  return request<PublicReview[]>("reviews", { method: "POST", body: JSON.stringify({ ...input, status: "pending" }) });
}
export async function trackVisit(path: string) {
  try { await request<Row[]>("visits", { method: "POST", body: JSON.stringify({ path: path.slice(0, 300) }) }); } catch { /* analytics must never block the page */ }
}
export type NabdaService = { id: number; name: string; description: string; duration_minutes: number; price_cents: number; accent: string };
export type NabdaBarber = { id: number; name: string; title: string; bio: string; image_url: string | null };
export type NabdaHaircut = { id: number; name: string; description: string; image_url: string | null };
export async function getNabdaCatalog() {
  const [services, barbers, haircuts] = await Promise.all([
    request<NabdaService[]>("services?select=id,name,description,duration_minutes,price_cents,accent&active=eq.true&order=id"),
    request<NabdaBarber[]>("barbers?select=id,name,title,bio,image_url&active=eq.true&order=id"),
    request<NabdaHaircut[]>("haircut_styles?select=id,name,description,image_url&active=eq.true&order=id"),
  ]);
  return { services, barbers, haircuts };
}
export async function createBooking(input: { customer_name: string; customer_phone: string; service_id: number; barber_id: number; haircut_style_id: number; appointment_at: string; notes?: string }) {
  return request<Row[]>("bookings", { method: "POST", body: JSON.stringify({ ...input, status: "pending" }) });
}
export async function getBookedSlots(from: string, to: string, barberId: number) {
  return request<Array<{ appointment_at: string }>>(`bookings?select=appointment_at&barber_id=eq.${barberId}&appointment_at=gte.${encodeURIComponent(from)}&appointment_at=lt.${encodeURIComponent(to)}&status=not.eq.cancelled`);
}
