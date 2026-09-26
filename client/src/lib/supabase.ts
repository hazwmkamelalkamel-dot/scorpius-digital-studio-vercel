const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export type PublicReview = { id: string; name: string; role: string; quote: string; rating: number; created_at: string };
async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/${path}`, { ...init, credentials: "include", headers: { "Content-Type": "application/json", ...(init.headers || {}) } });
  if (!response.ok) throw new Error("تعذر تنفيذ الطلب");
  return response.json() as Promise<T>;
}
export async function getApprovedReviews() { return api<PublicReview[]>("reviews"); }
export async function submitReview(input: { name: string; role: string; quote: string; rating: number }) { return api<{ ok: boolean }>("reviews", { method: "POST", body: JSON.stringify(input) }); }
export async function trackVisit(path: string) { try { await api<{ ok: boolean }>("visits", { method: "POST", body: JSON.stringify({ path: path.slice(0, 300) }) }); } catch { /* analytics must never block the page */ } }
export type NabdaService = { id: number; name: string; description: string; duration_minutes: number; price_cents: number; accent: string };
export type NabdaBarber = { id: number; name: string; title: string; bio: string; image_url: string | null };
export type NabdaHaircut = { id: number; name: string; description: string; image_url: string | null };
export async function getNabdaCatalog() { return api<{ services: NabdaService[]; barbers: NabdaBarber[]; haircuts: NabdaHaircut[] }>("catalog"); }
export async function createBooking(input: { customer_name: string; customer_phone: string; service_id: number; barber_id: number; haircut_style_id: number; appointment_at: string; notes?: string }) { return api<{ ok: boolean }>("bookings", { method: "POST", body: JSON.stringify(input) }); }
export async function getBookedSlots(from: string, to: string, barberId: number) { return api<Array<{ appointment_at: string }>>(`bookings?barber_id=${barberId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`); }
