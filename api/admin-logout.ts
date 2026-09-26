import type { IncomingMessage, ServerResponse } from "node:http";
type Request = IncomingMessage & { method?: string };
type Response = ServerResponse & { status: (code: number) => Response; json: (payload: unknown) => void };
export default function handler(req: Request, res: Response) { res.setHeader("Cache-Control", "no-store"); if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method_not_allowed" }); res.setHeader("Set-Cookie", "scorpius_admin=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict"); return res.status(200).json({ ok: true }); }
