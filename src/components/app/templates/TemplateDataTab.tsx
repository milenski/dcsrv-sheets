import { useState } from "react";
import { Download, FileSpreadsheet, Filter, Calendar, Search, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { EmptyState } from "@/components/app/EmptyState";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Sheet {
  id: string;
  name: string;
  columns: { id: string; name: string; enabled: boolean }[];
}

interface TemplateDataTabProps {
  storeDataEnabled: boolean;
  sheets: Sheet[];
}

// Mock extracted data
const mockExtractedData = [
  { id: "1", "Invoice Number": "INV-001", "Date": "2026-01-15", "Vendor": "Acme Corp", "Amount": "$1,250.00", "Tax": "$125.00", "Total": "$1,375.00", extractionId: "ext-001" },
  { id: "2", "Invoice Number": "INV-002", "Date": "2026-01-14", "Vendor": "Tech Solutions", "Amount": "$3,500.00", "Tax": "$350.00", "Total": "$3,850.00", extractionId: "ext-002" },
  { id: "3", "Invoice Number": "INV-003", "Date": "2026-01-12", "Vendor": "Office Supplies Co", "Amount": "$450.00", "Tax": "$45.00", "Total": "$495.00", extractionId: "ext-003" },
  { id: "4", "Invoice Number": "INV-004", "Date": "2026-01-10", "Vendor": "Consulting Ltd", "Amount": "$8,000.00", "Tax": "$800.00", "Total": "$8,800.00", extractionId: "ext-001" },
  { id: "5", "Invoice Number": "INV-005", "Date": "2026-01-08", "Vendor": "Cloud Services Inc", "Amount": "$2,100.00", "Tax": "$210.00", "Total": "$2,310.00", extractionId: "ext-004" },
];

export function TemplateDataTab({ storeDataEnabled, sheets }: TemplateDataTabProps) {
  const [selectedSheet, setSelectedSheet] = useState<string>(sheets[0]?.id || "");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [extractionFilter, setExtractionFilter] = useState("");
  const [hasData] = useState(true); // Mock: would check if data exists

  const selectedSheetData = sheets.find(s => s.id === selectedSheet);
  const enabledColumns = selectedSheetData?.columns.filter(c => c.enabled) || [];

  if (!storeDataEnabled) {
    return (
      <Card className="shadow-card">
        <CardContent className="py-12">
          <EmptyState
            icon={Database}
            title="Data storage is disabled"
            description="This template does not store extracted data. Enable data storage in template settings to view data here."
          />
        </CardContent>
      </Card>
    );
  }

  if (!hasData) {
    return (
      <Card className="shadow-card">
        <CardContent className="py-12">
          <EmptyState
            icon={FileSpreadsheet}
            title="No extracted data yet"
            description="Run an extraction to start populating data. All extracted records will appear here for viewing and export."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2 min-w-[200px]">
              <Label>Sheet</Label>
              <Select value={selectedSheet} onValueChange={setSelectedSheet}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sheet" />
                </SelectTrigger>
                <SelectContent>
                  {sheets.filter(s => s.columns.some(c => c.enabled)).map((sheet) => (
                    <SelectItem key={sheet.id} value={sheet.id}>
                      {sheet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd, yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, yyyy")
                      )
                    ) : (
                      "All time"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={dateRange.from ? { from: dateRange.from, to: dateRange.to } : undefined}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Extraction ID</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by ID..."
                  value={extractionFilter}
                  onChange={(e) => setExtractionFilter(e.target.value)}
                  className="pl-9 w-[180px]"
                />
              </div>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export XLSX
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {selectedSheetData?.name || "Data"} 
              <span className="font-normal text-muted-foreground ml-2">
                ({mockExtractedData.length} records)
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {enabledColumns.map((col) => (
                    <TableHead key={col.id}>{col.name}</TableHead>
                  ))}
                  <TableHead className="w-[120px]">Extraction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExtractedData.map((row) => (
                  <TableRow key={row.id}>
                    {enabledColumns.map((col) => (
                      <TableCell key={col.id}>
                        {row[col.name as keyof typeof row] || "-"}
                      </TableCell>
                    ))}
                    <TableCell>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {row.extractionId}
                      </code>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
