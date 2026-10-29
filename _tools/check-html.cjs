/**
 * Sprawdza wygenerowany HTML pod kątem dwóch klas błędów, które dotąd
 * przechodziły przez `npm run verify` bez śladu:
 *
 *   1. Inline'owy skrypt zawierający składnię TypeScriptu.
 *      Astro wkleja skrypty `is:inline` i `define:vars` dosłownie, bez
 *      transpilacji — typy TS lądują w kodzie wynikowym i wywalają cały
 *      skrypt (`SyntaxError` na każdej stronie). Dlatego parsujemy skrypt
 *      jako zwykły JavaScript (`vm.Script`) i osobno szukamy typowych
 *      konstrukcji TS, które akurat bywają poprawnym JS-em (wywołanie
 *      z argumentami generycznymi, np. `querySelector<HTMLButtonElement>(…)`).
 *
 *   2. `<img>` z atrybutem `alt` bez wartości (albo bez `alt` wcale).
 *      HTML nie pozwala na atrybut `alt` bez wartości; Astro dodatkowo
 *      składa pusty string jako atrybut bez `=""`.
 *
 * Uruchomienie: node _tools/check-html.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

/* ------------------------------------------------------------------ *
 * Konstrukcje TypeScriptu, które bywają poprawnym JS-em
 * ------------------------------------------------------------------ */

/** Wywołania metod DOM z argumentami generycznymi — w JS nie ma sensu. */
const GENERIC_CALL = /\b(querySelectorAll|querySelector|closest|matches|getElementById|getElementsByClassName|getElementsByTagName|getElementsByName|createElement)\s*<\s*[A-Z][\w$]*(\s*,\s*[A-Z][\w$]*)*\s*>\s*\(/g;

/** Słowa kluczowe i typy, których w JS-em nie ma. */
const TS_KEYWORDS = [
  /\binterface\s+[A-Z]\w*/,
  /\benum\s+[A-Z]\w*/,
  /\bimplements\s+/,
  /\bdeclare\s+(module|namespace|global|const|let|var|function|class)\b/,
  /\btype\s+[A-Z]\w*\s*=/,
  /\bsatisfies\s+/,
  /\bas\s+(unknown|const|string|number|boolean|never|any)\b/,
  /\breadonly\s+[A-Za-z_$][\w$]*\s*[:=]/,
  /\b(private|public|protected)\s+[A-Za-z_$][\w$]*\s*[:=]/,
  /\bnull\s+[!?]?\s*[;,)]/,
];

/**
 * Parametr z adnotacją typu: `(foo: string` , `(x?: number` .
 *
 * WYJĄTEK 1: `true`, `false`, `null`, `undefined` NIGDY nie są typem
 * adnotacji — to wartości. Bez tego wyjątku każda właściwość obiektu
 * z wartością logiczną (`{ …, consent: true, }`) wyglądała dla
 * wyrażenia regularnego jak parametr z typem.
 *
 * WYJĄTEK 2 (28/10): adnotacja typu żyje tylko w nawiasie okrągłym —
 * w liście parametrów. W nawiasie klamrowym to zwykła WŁAŚCIWOŚĆ
 * OBIEKTU, czyli czysty JavaScript:
 *
 *     body: JSON.stringify({ ...data, attachments: attachmentNames, funnel })
 *
 * Bez tego wyjątku detektor krzyczał „TypeScript" na 21 stronach
 * (każda strona z formularzem wysyła w payloadzie nazwy załączników),
 * a kod był poprawnym JavaScriptem — parsowany przez `vm.Script` bez
 * błędu. Rozróżnienie robi `openBracketAt()`: patrzy, w jakiej klamrze
 * stało trafienie.
 */
const PARAM_ANNOTATION =
  /[(,]\s*[A-Za-z_$][\w$]*\s*\??\s*:\s*(?!true\b|false\b|null\b|undefined\b)[A-Za-z_$][\w$<>[\]|,.\s]*(?=[,)=])/g;

/* ------------------------------------------------------------------ *
 * Maskowanie literałów
 *
 * Detektor działa na tekście, nie na AST, więc musi wiedzieć, co jest
 * kodem, a co napisem. Zawartość napisów, komentarzy, literałów
 * szablonowych i wyrażeń regularnych zamieniamy na spacje — długość
 * tekstu i numery linii zostają, więc pozycje w komunikatach nadal
 * pasują do oryginału.
 *
 * To NIE jest obrona przed ukryciem błędu: skrypt i tak jest parsowany
 * jako JavaScript (`vm.Script`), więc adnotacja typu w środku napisu
 * i tak wywoła SyntaxError. Maskowanie odfiltrowuje tylko fałszywe
 * alarmy.
 * ------------------------------------------------------------------ */

function maskLiterals(code) {
  const out = code.split('');
  const n = code.length;
  const blank = (i) => {
    if (i >= 0 && i < n && out[i] !== '\n') out[i] = ' ';
  };

  /** Stos klatek: { tryb: 'code'|'template', wyrazenie: bool, klamry: liczba }. */
  const frames = [{ tryb: 'code', wyrazenie: false, klamry: 0 }];

  let i = 0;
  let slowo = ''; // ostatnie słowo (do rozpoznania regexu po `return` itd.)
  let ostatni = ''; // ostatni znak niepusty (nie-spacja)

  const slowaPrzedRegexem = new Set([
    'return',
    'typeof',
    'instanceof',
    'case',
    'in',
    'of',
    'new',
    'delete',
    'void',
    'do',
    'else',
    'yield',
    'await',
    'throw',
  ]);

  while (i < n) {
    const frame = frames[frames.length - 1];
    const ch = code[i];
    const naste = code[i + 1];

    // --- szablon literacki: `… ${ kod } …` ---
    if (frame.tryb === 'template') {
      if (ch === '\\') {
        blank(i);
        blank(i + 1);
        i += 2;
        continue;
      }
      if (ch === '`') {
        blank(i);
        i++;
        frames.pop();
        ostatni = '`';
        slowo = '';
        continue;
      }
      if (ch === '$' && naste === '{') {
        blank(i);
        blank(i + 1);
        i += 2;
        frames.push({ tryb: 'code', wyrazenie: true, klamry: 1 });
        continue;
      }
      blank(i);
      i++;
      continue;
    }

    // --- kod ---
    if (ch === '/' && naste === '/') {
      while (i < n && code[i] !== '\n') {
        blank(i);
        i++;
      }
      continue;
    }
    if (ch === '/' && naste === '*') {
      blank(i);
      blank(i + 1);
      i += 2;
      while (i < n && !(code[i] === '*' && code[i + 1] === '/')) {
        blank(i);
        i++;
      }
      if (i < n) {
        blank(i);
        blank(i + 1);
        i += 2;
      }
      continue;
    }
    if (ch === "'" || ch === '"') {
      const cudzyslow = ch;
      blank(i);
      i++;
      while (i < n) {
        if (code[i] === '\\') {
          blank(i);
          blank(i + 1);
          i += 2;
          continue;
        }
        if (code[i] === cudzyslow) {
          blank(i);
          i++;
          break;
        }
        blank(i);
        i++;
      }
      ostatni = cudzyslow;
      slowo = '';
      continue;
    }
    if (ch === '`') {
      blank(i);
      i++;
      frames.push({ tryb: 'template', wyrazenie: false, klamry: 0 });
      continue;
    }
    // Zamknięcie wyrażenia w `${ … }` → wracamy do szablonu.
    if (frame.wyrazenie && ch === '}') {
      frame.klamry -= 1;
      if (frame.klamry === 0) {
        blank(i);
        i++;
        frames.pop();
        ostatni = '}';
        slowo = '';
        continue;
      }
    }
    if (ch === '{') frame.klamry += 1;

    // Regex albo dzielenie — odróżniamy po poprzednim znaku/słowie.
    if (ch === '/') {
      const regexStart =
        ostatni === '' ||
        '(,=:[!&|?{};+-*%^~<>'.includes(ostatni) ||
        slowaPrzedRegexem.has(slowo);
      if (regexStart) {
        blank(i);
        i++;
        let wKlasie = false;
        while (i < n) {
          if (code[i] === '\\') {
            blank(i);
            blank(i + 1);
            i += 2;
            continue;
          }
          if (code[i] === '[') wKlasie = true;
          else if (code[i] === ']') wKlasie = false;
          else if (code[i] === '/' && !wKlasie) {
            blank(i);
            i++;
            break;
          } else if (code[i] === '\n') break;
          blank(i);
          i++;
        }
        while (i < n && /[a-z]/i.test(code[i])) {
          blank(i);
          i++;
        }
        ostatni = '/';
        slowo = '';
        continue;
      }
    }

    if (/[A-Za-z0-9_$]/.test(ch)) slowo += ch;
    else if (!/\s/.test(ch)) {
      slowo = '';
      ostatni = ch;
    }
    i++;
  }

  return out.join('');
}

/**
 * Najbardziej wewnętrzna otwarta klamra w pozycji `index`.
 * Zwraca `'('`, `'['`, `'{'` albo `''` (nic otwartego).
 */
function openBracketAt(masked, index) {
  const stos = [];
  const pary = { ')': '(', ']': '[', '}': '{' };
  for (let i = 0; i < index; i++) {
    const ch = masked[i];
    if (ch === '(' || ch === '[' || ch === '{') stos.push(ch);
    else if (ch === ')' || ch === ']' || ch === '}') {
      if (stos.length && stos[stos.length - 1] === pary[ch]) stos.pop();
    }
  }
  return stos.length ? stos[stos.length - 1] : '';
}

function findTypeScript(code) {
  const hits = [];
  const masked = maskLiterals(code);

  GENERIC_CALL.lastIndex = 0;
  let match;
  while ((match = GENERIC_CALL.exec(masked)) !== null) {
    hits.push(`${match[0].trim()} (poz. ${match.index})`);
  }

  PARAM_ANNOTATION.lastIndex = 0;
  while ((match = PARAM_ANNOTATION.exec(masked)) !== null) {
    // Trafienie zaczyna się nawiasem okrągłym → lista parametrów.
    // W przeciwnym razie pytamy, w jakiej klamrze stoi: w klamrowej
    // to właściwość obiektu, a nie adnotacja typu.
    const klamra = match[0].startsWith('(')
      ? '('
      : openBracketAt(masked, match.index);
    if (klamra === '{' || klamra === '[') continue;
    hits.push(`${match[0].trim()} (poz. ${match.index})`);
  }

  for (const pattern of TS_KEYWORDS) {
    const m = masked.match(pattern);
    if (m) hits.push(`${m[0].trim()} (poz. ${m.index})`);
  }

  return hits;
}

/* ------------------------------------------------------------------ *
 * Autotest detektora
 *
 * Detector, który przestał cokolwiek wykrywać, wygląda tak samo jak
 * działający. Autotest uruchamia się przy każdym `npm run verify`:
 * każdy przypadek mówi, co MA zostać wykryte i dlaczego ten kod jest
 * (albo nie jest) TypeScriptem.
 * ------------------------------------------------------------------ */
const AUTOTEST = [
  {
    kod: 'function f(x: string) { return x; }',
    ts: true,
    opis: 'adnotacja typu w parametrze',
  },
  {
    kod: 'const f = (a: number, b: string) => a + b;',
    ts: true,
    opis: 'dwa parametry z typem',
  },
  {
    kod: "const el = document.querySelector<HTMLDivElement>('#x');",
    ts: true,
    opis: 'wywołanie generyczne',
  },
  { kod: 'interface Props { a: string }', ts: true, opis: 'interfejs' },
  {
    kod: "const data = { name: 'Jan', attachments: attachmentNames, funnel: 'B' };",
    ts: false,
    opis: 'właściwości obiektu (fałszywy alarm z 28/10)',
  },
  {
    kod: 'const body = JSON.stringify({ ...data, attachments: names, funnel: f });',
    ts: false,
    opis: 'obiekt w wywołaniu',
  },
  { kod: 'const v = cond ? a : b;', ts: false, opis: 'ternarny' },
  { kod: 'if (consent) { ok = true; }', ts: false, opis: 'wartość logiczna' },
  {
    kod: "const label = 'Powierzchnia: m2';",
    ts: false,
    opis: 'dwukropek w napisie',
  },
  {
    kod: "el.addEventListener('change', () => sync());",
    ts: false,
    opis: 'zwykły JavaScript',
  },
  {
    kod: '// komentarz: (x: string)\nconst y = 1;',
    ts: false,
    opis: 'adnotacja w komentarzu',
  },
];

function runSelfTest() {
  const bledy = [];
  for (const przypadek of AUTOTEST) {
    const hits = findTypeScript(przypadek.kod);
    const wykryto = hits.length > 0;
    if (wykryto !== przypadek.ts) {
      bledy.push(
        `${przypadek.opis}: ${wykryto ? 'fałszywy alarm' : 'przeoczone'} (${hits.join('; ') || 'brak trafień'})`,
      );
    }
  }
  return bledy;
}

/* ------------------------------------------------------------------ *
 * Przebieg
 * ------------------------------------------------------------------ */

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return full.endsWith('.html') ? [full] : [];
  });
}

if (!fs.existsSync(DIST)) {
  console.error('Brak dist/ — najpierw `npm run build`.');
  process.exit(1);
}

const problems = [];
let scripts = 0;
let images = 0;

const bledyAutotestu = runSelfTest();
if (bledyAutotestu.length) {
  problems.push(`Autotest detektora TypeScriptu nie przeszedł: ${bledyAutotestu.join('; ')}`);
}

for (const file of walk(DIST)) {
  const pageUrl = '/' + path.relative(DIST, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf-8');

  // --- 1. Inline'owe skrypty -------------------------------------
  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attrs = match[1];
    const code = match[2];

    // JSON-LD sprawdzamy osobno (verify-dist parsuje go jako JSON).
    if (/type\s*=\s*["']application\/ld\+json["']/i.test(attrs)) continue;
    // Skrypty z `src` są plikami — ich treści nie ma w HTML.
    if (/\bsrc\s*=/i.test(attrs)) continue;

    scripts += 1;

    const tsHits = findTypeScript(code);
    if (tsHits.length) {
      problems.push(
        `Skrypt inline z składnią TypeScriptu w ${pageUrl}: ${tsHits.join('; ')}`,
      );
    }

    // Parsujemy jako zwykły JS — wyłapie każdy błąd składni.
    try {
      new vm.Script(code, { filename: `inline:${pageUrl}` });
    } catch (error) {
      problems.push(`Skrypt inline nie parsuje się jako JavaScript w ${pageUrl}: ${error.message}`);
    }
  }

  // --- 2. <img> bez wartościowego `alt` --------------------------
  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    images += 1;
    const attrs = match[1];
    const alt = attrs.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    if (!alt) {
      problems.push(`<img> bez atrybutu alt w ${pageUrl}`);
      continue;
    }
    if (alt[1] === undefined && alt[2] === undefined && alt[3] === undefined) {
      problems.push(`<img> z atrybutem alt bez wartości w ${pageUrl}`);
    }
  }

  // --- 3. Powtórzone `id` ---------------------------------------
  // Dwa elementy z tym samym id to nie tylko błąd HTML: `getElementById`
  // zwraca PIERWSZY z nich. Tak było z `quote-form` (sekcja i <form>):
  // skrypt formularza czytał atrybuty sekcji i nigdy nie widział endpointu.
  const vistos = new Set();
  const duplicados = new Set();
  for (const match of html.matchAll(/\sid="([^"]+)"/g)) {
    const id = match[1];
    if (vistos.has(id)) duplicados.add(id);
    vistos.add(id);
  }
  if (duplicados.size) {
    problems.push(`ID powtórzone w ${pageUrl}: ${[...duplicados].join(', ')}`);
  }
}

console.log('Strony HTML:', walk(DIST).length);
console.log('Inline’owe skrypty sprawdzone:', scripts);
console.log('Obrazki <img> sprawdzone:', images);
console.log('Autotest detektora TS:', bledyAutotestu.length ? 'NIE PRZESZEDŁ' : `OK (${AUTOTEST.length} przypadków)`);

if (problems.length) {
  console.log('\nPROBLEMY:', problems.length);
  for (const problem of problems.slice(0, 40)) console.log(' ✗', problem);
  if (problems.length > 40) console.log(` … i ${problems.length - 40} więcej`);
  process.exit(1);
}

console.log('\nOK — skrypty to czysty JavaScript, a każdy <img> ma wartościowy alt.');
