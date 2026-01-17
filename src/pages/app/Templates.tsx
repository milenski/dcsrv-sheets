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
  Code2
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
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { useApiAccess } from "@/hooks/useApiAccess";
import { cn } from "@/lib/utils";

// Mock data - add apiAccess field to templates
const templates = [
  { 
    id: "1", 
    name: "Invoice Extractor", 
    description: "Extract invoice data including amounts, dates, and vendor info",
    sheets: 2, 
    columns: 8, 
    lastRun: "2 hours ago",
    updatedAt: "Jan 10, 2026",
    runsCount: 24,
    apiAccess: "inherit" as const, // inherit | enabled | disabled
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
          <Button onClick={() => navigate("/app/templates/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        }
      />

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
          title={search ? "No templates found" : "No templates yet"}
          description={search 
            ? "Try adjusting your search terms." 
            : "Create your first template to start extracting data from documents."
          }
          action={!search ? {
            label: "Create Template",
            onClick: () => navigate("/app/templates/new"),
          } : undefined}
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
                      <DropdownMenuItem onClick={() => navigate(`/app/templates/${template.id}`)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Template
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
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
                        <DropdownMenuItem onClick={() => navigate(`/app/templates/${template.id}`)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
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
    </div>
  );
}
