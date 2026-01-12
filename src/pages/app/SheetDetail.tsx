import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Check,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Mock data
const mockSheet = {
  id: "sheet1",
  name: "Invoices",
  enabled: true,
  prompt: "Focus on header-level invoice information. Be precise with dates and currency values.",
  columns: [
    { id: "col1", name: "Invoice Number", enabled: true, prompt: "" },
    { id: "col2", name: "Date", enabled: true, prompt: "Extract the invoice date in YYYY-MM-DD format." },
    { id: "col3", name: "Vendor", enabled: true, prompt: "" },
    { id: "col4", name: "Amount", enabled: true, prompt: "Extract the subtotal before tax." },
    { id: "col5", name: "Tax", enabled: true, prompt: "" },
    { id: "col6", name: "Total", enabled: true, prompt: "" },
  ]
};

const mockTemplatePrompt = "You are extracting invoice data. Be precise with numbers and dates. Always verify totals match line items.";

export default function SheetDetail() {
  const { id, sheetId } = useParams();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState(mockSheet);
  const [sheetPrompt, setSheetPrompt] = useState(sheet.prompt);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const enabledColumns = sheet.columns.filter(c => c.enabled);
  const columnsWithPrompts = sheet.columns.filter(c => c.prompt).length;

  const toggleColumn = (columnId: string) => {
    setSheet(prev => ({
      ...prev,
      columns: prev.columns.map(c => 
        c.id === columnId ? { ...c, enabled: !c.enabled } : c
      )
    }));
  };

  const toggleColumnSelection = (columnId: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedColumns.length === sheet.columns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(sheet.columns.map(c => c.id));
    }
  };

  const bulkEnable = () => {
    setSheet(prev => ({
      ...prev,
      columns: prev.columns.map(c => 
        selectedColumns.includes(c.id) ? { ...c, enabled: true } : c
      )
    }));
    setSelectedColumns([]);
  };

  const bulkDisable = () => {
    setSheet(prev => ({
      ...prev,
      columns: prev.columns.map(c => 
        selectedColumns.includes(c.id) ? { ...c, enabled: false } : c
      )
    }));
    setSelectedColumns([]);
  };

  return (
    <div className="min-h-full bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(`/app/templates/${id}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Link to={`/app/templates/${id}`} className="hover:text-foreground">
                  Invoice Extractor
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span>Sheets</span>
              </div>
              <h1 className="text-xl font-semibold">{sheet.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* Sheet Toggle */}
        <Card className="shadow-card">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sheet Status</p>
                <p className="text-sm text-muted-foreground">
                  {sheet.enabled ? "This sheet is included in extractions" : "This sheet is disabled"}
                </p>
              </div>
              <Switch 
                checked={sheet.enabled}
                onCheckedChange={(checked) => setSheet(prev => ({ ...prev, enabled: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sheet Prompt */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Sheet-Level Prompt</CardTitle>
            <p className="text-sm text-muted-foreground">
              Instructions specific to this sheet. Combined with the template prompt.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Show inherited template prompt */}
            <div className="p-3 rounded-lg bg-muted/50">
              <Label className="text-xs text-muted-foreground">Inherited Template Prompt</Label>
              <p className="text-sm mt-1 text-muted-foreground italic">
                {mockTemplatePrompt}
              </p>
            </div>

            <div>
              <Label>Sheet Prompt</Label>
              <Textarea
                value={sheetPrompt}
                onChange={(e) => setSheetPrompt(e.target.value)}
                placeholder="Enter sheet-specific instructions..."
                rows={3}
                className="mt-2"
              />
            </div>

            <Button size="sm">
              <Check className="w-4 h-4 mr-2" />
              Save Prompt
            </Button>
          </CardContent>
        </Card>

        {/* Columns Table */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Columns</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {enabledColumns.length} of {sheet.columns.length} columns enabled
                </p>
              </div>
              {selectedColumns.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedColumns.length} selected
                  </span>
                  <Button variant="outline" size="sm" onClick={bulkEnable}>
                    Enable
                  </Button>
                  <Button variant="outline" size="sm" onClick={bulkDisable}>
                    Disable
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedColumns.length === sheet.columns.length}
                      onCheckedChange={toggleAllSelection}
                    />
                  </TableHead>
                  <TableHead>Column Name</TableHead>
                  <TableHead className="w-[100px]">Enabled</TableHead>
                  <TableHead className="w-[120px]">Prompt</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sheet.columns.map((column) => (
                  <TableRow key={column.id} className={cn(!column.enabled && "opacity-60")}>
                    <TableCell>
                      <Checkbox
                        checked={selectedColumns.includes(column.id)}
                        onCheckedChange={() => toggleColumnSelection(column.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{column.name}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={column.enabled}
                        onCheckedChange={() => toggleColumn(column.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {column.prompt ? (
                        <Badge variant="default" className="text-xs">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Set
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">None</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        asChild
                      >
                        <Link to={`/app/templates/${id}/sheets/${sheetId}/columns/${column.id}`}>
                          Edit
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
