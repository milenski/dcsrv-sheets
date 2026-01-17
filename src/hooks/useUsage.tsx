import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  Plan,
  PLANS,
  calculateOverageCost,
  getUsagePercentage,
  getUsageStatus,
  UsageStatus,
} from "@/lib/plans";

interface UsageData {
  // Plan info
  plan: Plan;
  
  // Token usage
  usedTokens: number;
  includedTokens: number;
  remainingTokens: number;
  overageTokens: number;
  overageCost: number;
  
  // Percentage & status
  usagePercentage: number;
  usageStatus: UsageStatus;
  
  // Template & run counts
  templateCount: number;
  runCount: number;
  
  // Derived states
  isBlocked: boolean;
  isNewUser: boolean;
  hasTemplates: boolean;
  hasRuns: boolean;
  
  // Reset date
  resetDate: string;
}

interface UsageContextType extends UsageData {
  refreshUsage: () => void;
  setPlan: (planId: string) => void;
  setMockUsage: (tokens: number) => void;
  setMockCounts: (templates: number, runs: number) => void;
}

const UsageContext = createContext<UsageContextType | null>(null);

// Mock data for demo purposes
const MOCK_USED_TOKENS = 420_000;
const MOCK_TEMPLATE_COUNT = 3;
const MOCK_RUN_COUNT = 47;

export function UsageProvider({ children }: { children: ReactNode }) {
  const [planId, setPlanId] = useState<string>("standard");
  const [usedTokens, setUsedTokens] = useState(MOCK_USED_TOKENS);
  const [templateCount, setTemplateCount] = useState(MOCK_TEMPLATE_COUNT);
  const [runCount, setRunCount] = useState(MOCK_RUN_COUNT);

  const plan = PLANS[planId] || PLANS.free;
  const includedTokens = plan.tokens;
  const { overageTokens, overageCost } = calculateOverageCost(usedTokens, plan);
  const remainingTokens = Math.max(0, includedTokens - usedTokens);
  const usagePercentage = getUsagePercentage(usedTokens, includedTokens);
  const usageStatus = getUsageStatus(usagePercentage);
  
  // Free plan blocks at 100%
  const isBlocked = plan.isHardLimit && usagePercentage >= 100;
  
  // New user = no templates and no runs
  const isNewUser = templateCount === 0 && runCount === 0;
  const hasTemplates = templateCount > 0;
  const hasRuns = runCount > 0;

  // Mock reset date (first of next month)
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const resetDate = nextMonth.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const refreshUsage = useCallback(() => {
    // In a real app, this would fetch from the server
    console.log("Refreshing usage data...");
  }, []);

  const setPlan = useCallback((newPlanId: string) => {
    if (PLANS[newPlanId]) {
      setPlanId(newPlanId);
    }
  }, []);

  const setMockUsage = useCallback((tokens: number) => {
    setUsedTokens(tokens);
  }, []);

  const setMockCounts = useCallback((templates: number, runs: number) => {
    setTemplateCount(templates);
    setRunCount(runs);
  }, []);

  const value: UsageContextType = {
    plan,
    usedTokens,
    includedTokens,
    remainingTokens,
    overageTokens,
    overageCost,
    usagePercentage,
    usageStatus,
    templateCount,
    runCount,
    isBlocked,
    isNewUser,
    hasTemplates,
    hasRuns,
    resetDate,
    refreshUsage,
    setPlan,
    setMockUsage,
    setMockCounts,
  };

  return (
    <UsageContext.Provider value={value}>{children}</UsageContext.Provider>
  );
}

export function useUsage() {
  const context = useContext(UsageContext);
  if (!context) {
    throw new Error("useUsage must be used within a UsageProvider");
  }
  return context;
}
