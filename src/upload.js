import { isAdmin, json, needsKv } from "../lib/auth.js";

// Recibe una foto ya reducida en el navegador (JPEG en base64) y la guarda en KV.
export async function onRequestPost({ request, env }) {
  const missing = needsKv(env); if (missing) return missing;
  if (!(await isAdmin(request, env))) return json({ error: "Contraseña incorrecta" }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ error: "La foto debe enviarse como JPEG" }, 400); }
  const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec((body && body.dataUrl) || "");
  if (!m) return json({ error: "La foto debe enviarse como JPEG" }, 400);
  const bin = Uint8Array.from(atob(m[1]), (c) => c.charCodeAt(0));
  if (bin.length > 3 * 1024 * 1024) return json({ error: "La foto es demasiado grande" }, 413);
  const id = crypto.randomUUID();
  await env.CATALOGO.put("foto:" + id, bin);
  return json({ url: "/fotos/" + id + ".jpg" });
}
