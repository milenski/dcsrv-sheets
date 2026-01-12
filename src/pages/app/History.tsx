import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  Calendar,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

// Mock data
const mockRuns = [
  { 
    id: "run-1", 
    template: "Invoice Extractor", 
    documents: 5, 
    pages: 12,
    status: "completed", 
    date: "Jan 12, 2026 10:30 AM",
    duration: "2m 15s"
  },
  { 
    id: "run-2", 
    template: "Bank Statement Parser", 
    documents: 12, 
    pages: 48,
    status: "completed", 
    date: "Jan 11, 2026 3:45 PM",
    duration: "5m 32s"
  },
  { 
    id: "run-3", 
    template: "Invoice Extractor", 
    documents: 3, 
    pages: 6,
    status: "failed", 
    date: "Jan 11, 2026 11:20 AM",
    duration: "45s"
  },
  { 
    id: "run-4", 
    template: "Contract Summary", 
    documents: 8, 
    pages: 24,
    status: "completed", 
    date: "Jan 10, 2026 9:00 AM",
    duration: "4m 10s"
  },
  { 
    id: "run-5", 
    template: "Invoice Extractor", 
    documents: 20, 
    pages: 45,
    status: "completed", 
    date: "Jan 9, 2026 2:30 PM",
    duration: "8m 45s"
  },
];

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
  const [search, setSearch] = useState("");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRuns = mockRuns.filter(run => {
    const matchesSearch = run.template.toLowerCase().includes(search.toLowerCase());
    const matchesTemplate = templateFilter === "all" || run.template === templateFilter;
    const matchesStatus = statusFilter === "all" || run.status === statusFilter;
    return matchesSearch && matchesTemplate && matchesStatus;
  });

  const hasFilters = templateFilter !== "all" || statusFilter !== "all" || search;

  const clearFilters = () => {
    setSearch("");
    setTemplateFilter("all");
    setStatusFilter("all");
  };

  const uniqueTemplates = [...new Set(mockRuns.map(r => r.template))];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader 
        title="History"
        description="View all past extraction runs and their results."
        actions={
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search runs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={templateFilter} onValueChange={setTemplateFilter}>
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

        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
          title={hasFilters ? "No runs found" : "No runs yet"}
          description={hasFilters 
            ? "Try adjusting your filters to find what you're looking for." 
            : "Run your first extraction to see results here."
          }
          action={!hasFilters ? {
            label: "Run Extraction",
            onClick: () => navigate("/app/run"),
          } : undefined}
        />
      ) : (
        <Card className="shadow-card">
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
              {filteredRuns.map((run) => {
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
      )}
    </div>
  );
}
