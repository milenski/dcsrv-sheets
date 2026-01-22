import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatTokens, type Plan } from "@/lib/plans";

function formatAxisDate(dateKey: string) {
  // YYYY-MM-DD -> Mon D
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TokenUsageOverTimeChart({
  data,
  plan,
  totalPeriodTokens,
  role,
}: {
  data: { date: string; tokens: number }[];
  plan: Plan;
  totalPeriodTokens: number;
  role: "owner" | "admin" | "member";
}) {
  const limit = plan.tokens;
  const isHardLimit = plan.isHardLimit;
  const overLimit = totalPeriodTokens > limit;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Token usage over time</CardTitle>
          <div className="text-xs text-muted-foreground">
            Limit: <span className="font-medium text-foreground">{formatTokens(limit)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 8, right: 12, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="tokensFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
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
                tickFormatter={(v) => formatTokens(Number(v))}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={58}
              />
              <RechartsTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const val = Number(payload[0]?.value ?? 0);
                  return (
                    <div className="rounded-md border bg-popover text-popover-foreground shadow-md px-3 py-2">
                      <div className="text-xs text-muted-foreground">{formatAxisDate(label)}</div>
                      <div className="text-sm font-medium">{formatTokens(val)} tokens</div>
                      {role === "member" ? (
                        <div className="text-[11px] text-muted-foreground mt-1">Read-only</div>
                      ) : null}
                    </div>
                  );
                }}
              />
              <ReferenceLine
                y={limit}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
                label={{ value: "Limit", position: "right", fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="tokens"
                stroke="hsl(var(--primary))"
                fill="url(#tokensFill)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {overLimit && isHardLimit ? (
          <div className={cn("mt-3 text-sm", "text-destructive")}>
            Limit reached on the Free plan. Usage stops at the limit—upgrade to continue.
          </div>
        ) : null}

        {overLimit && !isHardLimit ? (
          <div className="mt-3 text-sm text-muted-foreground">
            You’re over the included limit. Additional usage is tracked as overage.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
