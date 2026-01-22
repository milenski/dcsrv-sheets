import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Key, 
  Webhook, 
  Copy, 
  RotateCw, 
  Trash2,
  Eye,
  EyeOff,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Shield,
  Zap,
  Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/app/PageHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUsage } from "@/hooks/useUsage";
import { useApiAccess } from "@/hooks/useApiAccess";
import { planHasWebhooks } from "@/lib/plans";

// Mock data
const mockApiKey = {
  id: "key-1",
  prefix: "sk_live_",
  masked: "sk_live_****************************3f2a",
  createdAt: "Jan 10, 2026",
  lastUsed: "Jan 15, 2026",
};

const mockWebhook = {
  id: "wh-1",
  url: "https://api.example.com/webhooks/docservant",
  secret: "whsec_****************************8b3c",
  events: ["job.completed", "job.failed"],
  enabled: true,
  lastDelivery: "Jan 15, 2026 10:32 AM",
  lastStatus: "success" as const,
};

export default function Developers() {
  const usage = useUsage();
  const { apiEnabled, setApiEnabled } = useApiAccess();
  const webhooksEnabledForPlan = useMemo(() => planHasWebhooks(usage.plan), [usage.plan]);

  const [hasApiKey, setHasApiKey] = useState(true);
  const [newKeyVisible, setNewKeyVisible] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState("");
  
  // Webhook state
  const [webhookUrl, setWebhookUrl] = useState(mockWebhook.url);
  const [webhookEnabled, setWebhookEnabled] = useState(mockWebhook.enabled);
  const [webhookEvents, setWebhookEvents] = useState(mockWebhook.events);
  const [webhookSecretVisible, setWebhookSecretVisible] = useState(false);
  
  // Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "rotate-key" | "revoke-key" | "rotate-secret" | "disable-webhook" | null;
  }>({ open: false, type: null });

  const handleEnableApi = () => {
    setApiEnabled(true);
    toast.success("API access enabled");
  };

  const handleGenerateKey = () => {
    const newKey = "sk_live_" + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    setNewKeyValue(newKey);
    setNewKeyVisible(true);
    setHasApiKey(true);
    toast.success("API key generated");
  };

  const handleCopyKey = () => {
    if (newKeyVisible && newKeyValue) {
      navigator.clipboard.writeText(newKeyValue);
      toast.success("API key copied to clipboard");
    }
  };

  const handleConfirmAction = () => {
    switch (confirmDialog.type) {
      case "rotate-key":
        handleGenerateKey();
        toast.success("API key rotated. Old key has been revoked.");
        break;
      case "revoke-key":
        setHasApiKey(false);
        setNewKeyVisible(false);
        setNewKeyValue("");
        toast.success("API key revoked");
        break;
      case "rotate-secret":
        toast.success("Webhook secret rotated");
        break;
      case "disable-webhook":
        setWebhookEnabled(false);
        toast.success("Webhook disabled");
        break;
    }
    setConfirmDialog({ open: false, type: null });
  };

  const handleTestWebhook = () => {
    toast.success("Test webhook sent");
  };

  const handleEventToggle = (event: string) => {
    if (webhookEvents.includes(event)) {
      setWebhookEvents(webhookEvents.filter(e => e !== event));
    } else {
      setWebhookEvents([...webhookEvents, event]);
    }
  };

  const handleSaveWebhook = () => {
    // Validate URL
    try {
      new URL(webhookUrl);
      toast.success("Webhook configuration saved");
    } catch {
      toast.error("Please enter a valid URL");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Developers" 
        description="Integrate DocServant with your applications using our API and webhooks."
      />

      <div className="max-w-4xl space-y-6">
        {/* API Access Section */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">API Access</CardTitle>
                  <CardDescription>Enable programmatic access to DocServant</CardDescription>
                </div>
              </div>
              <Switch 
                checked={apiEnabled} 
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleEnableApi();
                  } else {
                      setApiEnabled(false);
                    toast.info("API access disabled");
                  }
                }} 
              />
            </div>
          </CardHeader>
          
          {!apiEnabled ? (
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <Zap className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Enable API Access</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  With API access, you can submit documents programmatically, receive processing results via webhooks, and integrate DocServant into your existing workflows.
                </p>
                <Button onClick={handleEnableApi}>
                  Enable API Access
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Code2 className="w-4 h-4" />
                <span>Base URL:</span>
                <code className="bg-muted px-2 py-0.5 rounded text-foreground">
                  https://api.docservant.com/v1
                </code>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/app/developers/docs" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View API Documentation
                </Link>
              </Button>
            </CardContent>
          )}
        </Card>

        {/* API Keys Section */}
        {apiEnabled && (
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">API Keys</CardTitle>
                  <CardDescription>Manage your API keys for authentication</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!hasApiKey ? (
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <Key className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    You don't have any API keys yet
                  </p>
                  <Button onClick={handleGenerateKey}>
                    Generate API Key
                  </Button>
                </div>
              ) : (
                <>
                  {newKeyVisible && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-600 mb-2">
                            Copy your API key now — you won't be able to see it again!
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-background border rounded px-3 py-2 text-sm font-mono break-all">
                              {newKeyValue}
                            </code>
                            <Button size="sm" onClick={handleCopyKey}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-mono text-sm">{mockApiKey.masked}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created {mockApiKey.createdAt} • Last used {mockApiKey.lastUsed}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setConfirmDialog({ open: true, type: "rotate-key" })}
                        >
                          <RotateCw className="w-4 h-4 mr-1" />
                          Rotate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setConfirmDialog({ open: true, type: "revoke-key" })}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Revoke
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Scopes</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">documents:write</Badge>
                          <Badge variant="secondary">jobs:read</Badge>
                          <Badge variant="secondary">results:read</Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Rate Limits</p>
                        <p className="text-sm text-muted-foreground">
                          100 requests/minute (based on your current plan)
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Webhooks Section (plan-gated) */}
        {apiEnabled && (
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Webhook className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {webhooksEnabledForPlan ? "Webhooks" : "Webhooks (Standard & Pro)"}
                  </CardTitle>
                  <CardDescription>
                    {webhooksEnabledForPlan
                      ? "Receive real-time notifications when jobs complete"
                      : "Receive real-time callbacks when processing completes."}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!webhooksEnabledForPlan ? (
                <div className="bg-muted/50 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Webhook className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-4">
                        Webhooks help you build reliable automation without polling.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-muted-foreground" />
                          <span>Reliability</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="w-4 h-4 mt-0.5 text-muted-foreground" />
                          <span>Automation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                          <span>No polling</span>
                        </li>
                      </ul>
                      <Button onClick={() => (window.location.href = "/app/billing")}>Upgrade plan</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="font-medium">Webhook Endpoint</Label>
                    <Badge variant={webhookEnabled ? "default" : "secondary"}>
                      {webhookEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <Switch 
                    checked={webhookEnabled} 
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        setConfirmDialog({ open: true, type: "disable-webhook" });
                      } else {
                        setWebhookEnabled(true);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-url" className="text-sm">Endpoint URL</Label>
                  <Input
                    id="webhook-url"
                    type="url"
                    placeholder="https://your-app.com/webhooks/docservant"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    disabled={!webhookEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Event Subscriptions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="event-completed" 
                        checked={webhookEvents.includes("job.completed")}
                        onCheckedChange={() => handleEventToggle("job.completed")}
                        disabled={!webhookEnabled}
                      />
                      <Label htmlFor="event-completed" className="text-sm font-normal cursor-pointer">
                        job.completed
                        <span className="text-muted-foreground ml-2">— Fired when extraction completes successfully</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="event-failed" 
                        checked={webhookEvents.includes("job.failed")}
                        onCheckedChange={() => handleEventToggle("job.failed")}
                        disabled={!webhookEnabled}
                      />
                      <Label htmlFor="event-failed" className="text-sm font-normal cursor-pointer">
                        job.failed
                        <span className="text-muted-foreground ml-2">— Fired when extraction fails</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="event-started" 
                        disabled
                      />
                      <Label htmlFor="event-started" className="text-sm font-normal cursor-pointer text-muted-foreground">
                        job.started
                        <Badge variant="outline" className="ml-2 text-xs">Coming soon</Badge>
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm">Webhook Secret</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
                      {webhookSecretVisible ? "whsec_abc123def456ghi789jkl012mno345pqr678" : mockWebhook.secret}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setWebhookSecretVisible(!webhookSecretVisible)}
                    >
                      {webhookSecretVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setConfirmDialog({ open: true, type: "rotate-secret" })}
                    >
                      <RotateCw className="w-4 h-4 mr-1" />
                      Rotate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We sign webhook requests. Verify the signature using your webhook secret.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm">
                    {mockWebhook.lastStatus === "success" ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Last delivery: {mockWebhook.lastDelivery}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        <span>Last delivery failed</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleTestWebhook} disabled={!webhookEnabled}>
                    <Send className="w-4 h-4 mr-1" />
                    Send Test
                  </Button>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button onClick={handleSaveWebhook} disabled={!webhookEnabled}>
                    Save Configuration
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    If your endpoint is down, we retry delivery with exponential backoff for up to 24 hours.
                  </span>
                </p>
              </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quickstart Section */}
        {apiEnabled && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Quickstart</CardTitle>
              <CardDescription>Get started with the DocServant API in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">1. Submit a document for processing</h4>
                  <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                    <code>{`curl -X POST https://api.docservant.com/v1/jobs \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@invoice.pdf" \\
  -F "template_id=tmpl_abc123"

# Response:
# { "job_id": "job_xyz789", "status": "queued" }`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">2. Check job status (or wait for webhook)</h4>
                  <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                    <code>{`curl https://api.docservant.com/v1/jobs/job_xyz789 \\
  -H "Authorization: Bearer sk_live_your_api_key"

# Response:
# {
#   "job_id": "job_xyz789",
#   "status": "completed",
#   "outputs": {
#     "json_url": "https://api.docservant.com/v1/results/job_xyz789.json",
#     "xlsx_url": "https://api.docservant.com/v1/results/job_xyz789.xlsx"
#   }
# }`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">3. Download results</h4>
                  <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                    <code>{`# Download JSON
curl https://api.docservant.com/v1/results/job_xyz789.json \\
  -H "Authorization: Bearer sk_live_your_api_key"

# Download Excel
curl https://api.docservant.com/v1/results/job_xyz789.xlsx \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -o results.xlsx`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* IP Allowlist (Coming Soon) */}
        {apiEnabled && (
          <Card className="shadow-card opacity-60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      IP Allowlist
                      <Badge variant="outline">Business plan</Badge>
                    </CardTitle>
                    <CardDescription>Restrict API access to specific IP addresses</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coming soon on Business plan. Contact sales for early access.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmation Dialogs */}
      <AlertDialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => setConfirmDialog({ open, type: open ? confirmDialog.type : null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === "rotate-key" && "Rotate API Key?"}
              {confirmDialog.type === "revoke-key" && "Revoke API Key?"}
              {confirmDialog.type === "rotate-secret" && "Rotate Webhook Secret?"}
              {confirmDialog.type === "disable-webhook" && "Disable Webhook?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === "rotate-key" && 
                "This will generate a new API key and immediately revoke the old one. Any applications using the current key will stop working."}
              {confirmDialog.type === "revoke-key" && 
                "This will permanently revoke your API key. Any applications using this key will stop working immediately."}
              {confirmDialog.type === "rotate-secret" && 
                "This will generate a new webhook secret. You'll need to update your webhook verification code with the new secret."}
              {confirmDialog.type === "disable-webhook" && 
                "Webhook deliveries will be paused. You can re-enable webhooks at any time."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              className={cn(
                confirmDialog.type === "revoke-key" && "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              )}
            >
              {confirmDialog.type === "rotate-key" && "Rotate Key"}
              {confirmDialog.type === "revoke-key" && "Revoke Key"}
              {confirmDialog.type === "rotate-secret" && "Rotate Secret"}
              {confirmDialog.type === "disable-webhook" && "Disable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}