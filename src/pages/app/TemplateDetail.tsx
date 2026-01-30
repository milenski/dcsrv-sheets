import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Play, 
  Settings, 
  FileSpreadsheet,
  Pencil,
  Trash2,
  MoreHorizontal,
  Check,
  X,
  ChevronRight,
  MessageSquare,
  Code2,
  ExternalLink,
  Copy,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useApiAccess } from "@/hooks/useApiAccess";
import { useUsage } from "@/hooks/useUsage";
import { planHasApi } from "@/lib/plans";
import { useRole, canManageTemplates } from "@/hooks/useRole";
import { PermissionRequired } from "@/components/app/PermissionRequired";
import { ChangeOutputModeDialog } from "@/components/app/templates/ChangeOutputModeDialog";
import { DuplicateTemplateDialog } from "@/components/app/templates/DuplicateTemplateDialog";
import { TemplateDataTab } from "@/components/app/templates/TemplateDataTab";
import { toast } from "sonner";

// Mock template data
const mockTemplate = {
  id: "1",
  name: "Invoice Extractor",
  description: "Extract invoice data including amounts, dates, and vendor info",
  outputMode: "new" as "new" | "append",
  storeData: true,
  apiAccess: "inherit" as "inherit" | "enabled" | "disabled",
  prompt: "You are extracting invoice data. Be precise with numbers and dates. Always verify totals match line items.",
  sheets: [
    { 
      id: "sheet1", 
      name: "Invoices", 
      enabled: true,
      prompt: "Focus on header-level invoice information.",
      relationship: { type: "standalone" as const },
      columns: [
        { id: "col1", name: "Invoice Number", enabled: true, prompt: "" },
        { id: "col2", name: "Date", enabled: true, prompt: "Extract the invoice date in YYYY-MM-DD format." },
        { id: "col3", name: "Vendor", enabled: true, prompt: "" },
        { id: "col4", name: "Amount", enabled: true, prompt: "Extract the subtotal before tax." },
        { id: "col5", name: "Tax", enabled: true, prompt: "" },
        { id: "col6", name: "Total", enabled: true, prompt: "" },
      ]
    },
    { 
      id: "sheet2", 
      name: "Line Items", 
      enabled: true,
      prompt: "",
      relationship: { type: "child" as const, parentSheetId: "sheet1" },
      columns: [
        { id: "col7", name: "Invoice Number", enabled: true, prompt: "" },
        { id: "col8", name: "Description", enabled: true, prompt: "" },
        { id: "col9", name: "Quantity", enabled: false, prompt: "" },
        { id: "col10", name: "Unit Price", enabled: true, prompt: "" },
        { id: "col11", name: "Amount", enabled: true, prompt: "" },
      ]
    },
  ],
  lastRun: "2 hours ago",
  runsCount: 24,
  createdAt: "Jan 5, 2026",
  updatedAt: "Jan 10, 2026",
};

export default function TemplateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiEnabled } = useApiAccess();
  const usage = useUsage();
  const apiAllowedByPlan = planHasApi(usage.plan);
  const { role } = useRole();
  const canManage = canManageTemplates(role);
  const [template, setTemplate] = useState(mockTemplate);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(template.name);
  const [templatePrompt, setTemplatePrompt] = useState(template.prompt);
  const [templateApiAccess, setTemplateApiAccess] = useState<"inherit" | "enabled" | "disabled">(template.apiAccess);
  const [showOutputModeDialog, setShowOutputModeDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  // Permission guard for Members
  if (!canManage) {
    return (
      <PermissionRequired
        description="Only Owners and Admins can edit templates. Members can run extractions and view results."
        actions={
          <Button asChild variant="outline">
            <Link to="/app/templates">Back to Templates</Link>
          </Button>
        }
      />
    );
  }

  const enabledSheets = template.sheets.filter(s => s.enabled);
  const totalColumns = template.sheets.flatMap(s => s.columns).filter(c => c.enabled).length;

  const getEffectiveApiStatus = () => {
    if (!apiEnabled) return { enabled: false, label: "Off (account disabled)" };
    if (templateApiAccess === "enabled") return { enabled: true, label: "Enabled" };
    if (templateApiAccess === "disabled") return { enabled: false, label: "Disabled" };
    return { enabled: apiEnabled, label: apiEnabled ? "On (inherited)" : "Off (inherited)" };
  };

  const handleSaveName = () => {
    setTemplate(prev => ({ ...prev, name: editedName }));
    setIsEditingName(false);
  };

  const toggleSheet = (sheetId: string) => {
    setTemplate(prev => ({
      ...prev,
      sheets: prev.sheets.map(s => 
        s.id === sheetId ? { ...s, enabled: !s.enabled } : s
      )
    }));
  };

  const handleOutputModeChange = (newMode: "new" | "append") => {
    setTemplate(prev => ({ ...prev, outputMode: newMode }));
    toast.success("Output mode updated successfully");
  };

  const handleDuplicate = (options: { name: string; duplicateSheets: boolean; duplicatePrompts: boolean }) => {
    // TODO: Actually create the duplicate
    toast.success(`Template "${options.name}" created as draft`);
    // Navigate to the new template (mock)
    navigate("/app/templates/2");
  };

  const getParentSheetName = (parentId?: string) => {
    if (!parentId) return null;
    return template.sheets.find(s => s.id === parentId)?.name;
  };

  return (
    <div className="min-h-full bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/app/templates")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-9 w-64"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" onClick={handleSaveName}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setIsEditingName(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">{template.name}</h1>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setIsEditingName(true)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate(`/app/templates/${id}/run`)}>
                <Play className="w-4 h-4 mr-2" />
                Run Extraction
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowDuplicateDialog(true)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate template
                  </DropdownMenuItem>
                  <DropdownMenuItem>Export configuration</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete template
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete template?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{template.name}" and all its configuration.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => navigate("/app/templates")}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span>{enabledSheets.length} sheets</span>
            <span>•</span>
            <span>{totalColumns} columns</span>
            <span>•</span>
            <span>Last run {template.lastRun}</span>
            <span>•</span>
            <span>{template.runsCount} total runs</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sheets">Sheets</TabsTrigger>
            <TabsTrigger value="data" className="gap-1">
              <Database className="w-4 h-4" />
              Data
            </TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="shadow-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Template Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Description</Label>
                    <p className="text-foreground mt-1">
                      {template.description || "No description provided."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <Label className="text-muted-foreground text-sm">Output Mode</Label>
                      <p className="text-foreground mt-1">
                        {template.outputMode === "new" 
                          ? "New file per document" 
                          : "Append to single workbook"
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Store Data</Label>
                      <p className="text-foreground mt-1">
                        {template.storeData ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    onClick={() => navigate(`/app/templates/${id}/run`)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run Extraction
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {}}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Edit Prompts
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {}}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Enabled Sheets */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Enabled Sheets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {enabledSheets.map((sheet) => {
                    const enabledCols = sheet.columns.filter(c => c.enabled).length;
                    const parentName = sheet.relationship.type === "child" 
                      ? getParentSheetName(sheet.relationship.parentSheetId)
                      : null;
                    return (
                      <Link
                        key={sheet.id}
                        to={`/app/templates/${id}/sheets/${sheet.id}`}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{sheet.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {enabledCols} columns enabled
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {parentName && (
                            <Badge variant="secondary" className="text-xs">
                              Child of {parentName}
                            </Badge>
                          )}
                          {sheet.prompt && (
                            <Badge variant="secondary" className="text-xs">
                              Has prompt
                            </Badge>
                          )}
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sheets Tab */}
          <TabsContent value="sheets" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">All Sheets</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {enabledSheets.length} of {template.sheets.length} enabled
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {template.sheets.map((sheet) => {
                    const enabledCols = sheet.columns.filter(c => c.enabled).length;
                    const parentName = sheet.relationship.type === "child" 
                      ? getParentSheetName(sheet.relationship.parentSheetId)
                      : null;
                    return (
                      <div
                        key={sheet.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border transition-colors",
                          sheet.enabled ? "bg-background" : "bg-muted/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Switch 
                            checked={sheet.enabled}
                            onCheckedChange={() => toggleSheet(sheet.id)}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={cn(
                                "font-medium",
                                !sheet.enabled && "text-muted-foreground"
                              )}>
                                {sheet.name}
                              </p>
                              {parentName && (
                                <Badge variant="secondary" className="text-xs">
                                  Child of {parentName}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {enabledCols} / {sheet.columns.length} columns
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          asChild
                        >
                          <Link to={`/app/templates/${id}/sheets/${sheet.id}`}>
                            Configure
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <TemplateDataTab 
              storeDataEnabled={template.storeData}
              sheets={template.sheets}
            />
          </TabsContent>

          {/* Prompts Tab */}
          <TabsContent value="prompts" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Template-Level Prompt</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Global instructions applied to all extractions using this template
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={templatePrompt}
                  onChange={(e) => setTemplatePrompt(e.target.value)}
                  placeholder="Enter global instructions for the AI..."
                  rows={4}
                />
                <Button className="mt-4" size="sm">Save Prompt</Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Sheet & Column Prompts</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Click on a sheet to configure its specific prompts
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {template.sheets.filter(s => s.enabled).map((sheet) => {
                    const columnsWithPrompts = sheet.columns.filter(c => c.enabled && c.prompt).length;
                    return (
                      <Link
                        key={sheet.id}
                        to={`/app/templates/${id}/sheets/${sheet.id}`}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{sheet.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            {sheet.prompt ? (
                              <Badge variant="default" className="text-xs">Sheet prompt set</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">No sheet prompt</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {columnsWithPrompts} column prompts
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Template Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input 
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    defaultValue={template.description}
                    placeholder="Describe what this template extracts..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label className="font-medium">Output Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      {template.outputMode === "new" 
                        ? "Create new Excel file per document" 
                        : "Append rows into a single workbook"
                      }
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowOutputModeDialog(true)}>
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label className="font-medium">Store processed data</Label>
                    <p className="text-sm text-muted-foreground">
                      Save extracted data in the system for future reference
                    </p>
                  </div>
                  <Switch defaultChecked={template.storeData} />
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Integrations (API) Section */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">Integrations (API)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="font-medium">API access for this template</Label>
                  
                  {!apiEnabled ? (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Account-level API access is disabled. Enable it first to configure template-level API settings.
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/app/developers" className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Enable in Developers
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Select 
                        value={templateApiAccess} 
                        onValueChange={(value: "inherit" | "enabled" | "disabled") => setTemplateApiAccess(value)}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inherit">
                            Inherit from account (currently {apiEnabled ? "On" : "Off"})
                          </SelectItem>
                        <SelectItem value="enabled" disabled={!apiAllowedByPlan}>
                          Enabled
                        </SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>

                    {!apiAllowedByPlan && (
                      <p className="text-sm text-muted-foreground">
                        API access isn't available on your current plan. Upgrade to enable API integrations for this template.
                      </p>
                    )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Effective status:</span>
                        <Badge variant={getEffectiveApiStatus().enabled ? "default" : "secondary"}>
                          {getEffectiveApiStatus().label}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Webhook notifications are configured at account level. 
                    Webhook payloads include <code className="bg-muted px-1 py-0.5 rounded text-xs">templateId</code> so 
                    you can route internally.
                  </p>
                  <Button variant="link" size="sm" asChild className="px-0 mt-2">
                    <Link to="/app/developers">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Configure webhooks
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-destructive/20">
              <CardHeader>
                <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete this template</p>
                    <p className="text-sm text-muted-foreground">
                      Once deleted, this template cannot be recovered
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Template</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete template?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{template.name}" and all its configuration.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => navigate("/app/templates")}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <ChangeOutputModeDialog
        open={showOutputModeDialog}
        onOpenChange={setShowOutputModeDialog}
        currentMode={template.outputMode}
        storeDataEnabled={template.storeData}
        onConfirm={handleOutputModeChange}
      />

      <DuplicateTemplateDialog
        open={showDuplicateDialog}
        onOpenChange={setShowDuplicateDialog}
        templateName={template.name}
        onConfirm={handleDuplicate}
      />
    </div>
  );
}
