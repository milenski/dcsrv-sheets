import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DocumentPreview } from "@/components/ui/DocumentPreview";
import { DataTable } from "@/components/ui/DataTable";
import { SharedFooter } from "@/components/shared/SharedFooter";
import {
  FileText,
  Code2,
  Upload,
  FileOutput,
  LayoutTemplate,
  Menu,
  X,
  Receipt,
  Truck,
  Landmark,
  ClipboardList,
  Shield,
  Lock,
  Settings2,
  FileJson,
  Webhook,
  Clock,
  Download,
  Layers,
  Zap,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";

// ============================================================================
// ANIMATIONS
// ============================================================================
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ============================================================================
// LOCAL LOGO (Platform branding)
// ============================================================================
function PlatformLogo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
        <FileText className="h-4 w-4 text-primary-foreground" />
      </div>
      <span className="text-lg font-semibold text-foreground">
        DocServant
        <span className="ml-1 text-sm font-normal text-muted-foreground">
          Platform
        </span>
      </span>
    </Link>
  );
}

// ============================================================================
// LOCAL NAVBAR (simplified - no dropdowns, just anchors)
// ============================================================================
function HomeNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <PlatformLogo />

        {/* Desktop Nav - Simplified top-level links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/examples" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Examples
          </Link>
          <Link 
            to="/developers" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Developers
          </Link>
          <Link 
            to="/pricing" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link 
            to="/help" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Help
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Button size="sm" asChild>
            <Link to="/app">Try it free</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border bg-background"
        >
          <div className="container py-4 flex flex-col gap-4">
            <Link 
              to="/examples" 
              className="text-sm font-medium text-foreground" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Examples
            </Link>
            <Link 
              to="/developers" 
              className="text-sm font-medium text-foreground" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Developers
            </Link>
            <Link 
              to="/pricing" 
              className="text-sm font-medium text-foreground" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/help" 
              className="text-sm font-medium text-foreground" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Help
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Link 
                to="/login" 
                className="text-sm font-medium text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Button size="sm" asChild>
                <Link to="/app">Try it free</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}

// SharedFooter is imported from @/components/shared/SharedFooter

// ============================================================================
// HERO SECTION (with green gradient from old homepage)
// ============================================================================
function HeroSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-subtle">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Turn documents into structured data.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Extract reliable, structured outputs from invoices, statements, forms, and more — using our UI or API.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link to="/app">Try it free</Link>
            </Button>
            <Link 
              to="/login" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// TWO WAYS TO USE DOCSERVANT (unified CTA below both cards)
// ============================================================================
function TwoWaysSection() {
  return (
    <section id="product" className="py-16 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Two ways to use DocServant
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Use the interface that fits your workflow — or both.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Studio Card */}
          <motion.div
            id="studio"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">DocServant Studio</h3>
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Web-based interface
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Upload documents, define templates, export structured data.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-foreground">
                <LayoutTemplate className="h-4 w-4 text-primary" />
                Visual template builder
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Upload className="h-4 w-4 text-primary" />
                Bulk uploads
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Download className="h-4 w-4 text-primary" />
                XLSX & CSV export
              </li>
            </ul>
          </motion.div>

          {/* API Card */}
          <motion.div
            id="api"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">DocServant API</h3>
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Programmatic access
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Send documents, receive structured JSON via API or webhooks.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-foreground">
                <FileJson className="h-4 w-4 text-primary" />
                JSON output
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Async jobs
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Webhook className="h-4 w-4 text-primary" />
                Webhooks
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Shared CTA below both cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-8"
        >
          <Button size="lg" asChild>
            <Link to="/app">Try it free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// EXAMPLES SECTION (from old homepage)
// ============================================================================
function ExamplesSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            See what you can extract
          </motion.h2>
          <motion.p variants={fadeIn} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From invoices to contracts, our AI understands your documents
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-12"
        >
          {[
            { type: "invoice" as const, title: "Invoice Fields", desc: "Invoice #, Date, Vendor, Line Items, Tax, Total" },
            { type: "bank" as const, title: "Bank Statement Rows", desc: "Date, Description, Amount, Running Balance" },
            { type: "contract" as const, title: "Contract Summary", desc: "Parties, Start/End Dates, Term Length, Key Terms" },
          ].map((schema, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              className="grid md:grid-cols-2 gap-6 items-start"
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{schema.title}</h3>
                    <p className="text-sm text-muted-foreground">{schema.desc}</p>
                  </div>
                </div>
                <DocumentPreview type={schema.type} />
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <DataTable type={schema.type} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" asChild className="gap-2">
            <Link to="/examples">
              See more examples
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// HOW IT WORKS SECTION
// ============================================================================
function HowItWorksSection() {
  const steps = [
    {
      icon: LayoutTemplate,
      title: "Create a template",
      description: "Define the columns and structure you need.",
    },
    {
      icon: Upload,
      title: "Process documents",
      description: "Upload via Studio or send via API.",
    },
    {
      icon: FileOutput,
      title: "Get structured outputs",
      description: "Download spreadsheets or receive JSON.",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            How it works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Step {index + 1}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// USE CASES SECTION
// ============================================================================
function UseCasesSection() {
  const useCases = [
    {
      icon: Receipt,
      title: "Accounting",
      description: "Invoices, receipts, expense reports",
    },
    {
      icon: Truck,
      title: "Operations",
      description: "Purchase orders, logistics documents",
    },
    {
      icon: Landmark,
      title: "Finance",
      description: "Bank statements, financial reports",
    },
    {
      icon: ClipboardList,
      title: "Admin",
      description: "Forms, applications, registrations",
    },
  ];

  return (
    <section id="use-cases" className="py-16 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Use cases
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-5 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-3">
                <useCase.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MORE THAN OCR SECTION (from old homepage)
// ============================================================================
function MoreThanOcrSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Structure, not just text
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Traditional OCR just reads text. DocServant understands your documents and
              extracts meaningful, structured data ready for your systems.
            </p>
            <ul className="space-y-4">
              {[
                { icon: Layers, text: "Structured extraction with custom schema mapping" },
                { icon: Zap, text: "Batch processing for multiple documents" },
                { icon: FileSpreadsheet, text: "Excel, CSV & JSON export in one click" },
                { icon: Shield, text: "Secure processing with no data training by default" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeIn} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl" />
            <div className="relative bg-card border border-border rounded-2xl p-8 shadow-elevated">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Your data stays yours</h3>
                  <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Documents processed securely and encrypted
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  We don't train on your data by default
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  GDPR-compliant data handling
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Files deleted after processing (optional retention)
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// DEVELOPERS SECTION
// ============================================================================
function DevelopersSection() {
  return (
    <section id="developers" className="py-16 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Code2 className="w-7 h-7 text-primary" />
                </div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center -ml-4">
                  <Webhook className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  API Documentation
                </h3>
                <p className="text-muted-foreground">
                  Integrate DocServant into your systems with our REST API. 
                  Sign in to generate API keys and configure webhooks.
                </p>
              </div>
              <div>
                <Button variant="outline" asChild>
                  <Link to="/developers/docs">
                    Read API docs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// TRUST & SECURITY SECTION
// ============================================================================
function TrustSection() {
  const trustPoints = [
    {
      icon: Shield,
      text: "Secure by design",
    },
    {
      icon: Lock,
      text: "Data encrypted in transit",
    },
    {
      icon: Settings2,
      text: "You control retention settings",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Built with security in mind
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 max-w-3xl mx-auto">
          {trustPoints.map((point, index) => (
            <motion.div
              key={point.text}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <point.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{point.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FINAL CTA SECTION (green background from old homepage)
// ============================================================================
function FinalCtaSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(0_0%_100%/0.1),transparent_50%)]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to automate your document workflow?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Start extracting structured data from your documents in minutes. No credit card required.
            </p>
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <Link to="/app">
                Try it free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HomeNavbar />
      <main className="flex-1">
        <HeroSection />
        <TwoWaysSection />
        <ExamplesSection />
        <HowItWorksSection />
        <UseCasesSection />
        <MoreThanOcrSection />
        <DevelopersSection />
        <TrustSection />
        <FinalCtaSection />
      </main>
      <SharedFooter />
    </div>
  );
}
