# Informe — Agente programador, 2ª ronda

> ## Nota de estado
>
> Los dos P0 de la auditoría (`docs/agent-reports/03-audit.md`) fueron **corregidos por el agente principal antes de esta ronda**:
> el script del menú móvil (`src/components/Header.astro`, `is:inline` en JavaScript plano) y el contraste del formulario dentro
> de la tarjeta clara en sección oscura (`src/styles/global.css`, bloque `.section--dark .card`).
>
> **Esta ronda NO los ha revertido ni "mejorado".** Lo único que se ha tocado en `global.css` ha sido el token
> `--accent-strong`, la regla `::selection` y una regla nueva para el checkbox de consentimiento inválido.
>
> **La verificación final (`npm run build` + `npm run verify` sobre `dist/`) la ejecuta el agente principal.**
> Las cifras de esta segunda parte del informe son de la build de las 19:56 del 21/10/2026, con 40 páginas y 0 problemas.

---

**Proyecto:** `C:\Users\Ayrton\Desktop\doorso` · Doors Obłogi · Astro 7 (SSG)
**Fecha:** 2026-10-21 · **Alcance:** P1-3…P1-7, P2-8…P2-24, P2-15, P2-16 + andamiaje de verificación
**Estado final:** `npm run build` → 40 páginas, **0 errores / 0 avisos** · `npm run verify` → **0 problemas** (exit 0)

---

## 1. Cambios aplicados, por hallazgo

### P1-3 — el consentimiento nunca se limpia
- `src/components/QuoteForm.astro:193` — `<div class="consent">` → `<div class="consent" data-field="consent">`. Con esto el listener de `input` (`target.closest('[data-field]')`, L372) ya encuentra el campo: el mensaje de error se borra al marcar la casilla, el contenedor recibe `data-invalid="true"/"false"` y entra en la misma rama de validación que el resto.
- `src/components/QuoteForm.astro:250-257` — `focusFirstInvalid()` nuevo: antes `form.querySelector('[data-invalid="true"] .field__control')?.focus()` no alcanzaba el checkbox (no es `.field__control`). Ahora busca `.field__control, input, textarea, select` dentro del contenedor inválido.
- `src/styles/global.css:1366-1373` — `.consent[data-invalid='true'] input { outline: 2px solid #a63a2a }` (misma convención que `.field__control`).

### P1-4 — `alt` malformado en el hero
**Opción elegida: (a) `alt=""` con valor explícito → imagen decorativa.**
*Motivo:* el hero es una **capa de fondo** (`.hero__media` = `position:absolute; inset:0; z-index:-2` bajo un degradado), sin pie de foto y sin contenido informativo propio: el `h1` y el `hero__lead` ya dicen qué es y qué hacen. Según WCAG 1.1.1 es decorativa → `alt=""`, no texto alternativo inventado.

*Por qué salía `alt` desnudo:* **no es un bug de `<Image>`** — es el runtime de Astro. `astro/dist/runtime/server/render/util.js` (`addAttribute`) tiene: *"Other attributes with an empty string value can omit rendering the value"* → convierte `alt=""` en `alt` sin valor. El compilador emite `$$addAttribute(alt, "alt")` y el runtime lo colapsa. Por eso **toda** cadena vacía pasa a atributo booleano.
- `src/views/HomeView.astro:1` (importa `getImage`), `:24-32` (`heroImage = await getImage({...})`), `:74-84` (render manual de `<img alt="">`).
- `dist/index.html` → `<img src="/_astro/hero-oblog-debowy.B7cKEAmI_Z200WCh.webp" alt="" width="960" height="720" loading="eager" fetchpriority="high" decoding="async">`. La URL es idéntica a la del `<link rel=preload as=image>`, sin descarga doble.
- Efecto colateral: quité `sizes="100vw"`, que era inútil sin `srcset` (la imagen no tiene candidatas alternativas).

### P1-5 / P2-17 — subsets de fuente
- **Nuevo** `src/styles/fonts.css` — 4 declaraciones `@font-face` copiadas literalmente de los `index.css` de fontsource (mismos `unicode-range`, mismos woff2), referenciando el paquete por ruta de paquete: `url('@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')`. Vite resuelve ese especificador y hashea el fichero (verificado en el CSS emitido).
- `src/layouts/BaseLayout.astro:2-8` — fuera `import '@fontsource-variable/newsreader' | '@fontsource-variable/manrope'`; entra `import '../styles/fonts.css'`.
- `src/layouts/BaseLayout.astro:44-50` — se precargan **los 4** woff2 (latin + latin-ext de los dos krojos), no solo `latin`.

*Confirmación del diagnóstico del auditor:* los diacríticos polacos ą ę ć ł ń ś ź ż = U+0105, U+0119, U+0107, U+0142, U+0144, U+015B, U+017A, U+017C → **Latin Extended-A (U+0100–U+017F)**, que el subset `latin` (U+0000–U+00FF) **no** cubre. Covered por `latin-ext` (U+0100-02BA). Correcto.

**Resultado en `dist/_astro/`: 9 ficheros → 4 ficheros.**
| antes | ahora |
|---|---|
| manrope-cyrillic 14,2 · cyrillic-ext 2,5 · greek 9,2 · vietnamese 8,3 · latin 24,3 · latin-ext 14,8 · newsreader-latin 56,7 · latin-ext 35,4 · vietnamese 11,7 = **189 kB** | manrope-latin 24,3 · manrope-latin-ext 14,8 · newsreader-latin 56,7 · newsreader-latin-ext 35,4 = **131,1 kB** |

−45,9 kB de ficheros que nadie descarga, y los 50,2 kB que antes se descubrían tarde ahora se precargan.

### P1-6 — AI slop en el hero
`src/content/pages.ts:26-30` (`home.hero.lead`):
- **PL:** "Dębowe listwy wykończeniowe, lamele oraz gotowe panele sufitowe i ścienne. **100% naturalny dąb, dwie selekcje — bez sęków i z sękami. Cięcie na wymiar, wysyłka kurierem w całej Polsce, produkcja w Słoneczniku.**"
- **EN:** "…**100% natural oak, two selections — knot-free and knotty. Cut to size, courier delivery within Poland, produced in Słonecznik.**"
- **DE:** "…**100 % natürliche Eiche, zwei Selektionen — ohne Äste und mit Ästen. Auf Maß geschnitten, Versand per Kurier innerhalb Polens, Fertigung in Słonecznik.**"

Sólo hechos comprobables, sin adjetivos. **Repasé el resto del copy**: `grep -i` de slop (pasión/precisión/kompromis/years of experience/maßgeschneidert/leidenschaft/…) sobre `src/` → **0 coincidencias** (antes: 1, la del hero).

### P1-7 / P2-23 — datos no confirmados publicados
- `src/content/company.ts` — **fuera** `founded: '2021'` y `postalCode: '10-511'`; `legalName` se queda en el objeto pero **sin publicar**, con `TODO` explícito. Bloque de comentario nuevo en la cabecera (L9-17) con las tres preguntas abiertas al cliente.
- `src/content/company.ts:100-108` — `postalAddress()` ya no emite `postalCode`; comentario con el motivo ("zmyślony kod pocztowy to fałszywy sygnał lokalny").
- `src/content/schema.ts:130-133` — fuera `legalName` y `foundingDate` del `Organization` (que salía en las 40 páginas). Comentario que lo explica.
- Verificado en `dist/index.html`: el JSON-LD ya **no** contiene `foundingDate`, `legalName` ni `address.postalCode`. `npm run verify` sigue dando 0 problemas → el checker no dependía de esos campos.

### P2-8 — `knowsAbout` anidado
`src/content/schema.ts:144-149` — de `knowsAbout: [ … ]` (array dentro de array → `[["Obłogi dębowe",…]]`) a array plano de cadenas. En `dist/index.html`: `"knowsAbout":["Obłogi dębowe","Lamele dębowe","Panele sufitowe z dębu","Dąb wędzony","Boazeria dębowa"]`.

### P2-9 — salto h1 → h3 en 6 páginas
- `src/components/ProductCard.astro:14-22,36` — prop nueva `level?: 2 | 3` (por defecto 3) y `<Heading>` dinámico. El catálogo pasa los kafles a `h2`.
- `src/views/CatalogView.astro:80` — `<ProductCard … level={2} />`.
- `src/views/TradeView.astro:88` — `<h3 class="highlight__title">` → `<h2 class="highlight__title">` (los 3 ítems de `trade.items` en la sección crema).
- **Medido en Chrome (CDP) sobre `/`, `/cennik/`, `/produkty/oblog-debowy-ciety/`, `/de/produkte/`, `/produkty/`, `/dla-firm/`:** 1 `h1` por página y **0 saltos** de jerarquía. Antes saltaban en las 6 páginas listadas.

### P2-10 — contraste del kicker sobre arena
`src/styles/global.css:55-58` — `--accent-strong: #7d5c34` → **`#7a5932`**, un stopień más oscuro, mismo tono.
| par | antes | ahora |
|---|---|---|
| `--accent-strong` sobre `--sand` (`.section--sand .kicker`) | **4,48:1** ❌ | **4,68:1** ✅ |
| `--accent-strong` sobre `--paper` | 5,74:1 | **6,00:1** |
| `--accent-strong` sobre `--cream` | 5,36:1 | **5,60:1** |
| `.btn:hover` (papier sobre `--accent-strong`) | 5,74:1 | **6,00:1** |

La paleta no se rompe: el mismo marrón, un punto más oscuro, y **todas** las demás parejas suben.

### P2-11 — 41 literales en templates → i18n
`locale === 'pl' ? … : …` en `src/**/*.astro`: **41 → 0**.

- `src/i18n/ui.ts` — **reescrito**: 120 claves `pl/en/de` (antes ~35), agrupadas por sección (nav, cta, form, contact, catalog, product, about, home, delivery, trade, gallery, footer, wa, seo). Añadido `tf(locale, key, vars)` para placeholders (`{name}`).
- `src/content/pages.ts` — **nuevo** export `media` (L~700): 9 claves de `alt`/`figcaption` de home y o-nas, que son contenido, no interfaz.
- Plantillas tocadas: `ProductView` (18), `AboutView` (13), `CatalogView` (11), `QuoteView` (5), `DeliveryView` (5), `ContactView` (2), `Footer` (5), `Header` (2), `ContactLinks` (2), `GalleryView` (5), `PrivacyView` (1), `TradeView` (7), `QuoteForm` (2), `TermsTable` (1), `HomeView` (6).
- Reutilizado en vez de duplicado: `trade.kicker[locale]` en el catálogo, `contact.contactBlock.hours[locale]` en QuoteView.

### P2-12 — `brandTag` muerto
Eliminado de `src/components/Header.astro` y `src/components/Footer.astro` (el auditor también lo tenía en los dos; el brief sólo mencionaba Header). `grep brandTag src/` → **0**. **El script `is:inline` del header no se ha tocado.**

### P2-13 — typo alemán
`src/content/products.ts:110` y `src/views/GalleryView.astro:79`: "Astdmuster" → **"Astmuster"** (2×). `grep Astdmuster dist/` → 0.

### P2-14 — `public/images/logo.webp` sin referencias
**Decisión, no bug.** No lo he tocado ni movido: 242.422 bytes, mtime 16:23 (anterior a mi sesión). Es el master del cliente y `AGENTS.md` regla 10 ya lo documenta como intocable; la interfaz usa `logo-web.webp` (40.006 B). Son 237 kB de **despliegue**, no de carga de página (0 referencias en los 50 HTML → 0 peticiones). **No lo he "optimizado"**: cualquier cambio al master está prohibido por la regla del proyecto.

### P2-15 — `lastmod` del sitemap
- **Nuevo** `_tools/lastmod.mjs` — `createLastmod(groups)`: para cada grupo de `src/content/routes-map.json` calcula el `mtime` máximo de los ficheros que alimentan esa ruta (compartidos: `company.ts`, `ui.ts`, `i18n/index.ts`; + los específicos del grupo) y devuelve `YYYY-MM-DD`. Si el número de grupos no coincide con la tabla → **error de build**, no omisión silenciosa.
- `astro.config.mjs:5,20,69-72` — `lastmod: lastmodByPath.get(path) ?? new Date().toISOString().slice(0,10)` en vez del timestamp de build.

**Prueba controlada** (mtimes alterados a propósito, luego restaurados): con `products/pricing/technical` a 2026-09-25 y el resto a 2026-09-20 → las 4 páginas de producto + catálogo + cennik salieron **2026-09-25**, las demás **2026-09-20**. La diferenciación per ruta funciona; hoy las 39 salen 2026-10-21 porque he editado todos los ficheros de contenido hoy.
*Limitación conocida y documentada en el código:* las secciones que viven en `src/content/pages.ts` comparten fecha. Para separarlas hay que partir `pages.ts` en un fichero por sección.

### P2-16 — `check-assets.cjs` pasa en falso
`_tools/check-assets.cjs:41` → `de/produkte/eichen-abschlussleiste-auf-mass/index.html` (ficha real, antes el stub 301 `geschnittenes-eichen-oblag`). De paso: la ruta de `dist/` ahora es relativa al propio script (antes hardcodeaba `C:/Users/Ayrton/Desktop/doorso/dist`) y el script **sale con código 1** si falta un asset. Añadido a `npm run verify`. Ahora imprime `assets=26 missing=0 imgs=9 lazy=6` (antes `assets=0`).

### P2-18 — `paymentAccepted`
`src/content/schema.ts:182-187` — frase → método interpretable: PL `"Przelew, Faktura"` · EN `"Bank transfer, Invoice"` · DE `"Überweisung, Rechnung"`. La aclaración ("ustalana w wycenie") sigue en el copy visible (`src/content/terms.ts`, fila de pago con `confirmed: false`).

### P2-19 — etiquetas bilingües del cuerpo del correo
`src/components/QuoteForm.astro:292-300` → `msg.labelName`…`msg.labelMessage`, con las etiquetas en `src/i18n/ui.ts` (`form.body.*`).
| | PL | EN | DE |
|---|---|---|---|
| name | Imię i nazwisko | Full name | Name |
| company | Firma | Company | Firma |
| taxId | NIP | Tax ID | Steuernummer |
| email | E-mail | Email | E-Mail |
| phone | Telefon | Phone | Telefon |
| product | Produkt | Product | Produkt |
| message | **Wiadomość** (antes sin etiqueta) | **Message** | **Nachricht** |

**Los `name` del formulario no se tocan** (`name`, `company`, `email`, `phone`, `product`, `message`, `consent`, `website`) → el payload del endpoint es idéntico. `docs/CMS-INTEGRATION.md` §"Formulario de presupuesto": añadida la tabla del contrato del payload + la nota de las etiquetas + la del `noValidate` (§"Sin JavaScript").

### P2-20 — vía sin JavaScript utilizable
- `src/components/QuoteForm.astro:74-79` — **fuera el atributo `novalidate`** del `<form>`. Sin JS, el navegador valida los `required` y el formato del `type="email"` por su cuenta.
- `src/components/QuoteForm.astro:236` — el script pone `form.noValidate = true` al arrancar, para conservar los mensajes propios bajo los campos (mismo criterio de antes).
- Se conserva `method="post"` + `enctype="text/plain"` + `action="mailto:kontakt@doors-oblogi.pl"`: es el mecanismo del spec para que el navegador escriba los campos **en el cuerpo** del mensaje (`name=value` por línea). Con endpoint configurado, el `action` es el endpoint y el `mailto:` no interviene.
- **Medido en Chrome**: el `<form>` del HTML crudo **no** tiene `novalidate` (`rawHasNovalidate: false`), y con JS `form.noValidate === true`.

### P2-21 — regla muerta en robots.txt
`public/robots.txt:5-7` — fuera `Disallow: /404/` (la 404 se sirve en `/404.html`). Comentario que explica por qué no hacía falta.

### P2-22 — `og:image:alt` repetía la marca
`src/layouts/BaseLayout.astro:110` — `ogAlt = ogImageAlt ?? title` (antes `?? \`${title} — ${company.name}\``).
`dist/index.html` → `<meta property="og:image:alt" content="Obłogi dębowe — producent z Słonecznika">`.

### P2-24 — comentarios en español
- `src/components/BrandLogo.astro:6,43` → polaco.
- `src/components/LocationMap.astro:2-9` → polaco.
- `src/components/LocationMap.astro:17` — **bug extra encontrado**: el `alt` del mapa en polaco estaba **en español** ("Mapa de Poland con la bandera en la voivodeship de Warmia y Mazuria…") → reescrito en polaco. (EN/DE ya estaban bien.)
- `grep` de marcadores del español en `src/` → 0.

**No he tocado `_tools/shot.cjs` ni `_tools/verify-p0.cjs`**: tienen comentarios en español, pero los está editando **otro agente en paralelo** (`shot.cjs` mtime 19:01, posterior al arranque de mi sesión) y no son míos. Queda pendiente.

---

## 2. Andamiaje de verificación nuevo (el "Extra")

Tres scripts nuevos en `_tools/`, enganchados a `npm run verify`:

**`_tools/check-html.cjs`** — sobre el HTML generado:
- **(a)** Cada `<script>` inline se **parsea con `vm.Script`** (JavaScript real). Eso habría atrapado el P0 del header: la sintaxis TS rompe el parseo → error. Además se buscan marcadores de TS que *son* JS válido: `querySelector<HTMLButtonElement>(…)`, anotaciones de parámetro `(foo: string`, `interface`/`enum`/`implements`/`satisfies`/`as const`, `readonly`/`private`/`public`.
- **(b)** Cada `<img>` (233 en `dist/`) debe llevar `alt` **con valor**; falla tanto `alt` desnudo como `alt` ausente.

**`_tools/check-contrast.cjs`** — 40 pares texto/fondo del sistema visual. **Lee los tokens del bloque `:root` de `global.css`**, resuelve cadenas `var(--x)` y calcula el ratio WCAG 2.1. Si alguien cambia la paleta, el check la sigue. Incluye explícitamente las tarjetas claras dentro de secciones oscuras (`.section--dark .card .field__label` / `h2` / `.kicker` / `.form__fallback` / `.form__fallback a` / `.field__error`) — el caso del P0.

**`_tools/check-assets.cjs`** — reenganchado (P2-16) y ahora con código de salida ≠ 0 si falta algo.

**`_tools/verify-browser.cjs`** — verificación en Chrome headless + CDP (servidor estático local): errores de consola, jerarquía de encabezados, flujo de validación/zgody, menú móvil a 390 px, atributos del formulario y **contraste medido sobre el DOM renderizado** (color computado + fondo real subiendo por el árbol). No va en `npm run verify` porque necesita Chrome y el servidor.

`package.json:12` → `"verify": "node _tools/check-meta.cjs && node _tools/verify-dist.cjs && node _tools/check-html.cjs && node _tools/check-contrast.cjs && node _tools/check-assets.cjs"`

---

## 3. P2 que **no** he hecho (y por qué)

| # | Por qué |
|---|---|
| **P2-14** (borrar `logo.webp`) | Prohibido por `AGENTS.md` regla 10 y por el brief. Decisión de diseño, no bug. No se toca. |
| **P2-24 en `_tools/shot.cjs` y `_tools/verify-p0.cjs`** | Los está editando otro agente en paralelo (`shot.cjs` modificado a las 19:01, con mi sesión arrancada a las 18:32). Tocar esos ficheros habría pisado su trabajo. Los comentarios en español de `src/` sí están corregidos. |
| **P2-15, afinar `pages.ts`** | Dividir `src/content/pages.ts` en un fichero por sección daría fechas `lastmod` distintas a las ~20 páginas que hoy comparten fecha. Es una refactorización del contenido, no un P2 de bug, y toca la fuente que el CMS va a sustituir. Documentado en `_tools/lastmod.mjs` como limitación explícita. |
| **`srcset` en el hero** | El auditor señala que 960 px ampliados a 1920 px se ven blandos. Arreglarlo exige el original ≥2400 px → **pendiente del cliente**, no un cambio de código. |
| **`taxId` en el formulario** | No hay ningún `<input name="taxId">` en el formulario (el campo NIP no existe en el markup, sólo la etiqueta en el cuerpo del correo). La etiqueta `form.body.taxId` queda lista por si el payload lo trae, pero **no he añadido un campo nuevo**: sería cambiar el contrato del endpoint sin pedirlo. |

---

## 4. Verificación — números reales

### Build
```
npm run build → 40 page(s) built in 1.47s · Complete! · 0 errores · 0 avisos de Astro
```

### `npm run verify` → **0 problemas** (exit 0)
```
Strony: 40, problemy: 0
Strony HTML: 50
Unikalne tytuły: 40
JSON-LD (bloki): 112
Przekierowania (301): 10
Sitemap: 39 adresów URL
OK — brak problemów.
OK — skrypty to czysty JavaScript, a każdy <img> ma wartościowy alt.   (61 scripts, 233 <img>)
OK — wszystkie pary mieszczą się w progu AA.                        (40 pares)
TOTAL MISSING: 0                                                      (10 páginas, 0 assets inexistentes)
```

### Contraste — medido en Chrome sobre el DOM renderizado
| par | ratio | mínimo |
|---|---|---|
| `.section--sand .kicker` (lo que fallaba) | **4,68:1** | 4,5 ✅ |
| `.section--dark .card .field__label` | **16,94:1** | 4,5 ✅ |
| `.section--dark .card .form__fallback` | **6,01:1** | 4,5 ✅ |
| `.section--dark .card .form__fallback strong` (teléfono) | **6,00:1** | 4,5 ✅ |
| `.section--dark .card .field__error` | **6,08:1** | 4,5 ✅ |
| `.hero .kicker` | **10,43:1** | 4,5 ✅ |
| `.consent label` | **6,01:1** | 4,5 ✅ |
| `.cta-band` | **4,56:1** | 4,5 ✅ |
| `::selection` | **6,00:1** | 4,5 ✅ *(era 3,72:1 — lo he arreglado)* |

### Navegador (Chrome headless + CDP, `_tools/verify-browser.cjs`)
| comprobación | resultado |
|---|---|
| Errores de consola / excepciones | **0** en las 6 páginas probadas |
| Jerarquía de encabezados | **1 `h1`** por página, **0 saltos** (antes: h1→h3 en 6 páginas) |
| Consentimiento: submit sin zgoda | `data-invalid="true"`, mensaje "Zgoda jest konieczna…", **foco en `quote-form-consent`** |
| Consentimiento: marcar la casilla | `data-invalid="false"`, mensaje **borrado** |
| Consentimiento: desmarcar y reenviar | `data-invalid="true"` + mensaje + foco vuelve al checkbox |
| Formulario en HTML crudo | `rawHasNovalidate: false` · con JS `form.noValidate === true` |
| Menú móvil 390 px | `aria-expanded` false→true, etiqueta "Menu"→**"Zamknij"**, panel visible, `data-open="true"`, `aria-hidden="false"`; cierra bien |
| Cabecera a 1024 px / 1280 px | 1024: nav colapsado a "MENU", WhatsApp del pasillo oculto · 1280: nav completo + CTA, WhatsApp del pasillo oculto — según `AGENTS.md` |

### Assets
- `dist/_astro/*.woff2`: **4** ficheros, 131,1 kB (antes 9, 189 kB).
- `check-assets.cjs`: 0 assets inexistentes en las 10 páginas, incluida la **ficha real** `de/produkte/eichen-abschlussleiste-auf-mass/` (26 assets, 9 imágenes).
- `dist/index.html`: hero con `alt=""` con valor; **0** `alt` desnudo en los 50 HTML.

---

## 5. Lo que sigue pendiente del cliente

1. **Año de fundación** — no está en `company.ts` ni en el JSON-LD. Confirmar y se añade `foundingDate`.
2. **Código postal** — no está en `company.ts` ni en el JSON-LD. El cliente sólo dio Słonecznik / Olsztyn. Confirmar y se añade a `postalAddress()`.
3. **Forma jurídica y NIP** — `legalName` sigue siendo la marca comercial y no se publica. Confirmar y se añade al `Organization`.
4. **Original del hero ≥2400 px** — el actual es 960×720 y se amplía 2× en monitor grande (se ve blando). Pide el original al cliente.
5. **`kontakt@doors-oblogi.pl`** — sigue provisional con TODO, pero **ya se publica** en `Organization.email` de las 40 páginas. Es lo que más urge confirmar antes de que Google lo indexe.
6. **Horarios 8:00–16:00 L–V** — estimados, publicados como `openingHoursSpecification`.
7. **Dominio definitivo** — `https://doors-oblogi.pl` en `astro.config.mjs`; afecta a canonical, sitemap y OG.

---

## 6. Notas de alcance

- **No he tocado los dos P0.** El script `is:inline` de `Header.astro` y el bloque `.section--dark .card` de `global.css` siguen como los dejó el agente principal. Lo único que he hecho en `global.css` ha sido `--accent-strong`, `::selection` y la regla nueva del checkbox inválido.
- **No hay commit ni push.** Todo en local.
- **Servidor:** el `127.0.0.1:4321` está ahora gestionado por `_tools/serve-supervisor.cjs`, creado por otro agente, que relanza `serve.cjs` solo. Paré **mis** instancias; **no** he tocado el supervisor. Los ficheros temporales que dejé (ficheros de test y capturas) están borrados; el repo no tiene `_tmp*`.
- **No verificado por mí:** el comportamiento real de `mailto:` con `enctype="text/plain"` en un cliente de correo (no hay cliente de correo en este entorno) — lo que sí está verificado es que el HTML crudo no lleva `novalidate` y conserva `method="post"` + `enctype="text/plain"`, que es el mecanismo del spec para el cuerpo; y el LCP/INP con red real, que requieren un dispositivo físico.

---

## 7. Ficheros tocados

**Nuevos:** `src/styles/fonts.css` · `_tools/check-html.cjs` · `_tools/check-contrast.cjs` · `_tools/verify-browser.cjs` · `_tools/lastmod.mjs`

**Modificados:**
`astro.config.mjs` · `package.json` · `public/robots.txt` · `docs/CMS-INTEGRATION.md` ·
`src/i18n/ui.ts` · `src/styles/global.css` · `src/layouts/BaseLayout.astro` ·
`src/content/{company,pages,products,schema}.ts` ·
`src/components/{BrandLogo,ContactLinks,Footer,Header,LocationMap,ProductCard,QuoteForm,TermsTable}.astro` ·
`src/views/{AboutView,CatalogView,ContactView,DeliveryView,GalleryView,HomeView,PrivacyView,ProductView,QuoteView,TradeView}.astro` ·
`_tools/check-assets.cjs`

**No tocados (propiedad de otro agente):** `_tools/shot.cjs` · `_tools/verify-p0.cjs` · `_tools/serve-supervisor.cjs` · `docs/agent-reports/03-audit.md` · `public/images/logo.webp`
