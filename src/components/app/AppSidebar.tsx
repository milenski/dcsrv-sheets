import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Play, 
  History, 
  CreditCard, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const mainNavItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, end: true },
  { title: "Templates", url: "/app/templates", icon: FileSpreadsheet },
  { title: "Run Extraction", url: "/app/run", icon: Play },
  { title: "History", url: "/app/history", icon: History },
];

const bottomNavItems = [
  { title: "Billing & Usage", url: "/app/billing", icon: CreditCard },
  { title: "Settings", url: "/app/settings", icon: Settings },
  { title: "Help Center", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside 
      className={cn(
        "flex flex-col h-screen border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border">
        <Logo to="/app" collapsed={collapsed} />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.end}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-2",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 pb-4 space-y-1">
        <Separator className="mb-4" />
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-2",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full",
            "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <div className="px-3 pb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-center text-muted-foreground hover:text-foreground",
            collapsed && "px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
