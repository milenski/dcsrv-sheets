import { motion } from "framer-motion";
import { Shield, Lock, Server, Eye, Trash2, FileCheck } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const securityFeatures = [
  {
    icon: Lock,
    title: "Encryption in Transit & at Rest",
    description:
      "All data is encrypted using TLS 1.3 during transmission and AES-256 encryption at rest. Your documents are protected throughout the entire processing pipeline.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description:
      "Our infrastructure is hosted on enterprise-grade cloud providers with SOC 2 Type II certification. We implement network isolation, firewalls, and intrusion detection systems.",
  },
  {
    icon: Eye,
    title: "Access Controls",
    description:
      "Strict access controls ensure only authorized personnel can access infrastructure. All access is logged and monitored. We follow the principle of least privilege.",
  },
  {
    icon: Trash2,
    title: "Data Retention & Deletion",
    description:
      "Documents are automatically deleted after processing (configurable 1-90 days). You can request immediate deletion at any time. Deleted data is permanently removed from all systems.",
  },
  {
    icon: FileCheck,
    title: "No Training on Your Data",
    description:
      "By default, we do not use your documents to train our AI models. This is opt-in only. Your business data remains confidential and is never shared with third parties.",
  },
  {
    icon: Shield,
    title: "GDPR Compliance",
    description:
      "We comply with GDPR requirements including data minimization, purpose limitation, and data subject rights. EU data can be processed within the EU upon request.",
  },
];

export default function Security() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-16 md:py-20 bg-gradient-subtle">
        <div className="container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Enterprise-grade security
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Your data security is our priority
            </h1>
            <p className="text-lg text-muted-foreground">
              We've built DocServant with security at its core. Here's how we protect your
              documents and data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {securityFeatures.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-card border border-border rounded-xl p-6 shadow-card"
              >
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Questions about security?
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We understand that security is critical when processing sensitive business
                documents. If you have specific security requirements or questions, our team is
                happy to discuss our security practices in detail.
              </p>
              <p className="leading-relaxed">
                For enterprise customers, we offer additional security features including SSO
                integration, custom data retention policies, dedicated infrastructure, and
                security questionnaire completion.
              </p>
              <p className="leading-relaxed">
                Contact us at{" "}
                <a
                  href="mailto:security@docservant.com"
                  className="text-primary hover:underline"
                >
                  security@docservant.com
                </a>{" "}
                for security inquiries or to request our SOC 2 report.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
