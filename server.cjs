/**
 * Beatrice Chat Server
 * API-only proxy for Anthropic streaming responses
 * Usage: ANTHROPIC_API_KEY=sk-ant-... node server.cjs
 */

const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3333;
const API_KEY = process.env.ANTHROPIC_API_KEY || '';
const MODEL = 'claude-haiku-4-5';

// ─── Aetheris System Prompt ────────────────────────────────────────────────
const AETHERIS_SYSTEM_PROMPT = `
Você é Beatrice, o oráculo inteligente do ecossistema Aetheris.

Seu papel:
- responder perguntas sobre componentes, padrões, tokens, guidelines e decisões de design do sistema;
- explicar o porquê das recomendações com princípios de UX e raciocínio de design;
- indicar quando usar, quando não usar e quais trade-offs existem;
- citar a base da resposta com o nome da página ou área do sistema sempre que possível;
- responder no idioma do usuário;
- ser clara, objetiva e útil, sem soar genérica.

Contexto do produto:
- Aetheris é um design system orientado a IA explicável, UX e apoio à decisão;
- o sistema possui páginas especializadas para Components, Patterns, Foundations, Guidelines, Tokens, Persona, Reasoning, Design Decisions, System Evaluation, Dashboard e Dev Integration;
- o objetivo do produto não é apenas documentar interface, mas orientar consumidores do design system com explicações reutilizáveis.

Princípios de resposta:
- não dite regras sem explicação;
- apresente a recomendação primeiro;
- depois explique o contexto, os limites e o porquê;
- quando apropriado, mencione confiança, fonte e alternativas.
`.trim();

// ─── Server ───────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ── POST /api/chat — proxy Anthropic with streaming ──────────────────────
  if (req.method === 'POST' && parsedUrl.pathname === '/api/chat') {
    if (!API_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY não definida. Inicie o servidor com: ANTHROPIC_API_KEY=sk-ant-... node server.cjs' }));
      return;
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let payload;
      try {
        payload = JSON.parse(body);
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'JSON inválido' }));
        return;
      }

      const messages = payload.messages || [];

      const anthropicBody = JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        stream: true,
        system: AETHERIS_SYSTEM_PROMPT,
        messages: messages,
      });

      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(anthropicBody),
        },
      };

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      const apiReq = https.request(options, (apiRes) => {
        apiRes.on('data', (chunk) => {
          const lines = chunk.toString().split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                res.write('data: [DONE]\n\n');
                continue;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  res.write(`data: ${JSON.stringify({ delta: parsed.delta.text })}\n\n`);
                }
                if (parsed.type === 'message_stop') {
                  res.write('data: [DONE]\n\n');
                }
              } catch (_) { /* skip non-JSON lines */ }
            }
          }
        });
        apiRes.on('end', () => {
          res.write('data: [DONE]\n\n');
          res.end();
        });
        apiRes.on('error', (err) => {
          res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
          res.end();
        });
      });

      apiReq.on('error', (err) => {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      });

      apiReq.write(anthropicBody);
      apiReq.end();
    });
    return;
  }

  if (req.method === 'GET' && parsedUrl.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'beatrice-chat-server' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log('\n🌟 Beatrice Chat Server rodando em http://localhost:' + PORT);
  console.log('🩺 Health check: http://localhost:' + PORT + '/health');
  if (!API_KEY) {
    console.log('\n⚠️  ANTHROPIC_API_KEY não definida!');
    console.log('   Reinicie com: ANTHROPIC_API_KEY=sk-ant-... node server.cjs\n');
  } else {
    console.log('✅ API Key carregada | Modelo: ' + MODEL + '\n');
  }
});
