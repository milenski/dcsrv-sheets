import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  FileSpreadsheet,
  MoreHorizontal,
  Play,
  Pencil,
  Trash2,
  Clock,
  Code2,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { useApiAccess } from "@/hooks/useApiAccess";
import { useUsage } from "@/hooks/useUsage";
import { useRole, canManageTemplates } from "@/hooks/useRole";
import { cn } from "@/lib/utils";

// Mock data - add apiAccess field to templates
const mockTemplates = [
  { 
    id: "1", 
    name: "Invoice Extractor", 
    description: "Extract invoice data including amounts, dates, and vendor info",
    sheets: 2, 
    columns: 8, 
    lastRun: "2 hours ago",
    updatedAt: "Jan 10, 2026",
    runsCount: 24,
    apiAccess: "inherit" as const,
  },
  { 
    id: "2", 
    name: "Bank Statement Parser", 
    description: "Parse bank statements into transaction rows",
    sheets: 1, 
    columns: 5, 
    lastRun: "Yesterday",
    updatedAt: "Jan 8, 2026",
    runsCount: 18,
    apiAccess: "enabled" as const,
  },
  { 
    id: "3", 
    name: "Contract Summary", 
    description: "Extract key terms and parties from contracts",
    sheets: 3, 
    columns: 12, 
    lastRun: "3 days ago",
    updatedAt: "Jan 5, 2026",
    runsCount: 5,
    apiAccess: "disabled" as const,
  },
];

// Example templates for empty state
const exampleTemplates = [
  { name: "Invoice Extractor", description: "Amounts, dates, vendor info" },
  { name: "Receipt Parser", description: "Line items, totals, tax" },
  { name: "Contract Summary", description: "Parties, terms, dates" },
];

type ApiAccessLevel = "inherit" | "enabled" | "disabled";

function getApiStatusBadge(templateApiAccess: ApiAccessLevel, accountApiEnabled: boolean) {
  if (!accountApiEnabled) {
    return { label: "API: Off", variant: "secondary" as const, tooltip: "Account API is disabled" };
  }
  
  switch (templateApiAccess) {
    case "enabled":
      return { label: "API: Enabled", variant: "default" as const };
    case "disabled":
      return { label: "API: Disabled", variant: "secondary" as const };
    case "inherit":
    default:
      return { 
        label: accountApiEnabled ? "API: On (inherited)" : "API: Off (inherited)", 
        variant: accountApiEnabled ? "outline" as const : "secondary" as const 
      };
  }
}

export default function Templates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  const { apiEnabled } = useApiAccess();
  const usage = useUsage();
  const { role } = useRole();
  const canManage = canManageTemplates(role);

  // Use empty array if no templates
  const templates = usage.hasTemplates ? mockTemplates : [];

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Templates"
        description="Manage your extraction templates and their configurations."
        actions={
          canManage ? (
            <Button onClick={() => navigate("/app/templates/new")}>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button disabled>
                    <Plus className="w-4 h-4 mr-2" />
                    New Template
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Only Owners and Admins can manage templates.</TooltipContent>
            </Tooltip>
          )
        }
      />

      {!usage.hasTemplates ? (
        <div className="max-w-2xl mx-auto">
          <EmptyState
            icon={FileSpreadsheet}
            title="No templates yet"
            description="Templates define how your documents are converted into structured data. Create columns and sheets to match your extraction needs."
            action={canManage ? {
              label: "Create your first template",
              onClick: () => navigate("/app/templates/new"),
            } : undefined}
          />
          
          {/* Example templates */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <p className="text-sm text-muted-foreground">
                Need inspiration? Here are some common template types:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {exampleTemplates.map((template) => (
                <div 
                  key={template.name}
                  className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate("/app/templates/new")}
                >
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mb-2">
                    <FileSpreadsheet className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center border rounded-lg p-0.5">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
                className="h-8"
              >
                Grid
              </Button>
              <Button
                variant={view === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("table")}
                className="h-8"
              >
                Table
              </Button>
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <EmptyState
              icon={FileSpreadsheet}
              title="No templates found"
              description="Try adjusting your search terms."
            />
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="shadow-card hover:shadow-elevated transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/app/templates/${template.id}/run`)}>
                            <Play className="w-4 h-4 mr-2" />
                            Run Extraction
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => navigate(`/app/templates/${template.id}`)}
                            disabled={!canManage}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            {canManage ? "Edit Template" : "Edit (Admin only)"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            disabled={!canManage}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {canManage ? "Delete" : "Delete (Admin only)"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <Link to={`/app/templates/${template.id}`}>
                      <h3 className="font-semibold text-foreground mb-1 hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="flex items-center flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {template.sheets} sheets
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {template.columns} columns
                      </Badge>
                      {(() => {
                        const apiStatus = getApiStatusBadge(template.apiAccess, apiEnabled);
                        return (
                          <Badge 
                            variant={apiStatus.variant} 
                            className={cn(
                              "text-xs gap-1",
                              !apiEnabled && "cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            )}
                            onClick={!apiEnabled ? () => navigate("/app/developers") : undefined}
                          >
                            <Code2 className="w-3 h-3" />
                            {apiStatus.label}
                          </Badge>
                        );
                      })()}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last run {template.lastRun}
                      </span>
                      <span>{template.runsCount} runs</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API</TableHead>
                    <TableHead>Sheets</TableHead>
                    <TableHead>Columns</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <Link 
                          to={`/app/templates/${template.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {template.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const apiStatus = getApiStatusBadge(template.apiAccess, apiEnabled);
                          return (
                            <Badge variant={apiStatus.variant} className="text-xs gap-1">
                              <Code2 className="w-3 h-3" />
                              {apiStatus.label.replace("API: ", "")}
                            </Badge>
                          );
                        })()}
                      </TableCell>
                      <TableCell>{template.sheets}</TableCell>
                      <TableCell>{template.columns}</TableCell>
                      <TableCell>{template.lastRun}</TableCell>
                      <TableCell>{template.updatedAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/app/templates/${template.id}/run`)}>
                              <Play className="w-4 h-4 mr-2" />
                              Run Extraction
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigate(`/app/templates/${template.id}`)}
                              disabled={!canManage}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              {canManage ? "Edit" : "Edit (Admin only)"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              disabled={!canManage}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {canManage ? "Delete" : "Delete (Admin only)"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
