// AskBeatriceBar is the internal home entry point to Abraxos. Focusing the field
// makes the ambient field converge (stars gather around the input, and a
// near-subliminal serpent silhouette passes behind the interface); submitting
// hands the question to the /oracle composer via session prefill.

import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { writeAskPrefill } from "../../beatrice/storage/beatriceStorage";
import { emitPresence } from "./presenceBus";
import { StardustEngine } from "./stardustEngine";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const VISIBLE_SUGGESTIONS = 3;

export function AskBeatriceBar({
  label,
  placeholder,
  submitLabel,
  suggestions,
  refreshLabel,
}: {
  label: string;
  placeholder: string;
  submitLabel: string;
  suggestions: string[];
  refreshLabel: string;
}) {
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState("");
  const [offset, setOffset] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<StardustEngine | null>(null);

  const visible = Array.from(
    { length: Math.min(VISIBLE_SUGGESTIONS, suggestions.length) },
    (_, i) => suggestions[(offset + i) % suggestions.length],
  );

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    writeAskPrefill(trimmed);
    navigate("/oracle");
  };

  const handleFocus = () => {
    if (reduced) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (!engineRef.current && canvasRef.current) {
      engineRef.current = new StardustEngine(canvasRef.current, { ambient: false });
      engineRef.current.start();
    }
    const bounds = wrap.getBoundingClientRect();
    const canvasBounds = canvasRef.current?.getBoundingClientRect();
    if (canvasBounds) {
      engineRef.current?.convergeBurst(
        bounds.left + bounds.width / 2 - canvasBounds.left,
        bounds.top + bounds.height / 2 - canvasBounds.top,
        Math.min(bounds.width / 2, 220),
        16,
      );
    }
    emitPresence("converge", {
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    });
    emitPresence("silhouette", undefined);
  };

  return (
    <div className="relative">
      {/* Local convergence field, bleeding past the bar so stars gather from outside */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -inset-y-12 z-0 h-[calc(100%+6rem)] w-[calc(100%+5rem)]"
      />

      <form
        role="search"
        className="relative z-10"
        onSubmit={(event) => {
          event.preventDefault();
          ask(value);
        }}
      >
        <label htmlFor="velaris-ask-input" className="sr-only">
          {label}
        </label>
        <div
          ref={wrapRef}
          data-abraxos-focus="home-ask"
          className="flex items-center gap-3 rounded-[20px] border border-white/[0.1] bg-surface-container-high/60 py-2 pl-5 pr-2 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 focus-within:border-primary/40 focus-within:shadow-[0_0_40px_rgba(194,160,252,0.12)]"
        >
          <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-primary/80" />
          <input
            id="velaris-ask-input"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={handleFocus}
            placeholder={placeholder}
            autoComplete="off"
            className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            aria-label={submitLabel}
            disabled={!value.trim()}
            className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-signature text-on-primary transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
        {visible.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => ask(question)}
            className="focus-ring rounded-full border border-white/[0.09] bg-white/[0.03] px-3.5 py-2 text-xs text-slate-300 transition-colors hover:border-primary/30 hover:text-white"
          >
            {question}
          </button>
        ))}
        {suggestions.length > VISIBLE_SUGGESTIONS ? (
          <button
            type="button"
            onClick={() => setOffset((current) => (current + VISIBLE_SUGGESTIONS) % suggestions.length)}
            aria-label={refreshLabel}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.03] text-slate-400 transition-colors hover:border-primary/30 hover:text-white"
          >
            <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
