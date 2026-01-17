import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ArrowLeft, 
  Zap, 
  Key, 
  Layers, 
  Terminal, 
  Webhook, 
  AlertTriangle,
  Code2,
  FileText,
  ChevronRight,
  Menu,
  X,
  Info,
  AlertCircle,
  CheckCircle2,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/PageHeader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Navigation sections
const navSections = [
  { id: "quickstart", label: "Quickstart", icon: Zap },
  { id: "authentication", label: "Authentication", icon: Key },
  { id: "concepts", label: "Core Concepts", icon: Layers },
  { id: "endpoints", label: "Endpoints", icon: Terminal },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "errors", label: "Errors & Rate Limits", icon: AlertTriangle },
  { id: "examples", label: "Examples", icon: Code2 },
  { id: "changelog", label: "Changelog", icon: FileText },
];

// Code block component
function CodeBlock({ children, language = "bash" }: { children: string; language?: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="relative group">
      <pre className="bg-muted/70 border border-border rounded-lg p-4 overflow-x-auto text-sm font-mono">
        <code className="text-foreground">{children}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
        onClick={handleCopy}
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Callout component (Notion-style)
function Callout({ type = "info", children }: { type?: "info" | "warning" | "success"; children: React.ReactNode }) {
  const styles = {
    info: "bg-accent/50 border-primary/20 text-foreground",
    warning: "bg-amber-500/10 border-amber-500/30 text-foreground",
    success: "bg-green-500/10 border-green-500/30 text-foreground",
  };
  const icons = {
    info: <Info className="w-5 h-5 text-primary shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />,
  };

  return (
    <div className={cn("flex gap-3 p-4 rounded-lg border", styles[type])}>
      {icons[type]}
      <div className="text-sm">{children}</div>
    </div>
  );
}

// Section heading
function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-xl font-semibold text-foreground mt-10 mb-4 scroll-mt-6 flex items-center gap-2">
      {children}
    </h2>
  );
}

// Subsection heading
function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-medium text-foreground mt-6 mb-3">{children}</h3>
  );
}

// Paragraph
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>;
}

// Inline code
function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
      {children}
    </code>
  );
}

// Divider
function Divider() {
  return <hr className="border-border my-8" />;
}

// Endpoint block
function EndpointBlock({ 
  method, 
  path, 
  description, 
  requestFields,
  responseExample 
}: { 
  method: string; 
  path: string; 
  description: string;
  requestFields?: { name: string; type: string; required?: boolean; description: string }[];
  responseExample: string;
}) {
  const methodColors: Record<string, string> = {
    GET: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    POST: "bg-green-500/10 text-green-600 border-green-500/30",
    PUT: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    DELETE: "bg-red-500/10 text-red-600 border-red-500/30",
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-6">
      <div className="bg-muted/50 px-4 py-3 flex items-center gap-3 border-b border-border">
        <span className={cn("px-2 py-1 rounded text-xs font-semibold border", methodColors[method])}>
          {method}
        </span>
        <code className="text-sm font-mono text-foreground">{path}</code>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        {requestFields && requestFields.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Request Fields</p>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-foreground">Field</th>
                    <th className="text-left px-3 py-2 font-medium text-foreground">Type</th>
                    <th className="text-left px-3 py-2 font-medium text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {requestFields.map((field) => (
                    <tr key={field.name} className="border-t border-border">
                      <td className="px-3 py-2">
                        <code className="text-xs font-mono">{field.name}</code>
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{field.type}</td>
                      <td className="px-3 py-2 text-muted-foreground">{field.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-foreground mb-2">Response Example</p>
          <CodeBlock language="json">{responseExample}</CodeBlock>
        </div>
      </div>
    </div>
  );
}

export default function DevelopersDocs() {
  const [activeSection, setActiveSection] = useState("quickstart");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  // Handle scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = navSections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navSections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section from hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
      setMobileNavOpen(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back link */}
      <Link 
        to="/app/developers" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Developers
      </Link>

      <PageHeader 
        title="API Documentation" 
        description="Integrate DocServant for Spreadsheets with your systems using our API and webhooks."
      />

      {/* Mobile nav toggle */}
      <div className="lg:hidden mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Menu className="w-4 h-4" />
            {navSections.find(s => s.id === activeSection)?.label || "Navigation"}
          </span>
          <ChevronRight className={cn("w-4 h-4 transition-transform", mobileNavOpen && "rotate-90")} />
        </Button>
        
        {mobileNavOpen && (
          <div className="mt-2 border border-border rounded-lg bg-card p-2 space-y-1">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors",
                  activeSection === section.id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div className="flex gap-8">
        {/* Left nav - sticky */}
        <nav className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-6 space-y-1">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors text-left",
                  activeSection === section.id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Right content */}
        <div className="flex-1 min-w-0 max-w-3xl">
          {/* Quickstart */}
          <SectionHeading id="quickstart">
            <Zap className="w-5 h-5 text-primary" />
            Quickstart
          </SectionHeading>
          
          <P>
            Get started with the DocServant API in five simple steps. You'll be extracting document data programmatically in minutes.
          </P>

          <div className="space-y-4 mb-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">1</div>
              <div>
                <p className="font-medium text-foreground">Enable API access</p>
                <p className="text-sm text-muted-foreground">Go to <Link to="/app/developers" className="text-primary hover:underline">Developers</Link> and toggle on API Access.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">2</div>
              <div>
                <p className="font-medium text-foreground">Create an API key</p>
                <p className="text-sm text-muted-foreground">Generate a new API key and store it securely. You won't be able to see it again.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">3</div>
              <div>
                <p className="font-medium text-foreground">Submit a job</p>
                <p className="text-sm text-muted-foreground">POST a document to <InlineCode>/jobs</InlineCode> with your template ID.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">4</div>
              <div>
                <p className="font-medium text-foreground">Check status</p>
                <p className="text-sm text-muted-foreground">GET <InlineCode>/jobs/{'{jobId}'}</InlineCode> to check processing status.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">5</div>
              <div>
                <p className="font-medium text-foreground">Receive results</p>
                <p className="text-sm text-muted-foreground">Fetch outputs when complete, or configure a webhook to receive them automatically.</p>
              </div>
            </div>
          </div>

          <SubHeading>Typical Flow</SubHeading>
          <div className="flex flex-wrap items-center gap-2 text-sm mb-6">
            <span className="px-3 py-1.5 bg-muted rounded-md font-medium">Submit</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="px-3 py-1.5 bg-muted rounded-md font-medium">jobId</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="px-3 py-1.5 bg-amber-500/10 text-amber-700 rounded-md font-medium">processing</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="px-3 py-1.5 bg-green-500/10 text-green-700 rounded-md font-medium">completed</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-md font-medium">fetch outputs</span>
            <span className="text-muted-foreground mx-1">or</span>
            <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-md font-medium">webhook callback</span>
          </div>

          <Divider />

          {/* Authentication */}
          <SectionHeading id="authentication">
            <Key className="w-5 h-5 text-primary" />
            Authentication
          </SectionHeading>

          <P>
            All API requests must include your API key in the Authorization header using the Bearer scheme.
          </P>

          <CodeBlock>{`Authorization: Bearer sk_live_your_api_key_here`}</CodeBlock>

          <Callout type="warning">
            <strong>Keep your API keys secret.</strong> Never expose them in client-side code, public repositories, or share them with unauthorized users. If you believe a key has been compromised, rotate it immediately from the Developers page.
          </Callout>

          <SubHeading>Rate Limits</SubHeading>
          <P>
            Rate limits are applied per API key and vary by plan. Exceeding your rate limit will result in a <InlineCode>429 Too Many Requests</InlineCode> response. Check the <InlineCode>X-RateLimit-Remaining</InlineCode> header to monitor your usage.
          </P>

          <Divider />

          {/* Core Concepts */}
          <SectionHeading id="concepts">
            <Layers className="w-5 h-5 text-primary" />
            Core Concepts
          </SectionHeading>

          <SubHeading>Templates</SubHeading>
          <P>
            Templates define the structure of your data extraction. Each template specifies which fields to extract, their data types, and how they map to spreadsheet columns. Create templates in the DocServant app, then reference them by ID when submitting jobs via the API.
          </P>

          <SubHeading>Jobs</SubHeading>
          <P>
            Jobs represent document processing requests. When you submit a document, a job is created and enters the processing queue. Jobs progress through these statuses:
          </P>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
            <li><InlineCode>queued</InlineCode> — Job is waiting to be processed</li>
            <li><InlineCode>processing</InlineCode> — Document is being analyzed and data extracted</li>
            <li><InlineCode>completed</InlineCode> — Extraction finished successfully</li>
            <li><InlineCode>failed</InlineCode> — An error occurred during processing</li>
          </ul>

          <SubHeading>Outputs</SubHeading>
          <P>
            Completed jobs produce two output formats:
          </P>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
            <li><strong>JSON output</strong> — Structured data ideal for programmatic use</li>
            <li><strong>XLSX output</strong> — Ready-to-use spreadsheet file</li>
          </ul>
          <P>
            Both outputs are accessible via signed URLs that expire after 24 hours.
          </P>

          <SubHeading>Template API Settings</SubHeading>
          <P>
            Each template can have its own API access settings (inherit from account, enabled, or disabled). This allows you to control which templates are accessible via the API, useful for restricting access to sensitive extraction workflows.
          </P>

          <Divider />

          {/* Endpoints */}
          <SectionHeading id="endpoints">
            <Terminal className="w-5 h-5 text-primary" />
            Endpoints
          </SectionHeading>

          <P>
            All endpoints are relative to the base URL:
          </P>
          <CodeBlock>{`https://api.docservant.com/v1`}</CodeBlock>

          <SubHeading>Submit a Job</SubHeading>
          <EndpointBlock
            method="POST"
            path="/jobs"
            description="Submit a document for extraction using a specified template."
            requestFields={[
              { name: "templateId", type: "string", required: true, description: "The ID of the template to use for extraction" },
              { name: "file", type: "file", required: true, description: "The document file (PDF, DOCX, PNG, JPG)" },
              { name: "callbackUrl", type: "string", description: "Optional webhook URL for this specific job" },
            ]}
            responseExample={`{
  "jobId": "job_abc123def456",
  "status": "queued",
  "templateId": "tpl_xyz789",
  "createdAt": "2026-01-15T10:30:00Z"
}`}
          />

          <SubHeading>cURL Example</SubHeading>
          <CodeBlock>{`curl -X POST https://api.docservant.com/v1/jobs \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -F "templateId=tpl_xyz789" \\
  -F "file=@invoice.pdf"`}</CodeBlock>

          <SubHeading>Get Job Status</SubHeading>
          <EndpointBlock
            method="GET"
            path="/jobs/{jobId}"
            description="Check the status of a job and retrieve outputs when complete."
            responseExample={`{
  "jobId": "job_abc123def456",
  "status": "completed",
  "templateId": "tpl_xyz789",
  "createdAt": "2026-01-15T10:30:00Z",
  "completedAt": "2026-01-15T10:30:45Z",
  "outputs": {
    "jsonUrl": "https://storage.docservant.com/outputs/job_abc123.json?token=...",
    "xlsxUrl": "https://storage.docservant.com/outputs/job_abc123.xlsx?token=..."
  }
}`}
          />

          <P>
            For failed jobs, the response includes an <InlineCode>error</InlineCode> field with details:
          </P>
          <CodeBlock>{`{
  "jobId": "job_abc123def456",
  "status": "failed",
  "error": {
    "code": "EXTRACTION_FAILED",
    "message": "Unable to extract data from document. The file may be corrupted or in an unsupported format."
  }
}`}</CodeBlock>

          <Divider />

          {/* Webhooks */}
          <SectionHeading id="webhooks">
            <Webhook className="w-5 h-5 text-primary" />
            Webhooks
          </SectionHeading>

          <P>
            Webhooks eliminate the need for polling by notifying your server when jobs complete. Configure your webhook endpoint in the <Link to="/app/developers" className="text-primary hover:underline">Developers</Link> section.
          </P>

          <SubHeading>Events</SubHeading>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
            <li><InlineCode>job.completed</InlineCode> — Fired when a job finishes successfully</li>
            <li><InlineCode>job.failed</InlineCode> — Fired when a job fails</li>
          </ul>

          <SubHeading>Payload Example</SubHeading>
          <CodeBlock>{`{
  "event": "job.completed",
  "jobId": "job_abc123def456",
  "templateId": "tpl_xyz789",
  "status": "completed",
  "completedAt": "2026-01-15T10:30:45Z",
  "outputs": {
    "jsonUrl": "https://storage.docservant.com/outputs/job_abc123.json?token=...",
    "xlsxUrl": "https://storage.docservant.com/outputs/job_abc123.xlsx?token=..."
  }
}`}</CodeBlock>

          <P>For failed jobs:</P>
          <CodeBlock>{`{
  "event": "job.failed",
  "jobId": "job_abc123def456",
  "templateId": "tpl_xyz789",
  "status": "failed",
  "error": {
    "code": "EXTRACTION_FAILED",
    "message": "Unable to extract data from document."
  }
}`}</CodeBlock>

          <SubHeading>Webhook Security</SubHeading>
          <P>
            All webhook requests are signed so you can verify they're from DocServant. Each request includes these headers:
          </P>
          <CodeBlock>{`X-DocServant-Signature: sha256=a1b2c3d4e5f6...
X-DocServant-Timestamp: 1705312245`}</CodeBlock>

          <P>
            To verify the signature, compute an HMAC-SHA256 of the timestamp and request body using your webhook secret, then compare it to the signature header. Reject requests with timestamps older than 5 minutes to prevent replay attacks.
          </P>

          <Callout type="info">
            Use the <strong>Test Webhook</strong> button on the Developers page to verify your endpoint is receiving and processing webhooks correctly.
          </Callout>

          <Divider />

          {/* Errors & Rate Limits */}
          <SectionHeading id="errors">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Errors & Rate Limits
          </SectionHeading>

          <SubHeading>HTTP Status Codes</SubHeading>
          <div className="border border-border rounded-lg overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Code</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3"><InlineCode>200</InlineCode></td>
                  <td className="px-4 py-3 text-muted-foreground">Success</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3"><InlineCode>400</InlineCode></td>
                  <td className="px-4 py-3 text-muted-foreground">Bad request — Check your request body or parameters</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3"><InlineCode>401</InlineCode></td>
                  <td className="px-4 py-3 text-muted-foreground">Unauthorized — Invalid or missing API key</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3"><InlineCode>403</InlineCode></td>
                  <td className="px-4 py-3 text-muted-foreground">Forbidden — API access disabled for this template</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3"><InlineCode>404</InlineCode></td>
                  <td className="px-4 py-3 text-muted-foreground">Not found — Job or template doesn't exist</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3"><InlineCode>429</InlineCode></td>
                  <td className="px-4 py-3 text-muted-foreground">Rate limited — Too many requests, slow down</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3"><InlineCode>500</InlineCode></td>
                  <td className="px-4 py-3 text-muted-foreground">Server error — Something went wrong on our end</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SubHeading>Rate Limits by Plan</SubHeading>
          <div className="border border-border rounded-lg overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Plan</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Requests/minute</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Requests/day</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-medium">Free</td>
                  <td className="px-4 py-3 text-muted-foreground">10</td>
                  <td className="px-4 py-3 text-muted-foreground">100</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-medium">Pro</td>
                  <td className="px-4 py-3 text-muted-foreground">100</td>
                  <td className="px-4 py-3 text-muted-foreground">5,000</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 font-medium">Business</td>
                  <td className="px-4 py-3 text-muted-foreground">500</td>
                  <td className="px-4 py-3 text-muted-foreground">50,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Divider />

          {/* Examples */}
          <SectionHeading id="examples">
            <Code2 className="w-5 h-5 text-primary" />
            Examples
          </SectionHeading>

          <SubHeading>Extract Invoices into JSON</SubHeading>
          <P>
            Submit an invoice for extraction and fetch the structured JSON output:
          </P>
          <CodeBlock>{`# Submit the invoice
curl -X POST https://api.docservant.com/v1/jobs \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -F "templateId=tpl_invoices" \\
  -F "file=@invoice.pdf"

# Response: { "jobId": "job_abc123", "status": "queued" }

# Poll for completion (or use webhooks)
curl https://api.docservant.com/v1/jobs/job_abc123 \\
  -H "Authorization: Bearer sk_live_your_api_key"

# When status is "completed", fetch the JSON output
curl "https://storage.docservant.com/outputs/job_abc123.json?token=..."`}</CodeBlock>

          <SubHeading>Bulk Upload and Append to Workbook</SubHeading>
          <P>
            When you submit multiple documents with the same template, each job produces its own output files. To consolidate results, fetch individual JSON outputs and merge them in your application, or download each XLSX and combine sheets programmatically.
          </P>
          <CodeBlock>{`# Submit multiple documents
for file in invoices/*.pdf; do
  curl -X POST https://api.docservant.com/v1/jobs \\
    -H "Authorization: Bearer sk_live_your_api_key" \\
    -F "templateId=tpl_invoices" \\
    -F "file=@$file"
done`}</CodeBlock>

          <SubHeading>Handle Webhook Callback (Node.js)</SubHeading>
          <CodeBlock>{`const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

app.post('/webhooks/docservant', (req, res) => {
  const signature = req.headers['x-docservant-signature'];
  const timestamp = req.headers['x-docservant-timestamp'];
  
  // Verify signature
  const payload = timestamp + '.' + JSON.stringify(req.body);
  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== expected) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the event
  const { event, jobId, outputs } = req.body;
  
  if (event === 'job.completed') {
    console.log(\`Job \${jobId} completed!\`);
    // Fetch outputs.jsonUrl and process the data
  }
  
  res.status(200).send('OK');
});`}</CodeBlock>

          <Divider />

          {/* Changelog */}
          <SectionHeading id="changelog">
            <FileText className="w-5 h-5 text-primary" />
            Changelog
          </SectionHeading>

          <div className="space-y-4">
            <div className="border-l-2 border-primary pl-4">
              <p className="text-sm text-muted-foreground">January 2026</p>
              <p className="font-medium text-foreground">Webhooks Added</p>
              <p className="text-sm text-muted-foreground">Real-time notifications for job completion and failure events.</p>
            </div>
            <div className="border-l-2 border-border pl-4">
              <p className="text-sm text-muted-foreground">December 2025</p>
              <p className="font-medium text-foreground">API v1 Released</p>
              <p className="text-sm text-muted-foreground">Initial release of the DocServant API with job submission and status endpoints.</p>
            </div>
          </div>

          <div className="h-20" /> {/* Bottom padding */}
        </div>
      </div>
    </div>
  );
}
