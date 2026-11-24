# Catálogo de uñas en Cloudflare Pages

Página pública con los servicios, precios y fotos del salón, más un panel para editarlo desde el celular o la computadora. Los precios y las fotos se guardan en **Workers KV**, el almacenamiento gratuito de Cloudflare, así que puedes cambiar precios sin tocar código. Todo funciona dentro del plan gratuito y **no pide tarjeta**.

- Clientes: `https://tu-proyecto.pages.dev`
- Tú (para editar): `https://tu-proyecto.pages.dev/admin` y tu contraseña

## Qué hay en la carpeta

| Archivo | Para qué sirve |
| --- | --- |
| `public/index.html` | La página del catálogo y el panel de edición |
| `functions/api/catalog.js` | Lee y guarda el catálogo (guardar pide contraseña) |
| `functions/api/upload.js` | Guarda las fotos que subes (pide contraseña) |
| `functions/api/login.js` | Revisa la contraseña |
| `functions/fotos/[name].js` | Muestra las fotos guardadas |
| `lib/seed.js` | Catálogo inicial, se usa hasta que guardes por primera vez |

## Pasos para publicarlo (una sola vez)

1. **Sube esta carpeta a un repositorio de GitHub** (puede ser privado).
2. Crea una cuenta gratis en [dash.cloudflare.com](https://dash.cloudflare.com).
3. **Crea el almacenamiento:** en el menú, ve a **Storage & Databases → KV** (en algunas cuentas aparece como **Workers & Pages → KV**). Toca **Create**, nómbralo `catalogo` y créalo.
4. **Crea el sitio:** ve a **Workers & Pages → Create → Pages → Connect to Git**. Elige tu repositorio y usa esta configuración:
   - Framework preset: **None**
   - Build command: déjalo vacío
   - Build output directory: `public`

   Toca **Save and Deploy**.
5. **Conecta el almacenamiento:** abre el proyecto y ve a **Settings → Bindings → Add → KV namespace**. En *Variable name* escribe `CATALOGO`, en mayúsculas y exactamente así, y elige el KV `catalogo`. Guarda.
6. **Pon tu contraseña:** en **Settings → Variables and Secrets → Add**, elige tipo **Secret**:
   - Nombre: `ADMIN_PASSWORD`
   - Valor: la contraseña que usarás para editar (mínimo 10 caracteres, no la compartas)
7. Ve a **Deployments**, abre el último y toca **Retry deployment** para que tome el almacenamiento y la contraseña.
8. Abre `https://tu-proyecto.pages.dev/admin`, escribe tu contraseña y completa nombre, WhatsApp, dirección, moneda y fotos. Toca **Guardar y publicar**.

## Uso diario

- Entra a `/admin`, toca **Editar catálogo**, cambia lo que necesites y toca **Guardar y publicar**. Tú ves el cambio de inmediato. Tus clientes pueden tardar hasta un minuto en verlo, porque Cloudflare copia los datos a sus servidores de todo el mundo.
- **Descargar PDF** genera un catálogo A4 con lo que tenga la página en ese momento.
- Cada vez que guardas se hace una copia de respaldo que dura 60 días (claves `historial:` en el KV).

## Costo: gratis

El plan gratuito de Cloudflare permite uso comercial e incluye:

- **Pages:** sitio y ancho de banda sin límite, 500 publicaciones al mes.
- **Functions:** 100.000 visitas a la parte dinámica por día.
- **Workers KV:** 1 GB guardado, 100.000 lecturas y 1.000 escrituras por día.

Un catálogo con unas decenas de fotos (unos 150 KB cada una) usa una mínima parte. Si algún día se pasara un límite diario, Cloudflare **no cobra**: esa parte deja de responder hasta el día siguiente. Solo pagarías si tú mismo activas el plan de pago (Workers Paid).

## Dominio propio (opcional)

En el proyecto, ve a **Custom domains** para conectar un dominio como `tusalon.com` si ya lo compraste. El dominio sí se paga aparte. El sitio funciona perfectamente con la dirección gratuita `.pages.dev`.

## Probarlo en tu computadora (opcional)

Con Node.js instalado: crea un archivo `.dev.vars` con `ADMIN_PASSWORD=tu-clave` y ejecuta `npx wrangler pages dev public --kv CATALOGO`.
