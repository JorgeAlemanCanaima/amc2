// Utilidades compartidas por las funciones de /api.
const enc = new TextEncoder();

export async function isAdmin(request, env) {
  const expected = env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const given = request.headers.get("x-admin-password") || "";
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(given)),
    crypto.subtle.digest("SHA-256", enc.encode(expected)),
  ]);
  return crypto.subtle.timingSafeEqual(a, b);
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export function needsKv(env) {
  return env.CATALOGO ? null : json({ error: "Falta conectar el espacio KV llamado CATALOGO al proyecto en Cloudflare." }, 500);
}
