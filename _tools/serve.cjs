/**
 * Minimalistyczny serwer statyczny dla `dist/` — do podglądu i screenshotów.
 * Zero zależności. Obsługuje: index.html w katalogach, 404, MIME types.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT || 4330);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, body, type) {
  res.writeHead(status, {
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = path.join(ROOT, url);

    if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden');

    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
      if (!fs.existsSync(filePath)) {
        const noExt = filePath + '.html';
        if (fs.existsSync(noExt)) {
          filePath = noExt;
        } else {
          const notFound = path.join(ROOT, '404.html');
          if (fs.existsSync(notFound)) {
            return send(res, 404, fs.readFileSync(notFound), MIME['.html']);
          }
          return send(res, 404, 'Not found');
        }
      }
      const ext = path.extname(filePath).toLowerCase();
      send(res, 200, fs.readFileSync(filePath), MIME[ext] || 'application/octet-stream');
    } catch (error) {
      send(res, 500, String(error));
    }
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`serving ${ROOT} at http://127.0.0.1:${PORT}`);
  });
