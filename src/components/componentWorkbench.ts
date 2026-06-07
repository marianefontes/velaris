export type ComponentId =
  | "button"
  | "toggle-switch"
  | "checkbox"
  | "radio-button"
  | "selectable-chip"
  | "text-input"
  | "text-area"
  | "select-dropdown"
  | "date-picker"
  | "form-field"
  | "link"
  | "tabs"
  | "card"
  | "modal-dialog"
  | "data-table"
  | "alert"
  | "toast"
  | "skeleton-loader"
  | "explanation-tooltip"
  | "confidence-badge"
  | "command-palette"
  | "source-attribution"
  | "audit-panel"
  | "typography"
  | "icon";

export type ButtonIntent = "primary" | "secondary" | "positive" | "negative";
export type ButtonState = "default" | "hover" | "focus" | "loading" | "disabled";

export interface ComponentPlaygroundConfig {
  state: string;
  intent: string;
  label?: string;
}

export type SnippetParseResult =
  | { ok: true; config: ComponentPlaygroundConfig }
  | { ok: false; error: "invalid-syntax" | "unsupported-props" };

const normalize = (value: string) =>
  value
    .replace(/\r\n/g, "\n")
    .trim()
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n");

const key = (value: string) => value.trim().toLowerCase();

const previewState = (state: string, snippet: string) =>
  key(state) === "default" || key(state) === "closed"
    ? snippet
    : `/* Workbench preview: ${state} */\n${snippet}`;

const stateProp = (state: string, expected: string, prop: string) =>
  key(state) === key(expected) ? ` ${prop}` : "";

const intentLabel = (intent: string, labels: Record<string, string>, fallback: string) =>
  labels[key(intent)] ?? fallback;

export function createInitialPlaygroundConfig(
  id: ComponentId,
  states: readonly string[],
  intents: readonly string[],
): ComponentPlaygroundConfig {
  return {
    state: states[0] ?? "Default",
    intent: intents[0] ?? "Default",
    label: id === "button" ? "Gerar análise" : undefined,
  };
}

function generateButtonSnippet(config: ComponentPlaygroundConfig) {
  const intent = key(config.intent) as ButtonIntent;
  const state = key(config.state) as ButtonState;
  const label = config.label?.trim() || "Gerar análise";
  const props = [`intent="${intent}"`];

  if (state === "focus") props.push("autoFocus");
  if (state === "loading") props.push("loading={true}");
  if (state === "disabled") props.push("disabled");

  return `<Button ${props.join(" ")}>\n  ${label}\n</Button>`;
}

function generateGenericSnippet(id: ComponentId, config: ComponentPlaygroundConfig) {
  const state = key(config.state);
  const intent = key(config.intent);

  switch (id) {
    case "toggle-switch": {
      const label = intentLabel(
        intent,
        {
          preference: "Reduzir animações",
          visibility: "Mostrar detalhes",
          mode: "Modo de edição",
        },
        "Ativar opção",
      );
      const checked = state === "on";
      return previewState(
        config.state,
        `<Switch checked={${checked}}${stateProp(state, "focus", "autoFocus")}${stateProp(state, "disabled", "disabled")}>\n  ${label}\n</Switch>`,
      );
    }
    case "checkbox": {
      const label = intentLabel(
        intent,
        {
          selection: "Incluir na análise",
          consent: "Concordo com o uso das fontes",
          bulk: "Selecionar todos os resultados",
        },
        "Selecionar opção",
      );
      return previewState(
        config.state,
        `<Checkbox${stateProp(state, "checked", "checked")}${stateProp(state, "indeterminate", "indeterminate")}${stateProp(state, "focus", "autoFocus")}${stateProp(state, "disabled", "disabled")}>\n  ${label}\n</Checkbox>`,
      );
    }
    case "radio-button": {
      const value = intent === "plan" ? "plan" : intent === "preference" ? "preference" : "choice";
      return previewState(
        config.state,
        `<RadioGroup value="${state === "checked" ? value : ""}"${stateProp(state, "disabled", "disabled")}${stateProp(state, "error", 'error="Selecione uma opção"')}>\n  <Radio value="${value}">${intentLabel(intent, { "single choice": "Resposta única", plan: "Plano recomendado", preference: "Preferência" }, "Selecionar")}</Radio>\n</RadioGroup>`,
      );
    }
    case "selectable-chip": {
      const label = intentLabel(
        intent,
        { filter: "Jurídico", tag: "Documentação", attribute: "Alta confiança" },
        "Filtro",
      );
      return previewState(
        config.state,
        `<SelectableChip${stateProp(state, "selected", "selected")}${stateProp(state, "focus", "autoFocus")}${stateProp(state, "disabled", "disabled")}>\n  ${label}\n</SelectableChip>`,
      );
    }
    case "text-input": {
      const type = intent === "search" ? "search" : intent === "email" ? "email" : "text";
      const label = intentLabel(
        intent,
        { search: "Buscar fontes", email: "E-mail", text: "Título da análise" },
        "Campo de texto",
      );
      return previewState(
        config.state,
        `<TextInput label="${label}" type="${type}"${stateProp(state, "filled", 'value="Aetheris"')}${stateProp(state, "focus", "autoFocus")}${stateProp(state, "error", 'error="Revise o valor informado"')}${stateProp(state, "disabled", "disabled")} />`,
      );
    }
    case "text-area": {
      const label = intentLabel(
        intent,
        { prompt: "Prompt da Beatrice", comment: "Comentário", description: "Contexto da análise" },
        "Texto longo",
      );
      return previewState(
        config.state,
        `<TextArea label="${label}"${stateProp(state, "filled", 'value="Considere as fontes citadas e destaque conflitos."')}${stateProp(state, "focus", "autoFocus")}${stateProp(state, "error", 'error="Adicione mais contexto"')}${stateProp(state, "disabled", "disabled")} />`,
      );
    }
    case "select-dropdown": {
      const label = intentLabel(
        intent,
        { "single choice": "Modelo", filter: "Filtrar por status", configuration: "Configuração" },
        "Selecionar",
      );
      return previewState(
        config.state,
        `<Select label="${label}"${stateProp(state, "open", "open")}${stateProp(state, "selected", 'value="recommended"')}${stateProp(state, "focus", "autoFocus")}${stateProp(state, "disabled", "disabled")}>\n  <SelectOption value="recommended">Recomendado</SelectOption>\n</Select>`,
      );
    }
    case "date-picker": {
      const label = intentLabel(
        intent,
        { "single date": "Data da revisão", range: "Período da auditoria", deadline: "Prazo" },
        "Selecionar data",
      );
      return previewState(
        config.state,
        `<DatePicker label="${label}"${stateProp(state, "open", "open")}${stateProp(state, "selected", 'value="2026-06-06"')}${stateProp(state, "invalid", 'error="Selecione uma data válida"')}${stateProp(state, "disabled", "disabled")} />`,
      );
    }
    case "form-field": {
      const label = intentLabel(
        intent,
        { validation: "E-mail", guidance: "Nome da análise", "data entry": "Dado de entrada" },
        "Campo",
      );
      return previewState(
        config.state,
        `<FormField label="${label}"${stateProp(state, "required", "required")}${stateProp(state, "valid", 'success="Valor validado"')}${stateProp(state, "error", 'error="Campo obrigatório"')}${stateProp(state, "disabled", "disabled")}>\n  <Input />\n</FormField>`,
      );
    }
    case "link": {
      const label = intentLabel(
        intent,
        { navigation: "Abrir documentação", external: "Consultar fonte original", download: "Baixar relatório" },
        "Abrir link",
      );
      const href = intent === "download" ? "/relatorio.pdf" : intent === "external" ? "https://example.com" : "/docs";
      return previewState(
        config.state,
        `<Link href="${href}"${intent === "external" ? ' target="_blank" rel="noreferrer"' : ""}${intent === "download" ? " download" : ""}${stateProp(state, "focus", "autoFocus")}${stateProp(state, "disabled", 'aria-disabled="true"')}>\n  ${label}\n</Link>`,
      );
    }
    case "tabs": {
      const value = intent === "section" ? "overview" : intent === "view" ? "preview" : "mode";
      return previewState(
        config.state,
        `<Tabs value="${state === "active" || state === "focus" ? value : ""}"${stateProp(state, "disabled", "disabled")}>\n  <Tab value="${value}">${intentLabel(intent, { section: "Visão geral", view: "Preview", mode: "Modo" }, "Conteúdo")}</Tab>\n</Tabs>`,
      );
    }
    case "card": {
      const title = intentLabel(
        intent,
        { entity: "Confidence Badge", summary: "Resumo da análise", choice: "Fonte recomendada" },
        "Conteúdo",
      );
      return previewState(
        config.state,
        `<Card${stateProp(state, "selected", "selected")}${stateProp(state, "loading", "loading")}${stateProp(state, "disabled", "disabled")}>\n  <CardTitle>${title}</CardTitle>\n  <CardDescription>Conteúdo contextual do Aetheris.</CardDescription>\n</Card>`,
      );
    }
    case "modal-dialog": {
      const title = intentLabel(
        intent,
        { confirm: "Confirmar análise", edit: "Editar parâmetros", "critical decision": "Remover fonte" },
        "Confirmar ação",
      );
      return previewState(
        config.state,
        `<Dialog open={${state !== "closed"}}${stateProp(state, "submitting", "submitting")}${stateProp(state, "error", 'error="Não foi possível concluir"')}>\n  <DialogTitle>${title}</DialogTitle>\n  <DialogAction${stateProp(state, "disabled", "disabled")}>Confirmar</DialogAction>\n</Dialog>`,
      );
    }
    case "data-table": {
      const label = intentLabel(
        intent,
        { compare: "Comparar fontes", inspect: "Inspecionar fontes", manage: "Gerenciar fontes" },
        "Resultados",
      );
      return previewState(
        config.state,
        `<DataTable aria-label="${label}"${stateProp(state, "loading", "loading")}${stateProp(state, "sorted", 'sort="confidence:desc"')}${stateProp(state, "row selected", 'selectedRows={["source-1"]}')}${stateProp(state, "empty", "rows={[]}")} />`,
      );
    }
    case "alert": {
      const severity =
        state === "success" ? "success" : state === "warning" ? "warning" : state === "error" ? "error" : "info";
      const title = intentLabel(
        intent,
        { inform: "Atualização do sistema", warn: "Revise os campos", block: "Ação bloqueada" },
        "Informação",
      );
      return previewState(
        config.state,
        `<Alert severity="${severity}"${stateProp(state, "dismissed", "open={false}")}>\n  <AlertTitle>${title}</AlertTitle>\n  A operação foi registrada com rastreabilidade.\n</Alert>`,
      );
    }
    case "toast": {
      const semanticIntent = intent === "success" ? "success" : intent === "undo" ? "warning" : "info";
      return previewState(
        config.state,
        `<Toast intent="${semanticIntent}"${stateProp(state, "entering", 'motionState="entering"')}${stateProp(state, "visible", "open")}${stateProp(state, "actionable", 'action="Desfazer"')}${stateProp(state, "leaving", 'motionState="leaving"')}${stateProp(state, "paused", "paused")}>\n  ${intentLabel(intent, { success: "Análise concluída", info: "Sincronização iniciada", undo: "Item removido" }, "Notificação")}\n</Toast>`,
      );
    }
    case "skeleton-loader": {
      const variant = intent === "content" ? "text" : intent === "table" ? "table" : "card";
      return previewState(
        config.state,
        `<Skeleton variant="${variant}"${stateProp(state, "loading", "animated")}${stateProp(state, "reduced motion", "reduceMotion")}${stateProp(state, "loaded", "hidden")}${stateProp(state, "error", 'error="Falha ao carregar"')} />`,
      );
    }
    case "explanation-tooltip": {
      const content = intentLabel(
        intent,
        { explanation: "Como a resposta foi construída", definition: "Definição do termo", help: "Ajuda contextual" },
        "Explicação",
      );
      return previewState(
        config.state,
        `<ExplanationTooltip content="${content}"${stateProp(state, "hover", "open")}${stateProp(state, "focus", "open")}${stateProp(state, "open", "open")}${stateProp(state, "dismissed", "open={false}")}>\n  <IconButton aria-label="Mostrar explicação" />\n</ExplanationTooltip>`,
      );
    }
    case "confidence-badge": {
      const value = state === "low" ? 34 : state === "medium" ? 67 : state === "high" ? 94 : 82;
      const purpose = intent === "warn" ? "warning" : intent === "support trust" ? "trust" : "calibration";
      return previewState(
        config.state,
        `<ConfidenceBadge value={${value}} purpose="${purpose}"${stateProp(state, "unavailable", "unavailable")} />`,
      );
    }
    case "command-palette": {
      const mode = intent === "navigate" ? "navigation" : intent === "execute" ? "action" : "search";
      return previewState(
        config.state,
        `<CommandPalette open={${state !== "closed"}} mode="${mode}"${stateProp(state, "searching", 'query="auditar fontes"')}${stateProp(state, "results", 'query="fonte"')}${stateProp(state, "empty", 'query="sem resultados"')}${stateProp(state, "executing", "executing")} />`,
      );
    }
    case "source-attribution": {
      const purpose = intent === "verify" ? "verification" : intent === "inspect" ? "inspection" : "traceability";
      const score = state === "unavailable" ? 0 : state === "partial match" ? 0.54 : state === "high match" ? 0.96 : 0.87;
      return previewState(
        config.state,
        `<SourceAttribution title="Documentação Aetheris" purpose="${purpose}"${stateProp(state, "expanded", "expanded")}${stateProp(state, "unavailable", "unavailable")} score={${score}} />`,
      );
    }
    case "audit-panel": {
      const scope = intent === "govern" ? "governance" : intent === "debug" ? "debug" : "audit";
      const status = state === "running" ? "running" : state === "complete" ? "complete" : state === "conflict" ? "conflict" : "idle";
      return previewState(
        config.state,
        `<AuditPanel scope="${scope}" status="${status}"${stateProp(state, "expanded", "expanded")} />`,
      );
    }
    case "typography": {
      const token = state === "display" ? "display-xl" : state === "heading" ? "heading-md" : state === "caption" ? "caption" : state === "code" ? "code-sm" : "body-md";
      const as = intent === "hierarchy" ? "h2" : intent === "metadata" ? "span" : "p";
      return previewState(
        config.state,
        `<Typography as="${as}" token="${token}">\n  ${intentLabel(intent, { hierarchy: "Inteligência verificável", reading: "Uma resposta apoiada por evidências.", metadata: "CONFIDENCE SCORE" }, "Texto Aetheris")}\n</Typography>`,
      );
    }
    case "icon": {
      const name = intent === "action" ? "sparkles" : intent === "status" ? "check-circle" : "info";
      return previewState(
        config.state,
        `<Icon name="${name}"${stateProp(state, "labeled", 'aria-label="Informação"')}${stateProp(state, "interactive", 'role="button" tabIndex={0}')}${stateProp(state, "active", 'data-active="true"')}${stateProp(state, "disabled", 'aria-disabled="true"')} />`,
      );
    }
    default:
      return "";
  }
}

export function generateComponentSnippet(id: ComponentId, config: ComponentPlaygroundConfig) {
  if (id === "button") return generateButtonSnippet(config);
  return `/* Workbench intent: ${config.intent} */\n${generateGenericSnippet(id, config)}`;
}

function parseButtonSnippet(draft: string): SnippetParseResult {
  const source = normalize(draft);
  const match = source.match(/^<Button\b([^>]*)>\s*([\s\S]*?)\s*<\/Button>$/);

  if (!match) return { ok: false, error: "invalid-syntax" };

  const attrs = match[1].trim();
  const label = match[2].trim();
  const intentMatch = attrs.match(/\bintent="(primary|secondary|positive|negative)"/);
  if (!intentMatch || !label || /<[^>]+>/.test(label)) {
    return { ok: false, error: "invalid-syntax" };
  }

  const remainder = attrs
    .replace(intentMatch[0], "")
    .replace(/\bloading=\{true\}/g, "")
    .replace(/\bdisabled(?:=\{true\})?/g, "")
    .replace(/\bautoFocus(?:=\{true\})?/g, "")
    .trim();

  if (remainder) return { ok: false, error: "unsupported-props" };

  const disabled = /\bdisabled(?:=\{true\})?/.test(attrs);
  const loading = /\bloading=\{true\}/.test(attrs);
  const autoFocus = /\bautoFocus(?:=\{true\})?/.test(attrs);
  const state: ButtonState = disabled ? "disabled" : loading ? "loading" : autoFocus ? "focus" : "default";

  return {
    ok: true,
    config: {
      intent: intentMatch[1][0].toUpperCase() + intentMatch[1].slice(1),
      state: state[0].toUpperCase() + state.slice(1),
      label,
    },
  };
}

export function parseComponentSnippet(
  id: ComponentId,
  draft: string,
  states: readonly string[],
  intents: readonly string[],
): SnippetParseResult {
  if (id === "button") return parseButtonSnippet(draft);

  const source = normalize(draft);
  if (!source) return { ok: false, error: "invalid-syntax" };

  for (const state of states) {
    for (const intent of intents) {
      const config = { state, intent };
      if (normalize(generateComponentSnippet(id, config)) === source) {
        return { ok: true, config };
      }
    }
  }

  return { ok: false, error: "unsupported-props" };
}
