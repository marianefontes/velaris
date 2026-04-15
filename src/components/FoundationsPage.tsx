import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";

interface ColorToken {
  name: string;
  value: string;
  description: string;
}

interface TypographyRow {
  label: string;
  sample: string;
  className: string;
  usage: string;
}

function getFoundationsContent(locale: Locale) {
  if (locale === "en-US") {
    return {
      hero: {
        badge: "Design System Foundations",
        titlePrefix: "The atomic rules of",
        description:
          "Tokens, surfaces, rhythm and hierarchy that define how Aetheris feels consistent, luminous and operationally clear across every screen.",
      },
      insight: {
        eyebrow: "Aetheris insight",
        text:
          "Foundations are the quiet layer of trust. When spacing, tone and elevation are consistent, every prediction and interaction feels more credible.",
        harmonyLabel: "Visual harmony",
        loadLabel: "Cognitive load",
        loadValue: "Low",
      },
      colors: {
        eyebrow: "Color system",
        title: "Bioluminescent roles",
        badge: "6 key tokens",
        tokens: [
          {
            name: "Primary",
            value: "#deccfd",
            description: "Primary signal for AI, focus and key actions.",
          },
          {
            name: "Secondary",
            value: "#c2a0fc",
            description: "Support layer for state, nuance and emphasis.",
          },
          {
            name: "Tertiary",
            value: "#c29fff",
            description: "Additional glow for special states and tonal variation.",
          },
          {
            name: "Surface",
            value: "#0e0e10",
            description: "Canvas base with depth and strong contrast.",
          },
          {
            name: "Surface High",
            value: "#1f1f22",
            description: "Surface for panels, cards and floating components.",
          },
          {
            name: "Error",
            value: "#ff6e84",
            description: "Critical feedback and alerts that require cognitive interruption.",
          },
        ] satisfies ColorToken[],
      },
      principles: {
        eyebrow: "Principles",
        title: "System behavior",
        items: [
          "Deep surfaces with calm contrast, never too flat.",
          "AI should feel like part of the system, not a generic overlay.",
          "Visual hierarchy comes from glow, scale and rhythm, not excess borders.",
          "Feedback must be legible at a glance, especially in critical states.",
        ],
      },
      spacing: {
        eyebrow: "Spacing scale",
        title: "Spatial rhythm",
        items: [
          { token: "space-2", value: "0.5rem", use: "micro gaps, icons and chips" },
          { token: "space-4", value: "1rem", use: "compact cards and controls" },
          { token: "space-6", value: "1.5rem", use: "internal sections and medium composition" },
          { token: "space-10", value: "2.5rem", use: "hero spacing and dense panels" },
        ],
      },
      typography: {
        eyebrow: "Typography scale",
        title: "Expressive hierarchy",
        rows: [
          {
            label: "Display",
            sample: "Aetheris Display",
            className: "text-6xl font-black tracking-tighter",
            usage: "Hero areas, covers and brand statements.",
          },
          {
            label: "Heading",
            sample: "System heading",
            className: "text-3xl font-bold tracking-tight",
            usage: "Section titles and panel headings.",
          },
          {
            label: "Body",
            sample: "Readable interface copy with calm rhythm.",
            className: "text-base font-normal leading-7 text-on-surface-variant",
            usage: "Reading blocks, explanations and documentation.",
          },
          {
            label: "Label",
            sample: "TOKEN / STATUS / META",
            className: "text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant",
            usage: "Metadata, badges and secondary navigation.",
          },
        ] satisfies TypographyRow[],
      },
    };
  }

  const isPtPt = locale === "pt-PT";

  return {
    hero: {
      badge: "Fundações do Design System",
      titlePrefix: isPtPt ? "As regras atómicas de" : "As regras atômicas de",
      description: isPtPt
        ? "Tokens, superfícies, ritmo e hierarquia que definem como o Aetheris se mantém consistente, luminoso e operacionalmente claro em cada ecrã."
        : "Tokens, superfícies, ritmo e hierarquia que definem como o Aetheris se mantém consistente, luminoso e operacionalmente claro em cada tela.",
    },
    insight: {
      eyebrow: "Aetheris insight",
      text: isPtPt
        ? "As fundações são a camada silenciosa de confiança. Quando espaçamento, tom e elevação são consistentes, cada previsão e interação parece mais credível."
        : "As fundações são a camada silenciosa de confiança. Quando espaçamento, tom e elevação são consistentes, cada previsão e interação parece mais crível.",
      harmonyLabel: "Harmonia visual",
      loadLabel: "Carga cognitiva",
      loadValue: "Baixa",
    },
    colors: {
      eyebrow: "Sistema de cores",
      title: isPtPt ? "Papéis bioluminescentes" : "Papéis bioluminescentes",
      badge: "6 tokens-chave",
      tokens: [
        {
          name: "Primary",
          value: "#deccfd",
          description: isPtPt
            ? "Sinal principal para IA, foco e ações-chave."
            : "Sinal principal para IA, foco e ações-chave.",
        },
        {
          name: "Secondary",
          value: "#c2a0fc",
          description: "Camada de apoio para estado, nuances e ênfase.",
        },
        {
          name: "Tertiary",
          value: "#c29fff",
          description: isPtPt
            ? "Brilho adicional para estados especiais e variação tonal."
            : "Brilho adicional para estados especiais e variação tonal.",
        },
        {
          name: "Surface",
          value: "#0e0e10",
          description: isPtPt
            ? "Base do canvas com profundidade e contraste alto."
            : "Base do canvas com profundidade e contraste alto.",
        },
        {
          name: "Surface High",
          value: "#1f1f22",
          description: isPtPt
            ? "Superfície de painéis, cards e componentes flutuantes."
            : "Superfície de painéis, cards e componentes flutuantes.",
        },
        {
          name: "Error",
          value: "#ff6e84",
          description: isPtPt
            ? "Feedback crítico e alertas que exigem interrupção cognitiva."
            : "Feedback crítico e alertas que precisam de interrupção cognitiva.",
        },
      ] satisfies ColorToken[],
    },
    principles: {
      eyebrow: "Princípios",
      title: isPtPt ? "Comportamento do sistema" : "Comportamento do sistema",
      items: [
        "Superfícies profundas com contraste calmo, nunca demasiado planas.",
        "A IA deve parecer parte do sistema, e não um overlay genérico.",
        "Hierarquia visual vem de brilho, escala e ritmo, não de excesso de bordas.",
        "O feedback precisa de ser legível num relance, especialmente em estados críticos.",
      ],
    },
    spacing: {
      eyebrow: "Escala de espaçamento",
      title: "Ritmo espacial",
      items: [
        { token: "space-2", value: "0.5rem", use: "micro gaps, ícones e chips" },
        { token: "space-4", value: "1rem", use: "cards compactos e controlos" },
        { token: "space-6", value: "1.5rem", use: "secções internas e composição média" },
        { token: "space-10", value: "2.5rem", use: "espaçamento do hero e painéis densos" },
      ],
    },
    typography: {
      eyebrow: "Escala tipográfica",
      title: isPtPt ? "Hierarquia expressiva" : "Hierarquia expressiva",
      rows: [
        {
          label: "Display",
          sample: "Aetheris Display",
          className: "text-6xl font-black tracking-tighter",
          usage: isPtPt ? "Hero, capas e afirmações de marca." : "Hero, capas e statements de marca.",
        },
        {
          label: "Heading",
          sample: isPtPt ? "Heading do sistema" : "Heading do sistema",
          className: "text-3xl font-bold tracking-tight",
          usage: isPtPt ? "Títulos de secções e painéis." : "Títulos de seções e painéis.",
        },
        {
          label: "Body",
          sample: isPtPt
            ? "Texto de interface legível com ritmo calmo."
            : "Texto de interface legível com ritmo calmo.",
          className: "text-base font-normal leading-7 text-on-surface-variant",
          usage: isPtPt
            ? "Blocos de leitura, explicações e documentação."
            : "Blocos de leitura, explicações e documentação.",
        },
        {
          label: "Label",
          sample: "TOKEN / STATUS / META",
          className: "text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant",
          usage: isPtPt ? "Metadados, badges e navegação secundária." : "Metadados, badges e navegação secundária.",
        },
      ] satisfies TypographyRow[],
    },
  };
}

function TokenSwatch({ token }: { token: ColorToken }) {
  return (
    <div className="glass-panel rounded-[24px] p-5">
      <div className="flex items-center gap-4">
        <span
          className="h-14 w-14 rounded-2xl border border-white/10"
          style={{ backgroundColor: token.value }}
        />
        <div>
          <p className="text-sm font-bold text-white">{token.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-on-surface-variant">
            {token.value}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-on-surface-variant">{token.description}</p>
    </div>
  );
}

export function FoundationsPage() {
  const { locale } = useI18n();
  const content = getFoundationsContent(locale);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="glass-panel rounded-[36px] p-8 md:p-10">
          <span className="signature-pill">{content.hero.badge}</span>
          <h1 className="mt-6 text-5xl font-black tracking-tighter text-white md:text-7xl">
            {content.hero.titlePrefix} <span className="signature-text">Aetheris</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant">
            {content.hero.description}
          </p>
        </div>

        <div className="glass-panel relative overflow-hidden rounded-[36px] p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-primary">
            {content.insight.eyebrow}
          </p>
          <p className="mt-4 text-sm leading-7 text-on-surface-variant">{content.insight.text}</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
                {content.insight.harmonyLabel}
              </p>
              <p className="mt-2 text-3xl font-black text-white">99.1%</p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
                {content.insight.loadLabel}
              </p>
              <p className="mt-2 text-3xl font-black text-white">{content.insight.loadValue}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-[32px] p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
                {content.colors.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">{content.colors.title}</h2>
            </div>
            <span className="signature-pill">{content.colors.badge}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {content.colors.tokens.map((token) => (
              <TokenSwatch key={token.name} token={token} />
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[32px] p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
            {content.principles.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">{content.principles.title}</h2>
          <div className="mt-8 space-y-4">
            {content.principles.items.map((principle) => (
              <div key={principle} className="glass-card rounded-2xl p-4">
                <p className="text-sm leading-7 text-on-surface-variant">{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel rounded-[32px] p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
            {content.spacing.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">{content.spacing.title}</h2>
          <div className="mt-8 space-y-4">
            {content.spacing.items.map((item) => (
              <div
                key={item.token}
                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-surface-container-low p-4"
              >
                <div className="w-28 shrink-0">
                  <p className="text-sm font-bold text-white">{item.token}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                    {item.value}
                  </p>
                </div>
                <div className="h-3 rounded-full bg-signature" style={{ width: item.value }} />
                <p className="ml-auto max-w-[180px] text-right text-xs text-on-surface-variant">
                  {item.use}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[32px] p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
            {content.typography.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">{content.typography.title}</h2>
          <div className="mt-8 space-y-5">
            {content.typography.rows.map((row) => (
              <div
                key={row.label}
                className="rounded-[28px] border border-white/5 bg-surface-container-low p-6"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  {row.label}
                </p>
                <p className={`mt-3 text-white ${row.className}`}>{row.sample}</p>
                <p className="mt-4 text-sm leading-6 text-on-surface-variant">{row.usage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
