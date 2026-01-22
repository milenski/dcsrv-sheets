import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export function PermissionRequired({
  title = "Permission required",
  description,
  actions,
}: {
  title?: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </CardHeader>
        {actions ? <CardContent className="pt-0">{actions}</CardContent> : null}
      </Card>
    </div>
  );
}
