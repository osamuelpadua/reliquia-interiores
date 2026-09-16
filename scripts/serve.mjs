import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = resolve(process.argv.includes('--dist') ? 'dist' : '.');
const portIndex = process.argv.indexOf('--port');
const port = Number(process.env.PORT || (portIndex >= 0 ? process.argv[portIndex + 1] : 4173));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const segments = pathname.split('/').filter(Boolean);
    if (segments.some(segment => segment.startsWith('.')) || pathname.includes('\\')) {
      response.writeHead(404).end('Not found');
      return;
    }
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    const isPublic = ['index.html', 'style.css', 'script.js', 'site.config.js'].includes(segments[0]) || segments[0] === 'assets' || pathname === '/';
    if (!file.startsWith(root + sep) || !isPublic || !(await stat(file)).isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' });
    if (request.method === 'HEAD') response.end();
    else createReadStream(file).on('error', () => response.destroy()).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Relíquia Interiores: http://localhost:${port}`));
