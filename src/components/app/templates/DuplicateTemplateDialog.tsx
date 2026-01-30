import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DuplicateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  onConfirm: (options: {
    name: string;
    duplicateSheets: boolean;
    duplicatePrompts: boolean;
  }) => void;
}

export function DuplicateTemplateDialog({
  open,
  onOpenChange,
  templateName,
  onConfirm,
}: DuplicateTemplateDialogProps) {
  const [name, setName] = useState(`${templateName} (copy)`);
  const [duplicateSheets, setDuplicateSheets] = useState(true);
  const [duplicatePrompts, setDuplicatePrompts] = useState(true);

  const handleConfirm = () => {
    onConfirm({
      name,
      duplicateSheets,
      duplicatePrompts,
    });
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName(`${templateName} (copy)`);
      setDuplicateSheets(true);
      setDuplicatePrompts(true);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5" />
            Duplicate template
          </DialogTitle>
          <DialogDescription>
            Create a copy of this template with the options below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-muted-foreground">Include in duplicate</Label>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="dup-sheets" 
                checked={duplicateSheets}
                onCheckedChange={(checked) => setDuplicateSheets(checked === true)}
              />
              <div>
                <Label htmlFor="dup-sheets" className="cursor-pointer">
                  Duplicate sheet configuration
                </Label>
                <p className="text-xs text-muted-foreground">
                  Copy all sheet settings and column selections
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="dup-prompts" 
                checked={duplicatePrompts}
                onCheckedChange={(checked) => setDuplicatePrompts(checked === true)}
              />
              <div>
                <Label htmlFor="dup-prompts" className="cursor-pointer">
                  Duplicate prompts
                </Label>
                <p className="text-xs text-muted-foreground">
                  Copy template, sheet, and column prompts
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 opacity-50">
              <Checkbox 
                id="dup-data" 
                checked={false}
                disabled
              />
              <div>
                <Label htmlFor="dup-data" className="cursor-not-allowed">
                  Duplicate historical data
                </Label>
                <p className="text-xs text-muted-foreground">
                  Coming soon
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!name.trim()}
          >
            Create duplicate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
