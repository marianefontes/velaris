import {
  Check,
  Clipboard,
  Code2,
} from "lucide-react";
import {
  useMemo,
  useRef,
  type ChangeEvent,
  type UIEvent,
} from "react";

export interface ComponentSnippetLabels {
  code: string;
  codeLanguage: string;
  copy: string;
  copied: string;
  snippetEditorLabel: string;
}

const CODE_TOKEN_PATTERN =
  /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Z][A-Za-z0-9_.]*|\b(?:import|from|export|function|return|const|let|true|false|null|undefined)\b|\b[A-Za-z_$][\w$-]*(?=\s*=)|\b\d+(?:\.\d+)?\b|[{}()[\];,.<>/=:+-])/g;

function codeTokenClass(token: string): string {
  if (token.startsWith("//") || token.startsWith("/*")) return "code-token-comment";
  if (token.startsWith("\"") || token.startsWith("'") || token.startsWith("`")) return "code-token-string";
  if (/^<\/?[A-Z]/.test(token)) return "code-token-component";
  if (/^(?:import|from|export|function|return|const|let)$/.test(token)) return "code-token-keyword";
  if (/^(?:true|false|null|undefined|\d)/.test(token)) return "code-token-value";
  if (/^[A-Za-z_$][\w$-]*$/.test(token)) return "code-token-prop";
  return "code-token-punctuation";
}

function highlightCode(code: string) {
  const output = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  CODE_TOKEN_PATTERN.lastIndex = 0;
  while ((match = CODE_TOKEN_PATTERN.exec(code)) !== null) {
    if (match.index > cursor) {
      output.push(code.slice(cursor, match.index));
    }
    output.push(
      <span className={codeTokenClass(match[0])} key={`${match.index}-${match[0]}`}>
        {match[0]}
      </span>,
    );
    cursor = match.index + match[0].length;
  }
  if (cursor < code.length) {
    output.push(code.slice(cursor));
  }
  return output;
}

function HighlightedCodeEditor({
  errorMessage,
  label,
  onChange,
  value,
}: {
  errorMessage?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const highlightRef = useRef<HTMLPreElement>(null);
  const highlightedCode = useMemo(() => highlightCode(value), [value]);

  const syncScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    if (!highlightRef.current) return;
    highlightRef.current.scrollTop = event.currentTarget.scrollTop;
    highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor="component-snippet-editor" className="sr-only">
        {label}
      </label>
      <div className="component-code-editor component-code-editor-wide">
        <pre ref={highlightRef} aria-hidden className="component-code-highlight">
          <code>{highlightedCode}</code>
        </pre>
        <textarea
          id="component-snippet-editor"
          value={value}
          onChange={handleChange}
          onScroll={syncScroll}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? "component-snippet-error" : undefined}
          spellCheck={false}
          wrap="off"
          className="component-code-input"
        />
      </div>
      {errorMessage ? (
        <p
          id="component-snippet-error"
          role="alert"
          className="border-t border-error/15 bg-error/[0.05] px-5 py-3 text-xs leading-5 text-error"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

export function ComponentSnippetSection({
  componentId,
  copied,
  labels,
  snippet,
  snippetErrorMessage,
  onCopySnippet,
  onSnippetChange,
}: {
  componentId: string;
  copied: boolean;
  labels: ComponentSnippetLabels;
  snippet: string;
  snippetErrorMessage?: string;
  onCopySnippet: () => void;
  onSnippetChange: (value: string) => void;
}) {
  return (
    <section
      data-component-snippet={componentId}
      aria-label={labels.code}
      className="component-snippet-section"
    >
      <header className="flex min-h-14 items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-2 sm:px-5">
        <span className="flex min-w-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-300 sm:gap-2 sm:text-[11px] sm:tracking-[0.16em]">
          <Code2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span className="whitespace-nowrap">{labels.code}</span>
          <span className="rounded-md border border-primary/[0.13] bg-primary/[0.04] px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-primary/75">
            {labels.codeLanguage}
          </span>
        </span>
        <button
          type="button"
          onClick={onCopySnippet}
          aria-label={copied ? labels.copied : labels.copy}
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-300 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40 sm:gap-1.5 sm:px-2 sm:text-[10px] sm:tracking-[0.12em]"
        >
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Clipboard className="h-3.5 w-3.5" aria-hidden />}
          <span>{copied ? labels.copied : labels.copy}</span>
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? labels.copied : ""}
        </span>
      </header>

      <HighlightedCodeEditor
        value={snippet}
        label={labels.snippetEditorLabel}
        errorMessage={snippetErrorMessage}
        onChange={onSnippetChange}
      />
    </section>
  );
}
