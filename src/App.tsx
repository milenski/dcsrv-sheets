import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AppLayout } from "@/components/app/AppLayout";
import { AuthProvider } from "@/hooks/useAuth";
import { UsageProvider } from "@/hooks/useUsage";
import { RoleProvider } from "@/hooks/useRole";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Examples from "./pages/Examples";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import PublicDevelopersDocs from "./pages/DevelopersDocs";

// App pages
import Dashboard from "./pages/app/Dashboard";
import Templates from "./pages/app/Templates";
import TemplateNew from "./pages/app/TemplateNew";
import TemplateDetail from "./pages/app/TemplateDetail";
import SheetDetail from "./pages/app/SheetDetail";
import ColumnEditor from "./pages/app/ColumnEditor";
import RunExtraction from "./pages/app/RunExtraction";
import RunResults from "./pages/app/RunResults";
import History from "./pages/app/History";
import Billing from "./pages/app/Billing";
import Settings from "./pages/app/Settings";
import Team from "./pages/app/Team";
import Developers from "./pages/app/Developers";
import DevelopersDocs from "./pages/app/DevelopersDocs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SpeedInsights />
      <BrowserRouter>
        <AuthProvider>
          <UsageProvider>
            <RoleProvider>
              <Routes>
            {/* Marketing site - Home now has its own nav/footer */}
            <Route element={<Home />} path="/" />
            <Route element={<Layout><Pricing /></Layout>} path="/pricing" />
            <Route element={<Layout><Examples /></Layout>} path="/examples" />
            <Route element={<Layout><Help /></Layout>} path="/help" />
            <Route element={<Layout><Privacy /></Layout>} path="/privacy" />
            <Route element={<Layout><Terms /></Layout>} path="/terms" />
            <Route element={<Layout><Security /></Layout>} path="/security" />
            
            {/* Public API Documentation - no auth required */}
            <Route element={<PublicDevelopersDocs />} path="/developers/docs" />
            
            {/* Auth pages - no header/footer, standalone */}
            <Route element={<Login />} path="/login" />
            <Route element={<Signup />} path="/signup" />

            {/* App routes - protected by AppLayout */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="templates" element={<Templates />} />
              <Route path="templates/new" element={<TemplateNew />} />
              <Route path="templates/:id" element={<TemplateDetail />} />
              <Route path="templates/:id/sheets/:sheetId" element={<SheetDetail />} />
              <Route path="templates/:id/sheets/:sheetId/columns/:columnId" element={<ColumnEditor />} />
              <Route path="templates/:id/run" element={<RunExtraction />} />
              <Route path="run" element={<RunExtraction />} />
              <Route path="runs/:runId" element={<RunResults />} />
              <Route path="history" element={<History />} />
              <Route path="billing" element={<Billing />} />
              <Route path="settings" element={<Settings />} />
              <Route path="team" element={<Team />} />
              <Route path="settings/team" element={<Team />} />
              <Route path="developers" element={<Developers />} />
              <Route path="developers/docs" element={<DevelopersDocs />} />
            </Route>

            <Route path="*" element={<NotFound />} />
              </Routes>
            </RoleProvider>
          </UsageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
