import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatAxisDate(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function DocumentsProcessedOverTimeChart({
  data,
  compact = false,
}: {
  data: { date: string; documents: number }[];
  compact?: boolean;
}) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Documents processed</CardTitle>
          <div className="text-xs text-muted-foreground">Daily</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={compact ? "h-[220px]" : "h-[320px]"}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 8, right: 12, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="docsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={formatAxisDate}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                minTickGap={18}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={42}
                allowDecimals={false}
              />
              <RechartsTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const val = Number(payload[0]?.value ?? 0);
                  return (
                    <div className="rounded-md border bg-popover text-popover-foreground shadow-md px-3 py-2">
                      <div className="text-xs text-muted-foreground">{formatAxisDate(label)}</div>
                      <div className="text-sm font-medium">{val.toLocaleString()} documents</div>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="documents"
                stroke="hsl(var(--foreground))"
                fill="url(#docsFill)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
