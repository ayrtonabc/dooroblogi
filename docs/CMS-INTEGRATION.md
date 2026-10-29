# Integración con el CMS (SEO Grow)

El sitio está preparado para que el contenido pase de `src/content/*.ts` (TypeScript en el
repo) a una API del CMS **sin reescribir las vistas**. Esta guía explica el contrato que hay
que respetar.

## Principio

Las vistas (`src/views/`) no saben de dónde viene el texto. Reciben un `locale` y leen de los
módulos de `src/content/`. Si esos módulos pasan a ser llamadas a una API con el mismo contrato
tipado, la web sigue funcionando igual.

## Qué hay que mover al CMS

| Objeto actual | Clave natural en el CMS | Notas |
|---|---|---|
| `company` | `site_settings` (singleton) | Teléfono, dirección, email, redes, texto legal |
| `products[]` | `products` (colección) | Traducible por idioma, con specs y galería |
| `pages.ts` → `home`, `about`, `gallery`, `quote`, `contact` | `pages` (colección por `key` + idioma) | Bloques de copy |
| `faq` | `faq` (colección) | Alimenta `<details>` y el schema `FAQPage` |
| `images.ts` | `media` (biblioteca) | El CMS devuelve URL pública o signed URL |
| `schema.ts` | — | Se queda en código: depende del modelo de datos, no del copy |

## Cambios necesarios en el código

### 1. `src/content/company.ts` → fetch

```ts
// src/content/company.ts
export async function getCompany(): Promise<Company> {
  const res = await fetch(`${import.meta.env.PUBLIC_CMS_URL}/settings`, {
    headers: { Authorization: `Bearer ${import.meta.env.CMS_TOKEN}` },
  });
  return res.json();
}
```

Como Astro es SSG, la llamada ocurre **en build**, no en cada visita. El sitio se regenera
cuando el CMS publica.

### 2. Vistas: de síncronas a asíncronas

Hoy las vistas hacen `const { locale } = Astro.props` y leen imports estáticos. Al pasar a API:

```astro
---
const company = await getCompany();
const products = await getProducts(locale);
---
```

Astro lo soporta: las páginas se renderizan en build y el resultado es HTML plano.

### 3. Rutas: de `getStaticPaths` a build dinámico

`src/pages/produkty/[slug].astro` ya usa `getStaticPaths()`. Con el CMS, la lista de productos
y sus slugs por idioma pasan a venir de la API:

```ts
export async function getStaticPaths() {
  const products = await getProducts('pl');
  return products.map((p) => ({ params: { slug: p.slug.pl }, props: { product: p } }));
}
```

Se necesita un trigger de build (webhook del CMS → rebuild). Es el punto a definir con el
equipo de SEO Grow.

### 4. Traducciones

El modelo actual ya separa por idioma (campo `slug`, `name`, `body` con clave `pl`/`en`/`de`).
En el CMS esto se mapea a **campo traducible por idioma** en una entrada, no a entradas
separadas. Es lo que permite mantener el `hreflang` coherente sin trabajo manual.

## Lo que NO hay que cambiar

- `src/i18n/` — rutas, slugs y `switchLocalePath` siguen igual.
- `src/layouts/BaseLayout.astro` — canonical, hreflang, OG y JSON-LD son dinámicos ya.
- `src/components/` — reciben props, no consultan el CMS.
- `src/styles/` — independiente del origen del contenido.

## Formulario de presupuesto

`src/components/QuoteForm.astro` tiene **dos modos**, y el que se usa depende de una sola
variable de entorno (`PUBLIC_QUOTE_ENDPOINT`, ver `.env.example`):

### Con endpoint — formulario web normal

Con la variable definida, el `<form>` es un formulario HTML convencional:

- `method="post"`
- `action` = la URL del endpoint
- `enctype="multipart/form-data"` (para que un manejador clásico también reciba el archivo)

El script hace lo mismo por `fetch` (JSON, con la cabecera `Accept: application/json`) y, si la
respuesta es 2xx, pinta el bloque de resultado en estado **`sent`**: título «Zapytanie wysłane» y
el texto de confirmación. Si la respuesta falla, no dice que se ha enviado: enseña el error y
ofrece WhatsApp y teléfono.

### Sin endpoint — `mailto:` honesto

Sin la variable, el `action` apunta a `mailto:` y el `enctype` es `text/plain` (el cuerpo lo
rellena el navegador). Al enviar se abre el programa de correo y el bloque queda en estado
**`prepared`**: dice que el mensaje está preparado pero que **falta pulsar «Enviar»**, y da las
dos salidas de emergencia (WhatsApp y teléfono). Nunca se muestra «wysłane» si el lead no ha
salido de verdad.

### Dos opciones de integración

1. **Endpoint propio** — definir `PUBLIC_QUOTE_ENDPOINT` en el `.env` (Formspree, Netlify Forms,
   Cloudflare Worker + Turnstile o una API propia).
2. **Mandar al CMS** — mismo mecanismo, el endpoint del CMS guarda el lead.

En ambos casos el resto del formulario no cambia: la validación y los textos ya están hechos
en los tres idiomas.

> OJO con el CORS: si el endpoint está en otro dominio, tiene que devolver
> `Access-Control-Allow-Origin` (y responder al `OPTIONS` previo), o el navegador bloqueará la
> respuesta y el formulario no verá el 200.

> OJO con los `id`: el `id="quote-form"` es **del `<form>`**, no de la sección que lo envuelve.
> Si se repite, `document.getElementById('quote-form')` devuelve la sección —que no tiene
> `data-endpoint`— y el formulario se cae siempre en la rama del `mailto:`. `check-html.cjs`
> avisa de los `id` repetidos.

### Contrato del payload (cambió con los dos embudos)

El formulario tiene **dos juegos de campos** (`src/content/funnel.ts` → `funnelFieldsA`,
`funnelFieldsB`):

- **Embudo A — panele sufitowe i ścienne**: se mide en m².
- **Embudo B — obłogi i lamele**: se mide en metros lineales.

La página decide cuál se muestra (`variant="A" | "B"`); en `/cennik/` y `/kontakt/`, donde la
página no sabe, el visitante elige con una pregunta y el script cambia el juego de campos.
**Solo se envía el juego activo**: los `name` del otro embudo **no aparecen** en el payload
(el script los recoge explícitamente, no con `FormData`).

Los `name` de los campos son el contrato con el endpoint y **no se tocan**:

**Campos comunes (siempre presentes en el payload, vacíos si no se rellenan)**

| `name` | Campo | Notas |
|---|---|---|
| `name` | Nombre y apellidos | Obligatorio |
| `email` | Email | Obligatorio, validado por formato |
| `company` | Empresa | Opcional |
| `taxId` | NIP | Opcional — el campo solo existe en `/dla-firm/` |
| `phone` | Teléfono | Opcional |
| `place` | Localidad de entrega | Opcional |
| `product` | Producto | `select` con los valores de `products.ts` |
| `message` | Medidas y uso | Opcional — los campos del embudo ya cubren lo esencial |
| `consent` | Casilla de consentimiento | Obligatorio; el script envía `consent: true` |
| `website` | Campo trampa (honeypot) | Vacío = bot |

**Embudo A — paneles**

| `name` | Campo | Notas |
|---|---|---|
| `surface` | Superficie aproximada (m²) | **Obligatorio en A** |
| `modules` | Número de módulos | Opcional |
| `room` | Pomieszczenie o uso | Opcional |

**Embudo B — obłogi y lamele**

| `name` | Campo | Notas |
|---|---|---|
| `length` | Longitud (mm) | **Obligatorio en B** |
| `section` | Sección (mm) | **Obligatorio en B** |
| `quantity` | Cantidad (mb) | **Obligatorio en B** |
| `profile` | Perfil | Opcional: `plain`, `tongue-groove`, `to-agree` |
| `selection` | Selección de madera | Opcional: `knot-free`, `with-knots` |
| `finish` | Acabado | Opcional: `natural`, `brushed`, `smoked` |

Los valores de los tres `select` son los de la oferta confirmada
(`src/content/definitions.ts` → `definitionFacts`): perfil «prosty / piętro-wpust / do
uzgodnienia», selección «bez sęków / z sękami», acabado «naturalne / szczotkowane / wędzone».
**Son valores de contrato**: si la oferta cambia, hay que cambiarlos en los dos sitios
(`funnelFieldsB[].options` y la definición).

**Metadatos que añade el script**

| `name` | Campo | Notas |
|---|---|---|
| `funnel` | `A` o `B` | Qué embudo envió el visitante |
| `context` | Contexto | `home`, `price-list`, `trade`, `contact`, `product:<id>` |
| `page` | Ruta de origen | `/cennik/`, `/produkty/oblog-debowy-ciety/`… |
| `locale` | Idioma | `pl`, `en`, `de` |

Lo que **sí** está localizado por idioma son las **etiquetas del cuerpo del correo** y del
WhatsApp (`Imię i nazwisko` / `Full name` / `Name`, etc.). Viven en `src/i18n/ui.ts`, claves
`form.body.*`. Si el CMS genera su propio cuerpo de correo, que use esas mismas etiquetas o
las suyas — pero las claves del payload, no.

### El `mailto:` (sin endpoint)

Cuando no hay `PUBLIC_QUOTE_ENDPOINT`, el script compone el mensaje en el idioma de la
página. La estructura es fija:

```
Zapytanie o wycenę — Doors Obłogi

[lead] Zakres zapytania: Obłogi i lamele · Źródło: price-list · Strona: /cennik/ · Język: pl
Długość (mm): 2500
Przekrój (mm): 40 x 20 mm
Ilość (mb): 20
Imię i nazwisko: Jan Kowalski
E-mail: jan@example.com
Zgoda na kontakt w sprawie tej wyceny: tak
```

La primera línea `[lead] …` permite atribuir la consulta, y **la línea de consentimiento es
obligatoria** (art. 7.1 RODO: hay que poder demostrar que el visitante dio su consentimiento).
Si el endpoint acaba guardando el lead, la misma línea debe viajar en el cuerpo del correo o
en un campo propio del lead — no basta con la casilla.

### Sin JavaScript

El `<form>` **no** lleva `novalidate` en el HTML: sin JS el navegador valida por su cuenta y
arma el `mailto:` con `method="post"` + `enctype="text/plain"`. El script del componente pone
`form.noValidate = true` al arrancar, para poder mostrar sus propios mensajes de error en el
idioma de la página. Si se sustituye el script, hay que mantener ese `noValidate = true` o los
mensajes propios dejarán de aparecer.

Sin JavaScript **se ven los dos juegos de campos** (la pregunta de embudo solo funciona con
script) y el navegador valida `name`, `email` y `consent`. Los campos obligatorios del embudo
(`surface`, `length`, `section`, `quantity`) los valida el script, que los marca con
`data-required`; el atributo `required` nativo solo se pone cuando la página muestra **un solo**
juego de campos, para que en el resto de casos el juego oculto no bloquee el envío.

## Requisitos de contenido en el CMS

Para que la web siga funcionando, el CMS debe poder devolver, por producto y por idioma:

- `slug` (URL-friendly, único por idioma)
- `name`, `summary`, `body` (array de párrafos)
- `image` + `gallery[]` con `alt`traducido
- `specs[]` (label + value, por idioma)
- `highlights[]` (title + text, por idioma)
- `seoTitle`, `seoDescription`, `keywords`

Si falta el `alt` traducido, la imagen se inserta con `alt` vacío y se pierde accesibilidad
y seo de imagen. Conviene que ese campo sea obligatorio en el CMS.

## Datos pendientes de confirmar con el cliente

1. `company.contactEmail` — ahora `kontakt@doors-oblogi.pl`. En Facebook solo hay teléfono.
2. Año de fundación — **estimado, no publicado**. Ya no está en `company.ts` ni en el JSON-LD
   (`foundingDate`). Cuando el cliente lo confirme, se añade y se devuelve `foundingDate` al
   `Organization` de `src/content/schema.ts`.
3. Código postal — **estimado, no publicado**. Ya no está en `company.ts` ni en el JSON-LD
   (`address.postalCode`). El cliente solo ha dado localidad (Słonecznik) y ciudad (Olsztyn).
   Cuando lo confirme, se añade a `postalAddress()` en `src/content/company.ts`.
4. Forma jurídica (`company.legalName`) — ahora es la marca comercial „Doors Obłogi” y
   **no se publica** en el JSON-LD. Al confirmar la forma (sp. z o.o., NIP), se añade
   `legalName` al `Organization`.
5. Horarios de contacto (8:00–16:00, L–V) — estimados.
6. Dominio definitivo: `https://doors-oblogi.pl` está en `astro.config.mjs` como `site`.
   Si el dominio final es otro, hay que cambiarlo ahí (afecta a canonical, sitemap y OG).
