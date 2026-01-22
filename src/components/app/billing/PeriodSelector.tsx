import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BillingPeriod } from "@/lib/usageAnalyticsMock";

export function PeriodSelector({
  value,
  onChange,
}: {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-sm font-medium">Time period</h2>
        <p className="text-xs text-muted-foreground">Controls charts and tables below.</p>
      </div>
      <Tabs value={value} onValueChange={(v) => onChange(v as BillingPeriod)}>
        <TabsList>
          <TabsTrigger value="7d">Last 7 days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 days</TabsTrigger>
          <TabsTrigger value="90d">Last 90 days</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
