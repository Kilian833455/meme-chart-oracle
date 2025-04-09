
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ChartLine, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { chartPatterns } from "@/utils/chartAnalysisService";
import { AnalysisResult as AnalysisResultType } from "@/types/AnalysisResult";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface AnalysisResultProps {
  result: AnalysisResultType;
  onSave: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onSave }) => {
  const getTrendIcon = (trend: "up" | "down" | "sideways") => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-6 w-6 text-green-500" />;
      case "down":
        return <ArrowDown className="h-6 w-6 text-red-500" />;
      default:
        return <ChartLine className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getScenarioDescription = (scenarioName: string) => {
    const scenario = chartPatterns.find(s => s.name === scenarioName);
    return scenario?.description || "";
  };

  const getTrendColor = (trend: "up" | "down" | "sideways") => {
    switch (trend) {
      case "up": return "bg-gradient-to-r from-green-500/20 to-emerald-400/10 border-l-4 border-green-500";
      case "down": return "bg-gradient-to-r from-red-500/20 to-rose-400/10 border-l-4 border-red-500";
      default: return "bg-gradient-to-r from-yellow-500/20 to-amber-400/10 border-l-4 border-yellow-500";
    }
  };

  return (
    <Card className="border border-oracle-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-oracle-300/20 to-oracle-400/10">
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            className="relative"
            animate={{ 
              rotate: [0, -5, 0, 5, 0],
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <Avatar className="w-10 h-10 ring-2 ring-oracle-300 ring-offset-1">
              <AvatarImage src="/lovable-uploads/1d9a95a2-42a4-4884-8297-1968d1893ad6.png" alt="MEMEPUS" />
              <AvatarFallback className="bg-oracle-300 text-white text-xs">M</AvatarFallback>
            </Avatar>
            <motion.div 
              className="absolute -top-1 -right-1"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </motion.div>
          </motion.div>
          <CardTitle className="flex items-center gap-2">
            <span className="text-oracle-600 font-bold">MEMEPUS</span>
            <span className="text-oracle-400">•</span>
            <span className="flex items-center gap-1">{getTrendIcon(result.trend)} {result.scenario}</span>
          </CardTitle>
        </div>
        <CardDescription>
          {getScenarioDescription(result.scenario)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Confidence:</span>
          <div className="flex items-center">
            <div className="h-3 w-24 bg-gray-200 rounded-full overflow-hidden mr-2">
              <div
                className={`h-full ${result.trend === "up" ? "bg-green-500" : result.trend === "down" ? "bg-red-500" : "bg-oracle-400"}`}
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>
            <span className="font-medium">{result.confidence}%</span>
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="explanation" className="border-b-0">
            <AccordionTrigger className="py-2 px-3 text-sm font-medium text-white rounded-md bg-oracle-500 hover:bg-oracle-600 transition-colors">
              MEMEPUS Analysis
            </AccordionTrigger>
            <AccordionContent>
              <div className={`mt-3 p-3 rounded-md ${getTrendColor(result.trend)}`}>
                <p className="text-sm">{result.explanation}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} className="w-full bg-oracle-400 hover:bg-oracle-500">
          Save Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisResult;
