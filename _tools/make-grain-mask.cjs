/**
 * Genera una máscara de las VETAS a partir de una foto del cliente.
 *
 * No es un filtro aplicado a la foto (la foto no se toca): es un asset
 * aparte, en blanco y negro, que el CSS usa como `mask-image` con
 * `mask-mode: luminance`. Así una luz en movimiento solo se ve sobre las
 * líneas del grano: el efecto de «la luz recorriendo la veta» sale de la
 * propia madera, no de un degradado genérico.
 *
 * El cálculo es un Sobel a mano sobre los píxeles en crudo (sharp no acepta
 * el kernel de Sobel en `convolve` porque suma cero). Se normaliza por
 * percentiles para que el resultado no dependa del brillo de la foto.
 *
 * Uso:
 *   node _tools/make-grain-mask.cjs <entrada> <salida> [ancho]
 *
 * Reglas del proyecto: la foto original NO se modifica. Solo se lee y se
 * escribe un asset nuevo de máscara.
 */
const path = require('node:path');
const fs = require('node:fs');
const sharp = require('sharp');

const [
  input = 'src/assets/images/hero-oblog-debowy.jpg',
  output = 'public/images/grain-hero.webp',
  widthArg = '1280',
] = process.argv.slice(2);

const width = Number(widthArg);

(async () => {
  const src = path.resolve(input);
  if (!fs.existsSync(src)) throw new Error(`No existe la imagen: ${src}`);

  const { data, info } = await sharp(src)
    .resize({ width, withoutEnlargement: false })
    .greyscale()
    .blur(0.8) // las vetas son líneas, no ruido de sensor
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  const gray = data; // 1 byte por píxel

  // Sobel 3x3, pero SOLO la componente vertical (gy).
  //
  // Por qué: las vetas de la madera son líneas horizontales (su gradiente es
  // vertical), mientras que las grapas y las juntas de las tablas son líneas
  // verticales (gradiente horizontal). Usando solo `gy` la máscara se queda
  // con la veta y se olvida de las grapas — que era lo que dominaba con el
  // Sobel completo.
  const mag = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const tl = gray[i - w - 1];
      const tc = gray[i - w];
      const tr = gray[i - w + 1];
      const bl = gray[i + w - 1];
      const bc = gray[i + w];
      const br = gray[i + w + 1];

      mag[i] = Math.abs(-tl - 2 * tc - tr + bl + 2 * bc + br);
    }
  }

  // Normalización por percentiles: el 97 % de los píxeles queda oscuro y el
  // 3 % más marcado se convierte en las líneas de la veta.
  const sample = Array.from(mag).sort((a, b) => a - b);
  const p = (q) => sample[Math.min(sample.length - 1, Math.floor(sample.length * q))] || 1;
  const low = p(0.9);
  const high = Math.max(p(0.995), low + 1);

  const out = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) {
    const t = Math.min(1, Math.max(0, (mag[i] - low) / (high - low)));
    // Curva suave: líneas nítidas pero sin el borde duro de un umbral binario.
    out[i] = Math.round(255 * Math.pow(t, 0.75));
  }

  await sharp(out, { raw: { width: w, height: h, channels: 1 } })
    .webp({ quality: 84, effort: 6 })
    .toFile(output);

  const size = fs.statSync(output).size;
  console.log(`máscara de vetas: ${output}  ${w}x${h}  ${Math.round(size / 1024)} KB`);
})();
