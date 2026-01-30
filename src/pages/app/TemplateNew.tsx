import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  FileSpreadsheet,
  Loader2,
  X,
  Link2,
  SkipForward
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRole, canManageTemplates } from "@/hooks/useRole";
import { PermissionRequired } from "@/components/app/PermissionRequired";

const steps = [
  { id: 1, title: "Basics", description: "Name and settings" },
  { id: 2, title: "Upload Schema", description: "Upload Excel file" },
  { id: 3, title: "Select Sheets", description: "Choose sheets to use" },
  { id: 4, title: "Relationships", description: "Optional", optional: true },
  { id: 5, title: "Select Columns", description: "Choose columns per sheet" },
];

// Mock detected schema after upload
const mockDetectedSchema = {
  sheets: [
    { 
      id: "sheet1", 
      name: "Invoices", 
      columns: [
        { id: "col1", name: "Invoice Number" },
        { id: "col2", name: "Date" },
        { id: "col3", name: "Vendor" },
        { id: "col4", name: "Amount" },
        { id: "col5", name: "Tax" },
        { id: "col6", name: "Total" },
      ]
    },
    { 
      id: "sheet2", 
      name: "Line Items", 
      columns: [
        { id: "col7", name: "Invoice Number" },
        { id: "col8", name: "Description" },
        { id: "col9", name: "Quantity" },
        { id: "col10", name: "Unit Price" },
        { id: "col11", name: "Amount" },
      ]
    },
    { 
      id: "sheet3", 
      name: "Summary", 
      columns: [
        { id: "col12", name: "Total Invoices" },
        { id: "col13", name: "Total Amount" },
        { id: "col14", name: "Period" },
      ]
    },
  ]
};

interface SheetRelationship {
  type: "standalone" | "child";
  parentSheetId?: string;
}

export default function TemplateNew() {
  const navigate = useNavigate();
  const { role } = useRole();
  const canManage = canManageTemplates(role);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [detectedSchema, setDetectedSchema] = useState<typeof mockDetectedSchema | null>(null);

  // Form state
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [outputMode, setOutputMode] = useState<"new" | "append">("new");
  const [storeData, setStoreData] = useState(true);
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<Record<string, string[]>>({});
  const [sheetRelationships, setSheetRelationships] = useState<Record<string, SheetRelationship>>({});

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setDetectedSchema(mockDetectedSchema);
    setSelectedSheets(mockDetectedSchema.sheets.map(s => s.id));
    const initialColumns: Record<string, string[]> = {};
    const initialRelationships: Record<string, SheetRelationship> = {};
    mockDetectedSchema.sheets.forEach(sheet => {
      initialColumns[sheet.id] = sheet.columns.map(c => c.id);
      initialRelationships[sheet.id] = { type: "standalone" };
    });
    setSelectedColumns(initialColumns);
    setSheetRelationships(initialRelationships);
    setIsUploading(false);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setDetectedSchema(null);
    setSelectedSheets([]);
    setSelectedColumns({});
    setSheetRelationships({});
  };

  const toggleSheet = (sheetId: string) => {
    setSelectedSheets(prev => 
      prev.includes(sheetId) 
        ? prev.filter(id => id !== sheetId)
        : [...prev, sheetId]
    );
  };

  const toggleColumn = (sheetId: string, columnId: string) => {
    setSelectedColumns(prev => ({
      ...prev,
      [sheetId]: prev[sheetId]?.includes(columnId)
        ? prev[sheetId].filter(id => id !== columnId)
        : [...(prev[sheetId] || []), columnId]
    }));
  };

  const toggleAllColumns = (sheetId: string, columns: { id: string }[]) => {
    const allSelected = columns.every(c => selectedColumns[sheetId]?.includes(c.id));
    setSelectedColumns(prev => ({
      ...prev,
      [sheetId]: allSelected ? [] : columns.map(c => c.id)
    }));
  };

  const updateSheetRelationship = (sheetId: string, relationship: SheetRelationship) => {
    setSheetRelationships(prev => ({
      ...prev,
      [sheetId]: relationship
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return templateName.trim().length > 0;
      case 2: return detectedSchema !== null;
      case 3: return selectedSheets.length > 0;
      case 4: return true; // Optional step, always can proceed
      case 5: return selectedSheets.some(sheetId => 
        (selectedColumns[sheetId]?.length || 0) > 0
      );
      default: return false;
    }
  };

  const handleCreate = () => {
    // TODO: Actually create the template
    navigate("/app/templates/1");
  };

  const totalSelectedColumns = Object.values(selectedColumns).flat().length;
  const childSheets = Object.entries(sheetRelationships).filter(([_, rel]) => rel.type === "child").length;

  if (!canManage) {
    return (
      <PermissionRequired
        description="Only Owners and Admins can create templates. Members can run extractions and view results."
        actions={
          <Button asChild variant="outline">
            <Link to="/app/templates">Back to Templates</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="min-h-full bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/app/templates")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Create Template</h1>
              <p className="text-sm text-muted-foreground">
                Set up a new extraction template
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b bg-background">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep > step.id 
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}>
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className={cn(
                      "text-sm font-medium flex items-center gap-1.5",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                      {step.optional && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          Optional
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-8 lg:w-16 h-0.5 mx-2 lg:mx-4",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Step 1: Basics */}
        {currentStep === 1 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Template Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Invoice Extractor"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this template extracts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label>Output Mode</Label>
                <RadioGroup value={outputMode} onValueChange={(v) => setOutputMode(v as "new" | "append")}>
                  <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="new" id="new" className="mt-1" />
                    <div>
                      <Label htmlFor="new" className="font-medium cursor-pointer">
                        Create new Excel file per document
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Each uploaded document generates its own Excel file
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="append" id="append" className="mt-1" />
                    <div>
                      <Label htmlFor="append" className="font-medium cursor-pointer">
                        Append rows into a single workbook
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        All documents are combined into one Excel file
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="font-medium">Store processed data</Label>
                  <p className="text-sm text-muted-foreground">
                    Save extracted data in the system for future reference
                  </p>
                </div>
                <Switch checked={storeData} onCheckedChange={setStoreData} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Upload Schema */}
        {currentStep === 2 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Upload Excel Schema</CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Excel files (.xlsx, .xls)
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                </label>
              ) : (
                <div className="space-y-6">
                  {/* Uploaded file display */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {isUploading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="ml-3 text-muted-foreground">Analyzing schema...</span>
                    </div>
                  ) : detectedSchema && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Check className="w-4 h-4" />
                        <span>Detected {detectedSchema.sheets.length} sheets</span>
                      </div>

                      <div className="grid gap-3">
                        {detectedSchema.sheets.map((sheet) => (
                          <div 
                            key={sheet.id}
                            className="p-4 rounded-lg border bg-background"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{sheet.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {sheet.columns.length} columns
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {sheet.columns.slice(0, 5).map((col) => (
                                <span 
                                  key={col.id}
                                  className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground"
                                >
                                  {col.name}
                                </span>
                              ))}
                              {sheet.columns.length > 5 && (
                                <span className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground">
                                  +{sheet.columns.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Sheets */}
        {currentStep === 3 && detectedSchema && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Select Sheets</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose which sheets to include in this template
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {detectedSchema.sheets.map((sheet) => (
                  <div 
                    key={sheet.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer",
                      selectedSheets.includes(sheet.id) 
                        ? "border-primary bg-accent/50" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => toggleSheet(sheet.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={selectedSheets.includes(sheet.id)}
                        onCheckedChange={() => toggleSheet(sheet.id)}
                      />
                      <div>
                        <p className="font-medium">{sheet.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {sheet.columns.length} columns available
                        </p>
                      </div>
                    </div>
                    <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{selectedSheets.length}</span> of {detectedSchema.sheets.length} sheets selected
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Sheet Relationships (Optional) */}
        {currentStep === 4 && detectedSchema && (
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" />
                <CardTitle>Sheet Relationships</CardTitle>
                <Badge variant="secondary">Optional</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Define relationships between sheets for complex document structures (e.g., invoices with line items).
                This step can be skipped.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {detectedSchema.sheets
                  .filter(sheet => selectedSheets.includes(sheet.id))
                  .map((sheet) => {
                    const relationship = sheetRelationships[sheet.id] || { type: "standalone" };
                    const availableParents = detectedSchema.sheets.filter(
                      s => selectedSheets.includes(s.id) && s.id !== sheet.id
                    );
                    const parentSheet = availableParents.find(s => s.id === relationship.parentSheetId);

                    return (
                      <div 
                        key={sheet.id}
                        className="p-4 rounded-lg border bg-background space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">{sheet.name}</span>
                          </div>
                          {relationship.type === "child" && parentSheet && (
                            <Badge variant="secondary" className="gap-1">
                              <Link2 className="w-3 h-3" />
                              Child of {parentSheet.name}
                            </Badge>
                          )}
                        </div>

                        <RadioGroup 
                          value={relationship.type} 
                          onValueChange={(v) => updateSheetRelationship(sheet.id, { 
                            type: v as "standalone" | "child",
                            parentSheetId: v === "child" ? relationship.parentSheetId : undefined
                          })}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standalone" id={`standalone-${sheet.id}`} />
                            <Label htmlFor={`standalone-${sheet.id}`} className="cursor-pointer">
                              Standalone sheet
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value="child" 
                              id={`child-${sheet.id}`}
                              disabled={availableParents.length === 0}
                            />
                            <Label 
                              htmlFor={`child-${sheet.id}`} 
                              className={cn(
                                "cursor-pointer",
                                availableParents.length === 0 && "text-muted-foreground"
                              )}
                            >
                              Child sheet
                            </Label>
                          </div>
                        </RadioGroup>

                        {relationship.type === "child" && (
                          <div className="pl-6 space-y-2">
                            <Label>Parent (master) sheet</Label>
                            <Select 
                              value={relationship.parentSheetId} 
                              onValueChange={(parentId) => updateSheetRelationship(sheet.id, {
                                ...relationship,
                                parentSheetId: parentId
                              })}
                            >
                              <SelectTrigger className="w-full max-w-xs">
                                <SelectValue placeholder="Select parent sheet" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableParents.map((parent) => (
                                  <SelectItem key={parent.id} value={parent.id}>
                                    {parent.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              Relationship type: <Badge variant="outline" className="text-xs ml-1">One-to-many</Badge>
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {childSheets > 0 ? (
                    <>
                      <span className="font-medium text-foreground">{childSheets}</span> child sheet{childSheets !== 1 ? "s" : ""} configured
                    </>
                  ) : (
                    "No relationships configured (all standalone)"
                  )}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentStep(5)}
                  className="gap-1"
                >
                  <SkipForward className="w-4 h-4" />
                  Skip this step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Select Columns */}
        {currentStep === 5 && detectedSchema && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Select Columns</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose which columns to extract for each sheet
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={selectedSheets} className="space-y-3">
                {detectedSchema.sheets
                  .filter(sheet => selectedSheets.includes(sheet.id))
                  .map((sheet) => {
                    const relationship = sheetRelationships[sheet.id];
                    const parentSheet = relationship?.type === "child" && relationship.parentSheetId
                      ? detectedSchema.sheets.find(s => s.id === relationship.parentSheetId)
                      : null;

                    return (
                      <AccordionItem 
                        key={sheet.id} 
                        value={sheet.id}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">{sheet.name}</span>
                            <span className="text-sm text-muted-foreground">
                              ({selectedColumns[sheet.id]?.length || 0} / {sheet.columns.length} selected)
                            </span>
                            {parentSheet && (
                              <Badge variant="secondary" className="text-xs gap-1">
                                <Link2 className="w-3 h-3" />
                                Child of {parentSheet.name}
                              </Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between pb-2 border-b">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleAllColumns(sheet.id, sheet.columns)}
                              >
                                {sheet.columns.every(c => selectedColumns[sheet.id]?.includes(c.id))
                                  ? "Deselect all"
                                  : "Select all"
                                }
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {sheet.columns.map((column) => (
                                <div 
                                  key={column.id}
                                  className={cn(
                                    "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                                    selectedColumns[sheet.id]?.includes(column.id)
                                      ? "bg-accent"
                                      : "hover:bg-muted/50"
                                  )}
                                  onClick={() => toggleColumn(sheet.id, column.id)}
                                >
                                  <Checkbox 
                                    checked={selectedColumns[sheet.id]?.includes(column.id)}
                                    onCheckedChange={() => toggleColumn(sheet.id, column.id)}
                                  />
                                  <span className="text-sm">{column.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
              </Accordion>

              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{totalSelectedColumns}</span> columns selected across {selectedSheets.length} sheets
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
            >
              {currentStep === 4 ? (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={!canProceed()}
            >
              <Check className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
