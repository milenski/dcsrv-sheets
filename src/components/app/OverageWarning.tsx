import { TrendingUp, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatTokens, TOKEN_DISCLAIMER } from "@/lib/plans";

interface OverageWarningProps {
  usedTokens: number;
  includedTokens: number;
  overageTokens: number;
  overageCost: number;
  overagePrice: number;
  className?: string;
}

export function OverageWarning({
  usedTokens,
  includedTokens,
  overageTokens,
  overageCost,
  overagePrice,
  className,
}: OverageWarningProps) {
  if (overageTokens === 0) return null;

  return (
    <Card className={cn("border-amber-500/30 bg-amber-500/5", className)}>
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-amber-700">
              You've exceeded your included monthly tokens
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Additional usage will be charged automatically at €{overagePrice.toFixed(2)} per 50,000 tokens.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-amber-500/20">
              <div>
                <p className="text-xs text-muted-foreground">Included</p>
                <p className="text-sm font-medium">{formatTokens(includedTokens)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Used</p>
                <p className="text-sm font-medium">{formatTokens(usedTokens)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overage</p>
                <p className="text-sm font-medium text-amber-600">
                  {formatTokens(overageTokens)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  Est. cost
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-xs">{TOKEN_DISCLAIMER}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </p>
                <p className="text-sm font-medium text-amber-600">
                  €{overageCost.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface OverageNoticeProps {
  overagePrice: number;
  className?: string;
}

export function OverageNotice({ overagePrice, className }: OverageNoticeProps) {
  return (
    <div className={cn("rounded-lg border border-amber-500/30 bg-amber-500/5 p-3", className)}>
      <div className="flex items-center gap-2 text-amber-600">
        <TrendingUp className="w-4 h-4" />
        <p className="text-sm">
          This extraction may exceed your included tokens. Additional usage will be charged at €{overagePrice.toFixed(2)} per 50,000 tokens.
        </p>
      </div>
    </div>
  );
}
