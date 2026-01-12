import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Check,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Mock data
const mockColumn = {
  id: "col2",
  name: "Date",
  enabled: true,
  prompt: "Extract the invoice date in YYYY-MM-DD format.",
};

const mockInheritedPrompts = {
  template: "You are extracting invoice data. Be precise with numbers and dates. Always verify totals match line items.",
  sheet: "Focus on header-level invoice information. Be precise with dates and currency values.",
};

export default function ColumnEditor() {
  const { id, sheetId, columnId } = useParams();
  const navigate = useNavigate();
  const [column, setColumn] = useState(mockColumn);
  const [columnPrompt, setColumnPrompt] = useState(column.prompt);

  const effectivePrompt = [
    mockInheritedPrompts.template,
    mockInheritedPrompts.sheet,
    columnPrompt
  ].filter(Boolean).join("\n\n---\n\n");

  const handleReset = () => {
    setColumnPrompt("");
  };

  return (
    <div className="min-h-full bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(`/app/templates/${id}/sheets/${sheetId}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Link to={`/app/templates/${id}`} className="hover:text-foreground">
                  Invoice Extractor
                </Link>
                <ChevronRight className="w-3 h-3" />
                <Link to={`/app/templates/${id}/sheets/${sheetId}`} className="hover:text-foreground">
                  Invoices
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span>Columns</span>
              </div>
              <h1 className="text-xl font-semibold">{column.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Column Toggle */}
        <Card className="shadow-card">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Column Status</p>
                <p className="text-sm text-muted-foreground">
                  {column.enabled ? "This column will be extracted" : "This column is disabled"}
                </p>
              </div>
              <Switch 
                checked={column.enabled}
                onCheckedChange={(checked) => setColumn(prev => ({ ...prev, enabled: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Inherited Prompts (Read-only) */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Inherited Prompts</CardTitle>
            <p className="text-sm text-muted-foreground">
              These prompts are inherited from the template and sheet levels
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Template Prompt
                </Label>
              </div>
              <p className="text-sm text-muted-foreground italic">
                {mockInheritedPrompts.template}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent-foreground" />
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Sheet Prompt (Invoices)
                </Label>
              </div>
              <p className="text-sm text-muted-foreground italic">
                {mockInheritedPrompts.sheet}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Column Prompt */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Column-Level Prompt</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Specific instructions for extracting this column
                </p>
              </div>
              {columnPrompt && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={columnPrompt}
              onChange={(e) => setColumnPrompt(e.target.value)}
              placeholder="Enter column-specific instructions (optional)..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use only inherited prompts from template and sheet levels.
            </p>
          </CardContent>
        </Card>

        {/* Effective Prompt Preview */}
        <Card className="shadow-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Effective Prompt Preview</CardTitle>
            <p className="text-sm text-muted-foreground">
              This is the complete prompt that will be used for this column
            </p>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-accent/30 border border-accent">
              <pre className="text-sm whitespace-pre-wrap font-mono text-foreground">
                {effectivePrompt}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Separator />
        
        <div className="flex items-center justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate(`/app/templates/${id}/sheets/${sheetId}`)}
          >
            Cancel
          </Button>
          <Button>
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
