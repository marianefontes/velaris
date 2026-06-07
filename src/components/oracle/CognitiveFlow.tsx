import type { CognitiveFlowStep } from "../../types/oracle";

// ||| The cognitive pipeline as an ordered stepper. A vertical rail keeps the
// sequence legible on every viewport and reads as a reasoning trace, not a
// decorative diagram — each node is a stage the answer actually passes through.

export function CognitiveFlow({ steps }: { steps: CognitiveFlowStep[] }) {
  return (
    <ol className="relative ml-3 border-l border-white/[0.08]">
      {steps.map((step, index) => (
        <li key={step.label} className="relative mb-5 pl-7 last:mb-0">
          <span
            className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 bg-surface-container text-[10px] font-bold text-primary shadow-cognitive-sm"
            aria-hidden
          >
            {index + 1}
          </span>
          <p className="text-sm font-semibold text-white">{step.label}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}
