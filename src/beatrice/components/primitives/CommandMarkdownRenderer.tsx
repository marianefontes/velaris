import type { ReactNode } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

function BeforeBlock({ code }: { code: string }) {
  return (
    <div className="my-2 overflow-hidden rounded-xl border border-red-500/20 bg-red-950/25">
      <p className="border-b border-red-500/15 px-3 py-1.5 text-[9px] font-bold text-red-400">BEFORE</p>
      <pre className="overflow-x-auto p-3 text-[11px] leading-5 text-slate-300">{code}</pre>
    </div>
  );
}

export function CommandMarkdownRenderer({ text }: { text: string }) {
  const parts = text.split(/(```(?:tsx?|jsx?|)\n[\s\S]*?```)/g);
  const nodes: ReactNode[] = [];
  let pendingBeforeCode: string | null = null;
  let pendingBeforeIndex = 0;

  parts.forEach((part, index) => {
    if (!part.startsWith("```")) {
      if (pendingBeforeCode !== null) {
        nodes.push(<BeforeBlock key={`lone-before-${pendingBeforeIndex}`} code={pendingBeforeCode} />);
        pendingBeforeCode = null;
      }
      if (part.trim()) nodes.push(<MarkdownRenderer key={`text-${index}`} text={part} />);
      return;
    }

    const code = part.replace(/^```(?:tsx?|jsx?|)\n?/, "").replace(/\n?```$/, "");
    const context = (parts[index - 1] ?? "").slice(-120).toLowerCase();
    const isBefore = /before|antes|original|legado|legacy/.test(context);
    const isAfter = /after|depois|corrigido|modern|novo/.test(context);

    if (isBefore) {
      if (pendingBeforeCode !== null) nodes.push(<BeforeBlock key={`lone-before-${index}`} code={pendingBeforeCode} />);
      pendingBeforeCode = code;
      pendingBeforeIndex = index;
      return;
    }

    if (isAfter && pendingBeforeCode !== null) {
      const before = pendingBeforeCode;
      pendingBeforeCode = null;
      nodes.push(
        <div key={`diff-${index}`} className="my-3 grid grid-cols-2 gap-2">
          <BeforeBlock code={before} />
          <div className="my-2 overflow-hidden rounded-xl border border-green-500/20 bg-green-950/25">
            <p className="border-b border-green-500/15 px-3 py-1.5 text-[9px] font-bold text-green-400">AFTER</p>
            <pre className="overflow-x-auto p-3 text-[11px] leading-5 text-slate-300">{code}</pre>
          </div>
        </div>,
      );
      return;
    }

    if (pendingBeforeCode !== null) {
      nodes.push(<BeforeBlock key={`lone-before-flush-${index}`} code={pendingBeforeCode} />);
      pendingBeforeCode = null;
    }
    nodes.push(
      <div key={`code-${index}`} className="my-2 overflow-hidden rounded-xl border border-white/8 bg-white/4">
        <pre className="overflow-x-auto p-3 text-[11px] leading-5 text-slate-300">{code}</pre>
      </div>,
    );
  });

  if (pendingBeforeCode !== null) nodes.push(<BeforeBlock key="lone-before-final" code={pendingBeforeCode} />);
  return <div className="flex flex-col gap-0.5">{nodes}</div>;
}

