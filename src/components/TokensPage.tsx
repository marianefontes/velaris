import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";

interface TokenSwatch {
  name: string;
  value: string;
}

interface SemanticToken {
  label: string;
  variable: string;
  value: string;
}

interface TypeToken {
  label: string;
  sample: string;
  className: string;
  meta: string;
}

const primaryScale: TokenSwatch[] = [
  { name: "primary-50", value: "#f5f0ff" },
  { name: "primary-100", value: "#ede2ff" },
  { name: "primary-200", value: "#deccfd" },
  { name: "primary-300", value: "#c2a0fc" },
  { name: "primary-400", value: "#a777f9" },
  { name: "primary-500", value: "#8b4ff5" },
  { name: "primary-600", value: "#6a30d4" },
  { name: "primary-700", value: "#4a1aa0" },
];

const surfaceScale: TokenSwatch[] = [
  { name: "surface-lowest", value: "#000000" },
  { name: "background", value: "#0e0e10" },
  { name: "surface-container-low", value: "#131315" },
  { name: "surface-container", value: "#19191c" },
  { name: "surface-container-high", value: "#1f1f22" },
  { name: "surface-container-highest", value: "#262528" },
  { name: "surface-bright", value: "#2c2c2f" },
];

const semanticColors: SemanticToken[] = [
  { label: "Primary", variable: "--aetheris-color-primary", value: "#deccfd" },
  { label: "Secondary", variable: "--aetheris-color-secondary", value: "#c2a0fc" },
  { label: "Success", variable: "--aetheris-color-success", value: "#7ee787" },
  { label: "Warning", variable: "--aetheris-color-warning", value: "#ffa657" },
  { label: "Error", variable: "--aetheris-color-error", value: "#ff6e84" },
];

const typographyTokens: TypeToken[] = [
  {
    label: "display-xl",
    sample: "Token System",
    className: "text-6xl font-black tracking-tighter",
    meta: "Hero headlines and identity surfaces",
  },
  {
    label: "heading-lg",
    sample: "Section title",
    className: "text-3xl font-black tracking-tight",
    meta: "Major sections and content anchors",
  },
  {
    label: "body-md",
    sample: "Readable interface copy with balanced rhythm and calm contrast.",
    className: "text-base leading-7 text-on-surface-variant",
    meta: "Documentation, explanations and descriptions",
  },
  {
    label: "label-sm",
    sample: "TOKEN / STATUS / META",
    className: "text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant",
    meta: "Metadata, compact navigation and chips",
  },
];

const spacingTokens = [
  { token: "space-1", value: "0.25rem", use: "micro alignment and icon breathing room" },
  { token: "space-2", value: "0.5rem", use: "compact group spacing and chips" },
  { token: "space-4", value: "1rem", use: "default card padding and form rhythm" },
  { token: "space-6", value: "1.5rem", use: "section blocks and content density" },
  { token: "space-10", value: "2.5rem", use: "hero spacing and layout separation" },
];

const radiusShadowTokens = [
  { label: "radius-sm", value: "0.5rem", detail: "Inputs, pills and compact cards" },
  { label: "radius-md", value: "1rem", detail: "Standard panels and groups" },
  { label: "radius-xl", value: "2rem", detail: "Hero cards and immersive surfaces" },
  { label: "shadow-glow", value: "0 0 64px rgba(179,157,219,0.12)", detail: "Aetheris ambient emphasis" },
];

const motionTokens = [
  {
    label: "motion-fast",
    value: "160ms",
    detail: "Micro interactions, hover and control feedback",
  },
  {
    label: "motion-base",
    value: "240ms",
    detail: "Default transitions for cards and layout shifts",
  },
  {
    label: "motion-slow",
    value: "420ms",
    detail: "Meaningful emphasis and staged system reveals",
  },
  {
    label: "easing-signature",
    value: "cubic-bezier(0.22,1,0.36,1)",
    detail: "Smooth, confident movement without abrupt stops",
  },
];

function getTokensCopy(locale: Locale) {
  if (locale === "en-US") {
    return {
      heroTitle: "Design",
      heroAccent: "Tokens",
      heroEyebrow: "The atomic unit of the visual language",
      systemVersion: "Token System v3",
      total: "Total",
      color: "Color",
      system: "System",
      colorTokens: "Color Tokens",
      colorTokensBadge: "64 tokens",
      primaryScale: "Primary Scale",
      surfaceScale: "Surface Scale",
      semanticColors: "Semantic Colors",
      typographyTokens: "Typography Tokens",
      typographyBadge: "12 styles",
      spacingTokens: "Spacing Tokens",
      radiusShadow: "Radius & Shadow",
      motionTokens: "Motion Tokens",
      motionBadge: "timing & easing",
    };
  }

  const isPtPt = locale === "pt-PT";

  return {
    heroTitle: "Design",
    heroAccent: "Tokens",
    heroEyebrow: isPtPt
      ? "A unidade atómica da linguagem visual"
      : "A unidade atômica da linguagem visual",
    systemVersion: "Token System v3",
    total: "Total",
    color: isPtPt ? "Cor" : "Cor",
    system: "Sistema",
    colorTokens: isPtPt ? "Tokens de Cor" : "Tokens de Cor",
    colorTokensBadge: "64 tokens",
    primaryScale: isPtPt ? "Escala Primary" : "Escala Primary",
    surfaceScale: isPtPt ? "Escala Surface" : "Escala Surface",
    semanticColors: isPtPt ? "Cores Semânticas" : "Cores Semânticas",
    typographyTokens: isPtPt ? "Tokens Tipográficos" : "Tokens Tipográficos",
    typographyBadge: "12 styles",
    spacingTokens: isPtPt ? "Tokens de Espaçamento" : "Tokens de Espaçamento",
    radiusShadow: isPtPt ? "Raio e Sombra" : "Raio e Sombra",
    motionTokens: isPtPt ? "Tokens de Movimento" : "Tokens de Movimento",
    motionBadge: isPtPt ? "tempo e easing" : "tempo e easing",
  };
}

function ColorCell({ token }: { token: TokenSwatch }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-16 rounded-xl border border-white/10" style={{ background: token.value }} />
      <p className="text-[10px] font-mono text-slate-300">{token.name}</p>
      <p className="text-[10px] font-mono text-slate-500">{token.value}</p>
    </div>
  );
}

export function TokensPage() {
  const { locale } = useI18n();
  const copy = getTokensCopy(locale);

  return (
    <div className="space-y-16 pb-20">
      <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-black leading-none tracking-tight text-white md:text-7xl">
            {copy.heroTitle} <br />
            <span className="signature-text">{copy.heroAccent}</span>
          </h1>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            {copy.heroEyebrow}
          </p>
        </div>
        <div className="glass-panel max-w-xs rounded-2xl border-white/5 p-6 shadow-glow">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              {copy.systemVersion}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xl font-black text-primary">248</p>
              <p className="text-[10px] text-slate-500">{copy.total}</p>
            </div>
            <div>
              <p className="text-xl font-black text-secondary">64</p>
              <p className="text-[10px] text-slate-500">{copy.color}</p>
            </div>
            <div>
              <p className="text-xl font-black text-white">184</p>
              <p className="text-[10px] text-slate-500">{copy.system}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-black tracking-tight text-white">{copy.colorTokens}</h2>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {copy.colorTokensBadge}
          </span>
        </div>

        <div className="glass-panel mb-4 rounded-2xl p-8 shadow-glow">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {copy.primaryScale}
          </p>
          <div className="grid gap-2 md:grid-cols-4 xl:grid-cols-8">
            {primaryScale.map((token) => (
              <ColorCell key={token.name} token={token} />
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass-panel rounded-2xl p-8">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {copy.surfaceScale}
            </p>
            <div className="space-y-2">
              {surfaceScale.map((token, index) => (
                <div key={token.name} className="flex items-center gap-4">
                  <div
                    className="h-8 w-12 rounded-lg border border-white/10"
                    style={{ background: token.value }}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-mono text-slate-300">{token.name}</p>
                    <p className="text-[10px] font-mono text-slate-500">{token.value}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">{`0${index}0`}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-8">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {copy.semanticColors}
            </p>
            <div className="space-y-3">
              {semanticColors.map((token) => (
                <div key={token.label} className="flex items-center gap-4 rounded-xl bg-white/5 p-3">
                  <div className="h-8 w-8 rounded-lg" style={{ background: token.value }} />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">{token.label}</p>
                    <p className="text-[10px] font-mono text-slate-500">{token.variable}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{token.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-black tracking-tight text-white">{copy.typographyTokens}</h2>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {copy.typographyBadge}
          </span>
        </div>
        <div className="grid gap-4">
          {typographyTokens.map((token) => (
            <div key={token.label} className="glass-panel rounded-2xl p-8">
              <div className="grid gap-4 md:grid-cols-[0.24fr_1fr_0.36fr] md:items-center">
                <div>
                  <p className="text-sm font-bold text-white">{token.label}</p>
                </div>
                <p className={token.className}>{token.sample}</p>
                <p className="text-sm leading-6 text-on-surface-variant">{token.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass-panel rounded-2xl p-8">
          <h3 className="mb-6 text-lg font-black text-white">{copy.spacingTokens}</h3>
          <div className="space-y-4">
            {spacingTokens.map((token) => (
              <div key={token.token} className="flex items-center gap-4 rounded-xl bg-white/5 p-4">
                <div className="w-24">
                  <p className="text-sm font-bold text-white">{token.token}</p>
                  <p className="text-[10px] font-mono text-slate-500">{token.value}</p>
                </div>
                <div className="h-3 rounded-full bg-signature" style={{ width: token.value }} />
                <p className="ml-auto max-w-[180px] text-right text-xs text-on-surface-variant">
                  {token.use}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-8">
          <h3 className="mb-6 text-lg font-black text-white">{copy.radiusShadow}</h3>
          <div className="space-y-4">
            {radiusShadowTokens.map((token) => (
              <div key={token.label} className="rounded-xl bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-bold text-white">{token.label}</p>
                  <span className="text-[10px] font-mono text-slate-400">{token.value}</span>
                </div>
                <p className="mt-2 text-xs leading-6 text-on-surface-variant">{token.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-black tracking-tight text-white">{copy.motionTokens}</h2>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {copy.motionBadge}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {motionTokens.map((token) => (
            <div key={token.label} className="glass-panel rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                {token.label}
              </p>
              <p className="mt-3 text-2xl font-black text-white">{token.value}</p>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{token.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
