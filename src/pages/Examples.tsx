import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DocumentPreview } from "@/components/ui/DocumentPreview";
import { DataTable } from "@/components/ui/DataTable";
import { ArrowRight, FileText } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const examples = [
  {
    type: "invoice" as const,
    title: "Invoice Processing",
    subtitle: "Extract line items, totals, and vendor information",
    description:
      "Automatically extract invoice numbers, dates, vendor details, line items, tax amounts, and totals from any invoice format. Works with printed and handwritten invoices.",
  },
  {
    type: "bank" as const,
    title: "Bank Statement Analysis",
    subtitle: "Parse transaction rows with dates, descriptions, and amounts",
    description:
      "Extract transaction history from bank statements including dates, descriptions, amounts, and running balances. Perfect for reconciliation and financial analysis.",
  },
  {
    type: "contract" as const,
    title: "Contract Summarization",
    subtitle: "Pull key terms, parties, and dates from agreements",
    description:
      "Extract party names, effective dates, term lengths, and key contractual terms from service agreements, NDAs, and other legal documents.",
  },
];

export default function Examples() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-subtle">
        <div className="container text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl mx-auto"
          >
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              See DocServant in action
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground">
              Explore real examples of document extraction across different use cases
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-24"
          >
            {examples.map((example, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start"
              >
                {/* Content */}
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{example.title}</h2>
                    </div>
                  </div>
                  <p className="text-lg text-primary font-medium mb-3">{example.subtitle}</p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {example.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium text-foreground min-w-24">Before</span>
                      <span className="text-muted-foreground">
                        Unstructured document (PDF, Word, or scan)
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium text-foreground min-w-24">After</span>
                      <span className="text-muted-foreground">
                        Clean, structured spreadsheet data
                      </span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button asChild className="gap-2">
                      <Link to="/signup">
                        Try this with your document
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                <div className={`space-y-4 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                      Original Document
                    </p>
                    <DocumentPreview type={example.type} />
                  </div>
                  <div className="flex items-center justify-center py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-4 h-4 rotate-90 lg:rotate-0" />
                      <span className="font-medium text-primary">AI Extraction</span>
                      <ArrowRight className="w-4 h-4 rotate-90 lg:rotate-0" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                      Extracted Data
                    </p>
                    <DataTable type={example.type} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* More Use Cases */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl font-bold text-foreground mb-4"
            >
              Not seeing your use case?
            </motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground mb-8">
              DocServant works with any structured document. Custom schemas let you extract
              exactly the data you need, no matter the format.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="gap-2">
                <Link to="/signup">
                  Try it free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/help">Contact support</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
