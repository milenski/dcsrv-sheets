import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Server, 
  Workflow, 
  Users, 
  FileText, 
  Code, 
  Webhook,
  Shield,
  CheckCircle2
} from "lucide-react";

export default function Developers() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with green gradient */}
      <section className="py-20 lg:py-28 bg-gradient-subtle">
        <div className="container max-w-4xl text-center">
          <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
            Developers
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Build document → data pipelines in minutes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Send documents. Receive structured JSON.<br />
            Schema-defined, async, webhook-ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/developers/docs">Read API documentation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/signup">Try it free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How Developers Use DocServant */}
      <section className="py-16 lg:py-20">
        <div className="container max-w-5xl">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            How developers use DocServant
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Server className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Backend ingestion</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Upload documents from your app and receive structured JSON via webhook callbacks.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Workflow className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Automation pipelines</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Process invoices, statements, and forms automatically at scale.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Human-in-the-loop</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Use Studio for template setup, API for production processing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Template-first Model */}
      <section className="py-16 lg:py-20 border-t border-border bg-muted/30">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Template-first extraction
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              DocServant uses templates to define the structure of extracted data.
              Templates act as a contract between documents and outputs.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Define schema (one-time setup)</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create a template in DocServant Studio. Upload a sample document or spreadsheet, 
                  select sheets and columns, and define how data should be extracted. 
                  This is a one-time configuration step.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">API processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Send documents to the API using the template ID. Jobs run asynchronously 
                  and return structured JSON via webhooks.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Structured output</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive predictable, deterministic outputs that match your template schema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-16 lg:py-20 border-t border-border">
        <div className="container max-w-4xl">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            What you get
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: FileText, text: "Schema-defined extraction" },
              { icon: Workflow, text: "Async job processing" },
              { icon: Webhook, text: "Webhook callbacks" },
              { icon: Code, text: "JSON, CSV, XLSX outputs" },
              { icon: Server, text: "Batch processing" },
              { icon: CheckCircle2, text: "Deterministic templates" },
              { icon: Shield, text: "No training on customer data by default" },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 py-3 px-4 rounded-lg bg-muted/50">
                <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Example */}
      <section className="py-16 lg:py-20 border-t border-border bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            API example
          </h2>
          
          <div className="space-y-6">
            {/* Request */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Request</p>
              <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-foreground">{`POST /v1/documents
Authorization: Bearer sk_live_...

{
  "template_id": "invoice_v1",
  "file_url": "https://example.com/invoice.pdf"
}`}</code>
              </pre>
            </div>

            {/* Response */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Response</p>
              <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-foreground">{`{
  "job_id": "job_123",
  "status": "processing"
}`}</code>
              </pre>
            </div>

            {/* Webhook */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Webhook callback</p>
              <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-foreground">{`{
  "status": "completed",
  "data": {
    "invoice_number": "INV-2048",
    "total": 1127.52,
    "currency": "USD"
  }
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Data */}
      <section className="py-16 lg:py-20 border-t border-border">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Security and data handling
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              "Encrypted in transit",
              "Configurable data retention",
              "GDPR-friendly",
              "No training on customer data by default",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 py-3 px-4">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-20 border-t border-border bg-primary/5">
        <div className="container max-w-2xl text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Get started
          </h2>
          <p className="text-muted-foreground mb-8">
            Read the API documentation and try it with your own documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/developers/docs">Read API documentation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/signup">Try it free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
