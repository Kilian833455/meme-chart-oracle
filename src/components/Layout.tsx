
import React from "react";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full gradient-bg">
      <div className="container px-4 py-8 max-w-lg mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-oracle-600 tracking-tight">
            Meme Chart Oracle
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload a meme coin chart for prediction
          </p>
        </header>
        <main>{children}</main>
        <footer className="text-center text-sm text-muted-foreground mt-12 pb-6">
          <p>© 2025 Meme Chart Oracle • Not financial advice</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
