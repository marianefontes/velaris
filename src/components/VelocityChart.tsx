import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "../i18n/I18nProvider";
import type { VelocityPoint } from "../types/dashboard";

interface VelocityChartProps {
  data: VelocityPoint[];
}

export function VelocityChart({ data }: VelocityChartProps) {
  const { locale } = useI18n();
  const copy =
    locale === "en-US"
      ? {
          eyebrow: "Oracle evolution",
          title: "Indexed sources vs grounded answers",
          indexed: "Indexed sources",
          grounded: "Grounded answers",
          projected: "Projected coverage",
        }
      : locale === "pt-PT"
        ? {
            eyebrow: "Evolução do oráculo",
            title: "Fontes indexadas vs respostas fundamentadas",
            indexed: "Fontes indexadas",
            grounded: "Respostas fundamentadas",
            projected: "Cobertura projetada",
          }
        : {
            eyebrow: "Evolução do oráculo",
            title: "Fontes indexadas vs respostas fundamentadas",
            indexed: "Fontes indexadas",
            grounded: "Respostas fundamentadas",
            projected: "Cobertura projetada",
          };
  return (
    <div className="glass-panel rounded-[32px] p-6">
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant">
          {copy.eyebrow}
        </p>
        <h4 className="mt-2 text-xl font-bold text-white">{copy.title}</h4>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="velocityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#deccfd" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#deccfd" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="sprint" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(25,25,28,0.96)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
              }}
            />
            <Legend />
            <Area
              dataKey="committed"
              stroke="#deccfd"
              fill="url(#velocityFill)"
              strokeWidth={2}
              name={copy.indexed}
            />
            <Line
              dataKey="delivered"
              stroke="#c2a0fc"
              strokeWidth={3}
              dot={{ r: 4, fill: "#c2a0fc" }}
              name={copy.grounded}
              type="monotone"
            />
            <Line
              dataKey="predicted"
              stroke="#ffcf70"
              strokeDasharray="6 6"
              strokeWidth={2}
              dot={false}
              name={copy.projected}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
