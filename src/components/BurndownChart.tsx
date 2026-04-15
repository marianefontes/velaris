import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useI18n } from "../i18n/I18nProvider";
import type { BurndownPoint } from "../types/dashboard";

interface BurndownChartProps {
  data: BurndownPoint[];
}

export function BurndownChart({ data }: BurndownChartProps) {
  const { locale } = useI18n();
  const copy =
    locale === "en-US"
      ? {
          eyebrow: "Cognitive effort",
          title: "Ideal clarity vs observed friction by stage",
          ideal: "Ideal clarity",
          observed: "Observed friction",
        }
      : locale === "pt-PT"
        ? {
            eyebrow: "Esforço cognitivo",
            title: "Clareza ideal vs atrito observado por etapa",
            ideal: "Clareza ideal",
            observed: "Atrito observado",
          }
        : {
            eyebrow: "Esforço cognitivo",
            title: "Clareza ideal vs atrito observado por etapa",
            ideal: "Clareza ideal",
            observed: "Atrito observado",
          };
  return (
    <div className="glass-panel rounded-[32px] p-6">
      <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant">
        {copy.eyebrow}
      </p>
      <h4 className="mt-2 text-xl font-bold text-white">{copy.title}</h4>
      <div className="mt-5 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(25,25,28,0.96)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ideal"
              stroke="#deccfd"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              name={copy.ideal}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#ff6e84"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ff6e84" }}
              name={copy.observed}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
