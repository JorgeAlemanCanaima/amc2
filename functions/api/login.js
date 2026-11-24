import { isAdmin, json } from "../../lib/auth.js";

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD) return json({ error: "Falta configurar ADMIN_PASSWORD en Cloudflare" }, 500);
  return (await isAdmin(request, env)) ? json({ ok: true }) : json({ error: "Contraseña incorrecta" }, 401);
}
