import type { ReactNode } from "react";

function inlineFormat(raw: string): ReactNode[] {
  const parts = raw.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-primary">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function MarkdownRenderer({ text }: { text: string }) {
  const elements: ReactNode[] = [];
  const lines = text.split("\n");
  let listItems: string[] = [];
  let tableRows: string[][] = [];

  function flushList(key: string) {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={`ul-${key}`} className="mb-3 flex flex-col gap-1 pl-4">
        {listItems.map((item, index) => (
          <li key={index} className="flex gap-2 text-xs leading-6 text-slate-300">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
            <span>{inlineFormat(item)}</span>
          </li>
        ))}
      </ul>,
    );
    listItems = [];
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
                <th key={index} className="px-3 py-2 text-left font-bold text-white/80">
                  {inlineFormat(cell.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/5 last:border-0 hover:bg-white/3">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2 text-slate-300">
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

  lines.forEach((line, index) => {
    const trimmed = line.trimStart();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList(String(index));
      const cells = trimmed.slice(1, -1).split("|");
      if (cells.every((cell) => /^[\s\-:]+$/.test(cell))) return;
      tableRows.push(cells);
      return;
    }

    if (tableRows.length > 0) flushTable(String(index));
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      listItems.push(trimmed.slice(2));
      return;
    }

    flushList(String(index));
    if (trimmed === "") {
      if (index > 0) elements.push(<div key={`br-${index}`} className="h-2" />);
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <p key={index} className="mb-1 text-[11px] font-bold uppercase tracking-widest text-primary">
          {trimmed.slice(4)}
        </p>,
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(<p key={index} className="mb-2 text-sm font-black text-white">{trimmed.slice(3)}</p>);
    } else {
      elements.push(<p key={index} className="text-sm leading-7 text-slate-300">{inlineFormat(trimmed)}</p>);
    }
  });

  flushList("end");
  flushTable("end");
  return <div className="flex flex-col gap-0.5">{elements}</div>;
}

