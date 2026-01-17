import { Link, useNavigate } from "react-router-dom";
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  cta: string;
  href: string;
  completed?: boolean;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Create your first template",
    description: "Templates define how your documents are converted into structured data. Set up columns and sheets to match your extraction needs.",
    icon: FileSpreadsheet,
    cta: "Create template",
    href: "/app/templates/new",
  },
  {
    id: 2,
    title: "Upload a document",
    description: "Upload PDFs, Word docs, or images. Our AI extracts the data you need based on your template configuration.",
    icon: Upload,
    cta: "Run extraction",
    href: "/app/run",
  },
  {
    id: 3,
    title: "Export structured data",
    description: "Download your extracted data as Excel, CSV, or JSON. Or use our API to integrate with your existing workflows.",
    icon: Download,
    cta: "View examples",
    href: "/examples",
  },
];

export function OnboardingDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-10 pt-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Welcome to DocServant for Spreadsheets
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your documents into structured spreadsheet data. 
          Extract invoices, receipts, contracts, and more with AI-powered precision.
        </p>
      </div>

      {/* Getting Started Checklist */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Get started in 3 steps
        </h2>
        <div className="space-y-4">
          {onboardingSteps.map((step, index) => (
            <Card 
              key={step.id}
              className={cn(
                "shadow-card transition-all hover:shadow-elevated cursor-pointer",
                step.completed && "border-primary/50 bg-primary/5"
              )}
              onClick={() => navigate(step.href)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                      step.completed 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      step.completed ? "bg-primary/10" : "bg-accent"
                    )}>
                      <step.icon className={cn(
                        "w-5 h-5",
                        step.completed ? "text-primary" : "text-accent-foreground"
                      )} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    {step.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link 
          to="/app/developers/docs"
          className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-center"
        >
          <p className="font-medium text-foreground mb-1">API Documentation</p>
          <p className="text-xs text-muted-foreground">Integrate with your apps</p>
        </Link>
        <Link 
          to="/examples"
          className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-center"
        >
          <p className="font-medium text-foreground mb-1">Examples</p>
          <p className="text-xs text-muted-foreground">See what's possible</p>
        </Link>
        <Link 
          to="/help"
          className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-center"
        >
          <p className="font-medium text-foreground mb-1">Help Center</p>
          <p className="text-xs text-muted-foreground">Get support</p>
        </Link>
      </div>
    </div>
  );
}
