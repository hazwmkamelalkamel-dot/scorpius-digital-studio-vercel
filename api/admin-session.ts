import type { IncomingMessage, ServerResponse } from "node:http";
import { verifyAdminCookie } from "./admin-login";
type Request = IncomingMessage & { method?: string };
type Response = ServerResponse & { status: (code: number) => Response; json: (payload: unknown) => void };
export default function handler(req: Request, res: Response) { res.setHeader("Cache-Control", "no-store"); if (req.method !== "GET") return res.status(405).json({ ok: false, error: "method_not_allowed" }); return res.status(200).json({ ok: verifyAdminCookie(req.headers.cookie) }); }
