import type { Locale } from "../../../i18n/translations";
import type { TradeOff } from "../../types/beatrice";
import { INTENT_TRADEOFFS } from "./models";

const INTENT_LABELS: Record<string, Record<Locale, string>> = {
  component_guidance: { "pt-BR": "Componente", "pt-PT": "Componente", "en-US": "Component" },
  pattern_guidance: { "pt-BR": "Padrão", "pt-PT": "Padrão", "en-US": "Pattern" },
  token_lookup: { "pt-BR": "Token", "pt-PT": "Token", "en-US": "Token" },
  design_decision: { "pt-BR": "Decisão", "pt-PT": "Decisão", "en-US": "Decision" },
  when_not_to_use: { "pt-BR": "Restrição", "pt-PT": "Restrição", "en-US": "Restriction" },
  xai_explanation: { "pt-BR": "XAI", "pt-PT": "XAI", "en-US": "XAI" },
  general: { "pt-BR": "Geral", "pt-PT": "Geral", "en-US": "General" },
};

export function intentLabel(intent: string, locale: Locale): string {
  return INTENT_LABELS[intent]?.[locale] ?? intent;
}

export function intentColor(intent: string): string {
  const colors: Record<string, string> = {
    component_guidance: "border-primary/20 bg-primary/10 text-primary",
    pattern_guidance: "border-blue-400/20 bg-blue-400/10 text-blue-400",
    token_lookup: "border-violet-400/20 bg-violet-400/10 text-violet-400",
    design_decision: "border-amber-400/20 bg-amber-400/10 text-amber-400",
    when_not_to_use: "border-red-400/20 bg-red-400/10 text-red-400",
    xai_explanation: "border-green-400/20 bg-green-400/10 text-green-400",
  };
  return colors[intent] ?? "border-slate-400/20 bg-slate-400/10 text-slate-400";
}

export function getIntentTradeOffs(intent: string): TradeOff {
  return INTENT_TRADEOFFS[intent] ?? INTENT_TRADEOFFS.general;
}
