import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  to?: string;
  collapsed?: boolean;
  className?: string;
}

export function Logo({ to = "/", collapsed = false, className }: LogoProps) {
  return (
    <Link to={to} className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero shrink-0">
        <FileText className="h-4 w-4 text-primary-foreground" />
      </div>
      {!collapsed && (
        <span className="text-lg font-semibold text-foreground">
          DocServant
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            for Spreadsheets
          </span>
        </span>
      )}
    </Link>
  );
}
