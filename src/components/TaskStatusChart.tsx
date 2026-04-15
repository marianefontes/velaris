import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useI18n } from "../i18n/I18nProvider";
import type { TaskStatusDatum } from "../types/dashboard";

interface TaskStatusChartProps {
  data: TaskStatusDatum[];
}

export function TaskStatusChart({ data }: TaskStatusChartProps) {
  const { locale } = useI18n();
  const copy =
    locale === "en-US"
      ? {
          eyebrow: "Consultation intents",
          title: "Distribution of consumer questions",
        }
      : locale === "pt-PT"
        ? {
            eyebrow: "Intenções de consulta",
            title: "Distribuição das dúvidas dos consumidores",
          }
        : {
            eyebrow: "Intenções de consulta",
            title: "Distribuição das dúvidas dos consumidores",
          };
  return (
    <div className="glass-panel rounded-[32px] p-6">
      <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant">
        {copy.eyebrow}
      </p>
      <h4 className="mt-2 text-xl font-bold text-white">{copy.title}</h4>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={92}
                dataKey="value"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(25,25,28,0.96)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.name} className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-white">{item.name}</span>
                </div>
                <span className="text-lg font-black text-white">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
