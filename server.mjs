import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};

http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(req.url === '/' ? '/index.html' : req.url.split('?')[0]);
  const file = normalize(join(root, pathname));
  if (!file.startsWith(normalize(root))) { res.writeHead(403); return res.end('Forbidden'); }
  try {
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type': mime[extname(file)] || 'application/octet-stream'});
    res.end(body);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}).listen(4173, '127.0.0.1', () => console.log('http://127.0.0.1:4173'));
