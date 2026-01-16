import { ReactNode } from "react";
import { Header } from "./Header";
import { SharedFooter } from "@/components/shared/SharedFooter";
import { CookieBanner } from "@/components/CookieBanner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <SharedFooter />
      <CookieBanner />
    </div>
  );
}
