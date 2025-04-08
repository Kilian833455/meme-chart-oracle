
import React from "react";
import { Button } from "@/components/ui/button";

interface AnalysisButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const AnalysisButton: React.FC<AnalysisButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-6 text-lg bg-oracle-400 hover:bg-oracle-500 transition-all"
    >
      Analyze Chart with MEMEPUS AI
    </Button>
  );
};

export default AnalysisButton;
