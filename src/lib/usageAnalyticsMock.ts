export type BillingPeriod = "7d" | "30d" | "90d";

export type UsageEvent = {
  date: string; // YYYY-MM-DD
  template: string;
  documents: number;
  pages: number;
  tokens: number;
  user?: string;
};

function formatDateKey(d: Date) {
  // YYYY-MM-DD (local)
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function seededRand(seed: number) {
  // Deterministic PRNG (mulberry32)
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function getPeriodDays(period: BillingPeriod): number {
  if (period === "7d") return 7;
  if (period === "30d") return 30;
  return 90;
}

export function generateMockUsageEvents({
  period,
  planId,
  usedTokensMonthly,
  seed = 42,
  includeUsers,
}: {
  period: BillingPeriod;
  planId: string;
  usedTokensMonthly: number;
  includeUsers: boolean;
  seed?: number;
}): UsageEvent[] {
  const rand = seededRand(seed + usedTokensMonthly + getPeriodDays(period));

  const templates = [
    "Invoice Extractor",
    "Bank Statement Parser",
    "Contract Summary",
    "PO Line Items",
  ];
  const users = includeUsers
    ? ["Ava", "Noah", "Mina", "Sam"]
    : [];

  const days = getPeriodDays(period);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Scale monthly used tokens down into the selected period.
  // This is demo-only: we assume 30-day month.
  const periodTargetTokens = Math.max(0, Math.round((usedTokensMonthly / 30) * days));

  const events: UsageEvent[] = [];

  // Create 1-4 events per day; distribute tokens across days with a gentle weekly-ish wave.
  let remaining = periodTargetTokens;
  for (let dayIndex = days - 1; dayIndex >= 0; dayIndex--) {
    const d = new Date(now);
    d.setDate(now.getDate() - dayIndex);
    const dateKey = formatDateKey(d);

    const perDayEvents = clampInt(1 + rand() * 3, 1, 4);

    // Weight: small seasonality so chart isn't flat
    const wave = 0.65 + 0.35 * Math.sin(((days - dayIndex) / Math.max(days, 7)) * Math.PI * 2);
    const dayBudget = clampInt((periodTargetTokens / days) * wave, 0, periodTargetTokens);

    let dayRemaining = Math.min(dayBudget, remaining);
    for (let i = 0; i < perDayEvents; i++) {
      if (dayRemaining <= 0) break;

      const template = templates[Math.floor(rand() * templates.length)];

      const documents = clampInt(1 + rand() * 12, 1, 20);
      const pages = clampInt(documents * (1 + rand() * 5), documents, documents * 10);
      // Token heuristic: pages * (400-900)
      const base = pages * (400 + rand() * 500);
      const tokens = clampInt(base, 250, 60_000);
      const tokensClamped = Math.min(tokens, dayRemaining);

      const user = includeUsers ? users[Math.floor(rand() * users.length)] : undefined;

      events.push({
        date: dateKey,
        template,
        documents,
        pages,
        tokens: tokensClamped,
        user,
      });

      dayRemaining -= tokensClamped;
      remaining -= tokensClamped;
    }
  }

  // Ensure non-empty on new/empty accounts
  if (events.length === 0) {
    const d = new Date(now);
    events.push({
      date: formatDateKey(d),
      template: "Invoice Extractor",
      documents: 1,
      pages: 1,
      tokens: 250,
      user: includeUsers ? "Ava" : undefined,
    });
  }

  return events;
}

export function aggregateDailyTokens(events: UsageEvent[]) {
  const map = new Map<string, number>();
  for (const e of events) {
    map.set(e.date, (map.get(e.date) ?? 0) + e.tokens);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, tokens]) => ({ date, tokens }));
}

export function aggregateDailyDocuments(events: UsageEvent[]) {
  const map = new Map<string, number>();
  for (const e of events) {
    map.set(e.date, (map.get(e.date) ?? 0) + e.documents);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, documents]) => ({ date, documents }));
}

export function sumUsage(events: UsageEvent[]) {
  return events.reduce(
    (acc, e) => {
      acc.tokens += e.tokens;
      acc.documents += e.documents;
      acc.pages += e.pages;
      if (e.user) acc.users.add(e.user);
      return acc;
    },
    { tokens: 0, documents: 0, pages: 0, users: new Set<string>() },
  );
}
