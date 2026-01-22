import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  Code2,
  Upload,
  FileOutput,
  LayoutTemplate,
  ChevronDown,
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
  Table,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ============================================================================
// LOCAL NAVBAR (only for this page)
// ============================================================================
function NewHomeNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/new-home" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileSpreadsheet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">DocServant</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Product <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <a href="#studio" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  DocServant Studio
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="#api" className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  DocServant API
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <a href="#use-cases" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Use cases
          </a>
          <Link to="/app/developers/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Developers
          </Link>
          <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/developers/docs">View API docs</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/app">Try Studio</Link>
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
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product</span>
              <a href="#studio" className="text-sm font-medium text-foreground pl-2" onClick={() => setMobileMenuOpen(false)}>
                DocServant Studio
              </a>
              <a href="#api" className="text-sm font-medium text-foreground pl-2" onClick={() => setMobileMenuOpen(false)}>
                DocServant API
              </a>
            </div>
            <a href="#use-cases" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Use cases
            </a>
            <Link to="/app/developers/docs" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Developers
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" asChild>
                <Link to="/app/developers/docs">View API docs</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/app">Try Studio</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}

// ============================================================================
// LOCAL FOOTER (only for this page)
// ============================================================================
function NewHomeFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/new-home" className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <FileSpreadsheet className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">DocServant</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Turn documents into structured data.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#studio" className="text-muted-foreground hover:text-foreground transition-colors">
                  DocServant Studio
                </a>
              </li>
              <li>
                <a href="#api" className="text-muted-foreground hover:text-foreground transition-colors">
                  DocServant API
                </a>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Developers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/app/developers/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/app/developers" className="text-muted-foreground hover:text-foreground transition-colors">
                  API Keys & Webhooks
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-muted-foreground hover:text-foreground transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DocServant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================
function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Turn documents into{" "}
            <span className="text-gradient">structured data</span>.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4">
            Use <strong>DocServant Studio</strong> in your browser, or integrate{" "}
            <strong>DocServant API</strong> into your systems.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            From invoices and receipts to forms and statements.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link to="/app">Try Studio</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/app/developers/docs">View API docs</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// TWO SURFACES SECTION (Studio vs API)
// ============================================================================
function TwoSurfacesSection() {
  return (
    <section id="studio" className="py-16 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Two ways to extract
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose the interface that fits your workflow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Studio Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <FileSpreadsheet className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">DocServant Studio</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Upload documents, extract data, export to Excel.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-foreground">
                <LayoutTemplate className="h-4 w-4 text-primary" />
                Templates for consistent extraction
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Upload className="h-4 w-4 text-primary" />
                Bulk uploads
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground">
                <Download className="h-4 w-4 text-primary" />
                Export to XLSX and CSV
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link to="/app">Try Studio</Link>
            </Button>
          </motion.div>

          {/* API Card */}
          <motion.div
            id="api"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Code2 className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">DocServant API</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Integrate document-to-data into your workflow.
            </p>
            <ul className="space-y-2 mb-6">
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
                Webhooks (Standard & Pro)
              </li>
            </ul>
            <Button variant="outline" asChild className="w-full">
              <Link to="/app/developers/docs">View API docs</Link>
            </Button>
          </motion.div>
        </div>
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
      description: "Upload files via Studio or send via API.",
    },
    {
      icon: FileOutput,
      title: "Get structured outputs",
      description: "Download XLSX, CSV, or receive JSON via webhook.",
    },
  ];

  return (
    <section className="py-16">
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
      description: "Purchase orders, logistics docs",
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
    <section id="use-cases" className="py-16 bg-muted/30">
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
          <p className="text-muted-foreground max-w-xl mx-auto">
            Extract structured data from any document type.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-card border border-border rounded-lg p-5 shadow-card"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent mb-3">
                <useCase.icon className="h-5 w-5 text-accent-foreground" />
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
// TRUST / SECURITY SECTION
// ============================================================================
function TrustSection() {
  const points = [
    { icon: Shield, text: "Secure by design" },
    { icon: Lock, text: "Data encrypted in transit" },
    { icon: Settings2, text: "You control retention settings" },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card border border-border rounded-xl p-8 shadow-card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Built with security in mind
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your documents and data are protected.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {points.map((point) => (
                  <div key={point.text} className="flex items-center gap-2 text-sm text-foreground">
                    <point.icon className="h-4 w-4 text-primary" />
                    {point.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function NewHomeLanding() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NewHomeNavbar />
      <main className="flex-1">
        <HeroSection />
        <TwoSurfacesSection />
        <HowItWorksSection />
        <UseCasesSection />
        <TrustSection />
      </main>
      <NewHomeFooter />
    </div>
  );
}
