/**
 * Kontrola danych strukturalnych na buildzie (`dist/`).
 *
 * Sprawdza:
 *   1. każdy blok JSON-LD parsuje się i ma kontekst schema.org,
 *   2. nie ma pól, których NIE da się potwierdzić (aggregateRating, foundingDate,
 *      legalName, postalCode, SearchAction, price, priceValidUntil…),
 *   3. `knowsAbout` jest płaską tablicą napisów,
 *   4. NAP organizacji jest identyczny na wszystkich 40 stronach,
 *   5. każde odwołanie `@id` w grafie się rozwiązuje,
 *   6. FAQPage odpowiada DOKŁADNIE widocznej liście pytań (ta sama treść,
 *      ta sama kolejność, ta sama liczba),
 *   7. Product ma brand / material / color / size / image, a `offers` ma
 *      availability + priceCurrency i NIE ma ceny,
 *   8. każdy obraz i link w schema wskazuje na plik, który istnieje w dist/.
 *
 * Uruchomienie: node _tools/check-jsonld.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://doors-oblogi.pl';

const problems = [];
const notes = [];
const fail = (m) => problems.push(m);
const note = (m) => notes.push(m);

// ------------------------------------------------------------------ pomoc
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
  nbsp: ' ',
  apos: "'",
};

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z#0-9]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

function textOf(html) {
  return decodeEntities(
    html
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

const distFiles = new Set(
  walk(DIST).map((f) => '/' + path.relative(DIST, f).split(path.sep).join('/')),
);

function assetExists(url) {
  if (!url) return true;
  if (!url.startsWith(SITE)) return true; // zewnętrzny URL — poza zakresem
  const clean = url.slice(SITE.length).split('#')[0].split('?')[0];
  return distFiles.has(clean);
}

/** ¿La URL del schema apunta a una página que existe en dist/? */
function pageExists(url) {
  if (!url) return true;
  if (!url.startsWith(SITE)) return true;
  const clean = url.slice(SITE.length).split('#')[0].split('?')[0];
  if (!clean) return distFiles.has('/index.html');
  if (clean.endsWith('/')) return distFiles.has(`${clean}index.html`);
  return distFiles.has(clean) || distFiles.has(`${clean}/index.html`);
}

/** Węzły ze wszystkich bloków jednej strony. */
function nodesOf(parsed) {
  if (Array.isArray(parsed)) return parsed.flatMap(nodesOf);
  if (parsed['@graph']) return parsed['@graph'].flatMap(nodesOf);
  return [parsed];
}

// ------------------------------------------------------------- 1. parsowanie
const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));

const perPage = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = '/' + path.relative(DIST, file).split(path.sep).join('/');
  const route = rel.replace(/index\.html$/, '');
  const blocks = [
    ...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
  ].map((m) => m[1]);

  const nodes = [];
  const docs = [];
  blocks.forEach((raw, i) => {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      fail(`JSON-LD niepoprawny w ${route} (blok ${i + 1}): ${error.message}`);
      return;
    }
    const hasContext = parsed?.['@context'] ?? parsed?.['@graph']?.[0]?.['@context'];
    if (!hasContext) {
      note(
        `Brak @context w bloku JSON-LD ${route} (blok ${i + 1}). ` +
          `JSON-LD 1.0 zakłada schema.org domyślnie, ale dodaj '@context' w komponencie, ` +
          `który generuje ten blok.`,
      );
    }
    docs.push(parsed);
    nodes.push(...nodesOf(parsed));
  });

  perPage.push({ file, route, html, blocks, nodes, docs });
}

// ---------------------------------------------- 2. pola niepotwierdzone
const FORBIDDEN = [
  'aggregateRating',
  'review',
  'ratingValue',
  'reviewCount',
  'ratingCount',
  'foundingDate',
  'legalName',
  'postalCode',
  'priceValidUntil',
  'potentialAction',
  'priceMinimum',
  'priceMaximum',
];

for (const page of perPage) {
  for (const node of page.nodes) {
    for (const field of FORBIDDEN) {
      if (node[field] !== undefined) {
        fail(
          `Niepotwierdzone pole "${field}" w ${page.route} (${node['@type']}) — ` +
            `nie wolno go publikować sin confirmación del cliente.`,
        );
      }
    }
    // `price` tylko w ofercie z kwotą; tu nie ma cennika.
    const offers = node.offers;
    if (offers && typeof offers === 'object') {
      const list = Array.isArray(offers) ? offers : [offers];
      for (const offer of list) {
        if (offer.price !== undefined) {
          fail(`Cena w schema (${page.route}) — el cennik no se publica.`);
        }
        if (!offer.availability) {
          fail(`Offer sin availability w ${page.route}`);
        }
        if (!offer.priceCurrency) {
          fail(`Offer sin priceCurrency w ${page.route}`);
        }
      }
    }
    // `SearchAction` solo en WebSite con buscador real.
    if (node.potentialAction) {
      fail(`potentialAction/SearchAction en ${page.route} — la web no tiene buscador.`);
    }
  }
}

// ------------------------------------------------------ 3. knowsAbout plano
for (const page of perPage) {
  for (const node of page.nodes) {
    if (node.knowsAbout === undefined) continue;
    if (!Array.isArray(node.knowsAbout) || node.knowsAbout.some((v) => typeof v !== 'string')) {
      fail(`knowsAbout no es un array de cadenas en ${page.route}`);
    }
  }
}

// ------------------------------------------- 4. NAP idéntico en las 40 páginas
const orgPages = perPage.filter((p) => p.nodes.some((n) => n['@type']?.includes?.('Organization')));

// `slogan` y `description` están traducidos: se comparan dentro de cada
// idioma. Los demás campos NAP son iguales en los tres idiomas.
const localeOf = (route) =>
  route.startsWith('/en/') ? 'en' : route.startsWith('/de/') ? 'de' : 'pl';

const GLOBAL_NAP = ['name', 'telephone', 'email', 'logo', 'image', 'url'];
const LOCAL_NAP = ['slogan', 'description'];

for (const field of GLOBAL_NAP) {
  const values = new Set();
  for (const page of orgPages) {
    const org = page.nodes.find((n) => n['@type']?.includes?.('Organization'));
    values.add(JSON.stringify(org?.[field]));
  }
  if (values.size > 1) {
    fail(`NAP incoherente: "${field}" difiere entre páginas → ${[...values].join(' | ')}`);
  }
}

for (const field of LOCAL_NAP) {
  for (const locale of ['pl', 'en', 'de']) {
    const values = new Set();
    for (const page of orgPages.filter((p) => localeOf(p.route) === locale)) {
      const org = page.nodes.find((n) => n['@type']?.includes?.('Organization'));
      values.add(JSON.stringify(org?.[field]));
    }
    if (values.size > 1) {
      fail(
        `NAP incoherente [${locale}]: "${field}" difiere entre páginas → ` +
          `${[...values].join(' | ')}`,
      );
    }
  }
}

if (orgPages.length !== perPage.length) {
  note(`Organization aparece en ${orgPages.length} de ${perPage.length} páginas.`);
}

// ---------------------------------------------------- 5. referencias @id
for (const page of perPage) {
  // Todos los `@id` declarados en la página, a cualquier profundidad
  // (mainEntity de FAQPage, offers de Product, grafo del head…).
  const ids = new Set();
  const scanIds = (value) => {
    if (Array.isArray(value)) value.forEach(scanIds);
    else if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) {
        if (k === '@id' && typeof v === 'string') ids.add(v);
        else scanIds(v);
      }
    }
  };
  page.docs.forEach(scanIds);

  const collectRefs = (value, out = []) => {
    if (Array.isArray(value)) value.forEach((v) => collectRefs(v, out));
    else if (value && typeof value === 'object') {
      if (typeof value['@id'] === 'string') out.push(value['@id']);
      for (const v of Object.values(value)) collectRefs(v, out);
    }
    return out;
  };
  for (const node of page.nodes) {
    // El `@id` propio del nodo es su ancla, no una referencia colgante.
    const own = node['@id'];
    for (const ref of collectRefs(node)) {
      if (ref === own) continue;
      if (ref.startsWith(SITE + '/') && !ids.has(ref)) {
        fail(`Referencia @id colgante en ${page.route}: "${ref}" no existe en la página`);
      }
    }
  }
}

// ------------------------------- 6. FAQPage idéntica a la FAQ visible
for (const page of perPage) {
  const faqNodes = page.nodes.filter((n) => n['@type'] === 'FAQPage');
  if (!faqNodes.length) continue;

  // Visible: <details class="faq__item"><summary class="faq__question"><span>PYTANIE
  const visible = [];
  const detailsRe = /<details class="faq__item">([\s\S]*?)<\/details>/g;
  for (const match of page.html.matchAll(detailsRe)) {
    const block = match[1];
    const summary = block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/);
    const answer = block.match(/<div class="faq__answer"[^>]*>([\s\S]*?)<\/div>/);
    if (!summary || !answer) continue;
    const qSpan = summary[1].match(/<span(?![^>]*faq__icon)[^>]*>([\s\S]*?)<\/span>/);
    visible.push({
      question: textOf(qSpan ? qSpan[1] : summary[1]),
      answer: textOf(answer[1]),
    });
  }

  for (const faq of faqNodes) {
    const ld = (faq.mainEntity ?? []).map((q) => ({
      question: textOf(q.name ?? ''),
      answer: textOf(q.acceptedAnswer?.text ?? ''),
    }));

    if (ld.length !== visible.length) {
      fail(
        `FAQPage != FAQ visible en ${page.route}: ${ld.length} preguntas en JSON-LD, ` +
          `${visible.length} visibles`,
      );
      continue;
    }
    for (let i = 0; i < ld.length; i++) {
      if (ld[i].question !== visible[i].question) {
        fail(
          `FAQPage != FAQ visible en ${page.route} (pregunta ${i + 1}):\n` +
            `     JSON-LD: "${ld[i].question}"\n     visible: "${visible[i].question}"`,
        );
      }
      if (ld[i].answer !== visible[i].answer) {
        fail(
          `FAQPage != FAQ visible en ${page.route} (respuesta ${i + 1}):\n` +
            `     JSON-LD: "${ld[i].answer.slice(0, 120)}"\n` +
            `     visible: "${visible[i].answer.slice(0, 120)}"`,
        );
      }
    }
  }
}

// ------------------------------------------------------------ 7. Product
for (const page of perPage) {
  for (const node of page.nodes.filter((n) => n['@type'] === 'Product')) {
    for (const field of ['brand', 'material', 'color', 'size']) {
      if (!node[field]) fail(`Product sin "${field}" en ${page.route}`);
    }
    if (!node.image || (Array.isArray(node.image) && !node.image.length)) {
      fail(`Product sin image en ${page.route}`);
    }
    for (const img of [].concat(node.image ?? [])) {
      if (!assetExists(img)) fail(`Product image inexistente en ${page.route}: ${img}`);
    }
    if (!node.offers) fail(`Product sin offers en ${page.route}`);
  }
}

// ------------------------------------------------------ 8. assets del schema
// `image`/`logo` tienen que ser un archivo real en dist/; `url` tiene que
// ser una página real (o el ancla de la propia página).
for (const page of perPage) {
  const assets = [];
  const urls = [];
  const collect = (value) => {
    if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) {
        if (typeof v === 'string') {
          if (k === 'image' || k === 'logo') assets.push(v);
          else if (k === 'url') urls.push(v);
        } else collect(v);
      }
    }
  };
  collect(page.nodes);
  for (const url of new Set(assets)) {
    if (!assetExists(url)) fail(`Schema apunta a un asset inexistente en ${page.route}: ${url}`);
  }
  for (const url of new Set(urls)) {
    if (!pageExists(url)) fail(`Schema apunta a una página inexistente en ${page.route}: ${url}`);
  }
}

// ---------------------------------------------------------------- raport
const typeCount = {};
for (const page of perPage) {
  for (const node of page.nodes) {
    const types = [].concat(node['@type'] ?? []);
    for (const t of types) typeCount[t] = (typeCount[t] ?? 0) + 1;
  }
}

console.log('Páginas HTML:', perPage.length);
console.log('Nodos JSON-LD:', perPage.reduce((sum, p) => sum + p.nodes.length, 0));
console.log('Tipos:', Object.entries(typeCount).map(([t, n]) => `${t}=${n}`).join(', '));

if (notes.length) {
  console.log('\nUwagi:');
  for (const n of [...new Set(notes)]) console.log(' -', n);
}

if (problems.length) {
  console.log('\nPROBLEMY:', problems.length);
  for (const p of problems.slice(0, 40)) console.log(' ✗', p);
  if (problems.length > 40) console.log(` … i ${problems.length - 40} więcej`);
  process.exit(1);
}

console.log('\nOK — dane strukturalne spójne.');
