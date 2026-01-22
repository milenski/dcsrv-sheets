import { Bell, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useUsage } from "@/hooks/useUsage";
import { canAccessBilling, useRole } from "@/hooks/useRole";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function AppHeader() {
  const { user, logout } = useAuth();
  const usage = useUsage();
  const { role } = useRole();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.message || "Failed to sign out");
    }
  };

  return (
    <header className="h-14 border-b border-border bg-background px-6 flex items-center justify-between gap-4">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates, runs..."
            className="pl-10 bg-muted/50 border-transparent focus:bg-background focus:border-input"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Plan Badge */}
        {canAccessBilling(role) ? (
          <Link to="/app/billing">
            <Badge variant="secondary" className="font-medium cursor-pointer hover:bg-secondary/80">
              {usage.plan.name} Plan
            </Badge>
          </Link>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="font-medium cursor-not-allowed opacity-80">
                {usage.plan.name} Plan
              </Badge>
            </TooltipTrigger>
            <TooltipContent>This action is only available to Owners.</TooltipContent>
          </Tooltip>
        )}

        {/* Role Badge */}
        <Badge variant="outline" className="hidden sm:inline-flex capitalize">
          {role}
        </Badge>

        {/* Upgrade CTA */}
        <Button size="sm" variant="outline" asChild className="hidden sm:inline-flex">
          <Link to="/pricing">Upgrade</Link>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user?.initials || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{user?.name || "User"}</span>
                  <Badge variant="outline" className="capitalize">{role}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/app/settings">Settings</Link>
            </DropdownMenuItem>
            {canAccessBilling(role) ? (
              <DropdownMenuItem asChild>
                <Link to="/app/billing">Billing & Usage</Link>
              </DropdownMenuItem>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <DropdownMenuItem disabled>Billing & Usage</DropdownMenuItem>
                  </div>
                </TooltipTrigger>
                <TooltipContent>This action is only available to Owners.</TooltipContent>
              </Tooltip>
            )}
            <DropdownMenuItem asChild>
              <Link to="/help">Help Center</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
