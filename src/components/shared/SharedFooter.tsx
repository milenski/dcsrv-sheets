import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const footerLinks = {
  product: [
    { href: "/examples", label: "Examples" },
    { href: "/help", label: "Help Center" },
    { href: "/pricing", label: "Pricing" },
  ],
  developers: [
    { href: "/developers/docs", label: "API Documentation" },
  ],
  legal: [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/security", label: "Security" },
  ],
};

interface SharedFooterProps {
  compact?: boolean;
}

export function SharedFooter({ compact = false }: SharedFooterProps) {
  if (compact) {
    return (
      <footer className="border-t border-border bg-muted/30 py-4">
        <div className="container flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/examples" className="hover:text-foreground transition-colors">Examples</Link>
          <Link to="/developers/docs" className="hover:text-foreground transition-colors">API Docs</Link>
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/help" className="hover:text-foreground transition-colors">Help</Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <Link to="/security" className="hover:text-foreground transition-colors">Security</Link>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo to="/" />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Turn documents into structured data.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Developers</h3>
            <ul className="space-y-3">
              {footerLinks.developers.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DocServant. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by the same AI engine as{" "}
            <a
              href="https://docservant.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              DocServant for Salesforce
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}