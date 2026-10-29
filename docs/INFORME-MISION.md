# Informe de misión — Doors Obłogi (PL / EN / DE)

Cierre de la tanda de implementación (FASE D) con su verificación (FASE E).
Todo lo que hay aquí está **medido sobre `dist/`**, no sobre el código: los comandos y su
salida se reproducen tal cual en «Pruebas ejecutadas».

**Estado global:** build verde (40 páginas, 0 errores) · `npm run verify` con **0 problemas** en
los 8 comprobadores · las tres pruebas de navegador en verde · JS máximo **35,0 KB gzip** por
página (presupuesto 60 KB).

---

## 1. Qué se ha cambiado

### 1.1 Formulario: dos embudos y una pregunta menos

El formulario pedía siempre las cosas de un listón: metros, przekrój, cantidad. Para quien
pregunta por **paneles** esas medidas no existen, y para quien pregunta por **obłogi** sobran.
Un solo formulario obligaba al cliente a traducir su proyecto al idioma del material.

| | Embudo A — paneles | Embudo B — obłogi y lamele |
|---|---|---|
| Unidad | m² | metros lineales |
| Obligatorios | `surface` (superficie aproximada) | `length`, `section`, `quantity` |
| Opcionales | `modules`, `room` | `profile`, `selection`, `finish` |

- **La página decide el embudo cuando puede.** La ficha de obłóg pide longitud/przekrój/ilość;
  la ficha de paneles pide superficie. No se pregunta al cliente lo que acaba de leer.
- **En `/cennik/` y `/kontakt/` elige el visitante**, con una sola pregunta («Panele sufitowe i
  ścienne» / «Obłogi i lamele») implementada con radio + CSS. Sin JavaScript se ven los dos
  juegos de campos y el navegador valida lo básico; con JavaScript se ve solo el juego elegido.
- **Los `select` no inventan opciones**: perfil, selección y acabado salen de la oferta
  confirmada (`definitionFacts`, `source: 'oferta'`): *prosty / piętro-wpust / do uzgodnienia*,
  *bez sęków / z sękami*, *naturalne / szczotkowane / wędzone*.
- **El payload manda solo el juego activo.** El script recoge los campos explícitamente (no con
  `FormData`), así que al endpoint no le llega una superficie que nadie preguntó.
- **La consentimiento viaja en el mensaje** (art. 7.1 RODO): línea obligatoria
  «Zgoda na kontakt w sprawie tej wyceny: tak» + `consent: true` en el JSON.

Ficheros: `src/content/funnel.ts` (campos y copy), `src/components/QuoteForm.astro` (reescrito),
`src/components/FormField.astro` (nuevo), `src/views/ProductView.astro`, `src/views/TradeView.astro`.

### 1.2 Las CTA aterrizan en el formulario

Todas las CTA de cotización (15 usos: hero, fichas, catálogo, `/dla-firm/`, `/dostawa/`,
`/realizacje/`, `/o-nas/`, barra superior y barra flotante) apuntan ya a
`…/cennik/#quote-form` o a `…/cennik/?produkt=<id>#quote-form`. La CTA de la ficha lleva el
producto al precio: el `select` llega con el producto puesto porque el script lee el parámetro
en el navegador (la página es estática).

### 1.3 Definición citable y coherente (AEO/GEO)

`definitions.oneLiner` —la frase diseñada para que un asistente la cite— está ahora en el HTML
de las tres homes (`<dfn id="definicja">`), y es **la misma cadena** que aparece en:

- el nodo `DefinedTerm` del JSON-LD (`definedTermSchema`), con `inDefinedTermSet`;
- `public/llms.txt`, reescrito con las rutas EN/DE completas y la misma definición.

Que la frase sea la misma en los tres sitios es el punto: una definición citable que cambia de
redacción según el archivo no la cita nadie.

### 1.4 El LCP pesa menos

El hero se sirve con `srcset`/`sizes` (700 / 1000 / 1400 px) y el `<link rel="preload">` lleva
`imagesrcset`/`imagesizes`, así que el preload y el `<img>` piden **la misma** imagen. En la
variante de móvil el hero pasa de **334,8 KB a 86 KB**. La fuente única es
`src/content/hero.ts`.

### 1.5 Copy de venta montado

- `ObjectionList` (6 objeciones escritas, 0 en página) está montado en `/cennik/` y
  `/dla-firm/`, antes del formulario.
- Fuera la numeración decorativa «01 · 02 · 03» de las secciones, de las tarjetas de producto y
  de los componentes (`SectionHead`, `ProductCard`, `QuoteView`, `TradeView`, `CatalogView`,
  `AboutView`, `HowItWorks`).
- Las 8 meta descriptions que prometían un precio unitario sin publicarlo («Cena za mb.»,
  «Price per metre.», «Preis je lfm.») dicen ahora lo que es verdad: el precio **se escribe en
  la oferta**, con su unidad.

### 1.6 Primary de `/dla-firm/`

La keyword principal real es «obłogi dębowe hurtowo» (es lo que escribe el sector). El título
PL ya la llevaba; EN y DE ahora también: «Oak battens for trade — wholesale oak trim» y
«Eichen-Abschlussleisten Großhandel».

### 1.7 Un fallo del propio verificador

`check-html.cjs` daba 21 falsos positivos: cualquier propiedad de objeto con valor lógico
(`consent: true,`) la tomaba por una anotación de tipo de TypeScript. El script es JavaScript
válido (comprobado con `node --check` y en navegador). Se corrigió el **comprobador**, no el
código: `true`, `false`, `null` y `undefined` quedan excluidos del patrón de anotación, que
sigue detectando `(x: string)` y `(a, b: number)`.

---

## 2. Ficheros y páginas tocados

**Contenido y lógica**

| Fichero | Cambio |
|---|---|
| `src/content/funnel.ts` | `funnelFieldsA/B`, `funnelChoice`, `funnelExtras`, `fieldsFor()`, `formCopy.consentYes`; eliminada la copia duplicada de `optionLabels` (dos fuentes de verdad para los mismos valores) |
| `src/content/definitions.ts` | `oneLiner`/`application` sueltos, `lead` compuesto, `term`, `definitionParts()` |
| `src/content/schema.ts` | `definedTermSchema(locale)` (`DefinedTerm` + `DefinedTermSet`) |
| `src/content/hero.ts` | **nuevo** — generador único del `srcset` del hero |
| `src/content/products.ts` | 9 meta descriptions honestas (PL/EN/DE de 3 fichas) |
| `src/i18n/index.ts` | `formHref(locale, route, query)` |
| `src/i18n/ui.ts` | 7 claves nuevas (`form.body.funnel/place/consent/page/locale`, `form.funnelA/B`) |
| `src/components/QuoteForm.astro` | reescrito (embudos A/B, payload explícito, consentimiento) |
| `src/components/FormField.astro` | **nuevo** — un campo, con `data-required` y `required` condicional |
| `src/layouts/BaseLayout.astro` | preload del hero con `imagesrcset`/`imagesizes`; clase `.js` en `<html>` |
| `src/styles/global.css` | bloque 15.1 del selector de embudo, reescrito; `.field__hint` |
| `src/views/*.astro` | variantes del formulario y anclas `#quote-form` (15 CTA) |
| `public/llms.txt` | reescrito con la misma definición y las rutas EN/DE |
| `docs/CMS-INTEGRATION.md` | contrato del payload con los campos nuevos, el `mailto:` y el comportamiento sin JS |

**Páginas afectadas** (40 páginas, 3 idiomas): home ×3, catálogo ×3, 4 fichas ×3, `/cennik/` ×3,
`/dla-firm/` ×3, `/kontakt/` ×3, `/dostawa/` ×3, `/realizacje/` ×3, `/o-nas/` ×3, 404 ×3,
privacidad ×3.

**Herramientas:** `_tools/verify-form.cjs` (reescrito: 25 comprobaciones, de 10), `_tools/check-html.cjs`
(falso positivo corregido).

---

## 3. Mejoras SEO / AEO / GEO

- **Definición citable** en las tres homes, en el JSON-LD (`DefinedTerm`) y en `llms.txt`, con
  la misma redacción. No hay artículo de Wikipedia para «obłóg dębowy»: la web es la fuente
  de referencia y ahora lo dice de forma estructurada.
- **Sin auto-canonización en el formulario:** el `context`, la página y el idioma viajan en el
  lead. Una consulta se puede atribuir a la página que la generó.
- **`llms.txt` alineado** con el sitio real: 8 de 39 rutas estaban descritas; ahora están las
  EN y DE completas, y se dice explícitamente que **sin endpoint el formulario solo abre el
  cliente de correo** (para que un asistente no prometa un envío que no ocurre).
- **Título de `/dla-firm/`** alineado con su keyword principal en los tres idiomas.
- **Meta descriptions honestas:** ninguna promete un precio que el sitio no publica.
- **LCP:** el preload ya no apunta a otra foto y el móvil descarga 86 KB en vez de 334,8 KB.

## 4. Mejoras comerciales

- **El formulario hace la conversación que el cliente va a tener**: quien pregunta por 40 m²
  de techo y quien pide 20 mb de listón escriben los mismos datos, cada uno en sus unidades. El
  que va a m² ya no tiene que traducir su proyecto a metros.
- **Cero fricción en el primer paso:** una sola pregunta, tres campos, y el resto (módulos,
  habitación, perfil, acabado) debajo de «añadir». La pregunta es *qué* se cotiza, no una
  batería de datos que hay que rellenar antes de entender nada.
- **Objeciones visibles antes del formulario** (6 respuestas breves, sin letra pequeña):
  pedido mínimo, plazo, factura, envío, muestra, veta de madera. La quinta objeción —«¿y si la
  madera no es como en la foto?»— es la que más cuesta en un producto natural.
- **Todas las CTA llevan al formulario**, que era el punto donde se perdía el lead.
- **Sin pérdida de lead:** sin endpoint, el resultado es `prepared` (se abrió tu correo, falta
  pulsar Enviar) y se ofrecen WhatsApp y teléfono. Nunca se dice «llegó» sin que haya llegado.

## 5. Estado real del formulario y de las integraciones

| Elemento | Estado | Nota |
|---|---|---|
| `PUBLIC_QUOTE_ENDPOINT` | **No existe** | Sin él el formulario **no entrega nada**: compone un `mailto:` y lo deja preparado. Es el bloqueo nº1. |
| `company.contactEmail` | **Provisional** | `kontakt@doors-oblogi.pl` con TODO. Viene de un dato no confirmado; el buzón real no está confirmado por el cliente. |
| `mailto:` | **Funciona** | Cuerpo con la primera línea `[lead] …`, los datos del embudo y la línea de consentimiento. Testado en Chrome. |
| WhatsApp | **Funciona** | Enlaza con el texto del formulario ya montado. Número real (`+48 696 741 679`). |
| Teléfono | **Funciona** | `tel:+48696741679` (prefijo internacional). |
| Estado `success` | **Nunca sin endpoint** | Solo se pinta si el `fetch` devuelve 2xx. |
| Consentimiento (RODO) | **En el mensaje** | Línea obligatoria + `consent: true` en el JSON. |
| Medición | **Sin cookies ni terceros** | Solo `context`/`page`/`locale`/`funnel` en el lead. No hay contador de clics: depende de que el cliente lo apruebe. |
| Google Business / Search Console | **No configurados** | No hay acceso ni datos. |

## 6. Pruebas ejecutadas

```
npm run build      → 40 páginas, 0 errores
npm run verify     → 0 problemas (8 comprobadores: meta, dist, JSON-LD, keywords, HTML, contraste, assets, presupuesto)
node _tools/verify-form.cjs   → TODO OK (25 comprobaciones)
node _tools/verify-p0.cjs     → TODO OK (8 comprobaciones: menú móvil ×4, contraste ×4)
node _tools/verify-hero.cjs   → TODO OK (4 comprobaciones: bucle, cobertura, reduced-motion)
```

Qué cubren las 25 comprobaciones del formulario, en Chrome real (headless + CDP):

1. `?produkt=` llega preseleccionado desde la ficha.
2. En `/cennik/` se ve **un solo** juego de campos y la pregunta está a la vista.
3. Al cambiar de embudo, cambian los campos.
4. Sin endpoint, el resultado es `prepared`, **nunca** `success`; el texto dice que se abrió el
   cliente de correo y ofrece WhatsApp y teléfono reales (`wa.me`, `tel:+48`).
5. El cuerpo lleva el contexto de la página y el producto.
6. El cuerpo nombra el embudo, lleva **solo** sus campos (nunca los del otro) y termina con la
   línea de consentimiento y con «Język: pl».
7. Sin el campo obligatorio del embudo **no** se envía, y no se muestra un resultado falso.
8. La CTA de la ficha apunta a `/cennik/?produkt=…#quote-form`.
9. La ficha de obłóg pide **un** juego de campos (B) y no hace la pregunta de embudo; la de
   paneles pide superficie (A), no longitud.

Medido también: **JS máximo 35,0 KB gzip por página** (presupuesto 60), 1 chunk de 26,7 KB
gzip en todo el sitio, 0 assets inexistentes, contraste AA en todas las superficies (también
en `.section--dark`), `hreflang` recíproco con `x-default`, sitemap con 39 URLs, `title` únicos
≤60 y `description` ≤160.

## 7. Lo que hay que confirmar con el cliente

Sin esto, la web no puede cerrar el embudo ni afinar el SEO:

| # | Pregunta | Qué desbloquea |
|---|---|---|
| 1 | **¿Qué buzón recibe las consultas?** ¿Es `kontakt@doors-oblogi.pl`? | El `mailto:` actual es provisional. Sin buzón confirmado, el lead se pierde en el correo del visitante. |
| 2 | **¿Se conecta un endpoint de envío?** (`PUBLIC_QUOTE_ENDPOINT`) | Sin él no hay `success`, no hay hoja de leads y no hay medición. Es el bloqueo nº1. |
| 3 | **¿Doors fabrica los paneles terminados o solo las listones?** Hoy el repo dice ambas cosas en sitios distintos. | Condiciona la ficha de paneles, la relación con SEDO y el bloque de ceilings. |
| 4 | **¿Quién prepara el presupuesto?** (el brief dice Artur; la web firma Szymon) | Atribución del lead y firma del correo. |
| 5 | **¿Plazo real y tiempo de respuesta?** | `terms.ts` lo tiene sin confirmar; no se publica ningún plazo. La maqueta de `/kontakt/` trae «odpowiadamy w ciągu 24 godzin» y el horario «pon.–pt. 8:00–16:00»: los dos están **fuera** de la web hasta que el cliente los confirme. |
| 6 | **¿Pedido mínimo y coste de la muestra?** | Dos objeciones responden «se confirma en la oferta». |
| 7 | **¿Forma de pago, factura, garantía, humedad y almacenaje de la partida?** | Tabla de condiciones y objeciones. |
| 8 | **¿Se publican precios?** | Si sí: `pricing.ts` está listo (`published: null`) y propaga a pantalla, JSON-LD y `priceRange`. Si no, se quedan las descripciones actuales. |
| 9 | **¿Se miden los clics a teléfono y WhatsApp?** | Sin contador first-party aprobado no se mide nada; hoy no hay cookies ni terceros. |
| 10 | **¿Siguen en pie `/en/` y `/de/`?** | `currenciesAccepted: PLN` y envío solo en Polonia: hay hreflang a rutas que no se pueden cerrar. |
| 11 | **Fotos propias de techos y escaleras** (2 de stock) y **hero empalpable de ≥2400 px** | Cierre del bloque de servicios y del bucle del hero. |
| 12 | **Relación exacta con SEDO** | Hoy se describe de forma factual (paneles hechos con nuestros obłogi). |
| 13 | **Código postal, horario, forma jurídica, NIP, año de fundación** | `Organization` del JSON-LD y ficha de Google. |

## 8. Pendientes y siguientes prioridades

**P1 — ejecutable ya, siguiente tanda** (todo en el repo, sin datos del cliente):

1. **Alinear los 22 `<title>`** que siguen sin su keyword principal (`check-keywords.mjs` los
   lista ruta por ruta). Los de `/dla-firm/` EN y DE ya están hechos.
2. **Dejar de repetir la FAQPage**: 108 entradas, 69 únicas, 39 duplicadas. Google ya no da rich
   result de FAQ fuera de govt/salud, y para AEO la misma respuesta compite contra sí misma.
   Una dueña por pregunta.
3. **Nodos `Service` + `ItemList`**: 0 nodos `Service` y 0 `ItemList` en 40 páginas.
4. **Referencias cruzadas a `/realizacje/`** desde las fichas, y WhatsApp en el punto de
   conversión (`CtaBand` y tarjeta de contacto).
5. **Deduplicar condiciones**: la tabla de 8 filas se monta en 18 URLs con texto idéntico.
6. **DE: «nach Maß»** en `name`, `seoTitle` y H1 («auf Maß» tiene 0 sugerencias; «nach Maß», 2).
   El slug no se toca hasta que el cliente decida sobre `/de/`.
7. **301 reales**: los 10 slugs antiguos se sirven como 200 + meta-refresh + noindex. No hay
   `_redirects` ni `netlify.toml` → hace falta el hosting.

**P2 — bloqueado por el cliente** (ver §7): `/wybor-oblogu/`, las tres fichas de caso real,
Google Business Profile, contador first-party y el resto de los datos.

**Lo que no se ha tocado y es deliberado:** el hero, los colores, la tipografía, la foto de
servicios (incluidas las dos de stock: es un demo y el bloque tiene que verse completo) y la
estructura de las páginas. La fase de diseño ya pasó; esta tanda era defunnel, verdad y SEO.

---

## Ronda 2 — revisión externa de copy aplicada (27/10, tarde)

Una revisión del cliente en español, punto por punto, aplicada sobre `dist/`. Lo que cambió y
lo que NO se cambió, con el motivo:

| Punto de la revisión | Qué se ha hecho |
|---|---|
| H1: «Gotowe panele sufitowe i ścienne z naturalnego dębu» | **Aplicado en versión compatible.** El H1 ahora es «Obłóg dębowy i gotowe panele sufitowe» (EN: *Oak trim battens and ready-made ceiling panels*; DE: *Eichen-Abschlussleisten und fertige Deckenpaneele*). La versión literal de la revisión deja la home sin su keyword principal (`obłóg dębowy`, mapa de keywords y ESTRATEGIA §7) y duplica el título de la ficha de paneles. Con las dos cosas en la línea, los paneles van delante y la keyword no se pierde. **Cambiarlo a la versión literal es una línea** (`src/content/pages.ts`, `home.hero.title`). |
| Subtítulo que repite las etiquetas | Corregido. El subtítulo lleva ahora el catálogo y la promesa («wycena indywidualna»); las etiquetas llevan los datos duros que el subtítulo ya no dice: 100 % dąb, cięcie na wymiar, dwie selekcje, Słonecznik. |
| CTA por producto | Aplicado. Bloque de techos: «Zapytaj o panele sufitowe». Fichas: «Zapytaj o wycenę obłogu» / «…obłogu wędzonego» / «…lameli» / «Zapytaj o panele sufitowe» (campo `ctaLabel` en `products.ts`). El CTA del hero y de la barra se queda **genérico** a propósito: el formulario hace la pregunta de embudo (A = paneles, B = listones), así que un CTA que presupone el producto dejaría fuera a la otra mitad. |
| «Wyślemy cennik…» → oferta individual | Aplicado en todo el sitio: microcopy, formulario, bloques de catálogo, contacto, entrega, fichas, definición y `pricing`. Ahora se promete «przygotujemy indywidualną wycenę z terminem realizacji». La palabra «cennik» se conserva donde es el nombre de la sección y la keyword (`/cennik/`, «Poproś o cennik»). |
| Bloque `/cennik/` | Título nuevo: «Indywidualna wycena dopasowana do zamówienia». El resto (por qué no hay cennik publicado, precio unitario + termin + condiciones) ya coincidía con la promesa de la revisión. |
| Errores de idioma | «które dała kora» → «jakie są w drewnie» (y sus versiones EN/DE: la kora no da color ni veta). «szczotkowanymi paneli dębowymi» → «poziomymi deskami dębowymi». |
| `alt` con afirmaciones que la foto no demuestra | Auditados los 14 `alt` con texto largo, **mirando las fotos una a una**: la foto de «Sufity» es una viga de madera (no un techo de paneles) y la de «panele ścienne» son tablas horizontales (no «szczotkowane»). Los `alt` de stock describen lo que se ve; el dato comercial («z naszych obłogów») vive en el texto visible. |
| Formularios por tipo de producto | **Ya estaba hecho** en la ronda anterior: dos embudos con una pregunta y campos propios por producto. |
| «Revisar que las secciones no se repitan y cada página tenga función comercial» | **No aplicado**: es un rediseño estructural de la home, no un cambio de copy. Queda como primera tarea de la tanda P1. |

Verificación tras la ronda: `npm run build` (40 páginas, 0 errores) · `npm run verify` (0
problemas) · `verify-form` / `verify-p0` / `verify-hero` en verde.

---

## Ronda 3 — bloque «Sufity dębowe» rediseñado (28/10)

El bloque de techos de la home, rediseñado a petición del cliente («quizás con un fondo claro y
mejor orden visual para que sea fácil de leer»). El bloque de **Material** se queda tal cual,
como pidió.

**Qué cambia**

1. **Fondo claro.** El bloque pasa de `section--dark` a `section--cream`. Antes venía el hero
   oscuro y detrás venía el bloque de Material, también oscuro: dos superficies oscuras
   seguidas, que rompen la alternancia clara/oscura y hacen que el texto pese. Con crema, la
   lectura es inmediata.
2. **Orden de lectura nuevo**: qué es (título) → por qué (entradilla) → **la prueba** → los dos
   beneficios → la acción. La prueba sube porque es el dato que distingue (los paneles salen de
   nuestros propios obłogi) y el que justifica la foto de al lado; antes estaba enterrada entre
   los beneficios y el botón.
3. **La prueba se marca**: filete de acento a la izquierda y cuerpo mayor, el mismo recurso que
   el pie de foto. Deja de ser un párrafo más.
4. **Los dos beneficios en dos columnas**: son hechos paralelos (perfil y krawędź / una sola
   selekcja), y en columna se leen como dos párrafos largos apilados.
5. **Pie de foto sin repetir**: «Materiał SEDO: panele dębowe w dwóch wariantach» — lo de
   «z naszych obłogów» lo dice ahora la prueba, que está al lado. Repetido dos veces, se leía
   como disco rayado.
6. **Foto más grande** (hasta 1200 px en vez de 960) y columnas a partes iguales.
7. **El CTA baja a la oferta con el producto**: «Zapytaj o panele sufitowe» apunta a
   `/cennik/?produkt=panele-dabowe#quote-form`, y el formulario **elige el embudo por el
   producto** (nuevo `funnelByProduct` en `funnel.ts`): quien llega desde ese botón ya ha dicho
   de qué va la consulta, así que no se le vuelve a preguntar entre paneles y listones.

**Un fallo que se coló y se detectó midiendo**: la clase del grid estaba también en el
`<section>`, que se convertía en una rejilla de dos columnas y metía el `.container` en media
pantalla (563 px de ancho con un viewport de 1280). Se vio en la captura, se midió en el
navegador y se corrigió moviendo la clase al div interior (`.ceilings__grid`).

Verificación: `npm run build` (40 páginas, 0 errores) · `npm run verify` (0 problemas) ·
`verify-form` 28/28 (con dos comprobaciones nuevas: el producto decide el embudo y sin
producto el formulario no presupone ninguno) · `verify-p0` y `verify-hero` en verde.

---

## Ronda 4 — la sección de datos de las fichas de producto (29/10)

Las cuatro fichas de producto (`/produkty/oblog-debowy-ciety/`, `oblog-debowy-wedzony/`,
`lamela-debowa/`, `panele-dabowe/`) tenían la información repartida en **dos secciones apiladas**:
«Dane techniczne» + «Dlaczego», y debajo «Cena» + «Warunki». Entre las dos se colaba una tercera
tabla, «Dane techniczne drewna», con siete filas que decían casi todas *«potwierdzamy w wycenie»*.
El resultado era largo de leer y repetitivo: nueve filas de «te lo confirmamos en la oferta» antes
de llegar al precio.

**Qué cambia**

1. **Una rejilla 2×2 en vez de cuatro bloques apilados.** Cuatro unidades, en el orden que se leen:
   *qué recibes* → *por qué te eligen* → *cuánto cuesta* → *qué confirmamos*. En móvil baja a una
   columna.
2. **Los tres motivos llevan icono** (regla, árbol, capas / nave), así que el bloque se lee de un
   vistazo y no como tres párrafos iguales.
3. **Desaparece la tabla de «dane techniczne drewna»** de la ficha: humedad, gęstość, tolerancias
   y przekrój máximo se confirman en la oferta, y decirlo nueve veces no informa. Los datos
   siguen vivos en `terms.rows` (ocho filas) y se muestran enteros en `/dostawa/`, `/kontakt/` y
   `/dla-firm/`.
4. **La tabla de «warunki» baja a cinco filas** (precio, termin, dostawa, dostępność, documentos) —
   los mismos hechos de siempre, en `orderSummary` (`src/content/terms.ts`). Se leen como lo que
   son: lo que se confirma por escrito cuando llega la oferta.
5. **Una fila nueva en las especificaciones**: «Wykończenie» (naturalne / szczotkowane / wędzone),
   que antes solo vivía en la tabla de madera.
6. **Cierre con la acción**: filete arriba, «Masz projekt?» entre dos reglas y el CTA del producto
   debajo. Un solo botón, el que corresponde a esa ficha.
7. **Alternancia de superficies mantenida**: al fusionar los bloques, la galería pasa a `paper` y
   el FAQ a `cream` para que no queden dos superficies iguales seguidas
   (paper → cream → paper → cream → dark → paper).
8. **Las tablas de datos son una ficha técnica, no un catálogo.** El valor ya no va en la serif de
   titular a 23 px: va en el grotesco a tamaño de cuerpo (16–18 px), con la etiqueta en columna
   fija de 11,5 rem — todos los valores arrancan en la misma x — y filas más compactas. Se lee de
   un vistazo y de arriba abajo. El tratamiento es el del componente `.specs`, así que afecta
   también a los bloques de precio y de pedido de la misma rejilla: tocar solo uno la dejaría
   rota. Las tablas de `/dostawa/`, `/kontakt/` y `/dla-firm/` **no** cambian.
9. **El bloque de los tres motivos es una tabla más.** Filete arriba, separadores entre motivos,
   icono con más presencia (1,9 rem) en columna fija y el texto a tamaño de cuerpo en vez de a
   13 px. Con esto las cuatro piezas de la rejilla arrancan con la misma línea y la columna de
   los motivos deja de quedarse corta frente a la de datos.
10. **Precio y pedido: la tabla deja de mezclar datos con frases.** «Jak wyceniamy obłogi
    dębowe» («Ceny nie publikujemy…») sale de la tabla y se convierte en una **nota con filete
    de acento** debajo: no es un parámetro, es la política de precios y la respuesta a
    «¿cuánto cuesta?». En el bloque de pedido las frases van en regular —el peso medio era un
    muro de texto—, con más aire entre filas y una columna de etiqueta más estrecha (8,5 rem
    en vez de 11,5), porque ahí las etiquetas son cortas y las frases respiran más.

**Ficheros tocados**: `src/views/ProductView.astro` (nueva sección `.product-facts`, imports de
`Icon` y `orderSummary`, fuera `woodTechnical` y `TermsTable`) · `src/styles/global.css` (bloque
`.product-facts*`) · `src/content/terms.ts` (`orderSummary`) · `src/content/products.ts`
(`highlights.icon` en los 12 motivos, fila «Wykończenie») · `src/i18n/ui.ts` (dos claves nuevas:
`product.factsCtaTitle`, `product.factsCtaText`).

**Nota**: `src/content/technical.ts` (los datos técnicos de la madera) deja de pintarse en la ficha
—ya no se renderiza en ninguna página— pero **no se borra**: es contenido real y confirmado, útil
cuando el cliente quiera volver a sacarlo o al conectar el CMS.

Verificación: `npm run build` (40 páginas, 0 errores) · `npm run verify` (40 páginas, 0 problemas;
contraste AA en todas las pares, 0 assets inexistentes, 35,3 KB gzip de JS por página) ·
`verify-form` 28/28 · `verify-p0` y `verify-hero` en verde · capturas de la rejilla en PL a 1280 px
y 390 px y en EN.

---

## Ronda 5 — copy nuevo del bloque «Sufity dębowe» (28/10)

El cliente envía el texto definitivo del bloque estrella de la home y sustituye al anterior. Se
aplica **tal cual**, en polaco, y se traduce a EN y DE.

**Qué cambia en el contenido**

1. **Rótulo + titular**: «Sufity dębowe SEDO» / «Panele sufitowe i ścienne z naszych obłogów».
   Antes el rótulo era «Sufity dębowe» y el titular «Panele sufitowe z naszych obłogów».
2. **Entradilla nueva** (dos frases), en la serif de titular.
3. **Apartado nuevo** «Dlaczego warto wybrać panele SEDO?» con filete arriba.
4. **Dos beneficios con textos nuevos y mucho más largos** (3 frases cada uno).
5. **Apartado nuevo** «Dwa warianty do wyboru:» con los dos materiales de SEDO y su carácter.
6. **Pregunta de cierre** antes de los botones: «Szukasz idealnego rozwiązania na swój sufit lub
   ścianę?».
7. **El botón de teléfono** pasa de «Zadzwoń» (rótulo global del sitio) a «Zadzwoń do nas», con
   clave propia `ceilings.ctaCall` para no tocar los 15 «Zadzwoń / Call us / Anrufen» del resto
   de la web.
8. **Desaparece la «prueba»** (el párrafo con filete que decía que los paneles salen de nuestros
   propios obłogi): el dato no se pierde, pasa a la entradilla. Su CSS también.

**Qué cambia en el diseño (por culpa del texto nuevo)**

9. **Los beneficios se apilan.** Con textos tres veces más largos, en dos columnas de 280 px se
   convertían en un muro de texto; a ancho de columna se leen.
10. **Los dos variantes van en dos columnas**: son cortos y paralelos.
11. **La foto acompaña la lectura** (`position: sticky` a partir de 62 rem). El bloque de texto
    pasó de ~700 px a ~1.700 px de alto: sin esto, la mitad derecha de la sección quedaba vacía.
    Se va con el bloque y no invade nada.
12. **Jerarquía de títulos**: h2 (sección) → h3 (los dos subapartados) → h4 (beneficios y
    variantes). Antes los beneficios eran h3 y ahora el bloque tiene subapartados.

**Los «1.» y «2.» de los variantes no se maquetan**: la regla 13 del proyecto (decisión del
cliente del 27/10) prohíbe la numeración decorativa. Los dos materiales se presentan en dos
columnas con su título y su descripción; el contenido es el mismo.

**Ficheros**: `src/content/home-sections.ts` (el bloque `ceilings` entero, PL/EN/DE) ·
`src/views/HomeView.astro` (markup del bloque) · `src/styles/global.css` (`.ceilings__subhead`,
`.ceilings__variants*`, `.ceilings__closing`, foto sticky, fuera `.ceilings__proof`).

Verificación: `npm run build` (40 páginas, 0 errores) · `npm run verify` (0 problemas) ·
`verify-form`, `verify-p0` y `verify-hero` en verde · capturas en PL (1280 y 390 px) y DE.

### Ronda 5b — el bloque quedó demasiado largo (28/10, tarde)

El cliente aplica el copy pero se queja de que **el bloque quedó muy largo**. Se recorta sin perder
ningún dato ni la llamada a la acción:

- **Palabras: ~180 → 139** (contadas sobre el HTML generado). Sale el relleno superlativo y
  adjectivo que el propio proyecto prohíbe («najwyższej jakości», «rzemieślniczą tradycję z
  nowoczesną wygodą montażu», «Dbamy o perfekcyjną estetykę», «harmonijną kompozycję») y se
  queda el hecho: los paneles salen de nuestros obłogi, con perfil y krawędź listas.
- **Altura: 1.381 → 1.225 px** (−11 %): menos entradilla (3 líneas menos), benefiting del título
  sin el paréntesis redundante («Kompleksowe wykończenie» + el detalle va al texto) y espaciado
  más corto entre apartados (subtítulos, beneficios, variantes, cierre y botones).
- Se conserva todo lo que el cliente escribió: los dos subapartados, los dos variantes con su
  descripción, la pregunta de cierre y los dos botones.

**Pendiente de decidir por el cliente**: el bloque sigue teniendo una columna derecha con espacio
libre por debajo de la foto. La opción que lo deja corto de verdad es **bajar el apartado «Dwa
warianty» a la columna de la foto** (bajo el gráfico, que ya muestra los dos materiales): el
bloque bajaría a ~1.000 px y las dos columnas quedarían parejas. No se ha hecho porque es una
decisión de maquetación, no de texto.

Verificación: `npm run build` (40 páginas, 0 errores) · `npm run verify` (0 problemas) ·
`verify-form`, `verify-p0` y `verify-hero` en verde.

### Ronda 6 — fotos nuevas del cliente (28/10, tarde)

El cliente deja seis fotos nuevas en `public/images/` con los nombres de descarga de Facebook. Se
analizan una a una, se renombran con el criterio del proyecto y se reparten por la web.

**Qué eran** (nombre nuevo ← origen)

| Fichero | Qué es | Dónde está ahora |
|---|---|---|
| `sedo-warianty.png` ← `40a540ba….png` | Gráfico SEDO limpio: «Bez nud» / «Z nudami» | Home (bloque Sufity), ficha de paneles, `/realizacje/` |
| `sufit-sedo-realny.jpg` ← `7.jpg` | Techo de paneles de roble con focos, ya instalado | Home (servicio Sufity), ficha de paneles, `/realizacje/` |
| `oblog-w-hali.jpg` ← `431588062….jpg` | Obłogi apilados en la hala, con el przekrój a la vista | Home, ficha de obłóg, `/o-nas/`, `/realizacje/` |
| `pomiar-oblogu.jpg` ← `e8eee1fd….jpg` | Deska con cinta métrica: el corte a medida, en la foto | Ficha de obłóg, `/realizacje/` |
| `deski-na-placu.jpg` ← `real.jpg` | Desks apiladas en el patio | `/realizacje/` |
| `deski-z-sakami.jpg` ← `07c96a39….jpg` | Dos tablas con sęki | Ficha de paneles, `/realizacje/` |

**Cambios en la web**

1. **El gráfico de SEDO sustituye al antiguo** en el bloque «Sufity dębowe» de la home. El viejo
   (`wspolpraca-sedo.webp`) tenía un velo magenta y rótulos «BEZSĘCZNY»; el nuevo es limpio y
   encaja con la paleta del sitio. El archivo viejo sigue en el repo, sin usar.
2. **La foto de stock del servicio «Sufity» se sustituye por la del cliente.** Era una viga de
   cubierta de Pexels, no un techo de paneles; ahora es un techo de roble real. En «Schody» sigue
   la de stock: no ha llegado foto propia de escaleras.
3. **La ficha de obłóg** suma la foto de la hala y la del corte a medida (6 fotos: 2 filas de 3).
4. **La ficha de paneles** lleva el gráfico de SEDO en banda a lo ancho y tres fotos más.
5. **`/o-nas/`** abre con la foto de la hala: encaja con el título («pracownia obłogów
   dębowych») mejor que la de dąb wędzony, que se queda en la ficha del producto ahumado.
6. **`/realizacje/`** pasa de 9 a 14 fotos.

**Rejilla: por qué se tocó el CSS**

Mezclar fotos de distintas proporciones en una rejilla de 3 o 4 columnas dejaba huecos y
celdas vacías. Se añade una figura nueva, **banda a lo ancho** (`grid-column: 1 / -1` con la
proporción real), para el gráfico de SEDO: es 3/2 y lleva los rótulos dentro del encuadre, así
que recortarlo a 3/4 los perdía. El resto de las fichas se unifican a 3/4 y el número de fotos
de cada rejilla es múltiplo de las columnas.

**Peso y paquete**

- Los originales nuevos se reescalan a 1.400 px y se recomprimen (jpg q82) antes de entrar en
  `src/assets/`: las fichas servidas pesan entre 15 y 330 KB en webp, no 700.
- Los crudos sin usar se han movido de `public/images/` a `_media/cliente/` (7,9 MB): `public/`
  se copia tal cual a `dist/` y esos ficheros no los usaba nadie. **En `public/images/` solo
  quedan los que sirven: el logo (web y master), el mapa y la máscara del grano.**
- `dist/` pesa 16,5 MB.

Verificación: `npm run build` (40 páginas, 0 errores) · `npm run verify` (0 problemas, 0 assets
inexistentes) · `verify-form`, `verify-p0` y `verify-hero` en verde · capturas revisadas en
escritorio de la home, las dos fichas, la galería y `/o-nas/`.

### Ronda 6b — la sección de selección usa una sola imagen (28/10)

El bloque «Dwa warianty wykończenia drewna» de la home llevaba **dos fotos** (una por variante) con
sus textos debajo. Ahora lleva **una sola imagen**: el gráfico de comparación del cliente con los
dos materiales de golpe, a la izquierda y ancho para que los rótulos «Bez nud» / «Z nudami» se lean;
a la derecha, las dos descripciones («Bez sęków» y «Z sękami») separadas por un filete.

- La sección **baja de ~700 a 504 px** y las fotos sueltas (`deska-debowa-naturalna.jpg` y
  `dab-z-sakami.jpg`) dejan de hacer de ilustración redundante: siguen usándose en la galería, en
  la tira de la home y en las fichas.
- `alt` nuevo para el gráfico (`media.home.selectionAlt`); los dos `alt` de las fotos anteriores
  (`selectionKnotFreeAlt`, `selectionKnottyAlt`) se borran por no tener ya foto a la que
  describir.
- El gráfico sale **servido en webp** por el pipeline de Astro, como el resto.

Verificación: `npm run build` (40 páginas, 0 errores) · `npm run verify` (0 problemas) ·
`verify-form` y `verify-p0` en verde · capturas en 1280 px y 390 px.

### Ronda 7 — el bloque de techos pasa a ser la maqueta del cliente (28/10)

El cliente mandó una maqueta del bloque de techos y pidió que la sección se mostrara **exactamente
como en la imagen**. La maqueta es, a partir de aquí, la especificación de diseño del bloque: dos
franjas seguidas en la home, cada una con su propio módulo de contenido (`src/content/sedo.ts`).

**Franja alta — «Panele sufitowe i ścienne z naszych obłogów»** (`.sedo`, crema)

- Texto a la izquierda: rótulo, titular, entradilla, **tres características con icono** y
  filete vertical, cierre en serif y los **dos botones en fila**.
- La foto **a sangre** hasta el borde de la pantalla (`sufit-sedo-realny.jpg`, del cliente), con
  pie de foto y filete arriba, como en la maqueta.
- Los filetes van **entre** columnas: la primera arranca en el margen del texto.

**Franja baja — «Bez sęków i z sękami»** (`.sedo-variants`, papel)

- Izquierda: rótulo, titular, entradilla, un **filete corto** y la **leyenda de las dos
  selecciones en fila** (miniatura redonda + nombre + una línea).
- Centro: las **dos fotos del material con chapa oscura** arriba a la izquierda y pie de foto
  debajo, sobre fondo crema.
- Derecha: la **tarjeta crema «Gotowy system do Twojego wnętrza»** con los tres usos (sufitos,
  paredes, puertas) con icono y las dos salidas: «Poproś o wycenę» (relleno) y «Zadzwoń»
  (enlace con el icono del teléfono, sin caja, como en la maqueta).

**La antigua sección «Selección» (oscura) desaparece**: sus dos descripciones y su entradilla
viven ahora en la franja baja, y el gráfico de comparación sigue en la ficha de paneles y en
`/realizacje/`. La home gana la alternancia clara → clara de la maqueta y pierde un bloque.

**Copy**: se conserva el que el cliente ya había aprobado (entradilla, las dos primeras
características, el cierre). Los huecos que la maqueta añade —la tercera característica
(«Naturalny dąb»), la leyenda, la tarjeta y los pies— llevan el texto de la maqueta. La etiqueta
de la llamada se acorta a «Zadzwoń» / «Call» / «Anrufen», como en la maqueta, porque «Zadzwoń do
nas» no cabía en la fila de la tarjeta sin apretar la etiqueta.

**Las fotos de las dos selecciones** son recortes de `sedo-wvarianty.png` (768×768), sin el rótulo
impreso: el gráfico entero sigue en la ficha de paneles, donde sus rótulos sí se leen.

**Los botones de estas dos franjas son compactos** (11,7 px, 41 px de alto, `white-space:
nowrap`, `flex: none`): el botón base del sitio es más grande y en la maqueta los dos caben en
fila dentro de una columna estrecha. Miden 243 + 177 px en la franja alta y 176 + 100 px en la
tarjeta, medidos en el navegador real a 1280 px.

Verificación: `npm run build` (40 páginas, 0 errores) · `npm run verify` (40 páginas, 0
problemas, 0 assets inexistentes, contraste AA, 35,3 KB gzip de JS por página) · `verify-form`
(28 comprobaciones), `verify-p0` y `verify-hero` en verde · mediciones y capturas a 390, 768,
1024, 1280 y 1440 px en los tres idiomas · sin desbordamiento horizontal en ningún ancho.

**Ancho de la franja baja**: entre 992 y 1.180 px la tarjeta se queda estrecha para sus dos
botones, así que la llamada baja a una línea (los botones se parten, nunca la etiqueta). A
partir de 1.180 px los dos van en fila, como en la maqueta, en los tres idiomas.

**Las tres columnas miden lo mismo** (petición del cliente: la tarjeta colgaba por debajo del
resto). Medido antes del cambio: texto 294 px, fotos 288 px, tarjeta **467 px**. Ahora:

- La rejilla pasa a `align-items: stretch` y las tres columnas se igualan: **342 px** en polaco y
  en inglés a 1440 px (387 px en alemán, cuyo texto es más largo), 341 px a 1280 px y 422 px a
  1024 px.
- La tarjeta baja de 467 a 342 px: título a `--step-0` (cabe en una línea), texto a 0,95 rem,
  usos a `--step--1`, menos padding y menos aire entre bloques. Los botones se van al pie de la
  tarjeta con `margin-top: auto`.
- Las dos fotos **crecen** hasta el alto de su columna (218 × 272 px en lugar de 218 × 218), así
  que el bloque de fotos también cierra en recto. En móvil (por debajo de 62 rem) siguen siendo
  cuadradas: el crecimiento es solo de escritorio.
- La leyenda baja al pie de su columna (`margin-top: auto`), alineada con el borde inferior de
  las fotos.

La banda baja pasa de 716 a 591 px de alto: menos scroll y el borde inferior queda recto.

### Ronda 8 — la página `/dla-firm/` se rehace con la maqueta del cliente (28/10)

El cliente mandó una maqueta de la página de colaboración y pidió que quedara «mejor optimizada,
inspirándose en la imagen como guía». La página era un muro de texto: un titular con medio cuerpo
vacío a la derecha, tres párrafos seguidos, una lista de seis preguntas, cuatro textos sin icono y
un formulario perdido en una franja negra. Ahora sigue la estructura de la maqueta.

**Las seis franjas**

1. **Hero a dos columnas** (crema): el texto a la izquierda —rótulo, titular, entradilla y los dos
   botones— y la foto **a sangre** a la derecha (`oblog-w-hali.jpg`: los obłogi apilados en la
   hala, con el perfil y la krawędź a la vista; es la foto que pedía la maqueta).
2. **Las cuatro características** con icono y filete entre columnas: perfil estable, wycena partii,
   dostawa kurierem y warunki potwierdzane pisemnie. Iconos: `oak`, `stack`, `truck` y `document`
   (este último, nuevo).
3. **Banda oscura «Prosto i konkretnie»**: los tres pasos de la colaboración, con su número (el
   orden del paso, no un índice decorativo) y una flecha entre ellos.
4. **Datos técnicos y preguntas**, a dos columnas: la tabla de datos a la izquierda y las
   preguntas del comprador profesional a la derecha.
5. **El formulario**: la madera a la izquierda y el formulario de partida a la derecha.
6. **La franja de cierre** con la madera a la izquierda, el título y las dos salidas (WhatsApp y
   teléfono). La banda `CtaBand` admite ahora una foto opcional (`image`); sin ella sigue igual
   que en las demás páginas.

**Lo que se movió y por qué**

- El bloque de prosa (tres párrafos) desaparece: su contenido está repartido entre la entradilla
  de las características («seria zamówień na ten sam profil»), el bloque de la wycena partii y los
  tres pasos. No se pierde ni un dato.
- La lista de objeciones pasa de seis preguntas a **cuatro** —las del comprador profesional:
  volumen mínimo, plazo de entrega, factura y envíos fuera de Polonia— porque en la maqueta la
  columna de preguntas va a la altura de la tabla de datos. Las otras dos (la madera no es igual
  que en la foto y la muestra de perfil) se quedan en `/cennik/`, donde sigue la lista completa.
- Bajo la tabla se añade una nota con el motivo por el que no hay cennik publicado y el enlace al
  teléfono, que también equilibra las dos columnas.

**La tabla de datos técnicos** reutiliza el componente `.specs` de la web. Al hacerlo, el valor
pasa al cuerpo de texto (Archivo, `--step-0`, peso 500) en vez de la serif del titular: es el
tratamiento que el cliente pidió el 28/10 para las fichas de producto, y como es el mismo
componente, **se aplica a todos** —las tablas de `/dostawa/` y `/kontakt/` también cambian.

**Copy**: todo el contenido es real y comprobable. El H1 no se toca (va con el mapa de keywords).
La etiqueta del botón principal se ajusta por idioma para que los dos quepan en fila: «Wyceń swoje
zamówienie» / «Get a quote» / «Angebot einholen».

**Botones del hero**:Compactos (11,7 px, `nowrap`), como en la maqueta. El botón base del sitio es
más grande y los dos no cabían en la columna.

Verificación: `npm run build` (40 páginas, 0 errores) · `npm run verify` (40 páginas, 0 problemas,
0 assets inexistentes, contraste AA, presupuesto de JS OK) · `verify-form`, `verify-p0` y
`verify-hero` en verde · mediciones y capturas a 390, 1280 y 1440 px en polaco, inglés y alemán, sin
desbordamiento horizontal en ningún ancho ni idioma.

### Ronda 9 — la página `/kontakt/` se rehace con la maqueta del cliente (28/10)

El cliente mandó la maqueta de la página de contacto y pidió que quedara «mejor presentada,
inspirándose en la imagen». La página era un formulario suelto sobre crema, con los datos de
contacto en un bloque plano, sin foto y sin explicación de cómo es una consulta de principio a
fin. Ahora sigue la estructura de la maqueta.

**Las cinco franjas**

1. **Hero a tres columnas** (crema): rótulo, titular y entradilla a la izquierda; la foto del
   cliente (`deski-na-placu.jpg`) a 4:3 en el centro; y a la derecha el pie en serif cursiva con
   filete.
2. **Datos y formulario** (papel): columna estrecha con el logo, la lista de contacto con icono
   (pin, persona, teléfono, e-mail, envío), el bloque de WhatsApp y los enlaces a mapa y
   Facebook; a la derecha, el formulario en su tarjeta. **La columna de datos acompaña el
   scroll** (≥62 rem): con `position: sticky` + `align-items: start` se queda clavada a
   88 px —justo debajo de la cabecera pegajosa— mientras el formulario baja, así que
   dirección, teléfono, WhatsApp, mapa y Facebook están a la vista mientras se escribe. En
   móvil no se aplica (una sola columna): ahí el bloque va encima del formulario.
3. **Banda de los tres pasos** (papel, filete arriba): «Opisujesz potrzeby → Potwierdzamy
   parametry → Otrzymujesz wycenę», con su número (el orden del paso, no un índice decorativo) y
   flecha entre pasos.
4. **FAQ**: la lista de preguntas que ya tenía la página, en crema.
5. **Franja de cierre**: la madera a la izquierda (`oblog-na-desce.jpg`) y, a la derecha, el
   título, el teléfono y el texto.

**Lo que cambia dentro del formulario**

- El selector de embudo lleva **icono** en cada opción (obłogi/lamela y panele) y una marca de
  elegido (círculo con tick).
- **Por defecto es B (obłogi i lamele)**, igual que en `/cennik/`: es lo que pide la maqueta y lo
  primero que pregunta quien escribe. Los ids del radio no cambian (`funnel-A` / `funnel-B`).
- **Caja de adjuntos**: icono de clip, botón «Wybierz plik», arrastre y soltado y los nombres de
  archivo en vivo. El sitio es estático, así que **solo viaja el nombre** del archivo y se dice en
  pantalla: el archivo se manda aparte, por WhatsApp o e-mail (regla 14).

**Lo que NO se publica (dato sin confirmar)**

- **El horario de trabajo.** La maqueta trae «pon.–pt. 8:00–16:00», pero no está confirmado
  (`company.hours.confirmed = false`): la página usa `hoursText()` — «W godzinach pracy —
  najszybciej telefonicznie».
- **El plazo de respuesta de 24 h.** La maqueta también lo trae bajo el e-mail, pero
  `src/content/funnel.ts` lo prohíbe explícitamente («✘ Odpowiadamy w 24 h») y el buzón sigue
  siendo provisional. En su lugar va el texto honesto que ya usa el resto del sitio: «odpowiadamy
  w godzinach pracy». Si el cliente lo confirma, se devuelve en un solo sitio.

**Dos fallos del propio verificador (arreglados en la herramienta, no en el código)**

1. `_tools/check-html.cjs` daba **21 falsos positivos** de «TypeScript»: su expresión regular
   tomaba por anotación de tipo cualquier `nombre: valor` dentro de un objeto
   (`attachments: attachmentNames`). El código era JavaScript válido —lo parseaba `vm.Script`
   sin un solo error—, así que el culpable era el detector, no la página. Ahora el detector
   **enmascara los literales** (napsy, comentarios, plantillas y regex) y **mira en qué klamra**
   está el candidato: solo el nawias okrągły oznacza lista de parámetros. Además lleva un
   **autotest de 11 casos** (los que tienen que saltar y los que no) que corre en cada
   `npm run verify`.
2. `_tools/verify-form.cjs` daba 2 fallos porque daba por hecho que el embudo por defecto era A.
   Ahora **mira el embudo activo** (el radio marcado y los campos obligatorios de ese embudo) y
   añade una comprobación explícita del embudo A: 30 comprobaciones en verde.

**Un contraste que el chequeo por tokens no veía**

`_tools/check-contrast.cjs` compara **tokens** de color, no lo que se ve en pantalla: un texto con
`opacity: 0.85` sobre `--oak` pasa ese chequeo y en pantalla baja de 4,5:1 a 3,81:1. El texto de la
franja de cierre de `/kontakt/` tenía ese `opacity`. Se quitó y se añadió
`_tools/check-contrast-dom.cjs`, que mide el contraste **efectivo** en el navegador real (color
calculado, opacidad acumulada de la cadena de ancestros y fondo compuesto con alfa) sobre todas
las rutas de `dist/`. El texto que queda encima de una foto se salta: no hay un color de fondo con
el que compararlo.

Con esa herramienta apareció **otro fallo, este anterior y en la home**: el pie de foto del bloque de
material («Obłóg dębowy w drewnianej ścianie») usaba el tono suave de texto sobre la sección
oscura — 2,42:1. En oscuro ahora va el tono invertido suave (9,11:1).

Verificación: `npm run build` (40 páginas, 0 errores) · `npm run verify` (40 páginas, 0 problemas,
0 assets inexistentes, contraste AA, presupuesto de JS OK) · `verify-form` 30 OK, `verify-p0` 8 OK,
`verify-hero` 4 OK · `check-contrast-dom` 0 textos por debajo de AA en las rutas clave ·
capturas a 1440 y 390 px en polaco, inglés y alemán.

### Ronda 10 — la ficha de producto sigue el bloque SEDO de la home (29/10)

El cliente pidió que la ficha de producto (ejemplo: `/produkty/oblog-debowy-wedzony/`) quedara
«clara, fácil de leer, entendible» y que funcionara «para SEO y como embudo de venta», tomando
como guía el bloque «Sufity dębowe — panele SEDO» de la home.

**Lo que había**: los datos del producto eran una rejilla 2×2 —«qué recibes · por qué te eligen ·
cuánto cuesta · qué confirmamos»— con dos tablas metidas dentro. Cuatro bloques densos en
paralelo, con etiquetas en versalitas y filas apretadas: se leía como un muro.

**Lo que hay ahora**: tres franjas, cada una con la anatomía del bloque SEDO (rótulo, titular,
entradilla, los puntos con icono, el cierre y la salida):

1. **«Co dostajesz»** (crema) — los datos del material como una rejilla `<dl>` de dos filas de
   tres: cada dato con su icono, la etiqueta en versalitas y el valor en cuerpo de texto (regla
   15). El filete va **entre columnas**, como en la home. Debajo, el cierre y los dos botones
   («Zapytaj o wycenę…» y «Zobacz zdjęcia»).
2. **«Dlaczego»** (papel) — los tres motivos **en fila**, con filete entre columnas.
3. **«Cena y pedido»** (crema) — dos columnas: el precio (unidad de venta, de qué depende y qué
   abarca la oferta) y lo que confirmamos en la oferta (cena, termin, entrega, disponibilidad y
   documentos), cada punto con su icono. Y debajo, el cierre «Masz projekt?» con los dos botones.

**Lo que cambia en el contenido**

- Cada fila de la ficha lleva **icono**: `oak` (materiał), `smoke` (wędzony), `leaf` (naturalne
  wykończenie), `ruler` (długość), `door` (profil), `panel` (grubość), `stack` (selekcja),
  `house` (rodzaj), `truck` (wysyłka). Los de «Zamówienie»: `tag`, `calendar`, `truck`, `stack`,
  `document`. Tres iconos nuevos en `Icon.astro`: `smoke`, `calendar` y `tag`.
- Cada producto tiene una **entradadilla** nueva (`specsLead`): el material, la unidad de venta y
  qué se ajusta al pedido. No repite el `summary` del hero.
- El bloque de precio pasa de dos filas a **tres**: se añade «Co obejmuje wycena» con el texto
  por producto que ya estaba en `pricing.ts` (`includes`). La etiqueta «Jak wyceniamy obłogi
  dębowe» era engañosa en las otras fichas (en la de los panele hablaba de obłogi): ahora es
  «Jak liczymy cenę».

**Sin inventar nada**: los datos son los mismos; lo que cambia es el contenedor y el orden de
lectura. La página crece ~1.100 px (de 8.200 a 9.300) pero el primer CTA aparece antes: a
1.750 px en lugar de 2.500.

Verificación: `npm run build` (40 páginas, 0 errores) · `npm run verify` (40 páginas, 0 problemas,
0 assets inexistentes, contraste AA, presupuesto de JS OK) · `verify-form`, `verify-p0` y
`verify-hero` en verde · `check-contrast-dom` 0 textos por debajo de AA en las seis fichas
(PL/EN/DE) · sin desbordamiento horizontal a 390 y 1440 px en los tres idiomas.

### Ronda 11 — el formulario de `/dla-firm/`: centrado, envío por web y mensaje de éxito (29/10)

El cliente pidió tres cosas del formulario «Współpraca hurtowa»: que **no lleve la foto a la
izquierda**, que **esté centrado en su sección**, y que **los envíos salgan por la web** como
un formulario convencional (el endpoint se conecta más adelante), con un **mensaje de éxito**
preparado.

**La banda del formulario** (`/dla-firm/`): se quita el bloque de foto de la izquierda y el
formulario queda centrado en la sección —el texto (rótulo, titular, entradilla) centrado
encima y la tarjeta del formulario en un ancho de lectura de 54 rem—. Los campos siguen
alineados a la izquierda: un formulario se lee de izquierda a derecha; lo que va centrado es el
bloque. La foto (`trade.form.photo`) deja de usarse en el contenido.

**El envío, en dos modos** (regla 14):

| | con `PUBLIC_QUOTE_ENDPOINT` | sin endpoint (ahora) |
|---|---|---|
| `action` | la URL del endpoint | `mailto:` |
| `enctype` | `multipart/form-data` | `text/plain` |
| al enviar | `fetch` JSON → 2xx | se abre el cliente de correo |
| bloque de resultado | `sent` — «Zapytanie wysłane» | `prepared` — «falta pulsar Enviar» |

Mientras no haya endpoint el sitio **no dice nunca** que el envío ha salido: mantiene el
`mailto:` honesto con WhatsApp y teléfono. `.env.example` queda preparado (con el endpoint
marcado como P0) y `docs/CMS-INTEGRATION.md` documenta el contrato, el CORS que hace falta si
el endpoint está en otro dominio y el aviso del `id` duplicado.

**Tres bugs reales que aparecieron al probar la ruta web** (con un endpoint de pruebas local):

1. **`id="quote-form"` repetido** en `/dla-firm/`: la sección y el `<form>` compartían id.
   `getElementById` devolvía la sección, que no tiene `data-endpoint`, así que el formulario se
   caía **siempre** en la rama del `mailto:` por muy configurado que estuviera el endpoint. El
   id es ahora solo del `<form>` y `check-html.cjs` avisa de los ids repetidos.
2. **El mensaje de éxito no se veía**: el CSS escuchaba `data-state="success"` y el script
   escribe `data-state="sent"`. El texto llegaba al DOM, pero el bloque se quedaba en
   `display: none`. Corregido el selector; el comentario en el CSS explica el tropiezo.
3. **El título era el equivocado**: en el envío por web salía «Zapytanie gotowe», que es el
   título del `mailto:`. Ahora hay dos: `form.resultTitle` («Zapytanie gotowe») y
   `form.resultTitleSent` («Zapytanie wysłane»).

**El verificador, consciente del endpoint**: `verify-form.cjs` mira el modo que hay. Con
endpoint comprueba la URL, el `POST`, el `multipart/form-data`, el estado `sent`, el título, el
texto y **que el bloque se ve**; sin él, la rama `mailto:`. Los checks del cuerpo de WhatsApp
solo se ejecutan en el modo `mailto:` (en el otro no hay mensaje que inspeccionar) y la
comprobación espera al `fetch` cuando hay endpoint.

Verificación: `npm run build` (40 páginas, 0 errores) · `npm run verify` (40 páginas, 0
problemas, 0 assets inexistentes, contraste AA, presupuesto de JS OK) · `verify-form`,
`verify-p0` y `verify-hero` en verde **en los dos modos** (con endpoint de pruebas y sin él) ·
capturas de la banda en polaco, inglés, alemán y móvil.

---

## Nota sobre el proceso

Los tres agentes especializados (SEO/AEO/GEO/local · ventas/copy · embudos/CRO) trabajaron en
modo **solo lectura** y entregaron informes con datos del repo, no recomendaciones genéricas.
Todo lo ejecutable se implementó en el repositorio y se verificó con `build` + `verify` +
navegador real; lo que depende de una decisión del cliente no se ejecutó, se listó arriba.
