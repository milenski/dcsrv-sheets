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
  SkipForward,
  PenLine,
  Plus,
  Trash2,
  GripVertical
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

type CreationMode = "excel" | "manual" | null;

const excelSteps = [
  { id: 1, title: "Basics", description: "Name and settings" },
  { id: 2, title: "Upload Schema", description: "Upload Excel file" },
  { id: 3, title: "Select Sheets", description: "Choose sheets to use" },
  { id: 4, title: "Sheet relationships", description: "Link related sheets" },
  { id: 5, title: "Select Columns", description: "Choose columns per sheet" },
];

const manualSteps = [
  { id: 1, title: "Basics", description: "Name and settings" },
  { id: 2, title: "Define Objects", description: "Create data objects" },
  { id: 3, title: "Define Fields", description: "Add fields to objects" },
  { id: 4, title: "Relationships", description: "Link related objects" },
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

interface ManualObject {
  id: string;
  name: string;
  prompt: string;
  fields: ManualField[];
}

interface ManualField {
  id: string;
  name: string;
  type: string;
  prompt: string;
}

interface ManualRelationship {
  childObjectId: string;
  parentObjectId: string;
  linkField: string;
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "currency", label: "Currency" },
  { value: "boolean", label: "Yes / No" },
];

let nextObjectId = 1;
let nextFieldId = 1;

export default function TemplateNew() {
  const navigate = useNavigate();
  const { role } = useRole();
  const canManage = canManageTemplates(role);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [creationMode, setCreationMode] = useState<CreationMode>(null);
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

  // Manual mode state
  const [manualObjects, setManualObjects] = useState<ManualObject[]>([]);
  const [manualRelationships, setManualRelationships] = useState<ManualRelationship[]>([]);

  const steps = creationMode === "manual" ? manualSteps : excelSteps;
  const totalSteps = steps.length;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);

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

  // Manual mode helpers
  const addManualObject = () => {
    const id = `obj_${nextObjectId++}`;
    setManualObjects(prev => [...prev, { id, name: "", prompt: "", fields: [] }]);
  };

  const updateManualObject = (id: string, updates: Partial<ManualObject>) => {
    setManualObjects(prev => prev.map(obj => obj.id === id ? { ...obj, ...updates } : obj));
  };

  const removeManualObject = (id: string) => {
    setManualObjects(prev => prev.filter(obj => obj.id !== id));
    setManualRelationships(prev => prev.filter(r => r.childObjectId !== id && r.parentObjectId !== id));
  };

  const addFieldToObject = (objectId: string) => {
    const fieldId = `field_${nextFieldId++}`;
    setManualObjects(prev => prev.map(obj => 
      obj.id === objectId 
        ? { ...obj, fields: [...obj.fields, { id: fieldId, name: "", type: "text", prompt: "" }] }
        : obj
    ));
  };

  const updateField = (objectId: string, fieldId: string, updates: Partial<ManualField>) => {
    setManualObjects(prev => prev.map(obj => 
      obj.id === objectId 
        ? { ...obj, fields: obj.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f) }
        : obj
    ));
  };

  const removeField = (objectId: string, fieldId: string) => {
    setManualObjects(prev => prev.map(obj => 
      obj.id === objectId 
        ? { ...obj, fields: obj.fields.filter(f => f.id !== fieldId) }
        : obj
    ));
  };

  const addManualRelationship = () => {
    setManualRelationships(prev => [...prev, { childObjectId: "", parentObjectId: "", linkField: "" }]);
  };

  const updateManualRelationship = (index: number, updates: Partial<ManualRelationship>) => {
    setManualRelationships(prev => prev.map((r, i) => i === index ? { ...r, ...updates } : r));
  };

  const removeManualRelationship = (index: number) => {
    setManualRelationships(prev => prev.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    if (currentStep === 1) return templateName.trim().length > 0;

    if (creationMode === "excel") {
      switch (currentStep) {
        case 2: return detectedSchema !== null;
        case 3: return selectedSheets.length > 0;
        case 4: return true;
        case 5: return selectedSheets.some(sheetId => (selectedColumns[sheetId]?.length || 0) > 0);
        default: return false;
      }
    }

    if (creationMode === "manual") {
      switch (currentStep) {
        case 2: return manualObjects.length > 0 && manualObjects.every(o => o.name.trim().length > 0);
        case 3: return manualObjects.some(o => o.fields.length > 0 && o.fields.every(f => f.name.trim().length > 0));
        case 4: return true;
        default: return false;
      }
    }

    return false;
  };

  const handleCreate = () => {
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

  // If no creation mode selected, show mode selection screen
  if (!creationMode) {
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

        {/* Mode Selection */}
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Choose how to create your template</h2>
            <p className="text-sm text-muted-foreground">
              Both options produce the same result — pick what fits your workflow best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card A: Excel */}
            <Card 
              className="cursor-pointer transition-all hover:shadow-md relative hover:border-muted-foreground/30"
              onClick={() => setCreationMode("excel")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                <CardTitle className="text-lg mt-3">Upload Excel schema</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Start from a spreadsheet that defines your desired output structure.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Define sheets, columns, and relationships visually</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Fastest way to get a working template</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Ideal for invoices, statements, reports, and tabular data</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground border-t pt-3">
                  You can still edit prompts, relationships, and fields manually after this step.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreationMode("excel");
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Excel file
                </Button>
              </CardContent>
            </Card>

            {/* Card B: Manual */}
            <Card 
              className="cursor-pointer transition-all hover:shadow-md hover:border-muted-foreground/30"
              onClick={() => setCreationMode("manual")}
            >
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg mt-3">Create template manually</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Define your structure from scratch using prompts and custom objects.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Create objects one by one (similar to sheets)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Define fields, prompts, and relationships explicitly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Best for APIs, dynamic schemas, and advanced use cases</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground border-t pt-3">
                  This works like DocServant for Salesforce — but fully customizable.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreationMode("manual");
                  }}
                >
                  <PenLine className="w-4 h-4 mr-2" />
                  Create manually
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            You're not locked in — you can add Excel schemas later or continue editing everything manually.
          </p>
        </div>
      </div>
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
                      "text-sm font-medium",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
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

        {/* ==================== EXCEL PATH ==================== */}

        {/* Excel Step 2: Upload Schema */}
        {currentStep === 2 && creationMode === "excel" && (
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
                          <div key={sheet.id} className="p-4 rounded-lg border bg-background">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{sheet.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {sheet.columns.length} columns
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {sheet.columns.slice(0, 5).map((col) => (
                                <span key={col.id} className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground">
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

        {/* Excel Step 3: Select Sheets */}
        {currentStep === 3 && creationMode === "excel" && detectedSchema && (
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

        {/* Excel Step 4: Sheet Relationships */}
        {currentStep === 4 && creationMode === "excel" && detectedSchema && (
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-muted-foreground" />
                  <CardTitle>Sheet relationships</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Link related sheets for structured, multi-row data
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Use this step to define how data from different sheets is related.</p>
                  <p>This is useful when one sheet contains main records, and another contains multiple related rows.</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-muted space-y-3">
                  <p className="text-sm font-medium text-foreground">Common example: invoices</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-foreground">Invoices</span>
                      <span>— main sheet</span>
                    </div>
                    <p className="pl-4 text-xs">One row per invoice (number, date, vendor, total)</p>
                    <div className="flex items-start gap-2 mt-2">
                      <span className="font-medium text-foreground">Line items</span>
                      <span>— related sheet</span>
                    </div>
                    <p className="pl-4 text-xs">Multiple rows per invoice (description, quantity, price)</p>
                  </div>
                  <p className="text-xs text-muted-foreground italic pt-1">
                    Each invoice can have many line items.
                  </p>
                </div>

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
                        <div key={sheet.id} className="p-4 rounded-lg border bg-background space-y-4">
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
                                Child sheet (related)
                              </Label>
                            </div>
                          </RadioGroup>

                          {relationship.type === "child" && (
                            <div className="pl-6 space-y-3 border-l-2 border-primary/20 ml-2">
                              <div className="space-y-1.5">
                                <Label>Parent (master) sheet</Label>
                                <p className="text-xs text-muted-foreground">
                                  Select the sheet that contains the main record (e.g. Invoices)
                                </p>
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
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Relationship type:</span>
                                <Badge variant="outline" className="text-xs">One-to-many</Badge>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

                <p className="text-sm text-muted-foreground">
                  During extraction, DocServant will group related rows under their parent record and return structured output.
                </p>

                <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
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

            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>Most templates don't need this step.</p>
              <p>If your data fits in a single sheet, you can safely skip it.</p>
            </div>
          </div>
        )}

        {/* Excel Step 5: Select Columns */}
        {currentStep === 5 && creationMode === "excel" && detectedSchema && (
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

        {/* ==================== MANUAL PATH ==================== */}

        {/* Manual Step 2: Define Objects */}
        {currentStep === 2 && creationMode === "manual" && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Define Objects</CardTitle>
              <p className="text-sm text-muted-foreground">
                Objects represent groups of data you want to extract — similar to sheets in a spreadsheet.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {manualObjects.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground space-y-3">
                  <p>No objects defined yet.</p>
                  <p className="text-xs">Start by adding your first object — for example, "Invoices" or "Contacts".</p>
                </div>
              )}

              {manualObjects.map((obj) => (
                <div key={obj.id} className="p-4 rounded-lg border bg-background space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Object</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeManualObject(obj.id)}>
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Object name *</Label>
                    <Input 
                      placeholder="e.g., Invoices, Line Items, Contacts" 
                      value={obj.name} 
                      onChange={(e) => updateManualObject(obj.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Extraction prompt (optional)</Label>
                    <Textarea 
                      placeholder="Describe what this object represents and how to extract it..."
                      value={obj.prompt}
                      onChange={(e) => updateManualObject(obj.id, { prompt: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full" onClick={addManualObject}>
                <Plus className="w-4 h-4 mr-2" />
                Add object
              </Button>

              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{manualObjects.length}</span> object{manualObjects.length !== 1 ? "s" : ""} defined
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Step 3: Define Fields */}
        {currentStep === 3 && creationMode === "manual" && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Define Fields</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add fields to each object — these become columns in your extracted output.
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={manualObjects.map(o => o.id)} className="space-y-3">
                {manualObjects.map((obj) => (
                  <AccordionItem key={obj.id} value={obj.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{obj.name || "Unnamed object"}</span>
                        <span className="text-sm text-muted-foreground">
                          ({obj.fields.length} field{obj.fields.length !== 1 ? "s" : ""})
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-3">
                      {obj.fields.map((field) => (
                        <div key={field.id} className="p-3 rounded-md border bg-muted/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Field</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeField(obj.id, field.id)}>
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Field name *</Label>
                              <Input 
                                placeholder="e.g., Invoice Number" 
                                value={field.name}
                                onChange={(e) => updateField(obj.id, field.id, { name: e.target.value })}
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">Type</Label>
                              <Select value={field.type} onValueChange={(v) => updateField(obj.id, field.id, { type: v })}>
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldTypes.map(ft => (
                                    <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">Extraction prompt (optional)</Label>
                            <Input 
                              placeholder="Describe how to extract this field..."
                              value={field.prompt}
                              onChange={(e) => updateField(obj.id, field.id, { prompt: e.target.value })}
                              className="h-9"
                            />
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addFieldToObject(obj.id)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add field
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Manual Step 4: Relationships */}
        {currentStep === 4 && creationMode === "manual" && (
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-muted-foreground" />
                  <CardTitle>Object relationships</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Link related objects for structured, multi-row data
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Define how your objects relate to each other.</p>
                  <p>This is useful when one object contains main records and another contains multiple related rows.</p>
                </div>

                {manualRelationships.length === 0 && (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    <p>No relationships defined.</p>
                    <p className="text-xs mt-1">If your objects are independent, you can skip this step.</p>
                  </div>
                )}

                {manualRelationships.map((rel, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-background space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Relationship {index + 1}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeManualRelationship(index)}>
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Parent (master) object</Label>
                        <p className="text-xs text-muted-foreground">Contains the main record</p>
                        <Select value={rel.parentObjectId} onValueChange={(v) => updateManualRelationship(index, { parentObjectId: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent object" />
                          </SelectTrigger>
                          <SelectContent>
                            {manualObjects.filter(o => o.id !== rel.childObjectId).map(o => (
                              <SelectItem key={o.id} value={o.id}>{o.name || "Unnamed"}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Child (related) object</Label>
                        <p className="text-xs text-muted-foreground">Contains repeated rows</p>
                        <Select value={rel.childObjectId} onValueChange={(v) => updateManualRelationship(index, { childObjectId: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select child object" />
                          </SelectTrigger>
                          <SelectContent>
                            {manualObjects.filter(o => o.id !== rel.parentObjectId).map(o => (
                              <SelectItem key={o.id} value={o.id}>{o.name || "Unnamed"}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Link field</Label>
                      <p className="text-xs text-muted-foreground">
                        Choose the column used to link records (e.g. Invoice number)
                      </p>
                      <Input 
                        placeholder="e.g., Invoice Number" 
                        value={rel.linkField}
                        onChange={(e) => updateManualRelationship(index, { linkField: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Relationship type:</span>
                      <Badge variant="outline" className="text-xs">One-to-many</Badge>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full" onClick={addManualRelationship} disabled={manualObjects.length < 2}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add relationship
                </Button>

                <p className="text-sm text-muted-foreground">
                  During extraction, DocServant will group related rows under their parent record and return structured output.
                </p>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>Most templates don't need relationships.</p>
              <p>If your objects are independent, you can safely skip this step.</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep === 1) {
                setCreationMode(null);
              } else {
                setCurrentStep(prev => prev - 1);
              }
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
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
