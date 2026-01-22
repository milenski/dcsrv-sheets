import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTokens, type Plan } from "@/lib/plans";
import { planHasTeam } from "@/lib/plans";
import type { UsageEvent } from "@/lib/usageAnalyticsMock";

type SortKey = "tokens";

function formatRowDate(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function UsageBreakdownTable({
  events,
  plan,
}: {
  events: UsageEvent[];
  plan: Plan;
}) {
  const teamEnabled = planHasTeam(plan);

  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [sortKey] = useState<SortKey>("tokens");

  const templates = useMemo(() => {
    return [...new Set(events.map((e) => e.template))].sort((a, b) => a.localeCompare(b));
  }, [events]);

  const users = useMemo(() => {
    if (!teamEnabled) return [];
    return [...new Set(events.map((e) => e.user).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b));
  }, [events, teamEnabled]);

  const filtered = useMemo(() => {
    return events
      .filter((e) => templateFilter === "all" || e.template === templateFilter)
      .filter((e) => !teamEnabled || userFilter === "all" || e.user === userFilter);
  }, [events, templateFilter, userFilter, teamEnabled]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortKey === "tokens") arr.sort((a, b) => b.tokens - a.tokens);
    return arr;
  }, [filtered, sortKey]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base">Usage breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Daily detail by template (sorted by tokens used).</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={templateFilter} onValueChange={setTemplateFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All templates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All templates</SelectItem>
                {templates.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {teamEnabled ? (
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All users</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className="rounded-lg border bg-muted/20 p-6 text-sm text-muted-foreground">
            No usage found for the current filters.
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Date</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead className="w-[120px]">Documents</TableHead>
                  <TableHead className="w-[120px]">Pages</TableHead>
                  <TableHead className="w-[140px]">Tokens used</TableHead>
                  {teamEnabled ? <TableHead className="w-[140px]">User</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((row, idx) => (
                  <TableRow key={`${row.date}-${row.template}-${row.user ?? "_"}-${idx}`}>
                    <TableCell className="text-muted-foreground">{formatRowDate(row.date)}</TableCell>
                    <TableCell className="font-medium">{row.template}</TableCell>
                    <TableCell>{row.documents}</TableCell>
                    <TableCell>{row.pages}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {formatTokens(row.tokens)}
                      </Badge>
                    </TableCell>
                    {teamEnabled ? <TableCell>{row.user ?? "—"}</TableCell> : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
