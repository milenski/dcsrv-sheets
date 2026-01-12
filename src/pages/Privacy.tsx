import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Privacy() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: January 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl prose prose-neutral"
          >
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Overview</h2>
                <p className="leading-relaxed">
                  DocServant for Spreadsheets ("DocServant", "we", "us", or "our") is committed
                  to protecting your privacy. This Privacy Policy explains how we collect, use,
                  and safeguard your information when you use our document extraction service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Information We Collect
                </h2>
                <p className="leading-relaxed mb-4">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (email address, name)</li>
                  <li>Documents you upload for processing</li>
                  <li>Usage data (features used, extraction requests)</li>
                  <li>Technical data (browser type, device information)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and maintain our document extraction service</li>
                  <li>To process your documents and generate structured data</li>
                  <li>To improve our AI models and extraction accuracy</li>
                  <li>To communicate with you about your account and updates</li>
                  <li>To prevent fraud and ensure security</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Document Processing
                </h2>
                <p className="leading-relaxed">
                  Documents you upload are processed securely using encryption in transit and at
                  rest. By default, we do not use your documents to train our AI models. You can
                  opt-in to help improve our service by enabling this in your account settings.
                  Processed documents are automatically deleted after 30 days unless you choose
                  a different retention period.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Data Sharing</h2>
                <p className="leading-relaxed">
                  We do not sell your personal information. We may share data with:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Service providers who assist in operating our platform</li>
                  <li>Legal authorities when required by law</li>
                  <li>Business partners with your explicit consent</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Your Rights (GDPR)
                </h2>
                <p className="leading-relaxed mb-4">
                  If you're in the European Economic Area, you have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to data processing</li>
                  <li>Request data portability</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
                <p className="leading-relaxed">
                  We use essential cookies to maintain your session and remember your
                  preferences. We also use optional analytics cookies to understand how you use
                  our service. You can manage your cookie preferences through your browser
                  settings or our cookie consent banner.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
                <p className="leading-relaxed">
                  If you have questions about this Privacy Policy, please contact us at{" "}
                  <a
                    href="mailto:privacy@docservant.com"
                    className="text-primary hover:underline"
                  >
                    privacy@docservant.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
