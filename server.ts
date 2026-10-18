import { createServer } from 'node:http';
import { invoiceEndpoint } from './invoice.ts';

const server = createServer(async (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  try {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of request) {
      size += chunk.length;
      if (size > 1024) {
        response.writeHead(413).end(JSON.stringify({ error: 'Request too large' }));
        return;
      }
      chunks.push(chunk);
    }
    const raw = Buffer.concat(chunks).toString('utf8');
    const body = raw ? JSON.parse(raw) : null;
    const result = invoiceEndpoint(request.method ?? '', new URL(request.url ?? '/', 'http://localhost').pathname, body);
    if (result.status === 405) response.setHeader('Allow', 'POST');
    response.writeHead(result.status).end(JSON.stringify(result.body));
  } catch {
    response.writeHead(400).end(JSON.stringify({ error: 'Send valid JSON' }));
  }
});

server.requestTimeout = 5000;
server.listen(3000, '127.0.0.1', () => console.log('Fictional invoice exercise: http://127.0.0.1:3000/invoice'));
