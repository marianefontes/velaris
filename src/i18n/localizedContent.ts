import type { Locale } from "./translations";

const EUROPEAN_PORTUGUESE_REPLACEMENTS: Array<readonly [RegExp, string]> = [
  [/\busuários\b/gi, "utilizadores"],
  [/\busuário\b/gi, "utilizador"],
  [/\bequipes\b/gi, "equipas"],
  [/\bequipe\b/gi, "equipa"],
  [/\bcontato\b/gi, "contacto"],
  [/\bgerenciar\b/gi, "gerir"],
  [/\bgerenciamento\b/gi, "gestão"],
  [/\bcoleta\b/gi, "recolha"],
  [/\bcoletados\b/gi, "recolhidos"],
  [/\bcoletado\b/gi, "recolhido"],
  [/\bregistro\b/gi, "registo"],
  [/\bregistrada\b/gi, "registada"],
  [/\bregistrado\b/gi, "registado"],
  [/\bdetectar\b/gi, "detetar"],
  [/\bdetectada\b/gi, "detetada"],
  [/\bdetectado\b/gi, "detetado"],
  [/\bperspectivas\b/gi, "perspetivas"],
  [/\bperspectiva\b/gi, "perspetiva"],
  [/\bseções\b/gi, "secções"],
  [/\bseção\b/gi, "secção"],
  [/\bacionáveis\b/gi, "acionáveis"],
  [/\bacionar\b/gi, "ativar"],
  [/\bacionado\b/gi, "ativado"],
  [/\bplaneje\b/gi, "planeie"],
  [/\bplanejamento\b/gi, "planeamento"],
  [/\bvisualização\b/gi, "visualização"],
  [/\bsalvar\b/gi, "guardar"],
  [/\bbaixe\b/gi, "transfira"],
  [/\bbaixar\b/gi, "transferir"],
  [/\barquivo\b/gi, "ficheiro"],
  [/\barquivos\b/gi, "ficheiros"],
  [/\bselecionada\b/gi, "selecionada"],
  [/\bselecionado\b/gi, "selecionado"],
  [/\brevise\b/gi, "reveja"],
  [/\binformado\b/gi, "introduzido"],
  [/\binformada\b/gi, "introduzida"],
  [/\bcarregando\b/gi, "a carregar"],
  [/\bprocessando\b/gi, "a processar"],
  [/\bresponder\b/gi, "responder"],
  [/\bresposta\b/gi, "resposta"],
  [/\bstatus\b/gi, "estado"],
  [/\bleitor de tela\b/gi, "leitor de ecrã"],
  [/\bleitores de tela\b/gi, "leitores de ecrã"],
  [/\bclicável\b/gi, "clicável"],
  [/\bclicáveis\b/gi, "clicáveis"],
  [/\bzoom\b/gi, "ampliação"],
];

export function toEuropeanPortuguese(value: string): string {
  return EUROPEAN_PORTUGUESE_REPLACEMENTS.reduce(
    (normalized, [pattern, replacement]) => normalized.replace(
      pattern,
      (match) => match[0] === match[0].toUpperCase()
        ? `${replacement[0].toUpperCase()}${replacement.slice(1)}`
        : replacement,
    ),
    value,
  );
}

export function localizeContent(
  locale: Locale,
  ptBr: string,
  en: string,
  ptPt?: string,
): string {
  if (locale === "en-US") return en;
  if (locale === "pt-PT") return ptPt ?? toEuropeanPortuguese(ptBr);
  return ptBr;
}
