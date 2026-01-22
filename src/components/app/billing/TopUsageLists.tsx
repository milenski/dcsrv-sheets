import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatTokens, type Plan } from "@/lib/plans";
import { planHasTeam } from "@/lib/plans";
import type { UsageEvent } from "@/lib/usageAnalyticsMock";

function topBy<T extends string>(
  rows: UsageEvent[],
  keyFn: (e: UsageEvent) => T | undefined,
  limit: number,
) {
  const map = new Map<T, number>();
  for (const e of rows) {
    const k = keyFn(e);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + e.tokens);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, tokens]) => ({ label, tokens }));
}

export function TopUsageLists({
  events,
  plan,
}: {
  events: UsageEvent[];
  plan: Plan;
}) {
  const teamEnabled = planHasTeam(plan);
  const topTemplates = topBy(events, (e) => e.template, 5);
  const topUsers = teamEnabled ? topBy(events, (e) => e.user, 5) : [];

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Top usage</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Top templates</p>
            <p className="text-xs text-muted-foreground">Tokens</p>
          </div>
          <Separator className="my-2" />
          <div className="space-y-2">
            {topTemplates.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3">
                <p className="text-sm text-foreground truncate">{row.label}</p>
                <Badge variant="secondary" className="shrink-0 font-medium">
                  {formatTokens(row.tokens)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {teamEnabled ? (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Top users</p>
              <p className="text-xs text-muted-foreground">Tokens</p>
            </div>
            <Separator className="my-2" />
            <div className="space-y-2">
              {topUsers.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <p className="text-sm text-foreground truncate">{row.label}</p>
                  <Badge variant="secondary" className="shrink-0 font-medium">
                    {formatTokens(row.tokens)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
