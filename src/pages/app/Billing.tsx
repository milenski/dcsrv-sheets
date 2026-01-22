import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  Check,
  Zap,
  Building2,
  Download,
  ExternalLink,
  Info,
  AlertTriangle
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
import { UsageBreakdownTable } from "@/components/app/billing/UsageBreakdownTable";
import {
  aggregateDailyTokens,
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Billing & Usage"
        description="Manage your subscription and view usage details."
      />

      {/* Period selector */}
      <div className="mb-6">
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Usage warnings */}
      {usage.usagePercentage >= 80 && usage.usagePercentage < 95 ? (
        <div className="mb-6 rounded-lg border bg-muted/20 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">You're approaching your monthly limit.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Keep an eye on token usage to avoid interruption.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {usage.usagePercentage >= 95 && usage.usagePercentage < 100 ? (
        <div className="mb-6 rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-orange-700">You're close to your monthly limit.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Consider upgrading if you expect more usage this month.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {usage.usagePercentage >= 100 && usage.plan.isHardLimit ? (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
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
      ) : null}

      {/* Overage Warning (Owner-only cost visibility) */}
      {canSeeCosts && usage.overageTokens > 0 && usage.plan.overagePrice && (
        <OverageWarning
          usedTokens={usage.usedTokens}
          includedTokens={usage.includedTokens}
          overageTokens={usage.overageTokens}
          overageCost={usage.overageCost}
          overagePrice={usage.plan.overagePrice}
          className="mb-8"
        />
      )}

      {/* Summary cards */}
      <div className="mb-6">
        <UsageSummaryCards plan={usage.plan} role={role} summary={summary} canSeeCosts={canSeeCosts} />
      </div>

      {/* Main chart */}
      <div className="mb-6">
        <TokenUsageOverTimeChart data={daily} plan={usage.plan} totalPeriodTokens={summary.tokensUsed} role={role} />
      </div>

      {/* Breakdown table */}
      <div className="mb-8">
        <UsageBreakdownTable events={events} plan={usage.plan} />
      </div>

      {/* Current Usage */}
      <Card className="shadow-card mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Current Usage</CardTitle>
            <Badge variant="outline">{usage.plan.name} Plan</Badge>
          </div>
        </CardHeader>
        <CardContent>
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
            showUpgrade={false}
          />
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Choose a Plan</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/pricing">
              Compare all plans
              <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        {/* Token disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 mb-6">
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
                  selectedPlan === plan.id && "ring-2 ring-primary"
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
                    <PlanIcon className={cn(
                      "w-5 h-5",
                      plan.id === "free" ? "text-muted-foreground" : "text-primary"
                    )} />
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {isCurrent && (
                      <Badge variant="secondary" className="ml-auto text-xs">Current</Badge>
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
                      <p className="text-muted-foreground">
                        €{plan.overagePrice.toFixed(2)} per 50k extra
                      </p>
                    ) : (
                      <p className="text-muted-foreground">Hard limit</p>
                    )}
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button 
                    className="w-full" 
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent}
                  >
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
