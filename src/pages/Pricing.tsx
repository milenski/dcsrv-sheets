import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, ArrowRight, Zap, Info } from "lucide-react";
import { PLANS_ARRAY, TOKEN_DISCLAIMER, formatTokens } from "@/lib/plans";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const faqs = [
  {
    question: "What are tokens?",
    answer:
      "Tokens are the unit we use to measure document processing. Token usage varies based on document size, layout, and complexity. A typical one-page invoice uses approximately 1,000-2,000 tokens.",
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
      "Yes, batch processing is available on Light, Standard, and Pro plans. Upload multiple documents at once and process them with a single click.",
  },
  {
    question: "What happens if I exceed my monthly token limit?",
    answer:
      "On the Free plan, you'll be blocked from processing new documents until the next billing cycle. On paid plans (Light, Standard, Pro), you can continue processing—additional usage is billed automatically at your plan's overage rate.",
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
          {/* Token disclaimer */}
          <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50 max-w-3xl mx-auto mb-10">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">{TOKEN_DISCLAIMER}</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {PLANS_ARRAY.map((plan, i) => {
              const isPopular = plan.id === "standard";
              return (
                <motion.div
                  key={plan.id}
                  variants={fadeIn}
                  className={`relative rounded-2xl border ${
                    isPopular
                      ? "border-primary shadow-glow"
                      : "border-border shadow-card"
                  } bg-card p-6 flex flex-col`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        <Zap className="w-3 h-3" />
                        Most popular
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{plan.name}</h3>
                    <p className="text-sm text-primary font-medium">
                      {formatTokens(plan.tokens)} tokens/month
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">€{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {plan.overagePrice ? (
                      <p className="text-sm text-muted-foreground mt-1">
                        €{plan.overagePrice.toFixed(2)} per additional 50k tokens
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        Hard limit (blocked when exceeded)
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full gap-2"
                    variant={isPopular ? "default" : "outline"}
                    asChild
                  >
                    <Link to={plan.id === "pro" ? "/help" : "/signup"}>
                      {plan.id === "free" ? "Get started free" : plan.id === "pro" ? "Contact sales" : "Start free trial"}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
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
