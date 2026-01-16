import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  Check,
  Zap,
  Building2,
  Download,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/app/PageHeader";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    pages: 100,
    features: [
      "100 pages/month",
      "Basic extraction",
      "CSV & Excel export",
      "3 templates",
    ],
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    pages: 1000,
    features: [
      "1,000 pages/month",
      "Batch processing",
      "Saved schemas",
      "Priority queue",
      "Unlimited templates",
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: 99,
    pages: 5000,
    features: [
      "5,000 pages/month",
      "Team seats (up to 5)",
      "Audit log",
      "Invoice billing",
      "Priority support",
    ],
  },
];

const invoices = [
  { id: "inv-001", date: "Jan 1, 2026", amount: 0, status: "paid", description: "Free Plan" },
  { id: "inv-002", date: "Dec 1, 2025", amount: 0, status: "paid", description: "Free Plan" },
];

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState("free");
  const usedPages = 67;
  const totalPages = 100;
  const usagePercentage = (usedPages / totalPages) * 100;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Billing & Usage"
        description="Manage your subscription and view usage details."
      />

      {/* Current Usage */}
      <Card className="shadow-card mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Current Usage</CardTitle>
            <Badge variant="secondary">Free Plan</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Pages used this month</span>
              <span className="font-medium">{usedPages} / {totalPages}</span>
            </div>
            <Progress value={usagePercentage} className="h-3" />
          </div>
          <p className="text-sm text-muted-foreground">
            Resets on February 1, 2026. {totalPages - usedPages} pages remaining.
          </p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={cn(
                "shadow-card relative cursor-pointer transition-all",
                plan.popular && "border-primary",
                selectedPlan === plan.id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {plan.id === "free" && <Zap className="w-5 h-5 text-muted-foreground" />}
                  {plan.id === "pro" && <Zap className="w-5 h-5 text-primary" />}
                  {plan.id === "business" && <Building2 className="w-5 h-5 text-primary" />}
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          ))}
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
