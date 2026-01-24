import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileText,
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
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ============================================================================
// LOCAL LOGO (Platform branding)
// ============================================================================
function PlatformLogo() {
  return (
    <Link to="/new-home" className="flex items-center gap-2">
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
// LOCAL NAVBAR (only for this page)
// ============================================================================
function NewHomeNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <PlatformLogo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Product Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Product <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <a href="#studio" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
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

          {/* Use cases Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Use cases <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <a href="#use-cases" className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Accounting
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="#use-cases" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Operations
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="#use-cases" className="flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  Finance
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="#use-cases" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Admin
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Developers Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Developers <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link to="/app/developers/docs" className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  API Docs
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/app/developers" className="flex items-center gap-2">
                  <Webhook className="h-4 w-4" />
                  Webhooks
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/app/developers/docs" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            API docs
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
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product</span>
              <a href="#studio" className="text-sm font-medium text-foreground pl-2" onClick={() => setMobileMenuOpen(false)}>
                DocServant Studio
              </a>
              <a href="#api" className="text-sm font-medium text-foreground pl-2" onClick={() => setMobileMenuOpen(false)}>
                DocServant API
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Use cases</span>
              <a href="#use-cases" className="text-sm font-medium text-foreground pl-2" onClick={() => setMobileMenuOpen(false)}>
                Accounting
              </a>
              <a href="#use-cases" className="text-sm font-medium text-foreground pl-2" onClick={() => setMobileMenuOpen(false)}>
                Operations
              </a>
              <a href="#use-cases" className="text-sm font-medium text-foreground pl-2" onClick={() => setMobileMenuOpen(false)}>
                Finance
              </a>
              <a href="#use-cases" className="text-sm font-medium text-foreground pl-2" onClick={() => setMobileMenuOpen(false)}>
                Admin
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Developers</span>
              <Link to="/app/developers/docs" className="text-sm font-medium text-foreground pl-2" onClick={() => setMobileMenuOpen(false)}>
                API Docs
              </Link>
              <Link to="/app/developers" className="text-sm font-medium text-foreground pl-2" onClick={() => setMobileMenuOpen(false)}>
                Webhooks
              </Link>
            </div>
            <Link to="/pricing" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Link 
                to="/login" 
                className="text-sm font-medium text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/app/developers/docs" 
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                API docs
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
                <FileText className="h-3.5 w-3.5 text-primary-foreground" />
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
                  Webhooks
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
          <p className="text-sm text-muted-foreground">
            DocServant — Turn documents into structured data.
          </p>
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
              to="/app/developers/docs" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              View API docs →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// TWO WAYS TO EXTRACT SECTION
// ============================================================================
function TwoWaysSection() {
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
            Two ways to use DocServant
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Use the interface that fits your workflow — or both.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Studio Card */}
          <motion.div
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
              Visual interface for humans.
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Upload documents, define templates, export structured data.
            </p>
            <ul className="space-y-2 mb-6">
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
            <Button asChild className="w-full">
              <Link to="/app">Try it free</Link>
            </Button>
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
              Built for developers and systems.
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Send documents, receive structured JSON via API or webhooks.
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
                Webhooks
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link to="/app">Try it free</Link>
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Sign in to generate API keys and configure webhooks.{" "}
              <Link to="/app/developers/docs" className="underline hover:text-foreground">
                Read docs →
              </Link>
            </p>
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
      description: "Upload via Studio or send via API.",
    },
    {
      icon: FileOutput,
      title: "Get structured outputs",
      description: "Download spreadsheets or receive JSON.",
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
    <section className="py-16">
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
// MAIN PAGE COMPONENT
// ============================================================================
export default function NewHomeLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewHomeNavbar />
      <main className="flex-1">
        <HeroSection />
        <TwoWaysSection />
        <HowItWorksSection />
        <UseCasesSection />
        <TrustSection />
      </main>
      <NewHomeFooter />
    </div>
  );
}
