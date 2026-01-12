import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UsageMeterProps {
  used: number;
  limit: number;
  label?: string;
  className?: string;
}

export function UsageMeter({ used, limit, label = "Pages", className }: UsageMeterProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label} used</span>
        <span className={cn(
          "font-medium",
          isAtLimit && "text-destructive",
          isNearLimit && !isAtLimit && "text-amber-600"
        )}>
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={cn(
          "h-2",
          isAtLimit && "[&>div]:bg-destructive",
          isNearLimit && !isAtLimit && "[&>div]:bg-amber-500"
        )} 
      />
      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-amber-600">Approaching limit</p>
      )}
      {isAtLimit && (
        <p className="text-xs text-destructive">Limit reached. Upgrade to continue.</p>
      )}
    </div>
  );
}
