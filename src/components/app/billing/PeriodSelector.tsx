import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BillingPeriod } from "@/lib/usageAnalyticsMock";

export function PeriodSelector({
  value,
  onChange,
  compact = false,
}: {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      {!compact ? (
        <div>
          <h2 className="text-sm font-medium">Time period</h2>
          <p className="text-xs text-muted-foreground">Controls charts and tables below.</p>
        </div>
      ) : null}
      <Tabs value={value} onValueChange={(v) => onChange(v as BillingPeriod)}>
        <TabsList>
          <TabsTrigger value="7d">Last 7</TabsTrigger>
          <TabsTrigger value="30d">Last 30</TabsTrigger>
          <TabsTrigger value="90d">Last 90</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
