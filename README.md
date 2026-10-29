# Doors Obłogi — witryna

Witryna frontend-only zbudowana w **Astro 7** (statyczny SSG) dla **Doors Obłogi** —
pracowni obróbki naturalnego dębu w Słoneczniku k. Olsztyna.

## Qué es y qué no es

- **Sí es**: sitio completo, multiidioma (PL por defecto, EN, DE), con catálogo, fichas de producto,
  galería, formulario de presupuesto, FAQ, datos estructurados, sitemap y Core Web Vitals cuidados.
- **No es (aún)**: backend, panel de administración ni sistema de pedidos. El sitio es estático
  y todo el contenido vive en `src/content/` como TypeScript.

## Stack

| Pieza | Elección | Motivo |
|---|---|---|
| Framework | Astro 7 | HTML estático en el servidor; el JS entra sólo donde aporta (islas) |
| Interacción | React (`@astrojs/react`) + GSAP 3 | Islas con estado real y movimiento de calidad; presupuesto ≤ 60 KB gzip (ver regla 12 de `AGENTS.md`) |
| Estilos | CSS propio (`src/styles/global.css`) | Sin framework utility: control total y sin "¿por qué Tailwind?" |
| Tipografías | Fraunces (titulares) + Archivo (texto), autoalojadas | Sin peticiones a terceros, sin GDPR, sin CLS |
| Imágenes | `astro:assets` + sharp | WebP/AVIF, `srcset`, dimensiones conocidas (layout shift 0) |
| Sitemap | `@astrojs/sitemap` | `sitemap-index.xml` + `robots.txt` |

## Puesta en marcha

```bash
npm install
npm run dev      # desarrollo en http://localhost:4330
npm run build    # genera dist/ (40 páginas)
npm run preview  # sirve dist/ tal cual se publicará
npm run verify   # comprobadores sobre dist/ (metadatos, JSON-LD, contraste, assets)
```

El formulario de presupuesto usa `PUBLIC_QUOTE_ENDPOINT` si existe (copia `.env.example` a `.env`)
y, si no, cae a WhatsApp/mailto. Estado actual y plan de mejoras: `docs/INFORME-MEJORAS.md`.

## Estructura

```
src/
  assets/images/        fotos reales del cliente (descargadas de su Facebook)
  components/           Header, Footer, ProductCard, FaqList, QuoteForm, Breadcrumbs,
                        SectionHead, CtaBand, Flag (banderas SVG)
  content/              ← TODO EL CONTENIDO VIVE AQUÍ
    company.ts          datos de empresa (teléfono, ubicación, email)
    products.ts         catálogo: copy, specs, SEO y keywords por idioma
    pages.ts            copy de home / about / galería / presupuesto / contacto + FAQ
    images.ts           mapa nombre → asset importado
    schema.ts           schema.org (Product, BreadcrumbList)
  i18n/
    index.ts            idiomas, rutas y slugs traducidos
    ui.ts               etiquetas de interfaz en PL/EN/DE
  layouts/BaseLayout.astro   head, canonical, hreflang, OG, JSON-LD
  pages/                21 rutas + 404 (slugs traducidos por idioma)
  styles/global.css     sistema de diseño
  views/                HomeView, CatalogView, ProductView, AboutView,
                        GalleryView, QuoteView, ContactView
docs/
  agent-reports/        informes de los agentes de SEO / auditoría / diseño
  CMS-INTEGRATION.md    guía para conectar con el CMS SEO Grow
```

## Rutas

| PL (raíz) | EN | DE |
|---|---|---|
| `/` | `/en/` | `/de/` |
| `/produkty/` | `/en/products/` | `/de/produkte/` |
| `/produkty/oblog-debowy-ciety/` | `/en/products/cut-oak-lintel/` | `/de/produkte/geschnittenes-eichen-oblag/` |
| `/o-nas/` | `/en/about/` | `/de/ueber-uns/` |
| `/realizacje/` | `/en/gallery/` | `/de/galerie/` |
| `/cennik/` | `/en/price-list/` | `/de/preisliste/` |
| `/kontakt/` | `/en/contact/` | `/de/kontakt/` |
| `/dla-firm/` | `/en/for-trade/` | `/de/fuer-handwerk/` |
| `/dostawa/` | `/en/delivery/` | `/de/lieferung/` |
| `/polityka-prywatnosci/` | `/en/privacy-policy/` | `/de/datenschutz/` |

Los slugs están traducidos, no transliterados: cada idioma tiene su propia URL y su propio
`hreflang`. Es lo que Google premia y lo que un cliente internacional espera.

## Reglas del proyecto

1. **El contenido no vive en los templates.** Todo copy, spec y keyword está en `src/content/`.
   Si hay que cambiar un texto, se cambia ahí, no dentro de un `.astro`.
2. **Las fotos son del cliente.** Todas las imágenes en `src/assets/images/` son fotos reales
   de Doors Obłogi publicadas en su Facebook. No se sustituyen por stock ni se regeneran.
3. **Nada de copy inflado.** Sin "pasión", "precisión", "compromiso", "años de experiencia".
   Se afirma lo comprobable: 100% dąb naturalny, cięcie na wymiar, dos selekcje, wysyłka w Polsce.
4. **Sin inventar datos.** Teléfono, ubicación y contacto vienen del Facebook del cliente.
   El email (`company.contactEmail`) es provisional: hay que confirmarlo con el cliente.
5. **Polaco es el idioma por defecto** y vive en la raíz. EN y DE son versiones equivalentes,
   no traducciones literales.
6. **No se despliega ni se hace commit desde este repo** sin autorización explícita.
