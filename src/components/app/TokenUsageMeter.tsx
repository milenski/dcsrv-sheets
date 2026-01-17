import { Link } from "react-router-dom";
import { AlertTriangle, TrendingUp, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatTokens, TOKEN_DISCLAIMER, UsageStatus } from "@/lib/plans";

interface TokenUsageMeterProps {
  usedTokens: number;
  includedTokens: number;
  remainingTokens: number;
  overageTokens: number;
  overageCost: number;
  usagePercentage: number;
  usageStatus: UsageStatus;
  planName: string;
  isHardLimit: boolean;
  resetDate: string;
  showUpgrade?: boolean;
  showBreakdown?: boolean;
  compact?: boolean;
  className?: string;
}

export function TokenUsageMeter({
  usedTokens,
  includedTokens,
  remainingTokens,
  overageTokens,
  overageCost,
  usagePercentage,
  usageStatus,
  planName,
  isHardLimit,
  resetDate,
  showUpgrade = true,
  showBreakdown = false,
  compact = false,
  className,
}: TokenUsageMeterProps) {
  const statusStyles = {
    normal: {
      progressBar: "",
      text: "text-muted-foreground",
      badge: "bg-muted text-muted-foreground",
    },
    warning: {
      progressBar: "[&>div]:bg-amber-500",
      text: "text-amber-600",
      badge: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    },
    critical: {
      progressBar: "[&>div]:bg-orange-500",
      text: "text-orange-600",
      badge: "bg-orange-500/10 text-orange-600 border-orange-500/30",
    },
    exceeded: {
      progressBar: "[&>div]:bg-destructive",
      text: "text-destructive",
      badge: "bg-destructive/10 text-destructive border-destructive/30",
    },
  };

  const styles = statusStyles[usageStatus];

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("flex items-center gap-2", className)}>
              {usageStatus !== "normal" && (
                <AlertTriangle className={cn("w-4 h-4", styles.text)} />
              )}
              <div className="flex items-center gap-1.5">
                <span className={cn("text-sm font-medium", styles.text)}>
                  {formatTokens(usedTokens)}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {formatTokens(includedTokens)}
                </span>
              </div>
              <Progress
                value={Math.min(usagePercentage, 100)}
                className={cn("h-2 w-16", styles.progressBar)}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-sm">
              {formatTokens(usedTokens)} of {formatTokens(includedTokens)} tokens used
              {remainingTokens > 0 && ` (${formatTokens(remainingTokens)} remaining)`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Resets {resetDate}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tokens used</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{TOKEN_DISCLAIMER}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("font-medium", styles.text)}>
            {formatTokens(usedTokens)} / {formatTokens(includedTokens)}
          </span>
          <Badge variant="outline" className={cn("text-xs", styles.badge)}>
            {Math.round(usagePercentage)}%
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <Progress
        value={Math.min(usagePercentage, 100)}
        className={cn("h-2.5", styles.progressBar)}
      />

      {/* Status messages */}
      {usageStatus === "warning" && (
        <div className="flex items-center gap-2 text-amber-600">
          <AlertTriangle className="w-4 h-4" />
          <p className="text-sm">You're approaching your monthly limit</p>
        </div>
      )}

      {usageStatus === "critical" && (
        <div className="flex items-center gap-2 text-orange-600">
          <AlertTriangle className="w-4 h-4" />
          <p className="text-sm">Almost out of tokens</p>
        </div>
      )}

      {usageStatus === "exceeded" && isHardLimit && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-4 h-4" />
          <p className="text-sm">Limit reached. Upgrade to continue.</p>
        </div>
      )}

      {usageStatus === "exceeded" && !isHardLimit && overageTokens > 0 && (
        <div className="flex items-start gap-2 text-amber-600">
          <TrendingUp className="w-4 h-4 mt-0.5" />
          <div className="text-sm">
            <p>
              You've exceeded your included monthly tokens. Additional usage will
              be charged automatically.
            </p>
            <p className="font-medium mt-1">
              Overage: {formatTokens(overageTokens)} tokens → €{overageCost.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Breakdown (optional) */}
      {showBreakdown && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t text-sm">
          <div>
            <p className="text-muted-foreground">Included</p>
            <p className="font-medium">{formatTokens(includedTokens)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Used</p>
            <p className="font-medium">{formatTokens(usedTokens)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Remaining</p>
            <p className={cn("font-medium", remainingTokens === 0 && "text-destructive")}>
              {formatTokens(remainingTokens)}
            </p>
          </div>
          {overageTokens > 0 && (
            <div>
              <p className="text-muted-foreground">Overage</p>
              <p className="font-medium text-amber-600">
                {formatTokens(overageTokens)} → €{overageCost.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-muted-foreground">
          Resets {resetDate}
        </p>
        {showUpgrade && (
          <Button variant="link" size="sm" asChild className="h-auto p-0 text-primary">
            <Link to="/app/billing">
              {usageStatus === "exceeded" ? "Upgrade plan" : "Manage plan"}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
