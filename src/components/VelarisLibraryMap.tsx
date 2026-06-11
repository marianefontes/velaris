import {
  Bell,
  BrainCircuit,
  Compass,
  FormInput,
  LayoutGrid,
  MousePointerClick,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
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
  color: string;
  rgb: string;
  waypoint: { x: number; y: number };
  cardSide: "right" | "left";
}

const W = 1300;
const H = 540;

const TERRITORIES: TerritoryDef[] = [
  {
    id: "actions",
    index: 1,
    icon: MousePointerClick,
    color: "#deccfd",
    rgb: "222,204,253",
    waypoint: { x: 185, y: 400 },
    cardSide: "right",
  },
  {
    id: "forms",
    index: 2,
    icon: FormInput,
    color: "#c2a0fc",
    rgb: "194,160,252",
    waypoint: { x: 390, y: 185 },
    cardSide: "right",
  },
  {
    id: "structure",
    index: 3,
    icon: LayoutGrid,
    color: "#c29fff",
    rgb: "194,159,255",
    waypoint: { x: 650, y: 145 },
    cardSide: "right",
  },
  {
    id: "feedback",
    index: 4,
    icon: Bell,
    color: "#a999c6",
    rgb: "169,153,198",
    waypoint: { x: 1020, y: 310 },
    cardSide: "left",
  },
  {
    id: "intelligence",
    index: 5,
    icon: BrainCircuit,
    color: "#ffa657",
    rgb: "255,166,87",
    waypoint: { x: 760, y: 460 },
    cardSide: "left",
  },
];

const START_PT = { x: 75, y: 490 };
const END_PT = { x: 1195, y: 248 };

const RAIL = [
  `M ${START_PT.x} ${START_PT.y}`,
  `C 115 470, 155 435, 185 400`,
  `C 255 350, 320 220, 390 185`,
  `C 480 153, 570 138, 650 145`,
  `C 780 162, 940 248, 1020 310`,
  `C 975 390, 905 445, 760 460`,
  `C 880 385, 1055 308, 1195 248`,
].join(" ");

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
  const activeItems = catalog.filter((item) => item.section === selectedSectionId);

  return (
    <section className="velaris-library-map" aria-labelledby="vlm-title">

      {/* Header */}
      <header className="velaris-library-map-header">
        <p className="velaris-library-map-eyebrow">{copy.eyebrow}</p>
        <h2 id="vlm-title" className="velaris-library-map-title">
          {copy.title}
        </h2>
        <p className="velaris-library-map-lead">{copy.lead}</p>
        <p className="velaris-library-map-meta">{copy.meta}</p>
      </header>

      {/* Territory navigation tabs */}
      <nav aria-label="Territórios da biblioteca" className="velaris-library-territory-nav">
        {TERRITORIES.map((t) => {
          const s = byId[t.id];
          const count = catalog.filter((c) => c.section === t.id).length;
          const active = selectedSectionId === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectSection(t.id)}
              aria-pressed={active}
              data-domain={t.id}
              className={`${active ? "section-tab-active" : "section-tab"} velaris-library-territory-tab shrink-0`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={1.5} />
              <span className="font-semibold">{s.title}</span>
              <span className="velaris-library-territory-tab-role">
                {String(count).padStart(2, "0")} {copy.componentsLabel}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Map canvas — purely decorative */}
      <div className="velaris-library-journey" aria-hidden="true">
        <div
          className="velaris-library-journey-canvas"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          {/* SVG: rail path + fallback dots */}
          <svg
            className="velaris-library-journey-rail"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="vlm-grad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%"   stopColor="#deccfd" stopOpacity="0.1" />
                <stop offset="16%"  stopColor="#deccfd" stopOpacity="0.85" />
                <stop offset="34%"  stopColor="#c2a0fc" stopOpacity="0.9" />
                <stop offset="52%"  stopColor="#c29fff" stopOpacity="0.85" />
                <stop offset="70%"  stopColor="#a999c6" stopOpacity="0.8" />
                <stop offset="88%"  stopColor="#ffa657" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#ffa657" stopOpacity="0.95" />
              </linearGradient>
              <filter id="vlm-glow" x="-10%" y="-100%" width="120%" height="300%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ambient halo */}
            <path d={RAIL} fill="none" stroke="url(#vlm-grad)" strokeWidth="18"
              strokeLinecap="round" opacity="0.12" style={{ filter: "blur(14px)" }} />
            {/* Core line */}
            <path d={RAIL} fill="none" stroke="url(#vlm-grad)" strokeWidth="1.5"
              strokeLinecap="round" filter="url(#vlm-glow)" />

            {/* Start spark */}
            <circle cx={START_PT.x} cy={START_PT.y} r={3} fill="rgba(222,204,253,0.5)" />
            <circle cx={START_PT.x} cy={START_PT.y} r={7} fill="none"
              stroke="rgba(222,204,253,0.18)" strokeWidth="1" />

            {/* Fallback dots — hidden at ≥960px via CSS when HTML nodes render */}
            {TERRITORIES.map((t) => {
              const isActive = selectedSectionId === t.id;
              return (
                <g key={`dot-${t.id}`} className="vlm-svg-dot">
                  <circle
                    cx={t.waypoint.x} cy={t.waypoint.y}
                    r={isActive ? 13 : 9}
                    fill={`rgba(${t.rgb},0.08)`}
                    stroke={t.color}
                    strokeWidth="0.75"
                    strokeOpacity={isActive ? 0.65 : 0.28}
                  />
                  <circle
                    cx={t.waypoint.x} cy={t.waypoint.y}
                    r={isActive ? 6 : 4.5}
                    fill={t.color}
                    fillOpacity={isActive ? 0.95 : 0.65}
                  />
                </g>
              );
            })}

            {/* Destination dot */}
            <circle cx={END_PT.x} cy={END_PT.y} r={5}  fill="#ffa657" fillOpacity="0.9" />
            <circle cx={END_PT.x} cy={END_PT.y} r={14} fill="none"
              stroke="#ffa657" strokeWidth="0.75" strokeOpacity="0.35" />
          </svg>

          {/* Start label */}
          <div
            className="vlm-start-label"
            style={{
              left: `${(START_PT.x / W) * 100}%`,
              top: `${((START_PT.y + 14) / H) * 100}%`,
            }}
          >
            <Sparkles className="h-2.5 w-2.5" aria-hidden />
            <span>{copy.journeyStart}</span>
          </div>

          {/* Territory station nodes + cards */}
          {TERRITORIES.map((t) => {
            const section = byId[t.id];
            const isActive = selectedSectionId === t.id;
            const items = catalog.filter((c) => c.section === t.id);
            const Icon = t.icon;

            return (
              <button
                key={t.id}
                type="button"
                tabIndex={-1}
                onClick={() => onSelectSection(t.id)}
                aria-label={section.title}
                data-active={String(isActive)}
                data-side={t.cardSide}
                className="vlm-station"
                style={{
                  left: `${(t.waypoint.x / W) * 100}%`,
                  top: `${(t.waypoint.y / H) * 100}%`,
                  "--sc": t.color,
                  "--sr": t.rgb,
                } as React.CSSProperties}
              >
                {/* Node — always rendered, always centered at waypoint */}
                <div className="vlm-node">
                  <span className="vlm-node-halo" aria-hidden />
                  <span className="vlm-node-ring" aria-hidden />
                  <span className="vlm-node-fill">
                    <Icon className="vlm-node-icon" aria-hidden />
                  </span>
                  <span className="vlm-node-num" aria-hidden>
                    {String(t.index).padStart(2, "0")}
                  </span>
                </div>

                {/* Card — absolutely positioned to one side of the node */}
                <div className="vlm-card" aria-hidden>
                  <p className="vlm-card-title">{section.title}</p>
                  <p className="vlm-card-count">
                    {String(items.length).padStart(2, "0")} COMPONENTES
                  </p>
                  <ul className="vlm-card-list">
                    {items.map((item) => (
                      <li key={item.id}>{item.title}</li>
                    ))}
                  </ul>
                </div>
              </button>
            );
          })}

          {/* Destination */}
          <div
            className="velaris-library-destination"
            style={{
              left: `${(END_PT.x / W) * 100}%`,
              top: `${(END_PT.y / H) * 100}%`,
            }}
          >
            <div className="velaris-library-destination-symbol" aria-hidden>
              <span className="velaris-library-destination-ring" />
              <span className="velaris-library-destination-core" />
            </div>
            <p className="velaris-library-destination-eyebrow">{copy.destinationEyebrow}</p>
            <p className="velaris-library-destination-title">{copy.destinationTitle}</p>
            <p className="velaris-library-destination-lead">{copy.destinationLead}</p>
          </div>

          {/* "You are here" badge */}
          <p className="velaris-library-journey-here">
            <span className="velaris-library-map-legend-here-dot" aria-hidden />
            {copy.youAreHere}
          </p>
        </div>
      </div>

      {/* Legend bar */}
      <div className="vlm-legend" role="presentation">
        <div className="vlm-legend-cap">
          <Sparkles className="h-2.5 w-2.5" aria-hidden />
          <span>{copy.journeyStart}</span>
        </div>
        {TERRITORIES.map((t) => {
          const s = byId[t.id];
          const active = selectedSectionId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectSection(t.id)}
              data-active={String(active)}
              className="velaris-library-map-legend-item"
              aria-pressed={active}
            >
              <span
                className="velaris-library-map-legend-swatch"
                style={{ background: t.color }}
              />
              <span>{s.title}</span>
            </button>
          );
        })}
        <div className="vlm-legend-cap vlm-legend-destination">
          <Compass className="h-2.5 w-2.5" aria-hidden />
          <span>{copy.destinationTitle}</span>
        </div>
      </div>

      {/* Active territory component list */}
      <div
        className="velaris-library-territory-panel"
        role="region"
        aria-label={copy.territoryComponents}
      >
        <ul className="velaris-library-territory-panel-list">
          {activeItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectComponent(item.id)}
                aria-current={item.id === selectedId ? "true" : undefined}
                className="velaris-library-territory-panel-item"
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
