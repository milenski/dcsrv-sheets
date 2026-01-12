import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DocumentPreview } from "@/components/ui/DocumentPreview";
import { DataTable } from "@/components/ui/DataTable";
import {
  Upload,
  FileSearch,
  Download,
  FileSpreadsheet,
  Building2,
  Calculator,
  Briefcase,
  Users,
  Shield,
  Zap,
  Layers,
  ArrowRight,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(168_76%_32%/0.08),transparent_50%)]" />
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeIn} className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                <Zap className="w-4 h-4" />
                AI-powered document extraction
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Turn documents into{" "}
                <span className="text-gradient">structured spreadsheets</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Upload PDFs, Word files, or scans. Get clean Excel-ready data in seconds.
                No manual data entry. No more copy-paste.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="gap-2">
                  <Link to="/signup">
                    Try it free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/examples">See examples</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="relative grid grid-cols-2 gap-4">
                <DocumentPreview type="invoice" className="transform -rotate-2" />
                <DataTable type="invoice" className="transform rotate-1 translate-y-8" />
              </div>
              {/* Connection arrow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary shadow-glow flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-primary-foreground" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
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
              How it works
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform any document into structured data
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Upload,
                step: "1",
                title: "Upload",
                description:
                  "Drag and drop your PDFs, Word documents, or scanned images. We support batch uploads too.",
              },
              {
                icon: FileSearch,
                step: "2",
                title: "Extract",
                description:
                  "Our AI analyzes your document and extracts structured data based on your schema or auto-detection.",
              },
              {
                icon: Download,
                step: "3",
                title: "Export",
                description:
                  "Download your clean, organized data as Excel (.xlsx) or CSV. Ready for your workflow.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="relative group"
              >
                <div className="absolute -inset-px bg-gradient-to-b from-primary/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-card border border-border rounded-xl p-6 h-full shadow-card hover:shadow-elevated transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-xs font-bold text-primary mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Example Schemas */}
      <section className="py-20 md:py-28 bg-muted/30">
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

      {/* Use Cases */}
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
              Built for your industry
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Teams across industries use DocServant to automate document processing
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Calculator,
                title: "Finance",
                description: "Process invoices, receipts, and financial statements at scale.",
              },
              {
                icon: Building2,
                title: "Accounting",
                description: "Extract data from bank statements, tax forms, and ledgers.",
              },
              {
                icon: Briefcase,
                title: "Operations",
                description: "Digitize purchase orders, shipping docs, and inventory records.",
              },
              {
                icon: Users,
                title: "Consulting",
                description: "Analyze contracts, reports, and client documents efficiently.",
              },
            ].map((useCase, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-card border border-border rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <useCase.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why It's Different */}
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
                More than just OCR
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Traditional OCR just reads text. DocServant understands your documents and
                extracts meaningful, structured data ready for your spreadsheets.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Layers, text: "Structured extraction with custom schema mapping" },
                  { icon: Zap, text: "Batch processing for multiple documents" },
                  { icon: FileSpreadsheet, text: "Excel & CSV export in one click" },
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
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

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 md:p-12 text-center shadow-glow"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(0_0%_100%/0.1),transparent_50%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to automate your document workflow?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Start extracting structured data from your documents in minutes. No credit card required.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary" asChild className="gap-2">
                  <Link to="/signup">
                    Try it free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  asChild
                  className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link to="/examples">See examples</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
