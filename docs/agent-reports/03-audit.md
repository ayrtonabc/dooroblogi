# Auditoría de calidad, rendimiento, accesibilidad y corrección funcional — Doors Obłogi

> ## Nota de estado: los dos P0 de este informe ya fueron corregidos
>
> Este informe se redactó sobre el build del 21/10/2026 18:15. Inmediatamente después de la auditoría, el **agente principal corrigió los dos hallazgos P0**. No los borro del informe porque documentan el estado en el que se encontró el proyecto y el diagnóstico sigue sirviendo como regresión a vigilar. **El resto de hallazgos conserva su severidad original.**
>
> **P0 #1 — Menú móvil muerto en las 40 páginas** (`src/components/Header.astro`)
> - *Causa raíz*: el `<script define:vars>` se emitía sin pasar la transpilación de TypeScript, de modo que el JavaScript generado en `dist/` contenía `document.querySelector<HTMLButtonElement>(…)`, `(event.target as HTMLElement)` y `(open: boolean) =>`. Eso es un `SyntaxError: Unexpected token ':'` en el navegador: el script entero no parseaba, el botón `[data-nav-toggle]` nunca registraba listener, `aria-expanded` se quedaba en `"false"` y `[data-mobile-nav]` en `display:none` en las 40 páginas.
> - *Corrección aplicada por el agente principal*: llevar ese bloque `<script>` a JavaScript plano (sin genéricos ni `as` cast) para que el script que Astro emite sea sintácticamente válido y el menú vuelva a arrancar.
> - *Verificación posterior*: el menú móvil **abre correctamente** en `/`, `/cennik/`, `/produkty/oblog-debowy-ciety/` y `/en/`, con **0 errores de consola** en esas cuatro páginas.
>
> **P0 #2 — Formulario de presupuesto ilegible sobre sección oscura** (`src/styles/global.css`, tarjeta `.card`)
> - *Causa raíz*: el formulario vive dentro de `<div class="card">` (fondo `var(--paper)` = `#fbf8f2`) y, a la vez, dentro de `.section--dark`. Las reglas `.section--dark .field__label { color: var(--cream) }`, `.section--dark h2`, `.section--dark .btn--ghost { --btn-fg: var(--cream) }`, `.section--dark .form__fallback` y `.section--dark .form__fallback a` se aplicaban igual dentro de esa tarjeta clara, dejando **crema `#f5f0e6` sobre papel `#fbf8f2` = 1,07:1** en las 15 páginas con formulario (12 fichas de producto + 3 de empresas).
> - *Corrección aplicada por el agente principal*: acotar esas reglas de `.section--dark` para que no alcancen la tarjeta clara del formulario, de modo que los textos del formulario vuelvan a color oscuro sobre su fondo real.
> - *Verificación posterior* (Chrome headless, midiendo sobre el **fondo real de la tarjeta**, `rgb(251,248,242)`): `label` **16,94:1**, `h2` **16,94:1**, `form__fallback` **6,01:1**, el elemento <strong> del teléfono **5,74:1** — los cuatro por encima del mínimo AA de 4,5:1.
>
> *Nota de método*: la comprobación posterior la ejecutó el agente principal. Yo **no** la he re-ejecutado, porque la tarea en curso prohíbe reconstruir `dist/` (hay otro agente editando `src/**` y una build concurrente corrompería el artefacto); tampoco he releído el diff de `src/` para no interferir con ese trabajo. Todo lo demás que sigue procede de mis mediciones directas sobre el build de las 18:15.

---

# 1. Resumen ejecutivo

La web **compila limpio** (`npm run build`: 40 páginas en 1,29 s, 0 avisos) y `npm run verify` da 0 problemas: 0 enlaces internos rotos, 0 IDs duplicados, 0 `alt` ausentes, `hreflang` recíproco y `x-default` correcto en las 40 páginas, 112 bloques JSON-LD que parsean, 10 stubs 301 bien hechos. El formulario funciona por los tres caminos (endpoint, mailto, WhatsApp) —lo verifiqué inyectando un endpoint stub local.

Pero había **dos roturas que invalidaban el "0 problemas" del verify**: el **menú móvil estaba muerto en las 40 páginas** (el script del header se emite con TypeScript crudo → `SyntaxError` en cada load) y el **formulario de presupuesto era ilegible en 15 páginas** (etiquetas color crema sobre una tarjeta casi blanca, 1,07:1). Ninguno lo detectaba `npm run verify`, porque sus scripts miran `src`/atributos, no ejecución ni contraste. **Ambos están ya corregidos (ver nota de estado arriba).**

Hallazgos: **2 P0, 5 P1, 16 P2**.

Las tres cosas urgentes:
1. **P0 · `Header.astro:130-131`** — quitar los genéricos TS del `<script define:vars>` (o moverlos a un `<script>` normal que Astro transpila). Sin esto no hay navegación en móvil. *(Corregido.)*
2. **P0 · `global.css:1442-1457`** — las reglas `.section--dark .field__label` / `.btn--ghost` / `.form__fallback` se cuelan dentro de la `.card` clara. Acotarlas a la tarjeta o invertir los colores del formulario. *(Corregido.)*
3. **P1 · `pages.ts:21-23`** — quitar "bez kompromisów / without compromise / ohne Kompromisse" del hero: es literalmente la palabra que `AGENTS.md` prohíbe, en el párrafo más leído del sitio y en los 3 idiomas. **Sigue pendiente.**

---
# 2. Tabla de hallazgos

| # | Sev | Ubicación | Problema | Impacto | Evidencia |
|---|-----|-----------|----------|---------|----------|
| 1 | **P0** | `src/components/Header.astro:130-131` → `dist/index.html` (script inline) | El `<script define:vars>` se emite **sin transpilar TypeScript**: `document.querySelector<HTMLButtonElement>(…)`, `(event.target as HTMLElement)`, `(open: boolean) =>`. Es un error de sintaxis en JS → el script entero no parsea y **el menú móvil nunca abre**. | En móvil (<1248 px) la cabecera sólo ofrece logo + banderas + teléfono. No hay acceso a productos, galería, o-nos, cennik ni contacto desde el nav. Además hay un error de consola en **todas** las páginas. | `dist/index.html`: `<script>(function(){const menuLabel = "Menu"; … document.querySelector<HTMLButtonElement>('[data-nav-toggle]');` · CDP `Runtime.exceptionThrown` → `SyntaxError: Unexpected token ':'` en 8/8 páginas probadas (`/`, `/en/`, `/de/`, `/cennik/`, `/kontakt/`, `/produkty/oblog-debowy-ciety/`, `/realizacje/`, `/404.html`) · tras `toggle.click()`: `aria-expanded` sigue `"false"`, `panelDisplay:"none"`, `aria-label:null` (el `setState(false)` inicial nunca corrió) |
| 2 | **P0** | `src/styles/global.css:1442-1457` + `global.css:871-877` (`.card{background:var(--paper)}`) | El formulario vive en `<div class="card">` (fondo claro `#fbf8f2`) **dentro** de `.section--dark`. Las reglas `.section--dark .field__label{color:var(--cream)}`, `.section--dark h2`, `.section--dark .btn--ghost{--btn-fg:var(--cream)}`, `.section--dark .form__fallback`, `.section--dark .form__fallback a` se aplican igual dentro de la tarjeta clara → **crema sobre blanco**. | **El formulario de presupuesto es ilegible en 15 páginas** (12 fichas de producto + 3 de empresas). Es el elemento de conversión principal del sitio: las etiquetas, el título, el botón de WhatsApp y el teléfono son invisibles. | Medido sobre píxeles renderizados: `label.field__label` fg `rgb(245,240,230)` bg `rgb(251,248,242)` = **1,07:1** (necesita 4,5); `h2` = 1,07:1; `.btn--ghost` = 1,07:1; `.form__fallback` = 1,86:1; `strong` (teléfono) = 1,62:1. Captura de `dist/dla-firm/index.html` (sección `.section--dark`): las etiquetas se leen como fantasma blanco sobre blanco. Alcance confirmado por grep del HTML generado: 15 rutas con `<form>` dentro de `.section--dark` y `.card` (`/produkty/*` 4, `/en/products/*` 4, `/de/produkte/*` 4, `/dla-firm/`, `/en/for-trade/`, `/de/fuer-handwerk/`) |
| 3 | P1 | `src/components/QuoteForm.astro:206` y `:371-377` | El checkbox de consentimiento está en `<div class="consent">` **sin `data-field="consent"`**. El listener de `input` hace `target.closest('[data-field]')` → `null` → **el error nunca se borra**; el campo tampoco recibe `data-invalid` ni foco. | El usuario marca la casilla y el mensaje "Zgoda jest konieczna…" sigue ahí. En el caso "sólo falla el consentimiento", el foco no se mueve al checkbox. | CDP en `/cennik/`: `errBefore:"Zgoda jest konieczna…"`, `errAfterCheckingBox:"Zgoda jest konieczna…"`, `cleared:false` · `wrapperHasDataField:false`, `invalidApplied:null` · tras `requestSubmit()` vacío: `invalidFields:["name","email","message"]` (consent ausente) |
| 4 | P1 | `src/views/HomeView.astro:32` → `dist/index.html` | `alt=""` en el `<Image>` del hero se emite como **atributo booleano sin valor**: `<img … alt sizes="100vw" …>`. HTML inválido (`alt` exige valor) y la imagen —el LCP de las 3 home— queda sin texto alternativo. | 3 páginas (home PL/EN/DE). La foto del hero es la única representación visual del producto en la home; además es el elemento LCP, así que un `alt` correcto también mejora la accesibilidad del LCP. | `dist/index.html`: `<img src="/_astro/hero-oblog-debowy.B7cKEAmI_Z200WCh.webp" alt sizes="100vw" loading="eager" fetchpriority="high" decoding="async" width="960" height="720">` · grep `alt(?=[ >])` → 1 ocurrencia (sólo el hero); las otras 10 imágenes sí emiten `alt=""` → es un bug de `<Image>` con cadena vacía, no general de Astro |
| 5 | P1 | `src/layouts/BaseLayout.astro` (preload) + `src/styles/global.css:13-40` (fontsource) | Se precarga sólo el subset **latin**. Las diacríticos polacos (ą ę ć ł ń ś ź ż = U+0105…U+017C) están en **latin-ext**, no en latin (latin = U+0000-00FF). Resultado: cada página descarga **4 woff2 (131,9 kB)** de los que **2 (50,2 kB) no están precargados** y se descubren tras el primer paint. | 131,9 kB de fuentes en cada página = el 58 % del peso de `/cennik/` (229 kB) y el 35 % de `/realizacje/`. Los 50,2 kB de latin-ext llegan tarde → swap de glifos en el texto polaco (FOUT). CLS medido ≈0,0002 (el fallback con `size-adjust` lo amortigua), así que el daño es visual, no de layout. | Traza CDP de peticiones: `/` → `newsreader-latin-wght-normal` (57 kB), `manrope-latin-wght-normal` (24 kB), **`manrope-latin-ext-wght-normal` (15 kB)**, **`newsreader-latin-ext-wght-normal` (36 kB)**. En `dist/index.html` solo hay 2 `<link rel=preload as=font>`, ambos `latin`. Contradice `02-programmer-fixes.md` P2-31 ("sin descarga doble": la URL sí coincide, pero **el subset no cubre el polaco**) |
| 6 | P1 | `src/content/pages.ts:21-23` → `dist/{index,en/index,de/index}.html` | **AI slop en el hero de las 3 home**, y es la palabra prohibida literal de `AGENTS.md` regla 3: PL "Dąb naturalny **bez kompromisów**", EN "Natural oak **without compromise**", DE "Natürliche Eiche **ohne Kompromisse**". | Es el primer párrafo que lee el visitante, en los 3 idiomas. Regla de negocio violada en la página más vista. | `dist/index.html` `<p class="hero__lead">`: "Dębowe listwy wykończeniowe, lamele oraz gotowe panele sufitowe i ścienne. Dąb naturalny bez kompromisów, selekcja bez sęków i z sękami…" · `dist/en/index.html`: "…Natural oak without compromise, knot-free and knotty selections…" · `dist/de/index.html`: "…Natürliche Eiche ohne Kompromisse…" · grep de slop en `src/`: única coincidencia |
| 7 | P1 | `src/content/company.ts` (`founded: '2021'`) → `src/content/schema.ts:132` → `dist/**/*.html` | `foundingDate: "2021"` se publica como dato estructurado en las **40 páginas**, pero nadie lo ha confirmado: la propia auditoría SEO lo marca como pregunta abierta al cliente ("¿Desde cuándo existe la empresa…? `company.ts:11` dice `founded: '2021'`") y `02-programmer-fixes.md` no lo recoge entre los datos confirmados. El programador convirtió un campo dudoso en un *claim* legible por máquina. | Riesgo de dato falso en el panel de conocimiento de Google y de señal local inconsistente. `legalName` sí está marcado como provisional; `foundingDate` no. | `dist/index.html` JSON-LD: `"foundingDate":"2021"` · `01-seo-critique.md:477` lo lista como pregunta nº 8 al cliente, sin respuesta registrada · grep `founded` en `src/` → único valor `2021` |
| 8 | P2 | `src/content/schema.ts:144-149` | `knowsAbout` va anidado dos veces: `knowsAbout: [ locale==='pl' ? ['Obłogi dębowe',…] : … ]` → el JSON-LD emite `[["Obłogi dębowe","Lamele dębowe",…]]`. schema.org espera `Text`/`DefinedTerm`, no un array dentro de un array. | La propiedad queda inerte para el consumidor (Google la ignora silenciosamente). 40 páginas afectadas. | `dist/index.html`: `"knowsAbout":[["Obłogi dębowe","Lamele dębowe","Panele sufitowe z dębu","Dąb wędzony","Boazeria dębowa"]]` |
| 9 | P2 | `dist/produkty/`, `dist/en/products/`, `dist/de/produkte/`, `dist/dla-firm/`, `dist/en/for-trade/`, `dist/de/fuer-handwerk/` | Salto de jerarquía **h1 → h3**: no hay `h2` entre el H1 y los títulos de producto/tarjeta. | Navegación por encabezados rota en 6 páginas (WCAG 1.3.1 en la práctica; axe `heading-order`). | Parseo de `<h1..h6>` sobre 50 HTML: `/produkty/` h1→h3 ("Obłóg dębowy cięty"), `/en/products/` h1→h3 ("Oak trim battens"), `/de/produkte/` h1→h3 ("Eichen-Abschlussleiste auf Maß"), `/dla-firm/` h1→h3 ("Stały profil i selekcja"), `/en/for-trade/` h1→h3 ("Same profile and selection"), `/de/fuer-handwerk/` h1→h3 ("Gleiches Profil, gleiche Selektion") |
| 10 | P2 | `src/styles/global.css:288` (`.kicker{color:var(--accent-strong)}`) en `.section--sand` | Contraste de **4,48:1** (necesita 4,5:1) para texto normal de 14,4 px. Falla técnica de AA, marginal pero real. | Afecta al kicker "Współpraca" / "Trade supply" / "Großhandel" / "Zusammenarbeit" en 4 páginas. | Analítico: `#7d5c34` sobre `#e7dcc8` = **4,48** (confirmado por muestreo de píxeles: fg `rgb(125,92,52)` bg `rgb(231,220,200)` = 4,48). Es el único par de tokens que falla: los otros 17 pares comprobados pasan |
| 11 | P2 | 13 plantillas `.astro` | **41 cadenas visibles hardcodeadas** con ternarios `locale === 'pl' ? … : …` dentro del template, contra `AGENTS.md` regla 8 ("No hay literales sueltos en los templates"). Reparto: `ProductView` 10, `AboutView` 8, `QuoteView` 5, `CatalogView` 4, `DeliveryView` 3, `Footer` 3, `ContactView` 2, y 1 en cada uno de `ContactLinks`, `GalleryView`, `Header`, `PrivacyView`, `QuoteForm`, `TradeView`. | El copy deja de estar centralizado en `ui.ts`/`content/`; cualquier corrección de copy hay que replicarla a mano en 3 idiomas. | `Select-String -Path 'src\**\*.astro' -Pattern "locale === 'pl' ?"` → 41 coincidencias en 13 ficheros. Ejemplos: `Footer.astro:37-41` (descripción + 3 items del footer), `Header.astro:24-32` (`brandTag`, `waText`), `QuoteForm.astro` (`waIntro`, 'Inne / nie wiem') |
| 12 | P2 | `src/components/Header.astro:24` y `src/components/Footer.astro:23` | `const brandTag = …` se declara en los dos y **no se usa en ningún sitio**. | Código muerto (el informe P2-36 dice haber limpiado código muerto, pero esto se coló o no se detectó). | grep `brandTag` en `src/` → 2 coincidencias, ambas la definición; 0 usos |
| 13 | P2 | `src/content/products.ts:110` | Typo en alemán: `de: 'Natürliche Eichenbretter mit sichtbarem Astdmuster'` → debería ser `Astmuster`. | Se renderiza 2× como `alt` **y** como `<figcaption>` visible (texto del cliente-facing). | `dist/de/galerie/index.html` y `dist/de/produkte/eichen-abschlussleiste-auf-mass/index.html` contienen "Astdmuster" (grep en `dist/` → 2 ficheros) |
| 14 | P2 | `public/images/logo.webp` | 236,7 kB de logo **sin ninguna referencia** en el HTML generado (el sitio usa `logo-web.webp`, 39,1 kB). | 237 kB de peso muerto en cada despliegue. | Conteo de referencias en los 50 HTML de `dist/`: `/images/logo.webp` → 0; `/images/logo-web.webp` → 80; `/favicon.svg` → 80; `/images/mapa.webp` → 3; `/og-default.png` → 80 |
| 15 | P2 | `astro.config.mjs` (serialize) + `src/content/routes-map.json` | `lastmod` del sitemap = **timestamp de build**, idéntico para las 39 URLs (`2026-10-21T15:37:56.291Z` / `.292Z`). `routes-map.json` no guarda fecha por ruta. | Google ve todas las páginas como modificadas en cada rebuild → `lastmod` poco fiable, que es justo lo que el informe P2-30 quería resolver. | `dist/sitemap-0.xml`: 39 `<url>`, 39 `<lastmod>`, 156 `xhtml:link`; valores únicos de lastmod: 2 (el timestamp del build) |
| 16 | P2 | `_tools/check-assets.cjs:41` | El script comprueba `de/produkte/geschnittenes-eichen-oblag/index.html`, **slug obsoleto** que hoy es un stub 301. El script imprime `assets=0 missing=0 imgs=0` → **pasa en falso**: ya no verifica ninguna página real de producto en DE. | El único script de verificación de assets no está mirando la ficha de producto alemana. | Salida: `de/produkte/geschnittenes-eichen-oblag/index.html assets= 0 missing=0 imgs= 0 lazy=0` vs `produkty/oblog-debowy-ciety/index.html assets= 26 missing=0 imgs= 9 lazy=6` |
| 17 | P2 | `src/styles/global.css` (`@font-face` de fontsource) | Se empaquetan 7 subsets de fuente; sólo `latin` (+`latin-ext` por los diacríticos) se usan. Sobran `manrope-cyrillic` (14,2 kB), `manrope-cyrillic-ext` (2,5), `manrope-greek` (9,2), `manrope-vietnamese` (8,3), `newsreader-vietnamese` (11,7) = **45,9 kB** de ficheros que nadie descarga pero que viajan en cada despliegue. | Ruido en el repo/deploy. El coste de red es cero (unicode-range los bloquea). | `dist/_astro/*.woff2` → 9 ficheros, 189 kB; la traza de red sólo pide 4 |
| 18 | P2 | `src/content/schema.ts:182-187` | `paymentAccepted` es una **frase** ("Przelew lub faktura — warunki potwierdzamy w wycenie"), no un método de pago. | schema.org espera `PaymentMethod`/`Text` con valores tipo "Cash, Credit Card, Invoice"; una frase no es interpretable. | `dist/index.html`: `"paymentAccepted":"Przelew lub faktura — warunki potwierdzamy w wycenie"` |
| 19 | P2 | `src/components/QuoteForm.astro:292-297` | Las etiquetas del cuerpo del correo/WhatsApp son **bilingües y fijas**: `Imię i nazwisko / Name:`, `Firma / Company:`, `NIP / Tax ID:`, `Telefon / Phone:`, `Produkt / Product:` — en los 3 idiomas. | Un cliente alemán o inglés recibe el cuerpo mezclado; y el campo `message` va sin etiqueta. | `dist/cennik/index.html` → el texto generado en el test de navegador: `"Imię i nazwisko / Name: Piotr Zielinski\nZamawiam 10 szt."` |
| 20 | P2 | `src/components/QuoteForm.astro` (`novalidate` + `action="mailto:…"`) | Sin JS el navegador no valida nada (`novalidate`) y envía el `mailto:` con el cuerpo vacío. Con JS sí funciona (verificado). | Con JS desactivado o con un proxy que bloquea scripts, la vía de conversión se queda sin contenido ni validación. Hay que quitar `novalidate` o validar en `oninvalid`. | `dist/cennik/index.html`: `<form class="form" id="quote-form" data-quote-form data-endpoint data-context="price-list" method="post" action="mailto:kontakt@doors-oblogi.pl" enctype="text/plain" novalidate>` |
| 21 | P2 | `public/robots.txt` | `Disallow: /404/` no hace nada: la página 404 se sirve en `/404.html` y las URLs inexistentes devuelven 404 con la plantilla. | Regla muerta en robots.txt (no daña, pero sugiere una protección que no existe). | `dist/robots.txt`: `Disallow: /404/` · `GET /no-existe-xyz/` → **404** con la página polaca correcta (`h1` "Nie znaleziono strony") |
| 22 | P2 | `src/layouts/BaseLayout.astro` (`og:image:alt`) | `og:image:alt` = "Obłogi dębowe — producent z Słonecznika — **Doors Obłogi**": la marca se repite dos veces en el texto alternativo. | El `alt` de la tarjeta social queda redundante (el informe P2-32 decía haberlo arreglado). | `dist/index.html`: `<meta property="og:image:alt" content="Obłogi dębowe — producent z Słonecznika — Doors Obłogi">` |
| 23 | P2 | `src/content/company.ts` (`postalCode: '10-511'`) | Código postal añadido por el programador para `Słonecznik`; **no he podido verificarlo** (no existe artículo de Wikipedia para Słonecznik y no consulté un nomenclátor postal). `02-programmer-fixes.md` lo recoge en P1-14 sin marcarlo como pendiente. | Si el código es incorrecto, es un dato postal falso publicado en el JSON-LD de las 40 páginas. | `dist/index.html` JSON-LD: `"address":{…,"postalCode":"10-511"…}` · **no verificado** |
| 24 | P2 | `src/components/BrandLogo.astro:6,43,45`; `src/components/QuoteForm.astro` | Comentarios en **español** en un proyecto PL/EN/DE ("Versión para fondo oscuro: se invierte a blanco", "Fondo oscuro: el logo es oscuro sobre claro…"). | Ruido de idioma en el código; sugiere que el repo pasó por un estado en español. | Lectura de `src/components/BrandLogo.astro` líneas 6, 43, 45 |

---
# 3. Accesibilidad

**Contraste (medido sobre los píxeles renderizados, con Chrome headless y CDP; la caja de texto de cada línea, excluyendo los píxeles del glifo para no confundir texto con fondo):**

| Par | Ratio | Mínimo | Resultado |
|---|---|---|---|
| `--text-soft #6a5d50` sobre `--paper #fbf8f2` (body, `.lede`, `.card__text`, `.specs__label`) | **6,01** | 4,5 | OK |
| `--text-soft #6a5d50` sobre `--cream #f5f0e6` | **5,61** | 4,5 | OK |
| `--text-soft #6a5d50` sobre `--sand #e7dcc8` | **4,70** | 4,5 | OK |
| `--text #1b1611` sobre `--paper` | **16,94** | 4,5 | OK |
| `--accent-strong #7d5c34` sobre `--paper` (links, `.consent__link`) | **5,74** | 4,5 | OK |
| `--accent-strong #7d5c34` sobre `--cream` | **5,36** | 4,5 | OK |
| **`--accent-strong #7d5c34` sobre `--sand #e7dcc8` (`.kicker`)** | **4,48** | 4,5 | **FALLA** (hallazgo 10) |
| `--cream #f5f0e6` sobre `--ink #1b1611` (`.section--dark`, footer) | **15,81** | 4,5 | OK |
| `--text-invert-soft #c4b7a4` sobre `--ink` | **9,11** | 4,5 | OK |
| `--straw #d6c3a4` sobre `--ink` | **10,43** | 4,5 | OK |
| `--ink #1b1611` sobre `--oak #9d7a4f` (`.cta-band`) | **4,56** | 4,5 | OK (justo) |
| Error de campo `#a63a2a` sobre `--paper` | **6,08** | 4,5 | OK |
| Estado error `#7d2a1c` sobre `#fdf1ef` | **8,56** | 4,5 | OK |
| Estado OK `#33502a` sobre `#f1f6ee` | **8,25** | 4,5 | OK |
| Error en oscuro `#e9a196` sobre `--ink` | **8,55** | 4,5 | OK |
| **`--cream #f5f0e6` sobre `--paper #fbf8f2`** (etiquetas del form dentro de `.card` en `.section--dark`) | **1,07** | 4,5 | **FALLA CRÍTICA** (hallazgo 2) |
| **`--text-invert-soft #c4b7a4` sobre `--paper`** (`.form__fallback` en la tarjeta) | **1,86** | 4,5 | **FALLA** (hallazgo 2) |
| **`--straw #d6c3a4` sobre `--paper`** (teléfono de contacto en la tarjeta) | **1,62** | 4,5 | **FALLA** (hallazgo 2) |

Medí 1.550 elementos de texto en 30 páginas con el sampler de píxeles. Las 60 salidas inicialmente marcadas como fallo se depuraron una a una: **los `figcaption.gallery-grid__caption` NO son un fallo real** — el sampler cogía el padding de 2,5 rem que hay sobre el texto, pero la captura de `dist/realizacje/` confirma que el pie de foto va sobre la zona oscura del degradado y se lee con holgura. Los que sí fallan de verdad son los del formulario (hallazgo 2) y el kicker sobre arena (hallazgo 10).
**Resto de accesibilidad (verificado en navegador):**

- **Foco visible**: correcto. Recorrí todos los `a/button/input/select/textarea` visibles con `el.focus()`: **0 elementos** quedan sin `outline` ni `box-shadow` al recibir foco. `.section--dark :focus-visible` cambia a `--straw` (10,43:1 sobre ink).
- **Skip-link**: funciona. En reposo está en `top:-100px`; al tabular pasa a `top:16px` con `outline:2px solid` y `visibleAfterFocus:true` → visible en pantalla. (La primera medición dio `false` porque leí el valor antes de que terminara la `transition: top .15s`; con 400 ms de espera el resultado es correcto.)
- **Etiquetas**: todos los campos tienen `<label for>` (0 campos sin etiqueta en los 50 HTML). `aria-live="polite"` en los `<p class="field__error">`.
- **IDs**: 0 duplicados en ninguna página. Todos los `aria-controls`/`labelledby`/`describedby` apuntan a IDs existentes. 0 `<button>` sin nombre accesible.
- **Imágenes**: 233 `<img>` en `dist/`, 0 sin atributo `alt`. 147 con `srcset` correcto y `sizes` `(min-width:54rem) 31vw, 45vw` / `62vw, 92vw`; los 86 sin `srcset` son 80 logos (39,1 kB, tamaño fijo), 3 heroes (yafindziados) y 3 mapas.
- **`prefers-reduced-motion`**: contemplado (`global.css:97`, desactiva `scroll-behavior` y animaciones).
- **Zoom 200 %**: emulado a 675×470 → `scrollWidth == clientWidth`, sin scroll horizontal.
- **Jerarquía**: 1 `<h1>` por página en las 40; saltos h1→h3 en 6 (hallazgo 9).
- **Menú móvil**: el `aria-expanded` nunca cambia porque el script no arranca (hallazgo 1). Aunque arrancara, `aria-hidden` y `display:none` se gestionan bien; el panel cerrado saca 0 elementos del tab order.
# 4. Rendimiento

**Peso real descargado** (`Network.loadingFinished.encodedDataLength`, caché desactivada, servidor local):

| Página | Móvil 390×844 @2x | Escritorio 1350×940 | Desglose (escritorio) |
|---|---|---|---|
| `/` | 444,6 kB | 444,1 kB | doc 32,4 · css 25,1 · **fuentes 131,9** · imgs 254,7 |
| `/produkty/` | 513,9 kB | 351,7 kB | doc 27,6 · css 25,1 · **fuentes 131,9** · imgs 167,0 |
| `/produkty/oblog-debowy-ciety/` | 315,3 kB | 315,3 kB | doc 43,8 · css 25,1 · **fuentes 131,9** · imgs 114,5 |
| **`/realizacje/`** | 582,8 kB | **936,7 kB** | doc 22,8 · css 25,1 · **fuentes 131,9** · **imgs 756,9** (15 peticiones) |
| **`/de/galerie/`** | 547,5 kB | **901,4 kB** | doc 23,1 · css 25,1 · **fuentes 96,3** · **imgs 756,9** |
| `/cennik/` | 229,3 kB | 229,3 kB | doc 33,0 · css 25,1 · **fuentes 131,9** · imgs 39,3 |
| `/kontakt/` | 228,5 kB | 228,5 kB | doc 32,2 · css 25,1 · **fuentes 131,9** · imgs 39,3 |
| `/o-nas/` | 359,8 kB | 359,8 kB | doc 23,4 · css 25,1 · **fuentes 131,9** · imgs 179,3 (incluye `mapa.webp` 76 kB) |

**Fuentes = 131,9 kB en el 58 % de las páginas de texto.** Es el mayor coste evitable del sitio (hallazgo 5). La galería es el segundo: 757 kB de imágenes en escritorio, porque Chrome adelanta 8-9 `loading="lazy"` por su umbral de viewport (las fotos van de 36 kB a 278 kB según la candidate).
**JS**: 0 ficheros `.js` en `dist/_astro`. Todo el JS va inline en el HTML: 3.316 B (JSON-LD) + 1.056 B (script del header) + 1.831 B (JSON-LD) en la home. El JS ejecutable real son **1.056 B**, y **no funciona** (hallazgo 1). El formulario añade ~1,8 kB inline donde sí funciona. Cero peticiones JS externas: correcto para un SSG.

**CSS**: 1 fichero, 25,1 kB (sin comprimir), sin peticiones por debajo del pliegue. Aceptable.

**Core Web Vitals** (CDP + `PerformanceObserver`, con `Network.emulateNetworkConditions`):

| Preset | LCP | Elemento LCP | FCP | CLS |
|---|---|---|---|---|
| Local sin throttling | 192 ms | `IMG.hero__media` | — | 0 |
| **Fast 4G** (9 Mbps, 85 ms) | **532 ms** (home) · 596 ms (catálogo) · 500 ms (ficha) · 416 ms (galería) · 400 ms (cennik) | `IMG` / `P` / `H1.page-head__title` | 400-532 ms | **0** |
| **Slow 4G** (1,6 Mbps, 150 ms) | **1.244 ms** (home) · 1.644 ms (catálogo) · 1.180 ms (ficha) · 1.056 ms (galería) · 1.004 ms (cennik) | `H1.hero__title` / `IMG` | 1.004-1.644 ms | **0 - 0,0002** |

**Qué es el LCP y por qué**: en la home es **la imagen del hero** (`/_astro/hero-oblog-debowy.B7cKEAmI_Z200WCh.webp`, 960×720, **104,4 kB**, `loading="eager"`, `fetchpriority="high"`, con `<link rel=preload as=image>` apuntando a la URL exacta → sin descarga doble). Es la imagen más grande pintada del viewport, y pesa 104 kB de una sola candidate: **no hay `srcset`**, así que en un monitor de 1920 px se sirve ampliada de 960 px (2×) y se ve blanda. Con Slow 4G la descarga de esa imagen tarda ~670 ms, pero la gana el `H1.hero__title` (1.244 ms) porque el texto pinta antes con la fuente de reserva. En el catálogo el LCP es la primera imagen de producto (`IMG`), y en las páginas sin imagen es el `H1.page-head__title`.

**CLS = 0 en todas las páginas.** El fallback de fuente con `size-adjust`/`ascent-override` (`Newsreader Fallback`, `Manrope Fallback`) + `font-display:swap` + `width`/`height` en todas las imágenes + `aspect-ratio` lo neutralizan. **INP**: no hay interacción con JS quecks — el único script que debería responder es el del menú, que está muerto (hallazgo 1), así que el INP medido es trivialmente bueno por un motivo equivocado.
# 5. Qué está bien

- **Build**: 40 páginas en 1,29 s, **0 errores y 0 avisos de Astro**. `npm run verify` → `Strony: 40, problemy: 0 / Strony HTML: 50 / Unikalne tytuły: 40 / JSON-LD (bloki): 112 / Przekierowania (301): 10`. Volví a pasarlo al final: **0 problemas**.
- **Enlaces**: 0 rotos en las 40 páginas. Mi comprobador independiente (incluye `href`, `src`, `srcset`, `poster`, `<link href>`, `url()` de CSS y **anclas `#fragment`**) no encontró ni uno, tampoco en `dist/_astro/*.css`.
- **hreflang/canonical/x-default**: recíproco y correcto en las 40 páginas; `x-default` == `pl-PL` en todas; canonical == URL absoluta esperada en todas; `<html lang>` correcto (`pl-PL`/`en`/`de`).
- **JSON-LD**: los 112 bloques parsean como JSON válido. `Product`, `Organization`/`LocalBusiness`, `FAQPage`, `BreadcrumbList` coherentes.
- **Stubs 301**: los 10 correctos (destino, canonical al destino, `noindex`, fuera del sitemap). Incluyen los antiguos `cut-oak-lintel` / `smoked-oak-lintel`, que ya no exponen "oak lintel" como contenido.
- **Formulario**: los **tres caminos verificados** en navegador real — (a) con endpoint: `POST` `Content-Type: application/json` con cuerpo `{"name":"Jan Kowalski","company":"","email":"…","phone":"…","product":"","message":"…","website":"","consent":"on","context":"price-list"}` → reset + mensaje de éxito; (b) sin endpoint: navega a `mailto:kontakt@doors-oblogi.pl?subject=…&body=…` (237 chars); (c) WhatsApp: reescribe el `href` con el contenido del formulario. El **honeypot** (`website`, en `.visually-hidden` + `aria-hidden`) bloquea en silencio sin enviar nada. Ante un fallo de `fetch` muestra un mensaje de error útil.
- **Copys y fotos**: **cero fotos de stock** — todo sale de `src/assets/images/` (las 11 fotos del cliente). **Cero precios publicados** (ni `price` ni `priceRange` con importes; `offers` sin `price`, `availability: PreOrder`). **Cero ratings/reseñas** (`aggregateRating` no aparece). `kontakt@doors-oblogi.pl` sigue marcado como provisional con `TODO`.
- **Terminología**: EN usa *oak trim batten / oak battens / oak edging*; DE usa *Eichen-Abschlussleiste / Eichenleiste / Eichen-Lamelle*; PL *obłóg dębowy / lamela dębowa*. **No aparece "oak lintel" ni "Oblag" en ningún contenido visible** (sólo en las URLs antiguas ya redirigidas).
- **Rendimiento base**: `srcset`+`sizes` bien puestos en las 147 imágenes que lo necesitan; `width`/`height` en todas; `loading="lazy"` en las secundarias; `fetchpriority="high"` + preload en el LCP; fuentes **autoalojadas** (fontsource, variables, `font-display:swap`, sin Google Fonts); 0 peticiones JS externas; CLS = 0.
- **Sitemap**: 39 URLs con `lastmod`, `changefreq`, `priority` y `xhtml:link` (4 por URL = 156).
- **404**: status HTTP 404 correcto, con h1 polaco "Nie znaleziono strony" y enlaces de salida; sin `hreflang` a `/en/404/` inexistentes.
- **Hoja de ruta**: `dist/robots.txt` correcto, `sitemap-index.xml` referenciado.
# 6. Desvíos heredados del agente programador

Los 11 desvíos de `02-programmer-fixes.md` (L54, L70, L122, L142, L156, L165, L173, L181, L213, L231, L281). Veredicto:

| # | Desvío | Veredicto | Nota |
|---|--------|-----------|------|
| 1 | **Sin publicar rangos de precio** (L54) | **Coherente — mantener** | Es exactamente lo que pide `AGENTS.md` regla 4. La fricción se ha convertido en flujo de petición de precio con unidad de venta. Correcto. |
| 2 | **`contactEmail` provisional, visible con `mailto:`** (L70) | **Coherente — mantener** | Sigue con `TODO` en `company.ts`. Verificado: el email aparece en footer, contacto y o-nos. Honesto. Pero ojo: es el mismo email que se publica en `Organization.email` del JSON-LD de las 40 páginas — el cliente debería confirmarlo antes de que Google lo indexe. |
| 3 | **JSON-LD sin `price` ni `gtin`** (L122) | **Coherente — mantener** | `offers` sin `price` + `priceSpecification` con `unitCode`. Correcto: inventar un EAN o un importe sería información falsa. |
| 4 | **Sin `geo`; `legalName` = "Doors Obłogi"** (L142) | **Coherente, con un matiz** | Omitir `geo` es correcto. Pero `legalName` sin forma jurídica es un campo obligatorio de `Organization` y "Doors Obłogi" es el nombre comercial. **Debería marcarse igual que `company.founded`**: el conjunto `legalName` + `foundingDate:"2021"` + `postalCode:"10-511"` son los tres datos no confirmados que ahora se publican como estructurados (hallazgos 7 y 23). El `TODO` que el informe menciona para `legalName` no está en el JSON-LD. |
| 5 | **`legalName` real y NIP declarados en la política** (L156) | **Coherente — mantener** | La política de privacidad dice explícitamente que la forma jurídica no está confirmada. Es el patrón correcto. |
| 6 | **Hero 960×720 sin `srcset`** (L165) | **Coherente pero incompleto** | El diagnóstico es correcto (el original es de 960×720). Pero además del `alt` malformado (hallazgo 4), falta declarar que **960 px ampliados a 1920 px se ven blandos** — con `sizes="100vw"` y una sola candidate, en un monitor grande la foto se escala 2×. Pide el original ≥2400 px: correcto, sigue pendiente del cliente. |
| 7 | **Valores B2B sin confirmar, marcados `confirmed:false`** (L173) | **Coherente — mantener** | Verificado: `terms.ts` marca lo no confirmado y cada fila dice "potwierdzamy w wycenie". |
| 8 | **Sin cifras técnicas inventadas** (L181) | **Coherente — mantener** | `technical.ts` con "potwierdzamy w wycenie" en lo no confirmado. |
| 9 | **Galería sin fotos nuevas** (L213) | **Coherente — mantener** | El bloque de texto nuevo (~250-300 palabras ×3) cierra el thin content sin inventar imágenes. Slugs `/en/gallery/` y `/de/galerie/` con 301 desde `/en/projects/` y `/de/projekte/` — **verificado**: los stubs existen, son `noindex` y con canonical al destino. |
| 10 | **Envío fuera de Polonia sin prometer UE** (L231) | **Coherente — mantener** | La línea "Shipping outside Poland — quoted individually" / "Versand per Kurier innerhalb Polens" es honesta. Pero el `sameAs`/FAQ JSON-LD de EN/DE debe decir lo mismo que el visible: verificado, sí. |
| 11 | **`sameAs` solo con Facebook** (L281) | **Coherente — mantener** | `profiles: ['https://www.facebook.com/people/Doors-Obłogi/61557841376445/']`. Correcto: no inventar perfiles. |
**Los 11 desvíos son coherentes con `AGENTS.md` y ninguno debería cerrarse por decisión de diseño.** Pero **tres de ellos se han convertido en fugas de datos no confirmados** y deben pasar a la cola del cliente:

- `foundingDate: "2021"` (hallazgo 7) — el campo se publica como dato estructurado sin confirmación, y el informe de SEO ya lo había marcado como pregunta abierta. **Añadir un `TODO`/confirmación pendiente o quitarlo del JSON-LD.**
- `postalCode: '10-511'` (hallazgo 23) — añadido sin que yo pueda verificarlo. **Confirmar con el cliente.**
- `legalName` (desvío 4) — sin forma jurídica ni NIP, pero **sin marca de provisional** en el JSON-LD, a diferencia del email.

Y dos desvíos requieren **un ajuste técnico, no una decisión de negocio**:

- El desvío 6 (hero) arrastra el `alt` malformado (hallazgo 4).
- El desvío 2 (email provisional) convive con un email publicado en el JSON-LD de las 40 páginas.

---

**No verificado explícitamente:**

- `postalCode: '10-511'` (no hay artículo de Wikipedia para Słonecznik y no consulté un nomenclátor postal).
- LCP/INP en un dispositivo físico y con red real: medido en Chrome headless emulado (Fast/Slow 4G), no en un móvil real ni con RTT de red móvil real.
- `PUBLIC_QUOTE_ENDPOINT` real: probado con un stub HTTP local en `127.0.0.1:4399` (CORS incluido), no contra el endpoint de producción.
- No ejecuté axe-core ni Lighthouse (no están instalados y no instalé nada); la accesibilidad la medí con mis propios scripts + las fórmulas WCAG. Tampoco probé con lector de pantalla.
- El `alt` del hero: no verificado con un validador HTML formal (no hay `vnu`/`html-validate` instalado); lo que sí es concluyente es el HTML emitido (`alt` sin valor) y que el resto del sitio sí emite `alt=""`.
- La verificación posterior a los dos P0 (menú móvil y contraste del formulario) la ejecutó el agente principal; yo no la he re-ejecutado por la restricción de no reconstruir `dist/`.

---

**VERDICT: FAIL** — 2 P0 (menú móvil muerto en las 40 páginas por un `SyntaxError` en cada load; formulario de presupuesto ilegible en 15 páginas con contraste 1,07:1) más 5 P1. El andamiaje de verificación del repo (`npm run verify`) pasa con 0 problemas porque ninguno de sus scripts ejecuta el JS ni mide contraste. **Los dos P0 están ya corregidos (nota de estado); el resto de los hallazgos permanece abierto.**


