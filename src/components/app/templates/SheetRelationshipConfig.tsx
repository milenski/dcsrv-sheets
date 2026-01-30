import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2 } from "lucide-react";

interface Sheet {
  id: string;
  name: string;
}

interface SheetRelationshipConfigProps {
  sheetId: string;
  sheetName: string;
  allSheets: Sheet[];
  relationship: "standalone" | "child";
  parentSheetId?: string;
  onRelationshipChange: (relationship: "standalone" | "child") => void;
  onParentChange: (parentId: string) => void;
}

export function SheetRelationshipConfig({
  sheetId,
  sheetName,
  allSheets,
  relationship,
  parentSheetId,
  onRelationshipChange,
  onParentChange,
}: SheetRelationshipConfigProps) {
  const availableParents = allSheets.filter(s => s.id !== sheetId);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-base">Relationship</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Define how this sheet relates to other sheets in the template
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup 
          value={relationship} 
          onValueChange={(v) => onRelationshipChange(v as "standalone" | "child")}
        >
          <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="standalone" id="rel-standalone" className="mt-1" />
            <div>
              <Label htmlFor="rel-standalone" className="font-medium cursor-pointer">
                Standalone sheet
              </Label>
              <p className="text-sm text-muted-foreground">
                This sheet has no relationship to other sheets
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="child" id="rel-child" className="mt-1" />
            <div>
              <Label htmlFor="rel-child" className="font-medium cursor-pointer">
                Child sheet linked to another sheet
              </Label>
              <p className="text-sm text-muted-foreground">
                This sheet contains related records (e.g., line items for invoices)
              </p>
            </div>
          </div>
        </RadioGroup>

        {relationship === "child" && (
          <div className="space-y-3 pt-2 pl-6 border-l-2 border-primary/20 ml-3">
            <div className="space-y-2">
              <Label>Parent (master) sheet</Label>
              <Select value={parentSheetId} onValueChange={onParentChange}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select parent sheet" />
                </SelectTrigger>
                <SelectContent>
                  {availableParents.map((sheet) => (
                    <SelectItem key={sheet.id} value={sheet.id}>
                      {sheet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-muted-foreground">Relationship type:</Label>
              <Badge variant="secondary">One-to-many</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
