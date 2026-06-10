/**
 * Generates a PDF of the built /cv page, pixel-identical to the browser's
 * "Print → Save as PDF" output (uses the site's @media print stylesheet).
 *
 * Run AFTER `astro build`. Serves the dist/ folder locally, renders /cv
 * in headless Chromium, and writes the PDF to dist/assets/cv.pdf so it's
 * deployed alongside the site at /assets/cv.pdf.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { chromium } from 'playwright';

const DIST = new URL('../dist', import.meta.url).pathname;
const OUT = join(DIST, 'assets', 'cv.pdf');

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

// Minimal static server mirroring GitHub Pages' clean-URL behavior:
// /cv -> /cv/index.html
const server = createServer(async (req, res) => {
  const urlPath = normalize(decodeURIComponent(req.url.split('?')[0]));
  const candidates = [
    join(DIST, urlPath),
    join(DIST, urlPath, 'index.html'),
  ];
  for (const file of candidates) {
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(body);
      return;
    } catch { /* try next candidate */ }
  }
  res.writeHead(404);
  res.end('not found');
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();

// PW_CHROMIUM_PATH lets local environments point at an existing Chromium
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/cv`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true, // respect the @page margins in style.css
  });
  console.log(`CV PDF written to ${OUT}`);
} finally {
  await browser.close();
  server.close();
}
