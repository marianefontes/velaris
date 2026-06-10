import {
  Bell,
  BrainCircuit,
  FormInput,
  LayoutGrid,
  MousePointerClick,
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

interface TerritoryConfig {
  id: SectionId;
  index: number;
  icon: LucideIcon;
  waypoint: { x: number; y: number };
}

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 520;

const TERRITORY_CONFIG: TerritoryConfig[] = [
  { id: "actions", index: 1, icon: MousePointerClick, waypoint: { x: 210, y: 380 } },
  { id: "forms", index: 2, icon: FormInput, waypoint: { x: 390, y: 210 } },
  { id: "structure", index: 3, icon: LayoutGrid, waypoint: { x: 600, y: 165 } },
  { id: "feedback", index: 4, icon: Bell, waypoint: { x: 830, y: 290 } },
  { id: "intelligence", index: 5, icon: BrainCircuit, waypoint: { x: 665, y: 420 } },
];

const JOURNEY_START = { x: 72, y: 420 };
const JOURNEY_END = { x: 1065, y: 220 };

const JOURNEY_RAIL = [
  `M ${JOURNEY_START.x} ${JOURNEY_START.y}`,
  "C 120 408, 165 392, 210 380",
  "C 275 340, 330 250, 390 210",
  "C 470 175, 535 155, 600 165",
  "C 700 195, 780 250, 830 290",
  "C 780 360, 720 400, 665 420",
  "C 780 330, 920 260, 1065 220",
].join(" ");

function TerritoryNav({
  catalog,
  componentsLabel,
  onSelectSection,
  sections,
  selectedSectionId,
}: {
  catalog: ComponentDoc[];
  componentsLabel: string;
  onSelectSection: (id: SectionId) => void;
  sections: SectionMeta[];
  selectedSectionId: SectionId;
}) {
  const sectionById = Object.fromEntries(sections.map((section) => [section.id, section])) as Record<
    SectionId,
    SectionMeta
  >;

  return (
    <nav
      aria-label="Territórios da biblioteca"
      className="velaris-library-territory-nav"
    >
      {TERRITORY_CONFIG.map((territory) => {
        const section = sectionById[territory.id];
        const count = catalog.filter((item) => item.section === territory.id).length;
        const active = selectedSectionId === territory.id;
        const Icon = territory.icon;

        return (
          <button
            key={territory.id}
            type="button"
            onClick={() => onSelectSection(territory.id)}
            aria-pressed={active}
            data-domain={territory.id}
            className={`${active ? "section-tab-active" : "section-tab"} velaris-library-territory-tab shrink-0 xl:min-w-0`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={1.5} />
            <span className="font-semibold">{section.title}</span>
            <span className="velaris-library-territory-tab-role">
              {String(count).padStart(2, "0")} {componentsLabel}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function ActiveTerritoryComponents({
  catalog,
  componentId,
  onSelectComponent,
  selectedSectionId,
  territoryComponentsLabel,
}: {
  catalog: ComponentDoc[];
  componentId: string;
  onSelectComponent: (id: ComponentDoc["id"]) => void;
  selectedSectionId: SectionId;
  territoryComponentsLabel: string;
}) {
  const items = catalog.filter((item) => item.section === selectedSectionId);

  return (
    <div
      className="velaris-library-territory-panel"
      role="region"
      aria-label={territoryComponentsLabel}
    >
      <ul className="velaris-library-territory-panel-list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelectComponent(item.id)}
              aria-current={item.id === componentId ? "true" : undefined}
              className="velaris-library-territory-panel-item"
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
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
  const waypoints = [JOURNEY_START, ...TERRITORY_CONFIG.map((t) => t.waypoint), JOURNEY_END];
  const activeWaypoint = TERRITORY_CONFIG.find((t) => t.id === selectedSectionId)?.waypoint;

  return (
    <section className="velaris-library-map" aria-labelledby="velaris-library-map-title">
      <header className="velaris-library-map-header">
        <p className="velaris-library-map-eyebrow">{copy.eyebrow}</p>
        <h2 id="velaris-library-map-title" className="velaris-library-map-title">
          {copy.title}
        </h2>
        <p className="velaris-library-map-lead">{copy.lead}</p>
        <p className="velaris-library-map-meta">{copy.meta}</p>
      </header>

      <TerritoryNav
        catalog={catalog}
        componentsLabel={copy.componentsLabel}
        sections={sections}
        selectedSectionId={selectedSectionId}
        onSelectSection={onSelectSection}
      />

      <div className="velaris-library-journey" aria-hidden={false} aria-label={copy.title}>
        <div
          className="velaris-library-journey-canvas"
          style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}
        >
          <svg
            className="velaris-library-journey-rail"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <defs>
              <linearGradient id="velaris-rail-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="var(--velaris-color-primary)" stopOpacity="0.25" />
                <stop offset="22%" stopColor="var(--velaris-color-primary)" stopOpacity="0.55" />
                <stop offset="45%" stopColor="var(--velaris-color-secondary)" stopOpacity="0.6" />
                <stop offset="68%" stopColor="var(--velaris-color-tertiary)" stopOpacity="0.55" />
                <stop offset="85%" stopColor="var(--velaris-color-primary-container)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--velaris-color-warning)" stopOpacity="0.7" />
              </linearGradient>
              <filter id="velaris-rail-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d={JOURNEY_RAIL}
              className="velaris-library-rail-glow"
              fill="none"
              stroke="url(#velaris-rail-gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.22"
            />
            <path
              d={JOURNEY_RAIL}
              className="velaris-library-rail-core"
              fill="none"
              stroke="url(#velaris-rail-gradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              filter="url(#velaris-rail-glow)"
            />

            {waypoints.map((point, index) => {
              const isStart = index === 0;
              const isEnd = index === waypoints.length - 1;
              const isActiveStop = activeWaypoint
                && point.x === activeWaypoint.x
                && point.y === activeWaypoint.y;

              return (
                <g key={`wp-${index}`}>
                  {!isEnd ? (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isActiveStop ? 9 : isStart ? 5 : 7}
                      className={isActiveStop ? "velaris-library-rail-halo-active" : "velaris-library-rail-halo"}
                    />
                  ) : null}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isStart ? 3 : isEnd ? 4 : isActiveStop ? 5 : 4.5}
                    className={
                      isEnd
                        ? "velaris-library-rail-destination"
                        : isActiveStop
                          ? "velaris-library-rail-node-active"
                          : "velaris-library-rail-node"
                    }
                  />
                </g>
              );
            })}
          </svg>

          <p
            className="velaris-library-journey-origin"
            style={{
              left: `${(JOURNEY_START.x / MAP_WIDTH) * 100}%`,
              top: `${(JOURNEY_START.y / MAP_HEIGHT) * 100}%`,
            }}
          >
            {copy.journeyStart}
          </p>

          <div
            className="velaris-library-destination"
            style={{
              left: `${(JOURNEY_END.x / MAP_WIDTH) * 100}%`,
              top: `${(JOURNEY_END.y / MAP_HEIGHT) * 100}%`,
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

          <p className="velaris-library-journey-here">
            <span className="velaris-library-map-legend-here-dot" aria-hidden />
            {copy.youAreHere}
          </p>
        </div>
      </div>

      <ActiveTerritoryComponents
        catalog={catalog}
        componentId={selectedId}
        selectedSectionId={selectedSectionId}
        territoryComponentsLabel={copy.territoryComponents}
        onSelectComponent={onSelectComponent}
      />
    </section>
  );
}
