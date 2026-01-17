import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatTokens } from "@/lib/plans";

interface UsageBlockedBannerProps {
  usedTokens: number;
  includedTokens: number;
  resetDate: string;
  className?: string;
}

export function UsageBlockedBanner({
  usedTokens,
  includedTokens,
  resetDate,
  className,
}: UsageBlockedBannerProps) {
  return (
    <Card className={cn("border-destructive/50 bg-destructive/5", className)}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium text-destructive">
                You've reached your monthly limit
              </p>
              <p className="text-sm text-muted-foreground">
                {formatTokens(usedTokens)} / {formatTokens(includedTokens)} tokens
                used. Resets {resetDate}.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/app/billing">
              Upgrade plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface UsageBlockedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usedTokens: number;
  includedTokens: number;
  resetDate: string;
}

export function UsageBlockedModal({
  open,
  onOpenChange,
  usedTokens,
  includedTokens,
  resetDate,
}: UsageBlockedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">
            You've reached your monthly limit
          </DialogTitle>
          <DialogDescription className="text-center">
            You've used {formatTokens(usedTokens)} of your{" "}
            {formatTokens(includedTokens)} included tokens this month. Upgrade
            your plan to continue extracting documents.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current usage</span>
              <span className="font-medium text-destructive">
                {formatTokens(usedTokens)} / {formatTokens(includedTokens)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Resets on</span>
              <span className="font-medium">{resetDate}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
          <Button asChild>
            <Link to="/app/billing">
              Upgrade plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
