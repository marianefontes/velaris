// DragonHero frames Abraxos and the Velaris library navigation path on the home hero.
// Path connects chips. Abraxos is a separate recognizable dragon entity.

import { AbraxosInteractive } from "./AbraxosInteractive";
import { KnowledgeNavigationPath } from "./KnowledgeNavigationPath";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export interface DragonHeroChip {
  icon: React.ElementType;
  label: string;
  value: string;
}

export interface DragonHeroOracleCopy {
  quote: string;
  label: string;
}

export function DragonHero({
  chips,
  oracle,
}: {
  chips: DragonHeroChip[];
  oracle?: DragonHeroOracleCopy;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative h-full min-h-[420px] w-full select-none sm:min-h-[520px]">
      <KnowledgeNavigationPath className="pointer-events-none absolute bottom-0 left-0 top-0 z-[2] h-full w-16 opacity-90 sm:w-20" />

      <div className="absolute inset-0 z-[5]">
        <AbraxosInteractive />
      </div>

      <ul className="pointer-events-none absolute inset-y-6 left-0 z-20 hidden flex-col justify-between md:flex">
        {chips.map(({ icon: Icon, label, value }, index) => (
          <li
            key={label}
            className="presence-chip-float glass-card flex w-fit items-center gap-3 rounded-full py-2 pl-2.5 pr-5"
            style={{
              marginLeft: `${[0, 14, 4, 24][index % 4]}px`,
              animationDelay: `${index * 1.4}s`,
            }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/[0.07]">
              <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
            </span>
            <span>
              <span className="block text-sm font-semibold leading-5 text-white">{label}</span>
              <span className="block text-[11px] leading-4 text-slate-400">{value}</span>
            </span>
          </li>
        ))}
      </ul>

      {oracle ? (
        <figure className="pointer-events-none absolute bottom-0 left-0 z-20 hidden max-w-[17rem] md:block">
          <blockquote className="border-l border-primary/25 pl-4">
            <p className="text-[13px] leading-6 text-slate-300 [text-wrap:balance]">
              &ldquo;{oracle.quote}&rdquo;
            </p>
          </blockquote>
          <figcaption className="mt-3 pl-4 text-[10px] font-bold uppercase tracking-[0.24em] text-primary/70">
            {oracle.label}
          </figcaption>
        </figure>
      ) : null}

      {reduced ? (
        <span className="sr-only">Abraxos, oráculo integrado ao Velaris</span>
      ) : null}
    </div>
  );
}
