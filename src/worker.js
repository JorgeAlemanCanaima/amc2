// Worker principal: sirve la página (carpeta public/) y las rutas dinámicas.
import * as catalog from "./catalog.js";
import * as upload from "./upload.js";
import * as login from "./login.js";
import * as fotos from "./fotos.js";
import { json } from "../lib/auth.js";

const routes = { "/api/catalog": catalog, "/api/upload": upload, "/api/login": login };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const ctx = { request, env, params: {} };

    const mod = routes[path];
    if (mod) {
      const fn = request.method === "GET" ? mod.onRequestGet : request.method === "POST" ? mod.onRequestPost : null;
      return fn ? fn(ctx) : json({ error: "Método no permitido" }, 405);
    }
    if (path.startsWith("/fotos/") && request.method === "GET") {
      ctx.params.name = path.slice("/fotos/".length);
      return fotos.onRequestGet(ctx);
    }
    if (path === "/admin") {
      return env.ASSETS.fetch(new Request(new URL("/", url), request));
    }
    return env.ASSETS.fetch(request);
  },
};
