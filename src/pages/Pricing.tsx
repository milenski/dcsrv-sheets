import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, ArrowRight, Zap } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out DocServant",
    pages: "50 pages/month",
    features: [
      "Basic document extraction",
      "Auto-detect schemas",
      "Export to CSV & XLSX",
      "Single document upload",
      "Community support",
    ],
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professionals and small teams",
    pages: "500 pages/month",
    features: [
      "Everything in Free",
      "Batch processing (up to 50 docs)",
      "Custom schema templates",
      "Priority processing queue",
      "Saved extraction templates",
      "Email support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$99",
    period: "per month",
    description: "For teams with higher volume needs",
    pages: "2,500 pages/month",
    features: [
      "Everything in Pro",
      "Unlimited batch size",
      "Team seats (up to 5)",
      "Audit log",
      "API access",
      "Invoice billing",
      "Priority support",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "What counts as a page?",
    answer:
      "A page is counted as one side of a document. A 10-page PDF counts as 10 pages. For images, each image counts as one page. Multi-page documents are counted by their total page count.",
  },
  {
    question: "What file types do you support?",
    answer:
      "We support PDF documents (including scanned PDFs), Microsoft Word files (.doc, .docx), and common image formats (JPEG, PNG, TIFF). We're constantly adding support for more formats.",
  },
  {
    question: "Do you support scanned PDFs?",
    answer:
      "Yes! Our AI-powered extraction works with scanned documents and images. For best results, ensure your scans are at least 300 DPI and text is clearly readable.",
  },
  {
    question: "Can I export to Google Sheets?",
    answer:
      "Google Sheets export is coming soon! Currently, you can export to Excel (.xlsx) or CSV format, which can be easily imported into Google Sheets.",
  },
  {
    question: "Can I process multiple documents at once?",
    answer:
      "Yes, batch processing is available on Pro and Business plans. Pro supports up to 50 documents per batch, while Business has no batch size limits.",
  },
  {
    question: "What happens if I exceed my monthly page limit?",
    answer:
      "You'll receive a notification when approaching your limit. You can upgrade your plan anytime, or purchase additional page packs. We never automatically charge for overages.",
  },
];

export default function Pricing() {
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
              Simple, transparent pricing
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground">
              Start free, upgrade as you grow. No hidden fees.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className={`relative rounded-2xl border ${
                  plan.highlighted
                    ? "border-primary shadow-glow"
                    : "border-border shadow-card"
                } bg-card p-6 md:p-8 flex flex-col`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      <Zap className="w-3 h-3" />
                      Most popular
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm font-medium text-primary mt-2">{plan.pages}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full gap-2"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link to={plan.name === "Business" ? "/help" : "/signup"}>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Frequently asked questions
              </h2>
              <p className="text-muted-foreground">
                Can't find what you're looking for?{" "}
                <Link to="/help" className="text-primary hover:underline">
                  Contact support
                </Link>
              </p>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border border-border rounded-lg bg-card px-6 shadow-card"
                  >
                    <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Try DocServant free — no credit card required.
            </p>
            <Button size="lg" asChild className="gap-2">
              <Link to="/signup">
                Try it free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
