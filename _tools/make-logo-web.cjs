/**
 * Kopia webowa logo klienta.
 *
 * Plik `public/images/logo.webp` to masters 4032x938 (242 KB) — w przegladarce
 * i tak wyświetlany jest w 172 px szerokości. Przy takim rozmiarze Chromium
 * dekoduje obraz asynchronicznie i potrafi pozostawić puste miejsce w nagłówku
 * aż do pierwszego odświeżenia strony.
 *
 * Ten skrypt robi wyłącznie skalę: `public/images/logo.webp` zostaje
 * nienaruszony, powstaje `public/images/logo-web.webp` (900x209 px) do
 * codziennego użycia w interfejsie.
 *
 * Uruchomienie: node _tools/make-logo-web.cjs
 */
const sharp = require('sharp');
const path = require('node:path');
const fs = require('node:fs');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images', 'logo.webp');
const OUT = path.join(ROOT, 'public', 'images', 'logo-web.webp');

(async () => {
  const meta = await sharp(SRC).metadata();
  console.log(`masters: ${meta.width}x${meta.height} ${meta.format} ${meta.hasAlpha ? 'alfa' : 'bez alfy'}`);

  await sharp(SRC)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(OUT);

  const out = await sharp(OUT).metadata();
  const size = fs.statSync(OUT).size;
  console.log(`web:     ${out.width}x${out.height} ${out.format} ${out.hasAlpha ? 'alfa' : 'bez alfy'} ${(size / 1024).toFixed(1)} KB`);
})();
