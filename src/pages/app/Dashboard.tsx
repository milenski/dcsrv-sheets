import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, 
  Play, 
  FileSpreadsheet, 
  Clock, 
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Code2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { UsageMeter } from "@/components/app/UsageMeter";
import { EmptyState } from "@/components/app/EmptyState";
import { useApiAccess } from "@/hooks/useApiAccess";

// Mock data
const recentTemplates = [
  { id: "1", name: "Invoice Extractor", sheets: 2, columns: 8, lastRun: "2 hours ago" },
  { id: "2", name: "Bank Statement Parser", sheets: 1, columns: 5, lastRun: "Yesterday" },
  { id: "3", name: "Contract Summary", sheets: 3, columns: 12, lastRun: "3 days ago" },
];

const recentRuns = [
  { id: "1", template: "Invoice Extractor", documents: 5, status: "completed", time: "10 min ago" },
  { id: "2", template: "Bank Statement Parser", documents: 12, status: "processing", time: "15 min ago" },
  { id: "3", template: "Invoice Extractor", documents: 3, status: "failed", time: "1 hour ago" },
];

const statusIcons = {
  completed: CheckCircle2,
  processing: Loader2,
  failed: AlertCircle,
};

const statusColors = {
  completed: "text-green-600",
  processing: "text-amber-600 animate-spin",
  failed: "text-destructive",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { apiEnabled } = useApiAccess();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Dashboard"
        description="Welcome back! Here's what's happening with your extractions."
        actions={
          <>
            <Button variant="outline" onClick={() => navigate("/app/run")}>
              <Play className="w-4 h-4 mr-2" />
              Run Extraction
            </Button>
            <Button onClick={() => navigate("/app/templates/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Templates"
          value={3}
          icon={FileSpreadsheet}
          description="Active templates"
        />
        <StatCard
          title="Extractions"
          value={47}
          icon={Play}
          description="This month"
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatCard
          title="Pages Processed"
          value="1,234"
          icon={FileText}
          description="This month"
        />
        <StatCard
          title="Avg. Processing Time"
          value="8s"
          icon={Clock}
          description="Per document"
        />
      </div>

      {/* API Access Notice */}
      {!apiEnabled ? (
        <Card className="shadow-card mb-8 border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">API access is not enabled</p>
                  <p className="text-sm text-muted-foreground">
                    Enable API keys and webhooks to fetch results as JSON and receive callbacks when jobs complete.
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate("/app/developers")}>
                Enable API
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card mb-8">
          <CardContent className="py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5 text-primary" />
                <span className="text-sm">
                  <Badge variant="secondary" className="mr-2">API enabled</Badge>
                  Programmatic access is active for your account
                </span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/developers">Manage API</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Meter */}
      <Card className="shadow-card mb-8">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Monthly Usage</CardTitle>
            <Button variant="link" size="sm" asChild className="text-primary">
              <Link to="/app/billing">Upgrade plan</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <UsageMeter used={1234} limit={2000} label="Pages" />
        </CardContent>
      </Card>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Templates */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Templates</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/templates" className="text-muted-foreground hover:text-foreground">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentTemplates.length > 0 ? (
              <div className="space-y-3">
                {recentTemplates.map((template) => (
                  <Link
                    key={template.id}
                    to={`/app/templates/${template.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                        <FileSpreadsheet className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{template.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {template.sheets} sheets · {template.columns} columns
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{template.lastRun}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileSpreadsheet}
                title="No templates yet"
                description="Create your first template to start extracting data."
                action={{
                  label: "Create Template",
                  onClick: () => navigate("/app/templates/new"),
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Recent Runs */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Runs</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/history" className="text-muted-foreground hover:text-foreground">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentRuns.length > 0 ? (
              <div className="space-y-3">
                {recentRuns.map((run) => {
                  const StatusIcon = statusIcons[run.status as keyof typeof statusIcons];
                  return (
                    <Link
                      key={run.id}
                      to={`/app/runs/${run.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-5 h-5 ${statusColors[run.status as keyof typeof statusColors]}`} />
                        <div>
                          <p className="font-medium text-sm">{run.template}</p>
                          <p className="text-xs text-muted-foreground">
                            {run.documents} documents
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={run.status === "completed" ? "default" : run.status === "failed" ? "destructive" : "secondary"}
                          className="text-xs capitalize"
                        >
                          {run.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{run.time}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Play}
                title="No runs yet"
                description="Run your first extraction to see results here."
                action={{
                  label: "Run Extraction",
                  onClick: () => navigate("/app/run"),
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
