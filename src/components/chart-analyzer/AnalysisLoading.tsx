
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AnalysisLoadingProps {
  thinkingDots: string;
  modelStatus: string;
}

const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ thinkingDots, modelStatus }) => {
  return (
    <Card className="border border-oracle-200 shadow-lg animate-pulse">
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-24 h-24">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/lovable-uploads/1d9a95a2-42a4-4884-8297-1968d1893ad6.png" alt="MEMEPUS" />
              <AvatarFallback className="bg-oracle-300 text-white text-3xl">M</AvatarFallback>
            </Avatar>
            <motion.div
              className="absolute top-0 right-0"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <Sparkles className="h-8 w-8 text-yellow-400" />
            </motion.div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium flex items-center justify-center gap-2">
              <BrainCircuit className="h-5 w-5 text-oracle-400" />
              MEMEPUS is thinking{thinkingDots}
            </h3>
            <p className="text-muted-foreground text-sm">
              {modelStatus}
            </p>
          </div>
          
          <div className="w-full max-w-xs mx-auto">
            <div className="h-2 bg-oracle-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-oracle-400"
                animate={{
                  width: ["0%", "100%", "0%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisLoading;
