import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Archive,
  Eye,
  Code2,
  Copy,
  FileJson
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data
const mockRun = {
  id: "run-123",
  template: { id: "1", name: "Invoice Extractor" },
  status: "completed" as const,
  startedAt: "Jan 12, 2026 10:30 AM",
  completedAt: "Jan 12, 2026 10:32 AM",
  documents: [
    { id: "doc1", name: "invoice-001.pdf", status: "completed", pages: 2 },
    { id: "doc2", name: "invoice-002.pdf", status: "completed", pages: 1 },
    { id: "doc3", name: "invoice-003.pdf", status: "completed", pages: 3 },
    { id: "doc4", name: "invoice-004.pdf", status: "failed", pages: 0, error: "Could not parse document" },
    { id: "doc5", name: "invoice-005.pdf", status: "completed", pages: 1 },
  ],
  extractedData: {
    invoices: [
      { invoiceNumber: "INV-001", date: "2026-01-10", vendor: "Acme Corp", amount: 1250.00, tax: 125.00, total: 1375.00 },
      { invoiceNumber: "INV-002", date: "2026-01-08", vendor: "TechSupply Inc", amount: 890.50, tax: 89.05, total: 979.55 },
      { invoiceNumber: "INV-003", date: "2026-01-05", vendor: "Office Depot", amount: 245.00, tax: 24.50, total: 269.50 },
      { invoiceNumber: "INV-005", date: "2026-01-01", vendor: "CloudServices LLC", amount: 599.00, tax: 59.90, total: 658.90 },
    ],
    lineItems: [
      { invoiceNumber: "INV-001", description: "Consulting Services", quantity: 10, unitPrice: 125.00, amount: 1250.00 },
      { invoiceNumber: "INV-002", description: "Laptop Stand", quantity: 5, unitPrice: 89.00, amount: 445.00 },
      { invoiceNumber: "INV-002", description: "USB Hub", quantity: 5, unitPrice: 89.11, amount: 445.55 },
      { invoiceNumber: "INV-003", description: "Office Supplies", quantity: 1, unitPrice: 245.00, amount: 245.00 },
      { invoiceNumber: "INV-005", description: "Cloud Storage (Annual)", quantity: 1, unitPrice: 599.00, amount: 599.00 },
    ],
  },
};

const statusIcons = { completed: CheckCircle2, failed: AlertCircle, processing: Clock };
const statusColors = { completed: "text-green-600", failed: "text-destructive", processing: "text-amber-600" };

export default function RunResults() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = useState("invoices");
  const [outputFormat, setOutputFormat] = useState<"spreadsheet" | "json">("spreadsheet");
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [selectedDocJson, setSelectedDocJson] = useState<string | null>(null);

  const completedDocs = mockRun.documents.filter(d => d.status === "completed").length;
  const failedDocs = mockRun.documents.filter(d => d.status === "failed").length;
  const totalPages = mockRun.documents.reduce((sum, d) => sum + d.pages, 0);

  const handleCopyJson = (json: string) => {
    navigator.clipboard.writeText(json);
    toast.success("JSON copied to clipboard");
  };

  const handleDownloadJson = () => {
    const json = JSON.stringify(mockRun.extractedData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extraction-${runId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDocumentJson = (docId: string) => {
    return JSON.stringify({ documentId: docId, extractedAt: mockRun.completedAt, data: mockRun.extractedData }, null, 2);
  };

  const handleViewDocJson = (docId: string) => {
    setSelectedDocJson(getDocumentJson(docId));
    setJsonDialogOpen(true);
  };

  return (
    <div className="min-h-full bg-muted/30">
      <div className="border-b bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/app/history")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">Extraction Results</h1>
                  <Badge variant="default" className="capitalize">{mockRun.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Template: <Link to={`/app/templates/${mockRun.template.id}`} className="hover:text-foreground underline">{mockRun.template.name}</Link>
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button><Download className="w-4 h-4 mr-2" />Export</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><FileSpreadsheet className="w-4 h-4 mr-2" />Download Excel (.xlsx)</DropdownMenuItem>
                <DropdownMenuItem><FileSpreadsheet className="w-4 h-4 mr-2" />Download CSV (.csv)</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadJson}><FileJson className="w-4 h-4 mr-2" />Download JSON (.json)</DropdownMenuItem>
                <DropdownMenuItem><Archive className="w-4 h-4 mr-2" />Download All (ZIP)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-card"><CardContent className="py-4"><p className="text-sm text-muted-foreground">Documents</p><p className="text-2xl font-semibold">{mockRun.documents.length}</p></CardContent></Card>
          <Card className="shadow-card"><CardContent className="py-4"><p className="text-sm text-muted-foreground">Successful</p><p className="text-2xl font-semibold text-green-600">{completedDocs}</p></CardContent></Card>
          <Card className="shadow-card"><CardContent className="py-4"><p className="text-sm text-muted-foreground">Failed</p><p className="text-2xl font-semibold text-destructive">{failedDocs}</p></CardContent></Card>
          <Card className="shadow-card"><CardContent className="py-4"><p className="text-sm text-muted-foreground">Pages Processed</p><p className="text-2xl font-semibold">{totalPages}</p></CardContent></Card>
        </div>

        <Card className="shadow-card">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Output Formats Available</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="gap-1"><FileSpreadsheet className="w-3 h-3" />XLSX</Badge>
                  <Badge variant="secondary" className="gap-1"><FileJson className="w-3 h-3" />JSON</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">API Endpoint:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">/v1/jobs/{runId}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Documents</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockRun.documents.map((doc) => {
                const StatusIcon = statusIcons[doc.status as keyof typeof statusIcons];
                return (
                  <div key={doc.id} className={cn("flex items-center justify-between p-3 rounded-lg border", doc.status === "failed" && "border-destructive/30 bg-destructive/5")}>
                    <div className="flex items-center gap-3">
                      <StatusIcon className={cn("w-5 h-5", statusColors[doc.status as keyof typeof statusColors])} />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        {doc.status === "completed" ? <p className="text-xs text-muted-foreground">{doc.pages} pages</p> : doc.error && <p className="text-xs text-destructive">{doc.error}</p>}
                      </div>
                    </div>
                    {doc.status === "completed" && (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-1" />Preview</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleViewDocJson(doc.id)}><Code2 className="w-4 h-4 mr-1" />JSON</Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Extracted Data</CardTitle>
              <Tabs value={outputFormat} onValueChange={(v) => setOutputFormat(v as "spreadsheet" | "json")}>
                <TabsList className="h-8">
                  <TabsTrigger value="spreadsheet" className="text-xs px-3 h-7 gap-1"><FileSpreadsheet className="w-3.5 h-3.5" />Spreadsheet</TabsTrigger>
                  <TabsTrigger value="json" className="text-xs px-3 h-7 gap-1"><Code2 className="w-3.5 h-3.5" />JSON</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {outputFormat === "spreadsheet" ? (
              <Tabs value={activeSheet} onValueChange={setActiveSheet}>
                <TabsList className="mb-4">
                  <TabsTrigger value="invoices">Invoices ({mockRun.extractedData.invoices.length})</TabsTrigger>
                  <TabsTrigger value="lineItems">Line Items ({mockRun.extractedData.lineItems.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="invoices">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader><TableRow><TableHead>Invoice #</TableHead><TableHead>Date</TableHead><TableHead>Vendor</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Tax</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {mockRun.extractedData.invoices.map((row, i) => (
                          <TableRow key={i}><TableCell className="font-medium">{row.invoiceNumber}</TableCell><TableCell>{row.date}</TableCell><TableCell>{row.vendor}</TableCell><TableCell className="text-right">${row.amount.toFixed(2)}</TableCell><TableCell className="text-right">${row.tax.toFixed(2)}</TableCell><TableCell className="text-right font-medium">${row.total.toFixed(2)}</TableCell></TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                <TabsContent value="lineItems">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader><TableRow><TableHead>Invoice #</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Unit Price</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {mockRun.extractedData.lineItems.map((row, i) => (
                          <TableRow key={i}><TableCell className="font-medium">{row.invoiceNumber}</TableCell><TableCell>{row.description}</TableCell><TableCell className="text-right">{row.quantity}</TableCell><TableCell className="text-right">${row.unitPrice.toFixed(2)}</TableCell><TableCell className="text-right font-medium">${row.amount.toFixed(2)}</TableCell></TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Pretty-printed JSON output for all extracted data</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopyJson(JSON.stringify(mockRun.extractedData, null, 2))}><Copy className="w-4 h-4 mr-1" />Copy</Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadJson}><Download className="w-4 h-4 mr-1" />Download</Button>
                  </div>
                </div>
                <pre className="bg-muted rounded-lg p-4 text-sm overflow-auto max-h-[400px] font-mono">{JSON.stringify(mockRun.extractedData, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Run Details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Started</p><p className="font-medium">{mockRun.startedAt}</p></div>
              <div><p className="text-muted-foreground">Completed</p><p className="font-medium">{mockRun.completedAt}</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={jsonDialogOpen} onOpenChange={setJsonDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Code2 className="w-5 h-5" />Document JSON</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => selectedDocJson && handleCopyJson(selectedDocJson)}><Copy className="w-4 h-4 mr-1" />Copy</Button>
            </div>
            <pre className="bg-muted rounded-lg p-4 text-sm overflow-auto max-h-[50vh] font-mono">{selectedDocJson}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}