import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChangeOutputModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMode: "new" | "append";
  storeDataEnabled: boolean;
  onConfirm: (newMode: "new" | "append") => void;
}

export function ChangeOutputModeDialog({
  open,
  onOpenChange,
  currentMode,
  storeDataEnabled,
  onConfirm,
}: ChangeOutputModeDialogProps) {
  const [selectedMode, setSelectedMode] = useState<"new" | "append">(currentMode);
  const [acknowledged, setAcknowledged] = useState(false);

  const hasChanges = selectedMode !== currentMode;

  const handleConfirm = () => {
    onConfirm(selectedMode);
    onOpenChange(false);
    setAcknowledged(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedMode(currentMode);
      setAcknowledged(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change output mode</DialogTitle>
          <DialogDescription>
            Changing the output mode affects how extracted data is generated and stored.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup 
            value={selectedMode} 
            onValueChange={(v) => setSelectedMode(v as "new" | "append")}
          >
            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="new" id="output-new" className="mt-1" />
              <div>
                <Label htmlFor="output-new" className="font-medium cursor-pointer">
                  Generate a new output file per extraction
                </Label>
                <p className="text-sm text-muted-foreground">
                  Each uploaded document generates its own Excel file
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="append" id="output-append" className="mt-1" />
              <div>
                <Label htmlFor="output-append" className="font-medium cursor-pointer">
                  Append rows to the same output file
                </Label>
                <p className="text-sm text-muted-foreground">
                  All documents are combined into one Excel file
                </p>
              </div>
            </div>
          </RadioGroup>

          {storeDataEnabled && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Existing extracted data will not be modified.
              </p>
            </div>
          )}

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox 
              id="acknowledge" 
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
            />
            <Label htmlFor="acknowledge" className="text-sm cursor-pointer">
              I understand the implications of changing the output mode
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!hasChanges || !acknowledged}
          >
            Change output mode
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
