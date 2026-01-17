import { Outlet, Navigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { SharedFooter } from "@/components/shared/SharedFooter";
import { useAuth } from "@/hooks/useAuth";
import { ApiAccessProvider } from "@/hooks/useApiAccess";

export function AppLayout() {
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ApiAccessProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
          <SharedFooter compact />
        </div>
      </div>
    </ApiAccessProvider>
  );
}
