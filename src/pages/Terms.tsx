import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Terms() {
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
              Terms of Service
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
            className="max-w-3xl"
          >
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Acceptance of Terms
                </h2>
                <p className="leading-relaxed">
                  By accessing or using DocServant for Spreadsheets ("the Service"), you agree
                  to be bound by these Terms of Service. If you do not agree to these terms,
                  please do not use the Service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Description of Service
                </h2>
                <p className="leading-relaxed">
                  DocServant provides an AI-powered document extraction service that converts
                  unstructured documents into structured spreadsheet data. The Service includes
                  document upload, AI-based data extraction, and export functionality.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">User Accounts</h2>
                <p className="leading-relaxed">
                  To use certain features of the Service, you must create an account. You are
                  responsible for maintaining the confidentiality of your account credentials
                  and for all activities that occur under your account. You agree to notify us
                  immediately of any unauthorized use of your account.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Acceptable Use</h2>
                <p className="leading-relaxed mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Upload documents containing illegal content</li>
                  <li>Attempt to circumvent usage limits or security measures</li>
                  <li>Use the Service to process documents you don't have rights to</li>
                  <li>Reverse engineer or attempt to extract our AI models</li>
                  <li>Resell or redistribute the Service without authorization</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Intellectual Property
                </h2>
                <p className="leading-relaxed">
                  You retain all rights to documents you upload and data you extract. DocServant
                  retains all rights to the Service, including our AI models, software, and
                  documentation. By using the Service, you grant us a limited license to process
                  your documents for the purpose of providing the Service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Payment and Billing
                </h2>
                <p className="leading-relaxed">
                  Paid plans are billed monthly or annually as selected. Prices are subject to
                  change with 30 days notice. Refunds are available within 14 days of initial
                  purchase if you haven't used more than 10% of your page allocation.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Limitation of Liability
                </h2>
                <p className="leading-relaxed">
                  The Service is provided "as is" without warranties of any kind. We are not
                  liable for any indirect, incidental, or consequential damages arising from
                  your use of the Service. Our total liability is limited to the amount you paid
                  for the Service in the 12 months preceding the claim.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Accuracy Disclaimer
                </h2>
                <p className="leading-relaxed">
                  While we strive for high accuracy in document extraction, AI-based processing
                  is not perfect. You are responsible for reviewing extracted data before use.
                  DocServant is not liable for errors in extracted data or decisions made based
                  on that data.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Termination</h2>
                <p className="leading-relaxed">
                  We may suspend or terminate your access to the Service at any time for
                  violation of these terms or for any other reason with notice. You may cancel
                  your account at any time through your account settings.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Changes to Terms</h2>
                <p className="leading-relaxed">
                  We may update these Terms of Service from time to time. We will notify you of
                  material changes via email or through the Service. Continued use after changes
                  constitutes acceptance of the new terms.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
                <p className="leading-relaxed">
                  For questions about these Terms, please contact us at{" "}
                  <a
                    href="mailto:legal@docservant.com"
                    className="text-primary hover:underline"
                  >
                    legal@docservant.com
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
