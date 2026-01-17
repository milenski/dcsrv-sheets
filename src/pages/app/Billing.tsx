import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  Check,
  Zap,
  Building2,
  Download,
  ExternalLink,
  Info
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
import { PLANS_ARRAY, TOKEN_DISCLAIMER, formatTokens } from "@/lib/plans";
import { cn } from "@/lib/utils";

const invoices = [
  { id: "inv-001", date: "Jan 1, 2026", amount: 25, status: "paid", description: "Standard Plan" },
  { id: "inv-002", date: "Dec 1, 2025", amount: 25, status: "paid", description: "Standard Plan" },
];

export default function Billing() {
  const usage = useUsage();
  const [selectedPlan, setSelectedPlan] = useState(usage.plan.id);

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

      {/* Overage Warning */}
      {usage.overageTokens > 0 && usage.plan.overagePrice && (
        <OverageWarning
          usedTokens={usage.usedTokens}
          includedTokens={usage.includedTokens}
          overageTokens={usage.overageTokens}
          overageCost={usage.overageCost}
          overagePrice={usage.plan.overagePrice}
          className="mb-8"
        />
      )}

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
            overageCost={usage.overageCost}
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

                  <Button 
                    className="w-full" 
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Current Plan" : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Payment Method */}
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
              <Button variant="outline" size="sm">Add Card</Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Invoices</CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
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
                      <span className="text-sm font-medium">€{invoice.amount}</span>
                      <Badge variant="secondary" className="capitalize">
                        {invoice.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
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
