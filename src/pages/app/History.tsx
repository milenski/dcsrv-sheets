import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  Calendar,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Pagination } from "@/components/app/Pagination";
import { useUsage } from "@/hooks/useUsage";
import { cn } from "@/lib/utils";

// Extended mock data for pagination demo
const generateMockRuns = (count: number) => {
  const templates = ["Invoice Extractor", "Bank Statement Parser", "Contract Summary"];
  const statuses = ["completed", "completed", "completed", "completed", "failed"];
  const runs = [];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(i / 3));
    date.setHours(Math.floor(Math.random() * 12) + 8);
    date.setMinutes(Math.floor(Math.random() * 60));
    
    runs.push({
      id: `run-${i + 1}`,
      template: templates[i % templates.length],
      documents: Math.floor(Math.random() * 20) + 1,
      pages: Math.floor(Math.random() * 50) + 5,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      duration: `${Math.floor(Math.random() * 10) + 1}m ${Math.floor(Math.random() * 59)}s`,
    });
  }
  return runs;
};

const mockRuns = generateMockRuns(47); // Match the run count from usage

const PAGE_SIZE = 20;

const statusIcons = {
  completed: CheckCircle2,
  failed: AlertCircle,
  processing: Clock,
};

const statusColors = {
  completed: "text-green-600",
  failed: "text-destructive",
  processing: "text-amber-600",
};

export default function History() {
  const navigate = useNavigate();
  const usage = useUsage();
  const [search, setSearch] = useState("");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Use empty array if no runs
  const runsData = usage.hasRuns ? mockRuns : [];

  const filteredRuns = useMemo(() => {
    return runsData.filter(run => {
      const matchesSearch = run.template.toLowerCase().includes(search.toLowerCase());
      const matchesTemplate = templateFilter === "all" || run.template === templateFilter;
      const matchesStatus = statusFilter === "all" || run.status === statusFilter;
      return matchesSearch && matchesTemplate && matchesStatus;
    });
  }, [runsData, search, templateFilter, statusFilter]);

  // Reset to page 1 when filters change
  const resetPage = () => setCurrentPage(1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    resetPage();
  };

  const handleTemplateChange = (value: string) => {
    setTemplateFilter(value);
    resetPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetPage();
  };

  // Pagination
  const totalPages = Math.ceil(filteredRuns.length / PAGE_SIZE);
  const paginatedRuns = filteredRuns.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasFilters = templateFilter !== "all" || statusFilter !== "all" || search;

  const clearFilters = () => {
    setSearch("");
    setTemplateFilter("all");
    setStatusFilter("all");
    resetPage();
  };

  const uniqueTemplates = [...new Set(runsData.map(r => r.template))];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader 
        title="History"
        description="View all past extraction runs and their results."
        actions={
          usage.hasRuns && (
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          )
        }
      />

      {!usage.hasRuns ? (
        <EmptyState
          icon={Calendar}
          title="No extractions yet"
          description="When you process documents, your results will appear here."
          action={usage.hasTemplates ? {
            label: "Run extraction",
            onClick: () => navigate("/app/run"),
          } : {
            label: "Create a template",
            onClick: () => navigate("/app/templates/new"),
          }}
        />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search runs..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>

            <Select value={templateFilter} onValueChange={handleTemplateChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All templates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All templates</SelectItem>
                {uniqueTemplates.map((template) => (
                  <SelectItem key={template} value={template}>{template}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>

          {filteredRuns.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No runs found"
              description="Try adjusting your filters to find what you're looking for."
            />
          ) : (
            <>
              <Card className="shadow-card mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Pages</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRuns.map((run) => {
                      const StatusIcon = statusIcons[run.status as keyof typeof statusIcons];
                      return (
                        <TableRow key={run.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <StatusIcon className={cn("w-4 h-4", statusColors[run.status as keyof typeof statusColors])} />
                              <Badge 
                                variant={run.status === "completed" ? "default" : run.status === "failed" ? "destructive" : "secondary"}
                                className="capitalize"
                              >
                                {run.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{run.template}</span>
                            </div>
                          </TableCell>
                          <TableCell>{run.documents}</TableCell>
                          <TableCell>{run.pages}</TableCell>
                          <TableCell>{run.duration}</TableCell>
                          <TableCell className="text-muted-foreground">{run.date}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              asChild
                            >
                              <Link to={`/app/runs/${run.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredRuns.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
