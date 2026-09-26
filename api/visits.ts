import { dbRequest, noStore, parseBody, type ApiRequest, type ApiResponse } from "./_supabase";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  noStore(res);
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" });
  try {
    const body = parseBody<{ path?: unknown }>(req);
    const path = typeof body.path === "string" ? body.path.slice(0, 300) : "";
    if (!path || !path.startsWith("/")) return res.status(400).json({ ok: false, error: "invalid_path" });
    await dbRequest("visits", { method: "POST", body: JSON.stringify({ path }) });
    return res.status(201).json({ ok: true });
  } catch { return res.status(204).json({ ok: false }); }
}
