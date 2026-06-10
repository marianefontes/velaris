import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export interface CognitiveRadarDatum {
  axis: string;
  primary: number;
  comparison: number;
}

export function CognitiveRadarChart({
  data,
  primaryLabel,
  primaryAccent,
  comparisonLabel,
  showComparison,
}: {
  data: CognitiveRadarDatum[];
  primaryLabel: string;
  primaryAccent: string;
  comparisonLabel: string;
  showComparison: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} outerRadius="78%">
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
        />
        <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 1]} />
        {showComparison ? (
          <Radar
            name={comparisonLabel}
            dataKey="comparison"
            stroke="rgba(255,255,255,0.45)"
            fill="rgba(255,255,255,0.06)"
            fillOpacity={1}
            strokeWidth={1.5}
            isAnimationActive={false}
          />
        ) : null}
        <Radar
          name={primaryLabel}
          dataKey="primary"
          stroke={primaryAccent}
          fill={primaryAccent}
          fillOpacity={0.22}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
