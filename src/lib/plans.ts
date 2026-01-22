// Canonical plans & limits configuration
export interface Plan {
  id: "free" | "light" | "standard" | "pro";
  name: string;
  price: number; // EUR per month
  tokens: number; // monthly included tokens
  overagePrice: number | null; // EUR per 50,000 additional tokens (null = no overage allowed)
  isHardLimit: boolean; // if true, usage blocked at limit
  capabilities?: {
    api: boolean;
    json: boolean;
    webhooks: boolean;
    team: boolean;
  };
  features: string[];
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    tokens: 50_000,
    overagePrice: null,
    isHardLimit: true,
    capabilities: {
      api: true,
      json: true,
      webhooks: false,
      team: false,
    },
    features: [
      "50,000 tokens/month",
      "Basic extraction",
      "CSV & Excel export",
      "3 templates",
      "Community support",
    ],
  },
  light: {
    id: "light",
    name: "Light",
    price: 15,
    tokens: 200_000,
    overagePrice: 5.0,
    isHardLimit: false,
    capabilities: {
      api: true,
      json: true,
      webhooks: false,
      team: false,
    },
    features: [
      "200,000 tokens/month",
      "€5.00 per additional 50k tokens",
      "Batch processing",
      "Custom schema templates",
      "Email support",
    ],
  },
  standard: {
    id: "standard",
    name: "Standard",
    price: 25,
    tokens: 500_000,
    overagePrice: 4.0,
    isHardLimit: false,
    capabilities: {
      api: true,
      json: true,
      webhooks: true,
      team: true,
    },
    features: [
      "500,000 tokens/month",
      "€4.00 per additional 50k tokens",
      "Priority processing queue",
      "API access + Webhooks",
      "Saved extraction templates",
      "Priority support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 50,
    tokens: 1_200_000,
    overagePrice: 3.0,
    isHardLimit: false,
    capabilities: {
      api: true,
      json: true,
      webhooks: true,
      team: true,
    },
    features: [
      "1,200,000 tokens/month",
      "€3.00 per additional 50k tokens",
      "Unlimited batch size",
      "Team seats (up to 5)",
      "Audit log",
      "Invoice billing",
      "Priority support",
    ],
  },
};

export function planHasWebhooks(plan: Plan) {
  return plan.capabilities?.webhooks ?? (plan.id === "standard" || plan.id === "pro");
}

export function planHasTeam(plan: Plan) {
  return plan.capabilities?.team ?? (plan.id === "standard" || plan.id === "pro");
}

export function planHasApi(plan: Plan) {
  return plan.capabilities?.api ?? true;
}

export function planHasJson(plan: Plan) {
  return plan.capabilities?.json ?? true;
}

export const PLANS_ARRAY = Object.values(PLANS);

export const TOKEN_DISCLAIMER =
  "Document estimates are based on typical one-page PDFs (such as invoices). Actual usage depends on document size, layout, and complexity.";

// Format tokens for display
export function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(tokens % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(tokens % 1_000 === 0 ? 0 : 0)}k`;
  }
  return tokens.toLocaleString();
}

// Calculate overage cost
export function calculateOverageCost(
  usedTokens: number,
  plan: Plan
): { overageTokens: number; overageCost: number } {
  if (usedTokens <= plan.tokens || plan.overagePrice === null) {
    return { overageTokens: 0, overageCost: 0 };
  }

  const overageTokens = usedTokens - plan.tokens;
  const overageUnits = Math.ceil(overageTokens / 50_000);
  const overageCost = overageUnits * plan.overagePrice;

  return { overageTokens, overageCost };
}

// Get usage percentage
export function getUsagePercentage(used: number, limit: number): number {
  return Math.min((used / limit) * 100, 150); // Cap at 150% for display
}

// Get usage status
export type UsageStatus = "normal" | "warning" | "critical" | "exceeded";

export function getUsageStatus(percentage: number): UsageStatus {
  if (percentage >= 100) return "exceeded";
  if (percentage >= 95) return "critical";
  if (percentage >= 80) return "warning";
  return "normal";
}
