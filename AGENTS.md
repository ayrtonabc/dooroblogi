# Doors Obłogi — convenciones del proyecto

Sitio frontend-only en **Astro 7** (SSG estático) para Doors Obłogi, fabricante polaco de
*obłogi dębowe* (listones de remate de roble), *lamele dębowe* 4–8 mm, roble ahumado y paneles
de techo/pared. Polaco en la raíz (idioma por defecto), `/en/` y `/de/` como versiones
equivalentes.

Documentación completa: `README.md` · Guía de integración con el CMS: `docs/CMS-INTEGRATION.md`

## Comandos

```bash
npm install
npm run dev      # desarrollo
npm run build    # genera dist/ (40 páginas)
npm run preview  # sirve dist/
npm run verify   # comprueba títulos, JSON-LD, hreflang, sitemap y assets sobre dist/
```

`npm run build` **debe terminar sin errores ni avisos de Astro** antes de dar cualquier tarea
por terminada. Verifica siempre sobre el HTML generado en `dist/`, no solo sobre el código.

## Reglas invariables

1. **El contenido vive en `src/content/`, nunca en los templates.** Copy, specs, keywords y
   datos de empresa van en `company.ts`, `products.ts`, `pages.ts`, `images.ts`, `schema.ts`.
   Los `.astro` reciben props y pintan.
2. **Las fotos son del cliente** (`src/assets/images/`), descargadas de su Facebook. No se
   sustituyen por stock, no se regeneran, no se "mejoran" con IA. Si una imagen no encaja,
   se cambia el encuadre o se cambia de foto.
   - **Estado actual**: el bloque "Sufity · drzwi · schody" **lleva foto**. Los techos ya usan
     foto propia del cliente (`sufit-sedo-realny.jpg`, un techo de paneles instalado) y las
     puertas usan una foto de perfil del propio cliente; **solo las escaleras siguen con stock**
     (Pexels) porque aún no ha llegado foto propia. Es un demo y el bloque tiene que verse
     completo. Cuando mande la foto de escaleras, se sustituye el nombre en
     `src/content/home-sections.ts` y no hay que tocar el markup. Está anotado en
     `src/content/images.ts`.
   - Los originales a resolución completa que no usa el sitio están en `_media/cliente/` (no se
     publican): `public/images/` solo contiene lo que se sirve.
   - `hero-sufit-dab.jpg` sigue siendo una desviación pendiente de confirmar: la aporta el
     cliente desde una URL externa. Está anotado en `src/content/images.ts`.
   - **El bloque de techos es la maqueta del cliente (28/10)** y ocupa dos franjas seguidas en
     la home, con su propio módulo de contenido `src/content/sedo.ts` (`sedoPanels` +
     `sedoVariants`):
     1. **Franja alta** (`.sedo`, crema): texto a la izquierda (rótulo, titular, entradilla,
        tres características con icono y filetes **entre** columnas, cierre y los dos botones en
        fila) y la foto **a sangre** a la derecha (`sufit-sedo-realny.jpg`) con pie de foto.
     2. **Franja baja** (`.sedo-variants`, papel): la leyenda con las dos selecciones **en fila**,
        las dos fotos del material con chapa oscura y pie, y a la derecha la tarjeta crema
        «Gotowy system do Twojego wnętrza» con sus tres usos y las dos salidas (pedir presupuesto
        + llamar).
     La maqueta manda en el diseño; el copy que el cliente ya había aprobado (entradilla,
     beneficios, cierre) se conserva, y los huecos que la maqueta añade llevan su texto.
     La antigua sección «Selección» (oscura) se eliminó: su contenido vive ahora en la franja
     baja. Las fotos de las dos selecciones son recortes de `sedo-wvarianty.png`, sin el rótulo
     impreso.
   - **La página `/dla-firm/` es la maqueta del cliente (28/10)**: seis franjas —hero a dos
     columnas con la foto a sangre (`oblog-w-hali.jpg`), banda de cuatro características con
     icono, banda oscura con los tres pasos de la colaboración, datos técnicos junto a las
     preguntas, formulario con la madera a la izquierda y franja de cierre con foto. Su contenido
     vive en `src/content/trade.ts` (PL/EN/DE) y su CSS en el bloque `.trade-*` de
     `global.css`. La banda `CtaBand` acepta una `image` opcional: con ella, la banda se parte
     en dos (foto a sangre + texto).
   - **La página `/kontakt/` es la maqueta del cliente (28/10)**: cinco franjas —hero a tres
     columnas (texto | foto 4:3 | pie en serif cursiva), bloque de datos + formulario en dos
     columnas, banda de tres pasos, FAQ y franja de cierre con la madera a la izquierda. Su
     contenido vive en `src/content/contact.ts` (PL/EN/DE) y su CSS en el bloque `10.3 Página de
     contacto` de `global.css`.
     - **La columna de datos acompaña el scroll** (≥62 rem): mientras se rellena el formulario,
       dirección, teléfono, WhatsApp, mapa y Facebook se quedan a la vista (`position: sticky`
       + `align-items: start`, `top: 5.5rem` por la cabecera pegajosa). En móvil no se aplica:
       ahí el bloque va encima del formulario.
     - **El horario de trabajo no se publica**: la maqueta lo trae, pero no está confirmado
       (`company.hours.confirmed = false`), así que la página usa `hoursText()` — un texto honesto
       que no inventa un rango horario. Si el cliente confirma el horario, se publica y se quita
       el aviso.
     - **El formulario de esta página** usa el embudo `both` con **B** (obłogi i lamele) por
       defecto, igual que `/cennik/`: es lo que pide la maqueta y lo primero que pregunta quien
       escribe.
   - **La ficha de producto sigue el bloque SEDO de la home (29/10)**: los datos del producto
     son **tres franjas** — «Co dostajesz» (los datos del material, uno por punto con icono, en
     dos filas de tres con filete entre columnas), «Dlaczego» (los tres motivos en fila) y
     «Cena y pedido» (el precio a la izquierda, lo que confirmamos en la oferta a la derecha) —
     y cada una cierra con su frase y su salida. Su CSS vive en el bloque `10.1` de `global.css`
     (`.pf-*`). Antes era una rejilla 2×2 con dos tablas dentro: cuatro bloques densos en
     paralelo, imposibles de escanear.
   - **El hero se desliza sin fin**: la pista lleva tres copias de la foto (la original, su
     reflejo y la original) y se desplaza dos anchuras de pantalla, así que el bucle no tiene
     ni principio ni final. El reflejo es lo que hace que el empalme caiga en un eje de
     simetría y no en un corte de foto. Para que el efecto sea redondo del todo, el cliente
     debe mandar una foto **cuyo borde izquierdo y derecho encajen** (o al menos muy
     parecidos): con la de ahora el eje se nota, con una que empalme no se nota nada.
     La duración se toca en el token `--hero-drift` (`:root`).
3. **Cero AI slop.** Nada de "pasión", "precisión", "compromiso", "años de experiencia",
   "soluciones a medida". Solo lo comprobable: 100% dąb naturalny, cięcie na wymiar, dos
   selekcje (bez sęków / z sękami), wysyłka kurierem w całej Polsce, producción en Słonecznik.
4. **No inventes datos.** Teléfono (+48 696 741 679), ubicación y contacto (Szymon Małoszek)
   vienen del Facebook. `company.contactEmail` es provisional y está marcado con TODO.
   **No publiques precios inventados**: el cliente manda el cennik bajo petición.
5. **El tono es corto y declarativo**, como el cliente escribe en Facebook
   ("Obłóg dębowy, cięty i wędzony", "Zapraszamy."). Nada de prosa corporativa.
6. **Terminología por idioma, no traducción literal.** EN y DE son mercados distintos:
   - EN: *oak trim batten*, *oak edging*, *oak battens*. **Nunca "oak lintel"** (en inglés
     es viga estructural).
   - DE: *Eichen-Abschlussleiste*, *Eichenleiste*, *Eichen-Lamelle*. **Nunca "Oblag"**
     (es polaco y no existe en alemán).
   - PL: *obłóg dębowy*, *lamela dębowa*, *dąb wędzony*.
7. **Slugs traducidos por idioma** y coherentes con `src/i18n/index.ts`. Si cambias un slug,
   actualiza a la vez `getStaticPaths`, los `hreflang` y los enlaces internos.
8. **Multilingüe de verdad**: toda cadena visible pasa por `src/i18n/ui.ts` o por un objeto
   con claves `pl`/`en`/`de` en `src/content/`. No hay literales sueltos en los templates.
9. **Sin migas de pan visibles.** Decisión del cliente: la barra de breadcrumbs sobra. El
   componente `src/components/Breadcrumbs.astro` emite **solo** el JSON-LD `BreadcrumbList`
   (invisible, Google lo usa para dibujar la ruta en el resultado). No reintroduzcas el
   `<nav class="breadcrumbs">` ni sus reglas CSS.
10. **El logo del cliente es intocable.** `public/images/logo.webp` es el master (4032×938,
    242 KB) y **no se toca**. Para la interfaz se usa la copia escalada `logo-web.webp`
    (900×209, 39 KB), generada por `_tools/make-logo-web.cjs`. Con el master en línea,
    Chromium deja el hueco del logo vacío hasta que hay una interacción en la página:
    un asset de 4032 px mostrado a 172 px no decodifica a tiempo.
11. **Iconos: SVG inline, sin biblioteca.** `src/components/Icon.astro` con los trazados
    (trazo 1,5 px, `currentColor`, rejilla 24×24, `aria-hidden`). Si hace falta un icono
    nuevo, se añade ahí; no se mete un paquete de iconos. La bandera de idioma es el
    caso aparte: `src/components/Flag.astro`, porque necesita el escudo real.
12. **JavaScript, React y animación son parte del producto, no un extra.** La web es
    premium y no puede ser plana: se permiten y se buscan transiciones, movimiento
    ambiental, islas interactivas y efectos que aporten calidad percibida. Reglas que sí
    se mantienen:
    - **Astro sigue sirviendo el HTML.** El contenido y el LCP no dependen de JS: si una
      isla falla o tarda, la página se lee igual (progressive enhancement).
    - **React sólo donde hay estado real** (formularios, selectores, galerías con teclado).
      Un componente que sólo pinta HTML es un `.astro`, no una isla.
    - **GSAP / animación**: `transform` y `opacity`; nada de animar propiedades de layout.
      El movimiento ambiental (luz, respiración de fotos) es bienvenido.
    - **Nada de secuestrar el scroll**: prohibido scroll-jacking, pin forzado no deseado y
      parallax que maree. El usuario manda sobre la página, no al revés.
    - **`prefers-reduced-motion: reduce` se respeta siempre**, y toda animación debe
      poder apagarse sin romper el contenido.
    - **Presupuesto**: JS propio ≤ 60 KB gzip por página; cada isla se carga con
      `client:visible` salvo que sea crítica para la primera pantalla. Se mide en `dist/`
      con `_tools/check-budget.cjs` (va incluido en `npm run verify`).
    - **Estado actual**: el proyecto tiene **0 islas React** y `@astrojs/react` no está
      instalado. Antes había un chunk de 215 KB (66,6 KB gzip) que ningún HTML referenciaba.
      Si en algún momento hace falta React, el motivo tiene que ser estado real, y hay que
      volver a medir el presupuesto.
    - **Accesibilidad**: teclado, foco visible, `aria` en los estados, contraste AA
      también sobre las superficies animadas.
13. **Sin numeración decorativa.** Decisión del cliente (27/10): los números «01 · 02 · 03»
    que encabezaban las secciones y las tarjetas de producto sobran y quedan feos. No se
    reintroducen ni en el eyebrow de sección (`SectionHead`) ni en las tarjetas
    (`ProductCard`). Las cifras internas que son datos —precio, medida, plazo— sí se
    muestran; lo que no se muestra es un índice de sección.
14. **El formulario dice la verdad.** Sin `PUBLIC_QUOTE_ENDPOINT` el formulario **no entrega
    nada**: compone un `mailto:`. El bloque de resultado distingue los dos casos —
    `sent` (llegó al endpoint) y `prepared` (se abrió el cliente de correo y falta
    pulsar «Enviar»). Nunca se muestra «wysłane» cuando no hubo envío, y en el caso
    `prepared` se ofrecen WhatsApp y teléfono. El `context` de la página viaja en el cuerpo
    del mensaje para que la consulta se pueda atribuir.
    - **Dos modos, un solo interruptor.** Con `PUBLIC_QUOTE_ENDPOINT` el formulario es un
      formulario web normal (`method="post"`, `action` a la URL, `enctype="multipart/form-data"`)
      y, si responde 2xx, muestra «Zapytanie wysłane». Sin la variable, `action` es `mailto:`
      y `enctype` es `text/plain`. El contrato del payload está en `docs/CMS-INTEGRATION.md`.
    - **El estado del bloque es `sent`, no `success`.** El CSS tiene que escucharlo: si el
      selector y el script no coinciden, el mensaje se escribe en el DOM pero no se ve
      (`display: none`). Lo mismo vale para cualquier otro `data-state`.
    - **El `id="quote-form"` es del `<form>`, no de la sección.** Si se repite, el
      `getElementById` del script devuelve la sección (que no tiene `data-endpoint`) y el
      formulario se cae siempre en la rama del `mailto:`. `check-html.cjs` avisa de los `id`
      repetidos.
    - **La caja de adjuntos también dice la verdad**: el sitio es estático, así que del archivo
      viaja **solo el nombre**. Se escribe en pantalla, el nombre va al cuerpo del mensaje y al
      payload (`attachments`), y la nota aclara que el archivo se manda aparte (WhatsApp o
      e-mail). Nunca hay que insinuar que el archivo se adjuntó solo.
15. **Las tablas de datos van en cuerpo de texto, no en la serif del titular.** Decisión del
    cliente (28/10): un bloque de ficha técnica con el valor en Fraunces a 23 px leía como
    anuncio. El valor va en el grotesco a cuerpo (`--step-0`, peso 500), la etiqueta en columna
    fija y las filas compactas. Como el componente es compartido (`.specs`), **el tratamiento se
    aplica a todos**: `/dostawa/`, `/kontakt/` y `/dla-firm/`. En la ficha de producto los datos
    ya no son una tabla sino una rejilla de puntos con icono (`.pf-specs`), pero el valor sigue
    en cuerpo de texto: cambia el contenedor, no el tratamiento.
16. **Numeración sólo donde es el orden.** Los «01 · 02 · 03» decorativos están prohibidos
    (regla 13), pero un proceso numerado con flechas entre los pasos sí indica orden y se
    permite: es el caso de los tres pasos de la colaboración en `/dla-firm/` y de los tres
    pasos de contacto en `/kontakt/`.

## Verificación antes de entregar

- `npm run build` sin errores.
- `npm run verify` con 0 problemas (títulos únicos ≤60, descripciones ≤160, JSON-LD válido,
  `hreflang` recíproco con `x-default`, sitemap, 301 con canonical y `noindex`, presupuesto
  de JS por página).
- Ninguna referencia a un asset inexistente (comprueba en `dist/`, no en el código).
- Los `<title>` son únicos entre páginas y por idioma.
- Los JSON-LD parsean como JSON válido.
- `hreflang` recíproco y `x-default` correcto.
- Contraste de texto suficiente, también sobre superficies oscuras (`.section--dark`).
- **Contraste efectivo, en navegador real**: `_tools/check-contrast-dom.cjs` (necesita el preview en
  el puerto 4330). El chequeo por tokens (`check-contrast.cjs`) no ve la `opacity` del texto ni el
  alfa del fondo: un bloque con `opacity: 0.85` sobre `--oak` pasa el chequeo de tokens y en
  pantalla baja de 4,5:1 a 3,81:1. El script mide color real, opacidad acumulada y fondo
  compuesto, y salta el texto que queda encima de una foto (no hay color con el que comparar).
  OJO: el parser de color tiene que entender `color(srgb … / 0.88)`, que es lo que devuelve
  Chrome para la cabecera translúcida.
- El formulario, en navegador real: `_tools/verify-form.cjs` (producto que viaja de la ficha
  a la página de precio, resultado honesto, enlaces de salida). `_tools/verify-p0.cjs` para
  el menú móvil y el contraste del formulario.
- La deriva del hero: `_tools/verify-hero.cjs` (el bucle cierra, la ventana nunca queda al
  descubierto y con `prefers-reduced-motion` no se mueve nada).
- **Si un verificador falla, primero se mide si el código es culpable.** Un patrón que «detecta»
  algo ambiguo se arregla en el detector, no callando el código: se corrige la herramienta y se
  añade un caso de prueba que demuestre que sigue detectando lo que debe (así se hizo con
  `_tools/check-html.cjs`, que lleva un autotest del detector de TypeScript: 11 casos, los que
  tienen que saltar y los que no). Antes de tocar el código: `node --check` sobre el script
  extraído del HTML de `dist/` y el navegador real.
- Los verificadores de navegador son **conscientes del embudo activo**: `verify-form.cjs` mira el
  juego de campos que está marcado (por defecto B en `/cennik/`), no un embudo fijo.
- `verify-form.cjs` también es **consciente del endpoint**: con `PUBLIC_QUOTE_ENDPOINT` definida
  comprueba la ruta web (URL en el `action`, `POST`, `multipart/form-data`, estado `sent` y que
  el bloque de éxito **se ve**); sin ella, la ruta `mailto:` (estado `prepared` y que el texto
  diga que hay que pulsar «Enviar»). Para probar la ruta web: endpoint de pruebas en
  `%TEMP%\mock-lead-endpoint.cjs`, build con la variable y `node _tools/verify-form.cjs`.
- La cabecera no se rompe entre 1024 y 1440 px: el nav completo aparece a partir de 78 rem
  (1248 px). La barra lleva logo, nav, idiomas, teléfono y CTA; **no** lleva enlace de WhatsApp
  (decisión del cliente). WhatsApp sigue en la barra flotante de móvil, en el pie, en la banda
  CTA y en el respaldo del formulario.

## Fuera de alcance

- No hay backend: el sitio es estático. El formulario usa `PUBLIC_QUOTE_ENDPOINT` si existe y
  cae a WhatsApp/mailto si no.
- No se hace commit ni se despliega desde este repo sin autorización explícita.
