// Sirve las fotos guardadas en KV: /fotos/<id>.jpg
export async function onRequestGet({ params, env }) {
  const m = /^([a-z0-9-]{8,64})\.jpg$/.exec(params.name || "");
  if (!m || !env.CATALOGO) return new Response("No encontrada", { status: 404 });
  const data = await env.CATALOGO.get("foto:" + m[1], { type: "arrayBuffer" });
  if (!data) return new Response("No encontrada", { status: 404 });
  return new Response(data, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" } });
}
