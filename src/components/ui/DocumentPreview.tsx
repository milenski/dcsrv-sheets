import { motion } from "framer-motion";

interface DocumentPreviewProps {
  type?: "invoice" | "bank" | "contract";
  className?: string;
}

export function DocumentPreview({ type = "invoice", className = "" }: DocumentPreviewProps) {
  const content = {
    invoice: {
      title: "INVOICE",
      lines: [
        "Invoice #: INV-2024-0847",
        "Date: January 15, 2024",
        "Vendor: Acme Corp",
        "",
        "Description        Qty    Price",
        "Widget Pro          5   $199.00",
        "Service Fee         1    $49.00",
        "",
        "Subtotal:        $1,044.00",
        "Tax (8%):           $83.52",
        "Total:          $1,127.52",
      ],
    },
    bank: {
      title: "BANK STATEMENT",
      lines: [
        "Account: ****4892",
        "Period: Jan 1-31, 2024",
        "",
        "Date       Description      Amount",
        "01/03   Payroll Deposit   +$4,250.00",
        "01/05   AWS Services       -$147.32",
        "01/08   Coffee Shop         -$12.50",
        "01/12   Client Payment   +$2,500.00",
        "",
        "Ending Balance: $8,590.18",
      ],
    },
    contract: {
      title: "SERVICE AGREEMENT",
      lines: [
        "Agreement Date: Jan 1, 2024",
        "",
        "Party A: TechFlow Inc.",
        "Party B: DataStream LLC",
        "",
        "Term: 24 months",
        "Start: February 1, 2024",
        "End: January 31, 2026",
        "",
        "Key Terms: SaaS License,",
        "Priority Support, 99.9% SLA",
      ],
    },
  };

  const doc = content[type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`relative bg-card rounded-lg border border-border shadow-card overflow-hidden ${className}`}
    >
      {/* Document header bar */}
      <div className="h-8 bg-muted/50 border-b border-border flex items-center px-3 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
        <span className="ml-2 text-xs text-muted-foreground">document.pdf</span>
      </div>

      {/* Document content */}
      <div className="p-4 font-mono text-xs text-muted-foreground leading-relaxed">
        <div className="text-foreground font-semibold mb-2">{doc.title}</div>
        {doc.lines.map((line, i) => (
          <div key={i} className={line === "" ? "h-2" : ""}>
            {line}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
