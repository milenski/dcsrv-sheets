import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Lightbulb,
  AlertCircle,
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const sections = [
  {
    icon: Upload,
    title: "Getting Started",
    content: [
      {
        subtitle: "Upload your documents",
        text: "Drag and drop your files into the upload area, or click to browse. You can upload PDFs, Word documents (.doc, .docx), and images (JPEG, PNG, TIFF).",
      },
      {
        subtitle: "Choose or create a schema",
        text: "Select from pre-built schemas like Invoice, Bank Statement, or Contract. Or create a custom schema by specifying the fields you want to extract.",
      },
      {
        subtitle: "Review and export",
        text: "Review the extracted data in the preview. Make any corrections if needed, then export to Excel (.xlsx) or CSV format.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Supported Formats",
    content: [
      {
        subtitle: "PDF Documents",
        text: "Both native and scanned PDFs are supported. Native PDFs with selectable text provide the best results. Scanned PDFs work well with clear, high-resolution scans.",
      },
      {
        subtitle: "Word Documents",
        text: "Microsoft Word files (.doc and .docx) are fully supported. Tables, lists, and structured content are automatically detected.",
      },
      {
        subtitle: "Images",
        text: "JPEG, PNG, and TIFF images are supported. For best results, ensure images are at least 300 DPI with clear, readable text.",
      },
    ],
  },
  {
    icon: Lightbulb,
    title: "Tips for Best Results",
    content: [
      {
        subtitle: "Use high-quality scans",
        text: "Scan documents at 300 DPI or higher. Ensure text is sharp and not blurry. Avoid shadows and uneven lighting.",
      },
      {
        subtitle: "Keep documents aligned",
        text: "Straighten documents before scanning. Our AI can handle slight rotations, but properly aligned documents give better results.",
      },
      {
        subtitle: "Use consistent formatting",
        text: "When processing multiple similar documents, consistent formatting helps the AI learn patterns and improve accuracy over time.",
      },
    ],
  },
  {
    icon: AlertCircle,
    title: "Troubleshooting",
    content: [
      {
        subtitle: "Empty or missing fields",
        text: "If fields are empty, the AI may not have found matching content. Try adjusting your schema field names to match the document's terminology.",
      },
      {
        subtitle: "Rotated or skewed pages",
        text: "Our AI automatically corrects rotation, but heavily skewed documents may need manual straightening before upload.",
      },
      {
        subtitle: "Low accuracy on handwriting",
        text: "Handwritten text is more challenging. Results improve with neat, printed handwriting. Cursive may have lower accuracy.",
      },
    ],
  },
];

export default function Help() {
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
              Help Center
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground">
              Everything you need to get the most out of DocServant
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Help Sections */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-16"
            >
              {sections.map((section, i) => (
                <motion.div key={i} variants={fadeIn}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                  </div>

                  <div className="space-y-6 pl-0 md:pl-13">
                    {section.content.map((item, j) => (
                      <div
                        key={j}
                        className="bg-card border border-border rounded-lg p-5 shadow-card"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              {item.subtitle}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Still need help?</h2>
            <p className="text-muted-foreground mb-8">
              Our support team is here to help. Send us an email and we'll get back to you
              within 24 hours.
            </p>
            <Button size="lg" asChild className="gap-2">
              <a href="mailto:support@docservant.com">
                Contact support
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">support@docservant.com</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
