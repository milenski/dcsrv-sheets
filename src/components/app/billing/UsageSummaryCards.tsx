import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatTokens, type Plan } from "@/lib/plans";
import { planHasTeam } from "@/lib/plans";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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
  const paidPlan = plan.overagePrice !== null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className={cn("shadow-card", statusClasses(summary.usagePercentage))}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Tokens used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-2xl font-semibold">{formatTokens(summary.tokensUsed)}</p>
              <p className="text-xs text-muted-foreground">Current period</p>
            </div>
            <Badge variant="outline">{Math.round(summary.usagePercentage)}%</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Documents processed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{summary.documents.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Current period</p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Remaining tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatTokens(summary.remainingTokens)}</p>
          <p className="text-xs text-muted-foreground">Until reset</p>
        </CardContent>
      </Card>

      {paidPlan && (
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Overage tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatTokens(summary.overageTokens)}</p>
            <p className="text-xs text-muted-foreground">Informational</p>
          </CardContent>
        </Card>
      )}

      {paidPlan && (
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Estimated overage cost</CardTitle>
              {!canSeeCosts ? (
                <Badge variant="secondary" className="text-xs">
                  Owner only
                </Badge>
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <p className={cn("text-2xl font-semibold", !canSeeCosts && "text-muted-foreground")}>
                {canSeeCosts ? `€${summary.overageCost.toFixed(2)}` : "Hidden"}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex" aria-label="About overage estimates">
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">
                      This is an estimate based on included tokens and your plan’s overage pricing.
                      {role !== "owner" ? " Only Owners can view billing costs." : ""}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground">Informational</p>
          </CardContent>
        </Card>
      )}

      {teamEnabled && (
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{summary.activeUsers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Current period</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
