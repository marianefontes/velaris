import {
  Bell,
  BrainCircuit,
  FormInput,
  LayoutGrid,
  MousePointerClick,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import type { ComponentDoc, SectionId } from "./componentPresentation";

export interface VelarisLibraryMapCopy {
  eyebrow: string;
  title: string;
  lead: string;
  meta: string;
  componentsLabel: string;
  journeyStart: string;
  youAreHere: string;
  destinationEyebrow: string;
  destinationTitle: string;
  destinationLead: string;
  territoryComponents: string;
}

interface SectionMeta {
  id: SectionId;
  title: string;
  description: string;
}

interface TerritoryDef {
  id: SectionId;
  index: number;
  icon: LucideIcon;
  /** Accent hex — used for icon/text fills. */
  color: string;
  /** Accent as "r,g,b" — used for rgba() backgrounds, borders and glows. */
  rgb: string;
}

const TERRITORIES: TerritoryDef[] = [
  { id: "actions", index: 1, icon: MousePointerClick, color: "#deccfd", rgb: "222,204,253" },
  { id: "forms", index: 2, icon: FormInput, color: "#c2a0fc", rgb: "194,160,252" },
  { id: "structure", index: 3, icon: LayoutGrid, color: "#c29fff", rgb: "194,159,255" },
  { id: "feedback", index: 4, icon: Bell, color: "#a999c6", rgb: "169,153,198" },
  { id: "intelligence", index: 5, icon: BrainCircuit, color: "#ffa657", rgb: "255,166,87" },
];

type StepState = "done" | "active" | "upcoming";

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function VelarisLibraryMap({
  catalog,
  copy,
  sections,
  selectedId,
  selectedSectionId,
  onSelectComponent,
  onSelectSection,
}: {
  catalog: ComponentDoc[];
  copy: VelarisLibraryMapCopy;
  sections: SectionMeta[];
  selectedId: string;
  selectedSectionId: SectionId;
  onSelectComponent: (id: ComponentDoc["id"]) => void;
  onSelectSection: (id: SectionId) => void;
}) {
  const byId = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<SectionId, SectionMeta>;
  const countOf = (id: SectionId) => catalog.filter((c) => c.section === id).length;

  const activeIndex = Math.max(
    0,
    TERRITORIES.findIndex((t) => t.id === selectedSectionId),
  );
  const activeTerritory = TERRITORIES[activeIndex] ?? TERRITORIES[0]!;
  const activeSection = byId[activeTerritory.id];
  const activeItems = catalog.filter((item) => item.section === activeTerritory.id);
  const ActiveIcon = activeTerritory.icon;
  const destinationReached = activeIndex === TERRITORIES.length - 1;

  const stepState = (index: number): StepState =>
    index < activeIndex ? "done" : index === activeIndex ? "active" : "upcoming";

  return (
    <section className="velaris-library-map vlm-shell" aria-labelledby="vlm-title">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="vlm-head">
        <p className="vlm-head-eyebrow">{copy.eyebrow}</p>
        <div className="vlm-head-row">
          <h2 id="vlm-title" className="vlm-head-title">
            {copy.title}
          </h2>
          <span className="vlm-head-meta">{copy.meta}</span>
        </div>
        <p className="vlm-head-lead">{copy.lead}</p>
      </header>

      {/* ── Progress rail (desktop) — single source of navigation ──────── */}
      <nav className="vlm-rail" aria-label={copy.title}>
        <ol className="vlm-rail-track">
          {TERRITORIES.map((t, i) => {
            const section = byId[t.id];
            const state = stepState(i);
            const Icon = t.icon;
            return (
              <li
                key={t.id}
                className="vlm-rail-step"
                data-state={state}
                style={{ "--sc": t.color, "--sr": t.rgb } as CSSProperties}
              >
                <span className="vlm-rail-connector" aria-hidden />
                <button
                  type="button"
                  onClick={() => onSelectSection(t.id)}
                  aria-pressed={state === "active"}
                  className="vlm-rail-btn"
                >
                  <span className="vlm-rail-node">
                    <Icon className="vlm-rail-node-icon" aria-hidden strokeWidth={1.5} />
                    <span className="vlm-rail-node-num" aria-hidden>
                      {pad2(t.index)}
                    </span>
                  </span>
                  <span className="vlm-rail-name">{section.title}</span>
                  <span className="vlm-rail-count">
                    {pad2(countOf(t.id))} {copy.componentsLabel}
                  </span>
                </button>
              </li>
            );
          })}

          {/* Destination terminus — the journey's payoff, in-flow (never clipped) */}
          <li className="vlm-rail-terminus" data-reached={String(destinationReached)} aria-hidden>
            <span className="vlm-rail-node vlm-rail-node--dest">
              <span className="vlm-rail-dest-mark" />
            </span>
            <span className="vlm-rail-name vlm-rail-dest-eyebrow">{copy.destinationEyebrow}</span>
            <span className="vlm-rail-count vlm-rail-dest-title">{copy.destinationTitle}</span>
          </li>
        </ol>
      </nav>

      {/* ── Territory strip (tablet / mobile) — contained scroll, no overflow ── */}
      <div className="vlm-strip" role="tablist" aria-label={copy.title}>
        {TERRITORIES.map((t) => {
          const section = byId[t.id];
          const active = t.id === selectedSectionId;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelectSection(t.id)}
              className="vlm-strip-chip"
              data-active={String(active)}
              style={{ "--sc": t.color, "--sr": t.rgb } as CSSProperties}
            >
              <span className="vlm-strip-chip-num">{pad2(t.index)}</span>
              <span className="vlm-strip-chip-body">
                <span className="vlm-strip-chip-name">
                  <Icon className="vlm-strip-chip-icon" aria-hidden strokeWidth={1.5} />
                  {section.title}
                </span>
                <span className="vlm-strip-chip-count">
                  {pad2(countOf(t.id))} {copy.componentsLabel}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Active territory detail — the only place components are listed ── */}
      <div
        className="vlm-detail"
        role="region"
        aria-label={copy.territoryComponents}
        style={{ "--sc": activeTerritory.color, "--sr": activeTerritory.rgb } as CSSProperties}
      >
        <div className="vlm-detail-head">
          <span className="vlm-detail-icon">
            <ActiveIcon className="h-5 w-5" aria-hidden strokeWidth={1.5} />
          </span>
          <div className="vlm-detail-heading">
            <h3 className="vlm-detail-name">{activeSection.title}</h3>
            <p className="vlm-detail-desc">{activeSection.description}</p>
          </div>
          <span className="vlm-detail-here">
            <span className="vlm-detail-here-dot" aria-hidden />
            {copy.youAreHere}
          </span>
        </div>

        <div className="vlm-detail-bar">
          <span className="vlm-detail-bar-count">
            {pad2(activeItems.length)} {copy.componentsLabel}
          </span>
          <span className="vlm-detail-bar-step" aria-hidden>
            {pad2(activeIndex + 1)} / {pad2(TERRITORIES.length)}
          </span>
        </div>

        <ul className="vlm-detail-list">
          {activeItems.map((item) => {
            const current = item.id === selectedId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelectComponent(item.id)}
                  aria-current={current ? "true" : undefined}
                  className="vlm-detail-item"
                >
                  <span className="vlm-detail-item-dot" aria-hidden />
                  {item.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
