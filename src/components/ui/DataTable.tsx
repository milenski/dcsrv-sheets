import { motion } from "framer-motion";

interface DataTableProps {
  type?: "invoice" | "bank" | "contract";
  className?: string;
}

export function DataTable({ type = "invoice", className = "" }: DataTableProps) {
  const tables = {
    invoice: {
      headers: ["Field", "Extracted Value"],
      rows: [
        ["Invoice #", "INV-2024-0847"],
        ["Date", "2024-01-15"],
        ["Vendor", "Acme Corp"],
        ["Subtotal", "$1,044.00"],
        ["Tax", "$83.52"],
        ["Total", "$1,127.52"],
      ],
    },
    bank: {
      headers: ["Date", "Description", "Amount", "Balance"],
      rows: [
        ["2024-01-03", "Payroll Deposit", "+$4,250.00", "$6,250.00"],
        ["2024-01-05", "AWS Services", "-$147.32", "$6,102.68"],
        ["2024-01-08", "Coffee Shop", "-$12.50", "$6,090.18"],
        ["2024-01-12", "Client Payment", "+$2,500.00", "$8,590.18"],
      ],
    },
    contract: {
      headers: ["Field", "Value"],
      rows: [
        ["Party A", "TechFlow Inc."],
        ["Party B", "DataStream LLC"],
        ["Start Date", "2024-02-01"],
        ["End Date", "2026-01-31"],
        ["Term Length", "24 months"],
        ["Key Terms", "SaaS License, Priority Support, 99.9% SLA"],
      ],
    },
  };

  const table = tables[type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`rounded-lg border border-border bg-card shadow-card overflow-hidden ${className}`}
    >
      {/* Excel-style header */}
      <div className="h-8 bg-primary/10 border-b border-border flex items-center px-3 gap-2">
        <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.17 3H7.83A2.83 2.83 0 0 0 5 5.83v12.34A2.83 2.83 0 0 0 7.83 21h13.34A2.83 2.83 0 0 0 24 18.17V5.83A2.83 2.83 0 0 0 21.17 3zM9 18V9h2v9H9zm4 0V9h2v9h-2zm4 0V9h2v9h-2z" />
        </svg>
        <span className="text-xs font-medium text-foreground">extracted_data.xlsx</span>
      </div>

      {/* Table content */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              {table.headers.map((header, i) => (
                <th
                  key={i}
                  className="px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-3 py-2 whitespace-nowrap ${
                      j === 0 ? "font-medium text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
