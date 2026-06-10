/**
 * Optimizes images in public/assets before the Astro build: resizes anything
 * wider than MAX_WIDTH and recompresses. Pages CMS uploads photos at full
 * camera resolution (the portrait was 599 KB for a 280px display slot), so
 * this keeps mobile load times sane no matter what gets uploaded.
 */
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const DIR = new URL('../public/assets', import.meta.url).pathname;
const MAX_WIDTH = 600;

for (const name of await readdir(DIR)) {
  const ext = extname(name).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

  const path = join(DIR, name);
  const before = (await stat(path)).size;
  // rotate() bakes in EXIF orientation so resizing doesn't flip the image
  const img = sharp(path).rotate();
  const meta = await sharp(path).metadata();
  const resized = (meta.width || 0) > MAX_WIDTH ? img.resize(MAX_WIDTH) : img;

  const buf = ext === '.png'
    ? await resized.png({ compressionLevel: 9 }).toBuffer()
    : ext === '.webp'
      ? await resized.webp({ quality: 82 }).toBuffer()
      : await resized.jpeg({ quality: 80, mozjpeg: true }).toBuffer();

  if (buf.length < before) {
    await writeFile(path, buf);
    console.log(`${name}: ${(before / 1024).toFixed(0)} KB -> ${(buf.length / 1024).toFixed(0)} KB`);
  } else {
    console.log(`${name}: already optimal (${(before / 1024).toFixed(0)} KB)`);
  }
}
