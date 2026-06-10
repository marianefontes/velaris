import { memo, useMemo } from "react";
import type { ReactNode } from "react";

// Inline span formatting: **bold**, `code`, and [text](url) links.
// Split keeps the delimiters so each captured group can be re-typed below.
function inlineFormat(raw: string): ReactNode[] {
  const parts = raw.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-bold text-on-surface">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-primary">
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      const external = /^https?:\/\//.test(href);
      return (
        <a
          key={index}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-secondary underline decoration-secondary/40 underline-offset-2 transition-colors hover:text-secondary-dim"
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

// Pure line-based parser. Extracted from the component so it can run inside a
// useMemo keyed on `text` : during streaming the active message re-renders on
// every flushed frame, and re-parsing the whole (growing) string each time was
// the O(n²) hotspot. Memoization + React.memo below collapse that cost.
function parseMarkdown(text: string): ReactNode[] {
  const elements: ReactNode[] = [];
  const lines = text.split("\n");
  let listItems: string[] = [];
  let orderedItems: string[] = [];
  let tableRows: string[][] = [];
  let codeBuffer: string[] = [];
  let inCode = false;

  function flushList(key: string) {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={`ul-${key}`} className="mb-3 flex flex-col gap-1 pl-4">
        {listItems.map((item, index) => (
          <li key={index} className="flex gap-2 text-sm leading-6 text-on-surface">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
            <span>{inlineFormat(item)}</span>
          </li>
        ))}
      </ul>,
    );
    listItems = [];
  }

  function flushOrdered(key: string) {
    if (orderedItems.length === 0) return;
    elements.push(
      <ol key={`ol-${key}`} className="mb-3 flex flex-col gap-1 pl-4">
        {orderedItems.map((item, index) => (
          <li key={index} className="flex gap-2 text-sm leading-6 text-on-surface">
            <span className="mt-0.5 shrink-0 font-bold text-primary">{index + 1}.</span>
            <span>{inlineFormat(item)}</span>
          </li>
        ))}
      </ol>,
    );
    orderedItems = [];
  }

  function flushTable(key: string) {
    if (tableRows.length === 0) return;
    const [header, ...body] = tableRows;
    elements.push(
      <div key={`tbl-${key}`} className="mb-3 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {header.map((cell, index) => (
                <th key={index} className="px-3 py-2 text-left font-bold text-on-surface/80">
                  {inlineFormat(cell.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2 text-on-surface">
                    {inlineFormat(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    tableRows = [];
  }

  function flushBlocks(key: string) {
    flushList(key);
    flushOrdered(key);
  }

  lines.forEach((line, index) => {
    const trimmed = line.trimStart();

    // Fenced code block: buffer raw lines until the closing fence.
    if (trimmed.startsWith("```")) {
      if (!inCode) {
        flushBlocks(String(index));
        if (tableRows.length > 0) flushTable(String(index));
        inCode = true;
        codeBuffer = [];
      } else {
        elements.push(
          <pre
            key={`code-${index}`}
            className="mb-3 overflow-x-auto rounded-xl border border-white/10 bg-surface-container-lowest p-3 font-mono text-[11px] leading-5 text-on-surface"
          >
            {codeBuffer.join("\n")}
          </pre>,
        );
        inCode = false;
        codeBuffer = [];
      }
      return;
    }
    if (inCode) {
      codeBuffer.push(line);
      return;
    }

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushBlocks(String(index));
      const cells = trimmed.slice(1, -1).split("|");
      if (cells.every((cell) => /^[\s\-:]+$/.test(cell))) return;
      tableRows.push(cells);
      return;
    }

    if (tableRows.length > 0) flushTable(String(index));

    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      flushOrdered(String(index));
      listItems.push(trimmed.slice(2));
      return;
    }

    const ordered = /^(\d+)\.\s+(.*)$/.exec(trimmed);
    if (ordered) {
      flushList(String(index));
      orderedItems.push(ordered[2]);
      return;
    }

    flushBlocks(String(index));
    if (trimmed === "") {
      if (index > 0) elements.push(<div key={`br-${index}`} className="h-2" />);
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <p key={index} className="mb-1 text-[11px] font-bold uppercase tracking-widest text-primary">
          {trimmed.slice(4)}
        </p>,
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(<p key={index} className="mb-2 text-base font-semibold text-on-surface">{trimmed.slice(3)}</p>);
    } else {
      elements.push(<p key={index} className="text-[15px] leading-7 text-on-surface">{inlineFormat(trimmed)}</p>);
    }
  });

  flushBlocks("end");
  flushTable("end");
  // Unterminated fence (common mid-stream): a closed block always resets
  // codeBuffer to [], so a non-empty buffer here means the fence never closed :
  // render what streamed so far.
  if (codeBuffer.length > 0) {
    elements.push(
      <pre
        key="code-end"
        className="mb-3 overflow-x-auto rounded-xl border border-white/10 bg-surface-container-lowest p-3 font-mono text-[11px] leading-5 text-on-surface"
      >
        {codeBuffer.join("\n")}
      </pre>,
    );
  }
  return elements;
}

function MarkdownRendererComponent({ text }: { text: string }) {
  const elements = useMemo(() => parseMarkdown(text), [text]);
  return <div className="flex flex-col gap-0.5">{elements}</div>;
}

// React.memo: the only prop is `text`, so the default shallow compare re-parses
// only when the string actually changes. Combined with the rAF-batched streaming
// append (useChatStream), this bounds parse work to one pass per painted frame.
export const MarkdownRenderer = memo(MarkdownRendererComponent);
