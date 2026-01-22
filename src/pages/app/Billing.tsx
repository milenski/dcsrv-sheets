import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  Zap,
  Building2,
  Download,
  ExternalLink,
  Info,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageHeader } from "@/components/app/PageHeader";
import { TokenUsageMeter } from "@/components/app/TokenUsageMeter";
import { OverageWarning } from "@/components/app/OverageWarning";
import { useUsage } from "@/hooks/useUsage";
import { useRole } from "@/hooks/useRole";
import { PLANS_ARRAY, TOKEN_DISCLAIMER, formatTokens, planHasTeam } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { PeriodSelector } from "@/components/app/billing/PeriodSelector";
import { UsageSummaryCards } from "@/components/app/billing/UsageSummaryCards";
import { TokenUsageOverTimeChart } from "@/components/app/billing/TokenUsageOverTimeChart";
import { DocumentsProcessedOverTimeChart } from "@/components/app/billing/DocumentsProcessedOverTimeChart";
import { TopUsageLists } from "@/components/app/billing/TopUsageLists";
import { UsageBreakdownDialog } from "@/components/app/billing/UsageBreakdownDialog";
import {
  aggregateDailyTokens,
  aggregateDailyDocuments,
  generateMockUsageEvents,
  sumUsage,
  type BillingPeriod,
} from "@/lib/usageAnalyticsMock";

const invoices = [
  { id: "inv-001", date: "Jan 1, 2026", amount: 25, status: "paid", description: "Standard Plan" },
  { id: "inv-002", date: "Dec 1, 2025", amount: 25, status: "paid", description: "Standard Plan" },
];

export default function Billing() {
  const usage = useUsage();
  const { role } = useRole();
  const [selectedPlan, setSelectedPlan] = useState(usage.plan.id);
  const [period, setPeriod] = useState<BillingPeriod>("30d");

  const canSeeCosts = role === "owner";
  const teamEnabled = planHasTeam(usage.plan);

  const events = useMemo(() => {
    return generateMockUsageEvents({
      period,
      planId: usage.plan.id,
      usedTokensMonthly: usage.usedTokens,
      includeUsers: teamEnabled,
      seed: 1337,
    });
  }, [period, teamEnabled, usage.plan.id, usage.usedTokens]);

  const daily = useMemo(() => aggregateDailyTokens(events), [events]);
  const dailyDocs = useMemo(() => aggregateDailyDocuments(events), [events]);
  const totals = useMemo(() => sumUsage(events), [events]);

  const summary = useMemo(() => {
    return {
      tokensUsed: totals.tokens,
      documents: totals.documents,
      remainingTokens: usage.remainingTokens,
      overageTokens: usage.overageTokens,
      overageCost: usage.overageCost,
      activeUsers: totals.users.size,
      usagePercentage: usage.usagePercentage,
    };
  }, [totals, usage.overageCost, usage.overageTokens, usage.remainingTokens, usage.usagePercentage]);

  const planIcons = {
    free: Zap,
    light: Zap,
    standard: Zap,
    pro: Building2,
  };

  const showUpgradeZone =
    usage.usagePercentage >= 80 ||
    usage.usagePercentage >= 100 ||
    usage.plan.id === "free" ||
    usage.plan.id === "light";

  const showPlanGrid = showUpgradeZone;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Billing & Usage"
        actions={<PeriodSelector value={period} onChange={setPeriod} compact />}
      />

      <div className="space-y-4">
        {/* Summary cards (compact row) */}
        <UsageSummaryCards plan={usage.plan} role={role} summary={summary} canSeeCosts={canSeeCosts} />

        {/* Current Usage (top priority zone) */}
        <Card className={cn("shadow-card", usage.usagePercentage >= 100 ? "border-destructive/30" : "")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="text-base">Current usage</CardTitle>
                <p className="text-xs text-muted-foreground truncate">
                  Included limit: {formatTokens(usage.includedTokens)} • Resets {usage.resetDate}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0">
                {usage.plan.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <TokenUsageMeter
              usedTokens={usage.usedTokens}
              includedTokens={usage.includedTokens}
              remainingTokens={usage.remainingTokens}
              overageTokens={usage.overageTokens}
              overageCost={canSeeCosts ? usage.overageCost : 0}
              usagePercentage={usage.usagePercentage}
              usageStatus={usage.usageStatus}
              planName={usage.plan.name}
              isHardLimit={usage.plan.isHardLimit}
              resetDate={usage.resetDate}
              showBreakdown={true}
              showUpgrade={showUpgradeZone}
            />

            {/* Keep the existing owner-only overage explanation, but keep it visually compact and near the meter. */}
            {canSeeCosts && usage.overageTokens > 0 && usage.plan.overagePrice ? (
              <OverageWarning
                usedTokens={usage.usedTokens}
                includedTokens={usage.includedTokens}
                overageTokens={usage.overageTokens}
                overageCost={usage.overageCost}
                overagePrice={usage.plan.overagePrice}
                className="shadow-none"
              />
            ) : null}

            {usage.usagePercentage >= 100 && usage.plan.isHardLimit ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-destructive">Hard limit reached.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      New extractions are disabled on the Free plan until your tokens reset.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Button asChild>
                        <Link to="/pricing">Upgrade plan</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/app">Back to Dashboard</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Two main charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TokenUsageOverTimeChart
            data={daily}
            plan={usage.plan}
            totalPeriodTokens={summary.tokensUsed}
            role={role}
            compact
          />
          <DocumentsProcessedOverTimeChart data={dailyDocs} compact />
        </div>

        {/* Replace giant table with compact top lists + full breakdown link */}
        <div className="space-y-2">
          <TopUsageLists events={events} plan={usage.plan} />
          <div className="flex items-center justify-end">
            <UsageBreakdownDialog events={events} plan={usage.plan} />
          </div>
        </div>

        {/* Plans & Upgrade zone */}
        {showPlanGrid ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Plans & upgrades</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/pricing">
                  Compare plans
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 mb-4">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{TOKEN_DISCLAIMER}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PLANS_ARRAY.map((plan) => {
                const PlanIcon = planIcons[plan.id as keyof typeof planIcons] || Zap;
                const isCurrent = usage.plan.id === plan.id;
                const isPopular = plan.id === "standard";

                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "shadow-card relative cursor-pointer transition-all",
                      isPopular && "border-primary",
                      selectedPlan === plan.id && "ring-2 ring-primary",
                    )}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <PlanIcon
                          className={cn(
                            "w-5 h-5",
                            plan.id === "free" ? "text-muted-foreground" : "text-primary",
                          )}
                        />
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        {isCurrent && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-3xl font-bold">€{plan.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>

                      <div className="space-y-1.5 text-sm">
                        <p className="font-medium text-primary">
                          {formatTokens(plan.tokens)} tokens/month
                        </p>
                        {plan.overagePrice ? (
                          <p className="text-muted-foreground">€{plan.overagePrice.toFixed(2)} per 50k extra</p>
                        ) : (
                          <p className="text-muted-foreground">Hard limit</p>
                        )}
                      </div>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button className="w-full" variant={isCurrent ? "outline" : "default"} disabled={isCurrent}>
                                {isCurrent ? "Current Plan" : "Upgrade"}
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {!canSeeCosts ? (
                            <TooltipContent side="top">
                              <p className="text-xs">Only Owners can change billing.</p>
                            </TooltipContent>
                          ) : null}
                        </Tooltip>
                      </TooltipProvider>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">Plans</p>
              <p className="text-xs text-muted-foreground truncate">Compare plans if you need more tokens or team features.</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="shrink-0">
              <Link to="/pricing">
                Compare plans
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Separator className="my-8" />

      {/* Payment Method (Owner-only) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">No payment method</p>
                  <p className="text-sm text-muted-foreground">Add a card to upgrade</p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button variant="outline" size="sm" disabled={!canSeeCosts}>
                        Add Card
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!canSeeCosts ? (
                    <TooltipContent side="top">
                      <p className="text-xs">Owner only</p>
                    </TooltipContent>
                  ) : null}
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {/* Invoices (Owner-only amounts) */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Invoices</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button variant="ghost" size="sm" disabled={!canSeeCosts}>
                        View All
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!canSeeCosts ? (
                    <TooltipContent side="top">
                      <p className="text-xs">Owner only</p>
                    </TooltipContent>
                  ) : null}
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No invoices yet
              </p>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div 
                    key={invoice.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{invoice.description}</p>
                      <p className="text-xs text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("text-sm font-medium", !canSeeCosts && "text-muted-foreground")}>
                        {canSeeCosts ? `€${invoice.amount}` : "Hidden"}
                      </span>
                      <Badge variant="secondary" className="capitalize">
                        {invoice.status}
                      </Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!canSeeCosts}>
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {!canSeeCosts ? (
                            <TooltipContent side="top">
                              <p className="text-xs">Owner only</p>
                            </TooltipContent>
                          ) : null}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
