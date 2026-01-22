import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { UsageEvent } from "@/lib/usageAnalyticsMock";
import type { Plan } from "@/lib/plans";
import { UsageBreakdownTable } from "@/components/app/billing/UsageBreakdownTable";

export function UsageBreakdownDialog({
  events,
  plan,
}: {
  events: UsageEvent[];
  plan: Plan;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="h-auto p-0">
          View full breakdown
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Usage breakdown</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto pr-1">
          <UsageBreakdownTable events={events} plan={plan} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
