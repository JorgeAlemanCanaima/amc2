# Catálogo de uñas en Cloudflare

Página pública con los servicios, precios y fotos del salón, más un panel para editarlo desde el celular o la computadora. Los precios y las fotos se guardan en **Workers KV**, el almacenamiento gratuito de Cloudflare, así que puedes cambiar precios sin tocar código. Todo funciona dentro del plan gratuito y **no pide tarjeta**.

- Clientes: `https://amc2.<tu-subdominio>.workers.dev`
- Tú (para editar): `https://amc2.<tu-subdominio>.workers.dev/admin` y tu contraseña

## Qué hay en la carpeta

| Archivo | Para qué sirve |
| --- | --- |
| `public/index.html` | La página del catálogo y el panel de edición |
| `src/worker.js` | Recibe las visitas y reparte: página, `/admin`, `/api/...` y `/fotos/...` |
| `src/catalog.js` | Lee y guarda el catálogo (guardar pide contraseña) |
| `src/upload.js` | Guarda las fotos que subes (pide contraseña) |
| `src/login.js` | Revisa la contraseña |
| `src/fotos.js` | Muestra las fotos guardadas |
| `lib/seed.js` | Catálogo inicial, se usa hasta que guardes por primera vez |
| `wrangler.jsonc` | Configuración del Worker `amc2` y del almacenamiento KV `catalogo` |

## Cómo está publicado

El sitio corre como **Cloudflare Worker** llamado `amc2`, conectado al repositorio de GitHub. Cada vez que cambia la rama `main`, Cloudflare lo vuelve a publicar solo, con `npx wrangler deploy`.

Configuración única en Cloudflare (**Workers & Pages → amc2 → Settings**):

1. **Variables and Secrets → Add**, tipo **Secret**:
   - Nombre: `ADMIN_PASSWORD`
   - Valor: la contraseña para editar (mínimo 10 caracteres, no la compartas)
2. El almacenamiento KV `catalogo` ya está conectado desde `wrangler.jsonc`, no hay que hacer nada.
3. La dirección del sitio aparece en **Settings → Domains & Routes** (termina en `.workers.dev`).

## Uso diario

- Entra a `/admin`, toca **Editar catálogo**, cambia lo que necesites y toca **Guardar y publicar**. Tú ves el cambio de inmediato. Tus clientes pueden tardar hasta un minuto en verlo, porque Cloudflare copia los datos a sus servidores de todo el mundo.
- **Descargar PDF** genera un catálogo A4 con lo que tenga la página en ese momento.
- Cada vez que guardas se hace una copia de respaldo que dura 60 días (claves `historial:` en el KV).

## Costo: gratis

El plan gratuito de Cloudflare permite uso comercial e incluye:

- **Workers:** 100.000 visitas por día; los archivos de la página se sirven gratis y sin límite.
- **Workers KV:** 1 GB guardado, 100.000 lecturas y 1.000 escrituras por día.

Un catálogo con unas decenas de fotos (unos 150 KB cada una) usa una mínima parte. Si algún día se pasara un límite diario, Cloudflare **no cobra**: esa parte deja de responder hasta el día siguiente. Solo pagarías si tú mismo activas el plan de pago (Workers Paid).

## Dominio propio (opcional)

En el Worker, ve a **Settings → Domains & Routes** para conectar un dominio como `tusalon.com` si ya lo compraste. El dominio sí se paga aparte. El sitio funciona perfectamente con la dirección gratuita `.pages.dev`.

## Probarlo en tu computadora (opcional)

Con Node.js instalado: crea un archivo `.dev.vars` con `ADMIN_PASSWORD=tu-clave` y ejecuta `npx wrangler dev`.
