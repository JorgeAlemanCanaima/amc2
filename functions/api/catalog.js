import seed from "../../lib/seed.js";
import { isAdmin, json, needsKv } from "../../lib/auth.js";

const KEY = "catalogo";
const HISTORY_DAYS = 60; // copias anteriores que se guardan por si hay que volver atrás

function clean(data) {
  if (!data || typeof data !== "object" || !data.salon || !Array.isArray(data.services)) return null;
  const str = (v, n) => String(v ?? "").slice(0, n);
  const photo = (p) => (typeof p === "string" && /^\/fotos\/[a-z0-9-]{8,64}\.jpg$/.test(p) ? p : null);
  return {
    version: 1,
    updatedAt: Date.now(),
    salon: Object.fromEntries(["name", "tagline", "phone", "address", "hours", "currency", "note"].map((k) => [k, str(data.salon[k], 400)])),
    categories: (Array.isArray(data.categories) ? data.categories : []).slice(0, 40).map((c) => str(c, 60)).filter(Boolean),
    services: data.services.slice(0, 200).map((s) => ({
      id: str(s.id, 40) || "s" + Math.random().toString(36).slice(2, 9),
      name: str(s.name, 120),
      category: str(s.category, 60),
      price: str(s.price, 30),
      from: !!s.from,
      duration: str(s.duration, 20),
      description: str(s.description, 800),
      tone: /^#[0-9a-f]{6}$/i.test(s.tone || "") ? s.tone : "#c58fb3",
      photo: photo(s.photo),
      example: false,
    })),
  };
}

export async function onRequestGet({ env }) {
  const missing = needsKv(env); if (missing) return missing;
  const data = await env.CATALOGO.get(KEY, { type: "json" });
  return json(data || seed);
}

export async function onRequestPost({ request, env }) {
  const missing = needsKv(env); if (missing) return missing;
  if (!(await isAdmin(request, env))) return json({ error: "Contraseña incorrecta" }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Datos del catálogo incompletos" }, 400); }
  const data = clean(body);
  if (!data) return json({ error: "Datos del catálogo incompletos" }, 400);
  const text = JSON.stringify(data);
  await env.CATALOGO.put(KEY, text);
  await env.CATALOGO.put("historial:" + data.updatedAt, text, { expirationTtl: HISTORY_DAYS * 86400 });
  return json(data);
}
