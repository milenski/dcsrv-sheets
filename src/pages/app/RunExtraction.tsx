import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Upload, 
  FileText,
  X,
  Play,
  Loader2,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsageBlockedBanner, UsageBlockedModal } from "@/components/app/UsageBlockedBanner";
import { OverageNotice } from "@/components/app/OverageWarning";
import { useUsage } from "@/hooks/useUsage";
import { cn } from "@/lib/utils";

// Mock templates
const mockTemplates = [
  { id: "1", name: "Invoice Extractor", sheets: 2, columns: 8 },
  { id: "2", name: "Bank Statement Parser", sheets: 1, columns: 5 },
  { id: "3", name: "Contract Summary", sheets: 3, columns: 12 },
];

interface UploadedFile {
  id: string;
  file: File;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
}

export default function RunExtraction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usage = useUsage();
  const [selectedTemplate, setSelectedTemplate] = useState(id || "");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overrideOutputMode, setOverrideOutputMode] = useState(false);
  const [overrideStoreData, setOverrideStoreData] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  const selectedTemplateData = mockTemplates.find(t => t.id === selectedTemplate);

  // Check if user is approaching limit (for paid plans)
  const isApproachingLimit = !usage.plan.isHardLimit && usage.usagePercentage >= 95;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (usage.isBlocked) {
      setShowBlockedModal(true);
      return;
    }
    
    const newFiles = Array.from(e.target.files || []).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "pending" as const,
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (usage.isBlocked) {
      setShowBlockedModal(true);
      return;
    }
    
    const newFiles = Array.from(e.dataTransfer.files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "pending" as const,
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const simulateProcessing = async () => {
    if (usage.isBlocked) {
      setShowBlockedModal(true);
      return;
    }
    
    setIsRunning(true);
    
    for (let i = 0; i < files.length; i++) {
      const fileId = files[i].id;
      
      // Set to processing
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: "processing" as const } : f
      ));

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ));
      }

      // Set to completed
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: "completed" as const } : f
      ));
    }

    // Navigate to results after a short delay
    await new Promise(resolve => setTimeout(resolve, 500));
    navigate("/app/runs/new-run-123");
  };

  const allFilesCompleted = files.length > 0 && files.every(f => f.status === "completed");
  const canStartProcessing = selectedTemplate && files.length > 0 && !isRunning && !usage.isBlocked;

  return (
    <div className="min-h-full bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/app")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Run Extraction</h1>
              <p className="text-sm text-muted-foreground">
                Upload documents and extract data using a template
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Usage Blocked Banner (Free plan at limit) */}
        {usage.isBlocked && (
          <UsageBlockedBanner
            usedTokens={usage.usedTokens}
            includedTokens={usage.includedTokens}
            resetDate={usage.resetDate}
          />
        )}

        {/* Overage Notice (Paid plans near/over limit) */}
        {!usage.isBlocked && isApproachingLimit && usage.plan.overagePrice && (
          <OverageNotice overagePrice={usage.plan.overagePrice} />
        )}

        {/* Template Selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Select Template</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {mockTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
                      <span>{template.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({template.sheets} sheets, {template.columns} columns)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTemplateData && (
              <div className="mt-4 p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Using <span className="font-medium text-foreground">{selectedTemplateData.name}</span> with {selectedTemplateData.sheets} sheets and {selectedTemplateData.columns} columns
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Upload Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drop zone */}
            <label 
              className={cn(
                "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg transition-colors",
                usage.isBlocked 
                  ? "opacity-50 cursor-not-allowed border-destructive/50" 
                  : isRunning 
                    ? "opacity-50 cursor-not-allowed" 
                    : "cursor-pointer hover:bg-muted/50"
              )}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex flex-col items-center justify-center py-6">
                {usage.isBlocked ? (
                  <>
                    <AlertTriangle className="w-8 h-8 mb-3 text-destructive" />
                    <p className="text-sm text-destructive font-medium">
                      Uploads disabled — usage limit reached
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-1 text-sm text-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, Word, Images (PNG, JPG)
                    </p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                multiple
                onChange={handleFileUpload}
                disabled={isRunning || usage.isBlocked}
              />
            </label>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((uploadedFile) => (
                  <div 
                    key={uploadedFile.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-9 h-9 rounded-lg bg-background border flex items-center justify-center shrink-0">
                      {uploadedFile.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : uploadedFile.status === "processing" ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{uploadedFile.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.file.size / 1024).toFixed(1)} KB
                      </p>
                      {uploadedFile.status === "processing" && (
                        <Progress value={uploadedFile.progress} className="h-1 mt-2" />
                      )}
                    </div>
                    {!isRunning && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="shrink-0"
                        onClick={() => removeFile(uploadedFile.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Options */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Options</CardTitle>
            <p className="text-sm text-muted-foreground">
              Override template defaults for this run
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label className="font-medium">Override output mode</Label>
                <p className="text-sm text-muted-foreground">
                  Create separate files instead of appending
                </p>
              </div>
              <Switch 
                checked={overrideOutputMode} 
                onCheckedChange={setOverrideOutputMode}
                disabled={isRunning}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <Label className="font-medium">Override data storage</Label>
                <p className="text-sm text-muted-foreground">
                  Don't store processed data for this run
                </p>
              </div>
              <Switch 
                checked={overrideStoreData} 
                onCheckedChange={setOverrideStoreData}
                disabled={isRunning}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate("/app")}
            disabled={isRunning}
          >
            Cancel
          </Button>
          
          {allFilesCompleted ? (
            <Button onClick={() => navigate("/app/runs/new-run-123")}>
              View Results
            </Button>
          ) : (
            <Button
              onClick={simulateProcessing}
              disabled={!canStartProcessing}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : usage.isBlocked ? (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Limit Reached
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Extraction ({files.length} {files.length === 1 ? "file" : "files"})
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Blocked Modal */}
      <UsageBlockedModal
        open={showBlockedModal}
        onOpenChange={setShowBlockedModal}
        usedTokens={usage.usedTokens}
        includedTokens={usage.includedTokens}
        resetDate={usage.resetDate}
      />
    </div>
  );
}
