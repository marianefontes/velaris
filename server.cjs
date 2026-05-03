/**
 * Beatrice Chat Server
 * API proxy for Groq streaming responses (OpenAI-compatible format)
 * Usage: GROQ_API_KEY=gsk_... node server.cjs
 */

const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3333;
const API_KEY = process.env.GROQ_API_KEY || '';
const MODEL = 'llama-3.3-70b-versatile';

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

  // ── POST /api/chat — proxy Groq with streaming ───────────────────────────
  if (req.method === 'POST' && parsedUrl.pathname === '/api/chat') {
    if (!API_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'GROQ_API_KEY não definida. Inicie o servidor com: GROQ_API_KEY=gsk_... node server.cjs' }));
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

      const userMessages = payload.messages || [];

      // Groq uses OpenAI format: system message as first item in messages array
      const messages = [
        { role: 'system', content: AETHERIS_SYSTEM_PROMPT },
        ...userMessages,
      ];

      const groqBody = JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        stream: true,
        messages,
      });

      const options = {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Length': Buffer.byteLength(groqBody),
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
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                res.write('data: [DONE]\n\n');
                continue;
              }
              try {
                const parsed = JSON.parse(data);
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) {
                  res.write(`data: ${JSON.stringify({ delta: text })}\n\n`);
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

      apiReq.write(groqBody);
      apiReq.end();
    });
    return;
  }

  if (req.method === 'GET' && parsedUrl.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'beatrice-chat-server', model: MODEL }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log('\n🌟 Beatrice Chat Server rodando em http://localhost:' + PORT);
  console.log('🩺 Health check: http://localhost:' + PORT + '/health');
  if (!API_KEY) {
    console.log('\n⚠️  GROQ_API_KEY não definida!');
    console.log('   1. Crie uma conta gratuita em https://console.groq.com');
    console.log('   2. Gere uma API key em API Keys');
    console.log('   3. Reinicie com: GROQ_API_KEY=gsk_... node server.cjs\n');
  } else {
    console.log('✅ API Key carregada | Modelo: ' + MODEL + '\n');
  }
});
