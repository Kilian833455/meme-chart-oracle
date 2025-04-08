
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AdBanner from "@/components/AdBanner";

interface LayoutProps {
  children: React.ReactNode;
  username?: string;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, username, onLogout }) => {
  return (
    <div className="min-h-screen w-full gradient-bg">
      <div className="container px-4 py-8 max-w-lg mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/lovable-uploads/1d9a95a2-42a4-4884-8297-1968d1893ad6.png" alt="MEMEPUS AI" />
              <AvatarFallback className="bg-oracle-300 text-white text-2xl">M</AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-3xl font-bold text-oracle-600 tracking-tight flex items-center justify-center gap-2">
            MEMEPUS AI
          </h1>
          <p className="text-muted-foreground mt-2">
            Meme Coin Chart Analysis Powered by AI
          </p>
          
          {username && (
            <div className="mt-2 flex items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">
                Logged in as <span className="font-medium text-oracle-500">{username}</span>
              </p>
              {onLogout && (
                <button 
                  onClick={onLogout}
                  className="text-xs text-muted-foreground hover:text-oracle-500 underline"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </header>
        
        <main>{children}</main>
        
        <AdBanner />
        
        <footer className="text-center text-sm text-muted-foreground mt-6 pb-6">
          <p>© 2025 MEMEPUS AI • Not financial advice</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
