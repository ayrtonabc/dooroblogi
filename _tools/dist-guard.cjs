/**
 * Guardián de `dist/` para la previsualización en vivo.
 *
 * Los agentes reconstruyen `dist/` mientras el usuario la está mirando. Astro
 * borra `dist/` antes de escribir, así que durante ~1,5 s la web devuelve 404,
 * y si un build falla a medias deja el directorio incompleto.
 *
 * Este proceso:
 *   1. cuando `dist/` está **completo**, guarda una copia en `_dist-snapshot/`;
 *   2. cuando `dist/` está **roto**, la restaura desde esa copia.
 *
 * Uso: node _tools/dist-guard.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SNAP = path.join(ROOT, '_dist-snapshot');
const MIN_PAGES = 40;
const INTERVAL = 3000;

function countHtml(dir) {
  let n = 0;
  const walk = (d) => {
    let entries;
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) n++;
    }
  };
  walk(dir);
  return n;
}

function isHealthy() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) return false;
  if (!fs.existsSync(path.join(DIST, '_astro'))) return false;
  return countHtml(DIST) >= MIN_PAGES;
}

function copyDir(from, to) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}

function restore() {
  if (!fs.existsSync(path.join(SNAP, 'index.html'))) return false;
  copyDir(SNAP, DIST);
  console.log(`[guard] dist/ estaba roto — restaurado desde la copia (${new Date().toLocaleTimeString()})`);
  return true;
}

let lastHealthy = false;

setInterval(() => {
  try {
    const healthy = isHealthy();
    if (healthy) {
      if (!lastHealthy) {
        try {
          copyDir(DIST, SNAP);
          console.log(`[guard] copia de seguridad actualizada (${new Date().toLocaleTimeString()})`);
        } catch (err) {
          console.log('[guard] no se pudo guardar la copia:', err.message);
        }
      }
      lastHealthy = true;
    } else if (lastHealthy) {
      restore();
      lastHealthy = false;
    }
  } catch (err) {
    console.log('[guard] error:', err.message);
  }
}, INTERVAL);

console.log(`[guard] vigilando ${DIST} (cada ${INTERVAL / 1000} s)`);
