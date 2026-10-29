# Plan de crecimiento — Doors Obłogi (PL / EN / DE)

Consolidación de tres auditorías (SEO/AEO/GEO, marketing, embudo) verificada contra `src/` y `dist/`
(50 HTML, 40 páginas canónicas). No hay acciones de manual: cada fila nace de un dato del repo.
**Regla de cierre de toda tanda:** `npm run build` sin avisos, `npm run verify` en 0 y lectura de `dist/`, no del código.

## Estado tras la tanda del 27/10 (2026-10-27)

Todo lo de abajo está **medido sobre `dist/`**, no sobre el código.

### Segunda ronda del 27/10 — implementado y verificado

Informe completo en `docs/INFORME-MISION.md`.

| Punto | Estado |
|---|---|
| Dos embudos en el formulario | **Hecho.** A (paneles, m²: `surface` obligatorio) y B (obłogi, metros: `length`, `section`, `quantity` obligatorios). La página decide cuando puede (ficha de obłóg → B, ficha de paneles → A); en `/cennik/` y `/kontakt/` elige el visitante con una pregunta de radio. Sin JS se ven ambos juegos y valida el navegador; con JS se ve solo el activo. El payload lleva **solo** el juego activo. Verificado en Chrome: `_tools/verify-form.cjs` (25/25). |
| Consentimiento en el mensaje | **Hecho.** Línea obligatoria «Zgoda na kontakt w sprawie tej wyceny: tak» al final del cuerpo del `mailto:` + `consent: true` en el JSON (art. 7.1 RODO). |
| Anclas `#quote-form` en las 15 CTA | **Hecho**, incluidas cabecera, barra flotante y ficha → `/cennik/?produkt=<id>#quote-form`. |
| Numeración decorativa | **Fuera** de secciones, tarjetas y componentes (`src/` ya no usa `padStart(2,'0')`). |
| Definición citable (AEO/GEO) | **Hecho.** `oneLiner` en el HTML de las 3 homes (`<dfn id="definicja">`), nodo `DefinedTerm` en el JSON-LD y **la misma cadena** en `public/llms.txt` (rutas EN/DE completas + nota de que sin endpoint el formulario solo abre el cliente de correo). |
| LCP del hero | **Hecho.** `srcset`/`sizes` (700/1000/1400) + preload con `imagesrcset`/`imagesizes`; en móvil el hero baja de **334,8 KB a 86 KB**. Fuente única: `src/content/hero.ts`. |
| `ObjectionList` | **Montado** en `/cennik/` y `/dla-firm/` (6 objeciones escritas, 0 en página). |
| Meta descriptions con precio | **Hecho.** 9 descripciones (PL/EN/DE de 3 fichas) dicen ahora que el precio se escribe en la oferta, con su unidad; ninguna promete una cifra. |
| Primary de `/dla-firm/` | **Hecho.** PL «obłogi dębowe hurtowo», EN «oak battens for trade», DE «Eichen-Abschlussleisten Großhandel». |
| `docs/CMS-INTEGRATION.md` | **Actualizado** con el contrato del payload nuevo (campos por embudo + metadatos), la estructura del `mailto:` y el comportamiento sin JS. |
| Falso positivo del verificador | **Corregido en la herramienta, no en el código.** `check-html.cjs` tomaba `consent: true` por una anotación de tipo (21 páginas en rojo). `node --check` y Chrome confirman que el script es JS válido. |
| JS por página | **35,0 KB gzip** máximo (presupuesto 60), 1 chunk de 26,7 KB. Sin React. |

### Estado heredado de la primera ronda

| Punto | Estado |
|---|---|
| P0-1 formulario | **Hecho en código.** Sin endpoint el resultado ya no dice «zapytanie dotarło»: distingue `success` (llegó al endpoint) de `prepared` (se abrió el cliente de correo y falta pulsar «Enviar») y ofrece WhatsApp + teléfono. El `context` de la página viaja en el cuerpo del mensaje. Verificado en Chrome: `_tools/verify-form.cjs` (10/10). **Sigue pendiente del cliente:** el buzón definitivo. |
| P0-2 anclas `#quote-form` | Hecho. Las CTA de cotización y la barra flotante apuntan al formulario. |
| P0-3 `?produkt=` | Hecho. La página es estática, así que lo lee el script en el navegador; la CTA de la ficha es `/cennik/?produkt=<id>#quote-form`. |
| P0-4 primera pantalla | Hecho. H1 nuevo, «ze Słonecznika» en los 5 sitios, title/description movidos a `home.seo` y `contact.seo`, y los dos `contested` duplicados de `keywords.ts` fusionados (la segunda copia ganaba en runtime y anulaba la regla). |
| P0-5 promesas | Hecho. Fuera «tego samego dnia / the same day / am selben Tag» y fuera el plazo en días (`ui.ts`, `terms.ts` → `confirmed: false`, `definitionFacts`, FAQ, `llms.txt`). |
| P0-6 medición | Preparado: el `context` viaja. Falta la decisión del cliente sobre el contador first-party. |
| P2-2 fotos de stock | **Deshacer.** El bloque de servicios vuelve a llevar foto: dos de stock (Pexels) y una del cliente. Es un demo y el bloque tiene que verse completo. La objeción de fondo (que una foto de vigas de pino con conectores no es el producto de este fabricante) sigue en pie, pero es decisión del cliente, no nuestra: la sustitución por fotos propias se pide, no se impone. |
| React | Fuera. `@astrojs/react` no está instalado: había un chunk de 215 KB (66,6 KB gzip) que ningún HTML referenciaba. La página más pesada baja a **33,1 KB gzip** (presupuesto 60 KB), medido por `_tools/check-budget.cjs`, que ya corre dentro de `npm run verify`. |

**Decisión del cliente aplicada el 27/10:** fuera la numeración decorativa «01 · 02 · 03» de las secciones y de las tarjetas de producto. Queda escrito en `AGENTS.md` (regla 13).

## Diagnóstico en seis líneas

1. La fontanería SEO está por encima de la media: hreflang recíproco con `x-default`, sitemap de 39 URLs con `lastmod`, `@graph` coherente, `llms.txt`, `verify` en verde. No hay que rehacer nada de eso.
2. El embudo se rompe en los dos últimos metros: el formulario no entrega a nadie (`data-endpoint` vacío, cae a `mailto:` y aun así canta éxito) y ningún CTA aterriza en el formulario (0 anclas `#quote-form` en 50 HTML).
3. La primera pantalla vende un término de oficio y su `<title>` repite la keyword de una ficha; además dice «z Słonecznika» (5 sitios), incorrecto en polaco.
4. Hay copy de venta completo y traducido —3 pasos, tira de confianza, objeciones, 6 usos— que ningún `.astro` importa.
5. Dos promesas que el propio repo marca como no confirmadas están publicadas en tres idiomas.
6. La capa GEO está a medio enchufar: la frase diseñada para ser citada (`definitions.oneLiner`) no está en el HTML; hay 0 nodos `Service`, 0 `ItemList`, 0 `DefinedTerm`.

## Conflictos resueltos (una línea cada uno)

- **H1 de la home**: SEO propone «…do sufitów, ścian i drzwi» y marketing «…— cięty na wymiar». Gana SEO sin el modificador: `keywords.ts:449-453` reserva «obłóg dębowy cięty» a la ficha y ESTRATEGIA §7 solo exige «obłóg dębowy» en el H1.
- **Precio gancho**: marketing lo quiere publicar, el resto no lo inventa. Solo con cifra del cliente; mientras tanto se quitan las promesas «Cena za mb / Preis je lfm» de las meta descriptions.
- **Objeciones**: marketing pide 6, embudo pide 4. Se montan 4 (mínimo, plazo, factura, muestra): 3 de las 6 dicen «se confirma en la cotización» y en primer plano se leen como evasiva.
- **Analítica**: el embudo pide instrumentar, la política prohíbe cookies. Medición en el propio endpoint (campo `context`) y, si el cliente aprueba, contador first-party sin PII; ningún tag de terceros sin consentimiento y cambio de política.
- **Slug DE**: SEO lo renombra a `…-nach-mass`, marketing avisa de que /de/ quizá no se pueda servir. Se cambia ya el texto y el `<title>` (reversible, 1 línea) y la URL espera la decisión sobre /de/.
- **Tabla de warunki**: quitarla de las fichas (SEO) y poner objeciones antes del formulario (embudo) son compatibles: ficha = 2 filas de `PriceInfo` + «Pełne warunki»; tabla completa solo en /cennik/.
- **Recuento de títulos**: el informe SEO dice 26 rutas desalineadas; medido hoy con `node _tools/check-keywords.mjs`: **22**.

---

## Tanda P0 — sin esto no hay resultados

**Ejecutable ya:** P0-2, P0-3, P0-4, P0-5 y los puntos 1-3 de P0-1. **Depende del cliente:** solo el buzón definitivo (P0-1.4) y la aprobación del contador (P0-6).

| # | Qué | Por qué (dato) | Cómo (exacto) | Quién | Imp. | Esf. |
|---|---|---|---|---|---|---|
| P0-1 | Endpoint real y estado de envío veraz | `dist/cennik/index.html` sirve `data-endpoint` **vacío** y `action="mailto:kontakt@doors-oblogi.pl"`; `QuoteForm.astro:413-419` abre el correo y acto seguido pinta `form.success` («Dziękujemy — zapytanie zostało przygotowane»). Es el único punto donde el lead desaparece sin rastro; `.env.example` ya lo marca P0 | 1) `PUBLIC_QUOTE_ENDPOINT` en el entorno de build (Formspree, Worker o CMS; contrato en `docs/CMS-INTEGRATION.md`). 2) En `QuoteForm.astro`: añadir `context` a `buildBody()` (357-368) y separar `form.successSent` / `form.successMailto` en `ui.ts`; el mailto dice «se ha abierto tu correo, pulsa Enviar» + WhatsApp + `tel:`. 3) La rama sin endpoint no puede poner `data-state="success"`. 4) El bloque de resultado (hoy un `<p data-status>`) pasa a `<div data-result hidden>` con las dos salidas | dev (1-3) + cliente (4: buzón definitivo) | alto | bajo |
| P0-2 | Que los CTA aterricen en el formulario | 0 apariciones de `#quote-form` en los 50 HTML; la home enlaza 11 veces a `/cennik/` y 0 al formulario. En móvil el formulario es la 2.ª celda de `.split--center` (`QuoteView.astro:39`), tras page-head, 3 pasos y 4 filas de contacto; `global.css` no tiene `scroll-margin-top` y la cabecera es sticky | `quoteHref(locale)` en `src/i18n/index.ts` → `${pathFor(locale,'quote')}#quote-form`; sustituir las 17 apariciones de `pathFor(locale,'quote')` (`Header.astro:84,117`, `HomeView:99,147,411,412,457`, `CatalogView:72,118`, `AboutView:162`, `DeliveryView:70`, `GalleryView:222`, `ProductView:70,247`, `TradeView:91`, `404.astro:21` y el valor por defecto de `CtaBand.astro:18`); `[id]{scroll-margin-top:5.5rem}` en `global.css`; `.split--form-first > :last-child{order:-1}` por debajo de 60rem; permitir `hash` en `ActionTarget`/`actionHref` (`funnel.ts:47-75`) para la barra flotante | dev | alto | bajo |
| P0-3 | La ficha deja de perder el producto | `ProductView.astro:70` manda a `/cennik/?produkt=<id>` y no hay un solo `URLSearchParams` en `src/`: el select llega vacío. La misma ficha ya tiene formulario con `preselect` en la línea 220 | Enlace a `#quote-form` (o `?produkt=…#quote-form`); en el script del formulario leer `new URLSearchParams(location.search).get('produkt')`; añadir `value={product.id}` a los `<option>` (141) para match exacto sin cambiar el payload; «Wycenę» de `StickyCta` apunta al formulario de la página actual cuando exista | dev | alto | bajo |
| P0-4 | Primera pantalla, gramática y title fuera de plantilla | El H1 de la home es literalmente el `<title>` de `/produkty/oblog-debowy-ciety/`. `keywords.ts` lo prohíbe pero `contested` está duplicado (líneas 449 y 462) y la segunda gana en runtime: la regla nunca se evalúa. El title/description de home y /kontakt/ viven en las plantillas (`index.astro:24-25`, `kontakt/index.astro:18-19`), contra la regla 1. Y las 5 cadenas que nombran Słonecznik dicen «z Słonecznika» (incluida `pages.ts:599`), forma incorrecta en polaco | H1 → «Obłóg dębowy na sufit, ścianę i drzwi» / «Oak trim battens for ceilings, walls and doors» / «Eichen-Abschlussleisten für Decken, Wände und Türen»; «ze Słonecznika» en los 5 sitios; mover title/description a `home.seo` y `contact.seo` en `pages.ts`; fusionar los dos `contested` de `product-trim`. Ojo: `motion.ts:20-23` parte el H1 por palabras — revisar 390 y 1440 px | agencia (copy) + dev | alto | bajo |
| P0-5 | Retirar las dos promesas no confirmadas | `ui.ts:243-245` y `267-269` publican «te mismo día» en tres idiomas, y `funnel.ts` (`pendingClientData.responseTime`) dice que sin confirmación debe desaparecer. `terms.ts:61-73` marca `confirmed: true` un plazo («Kilka dni roboczych») que `pendingClientData.leadTime` lista como pendiente, y se repite en `pages.ts:414-425`, en `definitionFacts` y en `public/llms.txt` | Sustituir las 6 cadenas por la versión sin plazo («Długość, przekrój, ilość — wystarczy. Wyślemy cennik i termin realizacji.» y equivalentes); `terms.ts` → `confirmed: false` con «Termin podajemy w wycenie, po potwierdzeniu wymiarów»; quitar los días del FAQ y alinear `definitionFacts` y `llms.txt` al mismo texto. Cuando el cliente confirme, se restaura en un solo sitio | agencia + dev | alto | bajo |
| P0-6 | Medición mínima sin cookies | 0 `gtag/plausible/umami/dataLayer` y 0 eventos en `src`; sin saber cuántas consultas entran ni desde qué página, ninguna otra acción se puede evaluar | 1) `context` ya viaja en el POST (397): asegurar que también entra en el mailto y en la hoja de leads. 2) El endpoint registra `{context, producto, canal}` sin PII. 3) Delegación única en `BaseLayout` para `a[href^="tel:"]` y `wa.me`, solo si el cliente aprueba el contador first-party. 4) Nada de tags de terceros sin consentimiento | dev + cliente (decisión) | alto | medio |

---

## Tanda P1 — multiplica lo que ya funciona

**Ejecutable ya:** las diez. P1-10 cambia texto y `<title>`, no URL, para no romper nada mientras /de/ siga en el aire.

| # | Qué | Por qué (dato) | Cómo (exacto) | Quién | Imp. | Esf. |
|---|---|---|---|---|---|---|
| P1-1 | Montar el copy de venta huérfano | `HowItWorks`, `TrustBar`, `ObjectionList`, `ProofFigure`, `SectionCta`, `ContactLinks` existen con copy PL/EN/DE y CSS (`global.css:2281`, `:2440`) y **0 importaciones** fuera de su propio JSDoc (verificado). `home.applications` (6 usos, `pages.ts:135-220`) tampoco se pinta | `<HowItWorks>` + `<TrustBar>` tras el bloque 04 (`HomeView:284`); `<ObjectionList items={objections.slice(0,4)}>` antes del FAQ (`:437`), en `ProductView` (~145) y en `QuoteView` (antes de la 96); los 6 usos como grid con `.grid-apps`/`.app` de `CatalogView:60-70`. Ninguno lleva número: la numeración 01-09 no se rompe. Antes de montar, confirmar con la revisión de diseño (hay capturas `shot-howitworks.png`, `shot-objections.png`, `shot-trustbar.png` en la raíz) | dev | alto | bajo |
| P1-2 | Alinear 22 `<title>` con la keyword principal | `check-keywords.mjs:167-181` compara título con primary y lo emite como `note()`: nunca falla el build. Rutas afectadas hoy: /cennik/, /produkty/panele-sufitowe-i-scienne/, /dostawa/, /o-nas/, /de/produkte/, /de/produkte/eichen-decken-und-wandpaneele/, /de/produkte/eichen-abschlussleiste-auf-mass/, /de/galerie/, /en/about/, /de/ueber-uns/, /en/for-trade/, /de/fuer-handwerk/, /en/price-list/, /de/preisliste/, /kontakt/×3, /en/delivery/, /de/lieferung/, privacidad×3 | Cambiar el orden de palabras antes que la primary: «Cennik obłogów dębowych — cena i termin», «Panele sufitowe z dębu i ścienne», «Dostawa obłogów dębowych — kurier», «Eichenleisten, Eichenlamellen, Paneele», «Galerie — Projekte mit Eichen-Abschlussleisten». Donde la primary no es una cadena que el mercado escriba (contacto, privacidad, o-nas), cambiar la primary del mapa, no el título. Respetar 60/160 (`check-meta.cjs`). Después mover el bloque de `note()` a `problems` | agencia + dev | alto | bajo |
| P1-3 | Dejar de repetir la FAQPage | `FaqList.astro:34-53` emite el JSON-LD siempre; home, catálogo y contacto usan la lista por defecto (`HomeView:447`, `CatalogView:110`, `ContactView:122`) → las mismas 6 preguntas en 9 URLs, y 24 HTML con FAQPage. Google ya no da rich result de FAQ fuera de gov/health; para AEO la misma respuesta compite contra sí misma | Prop `emitSchema = false` por defecto y `true` solo en la home; `catalogFaq` (3 de selección) y `contactFaq` (3 de medidas/envío) en `pages.ts`; una dueña por pregunta (hoy «Ile kosztuje obłóg dębowy?» está en la ficha y en /cennik/) | dev + agencia | medio | bajo |
| P1-4 | Publicar la definición citable | `definitions.ts:73-77` (`oneLiner`) y `:99-103` (`source`) son el único texto diseñado para ser citado y no están en ningún `.astro` ni en `llms.txt`; `HomeView:192` solo pinta `definition.lead`; no hay artículo de Wikipedia (`keywords.ts:236-243`) | `<p class="def__oneline">{definition.oneLiner[locale]}</p>` bajo el SectionHead del bloque 02 + línea «Źródło: doors-oblogi.pl»; nodo `DefinedTerm` (`name`, `description = oneLiner`, `url`, `inDefinedTermSet`) por `jsonLd` en las 3 homes; usar **la misma cadena** en `public/llms.txt`, que hoy abre con otra redacción | dev | medio | bajo |
| P1-5 | Enlazado interno hacia la ficha prioritaria y la galería | El bloque 01 (prioridad declarada del cliente) envía sus dos CTAs a /cennik/ y `tel:` y no a la ficha de paneles; la ficha que recibe enlaces contextuales es la de trim (`trimHref`, `HomeView:47,100,211`); ninguna de las 4 fichas enlaza a /realizacje/ y no hay migas visibles (AGENTS 9) | `ceilings.link` en `home-sections.ts` pintado como `link-arrow` a `productPath(locale,'panele-sufitowe-i-scienne')`; en `ProductView` tras `body` (65-73) dos enlaces («Zobacz realizacje…» → gallery, «Cała oferta» → catalog) con cadenas en `ui.ts`; enlazar las menciones a fichas hermanas dentro de `body` | dev + agencia | medio | bajo |
| P1-6 | Nodos `Service` + H3 con la frase que se busca | 0 nodos `Service` en 50 HTML (los 3 matches son la clase CSS `.service`), 0 `ItemList`, 0 `DefinedTerm`. «schody» y «drzwi przesuwne» solo viven en una entradilla de 12 palabras del bloque 06, y el autocompletado documenta «obłóg dębowy na schody» (`definitions.ts:15-20`) | `serviceSchema(locale)` en `schema.ts`: 3 nodos `{@type:'Service', @id:'#usluga-sufity', name, serviceType, provider:{@id:'#organization'}, areaServed:{Country, Polska}, url:'/#uslugi'}`, pasados por `jsonLd` en las 3 index; H3 «Sufity — panele dębowe», «Drzwi przesuwne — obłóg na ramę i prowadnicę», «Schody — obłóg dębowy na stopnie»; sin `offers` ni precio | dev | medio | medio |
| P1-7 | Deduplicar warunki y `priceFlow`, y dar `ItemList` al catálogo | La tabla de 8 filas de `terms.ts` se monta en 6 páginas/idioma (`QuoteView:96`, `ProductView:157` ×4, `DeliveryView:62`) = 18 URLs con texto idéntico; `priceFlow` se repite en `CatalogView:55-69` y `QuoteView:42-58` (6 URLs); el hub no emite `ItemList` y sus 4 productos solo existen dentro de `hasOfferCatalog` | En `ProductView` sustituir `<TermsTable>` por las 2 filas de `PriceInfo` + «Pełne warunki» → quote; `DeliveryView` con `only={['Delivery and packaging']}` (es la fila `confirmed: true`); en `CatalogView` tabla comparativa propia (Material/Grubosidad/Longitud/Perfil/Unidad/Uso con `products[].specs` + `pricing[].unit`) en lugar de `priceFlow`; `ItemList` con 4 `ListItem` en las 3 páginas de catálogo; tabla completa solo en /cennik/ | dev | medio | medio |
| P1-8 | Prueba visual y WhatsApp en el punto de conversión | `dist/cennik/index.html` tiene 2 `<img>` y las dos son el logo. En la home el único `wa.me` viene de la barra flotante móvil: el `CtaBand` de `HomeView:451` no pasa `whatsappHref` y la tarjeta de contacto (`:417`) no ofrece WhatsApp | 3 miniaturas de `realizations.items` + `link-arrow` a /realizacje/ junto al formulario; `whatsappLabel`/`whatsappHref` en el `CtaBand` de la home (el componente y `ProductView:250` ya lo soportan); WhatsApp en la tarjeta de contacto | dev | medio | bajo |
| P1-9 | LCP: el preload apunta a otra foto | `index.astro:13-18` precarga `hero-oblog-debowy.jpg` (960×720, 107 KB) pero el hero renderizado es `hero-sufit-dab.jpg` a 1400 px (`HomeView:39-43`), que pesa 343 KB y no se precarga; la imagen precargada es la primera foto de /realizacje/ | Precargar `image('hero-sufit-dab.jpg')` al ancho real (o servir el hero a 960 px) con `imagesrcset`/`imagesizes`; no tocar la foto (regla 2) | dev | medio | bajo |
| P1-10 | DE: «nach Maß», no «auf Maß» | `keywords.ts:443` fija la primary DE en «Eichenleisten nach Maß» y `keywords.ts:228-233` documenta «auf Maß» → 0 sugerencias frente a «nach maß» → 2; pero `products.ts:63,68,267` dicen «auf Maß» en name, slug y seoTitle | Pasar `name.de`, `seoTitle.de` y el H1 a «Eichen-Abschlussleiste nach Maß» y dejar «auf Maß» solo en el cuerpo. **El slug no se toca** hasta que el cliente decida si /de/ se queda; si se queda, renombrar + `routes-map.json:9` + `keywords.ts:417` + 301 real (P2-4) | dev + agencia | medio | bajo |

---

## Tanda P2 — crecimiento a medio plazo (casi todo depende de datos)

**Nada de esta tanda se ejecuta sin el dato correspondiente** (ver la tabla de bloqueos): son acciones de cliente con ejecución corta, no de desarrollo.

| # | Qué | Por qué (dato) | Cómo (exacto) | Quién | Imp. | Esf. |
|---|---|---|---|---|---|---|
| P2-1 | Cifra gancho, mínimo de pedido y muestra | 8 cadenas de meta description prometen «Cena za mb / Preis je lfm» (`products.ts:270-272,497-499,722,724`) y no hay cifra; `pricing.ts` ya tiene `published: null` y `PriceInfo` + `schema.ts` se activan solos en cuanto exista el dato; `obłóg dębowy cena` es la consulta comercial de la categoría (`keywords.ts:136`). Choca de frente con la política de «cennik bajo petición»: hay que decidirlo por escrito con el cliente antes de tocar `pricing.ts` | Una llamada con 3 preguntas: (a) precio/mb de un perfil gancho, (b) mínimo, (c) si hay muestra y cuánto cuesta. Rellenar `pricing['oblog-debowy-ciety'].published` y `panele-dabowe` + filas de `terms.ts` → el build propaga a pantalla, JSON-LD y `priceRange`. Si no hay cifra: quitar las 8 promesas de precio | cliente → dev | alto | medio |
| P2-2 | Página de elección (`/wybor-oblogu/`) | La decisión donde se paran las consultas (4 vs 8 mm, selección, acabado, perfil) está repartida en FAQ y `highlights`; `technical.ts` deja «Przekrój maksymalny» sin dato y el cliente no puede comprobar si el perfil existe antes de escribir | `src/content/selection.ts` con 4 decisiones en tabla, usando solo frases ya publicadas; ruta nueva + grupo en `routes-map.json` + `routes` en `i18n/index.ts` + enlaces desde cada ficha y desde el FAQ; `verify` exige `lastmod`, así que la ruta tiene que entrar en el mapa. Sin tabla de perfiles hasta que el cliente la dé | cliente (tabla) + dev/agencia | alto | medio |
| P2-3 | 3 casos con ficha | Los 9 pies de foto son etiquetas («Obłóg cięty», «Dąb naturalny») y están escritos dentro de `GalleryView.astro:29-159`, fuera de `src/content/` (contra la regla 1); hay 0 casos y lo único verificable es SEDO (`home-sections.ts:81-86`) | `src/content/cases.ts`: (1) SEDO techos, (2) obłóg en pared, (3) dąb ahumado en obra; campos producto/selección/acabado/uso/foto y `location`/`m2`/`rok` vacíos con flag `pending`; ficha de una línea en la galería; caso SEDO enlazado desde la ficha de paneles; mover los pies de foto a content | dev + cliente (3 datos) | alto | medio |
| P2-4 | 301 reales en el hosting | Los 10 slugs antiguos de `astro.config.mjs:37-51` se sirven como 200 + meta refresh + noindex (verificado en `dist/de/produkte/geschnittenes-eichen-oblag/index.html`) y no hay `netlify.toml`, `vercel.json` ni `_redirects`: es redirect blando y no transfiere | `_redirects`/`netlify.toml` con 301 por ruta (incluido el slug DE si se renombra), manteniendo las páginas puente hasta confirmar el hosting | dev + cliente (hosting) | medio | bajo |
| P2-5 | Decidir /en/ y /de/ | `currenciesAccepted: 'PLN'`, `areaServed` solo Polonia y «Versand per Kurier in ganz Polen» en el hero alemán: se generan consultas que no se pueden cerrar, y hay hreflang y 301 apuntando allí | O línea «Lieferung nach Deutschland — Angebot auf Anfrage» (ya existe `company.shippingOutside`) en hero y schema, o `noindex` de /de/ y /en/. Decisión del cliente, no del repo | cliente | medio | bajo |
| P2-6 | Google Business Profile, horario y código postal | `company.mapUrl:80` es una búsqueda de Maps, no un place; `sameAs` solo lleva Facebook (`company.ts:100`); `hours.confirmed = false` deja `openingHoursSpecification` fuera del grafo; no hay `postalCode` ni `geo` | Pedir NAP exacto + horario + código postal; crear/reclamar ficha con fotos del taller y del producto; añadir el place a `company.profiles` (entra solo en `sameAs` y en el pie); en `Footer` cambiar «Facebook» por «Realizacje na Facebooku» y añadir «Google» | cliente + dev | medio | bajo |
| P2-7 | Search Console y plan B del catálogo | `keywords.ts:403-410` documenta que «obłóg dębowy» y «obłogi dębowe» devuelven el mismo SERP y que el plan B es `noindex` del catálogo. Sin GSC no se puede decidir ni medir nada de lo anterior | Acceso a GSC del dominio; 4 semanas de datos antes de tocar el catálogo; si hay solapamiento, ejecutar el plan B y dejar que la home se quede con definición y fabricante | cliente | medio | bajo |

---

## Bloqueado por el cliente (no ejecutable desde el repo)

| Dato que falta | Bloquea | Qué pasa mientras tanto | Fuente del hueco |
|---|---|---|---|
| Buzón definitivo | P0-1 | El `mailto:` y el schema apuntan a `kontakt@doors-oblogi.pl`, marcado TODO como provisional | `company.ts:74-79`, `schema.ts:175` |
| Plazo real y tiempo de respuesta | P0-5 y P2-1 | Textos sin cifra; ningún plazo publicado | `funnel.ts` (`leadTime`, `responseTime`) |
| Precio gancho, mínimo, muestra | P2-1 | «Cena w wycenie», sin `published` | `pricing.ts:43-48`, `terms.ts:48-73` |
| Horario y código postal | P2-6 | Sin `openingHoursSpecification` ni `postalCode`; ficha de Google incompleta | `company.ts:12-18,132-139` |
| Fotos propias de servicios | Bloque 06 de la home | 2 stock provisionales marcadas en `images.ts`; no bloquean ninguna acción | `images.ts:34-42` |
| Ubicación, m² y año de 3 obras | P2-3 | Casos sin ficha publicable | `GalleryView.astro:29-159` |
| Tabla real de perfiles (ancho × grosor × largo) | P2-2 | Guía sin tabla de medidas | `technical.ts:100-112` |
| Decisión /de/ y /en/ (envío fuera de PL) | P1-10, P2-5 | Textos corregidos, URL intacta | `company.ts:91-95`, `schema.ts:122-134` |
| Acceso a Search Console | P2-7 | Todo se mide a mano | `keywords.ts:403-410` |

## Qué medir

Sin cookies y sin tags: todo lo que sigue se obtiene del propio endpoint, de una hoja de leads y de GSC.

| Métrica | Cómo se obtiene | Línea base hoy | Objetivo 90 días |
|---|---|---|---|
| Consultas recibidas y página de origen | Campo `context` (+ `producto`) en el payload del endpoint y en la hoja de leads | Desconocida: el `mailto:` no deja rastro | 100 % registradas con contexto |
| Reparto por canal (formulario / mailto / WhatsApp / teléfono) | Campo `method` en el endpoint y en la hoja | 0 medible | ≥70 % por endpoint |
| Éxito falso de envío | Contar `data-state="success"` sin respuesta 2xx | Posible hoy (rama mailto) | 0 casos |
| Formulario visto → enviado | `IntersectionObserver` + POST al propio endpoint (`quote_form_view`, sin PII), solo si el cliente aprueba el contador | 0 | Tasa de envío sobre vistas, primera lectura |
| Clics a teléfono y WhatsApp | Delegación única en `BaseLayout` + contador first-party (misma aprobación) | 0 | Reparto por canal conocido |
| Tiempo de primera respuesta | Fecha/hora de entrada y de respuesta en la hoja de leads | Promesa «te mismo día» sin verificar (se retira en P0-5) | Mediana < 24 h |
| Impresiones, clics y posición de las 13 primary y de las 22 rutas retituladas | GSC, comparación 28 días antes/después de P1-2 | Sin datos | Sin caída de CTR; 22 títulos alineados |
| Citas de la definición en asistentes | 3 prompts fijos al mes («qué es un obłóg dębowy», «quién lo fabrica en Polonia», «dónde comprar obłóg a medida») | La frase citable no está en el HTML | La web aparece y la frase se reproduce literal |
| LCP del hero | PageSpeed / CrUX antes y después de P1-9 | 343 KB de imagen, preload equivocado | Preload correcto y LCP estable |
| No regresión técnica | `npm run build` + `npm run verify` + `check-keywords.mjs` | 0 problemas, 22 avisos de título | 0 problemas y 0 avisos de título |

**Ritmo sugerido:** P0 en una semana (todo es de bajo esfuerzo y va en dos commits), P1 en tres semanas, P2 cuando lleguen los datos de la tabla anterior. Nada se cierra sin `build` + `verify` en 0 y sin comprobarlo en `dist/`.
