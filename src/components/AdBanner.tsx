
import React from "react";

const AdBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-oracle-100/30 to-oracle-300/30 rounded-md p-4 mt-8 border border-oracle-200 shadow-sm">
      <div className="flex items-center justify-center h-24">
        <p className="text-muted-foreground text-center">
          Advertisement Space - Your Ad Could Be Here!<br />
          <span className="text-xs">contact@memepusai.com</span>
        </p>
      </div>
    </div>
  );
};

export default AdBanner;
