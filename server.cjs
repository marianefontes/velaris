/**
 * Beatrice Chat Server
 * RAG-augmented proxy for Groq streaming responses (OpenAI-compatible format)
 * Usage: GROQ_API_KEY=gsk_... node server.cjs
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3333;
const API_KEY = process.env.GROQ_API_KEY || '';
const MODEL = 'llama-3.3-70b-versatile';

// ─── RAG Corpus ───────────────────────────────────────────────────────────────
const CORPUS_PATH = path.join(__dirname, 'rag', 'aetheris-docs-dump.json');
let corpus = [];

try {
  const dump = JSON.parse(fs.readFileSync(CORPUS_PATH, 'utf8'));
  corpus = dump.chunks || [];
  console.log(`📚 Corpus RAG carregado: ${corpus.length} chunks`);
} catch (_) {
  console.warn('⚠️  aetheris-docs-dump.json não encontrado. Beatrice operará sem RAG.');
}

function tokenize(text) {
  return text.toLowerCase().split(/\W+/).filter(t => t.length > 2);
}

function retrieveChunks(query, topK = 3) {
  if (!corpus.length) return [];
  const qTokens = new Set(tokenize(query));
  const scored = corpus.map(chunk => {
    const cTokens = tokenize(chunk.text || '');
    const overlap = [...qTokens].filter(t => cTokens.includes(t)).length;
    const boost = (chunk.title || '').toLowerCase().split(/\W+/).some(t => qTokens.has(t)) ? 2 : 0;
    return { chunk, score: overlap + boost };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(r => r.score > 0)
    .map(r => r.chunk);
}

function buildRagContext(chunks) {
  if (!chunks.length) return '';
  const sources = chunks.map((c, i) => {
    const fields = [];
    if (c.logic) fields.push(`Logic: ${c.logic}`);
    if (c.structure) fields.push(`Structure: ${c.structure}`);
    if (c.when_to_use) fields.push(`When to use: ${c.when_to_use}`);
    if (c.when_not_to_use) fields.push(`When NOT to use: ${c.when_not_to_use}`);
    if (c.trade_offs) fields.push(`Trade-offs: ${c.trade_offs}`);
    if (c.aetheris_insight) fields.push(`Aetheris Insight: ${c.aetheris_insight}`);
    return `[Fonte ${i + 1}: ${c.source} — ${c.title}]\n${fields.join(' | ')}`;
  });
  return `\n\n---\nContexto recuperado do design system Aetheris (RAG):\n${sources.join('\n\n')}`;
}

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
- quando tiver contexto RAG disponível, cite a fonte pelo nome (ex: "segundo ComponentsPage — Primary Action");
- mencione trade-offs quando relevante.
`.trim();

// ─── Server ───────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ── POST /api/chat — RAG retrieval + Groq streaming ─────────────────────
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

      // RAG: extract last user query and retrieve relevant chunks
      const lastUser = [...userMessages].reverse().find(m => m.role === 'user');
      const query = lastUser?.content || '';
      const retrieved = retrieveChunks(query);
      const ragContext = buildRagContext(retrieved);

      const systemContent = AETHERIS_SYSTEM_PROMPT + ragContext;

      const messages = [
        { role: 'system', content: systemContent },
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

      // Emit retrieved sources as first SSE event for XAI attribution
      if (retrieved.length) {
        const sources = retrieved.map(c => ({ title: c.title, source: c.source }));
        res.write(`data: ${JSON.stringify({ sources })}\n\n`);
      }

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
    res.end(JSON.stringify({
      status: 'ok',
      service: 'beatrice-chat-server',
      model: MODEL,
      corpus_chunks: corpus.length,
      rag_active: corpus.length > 0,
    }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log('\n🌟 Beatrice Chat Server rodando em http://localhost:' + PORT);
  console.log('🩺 Health check: http://localhost:' + PORT + '/health');
  console.log(`🔍 RAG: ${corpus.length > 0 ? corpus.length + ' chunks ativos' : 'INATIVO — corpus não encontrado'}`);
  if (!API_KEY) {
    console.log('\n⚠️  GROQ_API_KEY não definida!');
    console.log('   1. Crie uma conta gratuita em https://console.groq.com');
    console.log('   2. Gere uma API key em API Keys');
    console.log('   3. Reinicie com: GROQ_API_KEY=gsk_... node server.cjs\n');
  } else {
    console.log('✅ API Key carregada | Modelo: ' + MODEL + '\n');
  }
});
