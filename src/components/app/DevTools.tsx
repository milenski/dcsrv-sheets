import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUsage } from "@/hooks/useUsage";
import { useRole, type AppRole } from "@/hooks/useRole";
import { Settings2, X } from "lucide-react";

/**
 * Dev Tools panel for testing different app states.
 * Only visible in development mode.
 */
export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const { setPlan, setMockUsage, setMockCounts, plan, usedTokens, templateCount, runCount } = useUsage();
  const { role, setRole } = useRole();

  // Quick presets
  const presets = [
    {
      label: "New User (Onboarding)",
      description: "0 templates, 0 runs",
      action: () => {
        setMockCounts(0, 0);
        setPlan("free");
        setMockUsage(0);
      },
    },
    {
      label: "Empty Templates",
      description: "0 templates, some runs",
      action: () => {
        setMockCounts(0, 5);
      },
    },
    {
      label: "Empty History",
      description: "Some templates, 0 runs",
      action: () => {
        setMockCounts(3, 0);
      },
    },
    {
      label: "Free Plan Blocked",
      description: "100% usage on free plan",
      action: () => {
        setPlan("free");
        setMockUsage(50_000);
        setMockCounts(2, 10);
      },
    },
    {
      label: "Paid Plan Overage",
      description: "120% usage on standard plan",
      action: () => {
        setPlan("standard");
        setMockUsage(600_000);
        setMockCounts(5, 50);
      },
    },
    {
      label: "Normal Usage",
      description: "Standard plan, 80% used",
      action: () => {
        setPlan("standard");
        setMockUsage(400_000);
        setMockCounts(3, 25);
      },
    },
    {
      label: "Warning State (95%)",
      description: "Near limit warning",
      action: () => {
        setPlan("standard");
        setMockUsage(475_000);
        setMockCounts(4, 40);
      },
    },
  ];

  if (!isOpen) {
    return (
      <Button
        size="icon"
        variant="outline"
        className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full shadow-lg bg-background border-border"
        onClick={() => setIsOpen(true)}
      >
        <Settings2 className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-muted border-b border-border">
        <span className="font-semibold text-sm">🛠️ Dev Tools</span>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-3 space-y-3 max-h-[60vh] overflow-y-auto">
        {/* Quick switches */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Simulate</div>
          <div className="grid grid-cols-2 gap-2">
            {([
              { id: "free", label: "Free" },
              { id: "light", label: "Light" },
              { id: "standard", label: "Standard" },
              { id: "pro", label: "Pro" },
            ] as const).map((p) => (
              <Button
                key={p.id}
                size="sm"
                variant={plan.id === p.id ? "default" : "outline"}
                onClick={() => setPlan(p.id)}
              >
                {p.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {([
              { id: "owner", label: "Owner" },
              { id: "admin", label: "Admin" },
              { id: "member", label: "Member" },
            ] as const).map((r: { id: AppRole; label: string }) => (
              <Button
                key={r.id}
                size="sm"
                variant={role === r.id ? "default" : "outline"}
                onClick={() => setRole(r.id)}
              >
                {r.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Current State */}
        <div className="text-xs space-y-1 p-2 bg-muted/50 rounded-md">
          <div className="font-medium text-foreground">Current State:</div>
          <div className="text-muted-foreground">
            Plan: <span className="text-foreground">{plan.name}</span>
          </div>
          <div className="text-muted-foreground">
            Role: <span className="text-foreground capitalize">{role}</span>
          </div>
          <div className="text-muted-foreground">
            Usage: <span className="text-foreground">{usedTokens.toLocaleString()} / {plan.tokens.toLocaleString()}</span>
          </div>
          <div className="text-muted-foreground">
            Templates: <span className="text-foreground">{templateCount}</span> | Runs: <span className="text-foreground">{runCount}</span>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Test Presets
          </div>
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={preset.action}
              className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors border border-transparent hover:border-border"
            >
              <div className="text-sm font-medium text-foreground">{preset.label}</div>
              <div className="text-xs text-muted-foreground">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
