import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatTokens, type Plan } from "@/lib/plans";
import { planHasTeam } from "@/lib/plans";

type Summary = {
  tokensUsed: number;
  documents: number;
  remainingTokens: number;
  overageTokens: number;
  overageCost: number;
  activeUsers: number;
  usagePercentage: number;
};

function statusClasses(usagePercentage: number) {
  // Keep subtle; align with existing amber/orange/destructive cues used elsewhere.
  if (usagePercentage >= 100) return "border-destructive/30";
  if (usagePercentage >= 95) return "border-orange-500/30";
  if (usagePercentage >= 80) return "border-amber-500/30";
  return "border-muted";
}

export function UsageSummaryCards({
  plan,
  role,
  summary,
  canSeeCosts,
}: {
  plan: Plan;
  role: "owner" | "admin" | "member";
  summary: Summary;
  canSeeCosts: boolean;
}) {
  const teamEnabled = planHasTeam(plan);

  return (
    <div
      className={cn(
        "grid gap-3",
        teamEnabled ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-3",
      )}
    >
      <Card className={cn("shadow-card", statusClasses(summary.usagePercentage))}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Tokens used</p>
              <p className="text-lg font-semibold leading-tight">{formatTokens(summary.tokensUsed)}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {Math.round(summary.usagePercentage)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Documents</p>
          <p className="text-lg font-semibold leading-tight">{summary.documents.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Remaining tokens</p>
          <p className="text-lg font-semibold leading-tight">{formatTokens(summary.remainingTokens)}</p>
        </CardContent>
      </Card>

      {teamEnabled ? (
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Active users</p>
            <p className="text-lg font-semibold leading-tight">{summary.activeUsers.toLocaleString()}</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
