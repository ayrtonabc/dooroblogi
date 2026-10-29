# Crítica SEO — Doors Obłogi (doors-oblogi.pl)

**Autor:** consultor SEO senior (woodworking / B2B polaco)
**Fecha:** 21-10-2026
**Alcance:** auditoría del sitio ya construido (Astro 7, estático, 30 páginas indexables + 404). No se ha modificado código.
**Idioma del informe:** español.

> **Nota metodológica honesta:** no he verificado volúmenes de búsqueda con ninguna herramienta de keywords (no hay ninguna disponible en este entorno). **Todas las cifras de volumen que aparecen abajo son NO VERIFICADAS.** En su lugar, cada keyword se clasifica por **intención** y por **competibilidad real** para un fabricante local de Olsztyn — que es la variable que decide si el cliente gana o pierde. Donde el volumen es obviamente alto pero la competencia es inalcanzable, lo digo explícitamente.

---

## 1. Resumen ejecutivo

La base técnica está bien montada: build estático, sitemap correcto, hreflang recíproco y bien emparejado en las 30 páginas, JSON-LD de `Organization`/`WebSite`/`FAQPage`/`BreadcrumbList` presente, fuentes self-hosted con `font-display:swap`, `srcset` con `width`/`height` (0 CLS de imagen), un H1 por página y jerarquía H1→H2→H3 limpia. Eso es más de lo que hace el 90% de las webs de carpintería polaca.

El problema no es la técnica: **es la estrategia de término y de conversión**. Cuatro cosas están rotas de verdad:

1. **No hay ni un solo precio.** El dolor explícito del cliente en Facebook ("cennik i co macie w ofercie", en bucle) se responde en el sitio con "no lo publicamos". Cada visita B2B sin precio se va a buscar a otro.
2. **El sitio no tiene formulario real.** `endpoint = ''` → todo cae a un `mailto:` hacia un buzón (`kontakt@doors-oblogi.pl`) que el propio código marca como **provisional sin verificar**. Es exactamente el "problem miałem ostatnio żeby się z wami skomunikować" que ya le escribió un cliente.
3. **La versión DE está construida sobre un término que no existe en alemán** ("Oblag/Obläge" = polaco, ~40 apariciones, incluido el slug de URL) y la **EN sobre un término que significa otra cosa** ("oak lintel" = viga estructural, 38 apariciones en la home). Ninguna de las dos versiones puede ganar una búsqueda.
4. **Home y página de producto tienen el `<title>` idéntico en los tres idiomas.** Las dos páginas compiten entre sí por la misma keyword.

Además: **la imagen de Open Graph está rota en las 30 páginas** (404), y Facebook es el canal real del cliente.

---

## 2. Verificación realizada

| Qué | Cómo |
|---|---|
| Lectura completa de `src/**` (i18n, content, layouts, components, views, pages) | lectura directa |
| Build de producción | `npm run build` → **31 páginas, 0 errores**, `sitemap-index.xml` + `sitemap-0.xml` generados |
| `<head>` real de las 30 páginas | parsing de `dist/**/*.html` (title, description, canonical, hreflang, OG, Twitter) |
| JSON-LD emitido | extracción de los `<script type="application/ld+json">` del HTML generado |
| Longitudes de title/description | medición carácter a carácter sobre el HTML generado |
| Cabeceras de imagen | `System.Drawing` sobre los 11 JPG de `src/assets/images` |
| Peso de assets | `dist/_astro` (fuentes woff2, CSS, webp) |
| Rutas y sitemap | `dist/sitemap-0.xml` completo |

**No verificado (fuera de mi alcance aquí):** Search Console, GA4, backlinks, volumen real de keywords, y si `kontakt@doors-oblogi.pl` existe como buzón (no hay forma de comprobarlo sin acceso).

**Aviso de concurrencia:** durante la auditoría, otro proceso modificó `src/views/ProductView.astro` y `src/styles/global.css` (y creó `docs/CMS-INTEGRATION.md`). He vuelto a verificar ambos tras los cambios: **el hero (`global.css:657-668`, `object-fit: cover` sobre una imagen de 960×720) y el JSON-LD de producto (`ProductView.astro:36`) siguen igual**, por lo que los hallazgos P0-1, P1-11 y P1-17 no cambian. Solo se ha desplazado 2 líneas la referencia al H2 de galería, ya corregida a `ProductView.astro:135-136`. Este informe refleja el estado de `src/**` a las 15:38 del 21-10-2026.

---

## 3. Auditoría técnica — hallazgos verificados

| # | Ámbito | Estado | Evidencia |
|---|---|---|---|
| 1 | Canonical | ✅ correcto | 30/30 apuntan a su propia URL con barra final, coherente con `build.format: 'directory'` |
| 2 | hreflang | ✅ recíproco y emparejado | verificado en `/en/products/cut-oak-lintel/` ↔ `/produkty/oblog-debowy-ciety/` ↔ `/de/produkte/geschnittenes-eichen-oblag/`; `x-default` → PL en todas |
| 3 | Sitemap | ✅ | 30 URLs (404 excluido automáticamente), los 3 idiomas, sin duplicados |
| 4 | robots.txt | ✅ | `Allow: /` + `Sitemap:` apunta a un archivo que existe |
| 5 | Title | ❌ | 21 de 30 > 60 chars → truncamiento en SERP; 3 pares home/producto idénticos; marca duplicada en 3 páginas |
| 6 | Description | ⚠️ | 1 de 30 > 160 chars (`/produkty/panele-sufitowe-i-scienne/`, 165) |
| 7 | H1 | ❌ | 5 de 30 sin keyword ("Produkty", "Zdjęcia naszego drewna", "Poproś o cennik", "Zadzwoń albo wycenę", "Pracujemy w Słoneczniku pod Olsztynem") |
| 8 | OG image | ❌ **404** | `https://doors-oblogi.pl/hero-oblog-debowy.jpg` — no existe en `dist/` |
| 9 | twitter:image | ❌ **404** | misma URL |
| 10 | Schema image | ❌ | `https://doors-oblogi.pl/og-default.png` — no existe en `dist/` |
| 11 | Product schema | ❌ | `image: "panele-scienne-dab.jpg"` (nombre de archivo, **no es URL**); `offers` sin `price`; `availability: InStock` (es a medida); `offers.url` → home; sin `sku`/`mpn`/`gtin`/`manufacturer` |
| 12 | BreadcrumbList | ⚠️ | presente en producto/cennik/contacto; **ausente** en catálogo, "o nas" y galería. `schema.ts:42 breadcrumbSchema()` es **código muerto** (duplica `Breadcrumbs.astro`) |
| 13 | FAQPage | ⚠️ | solo en home, catálogo y contacto. Ausente en cennik (¡la página que más lo necesita!), productos, about, galería |
| 14 | LocalBusiness | ⚠️ | sin `priceRange`, `openingHoursSpecification`, `geo`, `hasOfferCatalog`, `knowsAbout`, `currenciesAccepted`, `paymentAccepted`; `streetAddress: "Słonecznik"` es el nombre de la aldea, no una calle; `addressRegion` con prefijo "województwo" |
| 15 | H1/H2/H3 | ✅ | 1 H1 por página, jerarquía limpia, footer con h2 |
| 16 | Open Graph | ⚠️ | `og:image:alt` = "Doors Obłogi" (inútil); falta `og:image:width/height`, `og:locale:alternate` |
| 17 | CWV — fuentes | ✅ | self-hosted, `font-display:swap`, `unicode-range` correcto, ~81 KB de latin |
| 18 | CWV — hero / LCP | ❌ | `hero-oblog-debowy.jpg` es de **960×720** y se sirve a `sizes="100vw"` con `object-fit:cover` → reescalado a 1920 px en escritorio; `srcset` solo ofrece 960w |
| 19 | CWV — CLS | ✅ | todas las `<img>` con `width`/`height` |
| 20 | Peso de página | ✅ | `index.html` 26,8 KB, CSS 24,6 KB, fuentes ~81 KB |
| 21 | Accesibilidad SEO | ⚠️ | `<nav aria-label="Breadcrumb">` en inglés en PL/DE; nav desktop + móvil duplican anchors (Contact ×3, Products ×5) |
| 22 | Thin content | ❌ | galería 864 palabras, "o nas" 908 — y la galería es de producto, no de proyectos |
| 23 | Duplicación idiomas | ✅ | cada idioma tiene su propio texto, no hay hreflang duplicado ni contenido espejo |
| 24 | 404 | ⚠️ | solo en PL; sus hreflang apuntan a `/en/404/` y `/de/404/` **inexistentes** |
| 25 | Canonical/hreflang 404 | ⚠️ | `x-default` del 404 apunta a la home |
| 26 | Formulario | ❌ | sin backend (`endpoint=''`) → `mailto:`; email provisional sin verificar; sin campos estructurados de dimensiones |

---

## 4. El problema de categoría EN/DE (esto es lo más grave del informe)

### 4.1 DE — "Oblag" no existe en alemán

`obłóg` es polaco. En alemán la listón de remate es **Abschlussleiste**, **Leiste**, **Profil** o **Blende**. El sitio usa "Eichen-Oblag" / "Obläge" **~40 veces**: en `<title>`, en `<h1>`, en `<h2>`, en los `alt`, en el JSON-LD y **en los slugs de URL**.

```
/de/produkte/geschnittenes-eichen-oblag/     ← nadie busca esto en alemán
/de/produkte/geraucherte-eichen-oblag/
```

Consecuencias:
- **Demanda cero.** No existe consulta que провести a esa URL.
- **Huele a traducción automática.** Un carpintero alemán lee "Eichen-Oblag" y se va.
- **El slug está quemado.** Si hoy no indexa nada, cambiarlo es gratis. En cuanto indexe, hay que pedir redirecciones 301.
- Peor: el DE dice literalmente *"Obläge sind Eichen-Abschlussleisten"* — traduce y define el término equivocado en la propia página.

**Terminología DE correcta a usar (propuesta, a validar con un nativo o con el cliente):**

| Actual | Propuesta | Por qué |
|---|---|---|
| Eichen-Oblag | **Eichen-Abschlussleiste** | término real y el más buscado del sector |
| Eichen-Obläge | **Eichenleisten** | plural natural |
| Eichen-Oblag (slug) | `eichen-abschlussleiste` | sin prefijo artificial, keywords reales |
| geschnittenes Eichen-Oblag | **Eichen-Abschlussleiste auf Maß** | "auf Maß" es la intención de búsqueda real |
| Eichen-Lamelle | **Eichenlamelle** | en alemán se escribe unido |
| Doors-Obłogi-Oblägen | **Doors Obłogi Eichenleisten** | "Obłogi" dentro de un compuesto alemán es intruso |

### 4.2 EN — "oak lintel" significa otra cosa

En inglés, **lintel = viga estructural sobre una puerta o una ventana**. Es un producto con norma, cálculo estructural y compras de obra. Lo que hace el cliente es un **listón de remate decorativo**, que en inglés se llama **oak trim / oak edging / oak batten**.

Consecuencias:
- **El término estádirected al producto equivocado.** El H1 inglés dice *"Oak lintel, cut to your size"*. Un carpintero inglés lee eso y piensa en una viga.
- **La lista de keywords inglesas está construida sobre esa falsa equivalencia**: `oak lintel, oak trim battens, cut oak lintel, oak skirting, oak trim to size` — 2 de 5 apuntan al término equivocado.
- **Es un claim falso de categoría**, exactamente el patrón que hay que evitar: si un buyer inglés de UK encuentra "oak lintel" y descubre que recibe un listón de 20 mm, se pierde el cliente y la reputación en ese mercado.

**Reemplazo EN recomendado:**

| Actual | Propuesta |
|---|---|
| Cut oak lintel | **Oak trim battens, cut to size** |
| Oak lintel | **Oak trim** / **oak edging** |
| Smoked oak lintel | **Smoked oak trim battens** |
| Oak batten 4–8 mm | se mantiene ✅ |
| Oak ceiling and wall panels | se mantiene ✅ |
| `oak skirting` (en keywords) | **eliminar** — no venden zócalo |

### 4.3其他 residuos de traducción en EN/DE

- `src/content/pages.ts:22` — hero EN: *"Oak trim battens, **battens** and ready-made ceiling and wall panels."* → palabra duplicada.
- `src/components/Header.astro:43` y `src/components/Footer.astro:37` — el claim de marca **"Naturalny dąb"** (polaco) aparece en el header y el footer de las páginas EN y DE.
- `src/content/products.ts:624, 747`, `src/views/HomeView.astro:186`, `src/views/GalleryView.astro:134` — **"Doors-Obłogi-Oblägen"**: mezcla polaco-alemana dentro de un compuesto alemán.
- `src/i18n/ui.ts:90` — `'Häufige Fragen zu Eichen-**Obklagen**'`: otro compuesto inventado (clave no usada, pero indica que la revisión no se hizo).
- `src/views/ProductView.astro:133` — el H2 de galería EN es *"{nombre} up close"* y el DE *"{nombre} im Detail"*: gramaticalmente correctos pero sin keyword.

---

## 5. Mapa de keywords con intención real

### 5.1 PL — mercado principal

#### Tier 1 — a atacar YA (volumen bajo o medio, competencia casi nula, intención de compra)

| Keyword | Intención | Página objetivo | Por qué la busca el cliente real | Competibilidad |
|---|---|---|---|---|
| **obłóg dębowy** | comercial / transaccional | `/` (home) | Término de su propia categoría. El stolarz escribe exactamente esto. | **Muy baja.** Término polaco-específico y poco usado. Ningún grande lo tiene cubierto. |
| **obłóg dębowy cięty** | transaccional | `/produkty/oblog-debowy-ciety/` | Busca el que ya está cortado, no en bruto. Es su producto con valor añadido. | Baja |
| **obłóg dębowy na wymiar** | transaccional | `/produkty/oblog-debowy-ciety/` | Expresa la ventaja (corte a medida). | Baja |
| **obłogi dębowe** | comercial | `/produkty/` | Plural, el que escribe unOCA que ya sabe lo que quiere. | Baja |
| **obłóg dębowy wędzony** | transaccional | `/produkty/oblog-debowy-wedzony/` | Diferenciador claro y visual. Pocos proveedores lo tienen. | **Muy baja** |
| **dąb wędzony** | comercial | `/produkty/oblog-debowy-wedzony/` | Busca el material, no el listón. | Baja |
| **lamela dębowa** | transaccional | `/produkty/lamela-debowa/` | Su segundo producto con nombre propio. | Baja |
| **lamela dębowa 4 mm / 8 mm** | transaccional | `/produkty/lamela-debowa/` | Long-tail con la especificación exacta. | **Muy baja** |
| **listwa dębowa wykończeniowa** | comercial | `/produkty/oblog-debowy-ciety/` | Cómo lo llama el comprador, no el fabricante. | Baja |
| **dąb bez sęków / dąb z sękami** | comercial | `/produkty/panele-sufitowe-i-scienne/` + sección selección de la home | **Su diferenciador real** (la home ya lo cuenta: *"Sęk, który… zostaje — bo to on robi z listwy charakter"*). Nadie más lo tiene. | **Muy baja** |
| **panele sufitowe dębowe / panele ścienne dębowe** | transaccional | `/produkty/panele-sufitowe-i-scienne/` | Su tercer producto. | Baja-media |
| **obłóg okienny / listwa okienna dębowa** | transaccional | sección nueva en `/produkty/oblog-debowy-ciety/` | **No lo atacan en ninguna parte.** Uso principal del obłóg. | **Muy baja** |
| **hurtownia / producent / dostawca obłogów dębowych** | comercial | nueva sección B2B en `/produkty/` | Cómo busca un comprador profesional. Volumen bajo, **cero competencia**. | **Muy baja** |
| **dąb na wymiar dla stolarza / obłogi dla stolarzy** | comercial | nueva página B2B | El comprador es el stolarz; busca supply chain, no producto. | **Muy baja** |
| **obłóg dębowy Olsztyn** / **obłogi dębowe warmińsko-mazurskie** / **obłóg dębowy Mazury** | comercial local | sección local en `/o-nas/` | **Su ventaja geográfica.** Un proveedor de Olsztyn gana este filtro sin esfuerzo. | **Prácticamente 0** |
| **panele SEDO** | navegacional | `/produkty/panele-sufitowe-i-scienne/` | Ya es cliente suyo y genera referidos. | 0 |

#### Tier 2 — a atacar a medio plazo (competencia real, pero con ángulo local/B2B)

| Keyword | Intención | Página objetivo | Observación |
|---|---|---|---|
| `listwy dębowe` | comercial | `/produkty/oblog-debowy-ciety/` | Volumen alto, **competencia alta** (marketplaces, sawmills). Ganar solo con ángulo "na wymiar / dla stolarzy". |
| `boazeria dębowa` | comercial | `/produkty/panele-sufitowe-i-scienne/` | Volumen alto y competido. No es la keyword principal; usarla como **secundaria** en la página de paneles, no como H1. |
| `panele boazeriowe dębowe` | comercial | `/produkty/panele-sufitowe-i-scienne/` | Más específica que "boazeria dębowa" → mejor relación intención/competencia. |
| `dąb cięty na wymiar` | comercial | `/` + `/produkty/` | Amplia; encaja con su posicionamiento de taller. |
| `listwy dębowe do zabudowy` | transaccional | `/produkty/lamela-debowa/` | Long-tail con consumidor final claro. |
| `obłóg do drzwi przesuwnych` | transaccional | sección "Zastosowania" de la home | Long-tail con muy poca competencia. |
| `cennik obłogów dębowych` | comercial | `/cennik/` | Ya está en el title ✅. Pero la página **no publica precio** → decepción. Ver P0-3. |

#### Keywords que NO debe atacar (no puede ganar o le harían daño)

| Keyword | Por qué no |
|---|---|
| `deski dębowe`, `deska dębowa na wymiar` | Volumen muy alto, competencia nacional (sawmills, marketplaces). Solo como modificador, nunca como H1. |
| `parkiet / podłoga dębowa / tarce / deski podłogowe` | **Categoría distinta.** No venden suelo. |
| `meble dębowe`, `meble z dębu` | **Su propia web dice "Nie robimy mebli"** (`pages.ts:363`). Reclamar esta categoría sería un claim falso. |
| `listwa przypodłogowa` (genérica) | Volumen alto, competido. Su obłóg no es un zócalo standard. |
| `dąb biały / dąb francuski / dąb amerykański` | No los trabajan. Claim falso. |
| `hurtownia drewna`, `sklep z drewnem`, `Allegro`, `OLX` | Intención e-commerce/marketplace: no hay checkout ni stock online. |
| `panele 3D`, `panele drewniane` (genérico) | Producto distinto. |
| `stolarz Olsztyn` | **Son clientes potenciales, no ellos.** No pueden posicionarse como carpinteros. |

### 5.2 EN — carpinteros y contratistas de la UE (no contra sitios globales)

| Keyword | Intención | Página objetivo | Por qué la busca | Competibilidad |
|---|---|---|---|---|
| **oak trim battens** | comercial | `/en/products/` (nueva URL) | El carpintero inglés busca "trim" o "edging" para zócalos, jambas y remates. | Baja |
| **oak edging** | comercial | misma | Término de ofimática Britain. | Baja |
| **oak battens** | comercial | `/en/products/oak-batten/` | Directo. | Baja |
| **oak battens cut to size** | transaccional | `/en/products/oak-batten/` | El diferenciador es el corte. | **Muy baja** |
| **smoked oak trim** / **smoked oak battens** | transaccional | `/en/products/smoked-oak-lintel/` (URL a cambiar) | Difícil de encontrar proveedor con selection "con y sin nudos". | Baja |
| **oak ceiling panels** / **oak wall panels** | comercial | `/en/products/ceiling-and-wall-panels/` | Directo. | Baja-media |
| **oak cladding supplier** | comercial | `/en/products/` | El comprador busca **proveedor**, no producto suelto. | Baja |
| **hardwood trim supplier Poland** | comercial | `/en/about/` | Une el término con el origen: **casi nadie lo hace**. | **Muy baja** |
| **timber cut to size Poland** | transaccional | `/en/price-list/` | B2B con envío a UE. | Baja |

**No atacar en EN:** `oak flooring`, `hardwood flooring`, `oak lumber`, `oak planks wholesale` (compiten con grandesScreenriers de madera europeos), `oak lintel` (categoría equivocada).

### 5.3 DE — carpinteros y contratistas de la UE

| Keyword | Intención | Página objetivo | Por qué la busca | Competibilidad |
|---|---|---|---|---|
| **Eichen-Abschlussleiste** | comercial | `/de/produkte/` | El término real. | Baja |
| **Eichenleisten** | comercial | `/de/produkte/` | Plural, el más consultado. | Baja |
| **Eichenleiste nach Maß / auf Maß** | transaccional | `/de/produkte/geschnittenes-eichen-oblag/` (URL a cambiar) | Intención de encaje directo. | **Muy baja** |
| **Eichenlamelle / Eichen-Lamellen** | comercial | `/de/produkte/eichen-lamelle/` | Directo. | Baja |
| **Eichen-Deckenpaneele / Eichen-Wandpaneele** | comercial | `/de/produkte/decken-und-wandpaneele/` | Directo. | Baja |
| **räucherte Eiche / Eichenleiste geräuchert** | transaccional | `/de/produkte/geraucherte-eichen-oblag/` | Difícil de encontrar. | Baja |
| **Eichenprofil / Eichenblende** | comercial | `/de/produkte/` | Sinónimos de搜索 reales. | Baja |
| **Massivholzleiste Eiche Hersteller Polen** | comercial | `/de/ueber-uns/` | Proveedor + origen. | **Muy baja** |

**No atacar en DE:** `Eichenboden`, `Eichenparkett`, `Parkettdiele`, `Holzwerkstoffe`, `Massivholzplatten`, `Eichenbalken` (categorías distintas).

### 5.4 Keyword principal que el sitio debe atacar en PL

> **`obłóg dębowy`** — como *head term* en la home (`<title>`, `<h1>`, `<h2>` y anchor text), con **`obłóg dębowy cięty` / `obłóg dębowy na wymiar`** en la página de producto y **`obłóg dębowy Olsztyn`** en la página de ubicación.
> Es un término de categoría **nicho y propio**, donde un fabricante de Olsztyn con contenido decente está en la posición 1-3, y donde los national marketplaces no compiten porque no es un producto de catálogo.

---

## 6. Copy localizado — lista de residuos

| Archivo:línea | Texto actual | Texto corregido |
|---|---|---|
| `src/content/pages.ts:22` | `Oak trim battens, battens and ready-made…` | `Oak trim battens, slats and ready-made ceiling and wall panels.` |
| `src/content/pages.ts:18` | `Eichen-Oblag, auf Ihr Maß geschnitten` | `Eichen-Abschlussleisten, auf Maß geschnitten` |
| `src/content/pages.ts:36, 55, 57, 76, 145, 169, 271, 373, 448` | `Oblag` / `Obläge` (9 sitios) | `Abschlussleiste` / `Abschlussleisten` |
| `src/content/products.ts:42, 47, 66, 76, 85, 93, 208, 213, 218` | `Eichen-Oblag` (9 sitios) | `Eichen-Abschlussleiste` |
| `src/content/products.ts:227, 232, 261, 270, 385, 390, 395` | `geraucherte-eichen-oblag` / `Geräuchertes Eichen-Oblag` | `eichen-abschlussleiste-geraeuchert` / `Geräucherte Eichen-Abschlussleiste` |
| `src/content/products.ts:428, 429, 538, 586, 591, 605, 607, 624, 740, 747, 752` | `Oblag` + `Doors-Obłogi-Oblägen` (11 sitios) | `Abschlussleiste` + `Doors Obłogi Eichenleisten` |
| `src/content/schema.ts:16` | `Eichen-Obläge` | `Eichen-Abschlussleisten` |
| `src/components/Header.astro:43` | `Naturalny dąb` (en PL/EN/DE) | `Naturalny dąb` / `Natural oak` / `Natürliche Eiche` |
| `src/components/Footer.astro:37` | `Naturalny dąb` (en PL/EN/DE) | ídem |
| `src/views/HomeView.astro:73, 86, 186, 199` | `Oblag` / `Obłogi` | `Abschlussleiste` |
| `src/views/GalleryView.astro:22, 27, 36, 41, 50, 64, 69, 120, 134` | `Oblag` | `Abschlussleiste` |
| `src/views/AboutView.astro:39, 89` | `Eichen-Oblag` | `Eichen-Abschlussleiste` |
| `src/views/CatalogView.astro:63` | `Fragen zu Oblägen…` | `Fragen zu Abschlussleisten…` |
| `src/layouts/BaseLayout.astro:62` | `geschnittene Eichen-Obläge` | `geschnittene Eichen-Abschlussleisten` |
| `src/pages/de/**/index.astro` (6 archivos) | `Eichen-Obläge` en title/description | `Eichen-Abschlussleisten` |
| `src/i18n/ui.ts:90` | `Eichen-Obklagen` | `Eichen-Abschlussleisten` |
| `src/content/products.ts:217` | keyword `oak skirting` | **eliminar** (no venden zócalo) |
| `src/content/products.ts:393` | keywords `dąb bejcowany`, `obłóg dębowy bejcowany` | **eliminar** — contradice su propio copy: *"Wędzenie to nie farba"* |
| `src/views/ProductView.astro:135-136` | `"{nombre} up close"` / `"{nombre} im Detail"` | `"{nombre} — details and profiles"` / `"{nombre} — Details und Profile"` |

---

## 7. Estrategia de conversión — evaluación y huecos

**¿Convierte el sitio a un stolarz/contractor en cliente?** No. El sitio está bien escrito y la marca es creíble, pero en el momento en que el comprador B2B decide, le faltan **datos objetivos** para comparar y para terhadap la objeción de precio.

Los tres dolores que el cliente ha hecho públicos en Facebook son exactamente los tres que el sitio no resuelve:

| Dolor real del cliente (Facebook) | Estado en el sitio | Hueco |
|---|---|---|
| "Ciennik i co macie w ofercie" (en bucle) | `pages.ts:468`: *"Cennik zależy od profilu, długości… więc nie publikujemy go na stronie"* | **Sin precio, sin rango, sin fórmula** |
| "Problem miałem ostatnio żeby się z wami skomunikować i coś zamówić" | `QuoteForm.astro:22`: `endpoint = ''` → `mailto:` a un buzón provisional | **Sin formulario real, sin WhatsApp, sin Messenger** |
| "Sprzedajecie tylko hurtowo?" | FAQ responde *"napisz w zapytaniu, jaka jest skala zamówienia"* | **Sin MOQ, sin condiciones de pago, sin formato de entrega** |

### Huecos concretos (lo que un comprador B2B necesita antes de escribir)

1. **Precio.** Mínimo un rango orientativo por unidad de venta (`zł/mb`, `zł/m²`, `zł/szt.`) por producto y por selección, aunque sea "od X do Y". O una **fórmula explícita** ("cena = metraż × profil × número de piezas"). O un **PDF descargable**. Hoy: cero.
2. **MOQ (minimum de pedido).** Nunca aparece. Un stolarz necesita saber si puede pedir 3 listwy o si el mínimo son 50 m.
3. **Lead time comprometido.** El FAQ dice *"zazwyczaj jest to kilka dni roboczych"* (`pages.ts:334`). "Zazwyczaj" no es un SLA. Necesita un plazo por producto y un plazo de confirmación de la oferta.
4. **Condiciones de pago.** No hay nada: ni prepayment, ni factura VAT, ni plazo de pago, ni si los precios son brutos/netos. **Para un comprador polaco la factura VAT es condición de entrada**, no un extra.
5. **Origen del madera y certificaciones.** Cero. En 2026 el primer carpintero que compra madera en masa pregunta **de dónde viene**. El sitio solo dice "100% naturalny dąb" sin una sola prueba. Falta: origen (Europa — por qué no Rusia/Bielorrusia), FSC/PEFC si lo tienen, contenido de humedad, densidad, dureza, certificación de conformidad, y qué significa exactamente "bez kompromisów".
6. **Datos técnicos de la madera.** La tabla de specs tiene Material / Grubość / Długość / Profil / Wysyłka. Le falta: **% de humedad**, densidad, dureza (Brinell), tolerancia de largo/pr Cross, rango de sección completo, tipo de perfil disponible (¿cuáles exactamente?), sistema de montaje, y si las lamelas van canteadas o con bisel.
7. **Portafolio real de proyectos.** La galería (`/realizacje/`) son 9 fotos de producto en el taller. **Cero** foto de obra terminada con obłogi instalados. Un contratista no compra "fotos de fábrica": compra "he visto esto montado en un cliente que se parece a mí".
8. **Descargables.** No hay ficha técnica PDF, ni cennik PDF, ni hoja de cálculo de metraje. El comprador B2B necesita **reenviar un archivo a su jefe**.
9. **Formulario estructurado.** Hoy es un textarea libre titulado "Wymiary i zastosowanie". Debería tener campos: producto, longitud, sección (mm), grosor (4/8 mm), cantidad (m o szt.), tipo de entrega (pallet / suele), país, y **fecha requerida**. Un lead cualificado ahorra 3 emails.
10. **Canal de contacto que funciona.** El canal real del cliente es Facebook. Falta un botón de **Messenger** (el buyer escribe desde FB y llega a un inbox que ya mira) y **WhatsApp**. En móvil, un `tel:` sticky es la conversión más rápida.
11. **Sección B2B dedicada.** El FAQ dice que trabajan "głównie ze stolarzami, wykonawcami zabudowy i firmami wykończeniowymi", pero **no hay ni un bloque de contenido** dirigido a ellos: nada sobre pedidos recurrentes, consistencia de partida, contrato, factura, plazo.
12. **Sección de pago/entrega.** No hay página "Dostawa i płatności", ni "Współpraca hurtowa". Para un comprador institucional, su proveedor tiene que tener un apartado de supply chain.

---

## 8. LISTA NUMERADA DE PROBLEMAS Y CAMBIOS

### P0 — bloqueantes (arreglar antes de invertir en|linkbuilding o en posicionar EN/DE)

**P0-1 · Open Graph y Twitter image 404 en las 30 páginas**
`src/layouts/BaseLayout.astro:33, 123, 129` → `new URL('hero-oblog-debowy.jpg', site)` resuelve a `https://doors-oblogi.pl/hero-oblog-debowy.jpg`, que **no existe** (las imágenes están en `src/assets`, se hashean). Verificado en `dist/`.
**Solución:** pasar la URL real del asset. Opción recomendada: mover el hero a `public/og/` y usar `ogImage="/og/doors-oblogi-1200x630.jpg"`, o generar con `getImage()` y pasar `image.src`. Crear **una imagen 1200×630 por página** (o al menos 4: home, 4 productos, contact). Facebook es el canal del cliente: hoy cualquier enlace al sitio se comparte sin imagen.

**P0-2 · `og-default.png` 404 en el JSON-LD de la organización**
`src/layouts/BaseLayout.astro:54` → `"image": new URL('/og-default.png', site).href`. El archivo no está en `public/`.
**Solución:** crear `public/og-default.png` (o JPG) con el logo/marca y apuntar ahí. Google usa `image` de `Organization` para el knowledge panel.

**P0-3 · Cero información de precio → se pierde el lead B2B**
`src/content/pages.ts:468` (lead de cennik) + `src/views/QuoteView.astro` + `src/content/products.ts` (tablas de specs sin fila de precio).
**Solución:** en `/cennik/` y en cada página de producto, añadir (a) un **rango orientativo por unidad de venta** (`od X zł/mb`), (b) la **fórmula de cálculo**, (c) un enlace a **cennik PDF descargable**. Mínimo viable y honesto: un bloque "Orientacyjne ceny" con 3 filas por producto. Sin esto, todo el trabajo SEO de attracting tráfico se convierte en tráfico que no convierte.

**P0-4 · El formulario no llega a ninguna parte + email sin verificar**
`src/components/QuoteForm.astro:22` (`const endpoint = ''`) → cae al `mailto:` de la línea 251, y `src/content/company.ts:38` (`kontakt@doors-oblogi.pl`) está marcado como **provisional con TODO** en las líneas 34-37.
**Solución:** (a) confirmar con el cliente que el buzón existe y es el bueno; (b) conectar `endpoint` a un backend real (SEO Grow API ya está previsto en el propio `company.ts:5`, o Formspree/Netlify Forms como interim); (c) añadir **WhatsApp** (`https://wa.me/48696741679?text=...`) y **Messenger** (`https://m.me/...`) como CTA alternativos al formulario; (d) campo oculto `context` ya se manda ✅. **Este punto es el que replica exactamente la queja pública del cliente.**

**P0-5 · La versión DE usa un término inexistente en alemán (~40 ocurrencias, incluido el slug)**
`src/content/products.ts` (22 sitios), `src/content/pages.ts` (9), `src/views/HomeView.astro` (4), `src/views/GalleryView.astro` (9), `src/views/AboutView.astro` (2), `src/views/CatalogView.astro` (1), `src/layouts/BaseLayout.astro:62`, `src/content/schema.ts:16`, `src/pages/de/**` (6).
**Solución:** sustituciones de la tabla de la §6 + **cambio de slug con 301** desde `/de/produkte/geschnittenes-eichen-oblag/` → `/de/produkte/eichen-abschlussleiste-auf-mass/`, de `/de/produkte/geraucherte-eichen-oblag/` → `/de/produkte/geraeucherte-eichen-abschlussleiste/`, de `/de/produkte/eichen-lamelle/` → `/de/produkte/eichenlamelle/`. Como hoy la versión DE no tiene visibilidad, **es el momento barato de hacerlo**.

**P0-6 · La versión EN usa "oak lintel", que significa viga estructural (38 ocurrencias en la home)**
`src/content/products.ts` (keywords y copy EN), `src/content/pages.ts`, `src/views/*`, `src/pages/en/**`, `src/pages/en/products/[slug].astro` (slug `cut-oak-lintel`, `smoked-oak-lintel`).
**Solución:** reescribir el término a **"oak trim" / "oak edging" / "oak trim battens"** en title, H1, H2, body, alt y keywords; cambiar slugs a `/en/products/oak-trim-battens/` y `/en/products/smoked-oak-trim/` con 301. Además **eliminar `oak skirting`** de `products.ts:217`. Este punto no es solo SEO: es un claim de categoría falso que puede costar el mercado inglés entero.

**P0-7 · `<title>` de home y de producto son IDÉNTICOS en los tres idiomas → canibalización de la keyword principal**
- PL: `src/pages/index.astro:14` = `src/content/products.ts:206` + `src/pages/produkty/[slug].astro:30` → *"Obłóg dębowy cięty na wymiar — naturalne listwy dębowe — Doors Obłogi"* (69 chars, los dos).
- EN: `src/pages/en/index.astro:14` = `products.ts:207` → 64 chars idénticos.
- DE: `src/pages/de/index.astro:14` = `products.ts:208` → 79 chars idénticos.
**Solución — títulos distintos, < 60 chars, con keyword:**
- Home PL: `Obłogi dębowe — producent w Olsztynie | Doors Obłogi`
- Home EN: `Oak trim battens — supplier in Poland | Doors Obłogi`
- Home DE: `Eichen-Abschlussleisten — Hersteller aus Polen | Doors Obłogi`
- Producto 1 PL: `Obłóg dębowy cięty na wymiar — Doors Obłogi`
- Producto 1 EN: `Oak trim battens cut to size — Doors Obłogi`
- Producto 1 DE: `Eichen-Abschlussleiste auf Maß — Doors Obłogi`

**P0-8 · Claims falsos dentro de la propia lista de keywords**
`src/content/products.ts:393` → keywords PL incluyen `dąb bejcowany, obłóg dębowy bejcowany` (no lo ofrecen; su propio body en la línea 241 dice *"Wędzenie to nie farba"*). `src/content/products.ts:217` → keywords EN incluyen `oak skirting` (no venden zócalo).
**Solución:** eliminar ambas. Ninguna keyword debe prometer algo que el catálogo no entrega.

---

### P1 — importantes (impacto directo en ranking y conversión)

**P1-9 · Marca duplicada en el title de 3 páginas de producto**
`src/pages/produkty/[slug].astro:30` (y equivalentes EN/DE) añaden `" — Doors Obłogi"` a un `seoTitle` que **ya lo contiene** (producto 4: `products.ts:745`).
Resultado real: *"Panele sufitowe i ścienne z dębu — z obłogów Doors Obłogi — Doors Obłogi"* (72 chars).
**Solución:** quitar el sufijo de las plantillas y dejar que `BaseLayout.astro:47` añada la marca, **o** quitar "Doors Obłogi" de los `seoTitle`. Nunca ambos.

**P1-10 · 21 de 30 titles > 60 caracteres → truncamiento en SERP**
Verificado sobre el HTML generado (el listado completo está en la §3).
**Solución:** todos los titles < 60 chars. Plantilla: `[Keyword principal] — [modificador] | Doors Obłogi`. El sufijo "— Doors Obłogi" (15 chars) es correcto; el problema es el resto.

**P1-11 · `Product` schema inválido/incompleto**
`src/content/schema.ts:13` → `image: product.image.src` devuelve `"panele-scienne-dab.jpg"`, **un nombre de archivo, no una URL** → Google no puede indexar la imagen del producto. `src/content/schema.ts:24-37` → `offers` sin `price` (obligatorio en Merchant listings), `availability: InStock` (es a medida), `offers.url` → la home en vez del producto, y sin `sku`/`mpn`/`gtin`/`manufacturer`.
**Solución:** `image: new URL(image(product.image.src).src, site).href` (o el `src` ya hasheado del asset); `offers.url` → URL canónica del producto; `availability: "https://schema.org/PreOrder"`; añadir `sku: product.id`, `mpn`, `manufacturer: { '@id': ...#organization }`; y sustituir `priceSpecification` por `priceSpecification: { '@type':'PriceSpecification', priceCurrency:'PLN', valueAddedTaxIncluded:true, minPrice/price }` cuando haya rango, o eliminar `offers` y declarar `offers: { '@type':'Offer', availability, priceCurrency, url, seller }` solo con `additionalProperty` si no hay precio.

**P1-12 · `BreadcrumbList` ausente en 3 páginas + código muerto**
`src/views/CatalogView.astro`, `src/views/AboutView.astro`, `src/views/GalleryView.astro` no montan `<Breadcrumbs>`. `src/content/schema.ts:42-51` (`breadcrumbSchema`) **no se usa en ningún sitio** (`Breadcrumbs.astro:14-22` ya emite el JSON-LD).
**Solución:** montar `<Breadcrumbs>` en las 3 vistas (reutilizando los `routes` de `src/i18n/index.ts:59-66`) y **borrar `breadcrumbSchema` de `schema.ts`**.

**P1-13 · `FAQPage` ausente justo donde más rinde: `/cennik/` y las páginas de producto**
`FaqList` solo se usa en `HomeView.astro:224`, `CatalogView.astro:67`, `ContactView.astro:112`.
**Solución:** añadir a `/cennik/` una FAQ de 6 preguntas **de precio** (MOQ, forma de cobro, plazo, factura VAT, envío a UE, muestras) y a cada producto 3 preguntas específicas (tolerancias,湿度, montaje). Es la vía más barata de capturar *long-tail* transaccional en PL.

**P1-14 · `LocalBusiness` incompleto para lo que Google necesita de una empresa local**
`src/layouts/BaseLayout.astro:49-76`.
**Faltan:** `priceRange` ("€€"), `openingHoursSpecification` (Mo-Fr 08:00-16:00, ya está en `pages.ts:576`), `geo` (lat/long de Słonecznik/Olsztyn), `hasOfferCatalog` con los 4 productos, `knowsAbout`, `currenciesAccepted: "PLN"`, `paymentAccepted`, `email` (hoy `contactEmail` no está en el JSON-LD), `logo`. **Errores de datos:** `streetAddress: "Słonecznik"` es el nombre de la aldea, no una calle (`src/content/company.ts:51`) — si no hay calle, usar solo `addressLocality`/`addressRegion` y `areaServed` con `Place` Olsztyn; `addressRegion: "województwo warmińsko-mazurskie"` incluye el prefijo (`company.ts:23-26`) → debe ser `warmińsko-mazurskie`.

**P1-15 · `areaServed` dice solo "Poland" en las 3 versiones**
`src/layouts/BaseLayout.astro:67` es fijo, pero EN/DE apuntan al mercado UE.
**Solución:** parametrizar por locale: PL → `{ '@type':'Country', name:'Poland' }` + `{ '@type':'Place', name:'Olsztyn' }`; EN/DE → `{ '@type':'AdministrativeArea', name:'European Union' }` + Poland.

**P1-16 · Sin política de privacidad (RODO/GDPR) — hueco legal, no solo SEO**
`src/i18n/ui.ts:96` define `'footer.cookies'` ("Polityka prywatności" / "Privacy policy" / "Datenschutz") pero **la clave no se usa en ningún componente** y **la página no existe**. El formulario de `QuoteForm.astro:93-98` pide consentimiento al procesamiento de datos **sin enlace a ninguna política**.
**Solución:** crear `/polityka-prywatnosci/` (+ `/en/privacy-policy/`, `/de/datenschutz/`), enlazarla en el footer y en el label de consentimiento del formulario, y añadir `legalName` real (DPIA) a `company.ts`.

**P1-17 · El H1 del hero es de 960×720 y se reescala a `100vw` → LCP e imagen inválida**
`src/assets/images/hero-oblog-debowy.jpg` = **960×720** (medido), servido en `src/views/HomeView.astro:23-32` con `widths={[960,1440,1920]}` (Astro solo genera 960w porque no puede ampliar) y `sizes="100vw"`; CSS `global.css:663-668` con `object-fit:cover`.
**Solución:** (a) conseguir del cliente el original en ≥2400 px vía Facebook (le pide fotos de taller de alta resolución), o (b) **recortar a 16:9 y usar 1920 px de ancho** con `widths={[960,1440,1920]}` reales, o (c) al menos `sizes="(min-width:60rem) 50vw, 100vw"` y un `srcset` de 2 candidatos. Afecta al LCP de **todas** las páginas (el hero es el elemento above-the-fold) y a la elegibilidad para Google Images.

**P1-18 · Falta el bloque de datos que un comprador B2B exige (garantías, MOQ, pago, entrega)**
Ningún archivo lo tiene: `src/content/pages.ts` (FAQ, 6 preguntas), `src/content/company.ts` (solo teléfono/ubicación/envío).
**Solución — bloque nuevo "Warunki współpracy" / "Terms"**, visible en `/cennik/` y en cada página de producto, con 6 filas exactas: **MOQ** (cantidad mínima por pedido y por partida), **Lead time** (comprometido por producto), **Forma de pago** (pretransferencia / factura VAT, plazo), **Entrega** (currier, packaging, paletización), **Muestras** (envío de 1 muestra de perfil) y **Garantía** (rectificación de medidas, tolerancia). Texto sugerido PL: *"Minimalne zamówienie: X mb / Y szt. Realizacja: Z dni roboczych od potwierdzenia wymiarów. Płatność: przelewem lub fakturą VAT, termin płatności 14 dni. Wysyłka: kurier, cała Polska; na życzenie paleta."* — **los valores concretos los tiene que confirmar el cliente**.

**P1-19 · Cero datos técnicos de la madera ni origen**
`src/content/products.ts` specs: solo Material / Grubość / Długość / Profil / Wysyłka. **Falta:** % de humedad, densidad, dureza, tolerancia de corte, sección máxima, incompletitud de origen.
**Solución:** añadir 4 filas a la tabla de specs de cada producto (** wilgotność**, **gęstość**, **tolerancja długości/przekroju**, **kraj pochodzenia drewna**) y un bloque corto en `/o-nas/`: "Drewno: dąb europejski, certyfikat pochodzenia / FSC / PEFC — [lo que el cliente tenga]". En 2026 la pregunta "¿skąd to drewno?" es la primera que hace un comprador de madera en volumen. **Es el argumento de venta #1 que el sitio no toca.**

**P1-20 · No hay contenido para los tres segmentos que el cliente dice atender**
`src/content/pages.ts:286` (FAQ): *"Pracujemy głównie ze stolarzami, wykonawcami zabudowy i firmami wykończeniowymi"*. Pero no hay ni un bloque para ellos.
**Solución:** añadir en `/produkty/` una sección **"Dla stolarzy i wykonawców zabudowy"** (3 bullets: pedidos recurrentes / consistency de partida / factura y plazo) + una **subpágina `/dla-firm/`** (`/en/for-trade/`, `/de/fuer-handwerk/`) con: volumen mínimo, cómo se pide, plazo, consistencia entre partidas, y **un formulario B2B con campo "firma / NIP"**. Es la página con mejor ratio conversión/esfuerzo de todo el sitio.

**P1-21 · El anchor text interno no lleva ninguna keyword**
`src/i18n/ui.ts:23-24` → `'cta.details': 'Zobacz szczegóły'`, `'cta.allProducts': 'Wszystkie produkty'`; `src/components/ProductCard.astro:41` usa `cta.details`; `src/views/HomeView.astro:110` usa `cta.allProducts`.
**Solución:** cambiar los anchors de producto a "Obłóg dębowy cięty — zobacz szczegóły" / "Oak trim battens — see details" / "Eichen-Abschlussleiste — Details"; y el CTA de catálogo a "Wszystkie obłogi dębowe i lamele". Los anchors son uno de los Few componentes más fuertes de la relevancia interna.

**P1-22 · No hay precio en ningún sitio — ni un rango, ni una unidad de venta, ni un PDF**
Ver P0-3 (acción) — aquí el ángulo: las keywords de Tier 1 con intención transaccional (`obłóg dębowy cięty`, `lamela dębowa 4 mm`, `obłóg dębowy Olsztyn`) son precisamente las que un comprador compara por **precio**. Sin precio en la página, la posición 1 no convierte. **Añadir la unidad de venta al title/description del producto** ("cena za mb / za szt.") es lo que hace que elSnippet sea accionable.

**P1-23 · H1 sin keyword en 5 páginas**
`src/views/CatalogView.astro:30-36` → H1 "Produkty"; `src/views/GalleryView.astro:149` → "Zdjęcia naszego drewna"; `src/views/QuoteView.astro:28` → "Poproś o cennik"; `src/views/ContactView.astro:35` → "Zadzwoń albo wycenę"; `src/views/AboutView.astro:22` → "Pracujemy w Słoneczniku pod Olsztynem".
**Solución (propuesta de H1):**
- `/produkty/` → `Obłogi dębowe, lamele i panele` (EN: `Oak trim battens, slats and panels` / DE: `Eichen-Abschlussleisten, Lamellen und Paneele`)
- `/realizacje/` → `Realizacje z obłogów dębowych — zdjęcia z warsztatu i z montażu`
- `/cennik/` → `Cennik obłogów dębowych — wycena na wymiar`
- `/kontakt/` → `Kontakt — Doors Obłogi, obłogi dębowe z Słonecznika k. Olsztyna`
- `/o-nas/` → `Pracownia obłogów dębowych w Słoneczniku pod Olsztynem`

**P1-24 · Galería = thin content y promesa incumplida**
`/realizacje/` tiene ~864 palabras, H1 sin keyword, y 9 fotos de **producto en el taller** (`src/views/GalleryView.astro:16-143`). Pero el nav EN lo llama **"Projects"** (`ui.ts:11`) y el DE **"Projekte"** — promete proyectos y enseña producto. Además no hay ni una foto de **montaje terminado**.
**Solución:** (a) renombrar la sección a "Galeria" / "Gallery" / "Galerie" si no se añaden obras; (b) mejor: **solicitar al cliente 5-8 fotos de obra terminada con obłogi montados** (es su mejor argumento comercial) y añadir 6-8 líneas de texto con aplicaciones concretas por foto. Mientras tanto, añadir un bloque de texto de 250-350 palabras en `/realizacje/` con las keywords `realizacje z obłogów dębowych`, `obłóg dębowy w zabudowie`, `panele sufitowe z dębu`.

**P1-25 · Sin WhatsApp / Messenger / CTA de llamada fijo en móvil**
Ningún archivo contiene `wa.me` ni `m.me` (verificado por grep). El canal del cliente es Facebook y su queja es de comunicación.
**Solución:** añadir en `src/components/Header.astro` y `src/components/CtaBand.astro` un botón de WhatsApp (`https://wa.me/48696741679?text=<prefill>`) y de Messenger, y un `tel:` visible en móvil. Prellena el texto con el contexto de la página (producto + URL).

**P1-26 · El teléfono se muestra en formato local en EN y DE**
`src/content/company.ts:13` → `phoneDisplay: '696 741 679'`, y `Footer.astro:106` / `ContactView.astro:53` lo renderizan tal cual en los 3 idiomas.
**Solución:** `phoneDisplay` por locale: PL `'696 741 679'`; EN/DE `'+48 696 741 679'`. El `tel:` ya es correcto (`+48696741679`).

**P1-27 · "Wysyłka w całej Polski" en las versiones EN/DE mata la conversión internacional**
`src/content/company.ts:41-45` (`shippingNote`) → `'Courier shipping across Poland'` / `'Versand per Kurier in ganz Polen'`; repetido en `products.ts:163`, `339`, `517`, `702`; en los `seoDescription` (`products.ts:212, 390`); en los hero facts (`pages.ts:27-28`); y en `BaseLayout.astro:67` (`areaServed`).
**Solución — decisión de negocio pendiente del cliente:** si exportan a UE → cambiar a "Dostawa w Polsce i UE — wycena wysyłki indywidualnie" / "Delivery across the EU"; si **solo** Poland → las versiones EN/DE deben decirlo de frente ("Shipping within Poland only") o **retirarse del índice** (`noindex`) hasta que haya oferta real. Decir "Poland" en la página EN y esperar tráfico UE es la peor de las opciones.

**P1-28 · No hay ningún email visible en el sitio**
`src/components/Footer.astro:104-111` muestra teléfono, persona, región — **pero ningún correo**. El único `mailto:` está dentro del `<script>` del formulario (`QuoteForm.astro:251`).
**Solución:** añadir `<a href="mailto:{company.contactEmail}">` al bloque de contacto del footer y al de `/kontakt/`. El comprador B2B escribe un email; si no lo encuentra, vuelve al Facebook (que es donde quiere estar el cliente).

---

### P2 — mejoras (no bloquean, pero se pierden puntos)

**P2-29 · 404 sin versiones EN/DE y con hreflang roto**
`src/pages/404.astro` no recibe `alternates` → `BaseLayout.astro:42-45` calcula `/en/404/` y `/de/404/`, que **no existen** (verificado en `dist/`). El `x-default` apunta a la home.
**Solución:** pasar `alternates` con la home de cada idioma, o desactivar los hreflang en la 404.

**P2-30 · Sitemap sin `lastmod` ni `xhtml:link`**
`dist/sitemap-0.xml` solo tiene `<loc>`.
**Solución:** el `@astrojs/sitemap` añade `lastmod` por defecto si `serialize` está configurado; añadir `serialize: (item) => ({ ...item, links: ... })` con las 3 alternates `xhtml:link` por URL. Refuerza la señal multiidioma.

**P2-31 · FOUT y CLS de fuente**
`@fontsource-variable` carga Newsreader latin (56,7 KB) + Manrope latin (24,3 KB) con `font-display:swap` y **sin preload**, y sin `size-adjust` en la fuente de reserva → salto de layout al cargar.
**Solución:** añadir `<link rel="preload" as="font" type="font/woff2" crossorigin>` para los 2 woff2 latinos, o declarar una `@font-face` fallback con `size-adjust` / `ascent-override` en `global.css`.

**P2-32 · `og:image:alt` inútil y OG incompleto**
`src/layouts/BaseLayout.astro:124` → `og:image:alt` = "Doors Obłogi" (no describe la imagen); faltan `og:image:width`/`height` (1200×630) y `og:locale:alternate` (pl_PL / en_GB / de_DE).
**Solución:** alt descriptivo por página; añadir dimensiones y alternates.

**P2-33 · `trailingSlash: 'ignore'` → riesgo de URLs duplicadas**
`astro.config.mjs:13`. El canonical y el sitemap usan barra final, pero el host puede servir también sin barra → dos URLs para el mismo contenido.
**Solución:** `trailingSlash: 'always'` para que la configuración de build y las URL emitidos coincidan sin excepción.

**P2-34 · `aria-label="Breadcrumb"` en inglés en PL/DE**
`src/components/Breadcrumbs.astro:27` (literal, no pasa por `t(locale, …)`).
**Solución:** `aria-label={locale === 'pl' ? 'Ścieżka nawigacji' : locale === 'en' ? 'Breadcrumb' : 'Brotkrümelnavigation'}` — la clave ya existe en `src/i18n/ui.ts:89`.

**P2-35 · Nav duplicada (desktop + móvil) → anchors repetidos**
`src/components/Header.astro:47-55` y `:97-115` renderizan los mismos 5 enlaces. Verificado: "Contact" ×3, "Products" ×5 por página.
**Solución:** es un patrón correcto, pero los links del panel móvil deberían llevar `aria-hidden="true"`/`tabindex="-1"` cuando está cerrado, y conviene que el footer no repita los 5 enlaces del nav (basta con 3).

**P2-36 · Código muerto y claves de i18n sin usar**
`src/content/schema.ts:42` (`breadcrumbSchema`) — no se usa. `src/i18n/ui.ts` define `seo.faqTitle`, `seo.related`, `section.*`, `form.errorRequired`, `form.errorEmail`, `form.success`, `form.errorGeneric`, `form.sending`, `form.required`, `form.intro` — ninguna se consume (los mensajes del form están hardcodeados en `QuoteForm.astro:123-157`). `src/content/products.ts` → el campo `keywords` **no se inyecta en ningún sitio** (ni `<meta name="keywords">` —correcto, está obsoleto— ni como contenido).
**Solución:** borrar lo muerto, o conectar `keywords` a un campo visible de la página (p. ej. una fila de "Szukasz: …" no; mejor: usarla como guía editorial y eliminarla del código). Recomiendo **borrar el campo `keywords`** y mantener la lista de keywords solo en la documentación SEO: en 2026 un `keywords` meta no aporta nada y ocupa mantenimiento.

**P2-37 · `sameAs` solo con Facebook**
`src/layouts/BaseLayout.astro:68` → un único enlace. Si el cliente tiene Instagram, LinkedIn, Allegro, OLX o un marketplace B2B, deben ir ahí: `sameAs` es la vía barata para consolidar la entidad.
**Solución:** ampliar `company.ts` con un array `profiles` y mapearlo a `sameAs`. **Confirmar con el cliente qué perfiles existen** antes de inventarlos.

**P2-38 · Falta página de "Dostawa i płatności" y "Współpraca hurtowa"**
El nav tiene 5 entradas y ninguna cubre supply chain, que es lo que un comprador institucional revisa primero (junto a la página de "O nas").
**Solución:** añadir `/dostawa/` (EN `/delivery/`, DE `/lieferung/`) con pago, envío, plazos, MOQ, packaging, y un enlace a la política de privacidad.

---

## 9. Orden de ejecución sugerido

**Bloque 1 (esta semana, sin decisiones de negocio):** P0-1, P0-2, P1-9, P1-10, P1-23, P1-30/P2-33, P1-12, P1-26.
**Bloque 2 (requiere 1 llamada al cliente):** P0-3 + P1-22 (precios), P1-18 (MOQ/pago/plazo), P1-19 (datos técnicos y origen), P0-4 (email + backend), P1-25/P1-28 (WhatsApp/Messenger/email visible), P1-27 (decisión de envío a UE), P2-37 (perfiles).
**Bloque 3 (reestructuración de idiomas, antes de posicionar EN/DE):** P0-5 (DE), P0-6 (EN), P0-7 (titles), P1-16 (privacidad).
**Bloque 4 (contenido y crecimiento):** P1-20 (`/dla-firm/`), P1-13 (FAQ de precio), P1-24 (galería con obras), P1-21 (anchors), P0-8 (claims falsos), y las keywords Tier 1 de la §5.

---

## 10. Preguntas abiertas — bloquean decisiones concretas (para el cliente)

1. **¿Existe realmente el buzón `kontakt@doors-oblogi.pl`?** El código lo marca como provisional (`company.ts:34-37`) y **todo el formulario depende de él**.
2. **¿Hay precios? ¿En qué unidad se venden** (mb / m² / szt.) **y cuál es el mínimo?** Sin esto no se puede escribir la página de precios.
3. **¿Exportan a la UE?** De esto depende si las versiones EN/DE se posicionan o se retiran del índice.
4. **¿Cuál es el MOQ, el plazo comprometido y la forma de pago?** (pretransferencia / factura VAT)
5. **¿De dónde es el duble?** ¿Tienen FSC, PEFC o certificado de origen? ¿Cuál es el % de humedad? Esta es la primera pregunta de cualquier comprador de madera en volumen en 2026.
6. **¿Tienen fotos de obra terminada** con obłogi montados? Si no, ¿pueden sacar 5-8? Es el argumento comercial que falta.
7. **¿Qué perfiles exactos producen?** El actual "Do uzgodnienia" (`products.ts:137`) no permite que un stolarz imagine la pieza.
8. **¿Desde cuándo existe la empresa y cuál es la forma jurídica?** `company.ts:11` dice `founded: '2021'` y `legalName` = "Doors Obłogi" (¿NIP? ¿sp. z o.o.?). La ficha `LocalBusiness` lo necesita.
9. **¿ Tienen Instagram / LinkedIn / Allegro / OLX?** Para `sameAs` y para `areaServed`.

---

*Fin del informe. Ningún archivo de `src/**`, `dist/**` o de configuración ha sido modificado; la única escritura es este documento.*
