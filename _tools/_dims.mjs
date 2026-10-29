import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const files = [];
for (const dir of ['public/og', 'public/images', 'public']) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isFile() && /\.(jpg|jpeg|png|webp)$/i.test(name)) files.push(full);
  }
}
for (const file of files) {
  const meta = await sharp(file).metadata();
  console.log(`${file.padEnd(40)} ${meta.width}x${meta.height} ${meta.format} ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
}
